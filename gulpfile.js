var gulp = require('gulp')
    sass = require('gulp-ruby-sass') 
    notify = require("gulp-notify") 
    bower = require('gulp-bower');
    browserSync = require('browser-sync').create()
    useref = require('gulp-useref')
    uglify = require('gulp-uglify')
    gulpIf = require('gulp-if')
    cssnano = require('gulp-cssnano')
    del = require('del'),
    runSequence = require('run-sequence');

var config = {
        baseAppDir: 'app'
        htmlPath: './app/**/*.html'
        jsPath: 'app/js/**/*.js'
         sassPath: './app/scss/**/*.scss',
        sassDestPath: './app/css',
         bowerDir: './bower_components',
        destPath: './dist'
    }

var bowerSassPath = [
  config.bowerDir + '/bootstrap-sass/assets/stylesheets'
]

gulp.task('bower', function() { 
    return bower()
         .pipe(gulp.dest(config.bowerDir))
});

gulp.task('sass', function() { 
    return sass([config.sassPath],
        {
             style: 'compressed',
             loadPath: bowerSassPath
         }) 
            .on("error", notify.onError(function (error) {
                 return "Error: " + error.message;
             })) 
         .pipe(gulp.dest(config.sassDestPath))
        .pipe(browserSync.reload({
          stream: true
        }))
});

gulp.task('watch', ['browserSync','sass'], function(){
  gulp.watch(config.sassPath, ['sass']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch(config.htmlPath, browserSync.reload);
  gulp.watch(config.jsPath, browserSync.reload);
})

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: config.baseAppDir
    },
  })
})

gulp.task('useref', function(){
  return gulp.src(config.htmlPath)
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest(config.destPath))
});

gulp.task('clean:dist', function() {
  return del.sync(config.destPath);
})

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'useref'],
    callback
  )
})

gulp.task('default', function (callback) {
  runSequence(['bower','sass','browserSync', 'watch'],
    callback
  )
})
