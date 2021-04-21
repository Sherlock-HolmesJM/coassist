import Excel from 'exceljs';
import { MessageI, T_And_TE } from '../types';
import range from './range';
import summary from './summary';
import capitalize from './capitalize';

const columns = [
  { name: 'Collator', filterButton: true },
  { name: 'Transcriber', filterButton: true },
  { name: 'File Name', filterButton: true },
  { name: 'Category', filterButton: true },
  { name: 'Date Issued [T]', filterButton: true },
  { name: 'Size (MB)', filterButton: true },
  { name: 'Duration (Mins)', filterButton: true },
  { name: 'Date Returned [T]', filterButton: true },
  { name: 'Transcript Editor', filterButton: true },
  { name: 'Date Issued [TE]', filterButton: true },
  { name: 'Date Returned [TE]', filterButton: true },
];

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
    Math.floor(message.duration / 60) || '',
    getDate(message.transcriber, 'dateReturned'),
    capitalize(message.transcriptEditor?.name),
    getDate(message.transcriptEditor, 'dateIssued'),
    getDate(message.transcriptEditor, 'dateReturned'),
  ];
}

async function getExcel(
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

export { getExcel };
export default getExcel;
