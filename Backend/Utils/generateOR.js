const QRCode = require('qrcode');
const path = require('path');

const generateQR = async (code) => {
  const file = `qr_${code}.png`;
  await QRCode.toFile(
    path.join(__dirname, '../uploads', file),
    code
  );
  return file;
};

module.exports = generateQR;