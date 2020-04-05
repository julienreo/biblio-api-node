const ApiError = require("./api");
const {MissingTokenError, InvalidTokenError} = require("./authentication");
const {CacheConnectionError, CacheGetError, CacheSetError, CacheDeleteError, CacheDeleteAllError} = require("./cache");
const {InsertionError, RemovalError, FormatQueryError, CloseConnectionsError} = require("./database");
const {RequestError, QueryParamError} = require("./request");
const {ValidationError, NotFoundError, ResourceError} = require("./resource");
const ServerError = require("./server");

module.exports = {
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
  ServerError
};