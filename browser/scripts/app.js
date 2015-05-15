var ipc = require('ipc');

angular.module('app', [])
.directive('submitValidate', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    require: 'form',
    link: function (scope, formElement, attributes, formController) {
      var fn = $parse(attributes.submitValidate);

      formElement.bind('submit', function (event) {
        if (!formController.$valid) return false;

        scope.$apply(function () {
          fn(scope, {$event: event});
        });
      });
    }
  }
}])
.directive('submitAttempt', [function () {
  return {
    restrict: 'A',
    controller: ['$scope', function ($scope) {
      this.attempted = false;

      this.setAttempted = function () {
        this.attempted = true;
      };
    }],
    compile: function (cElement, cAttributes, transclude) {
      return {
        pre: function (scope, formElement, attributes, attemptController) {
          scope.attributesObject = scope.attributesObject || {};
          scope.attributesObject[attributes.name] = attemptController;
        },
        post: function (scope, formElement, attributes, attemptController) {
          formElement.bind('submit', function (event) {
            attemptController.setAttempted();
            if (!scope.$$phase) scope.$apply();
          });
        }
      }
    }
  }
}])
.controller('appCtrl', ['$scope', function ($scope) {
  $scope.angularStatus = true;

  $scope.currentUser = null;

  $scope.$on('created first user', function (event, args) {
    $scope.currentUser = args.userName;
    $scope.bodyPartial = 'partials/firstRole.tmpl';
  });

  $scope.$on('created first role', function (event, args) {
    $scope.currentRole = {roleName: args.roleName, displayName: args.displayName}
    $scope.bodyPartial = 'partials/hello.tmpl';
  });
  
  function init () {
    $scope.users = ipc.sendSync('getUserList');

    if ($scope.users.length == 0) {
      $scope.firstUse = true;
      $scope.bodyPartial = 'partials/firstUser.tmpl';
    } else {
      var userChoice = $scope.users[0];
      var password = 'pass';
      var userObject = ipc.sendSync('getUserData', userChoice, password);
      //$scope.userObject = userObject;
      $scope.currentUser = userObject.userName;
      $scope.currentRole = {
        roleName: userObject.roles[0].roleName,
        displayName: userObject.roles[0].displayName
      }
      $scope.bodyPartial = 'partials/hello.tmpl';
    }
  }
  
  init();
}])
.controller('firstUserCtrl', ['$scope', function ($scope) {
  $scope.createFirstUser = function () {
    ipc.send('createNewUser', $scope.newUser.userName, $scope.newUser.password);
    $scope.$emit('created first user', {userName: $scope.newUser.userName});
  }
}])
.controller('firstRoleCtrl', ['$scope', function ($scope) {
  $scope.createFirstRole = function () {
    ipc.send('createNewRole',
      $scope.newRole.roleName, 
      $scope.newRole.displayName);
    $scope.$emit(
      'created first role', 
      {
        roleName: $scope.newRole.roleName,
        displayName: $scope.newRole.displayName
      }
    );
  }
}]);