var Browser = require('zombie');
var crypto = require('crypto');
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var should = require('should');

var algorithm = 'aes-256-ctr';

function encrypt (text, algorithm, password) {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt (cipherText, algorithm, password) {
  var decipher = crypto.createDecipher(algorithm, password);
  var plainText = decipher.update(cipherText,'hex','utf8');
  plainText += decipher.final('utf8');
  return plainText;
}

function readAndDecrypt (fileName, algorithm, password, callback) {
  fs.readFile(fileName, 'utf8', function (er, data) {
    if (er) {
      throw new Error(er);
    } else {
      var plainText = decrypt(data, algorithm, password);
      callback(plainText);
    }
  });
}

Browser.localhost('seca.io', 3000);

describe('user file', function () {
    
  const browser = new Browser();
  var user = 'player1';
  var password = 'password';
  var fileName = 'data/' + user + '.user';

  before(function (done) {
    fs.readdirSync('./data').forEach(function(fileName) {
      if (path.extname(fileName) === ".user") {
        fs.unlinkSync('data/' + fileName);
      }
    });
    browser.visit('/', function () {      
      browser
        .fill('form input[name=username]', user)
        .fill('form input[name=password]', password)
        .fill('form input[name=password_confirmation]', password)
        .pressButton("Next Step >>", done);
    });
  });

  after(function () {
    fs.readdirSync('./data').forEach(function(fileName) {
      if (path.extname(fileName) === ".user") {
        fs.unlinkSync('data/' + fileName);
      }
    });
  });

  it('is named after the username', function (done) {
    glob('data/*.user', {}, function (er, files) {
      if (er) {
        throw new Error(er);
      } else {
        files.length.should.equal(1);
        files[0].should.equal(fileName);
        done();
      }
    })
  });
  
  it('is encrypted', function (done) {
    fs.readFile(fileName, 'utf8', function (er, data) {
      if (er) {
        throw new Error(er);
      } else {
        var userObject = {
          username : user
        };
        var jsonText = JSON.stringify(userObject);
        var matchText = encrypt(jsonText, algorithm, password);
        data.should.equal(matchText);
        done();
      }
    });
  });

  it('has a username property', function (done) {
    readAndDecrypt(fileName, algorithm, password, function (plainText) {
      var userObject = JSON.parse(plainText);
      userObject.username.should.equal(user);
      done();
    });
  });

});