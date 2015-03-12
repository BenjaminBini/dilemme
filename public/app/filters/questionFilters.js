angular.module('app').filter('proportion', function (mvQuestionService) {
  return function (question, answer) {
    var proportions = mvQuestionService.getProportions(question);
    if (!proportions) {
      return;
    }
    return proportions[answer];
  };
});