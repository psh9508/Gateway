export interface LoginReq {
  login_id: string;
  password: string;
}

export interface EmailVerificationReq {
  user_id: string;
  login_id: string;
  verification_code: string;
}