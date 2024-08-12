export interface User {
  id: string;
  username: string;
}

export enum ChatState {
  Idle = 'idle',
  Waiting = 'waiting',
  Chatting = 'chatting',
}