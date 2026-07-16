"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Génère un identifiant alphanumérique court pour le suivi des tickets.
 * @returns {string} Un jeton de 5 caractères.
 */
function generateTicketId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Server Action : Traite la soumission du formulaire de contact et route les emails via Resend.
 * Implémente une vérification Honeypot silencieuse pour bloquer les bots.
 *
 * @param {FormData} formData - Les données issues du formulaire client.
 * @returns {Promise<{ success: boolean }>} L'état final de la transaction d'envoi.
 */
export async function sendEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const type = formData.get("type") as string; 
  const message = formData.get("message") as string;
  
  const honeyPot = formData.get("api_checksum") as string;
  if (honeyPot) {
    return { success: true }; 
  }

  const formattedMessage = message ? message.replace(/\n/g, '<br />') : '';
  const ticketId = `ZP-${generateTicketId()}`;
  const adminEmail = 'zenithprod.contact@gmail.com';

  try {
    const { error: errorAdmin } = await resend.emails.send({
      from: 'Zenith Production <contact@zenithproduction.fr>',
      to: adminEmail, 
      replyTo: email, 
      subject: `[${ticketId}] Nouveau projet ${type} : ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #151522; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #007BFF; margin-top: 0;">Nouveau message de contact ! 🎬</h2>
          <p style="font-size: 11px; color: #999;">Référence unique : ${ticketId}</p>
          <p>Nouvelle demande de collaboration de la part de <strong>${name}</strong>.</p>
          <p>Récapitulatif du projet (<strong>${type}</strong>) :</p>
          <blockquote style="background-color: #f8f9fa; border-left: 4px solid #007BFF; padding: 15px; color: #3D3D55; font-style: italic; border-radius: 0 8px 8px 0; margin: 0 0 20px 0;">
            <p style="margin: 0;">${formattedMessage}</p>
          </blockquote>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 13px; color: #666; margin-bottom: 0;">
            <strong>Coordonnées du contact :</strong><br/>
            Nom : ${name}<br/>
            Email : <a href="mailto:${email}">${email}</a>
          </p>
        </div>
      `,
    });

    if (errorAdmin) return { success: false };

    await resend.emails.send({
      from: 'Zenith Production <contact@zenithproduction.fr>',
      to: email, 
      replyTo: adminEmail, 
      subject: `[${ticketId}] Votre demande de projet ${type} x Zenith Production`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #151522; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #007BFF; margin-top: 0;">Merci pour votre message, ${name} ! 🎬</h2>
          <p style="font-size: 11px; color: #999;">Référence unique de votre demande : ${ticketId}</p>
          <p>Je vous confirme la bonne réception de votre demande concernant votre projet de <strong>${type}</strong>.</p>
          <blockquote style="background-color: #f8f9fa; border-left: 4px solid #007BFF; padding: 15px; color: #3D3D55; font-style: italic; border-radius: 0 8px 8px 0; margin: 0 0 20px 0;">
            <p style="margin: 0;">${formattedMessage}</p>
          </blockquote>
          <p>Je vais prendre le temps d'étudier tout cela en détail et je reviens vers vous rapidement pour donner de la hauteur à votre vision.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="margin-bottom: 0;">À très vite,</p>
          <p style="margin-top: 5px;">
            <strong>Gabin Husson</strong><br/>
            <span style="color: #007BFF;">Zenith Production</span><br/>
            <a href="https://zenithproduction.fr" style="color: #3D3D55; text-decoration: none;">zenithproduction.fr</a>
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error("Erreur d'exécution de la Server Action sendEmail :", err);
    return { success: false };
  }
}