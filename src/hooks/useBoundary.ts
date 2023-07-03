import { useState } from "react";
import { TILE_HEIGHT, TILE_WIDTH } from "../constants/tile";
import { useCanvasContext } from "../store/canvasContextState";
import { createBoundary } from "../util/createBoundary";

export const useBoundary = () => {
	const { canvasContext } = useCanvasContext();
	const createdBoundary = createBoundary();

	const [boundaries, setBoundaries] = useState(createdBoundary);

	const drawBoundary = () => {
		if (canvasContext != null) {
			boundaries.map((boundary) => {
				canvasContext.fillStyle = "red";
				canvasContext.fillRect(boundary.position.x, boundary.position.y, TILE_WIDTH, TILE_HEIGHT);
			});
		}
	};

	return { boundaries, setBoundaries, drawBoundary };
};
