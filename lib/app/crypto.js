
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