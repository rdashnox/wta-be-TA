const mongoose = require("mongoose");
const { getHealthStatus } = require("../../controllers/health.controller");

describe("Health Controller Unit Test", () => {
  let req, res;

  beforeEach(() => {
    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.restoreAllMocks();
  });

  it("should return UP status when DB is connected", async () => {
    Object.defineProperty(mongoose.connection, "readyState", {
      value: 1,
      configurable: true,
    });

    mongoose.connection.db = {
      admin: () => ({
        ping: jest.fn().mockResolvedValue(true),
      }),
    };

    await getHealthStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    const response = res.json.mock.calls[0][0];
    expect(response.status).toBe("ok");
    expect(response.services.database.status).toBe("up");
    expect(response.services.database.responseTimeMs).toEqual(expect.any(Number));
  });

  it("should return degraded when DB is not connected", async () => {
    Object.defineProperty(mongoose.connection, "readyState", {
      value: 0,
      configurable: true,
    });

    await getHealthStatus(req, res);

    const response = res.json.mock.calls[0][0];
    expect(response.status).toBe("degraded");
    expect(response.services.database.status).toBe("connecting");
    expect(response.services.database.responseTimeMs).toBeNull();
  });

  it("should handle DB ping failure", async () => {
    Object.defineProperty(mongoose.connection, "readyState", {
      value: 1,
      configurable: true,
    });

    mongoose.connection.db = {
      admin: () => ({
        ping: jest.fn().mockRejectedValue(new Error("ping failed")),
      }),
    };

    await getHealthStatus(req, res);

    const response = res.json.mock.calls[0][0];
    expect(response.status).toBe("degraded");
    expect(response.services.database.status).toBe("down");
    expect(response.services.database.responseTimeMs).toBeNull();
  });
});