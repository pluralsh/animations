import gsap from 'gsap'

export default (() => {
  console.log("stuff");
  window.addEventListener("resize", (e) => {
    console.log("resized", e);
  });
})();

