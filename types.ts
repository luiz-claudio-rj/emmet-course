export enum GameStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type Language = 'en' | 'pt-BR' | 'es';

export type GameMode = 'LEARNING' | 'CHALLENGE';

export type Difficulty = 'JUNIOR' | 'PLENO' | 'SENIOR';

export interface Level {
  id: number;
  title: string;
  difficulty: Difficulty;
  description: string; // Used for short context if needed
  concept: string; // The Emmet concept being taught
  examples: string[]; // List of example Emmet strings
  targetHtml: string; // The HTML the user needs to generate
  hint: string;
}

export interface ValidationResponse {
  isValid: boolean;
  userHtml: string;
  message?: string;
}

export interface UITranslation {
  title: string;
  level: string;
  inputLabel: string;
  inputPlaceholder: string;
  runButton: string;
  nextButton: string;
  processing: string;
  hintButton: string;
  hintPrefix: string;
  outputLabel: string;
  targetLabel: string;
  examplesLabel: string;
  conceptLabel: string;
  finishTitle: string;
  finishDesc: string;
  finishDescChallenge: string;
  nameLabel: string;
  generateDiploma: string;
  diplomaTitle: string;
  diplomaTitleChallenge: string;
  diplomaText: string;
  diplomaTextChallenge: string;
  timeLabel: string;
  download: string;
  restart: string;
  backToHome: string;
  errorInvalid: string;
  errorMismatch: string;
  errorConnection: string;
  matched: string;
  // Track Selection
  selectTrack: string;
  trackLearningTitle: string;
  trackLearningDesc: string;
  trackChallengeTitle: string;
  trackChallengeDesc: string;
  start: string;
  // Ranks
  rankJunior: string;
  rankPleno: string;
  rankSenior: string;
}