const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

// Connect Database & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`[Broker Compare Backend Running]: http://localhost:${PORT}`);
    console.log(`[API Documentation]: http://localhost:${PORT}/api-docs`);
    console.log(`====================================================`);
  });
});
