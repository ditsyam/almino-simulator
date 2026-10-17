import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  generate50YearOniData,
  LANDMARK_EVENTS,
  OniDataPoint,
  LandmarkEnsoEvent
} from '../data/oniHistoricalData';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Info,
  Maximize2,
  Sparkles,
  Flame,
  ThermometerSnowflake,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

interface OniHistoryChartProps {
  onSelectOniValue?: (oni: number) => void;
}

export const OniHistoryChart: React.FC<OniHistoryChartProps> = ({
  onSelectOniValue
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const rawData = useMemo(() => generate50YearOniData(), []);

  // Filter States
  const [selectedRange, setSelectedRange] = useState<
    'all' | '2010-2026' | '1995-2010' | '1976-1995'
  >('all');
  const [phaseFilter, setPhaseFilter] = useState<'all' | 'el-nino' | 'la-nina' | 'super'>(
    'all'
  );

  // Active hovered point state
  const [activePoint, setActivePoint] = useState<OniDataPoint | null>(null);
  const [activeLandmark, setActiveLandmark] = useState<LandmarkEnsoEvent | null>(
    null
  );

  // Filter data based on selected range
  const filteredData = useMemo(() => {
    let list = rawData;
    if (selectedRange === '2010-2026') {
      list = list.filter((d) => d.year >= 2010);
    } else if (selectedRange === '1995-2010') {
      list = list.filter((d) => d.year >= 1995 && d.year <= 2010);
    } else if (selectedRange === '1976-1995') {
      list = list.filter((d) => d.year <= 1995);
    }
    return list;
  }, [rawData, selectedRange]);

  // Statistics
  const stats = useMemo(() => {
    let max = -999;
    let maxDate = '';
    let min = 999;
    let minDate = '';
    let elNinoCount = 0;
    let laNinaCount = 0;

    rawData.forEach((d) => {
      if (d.oni > max) {
        max = d.oni;
        maxDate = d.date;
      }
      if (d.oni < min) {
        min = d.oni;
        minDate = d.date;
      }
      if (d.oni >= 0.5) elNinoCount++;
      if (d.oni <= -0.5) laNinaCount++;
    });

    return { max, maxDate, min, minDate, elNinoCount, laNinaCount };
  }, [rawData]);

  // D3 Rendering Hook
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth || 900;
    const height = 440;
    const margin = { top: 35, right: 35, bottom: 45, left: 55 };
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous renders

    svg.attr('width', containerWidth).attr('height', height);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse dates: format 'YYYY-MM'
    const parseTime = d3.timeParse('%Y-%m');
    const parsedData = filteredData.map((d) => ({
      ...d,
      parsedDate: parseTime(d.date) as Date
    }));

    // Scales
    const xExtent = d3.extent(parsedData, (d) => d.parsedDate) as [Date, Date];
    const xScale = d3.scaleTime().domain(xExtent).range([0, innerWidth]);

    // Y scale fixed to symmetric -3.0 to +3.0 for standard ONI index
    const yScale = d3.scaleLinear().domain([-2.6, 2.9]).range([innerHeight, 0]);

    // Gradients definitions
    const defs = svg.append('defs');

    // Warm El Niño area gradient
    const elNinoGrad = defs
      .append('linearGradient')
      .attr('id', 'elNinoAreaGrad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    elNinoGrad
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ef4444')
      .attr('stop-opacity', 0.65);
    elNinoGrad
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#f97316')
      .attr('stop-opacity', 0.05);

    // Cool La Niña area gradient
    const laNinaGrad = defs
      .append('linearGradient')
      .attr('id', 'laNinaAreaGrad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    laNinaGrad
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#0284c7')
      .attr('stop-opacity', 0.05);
    laNinaGrad
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#06b6d4')
      .attr('stop-opacity', 0.65);

    // Line gradient (Red above 0, Blue below 0)
    const lineGrad = defs
      .append('linearGradient')
      .attr('id', 'lineGradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', yScale(2.5))
      .attr('x2', 0)
      .attr('y2', yScale(-2.0));

    lineGrad.append('stop').attr('offset', '0%').attr('stop-color', '#f43f5e');
    lineGrad.append('stop').attr('offset', '35%').attr('stop-color', '#fb923c');
    lineGrad.append('stop').attr('offset', '50%').attr('stop-color', '#94a3b8');
    lineGrad.append('stop').attr('offset', '65%').attr('stop-color', '#38bdf8');
    lineGrad.append('stop').attr('offset', '100%').attr('stop-color', '#0284c7');

    // Gridlines
    const yGrid = d3
      .axisLeft(yScale)
      .ticks(7)
      .tickSize(-innerWidth)
      .tickFormat(() => '');

    g.append('g')
      .attr('class', 'grid')
      .call(yGrid)
      .selectAll('line')
      .attr('stroke', '#1e293b')
      .attr('stroke-dasharray', '3,3');

    // Shaded threshold zones
    // Neutral Band: -0.5 to +0.5
    g.append('rect')
      .attr('x', 0)
      .attr('y', yScale(0.5))
      .attr('width', innerWidth)
      .attr('height', yScale(-0.5) - yScale(0.5))
      .attr('fill', '#0f172a')
      .attr('opacity', 0.6);

    // Neutral baseline at y = 0
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0))
      .attr('stroke', '#64748b')
      .attr('stroke-width', 1.2);

    // Threshold lines
    // +0.5 Ambang El Niño
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(0.5))
      .attr('y2', yScale(0.5))
      .attr('stroke', '#f87171')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4');

    // +2.0 Super El Niño
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(2.0))
      .attr('y2', yScale(2.0))
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 1.2)
      .attr('stroke-dasharray', '5,3');

    // -0.5 Ambang La Niña
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(-0.5))
      .attr('y2', yScale(-0.5))
      .attr('stroke', '#38bdf8')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4');

    // -1.5 La Niña Kuat
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(-1.5))
      .attr('y2', yScale(-1.5))
      .attr('stroke', '#0284c7')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4');

    // Area Generators
    // Positive area (> 0)
    const elNinoArea = d3
      .area<any>()
      .x((d) => xScale(d.parsedDate))
      .y0(yScale(0))
      .y1((d) => (d.oni > 0 ? yScale(d.oni) : yScale(0)))
      .curve(d3.curveMonotoneX);

    // Negative area (< 0)
    const laNinaArea = d3
      .area<any>()
      .x((d) => xScale(d.parsedDate))
      .y0(yScale(0))
      .y1((d) => (d.oni < 0 ? yScale(d.oni) : yScale(0)))
      .curve(d3.curveMonotoneX);

    if (phaseFilter !== 'la-nina') {
      g.append('path')
        .datum(parsedData)
        .attr('fill', 'url(#elNinoAreaGrad)')
        .attr('d', elNinoArea);
    }

    if (phaseFilter !== 'el-nino' && phaseFilter !== 'super') {
      g.append('path')
        .datum(parsedData)
        .attr('fill', 'url(#laNinaAreaGrad)')
        .attr('d', laNinaArea);
    }

    // Main ONI Line
    const lineGenerator = d3
      .line<any>()
      .x((d) => xScale(d.parsedDate))
      .y((d) => yScale(d.oni))
      .curve(d3.curveMonotoneX);

    const path = g
      .append('path')
      .datum(parsedData)
      .attr('fill', 'none')
      .attr('stroke', 'url(#lineGradient)')
      .attr('stroke-width', 2.4)
      .attr('d', lineGenerator);

    // Subtle line reveal animation
    const pathLength = path.node()?.getTotalLength() || 0;
    path
      .attr('stroke-dasharray', `${pathLength} ${pathLength}`)
      .attr('stroke-dashoffset', pathLength)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // Landmark Event Markers
    LANDMARK_EVENTS.forEach((lm) => {
      const lmDate = parseTime(lm.date);
      if (
        lmDate &&
        lmDate >= xExtent[0] &&
        lmDate <= xExtent[1]
      ) {
        const cx = xScale(lmDate);
        const cy = yScale(lm.oni);

        const isSuper = lm.oni >= 2.0;
        const isLaNina = lm.oni < 0;

        // Pulsing ring
        const markerGroup = g
          .append('g')
          .attr('class', 'landmark-marker cursor-pointer')
          .on('click', () => {
            setActiveLandmark(lm);
            if (onSelectOniValue) onSelectOniValue(lm.oni);
          });

        markerGroup
          .append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', isSuper ? 7 : 5.5)
          .attr('fill', isLaNina ? '#0284c7' : '#ef4444')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2);

        // Label flag on Super El Niños & Strong La Niñas
        markerGroup
          .append('text')
          .attr('x', cx)
          .attr('y', cy + (isLaNina ? 16 : -11))
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('font-weight', '700')
          .attr('fill', isLaNina ? '#7dd3fc' : '#fca5a5')
          .attr('font-family', 'Plus Jakarta Sans, sans-serif')
          .text(lm.year);
      }
    });

    // Axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(selectedRange === 'all' ? 10 : 8)
      .tickFormat((d) => d3.timeFormat('%Y')(d as Date));

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(7)
      .tickFormat((d) => `${Number(d) > 0 ? '+' : ''}${d}°C`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '11px')
      .attr('font-family', 'JetBrains Mono, monospace');

    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '11px')
      .attr('font-family', 'JetBrains Mono, monospace');

    // Axis Labels
    g.append('text')
      .attr('x', -innerHeight / 2)
      .attr('y', -42)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('fill', '#cbd5e1')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .text('Anomali Suhu Muka Laut (°C)');

    // Threshold labels on right
    g.append('text')
      .attr('x', innerWidth - 6)
      .attr('y', yScale(2.0) - 5)
      .attr('text-anchor', 'end')
      .attr('fill', '#f87171')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .text('Ambang Super El Niño (+2.0°C)');

    g.append('text')
      .attr('x', innerWidth - 6)
      .attr('y', yScale(0.5) - 4)
      .attr('text-anchor', 'end')
      .attr('fill', '#fca5a5')
      .attr('font-size', '9.5px')
      .text('El Niño (+0.5°C)');

    g.append('text')
      .attr('x', innerWidth - 6)
      .attr('y', yScale(-0.5) + 12)
      .attr('text-anchor', 'end')
      .attr('fill', '#7dd3fc')
      .attr('font-size', '9.5px')
      .text('La Niña (-0.5°C)');

    // Interactive Hover Overlay
    const focusGroup = g.append('g').style('display', 'none');

    // Crosshair vertical line
    const crosshair = focusGroup
      .append('line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 1.2)
      .attr('stroke-dasharray', '3,3');

    // Tracking Circle
    const focusCircle = focusGroup
      .append('circle')
      .attr('r', 6)
      .attr('fill', '#38bdf8')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);

    const bisectDate = d3.bisector((d: any) => d.parsedDate).center;

    // Invisible mouse event tracking rect
    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .on('mouseenter', () => focusGroup.style('display', null))
      .on('mouseleave', () => {
        focusGroup.style('display', 'none');
        setActivePoint(null);
      })
      .on('mousemove', function (event) {
        const [mx] = d3.pointer(event);
        const xDate = xScale.invert(mx);
        const idx = bisectDate(parsedData, xDate);
        const d = parsedData[idx];
        if (!d) return;

        const cx = xScale(d.parsedDate);
        const cy = yScale(d.oni);

        crosshair.attr('x1', cx).attr('x2', cx);
        focusCircle
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('fill', d.oni >= 0 ? '#ef4444' : '#0284c7');

        setActivePoint(d);
      })
      .on('click', function (event) {
        const [mx] = d3.pointer(event);
        const xDate = xScale.invert(mx);
        const idx = bisectDate(parsedData, xDate);
        const d = parsedData[idx];
        if (d && onSelectOniValue) {
          onSelectOniValue(d.oni);
        }
      });
  }, [filteredData, selectedRange, phaseFilter, onSelectOniValue]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 bg-slate-950/80 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              D3.js Data Visualization
            </span>
            <span className="text-xs text-slate-400 font-mono">
              NOAA Oceanic Niño Index (ONI) 1976 — 2026
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-rose-400" />
            Grafik Garis Interaktif 50 Tahun Indeks ONI
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Rekam jejak anomali suhu permukaan laut (SST) zona Niño 3.4 di Samudra Pasifik selama 5 dekade terakhir.
          </p>
        </div>

        {/* Range Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedRange('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              selectedRange === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            50 Tahun (1976-2026)
          </button>
          <button
            onClick={() => setSelectedRange('2010-2026')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              selectedRange === '2010-2026'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2010 — 2026
          </button>
          <button
            onClick={() => setSelectedRange('1995-2010')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              selectedRange === '1995-2010'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1995 — 2010
          </button>
          <button
            onClick={() => setSelectedRange('1976-1995')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              selectedRange === '1976-1995'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1976 — 1995
          </button>
        </div>
      </div>

      {/* Statistics Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-800 bg-slate-950/40 divide-x divide-slate-800">
        <div className="p-3.5 sm:p-4 text-center">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            Rekor Tertinggi (Super El Niño)
          </div>
          <div className="text-lg sm:text-xl font-mono font-extrabold text-rose-400 mt-0.5">
            +{stats.max.toFixed(1)}°C
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {stats.maxDate} (Monster El Niño)
          </div>
        </div>

        <div className="p-3.5 sm:p-4 text-center">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            Rekor Terendah (La Niña Kuat)
          </div>
          <div className="text-lg sm:text-xl font-mono font-extrabold text-cyan-400 mt-0.5">
            {stats.min.toFixed(1)}°C
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {stats.minDate} (La Niña Dahsyat)
          </div>
        </div>

        <div className="p-3.5 sm:p-4 text-center">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            Bulan Fase El Niño (≥ +0.5°C)
          </div>
          <div className="text-lg sm:text-xl font-mono font-extrabold text-amber-300 mt-0.5">
            {stats.elNinoCount} Bulan
          </div>
          <div className="text-[10px] text-slate-400">
            {((stats.elNinoCount / 612) * 100).toFixed(0)}% dari total periode
          </div>
        </div>

        <div className="p-3.5 sm:p-4 text-center">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            Bulan Fase La Niña (≤ -0.5°C)
          </div>
          <div className="text-lg sm:text-xl font-mono font-extrabold text-sky-400 mt-0.5">
            {stats.laNinaCount} Bulan
          </div>
          <div className="text-[10px] text-slate-400">
            {((stats.laNinaCount / 612) * 100).toFixed(0)}% dari total periode
          </div>
        </div>
      </div>

      {/* Main SVG Container */}
      <div ref={containerRef} className="p-4 sm:p-6 bg-slate-950 relative overflow-x-auto">
        <svg ref={svgRef} className="w-full block" />

        {/* Floating Tooltip when hovering over chart */}
        {activePoint && (
          <div className="absolute top-8 left-8 pointer-events-none bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3 shadow-2xl text-xs z-30 min-w-[240px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5 font-bold">
              <span className="text-slate-100 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                {activePoint.date} ({activePoint.season})
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  activePoint.oni >= 2.0
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : activePoint.oni >= 0.5
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : activePoint.oni <= -0.5
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {activePoint.phase.replace(/-/g, ' ')}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Indeks ONI:</span>
              <span
                className={`font-mono font-extrabold text-sm ${
                  activePoint.oni >= 0.5
                    ? 'text-rose-400'
                    : activePoint.oni <= -0.5
                    ? 'text-cyan-400'
                    : 'text-slate-200'
                }`}
              >
                {activePoint.oni > 0 ? `+${activePoint.oni.toFixed(1)}` : activePoint.oni.toFixed(1)}°C
              </span>
            </div>

            {activePoint.eventNote && (
              <div className="mt-1 pt-1 border-t border-slate-800 text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400 shrink-0" />
                {activePoint.eventNote}
              </div>
            )}

            <div className="mt-2 pt-1 border-t border-slate-800/80 text-[10px] text-cyan-300/80 italic">
              Klik titik ini untuk menyinkronkan simulasi samudra
            </div>
          </div>
        )}
      </div>

      {/* Historical Landmark Events Drawer / Cards */}
      <div className="p-6 bg-slate-950/90 border-t border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            Peristiwa Fenomenal Bersejarah (Klik untuk Memuat ke Model):
          </h4>
          <span className="text-[11px] text-slate-400 font-mono">
            Tersedia 8 Titik Kritis
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {LANDMARK_EVENTS.map((lm) => (
            <button
              key={lm.year}
              onClick={() => {
                setActiveLandmark(lm);
                if (onSelectOniValue) onSelectOniValue(lm.oni);
              }}
              className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                activeLandmark?.year === lm.year
                  ? 'bg-cyan-500/20 border-cyan-500/60 text-white shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-100 flex items-center gap-1">
                    {lm.type === 'el-nino' ? (
                      <Flame className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                    {lm.title}
                  </span>
                  <span
                    className={`font-mono text-[11px] font-bold ${
                      lm.oni >= 0 ? 'text-rose-400' : 'text-cyan-400'
                    }`}
                  >
                    {lm.oni > 0 ? `+${lm.oni.toFixed(1)}` : lm.oni.toFixed(1)}°C
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mt-1">
                  {lm.description}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-cyan-400 font-semibold">
                <span>Puncak: {lm.date}</span>
                <span className="flex items-center gap-0.5">
                  Simulasikan
                  <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
