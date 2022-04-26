import { tetrominoes } from "./tetrominoes.js";
import { colors } from "./tetrominoes.js";
import { SIZE_BLOCK, ROWS, COLUMNS } from './config.js';

// console.log('colors: ', colors);


function initZeroMatrix( row, col ) {
  // * возвращ матрицу заполн "0"
  let result = [];
  for (let r = 0; r < row; r++) {
    result[r] = [];
    for (let c = 0; c < col; c++) {
      // result[r][c] = 0;
      result[r].push('0');
    }
  }
  return result;
}




// * основной класс игры!!!
export class Game {

  colors = colors;

  // * основное поле стакан для игры
  area = initZeroMatrix( ROWS, COLUMNS );
  /*
  // [
  //*  ['0','0','0','0','0','0','0','0','0','0',],
  //*  ['0','0','0','0','0','0','0','0','0','0',],
  //*  ['0','0','0','0','0','0','0','0','0','0',],
  //*  ['0','0','0','0','0','0','0','0','0','0',],
  //*  ['0','0','0','0','0','0','0','0','0','0',],
  //*  ['0','0','0','0','0','0','0','0','0','0',],
  //*  ['0','0','0','0','0','0','0','0','0','0',],
  //*  ['0','0','0','0','0','0','0','0','0','0',],
  //*  ['0','0','0','0','0','0','0','0','0','0',],
  //*  ['0','0','0','0','0','0','0','0','0','0',],
  //*  ['0','0','0','0','0','0','0','0','0','0',],
  //*  ['0','0','0','0','0','0','0','0','0','0',],
  //*  ['0','0','0','0','0','0','0','0','0','0',],
  //*  ['0','0','0','0','0','0','0','0','0','0',],
  //*  ['0','0','0','0','0','0','0','0','0','0',],
  //*  ['0','0','0','0','0','0','0','0','0','0',],
  //*  ['0','0','0','0','0','0','0','0','0','0',],
  //*  ['0','0','0','0','0','0','0','0','0','0',],
  //*  ['0','0','0','0','0','0','0','0','0','0',],
  //*  ['0','0','0','0','0','0','0','0','0','0',],
  // ];
  */
  activeTetromino = {
    // * нач коорд фигуры 
    x: 0,
    y: 0,
    // * активный блок
    block: [],
/*     [
      ['0','r','0'],
      ['r','r','0'],
      ['r','0','0']
      ],      
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
          */
    rotationIndex: 0, //todo random
    rotation: [ [], [], [], [] ],
  };

  nextTetromino = {
    x: 0,
    y: 0,
    block: [],
    rotationIndex: 0, // todo random index 0,1,2,3
    rotation: [],
    randomLetter: '',
    color: ''
  };


  createTetromino = () => {
    // * возвращает сгенерирован рандом блок
    // const x = Math.floor( Math.random() * (COLUMNS - 5) + 1 );
    const x = Math.floor( Math.random() * (COLUMNS - 3) );
    const y = 0;
    
    const keys = Object.keys(tetrominoes); // массив всех ключей вариантов фигурок тетромино
    const randomKey = Math.floor(Math.random() * keys.length); // выбираем случайный индекс ключа из массива ключей
    const randomLetter = keys[randomKey]; // это сам случайный ключ

    const rotation = tetrominoes[randomLetter];
    const color = this.colors[randomLetter];
    const rotationIndex = Math.floor(Math.random() * rotation.length); // случайный индекс поворота всего 4 варианта поворота //todo CONST
    const block = rotation[rotationIndex];

    return { x, y, block, rotationIndex, rotation, randomLetter, color };
  };


  changeTetromino() {
    this.activeTetromino = this.nextTetromino;
    this.nextTetromino = this.createTetromino();

    console.log('active tetromino:', this.activeTetromino.rotationIndex,  this.activeTetromino.randomLetter, 'in', this.activeTetromino.color);
    // console.log('active tetromino:', this.activeTetromino.randomLetter, 'in', this.activeTetromino.color);
  };

  //движ влево <-
  moveLeft() {
    if (this.chechOutPosition(this.activeTetromino.x - 1, this.activeTetromino.y)) {
      this.activeTetromino.x -= 1;
    }
  };
  
  //движ вправо ->
  moveRight() {
    if (this.chechOutPosition(this.activeTetromino.x + 1, this.activeTetromino.y)) {
      this.activeTetromino.x += 1;
    }
  };
  
  //ускорение и движ вниз ||
  moveDown = () => {
    if (this.chechOutPosition(this.activeTetromino.x, this.activeTetromino.y + 1)) {
      //* если есть куда двигать вниз
      this.activeTetromino.y += 1;
    } else {
      //* если не куда двигать вниз останавливаемся
      this.stopMove();
    }
  };

  //вращение как у макса вращение по индексам
  rotateTetromino = () => {
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
  };
  
  //вращение блока по часовой стрелке
  enterRotateTetromino = () => {
    console.log('Enter Rotate');
    let a = this.activeTetromino.block;
    this.activeTetromino.rotationIndex = this.activeTetromino.rotationIndex < 3 ? this.activeTetromino.rotationIndex + 1 : 0;
    const nextBlock = [
      [ a[2][0],a[1][0],a[0][0] ],
      [ a[2][1],a[1][1],a[0][1] ],
      [ a[2][2],a[1][2],a[0][2] ],
    ];
    if ( this.checkOutRotate(this.activeTetromino.x, this.activeTetromino.y, nextBlock) ) {
      // *копирование 
      this.activeTetromino.block = JSON.parse(JSON.stringify(nextBlock));
    }
  };

  rotateRight90 = (matrix = this.activeTetromino.block) => {
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
    this.activeTetromino.block = result;
    return result;
  };

  rotateLeft90 = (matrix = this.activeTetromino.block) => {
    //* аналогично вращение против час стрелки
    let result = [ [], [], [] ];
    console.log('result: ', result);
    let len = matrix.length;
    for (let r = 0; r < len; r++) {
      for (let c = len-1; c >= 0; c--) {
        result[len-1 - c].push(matrix[r][c]);
        console.log(result);
      }
    }
    this.activeTetromino.block = result;
    return result;
  };

  //возвращает значение нового активного поля с изменениями
  // * getterViewArea()
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
  };

  chechOutPosition = (x, y) => {
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
        // *проверка на дно
        if ( !this.area[y+r] ) {
          console.log('ДНО');
          return false;
        }
        // *проверка на стенки
        if ( !this.area[y+r][x+c] ) {
          console.log('СТЕНКА с лева или с права');
          return false;
        }

        if ( this.area[y+r][x+c] !== '0' && tetromino[r][c] !== '0' ) {
          console.log('СТОЛКНОВЕНИЕ');
          return false;
        }
      }
    }

    return true;
  }; //chechOutPosition

  checkOutRotate = (x, y, block) => {
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
  };

  stopMove = () => {
    //деструктуризация
    const {x, y, block} = this.activeTetromino;
    // фиксация упавшей тетрамины вниз
    for (let r = 0; r < block.length; r++) {
      for (let c = 0; c < block[r].length; c++) {
        //пустой элем в тетромине
        if ( block[r][c] !== '0' ) {
          this.area[y+r][x+c] = block[r][c];
        }
      }
    }

    this.changeTetromino();
    this.clearRow();

    window.navigator.vibrate(200); //? Вибрировать 200ms
  };

  /*
  isRowFull(row) {
    const len = row.length;
    for (let c = 0; c < len; c++) {
      let elem = row[c];
      if (elem == '0') {
        return false;
      }
    };
    console.log('row', row, 'is full');
    return true;
  }

  clearRow() {
    console.log('area before:\n', this.area);
    for (let i = ROWS - 1; i >= 0; i--) {
      let row = this.area[i];
      if ( this.isRowFull(row) ) {
        console.log('row i', i, 'is full');
        console.log('area: ', this.area);
        this.area.splice(i, 1);
        const insert = [];
        for (let a = 0; a < COLUMNS; a++) {
          insert.push('0');
        }
        // this.area.unshift(['0','0','0','0','0','0','0','0','0','0']);
        this.area.splice(0, 0, insert);
        console.log('after unsh area: ', this.area);
      }
    }
  }
  */
  //* очистака заполненной строки удаление
  clearRow() {
    const deleteRows = []; //массив номеров рядов для стирания
    for (let r = ROWS - 1; r >= 0; r--) {
      // считаем количество блоков для очистки в ряду с нижнего ряда
      let countBlock = 0; // счетчик-флаг
      for (let c = 0; c < COLUMNS; c++) {
        if (this.area[r][c] !== '0') {
          countBlock++;
        } else {
          // break; //?
        }
      }
      //считая с нижнего ряда
      //если ряд пустой то следующие можно не проверять
      if ( !countBlock ) { //? if (countBlock == 0)
        break;
      }

      if (countBlock === COLUMNS) {
        //? deleteRows.push(r);
        //добавляем в начало так как удалять очищать сверху ???
        deleteRows.unshift(r);
      }
    }

    deleteRows.forEach( (r) => {
      this.area.splice(r, 1);   // убираем r строку
      this.area.unshift(Array(COLUMNS).fill('0')); // сразу же добавляем строку сверху в начало матрицы
    });
  };


  // ??? newMove init ???
  newMove = () => {
    //* новая фигура в начальной позиции
    this.activeTetromino = this.createTetromino();
    this.nextTetromino = this.createTetromino();
    // console.log('this.activeTetromino: ', this.activeTetromino);
  };


  resetGame() {
    //* init нач состояние игры
    this.area = initZeroMatrix( ROWS, COLUMNS );
    this.newMove();
    // this.area.forEach( (row, r, arr) => {
    //   row.forEach( (elem, c) => {
    //     arr[r][c] = '0';
    //   });
    // });
    // moveCounter = 0;
  };

};

