export enum AppView {
  CHATBOT = 'CHATBOT',
  IMAGE_GENERATOR = 'IMAGE_GENERATOR',
  HUMANIZER = 'HUMANIZER',
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
