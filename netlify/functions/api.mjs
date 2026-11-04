import { connectStorage, readSubmissions, writeSubmissions } from './_storage.mjs';

const json = (statusCode, payload) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store'
  },
  body: JSON.stringify(payload)
});

const clean = (value) => (typeof value === 'string' ? value.trim() : '');

function parseBody(event) {
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64').toString('utf8')
    : event.body || '';
  return raw ? JSON.parse(raw) : {};
}

function routeOf(event) {
  const url = new URL(event.rawUrl || `https://local${event.path || '/'}`);
  return url.pathname.replace(/^\/api\//, '').replace(/^\/+/, '').replace(/\/$/, '');
}

export const handler = async (event) => {
  connectStorage(event);

  const route = routeOf(event);
  const method = event.httpMethod;

  if (method === 'GET' && route === 'health') {
    return json(200, { status: 'ok', message: 'Thanet Hall School API is running.' });
  }

  if (method === 'GET' && route === 'submissions') {
    return json(200, await readSubmissions());
  }

  if (method === 'POST' && (route === 'contact' || route === 'admission')) {
    let body;
    try {
      body = parseBody(event);
    } catch {
      return json(400, { success: false, message: 'Invalid JSON body.' });
    }

    const submissions = await readSubmissions();

    if (route === 'contact') {
      const name = clean(body.name);
      const email = clean(body.email);
      const phone = clean(body.phone);
      const message = clean(body.message);

      if (!name || !email || !message) {
        return json(400, { success: false, message: 'Name, email, and message are required.' });
      }

      const entry = {
        id: Date.now(),
        name,
        email,
        phone,
        message,
        createdAt: new Date().toISOString()
      };

      submissions.contact.push(entry);
      await writeSubmissions(submissions);

      return json(201, {
        success: true,
        message: 'Your message has been sent successfully.',
        data: entry
      });
    }

    const fullName = clean(body.fullName) || clean(body.parentName);
    const parentName = clean(body.parentName);
    const email = clean(body.email);
    const phone = clean(body.phone);
    const studentName = clean(body.studentName);
    const grade = clean(body.grade);
    const message = clean(body.message);

    if (!fullName || !email || !phone || !studentName || !grade) {
      return json(400, { success: false, message: 'Please complete all required admission fields.' });
    }

    const entry = {
      id: Date.now(),
      fullName,
      parentName,
      email,
      phone,
      studentName,
      grade,
      message,
      createdAt: new Date().toISOString()
    };

    submissions.admission.push(entry);
    await writeSubmissions(submissions);

    return json(201, {
      success: true,
      message: 'Admission inquiry submitted successfully.',
      data: entry
    });
  }

  return json(404, { success: false, message: 'Endpoint not found.' });
};
