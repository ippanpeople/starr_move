// タイルの実際のpxでの大きさ
// なので今回の場合は48pxとなる
// 以下理由説明
// 今回の場合だと、12x12を１タイルの大きさとして決めたので、pxとしては12pxになるのが通りだが、
// mapImageの書き出しを400%（4倍）で行っているため、必然的に実際web上にrenderした際には48pxの大きさになる
// なので今回は48pxという大きさになっている

export const TILE_WIDTH = 48;
export const TILE_HEIGHT = 48;

// 衝突判定になるタイルの数字
// src/data/collision.ts
// src/assets/map/json/2d-game-map.jsonのline 345ぐらいを参照
export const COLLISION_TILE = 1025;
