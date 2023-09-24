const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = 1088;
canvas.height = 644;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const canvasWidth : number = canvas.width;
const canvasHeight : number = canvas.height;

function drawRect(x : number, y : number, w : number, h : number, color : string) : void {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
}

function drawBall(x : number, y : number, r : number, color : string) : void {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2, false);
	ctx.closePath();
	ctx.fill();
}

function drawLine(startX : number, startY : number, endX : number, endY : number, color : string) : void {
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
	ctx.closePath();
	ctx.stroke();
}

function drawScore(text : string, x : number, y : number, color : string) : void {
	ctx.fillStyle = color;
	ctx.font = "40px Helvetica";

	const textWidth : number = ctx.measureText(text).width;

    const textX : number = canvasWidth / 2 - textWidth / 2 + x;

	ctx.fillText(text, textX, y);
}

function drawText(text : string, color : string) : void {
	ctx.fillStyle = color;
	ctx.font = "500 50px Arial";

	const textWidth : number = ctx.measureText(text).width;

    const textX : number = canvasWidth / 2 - textWidth / 2;

	ctx.fillText(text, textX, canvasHeight / 2);
}

export {
	canvas,
	canvasWidth,
	canvasHeight,
    drawRect,
	drawBall,
	drawLine,
	drawScore,
	drawText
};
