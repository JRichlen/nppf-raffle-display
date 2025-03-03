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
    
    it('should have a sidebar with navigation options', () => {
        // Check sidebar is visible
        cy.contains('Raffle Admin').should('be.visible');
        
        // Check all navigation items exist
        cy.contains('Winners').should('be.visible');
        cy.contains('Metrics').should('be.visible');
        cy.contains('Settings').should('be.visible');
    });
    
    it('should navigate between sections when clicking sidebar items', () => {
        // Should start with Winners section visible
        cy.contains('Raffle Winners').should('be.visible');
        
        // Navigate to Metrics section
        cy.contains('Metrics').click();
        cy.contains('Raffle Metrics Dashboard').should('be.visible');
        cy.contains('Raffle Winners').should('not.exist');
        
        // Navigate to Settings section
        cy.contains('Settings').click();
        cy.contains('Raffle Settings').should('be.visible');
        cy.contains('Raffle Metrics Dashboard').should('not.exist');
        
        // Go back to Winners section
        cy.contains('Winners').click();
        cy.contains('Raffle Winners').should('be.visible');
        cy.contains('Raffle Settings').should('not.exist');
    });
    
    it('should display the metrics dashboard section', () => {
        cy.contains('Metrics').click();
        cy.contains('Raffle Metrics Dashboard').should('be.visible');
    });
    
    it('should display the settings section', () => {
        cy.contains('Settings').click();
        cy.contains('Raffle Settings').should('be.visible');
        cy.contains('Preferences').should('be.visible');
        cy.contains('Advanced').should('be.visible');
    });
    
    it('should highlight the active navigation item in the sidebar', () => {
        // Winners should be selected by default
        cy.contains('[data-cy=nav-Winners]', 'Winners').should('have.class', 'Mui-selected');
        
        // Click on Metrics and verify it becomes selected
        cy.contains('Metrics').click();
        cy.contains('[data-cy=nav-Metrics]', 'Metrics').should('have.class', 'Mui-selected');
        cy.contains('[data-cy=nav-Winners]', 'Winners').should('not.have.class', 'Mui-selected');
        
        // Click on Settings and verify it becomes selected
        cy.contains('Settings').click();
        cy.contains('[data-cy=nav-Settings]', 'Settings').should('have.class', 'Mui-selected');
        cy.contains('[data-cy=nav-Winners]', 'Winners').should('not.have.class', 'Mui-selected');
    });
    
    it('should display the winners table with correct columns', () => {
        // Make sure we're on the Winners section
        cy.contains('Winners').click();
        
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

    it('should filter winners by search term', () => {
        // Get count of initial winners
        cy.get('table tbody tr').then(($rows) => {
            const initialCount = $rows.length;
            
            // Type a search term that should match at least one winner
            cy.get('[data-cy=search-input] input').type('John');
            
            // Check that we have fewer rows than before
            cy.get('table tbody tr').should(($newRows) => {
                expect($newRows.length).to.be.lessThan(initialCount);
                expect($newRows.length).to.be.greaterThan(0);
            });

            cy.wait(300);
            
            // Check that all visible rows contain the search term
            cy.get('[data-cy=winner-name]').each(($cell) => {
                cy.wrap($cell).should('contain.text', 'John');
            });
            
            // Clear the search field
            cy.get('[data-cy=search-input] input').clear();
            
            // Check that we have the original number of rows again
            cy.get('table tbody tr').should('have.length', initialCount);
        });
    });
    
    it('should show "No matching winners found" when search has no results', () => {
        // Type a search term that definitely won't match
        cy.get('[data-cy=search-input] input').type('XYZ123NonExistentName');
        
        // Should show no matching winners message
        cy.contains('No matching winners found').should('be.visible');
        
        // Clear the search field
        cy.get('[data-cy=search-input] input').clear();
        
        // Message should disappear and winners should be visible again
        cy.contains('No matching winners found').should('not.exist');
        cy.get('table tbody tr').should('have.length.at.least', 1);
    });
    
    it('should filter winners by claiming status', () => {
        // Initial state should show all winners
        cy.get('[data-cy=primary-row]').then(($allRows) => {
            const allRowsCount = $allRows.length;
            
            // Select "All Claimed" filter
            cy.get('[data-cy=status-filter]').click();
            cy.get('li').contains('All Claimed').click();
            
            // Verify each visible row shows "All Claimed" chip
            cy.get('[data-cy=primary-row]').then(($claimedRows) => {
                const claimedCount = $claimedRows.length;
                for (let i = 0; i < $claimedRows.length; i++) {
                    const $row = $claimedRows[i];
                    cy.wrap($row).find('div.MuiChip-colorSuccess').should('contain', 'All Claimed');
                }

                // Select "Has Unclaimed" filter
                cy.get('[data-cy=status-filter]').click();
                cy.get('li').contains('Has Unclaimed').click();
                
                // Verify each visible row shows "Has Unclaimed" chip
                cy.get('[data-cy=primary-row]').then(($unclaimedRows) => {
                    const unclaimedCount = $unclaimedRows.length;
                    for (let i = 0; i < $unclaimedRows.length; i++) {
                        const $row = $unclaimedRows[i];
                        cy.wrap($row).find('div.MuiChip-colorWarning').should('contain', 'Unclaimed');
                    }

                     // The sum of claimed and unclaimed should equal all rows
                    expect(claimedCount + unclaimedCount).to.equal(allRowsCount);
                });
            });
                  
            // Return to "All" filter
            cy.get('[data-cy=status-filter]').click();
            cy.get('li').contains('All').click();
            
            // Should have the same count as initially
            cy.get('[data-cy=primary-row]').should('have.length', allRowsCount);
        });
    });
    
    it('should sort the winners table', () => {
        // Test sorting by name ascending
        cy.contains('th', 'Name').click();
        
        // Get all names in ascending order
        cy.get('table tbody tr td:nth-child(3)').then($cells => {
            const namesAsc = Array.from($cells).map(cell => cell.textContent);
            
            // Click again to sort descending
            cy.contains('th', 'Name').click();
            
            // Get all names in descending order
            cy.get('table tbody tr td:nth-child(3)').then($cellsDesc => {
                const namesDesc = Array.from($cellsDesc).map(cell => cell.textContent);
                
                // Descending should be reverse of ascending
                expect(namesDesc).to.deep.equal([...namesAsc].reverse());
            });
        });
        
        // Test sorting by prize count
        cy.contains('th', 'Prizes Count').click();
        
        // Get all prize counts in ascending order
        cy.get('table tbody tr td:nth-child(4)').then($cells => {
            const countsAsc = Array.from($cells).map(cell => parseInt(cell.textContent || '0', 10));
            
            // Verify ascending order
            for (let i = 0; i < countsAsc.length - 1; i++) {
                expect(countsAsc[i]).to.be.at.most(countsAsc[i + 1]);
            }
            
            // Click again to sort descending
            cy.contains('th', 'Prizes Count').click();
            
            // Get all prize counts in descending order
            cy.get('table tbody tr td:nth-child(4)').then($cellsDesc => {
                const countsDesc = Array.from($cellsDesc).map(cell => parseInt(cell.textContent || '0', 10));
                
                // Verify descending order
                for (let i = 0; i < countsDesc.length - 1; i++) {
                    expect(countsDesc[i]).to.be.at.least(countsDesc[i + 1]);
                }
            });
        });
    });
    
    it('should combine search and filter functionality', () => {
        // Type a search term
        cy.get('[data-cy=search-input] input').type('John');
        
        // Apply a status filter
        cy.get('[data-cy=status-filter]').click();
        cy.contains('Has Unclaimed').click();
        
        // Check that the results are filtered by both criteria
        cy.get('[data-cy=primary-row]').each(($row) => {
            cy.wrap($row).should('contain.text', 'John');
            cy.wrap($row).find('div.MuiChip-colorWarning').should('contain', 'Unclaimed');
        });
        
        // Clear the filters
        cy.get('[data-cy=search-input] input').clear();
        cy.get('[data-cy=status-filter]').click();
        cy.get('li').contains('All').click();
    });
});