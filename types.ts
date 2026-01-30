
export interface Team {
  id: string;
  name: string;
  logo_url: string;
  group: 'A' | 'B';
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
}

export interface Match {
  id: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  date: string;
  time: string;
  status: 'scheduled' | 'live' | 'finished';
  group: string;
  highlights?: string;
}

export interface Craque {
  id: string;
  name: string;
  team: string;
  position: string;
  location: string;
  photo_url: string;
  goals: number;
  assists: number;
  rating: number;
  instagram?: string;
}

export interface SelectionPlayer {
  id: string;
  name: string;
  position: string; // e.g., 'GK', 'LB', 'CB', 'RB', 'CM', 'CDM', 'CAM', 'LW', 'ST', 'RW'
  photo_url: string;
  team_name: string;
  grid_pos: string; // Tailwind grid classes for positioning on the pitch
}
