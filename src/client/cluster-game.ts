const MAX_AUTO_WALKS = 1;
const MOVE_DELAY = 2000;
// const MOVE_DELAY = 500;
const LAST_WALK_MOVES = 3;

type Move = {
  elt: Element;
  x: number;
  y: number;
} | null;
let lastMove: Move = null;
let walksCount: number = 0;
let movesCount: number = 0;
let state: "AUTO_WALK" | "LAST_WALK" | "STOPPED" = "AUTO_WALK";

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

const getAllSquareElts = () =>
  document.querySelectorAll(".hhh_clustersGrid .hhh_squareRoot");

function getAttrs(elt: Element) {
  return {
    x: Math.floor(Number(elt.getAttribute("data-index-x"))),
    y: Math.floor(Number(elt.getAttribute("data-index-y"))),
    active: !!elt.getAttribute("data-active"),
  };
}

function incrementMoves() {
  movesCount++;
  console.log("movesCount", movesCount);
  if (state === "LAST_WALK" && movesCount >= LAST_WALK_MOVES) {
    console.log("state === stopped");
    state = "STOPPED";
  }
}

export function resetMoves() {
  lastMove = null;
  walksCount += 1;
  movesCount = 0;
  if (walksCount >= MAX_AUTO_WALKS && state === "AUTO_WALK") {
    state = "LAST_WALK";
    console.log("state === LAST_WALK");
  }
  getAllSquareElts().forEach((elt) => {
    const { x, y } = getAttrs(elt);
    if (x === 0 && y === 0) {
      lastMove = { x: x, y: y, elt: elt };

      return;
    }
    elt.removeAttribute("data-active");
    elt.classList.remove("hhh_connectTop");
    elt.classList.remove("hhh_connectBottom");
    elt.classList.remove("hhh_connectRight");
    elt.classList.remove("hhh_connectLeft");
  });
  highlightMoves(findAllValidMovesFrom(lastMove));
  resetTimeout();
}

const sorter = (eltA: Element, eltB: Element) => {
  const { y: aY } = getAttrs(eltA);
  const { y: bY } = getAttrs(eltB);
  return aY - bY;
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
      let { x, y, active } = getAttrs(squareElt);
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
      const { x, y } = getAttrs(elt);
      return {
        elt: elt,
        x: x,
        y: y,
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
        return getAttrs(elt).x === 0;
      })
      .sort(sorter),
    Array.from(squareElts)
      .filter((elt) => {
        return getAttrs(elt).x === 1;
      })
      .sort(sorter),
    Array.from(squareElts)
      .filter((elt) => {
        return getAttrs(elt).x === 2;
      })
      .sort(sorter),
  ];
}

function flipSquare(x?: number, y?: number) {
  const allSquares = getAllSquareElts();
  const squaresGrid = squareEltsToGrid(allSquares);

  if (x === undefined || x === null) {
    const randomMove = findRandomMoveFrom(lastMove);
    if (!randomMove) {
      resetMoves();
      return false;
    }
    x = randomMove.x;
    y = randomMove.y;
  }

  const diffX = lastMove?.x - x;
  const diffY = lastMove?.y - y;
  if (
    (!lastMove && x === 0 && y === 0) ||
    (!getAttrs(squaresGrid[x][y]).active &&
      lastMove &&
      ((Math.abs(diffX) === 1 && Math.abs(diffY) === 0) ||
        (Math.abs(diffX) === 0 && Math.abs(diffY) === 1)))
  ) {
    if (diffX < 0 || (x === 0 && y === 0)) {
      squaresGrid[x][y].classList.add("hhh_connectLeft");
    } else if (diffX > 0) {
      squaresGrid[x][y].classList.add("hhh_connectRight");
    } else if (diffY > 0) {
      squaresGrid[x][y].classList.add("hhh_connectTop");
    } else if (diffY < 0) {
      squaresGrid[x][y].classList.add("hhh_connectBottom");
    }
    window.setTimeout(() => {
      squaresGrid[x][y].setAttribute("data-active", "1");
    }, 10);

    lastMove = {
      x: x,
      y: y,
      elt: squaresGrid[x][y],
    };
    incrementMoves();
    resetTimeout();
    const validMoves = findAllValidMovesFrom(lastMove);
    highlightMoves(validMoves);
    if (validMoves.length === 0) {
      const resetDelay = MOVE_DELAY;
      setTimeout(resetMoves, resetDelay);
      clearTimeout(timeout);
    }
  }

  return true;
}

let timeout: number;

const timeoutFunction = (x?: number, y?: number) => {
  if (!flipSquare()) {
    resetMoves();
  }
  resetTimeout();
};

function highlightMoves(moves: Move[]) {
  const allSquares = getAllSquareElts();

  allSquares.forEach((square) => {
    square.removeAttribute("data-valid-move");
  });
  moves.forEach((move) => {
    move.elt.setAttribute("data-valid-move", "1");
  });
}

function resetTimeout(time: number = MOVE_DELAY) {
  clearTimeout(timeout);
  if (state === "AUTO_WALK" || state === "LAST_WALK") {
    timeout = setTimeout(timeoutFunction, time);
  }
}

export default function () {
  const squareElts = getAllSquareElts();
  const squaresGrid = squareEltsToGrid(squareElts);

  squareElts.forEach((elt) => {
    elt.addEventListener("mouseenter", () => {
      const { x, y } = getAttrs(elt);
      const success = !!flipSquare(x, y);
    });
  });

  timeoutFunction(0, 0);

  function resetTimer() {}
}
