import gsap from "gsap";

export default (() => {
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

  const clusterSquareElts = document.querySelectorAll(
    ".hhh_clustersGrid .hhh_squareRoot"
  );
  const sorter = (eltA: Element, eltB: Element) => {
    return (
      Number(eltA.getAttribute("data-index-y")) -
      Number(eltB.getAttribute("data-index-y"))
    );
  };

  const clustersGrid = [
    Array.from(clusterSquareElts)
      .filter((elt) => {
        return elt.getAttribute("data-index-x") === "0";
      })
      .sort(sorter),
    Array.from(clusterSquareElts)
      .filter((elt) => {
        return elt.getAttribute("data-index-x") === "1";
      })
      .sort(sorter),
    Array.from(clusterSquareElts)
      .filter((elt) => {
        return elt.getAttribute("data-index-x") === "2";
      })
      .sort(sorter),
  ];

  let lastCluster: {
    elt: Element;
    x: number;
    y: number;
  } | null = null;

  function attemptClusterFlip(x: number, y: number) {
    const diffX = lastCluster?.x - x;
    const diffY = lastCluster?.y - y;
    if (
      (!lastCluster && x === 0 && y === 0) ||
      (clustersGrid[x][y].getAttribute("data-active") === null &&
        lastCluster &&
        ((Math.abs(diffX) === 1 && Math.abs(diffY) === 0) ||
          (Math.abs(diffX) === 0 && Math.abs(diffY) === 1)))
    ) {
      if (diffX < 0 || x === 0 && y === 0) {
        clustersGrid[x][y].classList.add("connectLeft");
      } else if (diffX > 0) {
        clustersGrid[x][y].classList.add("connectRight");
      } else if (diffY > 0) {
        clustersGrid[x][y].classList.add("connectTop");
      } else if (diffY < 0) {
        clustersGrid[x][y].classList.add("connectBottom");
      }
      window.setTimeout(() => {
        clustersGrid[x][y].setAttribute("data-active", "1");

      }, 10)

      lastCluster = {
        x: x,
        y: y,
        elt: clustersGrid[x][y],
      };
    }
  }

  clusterSquareElts.forEach((elt) => {
    elt.addEventListener("mouseenter", () => {
      attemptClusterFlip(
        Math.floor(Number(elt.getAttribute("data-index-x"))),
        Math.floor(Number(elt.getAttribute("data-index-y")))
      );
    });
  });
})();
