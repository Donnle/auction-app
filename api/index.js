const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const AuthRouter = require('./router/Auth-router');
const UserRouter = require('./router/User-router');
const MarketRouter = require('./router/Market-router');
const ProductRouter = require('./router/Product-router');

const cron = require('node-cron');
const Product = require('./models/Product-model');

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
  return app.listen(PORT, () => {
    console.log(`server start -> http://localhost:${PORT}`);
  });
};

try {
  start().then(() => {
    configureSocket();

    // Update products in db every 4 hour 0 */4 * * *
    cron.schedule('0 */4 * * *', async () => {
      const expiredProducts = await Product.updateMany({ endDate: { $lte: Date.now() } }, { isTimeIsUp: true });
      console.log(expiredProducts);
      console.log('"Видалено" товарів: ', expiredProducts.modifiedCount);
    });
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

    client.on('register-subscriber', (productId) => {
      if (!storageSubscribers[productId]) {
        storageSubscribers[productId] = [];
      }
      storageSubscribers[productId].push(client.id);
      console.log(`User with client id: ${client.id} success registered`);
      console.log('Subscribed users: ', storageSubscribers);
    });

    client.on('raise-bet', async (product) => {
      try {
        // "client.to(YOUR_ID).emit" doesn't work like "client.emit", so need this line
        client.emit('change-current-bet', product);
        storageSubscribers[product.id]?.forEach((userId) => {
          client.to(userId).emit('change-current-bet', product);
        });
        console.log(`Update message was sent to all subscribed users`);
      } catch (e) {
        client.emit('already-sold');
        console.log(e.message);
      }
    });

    client.on('disconnect', () => {
      storageSubscribers = unsubscribeFromChangeCurrentBetObserve(client.id);
      console.log(`User with client id: ${client.id} disconnected`);
      console.log('Subscribed users: ', storageSubscribers);
    });
  });
};
