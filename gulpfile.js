var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var noop = function() {};
var stylish = require('gulp-jscs-stylish');

/**
 * Project directories
 */
var DIST_DIR = './public/dist'; // Where the build goes
var JS_DIR = DIST_DIR + '/js'; // Where JS goes
var CSS_DIR = DIST_DIR + '/css'; // Where CSS goes
var VIEW_DIR = DIST_DIR + '/views'; // Where views go
var DIRECTIVES_DIR = DIST_DIR + '/directives-views'; // Where directives go
var COMPILED_STYLUS_DIR = './public/css/'; // And where compiled Stylus files go

/**
 * JS Sources
 */
var JS_SRC = ['./public/vendors/jquery/dist/jquery.min.js',
              './public/vendors/bootstrap/dist/js/bootstrap.min.js',
              './public/vendors/toastr/toastr.min.js',
              './public/vendors/angular/angular.js',
              './public/vendors/angular-resource/angular-resource.js',
              './public/vendors/angular-animate/angular-animate.js',
              './public/vendors/angular-route/angular-route.js',
              './public/vendors/angular-translate/angular-translate.js',
              './public/vendors/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
              './public/vendors/angular-local-storage/dist/angular-local-storage.min.js',
              './public/vendors/angular-ui-select/dist/select.js',
              './public/vendors/odometer/odometer.js',
              './public/vendors/angular-odometer-js/dist/angular-odometer.js',
              './public/vendors/Chart.js/Chart.min.js',
              './public/vendors/angular-chart.js/dist/angular-chart.min.js',
              './public/vendors/ngDialog/js/ngDialog.min.js',
              './public/vendors/angular-utils-pagination/dirPagination.js',
              './public/vendors/angular-hotkeys/build/hotkeys.min.js',
              './public/app/app.js',
              './public/app/config/**/*.js',
              './public/app/filters/**/*.js',
              './public/app/directives/**/*.js',
              './public/app/ui/**/*.js',
              './public/app/questions/**/*.js',
              './public/app/users/**/*.js',
              './public/app/admin/**/*.js'
              ];

/**
 * CSS Sources
 */
var CSS_SRC = ['./public/css/socicon.css',
                './public/vendors/ngDialog/css/ngDialog.min.css',
                './public/vendors/ngDialog/css/ngDialog-theme-default.min.css',
                './public/vendors/angular-ui-select/dist/select.css',
                './public/vendors/odometer/themes/odometer-theme-minimal.css',
                './public/vendors/toastr/toastr.css',
                './public/vendors/angular-chart.js/dist/angular-chart.css',
                './public/vendors/angular-hotkeys/build/angular-hotkeys.min.css',
                './public/css/site.css',
                './public/css/mobile.css'];

/**
 * Views sources
 */
var VIEW_SRC = ['./public/app/**/*.jade'];

/**
 * Stylus sources
 */
var STYLUS_SRC = ['./public/css/*.styl'];

/**
 * Sources to lint
 */
var TO_LINT_SRC = ['./public/app/**/*.js',
                   './server.js',
                   './server/**/*.js',
                  '!./public/**/bootstrap-tagsinput.js'];

/**
 * Set default task to build
 */
gulp.task('default', function() {
  gulp.start('build');
});

/**
 * Build client
 */
gulp.task('build', function() {
  gulp.start('build-client');
});

/**
 * Client client dist directory
 */
gulp.task('clean-client-dist', function() {
  return gulp.src(DIST_DIR)
    .pipe(clean());
});

/**
 * Build JS, CSS and views
 */
gulp.task('build-client', ['clean-client-dist'], function() {
  gulp.start('build-client-js');
  gulp.start('build-client-css');
  gulp.start('build-client-views');
});

/**
 * Build JS
 */
gulp.task('build-client-js', function() {
  gulp.src(JS_SRC)
    .pipe(sourcemaps.init())
    .pipe(concat('dilemme.js'))
    .pipe(gulp.dest(JS_DIR))
    .pipe(uglify({mangle: false}))
    .pipe(rename({extname: '.min.js'}))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(JS_DIR));
});

/**
 * Build Stylus
 */
gulp.task('build-client-stylus', function() {
  return gulp.src(STYLUS_SRC)
    .pipe(stylus())
    .pipe(gulp.dest(COMPILED_STYLUS_DIR));
});

/**
 * Build CSS
 */
gulp.task('build-client-css', ['build-client-stylus'], function() {
  gulp.src(CSS_SRC)
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(concat('dilemme.css'))
    .pipe(gulp.dest(CSS_DIR))
    .pipe(minify())
    .pipe(rename({extname: '.min.css'}))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(CSS_DIR));
});

/**
 * Build views
 */
gulp.task('build-client-views', function() {
  gulp.src(VIEW_SRC)
    .pipe(jade())
    .pipe(gulp.dest(VIEW_DIR));
  gulp.src(['./public/app/directives/**/*.jade'])
    .pipe(jade())
    .pipe(gulp.dest(DIRECTIVES_DIR));
});

/**
 * Launch application and watch for any change
 */
gulp.task('watch', function() {
  gulp.start('watch-client');
  gulp.start('watch-server');
});

/**
 * Rebuild JS, CSS an views sources on any change
 */
gulp.task('watch-client', function() {
  gulp.watch(JS_SRC, ['build-client-js']);
  gulp.watch(STYLUS_SRC, ['build-client-css']);
  gulp.watch(VIEW_SRC, ['build-client-views']);
});

/**
 * Launch application and watch server files for any change
 */
gulp.task('watch-server', function() {
  nodemon({
    script: 'server.js',
    watch: './server'
  });
});

/**
 * Launch application with debug port set to 3132
 * Watch client and server files for any change
 */
gulp.task('debug', function() {
  gulp.start('watch-client');
  nodemon({
    script: 'server.js',
    nodeArgs: ['--debug=3132'],
    watch: './server'
  });
});

/**
 * Lint sources (JSHint and JSCS)
 */
gulp.task('lint', function() {
  gulp.src(TO_LINT_SRC)
    .pipe(jshint())
    .pipe(jscs())
    .on('error', noop)
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'));
});
