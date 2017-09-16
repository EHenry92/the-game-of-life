var mainElement = document.getElementById('main');
if (mainElement) {
  var game = Life(mainElement)

  // Connect #step_btn to the step function
  document.getElementById('step_btn')
    .addEventListener('click', game.step);
  document.getElementById('play_btn')
    .addEventListener('click', function () {
      game.togglePlaying();
    });
  document.getElementById('reset_btn')
    .addEventListener('click', game.random);
  document.getElementById('clear_btn')
    .addEventListener('click', game.clear);

  // TODO: Connect other buttons.
}

function Life(container, width=12, height=12) {
  var playing = false;
  let hm;
  // Create boards for the present and future.
  // Game boards are somewhat expensive to create, so we're going
  // to be reusing them. Each time we step the game, `future`
  // becomes `present` and vice versa.
  var present = new Board(width, height);
  var future = new Board(width, height);

  // Create a <table> to hold our cells.
  var table = createTable();
  
  // Put the table in our container
  container.appendChild(table);

  // Add a mouse down listener to our table
  table.addEventListener('mousedown', toggleCellFromEvent)

  function createTable() {    
    // create <table> element
    var table = document.createElement('table');       // <table
    table.classList.add('board')                       //   class='board'>
    for (var r = 0; r < height; r++) {
      var tr = document.createElement('tr');           //   <tr>
      for (var c = 0; c < width; c++) {                //     For instance, at r=2, c=3:
        var td = document.createElement('td');         //     <td
        td.id = `${r}-${c}`                            //       id="2-3">
        // We'll put the coordinate on the cell
        // Element itself, letting us fetch it
        // in a click listener later.
        td.coord = [r, c];        
        tr.appendChild(td);     
                               //     </td>
      }
      table.appendChild(tr);                           //   </tr>
    }                                                  //  </table>
    return table;
  }
  
  function toggleCellFromEvent(event) {
    // FIXME: This currently always toggles cell (0, 0).
    // How do we get the coordinate of the cell that was clicked on?
    // HINT: https://developer.mozilla.org/en-US/docs/Web/API/Event/target
    var cell = document.getElementById(event.target.id); // ⬅️ Fix me
    present.toggle(cell.coord);
    paint()
  }

  function paint() {
    let tCells = document.getElementsByTagName('td');
    for (var i = 0;i < tCells.length;i++) {
      if (present.cells[present.indexFor(tCells[i].coord)]) 
        {tCells[i].classList.add('alive');}
      else {tCells[i].classList.remove('alive');}
    }
  
   
    // TODO:
    //   1. For each <td> in the table:
    //     a. If its cell is alive, give the <td> the `alive` CSS class.
    //     b. Otherwise, remove the `alive` class.
    //
    // To find all the <td>s in the table, you might query the DOM for them, or you
    // could choose to collect them when we create them in createTable.
    //
    // HINT:
    //   https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
    //   https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName
  }

  function step() {
    // Hello, destructuring assignment:
    //   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    [present, future] = tick(present, future);  // tick is from board.js
    // ⬆️ Why is there a semicolon at the beginning of this line?
    //
    // It's not necessary, but we have it there to avoid a confusing problem.
    // Let's say you put a console.log at the start of this function, but
    // forget the semicolon at the end of the line:
    //
    //     console.log('entered step')
    //     [present, future] = tick(present, future);
    //
    // This is the one case in which automatic semicolon insertion can really bite
    // you. Since the line begins with a `[` token, JS will assume that it *continues*
    // the previous expression. That is, it will condense your code to this:
    //
    //     console.log('entered step')[present, future] = tick(present, future);
    //
    // Which will throw the confusing error:
    //
    //     TypeError: Cannot read property '#<Board>' of undefined
    //
    // Since it's trying to look up `present` inside the return value of `console.log`,
    // which is undefined.
    //
    // In general, you should either be fastidious about ending lines with semicolons,
    // or you should be sure to *begin* with a semicolon any line that could continue
    // an expression—that's any line that starts with a (, [, or ` character.

    // Paint the new present
    paint();
  }

  function play() {
    playing = true;
    hm = setInterval(function () {step();},100);
    // TODO:
    // Start playing by running the `step` function    
    // automatically repeatedly every fixed time interval
    
    // HINT:
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval
  }

  function stop() {
    playing = false;
    clearInterval(hm);
    // TODO: Stop autoplay.
    // HINT:
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearInterval
  }

  function togglePlaying() {
    if (playing) {game.stop();}
    else {game.play();}
    // TODO: If we're playing, stop. Otherwise, start playing.
  }

  function clear(elm) {
    [present, future] = tick(present, future,function () {return 0;});  // tick is from board.js
    paint();
        // TODO: Clear the board
  }

  function random() {
    [present, future] = tick(present, future,function () {
            return Math.round(Math.random());
    });
    paint();
  }

  return {play, step, stop, togglePlaying, random, clear}
};
