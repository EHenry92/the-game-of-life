describe('new Board', () => {
  it('creates a 32x32 board by default', () => {
    var board = new Board;
    expect(board.width).toEqual(32);
    expect(board.height).toEqual(32);
    expect(board.cells.length).toEqual(32 * 32)
  });

  it('creates a board of a specified size', () => {
    var board = new Board(7, 9);
    expect(board.width).toEqual(7);
    expect(board.height).toEqual(9);
    expect(board.cells.length).toEqual(7 * 9);
  })
});

describe('Board::indexFor(coords: [row, col])', () => {  
  it('returns 0 for (0, 0)', () => {
    expect(new Board().indexFor([0, 0])).toEqual(0)
  });

  describe('uses row major indexing', () => {
    var board = new Board();

    it('so advancing col by 1 increases the index by 1', () => {
      expect(board.indexFor([0, 1])).toEqual(1)
    })

    it('so advancing row by 1 increases the index by board.width', () => {
      expect(board.indexFor([3, 0])).toEqual(3 * board.width)
    })
  });

  it('returns the last index for (rows - 1, cols - 1)', () => {
    expect(new Board(10, 7).indexFor([6, 9])).toEqual(10 * 7 - 1)
  });

  it('returns undefined for indexes that are out of bounds', () => {
    expect(new Board(10, 10).indexFor([10, 10])).toBeUndefined()
  })
});

describe('Board::get(coords)', () => {
  var board; beforeEach(() =>
    board = new Board(3, 3, [
      0, 1, 0,
      0, 0, 0,
      1, 1, 1
    ]));

  it('returns the value of cells that are there', () => {    
    expect(board.get([0, 1])).toEqual(1)    
  });

  it('returns 0 for cells that are off the board', () => {
    expect(board.get([10, 10])).toEqual(0)
  })
});

describe('Board::set(coords, value)', () => {
  var board; beforeEach(() => board = new Board);

  it('sets (0, 0) to true', () => {
    board.set([0, 0], true);
    expect(board.cells[0]).toEqual(1)
  });

  it('sets some arbitrary middle cell to true', () => {
    var coords = [19, 7];
    board.set(coords, true)
    expect(board.get(coords)).toBeTruthy()
  });

  it('unsets cells as well', () => {
    var coords = [board.width - 1, board.height - 1]
    board.set(coords, true)
    expect(board.get(coords)).toBeTruthy()
    board.set(coords, false)
    expect(board.get(coords)).toBeFalsy()
  })
});

describe('Board::livingNeighbors(coords)', () => {
  it('treats cells off the board as dead', () => {
    var board = new Board(3, 3, [1, 1, 1,
                                 1, 1, 1,
                                 1, 1, 1]);
    expect(board.livingNeighbors([0, 0])).toEqual(3)
  });

  it("doesn't include the cell itself", () => {
    var board = new Board(3, 3,
      [1, 1, 1,
       1, 1, 1,
       1, 1, 1]);
    expect(board.livingNeighbors([1, 1])).toEqual(8);

    board = new Board(3, 3,
      [1, 0, 1,
       0, 1, 1,
       0, 0, 0]);
    expect(board.livingNeighbors([1, 1])).toEqual(3)
  });

  it('counts only living cells', () => {
    var board = new Board(3, 3,
      [1, 1, 1,
       1, 1, 1,
       0, 0, 0]);
    expect(board.livingNeighbors([1, 1])).toEqual(5);

    board = new Board(3, 3,
      [1, 0, 1,
       0, 0, 1,
       0, 0, 0]);
    expect(board.livingNeighbors([1, 1])).toEqual(3)
  })
});

describe('Board::toggle(coords, value)', () => {
  var board; beforeEach(() => board = new Board);

  it('switches cells from off to on', () => {
    var coord = [0, 0];
    expect(board.get(coord)).toBeFalsy();
    board.toggle(coord);
    expect(board.get(coord)).toBeTruthy();
  });

  it('switches cells from on to off', () => {
    var coord = [0, 0];
    board.set(coord, true);
    expect(board.get(coord)).toBeTruthy();
    board.toggle(coord);
    expect(board.get(coord)).toBeFalsy();
  })
})

describe('conway(isAlive, livingNeighbors) -> Boolean', () => {
  describe('living cells', () => {
    it('with less than 2 neighbors die by underpopulation', () => {
      expect(conway(true, 0)).toEqual(false);
      expect(conway(true, 1)).toEqual(false);
    });

    it('with 2 or 3 neighbors survive', () => {
      expect(conway(true, 2)).toEqual(true);
      expect(conway(true, 3)).toEqual(true);
    });

    it('with more than 3 neighbors die of suffocation', () => {
      expect(conway(true, 4)).toEqual(false)
      expect(conway(true, 5)).toEqual(false)
      expect(conway(true, 6)).toEqual(false)
      expect(conway(true, 7)).toEqual(false)
      expect(conway(true, 8)).toEqual(false)
    })
  })

  describe('dead cells', () => {
    it('with exactly 3 neighbors come alive by reproduction', () => {
      expect(conway(false, 3)).toEqual(true)
    })

    it('stay dead if they have livingNeighbors != 3', () => {
      expect(conway(false, 1)).toEqual(false)
      expect(conway(false, 2)).toEqual(false)
      expect(conway(false, 4)).toEqual(false)
      expect(conway(false, 5)).toEqual(false)
      expect(conway(false, 6)).toEqual(false)      
      expect(conway(false, 7)).toEqual(false)
      expect(conway(false, 8)).toEqual(false)
    })
  })
})

describe('tick(present: Board, future: Board!, rules)', () => {
  it('returns [future, present]', () => {
    var present = new Board, future = new Board;
    expect(tick(present, future)).toEqual([future, present])
  });

  describe('with rules that turn everything on', () => {
    function everythingLives() { return true }

    it('sets all cells alive in the future', () => {
      var present = new Board(2, 2), future = new Board(2, 2)
      tick(present, future, everythingLives);
      expect(future.cells).toEqual([1, 1,
                                    1, 1])
    })
  });

  describe('with rules that toggle cells', () => {
    function flip(alive) { return !alive }
    
    it('flips living cells to dead', () => {
      var present = new Board(2, 2, [1, 1, 0, 0]);
      var future = new Board(2, 2);
      tick(present, future, flip);
      expect(future.cells).toEqual([0, 0, 1, 1])
    })
  })

  describe("with conway's rules", () => {  
    it('does nothing to a block', () => {
      var block = new Board(2, 2, [
        1, 1,
        1, 1,
      ]);
      var future = new Board(2, 2);
      tick(block, future);
      expect(future.cells).toEqual(block.cells)
    });

    it('advances a glider from gen1 to gen2', () => {
      var glider1 = new Board(3, 3, [
        1, 0, 1,
        0, 1, 1,
        0, 1, 0,
      ])
      var glider2 = new Board(3, 3, [
        0, 0, 1,
        1, 0, 1,
        0, 1, 1,
      ])
      var future = new Board(3, 3)
      tick(glider1, future)
      expect(future.cells).toEqual(glider2.cells)
    })
  })
})