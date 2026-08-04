export class ApiResponse {
  static success(res, message = 'Success', data = {}, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      errors: [],
      statusCode
    });
  }

  static error(res, message = 'An error occurred', errors = [], statusCode = 500) {
    const errorArray = Array.isArray(errors)
      ? errors
      : [typeof errors === 'string' ? { message: errors } : errors];

    return res.status(statusCode).json({
      success: false,
      message,
      data: {},
      errors: errorArray,
      statusCode
    });
  }
}
