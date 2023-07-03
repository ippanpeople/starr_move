import { mapCollision } from "../data/collision";
import { COLLISION_TILE, TILE_HEIGHT, TILE_WIDTH } from "../constants/tile";
import { initialMapPos } from "../constants/position";
import { Boundary } from "../types/types";

// 衝突判定の場所を作成する
export const createBoundary = () => {
	const tiles = [];
	// mapのcollisionを一列づつ(row)に分けている
	// 例：tiledで作成したmapのwidthが70タイル分であれば、70づつ分ける
	for (let i = 0; i < mapCollision.length; i += 70) {
		const slicedArr = mapCollision.slice(i, 70 + i);
		tiles.push(slicedArr);
	}

	const boundaries: Boundary[] = [];

	// 実際のmapのwidth分に分けたtilesを使用し、衝突判定のある座標に書き換える
	tiles.map((row, outerIndex) => {
		row.map((symbol, innerIndex) => {
			if (symbol === COLLISION_TILE) {
				const boundary: Boundary = {
					position: {
						x: innerIndex * TILE_WIDTH + initialMapPos.x,
						y: outerIndex * TILE_HEIGHT + initialMapPos.y,
					},
				};
				boundaries.push(boundary);
			}
		});
	});

	return boundaries;
};
