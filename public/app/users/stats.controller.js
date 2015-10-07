function StatsController($scope, $rootScope, $translate, UserService, QuestionService) {
  var currentUser = $rootScope.identity.currentUser;

  UserService.getStats(currentUser).then(function(stats) {
    $scope.stats = stats;
    $scope.colours = ['#e74c3c', '#3498db'];

    $scope.colourLabels = ['red', 'blue'];
    // Labels
    $translate(['RED', 'BLUE', 'DO_NOT_AGREE', 'AGREE', 'NOT_ANSWERED', 'ANSWERED']).then(function(translations) {
      $scope.colourLabels = [translations.RED, translations.BLUE];
      $scope.agreeLabels = [translations.DO_NOT_AGREE, translations.AGREE];
      $scope.totalLabels = [translations.NOT_ANSWERED, translations.ANSWERED];
    });

    // Colours stats
    $scope.colourValues = [stats.color.red, stats.color.blue];

    // Agree / Don't agree stats
    $scope.agreeValues = [stats.answered - stats.agree, stats.agree];
    $scope.isHipster = stats.agree < (stats.answered - stats.agree);

    // Total
    QuestionService.count().then(function(count) {
      $scope.totalValues = [count - stats.answered, stats.answered];
    });

    // Tags
    var tagsLabels = [];
    var tagsValues = [];
    var favoriteTag = {
      name: '',
      count: 0
    };
    var i;
    for (i = 0; i < stats.tags.length; i++) {
      if (stats.tags[i].count > favoriteTag.count) {
        favoriteTag = stats.tags[i];
      }
      tagsLabels.push(stats.tags[i].name);
      tagsValues.push(stats.tags[i].count);
    }
    $scope.favoriteTag = favoriteTag;
    $scope.tagsLabels = tagsLabels;
    $scope.tagsSeries = ['Tag'];
    $scope.tagsValues = [tagsValues];
  });
}

StatsController.$inject = ['$scope', '$rootScope', '$translate', 'UserService', 'QuestionService'];
angular.module('app').controller('StatsController', StatsController);
