#!/usr/bin/env node

/**
 * Storage Migration Script
 * 
 * This script helps migrate from insecure localStorage usage to secure storage.
 * It finds all localStorage usage in the codebase and suggests replacements.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SOURCE_DIR = path.join(__dirname, '..');
const IGNORE_DIRS = ['node_modules', '.next', '.git', 'dist', 'build'];
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// Patterns to search for
const PATTERNS = {
  localStorage: {
    setItem: /localStorage\.setItem\(['"]([^'"]+)['"](?:,\s*([^)]+))?\)/g,
    getItem: /localStorage\.getItem\(['"]([^'"]+)['"]\)/g,
    removeItem: /localStorage\.removeItem\(['"]([^'"]+)['"]\)/g,
    clear: /localStorage\.clear\(\)/g,
  },
  sessionStorage: {
    setItem: /sessionStorage\.setItem\(['"]([^'"]+)['"](?:,\s*([^)]+))?\)/g,
    getItem: /sessionStorage\.getItem\(['"]([^'"]+)['"]\)/g,
    removeItem: /sessionStorage\.removeItem\(['"]([^'"]+)['"]\)/g,
    clear: /sessionStorage\.clear\(\)/g,
  },
};

// Secure storage replacements
const REPLACEMENTS = {
  // Authentication tokens (should use HttpOnly cookies)
  auth: {
    keys: ['auth_token', 'token', 'access_token', 'refresh_token', 'user_profile', 'id_token'],
    suggestion: 'Use HttpOnly cookies via secureAuthService',
    import: "import { secureAuthService } from '@/lib/security/auth';",
    replacement: '// Tokens are now managed via HttpOnly cookies',
  },
  
  // User preferences (use secure storage)
  preferences: {
    keys: ['user_prefs', 'preferences', 'settings', 'theme', 'language', 'has_seen_'],
    suggestion: 'Use userPreferencesStorage',
    import: "import { userPreferencesStorage } from '@/lib/security/storage';",
    replacement: 'userPreferencesStorage',
  },
  
  // Session data (use session storage)
  session: {
    keys: ['session_', 'temp_', 'wizard_state', 'tour_', 'demo_'],
    suggestion: 'Use sessionStorage or tempStorage',
    import: "import { sessionStorage, tempStorage } from '@/lib/security/storage';",
    replacement: 'sessionStorage',
  },
  
  // Sensitive data (use encrypted storage)
  sensitive: {
    keys: ['api_key', 'secret', 'password', 'credit_card', 'ssn', 'private_'],
    suggestion: 'Use secureStorage with encryption',
    import: "import { secureStorage } from '@/lib/security/storage';",
    replacement: 'secureStorage',
  },
};

/**
 * Find all files with localStorage usage
 */
function findFilesWithLocalStorage() {
  const files = [];
  
  function walk(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      if (IGNORE_DIRS.includes(item)) continue;
      
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (FILE_EXTENSIONS.some(ext => item.endsWith(ext))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('localStorage') || content.includes('sessionStorage')) {
          files.push({
            path: fullPath,
            relativePath: path.relative(SOURCE_DIR, fullPath),
            content,
          });
        }
      }
    }
  }
  
  walk(SOURCE_DIR);
  return files;
}

/**
 * Analyze file for storage usage
 */
function analyzeFile(file) {
  const findings = [];
  
  // Check for localStorage usage
  for (const [method, pattern] of Object.entries(PATTERNS.localStorage)) {
    const matches = [...file.content.matchAll(pattern)];
    for (const match of matches) {
      const key = match[1];
      const value = match[2];
      const line = file.content.substring(0, match.index).split('\n').length;
      
      // Determine storage type based on key
      let storageType = 'unknown';
      let suggestion = 'Use secure storage';
      let replacement = 'secureStorage';
      
      for (const [type, config] of Object.entries(REPLACEMENTS)) {
        if (config.keys.some(pattern => key.includes(pattern))) {
          storageType = type;
          suggestion = config.suggestion;
          replacement = config.replacement;
          break;
        }
      }
      
      findings.push({
        type: 'localStorage',
        method,
        key,
        value,
        line,
        storageType,
        suggestion,
        replacement,
        match: match[0],
      });
    }
  }
  
  // Check for sessionStorage usage
  for (const [method, pattern] of Object.entries(PATTERNS.sessionStorage)) {
    const matches = [...file.content.matchAll(pattern)];
    for (const match of matches) {
      const key = match[1];
      const line = file.content.substring(0, match.index).split('\n').length;
      
      findings.push({
        type: 'sessionStorage',
        method,
        key,
        line,
        storageType: 'session',
        suggestion: 'Already using sessionStorage (consider secure sessionStorage)',
        replacement: 'sessionStorage',
        match: match[0],
      });
    }
  }
  
  return findings;
}

/**
 * Generate migration suggestions
 */
function generateSuggestions(files) {
  const suggestions = [];
  const importsNeeded = new Set();
  
  for (const file of files) {
    const findings = analyzeFile(file);
    
    if (findings.length > 0) {
      const fileSuggestions = {
        file: file.relativePath,
        findings: [],
        imports: new Set(),
        replacements: [],
      };
      
      for (const finding of findings) {
        fileSuggestions.findings.push(finding);
        
        // Determine which import is needed
        if (finding.storageType !== 'unknown' && finding.storageType !== 'auth') {
          const config = REPLACEMENTS[finding.storageType];
          if (config) {
            fileSuggestions.imports.add(config.import);
            importsNeeded.add(config.import);
          }
        }
        
        // Generate replacement code
        let replacementCode;
        switch (finding.method) {
          case 'setItem':
            if (finding.storageType === 'auth') {
              replacementCode = `// ${finding.suggestion}`;
            } else {
              replacementCode = `${finding.replacement}.set('${finding.key}', ${finding.value || 'value'})`;
            }
            break;
            
          case 'getItem':
            if (finding.storageType === 'auth') {
              replacementCode = `// ${finding.suggestion}`;
            } else {
              replacementCode = `${finding.replacement}.get('${finding.key}')`;
            }
            break;
            
          case 'removeItem':
            if (finding.storageType === 'auth') {
              replacementCode = `// ${finding.suggestion}`;
            } else {
              replacementCode = `${finding.replacement}.remove('${finding.key}')`;
            }
            break;
            
          case 'clear':
            replacementCode = `${finding.replacement}.clear()`;
            break;
        }
        
        fileSuggestions.replacements.push({
          original: finding.match,
          replacement: replacementCode,
          line: finding.line,
        });
      }
      
      suggestions.push(fileSuggestions);
    }
  }
  
  return { suggestions, importsNeeded: Array.from(importsNeeded) };
}

/**
 * Generate migration report
 */
function generateReport(suggestions, importsNeeded) {
  console.log('='.repeat(80));
  console.log('STORAGE MIGRATION REPORT');
  console.log('='.repeat(80));
  console.log();
  
  console.log(`Found ${suggestions.length} files with insecure storage usage\n`);
  
  // Summary by storage type
  const summary = {};
  for (const file of suggestions) {
    for (const finding of file.findings) {
      summary[finding.storageType] = (summary[finding.storageType] || 0) + 1;
    }
  }
  
  console.log('Usage Summary:');
  for (const [type, count] of Object.entries(summary)) {
    console.log(`  ${type}: ${count} occurrences`);
  }
  console.log();
  
  // Critical findings (authentication tokens)
  const criticalFiles = suggestions.filter(file => 
    file.findings.some(f => f.storageType === 'auth')
  );
  
  if (criticalFiles.length > 0) {
    console.log('⚠️  CRITICAL: Authentication tokens in localStorage');
    console.log('   These should be migrated to HttpOnly cookies immediately!\n');
    
    for (const file of criticalFiles) {
      console.log(`   ${file.file}:`);
      const authFindings = file.findings.filter(f => f.storageType === 'auth');
      for (const finding of authFindings) {
        console.log(`     Line ${finding.line}: ${finding.match}`);
        console.log(`     → ${finding.suggestion}`);
      }
      console.log();
    }
  }
  
  // File-by-file suggestions
  console.log('File-by-file Migration Suggestions:');
  console.log('-'.repeat(80));
  
  for (const file of suggestions) {
    console.log(`\n${file.file}:`);
    
    if (file.imports.size > 0) {
      console.log('  Add imports:');
      for (const imp of file.imports) {
        console.log(`    ${imp}`);
      }
    }
    
    console.log('  Replacements:');
    for (const replacement of file.replacements) {
      console.log(`    Line ${replacement.line}:`);
      console.log(`      ${replacement.original}`);
      console.log(`      ↓`);
      console.log(`      ${replacement.replacement}`);
    }
  }
  
  // Imports needed
  if (importsNeeded.length > 0) {
    console.log('\nRequired Imports:');
    console.log('-'.repeat(80));
    for (const imp of importsNeeded) {
      console.log(imp);
    }
  }
  
  // Migration commands
  console.log('\nMigration Commands:');
  console.log('-'.repeat(80));
  console.log('1. Install secure storage utilities:');
  console.log('   # Already included in lib/security/storage.ts');
  console.log();
  console.log('2. Clear insecure localStorage (run in browser console):');
  console.log('   localStorage.removeItem("auth_token");');
  console.log('   localStorage.removeItem("refresh_token");');
  console.log('   localStorage.removeItem("user_profile");');
  console.log();
  console.log('3. Test secure storage:');
  console.log('   # Run the validation function');
  console.log('   import { validateStorage } from "@/lib/security/storage";');
  console.log('   console.log(validateStorage());');
}

/**
 * Generate patch file
 */
function generatePatch(suggestions) {
  const patches = [];
  
  for (const file of suggestions) {
    let content = fs.readFileSync(file.path, 'utf8');
    let modified = false;
    
    for (const replacement of file.replacements) {
      if (content.includes(replacement.original)) {
        content = content.replace(replacement.original, replacement.replacement);
        modified = true;
      }
    }
    
    // Add imports if needed
    if (file.imports.size > 0) {
      const lines = content.split('\n');
      let importInserted = false;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('import')) {
          // Find the last import line
          let lastImport = i;
          for (let j = i + 1; j < lines.length; j++) {
            if (lines[j].includes('import')) {
              lastImport = j;
            } else {
              break;
            }
          }
          
          // Insert new imports after the last import
          const newImports = Array.from(file.imports).join('\n');
          lines.splice(lastImport + 1, 0, newImports);
          importInserted = true;
          break;
        }
      }
      
      if (!importInserted) {
        // Add imports at the beginning of the file
        const newImports = Array.from(file.imports).join('\n') + '\n';
        lines.unshift(newImports);
      }
      
      content = lines.join('\n');
      modified = true;
    }
    
    if (modified) {
      patches.push({
        file: file.path,
        content,
      });
    }
  }
  
  return patches;
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Scanning for insecure storage usage...\n');
  
  const files = findFilesWithLocalStorage();
  const { suggestions, importsNeeded } = generateSuggestions(files);
  
  generateReport(suggestions, importsNeeded);
  
  // Ask if user wants to generate patches
  console.log('\n' + '='.repeat(80));
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  rl.question('\nGenerate patch files? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      const patches = generatePatch(suggestions);
      
      // Create patches directory
      const patchesDir = path.join(SOURCE_DIR, 'storage-patches');
      if (!fs.existsSync(patchesDir)) {
        fs.mkdirSync(patchesDir);
      }
      
      // Write patch files
      for (const patch of patches) {
        const patchFile = path.join(
          patchesDir,
          path.basename(patch.file) + '.patch'
        );
        fs.writeFileSync(patchFile, patch.content);
        console.log(`Created patch: ${patchFile}`);
      }
      
      console.log(`\nCreated ${patches.length} patch files in ${patchesDir}`);
      console.log('\nTo apply patches:');
      console.log('1. Review each patch file');
      console.log('2. Manually apply changes or use patch command');
      console.log('3. Test thoroughly after applying');
    }
    
    rl.close();
    
    console.log('\n' + '='.repeat(80));
    console.log('Migration analysis complete!');
    console.log('='.repeat(80));
  });
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  findFilesWithLocalStorage,
  analyzeFile,
  generateSuggestions,
  generateReport,
  generatePatch,
};