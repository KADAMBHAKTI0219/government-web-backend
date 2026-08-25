export const APPLICATION_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  ELIGIBILITY_REVIEW: 'ELIGIBILITY_REVIEW',
  ELIGIBLE: 'ELIGIBLE',
  INELIGIBLE: 'INELIGIBLE',
  PRELIMINARY_ASSESSMENT: 'PRELIMINARY_ASSESSMENT',
  SHORTLISTED: 'SHORTLISTED',
  TIER_1_SCREENING: 'TIER_1_SCREENING',
  TIER_1_PASSED: 'TIER_1_PASSED',
  TIER_1_FAILED: 'TIER_1_FAILED',
  TIER_2_REVIEW: 'TIER_2_REVIEW',
  TIER_2_PASSED: 'TIER_2_PASSED',
  TIER_2_FAILED: 'TIER_2_FAILED',
  TIER_3_DUE_DILIGENCE: 'TIER_3_DUE_DILIGENCE',
  TIER_3_PASSED: 'TIER_3_PASSED',
  TIER_3_FAILED: 'TIER_3_FAILED',
  JURY_REVIEW: 'JURY_REVIEW',
  PUBLIC_VOTING: 'PUBLIC_VOTING',
  WINNER: 'WINNER',
  NOT_SELECTED: 'NOT_SELECTED',
  // Backward compatibility aliases
  UNDER_REVIEW: 'ELIGIBILITY_REVIEW',
  APPROVED: 'TIER_1_PASSED',
  REJECTED: 'INELIGIBLE'
};

export const APPLICATION_STAGE = {
  SUBMISSION: 'SUBMISSION',
  ELIGIBILITY: 'ELIGIBILITY',
  PRELIMINARY: 'PRELIMINARY',
  SHORTLISTING: 'SHORTLISTING',
  TIER_1: 'TIER_1',
  TIER_2: 'TIER_2',
  TIER_3: 'TIER_3',
  JURY: 'JURY',
  VOTING: 'VOTING',
  FINAL: 'FINAL'
};

export const DISTRICTS_CG = [
  'Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur',
  'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi', 'Janjgir-Champa',
  'Jashpur', 'Kabirdham', 'Kanker', 'Kondagaon', 'Korba', 'Koriya', 'Mahasamund',
  'Manendragarh-Chirmiri-Bharatpur', 'Mohla-Manpur-Ambagarh Chowki', 'Mungeli', 'Narayanpur',
  'Raigarh', 'Raipur', 'Rajnandgaon', 'Sarangarh-Bilaigarh', 'Sakti', 'Sukma',
  'Surajpur', 'Surguja', 'Khairagarh-Chhuikhadan-Gandai'
];

