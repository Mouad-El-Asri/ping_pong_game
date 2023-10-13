interface Player {
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

interface RoomPlayer {
    socketId: number;
    playerNumber: number;
    x: number;
    y: number;
    score: number;
}

interface RoomBall {
    x: number;
    y: number;
	r: number;
	speed: number;
	velocityX: number;
	velocityY: number;
}

interface Room {
    id: number;
    roomPlayers: RoomPlayer[];
    roomBall: RoomBall;
}

export { Player, Line, Ball, Room };
