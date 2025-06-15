// mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE, // Use environment variable for SMTP service
    // Ensure you set the SMTP_SERVICE in your environment variables
    auth: {
      user: process.env.SMTP_USER, // Use environment variable for security
      // Ensure you set the SMTP_USER in your environment variables
      pass: process.env.SMTP_PASS, // Use environment variable for security
      // Ensure you set the SMTP_PASS in your environment variables
    },
  });

  async sendInviteEmail(to: string, token: string) {
    const inviteLink = `${process.env.FRONTEND_URL}/invite/${token}`;

    await this.transporter.sendMail({
      from: '"AH Digital" <ahd@tech.com>',
      to,
      subject: 'You’re invited!',
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #333;">You've been invited to join <span style="color: #f7b84b;">AH Digital</span>!</h2>
      <p style="font-size: 16px; color: #555;">
        Hello,
      </p>
      <p style="font-size: 16px; color: #555;">
        You’ve been invited to join our platform. Click the button below to accept your invitation and set up your account.
      </p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${inviteLink}" style="background-color: #f7b84b; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold; display: inline-block;">
          Accept Invite
        </a>
      </p>
      <p style="font-size: 14px; color: #888;">
        If the button above doesn’t work, copy and paste this link into your browser:
      </p>
      <p style="font-size: 14px; word-break: break-all; color: #888;">
        ${inviteLink}
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #aaa;">
        AH Digital Team
      </p>
    </div>
  `,
    });

    // console.log('Email sent:', inviteLink);
  }
}
