# AI Development Rules and Guidelines

This document outlines the technical stack and specific library usage rules for maintaining consistency and quality in this application.

## Tech Stack Overview

*   **Framework:** React (for building dynamic user interfaces).
*   **Language:** TypeScript (for type safety and improved code quality).
*   **Styling:** Tailwind CSS (utility-first CSS framework for rapid and responsive styling).
*   **Component Base:** shadcn/ui (pre-built, customizable components based on Radix UI primitives).
*   **Routing:** React Router (standard library for managing application navigation).
*   **Icons:** Lucide React (modern, open-source icon library).
*   **Structure:** Components reside in `src/components/` and pages in `src/pages/`.
*   **Design Principle:** All designs must be responsive by default.

## Library Usage Rules

| Purpose | Recommended Library/Tool | Specific Rule |
| :--- | :--- | :--- |
| **UI Components** | shadcn/ui (Radix UI base) | Always prioritize using or composing components from shadcn/ui for standard UI elements (Buttons, Cards, Forms, Dialogs, etc.). |
| **Styling** | Tailwind CSS | All styling must be implemented using Tailwind CSS utility classes. Custom CSS files should be avoided. |
| **Icons** | Lucide React | Use icons exclusively from the `lucide-react` package. |
| **Routing** | React Router | Manage all application navigation and URL structure using React Router components and hooks. Routes must be defined in `src/App.tsx`. |
| **New Components/Hooks** | React/TypeScript | Every new component or hook must reside in its own dedicated, small file within `src/components/` or `src/hooks/`. |