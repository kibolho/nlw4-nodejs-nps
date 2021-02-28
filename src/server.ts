import { app } from './app';
import './docs';

app.listen(process.env.PORT || 3333, () =>
  console.log('🚀 Server is running on port 3333!'),
);
