import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Compass,
  GitBranch,
  HelpCircle,
  Layers,
  Lightbulb,
  RotateCcw,
  SlidersHorizontal,
  XCircle,
} from 'lucide-react';
import {
  ArComplement,
  ArEq,
  ArInterval,
  ArMathBlock,
  ArNum,
  ArOp,
  ArPair,
  ArParen,
  ArSet,
  ArTerm,
  ArVar,
} from './ArabicMath';
import { toArabicDigits } from '../utils/arabicMath';

type VennOp =
  | 'union'
  | 'intersection'
  | 'diffXY'
  | 'diffYX'
  | 'compX'
  | 'demorgan1'
  | 'demorgan2';

interface VennOpMeta {
  id: VennOp;
  label: string;
  formula: React.ReactNode;
  explanation: string;
  regions: {
    onlyX: boolean;
    both: boolean;
    onlyY: boolean;
    outside: boolean;
  };
}

const VENN_OPS: VennOpMeta[] = [
  {
    id: 'intersection',
    label: 'التقاطع',
    formula: (
      <ArEq>
        <ArVar name="س" />
        <ArOp>∩</ArOp>
        <ArVar name="ص" />
      </ArEq>
    ),
    explanation: 'العناصر المشتركة التي تنتمي إلى س وتنتمي إلى ص في الوقت نفسه.',
    regions: { onlyX: false, both: true, onlyY: false, outside: false },
  },
  {
    id: 'union',
    label: 'الاتحاد',
    formula: (
      <ArEq>
        <ArVar name="س" />
        <ArOp>∪</ArOp>
        <ArVar name="ص" />
      </ArEq>
    ),
    explanation: 'جميع العناصر التي تنتمي إلى س أو إلى ص أو إلى كليهما دون تكرار.',
    regions: { onlyX: true, both: true, onlyY: true, outside: false },
  },
  {
    id: 'diffXY',
    label: 'فرق س على ص',
    formula: (
      <ArEq>
        <ArVar name="س" />
        <ArOp>/</ArOp>
        <ArVar name="ص" />
      </ArEq>
    ),
    explanation: 'العناصر الموجودة في س وليست موجودة في ص (ما تنفرد به س).',
    regions: { onlyX: true, both: false, onlyY: false, outside: false },
  },
  {
    id: 'diffYX',
    label: 'فرق ص على س',
    formula: (
      <ArEq>
        <ArVar name="ص" />
        <ArOp>/</ArOp>
        <ArVar name="س" />
      </ArEq>
    ),
    explanation: 'العناصر الموجودة في ص وليست موجودة في س (ما تنفرد به ص).',
    regions: { onlyX: false, both: false, onlyY: true, outside: false },
  },
  {
    id: 'compX',
    label: 'متممة س',
    formula: (
      <ArEq>
        <ArComplement>
          <ArVar name="س" />
        </ArComplement>
        <ArOp>=</ArOp>
        <ArVar name="ش" />
        <ArOp>/</ArOp>
        <ArVar name="س" />
      </ArEq>
    ),
    explanation: 'كل عناصر المجموعة الشاملة ش التي لا تنتمي إلى المجموعة س.',
    regions: { onlyX: false, both: false, onlyY: true, outside: true },
  },
  {
    id: 'demorgan1',
    label: 'دي مورجان (١)',
    formula: (
      <ArEq>
        <ArComplement>
          <ArParen>
            <ArVar name="س" />
            <ArOp>∪</ArOp>
            <ArVar name="ص" />
          </ArParen>
        </ArComplement>
        <ArOp>=</ArOp>
        <ArComplement>
          <ArVar name="س" />
        </ArComplement>
        <ArOp>∩</ArOp>
        <ArComplement>
          <ArVar name="ص" />
        </ArComplement>
      </ArEq>
    ),
    explanation:
      'متممة الاتحاد تساوي تقاطع المتممتين: أي العناصر الواقعة خارج كلٍّ من س و ص معاً.',
    regions: { onlyX: false, both: false, onlyY: false, outside: true },
  },
  {
    id: 'demorgan2',
    label: 'دي مورجان (٢)',
    formula: (
      <ArEq>
        <ArComplement>
          <ArParen>
            <ArVar name="س" />
            <ArOp>∩</ArOp>
            <ArVar name="ص" />
          </ArParen>
        </ArComplement>
        <ArOp>=</ArOp>
        <ArComplement>
          <ArVar name="س" />
        </ArComplement>
        <ArOp>∪</ArOp>
        <ArComplement>
          <ArVar name="ص" />
        </ArComplement>
      </ArEq>
    ),
    explanation:
      'متممة التقاطع تساوي اتحاد المتممتين: أي كل عناصر ش ما عدا المنطقة المشتركة بين س و ص.',
    regions: { onlyX: true, both: false, onlyY: true, outside: true },
  },
];

const UNIVERSE = [1, 2, 3, 4, 5, 6, 7, 8];
const INITIAL_X = [1, 2, 3, 4];
const INITIAL_Y = [3, 4, 5, 6];

const REL_ELEMENTS = [1, 2, 3, 5];

function pairKey(a: number, b: number) {
  return `${a}-${b}`;
}

function buildPresetRelation(preset: 'evenSum' | 'lessThan' | 'notEqual' | 'gte'): Set<string> {
  const s = new Set<string>();
  for (const a of REL_ELEMENTS) {
    for (const b of REL_ELEMENTS) {
      if (preset === 'evenSum' && (a + b) % 2 === 0) s.add(pairKey(a, b));
      if (preset === 'lessThan' && a < b) s.add(pairKey(a, b));
      if (preset === 'notEqual' && a !== b) s.add(pairKey(a, b));
      if (preset === 'gte' && a >= b) s.add(pairKey(a, b));
    }
  }
  return s;
}

interface ExampleStep {
  label: string;
  math: React.ReactNode;
  reason: string;
}

interface WorkedExample {
  id: string;
  title: string;
  source: string;
  statement: React.ReactNode;
  steps: ExampleStep[];
}

const UNIT1_EXAMPLES: WorkedExample[] = [
  {
    id: 'ex1',
    title: '١. الصفة المميزة والفرق وقانونا دي مورجان',
    source: 'الدرسان (١-١) و (١-٢) · ص ٧–١٥',
    statement: (
      <div className="space-y-1.5 text-sm text-slate-700">
        <div>
          إذا كانت المجموعة الشاملة{' '}
          <ArEq>
            <ArVar name="ش" />
            <ArOp>=</ArOp>
            <ArSet items={[1, 2, 3, 4, 5, 6, 7].map((n) => <ArNum key={n} value={n} />)} />
          </ArEq>
          ، وكانت{' '}
          <ArEq>
            <ArVar name="س" />
            <ArOp>=</ArOp>
            <ArSet items={[1, 2, 3, 4].map((n) => <ArNum key={n} value={n} />)} />
          </ArEq>{' '}
          و{' '}
          <ArEq>
            <ArVar name="ص" />
            <ArOp>=</ArOp>
            <ArSet items={[3, 4, 5].map((n) => <ArNum key={n} value={n} />)} />
          </ArEq>
          ، أوجد{' '}
          <ArEq>
            <ArVar name="س" />
            <ArOp>/</ArOp>
            <ArVar name="ص" />
          </ArEq>{' '}
          وتحقق من قانون دي مورجان الأول.
        </div>
      </div>
    ),
    steps: [
      {
        label: 'إيجاد مجموعة الفرق (س / ص)',
        math: (
          <ArEq>
            <ArVar name="س" />
            <ArOp>/</ArOp>
            <ArVar name="ص" />
            <ArOp>=</ArOp>
            <ArSet items={[1, 2].map((n) => <ArNum key={n} value={n} />)} />
          </ArEq>
        ),
        reason:
          'نحذف من س العناصر المشتركة مع ص وهي ٣ و ٤، فيبقى ما تنفرد به س فقط.',
      },
      {
        label: 'إيجاد الطرف الأيمن لقانون دي مورجان (متممة الاتحاد)',
        math: (
          <ArEq>
            <ArVar name="س" />
            <ArOp>∪</ArOp>
            <ArVar name="ص" />
            <ArOp>=</ArOp>
            <ArSet items={[1, 2, 3, 4, 5].map((n) => <ArNum key={n} value={n} />)} />
            <ArOp>⇐</ArOp>
            <ArComplement>
              <ArParen>
                <ArVar name="س" />
                <ArOp>∪</ArOp>
                <ArVar name="ص" />
              </ArParen>
            </ArComplement>
            <ArOp>=</ArOp>
            <ArSet items={[6, 7].map((n) => <ArNum key={n} value={n} />)} />
          </ArEq>
        ),
        reason:
          'المتممة تعني كل عنصر في المجموعة الشاملة ش لا يقع داخل (س ∪ ص).',
      },
      {
        label: 'إيجاد الطرف الأيسر (تقاطع المتممتين) والمقارنة',
        math: (
          <ArEq>
            <ArComplement>
              <ArVar name="س" />
            </ArComplement>
            <ArOp>=</ArOp>
            <ArSet items={[5, 6, 7].map((n) => <ArNum key={n} value={n} />)} />
            <span className="px-1 text-slate-400">،</span>
            <ArComplement>
              <ArVar name="ص" />
            </ArComplement>
            <ArOp>=</ArOp>
            <ArSet items={[1, 2, 6, 7].map((n) => <ArNum key={n} value={n} />)} />
            <ArOp>⇐</ArOp>
            <ArComplement>
              <ArVar name="س" />
            </ArComplement>
            <ArOp>∩</ArOp>
            <ArComplement>
              <ArVar name="ص" />
            </ArComplement>
            <ArOp>=</ArOp>
            <ArSet items={[6, 7].map((n) => <ArNum key={n} value={n} />)} />
          </ArEq>
        ),
        reason:
          'تساوى الطرفان تماماً {٦ ، ٧}، وهذا يثبت أن المتممة تقلب الاتحاد إلى تقاطع.',
      },
    ],
  },
  {
    id: 'ex2',
    title: '٢. التحقق من علاقة التكافؤ (مثال الكتاب ١)',
    source: 'الدرس (١-٤) · ص ٢٥',
    statement: (
      <div className="text-sm text-slate-700">
        لتكن{' '}
        <ArEq>
          <ArVar name="م" />
          <ArOp>=</ArOp>
          <ArSet items={[1, 2, 3, 5].map((n) => <ArNum key={n} value={n} />)} />
        </ArEq>{' '}
        والعلاقة <ArVar name="ع" /> معرفة بشرط: «<ArEq><ArVar name="أ" /><ArOp>+</ArOp><ArVar name="ب" /></ArEq> عدد زوجي». هل <ArVar name="ع" /> علاقة تكافؤ؟
      </div>
    ),
    steps: [
      {
        label: 'فحص الانعكاسية: هل كل عنصر يرتبط بنفسه؟',
        math: (
          <ArEq>
            <ArPair x={<ArNum value={1} />} y={<ArNum value={1} />} />
            <span className="px-1 text-slate-400">،</span>
            <ArPair x={<ArNum value={2} />} y={<ArNum value={2} />} />
            <span className="px-1 text-slate-400">،</span>
            <ArPair x={<ArNum value={3} />} y={<ArNum value={3} />} />
            <span className="px-1 text-slate-400">،</span>
            <ArPair x={<ArNum value={5} />} y={<ArNum value={5} />} />
            <ArOp>∈</ArOp>
            <ArVar name="ع" />
          </ArEq>
        ),
        reason:
          'لأن مجموع أي عدد مع نفسه (أ + أ = ٢أ) هو دائماً عدد زوجي، فالعلاقة انعكاسية.',
      },
      {
        label: 'فحص التناظر: هل عكس كل زوج ينتمي للعلاقة؟',
        math: (
          <ArEq>
            <ArPair x={<ArNum value={1} />} y={<ArNum value={3} />} />
            <ArOp>∈</ArOp>
            <ArVar name="ع" />
            <ArOp>⇐</ArOp>
            <ArPair x={<ArNum value={3} />} y={<ArNum value={1} />} />
            <ArOp>∈</ArOp>
            <ArVar name="ع" />
          </ArEq>
        ),
        reason:
          'لأن الجمع عملية إبدالية (أ + ب = ب + أ)، فإذا كان المجموع زوجياً فإن عكسه زوجي أيضاً؛ إذن العلاقة متناظرة.',
      },
      {
        label: 'فحص التعدي والاستنتاج النهائي',
        math: (
          <ArEq>
            <ArPair x={<ArNum value={1} />} y={<ArNum value={3} />} />
            <span className="px-1 text-slate-400">و</span>
            <ArPair x={<ArNum value={3} />} y={<ArNum value={5} />} />
            <ArOp>⇐</ArOp>
            <ArPair x={<ArNum value={1} />} y={<ArNum value={5} />} />
            <ArOp>∈</ArOp>
            <ArVar name="ع" />
          </ArEq>
        ),
        reason:
          'جميع الأعداد الفردية {١، ٣، ٥} ترتبط فيما بينها، والزوجي {٢} يرتبط بنفسه. وبما أنها انعكاسية ومتناظرة ومتعدية فهي علاقة تكافؤ.',
      },
    ],
  },
  {
    id: 'ex3',
    title: '٣. التطبيق وقاعدة التطبيق والتطبيق الخطي',
    source: 'الدرسان (١-٥) و (١-٧) · ص ٣٧ و ٤٨',
    statement: (
      <div className="text-sm text-slate-700">
        إذا كان التطبيق{' '}
        <ArEq>
          <ArVar name="ت" />
          <ArOp>:</ArOp>
          <ArVar name="س" />
          <ArOp>←</ArOp>
          <ArVar name="ص" />
        </ArEq>{' '}
        بقاعدة{' '}
        <ArEq>
          <ArVar name="ت" />
          <ArParen>
            <ArVar name="أ" />
          </ArParen>
          <ArOp>=</ArOp>
          <ArTerm coeff={2} varName="أ" isFirst={true} />
          <ArOp>+</ArOp>
          <ArNum value={1} />
        </ArEq>{' '}
        حيث{' '}
        <ArEq>
          <ArVar name="س" />
          <ArOp>=</ArOp>
          <ArSet items={[1, 2, 3].map((n) => <ArNum key={n} value={n} />)} />
        </ArEq>
        ، أوجد المدى وفسّر لماذا هو تطبيق خطي على <ArVar name="ح" />.
      </div>
    ),
    steps: [
      {
        label: 'التعويض بعناصر المجال لإيجاد الصور',
        math: (
          <ArEq>
            <ArVar name="ت" />
            <ArParen><ArNum value={1} /></ArParen>
            <ArOp>=</ArOp>
            <ArNum value={3} />
            <span className="px-1.5 text-slate-400">،</span>
            <ArVar name="ت" />
            <ArParen><ArNum value={2} /></ArParen>
            <ArOp>=</ArOp>
            <ArNum value={5} />
            <span className="px-1.5 text-slate-400">،</span>
            <ArVar name="ت" />
            <ArParen><ArNum value={3} /></ArParen>
            <ArOp>=</ArOp>
            <ArNum value={7} />
          </ArEq>
        ),
        reason:
          'كل عنصر في المجال س يرتبط بصورة واحدة فقط في المجال المقابل، وهذا يحقق شرط التطبيق.',
      },
      {
        label: 'كتابة المدى ومقارنته بالتطبيق الخطي',
        math: (
          <ArEq>
            <span className="text-slate-700 font-bold">المدى</span>
            <ArOp>=</ArOp>
            <ArSet items={[3, 5, 7].map((n) => <ArNum key={n} value={n} />)} />
          </ArEq>
        ),
        reason:
          'عندما يكون المجال ح، تكون القاعدة ت(س) = أ س + ب (حيث أ = ٢، ب = ١) تطبيقاً خطياً يُمثَّل بيانياً بخط مستقيم.',
      },
    ],
  },
  {
    id: 'ex4',
    title: '٤. الفترات على مجموعة الأعداد الحقيقية ح',
    source: 'الدرس (١-٦) · ص ٤٢–٤٦',
    statement: (
      <div className="text-sm text-slate-700">
        اكتب المجموعة{' '}
        <ArEq>
          <ArVar name="س" />
          <ArOp>=</ArOp>
          <span className="text-teal-700 font-bold">{'{'}</span>
          <ArVar name="أ" />
          <ArOp>:</ArOp>
          <ArVar name="أ" />
          <ArOp>∈</ArOp>
          <ArVar name="ح" />
          <span className="px-1 text-blue-700 font-bold">،</span>
          <ArNum value={-3} />
          <ArOp>≤</ArOp>
          <ArVar name="أ" />
          <ArOp>&lt;</ArOp>
          <ArNum value={2} />
          <span className="text-teal-700 font-bold">{'}'}</span>
        </ArEq>{' '}
        بصورة فترة وحدد نوعها.
      </div>
    ),
    steps: [
      {
        label: 'تحديد طرفي الفترة وإغلاق كل طرف',
        math: (
          <ArEq>
            <ArVar name="س" />
            <ArOp>=</ArOp>
            <ArInterval
              start={<ArNum value={-3} />}
              end={<ArNum value={2} />}
              startClosed={true}
              endClosed={false}
            />
          </ArEq>
        ),
        reason:
          'لوجود علامة (≤) عند −٣ يكون القوس مغلقاً (يحتضن العدد)، ولوجود (<) فقط عند ٢ يكون القوس مفتوحاً (يتجه للخارج).',
      },
      {
        label: 'التمييز بين الفترة المغلقة والمفتوحة وغير المحددة',
        math: (
          <ArEq>
            <ArNum value={-3} />
            <ArOp>∈</ArOp>
            <ArVar name="س" />
            <span className="px-2 text-slate-400">بينما</span>
            <ArNum value={2} />
            <ArOp>∉</ArOp>
            <ArVar name="س" />
          </ArEq>
        ),
        reason:
          'الدائرة المظللة على خط الأعداد تعني أن الطرف ينتمي للفترة، أما الدائرة المفرغة فتعني أن كل الأعداد الأصغر منه تنتمي دون العدد نفسه.',
      },
    ],
  },
];

interface QuizItem {
  id: number;
  question: React.ReactNode;
  options: { id: string; label: React.ReactNode }[];
  correctId: string;
  explanation: string;
}

const UNIT1_QUIZ: QuizItem[] = [
  {
    id: 1,
    question: (
      <span>
        وفقاً لقانون دي مورجان، فإن متممة الاتحاد{' '}
        <ArEq>
          <ArComplement>
            <ArParen>
              <ArVar name="س" />
              <ArOp>∪</ArOp>
              <ArVar name="ص" />
            </ArParen>
          </ArComplement>
        </ArEq>{' '}
        تساوي:
      </span>
    ),
    options: [
      {
        id: 'a',
        label: (
          <ArEq>
            <ArComplement><ArVar name="س" /></ArComplement>
            <ArOp>∪</ArOp>
            <ArComplement><ArVar name="ص" /></ArComplement>
          </ArEq>
        ),
      },
      {
        id: 'b',
        label: (
          <ArEq>
            <ArComplement><ArVar name="س" /></ArComplement>
            <ArOp>∩</ArOp>
            <ArComplement><ArVar name="ص" /></ArComplement>
          </ArEq>
        ),
      },
      {
        id: 'c',
        label: (
          <ArEq>
            <ArVar name="س" />
            <ArOp>/</ArOp>
            <ArVar name="ص" />
          </ArEq>
        ),
      },
    ],
    correctId: 'b',
    explanation: 'قانون دي مورجان الأول: متممة اتحاد مجموعتين تساوي تقاطع متممتيهما.',
  },
  {
    id: 2,
    question: (
      <span>
        لكي تكون العلاقة <ArVar name="ع" /> على مجموعة <ArVar name="س" /> علاقة تكافؤ، يجب أن تكون:
      </span>
    ),
    options: [
      { id: 'a', label: 'انعكاسية ومتعدية فقط' },
      { id: 'b', label: 'انعكاسية ومتناظرة ومتعدية معاً' },
      { id: 'c', label: 'متناظرة فقط دون شروط أخرى' },
    ],
    correctId: 'b',
    explanation: 'علاقة التكافؤ تشترط تحقق الخواص الثلاث مجتمعة: الانعكاس والتناظر والتعدي.',
  },
  {
    id: 3,
    question: (
      <span>
        أي الأعداد التالية ينتمي إلى الفترة نصف المفتوحة{' '}
        <ArInterval
          start={<ArNum value={-2} />}
          end={<ArNum value={3} />}
          startClosed={true}
          endClosed={false}
        />
        ؟
      </span>
    ),
    options: [
      { id: 'a', label: <ArNum value={3} /> },
      { id: 'b', label: <ArNum value={-3} /> },
      { id: 'c', label: <ArNum value={-2} /> },
    ],
    correctId: 'c',
    explanation: 'الطرف −٢ مغلق لذا ينتمي للفترة، بينما الطرف ٣ مفتوح فلا ينتمي إليها.',
  },
];

export function Unit1SetsRelations() {
  const [activeExampleId, setActiveExampleId] = useState<string>(UNIT1_EXAMPLES[0].id);

  // Venn Diagram & De Morgan Lab state
  const [selectedOp, setSelectedOp] = useState<VennOp>('demorgan1');
  const [setX, setSetX] = useState<number[]>(INITIAL_X);
  const [setY, setSetY] = useState<number[]>(INITIAL_Y);

  // Equivalence Relation Lab state
  const [relPairs, setRelPairs] = useState<Set<string>>(() => buildPresetRelation('evenSum'));
  const [relPresetName, setRelPresetName] = useState<string>('أ + ب عدد زوجي (مثال الكتاب ١)');

  // Number Line & Linear Function Lab state
  const [graphTab, setGraphTab] = useState<'interval' | 'linearFunc'>('interval');
  const [intervalMode, setIntervalMode] = useState<'bounded' | 'rayRight' | 'rayLeft'>('bounded');
  const [startVal, setStartVal] = useState<number>(-3);
  const [endVal, setEndVal] = useState<number>(2);
  const [startClosed, setStartClosed] = useState<boolean>(true);
  const [endClosed, setEndClosed] = useState<boolean>(false);

  const [linA, setLinA] = useState<number>(2);
  const [linB, setLinB] = useState<number>(1);

  // Quiz state
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const activeExample =
    UNIT1_EXAMPLES.find((e) => e.id === activeExampleId) ?? UNIT1_EXAMPLES[0];

  const currentVennMeta = VENN_OPS.find((o) => o.id === selectedOp) ?? VENN_OPS[0];

  const vennRegions = useMemo(() => {
    const xSet = new Set(setX);
    const ySet = new Set(setY);
    const onlyX = UNIVERSE.filter((n) => xSet.has(n) && !ySet.has(n));
    const both = UNIVERSE.filter((n) => xSet.has(n) && ySet.has(n));
    const onlyY = UNIVERSE.filter((n) => !xSet.has(n) && ySet.has(n));
    const outside = UNIVERSE.filter((n) => !xSet.has(n) && !ySet.has(n));
    return { onlyX, both, onlyY, outside };
  }, [setX, setY]);

  const vennResult = useMemo(() => {
    const out: number[] = [];
    if (currentVennMeta.regions.onlyX) out.push(...vennRegions.onlyX);
    if (currentVennMeta.regions.both) out.push(...vennRegions.both);
    if (currentVennMeta.regions.onlyY) out.push(...vennRegions.onlyY);
    if (currentVennMeta.regions.outside) out.push(...vennRegions.outside);
    return out.sort((a, b) => a - b);
  }, [currentVennMeta, vennRegions]);

  const cycleElementRegion = (el: number) => {
    const inX = setX.includes(el);
    const inY = setY.includes(el);
    // Cycle: onlyX -> both -> onlyY -> outside -> onlyX
    if (inX && !inY) {
      setSetY((prev) => [...prev, el]);
    } else if (inX && inY) {
      setSetX((prev) => prev.filter((n) => n !== el));
    } else if (!inX && inY) {
      setSetY((prev) => prev.filter((n) => n !== el));
    } else {
      setSetX((prev) => [...prev, el]);
    }
  };

  // Equivalence relation live analysis
  const relAnalysis = useMemo(() => {
    let reflexive = true;
    let missingRefl: number | null = null;
    for (const a of REL_ELEMENTS) {
      if (!relPairs.has(pairKey(a, a))) {
        reflexive = false;
        missingRefl = a;
        break;
      }
    }

    let symmetric = true;
    let symCounter: [number, number] | null = null;
    for (const a of REL_ELEMENTS) {
      for (const b of REL_ELEMENTS) {
        if (relPairs.has(pairKey(a, b)) && !relPairs.has(pairKey(b, a))) {
          symmetric = false;
          symCounter = [a, b];
          break;
        }
      }
      if (!symmetric) break;
    }

    let transitive = true;
    let transCounter: [number, number, number] | null = null;
    for (const a of REL_ELEMENTS) {
      for (const b of REL_ELEMENTS) {
        if (!relPairs.has(pairKey(a, b))) continue;
        for (const c of REL_ELEMENTS) {
          if (relPairs.has(pairKey(b, c)) && !relPairs.has(pairKey(a, c))) {
            transitive = false;
            transCounter = [a, b, c];
            break;
          }
        }
        if (!transitive) break;
      }
      if (!transitive) break;
    }

    return {
      reflexive,
      missingRefl,
      symmetric,
      symCounter,
      transitive,
      transCounter,
      isEquivalence: reflexive && symmetric && transitive,
    };
  }, [relPairs]);

  const toggleRelPair = (a: number, b: number) => {
    setRelPresetName('علاقة مخصصة من تعديلك');
    setRelPairs((prev) => {
      const next = new Set(prev);
      const k = pairKey(a, b);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  // Keep bounded interval ordered
  const lowBound = Math.min(startVal, endVal);
  const highBound = Math.max(startVal, endVal);
  const numberLineX = (v: number) => 40 + ((v + 6) / 12) * 520;

  // Arrow diagram node positions for REL_ELEMENTS [1, 2, 3, 5]
  const relNodes: Record<number, { x: number; y: number }> = {
    1: { x: 240, y: 55 },
    2: { x: 80, y: 55 },
    3: { x: 240, y: 175 },
    5: { x: 80, y: 175 },
  };

  return (
    <div className="space-y-10">
      {/* Section 1: Scientific Background & Lesson Philosophy */}
      <section id="philosophy" className="scroll-mt-24 space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                الخلفية العلمية وفلسفة الوحدة الأولى: المجموعات والعلاقات
              </h2>
              <p className="text-slate-600 text-sm md:text-base mt-1 leading-relaxed">
                تبدأ رياضيات الصف التاسع ببناء «لغة الدقة المنطقية»: كيف نصف مجموعة غير منتهية بقاعدة واحدة (الصفة المميزة)، وكيف نربط العناصر بعلاقات تكافؤ وتطبيقات خطية، ثم نوسّع عالم الأعداد ليشمل جميع الأعداد الحقيقية <ArVar name="ح" /> وفتراتها على خط الأعداد.
              </p>
            </div>
          </div>

          {/* Real Numbers Inclusion Ladder */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-700" />
                تدرّج مجموعات الأعداد حتى الأعداد الحقيقية (الدرس ١-٦)
              </h3>
              <ArEq className="text-base">
                <ArVar name="ط" />
                <ArOp>⊂</ArOp>
                <ArVar name="ص" />
                <ArOp>⊂</ArOp>
                <ArVar name="ن" />
                <ArOp>⊂</ArOp>
                <ArVar name="ح" />
                <span className="px-2 text-slate-400">،</span>
                <ArVar name="ح" />
                <ArOp>=</ArOp>
                <ArVar name="ن" />
                <ArOp>∪</ArOp>
                <ArComplement><ArVar name="ن" /></ArComplement>
              </ArEq>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1">
                <div className="font-extrabold text-blue-900">الأعداد الطبيعية (ط)</div>
                <div className="text-xs text-slate-600">
                  <ArSet items={[0, 1, 2, 3].map((n) => <ArNum key={n} value={n} />)} /> ...
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1">
                <div className="font-extrabold text-blue-900">الأعداد الصحيحة (ص)</div>
                <div className="text-xs text-slate-600">تضيف الأعداد السالبة إلى ط مثل −٣، −٢، −١.</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1">
                <div className="font-extrabold text-teal-800">الأعداد النسبية (ن)</div>
                <div className="text-xs text-slate-600">كل عدد يُكتب بصورة كسر أ/ب حيث ب ≠ ٠.</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1">
                <div className="font-extrabold text-amber-800">غير النسبية (نَ) والحقيقية (ح)</div>
                <div className="text-xs text-slate-600">
                  جذور غير تامة مثل √٢ و π، واتحادها مع ن يملأ خط الأعداد بلا فجوات.
                </div>
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
              اختر أي مثال لمراجعة الحل الكامل وفهم التعليل الرياضي خلف كل خطوة.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="أمثلة الوحدة الأولى">
          {UNIT1_EXAMPLES.map((ex) => {
            const active = ex.id === activeExample.id;
            return (
              <button
                key={ex.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveExampleId(ex.id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold border transition-colors cursor-pointer ${
                  active
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {ex.title}
              </button>
            );
          })}
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
              <div
                key={idx}
                className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white"
              >
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

      {/* Section 3: Interactive Labs (Venn & De Morgan + Equivalence Relation Inspector) */}
      <section id="interactive-trainer" className="scroll-mt-24 space-y-6">
        {/* Lab A: Interactive Venn Diagram & De Morgan Explorer */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 shrink-0">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  مختبر مخطط فن وقوانين دي مورجان التفاعلي
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  اختر العملية لمشاهدة التظليل الهندسي، وانقر على أي رقم من ١ إلى ٨ لنقله بين المناطق ورؤية الناتج فوراً.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSetX(INITIAL_X);
                setSetY(INITIAL_Y);
                setSelectedOp('demorgan1');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              إعادة الضبط
            </button>
          </div>

          {/* Operation buttons */}
          <div className="flex flex-wrap gap-2">
            {VENN_OPS.map((op) => {
              const active = op.id === selectedOp;
              return (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => setSelectedOp(op.id)}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
                    active
                      ? 'bg-blue-900 text-white border-blue-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {op.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* SVG Venn Diagram */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <svg
                viewBox="0 0 460 270"
                className="w-full h-auto select-none"
                role="img"
                aria-label="مخطط فن التفاعلي للمجموعتين س و ص داخل المجموعة الشاملة ش"
              >
                <defs>
                  <clipPath id="clipCircleX">
                    <circle cx="285" cy="140" r="85" />
                  </clipPath>
                  <clipPath id="clipCircleY">
                    <circle cx="175" cy="140" r="85" />
                  </clipPath>
                </defs>

                {/* Universal Set ش rectangle */}
                <rect
                  x="16"
                  y="16"
                  width="428"
                  height="238"
                  rx="16"
                  fill={currentVennMeta.regions.outside ? '#dbeafe' : '#ffffff'}
                  stroke="#334155"
                  strokeWidth="2"
                />
                <text
                  x="426"
                  y="40"
                  textAnchor="end"
                  className="fill-slate-800 font-extrabold text-sm"
                >
                  ش (الشاملة)
                </text>

                {/* Base white circles so outside fill doesn't bleed inside circles */}
                <circle cx="285" cy="140" r="85" fill="#ffffff" />
                <circle cx="175" cy="140" r="85" fill="#ffffff" />

                {/* Circle X (right side in RTL) */}
                {currentVennMeta.regions.onlyX && (
                  <circle cx="285" cy="140" r="85" fill="#bfdbfe" />
                )}

                {/* Circle Y (left side in RTL) */}
                {currentVennMeta.regions.onlyY && (
                  <circle cx="175" cy="140" r="85" fill="#ccfbf1" />
                )}

                {/* Intersection lens (both) */}
                <g clipPath="url(#clipCircleX)">
                  <circle
                    cx="175"
                    cy="140"
                    r="85"
                    fill={currentVennMeta.regions.both ? '#5eead4' : '#ffffff'}
                  />
                </g>

                {/* Outlines */}
                <circle
                  cx="285"
                  cy="140"
                  r="85"
                  fill="none"
                  stroke="#1e3a8a"
                  strokeWidth="2.5"
                />
                <circle
                  cx="175"
                  cy="140"
                  r="85"
                  fill="none"
                  stroke="#0f766e"
                  strokeWidth="2.5"
                />

                {/* Circle labels */}
                <text x="320" y="72" textAnchor="middle" className="fill-blue-950 font-extrabold text-base">
                  س
                </text>
                <text x="140" y="72" textAnchor="middle" className="fill-teal-900 font-extrabold text-base">
                  ص
                </text>

                {/* Elements placed cleanly inside each region */}
                {vennRegions.onlyX.map((el, i) => (
                  <g
                    key={el}
                    onClick={() => cycleElementRegion(el)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={308 + (i % 2) * 28}
                      cy={108 + Math.floor(i / 2) * 32}
                      r="13"
                      fill="#ffffff"
                      stroke="#1e40af"
                      strokeWidth="1.5"
                    />
                    <text
                      x={308 + (i % 2) * 28}
                      y={113 + Math.floor(i / 2) * 32}
                      textAnchor="middle"
                      className="fill-blue-950 font-bold text-xs"
                    >
                      {toArabicDigits(el)}
                    </text>
                  </g>
                ))}

                {vennRegions.both.map((el, i) => (
                  <g
                    key={el}
                    onClick={() => cycleElementRegion(el)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={230}
                      cy={106 + i * 30}
                      r="13"
                      fill="#ffffff"
                      stroke="#0f766e"
                      strokeWidth="1.5"
                    />
                    <text
                      x={230}
                      y={111 + i * 30}
                      textAnchor="middle"
                      className="fill-teal-950 font-bold text-xs"
                    >
                      {toArabicDigits(el)}
                    </text>
                  </g>
                ))}

                {vennRegions.onlyY.map((el, i) => (
                  <g
                    key={el}
                    onClick={() => cycleElementRegion(el)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={126 + (i % 2) * 28}
                      cy={108 + Math.floor(i / 2) * 32}
                      r="13"
                      fill="#ffffff"
                      stroke="#0f766e"
                      strokeWidth="1.5"
                    />
                    <text
                      x={126 + (i % 2) * 28}
                      y={113 + Math.floor(i / 2) * 32}
                      textAnchor="middle"
                      className="fill-teal-950 font-bold text-xs"
                    >
                      {toArabicDigits(el)}
                    </text>
                  </g>
                ))}

                {vennRegions.outside.map((el, i) => (
                  <g
                    key={el}
                    onClick={() => cycleElementRegion(el)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={48 + i * 34}
                      cy={232}
                      r="13"
                      fill="#ffffff"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                    <text
                      x={48 + i * 34}
                      y={237}
                      textAnchor="middle"
                      className="fill-slate-800 font-bold text-xs"
                    >
                      {toArabicDigits(el)}
                    </text>
                  </g>
                ))}
              </svg>
              <div className="text-xs text-slate-500 text-center mt-2">
                انقر على أي رقم داخل الرسم لنقله بين (س فقط ← التقاطع ← ص فقط ← خارج الدائرتين)
              </div>
            </div>

            {/* Live Formula & Result Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="text-xs font-bold text-slate-500">المجموعتان الحاليتان:</div>
                <div className="space-y-1.5 text-sm">
                  <div>
                    <ArEq>
                      <ArVar name="س" />
                      <ArOp>=</ArOp>
                      {setX.length > 0 ? (
                        <ArSet
                          items={[...setX]
                            .sort((a, b) => a - b)
                            .map((n) => (
                              <ArNum key={n} value={n} />
                            ))}
                        />
                      ) : (
                        <ArOp>∅</ArOp>
                      )}
                    </ArEq>
                  </div>
                  <div>
                    <ArEq>
                      <ArVar name="ص" />
                      <ArOp>=</ArOp>
                      {setY.length > 0 ? (
                        <ArSet
                          items={[...setY]
                            .sort((a, b) => a - b)
                            .map((n) => (
                              <ArNum key={n} value={n} />
                            ))}
                        />
                      ) : (
                        <ArOp>∅</ArOp>
                      )}
                    </ArEq>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold text-blue-900">
                  العملية المختارة: {currentVennMeta.label}
                </div>
                <ArMathBlock className="bg-white border border-blue-100">
                  {currentVennMeta.formula}
                </ArMathBlock>
                <div className="text-sm font-bold text-slate-800 flex flex-wrap items-center gap-2">
                  <span>الناتج:</span>
                  {vennResult.length > 0 ? (
                    <ArSet items={vennResult.map((n) => <ArNum key={n} value={n} />)} />
                  ) : (
                    <ArOp>∅ (المجموعة الخالية)</ArOp>
                  )}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {currentVennMeta.explanation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lab B: Interactive Equivalence Relation Inspector */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                فاحص علاقة التكافؤ التفاعلي على المجموعة{' '}
                <ArEq>
                  <ArVar name="م" />
                  <ArOp>=</ArOp>
                  <ArSet items={REL_ELEMENTS.map((n) => <ArNum key={n} value={n} />)} />
                </ArEq>
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                جرّب أمثلة الكتاب أو بدّل أي زوج مرتب في الجدول لتشاهد المخطط السهمي ونتيجة فحص الانعكاس والتناظر والتعدي فوراً.
              </p>
            </div>
          </div>

          {/* Preset Relation Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'evenSum' as const, label: 'أ + ب زوجي (تكافؤ — مثال الكتاب ١)' },
              { key: 'lessThan' as const, label: 'أ < ب (متعدية فقط)' },
              { key: 'gte' as const, label: 'أ ≥ ب (انعكاسية ومتعدية فقط)' },
              { key: 'notEqual' as const, label: 'أ ≠ ب (متناظرة فقط)' },
            ].map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => {
                  setRelPairs(buildPresetRelation(p.key));
                  setRelPresetName(p.label);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-700 cursor-pointer transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Interactive Relation Matrix + SVG Arrow Diagram */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Toggle Matrix */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold text-slate-600">
                  انقر لإضافة أو حذف سهم (أ ← ب):
                </div>
                <table className="w-full text-center border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="p-1.5 text-xs text-slate-500 font-bold">أ \ ب</th>
                      {REL_ELEMENTS.map((b) => (
                        <th key={b} className="p-1.5 font-extrabold text-blue-950">
                          {toArabicDigits(b)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {REL_ELEMENTS.map((a) => (
                      <tr key={a}>
                        <td className="p-1.5 font-extrabold text-blue-950">{toArabicDigits(a)}</td>
                        {REL_ELEMENTS.map((b) => {
                          const on = relPairs.has(pairKey(a, b));
                          return (
                            <td key={b} className="p-1">
                              <button
                                type="button"
                                onClick={() => toggleRelPair(a, b)}
                                aria-label={`الزوج المرتب (${toArabicDigits(a)} ، ${toArabicDigits(b)})`}
                                aria-pressed={on}
                                className={`w-full h-9 rounded-lg font-bold text-xs border transition-colors cursor-pointer ${
                                  on
                                    ? 'bg-teal-700 text-white border-teal-700'
                                    : 'bg-white text-slate-400 border-slate-200 hover:border-blue-400'
                                }`}
                              >
                                {on ? '✓' : '·'}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Arrow Diagram SVG */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                <div className="text-xs font-bold text-slate-600 mb-2">
                  المخطط السهمي للعلاقة ({relPresetName}):
                </div>
                <svg viewBox="0 0 320 230" className="w-full h-auto" role="img" aria-label="المخطط السهمي للعلاقة">
                  <defs>
                    <marker
                      id="relArrow"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#0f766e" />
                    </marker>
                  </defs>

                  {/* Edges */}
                  {REL_ELEMENTS.map((a) =>
                    REL_ELEMENTS.map((b) => {
                      if (!relPairs.has(pairKey(a, b))) return null;
                      const p1 = relNodes[a];
                      const p2 = relNodes[b];
                      if (a === b) {
                        // Self loop
                        const dx = p1.x > 160 ? 22 : -22;
                        const dy = p1.y < 115 ? -24 : 24;
                        return (
                          <path
                            key={`${a}-${b}`}
                            d={`M ${p1.x} ${p1.y} C ${p1.x + dx * 2.1} ${p1.y + dy * 0.4}, ${p1.x + dx * 0.4} ${p1.y + dy * 2.1}, ${p1.x + (dx > 0 ? 12 : -12)} ${p1.y + (dy > 0 ? 14 : -14)}`}
                            fill="none"
                            stroke="#1d4ed8"
                            strokeWidth="1.8"
                            markerEnd="url(#relArrow)"
                          />
                        );
                      }
                      const vx = p2.x - p1.x;
                      const vy = p2.y - p1.y;
                      const len = Math.hypot(vx, vy) || 1;
                      const ux = vx / len;
                      const uy = vy / len;
                      const startX = p1.x + ux * 20;
                      const startY = p1.y + uy * 20;
                      const endX = p2.x - ux * 22;
                      const endY = p2.y - uy * 22;
                      const hasReverse = relPairs.has(pairKey(b, a));
                      const curveOffset = hasReverse ? 14 : 0;
                      const midX = (startX + endX) / 2 - uy * curveOffset;
                      const midY = (startY + endY) / 2 + ux * curveOffset;
                      return (
                        <path
                          key={`${a}-${b}`}
                          d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
                          fill="none"
                          stroke="#0f766e"
                          strokeWidth="1.8"
                          markerEnd="url(#relArrow)"
                        />
                      );
                    })
                  )}

                  {/* Nodes */}
                  {REL_ELEMENTS.map((n) => {
                    const p = relNodes[n];
                    return (
                      <g key={n}>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="18"
                          fill="#ffffff"
                          stroke="#1e3a8a"
                          strokeWidth="2.2"
                        />
                        <text
                          x={p.x}
                          y={p.y + 5}
                          textAnchor="middle"
                          className="fill-blue-950 font-extrabold text-sm"
                        >
                          {toArabicDigits(n)}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Live Verdict Panel */}
            <div className="lg:col-span-5 space-y-3">
              {[
                {
                  title: '١. انعكاسية',
                  ok: relAnalysis.reflexive,
                  detail: relAnalysis.reflexive
                    ? 'كل عنصر في م لديه عروة (حلقة) مرتبطة بنفسه.'
                    : `الزوج (${toArabicDigits(relAnalysis.missingRefl ?? 1)} ، ${toArabicDigits(relAnalysis.missingRefl ?? 1)}) غير موجود.`,
                },
                {
                  title: '٢. متناظرة',
                  ok: relAnalysis.symmetric,
                  detail: relAnalysis.symmetric
                    ? 'لكل سهم ذاهب من أ إلى ب يوجد سهم عائد من ب إلى أ.'
                    : `يوجد (${toArabicDigits(relAnalysis.symCounter?.[0] ?? 1)} ، ${toArabicDigits(relAnalysis.symCounter?.[1] ?? 2)}) ولا يوجد عكسه (${toArabicDigits(relAnalysis.symCounter?.[1] ?? 2)} ، ${toArabicDigits(relAnalysis.symCounter?.[0] ?? 1)}).`,
                },
                {
                  title: '٣. متعدية',
                  ok: relAnalysis.transitive,
                  detail: relAnalysis.transitive
                    ? 'كلما ارتبط أ مع ب وارتبط ب مع جـ، وُجد السهم المباشر (أ ، جـ).'
                    : `يوجد (${toArabicDigits(relAnalysis.transCounter?.[0] ?? 1)} ، ${toArabicDigits(relAnalysis.transCounter?.[1] ?? 2)}) و (${toArabicDigits(relAnalysis.transCounter?.[1] ?? 2)} ، ${toArabicDigits(relAnalysis.transCounter?.[2] ?? 3)}) ولكن ينقص (${toArabicDigits(relAnalysis.transCounter?.[0] ?? 1)} ، ${toArabicDigits(relAnalysis.transCounter?.[2] ?? 3)}).`,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`rounded-xl border p-3.5 flex items-start gap-2.5 ${
                    item.ok
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50/70 border-rose-200 text-rose-950'
                  }`}
                >
                  {item.ok ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <div className="text-sm font-extrabold">
                      {item.title}: {item.ok ? 'متحققة' : 'غير متحققة'}
                    </div>
                    <div className="text-xs leading-relaxed">{item.detail}</div>
                  </div>
                </div>
              ))}

              <div
                className={`rounded-xl border p-4 text-sm font-extrabold flex items-center gap-2 ${
                  relAnalysis.isEquivalence
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                {relAnalysis.isEquivalence ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-teal-300" />
                    <span>النتيجة: هذه علاقة تكافؤ كاملة لأن الخواص الثلاث تحققت معاً.</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-5 h-5 shrink-0 text-slate-600" />
                    <span>النتيجة: ليست علاقة تكافؤ؛ أكمِل الخاصية الناقصة أعلاه لتصبح تكافؤاً.</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Interactive Real Number Line Intervals & Linear Mapping Lab */}
      <section id="interactive-graph" className="scroll-mt-24">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                المختبر البياني: خط الأعداد والفترات والتطبيق الخطي
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                بدّل بين مختبر الفترات الحقيقية (الدرس ١-٦) ومختبر التطبيق الخطي (الدرس ١-٧).
              </p>
            </div>
            <div className="inline-flex p-1 bg-slate-100 border border-slate-200 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setGraphTab('interval')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
                  graphTab === 'interval'
                    ? 'bg-white text-blue-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                الفترات على خط الأعداد
              </button>
              <button
                type="button"
                onClick={() => setGraphTab('linearFunc')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
                  graphTab === 'linearFunc'
                    ? 'bg-white text-blue-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                التطبيق الخطي ت(س) = أ س + ب
              </button>
            </div>
          </div>

          {graphTab === 'interval' ? (
            <div className="space-y-5">
              {/* Interval Type Selector */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'bounded' as const, label: 'فترة محددة بين عددين' },
                  { id: 'rayRight' as const, label: 'غير محددة نحو +∞' },
                  { id: 'rayLeft' as const, label: 'غير محددة نحو −∞' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setIntervalMode(m.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                      intervalMode === m.id
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(intervalMode === 'bounded' || intervalMode === 'rayRight') && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm font-bold">
                      <label htmlFor="u1-start">الطرف الأول (البداية): {toArabicDigits(startVal)}</label>
                      <button
                        type="button"
                        onClick={() => setStartClosed((v) => !v)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                          startClosed
                            ? 'bg-teal-700 text-white border-teal-700'
                            : 'bg-white text-rose-700 border-rose-300'
                        }`}
                      >
                        {startClosed ? 'مغلق ● (ينتمي)' : 'مفتوح ○ (لا ينتمي)'}
                      </button>
                    </div>
                    <input
                      id="u1-start"
                      type="range"
                      min={-5}
                      max={5}
                      step={1}
                      value={startVal}
                      onChange={(e) => setStartVal(Number(e.target.value))}
                      className="w-full accent-blue-900 cursor-pointer"
                    />
                  </div>
                )}

                {(intervalMode === 'bounded' || intervalMode === 'rayLeft') && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm font-bold">
                      <label htmlFor="u1-end">الطرف الثاني (النهاية): {toArabicDigits(endVal)}</label>
                      <button
                        type="button"
                        onClick={() => setEndClosed((v) => !v)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                          endClosed
                            ? 'bg-teal-700 text-white border-teal-700'
                            : 'bg-white text-rose-700 border-rose-300'
                        }`}
                      >
                        {endClosed ? 'مغلق ● (ينتمي)' : 'مفتوح ○ (لا ينتمي)'}
                      </button>
                    </div>
                    <input
                      id="u1-end"
                      type="range"
                      min={-5}
                      max={5}
                      step={1}
                      value={endVal}
                      onChange={(e) => setEndVal(Number(e.target.value))}
                      className="w-full accent-teal-700 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* SVG Real Number Line */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <svg viewBox="0 0 600 120" className="w-full h-auto" role="img" aria-label="تمثيل الفترة على خط الأعداد الحقيقية">
                  {/* Base axis */}
                  <line x1="20" y1="64" x2="580" y2="64" stroke="#64748b" strokeWidth="2.5" />
                  <polygon points="585,64 574,58 574,70" fill="#64748b" />
                  <polygon points="15,64 26,58 26,70" fill="#64748b" />
                  <text x="580" y="42" textAnchor="middle" className="fill-slate-600 font-bold text-xs">+∞</text>
                  <text x="22" y="42" textAnchor="middle" className="fill-slate-600 font-bold text-xs">−∞</text>

                  {/* Ticks */}
                  {Array.from({ length: 13 }, (_, i) => i - 6).map((v) => {
                    const x = numberLineX(v);
                    return (
                      <g key={v}>
                        <line x1={x} y1="56" x2={x} y2="72" stroke="#94a3b8" strokeWidth="1.5" />
                        <text
                          x={x}
                          y="95"
                          textAnchor="middle"
                          className={`text-xs font-bold ${v === 0 ? 'fill-blue-900' : 'fill-slate-600'}`}
                        >
                          {v < 0 ? `−${toArabicDigits(Math.abs(v))}` : toArabicDigits(v)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Active Interval Highlight */}
                  {intervalMode === 'bounded' && (
                    <g>
                      <line
                        x1={numberLineX(lowBound)}
                        y1="64"
                        x2={numberLineX(highBound)}
                        y2="64"
                        stroke="#0f766e"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                      <circle
                        cx={numberLineX(lowBound)}
                        cy="64"
                        r="7"
                        fill={
                          (startVal <= endVal ? startClosed : endClosed) ? '#0f766e' : '#ffffff'
                        }
                        stroke="#0f766e"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx={numberLineX(highBound)}
                        cy="64"
                        r="7"
                        fill={
                          (startVal <= endVal ? endClosed : startClosed) ? '#0f766e' : '#ffffff'
                        }
                        stroke="#0f766e"
                        strokeWidth="2.5"
                      />
                    </g>
                  )}

                  {intervalMode === 'rayRight' && (
                    <g>
                      <line
                        x1={numberLineX(startVal)}
                        y1="64"
                        x2="575"
                        y2="64"
                        stroke="#0f766e"
                        strokeWidth="6"
                      />
                      <polygon points="585,64 572,56 572,72" fill="#0f766e" />
                      <circle
                        cx={numberLineX(startVal)}
                        cy="64"
                        r="7"
                        fill={startClosed ? '#0f766e' : '#ffffff'}
                        stroke="#0f766e"
                        strokeWidth="2.5"
                      />
                    </g>
                  )}

                  {intervalMode === 'rayLeft' && (
                    <g>
                      <line
                        x1="25"
                        y1="64"
                        x2={numberLineX(endVal)}
                        y2="64"
                        stroke="#0f766e"
                        strokeWidth="6"
                      />
                      <polygon points="15,64 28,56 28,72" fill="#0f766e" />
                      <circle
                        cx={numberLineX(endVal)}
                        cy="64"
                        r="7"
                        fill={endClosed ? '#0f766e' : '#ffffff'}
                        stroke="#0f766e"
                        strokeWidth="2.5"
                      />
                    </g>
                  )}
                </svg>
              </div>

              {/* Dual Notation Readout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-1.5">
                  <div className="text-xs font-bold text-blue-900">صيغة الفترة:</div>
                  <ArMathBlock className="bg-white border border-blue-100">
                    {intervalMode === 'bounded' && (
                      <ArInterval
                        start={<ArNum value={lowBound} />}
                        end={<ArNum value={highBound} />}
                        startClosed={startVal <= endVal ? startClosed : endClosed}
                        endClosed={startVal <= endVal ? endClosed : startClosed}
                      />
                    )}
                    {intervalMode === 'rayRight' && (
                      <ArInterval
                        start={<ArNum value={startVal} />}
                        end={<span className="ar-num font-bold text-blue-900">+∞</span>}
                        startClosed={startClosed}
                        endClosed={false}
                      />
                    )}
                    {intervalMode === 'rayLeft' && (
                      <ArInterval
                        start={<span className="ar-num font-bold text-rose-700">−∞</span>}
                        end={<ArNum value={endVal} />}
                        startClosed={false}
                        endClosed={endClosed}
                      />
                    )}
                  </ArMathBlock>
                </div>

                <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4 space-y-1.5">
                  <div className="text-xs font-bold text-teal-900">صيغة الصفة المميزة:</div>
                  <ArMathBlock className="bg-white border border-teal-100">
                    <ArEq>
                      <span className="text-teal-700 font-bold">{'{'}</span>
                      <ArVar name="س" />
                      <ArOp>:</ArOp>
                      <ArVar name="س" />
                      <ArOp>∈</ArOp>
                      <ArVar name="ح" />
                      <span className="px-1 text-blue-700 font-bold">،</span>
                      {intervalMode === 'bounded' && (
                        <>
                          <ArNum value={lowBound} />
                          <ArOp>{(startVal <= endVal ? startClosed : endClosed) ? '≤' : '<'}</ArOp>
                          <ArVar name="س" />
                          <ArOp>{(startVal <= endVal ? endClosed : startClosed) ? '≤' : '<'}</ArOp>
                          <ArNum value={highBound} />
                        </>
                      )}
                      {intervalMode === 'rayRight' && (
                        <>
                          <ArVar name="س" />
                          <ArOp>{startClosed ? '≥' : '>'}</ArOp>
                          <ArNum value={startVal} />
                        </>
                      )}
                      {intervalMode === 'rayLeft' && (
                        <>
                          <ArVar name="س" />
                          <ArOp>{endClosed ? '≤' : '<'}</ArOp>
                          <ArNum value={endVal} />
                        </>
                      )}
                      <span className="text-teal-700 font-bold">{'}'}</span>
                    </ArEq>
                  </ArMathBlock>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-4">
                <ArMathBlock className="bg-slate-50 border border-slate-200">
                  <ArEq>
                    <ArVar name="ت" />
                    <ArParen><ArVar name="س" /></ArParen>
                    <ArOp>=</ArOp>
                    {linA !== 0 && <ArTerm coeff={linA} varName="س" isFirst={true} />}
                    {linB !== 0 && (
                      <>
                        {linA !== 0 && <ArOp>{linB < 0 ? '−' : '+'}</ArOp>}
                        <ArNum value={linA !== 0 ? Math.abs(linB) : linB} />
                      </>
                    )}
                    {linA === 0 && linB === 0 && <ArNum value={0} />}
                  </ArEq>
                </ArMathBlock>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <label htmlFor="lin-a">معامل الميل (أ)</label>
                      <ArNum value={linA} />
                    </div>
                    <input
                      id="lin-a"
                      type="range"
                      min={-3}
                      max={3}
                      step={1}
                      value={linA}
                      onChange={(e) => setLinA(Number(e.target.value))}
                      className="w-full accent-blue-900 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <label htmlFor="lin-b">الحد الثابت — التقاطع الصادي (ب)</label>
                      <ArNum value={linB} />
                    </div>
                    <input
                      id="lin-b"
                      type="range"
                      min={-4}
                      max={4}
                      step={1}
                      value={linB}
                      onChange={(e) => setLinB(Number(e.target.value))}
                      className="w-full accent-teal-700 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Table of values */}
                <div className="border border-slate-200 rounded-xl overflow-hidden text-sm">
                  <table className="w-full text-center">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="py-2 font-extrabold text-blue-950">س</th>
                        {[-2, -1, 0, 1, 2].map((x) => (
                          <th key={x} className="py-2 font-bold text-slate-700">
                            <ArNum value={x} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 font-extrabold text-teal-800 bg-slate-50">ت(س)</td>
                        {[-2, -1, 0, 1, 2].map((x) => (
                          <td key={x} className="py-2 font-bold text-slate-900">
                            <ArNum value={linA * x + linB} />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SVG Coordinate Plane for Linear Function */}
              <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <svg viewBox="0 0 360 280" className="w-full h-auto" role="img" aria-label="التمثيل البياني للتطبيق الخطي">
                  {/* Grid */}
                  {Array.from({ length: 11 }, (_, i) => i - 5).map((n) => {
                    const px = 180 + n * 28;
                    const py = 140 - n * 24;
                    return (
                      <g key={n}>
                        <line x1={px} y1="16" x2={px} y2="264" stroke="#e2e8f0" strokeWidth="1" />
                        <line x1="20" y1={py} x2="340" y2={py} stroke="#e2e8f0" strokeWidth="1" />
                      </g>
                    );
                  })}
                  {/* Axes */}
                  <line x1="20" y1="140" x2="340" y2="140" stroke="#334155" strokeWidth="2" />
                  <line x1="180" y1="16" x2="180" y2="264" stroke="#334155" strokeWidth="2" />
                  <text x="332" y="132" className="fill-slate-700 font-bold text-xs">س</text>
                  <text x="190" y="26" className="fill-slate-700 font-bold text-xs">ص</text>

                  {/* Line y = a*x + b */}
                  <line
                    x1={180 + -5 * 28}
                    y1={140 - (linA * -5 + linB) * 24}
                    x2={180 + 5 * 28}
                    y2={140 - (linA * 5 + linB) * 24}
                    stroke="#1e3a8a"
                    strokeWidth="3"
                  />

                  {/* Plotted points */}
                  {[-2, -1, 0, 1, 2].map((x) => {
                    const y = linA * x + linB;
                    const cx = 180 + x * 28;
                    const cy = 140 - y * 24;
                    if (cy < 12 || cy > 268) return null;
                    return (
                      <circle
                        key={x}
                        cx={cx}
                        cy={cy}
                        r={x === 0 ? 5.5 : 4}
                        fill={x === 0 ? '#dc2626' : '#0f766e'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </svg>
                <div className="text-xs text-slate-600 text-center mt-2">
                  النقطة الحمراء هي نقطة التقاطع مع محور الصادات{' '}
                  <ArPair x={<ArNum value={0} />} y={<ArNum value={linB} />} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 5: Quick Quiz */}
      <section id="quick-quiz" className="scroll-mt-24">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              تحقق من فهمك — اختبر نفسك في الوحدة الأولى
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              اختر الإجابة الصحيحة لكل سؤال لتحصل على التغذية الراجعة الفورية.
            </p>
          </div>

          <div className="space-y-5">
            {UNIT1_QUIZ.map((q) => {
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
