
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
  const [currentResult, setCurrentResult] = useState<CalculationResult | null>(null);

  // Load history on mount
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
    const { subsidy2_0, subsidy3_0, age, eligible, message } = calculateSubsidy(form);
    
    const result: CalculationResult = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      formData: { ...form },
      subsidy2_0,
      subsidy3_0,
      ageAtApplication: age,
      isEligible: eligible,
      message
    };

    setCurrentResult(result);
    saveHistory(result);
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const loadFromHistory = (item: CalculationResult) => {
    setForm(item.formData);
    setCurrentResult(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center shadow-sm shadow-pink-200">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">試管嬰兒補助試算器</h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider">IVF SUBSIDY CALCULATOR</p>
            </div>
          </div>
          <a 
            href="https://www.sunghospital.com.tw/pediatrics/2025最新試管嬰兒補助3.0/" 
            target="_blank" 
            className="bg-pink-50 text-pink-600 hover:bg-pink-100 px-4 py-2 rounded-full font-bold text-sm flex items-center transition-all border border-pink-100"
          >
            使用必看指南 
            <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-1.5 h-6 bg-pink-500 rounded-full"></div>
            <h2 className="text-xl font-black text-gray-800 tracking-tight">填寫申請資料</h2>
          </div>

          <DatePicker 
            label="您的出生年月日" 
            value={form.birthDate} 
            onChange={(val) => setForm(f => ({ ...f, birthDate: val }))}
            minYear={1970}
            maxYear={2010}
          />

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">是否為低收入戶或中低收入戶？</label>
            <div className="flex space-x-3">
              <button 
                onClick={() => setForm(f => ({ ...f, isLowIncome: true }))}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center ${form.isLowIncome ? 'bg-pink-50 border-pink-500 text-pink-700 font-bold shadow-sm' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'}`}
              >
                {form.isLowIncome && <span className="mr-2">✓</span>} 是
              </button>
              <button 
                onClick={() => setForm(f => ({ ...f, isLowIncome: false }))}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center ${!form.isLowIncome ? 'bg-pink-50 border-pink-500 text-pink-700 font-bold shadow-sm' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'}`}
              >
                {!form.isLowIncome && <span className="mr-2">✓</span>} 否
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">是否首次申請補助？</label>
            <div className="flex space-x-3">
              <button 
                onClick={() => setForm(f => ({ ...f, isFirstApplication: true }))}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center ${form.isFirstApplication ? 'bg-pink-50 border-pink-500 text-pink-700 font-bold shadow-sm' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'}`}
              >
                {form.isFirstApplication && <span className="mr-2">✓</span>} 是
              </button>
              <button 
                onClick={() => setForm(f => ({ ...f, isFirstApplication: false }))}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center ${!form.isFirstApplication ? 'bg-pink-50 border-pink-500 text-pink-700 font-bold shadow-sm' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'}`}
              >
                {!form.isFirstApplication && <span className="mr-2">✓</span>} 否
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">這是第幾次療程？</label>
            <div className="relative">
              <select 
                value={form.treatmentCount}
                onChange={(e) => setForm(f => ({ ...f, treatmentCount: parseInt(e.target.value) }))}
                className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 bg-white border p-3.5 text-gray-700 appearance-none font-medium"
              >
                <option value="" disabled>請選擇療程次數</option>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>第 {num} 次療程</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-4">治療階段</label>
            <div className="flex flex-col space-y-2">
              {Object.values(TreatmentStage).map((s) => (
                <button
                  key={s}
                  onClick={() => setForm(f => ({ ...f, stage: s }))}
                  className={`text-left py-4 px-5 rounded-2xl border-2 transition-all flex items-center justify-between ${form.stage === s ? 'bg-pink-600 border-pink-600 text-white font-bold shadow-lg shadow-pink-200' : 'bg-white border-gray-100 text-gray-600 hover:border-pink-200 hover:bg-pink-50/30'}`}
                >
                  <span>{s}</span>
                  {form.stage === s ? (
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-pink-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    </div>
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-200 rounded-full"></div>
                  )}
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
            />

            {(form.stage === TreatmentStage.Full || form.stage === TreatmentStage.EmbryoOnly) && (
              <DatePicker 
                label="植入日期" 
                value={form.transferDate || ''} 
                onChange={(val) => setForm(f => ({ ...f, transferDate: val }))}
                minYear={2021}
                maxYear={2026}
              />
            )}
          </div>

          <button 
            onClick={handleCalculate}
            className="w-full mt-10 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-pink-200 transform active:scale-[0.98] transition-all"
          >
            開始補助試算
          </button>
        </div>

        {/* Right Column: Results & History */}
        <div className="lg:col-span-5 space-y-8">
          {/* Current Result */}
          <section id="result-section" className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
            
            <div className="flex items-center space-x-2 mb-8 relative z-10">
              <div className="w-1.5 h-6 bg-green-500 rounded-full"></div>
              <h2 className="text-xl font-black text-gray-800 tracking-tight">試算結果</h2>
            </div>
            
            {currentResult ? (
              <div className="space-y-8 relative z-10">
                {!currentResult.isEligible ? (
                  <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                      </div>
                      <p className="font-black text-lg">不符合補助資格</p>
                    </div>
                    <p className="text-sm leading-relaxed opacity-80 pl-11">{currentResult.message}</p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col space-y-4">
                      <div className="bg-white p-6 rounded-2xl border-2 border-blue-100 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
                        <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity">
                          <svg className="w-24 h-24 text-blue-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        </div>
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-1">IVF Subsidy 2.0</p>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">試管嬰兒補助 2.0</h3>
                        <p className="text-4xl font-black text-blue-600 tracking-tighter">
                          <span className="text-xl mr-1 font-bold">$</span>{currentResult.subsidy2_0.toLocaleString()}
                        </p>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border-2 border-pink-100 shadow-sm relative overflow-hidden group hover:border-pink-300 transition-colors">
                        <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity">
                          <svg className="w-24 h-24 text-pink-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        </div>
                        <p className="text-xs text-pink-600 font-bold uppercase tracking-widest mb-1">IVF Subsidy 3.0</p>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">試管嬰兒補助 3.0</h3>
                        <p className="text-4xl font-black text-pink-600 tracking-tighter">
                          <span className="text-xl mr-1 font-bold">$</span>{currentResult.subsidy3_0.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">試算年齡</p>
                        <p className="text-sm font-black text-gray-700">{currentResult.ageAtApplication} 歲</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">療程次數</p>
                        <p className="text-sm font-black text-gray-700">第 {currentResult.formData.treatmentCount} 次</p>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="pt-6 border-t border-dashed border-gray-200 flex flex-col space-y-3">
                  <a 
                    href="https://docs.google.com/spreadsheets/d/1R2UdEPrL0Sr-2Q7Dgs3VS8HJpZajqjKO/edit?usp=drive_link&ouid=106023826871584564473&rtpof=true&sd=true" 
                    target="_blank"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-sm font-bold text-gray-600">2.0 詳細對照表</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </a>
                  <a 
                    href="https://docs.google.com/spreadsheets/d/1BkNOZZ05_rGyv_uF3zj54C1jc68hWAWT/edit?gid=828323340#gid=828323340" 
                    target="_blank"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-sm font-bold text-gray-600">3.0 詳細對照表</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 relative z-10">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                </div>
                <p className="text-gray-400 font-medium">請輸入左側資料後<br/>點擊下方的試算按鈕</p>
              </div>
            )}
          </section>

          {/* History */}
          <section className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-1.5 h-6 bg-gray-300 rounded-full"></div>
              <h2 className="text-xl font-black text-gray-800 tracking-tight">計算歷史</h2>
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {history.length > 0 ? (
                history.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-5 border border-gray-50 rounded-2xl hover:bg-pink-50/20 hover:border-pink-100 transition-all group cursor-pointer"
                    onClick={() => loadFromHistory(item)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                        <p className="text-sm font-black text-gray-700 line-clamp-1">{item.formData.stage}</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium">第 {item.formData.treatmentCount} 次療程</p>
                      </div>
                      <div className="text-right">
                        <div className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-[10px] font-black inline-block mb-2">
                          3.0: ${item.subsidy3_0.toLocaleString()}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] text-pink-500 font-black flex items-center justify-end">
                            載入 <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5-5 5M6 7l5 5-5 5"></path></svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 opacity-30">
                  <p className="text-sm font-medium">暫無試算紀錄</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-20 py-10 text-center border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm font-black text-gray-400 tracking-widest uppercase">© 2025 聖醫院 Sun Hospital</p>
          <div className="flex justify-center space-x-4 mt-4 text-[10px] font-bold text-gray-300">
            <span>試管嬰兒補助試算專用</span>
            <span>•</span>
            <span>專業醫護團隊</span>
            <span>•</span>
            <span>用心守護幸福</span>
          </div>
          <p className="mt-8 text-[10px] text-gray-300 leading-relaxed max-w-xl mx-auto">
            免責聲明：本工具提供之試算結果係依據現行政策規章進行估計，僅供參考之用。實際補助資格及金額應以相關主管機關最終審核結果為準。如有任何變動，恕不另行通知。
          </p>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default App;
