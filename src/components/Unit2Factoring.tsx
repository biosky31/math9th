import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Compass,
  Eye,
  Lightbulb,
  Scissors,
  SlidersHorizontal,
  XCircle,
} from 'lucide-react';
import {
  ArCancel,
  ArEq,
  ArFrac,
  ArMathBlock,
  ArNum,
  ArOp,
  ArParen,
  ArTerm,
  ArVar,
} from './ArabicMath';
import { toArabicDigits } from '../utils/arabicMath';

interface WorkedExample {
  id: string;
  title: string;
  source: string;
  statement: React.ReactNode;
  steps: { label: string; math: React.ReactNode; reason: string }[];
}

const UNIT2_EXAMPLES: WorkedExample[] = [
  {
    id: 'trinomial',
    title: '١. الثلاثي البسيط وغير البسيط والمربع الكامل',
    source: 'الدرس (٢-٢) · أمثلة ص ٦٢–٧٢',
    statement: (
      <div className="space-y-1 text-sm text-slate-700">
        <div>
          حلّل المقدار الثلاثي غير البسيط:{' '}
          <ArEq>
            <ArTerm coeff={3} varName="س" exp={2} isFirst={true} />
            <ArOp>−</ArOp>
            <ArNum value={13} />
            <ArVar name="س" />
            <ArVar name="ص" />
            <ArOp>+</ArOp>
            <ArTerm coeff={14} varName="ص" exp={2} isFirst={true} />
          </ArEq>
        </div>
      </div>
    ),
    steps: [
      {
        label: 'تحليل الحد الأول والأخير وتجربة ذراعي المقص',
        math: (
          <ArEq>
            <ArTerm coeff={3} varName="س" exp={2} isFirst={true} />
            <ArOp>=</ArOp>
            <ArTerm coeff={3} varName="س" isFirst={true} />
            <ArOp>×</ArOp>
            <ArVar name="س" />
            <span className="px-2 text-slate-400">،</span>
            <ArTerm coeff={14} varName="ص" exp={2} isFirst={true} />
            <ArOp>=</ArOp>
            <ArParen>
              <ArTerm coeff={-7} varName="ص" isFirst={true} />
            </ArParen>
            <ArOp>×</ArOp>
            <ArParen>
              <ArTerm coeff={-2} varName="ص" isFirst={true} />
            </ArParen>
          </ArEq>
        ),
        reason:
          'إشارة الحد الأخير موجبة (+١٤ص²) وإشارة الأوسط سالبة (−١٣س ص)، لذلك يجب أن تكون إشارتا العاملين سالبتين معاً.',
      },
      {
        label: 'التحقق من الحد الأوسط (الطرفين + الوسطين)',
        math: (
          <ArEq>
            <ArParen>
              <ArTerm coeff={3} varName="س" isFirst={true} />
              <ArOp>×</ArOp>
              <ArTerm coeff={-2} varName="ص" isFirst={true} />
            </ArParen>
            <ArOp>+</ArOp>
            <ArParen>
              <ArVar name="س" />
              <ArOp>×</ArOp>
              <ArTerm coeff={-7} varName="ص" isFirst={true} />
            </ArParen>
            <ArOp>=</ArOp>
            <ArNum value={-6} />
            <ArVar name="س" />
            <ArVar name="ص" />
            <ArOp>−</ArOp>
            <ArNum value={7} />
            <ArVar name="س" />
            <ArVar name="ص" />
            <ArOp>=</ArOp>
            <ArNum value={-13} />
            <ArVar name="س" />
            <ArVar name="ص" />
          </ArEq>
        ),
        reason: 'طابق الناتج الحد الأوسط تماماً، فنكتب كل سطر أفقي من المقص داخل قوس.',
      },
      {
        label: 'كتابة التحليل النهائي',
        math: (
          <ArEq>
            <ArTerm coeff={3} varName="س" exp={2} isFirst={true} />
            <ArOp>−</ArOp>
            <ArNum value={13} />
            <ArVar name="س" />
            <ArVar name="ص" />
            <ArOp>+</ArOp>
            <ArTerm coeff={14} varName="ص" exp={2} isFirst={true} />
            <ArOp>=</ArOp>
            <ArParen>
              <ArTerm coeff={3} varName="س" isFirst={true} />
              <ArTerm coeff={-7} varName="ص" isFirst={false} />
            </ArParen>
            <ArParen>
              <ArVar name="س" />
              <ArTerm coeff={-2} varName="ص" isFirst={false} />
            </ArParen>
          </ArEq>
        ),
        reason: 'تم تفكيك المقدار إلى حاصل ضرب عاملين خطيين من الدرجة الأولى.',
      },
    ],
  },
  {
    id: 'completeSq',
    title: '٢. التحليل بإكمال المربع (الدرجة الرابعة)',
    source: 'الدرس (٢-٣) · مثال ٦ · ص ٧٧',
    statement: (
      <div className="text-sm text-slate-700">
        حلّل المقدار{' '}
        <ArEq>
          <ArVar name="س" exp={4} />
          <ArTerm coeff={2} varName="س" exp={2} isFirst={false} />
          <ArOp>+</ArOp>
          <ArNum value={9} />
        </ArEq>{' '}
        بإكمال المربع.
      </div>
    ),
    steps: [
      {
        label: 'حساب الحد الأوسط اللازم ليصبح مربعاً كاملاً',
        math: (
          <ArEq>
            <span className="text-slate-600 text-sm">الحد الأوسط المطلوب</span>
            <ArOp>=</ArOp>
            <ArNum value={2} />
            <ArOp>×</ArOp>
            <ArVar name="س" exp={2} />
            <ArOp>×</ArOp>
            <ArNum value={3} />
            <ArOp>=</ArOp>
            <ArTerm coeff={6} varName="س" exp={2} isFirst={true} />
          </ArEq>
        ),
        reason:
          'جذر الحد الأول س² وجذر الأخير ٣، فنحتاج إلى ٦س² بدلاً من ٢س²؛ أي ينقصنا ٤س².',
      },
      {
        label: 'إضافة وطرح ٤س² دون تغيير قيمة المقدار',
        math: (
          <ArEq>
            <ArParen>
              <ArVar name="س" exp={4} />
              <ArTerm coeff={6} varName="س" exp={2} isFirst={false} />
              <ArOp>+</ArOp>
              <ArNum value={9} />
            </ArParen>
            <ArOp>−</ArOp>
            <ArTerm coeff={4} varName="س" exp={2} isFirst={true} />
            <ArOp>=</ArOp>
            <ArParen exp={2}>
              <ArVar name="س" exp={2} />
              <ArOp>+</ArOp>
              <ArNum value={3} />
            </ArParen>
            <ArOp>−</ArOp>
            <ArParen exp={2}>
              <ArTerm coeff={2} varName="س" isFirst={true} />
            </ArParen>
          </ArEq>
        ),
        reason:
          'الجمال في اختيار +٤س² و −٤س² هو أن المقدار المطروح (٤س²) نفسه مربع كامل (٢س)²، مما يحوّل المسألة إلى فرق بين مربعين!',
      },
      {
        label: 'التحليل كفرق بين مربعين وترتيب الحدود',
        math: (
          <ArEq>
            <ArParen>
              <ArVar name="س" exp={2} />
              <ArTerm coeff={-2} varName="س" isFirst={false} />
              <ArOp>+</ArOp>
              <ArNum value={3} />
            </ArParen>
            <ArParen>
              <ArVar name="س" exp={2} />
              <ArTerm coeff={2} varName="س" isFirst={false} />
              <ArOp>+</ArOp>
              <ArNum value={3} />
            </ArParen>
          </ArEq>
        ),
        reason: 'طبّقنا أ² − ب² = (أ − ب)(أ + ب) حيث أ = س² + ٣ و ب = ٢س.',
      },
    ],
  },
  {
    id: 'cubes',
    title: '٣. مجموع مكعبين والفرق بينهما (مثال ص⁶ − ٦٤)',
    source: 'الدرس (٢-٤) · مثال ٢ · ص ٨٣–٨٤',
    statement: (
      <div className="text-sm text-slate-700">
        حلّل المقدار{' '}
        <ArEq>
          <ArVar name="ص" exp={6} />
          <ArOp>−</ArOp>
          <ArNum value={64} />
        </ArEq>{' '}
        تحليلاً تاماً.
      </div>
    ),
    steps: [
      {
        label: 'التحليل أولاً كفرق بين مربعين (أسرع وأتمّ)',
        math: (
          <ArEq>
            <ArVar name="ص" exp={6} />
            <ArOp>−</ArOp>
            <ArNum value={64} />
            <ArOp>=</ArOp>
            <ArParen>
              <ArVar name="ص" exp={3} />
              <ArOp>−</ArOp>
              <ArNum value={8} />
            </ArParen>
            <ArParen>
              <ArVar name="ص" exp={3} />
              <ArOp>+</ArOp>
              <ArNum value={8} />
            </ArParen>
          </ArEq>
        ),
        reason:
          'العدد ٦٤ مربع كامل (٨²) ومكعب كامل (٤³). البدء بالفرق بين مربعين يضمن الحصول على التحليل التام إلى ٤ عوامل بسهولة.',
      },
      {
        label: 'تحليل كل قوس كفرق ومجموع مكعبين',
        math: (
          <ArEq>
            <ArParen>
              <ArVar name="ص" />
              <ArOp>−</ArOp>
              <ArNum value={2} />
            </ArParen>
            <ArParen>
              <ArVar name="ص" exp={2} />
              <ArTerm coeff={2} varName="ص" isFirst={false} />
              <ArOp>+</ArOp>
              <ArNum value={4} />
            </ArParen>
            <ArParen>
              <ArVar name="ص" />
              <ArOp>+</ArOp>
              <ArNum value={2} />
            </ArParen>
            <ArParen>
              <ArVar name="ص" exp={2} />
              <ArTerm coeff={-2} varName="ص" isFirst={false} />
              <ArOp>+</ArOp>
              <ArNum value={4} />
            </ArParen>
          </ArEq>
        ),
        reason:
          'تذكّر قاعدة إشارات المكعبين الذهبية: (نفس الإشارة في القوس الصغير) ثم (عكس الإشارة · موجب دائماً) في القوس الكبير.',
      },
    ],
  },
  {
    id: 'grouping',
    title: '٤. التحليل بالتجميع (مقدار من ٤ حدود)',
    source: 'الدرس (٢-٥) · مثال ٢ · ص ٨٨',
    statement: (
      <div className="text-sm text-slate-700">
        حلّل المقدار{' '}
        <ArEq>
          <ArTerm coeff={8} varName="س" exp={2} isFirst={true} />
          <ArOp>+</ArOp>
          <ArNum value={3} />
          <ArVar name="س" />
          <ArVar name="ص" />
          <ArTerm coeff={-6} varName="ص" isFirst={false} />
          <ArTerm coeff={-16} varName="س" isFirst={false} />
        </ArEq>
        .
      </div>
    ),
    steps: [
      {
        label: 'تجميع كل حدّين يجمعهما عامل مشترك',
        math: (
          <ArEq>
            <ArParen>
              <ArTerm coeff={8} varName="س" exp={2} isFirst={true} />
              <ArTerm coeff={-16} varName="س" isFirst={false} />
            </ArParen>
            <ArOp>+</ArOp>
            <ArParen>
              <ArNum value={3} />
              <ArVar name="س" />
              <ArVar name="ص" />
              <ArTerm coeff={-6} varName="ص" isFirst={false} />
            </ArParen>
          </ArEq>
        ),
        reason: 'نلاحظ أن ٨س² و −١٦س يشتركان في ٨س، بينما ٣س ص و −٦ص يشتركان في ٣ص.',
      },
      {
        label: 'إخراج العامل المشترك من كل قوس ثم القوس المشترك',
        math: (
          <ArEq>
            <ArTerm coeff={8} varName="س" isFirst={true} />
            <ArParen>
              <ArVar name="س" />
              <ArOp>−</ArOp>
              <ArNum value={2} />
            </ArParen>
            <ArOp>+</ArOp>
            <ArTerm coeff={3} varName="ص" isFirst={true} />
            <ArParen>
              <ArVar name="س" />
              <ArOp>−</ArOp>
              <ArNum value={2} />
            </ArParen>
            <ArOp>=</ArOp>
            <ArParen>
              <ArVar name="س" />
              <ArOp>−</ArOp>
              <ArNum value={2} />
            </ArParen>
            <ArParen>
              <ArTerm coeff={8} varName="س" isFirst={true} />
              <ArTerm coeff={3} varName="ص" isFirst={false} />
            </ArParen>
          </ArEq>
        ),
        reason: 'ظهور القوس نفسه (س − ٢) في الحدّين يؤكد نجاح التجميع، فنخرجه كعامل مشترك أعلى.',
      },
    ],
  },
];

// Scissor Method Presets
interface ScissorPreset {
  id: string;
  a: number;
  b: number;
  c: number;
  aPairs: [number, number][];
  cPairs: [number, number][];
}

const SCISSOR_PRESETS: ScissorPreset[] = [
  {
    id: 'p1',
    a: 3,
    b: -4,
    c: -4,
    aPairs: [[3, 1]],
    cPairs: [
      [2, -2],
      [-2, 2],
      [4, -1],
      [-4, 1],
      [1, -4],
    ],
  },
  {
    id: 'p2',
    a: 2,
    b: 7,
    c: 6,
    aPairs: [[2, 1]],
    cPairs: [
      [1, 6],
      [6, 1],
      [2, 3],
      [3, 2],
    ],
  },
  {
    id: 'p3',
    a: 3,
    b: -13,
    c: 14,
    aPairs: [[3, 1]],
    cPairs: [
      [-2, -7],
      [-7, -2],
      [-1, -14],
      [-14, -1],
    ],
  },
  {
    id: 'p4',
    a: 6,
    b: 5,
    c: -6,
    aPairs: [
      [3, 2],
      [6, 1],
    ],
    cPairs: [
      [-2, 3],
      [3, -2],
      [2, -3],
      [-1, 6],
    ],
  },
];

// Algebraic Fraction Lab Walkthroughs
interface FractionCase {
  id: string;
  title: string;
  type: string;
  problem: React.ReactNode;
  steps: { title: string; math: React.ReactNode; reason: string }[];
}

const FRACTION_CASES: FractionCase[] = [
  {
    id: 'simplify',
    title: '١. اختصار كسر جبري (ص ٩١)',
    type: 'اختصار',
    problem: (
      <ArFrac
        num={
          <ArEq>
            <ArVar name="س" exp={2} />
            <ArOp>−</ArOp>
            <ArNum value={4} />
          </ArEq>
        }
        den={
          <ArEq>
            <ArVar name="س" exp={2} />
            <ArTerm coeff={3} varName="س" isFirst={false} />
            <ArOp>−</ArOp>
            <ArNum value={10} />
          </ArEq>
        }
      />
    ),
    steps: [
      {
        title: 'تحليل البسط والمقام إلى عوامل أولية',
        math: (
          <ArFrac
            num={
              <ArEq>
                <ArParen>
                  <ArVar name="س" />
                  <ArOp>−</ArOp>
                  <ArNum value={2} />
                </ArParen>
                <ArParen>
                  <ArVar name="س" />
                  <ArOp>+</ArOp>
                  <ArNum value={2} />
                </ArParen>
              </ArEq>
            }
            den={
              <ArEq>
                <ArParen>
                  <ArVar name="س" />
                  <ArOp>−</ArOp>
                  <ArNum value={2} />
                </ArParen>
                <ArParen>
                  <ArVar name="س" />
                  <ArOp>+</ArOp>
                  <ArNum value={5} />
                </ArParen>
              </ArEq>
            }
          />
        ),
        reason: 'لا يجوز اختصار حدود مجموعة أو مطروحة! نحلّل البسط (فرق مربعين) والمقام (ثلاثي بسيط) أولاً.',
      },
      {
        title: 'شطب العامل المشترك (س − ٢) بشرط س ≠ ٢',
        math: (
          <ArEq>
            <ArFrac
              num={
                <ArEq>
                  <ArCancel>
                    <ArParen>
                      <ArVar name="س" />
                      <ArOp>−</ArOp>
                      <ArNum value={2} />
                    </ArParen>
                  </ArCancel>
                  <ArParen>
                    <ArVar name="س" />
                    <ArOp>+</ArOp>
                    <ArNum value={2} />
                  </ArParen>
                </ArEq>
              }
              den={
                <ArEq>
                  <ArCancel>
                    <ArParen>
                      <ArVar name="س" />
                      <ArOp>−</ArOp>
                      <ArNum value={2} />
                    </ArParen>
                  </ArCancel>
                  <ArParen>
                    <ArVar name="س" />
                    <ArOp>+</ArOp>
                    <ArNum value={5} />
                  </ArParen>
                </ArEq>
              }
            />
            <ArOp>=</ArOp>
            <ArFrac
              num={
                <ArEq>
                  <ArVar name="س" />
                  <ArOp>+</ArOp>
                  <ArNum value={2} />
                </ArEq>
              }
              den={
                <ArEq>
                  <ArVar name="س" />
                  <ArOp>+</ArOp>
                  <ArNum value={5} />
                </ArEq>
              }
            />
          </ArEq>
        ),
        reason: 'العامل (س − ٢) مضروب في البسط والمقام معاً فنختصره ونصل لأبسط صورة.',
      },
    ],
  },
  {
    id: 'addLcm',
    title: '٢. جمع وطرح الكسور عبر م.م.أ (مثال ٢ ص ١٠٣)',
    type: 'جمع وطرح',
    problem: (
      <ArEq>
        <ArFrac
          num={
            <ArEq>
              <ArVar name="س" />
              <ArOp>+</ArOp>
              <ArNum value={4} />
            </ArEq>
          }
          den={
            <ArEq>
              <ArVar name="س" />
              <ArOp>+</ArOp>
              <ArNum value={3} />
            </ArEq>
          }
        />
        <ArOp>−</ArOp>
        <ArFrac
          num={<ArNum value={1} />}
          den={
            <ArEq>
              <ArVar name="س" />
              <ArOp>−</ArOp>
              <ArNum value={3} />
            </ArEq>
          }
        />
        <ArOp>+</ArOp>
        <ArFrac
          num={<ArNum value={6} />}
          den={
            <ArEq>
              <ArVar name="س" exp={2} />
              <ArOp>−</ArOp>
              <ArNum value={9} />
            </ArEq>
          }
        />
      </ArEq>
    ),
    steps: [
      {
        title: 'تحليل المقامات وإيجاد المضاعف المشترك الأصغر (م.م.أ)',
        math: (
          <ArEq>
            <span className="text-teal-800 font-extrabold text-sm">م.م.أ</span>
            <ArOp>=</ArOp>
            <ArParen>
              <ArVar name="س" />
              <ArOp>+</ArOp>
              <ArNum value={3} />
            </ArParen>
            <ArParen>
              <ArVar name="س" />
              <ArOp>−</ArOp>
              <ArNum value={3} />
            </ArParen>
          </ArEq>
        ),
        reason: 'المقام الثالث س² − ٩ هو حاصل ضرب المقامين الأول والثاني تماماً.',
      },
      {
        title: 'توحيد المقامات وتجميع البسط',
        math: (
          <ArFrac
            num={
              <ArEq>
                <ArParen>
                  <ArVar name="س" />
                  <ArOp>+</ArOp>
                  <ArNum value={4} />
                </ArParen>
                <ArParen>
                  <ArVar name="س" />
                  <ArOp>−</ArOp>
                  <ArNum value={3} />
                </ArParen>
                <ArOp>−</ArOp>
                <ArParen>
                  <ArVar name="س" />
                  <ArOp>+</ArOp>
                  <ArNum value={3} />
                </ArParen>
                <ArOp>+</ArOp>
                <ArNum value={6} />
              </ArEq>
            }
            den={
              <ArEq>
                <ArParen>
                  <ArVar name="س" />
                  <ArOp>+</ArOp>
                  <ArNum value={3} />
                </ArParen>
                <ArParen>
                  <ArVar name="س" />
                  <ArOp>−</ArOp>
                  <ArNum value={3} />
                </ArParen>
              </ArEq>
            }
          />
        ),
        reason: 'نضرب كل بسط في العامل الناقص من مقامه مع الانتباه لتوزيع الإشارة السالبة على القوس (س + ٣).',
      },
      {
        title: 'فك البسط والتبسيط النهائي المدهش',
        math: (
          <ArEq>
            <ArFrac
              num={
                <ArEq>
                  <ArCancel>
                    <ArEq>
                      <ArVar name="س" exp={2} />
                      <ArOp>−</ArOp>
                      <ArNum value={9} />
                    </ArEq>
                  </ArCancel>
                </ArEq>
              }
              den={
                <ArEq>
                  <ArCancel>
                    <ArEq>
                      <ArVar name="س" exp={2} />
                      <ArOp>−</ArOp>
                      <ArNum value={9} />
                    </ArEq>
                  </ArCancel>
                </ArEq>
              }
            />
            <ArOp>=</ArOp>
            <ArNum value={1} />
          </ArEq>
        ),
        reason: '(س² + س − ١٢) − س − ٣ + ٦ = س² − ٩؛ يتطابق البسط مع المقام تماماً فيكون الناتج ١!',
      },
    ],
  },
  {
    id: 'division',
    title: '٣. قسمة الكسور الجبرية بقلب القاسم (ص ٩٥)',
    type: 'قسمة',
    problem: (
      <ArEq>
        <ArFrac
          num={
            <ArEq>
              <ArVar name="س" exp={2} />
              <ArOp>−</ArOp>
              <ArNum value={9} />
            </ArEq>
          }
          den={
            <ArEq>
              <ArVar name="س" />
              <ArOp>+</ArOp>
              <ArNum value={1} />
            </ArEq>
          }
        />
        <ArOp>÷</ArOp>
        <ArFrac
          num={
            <ArEq>
              <ArVar name="س" />
              <ArOp>−</ArOp>
              <ArNum value={3} />
            </ArEq>
          }
          den={
            <ArEq>
              <ArTerm coeff={2} varName="س" isFirst={true} />
              <ArOp>+</ArOp>
              <ArNum value={2} />
            </ArEq>
          }
        />
      </ArEq>
    ),
    steps: [
      {
        title: 'تحويل القسمة إلى ضرب في النظير الضربي (مقلوب الكسر الثاني)',
        math: (
          <ArEq>
            <ArFrac
              num={
                <ArEq>
                  <ArParen>
                    <ArVar name="س" />
                    <ArOp>−</ArOp>
                    <ArNum value={3} />
                  </ArParen>
                  <ArParen>
                    <ArVar name="س" />
                    <ArOp>+</ArOp>
                    <ArNum value={3} />
                  </ArParen>
                </ArEq>
              }
              den={
                <ArParen>
                  <ArVar name="س" />
                  <ArOp>+</ArOp>
                  <ArNum value={1} />
                </ArParen>
              }
            />
            <ArOp>×</ArOp>
            <ArFrac
              num={
                <ArEq>
                  <ArNum value={2} />
                  <ArParen>
                    <ArVar name="س" />
                    <ArOp>+</ArOp>
                    <ArNum value={1} />
                  </ArParen>
                </ArEq>
              }
              den={
                <ArParen>
                  <ArVar name="س" />
                  <ArOp>−</ArOp>
                  <ArNum value={3} />
                </ArParen>
              }
            />
          </ArEq>
        ),
        reason: 'نقلب الكسر المقسوم عليه ونحلل البسوط والمقامات في آنٍ واحد (فرق مربعين وعامل مشترك ٢).',
      },
      {
        title: 'شطب العوامل المشتركة بين البسط والمقام',
        math: (
          <ArEq>
            <ArFrac
              num={
                <ArEq>
                  <ArCancel>
                    <ArParen>
                      <ArVar name="س" />
                      <ArOp>−</ArOp>
                      <ArNum value={3} />
                    </ArParen>
                  </ArCancel>
                  <ArParen>
                    <ArVar name="س" />
                    <ArOp>+</ArOp>
                    <ArNum value={3} />
                  </ArParen>
                  <ArOp>×</ArOp>
                  <ArNum value={2} />
                  <ArCancel>
                    <ArParen>
                      <ArVar name="س" />
                      <ArOp>+</ArOp>
                      <ArNum value={1} />
                    </ArParen>
                  </ArCancel>
                </ArEq>
              }
              den={
                <ArEq>
                  <ArCancel>
                    <ArParen>
                      <ArVar name="س" />
                      <ArOp>+</ArOp>
                      <ArNum value={1} />
                    </ArParen>
                  </ArCancel>
                  <ArCancel>
                    <ArParen>
                      <ArVar name="س" />
                      <ArOp>−</ArOp>
                      <ArNum value={3} />
                    </ArParen>
                  </ArCancel>
                </ArEq>
              }
            />
            <ArOp>=</ArOp>
            <ArNum value={2} />
            <ArParen>
              <ArVar name="س" />
              <ArOp>+</ArOp>
              <ArNum value={3} />
            </ArParen>
          </ArEq>
        ),
        reason: 'اختصرنا (س − ٣) و (س + ١) معاً فبقي ٢(س + ٣).',
      },
    ],
  },
];

const UNIT2_QUIZ = [
  {
    id: 1,
    question: (
      <span>
        ما التحليل الصحيح لفرق المكعبين{' '}
        <ArEq>
          <ArVar name="س" exp={3} />
          <ArOp>−</ArOp>
          <ArNum value={27} />
        </ArEq>
        ؟
      </span>
    ),
    options: [
      {
        id: 'a',
        label: (
          <ArEq>
            <ArParen>
              <ArVar name="س" />
              <ArOp>−</ArOp>
              <ArNum value={3} />
            </ArParen>
            <ArParen>
              <ArVar name="س" exp={2} />
              <ArTerm coeff={-3} varName="س" isFirst={false} />
              <ArOp>+</ArOp>
              <ArNum value={9} />
            </ArParen>
          </ArEq>
        ),
      },
      {
        id: 'b',
        label: (
          <ArEq>
            <ArParen>
              <ArVar name="س" />
              <ArOp>−</ArOp>
              <ArNum value={3} />
            </ArParen>
            <ArParen>
              <ArVar name="س" exp={2} />
              <ArTerm coeff={3} varName="س" isFirst={false} />
              <ArOp>+</ArOp>
              <ArNum value={9} />
            </ArParen>
          </ArEq>
        ),
      },
      {
        id: 'c',
        label: (
          <ArEq>
            <ArParen>
              <ArVar name="س" />
              <ArOp>+</ArOp>
              <ArNum value={3} />
            </ArParen>
            <ArParen>
              <ArVar name="س" exp={2} />
              <ArTerm coeff={3} varName="س" isFirst={false} />
              <ArOp>+</ArOp>
              <ArNum value={9} />
            </ArParen>
          </ArEq>
        ),
      },
    ],
    correctId: 'b',
    explanation:
      'قاعدة إشارات المكعبين: نفس الإشارة (−) في القوس الصغير، ثم عكس الإشارة (+) ثم موجب دائماً (+٩).',
  },
  {
    id: 2,
    question: (
      <span>
        لتحليل المقدار{' '}
        <ArEq>
          <ArVar name="س" exp={4} />
          <ArOp>+</ArOp>
          <ArNum value={4} />
        </ArEq>{' '}
        بإكمال المربع، ما الحد الذي نضيفه ونطرحه؟
      </span>
    ),
    options: [
      { id: 'a', label: <ArTerm coeff={4} varName="س" exp={2} isFirst={true} /> },
      { id: 'b', label: <ArTerm coeff={2} varName="س" exp={2} isFirst={true} /> },
      { id: 'c', label: <ArTerm coeff={8} varName="س" exp={2} isFirst={true} /> },
    ],
    correctId: 'a',
    explanation:
      'الحد الأوسط للمربع الكامل هو ٢ × س² × ٢ = ٤س²، فنضيف ٤س² ونطرح ٤س² = (٢س)².',
  },
  {
    id: 3,
    question: (
      <span>
        أبسط صورة للكسر الجبري{' '}
        <ArFrac
          num={
            <ArEq>
              <ArVar name="س" exp={2} />
              <ArOp>−</ArOp>
              <ArNum value={1} />
            </ArEq>
          }
          den={
            <ArEq>
              <ArVar name="س" />
              <ArOp>−</ArOp>
              <ArNum value={1} />
            </ArEq>
          }
        />{' '}
        (حيث س ≠ ١) هي:
      </span>
    ),
    options: [
      { id: 'a', label: <ArEq><ArVar name="س" /><ArOp>−</ArOp><ArNum value={1} /></ArEq> },
      { id: 'b', label: <ArEq><ArVar name="س" /><ArOp>+</ArOp><ArNum value={1} /></ArEq> },
      { id: 'c', label: <ArVar name="س" /> },
    ],
    correctId: 'b',
    explanation: 'س² − ١ = (س − ١)(س + ١)، وبشطب (س − ١) من البسط والمقام يتبقى (س + ١).',
  },
];

export function Unit2Factoring() {
  const [activeExampleId, setActiveExampleId] = useState<string>(UNIT2_EXAMPLES[0].id);

  // Scissor Lab state
  const [scissorIdx, setScissorIdx] = useState<number>(0);
  const [aPairIdx, setAPairIdx] = useState<number>(0);
  const [cPairIdx, setCPairIdx] = useState<number>(0);

  // Cubes & Squares Builder state
  const [specialType, setSpecialType] = useState<'diffSq' | 'sumCube' | 'diffCube'>('diffCube');
  const [coeffA, setCoeffA] = useState<number>(2);
  const [coeffB, setCoeffB] = useState<number>(3);

  // Algebraic Fractions Stepper state
  const [fracId, setFracId] = useState<string>(FRACTION_CASES[0].id);
  const [revealedSteps, setRevealedSteps] = useState<number>(1);

  // Quiz state
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const activeExample =
    UNIT2_EXAMPLES.find((e) => e.id === activeExampleId) ?? UNIT2_EXAMPLES[0];

  const preset = SCISSOR_PRESETS[scissorIdx];
  const [m1, m2] = preset.aPairs[aPairIdx % preset.aPairs.length];
  const [k1, k2] = preset.cPairs[cPairIdx % preset.cPairs.length];
  const cross1 = m1 * k2;
  const cross2 = m2 * k1;
  const crossSum = cross1 + cross2;
  const scissorMatched = crossSum === preset.b;

  const activeFrac = FRACTION_CASES.find((f) => f.id === fracId) ?? FRACTION_CASES[0];

  return (
    <div className="space-y-10">
      {/* Section 1: Philosophy & Factoring Decision Compass */}
      <section id="philosophy" className="scroll-mt-24 space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                الخلفية العلمية وبوصلة اختيار طريقة التحليل
              </h2>
              <p className="text-slate-600 text-sm md:text-base mt-1 leading-relaxed">
                التحليل هو «العملية العكسية للنشر والضرب»: بدلاً من فك الأقواس، نعيد المقدار الجبري إلى حاصل ضرب عوامله الأولية. هذه المهارة هي المفتاح الأساسي لاختصار الكسور الجبرية وحل معادلات الدرجة الثانية في الوحدة الثالثة.
              </p>
            </div>
          </div>

          {/* 4-Step Decision Compass */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-1.5">
              <div className="text-xs font-extrabold text-blue-900">الخطوة (٠) دائماً أولاً</div>
              <div className="font-extrabold text-slate-900 text-sm">العامل المشترك الأعلى (ع.م.أ)</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                قبل أي طريقة، افحص هل يوجد عدد أو متغير مشترك في جميع الحدود وأخرجه فوراً.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
              <div className="text-xs font-extrabold text-teal-800">إذا كان المقدار حدّين (٢)</div>
              <div className="font-extrabold text-slate-900 text-sm">فرق مربعين أو مكعبين</div>
              <div className="text-xs text-slate-600 leading-relaxed">
                أ² − ب² أو أ³ ± ب³ (أما أ⁴ + ٤ب⁴ فيُحل بإكمال المربع).
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
              <div className="text-xs font-extrabold text-teal-800">إذا كان المقدار ٣ حدود</div>
              <div className="font-extrabold text-slate-900 text-sm">ثلاثي بسيط · مقص · مربع كامل</div>
              <div className="text-xs text-slate-600 leading-relaxed">
                إن كان مربعاً كاملاً ← (أ ± ب)²، وإن لم يُحلل مباشرة نلجأ لإكمال المربع.
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
              <div className="text-xs font-extrabold text-teal-800">إذا كان ٤ حدود فأكثر</div>
              <div className="font-extrabold text-slate-900 text-sm">التحليل بالتجميع</div>
              <div className="text-xs text-slate-600 leading-relaxed">
                جمّع كل حدّين (أو ٣ + ١ كمربع كامل وفرق مربعين) لإظهار قوس مشترك.
              </div>
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
              تغطي الثلاثي غير البسيط، إكمال المربع للدرجة الرابعة، المكعبين، والتحليل بالتجميع.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist">
          {UNIT2_EXAMPLES.map((ex) => (
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
            <div className="text-xs font-bold text-slate-500 mb-1.5">المطلوب:</div>
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

      {/* Section 3: Interactive Scissor Method & Cubes/Squares Builder */}
      <section id="interactive-trainer" className="scroll-mt-24 space-y-6">
        {/* Lab A: Interactive Scissor Method (المقص) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 shrink-0">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                مختبر طريقة المقص التفاعلي (تحليل الثلاثي غير البسيط)
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                اختر مسألة من الكتاب ثم جرّب تبديل عوامل الحد الأخير على ذراعي المقص حتى يساوي ناتج (الطرفين + الوسطين) الحد الأوسط تماماً.
              </p>
            </div>
          </div>

          {/* Preset selector */}
          <div className="flex flex-wrap gap-2">
            {SCISSOR_PRESETS.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setScissorIdx(idx);
                  setAPairIdx(0);
                  setCPairIdx(0);
                }}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold border cursor-pointer transition-colors ${
                  idx === scissorIdx
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <ArEq className={idx === scissorIdx ? 'text-white' : ''}>
                  <ArTerm coeff={p.a} varName="س" exp={2} isFirst={true} />
                  <ArTerm coeff={p.b} varName="س" isFirst={false} />
                  <ArOp>{p.c < 0 ? '−' : '+'}</ArOp>
                  <ArNum value={Math.abs(p.c)} />
                </ArEq>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* SVG Cross Scissor Visualizer */}
            <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <svg viewBox="0 0 360 190" className="w-full h-auto" role="img" aria-label="رسم طريقة المقص لتحليل المقدار الثلاثي">
                {/* Cross Lines */}
                <line
                  x1="255"
                  y1="48"
                  x2="105"
                  y2="142"
                  stroke={scissorMatched ? '#059669' : '#1e40af'}
                  strokeWidth="3"
                  strokeDasharray={scissorMatched ? '' : '6 4'}
                />
                <line
                  x1="255"
                  y1="142"
                  x2="105"
                  y2="48"
                  stroke={scissorMatched ? '#059669' : '#0f766e'}
                  strokeWidth="3"
                  strokeDasharray={scissorMatched ? '' : '6 4'}
                />

                {/* Top Right box: m1 س */}
                <rect x="255" y="26" width="84" height="44" rx="10" fill="#ffffff" stroke="#1e3a8a" strokeWidth="2" />
                <text x="297" y="54" textAnchor="middle" className="fill-blue-950 font-extrabold text-base">
                  {m1 === 1 ? 'س' : `${toArabicDigits(m1)}س`}
                </text>

                {/* Bottom Right box: m2 س */}
                <rect x="255" y="120" width="84" height="44" rx="10" fill="#ffffff" stroke="#1e3a8a" strokeWidth="2" />
                <text x="297" y="148" textAnchor="middle" className="fill-blue-950 font-extrabold text-base">
                  {m2 === 1 ? 'س' : `${toArabicDigits(m2)}س`}
                </text>

                {/* Top Left box: k1 */}
                <rect x="21" y="26" width="84" height="44" rx="10" fill="#ffffff" stroke="#0f766e" strokeWidth="2" />
                <text x="63" y="54" textAnchor="middle" className="fill-teal-900 font-extrabold text-base">
                  {k1 >= 0 ? `+${toArabicDigits(k1)}` : `−${toArabicDigits(Math.abs(k1))}`}
                </text>

                {/* Bottom Left box: k2 */}
                <rect x="21" y="120" width="84" height="44" rx="10" fill="#ffffff" stroke="#0f766e" strokeWidth="2" />
                <text x="63" y="148" textAnchor="middle" className="fill-teal-900 font-extrabold text-base">
                  {k2 >= 0 ? `+${toArabicDigits(k2)}` : `−${toArabicDigits(Math.abs(k2))}`}
                </text>

                {/* Center status */}
                <circle
                  cx="180"
                  cy="95"
                  r="22"
                  fill={scissorMatched ? '#dcfce7' : '#fef2f2'}
                  stroke={scissorMatched ? '#059669' : '#dc2626'}
                  strokeWidth="2"
                />
                <text
                  x="180"
                  y="100"
                  textAnchor="middle"
                  className={`font-extrabold text-xs ${scissorMatched ? 'fill-emerald-800' : 'fill-rose-700'}`}
                >
                  {scissorMatched ? 'تطابق!' : 'جرّب'}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {preset.aPairs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setAPairIdx((i) => (i + 1) % preset.aPairs.length)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-300 hover:border-blue-600 text-slate-800 cursor-pointer"
                  >
                    بدّل عوامل الحد الأول ({toArabicDigits(preset.a)}س²)
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setCPairIdx((i) => (i + 1) % preset.cPairs.length)}
                  className="px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-900 hover:bg-blue-950 text-white cursor-pointer"
                >
                  جرّب تركيبة أخرى لعوامل الحد الأخير ({toArabicDigits(preset.c)})
                </button>
              </div>
            </div>

            {/* Cross Verification Readout */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="text-xs font-bold text-slate-500">فحص المقص (الطرفين + الوسطين):</div>
                <ArMathBlock className="bg-white border border-slate-200">
                  <ArEq>
                    <ArTerm coeff={cross1} varName="س" isFirst={true} />
                    <ArTerm coeff={cross2} varName="س" isFirst={false} />
                    <ArOp>=</ArOp>
                    <ArTerm coeff={crossSum} varName="س" isFirst={true} />
                  </ArEq>
                </ArMathBlock>
                <div className="text-xs font-bold text-slate-600">
                  الحد الأوسط المطلوب في المسألة:{' '}
                  <ArTerm coeff={preset.b} varName="س" isFirst={true} />
                </div>
              </div>

              {scissorMatched ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                    <span>ممتاز! المقص نجح، نقرأ كل سطر أفقي داخل قوس:</span>
                  </div>
                  <ArMathBlock className="bg-white border border-emerald-200">
                    <ArEq>
                      <ArParen>
                        <ArTerm coeff={m1} varName="س" isFirst={true} />
                        <ArOp>{k1 < 0 ? '−' : '+'}</ArOp>
                        <ArNum value={Math.abs(k1)} />
                      </ArParen>
                      <ArParen>
                        <ArTerm coeff={m2} varName="س" isFirst={true} />
                        <ArOp>{k2 < 0 ? '−' : '+'}</ArOp>
                        <ArNum value={Math.abs(k2)} />
                      </ArParen>
                    </ArEq>
                  </ArMathBlock>
                </div>
              ) : (
                <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 flex items-start gap-2.5 text-sm text-rose-900">
                  <XCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                  <div>
                    الناتج الحالي (<ArTerm coeff={crossSum} varName="س" isFirst={true} />) لا يساوي الحد الأوسط المطلوب (<ArTerm coeff={preset.b} varName="س" isFirst={true} />). اضغط زر «جرّب تركيبة أخرى» للوصول للحل الصحيح.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lab B: Interactive Cubes & Squares Builder */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                باني المربعين والمكعبين التفاعلي (مع قاعدة الإشارات)
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                غيّر المعاملين أ و ب لمشاهدة كيفية اشتقاق القوس الصغير والقوس الكبير تلقائياً.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'diffSq' as const, label: 'فرق بين مربعين (أ²س² − ب²)' },
              { id: 'sumCube' as const, label: 'مجموع مكعبين (أ³س³ + ب³)' },
              { id: 'diffCube' as const, label: 'فرق بين مكعبين (أ³س³ − ب³)' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSpecialType(t.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border cursor-pointer ${
                  specialType === t.id
                    ? 'bg-teal-800 text-white border-teal-800'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <label htmlFor="u2-a">الجذر الأول (أ):</label>
                <ArTerm coeff={coeffA} varName="س" isFirst={true} />
              </div>
              <input
                id="u2-a"
                type="range"
                min={1}
                max={4}
                step={1}
                value={coeffA}
                onChange={(e) => setCoeffA(Number(e.target.value))}
                className="w-full accent-blue-900 cursor-pointer"
              />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <label htmlFor="u2-b">الجذر الثاني (ب):</label>
                <ArNum value={coeffB} />
              </div>
              <input
                id="u2-b"
                type="range"
                min={1}
                max={5}
                step={1}
                value={coeffB}
                onChange={(e) => setCoeffB(Number(e.target.value))}
                className="w-full accent-teal-700 cursor-pointer"
              />
            </div>
          </div>

          <ArMathBlock className="bg-slate-50 border border-slate-200 py-5">
            {specialType === 'diffSq' && (
              <ArEq className="text-lg">
                <ArTerm coeff={coeffA * coeffA} varName="س" exp={2} isFirst={true} />
                <ArOp>−</ArOp>
                <ArNum value={coeffB * coeffB} />
                <ArOp>=</ArOp>
                <ArParen>
                  <ArTerm coeff={coeffA} varName="س" isFirst={true} />
                  <ArOp>−</ArOp>
                  <ArNum value={coeffB} />
                </ArParen>
                <ArParen>
                  <ArTerm coeff={coeffA} varName="س" isFirst={true} />
                  <ArOp>+</ArOp>
                  <ArNum value={coeffB} />
                </ArParen>
              </ArEq>
            )}
            {specialType === 'sumCube' && (
              <ArEq className="text-lg">
                <ArTerm coeff={coeffA ** 3} varName="س" exp={3} isFirst={true} />
                <ArOp>+</ArOp>
                <ArNum value={coeffB ** 3} />
                <ArOp>=</ArOp>
                <ArParen>
                  <ArTerm coeff={coeffA} varName="س" isFirst={true} />
                  <ArOp>+</ArOp>
                  <ArNum value={coeffB} />
                </ArParen>
                <ArParen>
                  <ArTerm coeff={coeffA * coeffA} varName="س" exp={2} isFirst={true} />
                  <ArTerm coeff={-(coeffA * coeffB)} varName="س" isFirst={false} />
                  <ArOp>+</ArOp>
                  <ArNum value={coeffB * coeffB} />
                </ArParen>
              </ArEq>
            )}
            {specialType === 'diffCube' && (
              <ArEq className="text-lg">
                <ArTerm coeff={coeffA ** 3} varName="س" exp={3} isFirst={true} />
                <ArOp>−</ArOp>
                <ArNum value={coeffB ** 3} />
                <ArOp>=</ArOp>
                <ArParen>
                  <ArTerm coeff={coeffA} varName="س" isFirst={true} />
                  <ArOp>−</ArOp>
                  <ArNum value={coeffB} />
                </ArParen>
                <ArParen>
                  <ArTerm coeff={coeffA * coeffA} varName="س" exp={2} isFirst={true} />
                  <ArTerm coeff={coeffA * coeffB} varName="س" isFirst={false} />
                  <ArOp>+</ArOp>
                  <ArNum value={coeffB * coeffB} />
                </ArParen>
              </ArEq>
            )}
          </ArMathBlock>

          {specialType !== 'diffSq' && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs sm:text-sm text-amber-950 font-semibold">
              قاعدة الإشارات الذهبية للمكعبين: القوس الصغير يأخذ{' '}
              <span className="font-extrabold text-blue-900">نفس إشارة المقدار</span>، والقوس الكبير يبدأ بـ{' '}
              <span className="font-extrabold text-rose-700">عكس الإشارة</span> في الحد الأوسط ثم{' '}
              <span className="font-extrabold text-emerald-800">موجب دائماً</span> في الحد الأخير.
            </div>
          )}
        </div>
      </section>

      {/* Section 4: Interactive Algebraic Fractions & Cancellation Lab */}
      <section id="interactive-graph" className="scroll-mt-24">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                مدرّب اختصار وجمع وقسمة الكسور الجبرية (الدروس ٢-٦ إلى ٢-٨)
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                تدرّب خطوة بخطوة على تحليل الكسور وشطب العوامل المشتركة وتوحيد المقامات باستخدام م.م.أ.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {FRACTION_CASES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setFracId(c.id);
                  setRevealedSteps(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold border cursor-pointer transition-colors ${
                  c.id === activeFrac.id
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="text-xs font-bold text-slate-500">المسألة ({activeFrac.type}):</div>
            <ArMathBlock className="bg-white border border-slate-200">
              {activeFrac.problem}
            </ArMathBlock>
          </div>

          <div className="space-y-3">
            {activeFrac.steps.slice(0, revealedSteps).map((step, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                  <span className="w-6 h-6 rounded-full bg-teal-700 text-white text-xs flex items-center justify-center shrink-0">
                    {toArabicDigits(idx + 1)}
                  </span>
                  <span>{step.title}</span>
                </div>
                <ArMathBlock className="bg-slate-50 border border-slate-200">
                  {step.math}
                </ArMathBlock>
                <div className="text-xs sm:text-sm text-slate-700 bg-amber-50/70 border border-amber-200/80 rounded-lg px-3.5 py-2">
                  <span className="font-extrabold text-amber-950">السبب: </span>
                  {step.reason}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {revealedSteps < activeFrac.steps.length ? (
              <button
                type="button"
                onClick={() => setRevealedSteps((s) => s + 1)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-sm font-bold cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                اكشف الخطوة التالية ({toArabicDigits(revealedSteps + 1)} من {toArabicDigits(activeFrac.steps.length)})
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setRevealedSteps(1)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold cursor-pointer"
              >
                إعادة عرض الخطوات من البداية
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Section 5: Quick Quiz */}
      <section id="quick-quiz" className="scroll-mt-24">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              تحقق من فهمك — اختبر نفسك في الوحدة الثانية
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              أسئلة مركزة من تمارين التحليل والكسور الجبرية في الكتاب المدرسي.
            </p>
          </div>

          <div className="space-y-5">
            {UNIT2_QUIZ.map((q) => {
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
