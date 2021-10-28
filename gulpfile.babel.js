import { src, dest, series, watch } from "gulp";
import del from "del";
import sass from "gulp-sass";
import postCss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import compiler from "node-sass";
import cleanCSS from "gulp-clean-css";
import pug from "gulp-pug";
import pugLinter from "gulp-pug-linter";
import webserver from "gulp-webserver";
import ts from "gulp-typescript";

sass.compiler = compiler;

const paths = {
  ts: {
    src: "src/assets/ts/main.ts",
    dest: "build",
    watch: "src/assets/ts/**/*.ts",
  },
  public: {
    src: "src/assets/public/**/*",
    dest: "build/public",
  },
  css: {
    src: "src/assets/scss/styles.scss",
    dest: "build",
    watch: "src/assets/scss/**/*.scss",
  },
  html: {
    src: "src/views/index.pug",
    dest: "build",
    watch: "src/views/**/*.pug",
  },
  server: {
    src: "build",
  },
};

const clear = () => del("build");

const tsToJs = () =>
  src(paths.ts.src)
    .pipe(
      ts({
        noImplicitAny: true,
        outFile: "main.js",
      })
    )
    .pipe(dest(paths.ts.dest));

const publicResource = () =>
  src(paths.public.src).pipe(dest(paths.public.dest));

const css = () =>
  src(paths.css.src)
    .pipe(sass())
    .pipe(postCss([autoprefixer({ overrideBrowserslist: ["last 1 version"] })]))
    .pipe(cleanCSS())
    .pipe(dest(paths.css.dest));

const html = () =>
  src(paths.html.src)
    .pipe(pugLinter({ reporter: "default" }))
    .pipe(pug())
    .pipe(dest(paths.html.dest));

const watchFiles = () => {
  watch(paths.ts.watch, tsToJs);
  watch(paths.css.watch, css);
  watch(paths.html.watch, html);
};

const server = () =>
  src(paths.server.src).pipe(
    webserver({
      livereload: true,
      port: 4000,
      open: true,
      fallback: "index.html",
    })
  );

const devBundle = series([
  clear,
  tsToJs,
  css,
  html,
  publicResource,
  server,
  watchFiles,
]);

const buildBundle = series([clear, tsToJs, css, html, publicResource]);

export const dev = devBundle;

export const build = buildBundle;
