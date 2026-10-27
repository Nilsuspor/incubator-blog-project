import { Request } from "express";
import { IdType } from "./id";

export type RequestWithBody<T> = Request<{},{},T>
export type RequestWithQuery<T> = Request<{},{},{},T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<P,B> = Request<P,{}, B>
export type RequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>;
export type RequestWithUserId<U extends IdType> = Request<{}, {}, {}, {}, U>;
