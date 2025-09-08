// Android modellerine uygun tip tanımları
export interface League {
  id: number; // Android: Long -> number
  externalId: number; // Android: Int -> number
  name: string;
  logo: string;
  country: string;
  season: number; // Android: Int -> number
}

export interface Team {
  id: number; // Android: Long -> number
  externalId: number; // Android: Int -> number
  name: string;
  logo: string;
  country: string;
  league?: League; // Android: LeagueDto? -> League?
}

export interface Match {
  id: number; // Android: Long -> number
  matchId: number; // Android: Int -> number
  date: string;
  status: string;
  homeScore?: number; // Android: Int? -> number?
  awayScore?: number; // Android: Int? -> number?
  homeTeam?: Team; // Android: TeamDto? -> Team?
  awayTeam?: Team; // Android: TeamDto? -> Team?
  league?: League; // Android: LeagueDto? -> League?
  elapsed?: number; // Android: Int? -> number?
}

export interface EventTime {
  elapsed: number;
  extra?: number;
}

export interface EventTeam {
  id: number;
  name: string;
  logo: string;
}

export interface EventPlayer {
  id?: number;
  name?: string;
}

export interface EventAssist {
  id?: number;
  name?: string;
}

export interface MatchEvent {
  time: EventTime;
  team: EventTeam;
  player: EventPlayer;
  assist: EventAssist;
  type: string; // "Goal", "Card", "subst"
  detail: string; // "Normal Goal", "Yellow Card", "Substitution 1", etc.
  comments?: string;
}

export interface MatchEventResponse {
  response: MatchEvent[];
}

// Android TeamStatisticsDto'ya uygun
export interface TeamStatistics {
  teamId: number; // Android: Long -> number
  teamName?: string; // Android: String? -> string?
  teamLogo?: string; // Android: String? -> string?
  possession?: number; // Android: Int? -> number?
  shots?: number; // Android: Int? -> number?
  shotsOnTarget?: number; // Android: Int? -> number?
  corners?: number; // Android: Int? -> number?
  fouls?: number; // Android: Int? -> number?
  yellowCards?: number; // Android: Int? -> number?
  redCards?: number; // Android: Int? -> number?
  offsides?: number; // Android: Int? -> number?
  passes?: number; // Android: Int? -> number?
  passAccuracy?: number; // Android: Int? -> number?
  saves?: number; // Android: Int? -> number?
}

// Android MatchStatisticsDto'ya uygun
export interface MatchStatistics {
  matchId: number; // Android: Long -> number
  homeTeamStats?: TeamStatistics; // Android: TeamStatisticsDto? -> TeamStatistics?
  awayTeamStats?: TeamStatistics; // Android: TeamStatisticsDto? -> TeamStatistics?
  homeScore?: number; // Android: Int? -> number?
  awayScore?: number; // Android: Int? -> number?
}

// Android ApiTeamDto'ya uygun
export interface ApiTeam {
  id: number; // Android: Long -> number
  name: string;
  logo: string;
}

// Android ApiStatisticDto'ya uygun
export interface ApiStatistic {
  type: string;
  value?: string; // Android: String? -> string?
}

// Android ApiTeamStatisticsDto'ya uygun
export interface ApiTeamStatistics {
  team: ApiTeam;
  statistics: ApiStatistic[];
}

// Android ApiMatchStatisticsDto'ya uygun
export interface ApiMatchStatisticsResponse {
  response: ApiTeamStatistics[];
}

// Standings API types
export interface StandingsApiResponse {
  response: StandingsWrapper[];
}

export interface StandingsWrapper {
  league: LeagueStandings;
}

export interface LeagueStandings {
  id: number;
  name: string;
  country: string;
  season: number;
  standings: TeamStanding[][]; // nested array
}

export interface TeamStanding {
  rank: number;
  team: StandingsTeamInfo;
  points: number;
  goalsDiff: number;
  all: Record;
  form?: string;
  description?: string;
}

export interface StandingsTeamInfo {
  id: number;
  name: string;
  logo: string;
}

export interface Record {
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals: Goals;
}

export interface Goals {
  forGoals: number;
  against: number;
}