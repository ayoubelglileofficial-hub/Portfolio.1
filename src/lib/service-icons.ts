import {
  Code2, Globe, Smartphone, Palette, Briefcase, Cloud, Terminal,
  Network, Database, ShoppingCart, Search, Wrench, PenTool,
  BarChart3, ShieldCheck, Gauge, Users, Workflow, Server,
  LifeBuoy, Move, TestTube2, Brain, FileText, TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { type ComponentType, type SVGProps } from "react";

export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string; className?: string }>;

interface ServiceIconEntry {
  icon: IconComponent;
  color: string;
}

export const serviceIconMap: Record<string, ServiceIconEntry> = {
  "web-development": { icon: Globe, color: "#3B82F6" },
  "mobile-apps": { icon: Smartphone, color: "#8B5CF6" },
  "ui-ux-design": { icon: Palette, color: "#EC4899" },
  consulting: { icon: Briefcase, color: "#F59E0B" },
  "cloud-services": { icon: Cloud, color: "#0EA5E9" },
  devops: { icon: Terminal, color: "#64748B" },
  "api-development": { icon: Network, color: "#06B6D4" },
  "database-management": { icon: Database, color: "#14B8A6" },
  ecommerce: { icon: ShoppingCart, color: "#22C55E" },
  seo: { icon: Search, color: "#10B981" },
  maintenance: { icon: Wrench, color: "#78716C" },
  branding: { icon: PenTool, color: "#F43F5E" },
  analytics: { icon: BarChart3, color: "#F97316" },
  security: { icon: ShieldCheck, color: "#DC2626" },
  performance: { icon: Gauge, color: "#EAB308" },
  training: { icon: Users, color: "#6366F1" },
  automation: { icon: Workflow, color: "#8B5CF6" },
  hosting: { icon: Server, color: "#71717A" },
  support: { icon: LifeBuoy, color: "#3B82F6" },
  migration: { icon: Move, color: "#F59E0B" },
  testing: { icon: TestTube2, color: "#DC2626" },
  strategy: { icon: Brain, color: "#A855F7" },
  content: { icon: FileText, color: "#78716C" },
  optimization: { icon: TrendingUp, color: "#22C55E" },
  development: { icon: Code2, color: "#3B82F6" },
  palette: { icon: Palette, color: "#EC4899" },
  code: { icon: Code2, color: "#3B82F6" },
  frontend: { icon: Code2, color: "#3B82F6" },
  AI: { icon: Brain, color: "#A855F7" },
};

export function getServiceIcon(iconName: string): ServiceIconEntry {
  return serviceIconMap[iconName.toLowerCase()] || { icon: Code2, color: "#6B7280" };
}
