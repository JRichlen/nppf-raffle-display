// Generate sample data for the raffle display app
// This script generates 135 unique winners with at least 240 claims

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configuration
const NUM_WINNERS = 135;
const MIN_CLAIMS = 240;
const BASE_DATE = new Date('2023-08-30T19:30:00.000Z'); // 7:30 PM
const END_DATE = new Date('2023-08-30T21:30:00.000Z');  // 9:30 PM

// Sample data storage
const winners = [];
let totalPrizes = 0;
let totalClaims = 0;

// Name generation - first names and last names for variety
const firstNames = [
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
  'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua',
  'Nancy', 'Lisa', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle',
  'Kenneth', 'Kevin', 'Brian', 'George', 'Edward', 'Ronald', 'Timothy', 'Jason', 'Jeffrey', 'Ryan',
  'Carol', 'Amanda', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Laura', 'Sharon', 'Cynthia', 'Kathleen'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
  'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson',
  'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King',
  'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter',
  'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins'
];

// Helper function to generate a random date between start and end date
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to generate a random name
function generateName() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

// Generate winners
for (let i = 0; i < NUM_WINNERS; i++) {
  const id = uuidv4();
  const name = generateName();
  
  // Determine number of prizes for this winner (1-3)
  const numPrizes = Math.floor(Math.random() * 3) + 1;
  
  const prizes = [];
  for (let j = 0; j < numPrizes; j++) {
    prizes.push({
      id: uuidv4(),
      timestamp: randomDate(BASE_DATE, END_DATE).toISOString()
    });
  }
  
  // Sort prizes by timestamp
  prizes.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  // Determine number of claims (0 to numPrizes)
  const numClaims = Math.floor(Math.random() * (numPrizes + 1));
  
  const claims = [];
  for (let j = 0; j < numClaims; j++) {
    // Get the prize to claim
    const prizeIndex = j % numPrizes;
    const prize = prizes[prizeIndex];
    
    // Generate a claim timestamp after the prize timestamp
    const prizeDate = new Date(prize.timestamp);
    const claimDate = new Date(prizeDate.getTime() + Math.random() * (END_DATE.getTime() - prizeDate.getTime()));
    
    claims.push({
      id: uuidv4(),
      timestamp: claimDate.toISOString(),
      prizeIds: [prize.id],
      source: Math.random() > 0.5 ? 'DISPLAY' : 'ADMIN'
    });
  }
  
  // Sort claims by timestamp
  claims.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  winners.push({
    id,
    name,
    prizes,
    claims
  });
  
  totalPrizes += numPrizes;
  totalClaims += numClaims;
}

// Ensure we have enough claims
if (totalClaims < MIN_CLAIMS) {
  console.log(`Need to add ${MIN_CLAIMS - totalClaims} more claims to reach minimum`);
  
  // Add more claims to winners who have unclaimed prizes
  let remaining = MIN_CLAIMS - totalClaims;
  let winnerIndex = 0;
  
  while (remaining > 0 && winnerIndex < winners.length) {
    const winner = winners[winnerIndex];
    
    // Get IDs of all claimed prizes
    const claimedPrizeIds = new Set();
    winner.claims.forEach(claim => {
      claim.prizeIds.forEach(id => claimedPrizeIds.add(id));
    });
    
    // Find unclaimed prizes
    const unclaimedPrizes = winner.prizes.filter(prize => !claimedPrizeIds.has(prize.id));
    
    if (unclaimedPrizes.length > 0) {
      // Add a claim for an unclaimed prize
      const prize = unclaimedPrizes[0];
      const prizeDate = new Date(prize.timestamp);
      const claimDate = new Date(prizeDate.getTime() + Math.random() * (END_DATE.getTime() - prizeDate.getTime()));
      
      winner.claims.push({
        id: uuidv4(),
        timestamp: claimDate.toISOString(),
        prizeIds: [prize.id],
        source: Math.random() > 0.5 ? 'DISPLAY' : 'ADMIN'
      });
      
      // Sort claims again by timestamp
      winner.claims.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
      remaining--;
      totalClaims++;
    }
    
    winnerIndex = (winnerIndex + 1) % winners.length;
  }
}

// Statistics
console.log(`Generated ${winners.length} winners`);
console.log(`Total prizes: ${totalPrizes}`);
console.log(`Total claims: ${totalClaims}`);

// Write data to file
fs.writeFileSync(
  path.join(__dirname, 'src', 'data', 'sampleData.json'),
  JSON.stringify(winners, null, 2)
);

console.log('Sample data written to src/data/sampleData.json');