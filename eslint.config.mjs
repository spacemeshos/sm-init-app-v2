import ParserTypescriptEslint from "@typescript-eslint/parser";
import PluginImport from "eslint-plugin-import";
import globals from "globals";

import path from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";

const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);
const compat = new FlatCompat({
  baseDirectory: __dirName,
  recommendedConfig: pluginJs.configs.recommended,
});

export default [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parser: ParserTypescriptEslint,
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirName,
      },
    },
    plugins: {
      import: PluginImport,
    },
    settings: {
      "import/resolver": {
        ...PluginImport.configs.typescript.settings["import/resolver"],
        typescript: {
          project: ["tsconfig.json"],
        },
      },
    },
  },
  { ignores: ["**/dist/*", "**/node_modules/*", "eslint.config.mjs"] },
];
