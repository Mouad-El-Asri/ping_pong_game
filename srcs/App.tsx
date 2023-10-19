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
                className="relative text-bluish-purple inset-0 text-2xl font-roboto font-light"
                id="message"
            ></p>
            <div>
                <button
                    className="btn text-bluish-purple bg-reddish-orange block relative text-4xl border-none rounded-main font-zenkaku text-center font-medium tracking-normal my-2 mx-auto pt-1 px-7 pb-2"
                    id="online-game"
                >
                    Play Online
                </button>
                <button
                    className="btn text-pale-blue bg-bluish-purple block relative text-4xl border-none rounded-main font-zenkaku text-center font-medium tracking-normal my-2 mx-auto pt-1 px-7 pb-2"
                    id="bot-game"
                >
                    Play vs Bot
                </button>
            </div>
        </div>
    );
};

export default App;
