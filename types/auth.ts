import { Group, Organization, Profile, User } from "@prisma/client";
import { ZodIssue } from "zod";
import { CustomErrorResponse } from "./response";

export type SessionUser = Omit<User, "hash"> & {
  profile: Profile & {
    group: Group & {
      organization: Organization;
    };
  };
};

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
