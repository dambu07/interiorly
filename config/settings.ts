import { SettingsConfig } from "@/types";

export const settingsConfig: SettingsConfig = {
  settingsNav: [
    {
      title: "Back",
      href: "/dashboard",
      icon: "IconChevronLeft",
    },
    {
      title: "Profile",
      href: "/dashboard/settings",
      icon: "IconUser",
    },
    {
      title: "Billing",
      href: "/dashboard/settings/billing",
      icon: "IconCheck",
    },
  ],
};
