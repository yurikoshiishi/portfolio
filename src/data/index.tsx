import { AiFillLinkedin, AiFillGithub } from "react-icons/ai";
import { FiMail } from "react-icons/fi";
import CSSIcon from "../components/icons/CSSIcon";
import DockerIcon from "../components/icons/DockerIcon";
import ExpressIcon from "../components/icons/ExpressIcon";
import FirebaseIcon from "../components/icons/FirebaseIcon";
import GithubIcon from "../components/icons/GithubIcon";
import GitIcon from "../components/icons/GitIcon";
import HTMLIcon from "../components/icons/HTMLIcon";
import JavaScriptIcon from "../components/icons/JavaScriptIcon";
import JestIcon from "../components/icons/JestIcon";
import MaterialUIIcon from "../components/icons/MaterialUIIcon";
import NextJsIcon from "../components/icons/NextJsIcon";
import NodeJsIcon from "../components/icons/NodeJsIcon";
import PostgreSQLIcon from "../components/icons/PostgreSQLIcon";
import ReactIcon from "../components/icons/ReactIcon";
import ReduxIcon from "../components/icons/ReduxIcon";
import SassIcon from "../components/icons/SassIcon";
import TailwindIcon from "../components/icons/TailwindIcon";
import TypeScriptIcon from "../components/icons/TypeScriptIcon";
import VSCodeIcon from "../components/icons/VSCodeIcon";
import WebpackIcon from "../components/icons/WebpackIcon";

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

export const technologyIcons: React.FunctionComponent[] = [
  CSSIcon,
  DockerIcon,
  ExpressIcon,
  FirebaseIcon,
  GitIcon,
  GithubIcon,
  HTMLIcon,
  JavaScriptIcon,
  JestIcon,
  MaterialUIIcon,
  NextJsIcon,
  NodeJsIcon,
  PostgreSQLIcon,
  ReactIcon,
  ReduxIcon,
  SassIcon,
  TailwindIcon,
  TypeScriptIcon,
  VSCodeIcon,
  WebpackIcon,
];
