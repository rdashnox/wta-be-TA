const mongoose = require("mongoose");

/**
 * Generic ownership/permission middleware
 * @param {String} modelName
 * @param {String} ownerField
 * @param {Array} allowedRoles
 * @returns {Function}
 */
exports.requireOwnership = (
  modelName,
  ownerField = "user",
  allowedRoles = ["admin"],
) => {
  return async (req, res, next) => {
    try {
      // Dynamic model loading
      const Model = mongoose.model(modelName);

      // Fetch resource with owner populated
      const resource = await Model.findById(req.params.id).populate(ownerField);

      if (!resource) {
        return res.status(404).json({ message: `${modelName} not found` });
      }

      // Admin bypass
      if (allowedRoles.includes(req.user.role)) {
        req.resource = resource;
        return next();
      }

      // Owner check
      const ownerId =
        resource[ownerField]?._id?.toString() || resource[ownerField];
      if (ownerId !== req.user._id.toString()) {
        return res.status(403).json({
          message: `Access denied. You don't own this ${modelName.toLowerCase()}`,
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      res.status(500).json({ message: "Permission check failed" });
    }
  };
};

/**
 * Role-based permission (Admin only, etc.)
 */
exports.requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
};
