import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLeagues } from "../services/api";
import type { League } from "../models/types";
import { useTheme } from "../contexts/ThemeContext";

const Leagues: React.FC = () => {
  const { colors } = useTheme();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchLeaguesQuiet = async () => {
    try {
      const data = await getLeagues();
      setLeagues(data);
    } catch (err) {
      console.error("Error fetching leagues:", err);
    }
  };

  useEffect(() => {
    fetchLeagues();
    const interval = setInterval(fetchLeaguesQuiet, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLeagues();
      setLeagues(data);
    } catch (err) {
      console.error("Error fetching leagues:", err);
      setError("Ligler yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Simple SVG icon
  const ExclamationIcon = ({ className = "h-5 w-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
  );

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: colors.text }}>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "#ff4444" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
          <div style={{ marginRight: "8px" }}>
            <ExclamationIcon />
          </div>
          <p>{error}</p>
        </div>
        <button 
          style={{
            marginTop: "8px",
            padding: "6px 12px",
            fontSize: "14px",
            border: "1px solid #ff4444",
            color: "#ff4444",
            backgroundColor: "transparent",
            borderRadius: "4px",
            cursor: "pointer"
          }}
          onClick={fetchLeagues}
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  if (leagues.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: colors.text }}>
        <p>Henüz lig bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="p-2 max-w-6xl mx-auto space-y-2">
      <h2 className="text-lg font-bold text-center mb-4" style={{ color: colors.text }}>Ligler</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {leagues.map((league) => (
          <div 
            key={league.id}
            className="rounded-md shadow-sm p-4 border cursor-pointer
                       hover:shadow-md hover:scale-[1.02] transition-all duration-200 ease-in-out
                       flex flex-col items-center h-full"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border
            }}
            onClick={() => navigate(`/teams/${league.externalId}/${encodeURIComponent(league.name)}`)}
          >
            <img 
              src={league.logo} 
              alt={league.name} 
              className="w-16 h-16 object-contain mb-3 rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iI0YzRjNGMyIvPgo8dGV4dCB4PSIzMiIgeT0iNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TDwvdGV4dD4KPC9zdmc+";
              }}
            />
            <h3 className="text-base font-semibold text-center mb-1" style={{ color: colors.text }}>
              {league.name}
            </h3>
            <p className="text-sm text-center mb-1" style={{ color: colors.textSecondary }}>
              {league.country}
            </p>
            <p className="text-xs text-center" style={{ color: colors.textSecondary }}>
              Sezon: {league.season}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leagues;