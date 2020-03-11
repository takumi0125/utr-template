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

// コンテンツディレクトリ (ドキュメントルート直下の場合は空)
const CONTENTS_DIR = '';

// assetsディレクトリ名
const ASSETS_DIR_NAME = 'assets';  // globパターンとしても使用するので path.resolveはしない

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
const TARGET_BROWSERS = [ 'last 2 versions', 'ie >= 11', 'Android >= 4.4', 'iOS >= 12' ];

const contentsDirPrefix = CONTENTS_DIR? `${CONTENTS_DIR}/`: '';

const config = {
  // プロジェクト名
  projectName: PROJECT_NAME,

  // プロジェクトディレクトリ
  projectDir: PROJECT_DIR,

  // ソースディレクトリ
  srcDir: SRC_DIR,

  // 納品ディレクトリ
  publishDir: PUBLISH_DIR,

  // assetsディレクトリの名前
  assetsDirName: ASSETS_DIR_NAME,

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
    initProj: [
    ],
    clean: [
      '**/**',
    ],
    copy: [
      '**/**',
      '**/.htaccess',
      '**/.htpasswd',
      `!**/${EXCRUSION_PREFIX}*/**`,
      `!**/${EXCRUSION_PREFIX}*`,
      `!**/*.{html,htm,xhtml,pug,css,scss,sass,js,ts,vue,jsx,tsx}`
    ],
    html: [ `${contentsDirPrefix}**/*.{html,htm,xhtml}` ],
    pug: [ `${contentsDirPrefix}**/*.pug` ],
    sass: [ `${contentsDirPrefix}**/*.{css,scss,sass}` ],
    js: [ `${contentsDirPrefix}**/*.{${JS_TRANSPILE_EXTS.join(',')}}` ],
    js2: [ `${contentsDirPrefix}**/${EXCRUSION_PREFIX}*/{entry,init}.{${JS_TRANSPILE_EXTS.join(',')}}` ]
  },

  // ローカルサーバー (BrowserSync)のオプション
  localServerOptions: {
    // proxy: 'localhost:8888',
    server: path.resolve(PUBLISH_DIR),
    open: 'external',
    host: "0.0.0.0",
    port: 50000,
    ui: { port: 50001 },
    startPath:  `${contentsDirPrefix}`,
    browser: 'google chrome',
    https: false,
    logLevel: "silent",
    // httpModule: 'http2',  //使用するにはnpm i -S http2
  },

  hmr: false,  //HMR

  splitChunksVendor: {
    name: `${ASSETS_DIR_NAME}/js/vendor`,
    libs: [
      'gsap',
      `${ASSETS_DIR_NAME}/js/_modules`
    ]
  }
};

// トランスパイルする拡張子の対応テーブルを生成
const transpileExtsTable = {};
HTML_TRANSPILE_EXTS.map(ext=> transpileExtsTable[ext] = 'html');
CSS_TRANSPILE_EXTS.map(ext=> transpileExtsTable[ext] = 'css');
JS_TRANSPILE_EXTS.map(ext=> transpileExtsTable[ext] = 'js');
config.transpileExtsTable = transpileExtsTable;

module.exports = config;