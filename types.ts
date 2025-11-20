
export enum ClassLevel {
  S1 = 'S1',
  S2 = 'S2',
  S3 = 'S3',
  S4 = 'S4',
}

export interface Subject {
  id: string;
  name: string;
  iconName: string; // Used to map to Lucide icons or logic
  imageSeed: string; // For consistent placeholder images
  description: string;
}

export interface Topic {
  id: string;
  name: string;
  classLevel: ClassLevel;
  subjectId: string;
}

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

export interface NoteContent {
  htmlContent: string;
  topicName: string;
  subjectName: string;
  classLevel: string;
  sources: SearchResult[];
  generatedImage?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface SearchState {
  isLoading: boolean;
  results: SearchResult[];
  query: string;
  error: string | null;
}