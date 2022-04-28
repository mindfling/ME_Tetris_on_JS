import { ROWS, COLUMNS, SIZE_BLOCK } from './config.js';
import { colors, tetrominoes } from './tetrominoes.js';
import { initZeroMatrix } from './util.js';
// * game.js ** //


class Tetromino {
  x = 0;
  y = 0;
  block = [];
  rotationIndex = 0;
  rotation = [
    [], [], [], []
  ];
  letter = '';
  color = '';
}


// * основной класс игры!!!
export class Game {

  colors = colors;

  // * основное поле стакан для игры
  area = initZeroMatrix( ROWS, COLUMNS );

  activeTetromino = {
    x: 0,
    y: 0,
    block: [],
    rotationIndex: 0, //todo random
    rotation: [],
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
    console.log('createTetromino');

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
    console.log('changeTetromino');
    this.activeTetromino = this.nextTetromino;
    this.nextTetromino = this.createTetromino();

    console.log('active tetromino:', this.activeTetromino.rotationIndex,  this.activeTetromino.randomLetter, 'in', this.activeTetromino.color);
  };

  newMove() {
    console.log('new move');
    //* новая фигура в начальной позиции
    this.activeTetromino = this.createTetromino();
    this.nextTetromino = this.createTetromino();
  };


  //движ влево <-
  moveLeft() {
    // console.log('move left');
    if (this.chechOutPosition(this.activeTetromino.x - 1, this.activeTetromino.y)) {
      this.activeTetromino.x -= 1;
    }
  };
  
  //движ вправо ->
  moveRight() {
    // console.log('move right');
    if (this.chechOutPosition(this.activeTetromino.x + 1, this.activeTetromino.y)) {
      this.activeTetromino.x += 1;
    }
  };
  
  //ускорение и движ вниз ||
  moveDown = () => {
    // console.log('move down');
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
    console.log('rotate');
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
    } else {
      //при возможном столкновении не сохраняем изменения
      console.log('rotation colision');
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
    //  пример деструктуризации копии объектов
    //  const {x, y , block} = this.activeTetromino;
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
    return area;
  };

  chechOutPosition = (x, y) => {
    //* проверка столкновения с другими фигурами
    // * true если нет потенц столкновений
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
          return false;
        }
        if ( this.area[y+r][x+c] !== '0' && nextRotateTetromino[r][c] !== '0' ) {
          // area[y+r][x+c] = tetromino[r][c];
          console.log('СТОЛКНОВЕНИЕ при повороте');
          return false;
        }
      }
    }
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

    navigator.vibrate(100); //? Вибрировать 100ms
  };


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


  resetGame() {
    //* init нач состояние игры
    this.area = initZeroMatrix( ROWS, COLUMNS );
    console.log('reset area: ', area);
    this.newMove();
  };

};

