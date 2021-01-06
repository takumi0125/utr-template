unshift task runner template
===============================

![unshift task runner](https://github.com/takumi0125/utr-template/blob/master/src/assets/img/ogp.png)


# 概要

ソースディレクトリに配置したソースファイルや画像などを、ディレクトリ構成を保ちつつ、<br>
タスク処理を通して公開ディレクトリに展開するタスクランナーのサンプルです。

タスク除外の接頭辞 (`config.excrusionPrefix`: defaultは"_") <br>
がついているファイル、ディレクトリはタスクの対象外になります。
<br>ただし、jsは例外あり (後述)

プロジェクト設定は設定ファイル (<a href="https://github.com/takumi0125/utr-template/blob/master/dev/config.js" target="_blank">`dev/config.js`</a>) に定義されています。<br>

各タスクはタスク設定ファイル (<a href="https://github.com/takumi0125/utr-template/blob/master/dev/utr/task.js" target="_blank">`dev/utr/task.js`</a>) に定義されています。<br>

<p style="color: #ff0000">※ クロスプラットフォームで動作するように作ったつもりですが、まだMacOSでしか検証できていません。</p>


# インストール
```
mkdir yourProject
cd yourProject
git clone git@github.com:takumi0125/utr-template .
```

Yarnを使用しますので、Yarn (v1.0.0以上)をインストールしてください。

```
npm i -g yarn
yarn install
yarn start
```

# ディレクトリ構成 (一部省略)
```
.
├── dev/ # 開発環境関連のファイルを格納するディレクトリ
│    │
│    ├── utr/             # utr設定関連のファイルを格納するディレクトリ
│    │    │
│    │    ├── lib.js     # task.jsで使用している各種処理
│    │    │
│    │    ├── task.js    # タスク設定ファイル
│    │    │
│    │    ├── utr-cli.js # utrをラップしたCLI
│    │    │
│    │    └── utr.js     # タスクランナー本体
│    │
│    ├── webpack/         # webpack周りの設定ファイル等
│    │
│    ├── config.js        # 各種設定が書かれた設定ファイル
│    │
│    └── meta.js          # pugコンパイル時に読み込んで変数として展開するデータ
│
│
├── htdocs/        # 公開ディレクトリ
│
├── src/           # ソースファイル格納ディレクトリ
│
├── package.json   # package.json
│
└── tsconfig.json  # TypeScript設定ファイル
```


## コマンド

基本的にはYarnを使用してください。npmでも実行はできますが、エラーが出る場合があります (後述)。

### start (またはdev)
開発時は主にこれを使用 (build + watch)
```
yarn start
```
または
```
yarn dev
```

### build
一通り必要なタスクをすべて実行します。
```
yarn build
```
本番ビルドの場合 (NODE_ENV=production) でかつ `config.minify` の各値がtrueの場合、ファイルが圧縮されます。<br>
納品ファイル作成時はこのコマンドを実行します。
```
yarn build:prd
```

### dist
```
yarn build:prd
```
と同等です。

### watch
ファイルの変更を監視し、変更があった場合に必要なタスクを実行します。<br>
また、BrowserSyncによるローカルサーバが立ち上がります。 (http://localhost:50000/)
```
yarn watch
```
本番ビルド (NODE_ENV=production) でかつ `config.minify` の各値がtrueの場合、ファイルが圧縮されます。
```
yarn watch:prd
```

### initProj
`config.globPatterns.initProj` にマッチするファイルを公開ディレクトリにコピーします。<br>
プロジェクトで編集する必要のないディレクトリ群などに使用できます。使用頻度はおそらく低め。

```
yarn initProj
```

### clean
公開ディレクトリ内の `config.globPatterns.clean` にマッチするファイル・ディレクトリを削除します。

```
yarn clean
```

# タスク詳細

package.jsonのscriptsに定義してあるタスクは上記のみですが、実際は以下のタスクが定義されています。

## copy

ソースディレクトリ内の `config.globPatterns.copy` にマッチするファイル・ディレクトリを公開ディレクトリにコピーします。

## html

ソースディレクトリ内のhtmlファイルを公開ディレクトリにコピーします。

* config.minify.html` がtrue (非推奨)の場合は <a href="https://www.npmjs.com/package/html-minifier" target="_blank">html-minifier</a> を使用してminifyしてからコピーします。
* 拡張子は `config.globPatterns.html` でマッチしたものを処理

## pug

ソースディレクトリ内のpugファイルをコンパイルして公開ディレクトリに展開します。

* 本番ビルド (NODE_ENV=production) でかつ `config.minify.html` の各値がtrue (非推奨)の場合、ファイルが圧縮されます。
* 拡張子は `config.globPatterns.pug` でマッチしたものを処理)

## sass

ソースディレクトリ内のcss/sass/scssファイルをコンパイルして公開ディレクトリに展開します。

* <a href="https://www.npmjs.com/package/dart-sass" target="_blank">dart-sass</a> → <a href="https://www.npmjs.com/package/postcss" target="_blank">PostCSS</a> (<a href="https://www.npmjs.com/package/autoprefixer" target="_blank">autoprefixer</a> + <a href="https://www.npmjs.com/package/postcss-sort-media-queries" target="_blank">postcss-sort-media-queries</a>)で処理します。
* 開発ビルド (NODE_ENV=development) の場合、sourcemapが生成されます。
* 本番ビルド (NODE_ENV=production) でかつ `config.minify.css` の各値がtrueの場合、ファイルが圧縮されます。
* 拡張子は `config.globPatterns.sass` でマッチしたものを処理

## js

ソースディレクトリ内の対象ファイルを<a href="https://webpack.js.org/" target="_blank">webpack</a>でコンパイルして公開ディレクトリに展開します。

* js, jsx (react), vueファイルは<a href="https://www.npmjs.com/package/babel-loader" target="_blank">babel-loader</a>を使用します。
* ts, tsxは<a href="https://www.npmjs.com/package/ts-loader" target="_blank">ts-loader</a>を使用してコンパイルし、その後babelでコンパイルします。
* 開発ビルド (NODE_ENV=development) の場合、sourcemapが生成されます。
* 本番ビルド (NODE_ENV=production) でかつ `config.minify.js` の各値がtrueの場合、ファイルが圧縮されます。
* TypeScriptの設定ファイルは `dev/tsconfig.json` です。
* webpackの詳しい設定は `dev/webpack/config.js` に記述されています。

### webpackのentry

前述のとおり、 基本的にはタスク除外の接頭辞 (`config.excrusionPrefix`) がついていないものがコンパイル対象です。

* `src/assets/js/index.js` … コンパイル対象
* `src/assets/js/_module/Header.js` … コンパイル対象外 (他のjsファイルからimportされる想定)

ただし、`entry.js`、`init.js` というファイル名の場合はタスク除外の接頭辞 (`config.excrusionPrefix`)がついたディレクトリに格納されていてもコンパイル対象にあたり、親ディレクトリの名前で展開されます。(このファイル名は `config.globPatterns.js2` で定義)

例)<br>
`src/assets/js/_index/init.js`<br>
↓<br>
`htdocs/assets/js/index.js` <br>
として出力されます。

### splitChunks

2回以上読み込まれているモジュールは webpack の splitChunks 機能を使用し、<br>
共通ファイルとして出力されます。<br>
設定は `dev/config.js` の splitChunksCommon に記述されています。

デフォルトの設定は以下のようになっており<br>
nameはパスを含めたファイル名、
includesは切り出すモジュールのディレクトリ名の配列です。

```
{
  name: `${ASSETS_DIR_NAME}/js/common`,
  includes: [
    '/node_modules/',
    `${ASSETS_DIR_NAME}/js/_modules`
  ]
}
```


## build

前述の通り、一通り必要なタスクをすべて実行します。

* cleanタスク実行後、html, pug, sass, jsタスクを並列実行します。
* html, pug, sass, jsタスクのminify, sourcemap設定は各タスク同様、実行モード (NODE_ENV=development | production)に依存します。
* yarn build:prd` で本番ビルド実行 (納品ファイル作成時はこのコマンドを実行します。)

## dist
```
yarn build:prd
```
と同等のコマンドです。

## watch

前述の通り、ファイルの変更を監視し、変更があった場合に必要なタスクを実行します。<br>
また、BrowserSyncによるローカルサーバが立ち上がります。 (http://localhost:50000/)

* copy, html, pug, sassタスクの対象ファイルを <a href="https://www.npmjs.com/package/gaze" target="_blank">gaze</a> で監視し、変更があったファイルのみにタスクを実行します。
* pug, sassは、タスク除外の接頭辞 (`config.excrusionPrefix`)がついたディレクトリ、ファイルも監視し依存関係を取得して適切なファイルにタスクを実行します。
* pugは <a href="https://www.npmjs.com/package/pug-inheritance" target="_blank">pug-inheritance</a>、sassは <a href="https://www.npmjs.com/package/sass-graph" target="_blank">sass-graph</a> を利用して依存関係を取得します。
* jsはwebpack.watchで監視 (変更があった場合に自動でコンパイルが走ります)。webpack.watchは依存関係を考慮し適切なファイルをコンパイルします。
* BrowerSyncのoptionは `config.browserSyncOptions` に定義されています。

### HMR

完全ではないですが、HMRも対応しています。<br>
`dev/config.js` の hmr を true に設定すると、<br>
.vue の拡張子のファイルが更新されると、ホットリロードされます。<br>
Reactで使用したい場合は、コード内で然るべき対応を取ります。 (module.hot)

ただし、その他の .js や .ts ファイルが更新されてもリロードされないので、<br>
逐次リロードしてください。


## start (またはdev)

前述では build + watchとしていますが、webpackではwatchを実行するとビルドが走る仕様のため、以下のようなタスク構成となっています。

* cleanタスク実行後、html, pug, sass並列実行します。その後、watchタスクを実行します。
* clean後にjsタスクを実行しないのは、webpack.watch実行時にビルドが実行されるためです。
* html, pug, sass, jsタスクのminify, sourcemap設定は各タスク同様、実行モード (NODE_ENV=development | production)に依存します。
* yarn watch:prd` で本番ビルドでwatchできます。


## selective dependency resolutions

Yarnでは依存パッケージのバージョンを階層ごとに細かく指定できる機能があり、<br>
pug-inheritanceが依存するpug-dependencyが依存するpug-lexerのバージョンを指定してインストールします。<br>
packege.json > resolutionsに対象のpug-lexerのバージョンを指定する記述を追加しています。

※ ただしこれも動作を必ず保証するものではなく、応急処置です。

```
"resolutions": {
  "pug-inheritance/pug-dependency/pug-lexer": "3.1.0"
},
```
