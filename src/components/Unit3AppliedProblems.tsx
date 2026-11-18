import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Compass, Lightbulb, SlidersHorizontal, XCircle } from 'lucide-react';
import {
  ArEq,
  ArFrac,
  ArLinearEq,
  ArMathBlock,
  ArNum,
  ArOp,
  ArParen,
  ArQuadEq,
  ArSystem,
  ArTerm,
  ArVar,
} from './ArabicMath';
import { toArabicDigits } from '../utils/arabicMath';

interface WordProblem {
  id: string;
  title: string;
  source: string;
  story: string;
  translations: { phrase: string; math: React.ReactNode }[];
  steps: { label: string; math: React.ReactNode; reason: string }[];
}

const APPLIED_PROBLEMS: WordProblem[] = [
  {
    id: 'bookMag',
    title: '١. مسألة الكتاب والمجلة (نظام خطي)',
    source: 'الدرس (٣-٤) · مثال ١ · ص ١٥٣',
    story:
      'اشترى طالب كتاباً ومجلة بمبلغ ٧٥ ريالاً، فإذا كان الفرق بين ثمن الكتاب وثمن المجلة يساوي ٢١ ريالاً، فما ثمن كلٍّ منهما؟',
    translations: [
      {
        phrase: 'ثمن الكتاب = س، وثمن المجلة = ص',
        math: (
          <ArEq>
            <ArVar name="س" />
            <span className="px-1 text-slate-400">،</span>
            <ArVar name="ص" />
          </ArEq>
        ),
      },
      {
        phrase: 'ثمنهما معاً يساوي ٧٥ ريالاً',
        math: <ArLinearEq a={1} b={1} c={75} />,
      },
      {
        phrase: 'الفرق بين ثمن الكتاب وثمن المجلة ٢١ ريالاً',
        math: <ArLinearEq a={1} b={-1} c={21} />,
      },
    ],
    steps: [
      {
        label: 'تكوين نظام المعادلتين',
        math: (
          <ArSystem
            eq1={<ArLinearEq a={1} b={1} c={75} />}
            eq2={<ArLinearEq a={1} b={-1} c={21} />}
          />
        ),
        reason:
          'حولنا كل جملة لفظية في المسألة إلى معادلة رياضية بمتغيرين؛ الآن معامل ص متعاكس الإشارة (+١ و −١).',
      },
      {
        label: 'الحل بالجمع (طريقة الحذف)',
        math: (
          <ArEq>
            <ArTerm coeff={2} varName="س" isFirst={true} />
            <ArOp>=</ArOp>
            <ArNum value={96} />
            <ArOp>⇐</ArOp>
            <ArVar name="س" />
            <ArOp>=</ArOp>
            <ArNum value={48} />
          </ArEq>
        ),
        reason: 'بجمع المعادلتين ينحذف المتغير ص مباشرةً دون أي ضرب إضافي.',
      },
      {
        label: 'إيجاد ثمن المجلة والتحقق',
        math: (
          <ArEq>
            <ArNum value={48} />
            <ArOp>+</ArOp>
            <ArVar name="ص" />
            <ArOp>=</ArOp>
            <ArNum value={75} />
            <ArOp>⇐</ArOp>
            <ArVar name="ص" />
            <ArOp>=</ArOp>
            <ArNum value={27} />
          </ArEq>
        ),
        reason: 'نتحقق بالمسألة الأصلية: ٤٨ + ٢٧ = ٧٥ ريالاً، و ٤٨ − ٢٧ = ٢١ ريالاً.',
      },
    ],
  },
  {
    id: 'adelToys',
    title: '٢. مسألة ألعاب عادل (معادلة تربيعية)',
    source: 'الدرس (٣-٤) · مثال ٢ · ص ١٥٤',
    story:
      'اشترى عادل عدداً من اللعب المتماثلة بمبلغ ١٢٠٠ ريال، ولو خُفّض ثمن اللعبة الواحدة ١٠ ريالات لاستطاع شراء ٤ لعب إضافية بنفس المبلغ. ما ثمن اللعبة الواحدة؟',
    translations: [
      {
        phrase: 'ثمن اللعبة الواحدة = س ← عدد اللعب قبل التخفيض',
        math: <ArFrac num={<ArNum value={1200} />} den={<ArVar name="س" />} />,
      },
      {
        phrase: 'عدد اللعب بعد تخفيض ١٠ ريالات من ثمن الواحدة',
        math: (
          <ArFrac
            num={<ArNum value={1200} />}
            den={
              <ArEq>
                <ArVar name="س" />
                <ArOp>−</ArOp>
                <ArNum value={10} />
              </ArEq>
            }
          />
        ),
      },
      {
        phrase: 'الفرق بين العددين يساوي ٤ لعب إضافية',
        math: (
          <ArEq>
            <ArFrac
              num={<ArNum value={1200} />}
              den={
                <ArEq>
                  <ArVar name="س" />
                  <ArOp>−</ArOp>
                  <ArNum value={10} />
                </ArEq>
              }
            />
            <ArOp>−</ArOp>
            <ArFrac num={<ArNum value={1200} />} den={<ArVar name="س" />} />
            <ArOp>=</ArOp>
            <ArNum value={4} />
          </ArEq>
        ),
      },
    ],
    steps: [
      {
        label: 'التخلص من المقامات بضرب الطرفين في س(س − ١٠) والقسمة على ٤',
        math: <ArQuadEq a={1} b={-10} c={-3000} />,
        reason:
          'نحول المعادلة الكسرية إلى معادلة تربيعية قياسية لتسهيل تحليلها.',
      },
      {
        label: 'التحليل إلى عاملين',
        math: (
          <ArEq>
            <ArParen>
              <ArVar name="س" />
              <ArOp>−</ArOp>
              <ArNum value={60} />
            </ArParen>
            <ArParen>
              <ArVar name="س" />
              <ArOp>+</ArOp>
              <ArNum value={50} />
            </ArParen>
            <ArOp>=</ArOp>
            <ArNum value={0} />
          </ArEq>
        ),
        reason: 'نبحث عن عددين حاصل ضربهما −٣٠٠٠ والفرق بينهما −١٠، وهما −٦٠ و +٥٠.',
      },
      {
        label: 'اختيار الحل المقبول واقعياً',
        math: (
          <ArEq>
            <ArVar name="س" />
            <ArOp>=</ArOp>
            <ArNum value={60} />
            <span className="px-2 text-slate-500 text-sm">(ويُرفض س = −٥٠ لأن السعر موجب)</span>
          </ArEq>
        ),
        reason:
          'في المسائل التطبيقية نرفض القيم السالبة للأثمان والأطوال والأعداد؛ إذن ثمن اللعبة ٦٠ ريالاً (واشترى ٢٠ لعبة).',
      },
    ],
  },
  {
    id: 'kindergarten',
    title: '٣. مسألة روضة الأطفال (نظام خطي)',
    source: 'الدرس (٣-٤) · مثال ٣ · ص ١٥٥',
    story:
      'في روضة أطفال يزيد عدد البنات على عدد الأولاد بمقدار ١٠، وإذا انضمت بنت واحدة أصبح عدد البنات ضعف عدد الأولاد. أوجد عدد البنات والأولاد.',
    translations: [
      {
        phrase: 'عدد البنات = س، وعدد الأولاد = ص',
        math: (
          <ArEq>
            <ArVar name="س" />
            <span className="px-1 text-slate-400">،</span>
            <ArVar name="ص" />
          </ArEq>
        ),
      },
      {
        phrase: 'عدد البنات يزيد على الأولاد بـ ١٠',
        math: <ArLinearEq a={1} b={-1} c={10} />,
      },
      {
        phrase: 'إذا زادت بنت واحدة أصبح العدد ضعف الأولاد',
        math: (
          <ArEq>
            <ArVar name="س" />
            <ArOp>+</ArOp>
            <ArNum value={1} />
            <ArOp>=</ArOp>
            <ArTerm coeff={2} varName="ص" isFirst={true} />
          </ArEq>
        ),
      },
    ],
    steps: [
      {
        label: 'التعويض بـ س = ص + ١٠ في المعادلة الثانية',
        math: (
          <ArEq>
            <ArParen>
              <ArVar name="ص" />
              <ArOp>+</ArOp>
              <ArNum value={10} />
            </ArParen>
            <ArOp>+</ArOp>
            <ArNum value={1} />
            <ArOp>=</ArOp>
            <ArTerm coeff={2} varName="ص" isFirst={true} />
          </ArEq>
        ),
        reason: 'المتغير س معزول بسهولة في المعادلة الأولى فالتعويض هو الأسرع.',
      },
      {
        label: 'إيجاد عدد الأولاد ثم عدد البنات',
        math: (
          <ArEq>
            <ArVar name="ص" />
            <ArOp>=</ArOp>
            <ArNum value={11} />
            <ArOp>⇐</ArOp>
            <ArVar name="س" />
            <ArOp>=</ArOp>
            <ArNum value={11} />
            <ArOp>+</ArOp>
            <ArNum value={10} />
            <ArOp>=</ArOp>
            <ArNum value={21} />
          </ArEq>
        ),
        reason: 'التحقق: ٢١ − ١١ = ١٠، وإذا زادت بنت تصبح ٢٢ وهي فعلاً ضعف ١١.',
      },
    ],
  },
];

export function Unit3AppliedProblems() {
  const [activeId, setActiveId] = useState<string>(APPLIED_PROBLEMS[0].id);

  // Interactive sum-and-difference problem generator
  const [totalPrice, setTotalPrice] = useState<number>(75);
  const [diffPrice, setDiffPrice] = useState<number>(21);
  const [quizAns, setQuizAns] = useState<string | null>(null);

  const active = APPLIED_PROBLEMS.find((p) => p.id === activeId) ?? APPLIED_PROBLEMS[0];

  // Ensure parity matches so prices are clean whole numbers
  const effectiveDiff =
    (totalPrice - diffPrice) % 2 === 0 ? diffPrice : diffPrice + 1;
  const bookPrice = (totalPrice + effectiveDiff) / 2;
  const magPrice = (totalPrice - effectiveDiff) / 2;

  return (
    <div className="space-y-10">
      {/* Philosophy */}
      <section id="philosophy" className="scroll-mt-24">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                فلسفة الدرس (٣-٤): كيف تترجم المسألة اللفظية إلى معادلات؟
              </h2>
              <p className="text-sm md:text-base text-slate-600 mt-1 leading-relaxed">
                السر في حل أي مسألة حياتية هو اتباع أربع خطوات ثابتة: (١) تسمية المجهول بوضوح مثل <ArVar name="س" /> و <ArVar name="ص" />، (٢) تحويل كل عبارة لفظية («يزيد»، «ضعف»، «الفرق») إلى علاقة جبرية، (٣) حل المعادلة، (٤) التحقق من معقولية الناتج ورفض القيم غير الواقعية كالسعر السالب.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Worked Examples */}
      <section id="worked-examples" className="scroll-mt-24 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              أمثلة الكتاب المحلولة (مترجم الكلمات إلى معادلات)
            </h2>
            <p className="text-sm text-slate-600">
              شاهد كيف تتحول الجمل العربية إلى معادلات مرتّبة ثم تُحل خطوة بخطوة.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {APPLIED_PROBLEMS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveId(p.id)}
              className={`px-3.5 py-2 rounded-xl text-sm font-bold border cursor-pointer transition-colors ${
                p.id === active.id
                  ? 'bg-blue-900 text-white border-blue-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200">
            <h3 className="text-lg font-extrabold text-blue-950">{active.title}</h3>
            <span className="text-xs font-bold text-slate-500">{active.source}</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm sm:text-base text-slate-800 leading-relaxed font-semibold">
            {active.story}
          </div>

          {/* Phrase to Math Table */}
          <div className="space-y-2">
            <div className="text-xs font-extrabold text-teal-800">ترجمة العبارات إلى رموز:</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {active.translations.map((t, i) => (
                <div
                  key={i}
                  className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 space-y-2"
                >
                  <div className="text-xs font-bold text-slate-700">{t.phrase}</div>
                  <div className="bg-white border border-blue-100 rounded-lg py-2 px-3 text-center">
                    {t.math}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solution Steps */}
          <div className="space-y-3">
            {active.steps.map((s, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                  <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs flex items-center justify-center shrink-0">
                    {toArabicDigits(idx + 1)}
                  </span>
                  <span>{s.label}</span>
                </div>
                <ArMathBlock className="bg-slate-50 border border-slate-200">
                  {s.math}
                </ArMathBlock>
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg px-3.5 py-2.5 flex items-start gap-2 text-sm text-amber-950">
                  <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold">سبب اتخاذ هذه الخطوة: </span>
                    <span>{s.reason}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Scenario Builder */}
      <section id="interactive-trainer" className="scroll-mt-24">
        <div
          id="interactive-graph"
          className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 shrink-0">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                مختبر بناء وحل مسائل المجموع والفرق فورياً
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                غيّر المبلغ الكلي والفرق بين السلعتين لتشاهد كيف يتغير النظام الخطي وثمن كل سلعة تلقائياً.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <label htmlFor="wp-total">المجموع الكلي (س + ص):</label>
                <span>{toArabicDigits(totalPrice)} ريالاً</span>
              </div>
              <input
                id="wp-total"
                type="range"
                min={30}
                max={150}
                step={2}
                value={totalPrice}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTotalPrice(val);
                  if (diffPrice >= val - 6) setDiffPrice(Math.max(4, val - 10));
                }}
                className="w-full accent-blue-900 cursor-pointer"
              />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <label htmlFor="wp-diff">الفرق بينهما (س − ص):</label>
                <span>{toArabicDigits(effectiveDiff)} ريالاً</span>
              </div>
              <input
                id="wp-diff"
                type="range"
                min={4}
                max={Math.max(6, totalPrice - 10)}
                step={2}
                value={diffPrice}
                onChange={(e) => setDiffPrice(Number(e.target.value))}
                className="w-full accent-teal-700 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <ArMathBlock className="bg-slate-50 border border-slate-200">
              <ArSystem
                eq1={<ArLinearEq a={1} b={1} c={totalPrice} />}
                eq2={<ArLinearEq a={1} b={-1} c={effectiveDiff} />}
              />
            </ArMathBlock>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 space-y-2">
              <div className="text-xs font-extrabold text-emerald-900">الحل المباشر بالجمع:</div>
              <div className="text-sm font-bold text-slate-900">
                ثمن الكتاب (<ArVar name="س" />) = <ArNum value={bookPrice} /> ريالاً
              </div>
              <div className="text-sm font-bold text-slate-900">
                ثمن المجلة (<ArVar name="ص" />) = <ArNum value={magPrice} /> ريالاً
              </div>
              <div className="text-xs text-emerald-900 pt-1">
                التحقق: {toArabicDigits(bookPrice)} + {toArabicDigits(magPrice)} = {toArabicDigits(totalPrice)}، والفرق = {toArabicDigits(effectiveDiff)}.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Quiz */}
      <section id="quick-quiz" className="scroll-mt-24">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900">تحقق من فهمك (المسائل التطبيقية)</h2>
          <p className="text-sm font-bold text-slate-800">
            عددان موجبان مجموعهما ١٥ وحاصل ضربهما ٥٦. ما المعادلة التربيعية التي يمثلها أحد العددين (س)؟
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'a', label: <ArQuadEq a={1} b={-15} c={56} /> },
              { id: 'b', label: <ArQuadEq a={1} b={15} c={56} /> },
              { id: 'c', label: <ArQuadEq a={1} b={-56} c={15} /> },
            ].map((opt) => {
              const right = quizAns && opt.id === 'a';
              const wrong = quizAns === opt.id && opt.id !== 'a';
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setQuizAns(opt.id)}
                  className={`px-3.5 py-2.5 rounded-xl border text-sm font-bold cursor-pointer flex items-center justify-between ${
                    right
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                      : wrong
                        ? 'bg-rose-50 border-rose-500 text-rose-950'
                        : 'bg-white border-slate-200 hover:border-blue-400'
                  }`}
                >
                  <span>{opt.label}</span>
                  {right && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                  {wrong && <XCircle className="w-4 h-4 text-rose-700" />}
                </button>
              );
            })}
          </div>
          {quizAns && (
            <div className="text-xs sm:text-sm rounded-lg p-3 bg-slate-50 border border-slate-200 font-semibold text-slate-800">
              العدد الآخر هو (١٥ − س)، وبضربهما: س(١٥ − س) = ٥٦ ⇐ س² − ١٥س + ٥٦ = ٠، وجذراها هما ٧ و ٨.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
