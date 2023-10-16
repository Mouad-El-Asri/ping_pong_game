import { FC } from "react";

const App: FC = () => {
    return (
		<div>
			<canvas id="canvas"></canvas>
			<p id="message"></p>
			<button id="start-game">Play Online</button>
		</div>
	);
};

export default App;
