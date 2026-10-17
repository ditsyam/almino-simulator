import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Info, Wind, CloudRain, Waves, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { EnsoPhase } from '../types/climate';

interface PacificCrossSectionProps {
  phase: EnsoPhase;
  oniValue: number; // -2.5 to +2.5
  onOniChange: (val: number) => void;
  activeStageId?: number;
}

export const PacificCrossSection: React.FC<PacificCrossSectionProps> = ({
  phase,
  oniValue,
  onOniChange,
  activeStageId
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [hoverData, setHoverData] = useState<{
    x: number;
    y: number;
    longitude: string;
    region: string;
    sst: number;
    thermoclineDepth: number;
    windVector: string;
    upwellingStrength: string;
    convection: string;
  } | null>(null);

  // Layer toggles
  const [showWinds, setShowWinds] = useState(true);
  const [showWalker, setShowWalker] = useState(true);
  const [showUpwelling, setShowUpwelling] = useState(true);
  const [showThermocline, setShowThermocline] = useState(true);
  const [showRain, setShowRain] = useState(true);

  // Particles for winds and rain
  const particlesRef = useRef<{
    wind: { x: number; y: number; speed: number; size: number; alpha: number }[];
    rain: { x: number; y: number; speed: number; length: number }[];
    upwelling: { x: number; y: number; speed: number; radius: number }[];
    walker: { t: number; speed: number; altitude: number }[];
  }>({
    wind: [],
    rain: [],
    upwelling: [],
    walker: []
  });

  // Initialize particles
  useEffect(() => {
    const p = particlesRef.current;
    p.wind = Array.from({ length: 45 }, () => ({
      x: Math.random() * 800,
      y: 120 + Math.random() * 30,
      speed: 0.8 + Math.random() * 1.2,
      size: 2 + Math.random() * 2,
      alpha: 0.4 + Math.random() * 0.6
    }));

    p.rain = Array.from({ length: 50 }, () => ({
      x: Math.random() * 300,
      y: 60 + Math.random() * 70,
      speed: 3 + Math.random() * 3,
      length: 8 + Math.random() * 8
    }));

    p.upwelling = Array.from({ length: 25 }, () => ({
      x: 710 + Math.random() * 60,
      y: 220 + Math.random() * 120,
      speed: 0.5 + Math.random() * 0.8,
      radius: 1.5 + Math.random() * 2
    }));

    p.walker = Array.from({ length: 30 }, () => ({
      t: Math.random(), // 0 to 1 loop progress
      speed: 0.003 + Math.random() * 0.002,
      altitude: Math.random()
    }));
  }, []);

  // Main canvas rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const render = () => {
      if (isPlaying) {
        tick += speed;
      }

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Interpolation values based on ONI (-2.5 to +2.5)
      // Normalized: 0 = extreme La Niña, 0.5 = normal, 1.0 = super El Niño
      const norm = Math.min(Math.max((oniValue + 2.5) / 5.0, 0), 1);

      // Sky background gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 160);
      skyGrad.addColorStop(0, '#090d16');
      skyGrad.addColorStop(1, '#111a2e');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, 160);

      // Ocean surface baseline at y = 160
      const seaLevelY = 160;

      // 1. Sea Surface Temperature & Warm Pool
      // In Normal/La Niña: Warm pool is piled up in West (x: 0 to 350)
      // In El Niño: Warm pool sloshes to East (x: 250 to 800)
      const warmPoolCenterX = 150 + norm * 450;
      const warmPoolSpread = 220 + norm * 80;

      // Deep Ocean background
      const oceanGrad = ctx.createLinearGradient(0, 160, 0, height);
      oceanGrad.addColorStop(0, '#0c2547');
      oceanGrad.addColorStop(0.5, '#071830');
      oceanGrad.addColorStop(1, '#020b17');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, seaLevelY, width, height - seaLevelY);

      // Draw Warm Pool glow and temperature distribution
      const wpGrad = ctx.createRadialGradient(
        warmPoolCenterX,
        170,
        20,
        warmPoolCenterX,
        180,
        warmPoolSpread
      );
      // Warmer in center, fading into cooler waters
      if (norm > 0.55) {
        // El Niño warm anomaly (Red/Amber/Orange)
        wpGrad.addColorStop(0, 'rgba(239, 68, 68, 0.75)');
        wpGrad.addColorStop(0.4, 'rgba(249, 115, 22, 0.55)');
        wpGrad.addColorStop(0.7, 'rgba(234, 179, 8, 0.35)');
        wpGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
      } else if (norm < 0.4) {
        // La Niña cold tongue dominant (Cool cyan/deep blue with warm pool confined to far west)
        wpGrad.addColorStop(0, 'rgba(249, 115, 22, 0.6)');
        wpGrad.addColorStop(0.3, 'rgba(234, 179, 8, 0.3)');
        wpGrad.addColorStop(0.6, 'rgba(14, 165, 233, 0.2)');
        wpGrad.addColorStop(1, 'rgba(3, 105, 161, 0)');
      } else {
        // Normal state
        wpGrad.addColorStop(0, 'rgba(249, 115, 22, 0.7)');
        wpGrad.addColorStop(0.4, 'rgba(234, 179, 8, 0.4)');
        wpGrad.addColorStop(0.7, 'rgba(14, 165, 233, 0.15)');
        wpGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
      }

      ctx.fillStyle = wpGrad;
      ctx.fillRect(0, seaLevelY, width, 180);

      // Sea Surface Wave animation
      ctx.beginPath();
      ctx.moveTo(0, seaLevelY);
      for (let x = 0; x <= width; x += 10) {
        // Sea level tilt: West is ~50cm higher in normal/La Niña, flat in El Niño
        const seaLevelTilt = (1 - norm) * (1 - x / width) * 7;
        const wave = Math.sin(x * 0.03 + tick * 0.05) * 2;
        ctx.lineTo(x, seaLevelY - seaLevelTilt + wave);
      }
      ctx.lineTo(width, seaLevelY + 10);
      ctx.lineTo(0, seaLevelY + 10);
      ctx.fillStyle = norm > 0.6 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(56, 189, 248, 0.3)';
      ctx.fill();

      // 2. Thermocline Boundary (Layer dividing warm surface from cold deep ocean)
      if (showThermocline) {
        ctx.beginPath();
        // In Normal: Deep in West (~280px), Shallow in East (~180px)
        // In El Niño: Flattens! West rises to ~230px, East sinks to ~260px
        const westThermo = 290 - norm * 60;
        const eastThermo = 180 + norm * 90;

        ctx.moveTo(0, westThermo);
        for (let x = 0; x <= width; x += 15) {
          const ratio = x / width;
          // Smooth curve
          const baseDepth = westThermo + (eastThermo - westThermo) * Math.pow(ratio, 0.9);
          // Kelvin wave disturbance traveling if activeStageId === 2
          const kelvinWave =
            activeStageId === 2
              ? Math.sin(ratio * Math.PI * 3 - tick * 0.08) * 12 * Math.sin(ratio * Math.PI)
              : Math.sin(ratio * 6 + tick * 0.02) * 3;
          ctx.lineTo(x, baseDepth + kelvinWave);
        }

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label Thermocline
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
        const labelX = width * 0.45;
        const labelY = westThermo + (eastThermo - westThermo) * 0.45 - 8;
        ctx.fillText('Lapisan Termoklin (20°C Isotherm)', labelX, labelY);
      }

      // 3. Upwelling off Peru / Ecuador Coast (East, x: 680 to 780)
      if (showUpwelling) {
        // When El Niño is strong (norm > 0.6), upwelling is heavily suppressed/blocked!
        const upwellingActive = norm < 0.65;
        const upwellingIntensity = Math.max(0, 1 - norm * 1.3);

        const pUp = particlesRef.current.upwelling;
        pUp.forEach((p) => {
          if (isPlaying) {
            p.y -= p.speed * (upwellingActive ? 1.4 : 0.2) * speed;
            if (p.y < seaLevelY + 5) {
              p.y = 350 + Math.random() * 40;
              p.x = 710 + Math.random() * 65;
            }
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          if (upwellingActive) {
            ctx.fillStyle = `rgba(56, 189, 248, ${0.4 + upwellingIntensity * 0.5})`;
          } else {
            // Blocked / suffocated by warm cap
            ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
          }
          ctx.fill();
        });

        // Upwelling stream arrows
        if (upwellingActive) {
          ctx.beginPath();
          ctx.moveTo(740, 360);
          ctx.quadraticCurveTo(735, 260, 755, 175);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 + upwellingIntensity * 0.5})`;
          ctx.lineWidth = 3;
          ctx.stroke();

          // Arrowhead
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.moveTo(755, 170);
          ctx.lineTo(748, 182);
          ctx.lineTo(762, 182);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#7dd3fc';
          ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('Upwelling Dingin', 690, 230);
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillStyle = '#bae6fd';
          ctx.fillText('Kaya Nutrien (Fitoplankton)', 675, 243);
        } else {
          // Blocked indicator
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('Upwelling Terhambat!', 685, 230);
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillStyle = '#fca5a5';
          ctx.fillText('Tertutup Lapisan Hangat', 680, 243);

          // Draw a blocking barrier line
          ctx.beginPath();
          ctx.moveTo(680, 195);
          ctx.lineTo(780, 195);
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // 4. Trade Winds (Angin Pasat) at Surface (y = 125 to 145)
      if (showWinds) {
        // Normal/La Niña: Wind blows strongly East to West (right to left, dx < 0)
        // El Niño: Wind slows down, stops, or blows West to East (left to right, dx > 0)
        const windDirection = norm > 0.65 ? 1 : -1;
        const windPower = Math.abs(norm - 0.6) * 2.2 + 0.3;

        const pWind = particlesRef.current.wind;
        pWind.forEach((p) => {
          if (isPlaying) {
            p.x += windDirection * p.speed * windPower * speed;
            if (p.x < 10) p.x = width - 15;
            if (p.x > width - 15) p.x = 10;
          }

          // Wind streak
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - windDirection * (12 * windPower), p.y);
          ctx.strokeStyle =
            windDirection < 0 ? 'rgba(125, 211, 252, 0.7)' : 'rgba(251, 146, 60, 0.75)';
          ctx.lineWidth = p.size;
          ctx.stroke();

          // Particle tip
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = windDirection < 0 ? '#38bdf8' : '#fb923c';
          ctx.fill();
        });

        // Trade Winds Status Label
        ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
        if (norm > 0.65) {
          ctx.fillStyle = '#fb923c';
          ctx.fillText('⚡ Angin Pasat Melemah & Berbalik Arah (Barat ➔ Timur)', width * 0.28, 148);
        } else {
          ctx.fillStyle = '#38bdf8';
          ctx.fillText('➔ Angin Pasat Normal Kuat (Timur ➔ Barat / Trade Winds)', width * 0.28, 148);
        }
      }

      // 5. Walker Circulation & Convective Rain Clouds
      // In Normal: Convective rising air is over Indonesia (x: 80 to 220)
      // In El Niño: Convective rising air shifts to Central/Eastern Pacific (x: 420 to 650)
      const convectionCenterX = 130 + norm * 450;

      // Draw Atmospheric Clouds
      ctx.fillStyle = 'rgba(241, 245, 249, 0.85)';
      const drawCloud = (cx: number, cy: number, scale: number) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 22 * scale, 0, Math.PI * 2);
        ctx.arc(cx + 18 * scale, cy - 8 * scale, 28 * scale, 0, Math.PI * 2);
        ctx.arc(cx + 42 * scale, cy - 4 * scale, 24 * scale, 0, Math.PI * 2);
        ctx.arc(cx + 60 * scale, cy + 4 * scale, 18 * scale, 0, Math.PI * 2);
        ctx.arc(cx + 30 * scale, cy + 12 * scale, 22 * scale, 0, Math.PI * 2);
        ctx.fill();
      };

      // Draw primary convective cloud complex (Cumulonimbus)
      ctx.fillStyle = norm > 0.6 ? 'rgba(203, 213, 225, 0.95)' : 'rgba(241, 245, 249, 0.95)';
      drawCloud(convectionCenterX - 40, 50, 1.15);

      // Thunder/Rain under cloud
      if (showRain) {
        const pRain = particlesRef.current.rain;
        pRain.forEach((r) => {
          if (isPlaying) {
            r.y += r.speed * speed;
            if (r.y > seaLevelY - 5) {
              r.y = 55 + Math.random() * 20;
              r.x = convectionCenterX - 60 + Math.random() * 120;
            }
          }

          ctx.beginPath();
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x - 1, r.y + r.length);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
          ctx.lineWidth = 1.6;
          ctx.stroke();
        });
      }

      // 6. Walker Cell Circulation Flow Arrows (Atmospheric Loop)
      if (showWalker) {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([4, 4]);

        // Loop path:
        // Rising above convection -> moving east at top (y: 25) -> sinking at dry zone -> returning west at surface
        const sinkCenterX = norm > 0.6 ? 120 : 720;

        ctx.beginPath();
        // Convective rising column
        ctx.moveTo(convectionCenterX, 130);
        ctx.lineTo(convectionCenterX, 30);
        // High altitude return wind
        ctx.lineTo(sinkCenterX, 30);
        // Sinking column
        ctx.lineTo(sinkCenterX, 130);
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated flow dots on Walker Cell
        const pWalk = particlesRef.current.walker;
        pWalk.forEach((pw) => {
          if (isPlaying) {
            pw.t = (pw.t + pw.speed * speed) % 1;
          }

          // Map t (0..1) to path:
          // 0..0.25: rising (convection -> top)
          // 0.25..0.6: top horizontal
          // 0.6..0.85: sinking
          // 0.85..1.0: bottom horizontal
          let px = 0;
          let py = 0;
          if (pw.t < 0.25) {
            const frac = pw.t / 0.25;
            px = convectionCenterX;
            py = 130 - frac * 100;
          } else if (pw.t < 0.6) {
            const frac = (pw.t - 0.25) / 0.35;
            px = convectionCenterX + frac * (sinkCenterX - convectionCenterX);
            py = 30;
          } else if (pw.t < 0.85) {
            const frac = (pw.t - 0.6) / 0.25;
            px = sinkCenterX;
            py = 30 + frac * 100;
          } else {
            const frac = (pw.t - 0.85) / 0.15;
            px = sinkCenterX + frac * (convectionCenterX - sinkCenterX);
            py = 130;
          }

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = norm > 0.6 ? '#f97316' : '#38bdf8';
          ctx.fill();
        });

        // Walker labels
        ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('Udara Naik (Konveksi Hujan)', convectionCenterX - 55, 20);

        ctx.fillStyle = '#f87171';
        ctx.fillText('Udara Turun (Subsiden Kering)', sinkCenterX - 60, 20);
      }

      // 7. Coastal Landmasses
      // Left landmass: Indonesia / Australia (120°E - 140°E)
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(0, 110);
      ctx.lineTo(45, 110);
      ctx.lineTo(55, 160);
      ctx.lineTo(50, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Right landmass: South America (Peru / Ecuador 80°W)
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(width - 50, 110);
      ctx.lineTo(width, 110);
      ctx.lineTo(width, height);
      ctx.lineTo(width - 45, height);
      ctx.lineTo(width - 55, 160);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Land Labels
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('INDONESIA / AUSTRALIA', 10, 100);
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('120°E - 140°E (Pasifik Barat)', 10, 112);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('PERU / EKUADOR', width - 130, 100);
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('80°W (Pasifik Timur)', width - 130, 112);

      // Real-time weather badge on Landmasses
      if (norm > 0.6) {
        // Indonesia drought badge
        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.fillRect(10, 120, 80, 20);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('🔥 KEMARAU / KERING', 14, 134);

        // Peru flood badge
        ctx.fillStyle = 'rgba(14, 165, 233, 0.9)';
        ctx.fillRect(width - 95, 120, 85, 20);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('🌊 HUJAN BADAI / BANJIR', width - 92, 134);
      } else {
        // Normal badges
        ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
        ctx.fillRect(10, 120, 85, 20);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('🌧️ MONSUN BASAH', 14, 134);

        ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
        ctx.fillRect(width - 90, 120, 80, 20);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('☀️ KERING NORMAL', width - 86, 134);
      }

      // Stage Indicator Highlight Overlay if activeStageId is set
      if (activeStageId) {
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);

        if (activeStageId === 1) {
          // Highlight Trade Winds Area
          ctx.strokeRect(width * 0.2, 115, width * 0.55, 45);
        } else if (activeStageId === 2) {
          // Highlight Warm Pool Migration
          ctx.strokeRect(width * 0.25, 155, width * 0.5, 90);
        } else if (activeStageId === 3) {
          // Highlight Upwelling & Thermocline at Peru
          ctx.strokeRect(width - 150, 165, 110, 180);
        } else if (activeStageId === 4) {
          // Highlight Walker atmospheric convection
          ctx.strokeRect(width * 0.1, 15, width * 0.8, 115);
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, speed, oniValue, showWinds, showWalker, showUpwelling, showThermocline, showRain, activeStageId]);

  // Handle canvas mouse move for interactive inspection
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const ratio = Math.min(Math.max(x / canvas.width, 0), 1);
    const norm = (oniValue + 2.5) / 5.0;

    // Estimate longitudes: 120°E to 80°W (approx 160 degrees span)
    const deg = 120 + ratio * 160;
    const lonStr = deg <= 180 ? `${deg.toFixed(0)}°E` : `${(360 - deg).toFixed(0)}°W`;

    let region = 'Pasifik Tengah (Zona Khatulistiwa)';
    if (ratio < 0.25) region = 'Pasifik Barat (Indonesia / Papua)';
    else if (ratio > 0.75) region = 'Pasifik Timur (Pesisir Peru / Galapagos)';

    // Estimated SST (°C)
    let sstBase = 29 - ratio * 7; // 29C in west down to 22C in east normally
    if (norm > 0.55) {
      // El Niño adds warmth to the central & eastern pacific
      sstBase = 28 - ratio * 1.5 + (norm - 0.5) * 4 * ratio;
    }
    const sst = Number(sstBase.toFixed(1));

    // Thermocline depth (meters)
    const westDepth = 200 - norm * 60;
    const eastDepth = 30 + norm * 80;
    const thermoclineDepth = Math.round(westDepth + (eastDepth - westDepth) * ratio);

    const windVector =
      norm > 0.65
        ? 'Angin Pasat melemah / Terbalik (Westerly 5-10 knot)'
        : 'Angin Pasat kuat (Easterly 18-24 knot)';

    const upwellingStrength =
      ratio > 0.7
        ? norm > 0.6
          ? 'Terhambat Total (<0.2 m/hari)'
          : 'Sangat Kuat & Aktif (~2.5 m/hari)'
        : 'Tidak Signifikan (Zona Kolam Hangat)';

    const convection =
      Math.abs(ratio - (0.2 + norm * 0.55)) < 0.18
        ? 'Konveksi Aktif (Awan Kumulonimbus & Hujan Lebat)'
        : 'Subsiden Kering (Tekanan Tinggi, Minim Awan)';

    setHoverData({
      x,
      y,
      longitude: lonStr,
      region,
      sst,
      thermoclineDepth,
      windVector,
      upwellingStrength,
      convection
    });
  };

  const handleMouseLeave = () => {
    setHoverData(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Simulation Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Interactive Pacific Basin Model
            </span>
            <span className="text-xs text-slate-400 font-mono">120°E — 80°W</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 mt-1 flex items-center gap-2">
            <Waves className="w-5 h-5 text-cyan-400" />
            Penampang Melintang Khatulistiwa Pasifik & Sirkulasi Walker
          </h3>
        </div>

        {/* Playback & Speed */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-lg transition ${
              isPlaying ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title={isPlaying ? 'Jeda Simulasi' : 'Jalankan Simulasi'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setSpeed(speed === 1 ? 2 : 1)}
            className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300"
            title="Kecepatan Simulasi"
          >
            {speed}x
          </button>

          <button
            onClick={() => onOniChange(0)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200"
            title="Reset ke Kondisi Normal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative bg-slate-950 flex justify-center items-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={880}
          height={380}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-auto max-h-[460px] cursor-crosshair block"
        />

        {/* Hover Inspector Tooltip */}
        {hoverData && (
          <div
            className="absolute pointer-events-none z-20 bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 rounded-xl p-3 shadow-2xl text-xs space-y-1.5 min-w-[260px]"
            style={{
              left: Math.min(Math.max(hoverData.x - 130, 16), 600),
              top: Math.min(hoverData.y + 15, 230)
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 font-bold text-slate-200">
              <span className="text-cyan-400">{hoverData.longitude}</span>
              <span className="text-slate-400 font-normal">{hoverData.region}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
              <div>
                <span className="text-slate-400">Suhu Permukaan:</span>
                <span className="font-bold ml-1 text-amber-400">{hoverData.sst}°C</span>
              </div>
              <div>
                <span className="text-slate-400">Kedalaman Termoklin:</span>
                <span className="font-bold ml-1 text-cyan-300">{hoverData.thermoclineDepth} m</span>
              </div>
            </div>
            <div className="text-[11px] border-t border-slate-800/80 pt-1 text-slate-300">
              <div className="flex items-start gap-1">
                <Wind className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                <span>{hoverData.windVector}</span>
              </div>
              <div className="flex items-start gap-1 mt-0.5">
                <CloudRain className="w-3 h-3 text-sky-400 shrink-0 mt-0.5" />
                <span>{hoverData.convection}</span>
              </div>
            </div>
          </div>
        )}

        {/* Depth Indicators on Left */}
        <div className="absolute left-2 bottom-4 pointer-events-none text-[10px] font-mono text-slate-500 space-y-4">
          <div>0 m (Muka Laut)</div>
          <div>100 m</div>
          <div>200 m</div>
          <div>300 m (Laut Dalam)</div>
        </div>
      </div>

      {/* Layer Toggles & Interactive ENSO Index Slider */}
      <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold mr-1">Layer:</span>
          <button
            onClick={() => setShowWinds(!showWinds)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              showWinds ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Wind className="w-3 h-3" />
            Angin Pasat
          </button>
          <button
            onClick={() => setShowWalker(!showWalker)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              showWalker ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Sirkulasi Walker
          </button>
          <button
            onClick={() => setShowThermocline(!showThermocline)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              showThermocline ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Termoklin
          </button>
          <button
            onClick={() => setShowUpwelling(!showUpwelling)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              showUpwelling ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Upwelling Peru
          </button>
          <button
            onClick={() => setShowRain(!showRain)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              showRain ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <CloudRain className="w-3 h-3" />
            Awan Hujan
          </button>
        </div>

        {/* Dynamic ENSO / ONI Slider */}
        <div className="w-full md:w-auto flex-1 max-w-md bg-slate-900 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Anomali Suhu Muka Laut (ONI):</span>
            <span
              className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                oniValue > 0.5
                  ? 'bg-rose-500/20 text-rose-400'
                  : oniValue < -0.5
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              {oniValue > 0 ? `+${oniValue.toFixed(1)}` : oniValue.toFixed(1)} °C{' '}
              {oniValue >= 1.5
                ? '(El Niño Kuat)'
                : oniValue >= 0.5
                ? '(El Niño Berkembang)'
                : oniValue <= -1.0
                ? '(La Niña)'
                : '(Netral / Normal)'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-cyan-400 font-mono">-2.5°C</span>
            <input
              type="range"
              min="-2.5"
              max="2.5"
              step="0.1"
              value={oniValue}
              onChange={(e) => onOniChange(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <span className="text-[10px] text-rose-400 font-mono">+2.5°C</span>
          </div>
        </div>
      </div>
    </div>
  );
};
