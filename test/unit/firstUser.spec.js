'use strict'

describe('First User controller', function () {

  beforeEach(module('app'));

  var appCtrl;
  var scope;

  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    appCtrl = $controller('firstUserCtrl', {
      $scope: scope
    });
  }));

  describe('create first user method', function () {
    var userName = 'SECAuser';
    var password = 'password'

    it('creates a new user', function () {
      scope.createFirstUser(userName, password);
      expect(scope.userObject).toEqual({userName: userName, roles: []});
      expect(scope.currentUser).toEqual(userName);
    });

    it('prevents creating duplicate users', function () {
    });
  
  });

});