angular.module('app').controller('mvStatsController', function ($scope, $rootScope, mvUserService, mvQuestionService) {
  var currentUser = $rootScope.identity.currentUser;

  mvUserService.getStats(currentUser).then(function (stats) {
    $scope.stats = stats;
    $scope.colours = ['#e74c3c', '#3498db'];

    // Colours stats
    $scope.colourLabels = ['Red', 'Blue'];
    $scope.colourValues = [stats.color.red, stats.color.blue];

    // Agree / Don't agree stats
    $scope.agreeLabels = ['Do not agree with the majority', 'Agree with the majority'];
    $scope.agreeValues = [stats.answered - stats.agree, stats.agree];
    $scope.isHipster = stats.agree < (stats.answered - stats.agree);

    // Total    
    mvQuestionService.count().then(function (count) {
      $scope.totalValues = [count - stats.answered, stats.answered];
      $scope.totalLabels = ['Not answered', 'Answered'];
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
});