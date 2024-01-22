# ![ICOOPA logo](https://www.icoopa.bzh/wp-content/themes/icoopa/library/images/header-logo-txt.png) attendance-sheet

![ICOOPA complementary logo](https://www.icoopa.bzh/wp-content/themes/icoopa/library/images/header-logo.png)

![GitHub last commit](https://img.shields.io/github/last-commit/google/skia.svg?style=flat) ![GitHub CI](https://github.com/Benjent/attendance-sheet/actions/workflows/main.yml/badge.svg)

![GitHub Pages badge](https://img.shields.io/badge/GitHub_Pages-222222?logo=github&logoColor=white) ![Vue.js badge](https://img.shields.io/badge/Vue.js_3-42b883?logo=vuedotjs&logoColor=white) ![Tailwind CSS badge](https://img.shields.io/badge/Tailwind_CSS_-0ea5e9?logo=tailwindcss&logoColor=white) ![Conventional commits badge](https://img.shields.io/badge/Conventional_commits-fa6673?logo=conventionalcommits&logoColor=white) ![ESLint badge](https://img.shields.io/badge/ESLint-4b32c3?logo=eslint&logoColor=white)

Tiny web project to fill an [ICOOPA](https://www.icoopa.bzh/)-compliant attendance sheet. Employees can pre-fill and edit their working hours, as well as their times off, without the need for printing.

> [!IMPORTANT]
> This is a voluntary and unofficial project to improve the working life of companies that call upon [ICOOPA](https://www.icoopa.bzh/) for their accountability. While the generated document rigorously reproduces the template sheet provided by ICOOPA, in no way does it engage - or has been approved by - the latter.

This is a [Vue.js v3](https://vuejs.org/) project bootstrapped with [Create Vue](https://github.com/vuejs/create-vue).

[See it live](https://benjent.github.io/attendance-sheet/).

## Resources

- [Vite](https://vitejs.dev/) (frontend tooling)
- [Vue.js](https://vuejs.org/) (frontend library)
- [Editor config](https://EditorConfig.org) (linting)
- [ESLint](https://eslint.org/) (linting)
- [Date-fns](https://date-fns.org/) (date handling)
- [Date-holidays](https://www.npmjs.com/package/date-holidays) (date handling)
- [Tailwind CSS](https://tailwindcss.com/) (CSS library)

## Prerequisites

- [Node](https://nodejs.org/en/)

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## To do

- [ ] Find the exact font family used in the ICOOPA sheet to be 100% correct on sizes (font size, letter spacing, font boldness, ...)
