import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { getMatchById, getMatchStatistics, getMatchEvents } from '../services/api';
import type { Match, MatchStatistics, MatchEventResponse } from '../models/types';

interface MatchData {
  id: number;
  homeTeam: {
    name: string;
    logo: string;
  };
  awayTeam: {
    name: string;
    logo: string;
  };
  homeScore: number;
  awayScore: number;
  status: string;
  elapsed?: number;
  date: string;
}

interface StatisticsData {
  homePossession: number;
  awayPossession: number;
  homeShots: number;
  awayShots: number;
  homeShotsOnTarget: number;
  awayShotsOnTarget: number;
  homeCorners: number;
  awayCorners: number;
  homeFouls: number;
  awayFouls: number;
  homeYellowCards: number;
  awayYellowCards: number;
  homeRedCards: number;
  awayRedCards: number;
}

interface EventData {
  id: number;
  type: string;
  time: number;
  team: string;
  player: string;
  description: string;
}

const MatchStatisticsPage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const { colors } = useTheme();
  const navigate = useNavigate();
  
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (matchId) {
      fetchAllData();
      const interval = setInterval(() => fetchAllDataQuiet(), 30000);
      return () => clearInterval(interval);
    }
  }, [matchId]);

  const fetchAllDataQuiet = async () => {
    try {
      setError(null);
      
      const matchIdNum = Number(matchId);
      
      // Paralel olarak tüm verileri çek
      const [matchData, statisticsData, eventsData] = await Promise.all([
        getMatchById(matchIdNum),
        getMatchStatistics(matchIdNum),
        getMatchEvents(matchIdNum)
      ]);

      if (!matchData) {
        throw new Error('Maç verisi alınamadı');
      }

      // Match verisini MatchData formatına dönüştür
      const formattedMatchData: MatchData = {
        id: matchData.id,
        homeTeam: {
          name: matchData.homeTeam?.name || 'Ev Sahibi',
          logo: matchData.homeTeam?.logo || ''
        },
        awayTeam: {
          name: matchData.awayTeam?.name || 'Deplasman',
          logo: matchData.awayTeam?.logo || ''
        },
        homeScore: matchData.homeScore || 0,
        awayScore: matchData.awayScore || 0,
        status: matchData.status || 'NS',
        elapsed: matchData.elapsed,
        date: matchData.date
      };
      
      setMatchData(formattedMatchData);

      if (statisticsData) {
        // İstatistik verisini StatisticsData formatına dönüştür
        const formattedStats: StatisticsData = {
          homePossession: statisticsData.homeTeamStats?.possession || 50,
          awayPossession: statisticsData.awayTeamStats?.possession || 50,
          homeShots: statisticsData.homeTeamStats?.shots || 0,
          awayShots: statisticsData.awayTeamStats?.shots || 0,
          homeShotsOnTarget: statisticsData.homeTeamStats?.shotsOnTarget || 0,
          awayShotsOnTarget: statisticsData.awayTeamStats?.shotsOnTarget || 0,
          homeCorners: statisticsData.homeTeamStats?.corners || 0,
          awayCorners: statisticsData.awayTeamStats?.corners || 0,
          homeFouls: statisticsData.homeTeamStats?.fouls || 0,
          awayFouls: statisticsData.awayTeamStats?.fouls || 0,
          homeYellowCards: statisticsData.homeTeamStats?.yellowCards || 0,
          awayYellowCards: statisticsData.awayTeamStats?.yellowCards || 0,
          homeRedCards: statisticsData.homeTeamStats?.redCards || 0,
          awayRedCards: statisticsData.awayTeamStats?.redCards || 0
        };
        setStatistics(formattedStats);
      }

      if (eventsData && eventsData.response) {
        // Event verisini EventData formatına dönüştür
        const formattedEvents: EventData[] = eventsData.response.map((event, index) => ({
          id: index,
          type: event.type || 'UNKNOWN',
          time: event.time?.elapsed || 0,
          team: event.team?.name || '',
          player: event.player?.name || '',
          description: event.detail || ''
        }));
        setEvents(formattedEvents);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Veriler yüklenirken hata oluştu.');
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const matchIdNum = Number(matchId);
      
      // Paralel olarak tüm verileri çek
      const [matchData, statisticsData, eventsData] = await Promise.all([
        getMatchById(matchIdNum),
        getMatchStatistics(matchIdNum),
        getMatchEvents(matchIdNum)
      ]);

      if (!matchData) {
        throw new Error('Maç verisi alınamadı');
      }

      // Match verisini MatchData formatına dönüştür
      const formattedMatchData: MatchData = {
        id: matchData.id,
        homeTeam: {
          name: matchData.homeTeam?.name || 'Ev Sahibi',
          logo: matchData.homeTeam?.logo || ''
        },
        awayTeam: {
          name: matchData.awayTeam?.name || 'Deplasman',
          logo: matchData.awayTeam?.logo || ''
        },
        homeScore: matchData.homeScore || 0,
        awayScore: matchData.awayScore || 0,
        status: matchData.status || 'NS',
        elapsed: matchData.elapsed,
        date: matchData.date
      };
      
      setMatchData(formattedMatchData);

      if (statisticsData) {
        // İstatistik verisini StatisticsData formatına dönüştür
        const formattedStats: StatisticsData = {
          homePossession: statisticsData.homeTeamStats?.possession || 50,
          awayPossession: statisticsData.awayTeamStats?.possession || 50,
          homeShots: statisticsData.homeTeamStats?.shots || 0,
          awayShots: statisticsData.awayTeamStats?.shots || 0,
          homeShotsOnTarget: statisticsData.homeTeamStats?.shotsOnTarget || 0,
          awayShotsOnTarget: statisticsData.awayTeamStats?.shotsOnTarget || 0,
          homeCorners: statisticsData.homeTeamStats?.corners || 0,
          awayCorners: statisticsData.awayTeamStats?.corners || 0,
          homeFouls: statisticsData.homeTeamStats?.fouls || 0,
          awayFouls: statisticsData.awayTeamStats?.fouls || 0,
          homeYellowCards: statisticsData.homeTeamStats?.yellowCards || 0,
          awayYellowCards: statisticsData.awayTeamStats?.yellowCards || 0,
          homeRedCards: statisticsData.homeTeamStats?.redCards || 0,
          awayRedCards: statisticsData.awayTeamStats?.redCards || 0
        };
        setStatistics(formattedStats);
      }

      if (eventsData && eventsData.response) {
        // Event verisini EventData formatına dönüştür
        const formattedEvents: EventData[] = eventsData.response.map((event, index) => ({
          id: index,
          type: event.type || 'UNKNOWN',
          time: event.time?.elapsed || 0,
          team: event.team?.name || '',
          player: event.player?.name || '',
          description: event.detail || ''
        }));
        setEvents(formattedEvents);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    
    // Goal türleri
    if (lowerType.includes('goal')) return '⚽';
    
    // Kart türleri
    if (lowerType.includes('yellow') || lowerType.includes('card') ) return '🟨';
    if (lowerType.includes('red') || lowerType.includes('card') ) return '🟥';
    
    // Değişiklik
    if (lowerType.includes('subst') || lowerType === 'substitution') return '🔄';
    
    // Diğer eventler
    if (lowerType.includes('corner')) return '📐';
    if (lowerType.includes('offside')) return '🚩';
    if (lowerType.includes('penalty')) return '🥅';
    if (lowerType.includes('var')) return '📺';
    if (lowerType.includes('foul')) return '⚠️';
    if (lowerType.includes('kick')) return '🦵';
    
    return '📝';
  };

  const getStatusColor = (status: string) => {
    if (status === "FT") return "#4CAF50";
    if (status === "2H" || status === "1H") return "#ff4444";
    if (status === "HT") return "#ff9800";
    return "#9e9e9e";
  };

  const getStatusLabel = (status: string, elapsed?: number) => {
    if (status === "FT") return "FT";
    if (status === "HT") return "Half-Time";
    if (status === "1H" && elapsed) return `${elapsed}'`;
    if (status === "2H" && elapsed) return `${elapsed}'`;
    return status;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>Maç İstatistikleri Yükleniyor</h2>
          <p className="text-sm opacity-70" style={{ color: colors.textSecondary }}>Detaylı istatistikler ve maç olayları getiriliyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-red-600">Hata Oluştu</h2>
          <p className="text-sm text-red-500 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => fetchAllData()}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              Tekrar Dene
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              Geri Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "40px", 
        color: colors.text,
        backgroundColor: colors.background 
      }}>
        <p>Maç bulunamadı</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.background, minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 rounded-2xl hover:scale-105 transition-all duration-300"
              style={{ 
                color: colors.text,
                backgroundColor: `${colors.border}20`
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Maç İstatistikleri
              </h1>
              <p className="text-sm opacity-70" style={{ color: colors.textSecondary }}>
                Detaylı analiz ve maç olayları
              </p>
            </div>
          </div>
          
          {/* Live indicator */}
          {(matchData.status === "1H" || matchData.status === "2H") && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-bold">CANLI</span>
            </div>
          )}
        </div>

        {/* Maç Skoru */}
        <div 
          className="relative rounded-3xl p-8 mb-8 shadow-2xl backdrop-blur-sm border overflow-hidden"
          style={{ 
            backgroundColor: `${colors.cardBackground}E6`,
            borderColor: colors.border
          }}
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              {/* Ev Sahibi */}
              <div className="flex items-center gap-4 w-[40%] justify-start">
                <div className="relative">
                  <img
                    src={matchData.homeTeam.logo}
                    alt={matchData.homeTeam.name}
                    className="w-16 h-16 object-contain p-2 rounded-2xl bg-white/10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iI0YzRjNGMyIvPgo8dGV4dCB4PSIyNCIgeT0iMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+7J207J207J20PC90ZXh0Pgo8L3N2Zz4K';
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">H</span>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-xl" style={{ color: colors.text }}>
                    {matchData.homeTeam.name}
                  </p>
                  <p className="text-sm opacity-70" style={{ color: colors.textSecondary }}>
                    Ev Sahibi
                  </p>
                </div>
              </div>

              {/* Skor */}
              <div className="w-[20%] flex flex-col items-center space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold" style={{ color: colors.text }}>
                    {matchData.homeScore}
                  </span>
                  <span className="text-2xl opacity-50" style={{ color: colors.text }}>
                    -
                  </span>
                  <span className="text-5xl font-bold" style={{ color: colors.text }}>
                    {matchData.awayScore}
                  </span>
                </div>
                <span
                  className="text-sm px-4 py-2 rounded-full font-bold text-white shadow-lg"
                  style={{ backgroundColor: getStatusColor(matchData.status) }}
                >
                  {getStatusLabel(matchData.status, matchData.elapsed)}
                </span>
              </div>

              {/* Deplasman */}
              <div className="flex items-center gap-4 w-[40%] justify-end">
                <div className="text-right">
                  <p className="font-bold text-xl" style={{ color: colors.text }}>
                    {matchData.awayTeam.name}
                  </p>
                  <p className="text-sm opacity-70" style={{ color: colors.textSecondary }}>
                    Deplasman
                  </p>
                </div>
                <div className="relative">
                  <img
                    src={matchData.awayTeam.logo}
                    alt={matchData.awayTeam.name}
                    className="w-16 h-16 object-contain p-2 rounded-2xl bg-white/10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iI0YzRjNGMyIvPgo8dGV4dCB4PSIyNCIgeT0iMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+7J207J207J20PC90ZXh0Pgo8L3N2Zz4K';
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* İstatistikler */}
        {statistics && (
          <div 
            className="rounded-3xl p-8 mb-8 shadow-2xl backdrop-blur-sm border overflow-hidden"
            style={{ 
              backgroundColor: `${colors.cardBackground}E6`,
              borderColor: colors.border
            }}
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Maç İstatistikleri
                </h2>
              </div>
            
              <div className="grid gap-6">
                {/* Top Hakimiyeti */}
                <div className="bg-white/5 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold" style={{ color: colors.text }}>Top Hakimiyeti</h3>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-2xl font-bold text-blue-500">{statistics.homePossession}%</span>
                    <span className="text-2xl font-bold text-red-500">{statistics.awayPossession}%</span>
                  </div>
                  <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${statistics.homePossession}%` }}
                    ></div>
                    <div 
                      className="absolute right-0 top-0 h-full bg-gradient-to-l from-red-500 to-red-600 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${statistics.awayPossession}%` }}
                    ></div>
                  </div>
                </div>

                {/* Şutlar */}
                <div className="bg-white/5 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold" style={{ color: colors.text }}>Şutlar</h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-500">{statistics.homeShots}</div>
                      <div className="text-sm opacity-70" style={{ color: colors.textSecondary }}>Ev Sahibi</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-500">{statistics.awayShots}</div>
                      <div className="text-sm opacity-70" style={{ color: colors.textSecondary }}>Deplasman</div>
                    </div>
                  </div>
                </div>

                {/* İsabetli Şutlar */}
                <div className="bg-white/5 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-yellow-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold" style={{ color: colors.text }}>İsabetli Şutlar</h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-500">{statistics.homeShotsOnTarget}</div>
                      <div className="text-sm opacity-70" style={{ color: colors.textSecondary }}>Ev Sahibi</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-500">{statistics.awayShotsOnTarget}</div>
                      <div className="text-sm opacity-70" style={{ color: colors.textSecondary }}>Deplasman</div>
                    </div>
                  </div>
                </div>

                {/* Diğer İstatistikler */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Kornerler */}
                  <div className="bg-white/5 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">📐</span>
                      </div>
                      <h4 className="font-semibold" style={{ color: colors.text }}>Kornerler</h4>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xl font-bold text-blue-500">{statistics.homeCorners}</span>
                      <span className="text-xl font-bold text-red-500">{statistics.awayCorners}</span>
                    </div>
                  </div>

                  {/* Fauller */}
                  <div className="bg-white/5 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">⚠️</span>
                      </div>
                      <h4 className="font-semibold" style={{ color: colors.text }}>Fauller</h4>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xl font-bold text-blue-500">{statistics.homeFouls}</span>
                      <span className="text-xl font-bold text-red-500">{statistics.awayFouls}</span>
                    </div>
                  </div>
                </div>

                {/* Kartlar */}
                <div className="bg-white/5 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg">🟨</span>
                    </div>
                    <h3 className="text-lg font-bold" style={{ color: colors.text }}>Kartlar</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="flex justify-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                          <span className="text-2xl">🟨</span>
                          <span className="text-xl font-bold text-blue-500">{statistics.homeYellowCards}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-2xl">🟥</span>
                          <span className="text-xl font-bold text-blue-500">{statistics.homeRedCards}</span>
                        </div>
                      </div>
                      <div className="text-sm opacity-70" style={{ color: colors.textSecondary }}>Ev Sahibi</div>
                    </div>
                    <div className="text-center">
                      <div className="flex justify-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                          <span className="text-2xl">🟨</span>
                          <span className="text-xl font-bold text-red-500">{statistics.awayYellowCards}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-2xl">🟥</span>
                          <span className="text-xl font-bold text-red-500">{statistics.awayRedCards}</span>
                        </div>
                      </div>
                      <div className="text-sm opacity-70" style={{ color: colors.textSecondary }}>Deplasman</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Maç Olayları */}
        {events.length > 0 && (
          <div 
            className="rounded-3xl p-8 shadow-2xl backdrop-blur-sm border overflow-hidden"
            style={{ 
              backgroundColor: `${colors.cardBackground}E6`,
              borderColor: colors.border
            }}
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-pink-500/5"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Maç Olayları
                </h2>
              </div>
              
              <div className="space-y-4">
                {events.map((event, index) => (
                  <div 
                    key={event.id} 
                    className="group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                    style={{ 
                      backgroundColor: `${colors.background}80`,
                      border: `1px solid ${colors.border}40`
                    }}
                  >
                    {/* Zaman */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{event.time}'</span>
                      </div>
                    </div>
                    
                    {/* Event ikonu */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">{getEventIcon(event.type)}</span>
                      </div>
                    </div>
                    
                    {/* Event detayları */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-lg truncate" style={{ color: colors.text }}>
                        {event.player}
                      </p>
                      <p className="text-sm opacity-70 truncate" style={{ color: colors.textSecondary }}>
                        {event.team}
                      </p>
                      {event.description && (
                        <p className="text-sm mt-1 opacity-60" style={{ color: colors.textSecondary }}>
                          {event.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Event türü badge */}
                    <div className="flex-shrink-0">
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ 
                          backgroundColor: event.type.toLowerCase().includes('goal') ? '#10B981' : 
                                          event.type.toLowerCase().includes('card') ? '#F59E0B' : 
                                          event.type.toLowerCase().includes('subst') ? '#3B82F6' : '#6B7280'
                        }}
                      >
                        {event.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchStatisticsPage;