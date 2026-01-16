
export enum TreatmentStage {
  Full = '取卵至形成胚胎植入',
  EggOnly = '僅取卵 (因特定因素無法植入)',
  EmbryoOnly = '僅胚胎植入'
}

export interface CalculationForm {
  birthDate: string;
  isLowIncome: boolean;
  isFirstApplication: boolean;
  treatmentCount: number; // 1-6
  stage: TreatmentStage;
  firstApplicationDate: string;
  transferDate?: string;
}

export interface CalculationResult {
  id: string;
  timestamp: number;
  formData: CalculationForm;
  subsidy2_0: number;
  subsidy3_0: number;
  ageAtApplication: number;
  isEligible: boolean;
  message?: string;
}
