import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  swaggerDefinition: {
    restapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "My REST API",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["**/*.js"],
};

const specs = swaggerJsdoc(options);

const enableSwagger = (app: any) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
