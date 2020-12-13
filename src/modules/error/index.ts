import { ApiError } from '@modules/error/api';
import {
  InvalidTokenError,
  MissingTokenError,
} from '@modules/error/authentication';
import {
  CacheConnectionError,
  CacheDeleteAllError,
  CacheDeleteError,
  CacheGetError,
  CacheSetError,
} from '@modules/error/cache';
import {
  CloseConnectionsError,
  FormatQueryError,
  InsertionError,
  RemovalError,
} from '@modules/error/database';
import { QueryParamError, RequestError } from '@modules/error/request';
import {
  NotFoundError,
  ResourceError,
  ValidationError,
} from '@modules/error/resource';
import { ServerError } from '@modules/error/server';

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
