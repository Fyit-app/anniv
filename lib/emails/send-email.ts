'use server';

import { resend } from '@/lib/resend';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  react?: React.ReactElement;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  react,
  from = process.env.RESEND_FROM_EMAIL || 'Anniversaire Yvonne <onboarding@resend.dev>',
}: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      react,
    });

    if (error) {
      console.error('Erreur envoi email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
}

