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
      <div style={{ 
        textAlign: "center", 
        padding: "40px", 
        color: colors.text,
        backgroundColor: colors.background 
      }}>
        <p>Maç istatistikleri yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "40px", 
        color: colors.text,
        backgroundColor: colors.background 
      }}>
        <p style={{ color: "#ff4444" }}>Hata: {error}</p>
        <button 
          onClick={() => navigate(-1)}
          style={{
            marginTop: "16px",
            padding: "8px 16px",
            backgroundColor: colors.text,
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Geri Dön
        </button>
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
    <div style={{ backgroundColor: colors.background, minHeight: "100vh", padding: "16px" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="mr-3 p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
            style={{ color: colors.text }}
          >
            ←
          </button>
          <h1 className="text-xl font-bold" style={{ color: colors.text }}>
            Maç İstatistikleri
          </h1>
        </div>

        {/* Maç Skoru */}
        <div 
          className="rounded-lg p-4 mb-6 shadow-sm"
          style={{ 
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            border: "1px solid"
          }}
        >
          <div className="flex items-center justify-between text-center">
            {/* Ev Sahibi */}
            <div className="flex items-center gap-3 w-[40%] justify-start">
              <img
                src={matchData.homeTeam.logo}
                alt={matchData.homeTeam.name}
                className="w-12 h-12 object-contain"
              />
              <div>
                <p className="font-semibold text-lg" style={{ color: colors.text }}>
                  {matchData.homeTeam.name}
                </p>
              </div>
            </div>

            {/* Skor */}
            <div className="w-[20%] flex flex-col items-center">
              <p className="font-bold text-3xl leading-tight" style={{ color: colors.text }}>
                {matchData.homeScore} - {matchData.awayScore}
              </p>
              <span
                className="text-xs px-3 py-1 rounded-full font-medium mt-1 text-white"
                style={{ backgroundColor: getStatusColor(matchData.status) }}
              >
                {getStatusLabel(matchData.status, matchData.elapsed)}
              </span>
            </div>

            {/* Deplasman */}
            <div className="flex items-center gap-3 w-[40%] justify-end">
              <div>
                <p className="font-semibold text-lg text-right" style={{ color: colors.text }}>
                  {matchData.awayTeam.name}
                </p>
              </div>
              <img
                src={matchData.awayTeam.logo}
                alt={matchData.awayTeam.name}
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
        </div>

        {/* İstatistikler */}
        {statistics && (
          <div 
            className="rounded-lg p-4 mb-6 shadow-sm"
            style={{ 
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              border: "1px solid"
            }}
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: colors.text }}>İstatistikler</h2>
            
            <div className="space-y-4">
              {/* Top Hakimiyeti */}
              <div>
                <div className="flex justify-between mb-1">
                  <span style={{ color: colors.text }}>{statistics.homePossession}%</span>
                  <span className="font-medium" style={{ color: colors.text }}>Top Hakimiyeti</span>
                  <span style={{ color: colors.text }}>{statistics.awayPossession}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${statistics.homePossession}%` }}
                  ></div>
                </div>
              </div>

              {/* Şutlar */}
              <div className="flex justify-between py-2 border-b" style={{ borderColor: colors.border }}>
                <span style={{ color: colors.text }}>{statistics.homeShots}</span>
                <span className="font-medium" style={{ color: colors.text }}>Şutlar</span>
                <span style={{ color: colors.text }}>{statistics.awayShots}</span>
              </div>

              {/* İsabetli Şutlar */}
              <div className="flex justify-between py-2 border-b" style={{ borderColor: colors.border }}>
                <span style={{ color: colors.text }}>{statistics.homeShotsOnTarget}</span>
                <span className="font-medium" style={{ color: colors.text }}>İsabetli Şutlar</span>
                <span style={{ color: colors.text }}>{statistics.awayShotsOnTarget}</span>
              </div>

              {/* Kornerler */}
              <div className="flex justify-between py-2 border-b" style={{ borderColor: colors.border }}>
                <span style={{ color: colors.text }}>{statistics.homeCorners}</span>
                <span className="font-medium" style={{ color: colors.text }}>Kornerler</span>
                <span style={{ color: colors.text }}>{statistics.awayCorners}</span>
              </div>

              {/* Fauller */}
              <div className="flex justify-between py-2 border-b" style={{ borderColor: colors.border }}>
                <span style={{ color: colors.text }}>{statistics.homeFouls}</span>
                <span className="font-medium" style={{ color: colors.text }}>Fauller</span>
                <span style={{ color: colors.text }}>{statistics.awayFouls}</span>
              </div>

              {/* Kartlar */}
              <div className="flex justify-between py-2">
                <span style={{ color: colors.text }}>
                  🟨 {statistics.homeYellowCards} 🟥 {statistics.homeRedCards}
                </span>
                <span className="font-medium" style={{ color: colors.text }}>Kartlar</span>
                <span style={{ color: colors.text }}>
                  🟨 {statistics.awayYellowCards} 🟥 {statistics.awayRedCards}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Maç Olayları */}
        {events.length > 0 && (
          <div 
            className="rounded-lg p-4 shadow-sm"
            style={{ 
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              border: "1px solid"
            }}
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: colors.text }}>Maç Olayları</h2>
            
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-2 rounded" style={{ backgroundColor: colors.background }}>
                  <span className="text-sm font-mono w-8" style={{ color: colors.textSecondary }}>
                    {event.time}'
                  </span>
                  <span className="text-lg">{getEventIcon(event.type)}</span>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: colors.text }}>{event.player}</p>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      {event.team} - {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchStatisticsPage;