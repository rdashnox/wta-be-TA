const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const schemas = require("./swaggerSchemas");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Sky Suites Hotel API by WTA-BE Project",
      version: "1.0.0",
      description: "Dynamic API documentation for the Sky Suites Hotel facility system",
    },
    components: {
      schemas,
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec, swaggerUi };