export type UserRole = 'student' | 'parent';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  createdAt: number;
}

export interface UserProfile {
  userId: string;
  birthYear?: number;
  grade?: string;
  dailyGoalMinutes: number;
  dailyGoalWords: number;
  tokens: number;
  xp: number;
  linkedParentId?: string;
  streakDays: number;
  lastStudyDate?: string; // YYYY-MM-DD
}

export interface Word {
  id: string;
  word: string;
  meaning: string;
  exampleSentence?: string;
  pronunciationUrl?: string; // TTS or Audio
  tags: string[];
}

export interface WordSet {
  id: string;
  title: string;
  description?: string;
  source: string; // 'textbook', 'exam', 'custom'
  words: Word[];
}

export interface UserWordState {
  userId: string;
  wordId: string;
  easiness: number; // Default 2.5
  repetitions: number;
  interval: number; // Days
  nextReviewDate: number; // Timestamp
  lastReviewedAt: number; // Timestamp
  mastered: boolean;
}

export interface StudySession {
  id: string;
  userId: string;
  type: 'flashcard' | 'test' | 'listen';
  startTime: number;
  durationSeconds: number;
  results: {
    correctCount: number;
    wrongCount: number;
    xpEarned: number;
    tokensEarned: number;
  };
}

export interface Reward {
  id: string;
  name: string;
  cost: number;
  description: string;
  icon: string;
  requiresApproval: boolean;
}

export interface RewardRequest {
  id: string;
  userId: string; // Student
  rewardId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: number;
  responseDate?: number;
  message?: string;
}
