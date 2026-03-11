import DOMPurify from 'dompurify';
export function sanitizeHtml(input: string) {
    return DOMPurify.sanitize(input);
}