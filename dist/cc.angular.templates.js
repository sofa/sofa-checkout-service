angular.module('cc.angular.templates', ['src/directives/ccAddress/ccaddress.tpl.html', 'src/directives/ccBreadcrumbs/cc-breadcrumbs.tpl.html', 'src/directives/ccCategoryTreeView/cc-category-tree-view.tpl.html', 'src/directives/ccCheckBox/cc-checkbox.tpl.html', 'src/directives/ccElasticViews/elasticViews.tpl.html', 'src/directives/ccFooterLinks/cc-footer-links.tpl.html', 'src/directives/ccGoBackButton/cc-go-back-button.tpl.html', 'src/directives/ccGoUpButton/cc-go-up-button.tpl.html', 'src/directives/ccGoUpControl/cc-go-up-control.tpl.html', 'src/directives/ccLoadingSpinner/ccloadingspinner.tpl.html', 'src/directives/ccPrice/cc-price.tpl.html', 'src/directives/ccSelectBox/ccselectbox.tpl.html', 'src/directives/ccThumbnailBar/cc-thumbnail-bar.tpl.html', 'src/directives/ccVariantSelector/ccvariantselector.tpl.html', 'src/directives/ccZippy/cc-zippy.tpl.html']);

angular.module("src/directives/ccAddress/ccaddress.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccAddress/ccaddress.tpl.html",
    "<div>\n" +
    "    <div>{{data.company}}</div>\n" +
    "    <div>{{data.name}} {{data.surname}}</div>\n" +
    "    <div>{{data.street}}</div>\n" +
    "    <div>{{data.zip}} {{data.city}}</div>\n" +
    "    <div>{{data.country.label}}</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("src/directives/ccBreadcrumbs/cc-breadcrumbs.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccBreadcrumbs/cc-breadcrumbs.tpl.html",
    "<ul>\n" +
    "    <li class=\"cc-breadcrumbs__entry\" \n" +
    "        ng-repeat=\"entry in data\">\n" +
    "        <a ng-click=\"navigateTo(entry)\" ng-bind=\"entry.title\"></a>\n" +
    "    </li>\n" +
    "</ul>");
}]);

angular.module("src/directives/ccCategoryTreeView/cc-category-tree-view.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccCategoryTreeView/cc-category-tree-view.tpl.html",
    "<div class=\"cc-category-tree-view\">\n" +
    "    <ul ng-class=\"{ 'cc-category-tree-view__list--open': item._categoryTreeView.isVisible, \n" +
    "                    'cc-category-tree-view__list--closed': !item._categoryTreeView.isVisible,\n" +
    "                    'cc-category-tree-view__list--root': isRoot,\n" +
    "                    'cc-category-tree-view__list--child': !isRoot }\" cc-template-code>\n" +
    "       <li class=\"cc-category-tree-view__list-item\"\n" +
    "           cc-nested-category-item ng-repeat=\"item in items\">\n" +
    "            <div ng-click=\"doAction(item)\"\n" +
    "                 ng-class=\"item._categoryTreeView.isActive ? 'cc-category-tree-view__category-entry--active' : 'cc-category-tree-view__category-entry'\">\n" +
    "                 {{item.label}}\n" +
    "                <i ng-class=\"item._categoryTreeView.isVisible ? 'fa-chevron-up' : 'fa-chevron-down'\"\n" +
    "                   class=\"cc-category-tree-view__category-entry-icon fa\"\n" +
    "                   ng-show=\"item.hasChildren\">\n" +
    "               </i>\n" +
    "            </div>\n" +
    "       </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "");
}]);

angular.module("src/directives/ccCheckBox/cc-checkbox.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccCheckBox/cc-checkbox.tpl.html",
    "<div class=\"cc-checkbox\">\n" +
    "    <input type=\"checkbox\" ng-model=\"value\" id=\"cc-check-box-{{id}}\" class=\"cc-checkbox__input\">\n" +
    "    <label for=\"cc-check-box-{{id}}\" class=\"cc-checkbox__label\" ng-bind=\"label\"></label>\n" +
    "</div>\n" +
    "");
}]);

angular.module("src/directives/ccElasticViews/elasticViews.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccElasticViews/elasticViews.tpl.html",
    "<div class=\"cc-elastic-views-viewport\">\n" +
    "    <div \n" +
    "        ng-repeat=\"view in views\"\n" +
    "        cc-elastic-views-notifier \n" +
    "        id=\"{{view.name}}\" \n" +
    "        class=\"cc-elastic-views-view\" \n" +
    "        ng-class=\"view.cls\" \n" +
    "        ng-include=\"view.tpl\">\n" +
    "    </div>\n" +
    "<div>");
}]);

angular.module("src/directives/ccFooterLinks/cc-footer-links.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccFooterLinks/cc-footer-links.tpl.html",
    "\n" +
    "<ul class=\"cc-footer-list\">\n" +
    "    <li bindonce=\"item\" ng-repeat=\"item in items\" ng-click=\"goTo(item)\" bo-text=\"item.title\" class=\"cc-footer-list__item\"></li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("src/directives/ccGoBackButton/cc-go-back-button.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccGoBackButton/cc-go-back-button.tpl.html",
    "<button class=\"cc-go-back-button\" ng-click=\"goBack()\" ng-transclude></button>");
}]);

angular.module("src/directives/ccGoUpButton/cc-go-up-button.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccGoUpButton/cc-go-up-button.tpl.html",
    "<button class=\"cc-go-up-button\" ng-click=\"goUp()\" ng-transclude></button>");
}]);

angular.module("src/directives/ccGoUpControl/cc-go-up-control.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccGoUpControl/cc-go-up-control.tpl.html",
    "    <cc-go-up-button class=\"cc-go-up-control\" ng-if=\"getParentLabel()\">\n" +
    "        <i class=\"cc-go-up-control__icon\">\n" +
    "        </i>\n" +
    "        <span class=\"cc-go-up-control__text\" bo-text=\"getParentLabel()\"></span>\n" +
    "    </cc-go-up-button>");
}]);

angular.module("src/directives/ccLoadingSpinner/ccloadingspinner.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccLoadingSpinner/ccloadingspinner.tpl.html",
    "<div class=\"cc-loading-spinner\">\n" +
    "    <!-- generated and tweaked from http://cssload.net/ -->\n" +
    "    <div class=\"cc-loading-spinner__circle--01\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--02\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--03\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--04\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--05\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--06\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--07\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--08\"></div>\n" +
    "</div>");
}]);

angular.module("src/directives/ccPrice/cc-price.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccPrice/cc-price.tpl.html",
    "\n" +
    "<span class=\"cc-price\" ng-class=\"{ 'cc-price--is-special': product.hasOldPrice() }\">\n" +
    "\n" +
    "    <span ng-if=\"product.hasOldPrice()\">\n" +
    "\n" +
    "        <span class=\"cc-price__price--old\" ng-bind=\"priceOld | currency\"></span>\n" +
    "\n" +
    "        <span class=\"cc-price__price--special\" ng-bind=\"price | currency\"></span>\n" +
    "\n" +
    "    </span>\n" +
    "\n" +
    "    <span ng-if=\"!product.hasOldPrice()\">\n" +
    "        <span class=\"cc-price__price\" ng-bind=\"price | currency\"></span>\n" +
    "    </span>\n" +
    "\n" +
    "</span>\n" +
    "");
}]);

angular.module("src/directives/ccSelectBox/ccselectbox.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccSelectBox/ccselectbox.tpl.html",
    "<div class=\"cc-select-box\">\n" +
    "     <span class=\"cc-select-box__display-value\" ng-bind=\"displayFn(_selectedValue)\"></span>\n" +
    "     <span class=\"cc-select-box__display-value\" ng-hide=\"_selectedValue\">{{chooseText}} {{propertyName}}</span>\n" +
    "     <i class=\"cc-select-box__select-icon\"></i>\n" +
    "    <select name=\"{{propertyName}}\"\n" +
    "            class=\"cc-select-box__native-select\" \n" +
    "            ng-model=\"_selectedValue\" \n" +
    "            ng-options=\"displayFn(val) for val in data\">\n" +
    "        <option ng-if=\"!_omitNull\" value=\"\">-- {{chooseText}} {{propertyName}} --</option>\n" +
    "    </select>\n" +
    "    <span class=\"cc-validation__message--fail\">{{ failMessage }}</span>\n" +
    "</div>");
}]);

angular.module("src/directives/ccThumbnailBar/cc-thumbnail-bar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccThumbnailBar/cc-thumbnail-bar.tpl.html",
    "<ul class=\"cc-thumbnail-bar\">\n" +
    "    <li ng-class=\"$index === selectedImageIndex ? 'cc-thumbnail-bar__item--active' : 'cc-thumbnail-bar__item'\"\n" +
    "        ng-click=\"setSelectedImageIndex($index)\"\n" +
    "        ng-repeat=\"image in images\" style=\"background-image:url('{{ image.url }}');\">\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("src/directives/ccVariantSelector/ccvariantselector.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccVariantSelector/ccvariantselector.tpl.html",
    "<div class=\"cc-variant-selector\">\n" +
    "    <div class=\"cc-select-box\"\n" +
    "         ng-repeat=\"property in properties\">\n" +
    "         <span class=\"cc-select-box__display-value\" ng-bind=\"selectedProperties[property]\"></span>\n" +
    "         <span class=\"cc-select-box__display-value\" ng-hide=\"selectedProperties[property]\">{{chooseText}} {{property}}</span>\n" +
    "         <i class=\"cc-select-box__select-icon fa fa-chevron-down\"></i>\n" +
    "        <select name=\"{{property}}\"\n" +
    "                class=\"cc-select-box__native-select\" \n" +
    "                ng-model=\"selectedProperties[property]\" \n" +
    "                ng-options=\"val for val in variants|ccVariantFilter:selectedProperties:property\">\n" +
    "            <option value=\"\">-- {{chooseText}} {{property}} --</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("src/directives/ccZippy/cc-zippy.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccZippy/cc-zippy.tpl.html",
    "<div class=\"cc-zippy\">\n" +
    "    <div class=\"cc-zippy__caption\">\n" +
    "        <span ng-bind=\"caption\"></span>\n" +
    "        <i class=\"cc-zippy-icon\"></i>\n" +
    "    </div>\n" +
    "    <div class=\"cc-zippy__content\" ng-transclude></div>\n" +
    "</div>\n" +
    "");
}]);
