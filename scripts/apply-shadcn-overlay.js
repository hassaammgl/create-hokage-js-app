#!/usr/bin/env node
/**
 * Apply shadcn/ui overlay onto copied Tailwind templates.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shadcnRoot = path.join(root, 'templates', 'shadcn-ui');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, contents) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, contents);
}

function removeQuiet(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch {
    // ignore
  }
}

const TAILWIND_CONFIG = `import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      animation: {
        gradient: "gradient 15s ease infinite",
        float: "float 15s infinite ease-in-out",
        "logo-spin": "logo-spin 20s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "pulse-slow": "pulse 2s infinite",
      },
      keyframes: {
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [animate],
};
`;

const APP_CSS = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
    --radius: 0.5rem;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0% { transform: translateY(0) translateX(0) rotate(0deg); }
  25% { transform: translateY(-20px) translateX(15px) rotate(5deg); }
  50% { transform: translateY(-40px) translateX(0) rotate(0deg); }
  75% { transform: translateY(-20px) translateX(-15px) rotate(-5deg); }
  100% { transform: translateY(0) translateX(0) rotate(0deg); }
}

@keyframes logo-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
`;

const UTILS_TS = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

const UTILS_JS = `import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
`;

const BUTTON_TSX = `import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
`;

const BUTTON_JSX = `import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
`;

function componentsJson(tsx) {
  return `${JSON.stringify(
    {
      $schema: 'https://ui.shadcn.com/schema.json',
      style: 'new-york',
      rsc: false,
      tsx,
      tailwind: {
        config: 'tailwind.config.js',
        css: 'src/styles/App.css',
        baseColor: 'slate',
        cssVariables: true,
        prefix: '',
      },
      aliases: {
        components: '@/components',
        utils: '@/lib/utils',
        ui: '@/components/ui',
        lib: '@/lib',
        hooks: '@/hooks',
      },
      iconLibrary: 'lucide',
    },
    null,
    2,
  )}\n`;
}

function viteConfig(useSwc) {
  const reactImport = useSwc
    ? "import react from '@vitejs/plugin-react-swc'"
    : "import react from '@vitejs/plugin-react'";
  return `import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
${reactImport}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
`;
}

const JSCONFIG = `{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
`;

function patchTsconfigPaths(filePath) {
  if (!fs.existsSync(filePath)) return;
  let source = fs.readFileSync(filePath, 'utf8');

  if (source.includes('"@/*"')) return;

  if (/\"compilerOptions\"\s*:\s*\{/.test(source)) {
    source = source.replace(
      /(\"compilerOptions\"\s*:\s*\{)/,
      `$1\n    "baseUrl": ".",\n    "paths": {\n      "@/*": ["./src/*"]\n    },`,
    );
  } else {
    source = source.replace(
      /\{\s*/,
      `{\n  "compilerOptions": {\n    "baseUrl": ".",\n    "paths": {\n      "@/*": ["./src/*"]\n    }\n  },\n  `,
    );
  }

  fs.writeFileSync(filePath, source);
}

function patchLoginSubmit(filePath, isTs) {
  if (!fs.existsSync(filePath)) return;
  let source = fs.readFileSync(filePath, 'utf8');
  if (source.includes('@/components/ui/button')) return;

  const importLine = isTs
    ? "import { Button } from '@/components/ui/button';\n"
    : "import { Button } from '@/components/ui/button';\n";

  if (!source.includes(importLine.trim())) {
    source = source.replace(
      "import axios from 'axios';",
      `import axios from 'axios';\n${importLine.trim()}`,
    );
  }

  source = source.replace(
    /<button[\s\S]*?type="submit"[\s\S]*?>\s*\{isLoading \? 'Processing\.\.\.' : 'SIGN IN'\}\s*<\/button>/,
    `<Button type="submit" className="w-[350px]" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'SIGN IN'}
                </Button>`,
  );

  fs.writeFileSync(filePath, source);
}

function isJsFrontend(templateName) {
  return templateName === 'js-template' || templateName === 'js-frontend-ts-backend';
}

async function applyTemplate(templateName) {
  const clientDir = path.join(shadcnRoot, templateName, 'client');
  const jsFrontend = isJsFrontend(templateName);
  const useSwc = jsFrontend;

  writeFile(path.join(clientDir, 'tailwind.config.js'), TAILWIND_CONFIG);
  writeFile(path.join(clientDir, 'src', 'styles', 'App.css'), APP_CSS);
  writeFile(path.join(clientDir, 'components.json'), componentsJson(!jsFrontend));
  writeFile(
    path.join(clientDir, jsFrontend ? 'vite.config.js' : 'vite.config.ts'),
    viteConfig(useSwc),
  );

  ensureDir(path.join(clientDir, 'src', 'lib'));
  ensureDir(path.join(clientDir, 'src', 'components', 'ui'));

  if (jsFrontend) {
    writeFile(path.join(clientDir, 'src', 'lib', 'utils.js'), UTILS_JS);
    writeFile(path.join(clientDir, 'src', 'components', 'ui', 'button.jsx'), BUTTON_JSX);
    writeFile(path.join(clientDir, 'jsconfig.json'), JSCONFIG);
    patchLoginSubmit(path.join(clientDir, 'src', 'pages', 'Login.jsx'), false);
    removeQuiet(path.join(clientDir, 'vite.config.ts'));
  } else {
    writeFile(path.join(clientDir, 'src', 'lib', 'utils.ts'), UTILS_TS);
    writeFile(path.join(clientDir, 'src', 'components', 'ui', 'button.tsx'), BUTTON_TSX);
    patchTsconfigPaths(path.join(clientDir, 'tsconfig.json'));
    patchTsconfigPaths(path.join(clientDir, 'tsconfig.app.json'));
    patchLoginSubmit(path.join(clientDir, 'src', 'pages', 'Login.tsx'), true);
  }
}

const templates = [
  'js-template',
  'ts-template',
  'js-frontend-ts-backend',
  'ts-frontend-js-backend',
];

for (const name of templates) {
  await applyTemplate(name);
  console.log(`patched ${name}`);
}
