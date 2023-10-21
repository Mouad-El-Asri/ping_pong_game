import React from "react";
import { FC } from "react";

const App: FC = () => {
    return (
        <div>
            <canvas
                className="bg-pale-blue absolute m-auto inset-0 rounded-main max-w-full max-h-full w-auto h-auto"
                id="canvas"
            ></canvas>
            <p
                className="relative text-bluish-purple inset-0 text-2xl font-roboto font-light px-4 text-center"
                id="message"
            ></p>
            <div>
                <button
                    className="btn text-bluish-purple bg-reddish-orange block relative text-4xl border-none rounded-main font-zenkaku text-center font-medium tracking-normal w-full my-2 mx-auto pt-1 px-7 pb-2 cursor-pointer"
                    id="online-game"
                >
                    Play Online
                </button>
                <button
                    className="btn text-pale-blue bg-bluish-purple block relative text-4xl border-none rounded-main font-zenkaku text-center font-medium tracking-normal w-full my-2 mx-auto pt-1 px-7 pb-2 cursor-pointer"
                    id="bot-game"
                >
                    Play vs Bot
                </button>
				<button
                    className="hidden text-white bg-exit-red relative text-4xl border-none rounded-main font-zenkaku text-center font-medium tracking-normal my-2 mx-auto pt-1 px-7 pb-2 cursor-pointer"
                    id="exit-btn"
                >
                    Back Home
                </button>
            </div>
        </div>
    );
};

export default App;
