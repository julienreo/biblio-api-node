import { ApiError } from '@modules/errors/api';
import {
  InvalidTokenError,
  MissingTokenError,
} from '@modules/errors/authentication';
import {
  CacheConnectionError,
  CacheDeleteAllError,
  CacheDeleteError,
  CacheGetError,
  CacheSetError,
} from '@modules/errors/cache';
import {
  CloseConnectionsError,
  FormatQueryError,
  InsertionError,
  RemovalError,
} from '@modules/errors/database';
import { QueryParamError, RequestError } from '@modules/errors/request';
import {
  NotFoundError,
  ResourceError,
  ValidationError,
} from '@modules/errors/resource';
import { ServerError } from '@modules/errors/server';

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
