#!/usr/bin/env node

/**
 * Test script to verify API connectivity and authentication
 * Run with: node scripts/test-api-connectivity.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let envVars = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      envVars[key] = value;
    }
  });
}

console.log('🔍 Testing Cazza.ai Frontend API Connectivity\n');

// Check required environment variables
const requiredVars = [
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_API_VERSION',
  'NEXT_PUBLIC_AUTH_URL',
];

console.log('📋 Environment Variables Check:');
let allVarsPresent = true;
requiredVars.forEach(varName => {
  if (envVars[varName]) {
    console.log(`  ✅ ${varName}=${envVars[varName]}`);
  } else {
    console.log(`  ❌ ${varName} is not set`);
    allVarsPresent = false;
  }
});

if (!allVarsPresent) {
  console.log('\n⚠️  Missing required environment variables. Please check your .env.local file.');
  process.exit(1);
}

console.log('\n🔌 Testing API Endpoints:');

// Test API endpoints
const endpoints = [
  {
    name: 'Health Check',
    url: `${envVars.NEXT_PUBLIC_API_URL}/health`,
    method: 'GET',
  },
  {
    name: 'Auth Status',
    url: `${envVars.NEXT_PUBLIC_API_URL}/${envVars.NEXT_PUBLIC_API_VERSION}/auth/status`,
    method: 'GET',
  },
];

async function testEndpoint(endpoint) {
  try {
    console.log(`\n  Testing ${endpoint.name}...`);
    console.log(`    URL: ${endpoint.url}`);
    
    const response = await fetch(endpoint.url, {
      method: endpoint.method,
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log(`    Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      console.log(`    ✅ Success: ${JSON.stringify(data).slice(0, 100)}...`);
      return true;
    } else {
      console.log(`    ⚠️  Warning: Endpoint returned ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`    ❌ Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  let allTestsPassed = true;
  
  for (const endpoint of endpoints) {
    const passed = await testEndpoint(endpoint);
    if (!passed) {
      allTestsPassed = false;
    }
  }

  // Test mock API mode
  console.log('\n🎭 Mock API Mode:');
  if (envVars.NEXT_PUBLIC_USE_MOCK_API === 'true') {
    console.log('  ✅ Mock API is enabled (NEXT_PUBLIC_USE_MOCK_API=true)');
    console.log('  ℹ️  The frontend will use mock data instead of real API calls');
  } else {
    console.log('  ✅ Real API mode is enabled');
    console.log('  ℹ️  The frontend will make real API calls to the backend');
  }

  // Check if backend is likely running
  console.log('\n🔍 Backend Detection:');
  try {
    // Try to ping the backend
    const backendUrl = new URL(envVars.NEXT_PUBLIC_API_URL);
    console.log(`  Backend URL: ${backendUrl.origin}`);
    
    // Simple fetch to check if backend is reachable
    const healthResponse = await fetch(`${backendUrl.origin}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    }).catch(() => null);

    if (healthResponse && healthResponse.ok) {
      console.log('  ✅ Backend appears to be running');
    } else {
      console.log('  ⚠️  Backend may not be running or is unreachable');
      console.log('  ℹ️  If using mock API mode, this is expected');
    }
  } catch (error) {
    console.log(`  ❌ Error checking backend: ${error.message}`);
  }

  // Check frontend dependencies
  console.log('\n📦 Frontend Dependencies Check:');
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
    );

    const requiredDeps = [
      '@tanstack/react-query',
      'zustand',
      'axios', // or fetch API
    ];

    const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
    
    if (missingDeps.length === 0) {
      console.log('  ✅ All required dependencies are installed');
    } else {
      console.log('  ❌ Missing dependencies:', missingDeps.join(', '));
      console.log('  ℹ️  Run: npm install', missingDeps.join(' '));
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(`  ❌ Error checking dependencies: ${error.message}`);
    allTestsPassed = false;
  }

  // Summary
  console.log('\n📊 Test Summary:');
  if (allTestsPassed) {
    console.log('✅ All tests passed! The frontend is ready to connect to the backend.');
    console.log('\n🚀 Next steps:');
    console.log('   1. Start the backend server (if not already running)');
    console.log('   2. Run: npm run dev');
    console.log('   3. Visit http://localhost:3000');
    console.log('   4. Try logging in with demo credentials');
  } else {
    console.log('⚠️  Some tests failed. Please check the issues above.');
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   - Make sure the backend server is running');
    console.log('   - Check that environment variables are correct');
    console.log('   - Verify network connectivity');
    console.log('   - Check browser console for errors');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test runner error:', error);
  process.exit(1);
});