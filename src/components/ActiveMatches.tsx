import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveMatches } from "../services/api";
import type { Match } from "../models/types";
import { useTheme } from "../contexts/ThemeContext";

// Status yazısını düzenleyen helper
const getStatusLabel = (status: string, elapsed?: number) => {
  if (status === "FT") return "FT";
  if (status === "HT") return "Half-Time";
  if (status === "2H") return elapsed ? `LIVE ${elapsed}'` : "2nd Half";
  if (status === "1H") return elapsed ? `LIVE ${elapsed}'` : "1st Half";
  if (status === "NS") return "Not Started";
  return status;
};

// Status rengini seçen helper
const getStatusColor = (status: string) => {
  if (status === "FT") return "#4CAF50"; // yeşil
  if (status === "2H" || status === "1H") return "#ff4444"; // kırmızı (live)
  if (status === "HT") return "#FF9800"; // turuncu
  return "#2196F3"; // mavi (diğerleri)
};

const ActiveMatches: React.FC = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      const data = await getActiveMatches();
      setMatches(data);
    } catch (err) {
      console.error("Error fetching active matches:", err);
      setError("Canlı maçlar yüklenirken hata oluştu.");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(() => fetchMatches(false), 30000);
    return () => clearInterval(interval);
  }, []);

  // Maçları liglere göre gruplandır
  const groupedMatches: Array<{ league: any; matches: Match[] }> = [];
  const seenLeagues = new Set<string>();
  
  matches.forEach((match) => {
    const leagueId = match.league?.id?.toString() || 'unknown';
    
    if (!seenLeagues.has(leagueId)) {
      // Yeni lig, bu lige ait tüm maçları bul
      const leagueMatches = matches.filter(m => 
        (m.league?.id?.toString() || 'unknown') === leagueId
      );
      
      groupedMatches.push({
        league: match.league,
        matches: leagueMatches
      });
      
      seenLeagues.add(leagueId);
    }
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold" style={{ color: colors.text }}>Canlı Maçlar Yükleniyor</p>
        <p className="text-sm opacity-70" style={{ color: colors.textSecondary }}>En güncel skorları getiriyoruz...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-red-600">Hata Oluştu</p>
        <p className="text-sm text-red-500">{error}</p>
        <button 
          onClick={() => fetchMatches()}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  );
  if (matches.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <div className="relative">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">0</span>
        </div>
      </div>
      <div className="text-center max-w-md">
        <h3 className="text-xl font-bold mb-2" style={{ color: colors.text }}>Şu Anda Canlı Maç Yok</h3>
        <p className="text-sm opacity-70 mb-4" style={{ color: colors.textSecondary }}>
          Canlı maçlar başladığında burada görünecek. Tüm maçları görmek için "Tüm Maçlar" sekmesini ziyaret edebilirsiniz.
        </p>
        <button 
          onClick={() => navigate('/all-matches')}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Tüm Maçları Gör
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Canlı Maçlar
          </h1>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
        </div>
        <p className="text-sm opacity-70 mt-4" style={{ color: colors.textSecondary }}>
          En güncel skorlar ve canlı maç durumları
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-red-500">CANLI</span>
        </div>
      </div>

      <div className="space-y-6">

      {groupedMatches.map((group) => (
        <div key={group.league?.id || 'unknown'} className="space-y-4">
          {/* Lig başlığı */}
          {group.league && (
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-sm border" 
                   style={{ 
                     backgroundColor: `${colors.cardBackground}80`, 
                     borderColor: colors.border 
                   }}>
                <img
                  src={group.league.logo}
                  alt={group.league.name}
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="font-semibold text-sm" style={{ color: colors.text }}>
                  {group.league.name}
                </span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}

          {/* Bu lige ait maçlar */}
          <div className="grid gap-4">
            {group.matches.map((match) => (
              <div
                key={match.id}
                className="group relative rounded-2xl p-6 border backdrop-blur-sm
                           hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer
                           hover:border-blue-300"
                style={{
                  backgroundColor: `${colors.cardBackground}E6`,
                  borderColor: colors.border,
                  boxShadow: `0 4px 6px ${colors.shadow}20`
                }}
                onClick={() => navigate(`/match-statistics/${match.matchId}`)}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Live indicator */}
                {(match.status === "1H" || match.status === "2H") && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse shadow-lg">
                    LIVE
                  </div>
                )}

                {/* Maç bilgisi */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    {/* Ev sahibi */}
                    <div className="flex items-center gap-3 w-[40%] justify-start">
                      <div className="relative">
                        <img
                          alt={match.homeTeam?.name}
                          src={match.homeTeam?.logo}
                          className="w-12 h-12 object-contain p-1 rounded-lg bg-white/10"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iI0YzRjNGMyIvPgo8dGV4dCB4PSIyNCIgeT0iMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+7J207J207J20PC90ZXh0Pgo8L3N2Zz4K';
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">H</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <p className="font-bold text-base truncate" style={{ color: colors.text }}>
                          {match.homeTeam?.name}
                        </p>
                        <p className="text-xs opacity-70" style={{ color: colors.textSecondary }}>
                          Ev Sahibi
                        </p>
                      </div>
                    </div>

                    {/* Skor ve Durum */}
                    <div className="w-[20%] flex flex-col items-center space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold" style={{ color: colors.text }}>
                          {match.homeScore ?? "-"}
                        </span>
                        <span className="text-lg opacity-50" style={{ color: colors.text }}>
                          -
                        </span>
                        <span className="text-2xl font-bold" style={{ color: colors.text }}>
                          {match.awayScore ?? "-"}
                        </span>
                      </div>
                      <span
                        className="text-xs px-3 py-1 rounded-full font-semibold text-white shadow-sm"
                        style={{ backgroundColor: getStatusColor(match.status) }}
                      >
                        {getStatusLabel(match.status, match.elapsed)}
                      </span>
                    </div>

                    {/* Deplasman */}
                    <div className="flex items-center gap-3 w-[40%] justify-end">
                      <div className="flex flex-col text-right">
                        <p className="font-bold text-base truncate" style={{ color: colors.text }}>
                          {match.awayTeam?.name}
                        </p>
                        <p className="text-xs opacity-70" style={{ color: colors.textSecondary }}>
                          Deplasman
                        </p>
                      </div>
                      <div className="relative">
                        <img
                          src={match.awayTeam?.logo}
                          alt={match.awayTeam?.name}
                          className="w-12 h-12 object-contain p-1 rounded-lg bg-white/10"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iI0YzRjNGMyIvPgo8dGV4dCB4PSIyNCIgeT0iMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+7J207J207J20PC90ZXh0Pgo8L3N2Zz4K';
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">A</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tarih ve Saat */}
                  <div className="mt-4 pt-3 border-t border-opacity-20" style={{ borderColor: colors.border }}>
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" style={{ color: colors.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                        {(() => {
                          const date = new Date(match.date);
                          date.setHours(date.getHours() + 3);
                          return date.toLocaleString("tr-TR", {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          });
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default ActiveMatches;
