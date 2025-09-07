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
      <div style={{ textAlign: "center", padding: "20px", color: colors.text }}>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "#ff4444" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
          <ExclamationIcon style={{ marginRight: "8px" }} />
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
            cursor: "pointer",
          }}
          onClick={fetchTeams}
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="p-2 max-w-2xl mx-auto space-y-2">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate("/leagues")}
          className="mr-3 p-2 rounded-full transition-colors"
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.cardBackground;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <ArrowLeftIcon style={{ color: colors.textSecondary }} />
        </button>
        <h2 className="text-lg font-bold" style={{ color: colors.text }}>
          {leagueName ? decodeURIComponent(leagueName) : "Takımlar"}
        </h2>
      </div>

      {/* Puan Tablosu */}
      {!standingsLoading && standings.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
            Puan Durumu
          </h3>
          <div
            className="rounded-lg border overflow-hidden"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            {/* Tablo Başlığı */}
            <div
              className="grid grid-cols-12 gap-2 p-3 text-xs font-semibold border-b"
              style={{
                backgroundColor: colors.background,
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
              if (standing.description?.includes("Champions League")) {
                borderClass = "border-l-4 border-l-green-500";
              } else if (standing.description?.includes("Europa League")) {
                borderClass = "border-l-4 border-l-blue-500";
              } else if (standing.description?.includes("Conference League")) {
                borderClass = "border-l-4 border-l-purple-500";
              } else if (standing.description?.includes("Relegation")) {
                borderClass = "border-l-4 border-l-red-500";
              }

              return (
                <div
                  key={standing.team.id}
                  className={`grid grid-cols-12 gap-2 p-3 text-sm border-b hover:bg-opacity-50 transition-colors ${borderClass}`}
                  style={{
                    borderBottomColor: colors.border,
                    color: colors.text,
                  }}
                >
                  <div className="col-span-1 text-center font-semibold">{standing.rank}</div>
                  <div className="col-span-4 flex items-center gap-2">
                    <img
                      src={standing.team.logo}
                      alt={standing.team.name}
                      className="w-5 h-5 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <span className="truncate">{standing.team.name}</span>
                  </div>
                  <div className="col-span-1 text-center">{standing.all.played}</div>
                  <div className="col-span-1 text-center">{standing.all.win}</div>
                  <div className="col-span-1 text-center">{standing.all.draw}</div>
                  <div className="col-span-1 text-center">{standing.all.lose}</div>
                  <div className="col-span-1 text-center">
                    {standing.all.goals.forGoals}:{standing.all.goals.against}
                  </div>
                  <div
                    className={`col-span-1 text-center font-semibold ${
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
                  <div className="col-span-1 text-center font-bold">{standing.points}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Takım Kartları */}
      {teams.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px", color: colors.text }}>
          <p>Bu ligde takım bulunamadı</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="rounded-md shadow-sm p-4 border cursor-pointer
                         hover:shadow-md hover:scale-[1.02] transition-all duration-200 ease-in-out
                         flex flex-col items-center h-full"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
              onClick={() => navigate(`/matches/${team.externalId}/${encodeURIComponent(team.name)}`)}
            >
              <img
                src={team.logo}
                alt={team.name}
                className="w-16 h-16 object-contain mb-3 rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iI0YzRjNGMyIvPgo8dGV4dCB4PSIzMiIgeT0iNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VDwvdGV4dD4KPC9zdmc+";
                }}
              />
              <h3 className="text-base font-semibold text-center mb-1" style={{ color: colors.text }}>
                {team.name}
              </h3>
              <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
                {team.country}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;