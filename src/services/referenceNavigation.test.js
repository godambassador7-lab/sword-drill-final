import { normalizeReferenceForReader } from './referenceNavigation';

describe('normalizeReferenceForReader', () => {
  test.each([
    ['John 3:16', 'John 3:16'],
    ['John 3:16-18', 'John 3:16-18'],
    ['John 3:16-3:18', 'John 3:16-18'],
    ['John 3', 'John 3'],
    ['John 3:16; Romans 8:28', 'John 3:16']
  ])('normalizes %s for the reader', (reference, expected) => {
    expect(normalizeReferenceForReader(reference)).toBe(expected);
  });

  test('falls back to the first verse for a cross-chapter range', () => {
    expect(normalizeReferenceForReader('John 3:36-4:2')).toBe('John 3:36');
  });
});
