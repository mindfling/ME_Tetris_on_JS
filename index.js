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
    ['x','0','0','0','0','r','0','0','x','0',],
    ['0','0','0','0','0','r','0','0','0','0',],
    ['x','0','0','0','0','r','r','0','x','0',],
    ['x','0','0','0','0','0','0','0','x','0',],
    ['0','0','0','0','0','0','0','0','0','c',],
    ['y','0','0','0','0','0','0','0','0','c',],
    ['x','y','0','0','0','0','0','0','x','c',],
    ['x','y','y','0','0','0','0','0','b','c',],
    ['x','x','y','0','0','0','0','b','b','b',]
  ],

  activeTetromino: {
    // нач коорд
    x: 0,
    y: 1,
    // активный блок
    block: [
      ['0','r','0'],
      ['0','r','0'],
      ['r','r','0']
    ]
  },

  //движ влево <-
  moveLeft() {
    this.activeTetromino.x -= 1;
  },
  
  //движ вправо ->
  moveRight() {
    this.activeTetromino.x += 1;
    
  },
  
  //ускорение и движ вниз ||
  moveDown() {
    this.activeTetromino.y = game.activeTetromino.y + 1;

  },

  //вращение блока по часовой стрелке
  rotateTetromino() {

  },

  //возвращает значение нового активного поля с изменениями
  get viewArea() {
    //! копия массиа
    const area = JSON.parse( JSON.stringify(this.area) );
    // копия текущих координат и активного блока
    // ? пример деструктуризации копии объектов
    // ? const {x, y , block} = this.activeTetromino;
    const {x, y, block: tetromino} = this.activeTetromino;
    for (let i = 0; i < tetromino.length; i++) {
      const row = tetromino[i];
      console.log('row: ', row);
      
      for (let j = 0; j < row.length; j++) {
        const elem = row[j];
        console.log('elem: ', elem);
        if ( elem !== '0') {
          area[y+i][x+j] = tetromino[i][j];
        }
      }
    }
    //возвращаем отрисованую фигуру
    return area;
  }
};


// * ///////////////////////////////////////////////////////////////// * //


const container = document.querySelector('.container');

const canvas = document.createElement('canvas');
canvas.classList.add('game-area');
console.log(canvas);
container.append(canvas);
canvas.width = SIZE_BLOCK * 10;    // * блоков в ширину по горизонтали
canvas.height = SIZE_BLOCK * 20;   // * блоков в длину по вертикали

// * берем контекст у канваса
const context = canvas.getContext('2d');


// * функц вывода одной клеточки в стакан по координатам
// * r row
// * c col
// const showBlockCoord = (r, c) => {
function showBlockCoord(r, c) {

  context.strokeStyle = 'grey';
  context.fillRect( SIZE_BLOCK*(c), SIZE_BLOCK*(r), SIZE_BLOCK, SIZE_BLOCK);
  context.strokeRect( SIZE_BLOCK*(c), SIZE_BLOCK*(r), SIZE_BLOCK, SIZE_BLOCK);
}




// принимает area для вывода и отображает ее в стакане
const showArea = (area) => {
  // context
  //* context.fillStyle = 'magenta';
  // context.strokeStyle('black');
  // context.fillRect(SIZE_BLOCK*0, SIZE_BLOCK*0, SIZE_BLOCK*1, SIZE_BLOCK*2);
  // showBlockCoord(1,1);
  
  area.forEach( (row, r) => {
    
    // console.log(row);
    row.forEach( (elem, c) => {
      if (elem !== '0') {
        // console.log('elem = ', elem, ' at ', r, c);
        
        if (elem === 'm') {
          context.fillStyle = 'magenta';
          
        } else if (elem === 'a')  {
          context.fillStyle = 'aqua'; 
          
        } else if (elem === 'b')  {
          context.fillStyle = 'royalblue'; //'blueviolet';

        } else if (elem === 'c')  {
          context.fillStyle = 'chartreuse';

        } else if (elem === 'r')  {
          context.fillStyle = 'orangered';

        } else if (elem === 'y')  {
          context.fillStyle = 'yellow';
          
        // ... others

        } else {
          context.fillStyle = 'magenta';
        }
        
        
        showBlockCoord(r, c);
      }
    });
  });

}



// showArea(game.area);
showArea(game.viewArea);