/// <reference types="cypress" />
/// <reference types="cypress-localstorage-commands" />

describe('Raffle Display Page', () => {
  beforeEach(function() {
    // Load test data
    cy.fixture('participants.json').as('participants');
    cy.visit('/');
  });

  it('should load the raffle display page', () => {
    cy.contains('General Raffle Winners');
    cy.get('input').should('exist');
    cy.contains('button', 'Enter').should('exist');
  });

  it('should add a winner when name is entered', function() {
    cy.get('input').type(this.participants[0].name);
    cy.contains('button', 'Enter').click();
    cy.get('.MuiGrid-item').should('have.length', 1);
    cy.contains(this.participants[0].name);
  });

  it('should show winner as claimed when card is clicked', function() {
    // Add a winner
    cy.get('input').type(this.participants[0].name);
    cy.contains('button', 'Enter').click();
    
    // Click the card
    cy.get('.MuiGrid-item').first().click();
    
    // Card should be removed from winners grid
    cy.get('.MuiGrid-item').should('have.length', 0);
  });

  it('should display 1-3 winners with 1 per row', function() {
    // Add 3 winners
    for (let i = 0; i < 3; i++) {
      cy.get('input').type(this.participants[i].name);
      cy.contains('button', 'Enter').click();
      cy.get('.MuiGrid-item').should('have.length', i + 1);
    }
    
    // Check grid size - each item should take full width (xs=12)
    cy.get('.MuiGrid-item').should('have.attr', 'class').and('include', 'MuiGrid-grid-md-12');
  });

  it('should display 4-6 winners with 2 per row', function() {
    // Add 6 winners
    for (let i = 0; i < 6; i++) {
      cy.get('input').type(this.participants[i].name);
      cy.contains('button', 'Enter').click();
      cy.get('.MuiGrid-item').should('have.length', i + 1);
    }
    
    // Check grid size - each item should take half width (xs=6)
    cy.get('.MuiGrid-item').should('have.attr', 'class').and('include', 'MuiGrid-grid-md-6');
  });

  it('should display 7+ winners with 3 per row', function() {
    // Add 9 winners
    for (let i = 0; i < 9; i++) {
      cy.get('input').type(this.participants[i].name);
      cy.contains('button', 'Enter').click();
      cy.get('.MuiGrid-item').should('have.length', i + 1);
    }
    
    // Check grid size - each item should take 1/3 width (xs=4)
    cy.get('.MuiGrid-item').should('have.attr', 'class').and('include', 'MuiGrid-grid-md-4');
  });

  it('should maintain 3 per row even with 15+ winners', function() {
    // Add 15 winners
    for (let i = 0; i < 15; i++) {
      cy.get('input').type(this.participants[i].name);
      cy.contains('button', 'Enter').click();
      cy.get('.MuiGrid-item').should('have.length', i + 1);
    }
    
    // Check grid size - each item should still take 1/3 width (md=4), never 1/4 width
    cy.get('.MuiGrid-item').should('have.attr', 'class').and('include', 'MuiGrid-grid-md-4');
  });
  
  it('should toggle between display and admin modes', function() {
    // Check initial state is display mode
    cy.get('input').should('exist');
    cy.contains('button', 'Enter').should('exist');
    
    // Find and click admin toggle button
    cy.get('[data-cy=admin-toggle]').should('exist').click();
    
    // Verify we're in admin mode
    cy.url().should('include', '/admin');
    cy.contains('Raffle Admin');
    
    // Go back to display mode
    cy.get('[data-cy=display-toggle]').should('exist').click();
    cy.url().should('not.include', '/admin');
  });
});