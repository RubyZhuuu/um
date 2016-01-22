/**
 * 
 */
(function(window, user) {
  um.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when("/login", {
          templateUrl: "templates/login.html",
          controller: "loginCtrl"
        }).
        when("/profile/show", {
          templateUrl: "templates/profileShow.html",
          controller: "profileShowCtrl"
        }).
        when("/profile/edit", {
          templateUrl: "templates/profileEdit.html",
          controller: "profileEditCtrl"
        }).
        when("/rights/show", {
          templateUrl: "templates/rights.html",
          controller: "rightsCtrl"
        }).
        otherwise({
          redirectTo: "/profile/show"
        });
  }]);

}(window, window.user));