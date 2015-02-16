angular.module('app').directive('answerButton', function () {
	return {
		restrict: 'E',
		templateUrl: '/directives-templates/answer-button/answer-button.jade',
		scope: {
			'text': '=?',
			'answerNumber': '=?',
			'answer': '=?',
			'result': '=?',
			'sendAnswer': '&onClick'
		},
		link: function link(scope, element, attrs) {
			
			var button, circle, d, x, y;
			$('.answer span', element).on('click', function (e) {
				scope.clicked = true;
				button = $(this);
				if (button.find('.circle').length == 0)
					button.prepend('<span class=\'circle\'></span>');
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
				$('.answer span').off('click');
				$('.answers').addClass('answered');
			});
		}
	}
});