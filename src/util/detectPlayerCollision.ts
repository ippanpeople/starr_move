import { Boundary, PlayerSprite } from "../types/types";
import { TILE_HEIGHT, TILE_WIDTH } from "../constants/tile";

export const detectPlayerCollision = (player: PlayerSprite, boundary: Boundary) => {
	return (
		player.position.x + player.width >= boundary.position.x &&
		player.position.x <= boundary.position.x + TILE_WIDTH &&
		player.position.y <= boundary.position.y + TILE_HEIGHT &&
		player.position.y + player.height >= boundary.position.y
	);
};
