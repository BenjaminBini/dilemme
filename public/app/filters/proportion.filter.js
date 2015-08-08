function proportion(mvQuestionService) {
  return function (question, answer) {
    var proportions = mvQuestionService.getProportions(question);
    if (!proportions) {
      return;
    }
    return proportions[answer];
  };
}

proportion.$inject = ['mvQuestionService'];
angular.module('app').filter('proportion', proportion);