(function(window) {
  services.factory("Admin", ["$resource", function($resource) {
    return $resource('', {}, {
      login: {
        method: "GET",
        url: "http://192.168.245.213:8080/UMSbeta/servlet/AdminLogin",
        //url: "http://192.168.245.34:8080/TestKuayu/servlet/TestOne",
        params: {
          type: "@type",
          password: "@password",
          username: "@username"
        },
      }
    });
  }]);

  services.factory("Profile", ["$resource", function($resource) {
    return $resource('', {}, {
      getProfileList: {
        method: "GET",
        url: "http://192.168.245.213:8080/UMSbeta/servlet/NormalAdminServlet",
        params: {
          action: "searchUser",
          username: "null",
          usertype: 'null',
          userrole: "null",
          occupation: "null",
          pageNumber: 0,
          pageSize: 5
        }
      },
      getById: {
        method: "GET",
        url: "http://192.168.245.213:8080/UMSbeta/servlet/NormalAdminServlet",
        params: {
          action: "getUserByID"
        }
      },
      updateProfile: {
        url: "http://192.168.245.213:8080/UMSbeta/servlet/NormalAdminServlet",
        method: "GET",
        params : {
          action: "updateUser"
        }
      },
      createNew: {
        url: "http://192.168.245.213:8080/UMSbeta/servlet/NormalAdminServlet",
        method: "GET",
        params : {
          action: "addUser",
          duetime: "null",
          cell: "null",
          company: "null",
          realname: "null",
          sex: "null",
          birthdate: "null",
          occupation: "null",
          region: "null",
          email: "null",
          registerdate: function() {
            return new Date();
          },
          lastsignindate: function() {
            return new Date();
          },
          remainday: "null"
        }
      },
      deleteUser: {
        url: "http://192.168.245.213:8080/UMSbeta/servlet/NormalAdminServlet",
        method: "GET",
        params: {
          action: "deleteUser",
          userID: 9
        }
      }
    });
  }]);

  services.factory("SystemUserProfile", ["$resource", function($resource) {
    return $resource('', {}, {
      getProfileList: {
        method: "GET",
        url: "http://192.168.245.213:8080/UMSbeta/servlet/SuperAdminServlet?action=searchNormalAdmin",
        params: {
          username: "null",
          userrole: "null",
          pageNumber: 0,
          pageSize: 10
        }
      },
      getById: {
        method: "GET",
        url: "http://192.168.245.213:8080/UMSbeta/servlet/SuperAdminServlet?action=getNormalAdminByID"
      },
      updateProfile: {
        url: "http://192.168.245.213:8080/UMSbeta/servlet/SuperAdminServlet?action=updateNormalAdmin",
        method: "GET"
      },
      createNew: {
        url: "http://192.168.245.213:8080/UMSbeta/servlet/SuperAdminServlet?action=addNormalAdmin",
        method: "GET",
        params : {
          realname: "null",
          sex: "null",
          birthdate: "null",
          email: "null"
        }
      },
      deleteUser: {
        url: "http://192.168.245.213:8080/UMSbeta/servlet/SuperAdminServlet",
        method: "GET",
        params: {
          action: "deleteNormalAdmin",
          ID: 0
        }
      }
    });
  }]);

  services.factory("Right", ["$resource", function($resource) {
    return $resource('', {}, {
      getAll: {
        method: "GET",
        url: "http://192.168.245.213:8080/UMSbeta/servlet/NormalAdminServlet?action=getAllUserRole"
      },
      updateRole: {
        method: "GET",
        url: "http://192.168.245.213:8080/UMSbeta/servlet/NormalAdminServlet"
      },
      deleteRole: {
        method: "GET",
        url: "http://192.168.245.213:8080/UMSbeta/servlet/NormalAdminServlet",
        params: {
          action: "deleteUserRole"
        }
      }
    })
  }])

  services.factory("SystemUserRight", ["$resource", function($resource) {
    return $resource('', {}, {
      getAll: {
        method: "GET",
        url: "http://192.168.245.213:8080/UMSbeta/servlet/SuperAdminServlet?action=getAllNormalAdminRole"
      },
      updateRole: {
        method: "GET",
        url: "http://192.168.245.213:8080/UMSbeta/servlet/SuperAdminServlet"
      },
      deleteRole: {
        method: "GET",
        url: "http://192.168.245.213:8080/UMSbeta/servlet/SuperAdminServlet?action=deleteNormalAdminRole"
      }
    })
  }])
}(window));