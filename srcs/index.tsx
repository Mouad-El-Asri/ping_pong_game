import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

import PongGame from "./game";

const game: PongGame = new PongGame();
game.startGame();
