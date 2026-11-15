const fs = require('fs');

function findFormSubmit(file) {
  const content = fs.readFileSync(file, 'utf8');
  console.log('=== ' + file + ' ===');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('<form') || l.includes('onSubmit') || (l.includes('submit') && l.includes('function')) || (l.includes('onSubmit') && l.includes('='))) {
      console.log(`Line ${idx + 1}: ${l.trim().slice(0, 120)}`);
    }
  });
}

findFormSubmit('frontend/src/pages/services/USATaxPreparationPage.jsx');
findFormSubmit('frontend/src/pages/services/PayrollManagementPage.jsx');
findFormSubmit('frontend/src/pages/services/BookkeepingPage.jsx');
