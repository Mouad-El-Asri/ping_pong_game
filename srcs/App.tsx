import { FC } from "react";

const App: FC = () => {
    return (
        <div>
            <canvas
                className="bg-pale-blue absolute m-auto inset-0 rounded-canvas max-w-full max-h-full w-auto"
                id="canvas"
            ></canvas>
            <p id="message"></p>
            <div>
                <button className="btn" id="online-game">
                    Play Online
                </button>
                <button className="btn" id="bot-game">
                    Play vs Bot
                </button>
            </div>
        </div>
    );
};

export default App;
