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
  title?: string;
  description?: string;
  component: React.ReactNode;
  submitButtonText?: string;
  skipable?: boolean;
  onSubmit?: (data?: z.infer<typeof OnboardingSchema>) => void;
};

export type WorkspaceCollaboration = "individual" | "organization" | "team";

export type OnboardingWorkspaceCollaboration = {
  collaborationType: WorkspaceCollaboration;
  icon: keyof typeof Icons;
  title: string;
  description: string;
};
