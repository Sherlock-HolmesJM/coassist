const fs = require('fs');
const ExcelJS = require('exceljs');
const { rows, columns } = require('./assets/breakdown');

function updateSummary(workbook) {
  const sheet = workbook.getWorksheet('Summary');
  sheet.getColumn(3).values = [10, 10, 10, 10, 10, 10, 10, 10, 10];
  sheet.getRow(1).getCell(2).value = 'Summary';
}

async function updateBreakdown() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('./assets/template.xlsx');

  updateSummary(workbook);

  const sheet = workbook.getWorksheet('Breakdown');

  const { table } = sheet.getTable('MyTable');
  sheet.removeTable('MyTable');
  sheet.addTable({
    ...table,
    ref: 'A1',
    name: 'MyTable',
    headerRow: true,
    columns,
    rows,
  });

  console.log({ sheet });
  // workbook.xlsx.writeFile('./assets/Ugochukwu.xlsx');
}

// updateBreakdown();

//http://localhost:8888/.netlify/functions/index
//http://localhost:8888/api/index

exports.handler = async (event, context) => {
  // console.log(event);

  try {
    await updateBreakdown();
  } catch (error) {
    return {
      statusCode: 500,
      body: error.message,
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify('template'),
  };
};
