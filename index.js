import { game } from './modules/game.js';


console.log( game );


const SIZE_BLOCK = 20;
const COLUMNS = 10;
const ROWS = 20;

// mechanics business logics


//  /////////////////////////////////////////////////////////////////  //

const container = document.querySelector('.container');

const canvas = document.createElement('canvas');
canvas.classList.add('game-area');
console.log(canvas);
container.append(canvas);
canvas.width = SIZE_BLOCK * COLUMNS;    // * блоков в ширину по горизонтали
canvas.height = SIZE_BLOCK * ROWS;   // * блоков в длину по вертикали

// * берем контекст у канваса 2d
const context = canvas.getContext('2d');


// * функц вывода одной клеточки в стакан по координатам
// * r row * c col
// const showBlockCoord = (r, c) => {
function showBlockCoord(r, c) {
  context.fillRect( SIZE_BLOCK*(c), SIZE_BLOCK*(r), SIZE_BLOCK, SIZE_BLOCK);
  // context.strokeStyle = 'grey';
  context.strokeRect( SIZE_BLOCK*(c), SIZE_BLOCK*(r), SIZE_BLOCK, SIZE_BLOCK);
}

// принимает area для вывода и отображает ее в стакане
const showArea = (area) => {
  console.log(count++);
  //! очистка всего context
  context.clearRect(0, 0, canvas.width, canvas.height);

  area.forEach( (row, r) => {
    row.forEach( (elem, c) => {
      if (elem !== '0') {
         context.strokeStyle = 'wheat';
        // console.log('elem = ', elem, ' at ', r, c);
        //* выбор цвета элемента блока
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
      } else {
        context.fillStyle = 'transparent';
        context.strokeStyle = 'transparent';
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
  console.log('key: ', key);

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
    // game.newMove();
  }

  // console.log(event);
  // *после нажатий клавиш перерис весь стакан
  showArea(game.viewArea);
});


// showArea(game.area);




// const gameAction = () => {
  //   console.log(count++);
//   showArea(game.area);
// }


/**
const tetramino = [
  ["o", "f", "o", "1"],
  ["o", "f", "o", "2"],
  ["f", "f", "o", "3"]
];

function rotateRight90(matrix) {
  let result = [];
  for (let i = matrix.length - 1; i >= 0; i--) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (!result[j]) {
        result[j] = [];
      }
      result[j].push(matrix[i][j]);
    }
  }
  return result;
}

console.log(tetramino);
let rotateTetramino = rotateRight90(tetramino);
console.log(rotateTetramino);
*/

var count = 0;

setInterval(() => {
  
  game.moveDown();
  showArea(game.viewArea);

}, 1000);

/*
http://localhost:52330/index.html
*/