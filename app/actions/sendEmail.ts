"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Génère un jeton unique court pour dissocier les fils de discussion
function generateTicketId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function sendEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string; // Mail du client
  const type = formData.get("type") as string; 
  const message = formData.get("message") as string;
  
  // --- PROTECTION HONEYPOT (Modifiée pour éviter l'autofill des navigateurs) ---
  const honeyPot = formData.get("api_checksum") as string;
  if (honeyPot) {
    console.log("🤖 Tentative de spam ou autofill bloquée sur le honeypot.");
    return { success: true }; // Succès fictif pour tromper le bot
  }

  // Formatage des retours à la ligne en HTML
  const formattedMessage = message ? message.replace(/\n/g, '<br />') : '';

  // Génération d'une référence unique (ex: ZP-H6Y9B) pour forcer un thread séparé dans Gmail
  const ticketId = `ZP-${generateTicketId()}`;
  const gabinGmail = 'zenithprod.contact@gmail.com';

  try {
    // ==========================================
    // NOTIFICATION DESTINÉE À GABIN
    // ==========================================
    const { error: errorGabin } = await resend.emails.send({
      from: 'Zenith Production <contact@zenithproduction.fr>',
      to: gabinGmail, 
      // Permet à Gabin de répondre directement au client d'un seul clic
      replyTo: email, 
      // L'ID unique garantit qu'un autre client du même nom n'écrase pas cette boîte
      subject: `[${ticketId}] Nouveau projet ${type} : ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #151522; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #007BFF; margin-top: 0;">Nouveau message de contact ! 🎬</h2>
          <p style="font-size: 11px; color: #999;">Référence unique : ${ticketId}</p>
          
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
            💡 Pour lui répondre, clique simplement sur <strong>"Répondre"</strong>. Votre discussion démarrera sur un fil unique grâce à l'ID <strong>${ticketId}</strong>.
          </p>
        </div>
      `,
    });

    if (errorGabin) {
      console.error("Erreur Resend (Notification Gabin) :", errorGabin);
      return { success: false };
    }

    // ==========================================
    // ACCUSÉ DE RÉCEPTION POUR LE CLIENT
    // ==========================================
    const { error: errorClient } = await resend.emails.send({
      from: 'Zenith Production <contact@zenithproduction.fr>',
      to: email, 
      replyTo: gabinGmail, 
      subject: `[${ticketId}] Votre demande de projet ${type} x Zenith Production`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #151522; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #007BFF; margin-top: 0;">Merci pour votre message, ${name} ! 🎬</h2>
          <p style="font-size: 11px; color: #999;">Référence unique de votre demande : ${ticketId}</p>
          
          <p>Je vous confirme la bonne réception de votre demande concernant votre projet de <strong>${type}</strong>.</p>
          
          <p>Voici un récapitulatif de votre message :</p>
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

    if (errorClient) {
      // On loggue simplement l'erreur de l'accusé de réception sans bloquer le succès global du formulaire,
      // puisque Gabin a bien reçu l'alerte principale.
      console.error("Erreur Resend (Accusé Client) :", errorClient);
    }

    return { success: true };
  } catch (err) {
    console.error("Erreur globale sendEmail :", err);
    return { success: false };
  }
}