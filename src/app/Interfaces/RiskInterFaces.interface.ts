



export interface IRiskAssessment
{
  likelihood: string,
  impact: string,
  risk_factor: number
}

export interface PrivacySecurityRiskAssessment
{
  confidentiality: IRiskAssessment,
  integrity: IRiskAssessment,
  availability: IRiskAssessment,
  overall_risk_rating: number
}



