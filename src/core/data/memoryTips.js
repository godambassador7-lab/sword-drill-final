// Memory Tips Service
import memoryTipsData from "./memory_tips/memoryTips.json";

/**
 * Get a random memory tip from the collection
 * @returns {string} A random memory tip
 */
export function getRandomMemoryTip() {
  const randomIndex = Math.floor(Math.random() * memoryTipsData.length);
  return memoryTipsData[randomIndex];
}

/**
 * Get all memory tips
 * @returns {string[]} Array of all memory tips
 */
export function getAllMemoryTips() {
  return memoryTipsData;
}

/**
 * Get a specific memory tip by category (approximate)
 * @param {string} category - "technique", "encouragement", "humor", or "spiritual"
 * @returns {string} A random tip from the approximate category
 */
export function getMemoryTipByCategory(category) {
  let filteredTips;

  switch (category) {
    case "technique":
      // Tips 0-10 are technique-focused
      filteredTips = memoryTipsData.slice(0, 11);
      break;
    case "spiritual":
      // Tips 11-17 are spiritual/encouragement
      filteredTips = memoryTipsData.slice(11, 18);
      break;
    case "encouragement":
      // Tips 18-40 are encouragement-focused
      filteredTips = memoryTipsData.slice(18, 41);
      break;
    case "humor":
      // Tips 41-50 are humorous
      filteredTips = memoryTipsData.slice(41);
      break;
    default:
      filteredTips = memoryTipsData;
  }

  const randomIndex = Math.floor(Math.random() * filteredTips.length);
  return filteredTips[randomIndex];
}
