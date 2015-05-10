var Browser = require('zombie');
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var should = require('should');
var app = require('../../lib/app/app');

Browser.localhost('seca.io', 3000);

describe('user file', function () {
    
  const browser = new Browser();
  var user = 'player1';
  var password = 'password';
  var roleName = 'Work';
  var displayName = 'SECAdev';
  var fileName = 'data/' + user + '.user';
  var userObject;

  before(function (done) {
    fs.readdirSync('./data').forEach(function(fileName) {
      if (path.extname(fileName) === ".user") {
        fs.unlinkSync('data/' + fileName);
      }
    });
    app.listen(3000);
    browser.visit('/', function () {      
      browser
        .fill('form input[name=username]', user)
        .fill('form input[name=password]', password)
        .fill('form input[name=password_confirmation]', password)
        .pressButton("Next Step >>", done);
    });
  });

  after(function () {
    app.close();
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

  describe('user object', function () {

    var userObject;

    before(function (done) {
      fs.readFile(fileName, 'utf8', function (er, data) {
        if (er) {
          throw new Error(er);
        } else {
          userObject = JSON.parse(data);
          done();
        }
      });
    });

    it('has a username property', function () {
      userObject.userName.should.equal(user);
    });

    it('has a roles property', function () {
      userObject.roles.should.not.be.undefined;
    });

    describe('role', function () {
      var role;

      before(function (done) {
        browser
          .fill('form input[name=rolename]', roleName)
          .fill('form input[name=displayname]', displayName)
          .pressButton('Finish', function () {
            fs.readFile(fileName, 'utf8', function (er, data) {
              if (er) {
                throw new Error(er);
              } else {
                role = JSON.parse(data).roles[0];
                done();
              }
            });
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