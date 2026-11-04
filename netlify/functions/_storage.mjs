import fs from 'node:fs/promises';
import path from 'node:path';
import { connectLambda, getStore } from '@netlify/blobs';

const hasBlobsContext = () =>
  Boolean(globalThis.netlifyBlobsContext || process.env.NETLIFY_BLOBS_CONTEXT);
const localFile = path.join(process.cwd(), 'data', 'submissions.json');

export function connectStorage(event) {
  if (hasBlobsContext()) return;
  try {
    connectLambda(event);
  } catch {
    // Outside Netlify the JSON file is used instead.
  }
}

async function readLocal() {
  try {
    return JSON.parse(await fs.readFile(localFile, 'utf8'));
  } catch {
    return { contact: [], admission: [] };
  }
}

async function writeLocal(data) {
  await fs.mkdir(path.dirname(localFile), { recursive: true });
  await fs.writeFile(localFile, JSON.stringify(data, null, 2));
}

function store() {
  return getStore({ name: 'submissions', consistency: 'strong' });
}

export async function readSubmissions() {
  if (!hasBlobsContext()) return readLocal();
  const blobs = store();
  return {
    contact: (await blobs.get('contact', { type: 'json' })) || [],
    admission: (await blobs.get('admission', { type: 'json' })) || []
  };
}

export async function writeSubmissions(data) {
  if (!hasBlobsContext()) return writeLocal(data);
  const blobs = store();
  await blobs.setJSON('contact', data.contact);
  await blobs.setJSON('admission', data.admission);
}
