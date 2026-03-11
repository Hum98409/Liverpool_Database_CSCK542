import { describe, test, expect, vi } from 'vitest';
import { downloadCsv } from './csv';

describe('downloadCsv', () => {

  test('does nothing when rows are empty', () => {
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL');

    downloadCsv('empty.csv', []);

    expect(createObjectURLSpy).not.toHaveBeenCalled();
  });

  test('creates an object URL when rows exist', () => {
    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:url');

    const revokeObjectURLSpy = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});

    const realCreateElement = document.createElement.bind(document);

    const link = realCreateElement('a');
    const clickSpy = vi.spyOn(link, 'click').mockImplementation(() => {});

    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') {
        return link;
      }
      return realCreateElement(tag);
    });

    downloadCsv('report.csv', [
      { name: 'Alice', score: 78 },
      { name: 'Bob', score: 81 },
    ]);

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalled();
  });

});