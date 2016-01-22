(function(window) {
  window.user = {};

  window.um = angular.module('um', [
    'ngRoute',
    'ngDialog',
    'ngCookies',
    'services',
    'umController']);

  um.config(["ngDialogProvider", function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: "ngdialog-theme-default",
        showClose: true,
        closeByDocument: true,
        closeByEscape: true,
        appendTo: false
    });
  }]);

  um.run(function($rootScope, $cookies) {

    //如果已经设置了cookie信息，读出user的信息
    if(typeof $cookies.get('name') == 'string') {
      user.name = $cookies.get('name');
      user.password = $cookies.get('password');
      user.type = $cookies.get('type');
    }

    //免登陆半个小时
    if(localStorage.getItem("lastLoginTime")) {
      var cur = new Date().valueOf();
      if(cur - localStorage.getItem("lastLoginTime") < 30 * 60 * 1000) {
        $rootScope.isLogined = true;
        user.name = localStorage.getItem("name");
        user.type = localStorage.getItem("type");
      } else {
        location.hash = "#/login";
      }
    } else {
      location.hash="#/login";
    }

    //如果未登录强制跳转到登录页面
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
      if(!$rootScope.isLogined) {
        location.hash="#/login";
      }
    });

    //导航列表项的高亮样式
    $rootScope.getNavItemClass = function(_url) {
      if(location.hash.indexOf(_url) != -1) {
        return "active";
      } else
        return '';
    }

    //AJAX请求开始时，开始loading
    $rootScope.startLoading = function() {
      $("#loading-con").removeClass('ng-hide');
    }

    //AJAX请求结束时，结束loading
    $rootScope.stopLoading = function() {
      $("#loading-con").addClass('ng-hide');
    }
  });

}(window));