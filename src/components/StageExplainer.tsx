import React from 'react';
import { EL_NINO_STAGES } from '../data/climateData';
import { StageInfo } from '../types/climate';
import {
  Wind,
  Waves,
  ShieldAlert,
  CloudRain,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ArrowRight,
  Layers,
  Thermometer,
  Compass
} from 'lucide-react';

interface StageExplainerProps {
  currentStageId: number;
  onSelectStage: (stage: StageInfo) => void;
}

export const StageExplainer: React.FC<StageExplainerProps> = ({
  currentStageId,
  onSelectStage
}) => {
  const currentStage =
    EL_NINO_STAGES.find((s) => s.id === currentStageId) || EL_NINO_STAGES[0];

  const getStageIcon = (id: number) => {
    switch (id) {
      case 1:
        return <Wind className="w-5 h-5 text-cyan-400" />;
      case 2:
        return <Waves className="w-5 h-5 text-amber-400" />;
      case 3:
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 4:
        return <CloudRain className="w-5 h-5 text-purple-400" />;
      default:
        return <Layers className="w-5 h-5 text-cyan-400" />;
    }
  };

  const nextStage = () => {
    const nextIdx = (currentStageId % 4) + 1;
    const stage = EL_NINO_STAGES.find((s) => s.id === nextIdx);
    if (stage) onSelectStage(stage);
  };

  const prevStage = () => {
    const prevIdx = currentStageId === 1 ? 4 : currentStageId - 1;
    const stage = EL_NINO_STAGES.find((s) => s.id === prevIdx);
    if (stage) onSelectStage(stage);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Stage Selector Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-slate-800 bg-slate-950/60 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        {EL_NINO_STAGES.map((stage) => {
          const isActive = stage.id === currentStageId;
          return (
            <button
              key={stage.id}
              onClick={() => onSelectStage(stage)}
              className={`p-4 text-left transition flex items-start gap-3 relative ${
                isActive
                  ? 'bg-slate-900/90 text-white'
                  : 'bg-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition ${
                  isActive
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400'
                }`}
              >
                {getStageIcon(stage.id)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  Mekanisme {stage.id}
                </div>
                <div className="font-bold text-sm truncate text-slate-100 mt-0.5">
                  {stage.title}
                </div>
              </div>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Body */}
      <div className="p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {currentStage.badge}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {currentStage.subtitle}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-3">
              {getStageIcon(currentStage.id)}
              {currentStage.title}
            </h2>
            <p className="text-sm sm:text-base text-cyan-200/80 font-medium mt-1">
              "{currentStage.tagline}"
            </p>
          </div>

          {/* Next / Prev Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevStage}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Fase Sebelumnya
            </button>
            <button
              onClick={nextStage}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-cyan-500/20"
            >
              Fase Berikutnya
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Detailed Explanation & Bullet Points */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
          {/* Narrative & Physics breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 leading-relaxed text-slate-300 text-sm sm:text-base">
              {currentStage.description}
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Dinamika Fisika & Rantai Kausalitas
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {currentStage.detailedPoints.map((pt, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200"
                  >
                    <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono text-xs shrink-0 font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Meteorological Parameters Card */}
          <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
                <Compass className="w-4 h-4" />
                Status Parameter Kritis
              </h4>

              <div className="space-y-3.5 text-xs">
                <div className="pb-2 border-b border-slate-850">
                  <div className="text-slate-400 font-medium">Angin Pasat (Trade Winds):</div>
                  <div className="font-bold text-slate-100 mt-0.5 flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-cyan-400" />
                    {currentStage.keyParameters.tradeWinds}
                  </div>
                </div>

                <div className="pb-2 border-b border-slate-850">
                  <div className="text-slate-400 font-medium">Posisi Kolam Hangat (Warm Pool):</div>
                  <div className="font-bold text-amber-300 mt-0.5 flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                    {currentStage.keyParameters.warmPoolLocation}
                  </div>
                </div>

                <div className="pb-2 border-b border-slate-850">
                  <div className="text-slate-400 font-medium">Kemiringan Lapisan Termoklin:</div>
                  <div className="font-bold text-slate-100 mt-0.5">
                    {currentStage.keyParameters.thermoclineSlope}
                  </div>
                </div>

                <div className="pb-2 border-b border-slate-850">
                  <div className="text-slate-400 font-medium">Kondisi Upwelling Peru:</div>
                  <div className="font-bold text-rose-400 mt-0.5">
                    {currentStage.keyParameters.upwellingStatus}
                  </div>
                </div>

                <div className="pb-2 border-b border-slate-850">
                  <div className="text-slate-400 font-medium">Sirkulasi Walker:</div>
                  <div className="font-bold text-purple-300 mt-0.5">
                    {currentStage.keyParameters.walkerConvection}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200">
                  <div className="font-semibold text-[11px] text-rose-400 uppercase">
                    Dampak Cuaca Indonesia:
                  </div>
                  <div className="mt-0.5 text-xs font-bold">
                    {currentStage.keyParameters.indonesiaRainfall}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-850 text-center">
              <span className="text-[11px] text-slate-400">
                Lihat visualisasi interaktif pada diagram penampang di atas.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
