/// <reference types="cypress" />
/// <reference types="cypress-localstorage-commands" />

describe('Raffle Admin Page', () => {
    beforeEach(() => {
        // Load the raffle winners fixture
        cy.fixture('winners').then((winners) => {
            cy.setLocalStorage('raffleWinners', JSON.stringify(winners));
        });
            
        cy.visit('/admin');
    });
    
    it('should show the admin page header', () => {
        cy.contains('h1', 'Raffle Management').should('be.visible');
    });
    
    it('should display the winners table with correct columns', () => {
        cy.contains('Winners List').should('be.visible');
        
        // Check table headers
        cy.get('table th').eq(1).should('contain', 'Winner ID');
        cy.get('table th').eq(2).should('contain', 'Name');
        cy.get('table th').eq(3).should('contain', 'Prizes Count');
        cy.get('table th').eq(4).should('contain', 'Status');
        cy.get('table th').eq(5).should('contain', 'Actions');
        
        // Check that we have rows in the table
        cy.get('table tbody tr').should('have.length.at.least', 1);
    });
    
    it('should expand/collapse winner details when clicked', () => {
        // Initially, the collapse section should not be visible
        cy.contains('Prizes').should('not.exist');
        
        // Click the expand button on the first row
        cy.get('table tbody tr').first().find('button').first().click();
        
        // Check that the prizes section is visible
        cy.contains('Prizes').should('be.visible');
        cy.get('table tbody table').should('exist');
        
        // Click again to collapse
        cy.get('table tbody tr').first().find('button').first().click();
        
        // Check that the prizes section is hidden
        cy.get('.MuiCollapse-root').should('not.exist');
    });
    
    it('should show prize details in the expanded section', () => {
        // Expand the first winner
        cy.get('table tbody tr').first().find('button').first().click();
        
        // Check that prize table headers are correct
        cy.get('table tbody table th').eq(0).should('contain', 'Prize ID');
        cy.get('table tbody table th').eq(1).should('contain', 'Date Won');
        cy.get('table tbody table th').eq(2).should('contain', 'Status');
        cy.get('table tbody table th').eq(3).should('contain', 'Actions');
        
        // Check for at least one prize row
        cy.get('table tbody table tbody tr').should('have.length.at.least', 1);
    });
    
    it('should show claims section if claims exist', () => {
        // Find a winner with claims and expand
        cy.fixture('winners').then((winners) => {
            const winnerWithClaims = winners.find(w => w.claims && w.claims.length > 0);
            if (winnerWithClaims) {
                cy.contains(winnerWithClaims.id).parent('tr').find('button').first().click();
                cy.contains('Claims').should('be.visible');
                cy.contains(`Claim #${winnerWithClaims.claims[0].id}`).should('be.visible');
            } else {
                this.skip(); // Skip if no winners with claims in fixture
            }
        });
    });
    
    it('should mark individual prizes as claimed', () => {
        // Find a winner with unclaimed prizes
        cy.fixture('winners').then((winners) => {
            const findWinnerWithUnclaimedPrize = () => {
                for (const winner of winners) {
                    for (const prize of winner.prizes) {
                        const isClaimed = winner.claims.some(claim => 
                            claim.prizeIds.includes(prize.id)
                        );
                        if (!isClaimed) {
                            return { winner, prize };
                        }
                    }
                }
                return null;
            };
            
            const result = findWinnerWithUnclaimedPrize();
            if (result) {
                // Expand the winner row
                cy.contains(result.winner.id).parent('tr').find('button').first().click();
                
                // Find the unclaimed prize row and click "Mark Claimed"
                cy.contains(result.prize.id)
                    .parent('tr')
                    .find('button')
                    .contains('Mark Claimed')
                    .click();
                
                // Verify the prize now shows as claimed (chip should change to success)
                cy.contains(result.prize.id)
                    .parent('tr')
                    .find('div.MuiChip-colorSuccess')
                    .should('contain', 'Claimed');
            } else {
                this.skip(); // Skip if no unclaimed prizes in fixture
            }
        });
    });
    
    it('should mark all prizes as claimed for a winner', () => {
        // Find a winner with unclaimed prizes
        cy.fixture('winners').then((winners) => {
            const winnerWithUnclaimedPrizes = winners.find(w => {
                const claimedPrizeIds = w.claims.flatMap(c => c.prizeIds);
                return w.prizes.some(p => !claimedPrizeIds.includes(p.id));
            });
            
            if (winnerWithUnclaimedPrizes) {
                // Find row and click "Mark All Claimed" button
                cy.contains(winnerWithUnclaimedPrizes.id)
                    .parent('tr')
                    .find('button')
                    .contains('Mark All Claimed')
                    .click();
                
                // Verify status chip has changed
                cy.contains(winnerWithUnclaimedPrizes.id)
                    .parent('tr')
                    .find('div.MuiChip-colorSuccess')
                    .should('contain', 'All Claimed');
                
                // Expand to check that all prizes are now claimed
                cy.contains(winnerWithUnclaimedPrizes.id)
                    .parent('tr')
                    .find('button').first().click();
                
                // All prizes should show as claimed
                cy.get('table tbody table tbody tr').each(($row) => {
                    cy.wrap($row).find('div.MuiChip-colorSuccess')
                        .should('contain', 'Claimed');
                });
            } else {
                this.skip(); // Skip if no winners with unclaimed prizes
            }
        });
    });
    
    it('should open reset dialog when reset button is clicked', () => {
        // Reset dialog should not be visible initially
        cy.contains('Reset Raffle Data?').should('not.exist');
        
        // Click the Reset Raffle button
        cy.contains('button', 'Reset Raffle').click();
        
        // Dialog should appear
        cy.contains('Reset Raffle Data?').should('be.visible');
        cy.contains('This action will permanently delete all winners and their prizes').should('be.visible');
        
        // Cancel button should close dialog
        cy.contains('button', 'Cancel').click();
        cy.contains('Reset Raffle Data?').should('not.exist');
    });
    
    it('should clear all winners when reset is confirmed', () => {
        // First check we have winners
        cy.get('table tbody tr').should('have.length.at.least', 1);
        
        // Click the Reset Raffle button
        cy.contains('button', 'Reset Raffle').click();
        
        // Confirm the reset
        cy.get('[data-testid=confirm-reset-button]').click();
        
        // Table should now show no winners
        cy.contains('No winners recorded yet').should('be.visible');
        
        // LocalStorage should be cleared
        cy.getLocalStorage('raffleWinners').then(winners => {
            if (!winners) {
                expect.fail('raffleWinners key not found in localStorage');
            }

            const parsed = JSON.parse(winners);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(parsed).to.be.empty;
        });
    });
    
    it('should navigate between admin and display pages', () => {
        // Check we're on the admin page
        cy.url().should('include', '/admin');
        
        // Find and click the display toggle button
        cy.get('[data-cy=display-toggle]').should('exist').click();
        
        // Verify we navigated to display page
        cy.url().should('include', '/display');
        cy.url().should('not.include', '/admin');
        
        // Go back to admin
        cy.get('[data-cy=admin-toggle]').should('exist').click();
        
        // Verify we're back on the admin page
        cy.url().should('include', '/admin');
    });
});