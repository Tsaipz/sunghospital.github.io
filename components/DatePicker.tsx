
import React from 'react';

interface DatePickerProps {
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (val: string) => void;
  minYear?: number;
  maxYear?: number;
}

const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange, minYear = 1970, maxYear = new Date().getFullYear() }) => {
  const parts = value.split('-');
  const y = parts[0] || '';
  const m = parts[1] || '';
  const d = parts[2] || '';

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  const handleChange = (part: 'y' | 'm' | 'd', val: string) => {
    const ny = part === 'y' ? val : y;
    const nm = part === 'm' ? val : m;
    const nd = part === 'd' ? val : d;
    onChange(`${ny}-${nm}-${nd}`);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <select 
            value={y} 
            onChange={(e) => handleChange('y', e.target.value)}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 bg-white border p-2.5 text-gray-700 appearance-none transition-colors hover:border-gray-400"
          >
            <option value="" disabled>年</option>
            {years.map(year => <option key={year} value={year}>{year} 年</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
          </div>
        </div>

        <div className="relative flex-1">
          <select 
            value={m} 
            onChange={(e) => handleChange('m', e.target.value)}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 bg-white border p-2.5 text-gray-700 appearance-none transition-colors hover:border-gray-400"
          >
            <option value="" disabled>月</option>
            {months.map(month => <option key={month} value={month}>{month} 月</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
          </div>
        </div>

        <div className="relative flex-1">
          <select 
            value={d} 
            onChange={(e) => handleChange('d', e.target.value)}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 bg-white border p-2.5 text-gray-700 appearance-none transition-colors hover:border-gray-400"
          >
            <option value="" disabled>日</option>
            {days.map(day => <option key={day} value={day}>{day} 日</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
