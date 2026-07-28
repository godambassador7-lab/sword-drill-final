import { parseBibleReference } from './BibleReader';

const books = [
  { name: 'John', abbr: 'Jn', chapters: 21 },
  { name: '1 Corinthians', abbr: '1Cor', chapters: 16 },
  { name: 'Song of Solomon', abbr: 'Song', chapters: 8 }
];

describe('parseBibleReference', () => {
  test.each([
    ['John 3:16', 'John', 3, 16, 16],
    ['Jn 3', 'John', 3, null, null],
    ['1 Corinthians 13:4-7', '1 Corinthians', 13, 4, 7],
    ['1Cor 13:4', '1 Corinthians', 13, 4, 4],
    ['Song of Solomon 2:1', 'Song of Solomon', 2, 1, 1]
  ])('parses %s', (reference, book, chapter, verse, endVerse) => {
    expect(parseBibleReference(reference, books)).toMatchObject({
      book: expect.objectContaining({ name: book }),
      chapter,
      verse,
      endVerse
    });
  });

  test.each(['', 'John', 'John 99:1', 'John 3:9-4', 'Unknown 1:1'])(
    'rejects invalid reference %s',
    (reference) => {
      expect(parseBibleReference(reference, books)).toBeNull();
    }
  );
});
