/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./game/drawFunctions.js":
/*!*******************************!*\
  !*** ./game/drawFunctions.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.drawText = exports.drawScore = exports.drawLine = exports.drawBall = exports.drawRect = exports.canvasHeight = exports.canvasWidth = exports.canvas = void 0;\nconst canvas = document.getElementById(\"canvas\");\nexports.canvas = canvas;\ncanvas.width = 1088;\ncanvas.height = 644;\nconst ctx = canvas.getContext(\"2d\");\nconst canvasWidth = canvas.width;\nexports.canvasWidth = canvasWidth;\nconst canvasHeight = canvas.height;\nexports.canvasHeight = canvasHeight;\nfunction drawRect(x, y, w, h, color) {\n    ctx.fillStyle = color;\n    ctx.fillRect(x, y, w, h);\n}\nexports.drawRect = drawRect;\nfunction drawBall(x, y, r, color) {\n    ctx.fillStyle = color;\n    ctx.beginPath();\n    ctx.arc(x, y, r, 0, Math.PI * 2, false);\n    ctx.closePath();\n    ctx.fill();\n}\nexports.drawBall = drawBall;\nfunction drawLine(startX, startY, endX, endY, color) {\n    ctx.strokeStyle = color;\n    ctx.beginPath();\n    ctx.moveTo(startX, startY);\n    ctx.lineTo(endX, endY);\n    ctx.closePath();\n    ctx.stroke();\n}\nexports.drawLine = drawLine;\nfunction drawScore(text, x, y, color) {\n    ctx.fillStyle = color;\n    ctx.font = \"40px Helvetica\";\n    const textWidth = ctx.measureText(text).width;\n    const textX = canvasWidth / 2 - textWidth / 2 + x;\n    ctx.fillText(text, textX, y);\n}\nexports.drawScore = drawScore;\nfunction drawText(text, color) {\n    ctx.fillStyle = color;\n    ctx.font = \"500 50px Arial\";\n    const textWidth = ctx.measureText(text).width;\n    const textX = canvasWidth / 2 - textWidth / 2;\n    ctx.fillText(text, textX, canvasHeight / 2);\n}\nexports.drawText = drawText;\n\n\n//# sourceURL=webpack://ping_pong_game/./game/drawFunctions.js?");

/***/ }),

/***/ "./game/game.js":
/*!**********************!*\
  !*** ./game/game.js ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst drawFunctions_js_1 = __webpack_require__(/*! ./drawFunctions.js */ \"./game/drawFunctions.js\");\nconst gameObjects_js_1 = __webpack_require__(/*! ./gameObjects.js */ \"./game/gameObjects.js\");\nclass PongGame {\n    constructor() {\n        this.gameOver = false;\n        this.userWon = false;\n        this.compWon = false;\n        this.framePerSec = 50;\n        this.isPaused = false;\n    }\n    pauseGame(duration) {\n        this.isPaused = true;\n        setTimeout(() => {\n            this.isPaused = false;\n        }, duration);\n    }\n    collision(ball, player) {\n        const playerTop = player.y;\n        const playerBottom = player.y + player.h;\n        const playerLeft = player.x;\n        const playerRight = player.x + player.w;\n        const ballTop = ball.y - ball.r;\n        const ballBottom = ball.y + ball.r;\n        const ballLeft = ball.x - ball.r;\n        const ballRight = ball.x + ball.r;\n        return (ballRight > playerLeft &&\n            ballTop < playerBottom &&\n            ballLeft < playerRight &&\n            ballBottom > playerTop);\n    }\n    resetBall() {\n        gameObjects_js_1.ball.x = drawFunctions_js_1.canvasWidth / 2;\n        gameObjects_js_1.ball.y = drawFunctions_js_1.canvasHeight / 2;\n        gameObjects_js_1.ball.velocityX *= -1;\n    }\n    movePaddle(event) {\n        let pos = drawFunctions_js_1.canvas.getBoundingClientRect();\n        gameObjects_js_1.user.y = event.clientY - pos.top - gameObjects_js_1.user.h / 2;\n    }\n    updateScore() {\n        if (gameObjects_js_1.ball.x - gameObjects_js_1.ball.r < 0) {\n            gameObjects_js_1.comp.score++;\n            this.resetBall();\n            this.pauseGame(150);\n        }\n        else if (gameObjects_js_1.ball.x + gameObjects_js_1.ball.r > drawFunctions_js_1.canvasWidth) {\n            gameObjects_js_1.user.score++;\n            this.resetBall();\n            this.pauseGame(150);\n        }\n    }\n    checkGameStatus() {\n        if (gameObjects_js_1.user.score === 2) {\n            this.userWon = true;\n            this.gameOver = true;\n        }\n        else if (gameObjects_js_1.comp.score === 2) {\n            this.compWon = true;\n            this.gameOver = true;\n        }\n    }\n    update() {\n        gameObjects_js_1.ball.x += gameObjects_js_1.ball.velocityX;\n        gameObjects_js_1.ball.y += gameObjects_js_1.ball.velocityY;\n        let computerLevel = 0.1;\n        gameObjects_js_1.comp.y += (gameObjects_js_1.ball.y - (gameObjects_js_1.comp.y + gameObjects_js_1.comp.h / 2)) * computerLevel;\n        if (gameObjects_js_1.ball.y + gameObjects_js_1.ball.r >= drawFunctions_js_1.canvasHeight || gameObjects_js_1.ball.y + gameObjects_js_1.ball.r <= 0) {\n            gameObjects_js_1.ball.velocityY *= -1;\n        }\n        let player = gameObjects_js_1.ball.x < drawFunctions_js_1.canvasWidth / 2 ? gameObjects_js_1.user : gameObjects_js_1.comp;\n        if (this.collision(gameObjects_js_1.ball, player)) {\n            // where the ball hits the player\n            let collidePoint = gameObjects_js_1.ball.y - (player.y + player.h / 2);\n            // normalization\n            collidePoint = collidePoint / (player.h / 2);\n            // calculate the angle in Radian\n            let angleRad = (Math.PI / 4) * collidePoint;\n            let direction = gameObjects_js_1.ball.x < drawFunctions_js_1.canvasWidth / 2 ? 1 : -1;\n            gameObjects_js_1.ball.velocityX = direction * gameObjects_js_1.ball.speed * Math.cos(angleRad);\n            gameObjects_js_1.ball.velocityY = direction * gameObjects_js_1.ball.speed * Math.sin(angleRad);\n            gameObjects_js_1.ball.speed += 0.2;\n        }\n        this.updateScore();\n        this.checkGameStatus();\n    }\n    render() {\n        if (this.gameOver) {\n            (0, drawFunctions_js_1.drawRect)(0, 0, drawFunctions_js_1.canvasWidth, drawFunctions_js_1.canvasHeight, \"#B2C6E4\");\n            (0, drawFunctions_js_1.drawLine)(drawFunctions_js_1.canvasWidth / 2, 0, drawFunctions_js_1.canvasWidth / 2, drawFunctions_js_1.canvasHeight / 2 - 40, gameObjects_js_1.midLine.color);\n            (0, drawFunctions_js_1.drawLine)(drawFunctions_js_1.canvasWidth / 2, drawFunctions_js_1.canvasHeight / 2 + 40, drawFunctions_js_1.canvasWidth / 2, drawFunctions_js_1.canvasHeight, gameObjects_js_1.midLine.color);\n            if (this.userWon) {\n                (0, drawFunctions_js_1.drawText)(\"Game Over, You Win!\", \"#003366\");\n            }\n            else if (this.compWon) {\n                (0, drawFunctions_js_1.drawText)(\"Game Over, You Lose!\", \"#003366\");\n            }\n        }\n        else {\n            (0, drawFunctions_js_1.drawRect)(0, 0, drawFunctions_js_1.canvasWidth, drawFunctions_js_1.canvasHeight, \"#B2C6E4\");\n            (0, drawFunctions_js_1.drawRect)(gameObjects_js_1.user.x, gameObjects_js_1.user.y, gameObjects_js_1.user.w, gameObjects_js_1.user.h, gameObjects_js_1.user.color);\n            (0, drawFunctions_js_1.drawRect)(gameObjects_js_1.comp.x, gameObjects_js_1.comp.y, gameObjects_js_1.comp.w, gameObjects_js_1.comp.h, gameObjects_js_1.comp.color);\n            (0, drawFunctions_js_1.drawLine)(gameObjects_js_1.midLine.startX, gameObjects_js_1.midLine.startY, gameObjects_js_1.midLine.endX, gameObjects_js_1.midLine.endY, gameObjects_js_1.midLine.color);\n            (0, drawFunctions_js_1.drawBall)(gameObjects_js_1.ball.x, gameObjects_js_1.ball.y, gameObjects_js_1.ball.r, gameObjects_js_1.ball.color);\n            (0, drawFunctions_js_1.drawScore)(gameObjects_js_1.user.score.toString(), -50, 70, \"#201E3A\");\n            (0, drawFunctions_js_1.drawScore)(gameObjects_js_1.comp.score.toString(), 50, 70, \"#201E3A\");\n        }\n    }\n    game() {\n        if (!this.isPaused) {\n            this.update();\n        }\n        this.render();\n    }\n    startGame() {\n        drawFunctions_js_1.canvas.addEventListener(\"mousemove\", this.movePaddle);\n        setInterval(() => this.game(), 1000 / this.framePerSec);\n    }\n}\nexports[\"default\"] = PongGame;\n\n\n//# sourceURL=webpack://ping_pong_game/./game/game.js?");

/***/ }),

/***/ "./game/gameObjects.js":
/*!*****************************!*\
  !*** ./game/gameObjects.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ball = exports.midLine = exports.comp = exports.user = void 0;\nconst drawFunctions_js_1 = __webpack_require__(/*! ./drawFunctions.js */ \"./game/drawFunctions.js\");\nconst user = {\n    x: 10,\n    y: drawFunctions_js_1.canvasHeight / 2 - 100 / 2,\n    w: 6,\n    h: 100,\n    color: \"#211F3C\",\n    score: 0,\n};\nexports.user = user;\nconst comp = {\n    x: drawFunctions_js_1.canvasWidth - 20,\n    y: drawFunctions_js_1.canvasHeight / 2 - 100 / 2,\n    w: 6,\n    h: 100,\n    color: \"#211F3C\",\n    score: 0,\n};\nexports.comp = comp;\nconst midLine = {\n    startX: drawFunctions_js_1.canvasWidth / 2,\n    startY: 0,\n    endX: drawFunctions_js_1.canvasWidth / 2,\n    endY: drawFunctions_js_1.canvasHeight,\n    color: \"#6c757d\",\n};\nexports.midLine = midLine;\nconst ball = {\n    x: drawFunctions_js_1.canvasWidth / 2,\n    y: drawFunctions_js_1.canvasHeight / 2,\n    r: 10,\n    speed: 5,\n    velocityX: 5,\n    velocityY: 5,\n    color: \"#1E1B37\",\n};\nexports.ball = ball;\n\n\n//# sourceURL=webpack://ping_pong_game/./game/gameObjects.js?");

/***/ }),

/***/ "./game/main.js":
/*!**********************!*\
  !*** ./game/main.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst game_js_1 = __importDefault(__webpack_require__(/*! ./game.js */ \"./game/game.js\"));\nconst game = new game_js_1.default();\ngame.startGame();\n\n\n//# sourceURL=webpack://ping_pong_game/./game/main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./game/main.js");
/******/ 	
/******/ })()
;