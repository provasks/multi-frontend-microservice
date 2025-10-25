// Simple Redux test
console.log('Testing Redux setup...');

try {
  // Test if we can import Redux Toolkit
  const { createSlice } = require('@reduxjs/toolkit');
  console.log('✅ Redux Toolkit imported successfully');
  
  // Test creating a simple slice
  const testSlice = createSlice({
    name: 'test',
    initialState: { value: 0 },
    reducers: {
      increment: (state) => {
        state.value += 1;
      }
    }
  });
  
  console.log('✅ Test slice created successfully');
  console.log('✅ Test slice reducer:', typeof testSlice.reducer);
  console.log('✅ Test slice actions:', Object.keys(testSlice.actions));
  
} catch (error) {
  console.log('❌ Redux test failed:', error.message);
}
