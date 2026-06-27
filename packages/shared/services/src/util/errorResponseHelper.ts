export const errorResponseHelper = (
  errorMessage: string,
  errorCode: string,
  errorDetails: string,
) => {
  const now = new Date();
  return {
    success: false,
    message: errorMessage,
    data: {},
    error: {
      code: errorCode,
      details: errorDetails,
    },
    metadata: {
      timestamp: now.toISOString(),
    },
  };
};
