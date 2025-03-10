import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import {globalIgnores} from "eslint/config";
import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default tseslint.config([
    globalIgnores(["build/**/*.js", "config-overrides.js", "eslint.config.mjs"]),
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    {
        files: ["src/**/*.{js,mjs,ts,jsx,tsx}"],
        ...pluginJs.configs.recommended,
        settings: {
            react: {
                version: "17.0",
            }
        },
        ...pluginReact.configs.flat.recommended,
        ...pluginReact.configs.flat['jsx-runtime'],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: globals.browser
        },
        rules: {
            "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
        }
    },
    eslintPluginPrettierRecommended,
]);