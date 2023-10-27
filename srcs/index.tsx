import ReactDOM from 'react-dom';
import React from 'react';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

import startGame from './multiplayer_game';
import startBotGame from "./boot_game";

const mainButton: HTMLElement = document.getElementById("online-game") as HTMLElement;
const secondaryButton: HTMLElement = document.getElementById("bot-game") as HTMLElement;

mainButton.addEventListener("click", startGame);
secondaryButton.addEventListener("click", startBotGame);
