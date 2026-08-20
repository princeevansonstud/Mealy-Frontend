# Mealy — Frontend

Mealy is an application that allows customers to make food orders and helps the food vendor know what customers want to eat.

## Team

Full Stack — React (Frontend) & Python Flask (Backend)

- **Safia** — Authentication
- **Marian** — Menu & Ordering
- **Precious** — Meal & Menu Management
- **Cherop** — Orders & Earnings
- **Prince** — Scrum Master & ordering

## Tech Stack

- **Frontend:** React + Redux Toolkit (state management)
- **Wireframes:** Figma (mobile-friendly)

## Features

### Core
- User account creation and login
- Caterer meal management (add, modify, delete meal options)
- Daily menu setup by caterer
- Customer menu browsing and meal selection
- Change meal choice
- Caterer view of customer orders
- Daily earnings tracking

### Extra
- Customer order history
- Notifications when the daily menu is set
- Order history for caterers
- Support for multiple caterers

## Getting Started

### Prerequisites
- Node.js and npm installed

### Setup

```bash
git clone git@github.com:princeevansonstud/Mealy-Frontend.git
cd Mealy-Frontend
npm install
npm run dev
```

The app will run at `http://localhost:5173` by default.

## Project Structure
src/
├── assets/ # Static images (e.g. meal photos)
├── components/ # Shared/reusable UI components
├── pages/ # Page-level components
├── store/
│ └── slices/ # Redux Toolkit slices
├── App.jsx
└── main.jsx

## Branching

- `main` — stable branch
- `dev` — active development, integration branch
- `feature/*` — individual feature branches, merged into `dev`