import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Compass,
  Lightbulb,
  SlidersHorizontal,
  Triangle,
  XCircle,
} from 'lucide-react';
import {
  ArAbs,
  ArDeg,
  ArEq,
  ArExp,
  ArFrac,
  ArMathBlock,
  ArNum,
  ArOp,
  ArRoot,
  ArVar,
} from './ArabicMath';
import { formatCleanNumber, toArabicDigits } from '../utils/arabicMath';

interface WorkedExample {
  id: string;
  title: string;
  source: string;
  statement: React.ReactNode;
  steps: { label: string; math: React.ReactNode; reason: string }[];
}

const UNIT4_EXAMPLES: WorkedExample[] = [
  {
    id: 'euclid',
    title: '١. مبرهنتا إقليدس (١) و (٢) في المثلث القائم',
    source: 'الدرس (٤-١) · مثال ١ · ص ١٦٧',
    statement: (
      <div className="text-sm text-slate-700">
        في المثلث <ArVar name="س ص ع" /> القائم الزاوية في <ArVar name="س" />، رُسم العمود{' '}
        <ArVar name="س ل" /> على الوتر <ArVar name="ص ع" />. إذا كان{' '}
        <ArEq>
          <ArAbs><ArVar name="ص ل" /></ArAbs>
          <ArOp>=</ArOp>
          <ArNum value={16} />
        </ArEq>{' '}
        سم و{' '}
        <ArEq>
          <ArAbs><ArVar name="ل ع" /></ArAbs>
          <ArOp>=</ArOp>
          <ArNum value={9} />
        </ArEq>{' '}
        سم، أوجد طول كلٍّ من <ArAbs><ArVar name="س ص" /></ArAbs> و <ArAbs><ArVar name="س ل" /></ArAbs>.
      </div>
    ),
    steps: [
      {
        label: 'حساب طول الوتر الكامل ص ع',
        math: (
          <ArEq>
            <ArAbs><ArVar name="ص ع" /></ArAbs>
            <ArOp>=</ArOp>
            <ArNum value={16} />
            <ArOp>+</ArOp>
            <ArNum value={9} />
            <ArOp>=</ArOp>
            <ArNum value={25} />
          </ArEq>
        ),
        reason: 'الوتر هو مجموع جزأيه (مسقطي الضلعين القائمين على الوتر).',
      },
      {
        label: 'تطبيق مبرهنة (١) لإيجاد ضلع القائمة س ص',
        math: (
          <ArEq>
            <ArAbs exp={2}><ArVar name="س ص" /></ArAbs>
            <ArOp>=</ArOp>
            <ArAbs><ArVar name="ص ع" /></ArAbs>
            <ArOp>×</ArOp>
            <ArAbs><ArVar name="ص ل" /></ArAbs>
            <ArOp>=</ArOp>
            <ArNum value={25} />
            <ArOp>×</ArOp>
            <ArNum value={16} />
            <ArOp>=</ArOp>
            <ArNum value={400} />
            <ArOp>⇐</ArOp>
            <ArAbs><ArVar name="س ص" /></ArAbs>
            <ArOp>=</ArOp>
            <ArNum value={20} />
          </ArEq>
        ),
        reason:
          'مربع أي ضلع قائمة يساوي حاصل ضرب طول الوتر كاملاً في طول مسقط هذا الضلع على الوتر.',
      },
      {
        label: 'تطبيق مبرهنة (٢) لإيجاد طول العمود النازل س ل',
        math: (
          <ArEq>
            <ArAbs exp={2}><ArVar name="س ل" /></ArAbs>
            <ArOp>=</ArOp>
            <ArAbs><ArVar name="ص ل" /></ArAbs>
            <ArOp>×</ArOp>
            <ArAbs><ArVar name="ل ع" /></ArAbs>
            <ArOp>=</ArOp>
            <ArNum value={16} />
            <ArOp>×</ArOp>
            <ArNum value={9} />
            <ArOp>=</ArOp>
            <ArNum value={144} />
            <ArOp>⇐</ArOp>
            <ArAbs><ArVar name="س ل" /></ArAbs>
            <ArOp>=</ArOp>
            <ArNum value={12} />
          </ArEq>
        ),
        reason:
          'مربع طول العمود النازل من رأس القائمة على الوتر يساوي حاصل ضرب طولَي جزأي الوتر.',
      },
    ],
  },
  {
    id: 'pythagoras',
    title: '٢. مبرهنة فيثاغورث وعكسها (أمثلة ٢ و ٤)',
    source: 'الدرس (٤-١) · ص ١٦٩–١٧٠',
    statement: (
      <div className="text-sm text-slate-700">
        فحص أي المثلثات التالية قائم الزاوية: أضلاعه (<ArNum value={8} />، <ArNum value={15} />، <ArNum value={17} />) أم (<ArNum value={3} />، <ArNum value={5} />، <ArNum value={6} />)؟
      </div>
    ),
    steps: [
      {
        label: 'فحص المثلث الأول (٨ ، ١٥ ، ١٧)',
        math: (
          <ArEq>
            <ArNum value={17} /><ArExp value={2} />
            <ArOp>=</ArOp>
            <ArNum value={289} />
            <span className="px-2 text-slate-400">،</span>
            <ArNum value={8} /><ArExp value={2} />
            <ArOp>+</ArOp>
            <ArNum value={15} /><ArExp value={2} />
            <ArOp>=</ArOp>
            <ArNum value={64} />
            <ArOp>+</ArOp>
            <ArNum value={225} />
            <ArOp>=</ArOp>
            <ArNum value={289} />
          </ArEq>
        ),
        reason:
          'مربع الضلع الأكبر ساوى مجموع مربعي الضلعين الآخرين تماماً؛ إذن المثلث قائم الزاوية (بعكس مبرهنة فيثاغورث).',
      },
      {
        label: 'فحص المثلث الثاني (٣ ، ٥ ، ٦)',
        math: (
          <ArEq>
            <ArNum value={6} /><ArExp value={2} />
            <ArOp>=</ArOp>
            <ArNum value={36} />
            <ArOp>≠</ArOp>
            <ArNum value={3} /><ArExp value={2} />
            <ArOp>+</ArOp>
            <ArNum value={5} /><ArExp value={2} />
            <ArOp>=</ArOp>
            <ArNum value={34} />
          </ArEq>
        ),
        reason: 'بما أن ٣٦ ≠ ٣٤، فإن المثلث ليس قائم الزاوية.',
      },
    ],
  },
  {
    id: 'identities',
    title: '٣. النسب المثلثية والمتطابقتان الأساسيتان',
    source: 'الدرس (٤-٢) · مثال ٥ · ص ١٨١',
    statement: (
      <div className="text-sm text-slate-700">
        إذا كانت <ArVar name="هـ" /> زاوية حادة وكان{' '}
        <ArEq>
          <span className="font-extrabold text-blue-900">جتا</span>
          <ArVar name="هـ" />
          <ArOp>=</ArOp>
          <ArNum value={0.8} />
        </ArEq>
        ، أوجد كلاً من{' '}
        <ArEq>
          <span className="font-extrabold text-teal-800">جا</span>
          <ArVar name="هـ" />
        </ArEq>{' '}
        و{' '}
        <ArEq>
          <span className="font-extrabold text-amber-800">ظا</span>
          <ArVar name="هـ" />
        </ArEq>
        .
      </div>
    ),
    steps: [
      {
        label: 'استخدام المتطابقة الأساسية: جا² هـ + جتا² هـ = ١',
        math: (
          <ArEq>
            <span className="font-extrabold text-teal-800">جا</span>
            <ArExp value={2} />
            <ArVar name="هـ" />
            <ArOp>=</ArOp>
            <ArNum value={1} />
            <ArOp>−</ArOp>
            <ArNum value={0.64} />
            <ArOp>=</ArOp>
            <ArNum value={0.36} />
            <ArOp>⇐</ArOp>
            <span className="font-extrabold text-teal-800">جا</span>
            <ArVar name="هـ" />
            <ArOp>=</ArOp>
            <ArNum value={0.6} />
          </ArEq>
        ),
        reason:
          'أخذنا الجذر الموجب فقط لأن هـ زاوية حادة وجميع نسبها المثلثية موجبة.',
      },
      {
        label: 'إيجاد الظل من علاقة القسمة ظا هـ = جا هـ ÷ جتا هـ',
        math: (
          <ArEq>
            <span className="font-extrabold text-amber-800">ظا</span>
            <ArVar name="هـ" />
            <ArOp>=</ArOp>
            <ArFrac num={<ArNum value={0.6} />} den={<ArNum value={0.8} />} />
            <ArOp>=</ArOp>
            <ArFrac num={<ArNum value={3} />} den={<ArNum value={4} />} />
          </ArEq>
        ),
        reason: 'المتطابقة الثانية تربط الظل مباشرة بنسبة الجيب إلى جيب التمام دون الحاجة لرسم مثلث.',
      },
    ],
  },
  {
    id: 'special',
    title: '٤. الزوايا الخاصة ٣٠° و ٤٥° و ٦٠° (مثال ٢)',
    source: 'الدرس (٤-٣) · ص ١٨٦',
    statement: (
      <div className="text-sm text-slate-700">
        أثبت صحة المتطابقة العددية:{' '}
        <ArEq>
          <ArNum value={1} />
          <ArOp>+</ArOp>
          <span className="font-extrabold text-amber-800">ظا</span>
          <ArExp value={2} />
          <ArDeg value={60} />
          <ArOp>=</ArOp>
          <ArFrac
            num={<ArNum value={1} />}
            den={
              <ArEq>
                <span className="font-extrabold text-blue-900">جتا</span>
                <ArExp value={2} />
                <ArDeg value={60} />
              </ArEq>
            }
          />
        </ArEq>
        .
      </div>
    ),
    steps: [
      {
        label: 'حساب الطرف الأيمن باستخدام ظا ٦٠° = √٣',
        math: (
          <ArEq>
            <span className="text-slate-600 text-sm">الطرف الأيمن</span>
            <ArOp>=</ArOp>
            <ArNum value={1} />
            <ArOp>+</ArOp>
            <ArRoot><ArNum value={3} /></ArRoot>
            <ArExp value={2} />
            <ArOp>=</ArOp>
            <ArNum value={1} />
            <ArOp>+</ArOp>
            <ArNum value={3} />
            <ArOp>=</ArOp>
            <ArNum value={4} />
          </ArEq>
        ),
        reason: 'التربيع يُلغي الجذر التربيعي لـ ٣ مباشرةً فيصبح الناتج ١ + ٣ = ٤.',
      },
      {
        label: 'حساب الطرف الأيسر باستخدام جتا ٦٠° = ١/٢ والمقارنة',
        math: (
          <ArEq>
            <span className="text-slate-600 text-sm">الطرف الأيسر</span>
            <ArOp>=</ArOp>
            <ArFrac
              num={<ArNum value={1} />}
              den={<ArFrac num={<ArNum value={1} />} den={<ArNum value={4} />} />}
            />
            <ArOp>=</ArOp>
            <ArNum value={4} />
            <ArOp>=</ArOp>
            <span className="text-emerald-800 font-extrabold text-sm">الطرف الأيمن</span>
          </ArEq>
        ),
        reason: 'مربع (١/٢) هو (١/٤)، ومقلوب الربع يساوي ٤، وبذلك يثبت تساوي الطرفين.',
      },
    ],
  },
];

const UNIT4_QUIZ = [
  {
    id: 1,
    question: (
      <span>
        في مثلث قائم، إذا كان طولا جزأي الوتر المحددين بالعمود النازل هما <ArNum value={4} /> سم و{' '}
        <ArNum value={9} /> سم، فما طول العمود النازل؟
      </span>
    ),
    options: [
      { id: 'a', label: <span><ArNum value={6} /> سم</span> },
      { id: 'b', label: <span><ArNum value={13} /> سم</span> },
      { id: 'c', label: <span><ArNum value={36} /> سم</span> },
    ],
    correctId: 'a',
    explanation: 'بحسب مبرهنة (٢): مربع العمود = ٤ × ٩ = ٣٦، إذن طول العمود = √٣٦ = ٦ سم.',
  },
  {
    id: 2,
    question: (
      <span>
        ما قيمة المقدار{' '}
        <ArEq>
          <ArNum value={4} />
          <span className="font-extrabold text-teal-800">جا</span>
          <ArDeg value={30} />
          <ArOp>−</ArOp>
          <ArNum value={3} />
          <span className="font-extrabold text-amber-800">ظا</span>
          <ArDeg value={45} />
        </ArEq>{' '}
        (مثال الكتاب ١ ص ١٨٦)؟
      </span>
    ),
    options: [
      { id: 'a', label: <ArNum value={1} /> },
      { id: 'b', label: <ArNum value={-1} /> },
      { id: 'c', label: <ArNum value={2} /> },
    ],
    correctId: 'b',
    explanation: 'جا ٣٠° = ١/٢ و ظا ٤٥° = ١، إذن ٤(١/٢) − ٣(١) = ٢ − ٣ = −١.',
  },
  {
    id: 3,
    question: (
      <span>
        أي مجموعات الأضلاع التالية تشكّل مثلثاً قائم الزاوية؟
      </span>
    ),
    options: [
      { id: 'a', label: '٤ ، ٥ ، ٦' },
      { id: 'b', label: '٥ ، ١٢ ، ١٣' },
      { id: 'c', label: '٣ ، ٥ ، ٦' },
    ],
    correctId: 'b',
    explanation: 'لأن ٥² + ١٢² = ٢٥ + ١٤٤ = ١٦٩ = ١٣²، وهي ثلاثية فيثاغورثية شهيرة.',
  },
];

export function Unit4Trigonometry() {
  const [activeExampleId, setActiveExampleId] = useState<string>(UNIT4_EXAMPLES[0].id);

  // Euclid & Pythagoras Interactive Lab state
  const [projBD, setProjBD] = useState<number>(16);
  const [projDC, setProjDC] = useState<number>(9);

  // Converse of Pythagoras Checker state
  const [sideA, setSideA] = useState<number>(8);
  const [sideB, setSideB] = useState<number>(15);
  const [sideC, setSideC] = useState<number>(17);

  // Interactive Trig Ratios & Special Angles Lab state
  const [angleDeg, setAngleDeg] = useState<number>(30);
  const [hypScale, setHypScale] = useState<number>(10);

  // Quiz state
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const activeExample =
    UNIT4_EXAMPLES.find((e) => e.id === activeExampleId) ?? UNIT4_EXAMPLES[0];

  // Euclid geometry calculations
  const hypBC = projBD + projDC;
  const altAD = Math.sqrt(projBD * projDC);
  const legAB = Math.sqrt(hypBC * projBD);
  const legAC = Math.sqrt(hypBC * projDC);

  // Map right triangle ABC onto SVG (base BC horizontal from x=40 to x=380)
  // In RTL spirit: B on right (380), C on left (40), D splits BC according to projBD from right
  const svgBaseLen = 340;
  const svgX_B = 380;
  const svgX_C = 40;
  const svgY_Base = 215;
  const svgX_D = svgX_B - (projBD / hypBC) * svgBaseLen;
  const svgAlt = Math.sqrt((svgX_B - svgX_D) * (svgX_D - svgX_C));
  const svgX_A = svgX_D;
  const svgY_A = svgY_Base - svgAlt;

  // Converse of Pythagoras check
  const sortedSides = [sideA, sideB, sideC].sort((x, y) => x - y);
  const s1 = sortedSides[0];
  const s2 = sortedSides[1];
  const sMax = sortedSides[2];
  const sumSq = s1 * s1 + s2 * s2;
  const maxSq = sMax * sMax;
  const isValidTriangle = s1 > 0 && s2 > 0 && s1 + s2 > sMax;
  const isRightTriangle = isValidTriangle && Math.abs(sumSq - maxSq) < 1e-6;

  // Trig Lab calculations
  const rad = (angleDeg * Math.PI) / 180;
  const sinVal = Math.sin(rad);
  const cosVal = Math.cos(rad);
  const tanVal = Math.tan(rad);
  const oppLen = hypScale * sinVal;
  const adjLen = hypScale * cosVal;

  // Dynamic right triangle SVG for Trig Lab (fixed visual bounding box scaled gently by hypScale)
  const scaleFactor = 85 + (hypScale / 20) * 115; // 114..200 px hypotenuse
  const trigX_Right = 320;
  const trigY_Base = 215;
  const trigX_Angle = trigX_Right - scaleFactor * cosVal;
  const trigY_Top = trigY_Base - scaleFactor * sinVal;

  const isSpecial = angleDeg === 30 || angleDeg === 45 || angleDeg === 60;

  return (
    <div className="space-y-10">
      {/* Section 1: Philosophy */}
      <section id="philosophy" className="scroll-mt-24">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                الخلفية العلمية وفلسفة الوحدة الرابعة: حساب المثلثات
              </h2>
              <p className="text-slate-600 text-sm md:text-base mt-1 leading-relaxed">
                كيف نقيس ارتفاع جبل أو برج دون أن نصعد إليه؟ السر يكمن في «ثبات النسب في المثلثات القائمة المتشابهة»: مهما كبّرنا المثلث القائم أو صغّرناه، تبقى نسبة الضلع المقابل إلى الوتر (<span className="font-extrabold text-teal-800">جا هـ</span>) ونسبة المجاور إلى الوتر (<span className="font-extrabold text-blue-900">جتا هـ</span>) ثابتتين تماماً ما دامت الزاوية <ArVar name="هـ" /> ثابتة!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-sm">
            <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4 space-y-2">
              <div className="font-extrabold text-teal-900">جيب الزاوية (جا هـ)</div>
              <ArMathBlock className="bg-white border border-teal-100 py-2">
                <ArEq>
                  <span className="font-extrabold text-teal-800">جا</span>
                  <ArVar name="هـ" />
                  <ArOp>=</ArOp>
                  <ArFrac
                    num={<span className="text-teal-800 font-bold text-sm">المقابل</span>}
                    den={<span className="text-amber-800 font-bold text-sm">الوتر</span>}
                  />
                </ArEq>
              </ArMathBlock>
            </div>
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-2">
              <div className="font-extrabold text-blue-900">جيب التمام (جتا هـ)</div>
              <ArMathBlock className="bg-white border border-blue-100 py-2">
                <ArEq>
                  <span className="font-extrabold text-blue-900">جتا</span>
                  <ArVar name="هـ" />
                  <ArOp>=</ArOp>
                  <ArFrac
                    num={<span className="text-blue-900 font-bold text-sm">المجاور</span>}
                    den={<span className="text-amber-800 font-bold text-sm">الوتر</span>}
                  />
                </ArEq>
              </ArMathBlock>
            </div>
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-2">
              <div className="font-extrabold text-amber-900">ظل الزاوية (ظا هـ)</div>
              <ArMathBlock className="bg-white border border-amber-100 py-2">
                <ArEq>
                  <span className="font-extrabold text-amber-800">ظا</span>
                  <ArVar name="هـ" />
                  <ArOp>=</ArOp>
                  <ArFrac
                    num={<span className="text-teal-800 font-bold text-sm">المقابل</span>}
                    den={<span className="text-blue-900 font-bold text-sm">المجاور</span>}
                  />
                </ArEq>
              </ArMathBlock>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Worked Examples */}
      <section id="worked-examples" className="scroll-mt-24 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
              الأمثلة المحلولة من الكتاب المدرسي مع «سبب اتخاذ الخطوة»
            </h2>
            <p className="text-sm text-slate-600">
              مبرهنات إقليدس وفيثاغورث، المتطابقات المثلثية، والزوايا الخاصة.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist">
          {UNIT4_EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              type="button"
              role="tab"
              aria-selected={ex.id === activeExample.id}
              onClick={() => setActiveExampleId(ex.id)}
              className={`px-3.5 py-2 rounded-xl text-sm font-bold border transition-colors cursor-pointer ${
                ex.id === activeExample.id
                  ? 'bg-blue-900 text-white border-blue-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {ex.title}
            </button>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200">
            <h3 className="text-lg font-extrabold text-blue-950">{activeExample.title}</h3>
            <span className="text-xs font-bold text-slate-500">{activeExample.source}</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="text-xs font-bold text-slate-500 mb-1.5">نص المثال:</div>
            {activeExample.statement}
          </div>

          <div className="space-y-4">
            {activeExample.steps.map((step, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                  <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs flex items-center justify-center shrink-0">
                    {toArabicDigits(idx + 1)}
                  </span>
                  <span>{step.label}</span>
                </div>
                <ArMathBlock className="bg-slate-50 border border-slate-200">
                  {step.math}
                </ArMathBlock>
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg px-3.5 py-2.5 flex items-start gap-2 text-sm text-amber-950">
                  <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold">سبب اتخاذ هذه الخطوة: </span>
                    <span>{step.reason}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Interactive Euclid & Pythagoras Lab + Converse Checker */}
      <section id="interactive-trainer" className="scroll-mt-24 space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 shrink-0">
              <Triangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                مختبر مبرهنات إقليدس وفيثاغورث التفاعلي (الدرس ٤-١)
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                حرّك طولَي جزأي الوتر |ب د| و |د جـ| وشاهد المثلث القائم يتشكل تلقائياً داخل نصف الدائرة ويتحقق من المبرهنات الثلاث معاً.
              </p>
            </div>
          </div>

          {/* Quick textbook presets */}
          <div className="flex flex-wrap gap-2">
            {[
              { bd: 16, dc: 9, label: 'مثال الكتاب ١ (١٦ و ٩ ← ٢٠، ١٥، ١٢)' },
              { bd: 9, dc: 4, label: 'أرقام نظيفة (٩ و ٤ ← العمود ٦)' },
              { bd: 8, dc: 2, label: 'نسبة ٨ و ٢ (← العمود ٤)' },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setProjBD(p.bd);
                  setProjDC(p.dc);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-700 cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* SVG Right Triangle with Altitude */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <svg
                  viewBox="0 0 420 250"
                  className="w-full h-auto"
                  role="img"
                  aria-label="مثلث قائم الزاوية مع العمود النازل على الوتر"
                >
                  {/* Semicircle guide (Thales theorem) */}
                  <path
                    d={`M ${svgX_C} ${svgY_Base} A ${svgBaseLen / 2} ${svgBaseLen / 2} 0 0 1 ${svgX_B} ${svgY_Base}`}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />

                  {/* Triangle fill */}
                  <polygon
                    points={`${svgX_B},${svgY_Base} ${svgX_C},${svgY_Base} ${svgX_A},${svgY_A}`}
                    fill="#eff6ff"
                    stroke="#1e3a8a"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />

                  {/* Altitude AD */}
                  <line
                    x1={svgX_A}
                    y1={svgY_A}
                    x2={svgX_D}
                    y2={svgY_Base}
                    stroke="#0f766e"
                    strokeWidth="2.5"
                    strokeDasharray="6 3"
                  />

                  {/* Right angle mark at D */}
                  <rect
                    x={svgX_D}
                    y={svgY_Base - 12}
                    width="12"
                    height="12"
                    fill="none"
                    stroke="#0f766e"
                    strokeWidth="1.8"
                  />

                  {/* Projection segments highlighted */}
                  <line
                    x1={svgX_D}
                    y1={svgY_Base}
                    x2={svgX_B}
                    y2={svgY_Base}
                    stroke="#2563eb"
                    strokeWidth="4"
                  />
                  <line
                    x1={svgX_C}
                    y1={svgY_Base}
                    x2={svgX_D}
                    y2={svgY_Base}
                    stroke="#d97706"
                    strokeWidth="4"
                  />

                  {/* Vertices labels */}
                  <text x={svgX_A} y={svgY_A - 10} textAnchor="middle" className="fill-blue-950 font-extrabold text-sm">
                    أ (٩٠°)
                  </text>
                  <text x={svgX_B + 12} y={svgY_Base + 4} textAnchor="start" className="fill-blue-950 font-extrabold text-sm">
                    ب
                  </text>
                  <text x={svgX_C - 12} y={svgY_Base + 4} textAnchor="end" className="fill-blue-950 font-extrabold text-sm">
                    جـ
                  </text>
                  <text x={svgX_D} y={svgY_Base + 20} textAnchor="middle" className="fill-teal-900 font-extrabold text-sm">
                    د
                  </text>

                  {/* Dynamic length annotations */}
                  <text
                    x={(svgX_D + svgX_B) / 2}
                    y={svgY_Base + 24}
                    textAnchor="middle"
                    className="fill-blue-700 font-bold text-xs"
                  >
                    {toArabicDigits(projBD)}
                  </text>
                  <text
                    x={(svgX_C + svgX_D) / 2}
                    y={svgY_Base + 24}
                    textAnchor="middle"
                    className="fill-amber-700 font-bold text-xs"
                  >
                    {toArabicDigits(projDC)}
                  </text>
                  <text
                    x={svgX_D + 16}
                    y={(svgY_A + svgY_Base) / 2}
                    textAnchor="start"
                    className="fill-teal-800 font-bold text-xs"
                  >
                    {toArabicDigits(formatCleanNumber(altAD))}
                  </text>
                </svg>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-blue-900">
                    <label htmlFor="u4-bd">المسقط الأول |ب د|:</label>
                    <span>{toArabicDigits(projBD)}</span>
                  </div>
                  <input
                    id="u4-bd"
                    type="range"
                    min={1}
                    max={20}
                    step={1}
                    value={projBD}
                    onChange={(e) => setProjBD(Number(e.target.value))}
                    className="w-full accent-blue-700 cursor-pointer"
                  />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-amber-800">
                    <label htmlFor="u4-dc">المسقط الثاني |د جـ|:</label>
                    <span>{toArabicDigits(projDC)}</span>
                  </div>
                  <input
                    id="u4-dc"
                    type="range"
                    min={1}
                    max={20}
                    step={1}
                    value={projDC}
                    onChange={(e) => setProjDC(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Live Verification of Theorems 1, 2, 3 */}
            <div className="lg:col-span-5 space-y-3 text-sm">
              <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3.5 space-y-1">
                <div className="text-xs font-extrabold text-teal-900">مبرهنة (٢) — العمود النازل:</div>
                <ArEq>
                  <ArAbs exp={2}><ArVar name="أ د" /></ArAbs>
                  <ArOp>=</ArOp>
                  <ArNum value={projBD} />
                  <ArOp>×</ArOp>
                  <ArNum value={projDC} />
                  <ArOp>=</ArOp>
                  <ArNum value={projBD * projDC} />
                  <ArOp>⇐</ArOp>
                  <ArAbs><ArVar name="أ د" /></ArAbs>
                  <ArOp>=</ArOp>
                  <ArNum value={Number(formatCleanNumber(altAD))} />
                </ArEq>
              </div>

              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 space-y-1">
                <div className="text-xs font-extrabold text-blue-900">مبرهنة (١) — ضلعا القائمة (الوتر = {toArabicDigits(hypBC)}):</div>
                <div className="space-y-1">
                  <div>
                    <ArEq>
                      <ArAbs><ArVar name="أ ب" /></ArAbs>
                      <ArOp>=</ArOp>
                      <ArRoot><ArNum value={hypBC * projBD} /></ArRoot>
                      <ArOp>=</ArOp>
                      <ArNum value={Number(formatCleanNumber(legAB))} />
                    </ArEq>
                  </div>
                  <div>
                    <ArEq>
                      <ArAbs><ArVar name="أ جـ" /></ArAbs>
                      <ArOp>=</ArOp>
                      <ArRoot><ArNum value={hypBC * projDC} /></ArRoot>
                      <ArOp>=</ArOp>
                      <ArNum value={Number(formatCleanNumber(legAC))} />
                    </ArEq>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-1">
                <div className="text-xs font-extrabold text-emerald-900">مبرهنة (٣) — تحقق فيثاغورث:</div>
                <ArEq>
                  <ArAbs exp={2}><ArVar name="أ ب" /></ArAbs>
                  <ArOp>+</ArOp>
                  <ArAbs exp={2}><ArVar name="أ جـ" /></ArAbs>
                  <ArOp>=</ArOp>
                  <ArNum value={hypBC * projBD} />
                  <ArOp>+</ArOp>
                  <ArNum value={hypBC * projDC} />
                  <ArOp>=</ArOp>
                  <ArNum value={hypBC * hypBC} />
                  <ArOp>=</ArOp>
                  <ArAbs exp={2}><ArVar name="ب جـ" /></ArAbs>
                </ArEq>
              </div>
            </div>
          </div>

          {/* Converse of Pythagoras Interactive Checker */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-extrabold text-slate-900">
                فاحص عكس مبرهنة فيثاغورث: هل المثلث قائم الزاوية؟
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { a: 8, b: 15, c: 17, label: '٨، ١٥، ١٧' },
                  { a: 3, b: 5, c: 6, label: '٣، ٥، ٦' },
                  { a: 6, b: 8, c: 10, label: '٦، ٨، ١٠' },
                  { a: 5, b: 12, c: 13, label: '٥، ١٢، ١٣' },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setSideA(p.a);
                      setSideB(p.b);
                      setSideC(p.c);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-blue-100 text-slate-800 cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-5 grid grid-cols-3 gap-2">
                {[
                  { id: 'sa', label: 'الضلع ١', val: sideA, set: setSideA },
                  { id: 'sb', label: 'الضلع ٢', val: sideB, set: setSideB },
                  { id: 'sc', label: 'الضلع ٣', val: sideC, set: setSideC },
                ].map((f) => (
                  <div key={f.id} className="space-y-1">
                    <label htmlFor={f.id} className="block text-xs font-bold text-slate-600">
                      {f.label}
                    </label>
                    <input
                      id={f.id}
                      type="number"
                      min={1}
                      max={100}
                      value={f.val}
                      onChange={(e) => f.set(Math.max(1, Number(e.target.value) || 1))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-bold text-center"
                    />
                  </div>
                ))}
              </div>

              <div
                className={`md:col-span-7 rounded-xl border p-4 flex items-start gap-2.5 text-sm ${
                  !isValidTriangle
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : isRightTriangle
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                {isRightTriangle ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  {!isValidTriangle ? (
                    <div className="font-bold">
                      هذه الأطوال لا تصلح لتكوين مثلث (مجموع أصغر ضلعين يجب أن يكون أكبر من الضلع الأكبر).
                    </div>
                  ) : (
                    <>
                      <div className="font-extrabold">
                        {isRightTriangle
                          ? 'نعم! هذا المثلث قائم الزاوية (مقابل الضلع الأكبر).'
                          : 'لا، هذا المثلث ليس قائم الزاوية.'}
                      </div>
                      <div>
                        <ArEq>
                          <ArNum value={s1} /><ArExp value={2} />
                          <ArOp>+</ArOp>
                          <ArNum value={s2} /><ArExp value={2} />
                          <ArOp>=</ArOp>
                          <ArNum value={sumSq} />
                          <ArOp>{isRightTriangle ? '=' : '≠'}</ArOp>
                          <ArNum value={maxSq} />
                          <ArOp>=</ArOp>
                          <ArNum value={sMax} /><ArExp value={2} />
                        </ArEq>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Interactive Acute Angle Trig Ratios & Special Angles Lab */}
      <section id="interactive-graph" className="scroll-mt-24">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                مختبر النسب المثلثية والزوايا الخاصة (الدرسان ٤-٢ و ٤-٣)
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                غيّر الزاوية الحادة هـ أو جرّب تكبير الوتر لتلاحظ بنفسك أن جا هـ و جتا هـ و ظا هـ لا تتغير بتكبير المثلث!
              </p>
            </div>
          </div>

          {/* Special Angle Snap Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold text-slate-500">زوايا الكتاب الخاصة:</span>
            {[30, 45, 60].map((deg) => (
              <button
                key={deg}
                type="button"
                onClick={() => setAngleDeg(deg)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-bold border cursor-pointer transition-colors ${
                  angleDeg === deg
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-blue-50'
                }`}
              >
                <ArDeg value={deg} />
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* SVG Color-Coded Right Triangle */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <svg
                  viewBox="0 0 380 250"
                  className="w-full h-auto"
                  role="img"
                  aria-label="مثلث قائم ملون لإيضاح المقابل والمجاور والوتر"
                >
                  {/* Filled triangle */}
                  <polygon
                    points={`${trigX_Right},${trigY_Base} ${trigX_Angle},${trigY_Base} ${trigX_Right},${trigY_Top}`}
                    fill="#f8fafc"
                  />

                  {/* Adjacent (bottom, blue) */}
                  <line
                    x1={trigX_Angle}
                    y1={trigY_Base}
                    x2={trigX_Right}
                    y2={trigY_Base}
                    stroke="#1d4ed8"
                    strokeWidth="4"
                  />

                  {/* Opposite (right vertical, teal) */}
                  <line
                    x1={trigX_Right}
                    y1={trigY_Base}
                    x2={trigX_Right}
                    y2={trigY_Top}
                    stroke="#0f766e"
                    strokeWidth="4"
                  />

                  {/* Hypotenuse (amber) */}
                  <line
                    x1={trigX_Angle}
                    y1={trigY_Base}
                    x2={trigX_Right}
                    y2={trigY_Top}
                    stroke="#d97706"
                    strokeWidth="4"
                  />

                  {/* Right angle mark */}
                  <rect
                    x={trigX_Right - 14}
                    y={trigY_Base - 14}
                    width="14"
                    height="14"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1.8"
                  />

                  {/* Angle label at left vertex */}
                  <text
                    x={trigX_Angle + 28}
                    y={trigY_Base - 8}
                    textAnchor="start"
                    className="fill-slate-900 font-extrabold text-xs"
                  >
                    هـ = {toArabicDigits(angleDeg)}°
                  </text>

                  {/* Side labels */}
                  <text
                    x={(trigX_Angle + trigX_Right) / 2}
                    y={trigY_Base + 22}
                    textAnchor="middle"
                    className="fill-blue-800 font-extrabold text-xs"
                  >
                    المجاور = {toArabicDigits(formatCleanNumber(adjLen))}
                  </text>
                  <text
                    x={trigX_Right + 8}
                    y={(trigY_Base + trigY_Top) / 2}
                    textAnchor="start"
                    className="fill-teal-800 font-extrabold text-xs"
                  >
                    المقابل = {toArabicDigits(formatCleanNumber(oppLen))}
                  </text>
                  <text
                    x={(trigX_Angle + trigX_Right) / 2 - 14}
                    y={(trigY_Base + trigY_Top) / 2 - 10}
                    textAnchor="end"
                    className="fill-amber-700 font-extrabold text-xs"
                  >
                    الوتر = {toArabicDigits(hypScale)}
                  </text>
                </svg>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <label htmlFor="u4-angle">قياس الزاوية الحادة (هـ):</label>
                    <ArDeg value={angleDeg} />
                  </div>
                  <input
                    id="u4-angle"
                    type="range"
                    min={10}
                    max={80}
                    step={1}
                    value={angleDeg}
                    onChange={(e) => setAngleDeg(Number(e.target.value))}
                    className="w-full accent-blue-900 cursor-pointer"
                  />
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-amber-800">
                    <label htmlFor="u4-hyp">حجم المثلث (طول الوتر):</label>
                    <span>{toArabicDigits(hypScale)}</span>
                  </div>
                  <input
                    id="u4-hyp"
                    type="range"
                    min={5}
                    max={20}
                    step={1}
                    value={hypScale}
                    onChange={(e) => setHypScale(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Live Trig Ratios & Exact Special Angle Cards */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3.5 text-center space-y-1.5">
                  <div className="text-xs font-extrabold text-teal-900">
                    جا <ArDeg value={angleDeg} />
                  </div>
                  <div className="text-lg font-extrabold text-teal-950">
                    {angleDeg === 30 ? (
                      <ArFrac num={<ArNum value={1} />} den={<ArNum value={2} />} />
                    ) : angleDeg === 45 ? (
                      <ArFrac num={<ArNum value={1} />} den={<ArRoot><ArNum value={2} /></ArRoot>} />
                    ) : angleDeg === 60 ? (
                      <ArFrac num={<ArRoot><ArNum value={3} /></ArRoot>} den={<ArNum value={2} />} />
                    ) : (
                      <ArNum value={Number(sinVal.toFixed(3))} />
                    )}
                  </div>
                  <div className="text-[11px] font-bold text-teal-800">
                    ≈ {toArabicDigits(sinVal.toFixed(3))}
                  </div>
                </div>

                <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 text-center space-y-1.5">
                  <div className="text-xs font-extrabold text-blue-900">
                    جتا <ArDeg value={angleDeg} />
                  </div>
                  <div className="text-lg font-extrabold text-blue-950">
                    {angleDeg === 30 ? (
                      <ArFrac num={<ArRoot><ArNum value={3} /></ArRoot>} den={<ArNum value={2} />} />
                    ) : angleDeg === 45 ? (
                      <ArFrac num={<ArNum value={1} />} den={<ArRoot><ArNum value={2} /></ArRoot>} />
                    ) : angleDeg === 60 ? (
                      <ArFrac num={<ArNum value={1} />} den={<ArNum value={2} />} />
                    ) : (
                      <ArNum value={Number(cosVal.toFixed(3))} />
                    )}
                  </div>
                  <div className="text-[11px] font-bold text-blue-800">
                    ≈ {toArabicDigits(cosVal.toFixed(3))}
                  </div>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-center space-y-1.5">
                  <div className="text-xs font-extrabold text-amber-900">
                    ظا <ArDeg value={angleDeg} />
                  </div>
                  <div className="text-lg font-extrabold text-amber-950">
                    {angleDeg === 30 ? (
                      <ArFrac num={<ArNum value={1} />} den={<ArRoot><ArNum value={3} /></ArRoot>} />
                    ) : angleDeg === 45 ? (
                      <ArNum value={1} />
                    ) : angleDeg === 60 ? (
                      <ArRoot><ArNum value={3} /></ArRoot>
                    ) : (
                      <ArNum value={Number(tanVal.toFixed(3))} />
                    )}
                  </div>
                  <div className="text-[11px] font-bold text-amber-800">
                    ≈ {toArabicDigits(tanVal.toFixed(3))}
                  </div>
                </div>
              </div>

              {isSpecial && (
                <div className="bg-blue-900 text-white rounded-xl px-4 py-3 text-xs sm:text-sm font-bold">
                  زاوية خاصة من الجدول المقرر! القيم الكسرية الجذرية الدقيقة معروضة أعلاه كما في ص ١٨٥ من الكتاب.
                </div>
              )}

              {/* Live Fundamental Identity Proof */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="text-xs font-extrabold text-slate-600">
                  التحقق اللحظي من المتطابقة الأساسية:
                </div>
                <ArMathBlock className="bg-white border border-slate-200 py-2.5">
                  <ArEq>
                    <span className="font-extrabold text-teal-800">جا</span>
                    <ArExp value={2} />
                    <ArDeg value={angleDeg} />
                    <ArOp>+</ArOp>
                    <span className="font-extrabold text-blue-900">جتا</span>
                    <ArExp value={2} />
                    <ArDeg value={angleDeg} />
                    <ArOp>=</ArOp>
                    <ArNum value={Number((sinVal * sinVal).toFixed(3))} />
                    <ArOp>+</ArOp>
                    <ArNum value={Number((cosVal * cosVal).toFixed(3))} />
                    <ArOp>=</ArOp>
                    <ArNum value={1} />
                  </ArEq>
                </ArMathBlock>
                <div className="text-xs text-slate-600">
                  جرّب تحريك منزلق «طول الوتر»؛ ستتغير أطوال الأضلاع الثلاثة لكن النسب الثلاث تبقى ثابتة تماماً!
                </div>
              </div>
            </div>
          </div>

          {/* Compact Special Angles Reference Table */}
          <div className="border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-center text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-extrabold text-slate-700">النسبة \ الزاوية</th>
                  <th className="py-2.5 px-3 font-extrabold text-blue-950"><ArDeg value={30} /></th>
                  <th className="py-2.5 px-3 font-extrabold text-blue-950"><ArDeg value={45} /></th>
                  <th className="py-2.5 px-3 font-extrabold text-blue-950"><ArDeg value={60} /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2.5 font-extrabold text-teal-800 bg-slate-50/70">جا هـ</td>
                  <td className="py-2.5"><ArFrac num={<ArNum value={1} />} den={<ArNum value={2} />} /></td>
                  <td className="py-2.5"><ArFrac num={<ArNum value={1} />} den={<ArRoot><ArNum value={2} /></ArRoot>} /></td>
                  <td className="py-2.5"><ArFrac num={<ArRoot><ArNum value={3} /></ArRoot>} den={<ArNum value={2} />} /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-extrabold text-blue-900 bg-slate-50/70">جتا هـ</td>
                  <td className="py-2.5"><ArFrac num={<ArRoot><ArNum value={3} /></ArRoot>} den={<ArNum value={2} />} /></td>
                  <td className="py-2.5"><ArFrac num={<ArNum value={1} />} den={<ArRoot><ArNum value={2} /></ArRoot>} /></td>
                  <td className="py-2.5"><ArFrac num={<ArNum value={1} />} den={<ArNum value={2} />} /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-extrabold text-amber-800 bg-slate-50/70">ظا هـ</td>
                  <td className="py-2.5"><ArFrac num={<ArNum value={1} />} den={<ArRoot><ArNum value={3} /></ArRoot>} /></td>
                  <td className="py-2.5"><ArNum value={1} /></td>
                  <td className="py-2.5"><ArRoot><ArNum value={3} /></ArRoot></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 5: Quick Quiz */}
      <section id="quick-quiz" className="scroll-mt-24">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              تحقق من فهمك — اختبر نفسك في الوحدة الرابعة
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              اختر الإجابة الصحيحة لمراجعة مبرهنات المثلث القائم والزوايا الخاصة.
            </p>
          </div>

          <div className="space-y-5">
            {UNIT4_QUIZ.map((q) => {
              const chosen = answers[q.id];
              const isCorrect = chosen === q.correctId;
              return (
                <div
                  key={q.id}
                  className="border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3 bg-slate-50/50"
                >
                  <div className="font-bold text-slate-900 text-sm sm:text-base flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {toArabicDigits(q.id)}
                    </span>
                    <div>{q.question}</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {q.options.map((opt) => {
                      const selected = chosen === opt.id;
                      const showRight = chosen && opt.id === q.correctId;
                      const showWrong = selected && opt.id !== q.correctId;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                          className={`px-3.5 py-2.5 rounded-xl border text-sm font-bold transition-colors cursor-pointer text-right flex items-center justify-between gap-2 ${
                            showRight
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                              : showWrong
                                ? 'bg-rose-50 border-rose-500 text-rose-950'
                                : 'bg-white border-slate-200 text-slate-800 hover:border-blue-400'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {showRight && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
                          {showWrong && <XCircle className="w-4 h-4 text-rose-700 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  {chosen && (
                    <div
                      className={`text-xs sm:text-sm rounded-lg p-3 font-semibold ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-50 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {isCorrect ? 'إجابة صحيحة! ' : 'راجع القاعدة: '}
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
