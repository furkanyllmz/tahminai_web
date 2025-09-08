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
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold" style={{ color: colors.text }}>Ligler Yükleniyor</p>
          <p className="text-sm opacity-70" style={{ color: colors.textSecondary }}>Mevcut ligleri getiriyoruz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
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
            onClick={fetchLeagues}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (leagues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">0</span>
          </div>
        </div>
        <div className="text-center max-w-md">
          <h3 className="text-xl font-bold mb-2" style={{ color: colors.text }}>Henüz Lig Bulunamadı</h3>
          <p className="text-sm opacity-70 mb-4" style={{ color: colors.textSecondary }}>
            Şu anda görüntülenebilir lig bulunmuyor. Lütfen daha sonra tekrar deneyin.
          </p>
          <button 
            onClick={fetchLeagues}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Yenile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Ligler
          </h1>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
        </div>
        <p className="text-sm opacity-70 mt-4" style={{ color: colors.textSecondary }}>
          Dünya çapında futbol liglerini keşfedin
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {leagues.map((league) => (
          <div 
            key={league.id}
            className="group relative rounded-3xl p-6 border backdrop-blur-sm cursor-pointer
                       hover:shadow-2xl hover:scale-[1.05] transition-all duration-300 ease-out
                       flex flex-col items-center h-full overflow-hidden"
            style={{
              backgroundColor: `${colors.cardBackground}E6`,
              borderColor: colors.border,
              boxShadow: `0 4px 6px ${colors.shadow}20`
            }}
            onClick={() => navigate(`/teams/${league.externalId}/${encodeURIComponent(league.name)}`)}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10 flex flex-col items-center h-full">
              {/* League Logo */}
              <div className="relative mb-4">
                <img 
                  src={league.logo} 
                  alt={league.name} 
                  className="w-20 h-20 object-contain p-2 rounded-2xl bg-white/10 group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iI0YzRjNGMyIvPgo8dGV4dCB4PSIzMiIgeT0iNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TDwvdGV4dD4KPC9zdmc+";
                  }}
                />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              {/* League Info */}
              <div className="text-center flex-1">
                <h3 className="text-lg font-bold text-center mb-2 group-hover:text-blue-600 transition-colors duration-300" style={{ color: colors.text }}>
                  {league.name}
                </h3>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg className="w-4 h-4" style={{ color: colors.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                    {league.country}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" style={{ color: colors.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs font-semibold px-2 py-1 rounded-full" style={{ 
                    backgroundColor: `${colors.border}40`,
                    color: colors.textSecondary 
                  }}>
                    Sezon {league.season}
                  </p>
                </div>
              </div>
              
              {/* Hover indicator */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: colors.textSecondary }}>
                  <span>Takımları Gör</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leagues;