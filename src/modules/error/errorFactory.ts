import {
  ApiError,
  CacheConnectionError,
  CacheDeleteAllError,
  CacheDeleteError,
  CacheGetError,
  CacheSetError,
  CloseConnectionsError,
  FormatQueryError,
  InsertionError,
  InvalidTokenError,
  MissingTokenError,
  NotFoundError,
  QueryParamError,
  RemovalError,
  ResourceError,
  ServerError,
  ValidationError,
} from '@modules/error';

export const createError = (
  type: string,
  message: string
):
  | ApiError
  | CacheConnectionError
  | CacheDeleteAllError
  | CacheDeleteError
  | CacheGetError
  | CacheSetError
  | CloseConnectionsError
  | FormatQueryError
  | InsertionError
  | InvalidTokenError
  | MissingTokenError
  | NotFoundError
  | QueryParamError
  | RemovalError
  | ResourceError
  | ServerError
  | ValidationError => {
  switch (type) {
    case 'InsertionError':
      return new InsertionError(message);
    case 'ResourceError':
      return new ResourceError(message);
    case 'ServerError':
      return new ServerError(message);
    case 'InvalidTokenError':
      return new InvalidTokenError(message);
    case 'MissingTokenError':
      return new MissingTokenError(message);
    case 'RemovalError':
      return new RemovalError(message);
    case 'NotFoundError':
      return new NotFoundError(message);
    case 'ApiError':
      return new ApiError(message);
    case 'QueryParamError':
      return new QueryParamError(message);
    case 'ValidationError':
      return new ValidationError(message);
    case 'CacheConnectionError':
      return new CacheConnectionError(message);
    case 'CacheDeleteAllError':
      return new CacheDeleteAllError(message);
    case 'CacheDeleteError':
      return new CacheDeleteError(message);
    case 'CacheGetError':
      return new CacheGetError(message);
    case 'CacheSetError':
      return new CacheSetError(message);
    case 'FormatQueryError':
      return new FormatQueryError(message);
    case 'CloseConnectionsError':
      return new CloseConnectionsError(message);
    default:
      throw new ApiError('Invalid error type');
  }
};
