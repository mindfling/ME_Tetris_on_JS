import { Game } from "./modules/model.js";
import { View } from "./modules/view.js";
import { Controller } from "./modules/controller.js";
// console.log('index');


// * game object
const game = new Game();
const view = new View(document.querySelector('.container'));
const controller = new Controller(game, view);

console.log('game: ', game);
console.log('view: ', view);
console.log('controller: ', controller);

// * нажать Enter для начала игры
controller.init('Enter');
// controller.init('Enter');
