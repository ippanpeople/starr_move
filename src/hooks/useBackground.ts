import { useState } from "react";
import { mapImage } from "../constants/images";
import { initialMapPos } from "../constants/position";
import { Sprite } from "../types/types";
import { useCanvasContext } from "../store/canvasContextState";

export const useBackground = () => {
	const { canvasContext } = useCanvasContext();

	const [background, setBackground] = useState<Sprite>({
		position: initialMapPos,
		image: mapImage,
	});

	const drawBackground = () => {
		if (canvasContext != null) {
			canvasContext.drawImage(background.image, background.position.x, background.position.y);
		}
	};

	return { background, setBackground, drawBackground };
};
