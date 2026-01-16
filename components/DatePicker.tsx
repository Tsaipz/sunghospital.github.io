
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

  const selectClass = "block w-full rounded-xl border-gray-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 bg-white border p-3 text-gray-700 appearance-none transition-all font-medium cursor-pointer hover:border-pink-200";

  return (
    <div className="mb-5">
      <label className="block text-sm font-bold text-gray-600 mb-2 pl-1">{label}</label>
      <div className="flex space-x-2">
        <div className="relative flex-[1.5]">
          <select 
            value={y} 
            onChange={(e) => handleChange('y', e.target.value)}
            className={selectClass}
          >
            <option value="" disabled>年份</option>
            {years.map(year => <option key={year} value={year}>{year} 年</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        <div className="relative flex-1">
          <select 
            value={m} 
            onChange={(e) => handleChange('m', e.target.value)}
            className={selectClass}
          >
            <option value="" disabled>月份</option>
            {months.map(month => <option key={month} value={month}>{month} 月</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        <div className="relative flex-1">
          <select 
            value={d} 
            onChange={(e) => handleChange('d', e.target.value)}
            className={selectClass}
          >
            <option value="" disabled>日期</option>
            {days.map(day => <option key={day} value={day}>{day} 日</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
