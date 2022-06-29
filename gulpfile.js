const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const htmlmin = require("gulp-htmlmin");
const useref = require("gulp-useref");
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const cleanCss = require("gulp-clean-css");
const sass = require("gulp-sass")(require("sass"));
var browserSync = require("browser-sync");
const { src, dest, watch, parallel, series } = require("gulp");

//minify images and copy it to dist folder
function imgMinify() {
  return gulp
    .src("project/images/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/images"));
}
exports.img = imgMinify;
//creating dist folder and copy html files to it , and change assets path
function minifyHTML() {
  return src("./project/index.html")
    .pipe(useref())
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest("dist"));
}
exports.html = minifyHTML;
//minify js files and copy it to dist folder
function jsMinify() {
  return src("project/js/**/*.js", { sourcemaps: true })
    .pipe(concat("main.min.js"))
    .pipe(terser())
    .pipe(dest("dist/js", { sourcemaps: "." }));
}
exports.js = jsMinify;
//minify css files and copy it to dist folder
function cssMinify() {
  return src("project/css/**/*.css")
    .pipe(concat("all.min.css"))
    .pipe(cleanCss())
    .pipe(dest("dist/css"));
}
exports.css = cssMinify;
function sassMinify() {
  return src(["project/sass/**/*.scss", "project/css/**/*.css"], {
    sourcemaps: true,
  })
    .pipe(sass())
    .pipe(concat("all.min.css"))
    .pipe(cleanCss())
    .pipe(dest("dist/css", { sourcemaps: "." }));
}
function serve(cb) {
  browserSync({
    server: {
      baseDir: "dist/",
    },
  });
  cb();
}
function reloadTask(done) {
  browserSync.reload();
  done();
}
//watch task
function watchTask() {
  watch("project/*.html", series(minifyHTML, reloadTask));
  watch("project/js/**/*.js", series(jsMinify, reloadTask));
  watch(
    ["project/css/**/*.css", "project/sass/**/*.scss"],
    series(sassMinify, reloadTask)
  );
}
exports.default = series(
  parallel(imgMinify, jsMinify, sassMinify, minifyHTML),
  serve,
  watchTask
);
