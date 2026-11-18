import React, { useMemo, useState } from 'react';
import { ArrowDown, CheckCircle2, Compass, Eye, LineChart, RotateCcw } from 'lucide-react';
import {
  ArEq,
  ArFrac,
  ArLinearEq,
  ArNum,
  ArOp,
  ArPair,
  ArParen,
  ArRational,
  ArSet,
  ArTerm,
  ArVar,
} from './ArabicMath';
import {
  lcm,
  LinearMethod,
  LinearSystemParams,
  recommendLinearMethod,
  toArabicDigits,
} from '../utils/arabicMath';

interface StepItem {
  math: React.ReactNode;
  reason: React.ReactNode;
}

interface LinearStepTrainerProps {
  system: LinearSystemParams;
  method: LinearMethod;
  onChangeSystem: (next: LinearSystemParams) => void;
  onChangeMethod: (next: LinearMethod) => void;
  onSendToGraph: (sys: LinearSystemParams) => void;
}

const PRESETS: Array<{
  label: string;
  sys: LinearSystemParams;
  method: LinearMethod;
}> = [
  {
    label: 'مثال ١ (المقابلة)',
    sys: { a1: 4, b1: 3, c1: 2, a2: 2, b2: -5, c2: 14 },
    method: 'comparison',
  },
  {
    label: 'مثال ٢ (التعويض)',
    sys: { a1: 2, b1: -1, c1: 5, a2: 1, b2: 3, c2: -1 },
    method: 'substitution',
  },
  {
    label: 'مثال ٤ (الحذف)',
    sys: { a1: 5, b1: 3, c1: 11, a2: 2, b2: -7, c2: 29 },
    method: 'elimination',
  },
  {
    label: 'تمرين ص ١٤٠ (س − ص = ٥)',
    sys: { a1: 1, b1: -1, c1: 5, a2: 4, b2: 2, c2: 2 },
    method: 'substitution',
  },
  {
    label: 'تمرين ص ١٤٠ (٢س + ص = ٩)',
    sys: { a1: 2, b1: 1, c1: 9, a2: 3, b2: -2, c2: -4 },
    method: 'elimination',
  },
  {
    label: 'حالة التوازي (مثال ٨)',
    sys: { a1: 1, b1: -1, c1: 3, a2: -1, b2: 1, c2: -5 },
    method: 'elimination',
  },
];

function renderIsolatedExpr(
  c: number,
  otherCoeff: number,
  otherVar: string,
  divBy: number
): React.ReactNode {
  const numExpr = (
    <ArEq>
      <ArNum value={c} />
      {otherCoeff !== 0 && (
        <ArTerm coeff={-otherCoeff} varName={otherVar} isFirst={false} />
      )}
    </ArEq>
  );

  if (divBy === 1) return numExpr;
  if (divBy === -1) {
    const flippedC = -c;
    const flippedOther = otherCoeff;
    return (
      <ArEq>
        {(flippedC !== 0 || flippedOther === 0) && <ArNum value={flippedC} />}
        {flippedOther !== 0 && (
          <ArTerm
            coeff={flippedOther}
            varName={otherVar}
            isFirst={flippedC === 0}
          />
        )}
      </ArEq>
    );
  }
  return <ArFrac num={numExpr} den={<ArNum value={divBy} />} />;
}

export function LinearStepTrainer({
  system,
  method,
  onChangeSystem,
  onChangeMethod,
  onSendToGraph,
}: LinearStepTrainerProps) {
  const [visibleCount, setVisibleCount] = useState<number>(1);

  const recommendation = useMemo(() => recommendLinearMethod(system), [system]);

  const { steps, finalNode } = useMemo(() => {
    const { a1, b1, c1, a2, b2, c2 } = system;
    const out: StepItem[] = [];

    if ((a1 === 0 && b1 === 0) || (a2 === 0 && b2 === 0)) {
      out.push({
        math: (
          <span className="text-rose-700 font-bold">
            أدخل معاملاً غير صفري واحد على الأقل في كل معادلة.
          </span>
        ),
        reason:
          'المعادلة الخطية ذات المتغيرين تتطلب وجود معامل غير صفري لـ س أو ص حتى تمثل خطاً مستقيماً.',
      });
      return { steps: out, finalNode: null };
    }

    const D = a1 * b2 - a2 * b1;
    const Dx = c1 * b2 - c2 * b1;
    const Dy = a1 * c2 - a2 * c1;

    out.push({
      math: (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-800">(١)</span>
            <ArLinearEq a={a1} b={b1} c={c1} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-700">(٢)</span>
            <ArLinearEq a={a2} b={b2} c={c2} />
          </div>
        </div>
      ),
      reason:
        'نرتب المعادلتين بالصورة العامة (س تحت س، و ص تحت ص، والحد المطلق بعد إشارة المساواة) لتكون خطواتنا منظمة وواضحة.',
    });

    if (D === 0) {
      if (Dx === 0 && Dy === 0) {
        out.push({
          math: (
            <span className="font-bold text-amber-800">
              المعادلتان متكافئتان تماماً (إحداهما مضاعف للأخرى)
            </span>
          ),
          reason:
            'نسبة معاملات س و ص والحد المطلق متساوية في المعادلتين؛ لذا عند التعويض أو الحذف نصل إلى العبارة الصحيحة دائماً (٠ = ٠)، أي أن المستقيمين منطبقان.',
        });
        return {
          steps: out,
          finalNode: (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 font-bold flex flex-wrap items-center justify-between gap-2">
              <span>مجموعة الحل: عدد لا نهائي من الأزواج المرتبة (مستقيمان منطبقان)</span>
            </div>
          ),
        };
      }
      out.push({
        math: (
          <span className="font-bold text-rose-700">
            تختفي س و ص معاً ونصل إلى تناقض مثل: <ArEq><ArNum value={0} /><ArOp>=</ArOp><ArNum value={Dx || Dy} /></ArEq>
          </span>
        ),
        reason:
          'معاملات س و ص متناسبة لكن الحدين المطلقين غير متناسبين؛ مما يعني أن المستقيمين متوازيان ولا يتقاطعان أبداً.',
      });
      return {
        steps: out,
        finalNode: (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 font-bold flex flex-wrap items-center justify-between gap-2">
            <span>
              مجموعة الحل <ArOp>=</ArOp> ∅ (المجموعة الخالية — مستقيمان متوازيان)
            </span>
          </div>
        ),
      };
    }

    const xVal = <ArRational num={Dx} den={D} />;
    const yVal = <ArRational num={Dy} den={D} />;

    if (method === 'comparison') {
      let isoVar: 'x' | 'y' = a1 !== 0 && a2 !== 0 ? 'x' : 'y';
      if (
        b1 !== 0 &&
        b2 !== 0 &&
        (Math.abs(b1) === 1 || Math.abs(b2) === 1) &&
        !(Math.abs(a1) === 1 && Math.abs(a2) === 1)
      ) {
        isoVar = 'y';
      }
      if (isoVar === 'x' && (a1 === 0 || a2 === 0)) isoVar = 'y';
      if (isoVar === 'y' && (b1 === 0 || b2 === 0)) isoVar = 'x';

      if ((a1 === 0 || a2 === 0) && (b1 === 0 || b2 === 0)) {
        out.push({
          math: (
            <ArEq>
              <ArVar name="س" />
              <ArOp>=</ArOp>
              {xVal}
              <span className="px-2 text-slate-400">،</span>
              <ArVar name="ص" />
              <ArOp>=</ArOp>
              {yVal}
            </ArEq>
          ),
          reason:
            'كل معادلة تحتوي على متغير واحد فقط، لذا نحصل على قيمتي س و ص مباشرة بالقسمة.',
        });
      } else if (isoVar === 'x') {
        const expr1 = renderIsolatedExpr(c1, b1, 'ص', a1);
        const expr2 = renderIsolatedExpr(c2, b2, 'ص', a2);

        out.push({
          math: (
            <div className="flex flex-col gap-2">
              <ArEq>
                <span className="text-sm font-semibold text-slate-600">من (١):</span>
                <ArVar name="س" />
                <ArOp>=</ArOp>
                {expr1}
              </ArEq>
              <ArEq>
                <span className="text-sm font-semibold text-slate-600">من (٢):</span>
                <ArVar name="س" />
                <ArOp>=</ArOp>
                {expr2}
              </ArEq>
            </div>
          ),
          reason:
            'في طريقة المقابلة نجعل نفس المتغير (س) وحده في طرف في كلتا المعادلتين بنقل حد ص بعكس إشارته والقسمة على معامل س.',
        });

        out.push({
          math: (
            <ArEq>
              {expr1}
              <ArOp>=</ArOp>
              {expr2}
            </ArEq>
          ),
          reason:
            'خطوة المقابلة (المساواة): بما أن الطرفين يساويان نفس الكمية س، فهما متساويان! وهكذا تخلصنا من س وبقي متغير واحد هو ص.',
        });

        const L = lcm(a1, a2);
        const m1 = L / a1;
        const m2 = L / a2;
        const lhsC = m1 * c1;
        const lhsY = -m1 * b1;
        const rhsC = m2 * c2;
        const rhsY = -m2 * b2;

        if (Math.abs(a1) !== 1 || Math.abs(a2) !== 1) {
          out.push({
            math: (
              <ArEq>
                <ArNum value={lhsC} />
                {lhsY !== 0 && <ArTerm coeff={lhsY} varName="ص" isFirst={false} />}
                <ArOp>=</ArOp>
                <ArNum value={rhsC} />
                {rhsY !== 0 && <ArTerm coeff={rhsY} varName="ص" isFirst={false} />}
              </ArEq>
            ),
            reason: `لإزالة المقامات بدون تعقيد، نضرب طرفي المعادلة في المضاعف المشترك الأصغر للمقامين وهو ${toArabicDigits(L)}.`,
          });
        }

        const netY = lhsY - rhsY;
        const netC = rhsC - lhsC;

        out.push({
          math: (
            <ArEq>
              <ArTerm coeff={netY} varName="ص" isFirst={true} />
              <ArOp>=</ArOp>
              <ArNum value={netC} />
              <ArOp>⇐</ArOp>
              <ArVar name="ص" />
              <ArOp>=</ArOp>
              {yVal}
            </ArEq>
          ),
          reason:
            'نجمع حدود ص في الطرف الأيمن والأعداد في الطرف الأيسر، ثم نقسم على معامل ص لإيجاد قيمته.',
        });

        out.push({
          math: (
            <ArEq>
              <span className="text-sm font-semibold text-slate-600">بالتعويض في (١):</span>
              <ArVar name="س" />
              <ArOp>=</ArOp>
              {xVal}
            </ArEq>
          ),
          reason:
            'نعوض قيمة ص التي وجدناها في إحدى المعادلتين لإيجاد قيمة المتغير الأول س.',
        });
      } else {
        const expr1 = renderIsolatedExpr(c1, a1, 'س', b1);
        const expr2 = renderIsolatedExpr(c2, a2, 'س', b2);

        out.push({
          math: (
            <div className="flex flex-col gap-2">
              <ArEq>
                <span className="text-sm font-semibold text-slate-600">من (١):</span>
                <ArVar name="ص" />
                <ArOp>=</ArOp>
                {expr1}
              </ArEq>
              <ArEq>
                <span className="text-sm font-semibold text-slate-600">من (٢):</span>
                <ArVar name="ص" />
                <ArOp>=</ArOp>
                {expr2}
              </ArEq>
            </div>
          ),
          reason:
            'نعزل المتغير ص وحده في كلتا المعادلتين تمهيداً للمساواة بين الطرفين.',
        });

        out.push({
          math: (
            <ArEq>
              {expr1}
              <ArOp>=</ArOp>
              {expr2}
            </ArEq>
          ),
          reason:
            'نساوي التعبيرين لأن كليهما يساوي ص، فتتحول المسألة إلى معادلة بمجهول واحد هو س.',
        });

        const L = lcm(b1, b2);
        const m1 = L / b1;
        const m2 = L / b2;
        const lhsC = m1 * c1;
        const lhsX = -m1 * a1;
        const rhsC = m2 * c2;
        const rhsX = -m2 * a2;

        if (Math.abs(b1) !== 1 || Math.abs(b2) !== 1) {
          out.push({
            math: (
              <ArEq>
                <ArNum value={lhsC} />
                {lhsX !== 0 && <ArTerm coeff={lhsX} varName="س" isFirst={false} />}
                <ArOp>=</ArOp>
                <ArNum value={rhsC} />
                {rhsX !== 0 && <ArTerm coeff={rhsX} varName="س" isFirst={false} />}
              </ArEq>
            ),
            reason: `نضرب الطرفين في المضاعف المشترك الأصغر للمقامين (${toArabicDigits(L)}) للتخلص من الكسور.`,
          });
        }

        const netX = lhsX - rhsX;
        const netC = rhsC - lhsC;

        out.push({
          math: (
            <ArEq>
              <ArTerm coeff={netX} varName="س" isFirst={true} />
              <ArOp>=</ArOp>
              <ArNum value={netC} />
              <ArOp>⇐</ArOp>
              <ArVar name="س" />
              <ArOp>=</ArOp>
              {xVal}
            </ArEq>
          ),
          reason:
            'نجمع حدود س في طرف والأعداد في الطرف الآخر ونقسم على معامل س.',
        });

        out.push({
          math: (
            <ArEq>
              <span className="text-sm font-semibold text-slate-600">بالتعويض في (١):</span>
              <ArVar name="ص" />
              <ArOp>=</ArOp>
              {yVal}
            </ArEq>
          ),
          reason: 'نعوض بقيمة س لإيجاد قيمة المتغير الثاني ص.',
        });
      }
    } else if (method === 'substitution') {
      const candidates = [
        { eq: 1, v: 'x' as const, coef: a1, other: b1, c: c1 },
        { eq: 1, v: 'y' as const, coef: b1, other: a1, c: c1 },
        { eq: 2, v: 'x' as const, coef: a2, other: b2, c: c2 },
        { eq: 2, v: 'y' as const, coef: b2, other: a2, c: c2 },
      ].filter((item) => item.coef !== 0);

      candidates.sort((p, q) => Math.abs(p.coef) - Math.abs(q.coef));
      const best = candidates[0];
      const vName = best.v === 'x' ? 'س' : 'ص';
      const oName = best.v === 'x' ? 'ص' : 'س';
      const isoExpr = renderIsolatedExpr(best.c, best.other, oName, best.coef);

      out.push({
        math: (
          <ArEq>
            <span className="text-sm font-semibold text-slate-600">
              من ({toArabicDigits(best.eq)}):
            </span>
            <ArVar name={vName} />
            <ArOp>=</ArOp>
            {isoExpr}
            <span className="text-xs font-bold text-teal-700 ps-2">--- (٣)</span>
          </ArEq>
        ),
        reason:
          Math.abs(best.coef) === 1
            ? `اخترنا عزل ${vName} من المعادلة (${toArabicDigits(best.eq)}) لأن معامله يساوي ${best.coef > 0 ? '١' : '−١'}، فينفصل بنظافة تامة بدون أي كسور!`
            : `اخترنا عزل ${vName} من المعادلة (${toArabicDigits(best.eq)}) لأن معامله (${toArabicDigits(best.coef)}) هو الأصغر بين المعاملات.`,
      });

      const otherEq = best.eq === 1 ? 2 : 1;
      const oa = otherEq === 1 ? a1 : a2;
      const ob = otherEq === 1 ? b1 : b2;
      const oc = otherEq === 1 ? c1 : c2;
      const coefSub = best.v === 'x' ? oa : ob;
      const coefKeep = best.v === 'x' ? ob : oa;

      out.push({
        math: (
          <ArEq>
            <span className="text-sm font-semibold text-slate-600">
              نعوض (٣) في ({toArabicDigits(otherEq)}):
            </span>
            {coefSub !== 1 && coefSub !== -1 && <ArNum value={coefSub} />}
            {coefSub === -1 && <span className="text-rose-700 font-extrabold">−</span>}
            <ArParen>{isoExpr}</ArParen>
            {coefKeep !== 0 && (
              <ArTerm coeff={coefKeep} varName={oName} isFirst={false} />
            )}
            <ArOp>=</ArOp>
            <ArNum value={oc} />
          </ArEq>
        ),
        reason: `نستبدل الرمز ${vName} بقيمته من (٣) داخل المعادلة الأخرى (${toArabicDigits(otherEq)}) مع وضع أقواس لحماية توزيع الضرب والإشارات.`,
      });

      const netOther = coefSub * -best.other + coefKeep * best.coef;
      const netConst = oc * best.coef - coefSub * best.c;
      const oVal = best.v === 'x' ? yVal : xVal;
      const vVal = best.v === 'x' ? xVal : yVal;

      out.push({
        math: (
          <ArEq>
            <ArTerm coeff={netOther} varName={oName} isFirst={true} />
            <ArOp>=</ArOp>
            <ArNum value={netConst} />
            <ArOp>⇐</ArOp>
            <ArVar name={oName} />
            <ArOp>=</ArOp>
            {oVal}
          </ArEq>
        ),
        reason:
          Math.abs(best.coef) !== 1
            ? `نضرب في ${toArabicDigits(Math.abs(best.coef))} للتخلص من المقام ثم نفك الأقواس ونجمع الحدود المتشابهة لإيجاد ${oName}.`
            : `نفك الأقواس ونجمع الحدود المتشابهة ثم نقسم على معامل ${oName}.`,
      });

      out.push({
        math: (
          <ArEq>
            <span className="text-sm font-semibold text-slate-600">
              نعوض في (٣):
            </span>
            <ArVar name={vName} />
            <ArOp>=</ArOp>
            {vVal}
          </ArEq>
        ),
        reason: `العودة إلى المعادلة الجاهزة (٣) تعطينا قيمة ${vName} مباشرة بأقل حسابات.`,
      });
    } else {
      // Elimination method
      const lx = a1 !== 0 && a2 !== 0 ? lcm(a1, a2) : Number.POSITIVE_INFINITY;
      const ly = b1 !== 0 && b2 !== 0 ? lcm(b1, b2) : Number.POSITIVE_INFINITY;
      const elimVar: 'x' | 'y' = ly <= lx ? 'y' : 'x';

      if (elimVar === 'y') {
        if (b1 === 0 || b2 === 0) {
          out.push({
            math: (
              <ArEq>
                <ArVar name="س" />
                <ArOp>=</ArOp>
                {xVal}
                <span className="px-2 text-slate-400">،</span>
                <ArVar name="ص" />
                <ArOp>=</ArOp>
                {yVal}
              </ArEq>
            ),
            reason:
              'المتغير ص محذوف أصلاً من إحدى المعادلتين، فنوجد قيمة س أولاً ثم نعوض لإيجاد ص.',
          });
        } else {
          const L = lcm(b1, b2);
          const k1 = L / Math.abs(b1);
          let k2 = L / Math.abs(b2);
          if ((b1 > 0 && b2 > 0) || (b1 < 0 && b2 < 0)) k2 = -k2;

          if (k1 !== 1 || k2 !== 1) {
            out.push({
              math: (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-blue-800">
                      (١) × {toArabicDigits(k1)}:
                    </span>
                    <ArLinearEq a={k1 * a1} b={k1 * b1} c={k1 * c1} />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-teal-700">
                      (٢) × {k2 < 0 ? `−${toArabicDigits(Math.abs(k2))}` : toArabicDigits(k2)}:
                    </span>
                    <ArLinearEq a={k2 * a2} b={k2 * b2} c={k2 * c2} />
                  </div>
                </div>
              ),
              reason: `نحذف ص بتوحيد معامليه إلى +${toArabicDigits(L)} و −${toArabicDigits(L)} (متعاكسين في الإشارة حتى نجمع بأمان ونتجنب أخطاء الطرح).`,
            });
          } else {
            out.push({
              math: (
                <span className="font-bold text-teal-800">
                  معاملا ص متعاكسان جاهزان (+{toArabicDigits(Math.abs(b1))} و −{toArabicDigits(Math.abs(b1))})
                </span>
              ),
              reason:
                'لا نحتاج لأي ضرب؛ لأن معاملي ص يحذفان بعضهما مباشرة بمجرد الجمع!',
            });
          }

          const sumX = k1 * a1 + k2 * a2;
          const sumC = k1 * c1 + k2 * c2;

          out.push({
            math: (
              <ArEq>
                <span className="text-sm font-semibold text-slate-600">بالجمع:</span>
                <ArTerm coeff={sumX} varName="س" isFirst={true} />
                <ArOp>+</ArOp>
                <ArNum value={0} />
                <ArOp>=</ArOp>
                <ArNum value={sumC} />
                <ArOp>⇐</ArOp>
                <ArVar name="س" />
                <ArOp>=</ArOp>
                {xVal}
              </ArEq>
            ),
            reason:
              'عند جمع المعادلتين يختفي المتغير ص تماماً، ونقسم الناتج على معامل س.',
          });

          out.push({
            math: (
              <ArEq>
                <span className="text-sm font-semibold text-slate-600">
                  بالتعويض في (١):
                </span>
                <ArVar name="ص" />
                <ArOp>=</ArOp>
                {yVal}
              </ArEq>
            ),
            reason:
              'نعوض قيمة س في إحدى المعادلتين الأصليتين للحصول على قيمة ص.',
          });
        }
      } else {
        const L = lcm(a1, a2);
        const k1 = L / Math.abs(a1);
        let k2 = L / Math.abs(a2);
        if ((a1 > 0 && a2 > 0) || (a1 < 0 && a2 < 0)) k2 = -k2;

        if (k1 !== 1 || k2 !== 1) {
          out.push({
            math: (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-blue-800">
                    (١) × {toArabicDigits(k1)}:
                  </span>
                  <ArLinearEq a={k1 * a1} b={k1 * b1} c={k1 * c1} />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-teal-700">
                    (٢) × {k2 < 0 ? `−${toArabicDigits(Math.abs(k2))}` : toArabicDigits(k2)}:
                  </span>
                  <ArLinearEq a={k2 * a2} b={k2 * b2} c={k2 * c2} />
                </div>
              </div>
            ),
            reason: `نحذف س بجعل معامليه +${toArabicDigits(L)} و −${toArabicDigits(L)} (متعاكسين في الإشارة لنجمع مباشرة بدون أخطاء إشارات).`,
          });
        } else {
          out.push({
            math: (
              <span className="font-bold text-teal-800">
                معاملا س متعاكسان جاهزان (+{toArabicDigits(Math.abs(a1))} و −{toArabicDigits(Math.abs(a1))})
              </span>
            ),
            reason: 'معاملا س جاهزان للحذف بالجمع مباشرة دون الحاجة للضرب.',
          });
        }

        const sumY = k1 * b1 + k2 * b2;
        const sumC = k1 * c1 + k2 * c2;

        out.push({
          math: (
            <ArEq>
              <span className="text-sm font-semibold text-slate-600">بالجمع:</span>
              <ArNum value={0} />
              <ArTerm coeff={sumY} varName="ص" isFirst={false} />
              <ArOp>=</ArOp>
              <ArNum value={sumC} />
              <ArOp>⇐</ArOp>
              <ArVar name="ص" />
              <ArOp>=</ArOp>
              {yVal}
            </ArEq>
          ),
          reason: 'يختفي المتغير س بالجمع ونقسم على معامل ص لإيجاد قيمته.',
        });

        out.push({
          math: (
            <ArEq>
              <span className="text-sm font-semibold text-slate-600">
                بالتعويض في (١):
              </span>
              <ArVar name="س" />
              <ArOp>=</ArOp>
              {xVal}
            </ArEq>
          ),
          reason: 'نعوض قيمة ص في المعادلة (١) لإيجاد قيمة س.',
        });
      }
    }

    return {
      steps: out,
      finalNode: (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-emerald-900 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>مجموعة حل النظام</span>
            <ArOp>=</ArOp>
            <ArSet items={[<ArPair key="p" x={xVal} y={yVal} />]} />
          </div>
          <span className="text-sm text-emerald-800">
            جرّب تبديل الطريقة أعلاه للتأكد أن جميع الطرق تعطي نفس النتيجة!
          </span>
        </div>
      ),
    };
  }, [system, method]);

  const handleField = (key: keyof LinearSystemParams, raw: string) => {
    const parsed = raw === '' || raw === '-' ? 0 : parseInt(raw, 10);
    onChangeSystem({
      ...system,
      [key]: Number.isNaN(parsed) ? 0 : Math.max(-25, Math.min(25, parsed)),
    });
    setVisibleCount(1);
  };

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    onChangeSystem(p.sys);
    onChangeMethod(p.method);
    setVisibleCount(1);
  };

  const shownSteps = steps.slice(0, Math.min(visibleCount, steps.length));
  const isFinished = visibleCount >= steps.length;

  return (
    <div className="space-y-5">
      {/* Quick Presets */}
      <div>
        <p className="text-sm font-bold text-slate-700 mb-2">
          اختر مثالاً جاهزاً من الكتاب أو عدّل الأرقام بنفسك:
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-800 hover:bg-blue-50/50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Equation Inputs (RTL ordered: a س + b ص = c) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-blue-900">المعادلة الأولى (١)</span>
            <ArLinearEq a={system.a1} b={system.b1} c={system.c1} />
          </div>
          <div className="flex items-center flex-wrap gap-2 pt-1 border-t border-slate-100">
            <input
              type="number"
              aria-label="معامل س في المعادلة الأولى"
              value={system.a1}
              onChange={(e) => handleField('a1', e.target.value)}
              className="w-16 px-2 py-1.5 text-center font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              dir="ltr"
            />
            <span className="font-bold text-slate-800">س +</span>
            <input
              type="number"
              aria-label="معامل ص في المعادلة الأولى"
              value={system.b1}
              onChange={(e) => handleField('b1', e.target.value)}
              className="w-16 px-2 py-1.5 text-center font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              dir="ltr"
            />
            <span className="font-bold text-slate-800">ص =</span>
            <input
              type="number"
              aria-label="الحد المطلق في المعادلة الأولى"
              value={system.c1}
              onChange={(e) => handleField('c1', e.target.value)}
              className="w-16 px-2 py-1.5 text-center font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              dir="ltr"
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-teal-800">المعادلة الثانية (٢)</span>
            <ArLinearEq a={system.a2} b={system.b2} c={system.c2} />
          </div>
          <div className="flex items-center flex-wrap gap-2 pt-1 border-t border-slate-100">
            <input
              type="number"
              aria-label="معامل س في المعادلة الثانية"
              value={system.a2}
              onChange={(e) => handleField('a2', e.target.value)}
              className="w-16 px-2 py-1.5 text-center font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              dir="ltr"
            />
            <span className="font-bold text-slate-800">س +</span>
            <input
              type="number"
              aria-label="معامل ص في المعادلة الثانية"
              value={system.b2}
              onChange={(e) => handleField('b2', e.target.value)}
              className="w-16 px-2 py-1.5 text-center font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              dir="ltr"
            />
            <span className="font-bold text-slate-800">ص =</span>
            <input
              type="number"
              aria-label="الحد المطلق في المعادلة الثانية"
              value={system.c2}
              onChange={(e) => handleField('c2', e.target.value)}
              className="w-16 px-2 py-1.5 text-center font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* Compass Recommendation */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-2.5 text-sm text-slate-800">
          <Compass className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-blue-950">
              توصية البوصلة لهذا النظام: {recommendation.label}
            </span>
            <span className="text-slate-600 block sm:inline sm:ms-2">
              — {recommendation.reason}
            </span>
          </div>
        </div>
        {method !== recommendation.method && (
          <button
            type="button"
            onClick={() => {
              onChangeMethod(recommendation.method);
              setVisibleCount(1);
            }}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white border border-blue-300 text-blue-900 hover:bg-blue-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            استخدم {recommendation.label}
          </button>
        )}
      </div>

      {/* Method Selector + Playback Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div
          className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200"
          role="tablist"
          aria-label="اختر طريقة الحل"
        >
          {(
            [
              { id: 'comparison', label: 'طريقة المقابلة' },
              { id: 'substitution', label: 'طريقة التعويض' },
              { id: 'elimination', label: 'طريقة الحذف' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={method === tab.id}
              onClick={() => {
                onChangeMethod(tab.id);
                setVisibleCount(1);
              }}
              className={`px-3.5 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                method === tab.id
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={isFinished}
            onClick={() => setVisibleCount((c) => Math.min(steps.length, c + 1))}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowDown className="w-4 h-4" />
            <span>
              اكشف الخطوة التالية ({toArabicDigits(Math.min(visibleCount, steps.length))}/
              {toArabicDigits(steps.length)})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setVisibleCount(steps.length)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Eye className="w-4 h-4" />
            <span>عرض الكل</span>
          </button>

          <button
            type="button"
            onClick={() => setVisibleCount(1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة</span>
          </button>

          <button
            type="button"
            onClick={() => onSendToGraph(system)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold rounded-lg bg-white border border-blue-300 text-blue-900 hover:bg-blue-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <LineChart className="w-4 h-4" />
            <span>ارسمها بيانياً</span>
          </button>
        </div>
      </div>

      {/* Revealed Steps */}
      <div className="space-y-3">
        {shownSteps.map((step, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white border border-slate-200 rounded-xl p-4 items-center"
          >
            <div className="lg:col-span-7 flex items-start gap-3">
              <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-blue-900 font-bold text-sm inline-flex items-center justify-center shrink-0 mt-0.5">
                {toArabicDigits(idx + 1)}
              </span>
              <div className="flex-1 overflow-x-auto py-0.5 text-base">{step.math}</div>
            </div>
            <div className="lg:col-span-5 bg-amber-50/75 border border-amber-200/90 rounded-lg px-3.5 py-2.5 text-sm text-amber-950">
              <span className="block text-xs font-bold text-amber-800 mb-0.5">
                سبب اتخاذ هذه الخطوة
              </span>
              {step.reason}
            </div>
          </div>
        ))}
      </div>

      {isFinished && finalNode}
    </div>
  );
}
