export const data = [
  {
    color: "#4A51F2",
    ceiling: 100,
    floor: 20,
  },
  {
    color: "#3CECAF",
    ceiling: 70,
    floor: 10,
  },
  {
    color: "#5CC3FF",
    ceiling: 40,
    floor: 0,
  },
];

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}
function easeOutCubicReverse(x: number): number {
  return 1 - Math.pow(x, 3);
}

function powerDist(x: number, pow: number = 2.5): number {
  if (x < 0.5) {
    return 1 - Math.pow(1 - x * 2, 2.5);
  } else {
    return 1 - Math.pow((x - 0.5) * 2, 2.5);
  }
}
export type Node = [number, number];
export type NodeList = Node[];

type NodeOptions = {
  nodeCount: number;
  floor: number;
  ceiling: number;
  spacing: number;
  xPadding: number;
};

const generateNode = (
  i,
  { nodeCount, spacing, floor, ceiling, xPadding }: NodeOptions
): [number, number] => {
  return [
    xPadding + spacing * i,
 Math.random() * (ceiling - floor) + floor,
  ];
};

export function generateLineNodes(opts: NodeOptions): NodeList {
  const { nodeCount } = opts;
  const nodes: NodeList = new Array(nodeCount);
  for (let i = 0; i < nodeCount; ++i) {
    nodes[i] = generateNode(i, opts);
  }
  console.log("nodes", nodes);
  return nodes;
}

export function updateLineNodes(nodes: NodeList, opts: NodeOptions): NodeList {
  return nodes.map((node, i) => {
    if (i === nodes.length - 1) {
      console.log("new node opts", opts);

      const node = generateNode(i, opts);
      console.log("new node", node);
      return node;
    }
    return [node[0], nodes[i + 1][1]];
  });
}

export function constructPath(vals: NodeList) {
  const len = vals.length;
  return vals.reduce((str, val, i) => {
    const indexRatio = i / (len - 1);
    const multiplier = powerDist(indexRatio);
    console.log("val", val);
    const x = val[0];
    const y = val[1];
    const scaledY = y * multiplier;

    return `${str} ${i === 0 ? "M" : i === 1 ? "L" : ""}${x},${scaledY}`;
  }, "");
}
