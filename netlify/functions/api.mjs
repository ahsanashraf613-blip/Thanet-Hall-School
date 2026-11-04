import {
  authConfigured,
  checkPassword,
  clearSessionCookie,
  createSessionCookie,
  readSession
} from './_auth.mjs';
import { readSubmissions, storageMode, writeSubmissions } from './_storage.mjs';

const json = (status, payload, headers = {}) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...headers
    }
  });

const readJsonBody = async (request) => {
  try {
    return await request.json();
  } catch {
    return null;
  }
};

const clean = (value) => (typeof value === 'string' ? value.trim() : '');

const routeOf = (request) => {
  const path = new URL(request.url).pathname;
  return path.split('/').filter(Boolean).pop() || '';
};

export default async (request) => {
  const route = routeOf(request);
  const method = request.method;
  const secure = new URL(request.url).protocol === 'https:';

  if (method === 'GET' && route === 'health') {
    return json(200, { status: 'ok', message: 'Thanet Hall School API is running.', storage: storageMode() });
  }

  if (method === 'POST' && route === 'login') {
    if (!authConfigured()) {
      return json(503, {
        success: false,
        message: 'Admin login is not configured. Set ADMIN_PASSWORD in the environment.'
      });
    }

    const body = await readJsonBody(request);
    if (!body || !checkPassword(body.password)) {
      return json(401, { success: false, message: 'Incorrect password.' });
    }

    return json(200, { success: true, message: 'Signed in.' }, {
      'Set-Cookie': createSessionCookie({ secure })
    });
  }

  if (method === 'POST' && route === 'logout') {
    return json(200, { success: true, message: 'Signed out.' }, {
      'Set-Cookie': clearSessionCookie({ secure })
    });
  }

  if (method === 'GET' && route === 'submissions') {
    if (!authConfigured()) {
      return json(503, {
        success: false,
        message: 'Admin login is not configured. Set ADMIN_PASSWORD in the environment.'
      });
    }
    if (!readSession(request.headers.get('cookie'))) {
      return json(401, { success: false, message: 'Authentication required.' });
    }
    return json(200, await readSubmissions());
  }

  if (method === 'POST' && (route === 'contact' || route === 'admission')) {
    let body;
    try {
      body = await request.json();
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
