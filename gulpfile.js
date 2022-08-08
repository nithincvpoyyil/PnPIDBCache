const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');

const tsc = require('gulp-typescript');
const merge = require('merge-stream');

gulp.task(
  'default',
  gulp.series(
    function () {
      var tsProject = tsc.createProject('tsconfig.json');
      var tsResult = gulp.src(['src/**/*.ts']).pipe(tsProject());
      return merge(tsResult, tsResult.js).pipe(gulp.dest('./lib'));
    },
    function () {
      return gulp.src('./lib/**/*.js').pipe(terser()).pipe(gulp.dest('./lib'));
    },
  ),
);
