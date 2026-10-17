import React, { useState } from 'react';
import { PacificCrossSection } from './components/PacificCrossSection';
import { StageExplainer } from './components/StageExplainer';
import { VeoVideoAnimator } from './components/VeoVideoAnimator';
import { OniHistoryChart } from './components/OniHistoryChart';
import { ImpactComparison } from './components/ImpactComparison';
import { ClimateAIChat } from './components/ClimateAIChat';
import { KnowledgeQuiz } from './components/KnowledgeQuiz';
import { EL_NINO_STAGES } from './data/climateData';
import { EnsoPhase, StageInfo } from './types/climate';
import {
  Waves,
  Film,
  Globe,
  HelpCircle,
  Bot,
  Layers,
  ThermometerSnowflake,
  Flame,
  Wind,
  ShieldCheck,
  Compass,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'simulation' | 'oni-history' | 'veo-animator' | 'impacts' | 'ai-chat' | 'quiz'
  >('simulation');

  // Simulation state
  const [phase, setPhase] = useState<EnsoPhase>('el-nino');
  const [oniValue, setOniValue] = useState<number>(1.8); // Default strong El Niño to showcase prompt mechanisms
  const [activeStageId, setActiveStageId] = useState<number>(1);

  const handleSelectStage = (stage: StageInfo) => {
    setActiveStageId(stage.id);
    setOniValue(stage.recommendedSliderVal);
  };

  const handleQuickPreset = (preset: 'normal' | 'el-nino' | 'la-nina') => {
    setPhase(preset);
    if (preset === 'normal') {
      setOniValue(0.0);
    } else if (preset === 'el-nino') {
      setOniValue(2.0);
    } else {
      setOniValue(-1.8);
    }
  };

  // Callback when a user clicks on a historical ONI point or landmark in D3 chart
  const handleHistoricalOniSelect = (val: number) => {
    setOniValue(val);
    setActiveTab('simulation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-slate-800/80 px-4 py-2 text-center text-xs text-slate-300 flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <Wind className="w-3.5 h-3.5" />
          ENSO Science & Climatology
        </span>
        <span className="hidden sm:inline text-slate-500">•</span>
        <span className="hidden sm:inline">
          Memahami 4 Tahapan Fisika El Niño di Khatulistiwa Samudra Pasifik
        </span>
        <button
          onClick={() => setActiveTab('oni-history')}
          className="ml-2 px-2.5 py-0.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-semibold text-[11px] flex items-center gap-1 transition"
        >
          <TrendingUp className="w-3 h-3 text-cyan-400" />
          Data ONI 50 Tahun (D3.js)
        </button>
        <button
          onClick={() => setActiveTab('veo-animator')}
          className="px-2.5 py-0.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold text-[11px] flex items-center gap-1 transition"
        >
          <Film className="w-3 h-3 text-rose-400" />
          Veo Video Animator
        </button>
      </div>

      {/* Main Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                Simulasi El Niño & Sirkulasi Walker
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Dinamika Oseanografi Pasifik, Grafik Historis D3.js & Veo Video Animator
              </p>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => handleQuickPreset('normal')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                Math.abs(oniValue) < 0.5
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Normal (Netral)
            </button>
            <button
              onClick={() => handleQuickPreset('el-nino')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
                oniValue >= 0.5
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              El Niño
            </button>
            <button
              onClick={() => handleQuickPreset('la-nina')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
                oniValue <= -0.5
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ThermometerSnowflake className="w-3.5 h-3.5" />
              La Niña
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 overflow-x-auto">
          <nav className="flex space-x-1 sm:space-x-4 py-2">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition shrink-0 ${
                activeTab === 'simulation'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              Simulasi Interaktif & 4 Fase
            </button>

            <button
              onClick={() => setActiveTab('oni-history')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shrink-0 ${
                activeTab === 'oni-history'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Grafik Indeks ONI (D3.js)
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-500 text-slate-950 font-extrabold uppercase">
                50 Tahun
              </span>
            </button>

            <button
              onClick={() => setActiveTab('veo-animator')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shrink-0 ${
                activeTab === 'veo-animator'
                  ? 'bg-gradient-to-r from-rose-500/20 to-indigo-500/20 text-rose-300 border border-rose-500/40 shadow-lg shadow-rose-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Film className="w-4 h-4 text-rose-400" />
              Veo Video Animator (AI)
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-rose-500 text-white font-extrabold uppercase">
                Veo 3.1
              </span>
            </button>

            <button
              onClick={() => setActiveTab('impacts')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition shrink-0 ${
                activeTab === 'impacts'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Globe className="w-4 h-4 text-purple-400" />
              Dampak Sosio-Ekonomi
            </button>

            <button
              onClick={() => setActiveTab('ai-chat')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition shrink-0 ${
                activeTab === 'ai-chat'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              Tanya Pakar AI (Gemini)
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition shrink-0 ${
                activeTab === 'quiz'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              Kuis Sains (4 Mekanisme)
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Tab 1: Interactive Cross-Section & 4 Stages */}
        {activeTab === 'simulation' && (
          <div className="space-y-8">
            {/* Interactive Pacific Cross-Section Canvas */}
            <PacificCrossSection
              phase={phase}
              oniValue={oniValue}
              onOniChange={setOniValue}
              activeStageId={activeStageId}
            />

            {/* 4 Stages Explainer based directly on User Request */}
            <StageExplainer
              currentStageId={activeStageId}
              onSelectStage={handleSelectStage}
            />

            {/* Banner to D3.js Historical Chart */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    Jelajahi Data Historis 50 Tahun Indeks ONI dengan D3.js
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Lihat bagaimana anomali suhu samudra bergerak naik-turun dari tahun 1976 hingga 2026 dan bandingkan peristiwa Super El Niño 1982, 1997, 2015, dan 2023.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('oni-history')}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shrink-0 shadow-lg shadow-cyan-500/20 transition"
              >
                Lihat Grafik D3.js
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: D3.js Historical ONI Line Chart */}
        {activeTab === 'oni-history' && (
          <div className="space-y-8">
            <OniHistoryChart onSelectOniValue={handleHistoricalOniSelect} />
          </div>
        )}

        {/* Tab 3: Mandated Veo Video Animator */}
        {activeTab === 'veo-animator' && <VeoVideoAnimator />}

        {/* Tab 4: Socio-Economic Impacts Matrix */}
        {activeTab === 'impacts' && <ImpactComparison />}

        {/* Tab 5: AI Climate Assistant */}
        {activeTab === 'ai-chat' && <ClimateAIChat />}

        {/* Tab 6: Interactive Quiz */}
        {activeTab === 'quiz' && <KnowledgeQuiz />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">
              Simulasi El Niño & Veo Video Animator
            </span>
            <span>•</span>
            <span>Visualisasi D3.js & NOAA Oceanic Niño Index (1976-2026)</span>
          </div>
          <div className="text-slate-500">
            Didukung oleh Google GenAI SDK (@google/genai) & Model veo-3.1-fast-generate-preview
          </div>
        </div>
      </footer>
    </div>
  );
}
