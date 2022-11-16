import gsap from "gsap";

export default (() => {
  console.log("stuff");
  window.addEventListener("resize", (e) => {
    console.log("resized", e);
  });
})();

const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
tl.addLabel("start", 0);

tl.from(".bigSquareContainer", { opacity: 0, duration: 0.5 }, "start");
tl.from(
  ".bigSquareArea",
  {
    translateY: "-30%",
    rotateY: "+=30",
    rotateX: "-=5",
    rotateZ: "-=5",
    duration: 1,
    ease: "sine.inOut",
  },
  "start"
);
tl.from(
  ".appSquare .zTarget",
  {
    z: 60,
    opacity: 0,
    duration: 1,
    stagger: {
      grid: [3, 3],
      from: "edges",
      amount: 0.5,
    },
  },
  "<0.2"
);
