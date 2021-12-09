module.exports = {
    "env": {
        "browser": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": {
        "react/react-in-jsx-scope": "off",
        "@typescript-eslint/explicit-module-boundary-types": 0,
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [1, {"args": "after-used", "argsIgnorePattern": "^_"}]
    },
    "settings": {
        "react": {
          "version": "detect", // React version. "detect" automatically picks the version you have installed.
        },
    }
};
