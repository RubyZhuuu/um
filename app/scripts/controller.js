var umController = angular.module("umController", []);

umController.controller("loginCtrl", ["$scope", "$rootScope", "$cookies", "Admin", "ngDialog", function($scope, $rootScope, $cookies, Admin, ngDialog) {
  $scope.type = "1";  //0 超级管理员， 1 普通管理员

  if(typeof user.name == 'string') {
     $scope.name =user.name;
     $scope.password = user.password;
     $scope.type = user.type;
  }

  $scope.submit = function() {
    if($scope.name && $scope.password && $scope.type) {
      $scope.startLoading();

      if($scope.saveAccount) {
        $cookies.put('name', $scope.name);
        $cookies.put('password', $scope.password);
        $cookies.put('type', $scope.type);
      }

      user.type = $scope.type;

      //TODO login
      
      Admin.login({
        type: $scope.type,
        username: $scope.name,
        password: $scope.password
      }, function(res) {
        $scope.stopLoading();

        $rootScope.isLogined = true;
        window.localStorage.setItem('lastLoginTime', new Date().valueOf());
        window.localStorage.setItem('name', $scope.name);
        window.localStorage.setItem('type', $scope.type);
        user.type = $scope.type;
        user.name = $scope.name;
        location.hash="#/profile/show";
        //console.log(res);
      }, function(error) {
        $scope.stopLoading();
        if(error.status === -1) {
          ngDialog.open({
            template: '<h4>登录超时，请稍后再试!</h4>\
                      <span class="button" ng-click="closeThisDialog()">确定</span>',
            plain: true,
            closeByDocument: true
          });
        } else {
          ngDialog.open({
            template: '<h4>登录失败,用户名或者密码错误!</h4>\
                      <span class="button" ng-click="closeThisDialog()">确定</span>',
            plain: true,
            closeByDocument: true
          });
        }

      });

    }
  }
}])
.controller("profileShowCtrl", ["$scope", "RoleType", "SearchConstructor", "Paging", "ngDialog", "Profile", "SystemUserProfile", function($scope, RoleType, SearchConstructor, Paging, ngDialog, Profile, SystemUserProfile) {
  $scope.user = user;
  var prolileService = user.type == 1 ? Profile : SystemUserProfile; //根据身份类型调用不同服务

  var classfications = RoleType.getType(),
      params = {};

  $scope.identity = new SearchConstructor.Instance(classfications.identity),
  $scope.role = new SearchConstructor.Instance(classfications.role),
  $scope.occupation = new SearchConstructor.Instance(classfications.occupation);
  $scope.managerRole = new SearchConstructor.Instance(classfications.managerRole);

  $scope.search = function() {
    params = {};

    params.pageNumber = $scope.localPaging.getCurrentPage() - 1;

    if(user.type == 1) { 
      if($scope.identity.getSelectedString() != "")
        params.usertype = $scope.identity.getSelectedString();
      if($scope.role.getSelectedString() != "")
        params.userrole = $scope.role.getSelectedString();
      if($scope.occupation.getSelectedString() != "")
        params.occupation = $scope.occupation.getSelectedString();

      prolileService.getProfileList(params, function(res) {
        $scope.users = res.users;
        $scope.pageList = Paging.getPageList(res.count);
      }); 
    } else {
      if($scope.managerRole.getSelectedString() != "")
        params.userrole = $scope.managerRole.getSelectedString();
      prolileService.getProfileList(params, function(res) {
        $scope.users = res.normalAdmins;
        $scope.pageList = Paging.getPageList(res.count);
      });
    }
  }

  $scope.localPaging = Paging;
  //$scope.pageList = $scope.localPaging.getPageList(4);

  prolileService.getProfileList({}, function(res) {
    if(user.type == 1) {
      $scope.users = res.users;
      $scope.pageList = Paging.getPageList(res.count);
    }
    else {
      $scope.users = res.normalAdmins;
      $scope.pageList = Paging.getPageList(res.count);
    }
  });

  $scope.jumpPage = function(trend, page) {
    $scope.localPaging.jumpPage(trend, page, $scope.search);
  }

  //处理删除逻辑
  $scope.handleDelete = function(_id, _index) {
    var dialog = ngDialog.openConfirm({
      template: '<h4>确定删除该用户？</h4>\
                 <span class="button" ng-click="confirm()">确定</span>\
                 <span class="button" ng-click="closeThisDialog()">取消</span>',
      plain: true
    });

    dialog.then(function() {
        //TODO 向后台发送删除请求
        param = {};
        if(user.type == 1)
          param.userID = _id;
        else
          param.ID = _id;
        prolileService.deleteUser(param, function() {
          ngDialog.open({
            template: '<h4>删除成功</h4>\
                       <span class="button" ng-click="closeThisDialog()">确定</span>',
            plain: true
          });
          $scope.users.splice(_index, 1);
        }, function() {});
        
        //TODO 应该再向后台请求一次数据？
    });
  }

  $scope.showUserDetail = function(_index) {
    location.hash = "#/profile/edit?id=" + $scope.users[_index].id;
  }

  $scope.editUser = function(_index) {
    location.hash = "#profile/edit?id=" + $scope.users[_index].id + "&&edit=true";
  }

  $scope.formatDate = function(_dateStr) {

  }

}])
.controller("rightsCtrl", ["$scope", "ngDialog", "Right", "SystemUserRight", function($scope, ngDialog, Right, SystemUserRight) {
  var origin = {};
  var rightService = user.type == 1 ? Right : SystemUserRight;

  $scope.user = user;

  rightService.getAll(function(res) {
    //UGLY CODE 
    if(user.type == 1) {
      $scope.rights = res.userRights.userRights;
      origin = {};
      for(var idx in $scope.rights) {
        var id = $scope.rights[idx].userRightId;
        origin[id] = false;
      }
      
      var roleRightsMapping = [];

      for(var i in res.userRoles.userRoles) {
        var single = {};
        
        var role = res.userRoles.userRoles[i];
        single.onEditing = false;
        single.roleName = role.userRoleName;
        single.roleId = role.id;
        single.map = {};
        angular.copy(origin, single.map);

        for(var j in role.userRights) {
          single.map[role.userRights[j].id] = true;
        }

        roleRightsMapping.push(single);
      }

      $scope.roleRightsMapping = roleRightsMapping;
    } else {
      $scope.rights = res.normalAdminRights.normalAdminRights;
      origin = {};
      for(var idx in $scope.rights) {
        var id = $scope.rights[idx].normalAdminRightId;
        origin[id] = false;
      }
      
      var roleRightsMapping = [];

      for(var i in res.normalAdminRoles.normalAdminRoles) {
        var single = {};
        
        var role = res.normalAdminRoles.normalAdminRoles[i];
        single.onEditing = false;
        single.roleName = role.normalAdminRoleName;
        single.roleId = role.id;
        single.map = {};
        angular.copy(origin, single.map);

        for(var j in role.normalAdminRights) {
          single.map[role.normalAdminRights[j].id] = true;
        }

        roleRightsMapping.push(single);
      }

      $scope.roleRightsMapping = roleRightsMapping;
    }
  })

  function formatRight(_map) {
    var right = [];
    for(var item in _map) {
      if(_map[item]) {
        right.push(item);
      }
    }

    return right.toString();
  }

  $scope.save = function(_index) {
    //先检测有没有填入角色名称
    if(typeof $scope.roleRightsMapping[_index].roleName === 'undefined') {
      var dialog = ngDialog.open({
        template: '<h4>请填入角色名称!</h4>\
                  <span class="button" ng-click="closeThisDialog()">确定</span>',
        plain: true,
        closeByDocument: true
      });

      return;
    }
    var cur = $scope.roleRightsMapping[_index],
        params = {};

    if(cur.create) {
      //如果是新创建的角色
      if(user.type == 1) {
        params.action = "addUserRole";
        params.userRoleName = cur.roleName;
      } else {
        params.action = "addNormalAdminRole";
        params.normalAdminRoleName = cur.roleName;
      }
    } else {
      //如果是更新角色
      if(user.type == 1) {
        params.action = "updateUserRole";
        params.userRoleID = cur.roleId;
      } else {
        params.action = "updateNormalAdminRole";
        params.normalAdminRoleID = cur.roleId;
      }
    }

    params.rightsID = formatRight(cur.map);
    
    if(params.rightsID == "") {
      var dialog = ngDialog.open({
        template: '<h4>请至少选择一种权限!</h4>\
                  <span class="button" ng-click="closeThisDialog()">确定</span>',
        plain: true,
        closeByDocument: true
      });
    } else {
      rightService.updateRole(params, function(res) {
        cur.create = null;
        cur.onEditing = false;
        if(res.roleID)
          cur.roleId = res.roleID;
      }, function(error) {
        if(error.status == 430) {
          var dialog = ngDialog.open({
            template: '<h4>角色重名!</h4>\
                      <span class="button" ng-click="closeThisDialog()">确定</span>',
            plain: true,
            closeByDocument: true
          });
        }
      });
    }
  };

  $scope.add = function() {
    var newly = {
      onEditing: true,
      create: true,
      map: {}
    };

    angular.copy(origin, newly.map);

    //$scope.roleRightsMapping.unshift(newly);
    $scope.roleRightsMapping.push(newly);
  }

  $scope.edit = function(_index) {
    $scope.roleRightsMapping[_index].onEditing = true;
  }

  $scope.delete = function(_index) {
    var cur = $scope.roleRightsMapping[_index];
    //如果这个角色是新创建并且还没有保存的，直接删除
    if(cur.create === true) {
      $scope.roleRightsMapping.splice(_index, 1);
      return;
    }
    //TODO
    var dialog = ngDialog.openConfirm({
      template: '<h4>确定删除该角色？</h4>\
                 <span class="button" ng-click="confirm()">确定</span>\
                 <span class="button" ng-click="closeThisDialog()">取消</span>',
      plain: true
    });

    dialog.then(function() {
        //TODO 向后台发送删除请求
        param = {};
        if(user.type == 1)
          param.userRoleID = cur.roleId;
        else
          param.normalAdminRoleID = cur.roleId;
        rightService.deleteRole(param, function() {
          $scope.roleRightsMapping.splice(_index, 1);
        });
    });
  }

}])
.controller("profileEditCtrl", ["$scope", "$location", "Profile", "ngDialog", "SystemUserProfile", function($scope, $location, Profile, ngDialog, SystemUserProfile) {
  $scope.currentUser = window.user;

  $scope.onEditing = false;
  $scope.create = false;
  $scope.sexType = ["男", "女"];
  $scope.occuType = ["产品经理","金融研究员","经纪人","开发工程师","职业炒股人","自由职业者"];
  $scope.userType = ["免费用户", "付费用户", "内部员工"];
  $scope.userTypeSuper = ["普通管理员", "系统管理员"];
  $scope.useerRoleSuper = ["产品经理", "产品设计人员", "需求人员", "开发人员", "测试人员", "管理层"];
  $scope.userRole;

  var prolileService = window.user.type == 1 ? Profile : SystemUserProfile;

  var original = {}; //保存用户编辑前的原始数据

  //ugly  重新设计数据结构
  var userOptions = [[{
      role: "试用期用户",
      due: ["一周"],
    }, {
      role: "已过试用期用户",
      due: ["无"]
    }], [{
      role: "购买基础版用户",
      due: ["一年", "两年", "三年"]
    }], [{
      role: "开发人员",
      due: ["无"]
    },{
      role: "测试人员",
      due: ["无"]
    }, {
      role: "产品设计人员",
      due: ["无"]
    }]];

  //url上有id参数是初始状态是查看，不带id参数初始状态是创建（修改）
  if(typeof $location.search().id === 'undefined') {
    //Warning: user作用域
    var userOnEditing = new Profile();
    $scope.onEditing = true;
    $scope.create = true;

    //初始化  UGLY CODE
    userOnEditing.usertype = $scope.userType[0];
    $scope.userRole = userOptions[0];
    $scope.dueTime = $scope.userRole[0].due;
    userOnEditing.userrole = $scope.userRole[0].role;
    userOnEditing.duetime = $scope.dueTime[0];

    original = angular.copy(user);
    $scope.user = userOnEditing;
  } else {
    //UGLY 后台就不能把参数名统一一下吗
    var params = {};
    if($scope.currentUser.type == 1)
      params.userID = $location.search().id;
    else
      params.ID = $location.search().id;

    $scope.user = prolileService.getById(params, function() {
      $scope.user.birthdate = $scope.user.birthdate ? new Date($scope.user.birthdate) : null;
      //心好累
      if($scope.currentUser.type == 1)
        $scope.user.userID = $scope.user.id;
      else
        $scope.user.ID = $scope.user.id;
      $scope.user.id = null;
      original = angular.copy($scope.user);

      if(typeof $location.search().edit !== 'undefined')
        $scope.onEditing = true;
    }), function() { 
      console.log("error");
    };
  }

  function update(user) {
    //UGLY code
    user.birthdate = user.birthdate ? user.birthdate : "null";
    prolileService.updateProfile(user, function(res) {
      $scope.stopLoading();
      var dialog = ngDialog.open({
        template: '<h4>保存成功</h4>\
                   <span class="button" ng-click="closeThisDialog()">确定</span>',
        plain: true,
        closeByDocument: true
      });

      $scope.onEditing = false;
    }, function(_error) {
      $scope.stopLoading();

      var dialog = ngDialog.open({
        template: '<h4>保存失败，请稍后再试</h4>\
                   <span class="button" ng-click="closeThisDialog()">确定</span>',
        plain: true,
        closeByDocument: true
      });
    });
  }

  function addNew(user) {
    //UGLY code
    user.birthdate = user.birthdate ? user.birthdate : "null";
    if($scope.currentUser.type == 1) {
      user.remainday = moment($scope.endDate).diff(moment(), 'days');
    }
    prolileService.createNew(user, function(res) {
      $scope.stopLoading();
      //location.hash="#/profile/edit"
      var dialog = ngDialog.openConfirm({
        template: '<h4>保存成功</h4>\
                   <span class="button" ng-click="confirm()">确定</span>',
        plain: true,
        closeByDocument: true
      });

      dialog.then(function() {
        location.hash = "#/profile/show";
      });

    }, function() {
      $scope.stopLoading();
      var dialog = ngDialog.open({
        template: '<h4>保存失败，请稍后再试</h4>\
                   <span class="button" ng-click="closeThisDialog()">确定</span>',
        plain: true,
        closeByDocument: true
      });
    });
  }

  $scope.saveChange = function() {
    $scope.startLoading();

    if(!$scope.create)
      update($scope.user);
    else
      addNew($scope.user);
  }

  $scope.reset = function() {
    $scope.user = angular.copy(original);
  }

  /**
   * Date对象转换成字符串
   * @param  {[Date]} _date [description]
   * @return {[String]}       [description]
   */
  $scope.formatDate = function(_date) {
    if(!_date)
      return "";
    if(typeof _date === "string")
      return;
    var dateString = _date.getFullYear() + "-";
    dateString += (_date.getMonth() + 1) < 10 ? '0' + (_date.getMonth() + 1) : _date.getMonth() + 1;
    dateString += '-' + _date.getDate();

    return dateString;
  }

  //UGLY CODE
  $scope.switchUserType = function(_index, _newType) {
    $scope.userRole = userOptions[_index];
    $scope.user.usertype = _newType;
    $scope.dueTime = $scope.userRole[0].due;

    $scope.user.userrole = $scope.userRole[0].role;
    $scope.user.duetime = $scope.dueTime[0];
  }

  $scope.switchUserRole = function(_index, _newRole) {
    if(_newRole == $scope.user.userrole)
      return;
    $scope.dueTime = $scope.userRole[_index].due;
    user.duetime = $scope.dueTime[0];
    $scope.user.userrole = _newRole;
  }
  //ugly
  var diff = 0;
  $scope.enddate = new Date();
  $scope.startdate = new Date();

  //startdate写成startDate会出错 原因未知
  $scope.handleStartDateChange = function(v) {
    var momentStart,
      momentEnd;
    momentStart = moment(v);
    momentEnd = momentStart.add(diff,'days');
    $scope.startdate = momentStart.toDate();
    $scope.enddate = momentEnd.toDate();
  }

  $scope.handleEndDateChange = function(v) {
    var momentStart,
        momentEnd;
      
      momentEnd = moment(v);
      momentStart = momentEnd.add(diff * -1,'days');
      $scope.enddate = momentEnd.toDate();
      $scope.startdate = momentStart.toDate();
  }

  function initWatch() {
    $scope.$watch('user.duetime', function(newValue, oldValue) {
      diff = getDueDiff(newValue);
      $scope.startdate = new Date();
      var momentStart = moment($scope.startdate),
          momentEnd = momentStart.add(diff, 'days');
      $scope.enddate = momentEnd.toDate();
    });

    // $scope.$watch('startDate', function(newValue, oldValue) {
    //   if (newValue.getTime() == oldValue.getTime()) {
    //     return;
    //   }
    //   var momentStart,
    //       momentEnd;
      
    //     momentStart = moment(newValue);
    //     momentEnd = momentStart.add(diff,'days');
    //     $scope.endDate = momentEnd.toDate();
    //     return;
    // });

    // $scope.$watch('endDate', function(newValue, oldValue) {
    //   if (newValue.getTime() == oldValue.getTime()) {
    //     return;
    //   }
    //   var momentStart,
    //       momentEnd;
      
    //     momentEnd = moment(newValue);
    //     momentStart = momentEnd.add(diff * -1,'days');
    //     $scope.startDate = momentStart.toDate();
    //     return;
    // });
  }

  function getDueDiff(_diffDes) {
    switch(_diffDes) {
      case "一周":
        return 7;
      case "一年":
        return 365;
      case "两年":
        return 730;
      case "三年":
        return 1095;
      case "一月":
        return 30;
      case "无":
        return 0;
    }
  }

  $scope.backToShow = function() {
    location.hash = "#/profile/show";
  }

  initWatch();

}]);
