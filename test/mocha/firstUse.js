var Browser = require('zombie');
var should = require('should');
var glob = require('glob');

Browser.localhost('seca.io', 3000);

describe('Web application', function () {
  
  const browser = new Browser();

  before(function (done) {
    var fs = require('fs');
    var path = require('path');
  
    fs.readdirSync('./data').forEach(function(fileName) {
      if (path.extname(fileName) === ".user") {
        fs.unlinkSync('data/' + fileName);
      }
    });
    browser.visit('/', done);
  });

  describe('when connected for the first time', function () {

    it('results in the "first user" form', function () {
      browser.assert.text('title', 'Welcome to SECA :: Create a User');
      browser.assert.elements('form', 1);
      browser.assert.elements('form input', 3);
    });
  
  });

  describe('first user form', function () {

    it('has an input for a username', function () {
      browser.assert.element('form input[name=username]');
    });

    it('has an input for a password', function () {
      browser.assert.element('form input[name=password]');
    });

    it('has an input for password confirmation', function () {
      browser.assert.element('form input[name=password_confirmation]');
    });

    it('cannot be submitted with no username', function () {
      browser
        .fill('form input[name=password]', 'password')
        .fill('form input[name=password_confirmation]', 'password');
      browser.assert.attribute('button', 'class', 'btn btn-primary disabled');
    });

    it('cannot be submitted with no passwords', function () {
      browser
        .fill('form input[name=username]', 'player1')
        .fill('form input[name=password]', '')
        .fill('form input[name=password_confirmation]', '');
      browser.assert.attribute('button', 'class', 'btn btn-primary disabled');
    });

    it('cannot be submitted with empty passwords', function () {
      browser
        .fill('form input[name=username]', 'player1')
        .fill('form input[name=password]', 'password')
        .fill('form input[name=password_confirmation]', '');
      browser.assert.attribute('button', 'class', 'btn btn-primary disabled');
      browser
        .fill('form input[name=username]', 'player1')
        .fill('form input[name=password]', '')
        .fill('form input[name=password_confirmation]', 'password');
      browser.assert.attribute('button', 'class', 'btn btn-primary disabled');
    });

    it('cannot be submitted with mismatched passwords', function () {
      browser
        .fill('form input[name=username]', 'player1')
        .fill('form input[name=password]', 'password')
        .fill('form input[name=password_confirmation]', 'otherpassword');
      browser.assert.attribute('button', 'class', 'btn btn-primary disabled');
    });

    it('can be submitted when all fields are filled in and the passwords match', function () {
      browser
        .fill('form input[name=username]', 'player1')
        .fill('form input[name=password]', 'password')
        .fill('form input[name=password_confirmation]', 'password');
      browser.assert.attribute('button', 'class', 'btn btn-primary'); 
    });

    describe('when submitted', function () {
      
      before(function (done) {
        browser
          .fill('form input[name=username]', 'player1')
          .fill('form input[name=password]', 'password')
          .fill('form input[name=password_confirmation]', 'password')
          .pressButton("Next Step >>", done);
      });

      it('creates a new user account', function (done) {
        browser.assert.success();
        glob("data/*.user", {}, function (er, files) {
          if (er) {
            throw new Error(er);
          } else {
            files.length.should.equal(1);
            files[0].should.equal('data/player1.user');
            done();
          }
        });              
      });

    });

  });

});