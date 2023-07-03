import { useEffect, useRef, useState } from "react";
import zoomedGameMapImage from "./assets/map/2d-game-map-zoomed.png";
import playerDownImage from "./assets/character/playerDown.png";
import { mapImage, playerImage } from "./constants/images";
import { initialMapPos } from "./constants/position";
import { useCanvasContext } from "./store/canvasContextState";
import { useGameAnimate } from "./hooks/useGameAnimate";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants/canvas";

function App() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { canvasContext, setCanvasContext } = useCanvasContext();
	const [isLoadedAssets, setIsLoadedAssets] = useState<boolean>(false);

	// init: set canvas context
	useEffect(() => {
		if (canvasRef.current != null) {
			setCanvasContext(canvasRef.current.getContext("2d"));
		}
	}, []);

	// load map
	useEffect(() => {
		// check canvasContext values to get canvas context properly
		if (canvasContext != null) {
			// write canvas functions to this scope
			canvasContext.fillStyle = "white";
			canvasContext.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

			// get images
			mapImage.src = zoomedGameMapImage;

			playerImage.src = playerDownImage;

			// to draw image to canvas, need to check image is loaded
			mapImage.onload = () => {
				canvasContext.drawImage(mapImage, initialMapPos.x, initialMapPos.y);
				canvasContext.drawImage(
					playerImage,
					0,
					0,
					playerImage.width / 4, // cropping
					playerImage.height,
					CANVAS_WIDTH / 2 - playerImage.width / 4 / 2,
					CANVAS_HEIGHT / 2 - playerImage.height / 2,
					playerImage.width / 4,
					playerImage.height
				);
				setIsLoadedAssets(true);
			};
		}
	}, [canvasContext]);

	useGameAnimate();

	return <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>;
}

export default App;
