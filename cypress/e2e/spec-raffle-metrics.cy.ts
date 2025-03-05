/// <reference types="cypress" />
/// <reference types="cypress-localstorage-commands" />

describe('Raffle Metrics Dashboard', () => {
  beforeEach(() => {
    // Load the raffle winners fixture
    cy.fixture('winners').then((winners) => {
      cy.setLocalStorage('raffleWinners', JSON.stringify(winners));
    });

    // Visit admin page and navigate to metrics
    cy.visit('/admin');
    cy.get('[data-cy=nav-Metrics]').click();
  });

  it('should display the metrics dashboard header', () => {
    cy.get('[data-cy=metrics-header]').should('be.visible')
      .and('contain', 'Raffle Metrics Dashboard');
  });

  it('should display all metric counter cards', () => {
    // Check that all basic metric cards are present and visible
    cy.get('[data-cy=metric-card-total-prizes]').should('be.visible');
    cy.get('[data-cy=metric-card-total-claims]').should('be.visible');
    cy.get('[data-cy=metric-card-unclaimed-prizes]').should('be.visible');
    cy.get('[data-cy=metric-card-unique-winners]').should('be.visible');

    // Check that all advanced metric cards are present and visible
    cy.get('[data-cy=metric-card-avg-time-to-claim]').should('be.visible');
    cy.get('[data-cy=metric-card-median-time-to-claim]').should('be.visible');
    cy.get('[data-cy=metric-card-claim-rate]').should('be.visible');
    cy.get('[data-cy=metric-card-claims-by-source]').should('be.visible');
    cy.get('[data-cy=metric-card-fastest-claim]').should('be.visible');
    cy.get('[data-cy=metric-card-slowest-claim]').should('be.visible');

    // Verify that each card has a title
    cy.get('[data-cy=metric-title]').should('have.length', 10);

    // Verify that each card has a value
    cy.get('[data-cy=metric-value]').should('have.length', 10);
  });

  it('should calculate basic metrics correctly based on raffle data', () => {
    cy.fixture('winners').then((winners) => {
      // Calculate expected values
      const totalPrizes = winners.reduce((sum, winner) => sum + winner.prizes.length, 0);
      const totalClaims = winners.reduce((sum, winner) => sum + (winner.claims?.length || 0), 0);
      const uniqueWinners = new Set(winners.map(w => w.id)).size;

      // Calculate unclaimed prizes
      const totalClaimedPrizes = winners.reduce((sum, winner) => {
        const claimedPrizeIds = winner.claims?.flatMap(c => c.prizeIds) || [];
        return sum + claimedPrizeIds.length;
      }, 0);
      const unclaimedPrizes = totalPrizes - totalClaimedPrizes;

      // Verify the displayed values match our calculations
      cy.get('[data-cy=metric-card-total-prizes]').find('[data-cy=metric-value]')
        .should('contain', totalPrizes);
      cy.get('[data-cy=metric-card-total-claims]').find('[data-cy=metric-value]')
        .should('contain', totalClaims);
      cy.get('[data-cy=metric-card-unclaimed-prizes]').find('[data-cy=metric-value]')
        .should('contain', unclaimedPrizes);
      cy.get('[data-cy=metric-card-unique-winners]').find('[data-cy=metric-value]')
        .should('contain', uniqueWinners);
    });
  });

  it('should calculate advanced metrics correctly based on raffle data', () => {
    // Check that claim rate is displayed as a percentage
    cy.get('[data-cy=metric-card-claim-rate]').find('[data-cy=metric-value]')
      .invoke('text')
      .should('match', /\d+%/);

    // Check that claims by source shows the display/admin format
    cy.get('[data-cy=metric-card-claims-by-source]').find('[data-cy=metric-value]')
      .invoke('text')
      .should('match', /\d+ \/ \d+/);
    cy.get('[data-cy=metric-card-claims-by-source]').find('[data-cy=metric-subtitle]')
      .should('contain', 'Display / Admin');

    // Time metrics should show appropriate time formats
    cy.get('[data-cy=metric-card-avg-time-to-claim]').find('[data-cy=metric-value]')
      .invoke('text')
      .then(text => {
        // Should either contain "seconds", "minutes", "h m", or "N/A"
        expect(text).to.match(/(\d+ seconds|\d+ minutes|\d+h \d+m|N\/A)/);
      });

    cy.get('[data-cy=metric-card-median-time-to-claim]').find('[data-cy=metric-value]')
      .invoke('text')
      .then(text => {
        expect(text).to.match(/(\d+ seconds|\d+ minutes|\d+h \d+m|N\/A)/);
      });

    cy.get('[data-cy=metric-card-fastest-claim]').find('[data-cy=metric-value]')
      .invoke('text')
      .then(text => {
        expect(text).to.match(/(\d+ seconds|\d+ minutes|\d+h \d+m|N\/A)/);
      });

    cy.get('[data-cy=metric-card-slowest-claim]').find('[data-cy=metric-value]')
      .invoke('text')
      .then(text => {
        expect(text).to.match(/(\d+ seconds|\d+ minutes|\d+h \d+m|N\/A)/);
      });
  });

  it('should display charts when data is available', () => {
    // Time series chart (main chart that shows prizes and claims over time)
    cy.get('[data-cy=charts-container]').should('be.visible');
    cy.get('[data-cy=time-series-chart]').should('be.visible')
      .find('svg').should('exist')
      .find('path').should('exist');

    // Claims by source chart (pie chart)
    cy.get('[data-cy=claims-by-source-chart]').should('exist')
      .within(() => {
        cy.contains('Claims by Source').should('be.visible');
        cy.get('svg').should('exist');
      });

    // Time to claim distribution chart (bar chart)
    cy.get('[data-cy=time-to-claim-chart]').should('exist')
      .within(() => {
        cy.contains('Time to Claim Distribution').should('be.visible');
        cy.get('svg').should('exist');
      });
  });

  it('should update metrics when raffle data changes', () => {
    // Get initial values
    let initialPrizes;
    cy.get('[data-cy=metric-card-total-prizes]').find('[data-cy=metric-value]')
      .invoke('text')
      .then(text => {
        initialPrizes = parseInt(text);
      });

    // Modify the raffle data
    cy.fixture('winners').then((winners) => {
      // Add a new winner with prizes
      const newWinner = {
        id: 'test-winner',
        name: 'Test Winner',
        prizes: [
          { id: 'new-prize-1', dateWon: new Date().toISOString() },
          { id: 'new-prize-2', dateWon: new Date().toISOString() }
        ],
        claims: []
      };
      winners.push(newWinner);

      // Update localStorage
      cy.setLocalStorage('raffleWinners', JSON.stringify(winners));

      // Refresh the page to see updates
      cy.reload();
      cy.get('[data-cy=nav-Metrics]').click();

      // Verify total prizes increased by 2
      cy.get('[data-cy=metric-card-total-prizes]').find('[data-cy=metric-value]')
        .invoke('text')
        .then(text => {
          const newTotal = parseInt(text);
          expect(newTotal).to.equal(initialPrizes + 2);
        });
    });
  });

  it('should handle empty raffle data gracefully', () => {
    // Clear raffle data
    cy.setLocalStorage('raffleWinners', JSON.stringify([]));
    cy.reload();
    cy.get('[data-cy=nav-Metrics]').click();

    // All counters should show zero or N/A as appropriate
    cy.get('[data-cy=metrics-counters]').within(() => {
      cy.get('[data-cy=metric-card-total-prizes]').find('[data-cy=metric-value]').should('contain', '0');
      cy.get('[data-cy=metric-card-total-claims]').find('[data-cy=metric-value]').should('contain', '0');
      cy.get('[data-cy=metric-card-unclaimed-prizes]').find('[data-cy=metric-value]').should('contain', '0');
      cy.get('[data-cy=metric-card-unique-winners]').find('[data-cy=metric-value]').should('contain', '0');
      cy.get('[data-cy=metric-card-avg-time-to-claim]').find('[data-cy=metric-value]').should('contain', '0 seconds');
      cy.get('[data-cy=metric-card-median-time-to-claim]').find('[data-cy=metric-value]').should('contain', '0 seconds');
      cy.get('[data-cy=metric-card-claim-rate]').find('[data-cy=metric-value]').should('contain', '0%');
      cy.get('[data-cy=metric-card-claims-by-source]').find('[data-cy=metric-value]').should('contain', '0 / 0');
      cy.get('[data-cy=metric-card-fastest-claim]').find('[data-cy=metric-value]').should('contain', 'N/A');
      cy.get('[data-cy=metric-card-slowest-claim]').find('[data-cy=metric-value]').should('contain', 'N/A');
    });

    // Charts should show the "no data" messages
    cy.get('[data-cy=time-series-chart]').should('exist')
      .contains('No raffle data available').should('be.visible');

    cy.get('[data-cy=claims-by-source-chart]').should('exist')
      .contains('No claim data available').should('be.visible');

    cy.get('[data-cy=time-to-claim-chart]').should('exist')
      .contains('No claim data available').should('be.visible');
  });

  it('should navigate to other admin sections from the sidebar', () => {
    // Check that we can navigate to Winners section
    cy.get('[data-cy=nav-Winners]').click();
    cy.url().should('include', '/admin');
    cy.get('[data-cy=winners-section]').should('exist');

    // Navigate back to Metrics
    cy.get('[data-cy=nav-Metrics]').click();
    cy.get('[data-cy=metrics-counters]').should('be.visible');

    // Navigate to Settings
    cy.get('[data-cy=nav-Settings]').click();
    cy.url().should('include', '/admin');
    cy.get('[data-cy=settings-section]').should('exist');

    // Navigate back to Metrics
    cy.get('[data-cy=nav-Metrics]').click();
    cy.get('[data-cy=metrics-counters]').should('be.visible');
  });
});