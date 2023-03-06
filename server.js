const mongoose = require('mongoose');
const dotenv = require('dotenv');
//read the env file before requiring the app
dotenv.config({ path: './config.env' });

const app = require('./app');

//connect our app to db
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.MONGO_PASSWORD
);
mongoose.connect(DB).then(() => console.log('DB connected...'));

//###########START THE SERVER###########
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
