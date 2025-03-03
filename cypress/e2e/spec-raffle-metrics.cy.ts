/// <reference types="cypress" />
/// <reference types="cypress-localstorage-commands" />

describe.only('Raffle Metrics Dashboard', () => {
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
    // Check that all metric cards are present and visible
    cy.get('[data-cy=metric-card-total-prizes]').should('be.visible');
    cy.get('[data-cy=metric-card-total-claims]').should('be.visible');
    cy.get('[data-cy=metric-card-unclaimed-prizes]').should('be.visible');
    cy.get('[data-cy=metric-card-unique-winners]').should('be.visible');

    // Verify that each card has a numeric value
    cy.get('[data-cy=metric-value]').each(($value) => {
      cy.wrap($value).invoke('text').should('match', /^[0-9]+$/);
    });
  });

  it('should calculate metrics correctly based on raffle data', () => {
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

  it('should display time series chart', () => {
    // Chart container should be visible
    cy.get('[data-cy=chart-container]').should('be.visible');
    cy.get('[data-cy=chart-container] svg').should('be.visible');
    
    // Chart should have axes
    cy.get('[data-cy=chart-container] .MuiChartsAxis-bottom').should('exist');
    cy.get('[data-cy=chart-container] .MuiChartsAxis-left').should('exist');
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

    // All counters should show zero
    cy.get('[data-cy=metrics-counters]').within(() => {
      cy.get('[data-cy=metric-value]').each(($value) => {
        cy.wrap($value).should('contain', '0');
      });
    });

    // Chart should still render but show no data
    cy.get('[data-cy=chart-container]').should('be.visible').should('contain', 'No raffle data available');
    cy.get('[data-cy=chart-container] svg').should('not.exist');
  });
});