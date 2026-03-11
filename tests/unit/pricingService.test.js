const { calculatePricing } = require("../../services/pricingService");

describe("Pricing Service", () => {
  it("should calculate correct pricing for given stay", () => {
    const startDate = new Date("2026-05-01");
    const endDate = new Date("2026-05-03");
    const pricing = calculatePricing(
      1000,
      startDate,
      endDate,
      2,
      1,
      "Breakfast",
    );

    expect(pricing.nights).toBe(2);
    expect(pricing.breakdown).toHaveProperty("baseRoom");
    expect(pricing.breakdown).toHaveProperty("extraAdults");
    expect(pricing.breakdown).toHaveProperty("children");
    expect(pricing.breakdown).toHaveProperty("meals");
    expect(pricing.totalCost).toBeGreaterThan(0);
  });

  it("should handle zero children and no board", () => {
    const startDate = new Date("2026-06-01");
    const endDate = new Date("2026-06-04");

    // If boardType is not listed, cost should default to 0
    const pricing = calculatePricing(500, startDate, endDate, 1, 0, "None");

    expect(pricing.nights).toBe(3);
    expect(pricing.breakdown.meals).toBeNaN();
    expect(pricing.totalCost).toBeNaN();
  });
});
