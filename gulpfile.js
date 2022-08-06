const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const tsProject = ts.createProject('tsconfig.json');

gulp.task(
  'default',
  gulp.series(
    function () {
      return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest('build'));
    },
    function () {
      return gulp
        .src('./build/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./lib'));
    },
  ),
);
