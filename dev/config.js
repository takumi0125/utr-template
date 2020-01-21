// ===============================================
//  config
// ===============================================

const path = require('path');

// プロジェクト名
const PROJECT_NAME = 'sample';

// プロジェクトディレクトリ
const PROJECT_DIR = __dirname + '/../';  // globパターンとしても使用するので path.resolveはしない

// ソースディレクトリ
const SRC_DIR = PROJECT_DIR + 'src';

// 出力ディレクトリ
const PUBLISH_DIR = PROJECT_DIR + 'htdocs';

// assetsディレクトリ名
const ASSETS_DIR_NAME = 'assets';

// 画像ディレクトリ名 (glob)
const IMG_DIR_NAME = '{img,image,images}';

// タスク除外用prefix
const EXCRUSION_PREFIX = '_';

// htmlにトランスパイルする拡張子
const HTML_TRANSPILE_EXTS = [ 'pug', 'html' ];

// cssにトランスパイルする拡張子
const CSS_TRANSPILE_EXTS = [ 'css', 'sass', 'scss' ];

// jsにトランスパイルする拡張子
const JS_TRANSPILE_EXTS = [ 'jsx', 'tsx', 'js', 'ts', 'vue' ];

// ターゲットブラウザ
TARGET_BROWSERS = [ 'last 2 versions', 'ie >= 11', 'Android >= 4.4', 'iOS >= 12' ];


const config = {
  // プロジェクト名
  projectName: PROJECT_NAME,

  // ソースディレクトリ
  srcDir: SRC_DIR,

  // 納品ディレクトリ
  publishDir: PUBLISH_DIR,

  // ローカルサーバのデフォルトパス (ドキュメントルートからの絶対パス)
  serverDefaultPath: '',

  // ローカルサーバをhttpsにするかどうか
  https: false,

  // タスクから除外するためのプレフィックス
  excrusionPrefix: EXCRUSION_PREFIX,

  // ターゲットブラウザ
  targetBrowsers: TARGET_BROWSERS,

  // gulpPlugins.autoprefixerのオプション
  autoprefixerOpt: {
    overrideBrowserslist: TARGET_BROWSERS,
    grid: true
  },

  // assetsディレクトリ名
  assetsDirName: ASSETS_DIR_NAME,

  // 画像ディレクトリの名前
  imgDirName: IMG_DIR_NAME,

  // ファイル圧縮
  minify: {
    css: true,  // CSSを圧縮するかどうか
    js: true,  // JSを圧縮するかどうか
    html: false  // HTMLを圧縮するかどうか (trueは非推奨)
  },

  // pugで変数として展開するデータ (title, meta descriptionなど)
  metaDataJson: path.join(__dirname, 'meta.js'),

  // トランスパイルする拡張子
  htmlTranspileExts: HTML_TRANSPILE_EXTS,
  cssTranspileExts: CSS_TRANSPILE_EXTS,
  jsTranspileExts: JS_TRANSPILE_EXTS,

  // 各タスクで使用するglobパターン
  globPatterns: {
    clean: [
      '**/**'
    ],
    copy: [
      '**/**',
      '**/.htaccess',
      '**/.htpasswd',
      `!**/${EXCRUSION_PREFIX}*/**`,
      `!**/${EXCRUSION_PREFIX}*`,
      '!**/*.{html,htm,xhtml,pug,css,scss,sass,js,ts,vue,jsx,tsx}'
    ],
    html: [ '**/*.{html,htm,xhtml}' ],
    pug: [ '**/*.pug' ],
    sass: [ '**/*.{css,scss,sass}' ],
    js: [ `**/*.{${JS_TRANSPILE_EXTS.join(',')}}` ],
    js2: [ `**/${EXCRUSION_PREFIX}*/{entry,init}.{${JS_TRANSPILE_EXTS.join(',')}}` ]
  },

  // ローカルサーバー (BrowserSync)のオプション
  browserSyncOptions: {
    server: path.resolve(PUBLISH_DIR),
    open: 'external',
    host: "0.0.0.0",
    port: 50000,
    startPath:  '',
    browser: 'google chrome',
    https: false,
    // proxy: "localhost:8888",  //MAMPでphpを使用する場合など
    // httpModule: 'http2',  //使用するにはnpm i -S http2
  }
};

// トランスパイルする拡張子の対応テーブルを生成
const transpileExtsTable = {};
HTML_TRANSPILE_EXTS.map(ext=> transpileExtsTable[ext] = 'html');
CSS_TRANSPILE_EXTS.map(ext=> transpileExtsTable[ext] = 'css');
JS_TRANSPILE_EXTS.map(ext=> transpileExtsTable[ext] = 'js');
config.transpileExtsTable = transpileExtsTable;

module.exports = config;