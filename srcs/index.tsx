import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

import startGame from './game';

const button: HTMLElement = document.getElementById("start-game") as HTMLElement;

button.addEventListener("click", startGame);
