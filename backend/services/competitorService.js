// Mock competitor platforms
const competitorPlatforms = [
  { name: 'Amazon', basePriceMultiplier: 0.95 },
  { name: 'Myntra', basePriceMultiplier: 1.0 },
  { name: 'Ajio', basePriceMultiplier: 0.92 },
  { name: 'Nykaa Fashion', basePriceMultiplier: 1.05 },
  { name: 'Tata Cliq', basePriceMultiplier: 0.98 },
  { name: 'Meesho', basePriceMultiplier: 0.85 }
];

export const getMockCompetitorPrices = async (product) => {
  const basePrice = product.price || 1000;
  const competitors = [];
  
  for (const platform of competitorPlatforms) {
    const variation = 0.9 + Math.random() * 0.2;
    const competitorPrice = Math.round(basePrice * platform.basePriceMultiplier * variation);
    
    competitors.push({
      platform: platform.name,
      price: competitorPrice,
      currency: 'INR',
      url: `https://${platform.name.toLowerCase()}.com/product/${product.skuId}`,
      lastChecked: new Date().toISOString()
    });
  }
  
  // Sort by price
  competitors.sort((a, b) => a.price - b.price);
  
  return competitors;
};

export const refreshCompetitorPrices = async (product) => {
  // Simulate refresh delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return getMockCompetitorPrices(product);
};

export const calculatePriceComparison = (ourPrice, competitors) => {
  if (!competitors || competitors.length === 0) {
    return {
      lowestCompetitorPrice: null,
      highestCompetitorPrice: null,
      averageCompetitorPrice: null,
      priceGap: null,
      percentageDifference: null,
      recommendedAction: 'No competitor data available',
      isAlertNeeded: false
    };
  }
  
  const prices = competitors.map(c => c.price);
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);
  const average = prices.reduce((a, b) => a + b, 0) / prices.length;
  const priceGap = ourPrice - lowest;
  const percentageDiff = (priceGap / lowest) * 100;
  
  let recommendedAction = '';
  let isAlertNeeded = false;
  
  if (ourPrice > lowest) {
    const diffPercent = ((ourPrice - lowest) / lowest) * 100;
    if (diffPercent > 10) {
      recommendedAction = `Price is ${diffPercent.toFixed(1)}% higher than lowest competitor (${lowest} INR). Consider reducing price to stay competitive.`;
      isAlertNeeded = true;
    } else {
      recommendedAction = `Price is slightly higher than lowest competitor. Monitor competitor prices.`;
    }
  } else if (ourPrice < lowest) {
    recommendedAction = `Your price is the lowest! Consider highlighting this in your listing.`;
  } else {
    recommendedAction = `Price matches the lowest competitor. Good position!`;
  }
  
  return {
    lowestCompetitorPrice: lowest,
    highestCompetitorPrice: highest,
    averageCompetitorPrice: average,
    priceGap: priceGap,
    percentageDifference: percentageDiff,
    recommendedAction,
    isAlertNeeded: isAlertNeeded && percentageDiff > 10
  };
};