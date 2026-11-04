import fs from 'node:fs/promises';
import path from 'node:path';
import { getStore } from '@netlify/blobs';

const useBlobs = Boolean(process.env.NETLIFY_BLOBS_CONTEXT);
const localFile = path.join(process.cwd(), 'data', 'submissions.json');

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
  if (!useBlobs) return readLocal();
  const blobs = store();
  return {
    contact: (await blobs.get('contact', { type: 'json' })) || [],
    admission: (await blobs.get('admission', { type: 'json' })) || []
  };
}

export async function writeSubmissions(data) {
  if (!useBlobs) return writeLocal(data);
  const blobs = store();
  await blobs.setJSON('contact', data.contact);
  await blobs.setJSON('admission', data.admission);
}
