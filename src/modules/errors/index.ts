import { ApiError } from '@src/modules/errors/api';
import {
  InvalidTokenError,
  MissingTokenError,
} from '@src/modules/errors/authentication';
import {
  CacheConnectionError,
  CacheDeleteAllError,
  CacheDeleteError,
  CacheGetError,
  CacheSetError,
} from '@src/modules/errors/cache';
import {
  CloseConnectionsError,
  FormatQueryError,
  InsertionError,
  RemovalError,
} from '@src/modules/errors/database';
import { QueryParamError, RequestError } from '@src/modules/errors/request';
import {
  NotFoundError,
  ResourceError,
  ValidationError,
} from '@src/modules/errors/resource';
import { ServerError } from '@src/modules/errors/server';

interface UnkownError extends Error {
  status?: number;
}

export type Errors =
  | UnkownError
  | ApiError
  | ServerError
  | ValidationError
  | NotFoundError
  | ResourceError
  | MissingTokenError
  | InvalidTokenError
  | RequestError
  | QueryParamError
  | InsertionError
  | RemovalError
  | FormatQueryError
  | CloseConnectionsError
  | CacheConnectionError
  | CacheGetError
  | CacheSetError
  | CacheDeleteError
  | CacheDeleteAllError;

export {
  ApiError,
  MissingTokenError,
  InvalidTokenError,
  CacheConnectionError,
  CacheGetError,
  CacheSetError,
  CacheDeleteError,
  CacheDeleteAllError,
  InsertionError,
  RemovalError,
  FormatQueryError,
  CloseConnectionsError,
  RequestError,
  QueryParamError,
  ValidationError,
  NotFoundError,
  ResourceError,
  ServerError,
};

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
