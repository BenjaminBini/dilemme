angular.module('app').directive('answerButton', function() {
  return {
    restrict: 'E',
    templateUrl: '/directives-templates/answer-button/answer-button',
    scope: {
      'answer': '=?',
      'result': '=?',
      'userAnswer': '=?',
      'answerNumber': '=?',
      'answered': '=?',
      'sendAnswer': '&onClick'
    },
    link: function link(scope, element) {
      // Animate on click
      var button;
      var circle;
      var d;
      var x;
      var y;
      $('.answer', element).on('click', function(e) {
        if (!scope.answered) {
          button = $(this);
          if (button.find('.circle').length === 0) {
            button.prepend('<span class=\'circle\'></span>');
          }
          circle = button.find('.circle');
          circle.removeClass('animate');
          if (!circle.height() && !circle.width()) {
            d = Math.max(button.outerWidth(), button.outerHeight());
            circle.css({
              height: d,
              width: d
            });
          }
          x = e.pageX - (button.offset().left + parseInt(button.css('padding-left'), 10)) - circle.width() / 2;
          y = e.pageY - (button.offset().top + parseInt(button.css('padding-top'), 10)) - circle.height() / 2;
          circle.css({
            top: y + 'px',
            left: x + 'px'
          }).addClass('animate');
          scope.answered = true;
          scope.userAnswer = scope.answerNumber;
        }
      });
    }
  };
});
