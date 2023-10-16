import { FC } from "react";

const App: FC = () => {
    return (
		<div>
			<canvas id="canvas"></canvas>
			<p id="message"></p>
			<button id="start-game">Start Game</button>
		</div>
	);
};

export default App;
