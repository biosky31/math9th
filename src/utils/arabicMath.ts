const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * Converts Western digits (0-9) and decimal points into Arabic-Indic digits (٠-٩) and Arabic decimal separator (٫).
 */
export function toArabicDigits(value: number | string): string {
  const str = typeof value === 'number' ? formatCleanNumber(value) : value;
  return str
    .replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)])
    .replace(/\./g, '٫');
}

export function formatCleanNumber(n: number, decimals = 2): string {
  if (Math.abs(n) < 1e-9) return '0';
  if (Number.isInteger(n)) return String(n);
  return String(Number(n.toFixed(decimals)));
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function lcm(a: number, b: number): number {
  const x = Math.abs(Math.round(a));
  const y = Math.abs(Math.round(b));
  if (x === 0 || y === 0) return 0;
  return (x * y) / gcd(x, y);
}

export interface ReducedFraction {
  num: number;
  den: number;
  isInteger: boolean;
  isZero: boolean;
  isNegative: boolean;
  absNum: number;
  absDen: number;
  decimal: number;
}

export function reduceFraction(rawNum: number, rawDen: number): ReducedFraction {
  let num = Math.round(rawNum);
  let den = Math.round(rawDen);
  if (den < 0) {
    num = -num;
    den = -den;
  }
  if (num === 0) {
    return {
      num: 0,
      den: 1,
      isInteger: true,
      isZero: true,
      isNegative: false,
      absNum: 0,
      absDen: 1,
      decimal: 0,
    };
  }
  const g = gcd(num, den);
  num /= g;
  den /= g;
  return {
    num,
    den,
    isInteger: den === 1,
    isZero: false,
    isNegative: num < 0,
    absNum: Math.abs(num),
    absDen: den,
    decimal: num / den,
  };
}

export type LinearMethod = 'comparison' | 'substitution' | 'elimination';

export interface LinearSystemParams {
  a1: number;
  b1: number;
  c1: number;
  a2: number;
  b2: number;
  c2: number;
}

export interface MethodRecommendation {
  method: LinearMethod;
  label: string;
  reason: string;
}

/**
 * Pedagogical compass: tells the student which of the 3 methods is cleanest and avoids fractions.
 */
export function recommendLinearMethod(p: LinearSystemParams): MethodRecommendation {
  const { a1, b1, a2, b2 } = p;

  const sameVarIsolated =
    (Math.abs(a1) === 1 && Math.abs(a2) === 1) ||
    (Math.abs(b1) === 1 && Math.abs(b2) === 1);

  const readyElimination =
    (a1 !== 0 && a1 === -a2) ||
    (b1 !== 0 && b1 === -b2) ||
    (a1 !== 0 && a1 === a2) ||
    (b1 !== 0 && b1 === b2);

  const hasUnitCoeff =
    Math.abs(a1) === 1 ||
    Math.abs(b1) === 1 ||
    Math.abs(a2) === 1 ||
    Math.abs(b2) === 1;

  if (readyElimination) {
    return {
      method: 'elimination',
      label: 'طريقة الحذف',
      reason: 'معاملات أحد المتغيرين متساوية أو متعاكسة جاهزة، فيُحذف مباشرة بأقصر خطوات.',
    };
  }

  if (sameVarIsolated) {
    return {
      method: 'comparison',
      label: 'طريقة المقابلة',
      reason: 'نفس المتغير معامله ١ أو −١ في المعادلتين، فيسهل عزله ومساواة الطرفين بدون كسور.',
    };
  }

  if (hasUnitCoeff) {
    return {
      method: 'substitution',
      label: 'طريقة التعويض',
      reason: 'يوجد متغير معامله ١ أو −١ في إحدى المعادلتين، فيُعزل نظيفاً بدون أي كسور ثم يُعوّض في الأخرى.',
    };
  }

  return {
    method: 'elimination',
    label: 'طريقة الحذف',
    reason: 'جميع المعاملات أكبر من ١، لذا طريقة الحذف تجنبك التعامل مع الكسور المعقدة.',
  };
}
