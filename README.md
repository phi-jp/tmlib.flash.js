# tmlib.flash.js

plugin for flash.

flash で作成したデータを [tmlib.js](http://phi-jp.github.io/tmlib.js/) で使うためのプラグインです.


## Usage

### Convert

- Flash で色々作る
- fl2tmfl.jsfl を実行(flash上で jsfl ファイルを開いて実行できます)
- flash があるところに .tmfl ファイルが出力される(sample.fla だったら sample/sample.tmfl)

### Run

- html で tmlib.js と tmlib.flash.js を読み込む
- LoadingScene で .tmfl ファイルを読み込む
- 読み込んだファイルを指定して tm.flash.Element クラスを生成

```js
var elm = tm.flash.Element("sample").addChildTo(this);
```

### Script

アクションスクリプト内で下記のように書くと js を実行できます.

```js

/* Js

alert("hoge");

*/

```

## Rule/Regulation

- レイヤー名が重複すると困るかも
- レイヤー名に日本語を含めないでほしい(できるだけ)
- 変形プロパティを設定しないでほしい(rotation と scale でどうにかなりませんかね?><)


## Problem

- アルファが反映されない(jsflの仕様のせいでアルファ)


## Feature

- アルファも出力できるようにする
- シンボル側の設定も反映する
- コメントで色々対応
- ルールなくす


