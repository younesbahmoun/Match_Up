export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  user: User;
  expires_in: Int8Array;
  token_type: string;
};