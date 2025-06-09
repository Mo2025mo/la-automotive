export function validateUKRegistration(regPlate: string): boolean {
  if (!regPlate) return false;
  
  // Remove spaces and convert to uppercase
  const cleaned = regPlate.replace(/\s+/g, '').toUpperCase();
  
  // UK registration plate patterns
  const patterns = [
    // Current format: AA12 AAA (2001-present)
    /^[A-Z]{2}[0-9]{2}[A-Z]{3}$/,
    // Prefix format: A123 AAA (1983-2001)
    /^[A-Z][0-9]{1,3}[A-Z]{3}$/,
    // Suffix format: AAA 123A (1963-1983)
    /^[A-Z]{1,3}[0-9]{1,4}[A-Z]?$/,
    // Very old formats
    /^[0-9]{1,4}[A-Z]{1,3}$/
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
}

export function formatUKRegistration(regPlate: string): string {
  if (!regPlate) return '';
  
  const cleaned = regPlate.replace(/\s+/g, '').toUpperCase();
  
  // Format current style: AA12AAA -> AA12 AAA
  if (/^[A-Z]{2}[0-9]{2}[A-Z]{3}$/.test(cleaned)) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  }
  
  // Format prefix style: A123AAA -> A123 AAA
  if (/^[A-Z][0-9]{1,3}[A-Z]{3}$/.test(cleaned)) {
    const numPart = cleaned.match(/[0-9]+/)?.[0] || '';
    const letterStart = cleaned.slice(0, 1);
    const letterEnd = cleaned.slice(-3);
    return `${letterStart}${numPart} ${letterEnd}`;
  }
  
  return regPlate.toUpperCase();
}
