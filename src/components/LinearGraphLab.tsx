import React, { useMemo, useState } from 'react';
import { CheckCircle2, MinusCircle, Repeat } from 'lucide-react';
import {
  ArLinearEq,
  ArMathBlock,
  ArOp,
  ArPair,
  ArRational,
  ArSet,
} from './ArabicMath';
import {
  formatCleanNumber,
  LinearSystemParams,
  toArabicDigits,
} from '../utils/arabicMath';

interface LinearGraphLabProps {
  system: LinearSystemParams;
  onChangeSystem: (next: LinearSystemParams) => void;
}

const GRAPH_PRESETS: Array<{ label: string; sys: LinearSystemParams }> = [
  {
    label: 'تقاطع: مثال ٦ (حل وحيد)',
    sys: { a1: 1, b1: -1, c1: -1, a2: 2, b2: 1, c2: 4 },
  },
  {
    label: 'توازي: مثال ٨ (م.ح = ∅)',
    sys: { a1: 1, b1: -1, c1: 3, a2: -1, b2: 1, c2: -5 },
  },
  {
    label: 'انطباق: مثال ٩ (حلول لا نهائية)',
    sys: { a1: 1, b1: 1, c1: 3, a2: 2, b2: 2, c2: 6 },
  },
  {
    label: 'مثال ٧ (س + ص = ٥)',
    sys: { a1: 1, b1: 1, c1: 5, a2: 3, b2: -1, c2: 3 },
  },
];

const RANGE = 7;
const SVG_SIZE = 460;
const PAD = 38;
const PLOT_SIZE = SVG_SIZE - PAD * 2;

function toSvgX(x: number): number {
  return PAD + ((x + RANGE) / (2 * RANGE)) * PLOT_SIZE;
}

function toSvgY(y: number): number {
  return PAD + ((RANGE - y) / (2 * RANGE)) * PLOT_SIZE;
}

function getLineSegment(a: number, b: number, c: number) {
  if (a === 0 && b === 0) return null;
  const pts: Array<{ x: number; y: number }> = [];

  if (b !== 0) {
    const yLeft = (c - a * -RANGE) / b;
    if (yLeft >= -RANGE - 0.01 && yLeft <= RANGE + 0.01) {
      pts.push({ x: -RANGE, y: yLeft });
    }
    const yRight = (c - a * RANGE) / b;
    if (yRight >= -RANGE - 0.01 && yRight <= RANGE + 0.01) {
      pts.push({ x: RANGE, y: yRight });
    }
  }
  if (a !== 0) {
    const xTop = (c - b * RANGE) / a;
    if (xTop >= -RANGE - 0.01 && xTop <= RANGE + 0.01) {
      pts.push({ x: xTop, y: RANGE });
    }
    const xBot = (c - b * -RANGE) / a;
    if (xBot >= -RANGE - 0.01 && xBot <= RANGE + 0.01) {
      pts.push({ x: xBot, y: -RANGE });
    }
  }

  // Deduplicate close points
  const unique: Array<{ x: number; y: number }> = [];
  for (const pt of pts) {
    if (!unique.some((u) => Math.hypot(u.x - pt.x, u.y - pt.y) < 0.05)) {
      unique.push(pt);
    }
  }
  if (unique.length < 2) return null;
  return { p1: unique[0], p2: unique[1] };
}

export function LinearGraphLab({ system, onChangeSystem }: LinearGraphLabProps) {
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);

  const { a1, b1, c1, a2, b2, c2 } = system;
  const seg1 = useMemo(() => getLineSegment(a1, b1, c1), [a1, b1, c1]);
  const seg2 = useMemo(() => getLineSegment(a2, b2, c2), [a2, b2, c2]);

  const analysis = useMemo(() => {
    if ((a1 === 0 && b1 === 0) || (a2 === 0 && b2 === 0)) {
      return { type: 'invalid' as const };
    }
    const D = a1 * b2 - a2 * b1;
    const Dx = c1 * b2 - c2 * b1;
    const Dy = a1 * c2 - a2 * c1;
    if (D !== 0) {
      return {
        type: 'unique' as const,
        x: Dx / D,
        y: Dy / D,
        Dx,
        Dy,
        D,
      };
    }
    if (Dx === 0 && Dy === 0) {
      return { type: 'infinite' as const };
    }
    return { type: 'parallel' as const };
  }, [a1, b1, c1, a2, b2, c2]);

  const ticks = Array.from({ length: RANGE * 2 + 1 }, (_, i) => i - RANGE);

  const updateParam = (key: keyof LinearSystemParams, val: number) => {
    onChangeSystem({ ...system, [key]: val });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * SVG_SIZE;
    const py = ((e.clientY - rect.top) / rect.height) * SVG_SIZE;
    const mathX = ((px - PAD) / PLOT_SIZE) * (2 * RANGE) - RANGE;
    const mathY = RANGE - ((py - PAD) / PLOT_SIZE) * (2 * RANGE);
    if (Math.abs(mathX) <= RANGE && Math.abs(mathY) <= RANGE) {
      setHoverCoord({
        x: Math.round(mathX * 2) / 2,
        y: Math.round(mathY * 2) / 2,
      });
    } else {
      setHoverCoord(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Interactive SVG Coordinate Plane (60%+) */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-600 px-1">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-blue-800">
              <span className="w-4 h-1 bg-blue-700 inline-block rounded-full" />
              المستقيم الأول (١)
            </span>
            <span className="inline-flex items-center gap-1.5 text-teal-700">
              <span className="w-4 h-1 bg-teal-600 inline-block rounded-full" />
              المستقيم الثاني (٢)
            </span>
          </div>
          <span className="text-slate-500">
            {hoverCoord
              ? `موضع المؤشر: ( ${hoverCoord.x < 0 ? '−' : ''}${toArabicDigits(formatCleanNumber(Math.abs(hoverCoord.x)))} ، ${hoverCoord.y < 0 ? '−' : ''}${toArabicDigits(formatCleanNumber(Math.abs(hoverCoord.y)))} )`
              : 'حرّك المؤشر على الشبكة لقراءة الإحداثيات'}
          </span>
        </div>

        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="w-full max-w-[520px] mx-auto block select-none rounded-xl bg-slate-50/70 border border-slate-200/80"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverCoord(null)}
          role="img"
          aria-label="المستوى الإحداثي لتمثيل نظام المعادلتين الخطيتين"
        >
          {/* Grid lines */}
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={toSvgX(t)}
                y1={PAD}
                x2={toSvgX(t)}
                y2={SVG_SIZE - PAD}
                stroke={t === 0 ? '#334155' : '#e2e8f0'}
                strokeWidth={t === 0 ? 1.8 : 1}
              />
              <line
                x1={PAD}
                y1={toSvgY(t)}
                x2={SVG_SIZE - PAD}
                y2={toSvgY(t)}
                stroke={t === 0 ? '#334155' : '#e2e8f0'}
                strokeWidth={t === 0 ? 1.8 : 1}
              />
              {t !== 0 && t % 2 === 0 && (
                <>
                  <text
                    x={toSvgX(t)}
                    y={toSvgY(0) + 15}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="#64748b"
                    fontFamily="Cairo, sans-serif"
                  >
                    {t < 0 ? `${toArabicDigits(Math.abs(t))}−` : toArabicDigits(t)}
                  </text>
                  <text
                    x={toSvgX(0) - 10}
                    y={toSvgY(t) + 4}
                    textAnchor="end"
                    fontSize="11"
                    fontWeight="700"
                    fill="#64748b"
                    fontFamily="Cairo, sans-serif"
                  >
                    {t < 0 ? `${toArabicDigits(Math.abs(t))}−` : toArabicDigits(t)}
                  </text>
                </>
              )}
            </g>
          ))}

          {/* Axis Labels */}
          <text
            x={SVG_SIZE - PAD + 14}
            y={toSvgY(0) + 4}
            fontSize="13"
            fontWeight="800"
            fill="#0f172a"
            fontFamily="Cairo, sans-serif"
          >
            س
          </text>
          <text
            x={toSvgX(0)}
            y={PAD - 12}
            textAnchor="middle"
            fontSize="13"
            fontWeight="800"
            fill="#0f172a"
            fontFamily="Cairo, sans-serif"
          >
            ص
          </text>

          {/* Origin label */}
          <text
            x={toSvgX(0) - 9}
            y={toSvgY(0) + 14}
            textAnchor="end"
            fontSize="11"
            fontWeight="700"
            fill="#475569"
            fontFamily="Cairo, sans-serif"
          >
            ٠
          </text>

          {/* Line 1 */}
          {seg1 && (
            <line
              x1={toSvgX(seg1.p1.x)}
              y1={toSvgY(seg1.p1.y)}
              x2={toSvgX(seg1.p2.x)}
              y2={toSvgY(seg1.p2.y)}
              stroke="#1d4ed8"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          )}

          {/* Line 2 (dashed if coincident so both are visible) */}
          {seg2 && (
            <line
              x1={toSvgX(seg2.p1.x)}
              y1={toSvgY(seg2.p1.y)}
              x2={toSvgX(seg2.p2.x)}
              y2={toSvgY(seg2.p2.y)}
              stroke="#0f766e"
              strokeWidth="3.2"
              strokeDasharray={analysis.type === 'infinite' ? '9 6' : undefined}
              strokeLinecap="round"
            />
          )}

          {/* Hover Point */}
          {hoverCoord && (
            <circle
              cx={toSvgX(hoverCoord.x)}
              cy={toSvgY(hoverCoord.y)}
              r="3.5"
              fill="#64748b"
              opacity="0.6"
            />
          )}

          {/* Intersection Point */}
          {analysis.type === 'unique' &&
            Math.abs(analysis.x) <= RANGE &&
            Math.abs(analysis.y) <= RANGE && (
              <g>
                <line
                  x1={toSvgX(analysis.x)}
                  y1={toSvgY(analysis.y)}
                  x2={toSvgX(analysis.x)}
                  y2={toSvgY(0)}
                  stroke="#dc2626"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />
                <line
                  x1={toSvgX(analysis.x)}
                  y1={toSvgY(analysis.y)}
                  x2={toSvgX(0)}
                  y2={toSvgY(analysis.y)}
                  stroke="#dc2626"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />
                <circle
                  cx={toSvgX(analysis.x)}
                  cy={toSvgY(analysis.y)}
                  r="7"
                  fill="#fef2f2"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                />
                <circle
                  cx={toSvgX(analysis.x)}
                  cy={toSvgY(analysis.y)}
                  r="3"
                  fill="#dc2626"
                />
                <text
                  x={toSvgX(analysis.x) + (analysis.x > 3 ? -12 : 12)}
                  y={toSvgY(analysis.y) - 10}
                  textAnchor={analysis.x > 3 ? 'end' : 'start'}
                  fontSize="12"
                  fontWeight="800"
                  fill="#b91c1c"
                  fontFamily="Cairo, sans-serif"
                >
                  نقطة الحل
                </text>
              </g>
            )}
        </svg>
      </div>

      {/* Controls & Status Deck */}
      <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
        <div>
          <p className="text-xs font-bold text-slate-600 mb-2">
            حالات الكتاب الثلاث (ص ١٣٥ – ١٣٩):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {GRAPH_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => onChangeSystem(p.sys)}
                className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-900 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders for Line 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900">المستقيم الأول (١)</span>
            <ArLinearEq a={a1} b={b1} c={c1} />
          </div>
          {(
            [
              { key: 'a1', label: 'معامل س (أ₁)', min: -5, max: 5, val: a1 },
              { key: 'b1', label: 'معامل ص (ب₁)', min: -5, max: 5, val: b1 },
              { key: 'c1', label: 'الحد المطلق (ج₁)', min: -8, max: 8, val: c1 },
            ] as const
          ).map((s) => (
            <label key={s.key} className="block space-y-0.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>{s.label}</span>
                <span className="text-blue-900">
                  {s.val < 0 ? `−${toArabicDigits(Math.abs(s.val))}` : toArabicDigits(s.val)}
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={1}
                value={s.val}
                onChange={(e) => updateParam(s.key, Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </label>
          ))}
        </div>

        {/* Sliders for Line 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-800">المستقيم الثاني (٢)</span>
            <ArLinearEq a={a2} b={b2} c={c2} />
          </div>
          {(
            [
              { key: 'a2', label: 'معامل س (أ₂)', min: -5, max: 5, val: a2 },
              { key: 'b2', label: 'معامل ص (ب₂)', min: -5, max: 5, val: b2 },
              { key: 'c2', label: 'الحد المطلق (ج₂)', min: -8, max: 8, val: c2 },
            ] as const
          ).map((s) => (
            <label key={s.key} className="block space-y-0.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>{s.label}</span>
                <span className="text-teal-800">
                  {s.val < 0 ? `−${toArabicDigits(Math.abs(s.val))}` : toArabicDigits(s.val)}
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={1}
                value={s.val}
                onChange={(e) => updateParam(s.key, Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </label>
          ))}
        </div>

        {/* Live Geometric Result */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
          {analysis.type === 'unique' && (
            <>
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>المستقيمان متقاطعان — يوجد حل وحيد</span>
              </div>
              <ArMathBlock className="py-2.5">
                <span className="text-sm font-bold text-slate-600">م.ح</span>
                <ArOp>=</ArOp>
                <ArSet
                  items={[
                    <ArPair
                      key="sol"
                      x={<ArRational num={analysis.Dx} den={analysis.D} />}
                      y={<ArRational num={analysis.Dy} den={analysis.D} />}
                    />,
                  ]}
                />
              </ArMathBlock>
            </>
          )}
          {analysis.type === 'parallel' && (
            <div className="flex items-start gap-2 text-rose-800 font-bold text-sm">
              <MinusCircle className="w-4 h-4 shrink-0 mt-1" />
              <div>
                <div>المستقيمان متوازيان — لا يوجد تقاطع</div>
                <div className="text-xs font-medium text-rose-700 mt-1">
                  مجموعة الحل = ∅ (الميلان متساويان والجزءان المقطوعان مختلفان).
                </div>
              </div>
            </div>
          )}
          {analysis.type === 'infinite' && (
            <div className="flex items-start gap-2 text-amber-900 font-bold text-sm">
              <Repeat className="w-4 h-4 shrink-0 mt-1" />
              <div>
                <div>المستقيمان منطبقان — عدد لا نهائي من الحلول</div>
                <div className="text-xs font-medium text-amber-800 mt-1">
                  كل نقطة على المستقيم تحقق المعادلتين معاً.
                </div>
              </div>
            </div>
          )}
          {analysis.type === 'invalid' && (
            <div className="text-rose-700 font-bold text-sm">
              أحد المستقيمين غير معرّف لأن معامل س ومعامل ص يساويان صفراً معاً.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
