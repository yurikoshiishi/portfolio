import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { FiMail } from "react-icons/fi";

export interface SocialLink {
  href: string;
  name: string;
  icon: React.ReactNode;
}

export const socialLinks: SocialLink[] = [
  {
    href: "mailto:yuri.koshiishi@gmail.com",
    icon: <FiMail size={24} />,
    name: "email",
  },
  {
    href: "https://linkedin.com/in/yurikoshiishi",
    icon: <AiFillLinkedin size={24} />,
    name: "linkedin",
  },
  {
    href: "https://github.com/yurikoshiishi",
    icon: <AiFillGithub size={24} />,
    name: "github",
  },
];

export const iconNames = [
  "css",
  "docker",
  "express",
  "firebase",
  "git",
  "github",
  "html",
  "javascript",
  "jest",
  "mui",
  "nextjs",
  "nodejs",
  "postgresql",
  "react",
  "redux",
  "sass",
  "tailwind",
  "typescript",
  "vscode",
  "webpack",
];
