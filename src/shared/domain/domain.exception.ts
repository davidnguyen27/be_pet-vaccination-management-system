export abstract class DomainException extends Error {
  abstract errorCode: string;
  abstract statusCode: number;

  constructor(message: string) {
    super(`Error: ${message}`);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
