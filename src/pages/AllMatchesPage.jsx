import React, { useState } from 'react';
import AllMatches from '../components/AllMatches';
import { useTheme } from '../contexts/ThemeContext';

const AllMatchesPage = () => {
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());



  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Simple SVG icons
  const ChevronLeftIcon = ({ className = "h-4 w-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
  
  const ChevronRightIcon = ({ className = "h-4 w-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );



  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Tüm Maçlar
          </h1>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
        </div>
        <p className="text-sm opacity-70 mt-4" style={{ color: colors.textSecondary }}>
          Tarihe göre maçları keşfedin !
        </p>
      </div>

      {/* Date Selector */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-2xl shadow-xl backdrop-blur-sm border overflow-hidden" style={{ borderColor: colors.border }}>
          <button
            onClick={() => changeDate(-1)}
            className="group flex items-center gap-2 px-6 py-3 transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: `${colors.cardBackground}E6`,
              color: colors.text
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = `${colors.border}40`;
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = `${colors.cardBackground}E6`;
              e.target.style.transform = 'scale(1)';
            }}
          >
            <ChevronLeftIcon className="w-5 h-5" />
            <span className="font-semibold">Önceki</span>
          </button>
          
          <div className="flex items-center gap-3 px-6 py-3 border-l border-r" style={{ 
            backgroundColor: `${colors.background}E6`,
            borderColor: colors.border,
            color: colors.text 
          }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-bold text-lg">
              {selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          
          <button
            onClick={() => changeDate(1)}
            className="group flex items-center gap-2 px-6 py-3 transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: `${colors.cardBackground}E6`,
              color: colors.text
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = `${colors.border}40`;
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = `${colors.cardBackground}E6`;
              e.target.style.transform = 'scale(1)';
            }}
          >
            <span className="font-semibold">Sonraki</span>
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <AllMatches selectedDate={selectedDate} changeDate={changeDate} />
    </div>
  );
};

export default AllMatchesPage;