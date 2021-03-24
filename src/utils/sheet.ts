import xlsx from 'xlsx';
import { saveAs } from 'file-saver';
import { MessageI } from '../types';
import { capitalize } from '.';

export const collectData = (
  e: any,
  messages: MessageI[],
  collatorName: string
) => {
  const f = e.target.files[0];

  const reader = new FileReader();

  reader.onload = (e: any) => {
    const data = e.target.result;
    const wb = xlsx.read(data, { type: 'binary' });
    createSheet(wb, messages, collatorName);
  };

  reader.readAsBinaryString(f);
};

const s2ab = (s: any) => {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
};

export const createSheet = (
  wb: xlsx.WorkBook,
  messages: MessageI[],
  collatorName: string
) => {
  const sheetName = wb.SheetNames[1];
  // const wb = xlsx.utils.book_new();

  wb.Props = {
    Title: collatorName + "'s Report",
    Subject: 'Report Sheet',
    Author: 'Ugochukwu',
    CreatedDate: new Date(),
  };

  // const wk_data = [getColumnNames(), ...getData(messages, collatorName)];
  const wk_data = getData(messages, collatorName);

  const ws = xlsx.utils.aoa_to_sheet(wk_data);
  wb.Sheets[sheetName] = ws;

  const wbout = xlsx.write(wb, { bookType: 'xlsx', type: 'binary' });

  saveAs(
    new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
    'Collator_Ugochukwu.xlsx'
  );
};

const getColumnNames = () => [
  'Collator',
  'Transcriber',
  'File Name',
  'Category',
  'Date Issued [T]',
  'Size (MB)',
  'Duration (Mins)',
  'Date Returned [TE]',
  'Transcript Editor',
  'Date Issued [TE]',
  'Date Returned [TE]',
];

const getData = (messages: MessageI[], collatorName: string) => {
  collatorName = capitalize(collatorName);
  return messages.map((m) => [collatorName, 'Transcriber', m.name, 'Sermon']);
};
