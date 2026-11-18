/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ArEq, ArNum, ArOp, ArTerm, ArVar } from './components/ArabicMath';
import { LinearUnitSection } from './components/LinearUnitSection';
import { QuadraticUnitSection } from './components/QuadraticUnitSection';
import { Unit1SetsRelations } from './components/Unit1SetsRelations';
import { Unit2Factoring } from './components/Unit2Factoring';
import { Unit3AppliedProblems } from './components/Unit3AppliedProblems';
import { Unit4Trigonometry } from './components/Unit4Trigonometry';

type BookUnit = 'unit1' | 'unit2' | 'unit3' | 'unit4';
type Unit3SubLesson = 'linear' | 'quadratic' | 'applied';

interface UnitMeta {
  id: BookUnit;
  shortTab: string;
  breadcrumb: string;
  title: string;
  subtitle: string;
  trainerNavLabel: string;
  graphNavLabel: string;
}

const UNITS_META: Record<BookUnit, UnitMeta> = {
  unit1: {
    id: 'unit1',
    shortTab: 'الوحدة ١: المجموعات والعلاقات',
    breadcrumb: 'الوحدة الأولى: المجموعات والعلاقات (ص ٧–٥٨)',
    title: 'المجموعات والعلاقات والتطبيقات والأعداد الحقيقية',
    subtitle:
      'الصفة المميزة، الفرق والمتممة وقانونا دي مورجان، علاقة التكافؤ، التطبيق الخطي، والفترات على خط الأعداد الحقيقية.',
    trainerNavLabel: 'مختبر فن والتكافؤ',
    graphNavLabel: 'الفترات والخطي',
  },
  unit2: {
    id: 'unit2',
    shortTab: 'الوحدة ٢: تحليل المقادير الجبرية',
    breadcrumb: 'الوحدة الثانية: تحليل المقادير الجبرية (ص ٥٩–١١٢)',
    title: 'تحليل المقادير الجبرية والكسور الجبرية',
    subtitle:
      'المقدار الثلاثي البسيط وغير البسيط (المقص)، إكمال المربع، المكعبين، التجميع، واختصار وجمع الكسور الجبرية عبر م.م.أ.',
    trainerNavLabel: 'مختبر المقص والمكعبين',
    graphNavLabel: 'الكسور الجبرية',
  },
  unit3: {
    id: 'unit3',
    shortTab: 'الوحدة ٣: المعادلات',
    breadcrumb: 'الوحدة الثالثة: المعادلات (ص ١١٣–١٦٤)',
    title: 'المعادلات الخطية ومعادلات الدرجة الثانية والمسائل التطبيقية',
    subtitle:
      'حل أنظمة الدرجة الأولى بمتغيرين (المقابلة والتعويض والحذف)، ومعادلات الدرجة الثانية، وترجمة المسائل الحياتية إلى معادلات.',
    trainerNavLabel: 'المدرّب التفاعلي',
    graphNavLabel: 'المختبر البياني',
  },
  unit4: {
    id: 'unit4',
    shortTab: 'الوحدة ٤: حساب المثلثات',
    breadcrumb: 'الوحدة الرابعة: حساب المثلثات (ص ١٦٥–١٩٢)',
    title: 'العلاقات في المثلث القائم والنسب المثلثية والزوايا الخاصة',
    subtitle:
      'مبرهنات إقليدس وفيثاغورث وعكسها، النسب المثلثية (جا، جتا، ظا) والمتطابقتان الأساسيتان، والزوايا الخاصة ٣٠° و ٤٥° و ٦٠°.',
    trainerNavLabel: 'مختبر إقليدس وفيثاغورث',
    graphNavLabel: 'النسب والزوايا الخاصة',
  },
};

export default function App() {
  const [activeUnit, setActiveUnit] = useState<BookUnit>('unit1');
  const [unit3Lesson, setUnit3Lesson] = useState<Unit3SubLesson>('linear');

  const meta = UNITS_META[activeUnit];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const heroTitle =
    activeUnit === 'unit3'
      ? unit3Lesson === 'linear'
        ? 'معادلة الدرجة الأولى في متغيرين: المقابلة والتعويض والحذف'
        : unit3Lesson === 'quadratic'
          ? 'معادلات الدرجة الثانية في متغير واحد: التحليل وإكمال المربع والقانون العام'
          : 'مسائل تطبيقية على المعادلات: ترجمة المسائل اللفظية وحلّها'
      : meta.title;

  const trainerLabel =
    activeUnit === 'unit3' && unit3Lesson === 'quadratic'
      ? 'إكمال المربع'
      : meta.trainerNavLabel;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Strict 3-Zone Top Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#top"
            className="font-display text-lg font-extrabold text-blue-950 whitespace-nowrap shrink-0"
          >
            مختبر الرياضيات — التاسع
          </a>

          <nav
            className="hidden md:flex items-center gap-7 text-sm font-bold text-slate-600"
            aria-label="أقسام الدرس"
          >
            <a
              href="#philosophy"
              className="hover:text-blue-900 transition-colors whitespace-nowrap shrink-0"
            >
              فلسفة الدرس
            </a>
            <a
              href="#worked-examples"
              className="hover:text-blue-900 transition-colors whitespace-nowrap shrink-0"
            >
              الأمثلة المحلولة
            </a>
            <a
              href="#interactive-trainer"
              className="hover:text-blue-900 transition-colors whitespace-nowrap shrink-0"
            >
              {trainerLabel}
            </a>
            <a
              href="#interactive-graph"
              className="hover:text-blue-900 transition-colors whitespace-nowrap shrink-0"
            >
              {meta.graphNavLabel}
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => scrollTo('quick-quiz')}
              className="px-4 py-2 text-sm font-bold rounded-lg bg-blue-900 text-white hover:bg-blue-950 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              تحقق من فهمك
            </button>
          </div>
        </div>
      </header>

      {/* Editorial Hero & Full-Textbook Unit Switcher */}
      <section id="top" className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
            <span>كتاب الرياضيات — الصف التاسع الأساسي (الجزء الأول)</span>
            <span aria-hidden="true">·</span>
            <span>{meta.breadcrumb}</span>
            <span aria-hidden="true">·</span>
            <span>تنسيق رياضي عربي من اليمين إلى اليسار</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8 space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 leading-tight">
                {heroTitle}
              </h1>
              <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
                {meta.subtitle}
              </p>
            </div>

            {/* Notation Guide Card */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="text-xs font-bold text-slate-500">
                دليل القراءة الرياضية في الصفحة
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">اتجاه المعادلات:</span>
                <ArEq>
                  <ArTerm coeff={2} varName="س" isFirst={true} />
                  <ArTerm coeff={-3} varName="ص" isFirst={false} />
                  <ArOp>=</ArOp>
                  <ArNum value={5} />
                </ArEq>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">تمييز الأسس (خط ولون وحجم):</span>
                <ArEq>
                  <ArVar name="س" exp={2} />
                  <span className="text-slate-400">،</span>
                  <ArVar name="ص" exp={3} />
                </ArEq>
              </div>
            </div>
          </div>

          {/* 4-Unit Textbook Switcher */}
          <div className="pt-2 space-y-3">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-1.5 bg-slate-100 border border-slate-200 rounded-xl"
              role="tablist"
              aria-label="اختيار وحدة من كتاب الرياضيات للصف التاسع"
            >
              {(['unit1', 'unit2', 'unit3', 'unit4'] as BookUnit[]).map((u) => {
                const selected = activeUnit === u;
                return (
                  <button
                    key={u}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveUnit(u)}
                    className={`px-3.5 py-2.5 text-sm font-bold rounded-lg transition-colors cursor-pointer text-right sm:text-center ${
                      selected
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-white hover:text-blue-950'
                    }`}
                  >
                    {UNITS_META[u].shortTab}
                  </button>
                );
              })}
            </div>

            {/* Sub-Lesson Switcher for Unit 3 */}
            {activeUnit === 'unit3' && (
              <div
                className="inline-flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-50 border border-slate-200 rounded-xl"
                role="tablist"
                aria-label="دروس الوحدة الثالثة"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={unit3Lesson === 'linear'}
                  onClick={() => setUnit3Lesson('linear')}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    unit3Lesson === 'linear'
                      ? 'bg-white text-blue-950 border border-slate-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ١. نظام المعادلات الخطية (المقابلة · التعويض · الحذف)
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={unit3Lesson === 'quadratic'}
                  onClick={() => setUnit3Lesson('quadratic')}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    unit3Lesson === 'quadratic'
                      ? 'bg-white text-blue-950 border border-slate-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ٢. معادلات الدرجة الثانية (التحليل · إكمال المربع · القانون العام)
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={unit3Lesson === 'applied'}
                  onClick={() => setUnit3Lesson('applied')}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    unit3Lesson === 'applied'
                      ? 'bg-white text-blue-950 border border-slate-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ٣. مسائل تطبيقية على المعادلات (الدرس ٣-٤)
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Educational Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 md:py-10">
        {activeUnit === 'unit1' && <Unit1SetsRelations />}
        {activeUnit === 'unit2' && <Unit2Factoring />}
        {activeUnit === 'unit3' && (
          <>
            {unit3Lesson === 'linear' && <LinearUnitSection />}
            {unit3Lesson === 'quadratic' && <QuadraticUnitSection />}
            {unit3Lesson === 'applied' && <Unit3AppliedProblems />}
          </>
        )}
        {activeUnit === 'unit4' && <Unit4Trigonometry />}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <span>كتاب الرياضيات للصف التاسع الأساسي (الجزء الأول) — جميع الوحدات الأربعة (١–٤)</span>
          <span>جميع المعادلات والأرقام والمتغيرات منسّقة من اليمين إلى اليسار</span>
        </div>
      </footer>
    </div>
  );
}

