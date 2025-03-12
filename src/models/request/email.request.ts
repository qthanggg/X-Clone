export interface EmailConfig {
  from: string
  clientUrl: string
}

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export interface VerifyEmailParams {
  to: string
  verifyToken: string
}

export interface ForgotPasswordEmailParams {
  to: string
  resetToken: string
}
