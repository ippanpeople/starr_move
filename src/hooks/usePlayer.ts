import { useState } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants/canvas";
import { playerDownImage, playerLeftImage, playerRightImage, playerUpImage } from "../constants/images";
import { useCanvasContext } from "../store/canvasContextState";
import { PlayerSprite } from "../types/types";

export const usePlayer = () => {
	const { canvasContext } = useCanvasContext();

	const [player, setPlayer] = useState<PlayerSprite>({
		position: {
			x: CANVAS_WIDTH / 2 - playerDownImage.width / 4 / 2,
			y: CANVAS_HEIGHT / 2 - playerDownImage.height / 2,
		},
		image: playerDownImage,
		frames: { max: 4, val: 0, elapsed: 0 },
		width: 192 / 4,
		height: 68,
		isMove: false,
		sprites: {
			up: playerUpImage,
			left: playerLeftImage,
			down: playerDownImage,
			right: playerRightImage,
		},
	});

	const drawPlayer = () => {
		if (canvasContext != null) {
			canvasContext.drawImage(
				player.image,
				player.width * player.frames.val,
				0,
				player.image.width / player.frames.max, // cropping
				player.image.height,
				player.position.x,
				player.position.y,
				player.image.width / player.frames.max,
				player.image.height
			);

			if (!player.isMove) {
				setPlayer((pre) => ({ ...pre, frames: { ...pre.frames, val: 0 } }));
				return;
			}

			setPlayer((pre) => ({ ...pre, frames: { ...pre.frames, elapsed: pre.frames.elapsed + 1 } }));

			if (player.frames.elapsed % 10 === 0) {
				console.log(player.frames.val);

				if (player.frames.val < player.frames.max - 1) {
					setPlayer((pre) => ({ ...pre, frames: { ...pre.frames, val: pre.frames.val + 1 } }));
				} else {
					setPlayer((pre) => ({ ...pre, frames: { ...pre.frames, val: 0 } }));
				}
			}
		}
	};

	return { player, setPlayer, drawPlayer };
};
