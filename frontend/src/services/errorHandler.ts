import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

export interface ErrorDetails {
  message: string;
  status: number;
  errorType?: string;
  details?: any;
}

export class ErrorHandler {
  static handleAxiosError(error: AxiosError): ErrorDetails {
    const errorDetails: ErrorDetails = {
      message: 'An error occurred',
      status: 500
    };

    if (error.response) {
      // Server responded with an error
      const { data, status } = error.response;
      errorDetails.status = status;

      if (data) {
        errorDetails.message = data.message || data.error || 'Unknown error';
        errorDetails.errorType = data.errorType;
        errorDetails.status = data.status_code || status;
        errorDetails.details = data;
      }
    } else if (error.request) {
      // Request was made but no response was received
      errorDetails.message = 'No response received from server';
      errorDetails.status = 504;
    } else {
      // Error occurred before request was made
      errorDetails.message = error.message || 'Unknown error';
    }

    // Show toast notification
    toast.error(errorDetails.message);

    return errorDetails;
  }

  static handleGenericError(error: unknown): ErrorDetails {
    const errorDetails: ErrorDetails = {
      message: 'An unexpected error occurred',
      status: 500
    };

    if (error instanceof Error) {
      errorDetails.message = error.message;
    }

    // Show toast notification
    toast.error(errorDetails.message);

    return errorDetails;
  }

  static handleError(error: unknown): ErrorDetails {
    if (error instanceof AxiosError) {
      return ErrorHandler.handleAxiosError(error);
    }
    return ErrorHandler.handleGenericError(error);
  }

  static getErrorMessage(error: unknown): string {
    const errorDetails = ErrorHandler.handleError(error);
    return errorDetails.message;
  }
}
