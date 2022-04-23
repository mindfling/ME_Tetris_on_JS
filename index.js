'use strict';

// alert('container');
console.log('Hello this is Tetris on JS');


// const SIZE_BLOCK = 30;
const SIZE_BLOCK = 15;

// mechanics business logics

// * основное поле стакан для игры
const game = {
  area: [
    ['0','0','0','0','0','0','0','0','0','0',],
    ['0','0','0','0','0','0','0','0','0','0',],
    ['0','0','0','0','0','0','0','0','0','0',],
    ['0','0','0','0','0','0','0','0','0','0',],
    ['0','0','0','0','0','0','0','0','0','0',],
    ['0','0','0','0','0','0','0','0','0','0',],
    ['0','0','0','0','0','0','0','0','0','0',],
    ['0','0','0','0','0','0','0','0','0','0',],
    ['0','0','0','0','0','0','0','0','0','0',],
    ['0','0','0','0','0','0','0','0','0','0',],
    ['0','0','0','0','0','0','0','0','0','0',],
    ['0','0','0','0','0','0','0','0','0','0',],
    ['0','0','0','0','0','0','0','0','0','0',],
    ['0','0','0','0','0','0','0','0','0','0',],
    ['0','0','0','0','0','0','0','0','0','0',],
    ['0','0','0','0','0','0','0','0','0','0',],
    ['0','0','0','0','0','0','0','0','0','0',],
    ['0','0','0','0','0','0','0','0','0','0',],
    ['0','0','0','0','0','0','0','0','0','0',],
    ['0','0','0','0','0','0','0','0','0','0',],
  ],

  activeTetromino: {
    // нач коорд
    x: 5,
    y: 0,
    // активный блок
    block: [
      ['r','0','0'],
      ['r','r','r'],
      ['0','0','0']
    ],
    //todo posible rotation
    rotationIndex: 0,
    rotation: [
      [
        ['r','0','0'],
        ['r','r','r'],
        ['0','0','0']
      ],
      [
        ['0','y','y'],
        ['0','y','0'],
        ['0','y','0']
      ],
      [
        ['0','0','0'],
        ['c','c','c'],
        ['0','0','c']
      ],
      [
        ['0','d','0'],
        ['0','d','0'],
        ['d','d','0']
      ]
    ]
  },

  //движ влево <-
  moveLeft() {
    //проверяем можно ли двинуть
    if (this.chechOutPosition(this.activeTetromino.x - 1, this.activeTetromino.y)) {
      // если можно то двигаем
      this.activeTetromino.x -= 1;
    }
  },
  
  //движ вправо ->
  moveRight() {
    if (this.chechOutPosition(this.activeTetromino.x + 1, this.activeTetromino.y)) {
      this.activeTetromino.x += 1;
    }
  },
  
  //ускорение и движ вниз ||
  moveDown() {
    if (this.chechOutPosition(this.activeTetromino.x, this.activeTetromino.y + 1)) {
      //* если есть куда двигать вниз
      this.activeTetromino.y += 1;
    } else {
      //* если не куда двигать вниз
      this.stopMove();
    }
  },

  //вращение как у макса вращение по индексам
  rotateTetromino() {
    console.log('Space rotate');
    const x = this.activeTetromino.x;
    const y = this.activeTetromino.y;
    const block = this.activeTetromino.block;
    let index = this.activeTetromino.rotationIndex;
    index = (index < 3) ? index + 1 : 0;
    const nextBlock = this.activeTetromino.rotation[index];
    //меняем индекс вращения
    //this.activeTetromino.rotationIndex = this.activeTetromino.rotationIndex < 3 ? this.activeTetromino.rotationIndex + 1 : 0;
    //тест на столкновение при вращении
    if ( this.checkOutRotate(x, y, nextBlock) ) {
      this.activeTetromino.rotationIndex = index;
      this.activeTetromino.block = JSON.parse(JSON.stringify(nextBlock));
      //? нужно полное копирование
      // this.activeTetromino.block = JSON.parse(JSON.stringify( this.activeTetromino.rotation[this.activeTetromino.rotationIndex] ));
    } else {
      //при возможном столкновении не сохраняем изменения
      console.log('rotation colision');
    }
  },
  
  //вращение блока по часовой стрелке
  enterRotateTetromino() {
    console.log('Enter Rotate');
    let a = this.activeTetromino.block;
    // изменяем индекс поворота
    this.activeTetromino.rotationIndex = this.activeTetromino.rotationIndex < 3 ? this.activeTetromino.rotationIndex + 1 : 0;
    //todo вращение по часовой стрелке ПОЭЛЕМЕНТНО
    const nextBlock = [
      [ a[2][0],a[1][0],a[0][0] ],
      [ a[2][1],a[1][1],a[0][1] ],
      [ a[2][2],a[1][2],a[0][2] ],
    ];

    if ( this.checkOutRotate(this.activeTetromino.x, this.activeTetromino.y, nextBlock) ) {
      // *копируем контент блока если прошла проверка
      // a.forEach((row, r) => {
      //   row.forEach((elem, c) => {
      //     a[r][c] = nextBlock[r][c];
      //   })
      // });
      // *копирование 
      this.activeTetromino.block = nextBlock.slice(0);
    }
  },

  rotateRight90(matrix = this.activeTetromino.block) {
    //* поворот матрицы by Maks
    let result = [];
    for (let i = matrix.length - 1; i >= 0; i--) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (!result[j]) {
          result[j] = [];
        }
        result[j].push(matrix[i][j]);
      }
    }
    console.log('matrix rotate', result);
    return result;
  },


  // * getter()
  //возвращает значение нового активного поля с изменениями
  get viewArea() {
    const area = JSON.parse( JSON.stringify(this.area) );
    // копия текущих координат и активного блока
    // ? пример деструктуризации копии объектов
    // ? const {x, y , block} = this.activeTetromino;
    const {x, y, block: tetromino} = this.activeTetromino;

    for (let i = 0; i < tetromino.length; i++) {
      const row = tetromino[i];
      for (let j = 0; j < row.length; j++) {
        const elem = row[j];
        if ( elem !== '0') {
          area[y+i][x+j] = tetromino[i][j];
        }
      }
    }
    //возвращаем отрисованую фигуру
    return area;
  },

  chechOutPosition(x, y) {
    //* проверка столкновения с другими фигурами
    // * true если нет потенц столкновений
    //активная фигура
    const tetromino = this.activeTetromino.block;

    for (let r = 0; r < tetromino.length; r++) {
      const row = tetromino[r];
      for (let c = 0; c < row.length; c++) {
        const elem = row[c];

        // если елемент "0" то столкновения здесь уже не будет
        if (tetromino[r][c] === '0') {
          continue;
        }
        /* if ((!this.area[y+r]) || (!this.area[y+r][x+c])) {
          console.log('СТЕНКА');
          return false; 
        }*/
        // *проверка на дно
        if ( !this.area[y+r] ) {
          console.log('ДНО');
          return false; //! без return будет ошибка
        }
        // *проверка на стенки
        if ( !this.area[y+r][x+c] ) {
          console.log('СТЕНКА с лева или с права');
          return false; //! без return будет ошибка
        }

        if ( this.area[y+r][x+c] !== '0' && tetromino[r][c] !== '0' ) {
          // area[y+r][x+c] = tetromino[r][c];
          console.log('СТОЛКНОВЕНИЕ');
          return false;
        }
      }
    }

    return true;
  }, //chechOutPosition

  checkOutRotate(x, y, block) {
    //* проверка столкновения с другими фигурами перед поворотом
    // * true если нет потенц столкновений

    const nextRotateTetromino = block;

    for (let r = 0; r < nextRotateTetromino.length; r++) {
      const row = nextRotateTetromino[r];
      
      for (let c = 0; c < row.length; c++) {
        const elem = row[c];
        //проверка на дно И стенкУ
        if ((!this.area[y+r]) || (!this.area[y+r][x+c])) {
          console.log('СТЕНКА при повороте');
          return false; //! без return будет ошибка
        }
        if ( this.area[y+r][x+c] !== '0' && nextRotateTetromino[r][c] !== '0' ) {
          // area[y+r][x+c] = tetromino[r][c];
          console.log('СТОЛКНОВЕНИЕ при повороте');
          return false;
        }
      }
    }

    // console.log('возмож поворот !');
    return true;
  },

  stopMove() {
    //деструктуризация
    const {x, y, block} = this.activeTetromino;
    // фиксация упавшей тетрамины вниз
    for (let r=0; r < block.length; r++) {
      for (let c=0; c < block[r].length; c++) {
        //пустой элем в тетромине
        if ( block[r][c] !== '0' ) {
          this.area[y+r][x+c] = block[r][c];
        }
      }
    }
    this.newMove();
  },

  newMove() {
    //* новая фигура в начальной позиции
    this.activeTetromino.x = 4;
    this.activeTetromino.y = 0;
    
    // todo генерир нов фигуру тетромин
    //this.generateNewTetromino();
  },

  resetGame() {
    //* инит нач состояние игры
    this.area.forEach( (row, r, arr) => {
      row.forEach( (elem, c) => {
        arr[r][c] = '0';
      });
    });
    // this.activeTetromino.x = 0;
    // this.activeTetromino.y = 0;
    this.newMove();
  }

};


//  /////////////////////////////////////////////////////////////////  //

const container = document.querySelector('.container');

const canvas = document.createElement('canvas');
canvas.classList.add('game-area');
console.log(canvas);
container.append(canvas);
canvas.width = SIZE_BLOCK * 10;    // * блоков в ширину по горизонтали
canvas.height = SIZE_BLOCK * 20;   // * блоков в длину по вертикали

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
         context.strokeStyle = 'gray';
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

  if (key == 'Enter') {
    // console.log('Enter Rotate');
    game.enterRotateTetromino();
  } else if (key === ' ') {
    game.rotateTetromino();
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