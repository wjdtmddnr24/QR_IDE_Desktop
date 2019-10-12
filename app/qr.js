let ZXing = require('@zxing/library');
let Lzma = require('lzma');

// let Buffer = require('buffer').Buffer;
function makeQR(callback) {
  var input = editor.getValue();
  compressData(input, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    writeQR(result, callback);
  });
}


function writeQR(input, callback) {
  const codeWriter = new ZXing.BrowserQRCodeSvgWriter();
  $('#result').empty();
  var height = $(document).height() - 100;
  console.log(height);
  codeWriter.writeToDom('#result', input, height, height);
  callback();
}

function compressData(input, callback) {
  Lzma.compress(input, 9, function (result, error) {
    if (error) console.error(error);
    var compressed_result = Buffer.from(result);
    var encoded_string_result = compressed_result.toString('base64');
    callback(null, encoded_string_result);
  });
}

function decompressData(input, callback) {
  var byte_array = Buffer.from(input, 'base64');
  Lzma.decompress(byte_array, function (result, error) {
    callback(null, result);
  }, function (percent) {
  });
}
