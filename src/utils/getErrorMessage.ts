import axios from 'axios';

export function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (axios.isAxiosError<{ detail?: string }>(error)) {
    if (error.code === 'ECONNABORTED' || !error.response) {
      return 'Backend не отвечает.';
    }

    return error.response?.data?.detail || error.message || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}
