import React, { useState, useEffect } from 'react';

export interface DateRange {
  startDate: string;
  endDate: string;
}

interface DateRangeFilterProps {
  defaultRange?: DateRange;
  onFilterChange: (range: DateRange) => void;
}

const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ defaultRange, onFilterChange }) => {
  const getToday = () => formatDateForInput(new Date());
  
  const [startDate, setStartDate] = useState<string>(() => 
    defaultRange?.startDate || getToday()
  );
  const [endDate, setEndDate] = useState<string>(() => 
    defaultRange?.endDate || getToday()
  );
  const [activePreset, setActivePreset] = useState<string>(() => {
    if (defaultRange?.startDate === getToday() && defaultRange?.endDate === getToday()) return 'today';
    return '';
  });


  useEffect(() => {
    if (defaultRange) {
      setStartDate(defaultRange.startDate);
      setEndDate(defaultRange.endDate);
      if (defaultRange.startDate === getToday() && defaultRange.endDate === getToday()) {
        setActivePreset('today');
      } else {
        setActivePreset('');
      }
    }
  }, [defaultRange]);


  const handleApplyFilter = () => {
    if (startDate && endDate) {
      onFilterChange({ startDate, endDate });
      setActivePreset('');
    } else {
      alert("Please select both Start Date and End Date.");
    }
  };

  const setPresetRange = (preset: string) => {
    let newStartDate = new Date();
    let newEndDate = new Date();
    setActivePreset(preset);

    switch (preset) {
      case 'today':
        break;
      case 'thisWeek':
        const dayOfWeek = newStartDate.getDay();
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        newStartDate.setDate(newStartDate.getDate() + diffToMonday);
        newEndDate = new Date(newStartDate);
        newEndDate.setDate(newStartDate.getDate() + 6);
        break;
      case 'thisMonth':
        newStartDate = new Date(newStartDate.getFullYear(), newStartDate.getMonth(), 1);
        newEndDate = new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);
        break;
      case 'lastWeek':
        newStartDate.setDate(newStartDate.getDate() - newStartDate.getDay() - 6);
        newEndDate = new Date(newStartDate);
        newEndDate.setDate(newStartDate.getDate() + 6);
        break;
      default:
        return;
    }
    const formattedStartDate = formatDateForInput(newStartDate);
    const formattedEndDate = formatDateForInput(newEndDate);
    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
    onFilterChange({ startDate: formattedStartDate, endDate: formattedEndDate });
  };
  
  const presetButtons = [
    { label: 'Hari Ini', value: 'today' },
    { label: 'Minggu Ini', value: 'thisWeek' },
    { label: 'Bulan Ini', value: 'thisMonth' },
    { label: 'Minggu Kemarin', value: 'lastWeek' },
  ];

  return (
    <div className="p-4 mb-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {presetButtons.map(btn => (
          <button
            key={btn.value}
            onClick={() => setPresetRange(btn.value)}
            className={`px-3 py-2 text-sm rounded-md transition-colors ${
              activePreset === btn.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex-1">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setActivePreset(''); }}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setActivePreset(''); }}
            min={startDate}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleApplyFilter}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition sm:self-end h-[42px]"
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
};

export default DateRangeFilter;