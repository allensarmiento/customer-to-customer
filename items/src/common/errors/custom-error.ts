export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    
    Object.setPrototypeOf(this.message, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
