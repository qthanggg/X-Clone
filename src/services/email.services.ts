import nodemailer from 'nodemailer'
import { config } from 'dotenv'
config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD // Sử dụng App Password từ Google Account
  }
})

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = transporter
  }

  async sendVerificationEmail({ to, verifyToken }: { to: string; verifyToken: string }) {
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`

    await this.transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to,
      subject: 'Verify your email address',
      html: `
        <h2>Verify Your Email Address</h2>
        <p>Click the link below to verify your email address:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
        <p>This link will expire in 15 minutes.</p>
      `
    })
  }

  async sendForgotPasswordEmail({ to, resetToken }: { to: string; resetToken: string }) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`

    await this.transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to,
      subject: 'Reset Your Password',
      html: `
        <h2>Reset Your Password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    })
  }
}

const emailService = new EmailService()
export default emailService
