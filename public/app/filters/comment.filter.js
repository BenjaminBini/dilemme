function authorCssClass() {
  return function(comment, question) {
    var i;
    if (!comment.author || !comment.author.answers) {
      return;
    }
    var answers = comment.author.answers;
    for (i = 0; i < answers.length; i++) {
      if (answers[i].question === question._id) {
        if (answers[i].answer === 0) {
          return 'red';
        }
        return 'blue';
      }
    }
  };
}

authorCssClass.$infject = [];
angular.module('app').filter('authorCssClass', authorCssClass);
