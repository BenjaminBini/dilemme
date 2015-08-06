var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require("gulp-uglify");
var minify = require('gulp-minify-css');
var rename = require("gulp-rename");
var sourcemaps = require("gulp-sourcemaps");

gulp.task('default', function () {
  gulp.start('build-client');
});

gulp.task('build-client', function () {
  gulp.start('build-client-js');
  gulp.start('build-client-css');
});

gulp.task('build-client-js', function () {
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
            './public/app/config/routesConfig.js',
            './public/app/config/paginationConfig.js',
            './public/app/config/localStorageConfig.js',
            './public/app/config/translationConfig.js',
            './public/app/config/odometerConfig.js',
            './public/app/controllers/mvMainController.js',
            './public/app/controllers/mvNavBarLoginController.js',
            './public/app/controllers/mvLanguageSwitcherController.js',
            './public/app/controllers/mvModalLoginController.js',
            './public/app/controllers/mvRegisterController.js',
            './public/app/controllers/mvProfileController.js',
            './public/app/controllers/mvStatsController.js',
            './public/app/controllers/mvUserListController.js',
            './public/app/controllers/mvUserDetailController.js',
            './public/app/controllers/mvAnswerController.js',
            './public/app/controllers/mvQuestionController.js',
            './public/app/controllers/mvQuestionRandomController.js',
            './public/app/controllers/mvUnansweredQuestionRandomController.js',
            './public/app/controllers/mvQuestionListController.js',
            './public/app/controllers/mvQuestionDetailController.js',
            './public/app/controllers/mvSuggestionListController.js',
            './public/app/controllers/mvSuggestionDetailController.js',
            './public/app/controllers/mvTagViewController.js',
            './public/app/controllers/mvSuggestQuestionController.js',
            './public/app/controllers/mvBrowseController.js',
            './public/app/controllers/mvMostAnsweredController.js',
            './public/app/controllers/mvMostVotedController.js',
            './public/app/services/mvAuthService.js',
            './public/app/services/mvNotifier.js',
            './public/app/services/mvDialog.js',
            './public/app/services/mvQuestionService.js',
            './public/app/services/mvSuggestionService.js',
            './public/app/services/mvUserService.js',
            './public/app/resources/mvUser.js',
            './public/app/resources/mvQuestion.js',
            './public/app/resources/mvSuggestion.js',
            './public/app/models/mvIdentity.js',
            './public/app/directives/tags-input/tagsInput.js',
            './public/app/directives/answer-button/answerButton.js',
            './public/app/directives/loading-spinner/loadingSpinner.js',
            './public/app/filters/commentFilters.js',
            './public/app/filters/questionFilters.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('dilemme.js'))
    .pipe(gulp.dest('./public/dist/'))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('./public/dist/'));
});

gulp.task('build-client-css', function () {
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
    .pipe(gulp.dest('./public/dist/'))
    .pipe(minify())
    .pipe(rename({extname: '.min.css'}))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('./public/dist/'));
});