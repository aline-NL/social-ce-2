import { useState } from 'react';
import { ErrorDetails, ErrorHandler } from '../services/errorHandler';

export const useErrorHandler = () => {
  const [error, setError] = useState<ErrorDetails | null>(null);

  const handleError = (error: unknown) => {
    const errorDetails = ErrorHandler.handleError(error);
    setError(errorDetails);
    return errorDetails;
  };

  const clearError = () => {
    setError(null);
  };

  return {
    error,
    handleError,
    clearError
  };
};
