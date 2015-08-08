function proportion(QuestionService) {
  return function (question, answer) {
    var proportions = QuestionService.getProportions(question);
    if (!proportions) {
      return;
    }
    return proportions[answer];
  };
}

proportion.$inject = ['QuestionService'];
angular.module('app').filter('proportion', proportion);