var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var jade = require('gulp-jade');

var DIST_DIR = './public/dist';
var JS_DIR = DIST_DIR + '/js';
var CSS_DIR = DIST_DIR + '/css';
var VIEW_DIR = DIST_DIR + '/views';
var DIRECTIVES_DIR = DIST_DIR + '/directives-views';

gulp.task('default', function () {
  gulp.start('build');
});

gulp.task('build', function () {
  gulp.start('build-client');
});

gulp.task('build-client', function () {
  gulp.start('clean-client-dist');
  gulp.start('build-client-js');
  gulp.start('build-client-css');
  gulp.start('build-client-views');
});

gulp.task('clean-client-dist', function () {
  return gulp.src(DIST_DIR)
    .pipe(clean());
});

gulp.task('build-client-js', ['clean-client-dist'], function () {
  gulp.src(['./public/vendor/jquery/dist/jquery.min.js',
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
            './public/app/directives/tags-input/tagsInput.js',
            './public/app/directives/answer-button/answerButton.js',
            './public/app/directives/loading-spinner/loadingSpinner.js',
            './public/app/filters/commentFilters.js',
            './public/app/filters/questionFilters.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('dilemme.js'))
    .pipe(gulp.dest(JS_DIR))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(JS_DIR));
});

gulp.task('build-client-css', ['clean-client-dist'], function () {
  gulp.src(['./public/css/socicon.css',
            './public/vendor/ngDialog/css/ngDialog.min.css',
            './public/vendor/ngDialog/css/ngDialog-theme-default.min.css',
            './public/vendor/angular-ui-select/dist/select.css',
            './public/vendor/odometer/themes/odometer-theme-minimal.css',
            './public/vendor/toastr/toastr.css',
            './public/vendor/angular-chart.js/dist/angular-chart.css',
            './public/vendor/angular-hotkeys/build/angular-hotkeys.min.css',
            './public/css/site.css',
            './public/css/mobile.css'])
    .pipe(sourcemaps.init())
    .pipe(concat('dilemme.css'))
    .pipe(gulp.dest(CSS_DIR))
    .pipe(minify())
    .pipe(rename({extname: '.min.css'}))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(CSS_DIR));
});

gulp.task('build-client-views', ['clean-client-dist'], function () {
  gulp.src(['./public/app/views/**/*.jade'])
    .pipe(jade())
    .pipe(gulp.dest(VIEW_DIR));
  gulp.src(['./public/app/directives/**/*.jade'])
    .pipe(jade())
    .pipe(gulp.dest(DIRECTIVES_DIR));
});