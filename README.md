# NPPF Raffle Display

A React application for managing and displaying raffle information for Northern Polk Pheasants Forever.

[Click here to open the raffle display!](https://jrichlen.github.io/nppf-raffle-display)

## Usage

This can be used by anyone. It's hosted by github pages. Application state is stored in localstorage, so if you refresh data isn't lost. 

> **Attention:** If you want to load sample data, skip to the [Data Management instructions](#data-management). If you are confused about reaching the admin page, checkout [Reset App Data instructions](#reset-app-data).

### Entering Winners & Claiming Prizes

Raffle winners are entered on the display page using the input at the bottom. Hints and autocomplete are built-in to assist with repeat winners. Repeat winners will not show multiple times on the board, but multiple unclaimed prizes will be associated to the winner. Each claim can be associated to many prizes, but only one winner.

When a winner comes to claim their prize, click there name on the display to mark all outstanding prizes as claimed.

> **Note:** Repeat winners with unclaimed prizes will not show twice on the display, instead an additional prize icon is added to the card next to their name.

### Admin Page
The admin page is made up of different screens for administrating the raffle display. It includes a winners table, metrics, and settings. 

> **Access:** To reach the admin page, click the admin icon button in the top right. To return to the display, click the button again.

#### Raffle Winners Table

<img width="1251" alt="Screenshot 2025-03-03 at 11 09 26 AM" src="https://github.com/user-attachments/assets/61fa238c-e330-43f7-a9c1-569576c1f209" />

This table shows all the winners. It's searchable by name and filterable by claim status. Winner rows will expand to show prizes and claims when clicked. Columns are sortable.

#### Raffle Metrics

<img width="1255" alt="Screenshot 2025-03-03 at 11 09 59 AM" src="https://github.com/user-attachments/assets/2fa037eb-a0b9-4b7f-ad5c-1e3aa55d8b8e" />

This screen will display the following metrics if winners exist:
- **Total Prizes:** total number of prizes awarded across all winners
- **Total Claims:** total number of claims process across all winners
- **Unclaimed Prizes:** total number of prizes awarded that remain unclaimed by winners
- **Unique Winners:** total number of unique winners

The screen also includes the following graphs:
- **Total Claims and Prizes Over Time:** Line graph representation used to track prize and claims totals
  - Used to track if we're awarding prizes quicker than people can claim them - used to influence the pace at which we draw winners 
- **(Coming Soon) Claims and Prizes Over Time:** Bar graph representation used to display prizes and claims during specific intervals
  - A retrospective graph providing insight into the busiest prize and claim intervals - we can correlate these behaviors with other banquet activities. It will help with the following:
    - Does the auction decrease rate of raffle claims?
    - Are attendees more focused on other activities?

#### Data Management

<img width="537" alt="Screenshot 2025-03-03 at 11 10 43 AM" src="https://github.com/user-attachments/assets/54312ba2-53eb-43a2-96f3-7e2024f1aa57" />

- **Reset Data:** Reset the winners, claims, and prizes. This will clear the display. See [reset app data](#reset-app-data) for instructions.
- **Download Data:** Download the current winners, claims, and prizes in a json file.
- **Load Data:** Load data from json into the display. This will override the existing data.
  - *From File:* Load data from a json file that you previously downloaded.
  - *From Sample Data:* Bundled with the app is sample data - it's great for demos!
    - Sample data includes 135 unique winners, over 200 prizes with some claimed and unclaimed. 

##### Reset App Data

To reset the app, go to the admin page:
  1. Using left sidebar, navigate to settings
  3. click the reset button and follow the prompts

To Navigate back to the display page, click the button in the top-right again. Display should be empty.

#### Preferences

<img width="227" alt="Screenshot 2025-03-03 at 11 11 03 AM" src="https://github.com/user-attachments/assets/d68d7f50-06ac-4cd3-a04d-7680962a4ffa" />

- **Winner Card Color:** Change the color of the winner cards on the display. By default they are white, but can be orange as an alternative.

> **Attention:** Test what each looks like with your projector and backdrop. Some colors don't display well in all environments and are not as visible from a distance. For our banquet, these need to be visible from more than 100ft once projected on a white wall.

### Troubleshoot Usage

> "I reloaded the screen and it's not found!"
> 
> <img width="896" alt="Screenshot 2025-03-03 at 11 03 59 AM" src="https://github.com/user-attachments/assets/d25effc2-a80b-4a08-8f5c-70cfc8219808" />
>
>> The app is hosted on GitHub Pages. You have to navigate back to the root to get the app to load. It doesn't actually serve content at the other routes. What you see is the react router rendering the content, or in the screenshot GitHub Pages has no content at that endpoint. In this case, [navigate to root of the site](https://jrichlen.github.io/nppf-raffle-display).

## Features

- Modern React 19 with TypeScript
- Material UI components for polished user interface
- Routing with React Router
- Full test coverage with Cypress

## Development: Getting Started

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
