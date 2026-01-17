
import React, { useState, useEffect, useCallback } from 'react';
import { TreatmentStage, CalculationForm, CalculationResult } from './types';
import { calculateSubsidy } from './constants';
import DatePicker from './components/DatePicker';

const App: React.FC = () => {
  const [form, setForm] = useState<CalculationForm>({
    birthDate: '1990-01-01',
    isLowIncome: false,
    isFirstApplication: true,
    treatmentCount: 1,
    stage: TreatmentStage.Full,
    firstApplicationDate: new Date().toISOString().split('T')[0],
    transferDate: new Date().toISOString().split('T')[0]
  });

  const [history, setHistory] = useState<CalculationResult[]>([]);
  const [currentResult, setCurrentResult] = useState<any | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ivf_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const saveHistory = useCallback((res: CalculationResult) => {
    setHistory(prev => {
      const updated = [res, ...prev].slice(0, 10);
      localStorage.setItem('ivf_history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleCalculate = () => {
    const resultData = calculateSubsidy(form);
    const result: any = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      formData: { ...form },
      ...resultData,
      ageAtApplication: resultData.age 
    };

    setCurrentResult(result);
    if (resultData.subsidy2_0 > 0 || resultData.subsidy3_0 > 0) {
      saveHistory(result);
    }
    
    setTimeout(() => {
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const loadFromHistory = (item: CalculationResult) => {
    setForm(item.formData);
    setCurrentResult(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearHistory = () => {
    if (window.confirm('確定要清除所有試算紀錄嗎？')) {
      setHistory([]);
      localStorage.removeItem('ivf_history');
    }
  };

  const isNewSchemeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const threshold = new Date('2025-11-01');
    return date >= threshold;
  };

  const brandColor = "#EE929C";
  const brandBgLight = "rgba(238, 146, 156, 0.1)";
  const brandBorderLight = "rgba(238, 146, 156, 0.2)";

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: brandColor, boxShadow: `0 10px 15px -3px ${brandColor}44` }}
            >
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-800 tracking-tight">試管嬰兒補助試算器</h1>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: brandColor }}>Version 3.0 新制同步</span>
              </div>
            </div>
          </div>
          <a 
            href="https://www.sunghospital.com.tw/pediatrics/2025最新試管嬰兒補助3.0/" 
            target="_blank" 
            className="hidden sm:flex px-5 py-2.5 rounded-full font-bold text-sm items-center transition-all border"
            style={{ backgroundColor: brandBgLight, color: brandColor, borderColor: brandColor + '33' }}
          >
            使用必看指南 
            <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Section */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 h-fit">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: brandColor }}></div>
            <h2 className="text-xl font-black text-gray-800 tracking-tight">填寫申請資料</h2>
          </div>

          <DatePicker 
            label="您的出生年月日" 
            value={form.birthDate} 
            onChange={(val) => setForm(f => ({ ...f, birthDate: val }))}
            minYear={1970}
            maxYear={2015}
            accentColor={brandColor}
          />

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-600 mb-3 pl-1">是否為低收入戶或中低收入戶？</label>
            <div className="flex space-x-3">
              <button 
                onClick={() => setForm(f => ({ ...f, isLowIncome: true }))}
                className="flex-1 py-3.5 px-4 rounded-xl border-2 transition-all flex items-center justify-center font-bold"
                style={{ 
                  backgroundColor: form.isLowIncome ? brandBgLight : 'white',
                  borderColor: form.isLowIncome ? brandColor : '#F1F5F9',
                  color: form.isLowIncome ? brandColor : '#94A3B8'
                }}
              >是</button>
              <button 
                onClick={() => setForm(f => ({ ...f, isLowIncome: false }))}
                className="flex-1 py-3.5 px-4 rounded-xl border-2 transition-all flex items-center justify-center font-bold"
                style={{ 
                  backgroundColor: !form.isLowIncome ? brandBgLight : 'white',
                  borderColor: !form.isLowIncome ? brandColor : '#F1F5F9',
                  color: !form.isLowIncome ? brandColor : '#94A3B8'
                }}
              >否</button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-600 mb-3 pl-1">是否首次申請補助？</label>
            <div className="flex space-x-3">
              <button 
                onClick={() => setForm(f => ({ ...f, isFirstApplication: true }))}
                className="flex-1 py-3.5 px-4 rounded-xl border-2 transition-all flex items-center justify-center font-bold"
                style={{ 
                  backgroundColor: form.isFirstApplication ? brandBgLight : 'white',
                  borderColor: form.isFirstApplication ? brandColor : '#F1F5F9',
                  color: form.isFirstApplication ? brandColor : '#94A3B8'
                }}
              >是</button>
              <button 
                onClick={() => setForm(f => ({ ...f, isFirstApplication: false }))}
                className="flex-1 py-3.5 px-4 rounded-xl border-2 transition-all flex items-center justify-center font-bold"
                style={{ 
                  backgroundColor: !form.isFirstApplication ? brandBgLight : 'white',
                  borderColor: !form.isFirstApplication ? brandColor : '#F1F5F9',
                  color: !form.isFirstApplication ? brandColor : '#94A3B8'
                }}
              >否</button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-600 mb-3 pl-1">這是第幾次療程？</label>
            <div className="relative">
              <select 
                value={form.treatmentCount}
                onChange={(e) => setForm(f => ({ ...f, treatmentCount: parseInt(e.target.value) }))}
                className="block w-full rounded-xl border-gray-200 shadow-sm focus:ring-0 bg-white border p-4 text-gray-700 appearance-none font-bold transition-all hover:border-slate-300"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>第 {num} 次療程</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-600 mb-4 pl-1">治療階段</label>
            <div className="flex flex-col space-y-2">
              {Object.values(TreatmentStage).map((s) => (
                <button
                  key={s}
                  onClick={() => setForm(f => ({ ...f, stage: s }))}
                  className="text-left py-4 px-5 rounded-2xl border-2 transition-all flex items-center justify-between"
                  style={{ 
                    backgroundColor: form.stage === s ? brandColor : 'white',
                    borderColor: form.stage === s ? brandColor : '#F8FAFC',
                    color: form.stage === s ? 'white' : '#64748B',
                    fontWeight: form.stage === s ? '700' : '400'
                  }}
                >
                  <span className="text-sm">{s}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 pt-8 border-t border-gray-100">
            <DatePicker 
              label="首次申請日期" 
              value={form.firstApplicationDate} 
              onChange={(val) => setForm(f => ({ ...f, firstApplicationDate: val }))}
              minYear={2021}
              maxYear={2026}
              accentColor={brandColor}
            />

            {(form.stage === TreatmentStage.Full || form.stage === TreatmentStage.EmbryoOnly) && (
              <DatePicker 
                label="植入日期" 
                value={form.transferDate || ''} 
                onChange={(val) => setForm(f => ({ ...f, transferDate: val }))}
                minYear={2021}
                maxYear={2026}
                accentColor={brandColor}
              />
            )}
          </div>

          <button 
            onClick={handleCalculate}
            className="w-full mt-10 text-white py-5 rounded-2xl font-black text-xl shadow-xl transform active:scale-[0.98] transition-all"
            style={{ 
              backgroundColor: brandColor, 
              boxShadow: `0 10px 25px -5px ${brandColor}44` 
            }}
          >
            立即計算結果
          </button>
        </div>

        {/* Right Content Section */}
        <div className="lg:col-span-7 space-y-8">
          {/* Result Card */}
          <section id="result-section" className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-8">
              <h2 className="text-2xl font-black text-gray-800 mb-6 tracking-tight">補助方案比較</h2>
              
              {currentResult ? (
                <div className="space-y-6">
                  <div 
                    className="p-6 rounded-2xl border flex items-start space-x-4"
                    style={{ backgroundColor: brandBgLight, borderColor: brandBorderLight }}
                  >
                    <div className="p-2 rounded-lg" style={{ backgroundColor: brandColor + '22' }}>
                      <span className="text-2xl">{isNewSchemeDate(currentResult.formData.firstApplicationDate) ? '⚠️' : '⚠️'}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-lg mb-1" style={{ color: brandColor }}>
                        {isNewSchemeDate(currentResult.formData.firstApplicationDate) ? '適用 3.0 新制補助' : '適用 2.0 舊制補助'}
                      </p>
                      <p className="text-sm font-bold leading-relaxed" style={{ color: brandColor }}>
                        您的申請日期為 <span className="underline decoration-2">{currentResult.formData.firstApplicationDate.replace(/-/g, '/')}</span>。<br/>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded text-[12px]" style={{ backgroundColor: brandColor + '11', color: brandColor }}>
                          {isNewSchemeDate(currentResult.formData.firstApplicationDate) 
                            ? '申請日期於 2025/11/1 (含) 之後適用新制，若申請日期於 2025/10/31 (含) 以前適用舊制。' 
                            : '申請日期在 2025/10/31 (含) 以前適用舊制，若申請日期於 2025/11/1 (含) 之後適用新制。'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-gray-100 rounded-xl custom-scrollbar">
                    <table className="w-full text-left min-w-[600px]">
                      <thead className="bg-[#F8F9FA]">
                        <tr>
                          <th className="px-4 py-4 text-sm font-black text-gray-600">補助方案</th>
                          <th className="px-4 py-4 text-sm font-black text-gray-600 text-center">可申請金額</th>
                          <th className="px-4 py-4 text-sm font-black text-gray-600 text-center">可植入上限</th>
                          <th className="px-4 py-4 text-sm font-black text-gray-600 text-center">狀態</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className={`${isNewSchemeDate(currentResult.formData.firstApplicationDate) ? 'bg-slate-50/50' : 'bg-white'} hover:bg-slate-50 transition-colors`}>
                          <td className="px-4 py-6">
                            <p className="font-black" style={{ color: isNewSchemeDate(currentResult.formData.firstApplicationDate) ? brandColor : '#94A3B8' }}>補助 3.0</p>
                            <p className="text-xs text-gray-400">(新制)</p>
                          </td>
                          <td className="px-4 py-6 text-center">
                            <span className="text-2xl font-black" style={{ color: isNewSchemeDate(currentResult.formData.firstApplicationDate) ? brandColor : '#CBD5E1' }}>
                              {currentResult.subsidy3_0.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-400 ml-1">元</span>
                          </td>
                          <td className="px-4 py-6 text-center">
                            <p className="font-black" style={{ color: isNewSchemeDate(currentResult.formData.firstApplicationDate) ? '#334155' : '#CBD5E1' }}>{currentResult.transferLimit} 顆</p>
                          </td>
                          <td className="px-4 py-6 text-center">
                            {isNewSchemeDate(currentResult.formData.firstApplicationDate) ? (
                              <span className="text-white text-[10px] px-2 py-1 rounded-full font-bold" style={{ backgroundColor: brandColor }}>目前適用</span>
                            ) : (
                              <span className="text-gray-300 text-[10px] font-bold">僅供參考</span>
                            )}
                          </td>
                        </tr>
                        <tr className={`${!isNewSchemeDate(currentResult.formData.firstApplicationDate) ? 'bg-slate-50/20' : 'bg-white'} hover:bg-slate-50 transition-colors`}>
                          <td className="px-4 py-6">
                            <p className="font-black" style={{ color: !isNewSchemeDate(currentResult.formData.firstApplicationDate) ? brandColor : '#94A3B8' }}>補助 2.0</p>
                            <p className="text-xs text-gray-400">(舊制)</p>
                          </td>
                          <td className="px-4 py-6 text-center">
                            <span className="text-2xl font-black" style={{ color: !isNewSchemeDate(currentResult.formData.firstApplicationDate) ? brandColor : '#CBD5E1' }}>
                              {currentResult.subsidy2_0.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-400 ml-1">元</span>
                          </td>
                          <td className="px-4 py-6 text-center">
                            <p className="font-black" style={{ color: !isNewSchemeDate(currentResult.formData.firstApplicationDate) ? '#334155' : '#CBD5E1' }}>{currentResult.transferLimit} 顆</p>
                          </td>
                          <td className="px-4 py-6 text-center">
                            {!isNewSchemeDate(currentResult.formData.firstApplicationDate) ? (
                              <span className="text-white text-[10px] px-2 py-1 rounded-full font-bold" style={{ backgroundColor: brandColor }}>目前適用</span>
                            ) : (
                              <span className="text-gray-300 text-[10px] font-bold">僅供參考</span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div 
                    className="mt-10 p-6 sm:p-8 rounded-3xl border-2 shadow-inner text-center animate-pulse"
                    style={{ backgroundColor: brandBgLight, borderColor: brandColor + '44' }}
                  >
                      <p className="font-bold text-lg mb-2" style={{ color: brandColor }}>試算結果（適用方案）：</p>
                      <p className="text-4xl sm:text-5xl font-black tracking-tighter" style={{ color: brandColor }}>
                          <span className="text-xl sm:text-2xl mr-1">NT$</span>
                          {(isNewSchemeDate(currentResult.formData.firstApplicationDate) ? currentResult.subsidy3_0 : currentResult.subsidy2_0).toLocaleString()}
                      </p>
                      <p className="text-xs mt-4 font-bold italic" style={{ color: brandColor + 'AA' }}>※ 實際金額依主管機關核定為準</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 opacity-50">
                  <p className="text-slate-400 font-bold leading-relaxed">請填寫左側申請資料後<br/>點擊計算結果按鈕</p>
                </div>
              )}
            </div>
          </section>

          {/* Calculation History Section - 始終顯示 */}
          <section className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-800 tracking-tight">試算歷史紀錄</h3>
                {history.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="text-xs font-bold text-gray-400 hover:text-rose-500 transition-colors"
                  >清除紀錄</button>
                )}
              </div>
              
              {history.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {history.map((item) => {
                    const isNew = isNewSchemeDate(item.formData.firstApplicationDate);
                    const finalSubsidy = isNew ? item.subsidy3_0 : item.subsidy2_0;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        className="w-full text-left p-4 rounded-2xl border-2 border-gray-50 bg-gray-50/30 hover:bg-white hover:border-pink-200 hover:shadow-md transition-all group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                              {new Date(item.timestamp).toLocaleString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <div className="flex items-center mt-1">
                              <span className="text-sm font-black text-gray-700">第 {item.formData.treatmentCount} 次療程</span>
                              <span className="mx-2 text-gray-300">|</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-gray-500 border border-gray-100 truncate max-w-[120px]">
                                {item.formData.stage}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black" style={{ color: brandColor }}>
                              ${finalSubsidy.toLocaleString()}
                            </p>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isNew ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              {isNew ? '新制 3.0' : '舊制 2.0'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] font-bold text-pink-400">載入此數據內容 →</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 text-sm font-bold">尚無試算紀錄</p>
                  <p className="text-slate-300 text-[10px] mt-1">您的前 10 筆試算將會保存在此處</p>
                </div>
              )}
            </div>
          </section>

          <footer className="mt-20 py-12 text-center bg-white border-t border-gray-100 rounded-3xl">
            <div className="max-w-4xl mx-auto px-4">
              <p className="text-xs font-black text-slate-400 tracking-[0.2em] uppercase mb-4">© Copyright All Rights Reserved apple web design</p>
              <div className="space-y-1 mb-6">
                <p className="text-sm text-slate-500 font-bold">此試算僅供參考，實際補助金額以衛福部國民健康署最新公告為準。</p>
              </div>
            </div>
          </footer>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.01); } }
        .animate-pulse { animation: pulse 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default App;
