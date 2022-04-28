//* MVC

export class Controller {

  constructor(game, view) {
    this.game = game;
    this.view = view;
    this.game.newMove();
    this.gamePaused = true;
  }

  eventPause = event => {
      // console.log('Начало event.key: ', event.key);
      if ( event.key === 'Enter' ) {
        this.view.init();
        this.start();
      }
  }

  // window.addEventListener('keydown', (event) => {
  //   // console.log('Начало event.key: ', event.key);
  //   if ( event.key === 'Enter' || event.key === codeKey ) {
  //     this.view.init();
  //     this.start();
  //   }
  // });

  init( codeKey ) {
    console.log('Нажмите Enter для начала');
    // * вешаем нажатие определенной клавишы для начала игры
    
    window.addEventListener('keydown', this.eventPause, false );
    //todo Pause
  }


  start() {
    // * снимаем 
    window.removeEventListener('keydown', this.eventPause, false);
    console.log('Enter for start()');
    this.view.showArea(this.game.viewArea);
    
    // * запускаем движение вниз интервал 1s
    const timeInterval = 1000; // 1000ms
    setInterval( () => {
      this.game.moveDown();
      this.view.showArea(this.game.viewArea);
    }, timeInterval);
    
    // * вешаем события нажатия клавиш ***
    window.addEventListener('keydown', (event) => {
      const key = event.key;
      switch (key) {
        case 'ArrowLeft':
          this.game.moveLeft();
        break;  
        case 'ArrowRight':
          this.game.moveRight();
        break;  
        case 'ArrowDown':
          this.game.moveDown();
        break;  
        case 'ArrowUp':
          this.game.rotateTetromino();
        break;  
        case 'Escape':
          console.log("перезагрузка игры");
          this.game.resetGame();
        break;  
        
        default:
          console.log(key);
          break;
      };
      this.view.showArea(this.game.viewArea);
    });
  }
    
}

