const fs = require('fs');
const xlsx = require('xlsx');

function createNewWorkBook() {
  return xlsx.utils.book_new();
}

function addWorkSheet(workBook, workSheetName, columnNames, data) {
  const workSheetData = [columnNames, ...data];
  const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
  xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
}

function writeWorkBook(workBook, filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  xlsx.writeFile(workBook, filePath);
}

module.exports = { createNewWorkBook, addWorkSheet, writeWorkBook };
