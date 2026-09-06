"use server";

import { Resend } from 'resend';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Génère un identifiant alphanumérique unique pour l'indexation des tickets.
 * 
 * @returns {string} Token de 5 caractères majuscules et numériques.
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
 * Traite la soumission du formulaire de contact via un pipeline de validation
 * multicouche cookieless (Honeypot, Analyse de vélocité, Filtrage IP PostgreSQL).
 *
 * @param {FormData} formData - Données sérialisées du formulaire client.
 * @returns {Promise<{ success: boolean; error?: string }>} Bilan de la transaction d'envoi.
 */
export async function sendEmail(formData: FormData) {
  // Mécanisme Honeypot anti-bot
  const honeyPot = formData.get("company_tax_id") as string;
  if (honeyPot && honeyPot.trim() !== '') {
    return { success: true }; 
  }

  // Vérification de la cohérence temporelle
  const formTimestamp = formData.get("form_timestamp") as string;
  if (formTimestamp) {
    const loadTime = parseInt(formTimestamp, 10);
    const now = Date.now();
    if (now - loadTime < 3000) {
      return { 
        success: false, 
        error: "Soumission trop rapide. Veuillez prendre le temps de rédiger votre message." 
      };
    }
  }

  // Extraction et normalisation des variables d'entrée
  const name = (formData.get("name") as string || '').trim();
  const email = (formData.get("email") as string || '').trim();
  const type = formData.get("type") as string; 
  const message = (formData.get("message") as string || '').trim();

  // Validation des types de données
  if (!name || !email || !message) {
    return { success: false, error: "Tous les champs obligatoires doivent être renseignés." };
  }
  if (name.length > 60 || message.length > 2000) {
    return { success: false, error: "La taille des champs texte dépasse les limites autorisées." };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Le format de l'adresse e-mail est invalide." };
  }

  // Évaluation des requêtes par adresse IP (Rate Limiting sur 7 jours)
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  if (supabase) {
    try {
      const { count, error: countError } = await supabase
        .from('form_rate_limits')
        .select('*', { count: 'exact', head: true })
        .eq('ip_address', ip)
        .gte('created_at', oneWeekAgo.toISOString());

      if (countError) throw countError;

      if (count && count >= 2) {
        return { 
          success: false, 
          error: "Limite de contact atteinte pour cette semaine (maximum 2 messages autorisés)." 
        };
      }
    } catch (dbError) {
      console.error("Erreur d'interrogation du composant de sécurité Supabase :", dbError);
    }
  }

  const formattedMessage = message.replace(/\n/g, '<br />');
  const ticketId = `ZP-${generateTicketId()}`;
  const adminEmail = 'zenithprod.contact@gmail.com';

  try {
    // Dispatch du flux d'information vers l'administrateur
    const { error: errorAdmin } = await resend.emails.send({
      from: 'Zenith Production <contact@zenithproduction.fr>',
      to: adminEmail, 
      replyTo: email, 
      subject: `[${ticketId}] Nouveau projet ${type} : ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #151522; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #007BFF; margin-top: 0;">Nouveau message de contact ! 🎬</h2>
          <p style="font-size: 11px; color: #999;">Référence unique : ${ticketId} | Origine IP : ${ip}</p>
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

    if (errorAdmin) return { success: false, error: "Le serveur SMTP distant a rejeté la demande d'envoi administrateur." };

    // Envoi de l'accusé de réception automatique au client
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

    // 5. Inscription de la signature réseau dans les journaux de sécurité
    if (supabase) {
      await supabase
        .from('form_rate_limits')
        .insert([{ ip_address: ip }]);
    }

    return { success: true };
  } catch (err) {
    console.error("Échec d'exécution de la Server Action sendEmail :", err);
    return { success: false, error: "Une erreur critique interne est survenue sur l'infrastructure d'envoi." };
  }
}