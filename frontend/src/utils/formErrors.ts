import { isAxiosError } from 'axios';

interface ApiErrorResponse {
  error?: string;
  message?: string;
  submissionReceived?: boolean;
  emailDelivery?: {
    customerConfirmation?: 'accepted_by_smtp' | 'not_accepted';
    ownerNotification?: 'accepted_by_smtp' | 'not_accepted';
  };
}

export function getSubmissionError(error: unknown, fallback: string): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const responseMessage = error.response?.data?.error || error.response?.data?.message;
    if (responseMessage) {
      const { submissionReceived, emailDelivery } = error.response?.data || {};
      if (submissionReceived && emailDelivery) {
        const status = (value?: 'accepted_by_smtp' | 'not_accepted') =>
          value === 'accepted_by_smtp' ? 'accepted by SMTP' : 'not accepted by SMTP';
        return `${responseMessage} Email status: customer confirmation ${status(emailDelivery.customerConfirmation)}; owner notification ${status(emailDelivery.ownerNotification)}.`;
      }
      return responseMessage;
    }
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        return 'The request timed out. Your information is still here; please try again.';
      }
      return 'We could not reach the service. Check your connection and try again.';
    }
    return `The service returned an unexpected response (${error.response.status}). Please try again.`;
  }
  return error instanceof Error ? error.message : fallback;
}
