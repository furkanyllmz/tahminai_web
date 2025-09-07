import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMatches } from "../services/api";
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

interface AllMatchesProps {
  selectedDate: Date;
}

const AllMatches: React.FC<AllMatchesProps> = ({ selectedDate }) => {
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
      
      // Format dates for API
      const startDate = formatDate(selectedDate);
      const endDate = formatDate(selectedDate);
      
      const data = await getAllMatches(startDate, endDate);
      setMatches(data);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError("Maçlar yüklenirken hata oluştu.");
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
   }, [selectedDate]);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Maçları API'den gelen sırada tut, sadece lig bilgilerini grupla
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
    <div style={{ textAlign: "center", padding: "20px", color: colors.text }}>
      <p>Yükleniyor...</p>
    </div>
  );
  
  if (error) return (
    <div style={{ textAlign: "center", padding: "20px", color: "#ff4444" }}>
      <p>{error}</p>
    </div>
  );
  
  if (matches.length === 0) return (
    <div style={{ textAlign: "center", padding: "20px", color: colors.text }}>
      <p>Bu tarihte maç bulunamadı</p>
    </div>
  );

  return (
    <div className="p-2 max-w-2xl mx-auto space-y-2">
      {groupedMatches.map((group) => (
        <div key={group.league?.id || 'unknown'} className="space-y-2">
          {/* Lig başlığı */}
          {group.league && (
            <div className="flex items-center justify-center gap-2 mb-1 text-xs" style={{ color: colors.textSecondary }}>
              <img
                src={group.league.logo}
                alt={group.league.name}
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span>{group.league.name}</span>
            </div>
          )}

          {/* Maçlar */}
          {group.matches.map((match) => (
            <div
              key={match.id}
              className="rounded-md shadow-sm p-2 border 
                         hover:shadow-md hover:scale-[1.01] transition-all duration-200 ease-in-out cursor-pointer"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                boxShadow: `0 1px 2px ${colors.shadow}`
              }}
              onClick={() => navigate(`/match-statistics/${match.matchId}`)}
            >
              {/* Maç bilgisi */}
              <div className="flex items-center justify-between text-center">
                {/* Ev sahibi */}
                <div className="flex items-center gap-2 w-[40%] justify-start">
                  <img
                    alt={match.homeTeam?.name}
                    src={match.homeTeam?.logo}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNCIgZmlsbD0iI0YzRjNGMyIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SDwvdGV4dD4KPC9zdmc+";
                    }}
                  />
                  <p className="font-semibold text-sm truncate" style={{ color: colors.text }}>
                    {match.homeTeam?.name}
                  </p>
                </div>

                {/* Skor */}
                <div className="w-[20%] flex flex-col items-center">
                  <p className="font-bold text-lg leading-tight" style={{ color: colors.text }}>
                    {match.homeScore ?? "-"} - {match.awayScore ?? "-"}
                  </p>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium mt-0.5 text-white"
                    style={{ backgroundColor: getStatusColor(match.status) }}
                  >
                    {getStatusLabel(match.status, match.elapsed)}
                  </span>
                </div>

                {/* Deplasman */}
                <div className="flex items-center gap-2 w-[40%] justify-end">
                  <p className="font-semibold text-sm truncate text-right" style={{ color: colors.text }}>
                    {match.awayTeam?.name}
                  </p>
                  <img
                    src={match.awayTeam?.logo}
                    alt={match.awayTeam?.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNCIgZmlsbD0iI0YzRjNGMyIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QTwvdGV4dD4KPC9zdmc+";
                    }}
                  />
                </div>
              </div>

              {/* Tarih */}
              <p className="text-[10px] text-center mt-1" style={{ color: colors.textTertiary }}>
                {(() => {
                  const date = new Date(match.date);
                  date.setHours(date.getHours() + 3);
                  return date.toLocaleString("tr-TR");
                })()}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AllMatches;