import { app } from './app';
import './docs';
const port = process.env.PORT || process.env.PORT_DEFAULT;

const host = `${process.env.URL_HOST}:${
  process.env.PORT || process.env.PORT_DEFAULT
}`;

app.listen(port, () => console.log(`🚀 Server is running on ${host}`));
