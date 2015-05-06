var Browser = require('zombie');
var should = require('should');
var glob = require('glob');
var fs = require('fs');
var crypto = require('crypto');
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

Browser.localhost('seca.io', 3000);

describe('user file', function () {
    
  const browser = new Browser();
  var user = 'player1';
  var password = 'password';
  var fileName = 'data/' + user + '.user';

  before(function (done) {
    var path = require('path');

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
  
  it('is encrypted', function () {
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
      }
    });
  });

  it('has a username property', function (done) {
    fs.readFile(fileName, 'utf8', function (er, data) {
      if (er) {
        throw new Error(er)
      } else {
        var plainText = decrypt(data, algorithm, password);
        var userObject = JSON.parse(plainText);
        userObject.username.should.equal(user);
        done();
      }
    })
  });

});