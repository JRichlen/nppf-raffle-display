# NPPF Raffle Display

Collecting workspace information# NPPF Raffle Display

A React application for managing and displaying raffle information.

## Features

- Modern React 19 with TypeScript
- Material UI components for polished user interface
- Routing with React Router
- Full test coverage with Cypress

## Getting Started

### Prerequisites

Make sure you have Node.js installed. This project uses the version specified in .nvmrc.

```sh
# If using nvm, run:
nvm use
```

### Installation

```sh
# Install dependencies
npm install
```

### Development

```sh
# Start development server
npm run dev
```

This will start the application at [http://localhost:5173](http://localhost:5173).

## Testing

This project uses Cypress for end-to-end testing:

```sh
# Run tests in headless mode
npm test

# Open Cypress test runner
npm run cy:open

# View test coverage report
npm run cov:open
```

## Building for Production

```sh
# Create production build
npm run build

# Preview production build
npm run preview
```

## Code Quality

```sh
# Run ESLint
npm run lint
```

## Project Structure

```
src/
  ├── components/   # Reusable UI components
  ├── contexts/     # React contexts
  ├── hooks/        # Custom React hooks
  ├── pages/        # Application pages/routes
  ├── providers/    # Context providers
  └── utilities/    # Helper functions and utilities
```

## Technologies Used

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Material UI](https://mui.com/)
- [React Router](https://reactrouter.com/)
- [Cypress](https://www.cypress.io/)
