"use strict";

//require
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require("gulp-autoprefixer");
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const watch = require('gulp-watch');

gulp.task("sass", () => {
    return gulp.src(`../css/**/*.scss`)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(autoprefixer({browsers: ['last 6 versions']}))
        .pipe(gulp.dest(`../`))
});

// watchタスクを定義
gulp.task('watch', function() {
    // 監視するファイルと、実行したいタスク名を指定
    gulp.watch(`../css/**/*.scss`, gulp.series('sass'));
});

gulp.task('default', gulp.series('watch'));