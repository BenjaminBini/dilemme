'use strict';

/**
 * Comment service tests
 */
var commentService = require('../../../server/services/comment.service');
var userService = require('../../../server/services/user.service');

module.exports = function() {
  describe('Service: Comment', function() {
    describe('#commentQuestion', function() {
      it('should add a comment to the question', function() {
        var commentText = 'Test comment';
        return commentService.commentQuestion('56323445a65ccd98297256d5', commentText, '56323445a65ccd98297256cb')
          .should.be.fulfilled
          .then(question => question.comments[question.comments.length - 1].text.should.equal(commentText));
      });
      it('should not add a comment if the question does not exist or is not published', function() {
        var commentText = 'Test comment';
        return commentService.commentQuestion('56323445a65ccd98297256d9', commentText, '56323445a65ccd98297256cb')
          .should.be.rejectedWith(Error, 'QUESTION_DOES_NOT_EXIST');
      });
      it('should not add a comment if it is too long', function() {
        var commentText = 'Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment Test comment';
        return commentService.commentQuestion('56323445a65ccd98297256d9', commentText, '56323445a65ccd98297256cb')
          .should.be.rejectedWith(Error, 'TOO_LONG_COMMENT');
      });
    });
    describe('#deleteComment', function() {
      it('should delete a comment', function() {
        return commentService.deleteComment('5632378d8d2528ac0b65edcb', '56337337d2fede881e6176ea')
          .should.be.fulfilled;
      });
      it('should not delete a comment if the id of the question does not exist', function() {
        return commentService.deleteComment('5632378d8d2528ac0b65edcc', '56337337d2fede881e6176ea')
          .should.be.rejectedWith(Error, 'QUESTION_DOES_NOT_EXIST');
      });
      it('should not delete a comment if its id does not exist', function() {
        return commentService.deleteComment('5632378d8d2528ac0b65edcb', '56337337d2fede881e6176ec')
          .should.be.rejectedWith(Error, 'COMMENT_DOES_NOT_EXIST');
      });
    });
    describe('#upvoteComment', function() {
      it('should upvote a comment', function() {
        var user;
        return userService.getUserByUsername('leo')
          .then(leo => user = leo)
          .then(() => commentService.upvoteComment('5632378d8d2528ac0b65edcb', '56337337d2fede881e6176ea', user))
          .should.be.fulfilled;
      });
      it('should not upvote a comment if the user has already upvoted it', function() {
        var user;
        return userService.getUserByUsername('leo')
          .then(leo => user = leo)
          .then(() => commentService.upvoteComment('5632378d8d2528ac0b65edcb', '56337337d2fede881e6176ea', user))
          .then(() => commentService.upvoteComment('5632378d8d2528ac0b65edcb', '56337337d2fede881e6176ea', user))
          .should.be.rejectedWith(Error, 'COMMENT_ALREADY_UPVOTED');
      });
      it('should not upvote a comment if the question does not exist', function() {
        var user;
        return userService.getUserByUsername('leo')
          .then(leo => user = leo)
          .then(() => commentService.upvoteComment('5632378d8d2528ac0b65edcc', '56337337d2fede881e6176ea', user))
          .should.be.rejectedWith(Error, 'QUESTION_DOES_NOT_EXIST');
      });
      it('should not upvote a comment if its id does not exist', function() {
        var user;
        return userService.getUserByUsername('leo')
          .then(leo => user = leo)
          .then(() => commentService.upvoteComment('5632378d8d2528ac0b65edcb', '56337337d2fede881e6176ec', user))
          .should.be.rejectedWith(Error, 'COMMENT_DOES_NOT_EXIST');
      });
    });
  });
};
