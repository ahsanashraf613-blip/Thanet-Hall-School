import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');
const submissionsFile = path.join(dataDir, 'submissions.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(submissionsFile)) {
  fs.writeFileSync(submissionsFile, JSON.stringify({ contact: [], admission: [] }, null, 2));
}

function readSubmissions() {
  try {
    const raw = fs.readFileSync(submissionsFile, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    return { contact: [], admission: [] };
  }
}

function writeSubmissions(data) {
  fs.writeFileSync(submissionsFile, JSON.stringify(data, null, 2));
}

function sanitizeString(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Thanet Hall School API is running.' });
});

app.get('/api/submissions', (req, res) => {
  const submissions = readSubmissions();
  res.json(submissions);
});

app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body || {};
  const cleanName = sanitizeString(name);
  const cleanEmail = sanitizeString(email);
  const cleanPhone = sanitizeString(phone);
  const cleanMessage = sanitizeString(message);

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
  }

  const submissions = readSubmissions();
  const entry = {
    id: Date.now(),
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    message: cleanMessage,
    createdAt: new Date().toISOString()
  };

  submissions.contact.push(entry);
  writeSubmissions(submissions);

  return res.status(201).json({
    success: true,
    message: 'Your message has been sent successfully.',
    data: entry
  });
});

app.post('/api/admission', (req, res) => {
  const { fullName, parentName, email, phone, studentName, grade, message } = req.body || {};
  const cleanFullName = sanitizeString(fullName);
  const cleanParentName = sanitizeString(parentName);
  const cleanEmail = sanitizeString(email);
  const cleanPhone = sanitizeString(phone);
  const cleanStudentName = sanitizeString(studentName);
  const cleanGrade = sanitizeString(grade);
  const cleanMessage = sanitizeString(message);

  if (!cleanFullName || !cleanEmail || !cleanPhone || !cleanStudentName || !cleanGrade) {
    return res.status(400).json({ success: false, message: 'Please complete all required admission fields.' });
  }

  const submissions = readSubmissions();
  const entry = {
    id: Date.now(),
    fullName: cleanFullName,
    parentName: cleanParentName,
    email: cleanEmail,
    phone: cleanPhone,
    studentName: cleanStudentName,
    grade: cleanGrade,
    message: cleanMessage,
    createdAt: new Date().toISOString()
  };

  submissions.admission.push(entry);
  writeSubmissions(submissions);

  return res.status(201).json({
    success: true,
    message: 'Admission inquiry submitted successfully.',
    data: entry
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/admission', (req, res) => {
  res.sendFile(path.join(__dirname, 'admission.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Thanet Hall School app running on http://localhost:${PORT}`);
});
