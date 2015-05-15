var ipc = require('ipc');
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var should = require('should');
var crypto = require('crypto');

var UserFile = require('../../../app/userFile.js');
var userFile = new UserFile();

var algorithm = 'aes-256-ctr';

function getDataPath () {
  return ipc.sendSync('getDataPath');
}

function encrypt(text, password){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text, password){
  var decipher = crypto.createDecipher(algorithm,password)
  var decrypted = decipher.update(text,'hex','utf8')
  decrypted += decipher.final('utf8');
  return decrypted;
}

describe('user file', function () {
    
  var userName = 'player1';
  var password = 'password';
  var roleName = 'Work';
  var displayName = 'SECAdev';
  var fileName = userName + '.user';
  var dataPath = getDataPath();

  before(function () {
    fs.readdirSync(dataPath).forEach(function(file) {
      if (path.extname(file) === ".user") {
        fs.unlinkSync(dataPath + '/' + file);
      }
    });
    userFile.newUser(dataPath, userName, password);
  });

  it('can be listed', function (done) {
    userFile.list(dataPath, function (files) {
      files.length.should.equal(1);
      done();
    });
  });

  after(function () {
    fs.readdirSync(dataPath).forEach(function(file) {
      if (path.extname(file) === ".user") {
        fs.unlinkSync(dataPath + '/' + file);
      }
    });
  });

  it('is named after the username', function (done) {
    userFile.list(dataPath, function (files) {
      files[0].should.equal(dataPath + '/' + userName + '.user');
      done();
    });
  });

  describe('user object', function () {
    
    var userObject; 

    before(function (done) {
      userFile.open(dataPath, userName, password, function (data) {
        userObject = data;
        done();
      });
    });

    it('has a userName property', function () {
      userObject.userName.should.equal(userName);
    });

    it('has a roles property', function () {
      userObject.roles.should.not.be.undefined;
    })

    describe('role', function () {
      var role;

      before(function (done) {
        userFile.addRole(roleName, displayName);
        userFile.open(dataPath, userName, password, function (data) {
          userObject = data;
          role = userObject.roles[0];
          done();
        });
      });

      it('has a roleName property', function () {
        role.roleName.should.equal(roleName);
      });

      it('has a displayName property', function () {
        role.displayName.should.equal(displayName);
      });

      it('has a keys property', function () {
        role.keys.should.not.be.undefined;
      });

      it('has a private key', function () {
        role.keys.privKey.should.not.be.undefined;
      });

      it('has a public key', function () {
        role.keys.pubKey.should.not.be.undefined;
      });

    });

  });

});