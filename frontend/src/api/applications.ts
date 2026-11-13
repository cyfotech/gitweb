import apiClient from './client';

export interface CareerApplicationPayload {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  position: string;
  experienceLevel?: string;
  yearsExperience: number;
  relevantSkills: string;
  softwareKnowledge: string;
  employmentStatus?: string;
  expectedSalary?: string;
  linkedinProfile?: string;
  coverLetter?: string;
  additionalInfo?: string;
  privacyAccepted: boolean;
}

export interface CareerApplicationResponse {
  success: true;
  applicationId: string;
  receivedAt: string;
  message: string;
}

export const applicationsApi = {
  submit: (application: CareerApplicationPayload, resume: File) => {
    const formData = new FormData();
    formData.append('application', JSON.stringify(application));
    formData.append('resume', resume);
    return apiClient.post<CareerApplicationResponse>('/applications', formData, { skipAuth: true, timeout: 60_000 });
  },
};
