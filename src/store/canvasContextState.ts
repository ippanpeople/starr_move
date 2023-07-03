import { atom, useRecoilState } from "recoil";

// canvasのcontextはあらゆる場所で使用するのでrecoilでglobal state化しておく
// 勿論recoilやreduxなどのglobal state library無しでも実装は可能だが、利便性やコードスプリッティングを考えた時に引数のバケツリレーが必ず起こり面倒なので、recoil推奨
const canvasContextState = atom<CanvasRenderingContext2D | null>({
	key: "canvasContextState",
	default: null,
});

// 直接useRecoilStateをimportして扱うのは面倒なので、ここで扱いやすようにhookを作成しておく
export const useCanvasContext = () => {
	const [canvasContext, setCanvasContext] = useRecoilState(canvasContextState);

	return { canvasContext, setCanvasContext };
};
