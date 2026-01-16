
import { TreatmentStage, CalculationForm } from './types';

export const calculateSubsidy = (data: CalculationForm) => {
  const birth = new Date(data.birthDate);
  const appDate = new Date(data.firstApplicationDate);
  
  // 年齡計算
  let age = appDate.getFullYear() - birth.getFullYear();
  const m = appDate.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && appDate.getDate() < birth.getDate())) {
    age--;
  }

  // 1. 補助資格基本檢查
  if (age >= 45) {
    return { subsidy2_0: 0, subsidy3_0: 0, age, eligible: false, message: '申請人年齡需未滿 45 歲，方可申請補助。', transferLimit: 0 };
  }

  // 2. 補助次數上限檢查
  const maxTimes = age <= 39 ? 6 : 3;
  if (data.treatmentCount > maxTimes) {
    return { 
      subsidy2_0: 0, 
      subsidy3_0: 0, 
      age, 
      eligible: false, 
      message: `${age <= 39 ? '39歲(含)以下' : '40-44歲'}補助上限為 ${maxTimes} 次，您填寫的第 ${data.treatmentCount} 次已超過上限。`,
      transferLimit: 0
    };
  }

  // 3. 植入顆數上限 (圖二/圖三顯示：<=39歲1顆, 40-44歲2顆)
  const transferLimit = age <= 39 ? 1 : 2;

  // 4. 計算金額 (依據圖片邏輯)
  const getAmount = (isNewScheme: boolean) => {
    const isLowIncome = data.isLowIncome;
    
    // 低收入戶：無論新舊制通常最高 15 萬 (簡化邏輯，若圖表有特定低收表則需再拆，目前依通則)
    if (isLowIncome) {
      if (data.stage === TreatmentStage.Full) return 150000;
      if (data.stage === TreatmentStage.EggOnly) return 100000;
      return 50000;
    }

    // 一般戶金額邏輯
    // 舊制 2.0 (參考一般通則)
    if (!isNewScheme) {
      if (data.stage === TreatmentStage.Full) {
        return data.treatmentCount === 1 ? 100000 : 60000;
      }
      if (data.stage === TreatmentStage.EggOnly) {
        return data.treatmentCount === 1 ? 70000 : 40000;
      }
      return data.treatmentCount === 1 ? 30000 : 20000;
    }

    // 新制 3.0 (依據使用者提供的圖三與公式)
    // 圖片顯示：小於39歲 首次15萬/二次三次10萬/其他6萬
    // 39-44歲 首次13萬/二次三次8萬/其他6萬
    if (age <= 39) {
      if (data.stage === TreatmentStage.Full) {
        if (data.treatmentCount === 1) return 150000;
        if (data.treatmentCount <= 3) return 100000;
        return 60000;
      }
      if (data.stage === TreatmentStage.EggOnly) {
        if (data.treatmentCount === 1) return 100000;
        if (data.treatmentCount <= 3) return 60000;
        return 40000;
      }
      // 僅植入
      if (data.treatmentCount === 1) return 50000;
      if (data.treatmentCount <= 3) return 40000;
      return 20000;
    } else {
      // 40-44歲
      if (data.stage === TreatmentStage.Full) {
        if (data.treatmentCount === 1) return 130000;
        if (data.treatmentCount <= 3) return 80000;
        return 60000;
      }
      if (data.stage === TreatmentStage.EggOnly) {
        if (data.treatmentCount === 1) return 70000;
        if (data.treatmentCount <= 3) return 40000;
        return 40000;
      }
      // 僅植入
      if (data.treatmentCount === 1) return 50000;
      if (data.treatmentCount <= 3) return 40000;
      return 20000;
    }
  };

  return { 
    subsidy2_0: getAmount(false), 
    subsidy3_0: getAmount(true), 
    age, 
    eligible: true,
    transferLimit
  };
};
