import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Layout = ({ children }) => {
  const { colors } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };
  
  // Determine active tab based on current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/' || path.startsWith('/active-matches')) return 0;
    if (path.startsWith('/all-matches')) return 1;
    if (path.startsWith('/leagues')) return 2;
    return 0; // Default to active matches
  };
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };
  
  // Simple SVG icons
  const MenuIcon = () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
  
  const CloseIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
  
  const PlayIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
    </svg>
  );
  
  const TableIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0V4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
    </svg>
  );
  
  const ListIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
  
  const HomeIcon = () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
  
  // Sidebar content
  const sidebarContent = (
    <div className="h-full w-80 backdrop-blur-sm border shadow-2xl rounded-lg" style={{ backgroundColor: `${colors.cardBackground}E6`, borderColor: colors.border }}>
      <div className="p-0">
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <HomeIcon />
            </div>
            <h2 className="text-xl font-bold" style={{ color: colors.text }}>
              Football App
            </h2>
          </div>
          <button
            onClick={handleDrawerToggle}
            className="p-2 rounded-lg transition-colors"
            style={{ color: colors.textSecondary }}
            onMouseEnter={(e) => e.target.style.backgroundColor = colors.border}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <CloseIcon />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          <button
            className="w-full flex items-center justify-start h-12 px-4 rounded-lg font-medium transition-all shadow-lg"
            style={{
              backgroundColor: isActive('/active-matches') ? '#ffffff' : 'transparent',
              color: isActive('/active-matches') ? '#000000' : colors.text
            }}
            onMouseEnter={(e) => {
              if (!isActive('/active-matches')) e.target.style.backgroundColor = colors.border;
            }}
            onMouseLeave={(e) => {
              if (!isActive('/active-matches')) e.target.style.backgroundColor = 'transparent';
            }}
            onClick={() => handleNavigation('/active-matches')}
          >
            <PlayIcon />
            <span className="ml-3">Canlı Maçlar</span>
            {isActive('/active-matches') && (
              <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Live
              </span>
            )}
          </button>
          
          <button
            className="w-full flex items-center justify-start h-12 px-4 rounded-lg font-medium transition-all shadow-lg"
            style={{
              backgroundColor: isActive('/all-matches') ? '#ffffff' : 'transparent',
              color: isActive('/all-matches') ? '#000000' : colors.text
            }}
            onMouseEnter={(e) => {
              if (!isActive('/all-matches')) e.target.style.backgroundColor = colors.border;
            }}
            onMouseLeave={(e) => {
              if (!isActive('/all-matches')) e.target.style.backgroundColor = 'transparent';
            }}
            onClick={() => handleNavigation('/all-matches')}
          >
            <TableIcon />
            <span className="ml-3">Tüm Maçlar</span>
          </button>
          
          <button
            className="w-full flex items-center justify-start h-12 px-4 rounded-lg font-medium transition-all shadow-lg"
            style={{
              backgroundColor: isActive('/leagues') ? '#ffffff' : 'transparent',
              color: isActive('/leagues') ? '#000000' : colors.text
            }}
            onMouseEnter={(e) => {
              if (!isActive('/leagues')) e.target.style.backgroundColor = colors.border;
            }}
            onMouseLeave={(e) => {
              if (!isActive('/leagues')) e.target.style.backgroundColor = 'transparent';
            }}
            onClick={() => handleNavigation('/leagues')}
          >
            <ListIcon />
            <span className="ml-3">Ligler</span>
          </button>
        </nav>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <nav className="backdrop-blur-md border-b shadow-lg h-16" style={{ backgroundColor: `${colors.cardBackground}CC`, borderColor: colors.border }}>
        <div className="max-w-full mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleDrawerToggle}
                className="lg:hidden p-2 rounded-lg transition-colors"
                style={{ color: colors.text }}
                onMouseEnter={(e) => e.target.style.backgroundColor = colors.border}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <MenuIcon />
              </button>
              <div className="flex items-center gap-3">
                
                <h1 className="text-xl font-bold" style={{ color: colors.text }}>
                  TahminAI
                </h1>
              </div>
            </div>
            
            <div className="hidden lg:flex gap-4">
              <button
                className="flex items-center px-4 py-2 rounded-lg font-medium transition-all shadow-lg"
                style={{
                  backgroundColor: isActive('/active-matches') ? '#ffffff' : 'transparent',
                  color: isActive('/active-matches') ? '#000000' : colors.text
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/active-matches')) e.target.style.backgroundColor = colors.border;
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/active-matches')) e.target.style.backgroundColor = 'transparent';
                }}
                onClick={() => navigate('/active-matches')}
              >
                <PlayIcon />
                <span className="ml-2">Canlı Maçlar</span>
              </button>
              
              <button
                className="flex items-center px-4 py-2 rounded-lg font-medium transition-all shadow-lg"
                style={{
                  backgroundColor: isActive('/all-matches') ? '#ffffff' : 'transparent',
                  color: isActive('/all-matches') ? '#000000' : colors.text
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/all-matches')) e.target.style.backgroundColor = colors.border;
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/all-matches')) e.target.style.backgroundColor = 'transparent';
                }}
                onClick={() => navigate('/all-matches')}
              >
                <TableIcon />
                <span className="ml-2">Tüm Maçlar</span>
              </button>
              
              <button
                className="flex items-center px-4 py-2 rounded-lg font-medium transition-all shadow-lg"
                style={{
                  backgroundColor: isActive('/leagues') ? '#ffffff' : 'transparent',
                  color: isActive('/leagues') ? '#000000' : colors.text
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/leagues')) e.target.style.backgroundColor = colors.border;
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/leagues')) e.target.style.backgroundColor = 'transparent';
                }}
                onClick={() => navigate('/leagues')}
              >
                <ListIcon />
                <span className="ml-2">Ligler</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={handleDrawerToggle}
          />
          <div className="fixed inset-y-0 left-0 flex p-4">
            {sidebarContent}
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t shadow-lg" style={{ backgroundColor: `${colors.cardBackground}E6`, borderColor: colors.border }}>
        <div className="grid grid-cols-3 h-16">
          <button
            className="h-full flex flex-col items-center justify-center gap-1 transition-all"
            style={{
              backgroundColor: getActiveTab() === 0 ? '#ffffff' : 'transparent',
              color: getActiveTab() === 0 ? '#000000' : colors.text
            }}
            onMouseEnter={(e) => {
              if (getActiveTab() !== 0) e.target.style.backgroundColor = colors.border;
            }}
            onMouseLeave={(e) => {
              if (getActiveTab() !== 0) e.target.style.backgroundColor = 'transparent';
            }}
            onClick={() => navigate('/active-matches')}
          >
            <PlayIcon />
            <span className="text-xs">Canlı Maçlar</span>
          </button>
          
          <button
            className="h-full flex flex-col items-center justify-center gap-1 transition-all"
            style={{
              backgroundColor: getActiveTab() === 1 ? '#ffffff' : 'transparent',
              color: getActiveTab() === 1 ? '#000000' : colors.text
            }}
            onMouseEnter={(e) => {
              if (getActiveTab() !== 1) e.target.style.backgroundColor = colors.border;
            }}
            onMouseLeave={(e) => {
              if (getActiveTab() !== 1) e.target.style.backgroundColor = 'transparent';
            }}
            onClick={() => navigate('/all-matches')}
          >
            <TableIcon />
            <span className="text-xs">Tüm Maçlar</span>
          </button>
          
          <button
            className="h-full flex flex-col items-center justify-center gap-1 transition-all"
            style={{
              backgroundColor: getActiveTab() === 2 ? '#ffffff' : 'transparent',
              color: getActiveTab() === 2 ? '#000000' : colors.text
            }}
            onMouseEnter={(e) => {
              if (getActiveTab() !== 2) e.target.style.backgroundColor = colors.border;
            }}
            onMouseLeave={(e) => {
              if (getActiveTab() !== 2) e.target.style.backgroundColor = 'transparent';
            }}
            onClick={() => navigate('/leagues')}
          >
            <ListIcon />
            <span className="text-xs">Ligler</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Layout;