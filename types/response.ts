import { RecordModelName } from "@/constants/models";
import { ModelRecords } from "@/utils/record";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { ZodIssue } from "zod";
import { SessionUser } from "./auth";

export type CustomErrorResponse = {
  error: {
    code: string;
    message: string;
  };
  success: false;
};

export type FetchRecordsSuccessResponse = {
  records: ModelRecords;
  success: true;
};

export type FetchRecordsResponse =
  | FetchRecordsSuccessResponse
  | CustomErrorResponse;

export type AuthValidationErrorResponse = {
  error: ZodIssue[];
  success: false;
};

export type AuthErrorResponse =
  | AuthValidationErrorResponse
  | CustomErrorResponse;

export type LoginSuccessResponse = {
  user: SessionUser;
  token: string;
  success: true;
};

export type LoginResponse = AuthErrorResponse | LoginSuccessResponse;

export type RegisterSuccessResponse = {
  user: SessionUser;
  success: true;
};

export type RegisterResponse = AuthErrorResponse | RegisterSuccessResponse;

export type ModelRequestContext = {
  req: NextApiRequest;
  res: NextApiResponse;
  model: RecordModelName;
  session: Session;
};
