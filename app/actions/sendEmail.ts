"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string; // Mail du client
  const type = formData.get("type") as string; 
  const message = formData.get("message") as string;
  
  // --- PROTECTION HONEYPOT ---
  const honeyPot = formData.get("verify_phone") as string;
  if (honeyPot) return { success: true };

  // Formatage des retours à la ligne en HTML
  const formattedMessage = message ? message.replace(/\n/g, '<br />') : '';

  try {
    const { error } = await resend.emails.send({
      // L'expéditeur officiel authentifié par ton domaine DNS
      from: 'Zenith Production <contact@zenithproduction.fr>', 
      
      // ✨ MODIFICATION 1 : Le mail est envoyé directement à GABIN (le gérant)
      to: 'zenithprod.contact@gmail.com', 
      
      // ✨ MODIFICATION 2 : Si Gabin clique sur "Répondre", ça écrit directement au client
      replyTo: email, 
      
      // ✨ MODIFICATION 3 : On met le client en Copie Simple (CC) pour qu'il reçoive son accusé de réception
      cc: email, 

      subject: `Nouveau projet ${type} : ${name} x Zenith Production`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #151522; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #007BFF; margin-top: 0;">Nouveau message de contact ! 🎬</h2>
          
          <p>Bonjour Gabin,</p>
          <p>Tu as reçu une nouvelle demande de collaboration via ton portfolio de la part de <strong>${name}</strong>.</p>
          
          <p>Voici le récapitulatif de son projet (<strong>${type}</strong>) :</p>
          <blockquote style="background-color: #f8f9fa; border-left: 4px solid #007BFF; padding: 15px; color: #3D3D55; font-style: italic; border-radius: 0 8px 8px 0; margin: 0 0 20px 0;">
            <p style="margin: 0;">${formattedMessage}</p>
          </blockquote>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          
          <p style="font-size: 13px; color: #666; margin-bottom: 0;">
            <strong>Coordonnées du contact :</strong><br/>
            Nom : ${name}<br/>
            Email : <a href="mailto:${email}">${email}</a>
          </p>
          
          <p style="font-size: 11px; color: #999; margin-top: 15px;">
            💡 Pour lui répondre, clique simplement sur <strong>"Répondre"</strong> dans ton logiciel de messagerie. Grâce au Reply-To configuré, ton message lui parviendra directement dans ce fil de discussion.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Erreur Resend :", error);
      return { success: false };
    }
    return { success: true };
  } catch (err) {
    console.error("Erreur globale sendEmail :", err);
    return { success: false };
  }
}