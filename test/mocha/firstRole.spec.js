var Browser = require('zombie');
var crypto = require('crypto');
var should = require('should');
var glob = require('glob');
var fs = require('fs');
var path = require('path');
var app = require('../../lib/app/app');

var algorithm = 'aes-256-ctr';

function roleFormFill (browser, roleName, displayName) {
  browser
    .fill('form input[name=rolename]', roleName)
    .fill('form input[name=displayname]', displayName);
}

Browser.localhost('seca.io', 3000);

describe('First role form', function () {
  
  const browser = new Browser();
  var user = 'SECAuser';
  var password = 'password';
  var roleName = 'home';
  var displayName = 'Mom';
  var userFile = 'data/' + user + '.user';

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

  it('has an input for rolename', function () {
    browser.assert.element('form input[name=rolename]');
  });

  it('has an input for display name', function () {
    browser.assert.element('form input[name=displayname]');
  });

  it('cannot be submitted with empty fields', function () {
    browser.assert.attribute('button', 'class', 'btn btn-primary disabled');
    roleFormFill(browser, roleName, '');
    browser.assert.attribute('button', 'class', 'btn btn-primary disabled');
    roleFormFill(browser, '', displayName);
    browser.assert.attribute('button', 'class', 'btn btn-primary disabled');
  });

  describe('when submitted', function () {

    before(function (done) {
      roleFormFill(browser, roleName, displayName);
      browser.pressButton("Finish", done);
    });

    it('creates a new role', function (done) {
      fs.readFile(userFile, 'utf8', function (er, data) {
        if (er) {
          throw new Error(er);
        } else {
          var userObject = JSON.parse(data);
          userObject.roles.length.should.equal(1);
          userObject.roles[0].roleName.should.equal(roleName);
        }
        done();
      });
    });

    it('redirects to the chat applicaton', function () {
      browser.assert.success();
      browser.assert.text('title', 'SECA');
    });

  });

});