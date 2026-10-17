import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Support JSON payload up to 50MB for uploaded images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // 1. Veo Video Generation endpoint (Model: veo-3.1-fast-generate-preview)
  app.post('/api/generate-video', async (req, res) => {
    try {
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY belum dikonfigurasi di environment server.',
        });
      }

      const { image, prompt, aspectRatio = '16:9' } = req.body;

      if (!image) {
        return res.status(400).json({ error: 'Gambar diperlukan untuk animasi video.' });
      }

      // Aspect ratio must be '16:9' or '9:16'
      const validAspectRatio = aspectRatio === '9:16' ? '9:16' : '16:9';

      let cleanBase64 = image;
      let mimeType = 'image/png';

      if (typeof image === 'string' && image.includes(';base64,')) {
        const parts = image.split(';base64,');
        mimeType = parts[0].replace('data:', '') || 'image/png';
        cleanBase64 = parts[1];
      }

      const videoPrompt =
        (prompt && prompt.trim()) ||
        'Cinematic subtle movement of oceanic currents and dramatic atmospheric clouds moving across the sky, high quality photorealistic';

      console.log(`[Veo] Starting generation with model: veo-3.1-fast-generate-preview, aspect: ${validAspectRatio}`);

      const operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: videoPrompt,
        image: {
          imageBytes: cleanBase64,
          mimeType,
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: validAspectRatio,
        },
      });

      console.log(`[Veo] Operation started: ${operation.name}`);
      return res.json({
        operationName: operation.name,
        prompt: videoPrompt,
        aspectRatio: validAspectRatio,
      });
    } catch (err: any) {
      console.error('[Veo] Error in /api/generate-video:', err);
      return res.status(500).json({
        error: err.message || 'Gagal memulai pembuatan video dengan Veo.',
      });
    }
  });

  // 2. Veo Status Polling endpoint
  app.post('/api/video-status', async (req, res) => {
    try {
      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ error: 'operationName diperlukan' });
      }

      const op = new GenerateVideosOperation();
      op.name = operationName;
      const updated = await ai.operations.getVideosOperation({ operation: op });

      if (updated.error) {
        return res.json({
          done: true,
          error: updated.error.message || 'Pembuatan video gagal.',
        });
      }

      const hasVideo = Boolean(
        updated.response?.generatedVideos?.[0]?.video?.uri
      );

      return res.json({
        done: Boolean(updated.done),
        hasVideo,
      });
    } catch (err: any) {
      console.error('[Veo] Error in /api/video-status:', err);
      return res.status(500).json({
        error: err.message || 'Gagal mengecek status operasi video.',
      });
    }
  });

  // 3. Veo Video Download endpoint
  app.post('/api/video-download', async (req, res) => {
    try {
      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ error: 'operationName diperlukan' });
      }

      const op = new GenerateVideosOperation();
      op.name = operationName;
      const updated = await ai.operations.getVideosOperation({ operation: op });

      const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
      if (!uri) {
        return res.status(404).json({ error: 'Video URI tidak ditemukan pada operasi ini.' });
      }

      console.log(`[Veo] Downloading video from upstream: ${uri}`);
      const videoRes = await fetch(uri, {
        headers: {
          'x-goog-api-key': apiKey,
        },
      });

      if (!videoRes.ok) {
        return res.status(videoRes.status).json({
          error: `Gagal mengambil stream video upstream: status ${videoRes.status}`,
        });
      }

      res.setHeader('Content-Type', 'video/mp4');
      const arrayBuffer = await videoRes.arrayBuffer();
      return res.send(Buffer.from(arrayBuffer));
    } catch (err: any) {
      console.error('[Veo] Error in /api/video-download:', err);
      return res.status(500).json({
        error: err.message || 'Gagal mengunduh file video.',
      });
    }
  });

  // 4. Gemini Climate Knowledge endpoint
  app.post('/api/ask-climate', async (req, res) => {
    try {
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ error: 'Pertanyaan diperlukan.' });
      }

      const prompt = `Anda adalah pakar oseanografi dan klimatologi terkemuka dunia yang ahli dalam fenomena ENSO (El Niño-Southern Oscillation), Sirkulasi Walker, dan dampaknya terhadap Indonesia serta Pasifik.
Pertanyaan pengguna: "${question}"

Berikan penjelasan yang mendalam, akurat secara ilmiah, terstruktur, ramah, dan mudah dipahami dalam Bahasa Indonesia. Sorot mekanisme fisik seperti:
1. Angin Pasat (Trade Winds) dan gaya coriolis/gesekan angin.
2. Kolam air hangat Pasifik Barat (Western Pacific Warm Pool) dan gelombang Kelvin bawah laut.
3. Termoklin dan proses Upwelling di pesisir barat Amerika Selatan (Peru/Ekuador).
4. Sirkulasi Walker, tekanan atmosfer (Tahiti vs Darwin / SOI), serta konveksi awan hujan kumulonimbus.
Gunakan format markdown dengan poin-poin yang mudah dibaca.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({ answer: response.text });
    } catch (err: any) {
      console.error('[Gemini] Error in /api/ask-climate:', err);
      return res.status(500).json({
        error: err.message || 'Gagal memproses pertanyaan klimatologi.',
      });
    }
  });

  // 5. Mount Vite middlewares in development or serve static build in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Server berjalan di http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal error saat inisialisasi server:', err);
  process.exit(1);
});
