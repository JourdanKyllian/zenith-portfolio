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
      to: email,
      bcc: 'zenithprod.contact@gmail.com',
      replyTo: 'zenithprod.contact@gmail.com',
      subject: `Projet ${type} : ${name} x Zenith Production`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #151522; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #007BFF; margin-top: 0;">Merci pour votre message, ${name} ! 🎬</h2>
          
          <p>Je vous confirme la bonne réception de votre demande concernant votre projet de <strong>${type}</strong>.</p>
          
          <p>Voici un récapitulatif de votre message :</p>
          <blockquote style="background-color: #f8f9fa; border-left: 4px solid #007BFF; padding: 15px; color: #3D3D55; font-style: italic; border-radius: 0 8px 8px 0; margin: 0 0 20px 0;">
            <p style="white-space: pre-wrap; margin: 0;">${message}</p>
          </blockquote>
          
          <p>Je vais prendre le temps d'étudier tout cela en détail. Je reviens vers vous dans les plus brefs délais pour en discuter et voir comment donner la hauteur que méritent vos idées.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          
          <p style="margin-bottom: 0;">À très vite,</p>
          <p style="margin-top: 5px;">
            <strong>Gabin Husson</strong><br/>
            <span style="color: #007BFF;">Zenith Production</span><br/>
            <a href="https://zenithproduction.fr" style="color: #3D3D55; text-decoration: none;">zenithproduction.fr</a><br/>
            <span style="font-size: 12px; color: #888;">(Email du client pour contact rapide : <a href="mailto:${email}">${email}</a>)</span>
          </p>
        </div>
      `,
    });

    if (error) return { success: false };
    return { success: true };
  } catch {
    return { success: false };
  }
}