import { 
  LinkedinIcon, 
  InstagramIcon, 
  FacebookIcon, 
  YoutubeIcon, 
  TiktokIcon, 
  TwitchIcon, 
  TwitterIcon, 
  KickIcon,
  SoundCloudIcon
} from '@/components/SocialIcons';

export const AVAILABLE_SOCIALS = [
  { 
    id: 'youtube', 
    label: 'YouTube', 
    icon: YoutubeIcon, 
    placeholder: 'https://youtube.com/...', 
    hoverClass: 'hover:bg-red-600 hover:text-white hover:border-red-600' 
  },
  { 
    id: 'instagram', 
    label: 'Instagram', 
    icon: InstagramIcon, 
    placeholder: 'https://instagram.com/...', 
    hoverClass: 'hover:bg-pink-600 hover:text-white hover:border-pink-600' 
  },
  { 
    id: 'tiktok', 
    label: 'TikTok', 
    icon: TiktokIcon, 
    placeholder: 'https://tiktok.com/...', 
    hoverClass: 'hover:bg-zinc-800 hover:text-white hover:border-zinc-700' 
  },
  { 
    id: 'twitch', 
    label: 'Twitch', 
    icon: TwitchIcon, 
    placeholder: 'https://twitch.tv/...', 
    hoverClass: 'hover:bg-purple-600 hover:text-white hover:border-purple-600' 
  },
  { 
    id: 'facebook', 
    label: 'Facebook', 
    icon: FacebookIcon, 
    placeholder: 'https://facebook.com/...', 
    hoverClass: 'hover:bg-blue-600 hover:text-white hover:border-blue-600' 
  },
  { 
    id: 'linkedin', 
    label: 'LinkedIn', 
    icon: LinkedinIcon, 
    placeholder: 'https://linkedin.com/in/...', 
    hoverClass: 'hover:bg-sky-700 hover:text-white hover:border-sky-700' 
  },
  { 
    id: 'x', 
    label: 'X (Twitter)', 
    icon: TwitterIcon, 
    placeholder: 'https://x.com/...', 
    hoverClass: 'hover:bg-zinc-800 hover:text-white hover:border-zinc-700' 
  },
  { 
    id: 'kick', 
    label: 'Kick', 
    icon: KickIcon, 
    placeholder: 'https://kick.com/...', 
    hoverClass: 'hover:bg-[#53fc18] hover:text-black hover:border-[#53fc18]' 
  },
  { 
    id: 'soundcloud', 
    label: 'SoundCloud', 
    icon: SoundCloudIcon, 
    placeholder: 'https://soundcloud.com/...', 
    hoverClass: 'hover:bg-orange-500 hover:text-white hover:border-orange-500' 
  },
];
