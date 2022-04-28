import { tetrominoes } from "./tetrominoes.js";
import { colors } from "./tetrominoes.js";
import { SIZE_BLOCK, ROWS, COLUMNS } from './config.js';
// * viewer.js




// * функц вывода одной клеточки в стакан по координатам
// * r row * c col
function showBlockCoord(r, c) {
  context.fillRect( SIZE_BLOCK*(c), SIZE_BLOCK*(r), SIZE_BLOCK, SIZE_BLOCK);
  context.strokeRect( SIZE_BLOCK*(c), SIZE_BLOCK*(r), SIZE_BLOCK, SIZE_BLOCK);
}


export class View {
  constructor(container) {
    this.container = container;
    this.preview();
  };
  
  // colors = colors;
  colors = {
    J: 'orangered',
    I: 'DarkOrange',
    D: 'limegreen',
    L: 'MediumOrchid',
    2: 'lawngreen',
    T: 'CornflowerBlue',
    S: 'blueviolet',
    0: 'transparent'
  };

  canvas = document.createElement('canvas');
  
  context = this.canvas.getContext('2d'); // * берем контекст у канваса 2d

  
  preview() {
    // * превью отбражается в самом начале до нажатия Enter
    console.log('preview');
  }

  init() {
    console.log('view init');
    this.canvas.classList.add('game-area');
    this.canvas.width = SIZE_BLOCK * COLUMNS;    // * блоков в ширину по горизонтали
    this.canvas.height = SIZE_BLOCK * ROWS;    // * блоков в длину по вертикали
    this.container.append(this.canvas);
  }


  showArea(area) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);  //очистка всего context

    area.forEach( (row, r) => {
      row.forEach( (elem, c) => {
        if (elem !== '0') {
          //* выбор цвета элемента блока
          this.context.fillStyle = this.colors[elem];
          this.context.strokeStyle = 'wheat'; //todo
        } else {
          this.context.fillStyle = 'transparent';
          this.context.strokeStyle = 'transparent';
        }
        // showBlockCoord(r, c);
        this.context.fillRect( SIZE_BLOCK*(c), SIZE_BLOCK*(r), SIZE_BLOCK, SIZE_BLOCK);
        this.context.strokeRect( SIZE_BLOCK*(c), SIZE_BLOCK*(r), SIZE_BLOCK, SIZE_BLOCK);

      });
    });
  }


}


