#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Checks if the app is ready for Vercel deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Helio-Trends deployment readiness...\n');

// Check required files
const requiredFiles = [
  'package.json',
  'next.config.js',
  'tsconfig.json',
  'src/app/page.tsx',
  'src/app/layout.tsx',
  'src/app/api/solar-data/route.ts',
  'src/app/api/netflix-data/route.ts'
];

console.log('📁 Checking required files...');
let missingFiles = [];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    missingFiles.push(file);
  }
});

// Check package.json
console.log('\n📦 Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check required scripts
  const requiredScripts = ['build', 'start', 'dev'];
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ Script: ${script}`);
    } else {
      console.log(`❌ Script: ${script} - MISSING`);
    }
  });
  
  // Check key dependencies
  const keyDeps = ['next', 'react', 'react-dom'];
  keyDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ Dependency: ${dep} (${packageJson.dependencies[dep]})`);
    } else {
      console.log(`❌ Dependency: ${dep} - MISSING`);
    }
  });
  
} catch (error) {
  console.log(`❌ Error reading package.json: ${error.message}`);
}

// Check environment variables
console.log('\n🔐 Checking environment configuration...');
const envFiles = ['.env.example', '.env.local', '.env.production'];
envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
    try {
      const content = fs.readFileSync(file, 'utf8');
      const hasNasaKey = content.includes('NASA_API_KEY');
      const hasTmdbKey = content.includes('TMDB_API_KEY') || content.includes('TMDB_BEARER_TOKEN');
      
      console.log(`   ${hasNasaKey ? '✅' : '❌'} NASA API Key configured`);
      console.log(`   ${hasTmdbKey ? '✅' : '❌'} TMDB API Key configured`);
    } catch (error) {
      console.log(`   ❌ Error reading ${file}: ${error.message}`);
    }
  } else {
    console.log(`⚠️  ${file} not found`);
  }
});

// Check TypeScript configuration
console.log('\n🔧 Checking TypeScript configuration...');
try {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  
  if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths && tsconfig.compilerOptions.paths['@/*']) {
    console.log('✅ Path mapping configured');
  } else {
    console.log('❌ Path mapping not configured');
  }
  
  if (tsconfig.compilerOptions && tsconfig.compilerOptions.baseUrl) {
    console.log('✅ Base URL configured');
  } else {
    console.log('❌ Base URL not configured');
  }
  
} catch (error) {
  console.log(`❌ Error reading tsconfig.json: ${error.message}`);
}

// Check for Netlify files (should be removed)
console.log('\n🧹 Checking for conflicting files...');
const conflictingFiles = ['netlify.toml', '.netlify'];
conflictingFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`⚠️  ${file} found - should be removed for Vercel deployment`);
  } else {
    console.log(`✅ ${file} not found (good)`);
  }
});

// Check Vercel configuration
console.log('\n⚡ Checking Vercel configuration...');
if (fs.existsSync('vercel.json')) {
  console.log('✅ vercel.json exists');
  try {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    console.log(`   Framework: ${vercelConfig.framework || 'not specified'}`);
    console.log(`   Build command: ${vercelConfig.buildCommand || 'default'}`);
  } catch (error) {
    console.log(`   ❌ Error reading vercel.json: ${error.message}`);
  }
} else {
  console.log('⚠️  vercel.json not found (Vercel will use defaults)');
}

// Summary
console.log('\n📋 DEPLOYMENT READINESS SUMMARY');
console.log('================================');

if (missingFiles.length === 0) {
  console.log('✅ All required files present');
} else {
  console.log(`❌ Missing files: ${missingFiles.join(', ')}`);
}

console.log('\n🚀 NEXT STEPS FOR VERCEL DEPLOYMENT:');
console.log('1. Commit and push all changes to GitHub');
console.log('2. Go to https://vercel.com/dashboard');
console.log('3. Click "Add New" → "Project"');
console.log('4. Import your GitHub repository');
console.log('5. Add environment variables from .env.example');
console.log('6. Deploy!');

console.log('\n💡 ENVIRONMENT VARIABLES TO ADD IN VERCEL:');
console.log('NASA_API_KEY, NEXT_PUBLIC_NASA_API_KEY');
console.log('TMDB_API_KEY, TMDB_BEARER_TOKEN, NEXT_PUBLIC_TMDB_API_KEY');
console.log('NODE_ENV=production, NEXT_PUBLIC_APP_ENV=production');

console.log('\n✨ Verification complete!');