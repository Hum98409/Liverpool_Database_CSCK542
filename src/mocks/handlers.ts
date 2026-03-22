// src/mocks/handlers.ts
// MSW request handlers for API mocking
import { http, HttpResponse } from 'msw';
// Import your mock data here
import { mockCredentials } from './data';

export const handlers = [
  // Example login handler
  http.post('http://localhost:8000/api/auth/login', async ({ request }) => {
    const { role, password } = await request.json();
    if (role === 'teacher' && password === mockCredentials.teacher) {
      return HttpResponse.json({ user: { role: 'teacher' } });
    }
    if (role === 'student' && password === mockCredentials.student) {
      return HttpResponse.json({ user: { role: 'student' } });
    }
    if (role === 'non_academic_staff' && password === mockCredentials.non_academic_staff) {
      return HttpResponse.json({ user: { role: 'non_academic_staff' } });
    }
    return HttpResponse.json({ message: 'Invalid role or password.' }, { status: 401 });
  }),
  // ...otros handlers de ejemplo...
];
