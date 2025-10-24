// Test script to check if Tooltip can be imported
import('sharedComponents/Tooltip')
  .then(module => {
    console.log('✅ Tooltip imported successfully:', module);
  })
  .catch(error => {
    console.error('❌ Failed to import Tooltip:', error);
  });
