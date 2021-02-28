import { app } from '../app';
var fs = require('fs');
var swaggerUi = require('swagger-ui-express');


  /* Swagger files start */
const swaggerFile: any = (process.cwd()+"/src/docs/swagger.json");
const swaggerData: any = fs.readFileSync(swaggerFile, 'utf8');
const customCss: any = fs.readFileSync((process.cwd()+"/src/docs/swagger.css"), 'utf8');
const swaggerDocument = JSON.parse(swaggerData);
/* Swagger files end */

console.log(swaggerFile);
console.log(swaggerDocument);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, null, null, customCss));
