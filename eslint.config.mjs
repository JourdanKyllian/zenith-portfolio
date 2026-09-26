import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Configuration globale du linter ESLint pour l'application.
 * Étend les recommandations Core Web Vitals de Next.js et l'analyseur TypeScript.
 * Intègre des dérogations spécifiques liées à l'architecture du projet.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      /**
       * Autorise l'utilisation de la balise HTML native <img>.
       * Nécessaire pour le rendu des flux médias dynamiques asynchrones (Google Drive API)
       * sans les contraintes de dimensionnement strictes du composant next/image.
       */
      "@next/next/no-img-element": "off",
      
      /**
       * Assouplissement de la validation des entités textuelles React.
       * Permet l'utilisation d'apostrophes brutes (') pour faciliter la rédaction
       * native des contenus francophones.
       */
      "react/no-unescaped-entities": ["error", { "forbid": [">", "}", "\""] }]
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
