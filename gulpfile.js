'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    revDel = require('rev-del');

var paths = [
  'storeManager.js',
  'entity.js',
  'car.js',
  'hole.js',
  'oil.js',
  'player.js',
  'background.js',
  'text.js',
  'game.js'
];

gulp.task('build', function () {
  return gulp.src(paths)
    .pipe(concat('game.min.js'))
    .pipe(uglify().on('error', function (err) {
      console.log(err);
    }))
    .pipe(gulp.dest('.'))
});

gulp.task('rev', ['build'], function () {
  return gulp.src('game.min.js')
    .pipe(rev())
    .pipe(gulp.dest('.'))
    .pipe(rev.manifest())
    .pipe(revDel({
        dest: '.'
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('revreplace', ['rev'], function () {
  var manifest = gulp.src('rev-manifest.json');

  return gulp.src('index.html')
    .pipe(revReplace({
        manifest: manifest
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['revreplace']);