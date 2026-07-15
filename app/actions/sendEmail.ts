"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const type = formData.get("type") as string; 
  const message = formData.get("message") as string;
  
  // --- PROTECTION HONEYPOT ---
  const honeyPot = formData.get("verify_phone") as string;
  if (honeyPot) return { success: true };

  try {
    const { error } = await resend.emails.send({
      from: 'Zenith Production <contact@zenithproduction.fr>',
      to: 'zenithprod.contact@gmail.com',
      subject: `Nouveau Projet : ${type} - ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <h2>Nouvelle demande de projet</h2>
          <p><strong>Client :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Type de mission :</strong> ${type}</p>
          <hr />
          <p><strong>Message :</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    if (error) return { success: false };
    return { success: true };
  } catch {
    return { success: false };
  }
}