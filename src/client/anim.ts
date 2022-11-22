import gsap from "gsap";
import "./gradient-loop";
import clusterGame from "./cluster-game";

function highlightSquare(selector) {
  document.querySelector(selector).classList.add("hhh_highlight");
}
function dimSquare(selector) {
  document.querySelector(selector).classList.remove("hhh_highlight");
}
const highlightsTL = gsap.timeline({ repeat: -1, repeatDelay: 0.0 });
highlightsTL.call(highlightSquare, [".hhh_square1"], "+=0");
highlightsTL.call(dimSquare, [".hhh_square1"], "+=3");
highlightsTL.call(highlightSquare, [".hhh_square2"], "+=0.0");
highlightsTL.call(dimSquare, [".hhh_square2"], "+=3");
highlightsTL.call(highlightSquare, [".hhh_square3"], "+=0.0");
highlightsTL.call(dimSquare, [".hhh_square3"], "+=3");

const tl = gsap.timeline({ repeat: 0, repeatDelay: 2 });
tl.addLabel("start", 0);

tl.from(
  "#hhh_bigSquareArea",
  {
    y: "-=30%",
    rotateY: "+=30",
    rotateX: "-=5",
    rotateZ: "-=5",
    duration: 1,
    ease: "sine.inOut",
  },
  "start"
)
  .from(
    ".hhh_bigSquareShadow",
    {
      opacity: 0.5,
      duration: 0.75,
      ease: "sine.inOut",
    },
    "<"
  )
  .addLabel("stage2");

const squaresStagger = {
  grid: [3, 3],
  from: "edges",
  amount: 0.5,
};
tl.from(
  ".hhh_appSquare .hhh_shadow",
  {
    opacity: 0,
    scale: 0.3,
    duration: 1,
    ease: "sine.easeInOut",
    stagger: squaresStagger as any,
  },
  "<0.2"
);
tl.from(
  ".hhh_appSquare .hhh_shape",
  {
    opacity: 0,
    duration: 0.5,
    ease: "none",
    stagger: squaresStagger as any,
  },
  "<0.2"
);
tl.from(
  ".hhh_appSquare .hhh_shape",
  {
    z: 60,
    duration: 1,
    ease: "power2.easeOut",
    stagger: squaresStagger as any,
  },
  "<0.2"
);
tl.from(
  ".hhh_bottomSquare",
  {
    z: -20,
    y: -100,
    duration: 0.75,
    ease: "power1.easeOut",
    stagger: { amount: 0.2 },
  },
  "stage2-=0.15"
);
tl.from(
  ".hhh_bottomSquare .hhh_squareShape, .hhh_bottomSquare .hhh_connectors, .hhh_bottomSquare .hhh_shadow",
  {
    opacity: 0,
    duration: 0.3,
    ease: "power1.easeOut",
    stagger: { amount: 0.2 },
  },
  "<0"
);
tl.add(highlightsTL, "-=0.0");
tl.from(
  ".hhh_clustersGrid .hhh_squareShapeIn",
  {
    opacity: 0,
    duration: 0.3,
    z: "-=20",
    stagger: { amount: 0.3 },
    ease: "Power2.easeOut",
  },
  "stage2-=0"
);
tl.call(clusterGame, [], "+=1.3");
