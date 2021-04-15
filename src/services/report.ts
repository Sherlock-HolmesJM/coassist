import { MessageI, T_And_TE } from '../types';
import { columns } from './breakdown';
import Excel from 'exceljs';
import { range, summary, capitalize } from '../utils';

function updateSummary(workbook, messages) {
  const sheet = workbook.getWorksheet('Summary');

  const values = summary(messages).reduce(
    (acc, sum) => [...acc, [sum.name, sum.value]],
    []
  );

  const rows = range(3, 10);

  rows.forEach((row, index) => {
    sheet.getRow(row).getCell(2).value = values[index][0];
    sheet.getRow(row).getCell(3).value = values[index][1];
  });
}

function getDate(torte: T_And_TE, index: 'dateReturned' | 'dateIssued') {
  return !torte ? '' : !torte[index] ? '' : new Date(torte[index]);
}

function getFields(message: MessageI, collatorName: string) {
  return [
    capitalize(collatorName),
    capitalize(message.transcriber?.name),
    message.name.toUpperCase() || '',
    capitalize(message.category) || 'Sermon',
    getDate(message.transcriber, 'dateIssued'),
    message.size || '',
    message.duration || '',
    getDate(message.transcriber, 'dateReturned'),
    capitalize(message.transcriptEditor?.name),
    getDate(message.transcriptEditor, 'dateIssued'),
    getDate(message.transcriptEditor, 'dateReturned'),
  ];
}

export async function getExcel(
  buffer: Excel.Buffer,
  messages: MessageI[],
  collatorName: string
) {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(buffer);

  updateSummary(workbook, messages);

  const sheet = workbook.getWorksheet('Breakdown');
  const rows = messages.map((m) => getFields(m, collatorName));

  const { table } = sheet.getTable('MyTable') as any;
  sheet.removeTable('MyTable');
  sheet.addTable({
    ...table,
    ref: 'A1',
    name: 'MyTable',
    headerRow: true,
    columns,
    rows,
  });

  return await workbook.xlsx.writeBuffer();
}
