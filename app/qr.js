let ZXing = require('@zxing/library');
let Lzma = require('lzma');

// let Buffer = require('buffer').Buffer;


function writeQR() {
  var input = editor.getValue();
  const codeWriter = new ZXing.BrowserQRCodeSvgWriter();
// you can get a SVG element.
  const svgElement = codeWriter.write(input, 300, 300);
// or render it directly to DOM.
  $('#result').empty();
  codeWriter.writeToDom('#result', input, 300, 300);
}

function compressData() {
  var input = editor.getValue();
  Lzma.compress(input, 9, function (result, error) {
    if (error) console.error(error);
    compressed_result = Buffer.from(result);
    encoded_string_result = compressed_result.toString('base64');
    editor.setValue(encoded_string_result);
    re_buffered_result = Buffer.alloc(encoded_string_result.length, encoded_string_result, 'base64');
    console.log(re_buffered_result);
  }, function (percent) {

  });
}

function decompressData(data) {
  var byte_array = Buffer.from(data, 'base64');
  Lzma.decompress(byte_array, function (result, error) {
    console.log(result);
  }, function (percent) {

  });

}
