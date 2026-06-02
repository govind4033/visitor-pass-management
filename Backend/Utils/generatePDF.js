const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePDF = (visitor, code, qrFile) => {
  return new Promise((resolve, reject) => {

    // set pdf name create pdf set folder where it is going to stored
    const file = `pass_${code}.pdf`;
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(
      path.join(__dirname, '../uploads', file)
    );

    doc.pipe(stream);

    // Title
    doc.text("VISITOR PASS");

    // Print visitor info
    doc.text(visitor.name);
    doc.text(visitor.company );
    doc.text(visitor.purpose );
    doc.text(code);

    // QR image
    doc.image(
      path.join(__dirname, '../uploads', qrFile),
      { width: 100 }
    );

    doc.end();

    stream.on('finish', () => resolve(file));
    stream.on('error', reject);
  });
};

module.exports = generatePDF;
