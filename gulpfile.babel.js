import { src, dest, series, watch } from "gulp";
import del from "del";
import bro from "gulp-bro";
import babelify from "babelify";
import sass from "gulp-sass";
import postCss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import compiler from "node-sass";
import cleanCSS from "gulp-clean-css";
import pug from "gulp-pug";
import pugLinter from "gulp-pug-linter";
import webserver from "gulp-webserver";
import rename from "gulp-rename";

sass.compiler = compiler;

const paths = {
  js: {
    src: "src/assets/js/main.js",
    dest: "build",
    watch: "src/assets/js/**/*.js",
  },
  css: {
    src: "src/assets/scss/styles.scss",
    dest: "build",
    watch: "src/assets/scss/**/*.scss",
  },
  html: {
    src: "src/views/screens/*.pug",
    dest: "build",
    watch: "src/views/**/*.pug",
  },
  server: {
    src: "build",
  },
};

const clear = () => del("build");

const js = () =>
  src(paths.js.src)
    .pipe(
      bro({
        transform: [
          babelify.configure({ presets: ["@babel/preset-env"] }),
          ["uglifyify", { global: true }],
        ],
      })
    )
    .pipe(dest(paths.js.dest));

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
  watch(paths.js.watch, js);
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

const devBundle = series([clear, js, css, html, server, watchFiles]);

const buildBundle = series([clear, js, css, html]);

export const dev = devBundle;

export const build = buildBundle;
