export const canMoveStage = (stages: any[], from: any, to: any) => {
  const sorted = stages.sort((a: { order: number; }, b: { order: number; }) => a.order - b.order);
  const fromIndex = sorted.findIndex((s: { name: any; }) => s.name === from);
  const toIndex = sorted.findIndex((s: { name: any; }) => s.name === to);
  return toIndex === fromIndex + 1;
};
