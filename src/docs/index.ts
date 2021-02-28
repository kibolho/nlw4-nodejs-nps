import { app } from '../app';
var fs = require('fs');
var swaggerUi = require('swagger-ui-express');

/* Swagger files start */
const swaggerFile: any = process.cwd() + '/src/docs/swagger.json';
const swaggerData: any = fs.readFileSync(swaggerFile, 'utf8');
const customCss: any = fs.readFileSync(
  process.cwd() + '/src/docs/swagger.css',
  'utf8',
);
const swaggerDocument = JSON.parse(swaggerData);
swaggerDocument.host = `${process.env.URL_HOST}:${process.env.PORT || process.env.PORT_DEFAULT}`;
/* Swagger files end */

var options = {
  customSiteTitle: "NPS API",
  customCss,
};

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
