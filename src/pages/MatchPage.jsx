import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatchesByTeam } from '../services/api';

import { useTheme } from '../contexts/ThemeContext';

// Status yazısını düzenleyen helper
const getStatusLabel = (status, elapsed) => {
  if (status === "FT") return "FT";
  if (status === "HT") return "Half-Time";
  if (status === "2H") return elapsed ? `LIVE ${elapsed}'` : "2nd Half";
  if (status === "1H") return elapsed ? `LIVE ${elapsed}'` : "1st Half";
  if (status === "NS") return "Not Started";
  return status;
};

// Status rengini seçen helper
const getStatusColor = (status) => {
  if (status === "FT") return "#4CAF50"; // yeşil
  if (status === "2H" || status === "1H") return "#ff4444"; // kırmızı (live)
  if (status === "HT") return "#FF9800"; // turuncu
  return "#2196F3"; // mavi (diğerleri)
};

const MatchPage = () => {
  const { teamId, teamName } = useParams();
  const { colors } = useTheme();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchMatches = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      console.log('Fetching matches for teamId:', teamId);
      const data = await getMatchesByTeam(Number(teamId));
      console.log('Matches data received:', data);
      setMatches(data);
    } catch (err) {
      console.error('Error in fetchMatches:', err);
      setError('Maçlar yüklenirken bir hata oluştu.');
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
  }, [teamId]);

  // Simple SVG icons
  const ArrowLeftIcon = ({ className = "h-5 w-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
    </svg>
  );

  const ExclamationIcon = ({ className = "h-5 w-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
  );

  // Maçları tarih sırasına göre sırala (en yeniden en eskiye)
  const sortedMatches = [...matches].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
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
  if (sortedMatches.length === 0) return (
    <div style={{ textAlign: "center", padding: "20px", color: colors.text }}>
      <p>Bu takım için maç bulunamadı</p>
    </div>
  );

  return (
    <div className="p-2 max-w-2xl mx-auto">
      <div className="flex items-center mb-2">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-3 p-2 rounded-full transition-colors"
          style={{ 
            backgroundColor: colors.cardBackground,
            color: colors.text 
          }}
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-bold text-center flex-1" style={{ color: colors.text }}>
          ⚽ {teamName ? decodeURIComponent(teamName) : 'Takım'} Maçları
        </h2>
      </div>

      <div className="space-y-2 mt-4">
        {sortedMatches.map((match) => (
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
            {/* Lig bilgisi */}
            {match.league && (
              <div className="flex items-center justify-center gap-2 mb-1 text-xs" style={{ color: colors.textSecondary }}>
                <img
                  src={match.league.logo}
                  alt={match.league.name}
                  className="w-5 h-5 object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <span>{match.league.name}</span>
              </div>
            )}

            {/* Maç bilgisi */}
            <div className="flex items-center justify-between text-center">
              {/* Ev sahibi */}
              <div className="flex items-center gap-2 w-[40%] justify-start">
                <img
                  alt={match.homeTeam?.name}
                  src={match.homeTeam?.logo}
                  className="w-8 h-8 object-contain"
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
    </div>
  );
};

export default MatchPage;