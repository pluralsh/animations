type Move = {
  elt: Element;
  x: number;
  y: number;
} | null;
let lastMove: Move = null;

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

const getAllSquareElts = () =>
  document.querySelectorAll(".hhh_clustersGrid .hhh_squareRoot");

export function resetMoves() {
  lastMove = null;
  getAllSquareElts().forEach((elt) => {
    elt.removeAttribute("data-active");
    elt.classList.remove("connectTop");
    elt.classList.remove("connectBottom");
    elt.classList.remove("connectRight");
    elt.classList.remove("connectLeft");
  });
}

const sorter = (eltA: Element, eltB: Element) => {
  return (
    Number(eltA.getAttribute("data-index-y")) -
    Number(eltB.getAttribute("data-index-y"))
  );
};

const getSquareAt = (x, y) => {
  return document.querySelector(
    `.hhh_clustersGrid .hhh_squareRoot[data-index-x="${x}"][data-index-y="${y}"]`
  );
};

function findAllValidMovesFrom(lastMove: Move): Move[] {
  let squareElts = getAllSquareElts();

  return Array.from(squareElts)
    .filter((squareElt) => {
      let x = Number(squareElt.getAttribute("data-index-x"));
      let y = Number(squareElt.getAttribute("data-index-y"));
      let active = !!squareElt.getAttribute("data-active");
      console.log("data-active", squareElt.getAttribute("data-active"));
      console.log("active", active);
      if (
        !active &&
        ((x === lastMove.x + 1 && y === lastMove.y) ||
          (x === lastMove.x - 1 && y === lastMove.y) ||
          (x === lastMove.x && y === lastMove.y + 1) ||
          (x === lastMove.x && y === lastMove.y - 1))
      ) {
        return true;
      }
      return false;
    })
    .map((elt) => {
      return {
        elt: elt,
        x: Number(elt.getAttribute("data-index-x")),
        y: Number(elt.getAttribute("data-index-y")),
      };
    });
}

function findRandomMoveFrom(lastMove: Move): Move {
  let x = 0;
  let y = 0;
  if (!lastMove) {
    return {
      x: 0,
      y: 0,
      elt: getSquareAt(x, y),
    };
  }
  let nextMoves = findAllValidMovesFrom(lastMove);
  if (nextMoves.length === 0) {
    return null;
  }
  return nextMoves[Math.floor(Math.random() * nextMoves.length)];
}

function squareEltsToGrid(squareElts: NodeListOf<Element>) {
  return [
    Array.from(squareElts)
      .filter((elt) => {
        return elt.getAttribute("data-index-x") === "0";
      })
      .sort(sorter),
    Array.from(squareElts)
      .filter((elt) => {
        return elt.getAttribute("data-index-x") === "1";
      })
      .sort(sorter),
    Array.from(squareElts)
      .filter((elt) => {
        return elt.getAttribute("data-index-x") === "2";
      })
      .sort(sorter),
  ];
}

function flipSquare(x?: number, y?: number) {
  const squaresGrid = squareEltsToGrid(getAllSquareElts());

  console.log("lastMove x,y", lastMove?.x, lastMove?.y);
  console.log(" x,y", x, y);
  if (x === undefined || x === null) {
    const randomMove = findRandomMoveFrom(lastMove);
    if (!randomMove) {
      resetMoves();
      return false;
    }
    console.log("randomMove", randomMove);
    x = randomMove.x;
    y = randomMove.y;
  }

  const diffX = lastMove?.x - x;
  const diffY = lastMove?.y - y;
  if (
    (!lastMove && x === 0 && y === 0) ||
    (squaresGrid[x][y].getAttribute("data-active") === null &&
      lastMove &&
      ((Math.abs(diffX) === 1 && Math.abs(diffY) === 0) ||
        (Math.abs(diffX) === 0 && Math.abs(diffY) === 1)))
  ) {
    if (diffX < 0 || (x === 0 && y === 0)) {
      squaresGrid[x][y].classList.add("connectLeft");
    } else if (diffX > 0) {
      squaresGrid[x][y].classList.add("connectRight");
    } else if (diffY > 0) {
      squaresGrid[x][y].classList.add("connectTop");
    } else if (diffY < 0) {
      squaresGrid[x][y].classList.add("connectBottom");
    }
    window.setTimeout(() => {
      squaresGrid[x][y].setAttribute("data-active", "1");
    }, 10);

    lastMove = {
      x: x,
      y: y,
      elt: squaresGrid[x][y],
    };
  }

  return true;
}

export default function () {
  const squareElts = getAllSquareElts();
  const squaresGrid = squareEltsToGrid(squareElts);

  squareElts.forEach((elt) => {
    elt.addEventListener("mouseenter", () => {
      flipSquare(
        Math.floor(Number(elt.getAttribute("data-index-x"))),
        Math.floor(Number(elt.getAttribute("data-index-y")))
      );
    });
  });

  const timeoutFunction = (x?: number, y?: number) => {
    if (!flipSquare()) {
      resetMoves();
    }
    setTimeout(timeoutFunction, 500);
  };
  timeoutFunction(0, 0);

  function resetTimer() {}
}
