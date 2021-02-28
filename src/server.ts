import { app } from './app';
import './docs';
const port = process.env.PORT || process.env.PORT_DEFAULT;
app.listen(port, () => console.log(`🚀 Server is running on port ${port}!`));
