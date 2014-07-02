# tmlib.flash.js

plugin for flash.

flash で作成したデータを [tmlib.js](http://phi-jp.github.io/tmlib.js/) で使うためのプラグインです.


## Usage

- Flash で色々作る
- fl2tmfl.jsfl を実行
- flash があるところに .tmfl ファイルが出力される
- あとは tmlib.flash.js でゴニョゴニュやる予定


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


