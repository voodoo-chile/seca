module.exports = function () {

  this.Given(/^I have a javascript\-enabled browser$/, function (next) {
    next();
  });

  this.When(/^I connect to the SECA server for the first time$/, function (next) {
    var fs = require('fs');
    var path = require('path');
    
    fs.readdirSync('./data').forEach(function(fileName) {
      console.log(fileName);
      if (path.extname(fileName) === ".user") {
        fs.unlinkSync('data/' + fileName);
      }
    });
    this.visit('http://localhost:3000', next);
  });

  this.Then(/^I am prompted to create a new user$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Then(/^I cannot continue without creating a user$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^I have created a user$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.When(/^I login using that user for the first time$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Then(/^I am prompted to create a role for that user$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Then(/^I cannot continue without creating a role$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^I have an existing role$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.When(/^I choose "([^"]*)"$/, function (arg1, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Then(/^I am prompted to create a new role$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^I have entered a name for a new role$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.When(/^I click submit$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Then(/^a keypair is automatically generated for that role$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Then(/^the role in use is switched to that role$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

}
