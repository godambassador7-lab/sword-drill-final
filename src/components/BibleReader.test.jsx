import { render, screen, waitFor } from '@testing-library/react';
import BibleReader, { parseBibleReference } from './BibleReader';
import { getEsvChapter } from '../services/esvApiService';

jest.mock('../services/esvApiService', () => ({
  ESV_TRANSLATION: 'ESV',
  getEsvChapter: jest.fn()
}));

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

describe('BibleReader reference navigation', () => {
  beforeEach(() => {
    localStorage.clear();
    getEsvChapter.mockReset();
  });

  test('shows only the requested verses from an initial reference', async () => {
    getEsvChapter.mockResolvedValue([
      { verse: 15, text: 'Outside the requested range.' },
      { verse: 16, text: 'Requested verse sixteen.' },
      { verse: 17, text: 'Requested verse seventeen.' },
      { verse: 18, text: 'Also outside the requested range.' }
    ]);

    render(
      <BibleReader
        selectedTranslation="ESV"
        initialReference="John 3:16-17"
        userData={{}}
        onUpdateUserData={jest.fn()}
      />
    );

    expect(await screen.findByText('Requested verse sixteen.')).toBeInTheDocument();
    expect(screen.getByText('Requested verse seventeen.')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Outside the requested range.')).not.toBeInTheDocument();
      expect(screen.queryByText('Also outside the requested range.')).not.toBeInTheDocument();
    });
    expect(screen.getByText('John 3:16-17')).toBeInTheDocument();
  });
});
