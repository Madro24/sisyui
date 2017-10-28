var gulp = require('gulp')
    sass = require('gulp-ruby-sass') 
    notify = require("gulp-notify") 
    bower = require('gulp-bower');
    browserSync = require('browser-sync').create()
    useref = require('gulp-useref')
    uglify = require('gulp-uglify')
    gulpIf = require('gulp-if');

var config = {
         sassPath: './app/scss/**/*.scss',
         bowerDir: './bower_components',
        sassDestPath: './app/css'
    }

gulp.task('bower', function() { 
    return bower()
         .pipe(gulp.dest(config.bowerDir))
});

gulp.task('sass', function() { 
    return sass([config.sassPath],
        {
             style: 'compressed',
             loadPath: [
                 config.bowerDir + '/bootstrap-sass/assets/stylesheets'
             ]
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
  gulp.watch('app/scss/**/*.scss', ['sass']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
})

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
});

  gulp.task('default', ['bower', 'sass','watch']);
