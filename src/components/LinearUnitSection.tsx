import React, { useState } from 'react';
import { CheckCircle2, Eye, EyeOff, HelpCircle, XCircle } from 'lucide-react';
import {
  ArEq,
  ArFrac,
  ArLinearEq,
  ArMathBlock,
  ArNum,
  ArOp,
  ArPair,
  ArParen,
  ArSet,
  ArSystem,
  ArTerm,
  ArVar,
} from './ArabicMath';
import { LinearStepTrainer } from './LinearStepTrainer';
import { LinearGraphLab } from './LinearGraphLab';
import {
  LinearMethod,
  LinearSystemParams,
  toArabicDigits,
} from '../utils/arabicMath';

interface WorkedStep {
  math: React.ReactNode;
  reason: string;
}

interface WorkedExample {
  id: string;
  tabLabel: string;
  title: string;
  pageRef: string;
  equationDisplay: React.ReactNode;
  steps: WorkedStep[];
  answerDisplay: React.ReactNode;
  presetSys: LinearSystemParams;
  presetMethod: LinearMethod;
}

const WORKED_EXAMPLES: WorkedExample[] = [
  {
    id: 'comp-1',
    tabLabel: 'المقابلة (مثال ١)',
    title: 'مثال (١) — طريقة المقابلة',
    pageRef: 'ص ١٢٦',
    equationDisplay: (
      <ArSystem
        eq1={<ArLinearEq a={4} b={3} c={2} />}
        eq2={<ArLinearEq a={2} b={-5} c={14} />}
      />
    ),
    steps: [
      {
        math: (
          <div className="flex flex-col gap-2">
            <ArEq>
              <span className="text-sm text-slate-500">من (١):</span>
              <ArVar name="س" />
              <ArOp>=</ArOp>
              <ArFrac
                num={
                  <ArEq>
                    <ArNum value={2} />
                    <ArTerm coeff={-3} varName="ص" isFirst={false} />
                  </ArEq>
                }
                den={<ArNum value={4} />}
              />
            </ArEq>
            <ArEq>
              <span className="text-sm text-slate-500">من (٢):</span>
              <ArVar name="س" />
              <ArOp>=</ArOp>
              <ArFrac
                num={
                  <ArEq>
                    <ArNum value={14} />
                    <ArTerm coeff={5} varName="ص" isFirst={false} />
                  </ArEq>
                }
                den={<ArNum value={2} />}
              />
            </ArEq>
          </div>
        ),
        reason:
          'نكتب كل معادلة بدلالة نفس المتغير (س)؛ ننقل حد ص للطرف الآخر بعكس إشارته ثم نقسم على معامل س.',
      },
      {
        math: (
          <ArEq>
            <ArFrac
              num={
                <ArEq>
                  <ArNum value={2} />
                  <ArTerm coeff={-3} varName="ص" isFirst={false} />
                </ArEq>
              }
              den={<ArNum value={4} />}
            />
            <ArOp>=</ArOp>
            <ArFrac
              num={
                <ArEq>
                  <ArNum value={14} />
                  <ArTerm coeff={5} varName="ص" isFirst={false} />
                </ArEq>
              }
              den={<ArNum value={2} />}
            />
          </ArEq>
        ),
        reason:
          'خطوة المقابلة (المساواة): بما أن الكسرين يساويان نفس المتغير س، فهما متساويان! وبهذا اختفى س تماماً.',
      },
      {
        math: (
          <ArEq>
            <ArNum value={2} />
            <ArTerm coeff={-3} varName="ص" isFirst={false} />
            <ArOp>=</ArOp>
            <ArNum value={28} />
            <ArTerm coeff={10} varName="ص" isFirst={false} />
          </ArEq>
        ),
        reason:
          'للتخلص من المقامين ٤ و ٢ بضربة واحدة، نضرب طرفي المعادلة في المضاعف المشترك الأصغر وهو ٤.',
      },
      {
        math: (
          <ArEq>
            <ArTerm coeff={-3} varName="ص" isFirst={true} />
            <ArTerm coeff={-10} varName="ص" isFirst={false} />
            <ArOp>=</ArOp>
            <ArNum value={28} />
            <ArOp>−</ArOp>
            <ArNum value={2} />
            <ArOp>⇐</ArOp>
            <ArTerm coeff={-13} varName="ص" isFirst={true} />
            <ArOp>=</ArOp>
            <ArNum value={26} />
            <ArOp>⇐</ArOp>
            <ArVar name="ص" />
            <ArOp>=</ArOp>
            <ArNum value={-2} />
          </ArEq>
        ),
        reason:
          'نجمع حدود ص في الطرف الأيمن والأعداد في الطرف الأيسر، ثم نقسم الطرفين على −١٣.',
      },
      {
        math: (
          <ArEq>
            <span className="text-sm text-slate-500">في (١):</span>
            <ArTerm coeff={4} varName="س" isFirst={true} />
            <ArOp>+</ArOp>
            <ArNum value={3} />
            <ArParen>
              <ArNum value={-2} />
            </ArParen>
            <ArOp>=</ArOp>
            <ArNum value={2} />
            <ArOp>⇐</ArOp>
            <ArTerm coeff={4} varName="س" isFirst={true} />
            <ArOp>=</ArOp>
            <ArNum value={8} />
            <ArOp>⇐</ArOp>
            <ArVar name="س" />
            <ArOp>=</ArOp>
            <ArNum value={2} />
          </ArEq>
        ),
        reason:
          'نعود بقيمة ص = −٢ ونعوضها في المعادلة (١) لإيجاد قيمة س.',
      },
    ],
    answerDisplay: (
      <ArEq>
        <span>مجموعة الحل</span>
        <ArOp>=</ArOp>
        <ArSet items={[<ArPair key="p" x={<ArNum value={2} />} y={<ArNum value={-2} />} />]} />
      </ArEq>
    ),
    presetSys: { a1: 4, b1: 3, c1: 2, a2: 2, b2: -5, c2: 14 },
    presetMethod: 'comparison',
  },
  {
    id: 'sub-2',
    tabLabel: 'التعويض (مثال ٢)',
    title: 'مثال (٢) — طريقة التعويض',
    pageRef: 'ص ١٢٨',
    equationDisplay: (
      <ArSystem
        eq1={<ArLinearEq a={2} b={-1} c={5} />}
        eq2={<ArLinearEq a={1} b={3} c={-1} />}
      />
    ),
    steps: [
      {
        math: (
          <ArEq>
            <span className="text-sm text-slate-500">من (١):</span>
            <ArVar name="ص" />
            <ArOp>=</ArOp>
            <ArTerm coeff={2} varName="س" isFirst={true} />
            <ArOp>−</ArOp>
            <ArNum value={5} />
            <span className="text-xs font-bold text-teal-700 ps-2">--- (٣)</span>
          </ArEq>
        ),
        reason:
          'اخترنا عزل ص من المعادلة (١) لأن معامله −١؛ فيمكن نقله للطرف الأيسر وجلب ٥ مكانه لنحصل على معادلة نظيفة بلا كسور!',
      },
      {
        math: (
          <ArEq>
            <span className="text-sm text-slate-500">في (٢):</span>
            <ArVar name="س" />
            <ArOp>+</ArOp>
            <ArNum value={3} />
            <ArParen>
              <ArTerm coeff={2} varName="س" isFirst={true} />
              <ArOp>−</ArOp>
              <ArNum value={5} />
            </ArParen>
            <ArOp>=</ArOp>
            <ArNum value={-1} />
          </ArEq>
        ),
        reason:
          'نستبدل الرمز ص في المعادلة الأخرى (٢) بقيمته (٢س − ٥). وضع الأقواس ضروري جداً لتوزيع الضرب في ٣ على الحدين.',
      },
      {
        math: (
          <ArEq>
            <ArVar name="س" />
            <ArTerm coeff={6} varName="س" isFirst={false} />
            <ArOp>−</ArOp>
            <ArNum value={15} />
            <ArOp>=</ArOp>
            <ArNum value={-1} />
            <ArOp>⇐</ArOp>
            <ArTerm coeff={7} varName="س" isFirst={true} />
            <ArOp>=</ArOp>
            <ArNum value={14} />
            <ArOp>⇐</ArOp>
            <ArVar name="س" />
            <ArOp>=</ArOp>
            <ArNum value={2} />
          </ArEq>
        ),
        reason:
          'نفك القوس، نجمع الحدود المتشابهة (س + ٦س = ٧س)، نضيف ١٥ للطرفين، ثم نقسم على ٧.',
      },
      {
        math: (
          <ArEq>
            <span className="text-sm text-slate-500">في (٣):</span>
            <ArVar name="ص" />
            <ArOp>=</ArOp>
            <ArNum value={2} />
            <ArParen>
              <ArNum value={2} />
            </ArParen>
            <ArOp>−</ArOp>
            <ArNum value={5} />
            <ArOp>=</ArOp>
            <ArNum value={4} />
            <ArOp>−</ArOp>
            <ArNum value={5} />
            <ArOp>=</ArOp>
            <ArNum value={-1} />
          </ArEq>
        ),
        reason:
          'التعويض في المعادلة الجاهزة (٣) يعطينا قيمة ص مباشرة بخطوة حسابية واحدة.',
      },
    ],
    answerDisplay: (
      <ArEq>
        <span>مجموعة الحل</span>
        <ArOp>=</ArOp>
        <ArSet items={[<ArPair key="p" x={<ArNum value={2} />} y={<ArNum value={-1} />} />]} />
      </ArEq>
    ),
    presetSys: { a1: 2, b1: -1, c1: 5, a2: 1, b2: 3, c2: -1 },
    presetMethod: 'substitution',
  },
  {
    id: 'sub-3',
    tabLabel: 'التعويض (مثال ٣)',
    title: 'مثال (٣) — التعويض السريع بدون كسور',
    pageRef: 'ص ١٣٠',
    equationDisplay: (
      <ArSystem
        eq1={<ArLinearEq a={1} b={2} c={1} />}
        eq2={
          <ArEq>
            <ArTerm coeff={3} varName="س" isFirst={true} />
            <ArOp>=</ArOp>
            <ArNum value={7} />
            <ArTerm coeff={-4} varName="ص" isFirst={false} />
          </ArEq>
        }
      />
    ),
    steps: [
      {
        math: (
          <ArEq>
            <span className="text-sm text-slate-500">من (١):</span>
            <ArVar name="س" />
            <ArOp>=</ArOp>
            <ArNum value={1} />
            <ArTerm coeff={-2} varName="ص" isFirst={false} />
            <span className="text-xs font-bold text-teal-700 ps-2">--- (٣)</span>
          </ArEq>
        ),
        reason:
          'نبحث عن متغير معامله ١؛ نجد أن س في المعادلة (١) معامله ١، فنعزله فوراً بنقل +٢ص بعكس إشارتها.',
      },
      {
        math: (
          <ArEq>
            <span className="text-sm text-slate-500">في (٢):</span>
            <ArNum value={3} />
            <ArParen>
              <ArNum value={1} />
              <ArTerm coeff={-2} varName="ص" isFirst={false} />
            </ArParen>
            <ArOp>=</ArOp>
            <ArNum value={7} />
            <ArTerm coeff={-4} varName="ص" isFirst={false} />
          </ArEq>
        ),
        reason:
          'نعوض عن س بالمقدار (١ − ٢ص) داخل المعادلة (٢) فتتحول إلى معادلة بمجهول واحد هو ص.',
      },
      {
        math: (
          <ArEq>
            <ArNum value={3} />
            <ArTerm coeff={-6} varName="ص" isFirst={false} />
            <ArOp>=</ArOp>
            <ArNum value={7} />
            <ArTerm coeff={-4} varName="ص" isFirst={false} />
            <ArOp>⇐</ArOp>
            <ArTerm coeff={-2} varName="ص" isFirst={true} />
            <ArOp>=</ArOp>
            <ArNum value={4} />
            <ArOp>⇐</ArOp>
            <ArVar name="ص" />
            <ArOp>=</ArOp>
            <ArNum value={-2} />
          </ArEq>
        ),
        reason:
          'نفك القوس بضرب ٣ في الحدين، ثم ننقل −٤ص للطرف الأيمن و ٣ للطرف الأيسر ونقسم على −٢.',
      },
      {
        math: (
          <ArEq>
            <span className="text-sm text-slate-500">في (٣):</span>
            <ArVar name="س" />
            <ArOp>=</ArOp>
            <ArNum value={1} />
            <ArOp>−</ArOp>
            <ArNum value={2} />
            <ArParen>
              <ArNum value={-2} />
            </ArParen>
            <ArOp>=</ArOp>
            <ArNum value={1} />
            <ArOp>+</ArOp>
            <ArNum value={4} />
            <ArOp>=</ArOp>
            <ArNum value={5} />
          </ArEq>
        ),
        reason:
          'انتبه لقاعدة الإشارات: ضرب سالب في سالب (−٢ × −٢) يعطي موجباً (+٤).',
      },
    ],
    answerDisplay: (
      <ArEq>
        <span>مجموعة الحل</span>
        <ArOp>=</ArOp>
        <ArSet items={[<ArPair key="p" x={<ArNum value={5} />} y={<ArNum value={-2} />} />]} />
      </ArEq>
    ),
    presetSys: { a1: 1, b1: 2, c1: 1, a2: 3, b2: 4, c2: 7 },
    presetMethod: 'substitution',
  },
  {
    id: 'elim-4',
    tabLabel: 'الحذف (مثال ٤)',
    title: 'مثال (٤) — طريقة الحذف',
    pageRef: 'ص ١٣١',
    equationDisplay: (
      <ArSystem
        eq1={
          <ArEq>
            <ArTerm coeff={3} varName="ص" isFirst={true} />
            <ArTerm coeff={5} varName="س" isFirst={false} />
            <ArOp>=</ArOp>
            <ArNum value={11} />
          </ArEq>
        }
        eq2={<ArLinearEq a={2} b={-7} c={29} />}
      />
    ),
    steps: [
      {
        math: (
          <div className="flex flex-col gap-1.5">
            <ArEq>
              <span className="text-xs font-bold text-blue-800">(١)</span>
              <ArLinearEq a={5} b={3} c={11} />
            </ArEq>
            <ArEq>
              <span className="text-xs font-bold text-teal-700">(٢)</span>
              <ArLinearEq a={2} b={-7} c={29} />
            </ArEq>
          </div>
        ),
        reason:
          'القاعدة الذهبية قبل الحذف: رتب المعادلتين بحيث تكون س تحت س و ص تحت ص؛ لأن المعادلة الأولى بدأت بـ ٣ص قبل ٥س!',
      },
      {
        math: (
          <div className="flex flex-col gap-1.5">
            <ArEq>
              <span className="text-xs font-bold text-blue-800">(١) × ٧:</span>
              <ArLinearEq a={35} b={21} c={77} />
            </ArEq>
            <ArEq>
              <span className="text-xs font-bold text-teal-700">(٢) × ٣:</span>
              <ArLinearEq a={6} b={-21} c={87} />
            </ArEq>
          </div>
        ),
        reason:
          'اخترنا حذف ص لأن إشارتيه مختلفتان أصلاً (+ و −). نضرب الأولى في ٧ والثانية في ٣ ليصبح معاملا ص هما +٢١ و −٢١.',
      },
      {
        math: (
          <ArEq>
            <span className="text-sm text-slate-500">بالجمع:</span>
            <ArTerm coeff={41} varName="س" isFirst={true} />
            <ArOp>+</ArOp>
            <ArNum value={0} />
            <ArOp>=</ArOp>
            <ArNum value={164} />
            <ArOp>⇐</ArOp>
            <ArVar name="س" />
            <ArOp>=</ArOp>
            <ArFrac num={<ArNum value={164} />} den={<ArNum value={41} />} />
            <ArOp>=</ArOp>
            <ArNum value={4} />
          </ArEq>
        ),
        reason:
          'عند الجمع يُحذف (+٢١ص − ٢١ص = ٠) فوراً، ونقسم ١٦٤ على ٤١ لنجد س = ٤.',
      },
      {
        math: (
          <ArEq>
            <span className="text-sm text-slate-500">في (١):</span>
            <ArNum value={5} />
            <ArParen>
              <ArNum value={4} />
            </ArParen>
            <ArTerm coeff={3} varName="ص" isFirst={false} />
            <ArOp>=</ArOp>
            <ArNum value={11} />
            <ArOp>⇐</ArOp>
            <ArTerm coeff={3} varName="ص" isFirst={true} />
            <ArOp>=</ArOp>
            <ArNum value={-9} />
            <ArOp>⇐</ArOp>
            <ArVar name="ص" />
            <ArOp>=</ArOp>
            <ArNum value={-3} />
          </ArEq>
        ),
        reason:
          'نعوض بقيمة س = ٤ في المعادلة (١) ونطرح ٢٠ من الطرفين ثم نقسم على ٣.',
      },
    ],
    answerDisplay: (
      <ArEq>
        <span>مجموعة الحل</span>
        <ArOp>=</ArOp>
        <ArSet items={[<ArPair key="p" x={<ArNum value={4} />} y={<ArNum value={-3} />} />]} />
      </ArEq>
    ),
    presetSys: { a1: 5, b1: 3, c1: 11, a2: 2, b2: -7, c2: 29 },
    presetMethod: 'elimination',
  },
  {
    id: 'elim-5',
    tabLabel: 'مسألة حياتية (مثال ٥)',
    title: 'مثال (٥) — مستطيل محيطه ٢٤ سم وطوله يزيد عن عرضه بـ ٤ سم',
    pageRef: 'ص ١٣٣',
    equationDisplay: (
      <ArSystem
        eq1={<ArLinearEq a={2} b={2} c={24} />}
        eq2={<ArLinearEq a={1} b={-1} c={4} />}
      />
    ),
    steps: [
      {
        math: (
          <div className="flex flex-col gap-1.5">
            <ArEq>
              <span className="text-xs font-bold text-blue-800">(١)</span>
              <ArLinearEq a={2} b={2} c={24} />
            </ArEq>
            <ArEq>
              <span className="text-xs font-bold text-teal-700">(٢)</span>
              <ArLinearEq a={1} b={-1} c={4} />
            </ArEq>
          </div>
        ),
        reason:
          'نفرض الطول = س والعرض = ص. المحيط هو مجموع الضلعين مضروباً في ٢ (٢س + ٢ص = ٢٤)، والزيادة تعني الفرق (س − ص = ٤).',
      },
      {
        math: (
          <ArEq>
            <span className="text-sm text-slate-500">بضرب (٢) × ٢:</span>
            <ArLinearEq a={2} b={-2} c={8} />
          </ArEq>
        ),
        reason:
          'نضرب المعادلة الثانية في ٢ حتى يصبح معامل ص هو −٢ (عكس +٢ في المعادلة الأولى) فنحذفه بالجمع مباشرة.',
      },
      {
        math: (
          <ArEq>
            <span className="text-sm text-slate-500">بالجمع مع (١):</span>
            <ArTerm coeff={4} varName="س" isFirst={true} />
            <ArOp>=</ArOp>
            <ArNum value={32} />
            <ArOp>⇐</ArOp>
            <ArVar name="س" />
            <ArOp>=</ArOp>
            <ArNum value={8} />
            <span className="text-sm text-slate-600">سم</span>
          </ArEq>
        ),
        reason:
          'بالجمع يختفي +٢ص مع −٢ص، ويبقى ٤س = ٣٢، فنقسم على ٤ لنحصل على الطول = ٨ سم.',
      },
      {
        math: (
          <ArEq>
            <span className="text-sm text-slate-500">في (٢):</span>
            <ArNum value={8} />
            <ArOp>−</ArOp>
            <ArVar name="ص" />
            <ArOp>=</ArOp>
            <ArNum value={4} />
            <ArOp>⇐</ArOp>
            <ArVar name="ص" />
            <ArOp>=</ArOp>
            <ArNum value={4} />
            <span className="text-sm text-slate-600">سم</span>
          </ArEq>
        ),
        reason:
          'نعوض الطول ٨ في المعادلة (٢) لنعرف العرض (٤ سم). تحقق: المحيط = ٢ × (٨ + ٤) = ٢٤ سم.',
      },
    ],
    answerDisplay: (
      <ArEq>
        <span>الطول</span>
        <ArOp>=</ArOp>
        <ArNum value={8} />
        <span>سم ، والعرض</span>
        <ArOp>=</ArOp>
        <ArNum value={4} />
        <span>سم</span>
      </ArEq>
    ),
    presetSys: { a1: 2, b1: 2, c1: 24, a2: 1, b2: -1, c2: 4 },
    presetMethod: 'elimination',
  },
];

interface QuizQuestion {
  prompt: React.ReactNode;
  options: React.ReactNode[];
  correctIdx: number;
  explanation: React.ReactNode;
}

const LINEAR_QUIZ: QuizQuestion[] = [
  {
    prompt: (
      <span>
        لحل النظام{' '}
        <ArLinearEq a={1} b={-1} c={4} /> و <ArLinearEq a={1} b={1} c={2} />{' '}
        بأسرع طريقة (الحذف بالجمع مباشرة)، ما ناتج الجمع؟
      </span>
    ),
    options: [
      <ArEq key="0">
        <ArTerm coeff={2} varName="ص" isFirst={true} />
        <ArOp>=</ArOp>
        <ArNum value={6} />
        <ArOp>⇐</ArOp>
        <ArVar name="ص" />
        <ArOp>=</ArOp>
        <ArNum value={3} />
      </ArEq>,
      <ArEq key="1">
        <ArTerm coeff={2} varName="س" isFirst={true} />
        <ArOp>=</ArOp>
        <ArNum value={6} />
        <ArOp>⇐</ArOp>
        <ArVar name="س" />
        <ArOp>=</ArOp>
        <ArNum value={3} />
      </ArEq>,
      <ArEq key="2">
        <ArTerm coeff={2} varName="س" isFirst={true} />
        <ArOp>=</ArOp>
        <ArNum value={2} />
        <ArOp>⇐</ArOp>
        <ArVar name="س" />
        <ArOp>=</ArOp>
        <ArNum value={1} />
      </ArEq>,
      <ArEq key="3">
        <ArNum value={0} />
        <ArOp>=</ArOp>
        <ArNum value={6} />
        <span className="text-xs text-slate-500">(لا يوجد حل)</span>
      </ArEq>,
    ],
    correctIdx: 1,
    explanation: (
      <span>
        لأن <ArEq><ArOp>−</ArOp><ArVar name="ص" /><ArOp>+</ArOp><ArVar name="ص" /><ArOp>=</ArOp><ArNum value={0} /></ArEq> مباشرة عند الجمع، ويبقى <ArEq><ArTerm coeff={2} varName="س" isFirst={true} /><ArOp>=</ArOp><ArNum value={6} /><ArOp>⇐</ArOp><ArVar name="س" /><ArOp>=</ArOp><ArNum value={3} /></ArEq>.
      </span>
    ),
  },
  {
    prompt: (
      <span>
        عند حل النظام <ArLinearEq a={3} b={4} c={-6} /> و{' '}
        <ArLinearEq a={1} b={6} c={-16} /> بطريقة <strong>التعويض</strong>، ما
        أسهل خطوة تبدأ بها بدون كسور؟
      </span>
    ),
    options: [
      <ArEq key="0">
        <span>عزل ص من الأولى:</span>
        <ArVar name="ص" />
        <ArOp>=</ArOp>
        <ArFrac
          num={
            <ArEq>
              <ArNum value={-6} />
              <ArTerm coeff={-3} varName="س" isFirst={false} />
            </ArEq>
          }
          den={<ArNum value={4} />}
        />
      </ArEq>,
      <ArEq key="1">
        <span>عزل س من الأولى:</span>
        <ArVar name="س" />
        <ArOp>=</ArOp>
        <ArFrac
          num={
            <ArEq>
              <ArNum value={-6} />
              <ArTerm coeff={-4} varName="ص" isFirst={false} />
            </ArEq>
          }
          den={<ArNum value={3} />}
        />
      </ArEq>,
      <ArEq key="2">
        <span>عزل س من الثانية:</span>
        <ArVar name="س" />
        <ArOp>=</ArOp>
        <ArTerm coeff={-6} varName="ص" isFirst={true} />
        <ArOp>−</ArOp>
        <ArNum value={16} />
      </ArEq>,
      <ArEq key="3">
        <span>عزل ص من الثانية:</span>
        <ArVar name="ص" />
        <ArOp>=</ArOp>
        <ArFrac
          num={
            <ArEq>
              <ArNum value={-16} />
              <ArOp>−</ArOp>
              <ArVar name="س" />
            </ArEq>
          }
          den={<ArNum value={6} />}
        />
      </ArEq>,
    ],
    correctIdx: 2,
    explanation:
      'القاعدة الذهبية في التعويض هي البحث عن متغير معامله ١ أو −١؛ هنا معامل س في المعادلة الثانية هو ١، فنعزله بدون أي كسور.',
  },
  {
    prompt: (
      <span>
        [تمرين ص ١٤٠] ما مجموعة حل النظام <ArLinearEq a={1} b={-1} c={5} /> و{' '}
        <ArLinearEq a={4} b={2} c={2} />؟
      </span>
    ),
    options: [
      <ArSet key="0" items={[<ArPair key="p" x={<ArNum value={2} />} y={<ArNum value={-3} />} />]} />,
      <ArSet key="1" items={[<ArPair key="p" x={<ArNum value={3} />} y={<ArNum value={-2} />} />]} />,
      <ArSet key="2" items={[<ArPair key="p" x={<ArNum value={2} />} y={<ArNum value={3} />} />]} />,
      <ArSet key="3" items={[<ArPair key="p" x={<ArNum value={-2} />} y={<ArNum value={-3} />} />]} />,
    ],
    correctIdx: 0,
    explanation: (
      <span>
        بضرب الأولى في ٢ تصبح <ArLinearEq a={2} b={-2} c={10} />، وبالجمع مع الثانية نحصل على{' '}
        <ArEq><ArTerm coeff={6} varName="س" isFirst={true} /><ArOp>=</ArOp><ArNum value={12} /><ArOp>⇐</ArOp><ArVar name="س" /><ArOp>=</ArOp><ArNum value={2} /></ArEq>، ومنها{' '}
        <ArEq><ArVar name="ص" /><ArOp>=</ArOp><ArNum value={-3} /></ArEq>.
      </span>
    ),
  },
];

export function LinearUnitSection() {
  const [activeExampleId, setActiveExampleId] = useState<string>(WORKED_EXAMPLES[0].id);
  const [showHiddenOne, setShowHiddenOne] = useState<boolean>(true);

  const [trainerSys, setTrainerSys] = useState<LinearSystemParams>({
    a1: 2,
    b1: -1,
    c1: 5,
    a2: 1,
    b2: 3,
    c2: -1,
  });
  const [trainerMethod, setTrainerMethod] = useState<LinearMethod>('substitution');

  const [graphSys, setGraphSys] = useState<LinearSystemParams>({
    a1: 1,
    b1: -1,
    c1: -1,
    a2: 2,
    b2: 1,
    c2: 4,
  });

  const [answers, setAnswers] = useState<Record<number, number>>({});

  const activeExample =
    WORKED_EXAMPLES.find((e) => e.id === activeExampleId) ?? WORKED_EXAMPLES[0];

  const loadIntoTrainer = (sys: LinearSystemParams, method: LinearMethod) => {
    setTrainerSys(sys);
    setTrainerMethod(method);
    document.getElementById('interactive-trainer')?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendToGraph = (sys: LinearSystemParams) => {
    setGraphSys({
      a1: Math.max(-5, Math.min(5, sys.a1)),
      b1: Math.max(-5, Math.min(5, sys.b1)),
      c1: Math.max(-8, Math.min(8, sys.c1)),
      a2: Math.max(-5, Math.min(5, sys.a2)),
      b2: Math.max(-5, Math.min(5, sys.b2)),
      c2: Math.max(-8, Math.min(8, sys.c2)),
    });
    document.getElementById('interactive-graph')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-10">
      {/* Section 1: Philosophy, Compass & Degree/Exponent Lens */}
      <section id="philosophy" className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
            ١. الخلفية العلمية وبوصلة اختيار الطريقة
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            الدرسان (٣-١) و (٣-٢) · ص ١١٣ – ١٤١
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <h3 className="text-base font-extrabold text-blue-950">
              لماذا نحتاج معادلتين لإيجاد مجهولين؟
            </h3>
            <p className="text-slate-700 leading-relaxed text-[15px]">
              إذا أخبرتك أن سعر قلم ودفتر معاً يساوي ٥٠٠ ريال (
              <ArLinearEq a={1} b={1} c={500} />
              )، فهناك عدد لا نهائي من الاحتمالات (١٠٠ و ٤٠٠، أو ٢٠٠ و ٣٠٠...) لأن معادلة واحدة بمجهولين تمثل{' '}
              <strong>خطاً مستقيماً كاملاً</strong> من النقاط. ولكي نحدد السعر الدقيق لكل منهما نحتاج{' '}
              <strong>لمعادلة ثانية</strong> تمثل مستقيماً آخر؛ فتكون نقطة تقاطعهما هي الحل الوحيد المشترك!
            </p>
            <ArMathBlock className="bg-white">
              <span className="text-sm font-bold text-slate-600">الصورة العامة للنظام:</span>
              <ArSystem
                eq1={
                  <ArEq>
                    <ArVar name="أ" sub={1} />
                    <ArVar name="س" />
                    <ArOp>+</ArOp>
                    <ArVar name="ب" sub={1} />
                    <ArVar name="ص" />
                    <ArOp>=</ArOp>
                    <ArVar name="ج" sub={1} />
                  </ArEq>
                }
                eq2={
                  <ArEq>
                    <ArVar name="أ" sub={2} />
                    <ArVar name="س" />
                    <ArOp>+</ArOp>
                    <ArVar name="ب" sub={2} />
                    <ArVar name="ص" />
                    <ArOp>=</ArOp>
                    <ArVar name="ج" sub={2} />
                  </ArEq>
                }
              />
            </ArMathBlock>
          </div>

          {/* Interactive Degree & Exponent Lens */}
          <div className="lg:col-span-5 bg-rose-50/40 border border-rose-200/80 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-extrabold text-slate-900">
                عدسة الأسس والدرجة (ص ١١٣)
              </h3>
              <button
                type="button"
                onClick={() => setShowHiddenOne((v) => !v)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-rose-200 text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {showHiddenOne ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showHiddenOne ? 'إخفاء الأس ١' : 'إظهار الأس ١ المخفي'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              لماذا سُميت «معادلة من الدرجة الأولى»؟ لأن أكبر أس للمتغيرات فيها هو{' '}
              <strong className="text-rose-700">١</strong> (ونحن نميّز الأسس هنا بخط ولون أحمر وحجم أصغر لئلا تختلط بالأرقام):
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between bg-white border border-emerald-200 rounded-lg px-3 py-2">
                <ArLinearEq a={2} b={3} c={7} showHiddenOne={showHiddenOne} />
                <span className="text-xs font-bold text-emerald-800">درجة أولى (خطية)</span>
              </div>
              <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2">
                <ArEq>
                  <ArTerm coeff={1} varName="س" exp={2} isFirst={true} />
                  <ArTerm coeff={3} varName="ص" isFirst={false} showHiddenOne={showHiddenOne} />
                  <ArOp>=</ArOp>
                  <ArNum value={5} />
                </ArEq>
                <span className="text-xs font-bold text-rose-700">درجة ثانية (ليست خطية)</span>
              </div>
              <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2">
                <ArEq>
                  <ArTerm coeff={2} varName="س" exp={3} isFirst={true} />
                  <ArTerm coeff={-1} varName="ص" isFirst={false} showHiddenOne={showHiddenOne} />
                  <ArOp>=</ArOp>
                  <ArNum value={4} />
                </ArEq>
                <span className="text-xs font-bold text-rose-700">درجة ثالثة (ليست خطية)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Method Compass */}
        <div className="pt-2 space-y-3">
          <h3 className="text-base font-extrabold text-slate-900">
            بوصلة الطالب: متى أختار كل طريقة لأحل بأبسط خطوات؟
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="text-xs font-bold text-indigo-800">الطريقة الأولى · المساواة</div>
              <h4 className="font-extrabold text-slate-900">طريقة المقابلة</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                اجعل <strong>نفس المتغير</strong> وحده في طرف في المعادلتين (مثلاً{' '}
                <ArEq><ArVar name="س" /><ArOp>=</ArOp>...</ArEq>) ثم ساوِ الطرفين.
              </p>
              <p className="text-xs font-bold text-slate-800 pt-1 border-t border-slate-200/80">
                متى أختارها؟ عندما يكون نفس المتغير معزولاً جاهزاً أو سهل العزل في المعادلتين معاً.
              </p>
            </div>

            <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="text-xs font-bold text-teal-800">الطريقة الثانية · الاستبدال</div>
              <h4 className="font-extrabold text-slate-900">طريقة التعويض</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                اعزل متغيراً في معادلة واحدة فقط، ثم ضع قيمته داخل أقواس في المعادلة الأخرى.
              </p>
              <p className="text-xs font-bold text-slate-800 pt-1 border-t border-slate-200/80">
                متى أختارها؟ عندما ترى متغيراً معامله <strong>١</strong> أو <strong>−١</strong> لأنه يُعزل بدون أي كسور!
              </p>
            </div>

            <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="text-xs font-bold text-blue-900">الطريقة الثالثة · التوحيد والجمع</div>
              <h4 className="font-extrabold text-slate-900">طريقة الحذف</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                رتّب المعادلتين، واجعل معاملي أحد المتغيرين <strong>متعاكسين</strong> (مثل +٣ص و −٣ص) ثم اجمع ليختفي فوراً.
              </p>
              <p className="text-xs font-bold text-slate-800 pt-1 border-t border-slate-200/80">
                متى أختارها؟ هي الأسرع عندما تكون كل المعاملات أكبر من ١ لأنها تجنبك الكسور تماماً.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Annotated Worked Examples */}
      <section id="worked-examples" className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
            ٢. تشريح أمثلة الكتاب مع سبب كل خطوة
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            أمثلة الكتاب المدرسي (١ – ٥) بتنسيق عربي كامل من اليمين لليسار
          </span>
        </div>

        {/* Example Tabs */}
        <div
          className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200"
          role="tablist"
          aria-label="أمثلة الكتاب المحلولة"
        >
          {WORKED_EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              type="button"
              role="tab"
              aria-selected={activeExampleId === ex.id}
              onClick={() => setActiveExampleId(ex.id)}
              className={`px-3.5 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeExampleId === ex.id
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {ex.tabLabel}
            </button>
          ))}
        </div>

        {/* Active Example Header */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-teal-800">
              {activeExample.title} · {activeExample.pageRef}
            </div>
            <div className="pt-1">{activeExample.equationDisplay}</div>
          </div>
          <button
            type="button"
            onClick={() =>
              loadIntoTrainer(activeExample.presetSys, activeExample.presetMethod)
            }
            className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-900 text-white hover:bg-blue-950 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            جرّبها في المدرّب التفاعلي
          </button>
        </div>

        {/* Steps Anatomy */}
        <div className="space-y-3">
          {activeExample.steps.map((st, idx) => (
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

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/85 px-4 py-3 text-emerald-950 font-bold flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            {activeExample.answerDisplay}
          </div>
          <span className="text-xs font-semibold text-emerald-800">
            يمكنك التحقق بتعويض س و ص في المعادلتين الأصليتين
          </span>
        </div>
      </section>

      {/* Section 3: Interactive Step Trainer */}
      <section id="interactive-trainer" className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
            ٣. المدرّب التفاعلي: حل أي نظام خطوة بخطوة
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            المقابلة · التعويض · الحذف · كسور مبسطة من اليمين لليسار
          </span>
        </div>

        <LinearStepTrainer
          system={trainerSys}
          method={trainerMethod}
          onChangeSystem={setTrainerSys}
          onChangeMethod={setTrainerMethod}
          onSendToGraph={sendToGraph}
        />
      </section>

      {/* Section 4: Interactive Graph Lab */}
      <section id="interactive-graph" className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
            ٤. المختبر البياني: استكشف حالات الحل الثلاث
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            التقاطع (حل وحيد) · التوازي (∅) · الانطباق (حلول لا نهائية)
          </span>
        </div>

        <LinearGraphLab system={graphSys} onChangeSystem={setGraphSys} />
      </section>

      {/* Section 5: Interactive Quiz */}
      <section id="quick-quiz" className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
            ٥. تحقق من فهمك (من تمارين الكتاب)
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            تصحيح فوري مع تعليل كل إجابة
          </span>
        </div>

        <div className="space-y-4">
          {LINEAR_QUIZ.map((q, qIdx) => {
            const chosen = answers[qIdx];
            const isAnswered = chosen !== undefined;
            const isCorrect = chosen === q.correctIdx;

            return (
              <div
                key={qIdx}
                className="bg-slate-50/75 border border-slate-200 rounded-xl p-5 space-y-3.5"
              >
                <div className="flex items-start gap-2.5 font-bold text-slate-900">
                  <HelpCircle className="w-5 h-5 text-blue-800 shrink-0 mt-1" />
                  <div className="leading-relaxed">
                    <span className="text-blue-900">السؤال ({toArabicDigits(qIdx + 1)}): </span>
                    {q.prompt}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, oIdx) => {
                    let style =
                      'bg-white border-slate-200 text-slate-800 hover:border-blue-600 hover:bg-blue-50/40';
                    if (isAnswered) {
                      if (oIdx === q.correctIdx) {
                        style = 'bg-emerald-50 border-emerald-500 text-emerald-950';
                      } else if (oIdx === chosen) {
                        style = 'bg-rose-50 border-rose-500 text-rose-950';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                        className={`px-4 py-3 rounded-xl border text-right font-bold transition-colors cursor-pointer flex items-center justify-between gap-2 ${style}`}
                      >
                        <div>{opt}</div>
                        {isAnswered && oIdx === q.correctIdx && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        )}
                        {isAnswered && oIdx === chosen && oIdx !== q.correctIdx && (
                          <XCircle className="w-4 h-4 text-rose-700 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div
                    className={`rounded-lg px-4 py-2.5 text-sm font-semibold border ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <strong>{isCorrect ? 'إجابة صحيحة — ' : 'انتبه للقاعدة — '}</strong>
                    {q.explanation}
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
