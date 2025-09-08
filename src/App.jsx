import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import ActiveMatchesPage from './pages/ActiveMatchesPage';
import AllMatchesPage from './pages/AllMatchesPage';
import LeaguesPage from './pages/LeaguesPage';
import TeamPage from './pages/TeamPage';
import MatchPage from './pages/MatchPage';
import MatchStatisticsPage from './pages/MatchStatisticsPage';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <ThemeToggle />
          <Routes>
            <Route path="/" element={<ActiveMatchesPage />} />
            <Route path="/active-matches" element={<ActiveMatchesPage />} />
            <Route path="/all-matches" element={<AllMatchesPage />} />
            <Route path="/leagues" element={<LeaguesPage />} />
            <Route path="/teams/:leagueId/:leagueName" element={<TeamPage />} />
            <Route path="/matches/:teamId/:teamName" element={<MatchPage />} />
            <Route path="/match-statistics/:matchId" element={<MatchStatisticsPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
