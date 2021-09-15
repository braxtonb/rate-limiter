class ApiError extends Error {
  statusCode: number;
  errors: any;

  constructor(
    statusCode = 500,
    message = 'Internal server error',
    errors: any,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export default ApiError;
