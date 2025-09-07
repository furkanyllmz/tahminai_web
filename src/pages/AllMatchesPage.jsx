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
    <div className="p-2 max-w-2xl mx-auto space-y-2">
      <h2 className="text-lg font-bold text-center mb-2" style={{ color: colors.text }}> Tüm Maçlar</h2>
      
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => changeDate(-1)}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: "500",
              backgroundColor: colors.cardBackground,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              borderRadius: "6px 0 0 6px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = colors.border}
            onMouseLeave={(e) => e.target.style.backgroundColor = colors.cardBackground}
          >
            <ChevronLeftIcon className="mr-1" />
            Önceki Gün
          </button>
          <span style={{
            padding: "8px 16px",
            fontSize: "14px",
            fontWeight: "500",
            backgroundColor: colors.background,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            borderLeft: "none",
            borderRight: "none"
          }}>
            {selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => changeDate(1)}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: "500",
              backgroundColor: colors.cardBackground,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              borderRadius: "0 6px 6px 0",
              display: "flex",
              alignItems: "center",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = colors.border}
            onMouseLeave={(e) => e.target.style.backgroundColor = colors.cardBackground}
          >
            Sonraki Gün
            <ChevronRightIcon className="ml-1" />
          </button>
        </div>
      </div>
      
      <AllMatches selectedDate={selectedDate} />
    </div>
  );
};

export default AllMatchesPage;