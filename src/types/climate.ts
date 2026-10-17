export type EnsoPhase = 'normal' | 'el-nino' | 'la-nina' | 'custom';

export interface StageInfo {
  id: number;
  title: string;
  subtitle: string;
  tagline: string;
  badge: string;
  description: string;
  detailedPoints: string[];
  keyParameters: {
    tradeWinds: string;
    warmPoolLocation: string;
    thermoclineSlope: string;
    upwellingStatus: string;
    walkerConvection: string;
    indonesiaRainfall: string;
    southAmericaWeather: string;
  };
  recommendedSliderVal: number; // -2 to +2
}

export interface PresetImage {
  id: string;
  title: string;
  subtitle: string;
  category: 'satellite' | 'ocean' | 'atmosphere' | 'impact';
  aspectRatio: '16:9' | '9:16';
  defaultPrompt: string;
  thumbnailSvg: string;
}

export interface GeneratedVideoItem {
  id: string;
  createdAt: string;
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  originalImage: string;
  videoUrl: string;
  operationName?: string;
}
