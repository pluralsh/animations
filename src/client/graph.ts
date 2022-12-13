export const data = [
  {
    color: "#4A51F2",
    ceiling: 150,
    floor: 20,
  },
  {
    color: "#3CECAF",
    ceiling: 100,
    floor: 7,
  },
  {
    color: "#5CC3FF",
    ceiling: 50,
    floor: 3,
  },
];

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}
function easeOutCubicReverse(x: number): number {
  return 1 - Math.pow(x, 3);
}

function powerDist(x: number, power: number = 3): number {
  if (x < 0.5) {
    return 1 - Math.pow(1 - x * 2, power);
  } else {
    return 1 - Math.pow((x - 0.5) * 2, power);
  }
}

// function sinDist(x, _): number {
//   return (Math.sin(x * Math.PI * 2 + 1.5 * Math.PI) + 1) / 2;
// }

function graphScalingFunc(x: number): number {
  return powerDist(x);
}

export type GraphNode = [number, number];
export type GraphNodeList = GraphNode[];

type NodeOptions = {
  nodeCount: number;
  floor: number;
  ceiling: number;
  spacing: number;
  xPadding: number;
};

export const nodesToVals = (nl: GraphNodeList) => {
  return nl.map((n) => n[1]);
};
export const valsToNodes = (
  vals: number[],
  opts: NodeOptions
): GraphNodeList => {
  const { xPadding, spacing } = opts;
  return vals.map((v, i) => [xPadding + spacing * i, v]);
};

const generateNode = (
  i,
  { nodeCount, spacing, floor, ceiling, xPadding }: NodeOptions
): [number, number] => {
  return [xPadding + spacing * i, Math.random() * (ceiling - floor) + floor];
};

export function generateLineNodes(opts: NodeOptions): GraphNodeList {
  const { nodeCount } = opts;
  const nodes: GraphNodeList = new Array(nodeCount);
  for (let i = 0; i < nodeCount; ++i) {
    nodes[i] = generateNode(i, opts);
  }
  return nodes;
}

export function updateLineNodes(
  nodes: GraphNodeList,
  opts: NodeOptions
): GraphNodeList {
  return nodes.map((node, i) => {
    if (i === nodes.length - 1) {
      const node = generateNode(i, opts);
      return node;
    }
    return [node[0], nodes[i + 1][1]];
  });
}

export function constructPath(vals: GraphNodeList) {
  const len = vals.length;
  return vals.reduce((str, val, i) => {
    const indexRatio = i / (len - 1);
    const multiplier = graphScalingFunc(indexRatio);
    const x = val[0];
    const y = val[1];
    const scaledY = y * multiplier;

    return `${str}${i === 0 ? "M" : i === 1 ? "L" : ""}${x},${scaledY} `;
  }, "");
}
