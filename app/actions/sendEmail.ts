"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const type = formData.get("type") as string;
  const message = formData.get("message") as string;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Zenith Production <onboarding@resend.dev>', // À changer après config domaine
      to: 'zenithprod.contact@gmail.com',
      subject: `Nouveau Projet : ${type} - ${name}`,
      replyTo: email,
      text: `Nom : ${name}\nEmail : ${email}\nType : ${type}\n\nMessage :\n${message}`,
    });

    if (error) {
      console.error("Erreur Resend:", error);
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error("Erreur Serveur:", err);
    return { success: false };
  }
}