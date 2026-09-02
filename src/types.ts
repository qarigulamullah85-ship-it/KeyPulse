export interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'course' | 'custom';
  gameType?: 'falling-words' | 'balloon';
}

export interface LessonResult {
  lessonId: number;
  wpm: number;
  accuracy: number;
  timestamp: number;
}

export interface UserStats {
  averageWpm: number;
  averageAccuracy: number;
  completedLessons: number[];
  totalTimeSeconds: number;
  history: LessonResult[];
}
