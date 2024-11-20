export interface IMatch {
  id?: string;
  gameId?: string;
  inviteKey?: string;
  isActive?: boolean;
  status?: string;
  matchDuration?: number;
  timerStart?: Date;
  avarageLevel?: number;
  created_at?: Date;
  updated_at?: Date;
  game?: IGame;
  players?: IPlayer[];
  kokos?: IKokos[];
}

export interface IGame {
  id?: string;
  name?: string;
  description?: string;
  status?: string;
  max_players?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface IPlayer {
  matchId?: string;
  sessionId?: string;
  isActive?: boolean;
  level?: number;
  winRate?: number;
  created_at?: Date;
  updated_at?: Date;
  user?: {
    id: string;
    sessionId: string;
    username: string;
    created_at: Date;
    updated_at: Date;
  };
}

export interface IKokos {
  matchId?: string;
  key?: string;
  checked?: boolean;
  lastCheckedByUserId?: string;
  isPermanentlyProtected?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
