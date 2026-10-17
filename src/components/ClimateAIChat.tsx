import React, { useState } from 'react';
import { Bot, Send, Sparkles, RefreshCw, AlertCircle, BookOpen } from 'lucide-react';

export const ClimateAIChat: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; text: string }[]
  >([
    {
      role: 'assistant',
      text: 'Halo! Saya asisten klimatologi dan oseanografi Anda. Anda bisa menanyakan apapun tentang 4 fase El Niño, pelemahan angin pasat, pergeseran Sirkulasi Walker, hambatan upwelling di Peru, atau dampaknya terhadap Indonesia.'
    }
  ]);
  const [error, setError] = useState<string | null>(null);

  const samplePrompts = [
    'Bagaimana gelombang Kelvin membawa air hangat ke timur saat El Niño?',
    'Mengapa upwelling di pesisir Peru sangat vital bagi rantai makanan laut?',
    'Apa hubungan antara pelemahan angin pasat dengan kekeringan di Indonesia?',
    'Apa perbedaan utama antara fenomena El Niño dan La Niña?'
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || question;
    if (!q.trim() || loading) return;

    setError(null);
    setLoading(true);
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    if (!textToSend) setQuestion('');

    try {
      const res = await fetch('/api/ask-climate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses jawaban dari AI');
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: data.answer || 'Tidak ada respons teks.' }
      ]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Gagal menghubungi server Gemini.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[580px]">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
              Pakar Iklim AI (Powered by Gemini 3.8 Flash)
            </h3>
            <p className="text-xs text-slate-400">
              Tanya jawab ilmiah seputar dinamika laut & atmosfer ENSO
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
          gemini-3.8-flash
        </span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 text-xs mt-1">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`rounded-2xl p-4 text-xs sm:text-sm max-w-[85%] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-cyan-600 text-white font-medium'
                  : 'bg-slate-950/70 border border-slate-800 text-slate-200'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-slate-400 text-xs py-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span>Sedang menganalisis literatur oseanografi & meteorologi...</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Suggested chips */}
      <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-850 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-400">
        <span className="shrink-0 font-semibold text-purple-400">Contoh:</span>
        {samplePrompts.map((sp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sp)}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700/60 transition"
          >
            {sp}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Tanyakan mekanisme El Niño atau dampak iklim..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-purple-600/20"
          >
            <Send className="w-4 h-4" />
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
};
