import React from 'react';

interface StudyHeatmapProps {
  data: Record<string, number>;
}

const StudyHeatmap: React.FC<StudyHeatmapProps> = ({ data }) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 365);

  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const getColor = (value: number) => {
    if (value === 0) return 'bg-gray-200 dark:bg-gray-800';
    if (value < 2) return 'bg-green-200 dark:bg-green-900';
    if (value < 4) return 'bg-green-400 dark:bg-green-700';
    return 'bg-green-600 dark:bg-green-500';
  };

  return (
    <div className="grid grid-flow-col grid-rows-7 gap-1">
      {dates.map(date => {
        const dateString = date.toISOString().slice(0, 10);
        const value = data[dateString] || 0;
        return (
          <div
            key={dateString}
            className={`w-4 h-4 rounded ${getColor(value)}`}
            title={`${dateString}: ${value} hours`}
          />
        );
      })}
    </div>
  );
};

export default StudyHeatmap;