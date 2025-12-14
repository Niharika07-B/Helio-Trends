const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting GitHub Pages deployment...');

try {
  // Build the application
  console.log('📦 Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Create .nojekyll file
  console.log('📝 Creating .nojekyll file...');
  fs.writeFileSync(path.join(__dirname, 'out', '.nojekyll'), '');
  
  // Create CNAME file (optional)
  console.log('🌐 Creating CNAME file...');
  // fs.writeFileSync(path.join(__dirname, 'out', 'CNAME'), 'your-custom-domain.com');
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Files are ready in the "out" directory');
  console.log('🎯 Next steps:');
  console.log('   1. Go to GitHub repository Settings');
  console.log('   2. Enable GitHub Pages');
  console.log('   3. Select "Deploy from a branch"');
  console.log('   4. Choose "gh-pages" branch');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}