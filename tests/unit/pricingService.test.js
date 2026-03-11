/*
 * for @k358k
 */

const { calculatePricing } = require("../../services/pricingService");

describe("Pricing Service", () => {
  it("should calculate correct pricing for given stay", async () => {
    // HINT: 2 nights = May 1 to May 3
    const startDate = new Date("2026-05-01");
    const endDate = new Date("2026-05-03");

    // TODO: Call calculatePricing(roomPrice, startDate, endDate, adults, children, boardType)
    const pricing = /* YOUR CODE HERE */;

    // TODO: Check structure and totalCost > 0
    expect(pricing.nights).toBe(2);
    expect(pricing.breakfast).toHaveProperty("baseRoom");
    expect(pricing.totalCost).toBeGreaterThan(0);
  });

  it("should handle zero children and no board", () => {
    const startDate = new Date("2026-06-01");
    const endDate = new Date("2026-06-04");

    // TODO: 3 nights, 1 adult, 0 children, "None" board
    const pricing = /* YOUR CODE HERE */;

    expect(pricing.nights).toBe(3);
    /* TODO: Check what happens with invalid boardType */
  });
});
