# フロント側テスト環境

## 使用フレームワーク・ライブラリ

- Vite
- TypeScript
- React.js
- Recoil

### 使うかも

- UI ライブラリ候補：Mantine Ui or Chakra ui or shadcn or tailwindcss x tailwind variant
- axios
- next.js やっぱ使った方が楽？
-

## 2D マップ作成ツール

- Tiled

## 現状の問題と分かったこと

- 結構ステート管理が辛い（つらくなる
- class instance で state を管理したいと思った（現在参考にしているコードがそうだから）
- 一応調べてたら出てきたから行けそう？
- https://marsquai.com/745ca65e-e38b-4a8e-8d59-55421be50f7e/f83dca4c-79db-4adf-b007-697c863b82a5/a7e0f136-dc07-42dc-9ce5-8a0278bbe022/
- https://stackoverflow.com/questions/68035988/react-usestate-with-es6-classes
- 正直 useState に class instance 入れてるやつ今まで見たことないからちょっとアレすぎるのと class で管理してもステート更新の辛さはそんなに変わらないんじゃないか
- requestAnimationFrame が react で使用する際にちょっと注意が必要だった
- マップの zoom 機能（全く考えれてない）
- css の scale とかで適当にやったらいける・・・？
- Tiled 使ってマップ作成するのは他の人に任せたい感もあるけど自分でいつでもいじれるようにしときたい気持ちもある

## リアルタイム通信の考えている流れ

- 通信で座標{x: number, y: number}を取得 → それを元に相手のキャラクターを canvas に draw（描画）する
- collision とかは各 client 側で制御出来ているから特に気にする必要もなさそう
- socket の通信でどこまでデータを持たせるか

## Tiled について

- 思ったより簡単に触れる
- ただアセットを作らないと行けない
- https://youtu.be/yP5DKzriqXA
- これの最初の 1 時間ぐらいまで見ればとりあえずやりたいことはできる
- アセットの作り方は youtube リンクにあるアセットを実際に落として大体確認
- もしかしたら Tiled 内か、他のツールでアセット作る用の物があるかも（調べてない）
