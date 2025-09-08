import axios from "axios";
import type {
  League,
  Team,
  Match,
  MatchEventResponse,
  ApiMatchStatisticsResponse,
  MatchStatistics,
  MatchEvent,
  StandingsApiResponse,
  TeamStanding
} from "../models/types";

declare const __API_BASE_URL__: string;

const api = axios.create({
  baseURL: "https://api.tahminai.com/api",
  withCredentials: true,
});


// ✅ Response interceptor (401 için)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⛔ Yetkisiz! Login sayfasına yönlendiriliyor...");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

//
// ==============================
// Mock Data (İstersen silinebilir)
// ==============================
const mockLeagues: League[] = [
  { id: 1, externalId: 39, name: "Premier League", logo: "https://media.api-sports.io/football/leagues/39.png", country: "England", season: 2023 },
  { id: 2, externalId: 140, name: "La Liga", logo: "https://media.api-sports.io/football/leagues/140.png", country: "Spain", season: 2023 },
];

const mockTeams: Team[] = [
  { id: 1, externalId: 33, name: "Manchester United", logo: "https://media.api-sports.io/football/teams/33.png", country: "England", league: mockLeagues[0] },
  { id: 2, externalId: 40, name: "Liverpool", logo: "https://media.api-sports.io/football/teams/40.png", country: "England", league: mockLeagues[0] },
];

const mockMatches: Match[] = [
  {
    id: 1,
    matchId: 1001,
    date: new Date().toISOString(),
    status: "LIVE",
    homeScore: 2,
    awayScore: 1,
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    league: mockLeagues[0],
    elapsed: 65,
  },
];

const mockStandings: TeamStanding[] = [
  {
    rank: 1,
    team: {
      id: 33,
      name: "Manchester City",
      logo: "https://media.api-sports.io/football/teams/50.png"
    },
    points: 45,
    goalsDiff: 25,
    form: "WWWWW",
    description: "Promotion - Champions League (Group Stage)",
    all: {
      played: 18,
      win: 14,
      draw: 3,
      lose: 1,
      goals: {
        forGoals: 42,
        against: 17
      }
    }
  },
  {
    rank: 2,
    team: {
      id: 40,
      name: "Liverpool",
      logo: "https://media.api-sports.io/football/teams/40.png"
    },
    points: 42,
    goalsDiff: 22,
    form: "WWLWW",
    description: "Promotion - Champions League (Group Stage)",
    all: {
      played: 18,
      win: 13,
      draw: 3,
      lose: 2,
      goals: {
        forGoals: 39,
        against: 17
      }
    }
  },
  {
    rank: 3,
    team: {
      id: 42,
      name: "Arsenal",
      logo: "https://media.api-sports.io/football/teams/42.png"
    },
    points: 40,
    goalsDiff: 18,
    form: "WLWWW",
    description: "Promotion - Champions League (Group Stage)",
    all: {
      played: 18,
      win: 12,
      draw: 4,
      lose: 2,
      goals: {
        forGoals: 35,
        against: 17
      }
    }
  },
  {
    rank: 4,
    team: {
      id: 49,
      name: "Chelsea",
      logo: "https://media.api-sports.io/football/teams/49.png"
    },
    points: 35,
    goalsDiff: 12,
    form: "LWWDW",
    description: "Promotion - Champions League (Group Stage)",
    all: {
      played: 18,
      win: 10,
      draw: 5,
      lose: 3,
      goals: {
        forGoals: 32,
        against: 20
      }
    }
  },
  {
    rank: 5,
    team: {
      id: 33,
      name: "Manchester United",
      logo: "https://media.api-sports.io/football/teams/33.png"
    },
    points: 32,
    goalsDiff: 8,
    form: "DWLWL",
    description: "Promotion - Europa League (Group Stage)",
    all: {
      played: 18,
      win: 9,
      draw: 5,
      lose: 4,
      goals: {
        forGoals: 28,
        against: 20
      }
    }
  }
];

//
// ==============================
// API Functions
// ==============================

// Ligleri getir
export const getLeagues = async (): Promise<League[]> => {
  try {
    const response = await api.get<League[]>("/leagues");
    return response.data;
  } catch (error) {
    console.error("Error fetching leagues, using mock data:", error);
    return mockLeagues;
  }
};

// Tüm takımları getir
export const getAllTeams = async (): Promise<Team[]> => {
  try {
    const response = await api.get<Team[]>("/teams");
    return response.data ?? [];
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
};

// Lig bazında takımları getir
export const getTeamsByLeague = async (leagueId: number): Promise<Team[]> => {
  try {
    const response = await api.get<Team[]>(`/teams/byLeague?leagueId=${leagueId}`);
    return response.data ?? [];
  } catch (error) {
    console.error("Error fetching teams by league:", error);
    return [];
  }
};

// Takıma göre maçları getir
export const getMatchesByTeam = async (teamId: number): Promise<Match[]> => {
  try {
    console.log(`Making API call to: /matches/byTeam?teamId=${teamId}`);
    const response = await api.get<Match[]>(`/matches/byTeam?teamId=${teamId}`);
    console.log('API response for matches by team:', response.data);
    return response.data ?? [];
  } catch (error: any) {
    console.error("Error fetching matches by team:", error);
    console.error("Error details:", error.response?.data || error.message);
    return [];
  }
};

// Aktif maçları getir
export const getActiveMatches = async (): Promise<Match[]> => {
  try {
    console.log("Fetching active matches from API...");
    const response = await api.get<Match[]>("/matches/active");

    console.log("API Response:", JSON.stringify(response.data, null, 2));

    if (!Array.isArray(response.data)) {
      console.warn("Unexpected API format:", response.data);
      return mockMatches;
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching active matches, using mock data:", error);
    return mockMatches;
  }
};

// Maç ID'ye göre getir
export const getMatchById = async (matchId: number): Promise<Match | null> => {
  try {
    const response = await api.get<Match>(`/matches/${matchId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching match by ID ${matchId}:`, error);
    return null;
  }
};

// Maç eventlerini getir
export const getMatchEvents = async (matchId: number): Promise<MatchEventResponse> => {
  try {
    const response = await api.get<MatchEventResponse>(`/matches/${matchId}/events`);
    return response.data ?? { response: [] };
  } catch (error) {
    console.error(`Error fetching match events for ${matchId}:`, error);
    return { response: [] };
  }
};

// Maç istatistiklerini getir
export const getMatchStatistics = async (matchId: number): Promise<MatchStatistics | null> => {
  try {
    const response = await api.get<ApiMatchStatisticsResponse>(`/matches/${matchId}/statistics`);
    const data = response.data;

    if (data && data.response && Array.isArray(data.response) && data.response.length >= 2) {
      const homeTeamData = data.response[0];
      const awayTeamData = data.response[1];
      
      // İstatistikleri parse et
      const parseStatValue = (stats: any[], type: string): number | undefined => {
        const stat = stats.find(s => s.type === type);
        return stat?.value ? parseInt(stat.value) || parseFloat(stat.value) : undefined;
      };
      
      return {
        matchId,
        homeTeamStats: {
          teamId: homeTeamData.team.id,
          teamName: homeTeamData.team.name,
          teamLogo: homeTeamData.team.logo,
          possession: parseStatValue(homeTeamData.statistics, 'Ball Possession'),
          shots: parseStatValue(homeTeamData.statistics, 'Total Shots'),
          shotsOnTarget: parseStatValue(homeTeamData.statistics, 'Shots on Goal'),
          corners: parseStatValue(homeTeamData.statistics, 'Corner Kicks'),
          fouls: parseStatValue(homeTeamData.statistics, 'Fouls'),
          yellowCards: parseStatValue(homeTeamData.statistics, 'Yellow Cards'),
          redCards: parseStatValue(homeTeamData.statistics, 'Red Cards'),
          offsides: parseStatValue(homeTeamData.statistics, 'Offsides'),
          passes: parseStatValue(homeTeamData.statistics, 'Total passes'),
          passAccuracy: parseStatValue(homeTeamData.statistics, 'Passes %'),
          saves: parseStatValue(homeTeamData.statistics, 'Goalkeeper Saves')
        },
        awayTeamStats: {
          teamId: awayTeamData.team.id,
          teamName: awayTeamData.team.name,
          teamLogo: awayTeamData.team.logo,
          possession: parseStatValue(awayTeamData.statistics, 'Ball Possession'),
          shots: parseStatValue(awayTeamData.statistics, 'Total Shots'),
          shotsOnTarget: parseStatValue(awayTeamData.statistics, 'Shots on Goal'),
          corners: parseStatValue(awayTeamData.statistics, 'Corner Kicks'),
          fouls: parseStatValue(awayTeamData.statistics, 'Fouls'),
          yellowCards: parseStatValue(awayTeamData.statistics, 'Yellow Cards'),
          redCards: parseStatValue(awayTeamData.statistics, 'Red Cards'),
          offsides: parseStatValue(awayTeamData.statistics, 'Offsides'),
          passes: parseStatValue(awayTeamData.statistics, 'Total passes'),
          passAccuracy: parseStatValue(awayTeamData.statistics, 'Passes %'),
          saves: parseStatValue(awayTeamData.statistics, 'Goalkeeper Saves')
        }
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching match statistics:", error);
    return null;
  }
};

// Belirli tarih aralığındaki maçları getir
export const getAllMatches = async (startDate: string, endDate: string): Promise<Match[]> => {
  try {
    const response = await api.get<Match[]>(`/matches/byDate?startDate=${startDate}&endDate=${endDate}`);
    return response.data ?? [];
  } catch (error) {
    console.error("Error fetching all matches:", error);
    return [];
  }
};

// Lig puan durumunu getir

export const getStandingsByLeague = async (
  leagueId: number,
  season: number = 2025
): Promise<TeamStanding[]> => {
  try {
    const response = await api.get<{
      id: number;
      name: string;
      country: string;
      season: number;
      standings: TeamStanding[][];
    }>(`/standings/byLeague?leagueId=${leagueId}&season=${season}`);

    console.log("Standings API raw:", response.data);

    const standings = response.data?.standings;

    if (Array.isArray(standings) && standings.length > 0) {
      return standings[0]; // İlk tablo (genelde lig sıralaması)
    }

    console.warn("Standings boş geldi, mock data dönüyorum...");
    return mockStandings;
  } catch (error) {
    console.error("Error fetching standings:", error);
    return mockStandings;
  }
};


