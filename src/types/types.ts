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
	frame: number;
	width: number;
	height: number;
} & Sprite;

export type Boundary = {
	position: MapPosition;
};
