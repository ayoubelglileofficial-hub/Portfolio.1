import {
  Code2, Server, Terminal, Database, Box, Cloud, GitBranch,
  PenTool, Brain, Languages, Network, TestTube2, Workflow,
  ShieldCheck, Gauge, Users, Layers, Play, type LucideIcon,
} from "lucide-react";
import { ReactJs, TypeScript, TailwindCSS, HTML } from "@deemlol/next-icons";
import { RiNextjsFill } from "react-icons/ri";
import { TbBrandReactNative } from "react-icons/tb";
import { IoLogoCss3, IoLogoJavascript } from "react-icons/io";
import { type ComponentType, type SVGProps } from "react";
import { GrMysql } from "react-icons/gr";
import { FaDocker } from "react-icons/fa";
import { FaGitAlt } from "react-icons/fa";
import { FaFigma } from "react-icons/fa";
import { FaWordpress } from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";
import { BsGitlab } from "react-icons/bs";
import { SiKubernetes } from "react-icons/si";
import { RiClaudeFill } from "react-icons/ri";
import {
  SiGraphql, SiRedis, SiJest, SiCypress, SiNginx, SiPrisma,
  SiJenkins, SiTerraform, SiGooglecloud, SiVercel,
  SiApachekafka, SiRabbitmq, SiGithubactions, SiStripe,
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";

export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string; className?: string }>;

interface SkillIconEntry {
  icon: IconComponent;
  color: string; 
}

export const skillIconMap: Record<string, SkillIconEntry> = {
  react: { icon: ReactJs, color: "#61DAFB" },
  html: { icon: HTML, color: "#E34F26" },
  css: { icon: IoLogoCss3, color: "#1572B6" },
  bootstrap: { icon: IoLogoCss3, color: "#7952B3" },
  jquery: { icon: Code2, color: "#0769AD" },
  javascript: { icon: IoLogoJavascript, color: "#F7DF1E" },
  nextjs: { icon: RiNextjsFill, color: "#000000" },
  typescript: { icon: TypeScript, color: "#3178C6" },
  tailwind: { icon: TailwindCSS, color: "#06B6D4" },
  nodejs: { icon: Server, color: "#339933" },
  python: { icon: Terminal, color: "#3776AB" },
  mongodb: { icon: Database, color: "#47A248" },
  postgresql: { icon: Database, color: "#4169E1" },
  mySQL: { icon: Database, color: "#4169E1" },
  docker: { icon: FaDocker, color: "#2496ED" },
  // aws: { icon: SiAmazonaws, color: "#FF9900" },
  git: { icon: FaGitAlt, color: "#F05032" },
  figma: { icon: FaFigma, color: "#F24E1E" },
  "react-native": { icon: TbBrandReactNative, color: "#61DAFB" },
  brain: { icon: Brain, color: "#8B5CF6" },
  languages: { icon: Languages, color: "#10B981" },
  wordpress: { icon: FaWordpress, color: "#21759B" },
  vscode: { icon: VscVscode, color: "#007ACC" },
  gitlab: { icon: BsGitlab, color: "#FC6D26" },
  kubernetes: { icon: SiKubernetes, color: "#326CE5" },
  claude: { icon: RiClaudeFill, color: "#FFA500" },
  stripe: { icon: SiStripe, color: "#635BFF" },
  "framer-motion": { icon: Play, color: "#0055FF" },

  // --- Senior / architect-track additions ---
  "system-design": { icon: Network, color: "#0EA5E9" },       // designing scalable architectures
  "design-patterns": { icon: Layers, color: "#6366F1" },      // clean architecture, SOLID, patterns
  testing: { icon: TestTube2, color: "#C21325" },             // general testing mindset
  jest: { icon: SiJest, color: "#C21325" },             // testing framework
  cypress: { icon: SiCypress, color: "#17202C" },   // testing framework
  "ci-cd": { icon: Workflow, color: "#4B5563" },               // generic CI/CD concept
  "github-actions": { icon: SiGithubactions, color: "#2088FF" }, // CI/CD tool
  jenkins: { icon: SiJenkins, color: "#D24939" }, // CI/CD tool
  terraform: { icon: SiTerraform, color: "#7B42BC" },          // IaC, useful for cloud certs
  gcp: { icon: SiGooglecloud, color: "#4285F4" },
  azure: { icon: VscAzure, color: "#0078D4" },
  vercel: { icon: SiVercel, color: "#000000" },
  graphql: { icon: SiGraphql, color: "#E10098" },
  redis: { icon: SiRedis, color: "#DC382D" },
  prisma: { icon: SiPrisma, color: "#2D3748" },
  nginx: { icon: SiNginx, color: "#009639" },
  kafka: { icon: SiApachekafka, color: "#231F20" },
  rabbitmq: { icon: SiRabbitmq, color: "#FF6600" },
  security: { icon: ShieldCheck, color: "#DC2626" },           // OWASP, auth, RBAC etc.
  // "code-quality": { icon: SiSonarqube, color: "#4E9BCD" },     // SonarQube, linting/quality gates
  performance: { icon: Gauge, color: "#F59E0B" },              // perf/optimization
  leadership: { icon: Users, color: "#0D9488" },               // mentoring, team lead skills
};

export function getSkillIcon(iconName: string): SkillIconEntry {
  return skillIconMap[iconName.toLowerCase()] || { icon: Code2, color: "#6B7280" };
}