import type { ResponseBase } from "./";

export type LoginInfo = {
  token: string;
  username: string;
  password: string;
  remember: boolean;
};

export type LoginResponse = ResponseBase & {
  data: LoginInfo;
};
