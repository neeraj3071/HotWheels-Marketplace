export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export const createHttpError = (
  statusCode: number,
  message: string,
  details?: unknown
) => new HttpError(statusCode, message, details);
