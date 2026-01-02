import { useMemo } from "react";

interface PasswordStrengthProps {
  password: string;
}

type StrengthLevel = "weak" | "medium" | "strong";

interface StrengthResult {
  level: StrengthLevel;
  score: number;
  checks: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

export function getPasswordStrength(password: string): StrengthResult {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  let level: StrengthLevel;
  if (score <= 2) {
    level = "weak";
  } else if (score <= 3) {
    level = "medium";
  } else {
    level = "strong";
  }

  return { level, score, checks };
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  if (!password) {
    return null;
  }

  const colors = {
    weak: "bg-red-500",
    medium: "bg-yellow-500",
    strong: "bg-green-500",
  };

  const labels = {
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
  };

  const widths = {
    weak: "w-1/3",
    medium: "w-2/3",
    strong: "w-full",
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${colors[strength.level]} ${widths[strength.level]}`}
          />
        </div>
        <span
          className={`text-xs font-medium ${
            strength.level === "weak"
              ? "text-red-500"
              : strength.level === "medium"
                ? "text-yellow-600"
                : "text-green-600"
          }`}
        >
          {labels[strength.level]}
        </span>
      </div>

      <ul className="text-xs text-gray-500 space-y-1">
        <li className={strength.checks.minLength ? "text-green-600" : ""}>
          {strength.checks.minLength ? "✓" : "○"} At least 8 characters
        </li>
        <li className={strength.checks.hasUppercase ? "text-green-600" : ""}>
          {strength.checks.hasUppercase ? "✓" : "○"} One uppercase letter
        </li>
        <li className={strength.checks.hasLowercase ? "text-green-600" : ""}>
          {strength.checks.hasLowercase ? "✓" : "○"} One lowercase letter
        </li>
        <li className={strength.checks.hasNumber ? "text-green-600" : ""}>
          {strength.checks.hasNumber ? "✓" : "○"} One number
        </li>
        <li className={strength.checks.hasSpecial ? "text-green-600" : ""}>
          {strength.checks.hasSpecial ? "✓" : "○"} One special character
        </li>
      </ul>
    </div>
  );
}
