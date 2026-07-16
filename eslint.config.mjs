import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Désactivation de la règle stricte sur les balises <img> natives
      "@next/next/no-img-element": "off",
      // Autorise les apostrophes brutes (') pour les textes en français
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