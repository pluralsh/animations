import gsap from "gsap";
import "./gradient-loop";
import clusterGame from "./cluster-game";

const rootId = "#hhh_hero1";

function highlightSquare(selector) {
  document.querySelector(selector).classList.add("hhh_highlight");
}
function dimSquare(selector) {
  document.querySelector(selector).classList.remove("hhh_highlight");
}
const HL_STEP_DELAY = 3;
const HL_REPEAT = 0;
const highlightsTLInner = gsap
  .timeline({ repeat: HL_REPEAT, repeatDelay: 0.0, smoothChildTiming: true })
  .call(highlightSquare, [`${rootId} .hhh_square1`], "+=0")
  .call(dimSquare, [`${rootId} .hhh_square1`], `+=${HL_STEP_DELAY}`)
  .call(highlightSquare, [`${rootId} .hhh_square2`], "+=0.0")
  .call(dimSquare, [`${rootId} .hhh_square2`], `+=${HL_STEP_DELAY}`)
  .call(highlightSquare, [`${rootId} .hhh_square3`], "+=0.0")
  .call(dimSquare, [`${rootId} .hhh_square3`], `+=${HL_STEP_DELAY}`);
const highlightsTL = gsap
  .timeline({ smoothChildTiming: true })
  .add(highlightsTLInner)
  .call(highlightSquare, [`${rootId} .hhh_square2`], `+=0`);

const tl = gsap.timeline({ repeat: 0, repeatDelay: 2 });

tl.call(() => {
  document.querySelector(`${rootId}`).classList.add("hhh_start");
});
tl.from(
  `${rootId} #hhh_bigSquareArea`,
  {
    y: "-=30%",
    rotateY: "+=30",
    rotateX: "-=5",
    rotateZ: "-=5",
    duration: 1,
    ease: "sine.inOut",
  },
  0
)
  .from(
    `${rootId} .hhh_bigSquareShadow`,
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
  `${rootId} .hhh_appSquare .hhh_shadow`,
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
  `${rootId} .hhh_appSquare .hhh_shape`,
  {
    opacity: 0,
    duration: 0.5,
    ease: "none",
    stagger: squaresStagger as any,
  },
  "<0.2"
);
tl.from(
  `${rootId} .hhh_appSquare .hhh_shape`,
  {
    z: 60,
    duration: 1,
    ease: "power2.easeOut",
    stagger: squaresStagger as any,
  },
  "<0.2"
);
tl.from(
  `${rootId} .hhh_bottomSquare`,
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
  [
    `${rootId} .hhh_bottomSquare .hhh_squareShape`,
    `${rootId} .hhh_bottomSquare .hhh_connectors`,
    `${rootId} .hhh_bottomSquare .hhh_shadow`,
  ].join(", "),
  {
    opacity: 0,
    duration: 0.3,
    ease: "power1.easeOut",
    stagger: { amount: 0.2 },
  },
  "<0"
);
tl.add(highlightsTL, "-=0.0");
tl.call(clusterGame, [], "<0.4");
tl.from(
  `${rootId} .hhh_clustersGrid .hhh_squareShapeIn`,
  {
    opacity: 0,
    duration: 0.3,
    z: "-=20",
    stagger: { amount: 0.3 },
    ease: "Power2.easeOut",
  },
  "stage2-=0"
);
