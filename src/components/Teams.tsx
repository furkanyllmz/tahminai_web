import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTeamsByLeague, getStandingsByLeague } from "../services/api";
import type { Team, TeamStanding } from "../models/types";
import { useTheme } from "../contexts/ThemeContext";

interface TeamsProps {
  leagueId?: string;
  leagueName?: string;
}

const Teams: React.FC<TeamsProps> = ({ leagueId: propLeagueId, leagueName: propLeagueName }) => {
  const { colors } = useTheme();
  const params = useParams<{ leagueId: string; leagueName: string }>();
  const leagueId = propLeagueId || params.leagueId;
  const leagueName = propLeagueName || params.leagueName;

  const [teams, setTeams] = useState<Team[]>([]);
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [standingsLoading, setStandingsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (leagueId) {
      fetchTeams();
      fetchStandings();
      const interval = setInterval(() => {
        // Otomatik yenileme için loading gösterme
        fetchTeamsQuiet();
        fetchStandingsQuiet();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [leagueId]);

  const fetchTeamsQuiet = async () => {
    if (!leagueId) return;
    try {
      const data = await getTeamsByLeague(Number(leagueId));
      setTeams(data);
    } catch (err) {
      console.error("Error fetching teams:", err);
    }
  };

  const fetchStandingsQuiet = async () => {
    if (!leagueId) return;
    try {
      const standingsData = await getStandingsByLeague(parseInt(leagueId));
      setStandings(standingsData);
    } catch (err) {
      console.error("Error fetching standings:", err);
    }
  };

  const fetchStandings = async () => {
    if (!leagueId) return;
    try {
      setStandingsLoading(true);
      const standingsData = await getStandingsByLeague(parseInt(leagueId));
      setStandings(standingsData);
    } catch (err) {
      console.error("Error fetching standings:", err);
    } finally {
      setStandingsLoading(false);
    }
  };

  const fetchTeams = async () => {
    if (!leagueId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getTeamsByLeague(Number(leagueId));
      setTeams(data);
    } catch (err) {
      console.error("Error fetching teams:", err);
      setError("Takımlar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // SVG ikonlar
  const ArrowLeftIcon = ({ className = "h-5 w-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
        clipRule="evenodd"
      />
    </svg>
  );

  const ExclamationIcon = ({ className = "h-5 w-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
        clipRule="evenodd"
      />
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
          <p className="text-lg font-semibold" style={{ color: colors.text }}>Takımlar Yükleniyor</p>
          <p className="text-sm opacity-70" style={{ color: colors.textSecondary }}>Lig takımlarını ve puan durumunu getiriyoruz...</p>
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
            onClick={fetchTeams}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/leagues")}
            className="p-3 rounded-2xl hover:scale-105 transition-all duration-300"
            style={{ 
              color: colors.text,
              backgroundColor: `${colors.border}20`
            }}
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {leagueName ? decodeURIComponent(leagueName) : "Takımlar"}
            </h1>
            <p className="text-sm opacity-70" style={{ color: colors.textSecondary }}>
              Takımlar ve puan durumu
            </p>
          </div>
        </div>
      </div>

      {/* Puan Tablosu */}
      {!standingsLoading && standings.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Puan Durumu
            </h2>
          </div>
          <div
            className="rounded-3xl border overflow-hidden shadow-2xl backdrop-blur-sm"
            style={{
              backgroundColor: `${colors.cardBackground}E6`,
              borderColor: colors.border,
            }}
          >
            {/* Tablo Başlığı */}
            <div
              className="grid grid-cols-12 gap-2 p-4 text-sm font-bold border-b"
              style={{
                backgroundColor: `${colors.background}80`,
                borderColor: colors.border,
                color: colors.textSecondary,
              }}
            >
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-4">Takım</div>
              <div className="col-span-1 text-center">O</div>
              <div className="col-span-1 text-center">G</div>
              <div className="col-span-1 text-center">B</div>
              <div className="col-span-1 text-center">M</div>
              <div className="col-span-1 text-center">A</div>
              <div className="col-span-1 text-center">+/-</div>
              <div className="col-span-1 text-center font-bold">P</div>
            </div>

            {/* Puan Tablosu Satırları */}
            {standings.map((standing) => {
              let borderClass = "";
              let rankColor = "";
              if (standing.description?.includes("Champions League")) {
                borderClass = "border-l-4 border-l-green-500";
                rankColor = "text-green-600";
              } else if (standing.description?.includes("Europa League")) {
                borderClass = "border-l-4 border-l-blue-500";
                rankColor = "text-blue-600";
              } else if (standing.description?.includes("Conference League")) {
                borderClass = "border-l-4 border-l-purple-500";
                rankColor = "text-purple-600";
              } else if (standing.description?.includes("Relegation")) {
                borderClass = "border-l-4 border-l-red-500";
                rankColor = "text-red-600";
              } else if (standing.rank <= 3) {
                rankColor = "text-yellow-600";
              }

              return (
                <div
                  key={standing.team.id}
                  className={`group grid grid-cols-12 gap-2 p-4 text-sm border-b hover:bg-opacity-50 transition-all duration-300 hover:scale-[1.01] ${borderClass}`}
                  style={{
                    borderBottomColor: colors.border,
                    color: colors.text,
                  }}
                >
                  <div className={`col-span-1 text-center font-bold text-lg ${rankColor}`}>
                    {standing.rank}
                  </div>
                  <div className="col-span-4 flex items-center gap-3">
                    <img
                      src={standing.team.logo}
                      alt={standing.team.name}
                      className="w-8 h-8 object-contain rounded-lg bg-white/10 p-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <span className="truncate font-semibold">{standing.team.name}</span>
                  </div>
                  <div className="col-span-1 text-center font-medium">{standing.all.played}</div>
                  <div className="col-span-1 text-center font-medium text-green-600">{standing.all.win}</div>
                  <div className="col-span-1 text-center font-medium text-yellow-600">{standing.all.draw}</div>
                  <div className="col-span-1 text-center font-medium text-red-600">{standing.all.lose}</div>
                  <div className="col-span-1 text-center font-medium">
                    {standing.all.goals.forGoals}:{standing.all.goals.against}
                  </div>
                  <div
                    className={`col-span-1 text-center font-bold ${
                      standing.goalsDiff > 0
                        ? "text-green-600"
                        : standing.goalsDiff < 0
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {standing.goalsDiff > 0 ? "+" : ""}
                    {standing.goalsDiff}
                  </div>
                  <div className="col-span-1 text-center font-bold text-lg text-blue-600">{standing.points}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Takım Kartları */}
      {teams.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">0</span>
            </div>
          </div>
          <div className="text-center max-w-md">
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.text }}>Bu Ligde Takım Bulunamadı</h3>
            <p className="text-sm opacity-70" style={{ color: colors.textSecondary }}>
              Bu ligde henüz takım bilgisi bulunmuyor. Lütfen daha sonra tekrar deneyin.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Takımlar
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {teams.map((team) => (
              <div
                key={team.id}
                className="group relative rounded-3xl p-6 border backdrop-blur-sm cursor-pointer
                           hover:shadow-2xl hover:scale-[1.05] transition-all duration-300 ease-out
                           flex flex-col items-center h-full overflow-hidden"
                style={{
                  backgroundColor: `${colors.cardBackground}E6`,
                  borderColor: colors.border,
                  boxShadow: `0 4px 6px ${colors.shadow}20`
                }}
                onClick={() => navigate(`/matches/${team.externalId}/${encodeURIComponent(team.name)}`)}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 flex flex-col items-center h-full">
                  {/* Team Logo */}
                  <div className="relative mb-4">
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="w-20 h-20 object-contain p-2 rounded-2xl bg-white/10 group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iI0YzRjNGMyIvPgo8dGV4dCB4PSIzMiIgeT0iNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VDwvdGV4dD4KPC9zdmc+";
                      }}
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Team Info */}
                  <div className="text-center flex-1">
                    <h3 className="text-lg font-bold text-center mb-2 group-hover:text-blue-600 transition-colors duration-300" style={{ color: colors.text }}>
                      {team.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" style={{ color: colors.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                        {team.country}
                      </p>
                    </div>
                  </div>
                  
                  {/* Hover indicator */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: colors.textSecondary }}>
                      <span>Maçları Gör</span>
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
      )}
    </div>
  );
};

export default Teams;