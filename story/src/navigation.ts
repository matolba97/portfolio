export const sectionAnchors = ["story", "insight", "workflow", "responsibilities", "hello"];

export function activeSection(sectionTops: number[], readingLine: number) {
  for (let index = sectionTops.length - 1; index > 0; index--) {
    if (sectionTops[index] <= readingLine) return index;
  }
  return 0;
}

