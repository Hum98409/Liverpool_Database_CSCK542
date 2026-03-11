import { sanitizeHtml } from './sanitize';

describe('sanitizeHtml', () => {
  test('removes dangerous script content', () => {
    const dirty = '<img src=x onerror=alert(1) /><script>alert(1)</script><p>Hello</p>';
    const clean = sanitizeHtml(dirty);

    expect(clean).toContain('<img src="x">');
    expect(clean).toContain('<p>Hello</p>');
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('onerror');
  });
});