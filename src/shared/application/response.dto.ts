export interface Meta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export class DataResponse<T> {
  readonly success: boolean;
  readonly message?: string;
  readonly data: T;
  readonly meta?: Meta;

  constructor(data: T, option?: { meta?: Meta; message?: string }) {
    this.success = true;
    this.message = option?.message;
    this.data = data;
    this.meta = option?.meta;
  }

  static of<T>(data: T, option?: { meta?: Meta; message?: string }): DataResponse<T> {
    return new DataResponse(data, option);
  }

  static paginate<T>(data: T[], meta: Meta): DataResponse<T[]> {
    return new DataResponse(data, { meta });
  }
}
