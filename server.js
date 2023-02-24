const dotenv = require('dotenv');
//read the env file before requiring the app
dotenv.config({ path: './config.env' });

const app = require('./app');

//###########START THE SERVER###########
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
