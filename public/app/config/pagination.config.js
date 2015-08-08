/**
 * Pagination template configuration
 */
function paginationConfig(paginationTemplateProvider) {
  paginationTemplateProvider.setPath('/partials/ui/pagination');
}

paginationConfig.$inject = ['paginationTemplateProvider'];
angular.module('app').config(paginationConfig);