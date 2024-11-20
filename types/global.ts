declare global {
  type TSessionId = string | undefined;
  type TGameId = string | undefined;

  interface ITotalPoints {
    sessionId: string;
    total: number;
  }

  interface IUser {
    id: string;
    sessionId: string;
    username: string;
    photo_url: string;
    twitterUsername: string;
    twitterUserId: string;
    email: string;
    referrals?: any[];
    created_at: Date;
    updated_at: Date;
  }
  interface PvPGameKokoType {
    checked: boolean;
    score: number;
    key: number;
    lastCheckedByUserId?: TSessionId;
    matchId?: string;
  }
  interface MainGameKokoType {
    checked: boolean;
    score: number;
    key: number;
    lastCheckedByUserId?: TSessionId;
    isPermanentlyProtected?: boolean;
  }

  type Setter<T> = React.Dispatch<React.SetStateAction<T>>;
}

export {};
