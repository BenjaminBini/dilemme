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
var mocha = require('gulp-mocha');
var stylish = require('gulp-jscs-stylish');
var Promise = require('bluebird');
var istanbul = require('gulp-istanbul');
var codacy = require('gulp-codacy');
var inquirer = require('inquirer');
var restore = require('mongodb-restore');
var noop = function() {};
require('dotenv').load();

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
                './public/vendors/ngDialog/css/ngDialog.css',
                './public/vendors/ngDialog/css/ngDialog-theme-default.css',
                './public/vendors/angular-ui-select/dist/select.css',
                './public/vendors/odometer/themes/odometer-theme-minimal.css',
                './public/vendors/toastr/toastr.css',
                './public/vendors/angular-chart.js/dist/angular-chart.css',
                './public/vendors/angular-hotkeys/build/angular-hotkeys.css',
                './public/vendors/load-awesome/css/line-scale.css',
                './public/css/*.css'];

/**
 * Views sources
 */
var VIEW_SRC = ['./public/app/**/*.jade'];
var DIRECTIVE_VIEW_SRC = ['./public/app/directives/**/*.jade'];

/**
 * Stylus sources
 */
var STYLUS_SRC = ['./public/styles/*.styl'];

/**
 * Sources to lint
 */
var TO_LINT_SRC = ['./public/app/**/*.js',
                    './server.js',
                    './server/**/*.js',
                    '!./public/**/bootstrap-tagsinput.js'];

/**
 * Server testing sources
 */
var SERVER_TEST_SRC = ['./test/server.test.js'];

/**
 * Set default task to build
 */
gulp.task('default', function() {
  return gulp.start('build');
});

/**
 * Build client
 */
gulp.task('build', function() {
  return gulp.start('build-client');
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
  return gulp.src(JS_SRC)
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
  return gulp.src(CSS_SRC)
    .pipe(autoprefixer())
    .pipe(sourcemaps.init())
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
  gulp.src(DIRECTIVE_VIEW_SRC)
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
  return nodemon({
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
  return nodemon({
    script: 'server.js',
    nodeArgs: ['--debug=3132'],
    watch: './server'
  });
});

/**
 * Lint sources (JSHint and JSCS)
 */
gulp.task('lint', function() {
  return gulp.src(TO_LINT_SRC)
    .pipe(jshint())
    .pipe(jscs())
    .on('error', noop)
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Lanch server code tests
 */
gulp.task('test-server', ['pre-test'], function() {
  return gulp.src(SERVER_TEST_SRC)
    .pipe(mocha())
    .pipe(istanbul.writeReports({
        reporters: ['lcov', 'json', 'text', 'text-summary', 'html']
      })
    );
});

/**
 * Launch tests
 */
gulp.task('test', ['test-server']);

/**
 * Pre-test task
 */
gulp.task('pre-test', function() {
  return gulp.src(['server/**/*.js'])
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

/**
 * Send coverage data to Codacy
 */
gulp.task('codacy', function() {
  return gulp.src(['coverage/lcov.info'])
    .pipe(codacy({
      token: process.env.CODACY_SECRET
    })
  );
});

/**
 * Put sample data in DB
 */
gulp.task('init-db', function() {
  var ask = new Promise(function(resolve) {
    return inquirer.prompt([{type: 'confirm', name: 'confirm', message: 'This will erase all the database and replace them with sample data, are you sure? (y/N)', default: false}], resolve);
  });
  return ask.then(function(confirm) {
    return new Promise(function(resolve) {
      if (confirm) {
        restore({
          uri: process.env.MONGO_URI,
          root: __dirname + '/server/data/sample',
          drop: true,
          metadata: true,
          callback: resolve
        });
      } else {
        return;
      }
    });
  });
});
