
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

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-100">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-800 tracking-tight">試管嬰兒補助試算器</h1>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-pink-500 font-bold tracking-widest uppercase">Version 3.0 新制同步</span>
              </div>
            </div>
          </div>
          <a 
            href="https://www.sunghospital.com.tw/pediatrics/2025最新試管嬰兒補助3.0/" 
            target="_blank" 
            className="hidden sm:flex bg-pink-50 text-pink-600 hover:bg-pink-100 px-5 py-2.5 rounded-full font-bold text-sm items-center transition-all border border-pink-100"
          >
            使用必看指南 
            <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左側：表單輸入 */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-1.5 h-6 bg-pink-500 rounded-full"></div>
            <h2 className="text-xl font-black text-gray-800 tracking-tight">填寫申請資料</h2>
          </div>

          <DatePicker 
            label="您的出生年月日" 
            value={form.birthDate} 
            onChange={(val) => setForm(f => ({ ...f, birthDate: val }))}
            minYear={1970}
            maxYear={2015}
          />

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-600 mb-3 pl-1">是否為低收入戶或中低收入戶？</label>
            <div className="flex space-x-3">
              <button 
                onClick={() => setForm(f => ({ ...f, isLowIncome: true }))}
                className={`flex-1 py-3.5 px-4 rounded-xl border-2 transition-all flex items-center justify-center font-bold ${form.isLowIncome ? 'bg-pink-50 border-pink-500 text-pink-700 shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
              >是</button>
              <button 
                onClick={() => setForm(f => ({ ...f, isLowIncome: false }))}
                className={`flex-1 py-3.5 px-4 rounded-xl border-2 transition-all flex items-center justify-center font-bold ${!form.isLowIncome ? 'bg-pink-50 border-pink-500 text-pink-700 shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
              >否</button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-600 mb-3 pl-1">是否首次申請補助？</label>
            <div className="flex space-x-3">
              <button 
                onClick={() => setForm(f => ({ ...f, isFirstApplication: true }))}
                className={`flex-1 py-3.5 px-4 rounded-xl border-2 transition-all flex items-center justify-center font-bold ${form.isFirstApplication ? 'bg-pink-50 border-pink-500 text-pink-700 shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
              >是</button>
              <button 
                onClick={() => setForm(f => ({ ...f, isFirstApplication: false }))}
                className={`flex-1 py-3.5 px-4 rounded-xl border-2 transition-all flex items-center justify-center font-bold ${!form.isFirstApplication ? 'bg-pink-50 border-pink-500 text-pink-700 shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
              >否</button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-600 mb-3 pl-1">這是第幾次療程？</label>
            <div className="relative">
              <select 
                value={form.treatmentCount}
                onChange={(e) => setForm(f => ({ ...f, treatmentCount: parseInt(e.target.value) }))}
                className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 bg-white border p-4 text-gray-700 appearance-none font-bold transition-all hover:border-pink-200"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>第 {num} 次療程</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-600 mb-4 pl-1">治療階段</label>
            <div className="flex flex-col space-y-2">
              {Object.values(TreatmentStage).map((s) => (
                <button
                  key={s}
                  onClick={() => setForm(f => ({ ...f, stage: s }))}
                  className={`text-left py-4 px-5 rounded-2xl border-2 transition-all flex items-center justify-between ${form.stage === s ? 'bg-pink-600 border-pink-600 text-white font-bold shadow-md shadow-pink-100' : 'bg-white border-gray-50 text-gray-500 hover:border-pink-100 hover:bg-pink-50/20'}`}
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
            立即計算結果
          </button>
        </div>

        {/* 右側：結果與歷史 */}
        <div className="lg:col-span-7 space-y-8">
          <section id="result-section" className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-8">
              <h2 className="text-2xl font-black text-gray-800 mb-6 tracking-tight">補助方案比較</h2>
              
              {currentResult ? (
                <div className="space-y-6">
                  {/* 警示訊息 */}
                  <div className="bg-[#FFF4E5] p-5 rounded-xl border border-[#FFD8A8] flex items-start space-x-3">
                    <span className="text-xl text-[#F08C00]">⚠️</span>
                    <p className="text-[#D9480F] text-sm font-bold leading-relaxed">
                      您的申請日期為 民國{parseInt(currentResult.formData.firstApplicationDate.split('-')[0]) - 1911}年{currentResult.formData.firstApplicationDate.split('-')[1]}月{currentResult.formData.firstApplicationDate.split('-')[2]}日 (含) 以前，結案將依 2.0 舊制補助辦理。
                    </p>
                  </div>

                  {/* 比較表格 */}
                  <div className="overflow-x-auto border border-gray-100 rounded-xl custom-scrollbar">
                    <table className="w-full text-left min-w-[600px]">
                      <thead className="bg-[#F8F9FA]">
                        <tr>
                          <th className="px-4 py-4 text-sm font-black text-gray-600">補助方案</th>
                          <th className="px-4 py-4 text-sm font-black text-gray-600 text-center">可申請金額</th>
                          <th className="px-4 py-4 text-sm font-black text-gray-600 text-center">可植入上限</th>
                          <th className="px-4 py-4 text-sm font-black text-gray-600 text-center">備註</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {/* 3.0 新制 */}
                        <tr className="bg-pink-50/30 hover:bg-pink-50/50 transition-colors">
                          <td className="px-4 py-6">
                            <p className="font-black text-pink-700">補助 3.0</p>
                            <p className="text-xs text-pink-400">(新制)</p>
                          </td>
                          <td className="px-4 py-6 text-center">
                            <div className="relative inline-block">
                                <span className="text-2xl font-black text-pink-600">
                                {currentResult.subsidy3_0.toLocaleString()}
                                </span>
                                <span className="text-xs text-pink-400 ml-1">元</span>
                            </div>
                          </td>
                          <td className="px-4 py-6 text-center">
                            <p className="font-black text-pink-700">{currentResult.transferLimit} 顆</p>
                            <p className="text-[10px] text-pink-400 mt-1 leading-tight max-w-[150px] mx-auto">
                              依 補助 3.0 (新制)，植入時年齡({currentResult.ageAtApplication}歲) 上限為 {currentResult.transferLimit} 顆。
                            </p>
                          </td>
                          <td className="px-4 py-6 text-center">
                            <span className="text-xs font-bold text-pink-500">當前推薦<br/>新制</span>
                          </td>
                        </tr>
                        {/* 2.0 舊制 */}
                        <tr className="bg-white hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-6">
                            <p className="font-black text-slate-400">補助 2.0</p>
                            <p className="text-xs text-slate-300">(舊制)</p>
                          </td>
                          <td className="px-4 py-6 text-center">
                            <span className="text-2xl font-black text-slate-300">
                              {currentResult.subsidy2_0.toLocaleString()}
                            </span>
                            <span className="text-xs text-slate-300 ml-1">元</span>
                          </td>
                          <td className="px-4 py-6 text-center">
                            <p className="font-black text-slate-300">{currentResult.transferLimit} 顆</p>
                            <p className="text-[10px] text-slate-300 mt-1 leading-tight max-w-[150px] mx-auto">
                              依 補助 2.0 (舊制)，植入時年齡({currentResult.ageAtApplication}歲) 上限為 {currentResult.transferLimit} 顆。
                            </p>
                          </td>
                          <td className="px-4 py-6 text-center">
                            <span className="text-xs font-bold text-slate-300">依此方案<br/>結案</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* 推薦醒目顯示區 */}
                  <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 shadow-inner text-center animate-pulse">
                      <div className="flex justify-center mb-2">
                            <span className="text-3xl">🎉</span>
                      </div>
                      <p className="text-pink-800 font-bold text-lg mb-2">3.0 新制可申請補助金額：</p>
                      <p className="text-4xl sm:text-5xl font-black text-pink-600 tracking-tighter">
                          <span className="text-xl sm:text-2xl mr-1">NT$</span>
                          {currentResult.subsidy3_0.toLocaleString()}
                      </p>
                      <p className="text-xs text-pink-400 mt-4 font-bold">※ 實際金額依主管機關核定為準</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  </div>
                  <p className="text-slate-400 font-bold leading-relaxed px-4">請完成左側表單後<br/>點擊計算按鈕獲取補助對照</p>
                </div>
              )}
            </div>
          </section>

          {/* 歷史紀錄 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-6 bg-slate-300 rounded-full"></div>
                <h2 className="text-xl font-black text-gray-800 tracking-tight">近期試算</h2>
              </div>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {history.length > 0 ? (
                history.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-5 border border-slate-50 rounded-2xl hover:bg-pink-50/20 hover:border-pink-100 transition-all group cursor-pointer"
                    onClick={() => loadFromHistory(item)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-black text-slate-700 truncate">{item.formData.stage}</p>
                        <p className="text-xs text-slate-400 mt-1 font-bold">第 {item.formData.treatmentCount} 次療程</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="bg-pink-50 text-pink-600 px-3 py-1.5 rounded-xl text-xs font-black">
                          ${item.subsidy3_0.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 opacity-40">
                  <p className="text-sm font-bold text-slate-300">目前尚無紀錄</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-20 py-12 text-center bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
         
          <div className="space-y-1 mb-6">
            <p className="text-sm text-slate-500 font-bold">此試算僅供參考，實際補助金額以主管機關核定為準</p>
          </div>
           <p className="text-xs font-black text-slate-400 tracking-[0.2em] uppercase mb-4">© Copyright All Rights Reserved apple web design</p>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f5f9;
          border-radius: 10px;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.01); opacity: 0.98; }
        }
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
