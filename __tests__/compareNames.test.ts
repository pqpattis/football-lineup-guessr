import { compareNames } from '@/components/GuessingModal';

describe('compareNames', () => {
  const answer = 'MODRIC';

  test('should return all correct when the guess matches the answer', () => {
    const feedback = compareNames('MODRIC', answer);
    expect(feedback.every(f => f.status === 'correct')).toBe(true);
  });

  test('should identify absent letters', () => {
    const feedback = compareNames('TROMTA', answer);
    // 'T' and 'A' are absent
    expect(feedback.find(f => f.letter === 'T')?.status).toBe('absent');
    expect(feedback.find(f => f.letter === 'A')?.status).toBe('absent');
  });

  test('should handle misplaced (present) letters correctly', () => {
    const feedback = compareNames('DOCIRM', answer);
    expect(feedback[0].status).toBe('present'); // D is misplaced
    expect(feedback[1].status).toBe('correct'); // O is correct
    expect(feedback[2].status).toBe('present'); // C is misplaced
    expect(feedback[3].status).toBe('present'); // I is misplaced
    expect(feedback[4].status).toBe('present'); // R is misplaced
    expect(feedback[5].status).toBe('present'); // M is misplaced
  });
  
});