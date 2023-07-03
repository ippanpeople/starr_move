type KeyOfPlayerControlKeys = "w" | "a" | "s" | "d";

export type PlayerControlKeys = {
	[K in KeyOfPlayerControlKeys]: {
		pressed: boolean;
	};
};

export type MapPosition = {
	x: number;
	y: number;
};

export type Sprite = {
	position: MapPosition;
	velocity?: string;
	image: HTMLImageElement;
};

export type PlayerSprite = {
	frames: {
		max: number;
		val: number;
		elapsed: number;
	};
	width: number;
	height: number;
	isMove: boolean;
	sprites: {
		up: HTMLImageElement;
		left: HTMLImageElement;
		down: HTMLImageElement;
		right: HTMLImageElement;
	};
} & Sprite;

export type Boundary = {
	position: MapPosition;
};
