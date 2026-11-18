import React from 'react';
import { formatCleanNumber, reduceFraction, toArabicDigits } from '../utils/arabicMath';

interface ChildrenProps {
  children: React.ReactNode;
  className?: string;
}

/** Inline RTL Arabic Math wrapper */
export function ArEq({ children, className = '' }: ChildrenProps) {
  return <span className={`ar-math ${className}`}>{children}</span>;
}

/** Block RTL Arabic Math formula container */
export function ArMathBlock({ children, className = '' }: ChildrenProps) {
  return <div className={`ar-math-block ${className}`}>{children}</div>;
}

/** Arabic-Indic number with proper RTL negative sign placement (minus read first on the right, digits stay LTR internally) */
export function ArNum({
  value,
  showPlus = false,
  className = '',
}: {
  value: number;
  showPlus?: boolean;
  className?: string;
}) {
  const isZero = Math.abs(value) < 1e-9;
  const isNeg = !isZero && value < 0;
  const absStr = toArabicDigits(formatCleanNumber(Math.abs(value)));

  if (isNeg) {
    return (
      <span className={`ar-neg ${className}`}>
        <span className="text-rose-700 font-extrabold">−</span>
        <span className="ar-num">{absStr}</span>
      </span>
    );
  }
  if (showPlus && !isZero) {
    return (
      <span className={`ar-neg ${className}`}>
        <span className="text-blue-800 font-bold">+</span>
        <span className="ar-num">{absStr}</span>
      </span>
    );
  }
  return <span className={`ar-num ${className}`}>{absStr}</span>;
}

/** Operator symbol (+, −, =, ×, ÷, ±, ⇐, ≠, <, >) */
export function ArOp({ children, className = '' }: ChildrenProps) {
  return <span className={`ar-op ${className}`}>{children}</span>;
}

/**
 * Distinctively styled exponent:
 * Different font (Changa) + vivid crimson color + smaller raised size.
 */
export function ArExp({
  value,
  subtle = false,
}: {
  value: number | string;
  subtle?: boolean;
}) {
  const txt = typeof value === 'number' ? toArabicDigits(value) : toArabicDigits(value);
  return (
    <sup
      className={subtle ? 'ar-exp-subtle' : 'ar-exp'}
      title={`الأس ${txt}`}
    >
      {txt}
    </sup>
  );
}

/** Arabic variable with optional exponent and/or subscript (e.g. س² or أ₁) */
export function ArVar({
  name,
  exp,
  sub,
  subtleExp = false,
  className = '',
}: {
  name: string;
  exp?: number | string;
  sub?: number | string;
  subtleExp?: boolean;
  className?: string;
}) {
  return (
    <span className={`ar-var ${className}`}>
      <span>{name}</span>
      {sub !== undefined && <sub className="ar-sub">{toArabicDigits(sub)}</sub>}
      {exp !== undefined && <ArExp value={exp} subtle={subtleExp} />}
    </span>
  );
}

/** Vertical RTL Arabic Fraction */
export function ArFrac({
  num,
  den,
  negative = false,
}: {
  num: React.ReactNode;
  den: React.ReactNode;
  negative?: boolean;
}) {
  return (
    <span className="ar-math gap-1">
      {negative && <span className="text-rose-700 font-extrabold">−</span>}
      <span className="ar-frac">
        <span className="ar-frac-num">{num}</span>
        <span className="ar-frac-den">{den}</span>
      </span>
    </span>
  );
}

/** Renders a reduced rational fraction num/den cleanly as integer or vertical Arabic fraction */
export function ArRational({ num, den }: { num: number; den: number }) {
  const r = reduceFraction(num, den);
  if (r.isZero) return <ArNum value={0} />;
  if (r.isInteger) return <ArNum value={r.num} />;
  return (
    <ArFrac
      negative={r.isNegative}
      num={<ArNum value={r.absNum} />}
      den={<ArNum value={r.absDen} />}
    />
  );
}

/** Arabic RTL Square Root with custom left-opening SVG radical symbol */
export function ArRoot({ children }: { children: React.ReactNode }) {
  return (
    <span className="ar-root">
      <svg
        width="16"
        height="24"
        viewBox="0 0 16 24"
        fill="none"
        className="shrink-0 self-stretch h-auto text-teal-700"
        aria-hidden="true"
      >
        <path
          d="M15 14 L12 14 L9 22 L3 1.5 L0 1.5"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="ar-root-body">{children}</span>
    </span>
  );
}

/** Parenthesized RTL expression with optional exponent: ( ... )² */
export function ArParen({
  children,
  exp,
}: {
  children: React.ReactNode;
  exp?: number | string;
}) {
  return (
    <span className="ar-math gap-0.5">
      <span className="text-slate-600 font-normal">(</span>
      {children}
      <span className="text-slate-600 font-normal">)</span>
      {exp !== undefined && <ArExp value={exp} />}
    </span>
  );
}

/** Ordered Pair ( س ، ص ) strictly right-to-left: x on right, y on left */
export function ArPair({
  x,
  y,
}: {
  x: React.ReactNode;
  y: React.ReactNode;
}) {
  return (
    <span className="ar-math gap-1">
      <span className="text-slate-600 font-bold">(</span>
      <span>{x}</span>
      <span className="text-blue-700 font-extrabold px-0.5">،</span>
      <span>{y}</span>
      <span className="text-slate-600 font-bold">)</span>
    </span>
  );
}

/** Set notation { ... } in RTL */
export function ArSet({ items }: { items: React.ReactNode[] }) {
  return (
    <span className="ar-math gap-1">
      <span className="text-teal-700 font-bold text-[1.15em]">{'{'}</span>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="text-blue-700 font-extrabold px-1">،</span>}
          <span>{item}</span>
        </React.Fragment>
      ))}
      <span className="text-teal-700 font-bold text-[1.15em]">{'}'}</span>
    </span>
  );
}

/** System of two equations with RTL brace on the right */
export function ArSystem({
  eq1,
  eq2,
}: {
  eq1: React.ReactNode;
  eq2: React.ReactNode;
}) {
  return (
    <div className="ar-system">
      <span className="ar-system-brace" aria-hidden="true">
        {'}'}
      </span>
      <div className="ar-system-rows">
        <div>{eq1}</div>
        <div>{eq2}</div>
      </div>
    </div>
  );
}

/** Renders a single algebraic term like 4س or −3ص or +س with optional explicit exponent 1 */
export function ArTerm({
  coeff,
  varName,
  exp,
  isFirst = false,
  showHiddenOne = false,
}: {
  coeff: number;
  varName: string;
  exp?: number;
  isFirst?: boolean;
  showHiddenOne?: boolean;
}) {
  if (Math.abs(coeff) < 1e-9) return null;
  const isNeg = coeff < 0;
  const absC = Math.abs(coeff);
  const showCoeff = Math.abs(absC - 1) > 1e-9;

  return (
    <span className="ar-math gap-0.5">
      {!isFirst && <ArOp>{isNeg ? '−' : '+'}</ArOp>}
      {isFirst && isNeg && <span className="text-rose-700 font-extrabold">−</span>}
      {showCoeff && <ArNum value={absC} />}
      <ArVar
        name={varName}
        exp={exp !== undefined ? exp : showHiddenOne ? 1 : undefined}
        subtleExp={exp === undefined && showHiddenOne}
      />
    </span>
  );
}

/** Complete Linear Equation: aس + bص = c strictly RTL */
export function ArLinearEq({
  a,
  b,
  c,
  varX = 'س',
  varY = 'ص',
  showHiddenOne = false,
}: {
  a: number;
  b: number;
  c: number;
  varX?: string;
  varY?: string;
  showHiddenOne?: boolean;
}) {
  const hasA = Math.abs(a) > 1e-9;
  const hasB = Math.abs(b) > 1e-9;

  return (
    <ArEq>
      {hasA && (
        <ArTerm
          coeff={a}
          varName={varX}
          isFirst={true}
          showHiddenOne={showHiddenOne}
        />
      )}
      {hasB && (
        <ArTerm
          coeff={b}
          varName={varY}
          isFirst={!hasA}
          showHiddenOne={showHiddenOne}
        />
      )}
      {!hasA && !hasB && <ArNum value={0} />}
      <ArOp>=</ArOp>
      <ArNum value={c} />
    </ArEq>
  );
}

/** Complete Quadratic Equation: aس² + bس + c = 0 strictly RTL */
export function ArQuadEq({
  a,
  b,
  c,
  varName = 'س',
  rhs = 0,
}: {
  a: number;
  b: number;
  c: number;
  varName?: string;
  rhs?: number;
}) {
  const hasA = Math.abs(a) > 1e-9;
  const hasB = Math.abs(b) > 1e-9;
  const hasC = Math.abs(c) > 1e-9;

  return (
    <ArEq>
      {hasA && <ArTerm coeff={a} varName={varName} exp={2} isFirst={true} />}
      {hasB && <ArTerm coeff={b} varName={varName} isFirst={!hasA} />}
      {hasC && (
        <>
          {(hasA || hasB) && <ArOp>{c < 0 ? '−' : '+'}</ArOp>}
          <ArNum value={hasA || hasB ? Math.abs(c) : c} />
        </>
      )}
      {!hasA && !hasB && !hasC && <ArNum value={0} />}
      <ArOp>=</ArOp>
      <ArNum value={rhs} />
    </ArEq>
  );
}

/** Length / Absolute Value bars | أ ب | with optional exponent (e.g. |أ ب|²) */
export function ArAbs({
  children,
  exp,
}: {
  children: React.ReactNode;
  exp?: number | string;
}) {
  return (
    <span className="ar-math gap-0.5">
      <span className="text-slate-500 font-normal px-0.5">|</span>
      <span>{children}</span>
      <span className="text-slate-500 font-normal px-0.5">|</span>
      {exp !== undefined && <ArExp value={exp} />}
    </span>
  );
}

/** Degree angle display in Arabic-Indic digits (e.g. ٣٠°) */
export function ArDeg({ value }: { value: number | string }) {
  return (
    <span className="ar-math gap-0">
      <span className="ar-num">{toArabicDigits(value)}</span>
      <span className="text-blue-800 font-bold text-[0.95em] -mt-1">°</span>
    </span>
  );
}

/** Factor with diagonal cancellation slash for algebraic fractions */
export function ArCancel({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex items-center px-0.5 text-slate-400">
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[2px] -rotate-12 bg-rose-600/80 rounded-full"
      />
    </span>
  );
}

/** Set complement notation (e.g. سَ or (س ∪ ص)َ) */
export function ArComplement({ children }: { children: React.ReactNode }) {
  return (
    <span className="ar-math gap-0">
      <span>{children}</span>
      <span className="text-rose-700 font-extrabold text-[0.88em] -translate-y-1.5 px-0.5">
        َ
      </span>
    </span>
  );
}

/**
 * Real number interval in strictly RTL Arabic notation.
 * Lower bound is placed on the right; upper bound is placed on the left.
 * Visual bracket direction is forced explicitly via dir="ltr" glyphs so
 * closed brackets always hug the interior and open brackets face outward.
 */
export function ArInterval({
  start,
  end,
  startClosed,
  endClosed,
}: {
  start: React.ReactNode;
  end: React.ReactNode;
  startClosed: boolean;
  endClosed: boolean;
}) {
  return (
    <span className="ar-math gap-1">
      <span
        dir="ltr"
        className={`font-extrabold text-[1.15em] ${
          startClosed ? 'text-teal-700' : 'text-rose-700'
        }`}
      >
        {startClosed ? ']' : '['}
      </span>
      <span>{start}</span>
      <span className="text-blue-700 font-extrabold px-0.5">،</span>
      <span>{end}</span>
      <span
        dir="ltr"
        className={`font-extrabold text-[1.15em] ${
          endClosed ? 'text-teal-700' : 'text-rose-700'
        }`}
      >
        {endClosed ? '[' : ']'}
      </span>
    </span>
  );
}

