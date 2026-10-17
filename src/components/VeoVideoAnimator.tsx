import React, { useState, useRef, useEffect } from 'react';
import { PRESET_IMAGES } from '../data/climateData';
import { GeneratedVideoItem } from '../types/climate';
import {
  Upload,
  Film,
  Sparkles,
  Download,
  RefreshCw,
  Sliders,
  Play,
  Pause,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Clock,
  Ratio,
  Maximize2,
  Trash2
} from 'lucide-react';

export const VeoVideoAnimator: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [prompt, setPrompt] = useState<string>(
    'Cinematic subtle movement of oceanic currents and dramatic atmospheric clouds moving across the sky, high quality photorealistic'
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedVideoItem[]>([]);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Rotating climatology tips while generating
  const climateTips = [
    'Model Veo menganalisis gradien warna dan tekstur untuk menciptakan simulasi aliran fluida laut yang realistis.',
    'Gelombang Kelvin bawah laut membutuhkan waktu sekitar 2 hingga 3 bulan untuk melintasi Pasifik dari barat ke timur.',
    'Suhu muka laut di kolam hangat ekuator Pasifik Barat normalnya bisa mencapai lebih dari 29°C - 30°C.',
    'Saat El Niño memuncak, anomali suhu di zona Niño 3.4 bisa melonjak hingga di atas +2.0°C hingga +3.0°C.',
    'Pelemahan angin pasat adalah pemicu awal yang merobohkan keseimbangan hidrodinamika di Samudra Pasifik.'
  ];
  const [currentTipIdx, setCurrentTipIdx] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGenerating) {
      timer = setInterval(() => {
        setCurrentTipIdx((prev) => (prev + 1) % climateTips.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isGenerating]);

  // Handle Preset selection
  const handleSelectPreset = (preset: typeof PRESET_IMAGES[0]) => {
    setActivePresetId(preset.id);
    setAspectRatio(preset.aspectRatio);
    setPrompt(preset.defaultPrompt);
    setImageName(preset.title);

    // Generate a high quality programmatic climate visualization canvas as data URL
    const canvas = document.createElement('canvas');
    canvas.width = preset.aspectRatio === '16:9' ? 1280 : 720;
    canvas.height = preset.aspectRatio === '16:9' ? 720 : 1280;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (preset.category === 'satellite') {
        // Satellite thermal map
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.3, '#0284c7');
        grad.addColorStop(0.6, '#f97316');
        grad.addColorStop(0.85, '#ef4444');
        grad.addColorStop(1, '#991b1b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Thermal wave ribbons
        ctx.lineWidth = 14;
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          ctx.moveTo(0, canvas.height * (0.3 + i * 0.08));
          ctx.bezierCurveTo(
            canvas.width * 0.3,
            canvas.height * (0.2 + i * 0.07),
            canvas.width * 0.7,
            canvas.height * (0.4 + i * 0.09),
            canvas.width,
            canvas.height * (0.35 + i * 0.08)
          );
          ctx.stroke();
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('NOAA SSTA EQUATORIAL PACIFIC ANOMALY', 60, 90);
        ctx.font = '24px "JetBrains Mono", monospace';
        ctx.fillStyle = '#fef08a';
        ctx.fillText('El Niño Warm Tongue (+2.8°C Anomaly)', 60, 135);
      } else if (preset.category === 'atmosphere') {
        // Dramatic storm clouds
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#090d16');
        grad.addColorStop(0.5, '#1e293b');
        grad.addColorStop(0.85, '#d97706');
        grad.addColorStop(1, '#0284c7');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Cumulonimbus clouds
        ctx.fillStyle = 'rgba(203, 213, 225, 0.85)';
        ctx.beginPath();
        ctx.arc(canvas.width * 0.5, canvas.height * 0.4, 260, 0, Math.PI * 2);
        ctx.arc(canvas.width * 0.3, canvas.height * 0.45, 200, 0, Math.PI * 2);
        ctx.arc(canvas.width * 0.7, canvas.height * 0.48, 220, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('WALKER CIRCULATION CONVECTIVE STORM TOWER', 60, 90);
      } else if (preset.category === 'ocean') {
        // Deep ocean upwelling
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#f97316');
        grad.addColorStop(0.35, '#0369a1');
        grad.addColorStop(0.7, '#075985');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('PERUVIAN COASTAL UPWELLING THERMOCLINE', 40, 70);
      } else {
        // Drought landscape
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#fdba74');
        grad.addColorStop(0.4, '#ea580c');
        grad.addColorStop(0.8, '#78350f');
        grad.addColorStop(1, '#451a03');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('EL NIÑO SEVERE DROUGHT IN INDONESIA', 60, 90);
      }

      const dataUrl = canvas.toDataURL('image/png');
      setSelectedImage(dataUrl);
    }
  };

  // Handle User File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Harap pilih file gambar (PNG, JPG, WEBP).');
      return;
    }

    setErrorMsg(null);
    setImageName(file.name);
    setActivePresetId(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSelectedImage(result);

      // Check natural aspect ratio to auto-select best ratio
      const img = new Image();
      img.onload = () => {
        if (img.height > img.width) {
          setAspectRatio('9:16');
        } else {
          setAspectRatio('16:9');
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  // Main Veo Video Generation Function
  const handleGenerateVideo = async () => {
    if (!selectedImage) {
      setErrorMsg('Silakan unggah foto atau pilih salah satu preset gambar terlebih dahulu.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setProgressPercent(10);
    setGenerationStep('Mengirim gambar ke server untuk inisialisasi Veo...');

    try {
      // Step 1: POST to /api/generate-video
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          prompt,
          aspectRatio, // '16:9' or '9:16'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memulai proses Veo video generation');
      }

      const operationName = data.operationName;
      if (!operationName) {
        throw new Error('Server tidak mengembalikan nama operasi video.');
      }

      setGenerationStep('Model veo-3.1-fast-generate-preview sedang mensintesis video...');
      setProgressPercent(25);

      // Step 2: Poll /api/video-status
      let isDone = false;
      let pollCount = 0;
      const maxPolls = 60; // 3 minutes timeout

      while (!isDone && pollCount < maxPolls) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        pollCount++;

        const percent = Math.min(25 + pollCount * 3.5, 92);
        setProgressPercent(percent);

        if (pollCount > 3) {
          setGenerationStep('Merender frame video definisi tinggi & dinamika fluida...');
        }

        const statusRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });

        const statusData = await statusRes.json();

        if (statusData.error) {
          throw new Error(statusData.error);
        }

        if (statusData.done) {
          isDone = true;
          break;
        }
      }

      if (!isDone) {
        throw new Error('Waktu tunggu pembuatan video telah melebihi batas (timeout). Silakan coba lagi.');
      }

      // Step 3: Fetch video stream from /api/video-download
      setGenerationStep('Mengunduh hasil video MP4 berkecepatan tinggi...');
      setProgressPercent(95);

      const downloadRes = await fetch('/api/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName }),
      });

      if (!downloadRes.ok) {
        const errorJson = await downloadRes.json().catch(() => ({}));
        throw new Error(errorJson.error || 'Gagal mengambil stream video akhir');
      }

      const blob = await downloadRes.blob();
      const videoBlobUrl = URL.createObjectURL(blob);

      setGeneratedVideoUrl(videoBlobUrl);
      setProgressPercent(100);
      setGenerationStep('Video berhasil dibuat!');

      // Save to history
      const newVideoItem: GeneratedVideoItem = {
        id: Date.now().toString(),
        createdAt: new Date().toLocaleTimeString('id-ID'),
        prompt,
        aspectRatio,
        originalImage: selectedImage,
        videoUrl: videoBlobUrl,
        operationName,
      };
      setHistory((prev) => [newVideoItem, ...prev]);
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMsg(
        err.message ||
          'Terjadi kesalahan saat memproses video dengan model veo-3.1-fast-generate-preview.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Download video helper
  const handleDownload = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `veo-elnino-${aspectRatio}-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" />
                Veo Video Generations
              </span>
              <span className="text-xs text-slate-400 font-mono bg-slate-800/80 px-2.5 py-0.5 rounded-md">
                veo-3.1-fast-generate-preview
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-3">
              Animate Climate Images into Video
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-2xl">
              Unggah foto anomali iklim, peta suhu samudra, citra satelit badai, atau diagram cuaca untuk menghasilkan video sinematik dengan rasio 16:9 atau 9:16.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (PRESET_IMAGES[0]) handleSelectPreset(PRESET_IMAGES[0]);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Pakai Preset Cepat
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Upload & Configuration (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Image Upload Dropzone */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                1. Unggah Foto atau Pilih Preset
              </label>
              {selectedImage && (
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setImageName('');
                    setActivePresetId(null);
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {selectedImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 group">
                <img
                  src={selectedImage}
                  alt="Upload preview"
                  className={`w-full object-cover transition duration-300 ${
                    aspectRatio === '9:16' ? 'max-h-[420px]' : 'max-h-[320px]'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
                  <div className="font-semibold truncate max-w-[240px] text-white">
                    {imageName || 'Gambar Terpilih'}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-slate-700"
                  >
                    Ganti Foto
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-8 text-center bg-slate-950/40 hover:bg-slate-950/70 transition cursor-pointer flex flex-col items-center justify-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Upload className="w-7 h-7" />
                </div>
                <div className="font-bold text-slate-200 text-sm sm:text-base">
                  Klik untuk unggah foto atau seret ke sini
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Mendukung format PNG, JPG, WEBP (Maksimal 20MB)
                </div>
              </div>
            )}
          </div>

          {/* Preset Chips */}
          <div>
            <div className="text-xs font-semibold text-slate-400 mb-2.5">
              Atau coba preset ilmiah El Niño:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-xl text-left border text-xs transition flex flex-col justify-between ${
                    activePresetId === preset.id
                      ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <span className="font-bold truncate text-slate-200">
                    {preset.title.split(' ')[0]} {preset.title.split(' ')[1]}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">
                    {preset.aspectRatio}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Aspect Ratio Selector (Mandatory 16:9 or 9:16) */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-2">
              <Ratio className="w-4 h-4 text-cyan-400" />
              2. Rasio Aspek Video (Mandatory)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`p-4 rounded-xl border flex items-center gap-3 transition text-left ${
                  aspectRatio === '16:9'
                    ? 'bg-cyan-500/15 border-cyan-500/60 text-white shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-850'
                }`}
              >
                <div
                  className={`w-10 h-6 rounded-md border flex items-center justify-center font-mono text-[10px] font-bold ${
                    aspectRatio === '16:9'
                      ? 'border-cyan-400 bg-cyan-500/30 text-cyan-200'
                      : 'border-slate-700 bg-slate-800 text-slate-400'
                  }`}
                >
                  16:9
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-100">Landscape (16:9)</div>
                  <div className="text-[11px] text-slate-400">Desktop, TV, & Layar Lebar</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`p-4 rounded-xl border flex items-center gap-3 transition text-left ${
                  aspectRatio === '9:16'
                    ? 'bg-cyan-500/15 border-cyan-500/60 text-white shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-850'
                }`}
              >
                <div
                  className={`w-6 h-10 rounded-md border flex items-center justify-center font-mono text-[10px] font-bold ${
                    aspectRatio === '9:16'
                      ? 'border-cyan-400 bg-cyan-500/30 text-cyan-200'
                      : 'border-slate-700 bg-slate-800 text-slate-400'
                  }`}
                >
                  9:16
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-100">Portrait (9:16)</div>
                  <div className="text-[11px] text-slate-400">Ponsel, Reels & Shorts</div>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Prompt Configuration */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                3. Instruksi Animasi & Gerakan (Veo Prompt)
              </span>
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Jelaskan bagaimana gambar harus dianimasikan (misal: arus laut mengalir ke timur dengan badai awan kumulonimbus bergerak dramatis)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/70"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateVideo}
            disabled={isGenerating || !selectedImage}
            className={`w-full py-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2.5 transition shadow-xl ${
              isGenerating || !selectedImage
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white shadow-rose-500/20 active:scale-[0.99]'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                Sedang Membuat Video dengan Veo...
              </>
            ) : (
              <>
                <Film className="w-4 h-4" />
                Generate Video dengan Veo (veo-3.1-fast-generate-preview)
              </>
            )}
          </button>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Gagal Membuat Video: </span>
                {errorMsg}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Generation Status & Video Player (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-5 h-full flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Film className="w-4 h-4 text-cyan-400" />
              Hasil Pembuatan Video
            </h3>

            {/* Video Player or Placeholder */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
              {isGenerating ? (
                <div className="w-full text-center space-y-4 py-8">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-rose-500 animate-spin" />
                    <Film className="w-6 h-6 text-rose-400 absolute inset-0 m-auto" />
                  </div>

                  <div>
                    <div className="font-bold text-slate-100 text-sm">
                      {generationStep}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 font-mono">
                      {progressPercent}% Selesai
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-rose-500 to-indigo-500 h-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Rotating Climate Fact */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 text-left">
                    <span className="font-bold text-cyan-400 block mb-1">
                      💡 Fakta Sains ENSO:
                    </span>
                    {climateTips[currentTipIdx]}
                  </div>
                </div>
              ) : generatedVideoUrl ? (
                <div className="w-full space-y-3">
                  <div
                    className={`relative rounded-xl overflow-hidden bg-black border border-slate-800 mx-auto ${
                      aspectRatio === '9:16' ? 'max-w-[240px]' : 'w-full'
                    }`}
                  >
                    <video
                      ref={videoRef}
                      src={generatedVideoUrl}
                      controls
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-auto rounded-xl"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-400 font-mono">
                      Rasio: {aspectRatio}
                    </span>
                    <button
                      onClick={() => handleDownload(generatedVideoUrl)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Unduh MP4
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500 p-8 space-y-2">
                  <Film className="w-12 h-12 mx-auto text-slate-700" />
                  <div className="text-sm font-semibold text-slate-400">
                    Belum Ada Video yang Dibuat
                  </div>
                  <div className="text-xs max-w-xs mx-auto">
                    Pilih gambar dan klik tombol generate untuk melihat keajaiban Veo AI menganimasikan citra iklim Anda.
                  </div>
                </div>
              )}
            </div>

            {/* Previously Generated Gallery */}
            {history.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-850">
                <div className="text-xs font-semibold text-slate-400 mb-2">
                  Riwayat Video Sesi Ini ({history.length}):
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setGeneratedVideoUrl(item.videoUrl);
                        setAspectRatio(item.aspectRatio);
                      }}
                      className="shrink-0 w-20 h-14 rounded-lg overflow-hidden border border-slate-800 hover:border-cyan-400 cursor-pointer relative group bg-black"
                    >
                      <img
                        src={item.originalImage}
                        alt="thumb"
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100"
                      />
                      <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-black/80 px-1 rounded text-cyan-300">
                        {item.aspectRatio}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
