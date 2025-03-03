describe('Admin Settings Page', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.contains('Settings').click();
  });

  it('should display the settings sections', () => {
    cy.contains('Raffle Settings').should('be.visible');
    cy.contains('Preferences').should('be.visible');
    cy.contains('Advanced').should('be.visible');
  });

  it('should display and change winner card color preference', () => {
    cy.get('[data-testid="card-color-select"]').should('be.visible');
    cy.get('[data-testid="card-color-select"]').click();
    cy.contains('Sunset Orange').click();
    cy.get('[data-testid="card-color-select"]').should('contain.text', 'Sunset Orange');
  });

  it('should display load data and reset buttons in advanced section', () => {
    cy.contains('Advanced').should('be.visible');
    cy.get('[data-testid="load-data-button"]').should('be.visible');
    cy.contains('Reset Raffle').should('be.visible');
  });

  it('should show reset confirmation dialog when clicking reset button', () => {
    cy.contains('Reset Raffle').click();
    cy.contains('Reset Raffle Data?').should('be.visible');
    cy.contains('This action will permanently delete all winners and their prizes').should('be.visible');
    cy.contains('button', 'Cancel').should('be.visible');
    cy.contains('button', 'Reset').should('be.visible');
  });

  it('should cancel reset when clicking cancel', () => {
    cy.contains('Reset Raffle').click();
    cy.contains('button', 'Cancel').click();
    cy.contains('Reset Raffle Data?').should('not.exist');
  });

  it('should reset raffle data when confirming reset', () => {
    // First ensure we have some winners
    cy.fixture('winners').then(winners => {
      cy.window().then(win => {
        win.localStorage.setItem('winners', JSON.stringify(winners));
      });
      cy.reload();
      cy.contains('Settings').click();
    });

    // Perform reset
    cy.contains('Reset Raffle').click();
    cy.get('[data-testid="confirm-reset-button"]').click();

    // Verify winners are cleared
    cy.contains('Winners').click();
    cy.contains('No winners recorded yet').should('be.visible');
  });

  describe('Theme Settings', () => {
    beforeEach(() => {
      // Clear any existing theme
      cy.window().then(win => {
        win.localStorage.removeItem('raffleWinnerCardTheme');
      });
      cy.reload();
      cy.contains('Settings').click();
    });

    it('should start with default white theme', () => {
      cy.get('[data-testid="card-color-select"]').should('contain.text', 'Default White');
      
      // Visit display page and verify default white color
      cy.visit('/display');
      cy.get('input').type('Test Winner');
      cy.contains('button', 'Enter').click();
      cy.get('.MuiCard-root').first().should('have.css', 'background-color', 'rgb(255, 255, 255)');
    });

    it('should persist theme selection to localStorage', () => {
      // Select Sunset Orange theme
      cy.get('[data-testid="card-color-select"]').should('be.visible');
      cy.get('[data-testid="card-color-select"]').click();
      cy.contains('Sunset Orange').click();

      // Verify localStorage was updated
      cy.window().then(win => {
        const storedTheme = JSON.parse(win.localStorage.getItem('raffleWinnerCardTheme') || '{}');
        expect(storedTheme.value).to.equal('sunset');
        expect(storedTheme.color).to.equal('#ed6c02');
      });

      // Reload page and verify theme persists
      cy.reload();
      cy.contains('Settings').click();
      cy.get('[data-testid="card-color-select"]').contains('Sunset Orange').should('be.visible');
    });

    it('should show color preview in dropdown', () => {
      cy.get('[data-testid="card-color-select"]').click();
      
      // Verify each option has a color preview box
      cy.contains('li', 'Default White').find('div').should('have.css', 'background-color', 'rgb(255, 255, 255)');
      cy.contains('li', 'Sunset Orange').find('div').should('have.css', 'background-color', 'rgb(237, 108, 2)');
    });

    it('should apply theme color to winner cards', () => {
      // Load some winners
      cy.fixture('winners').then(winners => {
        cy.window().then(win => {
          win.localStorage.setItem('winners', JSON.stringify(winners));
        });
      });

      // Select Sunset Orange theme
      cy.get('[data-testid="card-color-select"]').click();
      cy.contains('Sunset Orange').click();

      // Go to display page and verify card color
      cy.visit('/display');
      cy.get('input').type('Test Winner');
      cy.contains('button', 'Enter').click();
      cy.get('.MuiCard-root').first().should('have.css', 'background-color', 'rgb(237, 108, 2)');
    });
  });
});