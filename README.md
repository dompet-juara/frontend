# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
## Project Structure

```text
frontend-main/
├── src/
│   ├── api/           # Directory for API configurations and functions
│   ├── assets/        # Directory for static assets (images, fonts, etc.)
│   ├── components/    # Reusable React components
│   ├── contexts/      # React Context for state management
│   ├── hooks/         # Custom React hooks
│   ├── layouts/       # Layout components for page structure
│   ├── pages/         # Main page components
│   ├── presenters/    # Presenter components for presentation logic
│   ├── utils/         # Utility functions and helpers
│   ├── App.tsx        # Main application component
│   ├── main.tsx       # Application entry point
│   ├── index.css      # Global styling
│   └── vite-env.d.ts  # TypeScript declarations for Vite
│
├── public/            # Directory for public assets
├── index.html         # Main HTML file
├── vite.config.ts     # Vite configuration
├── tsconfig.json      # Main TypeScript configuration
├── tsconfig.app.json  # TypeScript configuration for application
├── tsconfig.node.json # TypeScript configuration for Node
├── package.json       # Dependencies and scripts
├── package-lock.json  # Lock file for dependencies
├── eslint.config.js   # ESLint configuration
├── .gitignore        # Git ignored files
├── README.md         # Project documentation
└── LICENSE           # Project license
```
