const fs = require('fs');
const path = require('path');

// Routes that need their own HTML files
const routes = [
  'display',
  'admin'
];

// Path to the build directory
const buildDir = path.join(__dirname, 'dist');

// Read the built index.html file
const indexPath = path.join(buildDir, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

// Create directories and copy index.html for each route
routes.forEach(route => {
  const routeDir = path.join(buildDir, route);
  
  // Create the directory if it doesn't exist
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  
  // Create index.html in the route directory
  const routeIndexPath = path.join(routeDir, 'index.html');
  fs.writeFileSync(routeIndexPath, indexContent);
  
  console.log(`Created: ${routeIndexPath}`);
});

console.log('Route HTML files created successfully!');