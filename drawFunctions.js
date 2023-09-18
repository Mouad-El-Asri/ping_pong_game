const canvas = document.getElementById("canvas");
canvas.width = 1088;
canvas.height = 644;
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

function drawRect(x, y, w, h, color)
{
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, r, color)
{
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2, false);
	ctx.closePath();
	ctx.fill();
}

function drawLine(startX, startY, endX, endY, color)
{
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
	ctx.closePath();
	ctx.stroke();
}

function drawScore(text, x, y, color)
{
	ctx.fillStyle = color;
	ctx.font = "40px Helvetica";

	const textWidth = ctx.measureText(text).width;

    const textX = canvasWidth / 2 - textWidth / 2 + x;

	ctx.fillText(text, textX, y);
}

function drawText(text, color)
{
	ctx.fillStyle = color;
	ctx.font = "500 50px Arial";

	const textWidth = ctx.measureText(text).width;

    const textX = canvasWidth / 2 - textWidth / 2;

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

