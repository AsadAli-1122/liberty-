// Function to convert UGX to USD
function convertUGXtoUSD(amountInUGX) {
    // Replace the following line with your own conversion logic
    const conversionRate = 0.00028; // 1 UGX = 0.00028 USD
    const amountInUSD = amountInUGX * conversionRate;
    return amountInUSD;
  }
  
  // Export the function
  export { convertUGXtoUSD };
  