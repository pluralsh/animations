export const data = [
  {
    color: "#4A51F2",
    ceiling: 100,
    floor: 10,
  },
  {
    color: "#3CECAF",
    ceiling: 100,
    floor: 10,
  },
  {
    color: "#5CC3FF",
    ceiling: 30,
    floor: 0,
  },
];

export function generateLineNodes({
  nodeCount,
  spacing,
  floor,
  ceiling,
}: {
  nodeCount: number;
  floor: number;
  ceiling: number;
  spacing: number;
}) {
  const nodes: [number, number][] = new Array(nodeCount);
  for (let i = 0; i < nodeCount ; ++i) {
    nodes[i] = [spacing * i, i === 0 || i === nodeCount - 1 ? 0 : Math.random() * (ceiling - floor) + floor];
  }
  return nodes;
}

export function constructPath(vals: [number, number][]) {
  return vals.reduce((str, val, idx) => {
    return `${str} ${idx === 0 ? "M" : idx === 1 ? "L" : ""}${val[0]},${
      val[1]
    }`;
  }, "");
}
