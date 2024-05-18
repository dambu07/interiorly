import { PasswordStrengthEvaluationResult } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Price } from "@/lib/supabase/supabase.types";
xx
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

export function getBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (!reader.result) return reject("Failed to read file");
      let encoded = reader.result.toString().replace(/^data:(.*,)?/, "");
      if (encoded.length % 4 > 0) {
        encoded += "=".repeat(4 - (encoded.length % 4));
      }
      resolve(encoded as string);
    };
    reader.onerror = (error) => reject(error);
  });
}

export const getInitials = (name: string) => {
  const allNames = name.trim().split(" ");
  const initials = allNames.reduce((acc, curr, index) => {
    if (index === 0 || index === allNames.length - 1) {
      acc = `${acc}${curr.charAt(0).toUpperCase()}`;
    }
    return acc;
  }, "");
  return initials;
};

export const formatPrice = (price: Price) => {
  const priceString = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency || undefined,
    minimumFractionDigits: 0,
  }).format((price?.unitAmount || 0) / 100);
  return priceString;
};

export const getURL = () => {
  let url = process?.env?.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000/";

  url = url.includes("http") ? url : `https://${url}`;
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  return url;
};

export const postData = async ({
  url,
  data,
}: {
  url: string;
  data?: { price: Price };
}) => {
  console.log("posting,", url, data);
  const res: Response = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    console.log("Error in postData", { url, data, res });
    throw Error(res.statusText);
  }
  return res.json();
};

export const toDateTime = (secs: number) => {
  var t = new Date("1970-01-01T00:30:00Z");
  t.setSeconds(secs);
  return t;
};
