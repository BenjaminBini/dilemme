angular.module('app').config(function ($translateProvider) {
  var enTranslation = {

    // Navigation
    BROWSE: 'Browse',
    MOST_UPVOTED: 'Most upvoted',
    MOST_UPVOTED_QUESTIONS: 'Most upvoted questions',
    MOST_ANSWERED: 'Most answered',
    MOST_ANSWERED_QUESTIONS: 'Most answered questions',
    SUGGEST_A_QUESTION: 'Suggest a question',
    USERS_ADMIN: 'Users Admin',
    QUESTIONS_ADMIN: 'Questions Admin',
    SUGGESTIONS_ADMIN: 'Suggestions Admin',
    PROFILE: 'Profile',
    STATS: 'Stats',
    SIGN_IN: 'Sign in',
    SIGN_OUT: 'Sign out',
    REGISTER: 'Register',
    BACK_TO_USERS_LIST: 'Back to users list',
    BACK_TO_SUGGESTIONS_LIST: 'Back to suggestions list',

    // Questions
    QUESTIONS: 'Questions',
    QUESTION: 'Question',
    PUBLISHED_QUESTIONS: 'Published questions',
    NO_QUESTION_YET: 'No question yet',
    EDIT_THIS_QUESTION: 'Edit this question',
    NEXT_QUESTION: 'Next question',
    DETAILS: 'Details',
    UPVOTE: 'Upvote',
    UPVOTES: 'Upvotes',
    VOTE: 'Vote',
    VOTES: 'Votes',
    ANSWER: 'Answer',
    ANSWERS: 'Answers',
    NO_ANSWER_YET: 'No answer yet',
    PERMALINK: 'Permalink',
    PUBLICATION_DATE: 'Publication date',
    TAG: 'Tag',
    TAGS: 'Tags',
    TITLE: 'Title',
    DESCRIPTION: 'Description',
    TEXT: 'Text',
    FIRST_CHOICE: 'First choice',
    SECOND_CHOICE: 'Second choice',
    ADD_A_QUESTION: 'Add a question',

    // Suggestions
    SUGGESTION: 'Suggestion',
    SUGGESTIONS: 'Suggestions',
    NO_SUGGESTION_YET: 'No suggestion yet',
    NO_PENDING_SUGGESTION_YET: 'No pending suggestion yet',
    NO_PUBLISHED_QUESTION_YET: 'No published question yet',
    PENDING_SUGGESTIONS: 'Pending suggestions',
    SUGGESTION_DATE: 'Suggestion date',

    // Comments
    UPVOTE_THIS_COMMENT: 'Upvote this comment',
    NO_COMMENT_YET: 'No comment yet',
    ADD_COMMENT: 'Add comment',
    TO_COMMENT : 'To comment',
    COMMENT: 'Comment',
    COMMENTS: 'Comments',
    DELETE_THIS_COMMENT: 'Delete this comment',

    // Users
    USER: 'User',
    USERNAME: 'Username',
    EMAIL: 'Email',
    PASSWORD: 'Password',
    ACCOUNT_DELETED: 'Account deleted',
    ROLES: 'Roles',
    REGISTRATION_DATE: 'Registration date',
    USER_PROFILE: 'User profile',
    OF_THE_USERS: 'Of the users',

    // Vocabulary
    LIKE: 'Like',
    PLEASE: 'Please',
    OR: 'OR',
    YES: 'Yes',
    NOPE: 'Nope',
    THIS: 'This',
    SUBMIT: 'Submit',
    CONFIRM: 'Confirm',
    VALIDATE: 'Validate',
    CANCEL: 'Cancel',
    DELETE: 'Delete',
    WILL_REMAIN_PRIVATE: 'Will remain private. No spam. No ads.',
    ARE_YOU_SURE: 'Are you sure you want to',
    AUTHOR: 'Author'
  };

  $translateProvider
    .translations('en', enTranslation)
    .preferredLanguage('en');
});