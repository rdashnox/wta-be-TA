const calculatePricing = (
  roomPrice,
  checkInDate,
  checkOutDate,
  adults,
  children,
  boardType,
) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  // Room rates (per night)
  const baseRoom = roomPrice * adults * nights;
  const extraAdultsCost = Math.max(0, adults - 1) * 1500 * nights;
  const childrenCost = children * 800 * nights;

  // Board rates (per person per night)
  const boardRates = { Breakfast: 1500, "Half-board": 3000 };
  const mealsCost = boardRates[boardType] * (adults + children) * nights;

  const totalCost = baseRoom + extraAdultsCost + childrenCost + mealsCost;

  return {
    nights,
    roomPrice,
    breakdown: {
      baseRoom,
      extraAdults: extraAdultsCost,
      children: childrenCost,
      meals: mealsCost,
    },
    totalCost: Math.round(totalCost),
  };
};

module.exports = { calculatePricing };
