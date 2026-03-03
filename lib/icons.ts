import {
  Shield,
  ShieldCheck,
  Zap,
  TrendingUp,
  BarChart3,
  FileText,
  PenTool,
  ClipboardList,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Shield,
  ShieldCheck,
  Zap,
  TrendingUp,
  BarChart3,
  FileText,
  PenTool,
  ClipboardList,
  ArrowRight,
};

export function getIcon(name: string | null): LucideIcon | null {
  if (!name) return null;
  return iconMap[name] || null;
}
