const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const AuthRouter = require('./router/Auth-router');
const UserRouter = require('./router/User-router');
const MarketRouter = require('./router/Market-router');

const PORT = 8989;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/auth', AuthRouter);
app.use('/api/user', UserRouter);
app.use('/api/market', MarketRouter);

const start = async () => {
  await mongoose.connect('mongodb+srv://admin:admin@databases.rudz7.mongodb.net/auction?retryWrites=true&w=majority');
  app.listen(PORT, () => {
    console.log(`server start -> http://localhost:${PORT}`);
  });
};

try {
  start();
} catch (e) {
  console.log(e);
}

