export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatBrazilianPhone(value: string): string {
  const digits = digitsOnly(value).slice(0, 11);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function maskPhone(value: string): string {
  const digits = digitsOnly(value);
  if (digits.length < 11) return formatBrazilianPhone(value);
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)}XXXX-${digits.slice(7)}`;
}

export function isValidBrazilianPhone(value: string): boolean {
  const digits = digitsOnly(value);
  return digits.length === 11 && digits[2] === "9";
}

export function normalizePhone(value: string): string {
  return digitsOnly(value).slice(0, 11);
}
