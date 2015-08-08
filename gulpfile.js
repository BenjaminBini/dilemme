var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var watch = require('gulp-watch');
var nodemon = require('gulp-nodemon');

var DIST_DIR = './public/dist';
var JS_DIR = DIST_DIR + '/js';
var CSS_DIR = DIST_DIR + '/css';
var VIEW_DIR = DIST_DIR + '/views';
var DIRECTIVES_DIR = DIST_DIR + '/directives-views';
var COMPILED_STYLUS_DIR = './public/css/';

var JS_SRC = ['./public/vendor/jquery/dist/jquery.min.js',
              './public/vendor/bootstrap/dist/js/bootstrap.min.js',
              './public/vendor/toastr/toastr.min.js',
              './public/vendor/angular/angular.min.js',
              './public/vendor/angular-resource/angular-resource.min.js',
              './public/vendor/angular-animate/angular-animate.min.js',
              './public/vendor/angular-route/angular-route.min.js',
              './public/vendor/angular-translate/angular-translate.min.js',
              './public/vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
              './public/vendor/angular-local-storage/dist/angular-local-storage.min.js',
              './public/vendor/angular-ui-select/dist/select.js',
              './public/vendor/odometer/odometer.js',
              './public/vendor/angular-odometer-js/dist/angular-odometer.js',
              './public/vendor/Chart.js/Chart.min.js',
              './public/vendor/angular-chart.js/dist/angular-chart.min.js',
              './public/vendor/ngDialog/js/ngDialog.min.js',
              './public/vendor/angular-utils-pagination/dirPagination.js',
              './public/vendor/angular-hotkeys/build/hotkeys.min.js',
              './public/app/app.js',
              './public/app/config/*.js',
              './public/app/controllers/*.js',
              './public/app/services/*',
              './public/app/resources/*.js',
              './public/app/models/*.js',
              './public/app/directives/**/*.js',
              './public/app/filters/**.js'];

var CSS_SRC = ['./public/css/socicon.css',
                './public/vendor/ngDialog/css/ngDialog.min.css',
                './public/vendor/ngDialog/css/ngDialog-theme-default.min.css',
                './public/vendor/angular-ui-select/dist/select.css',
                './public/vendor/odometer/themes/odometer-theme-minimal.css',
                './public/vendor/toastr/toastr.css',
                './public/vendor/angular-chart.js/dist/angular-chart.css',
                './public/vendor/angular-hotkeys/build/angular-hotkeys.min.css',
                './public/css/site.css',
                './public/css/mobile.css'];

var VIEW_SRC = ['./public/app/views/**/*.jade'];

var DIRECTIVE_SRC = ['./public/app/directives/**/*.jade'];

var STYLUS_SRC = ['./public/css/*.styl'];

gulp.task('default', function () {
  gulp.start('build');
});

gulp.task('build', function () {
  gulp.start('build-client');
});

gulp.task('clean-client-dist', function () {
  return gulp.src(DIST_DIR)
    .pipe(clean());
});

gulp.task('build-client', ['clean-client-dist'], function () {
  gulp.start('build-client-js');
  gulp.start('build-client-css');
  gulp.start('build-client-views');
});

gulp.task('build-client-js', function () {
  gulp.src(JS_SRC)
    .pipe(sourcemaps.init())
    .pipe(concat('dilemme.js'))
    .pipe(gulp.dest(JS_DIR))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(JS_DIR));
});

gulp.task('build-client-stylus', function () {
  return gulp.src(STYLUS_SRC)
    .pipe(stylus())
    .pipe(gulp.dest(COMPILED_STYLUS_DIR));
});

gulp.task('build-client-css', ['build-client-stylus'], function () {
  gulp.src(CSS_SRC)
    .pipe(sourcemaps.init())
    .pipe(concat('dilemme.css'))
    .pipe(gulp.dest(CSS_DIR))
    .pipe(minify())
    .pipe(rename({extname: '.min.css'}))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(CSS_DIR));
});

gulp.task('build-client-views', function () {
  gulp.src(VIEW_SRC)
    .pipe(jade())
    .pipe(gulp.dest(VIEW_DIR));
  gulp.src(['./public/app/directives/**/*.jade'])
    .pipe(jade())
    .pipe(gulp.dest(DIRECTIVES_DIR));
});

gulp.task('watch', function () {
  gulp.start('watch-client');
  gulp.start('watch-server');
});

gulp.task('watch-client', function () {
  gulp.watch(JS_SRC, ['build-client-js']);
  gulp.watch(STYLUS_SRC, ['build-client-css']);
  gulp.watch(VIEW_SRC, ['build-client-views']);
});

gulp.task('watch-server', function () {
  nodemon({
    script: 'server.js',
    watch: './server'
  });
});