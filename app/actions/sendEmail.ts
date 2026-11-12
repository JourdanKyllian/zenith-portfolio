"use server";

import crypto from 'node:crypto';
import { Resend } from 'resend';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

const POW_DIFFICULTY = 4;
const MIN_SUBMIT_DELAY_MS = 3000;
const MAX_CHALLENGE_AGE_MS = 2 * 60 * 60 * 1000; // 2 heures

const ALLOWED_MISSION_TYPES = new Set<string>([
  'Montage Vidéo / Post-prod',
  'Cadrage / Captation',
  'Design Graphique',
  'Autre',
]);

const BLOCKED_EMAIL_DOMAINS = new Set<string>([
  'probox.my.id',
  'yopmail.com',
  'mailinator.com',
  'tempmail.com',
  'guerrillamail.com',
  '10minutemail.com',
  'trashmail.com',
]);

export interface ContactChallenge {
  salt: string;
  ts: number;
  difficulty: number;
  sig: string;
}

function getSigningSecret(): string {
  return process.env.CONTACT_FORM_SECRET || process.env.RESEND_API_KEY || 'zenith-contact-fallback-secret';
}

function signChallenge(salt: string, ts: number, difficulty: number): string {
  return crypto
    .createHmac('sha256', getSigningSecret())
    .update(`${salt}:${ts}:${difficulty}`)
    .digest('hex');
}

function verifyChallengeSignature(salt: string, ts: number, difficulty: number, sig: string): boolean {
  const expected = signChallenge(salt, ts, difficulty);
  if (expected.length !== sig.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(sig, 'utf8'));
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Génère un défi cryptographique signé (stateless, sans cookie) pour le formulaire de contact.
 *
 * @returns {Promise<ContactChallenge>} Paramètres du défi PoW et signature HMAC.
 */
export async function getContactChallenge(): Promise<ContactChallenge> {
  const salt = crypto.randomBytes(16).toString('hex');
  const ts = Date.now();
  const difficulty = POW_DIFFICULTY;
  const sig = signChallenge(salt, ts, difficulty);
  return { salt, ts, difficulty, sig };
}

/**
 * Génère un identifiant alphanumérique unique pour l'indexation des tickets de contact.
 * 
 * @returns {string} Token généré (ex: 'A1B2C').
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
 * Traite la soumission du formulaire de contact public via un pipeline de validation sécurisé.
 * Applique une protection multicouche : Honeypot, analyse de vélocité temporelle, 
 * et limitation de débit (Rate Limiting) indexée sur l'adresse IP.
 *
 * @param {FormData} formData - Données sérialisées du formulaire d'entrée.
 * @returns {Promise<{ success: boolean; error?: string }>} Bilan de la transaction SMTP.
 */
export async function sendEmail(formData: FormData) {
  
  // Validation Honeypot (Piège anti-bot)
  const honeyPot = formData.get("company_tax_id") as string;
  if (honeyPot && honeyPot.trim() !== '') {
    return { success: true }; 
  }

  // Contrôle cryptographique obligatoire : Signature HMAC + Vélocité + Proof-of-Work (sans cookie)
  const powSalt = (formData.get("pow_salt") as string || '').trim();
  const powTsRaw = (formData.get("pow_ts") as string || '').trim();
  const powDifficultyRaw = (formData.get("pow_difficulty") as string || '').trim();
  const powSig = (formData.get("pow_sig") as string || '').trim();
  const powNonce = (formData.get("pow_nonce") as string || '').trim();

  const powTs = Number.parseInt(powTsRaw, 10);
  const powDifficulty = Number.parseInt(powDifficultyRaw, 10);

  if (
    !powSalt ||
    !powSig ||
    !powNonce ||
    !Number.isFinite(powTs) ||
    powDifficulty !== POW_DIFFICULTY ||
    !verifyChallengeSignature(powSalt, powTs, powDifficulty, powSig)
  ) {
    return {
      success: false,
      error: "Jeton de sécurité invalide ou manquant. Veuillez recharger la page et réessayer."
    };
  }

  const elapsed = Date.now() - powTs;
  if (elapsed < MIN_SUBMIT_DELAY_MS) {
    return {
      success: false,
      error: "Soumission trop rapide. Veuillez prendre le temps de rédiger votre message."
    };
  }
  if (elapsed > MAX_CHALLENGE_AGE_MS) {
    return {
      success: false,
      error: "La session du formulaire a expiré. Veuillez recharger la page."
    };
  }

  const powHash = crypto
    .createHash('sha256')
    .update(`${powSalt}:${powTs}:${powNonce}`)
    .digest('hex');

  if (!powHash.startsWith('0'.repeat(POW_DIFFICULTY))) {
    return {
      success: false,
      error: "Vérification de sécurité échouée. Veuillez réessayer."
    };
  }

  const name = (formData.get("name") as string || '').trim();
  const email = (formData.get("email") as string || '').trim();
  const type = (formData.get("type") as string || '').trim();
  const message = (formData.get("message") as string || '').trim();

  if (!name || !email || !message || !ALLOWED_MISSION_TYPES.has(type)) {
    return { success: false, error: "Tous les champs obligatoires doivent être renseignés." };
  }
  
  if (name.length > 60 || email.length > 254 || message.length > 2000) {
    return { success: false, error: "La taille des champs texte dépasse les limites autorisées." };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Le format de l'adresse e-mail est invalide." };
  }

  const emailDomain = email.split('@')[1]?.toLowerCase() ?? '';
  if (BLOCKED_EMAIL_DOMAINS.has(emailDomain)) {
    return { success: true };
  }

  const urlRegex = /https?:\/\/|www\./i;
  if (urlRegex.test(message) || urlRegex.test(name)) {
    return {
      success: false,
      error: "Pour des raisons de sécurité anti-spam, les liens (URL) ne sont pas autorisés dans ce premier message."
    };
  }

  // Protection par Rate Limiting (Plafonnement à 2 requêtes sur une fenêtre glissante de 7 jours)
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

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeType = escapeHtml(type);
  const formattedMessage = escapeHtml(message).replace(/\n/g, '<br />');
  const ticketId = `ZP-${generateTicketId()}`;
  const adminEmail = 'zenithprod.contact@gmail.com';

  try {
    // 1. Dispatch du ticket vers l'administrateur
    const { error: errorAdmin } = await resend.emails.send({
      from: 'Zenith Production <contact@zenithproduction.fr>',
      to: adminEmail, 
      replyTo: email, 
      subject: `[${ticketId}] Nouveau projet ${type} : ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #151522; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #007BFF; margin-top: 0;">Nouveau message de contact ! 🎬</h2>
          <p style="font-size: 11px; color: #999;">Référence unique : ${ticketId} | Origine IP : ${escapeHtml(ip)}</p>
          <p>Nouvelle demande de collaboration de la part de <strong>${safeName}</strong>.</p>
          <p>Récapitulatif du projet (<strong>${safeType}</strong>) :</p>
          <blockquote style="background-color: #f8f9fa; border-left: 4px solid #007BFF; padding: 15px; color: #3D3D55; font-style: italic; border-radius: 0 8px 8px 0; margin: 0 0 20px 0;">
            <p style="margin: 0;">${formattedMessage}</p>
          </blockquote>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 13px; color: #666; margin-bottom: 0;">
            <strong>Coordonnées du contact :</strong><br/>
            Nom : ${safeName}<br/>
            Email : <a href="mailto:${safeEmail}">${safeEmail}</a>
          </p>
        </div>
      `,
    });

    if (errorAdmin) return { success: false, error: "Le serveur SMTP distant a rejeté la demande d'envoi administrateur." };

    // 2. Envoi de l'accusé de réception formaté au prospect
    await resend.emails.send({
      from: 'Zenith Production <contact@zenithproduction.fr>',
      to: email, 
      replyTo: adminEmail, 
      subject: `[${ticketId}] Votre demande de projet ${type} x Zenith Production`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #151522; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #007BFF; margin-top: 0;">Merci pour votre message, ${safeName} ! 🎬</h2>
          <p style="font-size: 11px; color: #999;">Référence unique de votre demande : ${ticketId}</p>
          <p>Je vous confirme la bonne réception de votre demande concernant votre projet de <strong>${safeType}</strong>.</p>
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

    // 3. Enregistrement de la signature réseau pour maintien de l'historique Rate Limit
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
