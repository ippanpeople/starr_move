import { useCallback, useEffect, useRef } from "react";

export const useAnimationFrame = (callback: () => void) => {
	const requestAnimationIdRef = useRef<number | null>(null);

	const frameAnimationLoop = useCallback(() => {
		requestAnimationIdRef.current = requestAnimationFrame(frameAnimationLoop);
		callback();
	}, [callback]);

	useEffect(() => {
		requestAnimationIdRef.current = requestAnimationFrame(frameAnimationLoop);

		return () => {
			if (requestAnimationIdRef.current != null) cancelAnimationFrame(requestAnimationIdRef.current);
		};
	}, [frameAnimationLoop]);
};
