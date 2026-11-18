import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle, XCircle } from 'lucide-react';
import {
  ArEq,
  ArFrac,
  ArMathBlock,
  ArNum,
  ArOp,
  ArParen,
  ArQuadEq,
  ArRoot,
  ArSet,
  ArTerm,
  ArVar,
} from './ArabicMath';
import { formatCleanNumber, toArabicDigits } from '../utils/arabicMath';

interface QuadExample {
  id: string;
  tabLabel: string;
  title: string;
  tag: string;
  equation: React.ReactNode;
  steps: Array<{ math: React.ReactNode; reason: string }>;
  answer: React.ReactNode;
  preset?: { a: number; b: number; c: number };
}

const QUAD_EXAMPLES: QuadExample[] = [
  {
    id: 'q-fact',
    tabLabel: 'التحليل (مثال ٢)',
    title: 'مثال (٢) — الحل بالتحليل (مقدار ثلاثي غير بسيط)',
    tag: 'ص ١٤٣',
    equation: <ArQuadEq a={2} b={7} c={-15} />,
    steps: [
      {
        math: (
          <ArEq>
            <ArParen>
              <ArTerm coeff={2} varName="س" isFirst={true} />
              <ArOp>−</ArOp>
              <ArNum value={3} />
            </ArParen>
            <ArParen>
              <ArVar name="س" />
              <ArOp>+</ArOp>
              <ArNum value={5} />
            </ArParen>
            <ArOp>=</ArOp>
            <ArNum value={0} />
          </ArEq>
        ),
        reason:
          'تحليل المقدار الثلاثي إلى عاملين خطيين بحيث يكون مجموع ضرب الطرفين والوسطين (١٠س − ٣س = +٧س) هو الحد الأوسط.',
      },
      {
        math: (
          <ArEq>
            <span>إما</span>
            <ArTerm coeff={2} varName="س" isFirst={true} />
            <ArOp>−</ArOp>
            <ArNum value={3} />
            <ArOp>=</ArOp>
            <ArNum value={0} />
            <ArOp>⇐</ArOp>
            <ArVar name="س" />
            <ArOp>=</ArOp>
            <ArFrac num={<ArNum value={3} />} den={<ArNum value={2} />} />
          </ArEq>
        ),
        reason:
          'تطبيق الخاصية الصفرية على العامل الأول، ثم نقل ٣ والقسمة على ٢.',
      },
      {
        math: (
          <ArEq>
            <span>أو</span>
            <ArVar name="س" />
            <ArOp>+</ArOp>
            <ArNum value={5} />
            <ArOp>=</ArOp>
            <ArNum value={0} />
            <ArOp>⇐</ArOp>
            <ArVar name="س" />
            <ArOp>=</ArOp>
            <ArNum value={-5} />
          </ArEq>
        ),
        reason:
          'تطبيق الخاصية الصفرية على العامل الثاني وطرح ٥ من الطرفين.',
      },
    ],
    answer: (
      <ArEq>
        <span>مجموعة الحل</span>
        <ArOp>=</ArOp>
        <ArSet
          items={[
            <ArNum key="1" value={-5} />,
            <ArFrac key="2" num={<ArNum value={3} />} den={<ArNum value={2} />} />,
          ]}
        />
      </ArEq>
    ),
    preset: { a: 2, b: 7, c: -15 },
  },
  {
    id: 'q-cts',
    tabLabel: 'إكمال المربع (مثال ٤)',
    title: 'مثال (٤) — الحل بإكمال المربع',
    tag: 'ص ١٤٥',
    equation: <ArQuadEq a={1} b={2} c={-6} />,
    steps: [
      {
        math: (
          <ArEq>
            <ArTerm coeff={1} varName="س" exp={2} isFirst={true} />
            <ArTerm coeff={2} varName="س" isFirst={false} />
            <ArOp>=</ArOp>
            <ArNum value={6} />
          </ArEq>
        ),
        reason:
          'لا يوجد عددان صحيحان ضربهما −٦ ومجموعهما +٢، لذا ننقل الحد المطلق للطرف الأيسر تمهيداً لإكمال المربع.',
      },
      {
        math: (
          <ArEq>
            <ArTerm coeff={1} varName="س" exp={2} isFirst={true} />
            <ArTerm coeff={2} varName="س" isFirst={false} />
            <ArOp>+</ArOp>
            <ArParen exp={2}>
              <ArFrac num={<ArNum value={2} />} den={<ArNum value={2} />} />
            </ArParen>
            <ArOp>=</ArOp>
            <ArNum value={6} />
            <ArOp>+</ArOp>
            <ArNum value={1} />
          </ArEq>
        ),
        reason:
          'نضيف مربع نصف معامل س — وهو (١)² = ١ — إلى الطرفين لتحويل الطرف الأيمن إلى مربع كامل مع حفظ التوازن.',
      },
      {
        math: (
          <ArEq>
            <ArParen exp={2}>
              <ArVar name="س" />
              <ArOp>+</ArOp>
              <ArNum value={1} />
            </ArParen>
            <ArOp>=</ArOp>
            <ArNum value={7} />
          </ArEq>
        ),
        reason:
          'تحليل المربع الكامل في الطرف الأيمن لحصر س داخل قوس واحد مرفوع للأس ٢.',
      },
      {
        math: (
          <ArEq>
            <ArVar name="س" />
            <ArOp>+</ArOp>
            <ArNum value={1} />
            <ArOp>=</ArOp>
            <ArOp>±</ArOp>
            <ArRoot>
              <ArNum value={7} />
            </ArRoot>
            <ArOp>⇐</ArOp>
            <ArVar name="س" />
            <ArOp>=</ArOp>
            <ArNum value={-1} />
            <ArOp>±</ArOp>
            <ArRoot>
              <ArNum value={7} />
            </ArRoot>
          </ArEq>
        ),
        reason:
          'بأخذ الجذر التربيعي للطرفين مع الإشارة المزدوجة (±)، ثم طرح ١ من الطرفين.',
      },
    ],
    answer: (
      <ArEq>
        <span>مجموعة الحل ≈</span>
        <ArSet items={[<ArNum key="1" value={-3.65} />, <ArNum key="2" value={1.65} />]} />
      </ArEq>
    ),
    preset: { a: 1, b: 2, c: -6 },
  },
  {
    id: 'q-pos',
    tabLabel: 'القانون العام (Δ > ٠)',
    title: 'مثال (١-أ) — حالتان مختلفتان عندما المميز موجب',
    tag: 'ص ١٤٨',
    equation: <ArQuadEq a={1} b={-4} c={-5} />,
    steps: [
      {
        math: (
          <ArEq>
            <ArVar name="أ" />
            <ArOp>=</ArOp>
            <ArNum value={1} />
            <span className="px-1 text-slate-400">،</span>
            <ArVar name="ب" />
            <ArOp>=</ArOp>
            <ArNum value={-4} />
            <span className="px-1 text-slate-400">،</span>
            <ArVar name="ج" />
            <ArOp>=</ArOp>
            <ArNum value={-5} />
          </ArEq>
        ),
        reason: 'استخراج المعاملات بإشاراتها الصحيحة من الصورة العامة.',
      },
      {
        math: (
          <ArEq>
            <ArVar name="Δ" />
            <ArOp>=</ArOp>
            <ArVar name="ب" exp={2} />
            <ArOp>−</ArOp>
            <ArNum value={4} />
            <ArVar name="أ" />
            <ArVar name="ج" />
            <ArOp>=</ArOp>
            <ArParen exp={2}>
              <ArNum value={-4} />
            </ArParen>
            <ArOp>−</ArOp>
            <ArNum value={4} />
            <ArOp>×</ArOp>
            <ArNum value={1} />
            <ArOp>×</ArOp>
            <ArParen>
              <ArNum value={-5} />
            </ArParen>
            <ArOp>=</ArOp>
            <ArNum value={36} />
          </ArEq>
        ),
        reason:
          'حساب المميز أولاً؛ وبما أن ٣٦ > ٠ نتأكد أن للمعادلة حلين حقيقيين مختلفين.',
      },
      {
        math: (
          <ArEq>
            <ArVar name="س" />
            <ArOp>=</ArOp>
            <ArFrac
              num={
                <ArEq>
                  <ArNum value={4} />
                  <ArOp>±</ArOp>
                  <ArRoot>
                    <ArNum value={36} />
                  </ArRoot>
                </ArEq>
              }
              den={<ArNum value={2} />}
            />
            <ArOp>=</ArOp>
            <ArFrac
              num={
                <ArEq>
                  <ArNum value={4} />
                  <ArOp>±</ArOp>
                  <ArNum value={6} />
                </ArEq>
              }
              den={<ArNum value={2} />}
            />
          </ArEq>
        ),
        reason:
          'التعويض في القانون العام وإيجاد جذر المميز (٦) ثم فصل الإشارة الموجبة والسالبة.',
      },
    ],
    answer: (
      <ArEq>
        <span>مجموعة الحل</span>
        <ArOp>=</ArOp>
        <ArSet items={[<ArNum key="1" value={-1} />, <ArNum key="2" value={5} />]} />
      </ArEq>
    ),
    preset: { a: 1, b: -4, c: -5 },
  },
  {
    id: 'q-zero',
    tabLabel: 'القانون العام (Δ = ٠)',
    title: 'مثال (١-ب) — حل حقيقي واحد مكرر',
    tag: 'ص ١٤٩',
    equation: <ArQuadEq a={1} b={-4} c={4} />,
    steps: [
      {
        math: (
          <ArEq>
            <ArVar name="Δ" />
            <ArOp>=</ArOp>
            <ArParen exp={2}>
              <ArNum value={-4} />
            </ArParen>
            <ArOp>−</ArOp>
            <ArNum value={4} />
            <ArOp>×</ArOp>
            <ArNum value={1} />
            <ArOp>×</ArOp>
            <ArNum value={4} />
            <ArOp>=</ArOp>
            <ArNum value={16} />
            <ArOp>−</ArOp>
            <ArNum value={16} />
            <ArOp>=</ArOp>
            <ArNum value={0} />
          </ArEq>
        ),
        reason: 'المميز يساوي صفراً، مما يعني أن المنحنى يمس محور السينات في نقطة واحدة فقط.',
      },
      {
        math: (
          <ArEq>
            <ArVar name="س" />
            <ArOp>=</ArOp>
            <ArFrac num={<ArNum value={4} />} den={<ArNum value={2} />} />
            <ArOp>=</ArOp>
            <ArNum value={2} />
          </ArEq>
        ),
        reason: 'لأن جذر الصفر يساوي صفراً، ينطبق الحلان في قيمة واحدة هي ٢.',
      },
    ],
    answer: (
      <ArEq>
        <span>مجموعة الحل</span>
        <ArOp>=</ArOp>
        <ArSet items={[<ArNum key="1" value={2} />]} />
      </ArEq>
    ),
    preset: { a: 1, b: -4, c: 4 },
  },
  {
    id: 'q-neg',
    tabLabel: 'القانون العام (Δ < ٠)',
    title: 'مثال (١-ج) — لا يوجد حل حقيقي',
    tag: 'ص ١٤٩',
    equation: <ArQuadEq a={1} b={-4} c={6} />,
    steps: [
      {
        math: (
          <ArEq>
            <ArVar name="Δ" />
            <ArOp>=</ArOp>
            <ArNum value={16} />
            <ArOp>−</ArOp>
            <ArNum value={24} />
            <ArOp>=</ArOp>
            <ArNum value={-8} />
            <ArOp>&lt;</ArOp>
            <ArNum value={0} />
          </ArEq>
        ),
        reason:
          'ظهر عدد سالب تحت الجذر التربيعي، ولا يوجد عدد حقيقي مربعه سالب؛ فتتوقف الخطوات فوراً.',
      },
    ],
    answer: (
      <ArEq>
        <span>مجموعة الحل</span>
        <ArOp>=</ArOp>
        <span>∅ (المجموعة الخالية)</span>
      </ArEq>
    ),
    preset: { a: 1, b: -4, c: 6 },
  },
];

const RANGE = 8;
const SVG_SIZE = 440;
const PAD = 36;
const PLOT_SIZE = SVG_SIZE - PAD * 2;

const toSvgX = (x: number) => PAD + ((x + RANGE) / (2 * RANGE)) * PLOT_SIZE;
const toSvgY = (y: number) => PAD + ((RANGE - y) / (2 * RANGE)) * PLOT_SIZE;

export function QuadraticUnitSection() {
  const [activeExId, setActiveExId] = useState<string>(QUAD_EXAMPLES[0].id);
  const [ctsB, setCtsB] = useState<number>(4);

  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-4);
  const [c, setC] = useState<number>(-5);

  const [quizAns, setQuizAns] = useState<Record<number, number>>({});

  const activeEx = QUAD_EXAMPLES.find((e) => e.id === activeExId) ?? QUAD_EXAMPLES[0];

  const halfB = ctsB / 2;
  const halfBSq = halfB * halfB;
  const xBox = 128;
  const wing = 22 + ctsB * 11;
  const padCts = 30;

  const parabolaPath = useMemo(() => {
    const pts: string[] = [];
    const steps = 160;
    let started = false;
    for (let i = 0; i <= steps; i++) {
      const x = -RANGE + (i / steps) * (2 * RANGE);
      const y = a * x * x + b * x + c;
      if (y >= -RANGE - 2 && y <= RANGE + 2) {
        const clampedY = Math.max(-RANGE, Math.min(RANGE, y));
        pts.push(
          `${started ? 'L' : 'M'} ${toSvgX(x).toFixed(1)} ${toSvgY(clampedY).toFixed(1)}`
        );
        started = true;
      } else {
        started = false;
      }
    }
    return pts.join(' ');
  }, [a, b, c]);

  const quadInfo = useMemo(() => {
    if (a === 0) {
      return {
        isLinear: true as const,
        root: b !== 0 ? -c / b : null,
      };
    }
    const delta = b * b - 4 * a * c;
    const vx = -b / (2 * a);
    const vy = a * vx * vx + b * vx + c;
    if (delta > 0) {
      const r1 = (-b - Math.sqrt(delta)) / (2 * a);
      const r2 = (-b + Math.sqrt(delta)) / (2 * a);
      return {
        isLinear: false as const,
        delta,
        vx,
        vy,
        roots: [Math.min(r1, r2), Math.max(r1, r2)],
      };
    }
    if (Math.abs(delta) < 1e-9) {
      return {
        isLinear: false as const,
        delta: 0,
        vx,
        vy,
        roots: [vx],
      };
    }
    return {
      isLinear: false as const,
      delta,
      vx,
      vy,
      roots: [] as number[],
    };
  }, [a, b, c]);

  const ticks = Array.from({ length: RANGE * 2 + 1 }, (_, i) => i - RANGE);

  const loadQuadPreset = (na: number, nb: number, nc: number) => {
    setA(na);
    setB(nb);
    setC(nc);
    document.getElementById('interactive-graph')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-10">
      {/* Section 1: Philosophy */}
      <section id="philosophy" className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
            ١. الخلفية العلمية لمعادلات الدرجة الثانية
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            الدرس (٣-٣) · ص ١٤١ – ١٥١
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
          <p className="text-slate-700 leading-relaxed text-[15px]">
            عندما يظهر المتغير مرفوعاً للأس <strong className="text-rose-700">٢</strong> كما في حساب المساحات أو مسار الأجسام المقذوفة، ننتقل من الخط المستقيم إلى <strong>القطع المكافئ</strong>، ويكون للمعادلة جذران أو جذر واحد مكرر أو لا يوجد لها حل حقيقي.
          </p>

          <ArMathBlock className="bg-white">
            <ArVar name="أ" />
            <ArVar name="س" exp={2} />
            <ArOp>+</ArOp>
            <ArVar name="ب" />
            <ArVar name="س" />
            <ArOp>+</ArOp>
            <ArVar name="ج" />
            <ArOp>=</ArOp>
            <ArNum value={0} />
            <span className="text-sm font-semibold text-slate-500 ps-3">
              حيث <ArEq><ArVar name="أ" /><ArOp>≠</ArOp><ArNum value={0} /></ArEq>
            </span>
          </ArMathBlock>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-xs font-bold text-rose-700 mb-1">لماذا أ ≠ ٠ ؟</div>
              <p className="text-sm text-slate-600">
                لو أصبح أ = ٠ لاختفى الحد <ArEq><ArVar name="أ" /><ArVar name="س" exp={2} /></ArEq> وعادت المعادلة خطية من الدرجة الأولى.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-xs font-bold text-teal-800 mb-1">تدرج طرق الحل</div>
              <p className="text-sm text-slate-600">
                التحليل سريع للأعداد السهلة، وإكمال المربع يكشف البنية الهندسية، ومنه نشتق القانون العام الشامل.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-xs font-bold text-blue-900 mb-1">رادار المميز (Δ)</div>
              <p className="text-sm text-slate-600">
                المقدار <ArEq><ArVar name="Δ" /><ArOp>=</ArOp><ArVar name="ب" exp={2} /><ArOp>−</ArOp><ArNum value={4} /><ArVar name="أ" /><ArVar name="ج" /></ArEq> يحدد عدد الحلول الحقيقية مسبقاً.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Worked Examples */}
      <section id="worked-examples" className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
            ٢. تشريح أمثلة الكتاب مع توضيح الأسس وسبب كل خطوة
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            التحليل · إكمال المربع · القانون العام
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
          {QUAD_EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => setActiveExId(ex.id)}
              className={`px-3.5 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeExId === ex.id
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {ex.tabLabel}
            </button>
          ))}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-teal-800">
              {activeEx.title} · {activeEx.tag}
            </div>
            <div className="text-lg pt-1">{activeEx.equation}</div>
          </div>
          {activeEx.preset && (
            <button
              type="button"
              onClick={() =>
                loadQuadPreset(activeEx.preset!.a, activeEx.preset!.b, activeEx.preset!.c)
              }
              className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-900 text-white hover:bg-blue-950 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              اعرضها في المختبر البياني
            </button>
          )}
        </div>

        <div className="space-y-3">
          {activeEx.steps.map((st, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white border border-slate-200 rounded-xl p-4 items-center"
            >
              <div className="lg:col-span-7 flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-blue-900 font-bold text-sm inline-flex items-center justify-center shrink-0 mt-0.5">
                  {toArabicDigits(idx + 1)}
                </span>
                <div className="flex-1 overflow-x-auto py-0.5 text-base">{st.math}</div>
              </div>
              <div className="lg:col-span-5 bg-amber-50/75 border border-amber-200/90 rounded-lg px-3.5 py-2.5 text-sm text-amber-950">
                <span className="block text-xs font-bold text-amber-800 mb-0.5">
                  سبب اتخاذ هذه الخطوة
                </span>
                {st.reason}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/85 px-4 py-3 text-emerald-950 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          {activeEx.answer}
        </div>
      </section>

      {/* Section 3: Interactive Geometric Completing the Square */}
      <section id="interactive-trainer" className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
            ٣. المختبر الهندسي: لماذا نضيف مربع نصف معامل س؟
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            تجسيد هندسي تفاعلي لإكمال المربع
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <label className="block space-y-2">
              <div className="flex justify-between text-sm font-bold text-slate-800">
                <span>معامل س (ب):</span>
                <span className="text-blue-900">{toArabicDigits(ctsB)}</span>
              </div>
              <input
                type="range"
                min={2}
                max={10}
                step={2}
                value={ctsB}
                onChange={(e) => setCtsB(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </label>

            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-semibold">المقدار الأصلي:</span>
                <ArEq>
                  <ArVar name="س" exp={2} />
                  <ArTerm coeff={ctsB} varName="س" isFirst={false} />
                </ArEq>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-semibold">نصف معامل س:</span>
                <ArEq>
                  <ArFrac num={<ArNum value={ctsB} />} den={<ArNum value={2} />} />
                  <ArOp>=</ArOp>
                  <ArNum value={halfB} />
                </ArEq>
              </div>
              <div className="flex items-center justify-between text-amber-800">
                <span className="font-bold">مساحة الزاوية المفقودة:</span>
                <ArEq>
                  <ArParen exp={2}>
                    <ArNum value={halfB} />
                  </ArParen>
                  <ArOp>=</ArOp>
                  <ArNum value={halfBSq} />
                </ArEq>
              </div>
              <ArMathBlock className="mt-2 py-2.5">
                <ArVar name="س" exp={2} />
                <ArTerm coeff={ctsB} varName="س" isFirst={false} />
                <ArOp>+</ArOp>
                <ArNum value={halfBSq} />
                <ArOp>=</ArOp>
                <ArParen exp={2}>
                  <ArVar name="س" />
                  <ArOp>+</ArOp>
                  <ArNum value={halfB} />
                </ArParen>
              </ArMathBlock>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center bg-slate-50/70 border border-slate-200 rounded-xl p-4">
            <svg
              viewBox="0 0 320 320"
              className="w-full max-w-[320px] h-auto"
              role="img"
              aria-label="نموذج هندسي لإكمال المربع"
            >
              {/* س^2 */}
              <rect
                x={padCts}
                y={padCts}
                width={xBox}
                height={xBox}
                fill="#dbeafe"
                stroke="#1e3a8a"
                strokeWidth="2"
                rx="6"
              />
              <text
                x={padCts + xBox / 2}
                y={padCts + xBox / 2 + 6}
                textAnchor="middle"
                fontFamily="Cairo, sans-serif"
                fontWeight="800"
                fontSize="20"
                fill="#1e3a8a"
              >
                س
                <tspan
                  dy="-8"
                  fontSize="13"
                  fill="#dc2626"
                  fontFamily="Changa, monospace"
                >
                  ٢
                </tspan>
              </text>

              {/* Right strip */}
              <rect
                x={padCts + xBox}
                y={padCts}
                width={wing}
                height={xBox}
                fill="#ccfbf1"
                stroke="#0f766e"
                strokeWidth="2"
                rx="6"
              />
              <text
                x={padCts + xBox + wing / 2}
                y={padCts + xBox / 2 + 5}
                textAnchor="middle"
                fontFamily="Cairo, sans-serif"
                fontWeight="700"
                fontSize="14"
                fill="#0f766e"
              >
                {toArabicDigits(halfB)}س
              </text>

              {/* Bottom strip */}
              <rect
                x={padCts}
                y={padCts + xBox}
                width={xBox}
                height={wing}
                fill="#ccfbf1"
                stroke="#0f766e"
                strokeWidth="2"
                rx="6"
              />
              <text
                x={padCts + xBox / 2}
                y={padCts + xBox + wing / 2 + 5}
                textAnchor="middle"
                fontFamily="Cairo, sans-serif"
                fontWeight="700"
                fontSize="14"
                fill="#0f766e"
              >
                {toArabicDigits(halfB)}س
              </text>

              {/* Missing Corner */}
              <rect
                x={padCts + xBox}
                y={padCts + xBox}
                width={wing}
                height={wing}
                fill="#fef3c7"
                stroke="#d97706"
                strokeWidth="2.4"
                strokeDasharray="6 4"
                rx="6"
              />
              <text
                x={padCts + xBox + wing / 2}
                y={padCts + xBox + wing / 2 + 5}
                textAnchor="middle"
                fontFamily="Cairo, sans-serif"
                fontWeight="800"
                fontSize="14"
                fill="#b45309"
              >
                {toArabicDigits(halfBSq)}
              </text>

              {/* Dimension labels */}
              <text x={padCts + xBox / 2} y={padCts - 10} textAnchor="middle" fontFamily="Cairo" fontWeight="700" fontSize="13" fill="#1e3a8a">س</text>
              <text x={padCts + xBox + wing / 2} y={padCts - 10} textAnchor="middle" fontFamily="Cairo" fontWeight="700" fontSize="13" fill="#0f766e">{toArabicDigits(halfB)}</text>
              <text x={padCts - 13} y={padCts + xBox / 2 + 4} textAnchor="middle" fontFamily="Cairo" fontWeight="700" fontSize="13" fill="#1e3a8a">س</text>
              <text x={padCts - 13} y={padCts + xBox + wing / 2 + 4} textAnchor="middle" fontFamily="Cairo" fontWeight="700" fontSize="13" fill="#0f766e">{toArabicDigits(halfB)}</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Section 4: Interactive Parabola & Discriminant Graph Lab */}
      <section id="interactive-graph" className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
            ٤. المختبر البياني للمعادلة التربيعية والمميز (Δ)
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            نقاط التقاطع مع محور السينات هي جذور المعادلة
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4">
            <svg
              viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
              className="w-full max-w-[500px] mx-auto block select-none rounded-xl bg-slate-50/70 border border-slate-200/80"
              role="img"
              aria-label="التمثيل البياني للدالة التربيعية وجذورها"
            >
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
                      <text x={toSvgX(t)} y={toSvgY(0) + 15} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#64748b" fontFamily="Cairo">
                        {t < 0 ? `${toArabicDigits(Math.abs(t))}−` : toArabicDigits(t)}
                      </text>
                      <text x={toSvgX(0) - 9} y={toSvgY(t) + 4} textAnchor="end" fontSize="10.5" fontWeight="700" fill="#64748b" fontFamily="Cairo">
                        {t < 0 ? `${toArabicDigits(Math.abs(t))}−` : toArabicDigits(t)}
                      </text>
                    </>
                  )}
                </g>
              ))}

              <text x={SVG_SIZE - PAD + 14} y={toSvgY(0) + 4} fontSize="13" fontWeight="800" fill="#0f172a" fontFamily="Cairo">س</text>
              <text x={toSvgX(0)} y={PAD - 11} textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a" fontFamily="Cairo">ص</text>

              {parabolaPath && (
                <path
                  d={parabolaPath}
                  fill="none"
                  stroke="#1d4ed8"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}

              {/* Vertex */}
              {!quadInfo.isLinear &&
                Math.abs(quadInfo.vx) <= RANGE &&
                Math.abs(quadInfo.vy) <= RANGE && (
                  <g>
                    <circle cx={toSvgX(quadInfo.vx)} cy={toSvgY(quadInfo.vy)} r="5.5" fill="#0f766e" stroke="#ffffff" strokeWidth="2" />
                    <text x={toSvgX(quadInfo.vx)} y={toSvgY(quadInfo.vy) + (a > 0 ? 18 : -11)} textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f766e" fontFamily="Cairo">
                      الرأس
                    </text>
                  </g>
                )}

              {/* Roots */}
              {!quadInfo.isLinear &&
                quadInfo.roots.map((r, i) =>
                  Math.abs(r) <= RANGE ? (
                    <g key={i}>
                      <circle cx={toSvgX(r)} cy={toSvgY(0)} r="6.5" fill="#fef2f2" stroke="#dc2626" strokeWidth="2.4" />
                      <circle cx={toSvgX(r)} cy={toSvgY(0)} r="2.6" fill="#dc2626" />
                      <text x={toSvgX(r)} y={toSvgY(0) - 11} textAnchor="middle" fontSize="11" fontWeight="800" fill="#b91c1c" fontFamily="Cairo">
                        س{toArabicDigits(i + 1)}
                      </text>
                    </g>
                  ) : null
                )}
            </svg>
          </div>

          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'مثال ١-أ (Δ > ٠)', a: 1, b: -4, c: -5 },
                { label: 'مثال ١-ب (Δ = ٠)', a: 1, b: -4, c: 4 },
                { label: 'مثال ١-ج (Δ < ٠)', a: 1, b: -4, c: 6 },
                { label: 'مثال ٤ (س²+٢س−٦)', a: 1, b: 2, c: -6 },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setA(p.a);
                    setB(p.b);
                    setC(p.c);
                  }}
                  className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-900 cursor-pointer whitespace-nowrap shrink-0"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              {[
                { label: 'معامل س² (أ)', val: a, set: setA, min: -4, max: 4 },
                { label: 'معامل س (ب)', val: b, set: setB, min: -8, max: 8 },
                { label: 'الحد المطلق (ج)', val: c, set: setC, min: -8, max: 8 },
              ].map((s) => (
                <label key={s.label} className="block space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{s.label}</span>
                    <span className="text-blue-900">
                      {s.val < 0 ? `−${toArabicDigits(Math.abs(s.val))}` : toArabicDigits(s.val)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={0.5}
                    value={s.val}
                    onChange={(e) => s.set(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </label>
              ))}
            </div>

            {quadInfo.isLinear ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 font-bold flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  تنبيه: عندما أ = ٠ يختفي الحد التربيعي وتصبح معادلة خطية (خط مستقيم)! لهذا اشترط التعريف أ ≠ ٠.
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="text-center">
                  <ArQuadEq a={a} b={b} c={c} />
                </div>
                <div className="text-sm text-center font-bold text-slate-700 pt-1 border-t border-slate-100">
                  <ArEq>
                    <ArVar name="Δ" />
                    <ArOp>=</ArOp>
                    <ArNum value={Number(formatCleanNumber(quadInfo.delta))} />
                  </ArEq>
                </div>
                {quadInfo.delta > 0 && (
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-center space-y-1">
                    <div className="text-xs font-bold text-emerald-800">
                      المميز موجب ← حلان حقيقيان مختلفان
                    </div>
                    <ArSet
                      items={quadInfo.roots.map((r, i) => (
                        <ArNum key={i} value={Number(formatCleanNumber(r))} />
                      ))}
                    />
                  </div>
                )}
                {quadInfo.delta === 0 && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-center space-y-1">
                    <div className="text-xs font-bold text-amber-900">
                      المميز يساوي صفراً ← حل واحد مكرر
                    </div>
                    <ArSet
                      items={[
                        <ArNum key="0" value={Number(formatCleanNumber(quadInfo.roots[0]))} />,
                      ]}
                    />
                  </div>
                )}
                {quadInfo.delta < 0 && (
                  <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-center text-xs font-bold text-rose-800">
                    المميز سالب ← لا يوجد تقاطع مع محور السينات (م.ح = ∅)
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 5: Quiz */}
      <section id="quick-quiz" className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
            ٥. تحقق من فهمك (تمارين الدرس ٣-٣)
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            إجابات فورية مع الشرح
          </span>
        </div>

        <div className="space-y-4">
          {[
            {
              prompt: (
                <span>
                  ما مجموعة حل المعادلة <ArQuadEq a={1} b={-16} c={63} />؟
                </span>
              ),
              options: [
                <ArSet key="0" items={[<ArNum key="a" value={-9} />, <ArNum key="b" value={-7} />]} />,
                <ArSet key="1" items={[<ArNum key="a" value={7} />, <ArNum key="b" value={9} />]} />,
                <ArSet key="2" items={[<ArNum key="a" value={-9} />, <ArNum key="b" value={7} />]} />,
                <ArSet key="3" items={[<ArNum key="a" value={3} />, <ArNum key="b" value={21} />]} />,
              ],
              correct: 1,
              note: 'بالتحليل: (س − ٧)(س − ٩) = ٠ لأن (−٧ × −٩ = +٦٣) و (−٧ − ٩ = −١٦).',
            },
            {
              prompt: (
                <span>
                  لإكمال المقدار <ArEq><ArVar name="س" exp={2} /><ArTerm coeff={-10} varName="س" isFirst={false} /></ArEq> ليصبح مربعاً كاملاً، ما العدد الذي نضيفه؟
                </span>
              ),
              options: [
                <ArNum key="0" value={25} showPlus={true} />,
                <ArNum key="1" value={-25} />,
                <ArNum key="2" value={100} showPlus={true} />,
                <ArNum key="3" value={5} showPlus={true} />,
              ],
              correct: 0,
              note: 'نصف معامل س هو −٥، ومربعه (−٥)² = +٢٥ ليصبح (س − ٥)².',
            },
          ].map((q, qIdx) => {
            const chosen = quizAns[qIdx];
            const answered = chosen !== undefined;
            const ok = chosen === q.correct;

            return (
              <div key={qIdx} className="bg-slate-50/75 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex items-start gap-2.5 font-bold text-slate-900">
                  <HelpCircle className="w-5 h-5 text-blue-800 shrink-0 mt-1" />
                  <div>
                    <span className="text-blue-900">السؤال ({toArabicDigits(qIdx + 1)}): </span>
                    {q.prompt}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, oIdx) => {
                    let cls = 'bg-white border-slate-200 text-slate-800 hover:border-blue-600';
                    if (answered) {
                      if (oIdx === q.correct) cls = 'bg-emerald-50 border-emerald-500 text-emerald-950';
                      else if (oIdx === chosen) cls = 'bg-rose-50 border-rose-500 text-rose-950';
                    }
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => setQuizAns((prev) => ({ ...prev, [qIdx]: oIdx }))}
                        className={`px-4 py-3 rounded-xl border text-right font-bold cursor-pointer flex items-center justify-between ${cls}`}
                      >
                        <div>{opt}</div>
                        {answered && oIdx === q.correct && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                        {answered && oIdx === chosen && oIdx !== q.correct && <XCircle className="w-4 h-4 text-rose-700" />}
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <div className={`rounded-lg px-4 py-2.5 text-sm font-semibold border ${ok ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                    <strong>{ok ? 'أحسنت! ' : 'راجع القاعدة: '}</strong>
                    {q.note}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
