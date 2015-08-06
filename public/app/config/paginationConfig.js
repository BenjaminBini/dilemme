/**
 * Pagination template configuration
 */
function paginationConfig(paginationTemplateProvider) {
  paginationTemplateProvider.setPath('/partials/templates/pagination');
}

paginationConfig.$inject = ['paginationTemplateProvider'];
angular.module('app').config(paginationConfig);