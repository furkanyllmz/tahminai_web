import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatchesByTeam } from '../services/api';
import type { Match } from '../models/types';
import { useTheme } from '../contexts/ThemeContext';

interface MatchPageProps {}

const MatchPage: React.FC<MatchPageProps> = () => {
  const { teamId, teamName } = useParams<{ teamId: string; teamName: string }>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { colors } = useTheme();

  useEffect(() => {
    fetchMatches();
  }, [teamId]);

  const fetchMatches = async () => {
    try {
      console.log('Fetching matches for teamId:', teamId);
      const data = await getMatchesByTeam(Number(teamId));
      console.log('Matches data received:', data);
      setMatches(data);
      setLoading(false);
    } catch (err) {
      console.error('Error in fetchMatches:', err);
      setError('Maçlar yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-4 border border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center">
        <ExclamationIcon className="mr-2 flex-shrink-0" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-2 max-w-6xl mx-auto space-y-2">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeftIcon className="text-gray-600 dark:text-gray-400" />
        </button>
        <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
          {teamName ? decodeURIComponent(teamName) : ''} Maçları
        </h1>
      </div>
      
      {sortedMatches.length === 0 ? (
        <div className="flex justify-center items-center min-h-[30vh]">
          <p className="text-lg" style={{ color: colors.textSecondary }}>Bu takım için maç bulunamadı</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedMatches.map((match) => (
            <div 
              key={match.id} 
              className="rounded-md shadow-sm p-2 border hover:shadow-md hover:scale-[1.01] transition-all duration-200 ease-in-out cursor-pointer"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border
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
                    {match.homeScore !== null && match.awayScore !== null
                      ? `${match.homeScore} - ${match.awayScore}`
                      : '-'}
                  </p>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium mt-0.5 text-white ${
                      match.status === 'LIVE' 
                        ? 'bg-red-500' 
                        : match.status === 'FT'
                        ? 'bg-green-500'
                        : 'bg-gray-500'
                    }`}
                  >
                    {match.status === 'LIVE' ? `${match.elapsed}' CANLI` : match.status}
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

              {/* Lig ve tarih */}
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1">
                  {match.league && (
                    <>
                      <img
                        src={match.league.logo}
                        alt={match.league.name}
                        className="w-4 h-4 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                        {match.league.name}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[10px]" style={{ color: colors.textSecondary }}>
                  {(() => {
                    const date = new Date(match.date);
                    date.setHours(date.getHours() + 3);
                    return date.toLocaleString("tr-TR");
                  })()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchPage;