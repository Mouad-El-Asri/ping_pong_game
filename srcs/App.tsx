import { FC } from "react";

const App: FC = () => {
    return (
		<div>
			<canvas id="canvas"></canvas>
			<p id="message"></p>
			<div>
				<button className="btn" id="online-game">Play Online</button>
				<button className="btn" id="bot-game">Play vs Bot</button>
			</div>
		</div>
	);
};

export default App;
