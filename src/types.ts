export interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'course' | 'custom' | 'programming';
  gameType?: 'falling-words' | 'balloon' | 'bomb' | 'puzzle' | 'kids';
}

export interface LessonResult {
  lessonId: number;
  wpm: number;
  accuracy: number;
  timestamp: number;
}

export interface TestResult {
  wpm: number;
  accuracy: number;
  duration: number; // 60 or 120
  timestamp: number;
}

export interface UserStats {
  avatar?: string;
  ninjaMode?: boolean;
  averageWpm: number;
  averageAccuracy: number;
  completedLessons: number[];
  totalTimeSeconds: number;
  history: LessonResult[];
  streak?: number;
  lastPlayDate?: string | null;
  badges?: string[];
  testHistory?: TestResult[];
}
