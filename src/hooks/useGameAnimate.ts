import { usePlayerControlKey } from "./usePlayerControlKey";
import { useAnimationFrame } from "./useAnimationFrame";
import { Boundary } from "../types/types";
import { useBoundary } from "./useBoundary";
import { usePlayer } from "./usePlayer";
import { useBackground } from "./useBackground";
import { detectPlayerCollision } from "../util/detectPlayerCollision";

export const useGameAnimate = () => {
	const { playerControlKey } = usePlayerControlKey();
	const { setBackground, drawBackground } = useBackground();
	const { boundaries, setBoundaries, drawBoundary } = useBoundary();
	const { player, setPlayer, drawPlayer } = usePlayer();

	// この辺もっといい感じに描ける方法があるはず・・・（hoge.position.x += 3みたいに描きたいけどReactだとちょっといい方法現段階では思いつかなかった）
	const mapAnimate = () => {
		let moving = true;

		setPlayer((pre) => ({ ...pre, isMove: false }));
		if (playerControlKey.w.pressed) {
			setPlayer((pre) => ({ ...pre, isMove: true }));
			setPlayer((pre) => ({ ...pre, image: pre.sprites.up }));

			for (let i = 0; i < boundaries.length; i++) {
				const boundary = boundaries[i];
				if (detectPlayerCollision(player, { position: { x: boundary.position.x, y: boundary.position.y + 3 } })) {
					moving = false;
					break;
				}
			}

			if (moving) {
				setBackground((pre) => ({ ...pre, position: { ...pre.position, y: pre.position.y + 3 } }));
				setBoundaries((pre) =>
					pre.map((oldBoundary) => {
						const newBoundary: Boundary = { position: { x: oldBoundary.position.x, y: oldBoundary.position.y + 3 } };
						return newBoundary;
					})
				);
			}
		}

		if (playerControlKey.a.pressed) {
			setPlayer((pre) => ({ ...pre, isMove: true }));
			setPlayer((pre) => ({ ...pre, image: pre.sprites.left }));

			for (let i = 0; i < boundaries.length; i++) {
				const boundary = boundaries[i];
				if (detectPlayerCollision(player, { position: { x: boundary.position.x + 3, y: boundary.position.y } })) {
					moving = false;
					break;
				}
			}

			if (moving) {
				setBackground((pre) => ({ ...pre, position: { ...pre.position, x: pre.position.x + 3 } }));
				setBoundaries((pre) =>
					pre.map((oldBoundary) => {
						const newBoundary: Boundary = { position: { x: oldBoundary.position.x + 3, y: oldBoundary.position.y } };
						return newBoundary;
					})
				);
			}
		}

		if (playerControlKey.s.pressed) {
			setPlayer((pre) => ({ ...pre, isMove: true }));
			setPlayer((pre) => ({ ...pre, image: pre.sprites.down }));

			for (let i = 0; i < boundaries.length; i++) {
				const boundary = boundaries[i];
				if (detectPlayerCollision(player, { position: { x: boundary.position.x, y: boundary.position.y - 3 } })) {
					moving = false;
					break;
				}
			}

			if (moving) {
				setBackground((pre) => ({ ...pre, position: { ...pre.position, y: pre.position.y - 3 } }));
				setBoundaries((pre) =>
					pre.map((oldBoundary) => {
						const newBoundary: Boundary = { position: { x: oldBoundary.position.x, y: oldBoundary.position.y - 3 } };
						return newBoundary;
					})
				);
			}
		}

		if (playerControlKey.d.pressed) {
			setPlayer((pre) => ({ ...pre, isMove: true }));
			setPlayer((pre) => ({ ...pre, image: pre.sprites.right }));

			for (let i = 0; i < boundaries.length; i++) {
				const boundary = boundaries[i];
				if (detectPlayerCollision(player, { position: { x: boundary.position.x - 3, y: boundary.position.y } })) {
					console.log(player.position.x, boundary.position.x);

					moving = false;
					break;
				}
			}

			if (moving) {
				setBackground((pre) => ({ ...pre, position: { ...pre.position, x: pre.position.x - 3 } }));
				setBoundaries((pre) =>
					pre.map((oldBoundary) => {
						const newBoundary: Boundary = { position: { x: oldBoundary.position.x - 3, y: oldBoundary.position.y } };
						return newBoundary;
					})
				);
			}
		}
	};

	const runAnimate = () => {
		drawBoundary();
		drawBackground();
		drawPlayer();
		mapAnimate();
	};

	useAnimationFrame(runAnimate);
};
