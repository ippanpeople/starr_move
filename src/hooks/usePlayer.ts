import { useState } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants/canvas";
import { playerImage } from "../constants/images";
import { useCanvasContext } from "../store/canvasContextState";
import { PlayerSprite } from "../types/types";

export const usePlayer = () => {
	const { canvasContext } = useCanvasContext();

	const [player, setPlayer] = useState<PlayerSprite>({
		position: { x: CANVAS_WIDTH / 2 - playerImage.width / 4 / 2, y: CANVAS_HEIGHT / 2 - playerImage.height / 2 },
		image: playerImage,
		frame: 4,
		width: 192 / 4,
		height: 68,
	});

	const drawPlayer = () => {
		if (canvasContext != null) {
			canvasContext.drawImage(
				player.image,
				0,
				0,
				player.image.width / player.frame, // cropping
				player.image.height,
				player.position.x,
				player.position.y,
				player.image.width / player.frame,
				player.image.height
			);
		}
	};

	return { player, setPlayer, drawPlayer };
};
