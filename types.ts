
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

export interface Player {
  id: string;
  team_id: string;
  name: string;
  number?: number;
  goals: number;
  yellow_cards: number;
  red_cards: number;
  team_name?: string; // Join helper
}

export interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  created_at?: string;
}

export interface SliderSettings {
  id?: string;
  before_image_url: string;
  after_image_url: string;
}

export interface LocationSettings {
  id?: string;
  map_url: string;
  image_url: string;
  stadium_name?: string;
}

export interface SiteSettings {
  id?: string;
  header_logo_url: string;
  footer_logo_url: string;
}

export interface Match {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: number;
  away_score: number;
  date: string;
  time: string;
  status: 'scheduled' | 'live' | 'finished';
  group: 'A' | 'B';
  location: string;
  home_team_name?: string; 
  away_team_name?: string; 
  home_logo?: string;
  away_logo?: string;
}

export interface Craque {
  id?: string;
  name: string;
  team: string;
  position: string;
  match_desc: string; 
  photo_url: string;
  round: string;
  created_at?: string;
}

export interface SelectionPlayer {
  name: string;
  team_name: string;
  photo_url: string;
  position: string;
}

export interface SelectionRecord {
  id?: string;
  round: string;
  players: SelectionPlayer[];
  created_at?: string;
}

export interface Broadcast {
  id?: string;
  title: string;
  team_a: string;
  team_b: string;
  date_info: string;
  youtube_url: string;
  narration: string;
  is_active: boolean;
  location: string;
  cover_url?: string;
}
