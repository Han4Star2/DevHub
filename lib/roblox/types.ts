export interface RobloxGameDetails {
  id: number; // universeId
  rootPlaceId: number;
  name: string;
  description: string | null;
  creator: {
    id: number;
    name: string;
    type: string;
    hasVerifiedBadge?: boolean;
  };
  playing: number; // current CCU
  visits: number;
  favoritedCount: number;
  genre?: string;
  genre_l1?: string;
  updated: string;
}

export interface RobloxGamesResponse {
  data: RobloxGameDetails[];
}

export interface RobloxGameVotes {
  id: number; // universeId
  upVotes: number;
  downVotes: number;
}

export interface RobloxVotesResponse {
  data: RobloxGameVotes[];
}

export interface RobloxGameIcon {
  targetId: number; // universeId
  state: string;
  imageUrl: string | null;
}

export interface RobloxIconsResponse {
  data: RobloxGameIcon[];
}
