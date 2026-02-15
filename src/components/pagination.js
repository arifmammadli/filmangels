export function getPages(page, totalPages, delta = 2) {
  
  const pages = [];
  const range = [];
  const rangeWithDots = [];

  const left = Math.max(2, page - delta);
  const right = Math.min(totalPages - 1, page + delta);

  range.push(1);

  for (let i = left; i <= right; i++) range.push(i);

  if (totalPages > 1) range.push(totalPages);

  const uniq = [...new Set(range)].sort((a, b) => a - b);

  let prev = 0;
  for (const p of uniq) {
    if (prev && p - prev > 1) rangeWithDots.push("...");
    rangeWithDots.push(p);
    prev = p;
  }

  return rangeWithDots;
}
