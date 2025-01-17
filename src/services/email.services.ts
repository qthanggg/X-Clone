import nodemailer from 'nodemailer'
import { config } from 'dotenv'
config()

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

interface VerifyEmailParams {
  to: string
  verifyToken: string
}

interface ForgotPasswordEmailParams {
  to: string
  resetToken: string
}

class EmailService {
  private transporter: nodemailer.Transporter
  private readonly EMAIL_ADDRESS: string
  private readonly CLIENT_URL: string

  constructor() {
    this.EMAIL_ADDRESS = process.env.EMAIL_ADDRESS as string
    this.CLIENT_URL = process.env.CLIENT_URL as string
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.EMAIL_ADDRESS,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    })
  }

  private async sendEmail({ to, subject, html }: SendEmailOptions) {
    await this.transporter.sendMail({
      from: this.EMAIL_ADDRESS,
      to,
      subject,
      html
    })
  }

  private getVerifyEmailTemplate(verifyUrl: string): string {
    return `
      <h2>Verify Your Email Address</h2>
      <p>Click the link below to verify your email address:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link will expire in 15 minutes.</p>
    `
  }

  private getForgotPasswordTemplate(resetUrl: string): string {
    return `
      <h2>Reset Your Password</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you didn't request this, please ignore this email.</p>
    `
  }

  async sendVerificationEmail({ to, verifyToken }: VerifyEmailParams) {
    const verifyUrl = `${this.CLIENT_URL}/verify-email?email_verify_token=${verifyToken}`
    await this.sendEmail({
      to,
      subject: 'Verify your email address',
      html: this.getVerifyEmailTemplate(verifyUrl)
    })
  }

  async sendForgotPasswordEmail({ to, resetToken }: ForgotPasswordEmailParams) {
    const resetUrl = `${this.CLIENT_URL}/reset-password?forgot_password_token=${resetToken}`
    await this.sendEmail({
      to,
      subject: 'Reset Your Password',
      html: this.getForgotPasswordTemplate(resetUrl)
    })
  }
}

const emailService = new EmailService()
export default emailService
