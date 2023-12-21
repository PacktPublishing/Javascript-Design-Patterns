'use strict';
/**
 * 2.2
 */
function twoPointTwo() {
  class BoardSquare {
    constructor(color, row, file) {
      this.color = color;
      this.row = row;
      this.file = file;
    }
    occupySquare(piece) {
      this.piece = piece;
    }
    clearSquare() {
      this.piece = null;
    }
  }

  class BoardSquarePrototype {
    constructor(prototype) {
      this.prototype = prototype;
    }
    clone() {
      const boardSquare = new BoardSquare();
      boardSquare.color = this.prototype.color;
      boardSquare.row = this.prototype.row;
      boardSquare.file = this.prototype.file;
      return boardSquare;
    }
  }

  const whiteSquare = new BoardSquare('white');
  const whiteSquarePrototype = new BoardSquarePrototype(whiteSquare);

  const whiteSquareTwo = whiteSquarePrototype.clone();
  // ...
  const whiteSquareLast = whiteSquarePrototype.clone();
  console.assert(
    whiteSquare.color === whiteSquareTwo.color &&
      whiteSquareTwo.color === whiteSquareLast.color,
    'Prototype.clone()-ed instances have the same color as the prototype',
  );
  console.assert(
    whiteSquare !== whiteSquareTwo &&
      whiteSquare !== whiteSquareLast &&
      whiteSquareTwo !== whiteSquareLast,
    'each Prototype.clone() call outputs a different instances',
  );

  // illustration of why the prototype pattern is useful
  (() => {
    const boardSquare = new BoardSquare('white');
    const boardSquarePrototype = new BoardSquarePrototype(boardSquare);

    const boardSquareTwo = boardSquarePrototype.clone();
    // ...
    const boardSquareLast = boardSquarePrototype.clone();

    console.assert(
      boardSquareTwo.color === 'white' &&
        boardSquare.color === boardSquareTwo.color &&
        boardSquareTwo.color === boardSquareLast.color,
      'Prototype.clone()-ed instances have the same color as the prototype',
    );
    console.assert(
      boardSquare !== boardSquareTwo &&
        boardSquare !== boardSquareLast &&
        boardSquareTwo !== boardSquareLast,
      'each Prototype.clone() call outputs a different instances',
    );
  })();
  (() => {
    const boardSquare = new BoardSquare('black');
    const boardSquarePrototype = new BoardSquarePrototype(boardSquare);

    const boardSquareTwo = boardSquarePrototype.clone();
    // ...
    const boardSquareLast = boardSquarePrototype.clone();
    console.assert(
      boardSquareTwo.color === 'black' &&
        boardSquare.color === boardSquareTwo.color &&
        boardSquareTwo.color === boardSquareLast.color,
      'Prototype.clone()-ed instances have the same color as the prototype',
    );
    console.assert(
      boardSquare !== boardSquareTwo &&
        boardSquare !== boardSquareLast &&
        boardSquareTwo !== boardSquareLast,
      'each Prototype.clone() call outputs a different instances',
    );
  })();
}
twoPointTwo();
/**
 * 2.4
 */
function twoPointFour() {
  function twoPointFourPointOne() {
    class BoardSquare {
      constructor(color, row, file, startingPiece) {
        this.color = color;
        this.row = row;
        this.file = file;
        this.piece = startingPiece;
      }
      occupySquare(piece) {
        this.piece = piece;
      }
      clearSquare() {
        this.piece = null;
      }
    }

    (() => {
      class BoardSquarePrototype {
        constructor(prototype) {
          this.prototype = prototype;
        }
        clone() {
          const boardSquare = new BoardSquare();
          boardSquare.color = this.prototype.color;
          boardSquare.row = this.prototype.row;
          boardSquare.file = this.prototype.file;
          return boardSquare;
        }
      }
      const boardSquare = new BoardSquare('white', 1, 'A', 'king');
      const boardSquarePrototype = new BoardSquarePrototype(boardSquare);
      const otherBoardSquare = boardSquarePrototype.clone();

      console.assert(
        otherBoardSquare.piece === undefined,
        'prototype.piece was not copied over',
      );
    })();

    (() => {
      class BoardSquarePrototype {
        constructor(prototype) {
          this.prototype = prototype;
        }
        clone() {
          return Object.assign(new BoardSquare(), this.prototype);
        }
      }

      const boardSquare = new BoardSquare('white', 1, 'A', 'king');
      const boardSquarePrototype = new BoardSquarePrototype(boardSquare);
      const otherBoardSquare = boardSquarePrototype.clone();

      console.assert(
        otherBoardSquare.piece === 'king' &&
          otherBoardSquare.piece === boardSquare.piece,
        'prototype.piece was copied over',
      );
    })();
  }
  twoPointFourPointOne();

  function twoPointFourPointTwo() {
    const square = {
      color: 'white',
      occupySquare(piece) {
        this.piece = piece;
      },
      clearSquare() {
        this.piece = null;
      },
    };

    const otherSquare = Object.create(square);

    console.assert(otherSquare.__proto__ === square, 'uses JS prototype');

    console.assert(
      otherSquare.occupySquare === square.occupySquare &&
        otherSquare.clearSquare === square.clearSquare,
      "methods are not copied, they're 'inherited' using the prototype",
    );

    delete otherSquare.color;
    console.assert(
      otherSquare.color === 'white' && otherSquare.color === square.color,
      'data fields are also inherited',
    );

    otherSquare.occupySquare('king');
    console.assert(
      otherSquare.piece === 'king' && square.piece === undefined,
      'occupySquare method works',
    );
    otherSquare.clearSquare();
    console.assert(otherSquare.piece === null, 'clearSquare method works');

    class Square {
      constructor() {}
      occupySquare(piece) {
        this.piece = piece;
      }
      clearSquare() {
        this.piece = null;
      }
    }

    class BlackSquare extends Square {
      constructor() {
        super();
        this.color = 'black';
      }
    }

    console.assert(
      BlackSquare.prototype.__proto__ === Square.prototype,
      'subclass prototype has prototype of superclass',
    );
  }
  twoPointFourPointTwo();
}
twoPointFour();

/**
 * 3.2
 */
import { Logger as ImportedLogger, Logger } from './logger.js';
import importedLoggerInstance from './logger.js';

import { captureError } from '../utils.js';
function threePointTwo() {
  const Logger = ImportedLogger;

  const a = Logger.getInstance();
  const b = Logger.getInstance();
  console.assert(a === b, 'Logger.getInstance() returns the same reference');
  const typeError = captureError(() => new Logger('info', console));
  console.assert(
    typeError.message ===
      'Logger is not constructable, use getInstance() instead' &&
      typeError instanceof TypeError,
    'constructor errors if instance exists',
  );

  delete Logger.loggerInstance;
  console.assert(
    new Logger('info', console),
    'constructor works if before getInstance()',
  );
  console.assert(
    new Logger('info', console),
    'constructor works if before getInstance()',
  );
  Logger.getInstance();
  const typeError2 = captureError(() => new Logger('info', console));
  console.assert(
    typeError2.message ===
      'Logger is not constructable, use getInstance() instead' &&
      typeError2 instanceof TypeError,
    'constructor errors if instance exists',
  );

  Logger.loggerInstance = null;
  new Logger('info', console);

  const logger = importedLoggerInstance;
  logger.warn('testing testing 12');
}

threePointTwo();

import logger2, { Logger as Logger2 } from './logger-improved.js';
/**
 * 3.4
 */
async function threePointFour() {
  const typeError = captureError(() => new Logger2('info', console));
  console.assert(
    typeError.message ===
      'Logger is not constructable, use getInstance() instead' &&
      typeError instanceof TypeError,
    'constructor errors if instance exists',
  );

  // uncomment to get a syntax error example on private field access
  // Logger.#loggerInstance = null;

  const freezeError = captureError(() => {
    logger2.transport = 'bar';
  });
  console.assert(
    freezeError.message ===
      'Cannot add property transport, object is not extensible' &&
      freezeError instanceof TypeError,
    'constructor errors if instance exists',
  );

  await Promise.all([
    import('./my-singleton.js'),
    import('./my-singleton.js'),
  ]).then(([import1, import2]) => {
    console.assert(
      import1 === import2,
      'import objects are a single reference',
    );
    console.assert(
      import1.default.value === 'my-value' &&
        import2.default.value === 'my-value',
      'instance variable is equal',
    );
    console.assert(
      import1.default === import2.default,
      'multiple imports of a module yield the same default object value, a single MySingleton instance',
    );
  });

  const { default: logger3 } = await import('./logger-module-singleton.js');
  logger3.info('testing info'); // logs nothing, our logger is configured for warn+
  logger3.warn('testing warn'); // 'testing warn'
}

await threePointFour();

/**
 * 4.2
 */
function fourPointTwo() {
  class Building {
    generateBuilding() {
      this.topFloor = this.makeTopFloor();
    }
    makeTopFloor() {
      throw new Error('not implemented, subclass of Building should implement');
    }
  }

  class House extends Building {
    makeTopFloor() {
      return {
        level: 1,
      };
    }
  }

  const house = new House();
  house.generateBuilding();
  console.assert(house.topFloor.level === 1, 'topFloor works in House');

  class SkyScraper extends Building {
    makeTopFloor() {
      return {
        level: 125,
      };
    }
  }

  const skyScraper = new SkyScraper();
  skyScraper.generateBuilding();
  console.assert(
    skyScraper.topFloor.level > 100,
    'topFloor works in SkyScraper',
  );
}
fourPointTwo();

/**
 * 4.4
 */
function fourPointFour() {
  function generateBuilding({ makeTopFloor }) {
    return {
      topFloor: makeTopFloor(),
    };
  }

  const house = generateBuilding({
    makeTopFloor() {
      return {
        level: 1,
      };
    },
  });
  console.assert(house.topFloor.level === 1, 'topFloor works in house');

  const skyScraper = generateBuilding({
    makeTopFloor() {
      return {
        level: 125,
      };
    },
  });
  console.assert(
    skyScraper.topFloor.level > 100,
    'topFloor works in skyScraper',
  );
}

fourPointFour();
