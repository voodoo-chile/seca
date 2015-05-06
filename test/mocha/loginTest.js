var Browser = require('zombie');

Browser.localhost('seca.io', 3000);

describe('Starting application', function () {
  
  const browser = new Browser();

  before(function (done) {
    var fs = require('fs');
    var path = require('path');
  
    fs.readdirSync('./data').forEach(function(fileName) {
      console.log(fileName);
      if (path.extname(fileName) === ".user") {
        fs.unlinkSync('data/' + fileName);
      }
    });
    browser.visit('/', done);
  });

  describe('for the first time', function () {

    it('results in an "add user" prompt', function () {
      browser.assert.text('title', 'Create a new User');
    });
  
  })

})