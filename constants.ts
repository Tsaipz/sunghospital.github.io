
import { TreatmentStage, CalculationForm } from './types';

// Taiwan IVF Subsidy Rules Logic
export const calculateSubsidy = (data: CalculationForm) => {
  const birth = new Date(data.birthDate);
  const appDate = new Date(data.firstApplicationDate);
  
  // Age calculation (Years)
  let age = appDate.getFullYear() - birth.getFullYear();
  const m = appDate.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && appDate.getDate() < birth.getDate())) {
    age--;
  }

  // Eligibility check: Under 45
  if (age >= 45) {
    return { subsidy2_0: 0, subsidy3_0: 0, age, eligible: false, message: '申請人年齡需未滿45歲' };
  }

  // Frequency eligibility
  // Under 40: Max 6 times
  // 40-44: Max 3 times
  if (age >= 40 && data.treatmentCount > 3) {
    return { subsidy2_0: 0, subsidy3_0: 0, age, eligible: false, message: '40歲至44歲者，補助上限為3次' };
  }
  if (data.treatmentCount > 6) {
    return { subsidy2_0: 0, subsidy3_0: 0, age, eligible: false, message: '補助上限為6次' };
  }

  const isLowIncome = data.isLowIncome;
  const isFirst = data.treatmentCount === 1;

  // Base logic for 2.0
  // General: First time 100k, Subsq 60k
  // Low Income: Up to 150k
  let s2 = 0;
  if (isLowIncome) {
    if (data.stage === TreatmentStage.Full) s2 = 150000;
    else if (data.stage === TreatmentStage.EggOnly) s2 = 90000;
    else s2 = 60000;
  } else {
    if (data.stage === TreatmentStage.Full) s2 = isFirst ? 100000 : 60000;
    else if (data.stage === TreatmentStage.EggOnly) s2 = isFirst ? 70000 : 40000;
    else s2 = isFirst ? 30000 : 20000;
  }

  // Logic for 3.0 (2025 Updates - Simulating increased support)
  // Typically 3.0 increases the upper limit or adds specific bonuses.
  // Based on common interpretation of the 2025 scheme:
  let s3 = s2;
  if (isLowIncome) {
    s3 = s2 + 20000; // Assuming 3.0 adds 20k bonus for low income
  } else {
    s3 = s2 + (isFirst ? 20000 : 10000); // 3.0 incentive
  }

  return { subsidy2_0: s2, subsidy3_0: s3, age, eligible: true };
};
