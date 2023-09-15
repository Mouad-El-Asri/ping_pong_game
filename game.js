const canvas = document.getElementById("canvas");
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

function drawLine(x0, y0, x1, y1, color)
{
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(x0, y0);
	ctx.lineTo(x1, y1);
	ctx.closePath();
	ctx.stroke();
}

function drawText(text, x, y, color)
{
	ctx.fillStyle = color;
	ctx.font = "40px Helvetica";

	const textWidth = ctx.measureText(text).width;

    const textX = canvasWidth / 2 - textWidth / 2 + x;

	ctx.fillText(text, textX, y);
}

drawRect(10, 282, 12, 80, "#211F3C");
drawRect(1068, 282, 12, 80, "#211F3C");
drawLine(canvasWidth / 2, 0, canvasWidth / 2, canvasHeight, "#6c757d");
drawBall(canvasWidth / 2, canvasHeight / 2, 10, 0, "#1E1B37");

const text = 0;

drawText(text, -50, 70, "#201E3A");
drawText(text, 50, 70, "#201E3A");
