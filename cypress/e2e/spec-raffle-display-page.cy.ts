/// <reference types="cypress" />
/// <reference types="cypress-localstorage-commands" />

describe('Raffle Display Page', () => {
  beforeEach(() => {
    // Load the participants fixture
    cy.fixture('participants.json').as('participants');
    // Visit the raffle display page before each test
    cy.visit('/display');
  });


  it('should display the raffle display page header', () => {
    cy.contains('h1', 'Raffle Display').should('be.visible');
  });

  it('should redirect to the raffle display page from the home page', () => {
    cy.visit('/');
    cy.url().should('to.match', /\/display$/);
  });

  it('should add winners using the input field', function() {
    // Add a single winner
    cy.get('input').type(this.participants[0].name);
    cy.contains('button', 'Enter').click();
    
    // Verify the winner is displayed
    cy.contains(this.participants[0].name).should('be.visible');
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

  it('should display 7-12 winners with 3 per row', function() {
    // Add 9 winners
    for (let i = 0; i < 9; i++) {
      cy.get('input').type(this.participants[i].name);
      cy.contains('button', 'Enter').click();
      cy.get('.MuiGrid-item').should('have.length', i + 1);
    }
    
    // Check grid size - each item should take 1/3 width (xs=4)
    cy.get('.MuiGrid-item').should('have.attr', 'class').and('include', 'MuiGrid-grid-md-4');
  });

  it('should display 13+ winners with 4 per row', function() {
    // Add 15 winners
    for (let i = 0; i < 15; i++) {
      cy.get('input').type(this.participants[i].name);
      cy.contains('button', 'Enter').click();
      cy.get('.MuiGrid-item').should('have.length', i + 1);
    }
    
    // Check grid size - each item should take 1/4 width (xs=3)
    cy.get('.MuiGrid-item').should('have.attr', 'class').and('include', 'MuiGrid-grid-md-3');
  });
  
  it('should toggle between display and admin modes', function() {
    // Check initial state is display mode
    cy.get('input').should('exist');
    cy.contains('button', 'Enter').should('exist');
    
    // Find and click admin toggle button
    cy.get('[data-cy=admin-toggle]').should('exist').click();
    
    // Verify we're in admin mode
    cy.url().should('include', '/admin');
    
    // Since we don't know exactly what's on the admin page yet, 
    // we'll just verify we're not seeing display page elements
    cy.get('input').should('not.exist');
    cy.contains('button', 'Enter').should('not.exist');
    
    // Toggle back to display mode
    cy.get('[data-cy=display-toggle]').should('exist').click();
    
    // Verify we're back in display mode
    cy.url().should('include', '/display');
    cy.url().should('not.include', '/admin');
    
    // Verify display mode UI is present
    cy.get('input').should('exist');
    cy.contains('button', 'Enter').should('exist');
  });
});