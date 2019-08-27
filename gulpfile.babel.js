"use strict"

import gulp from 'gulp'
import sass from 'gulp-sass' //scssコンパイル
import autoprefixer from "gulp-autoprefixer"//べンダープレフィックス
import sassGlob from "gulp-sass-glob"//import文を短くまとめる
import cleanCSS from 'gulp-clean-css'//cssフォーマッタ
import notify from 'gulp-notify' //エラーを通知
import plumber from 'gulp-plumber' //watch中にエラー防止
import sourcemaps from 'gulp-sourcemaps'//ソースマップ
import  ejs from "gulp-ejs" //EJS
import rename from 'gulp-rename'//リネーム
import replace from "gulp-replace"//置換
import browserSync from "browser-sync"//自動リロード
import del from 'del'//削除

// paths
const paths = {
  src: 'src',
  dist: 'dist'
}

//scssコンパイル
gulp.task("sass", () => {
    return gulp.src(paths.src + "/scss/**/*.scss")
      .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
      .pipe(sourcemaps.init())
      .pipe(sassGlob())
      .pipe(sass())
      .pipe(autoprefixer({
        grid: true
      }))
      .pipe(cleanCSS({format: 'beautify'}))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(paths.dist + "/css"))
      .pipe(notify({
        title: 'Sassをコンパイルしました。',
        message: new Date(),
        sound: 'Tink',
    }))
})

//EJS
gulp.task("ejs", () => {
    return gulp.src([paths.src + "/ejs/**/*.ejs", "!" + paths.src + "/ejs/**/_*.ejs"])
    .pipe(ejs({}, {}, {ext:'.html'}))
    .pipe(rename({ extname: ".html" }))
    .pipe(replace(/[\s\S]*?(<!DOCTYPE)/, "$1"))
    .pipe(gulp.dest(paths.dist))
    .pipe(notify({
      title: 'EJSをコンパイルしました。',
      message: new Date(),
      sound: 'Tink',
  }))
})

// server
gulp.task('browser-sync', () => {
    return browserSync.init({
        server: {
            baseDir: paths.dist
        },
        port: 4000,
        reloadOnRestart: true
    })
})

// reload
gulp.task("reload", done => {
  browserSync.reload()
  done()
})

// clean
gulp.task('clean', done => {
  del(paths.dist + '/**/*');
  done();
});

// watch
gulp.task("watch", done => {
  gulp.watch(paths.src + "/scss/**/*.scss", gulp.series('sass', 'ejs', 'reload'))
  gulp.watch(paths.src + "/ejs/**/*.ejs", gulp.series('ejs', 'reload'))
  done()
})

// gulp
gulp.task('default',
  gulp.parallel('watch', 'browser-sync')
)

// build
gulp.task('build',
    gulp.series('clean',
        gulp.series('sass',
            gulp.series('ejs',)))
)