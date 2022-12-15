/* 
  Gradient Looping animation 
*/
import gsap from "gsap";

const gradientLoop = gsap.timeline({ repeat: -1, repeatDelay: 0 });
const gradientDuration = 1;
const gradientSelector = ".hhh_strokeGradient";
gradientLoop
  .fromTo(
    gradientSelector,
    { attr: { cx: "0%", cy: "0%" } },
    {
      attr: { cx: "100%", cy: "0%" },
      duration: gradientDuration,
      ease: "none",
    }
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

window?.addEventListener('message', (msg) => {
  if (msg?.data === 'play') {
    gradientLoop.play();

  } else if (msg?.data === 'pause') {
    gradientLoop.pause();
  }
})