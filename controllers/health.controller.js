const mongoose = require("mongoose");

exports.getHealthStatus = async (req, res) => {
  let dbStatus = "down";
  let dbResponseTime = null;

  try {
    if (mongoose.connection.readyState === 1) {
      const dbStart = Date.now();

      await Promise.race([
        mongoose.connection.db.admin().ping(),
        new Promise((_, reject) => {
          const timer = setTimeout(() => reject(new Error("timeout")), 2000);
          timer.unref(); 
        }),
      ]);

      dbStatus = "up";
      dbResponseTime = Date.now() - dbStart;
    } else {
      dbStatus = "connecting";
    }
  } catch {
    dbStatus = "down";
  }

  const overallStatus = dbStatus === "up" ? "ok" : "degraded";

  res.status(200).json({
    project: "wta-be",
    status: overallStatus,
    uptime: process.uptime(),
    timestamp: Date.now(),
    services: {
      server: { status: "up" },
      database: {
        status: dbStatus,
        responseTimeMs: dbResponseTime,
      },
    },
  });
};
