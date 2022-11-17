import gsap from "gsap";

export default (() => {
  console.log("stuff");
  window.addEventListener("resize", (e) => {
    console.log("resized", e);
  });
})();

function highlightSquare(selector) {
  console.log("square", selector);
  document.querySelector(selector).classList.add("highlight");
}
function dimSquare(selector) {
  document.querySelector(selector).classList.remove("highlight");
}
const highlightsTL = gsap.timeline({ repeat: -1, repeatDelay: 0.0 });
highlightsTL.call(highlightSquare, [".square1"], "+=0");
highlightsTL.call(dimSquare, [".square1"], "+=3");
highlightsTL.call(highlightSquare, [".square2"], "+=0.0");
highlightsTL.call(dimSquare, [".square2"], "+=3");
highlightsTL.call(highlightSquare, [".square3"], "+=0.0");
highlightsTL.call(dimSquare, [".square3"], "+=3");

const tl = gsap.timeline({ repeat: 0, repeatDelay: 2 });
tl.addLabel("start", 0);

// tl.from(".bigSquareContainer", { opacity: 0, duration: 0.5 }, "start");
tl.from(
  "#bigSquareArea",
  {
    // z: '100%',
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
    ".bigSquareShadow",
    {
      // z: '100%',
      // y: "-=30%",
      // rotateY: "+=30",
      // rotateX: "-=50",
      // rotateZ: "-=15",
      // scale: "-=20%",
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
  ".appSquare .shadow",
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
  ".appSquare .shape",
  {
    opacity: 0,
    duration: 0.5,
    ease: "none",
    stagger: squaresStagger as any,
  },
  "<0.2"
);
tl.from(
  ".appSquare .shape",
  {
    z: 60,
    duration: 1,
    ease: "power2.easeOut",
    stagger: squaresStagger as any,
  },
  "<0.2"
);
tl.from(
  ".bottomSquare",
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
  ".bottomSquare .squareFlatSVG, .bottomSquare .connectors",
  {
    opacity: 0,
    duration: 0.3,
    ease: "power1.easeOut",
    stagger: { amount: 0.2 },
  },
  "<0"
);
tl.add(highlightsTL, "-=0.4");

const gradientLoop = gsap.timeline({ repeat: -1, repeatDelay: 0 });
const gradientDuration = 1;
const gradientSelector = ".strokeGradient";
gradientLoop
  .fromTo(
    gradientSelector,
    { attr: { cx: "0%", cy: "0%" } },
    { attr: { cx: "100%", cy: "0%" }, duration: gradientDuration, ease: "none" }
  )
  .to(gradientSelector, {
    attr: { cx: "100%", cy: "100%" },
    duration: gradientDuration,
    ease: "none",
  })
  .to(gradientSelector, {
    attr: { cx: "0%", cy: "100%" },
    duration: gradientDuration,
    ease: "none",
  })
  .to(gradientSelector, {
    attr: { cx: "0%", cy: "0%" },
    duration: gradientDuration,
    ease: "none",
  });
