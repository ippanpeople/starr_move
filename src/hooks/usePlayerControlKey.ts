import { useCallback, useEffect, useState } from "react";

type KeyOfPlayerControlKeys = "w" | "a" | "s" | "d";

type PlayerControlKeys = {
	[K in KeyOfPlayerControlKeys]: {
		pressed: boolean;
	};
};

const initialKey: PlayerControlKeys = {
	w: { pressed: false },
	a: { pressed: false },
	s: { pressed: false },
	d: { pressed: false },
};

export const usePlayerControlKey = () => {
	const [playerControlKey, setPlayerControlKey] = useState<PlayerControlKeys>(initialKey);

	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		switch (e.key) {
			case "w":
				setPlayerControlKey((pre) => ({ ...pre, w: { pressed: true } }));
				break;
			case "a":
				setPlayerControlKey((pre) => ({ ...pre, a: { pressed: true } }));
				break;
			case "s":
				setPlayerControlKey((pre) => ({ ...pre, s: { pressed: true } }));
				break;
			case "d":
				setPlayerControlKey((pre) => ({ ...pre, d: { pressed: true } }));
				break;
		}
	}, []);

	const handleKeyUp = useCallback((e: KeyboardEvent) => {
		switch (e.key) {
			case "w":
				setPlayerControlKey((pre) => ({ ...pre, w: { pressed: false } }));
				break;
			case "a":
				setPlayerControlKey((pre) => ({ ...pre, a: { pressed: false } }));
				break;
			case "s":
				setPlayerControlKey((pre) => ({ ...pre, s: { pressed: false } }));
				break;
			case "d":
				setPlayerControlKey((pre) => ({ ...pre, d: { pressed: false } }));
				break;
		}
	}, []);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);

	return { playerControlKey };
};
