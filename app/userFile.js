'use strict'

var ipc = require('ipc');
var fs = require('fs');
var glob = require('glob');
var NodeRSA = require('node-rsa');
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';

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

function UserFile () {
};

UserFile.prototype.list = function (path, callback) {
  glob(path + '/*.user', {}, function(er, files) {
    if (er) {
      throw new Error(er);
    } else {
      callback(files);
    }
  });
}

UserFile.prototype.open = function (path, userName, password, callback) {
  var that = this;
  this.file = path + '/' + userName + '.user';
  this.password = password;
  fs.readFile(this.file, 'utf8', function (er, data) {
    if (er) {
      throw new Error(er);
    } else {
      var plainText = decrypt(data, that.password);
      that.userObject = JSON.parse(plainText);
      callback(that.userObject);
    }
  });
}

UserFile.prototype.newUser = function (path, userName, password) {
  console.log('creating new user');
  this.file = path + '/' + userName + '.user';
  this.userObject = {userName: userName, roles: []};
  this.password = password;
  var plainText = JSON.stringify(this.userObject);
  var cipherText = encrypt(plainText, this.password);
  fs.writeFile(this.file, cipherText);
};

UserFile.prototype.addRole = function (roleName, displayName) {  
  var key = new NodeRSA();
  key.generateKeyPair(1024);
  var privPem = key.exportKey('pkcs1-private-pem');
  var pubPem = key.exportKey('pkcs8-public-pem');
  this.userObject.roles.push({
    roleName: roleName,
    displayName: displayName,
    keys: {
      privKey: privPem,
      pubKey: pubPem
    }
  });
  var plainText = JSON.stringify(this.userObject);
  var cipherText = encrypt(plainText, this.password);
  fs.writeFile(this.file, cipherText);
}

module.exports = UserFile;