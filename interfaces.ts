interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  score: number;
}

interface Line {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
}

interface Ball {
  x: number;
  y: number;
  r: number;
  speed: number;
  velocityX: number;
  velocityY: number;
  color: string;
}

export {
    Rect,
	Line,
	Ball
};
