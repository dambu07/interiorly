import * as Icons from "@/components/icons";

type PasswordStrengthCriterion = {
  id: string;
  met: boolean;
  message: string;
};

type PasswordStrengthEvaluationResult = {
  criteria: PasswordStrengthCriterion[];
  strengthPercentage: number;
};

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: NavLink[];
    }
);

export type SettingsConfig = {
  settingsNav: SidebarNavItem[];
};

export type OnboardingStep = {
  title: string;
  description: string;
  component: React.ReactNode;
  onSubmit: () => void;
};
