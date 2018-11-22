'use strict';

var gulp = require('gulp');
var del = require('del');
var server = require('browser-sync').create();

gulp.task('clean', function () {
  return del('build/**');
});

gulp.task('copy', function () {
  return gulp.src([
    'css/**/*',
    'fonts/**/*',
    'img/**/*',
    '*.ico',
  ], {base: './'})
  .pipe(gulp.dest('build'));
});

gulp.task('html', function () {
  return gulp.src('./*.html')
    .pipe(gulp.dest('build'));
});

gulp.task('js', function () {
  return gulp.src('js/**/*.js')
  .pipe(gulp.dest('build/js'));
});

gulp.task('refresh', function (done) {
  server.reload();
  done();
});

gulp.task('server', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
  gulp.watch('js/**/*.js', gulp.series('js', 'refresh'));
  gulp.watch('./*.html', gulp.series('html', 'refresh'));
});

gulp.task('build', gulp.series('clean', 'copy', 'js', 'html'));
gulp.task('start', gulp.series('build', 'server'));
