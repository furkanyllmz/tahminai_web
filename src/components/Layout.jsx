import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Layout = ({ children }) => {
  const { colors, isDarkMode } = useTheme();
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
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl blur-md opacity-30 -z-10"></div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                TahminAI
              </h2>
              <p className="text-xs opacity-70" style={{ color: colors.textSecondary }}>
                Futbol Tahminleri
              </p>
            </div>
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
        
        <nav className="p-4 space-y-3">
          <button
            className="group relative w-full flex items-center justify-start h-14 px-4 rounded-2xl font-semibold transition-all duration-300 overflow-hidden"
            style={{
              background: isActive('/active-matches') 
                ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                : 'transparent',
              color: isActive('/active-matches') ? '#ffffff' : colors.text
            }}
            onMouseEnter={(e) => {
              if (!isActive('/active-matches')) {
                e.target.style.backgroundColor = `${colors.border}30`;
                e.target.style.transform = 'translateX(4px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/active-matches')) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateX(0)';
              }
            }}
            onClick={() => handleNavigation('/active-matches')}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <PlayIcon />
                {isActive('/active-matches') && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <span>Canlı Maçlar</span>
            </div>
            {isActive('/active-matches') && (
              <span className="ml-auto bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">
                Live
              </span>
            )}
            {isActive('/active-matches') && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-sm opacity-50 -z-10"></div>
            )}
          </button>
          
          <button
            className="group relative w-full flex items-center justify-start h-14 px-4 rounded-2xl font-semibold transition-all duration-300 overflow-hidden"
            style={{
              background: isActive('/all-matches') 
                ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                : 'transparent',
              color: isActive('/all-matches') ? '#ffffff' : colors.text
            }}
            onMouseEnter={(e) => {
              if (!isActive('/all-matches')) {
                e.target.style.backgroundColor = `${colors.border}30`;
                e.target.style.transform = 'translateX(4px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/all-matches')) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateX(0)';
              }
            }}
            onClick={() => handleNavigation('/all-matches')}
          >
            <div className="flex items-center gap-4">
              <TableIcon />
              <span>Tüm Maçlar</span>
            </div>
            {isActive('/all-matches') && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-sm opacity-50 -z-10"></div>
            )}
          </button>
          
          <button
            className="group relative w-full flex items-center justify-start h-14 px-4 rounded-2xl font-semibold transition-all duration-300 overflow-hidden"
            style={{
              background: isActive('/leagues') 
                ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                : 'transparent',
              color: isActive('/leagues') ? '#ffffff' : colors.text
            }}
            onMouseEnter={(e) => {
              if (!isActive('/leagues')) {
                e.target.style.backgroundColor = `${colors.border}30`;
                e.target.style.transform = 'translateX(4px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/leagues')) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateX(0)';
              }
            }}
            onClick={() => handleNavigation('/leagues')}
          >
            <div className="flex items-center gap-4">
              <ListIcon />
              <span>Ligler</span>
            </div>
            {isActive('/leagues') && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-sm opacity-50 -z-10"></div>
            )}
          </button>
        </nav>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <nav className="relative backdrop-blur-xl border-b shadow-2xl h-20 overflow-hidden" style={{ 
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(45, 45, 45, 0.95) 100%)' 
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 249, 249, 0.95) 100%)',
        borderColor: colors.border 
      }}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4">
              <button 
                onClick={handleDrawerToggle}
                className="lg:hidden p-3 rounded-xl transition-all duration-300 hover:scale-105"
                style={{ 
                  color: colors.text,
                  backgroundColor: `${colors.border}20`
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.border;
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = `${colors.border}20`;
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <MenuIcon />
              </button>
              
              <div className="flex items-center gap-4">
                {/* Enhanced Logo */}
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl blur-md opacity-30 -z-10"></div>
                </div>
                
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    TahminAI
                  </h1>
                  <p className="text-xs opacity-70" style={{ color: colors.textSecondary }}>
                    Futbol Tahminleri
                  </p>
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                className="group relative flex items-center px-6 py-3 rounded-2xl font-semibold transition-all duration-300 overflow-hidden"
                style={{
                  backgroundColor: isActive('/active-matches') 
                    ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                    : 'transparent',
                  color: isActive('/active-matches') ? '#ffffff' : colors.text
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/active-matches')) {
                    e.target.style.backgroundColor = `${colors.border}30`;
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/active-matches')) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
                onClick={() => navigate('/active-matches')}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <PlayIcon />
                    {isActive('/active-matches') && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <span>Canlı Maçlar</span>
                </div>
                {isActive('/active-matches') && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-sm opacity-50 -z-10"></div>
                )}
              </button>
              
              <button
                className="group flex items-center px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
                style={{
                  backgroundColor: isActive('/all-matches') 
                    ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                    : 'transparent',
                  color: isActive('/all-matches') ? '#ffffff' : colors.text
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/all-matches')) {
                    e.target.style.backgroundColor = `${colors.border}30`;
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/all-matches')) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
                onClick={() => navigate('/all-matches')}
              >
                <div className="flex items-center gap-3">
                  <TableIcon />
                  <span>Tüm Maçlar</span>
                </div>
                {isActive('/all-matches') && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-sm opacity-50 -z-10"></div>
                )}
              </button>
              
              <button
                className="group flex items-center px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
                style={{
                  backgroundColor: isActive('/leagues') 
                    ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                    : 'transparent',
                  color: isActive('/leagues') ? '#ffffff' : colors.text
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/leagues')) {
                    e.target.style.backgroundColor = `${colors.border}30`;
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/leagues')) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
                onClick={() => navigate('/leagues')}
              >
                <div className="flex items-center gap-3">
                  <ListIcon />
                  <span>Ligler</span>
                </div>
                {isActive('/leagues') && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-sm opacity-50 -z-10"></div>
                )}
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
      <main className="container mx-auto px-4 py-8 pb-24">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t shadow-2xl" style={{ 
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(45, 45, 45, 0.95) 100%)' 
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 249, 249, 0.95) 100%)',
        borderColor: colors.border 
      }}>
        <div className="grid grid-cols-3 h-20">
          <button
            className="group relative h-full flex flex-col items-center justify-center gap-2 transition-all duration-300"
            style={{
              background: getActiveTab() === 0 
                ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                : 'transparent',
              color: getActiveTab() === 0 ? '#ffffff' : colors.text
            }}
            onMouseEnter={(e) => {
              if (getActiveTab() !== 0) {
                e.target.style.backgroundColor = `${colors.border}30`;
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (getActiveTab() !== 0) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }
            }}
            onClick={() => navigate('/active-matches')}
          >
            <div className="relative">
              <PlayIcon />
              {getActiveTab() === 0 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <span className="text-xs font-medium">Canlı Maçlar</span>
            {getActiveTab() === 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl blur-sm opacity-50 -z-10"></div>
            )}
          </button>
          
          <button
            className="group relative h-full flex flex-col items-center justify-center gap-2 transition-all duration-300"
            style={{
              background: getActiveTab() === 1 
                ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                : 'transparent',
              color: getActiveTab() === 1 ? '#ffffff' : colors.text
            }}
            onMouseEnter={(e) => {
              if (getActiveTab() !== 1) {
                e.target.style.backgroundColor = `${colors.border}30`;
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (getActiveTab() !== 1) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }
            }}
            onClick={() => navigate('/all-matches')}
          >
            <TableIcon />
            <span className="text-xs font-medium">Tüm Maçlar</span>
            {getActiveTab() === 1 && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl blur-sm opacity-50 -z-10"></div>
            )}
          </button>
          
          <button
            className="group relative h-full flex flex-col items-center justify-center gap-2 transition-all duration-300"
            style={{
              background: getActiveTab() === 2 
                ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                : 'transparent',
              color: getActiveTab() === 2 ? '#ffffff' : colors.text
            }}
            onMouseEnter={(e) => {
              if (getActiveTab() !== 2) {
                e.target.style.backgroundColor = `${colors.border}30`;
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (getActiveTab() !== 2) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }
            }}
            onClick={() => navigate('/leagues')}
          >
            <ListIcon />
            <span className="text-xs font-medium">Ligler</span>
            {getActiveTab() === 2 && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl blur-sm opacity-50 -z-10"></div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Layout;