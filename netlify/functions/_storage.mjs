import fs from 'node:fs/promises';
import path from 'node:path';
import { getStore } from '@netlify/blobs';

const hasBlobsContext = () =>
  Boolean(globalThis.netlifyBlobsContext || process.env.NETLIFY_BLOBS_CONTEXT);
const localFile = path.join(process.cwd(), 'data', 'submissions.json');

function strongReadsAvailable() {
  if (globalThis.netlifyBlobsContext?.uncachedEdgeURL) return true;
  const encoded = process.env.NETLIFY_BLOBS_CONTEXT;
  if (!encoded) return false;
  try {
    const context = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
    return Boolean(context.uncachedEdgeURL);
  } catch {
    return false;
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
  return getStore({
    name: 'submissions',
    consistency: strongReadsAvailable() ? 'strong' : 'eventual'
  });
}

export function storageMode() {
  if (!hasBlobsContext()) return 'file';
  return strongReadsAvailable() ? 'blobs-strong' : 'blobs-eventual';
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
