import { PasswordStrengthEvaluationResult } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function evaluatePasswordStrength(password: string) {
  const criteria = [
    {
      id: "length",
      test: (p: string) => p.length >= 8,
      met: false,
      message: "At least 8 characters",
    },
    {
      id: "uppercase",
      test: (p: string) => /[A-Z]/.test(p),
      met: false,
      message: "Uppercase letters",
    },
    {
      id: "lowercase",
      test: (p: string) => /[a-z]/.test(p),
      met: false,
      message: "Lowercase letters",
    },
    {
      id: "numbers",
      test: (p: string) => /[0-9]/.test(p),
      met: false,
      message: "Numbers",
    },
    {
      id: "specialChars",
      test: (p: string) => /[^A-Za-z0-9]/.test(p),
      met: false,
      message: "Special characters",
    },
  ];

  let score = 0;

  criteria.forEach((criterion) => {
    if (criterion.test(password)) {
      criterion.met = true;
      score += 20;
    }
  });

  const strengthPercentage = score;

  return { criteria, strengthPercentage } as PasswordStrengthEvaluationResult;
}

export function getStrengthIndicator(strengthPercentage: number) {
  if (strengthPercentage >= 90) {
    return { color: "bg-green-500", message: "Very Strong" };
  } else if (strengthPercentage >= 70) {
    return { color: "bg-emerald-500", message: "Strong" };
  } else if (strengthPercentage >= 50) {
    return { color: "bg-yellow-500", message: "Medium" };
  } else if (strengthPercentage >= 30) {
    return { color: "bg-orange-500", message: "Weak" };
  } else {
    return { color: "bg-red-500", message: "Very Weak" };
  }
}

export function getRandomLogoBackground() {
  const colors = [
    "bg-primary",
    "bg-emerald",
    "bg-yellow",
    "bg-red",
    "bg-blue",
    "bg-indigo",
    "bg-purple",
    "bg-pink",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

export function getRandomBannerGradientBackground() {
  const gradients = [
    "bg-gradient-to-r from-primary to-emerald",
    "bg-gradient-to-r from-yellow to-red",
    "bg-gradient-to-r from-blue to-indigo",
    "bg-gradient-to-r from-purple to-pink",
    "bg-gradient-to-r from-pink to-primary",
    "bg-gradient-to-r from-red to-yellow",
  ];

  return gradients[Math.floor(Math.random() * gradients.length)];
}
