const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const AuthRouter = require('./router/Auth-router');
const UserRouter = require('./router/User-router');
const MarketRouter = require('./router/Market-router');
const ProductRouter = require('./router/Product-router');
const Market = require('./services/Market-service');
const socket = require('socket.io')(6464);

const PORT = 8989;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/auth', AuthRouter);
app.use('/api/user', UserRouter);
app.use('/api/market', MarketRouter);
app.use('/api/product', ProductRouter);

const start = async () => {
  await mongoose.connect('mongodb+srv://admin:admin@databases.rudz7.mongodb.net/auction?retryWrites=true&w=majority');
  app.listen(PORT, () => {
    console.log(`server start -> http://localhost:${PORT}`);
  });
};

try {
  start().then(() => {
    configureSocket();
  });
} catch (e) {
  console.log(e);
}

const configureSocket = () => {
  let storageSubscribers = {};

  const unsubscribeFromChangeCurrentBetObserve = (clientId) => {
    return Object.entries(storageSubscribers).reduce((acc, [productId, clientIds]) => {
      acc[productId] = clientIds.filter((subscribedClientId) => subscribedClientId !== clientId);
      return acc;
    }, {});
  };

  socket.on('connection', (client) => {
    console.log('success connected: ', client.id);

    client.on('register-subscriber', (product) => {
      if (!storageSubscribers[product._id]) {
        storageSubscribers[product._id] = [];
      }
      storageSubscribers[product._id].push(client.id);
      console.log(`User with client id: ${client.id} success registered`);
      console.log('Subscribed users: ', storageSubscribers);
    });

    client.on('raise-bet', async (data) => {
      const { productId, raisedBet, userId } = data;
      const updatedProduct = await Market.raiseCurrentBet(productId, raisedBet, userId);

      // send refresh balance
      client.emit('refresh-balance');

      // "client.to(YOUR_ID).emit" doesn't work like "client.emit", so need this line
      client.emit('change-current-bet', updatedProduct);
      storageSubscribers[productId]?.forEach((userId) => {
        client.to(userId).emit('change-current-bet', updatedProduct);
      });
      console.log(`Update message was sent to all subscribed users`);
    });

    client.on('disconnect', () => {
      storageSubscribers = unsubscribeFromChangeCurrentBetObserve(client.id);
      console.log(`User with client id: ${client.id} disconnected`);
      console.log('Subscribed users: ', storageSubscribers);
    });
  });
};
