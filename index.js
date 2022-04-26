'use strict';
import { Game } from "./modules/game.js";
import { ROWS, COLUMNS, SIZE_BLOCK} from "./modules/config.js";


// * game object
const game = new Game();
console.log('game:::', game.activeTetromino);
game.newMove();
console.log('game:::', game.activeTetromino);


// console.log('game: \n', JSON.stringify(game.area));
// mechanics

const container = document.querySelector('.container');
const canvas = document.createElement('canvas');

canvas.classList.add('game-area');
container.append(canvas);
canvas.width = SIZE_BLOCK * COLUMNS;    // * блоков в ширину по горизонтали
canvas.height = SIZE_BLOCK * ROWS;    // * блоков в длину по вертикали

const context = canvas.getContext('2d'); // * берем контекст у канваса 2d


// * функц вывода одной клеточки в стакан по координатам
// * r row * c col
// const showBlockCoord = (r, c) => {
function showBlockCoord(r, c) {
  context.fillRect( SIZE_BLOCK*(c), SIZE_BLOCK*(r), SIZE_BLOCK, SIZE_BLOCK);
  context.strokeRect( SIZE_BLOCK*(c), SIZE_BLOCK*(r), SIZE_BLOCK, SIZE_BLOCK);
}

// принимает area для вывода и отображает ее в стакане
const showArea = (area) => {
  context.clearRect(0, 0, canvas.width, canvas.height);  //очистка всего context

  area.forEach( (row, r) => {
    row.forEach( (elem, c) => {
      if (elem !== '0') {
        //* выбор цвета элемента блока
        context.fillStyle = game.colors[elem];
        /*
        if (elem === 'g') {
          context.fillStyle = 'green';
        } else if (elem === 'a')  {
          context.fillStyle = 'aqua'; 
        } else if (elem === 'b')  {
          context.fillStyle = 'royalblue'; //'blueviolet';
        } else if (elem === 'c')  {
          context.fillStyle = 'chartreuse';
        } else if (elem === 'd')  {
          context.fillStyle = 'darkmagenta';
        } else if (elem === 'r')  {
          context.fillStyle = 'orangered';
        } else if (elem === 'y')  {
          context.fillStyle = 'yellow';
        } else {
          context.fillStyle = 'magenta';
        }
        */
      } else {
        // context.fillStyle = 'transparent';
        // context.strokeStyle = 'transparent';
        context.fillStyle = game.colors['0'];
        context.strokeStyle = 'grey';
      }
      // showBlockCoord(r, c);
      context.fillRect( SIZE_BLOCK*(c), SIZE_BLOCK*(r), SIZE_BLOCK, SIZE_BLOCK);
      context.strokeRect( SIZE_BLOCK*(c), SIZE_BLOCK*(r), SIZE_BLOCK, SIZE_BLOCK);

    });
  });
}


// * вешаем события нажатия клавиш ***

window.addEventListener('keydown', (event) => {
  const key = event.key;
  // console.log('key: ', key);

  if (key == 'Enter') {
    // console.log('Enter Rotate');
    game.enterRotateTetromino();
  } else if (key === ' ') {
    game.rotateTetromino();
  } else if (key === '+') {
    game.rotateRight90();
  } else if (key === '-') {
    game.rotateLeft90();
  } else if (key === 'ArrowUp') {
    game.activeTetromino.block = game.rotateRight90();
  } else if (key === 'ArrowLeft') {
    game.moveLeft();
  } else if (key === 'ArrowRight') {
    game.moveRight();
  } else if (key === 'ArrowDown') {
    game.moveDown();
    
  } else if (key === 'Escape') {
    
    console.log("перезагрузка игры");
    game.resetGame();
  }
  //* после нажатий клавиш перерис весь стакан
  showArea(game.viewArea);
});

/*
http://localhost:52330/index.html
http://127.0.0.1:5500/
*/

var count = 0;
setInterval(() => {
  game.moveDown();
  //* перерисовка при каждом тике 1s
  showArea(game.viewArea);
}, 1000);
