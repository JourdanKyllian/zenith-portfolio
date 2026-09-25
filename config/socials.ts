import { 
  LinkedinIcon, 
  InstagramIcon, 
  FacebookIcon, 
  YoutubeIcon, 
  TiktokIcon, 
  TwitchIcon, 
  TwitterIcon, 
  KickIcon 
} from '@/components/SocialIcons';

export const AVAILABLE_SOCIALS = [
  { id: 'youtube', label: 'YouTube', icon: YoutubeIcon, placeholder: 'https://youtube.com/...' },
  { id: 'instagram', label: 'Instagram', icon: InstagramIcon, placeholder: 'https://instagram.com/...' },
  { id: 'tiktok', label: 'TikTok', icon: TiktokIcon, placeholder: 'https://tiktok.com/...' },
  { id: 'twitch', label: 'Twitch', icon: TwitchIcon, placeholder: 'https://twitch.tv/...' },
  { id: 'facebook', label: 'Facebook', icon: FacebookIcon, placeholder: 'https://facebook.com/...' },
  { id: 'linkedin', label: 'LinkedIn', icon: LinkedinIcon, placeholder: 'https://linkedin.com/in/...' },
  { id: 'x', label: 'X (Twitter)', icon: TwitterIcon, placeholder: 'https://x.com/...' },
  { id: 'kick', label: 'Kick', icon: KickIcon, placeholder: 'https://kick.com/...' },
];
