import { Server } from 'socket.io';
import mongoose from 'mongoose';
import moment from 'moment';

import ISocketController from '../interfaces/ISocketConroller';
import authorizedSocketMiddleware from '../middlewares/AuthorizedSocketMiddleware';
import ShoppingList from '../models/ShoppingList';
import SocketUtils from '../utils/SocketUtils';
import Product from '../models/Product';
import User from '../models/User';

class ShoppingListController implements ISocketController {
  public socketServer: Server;

  constructor(socketServer: Server) {
    this.socketServer = socketServer;

    this.initSocketActions();
  }

  public initSocketActions() {
    this.socketServer.use(authorizedSocketMiddleware);
    this.socketServer.on('connection', (socket) => {
      socket.on('getLists', async () => {
        const lists = await ShoppingList.getSimpleLists();
        this.socketServer.emit('shoppingLists', lists);
      });

      socket.on('getList', async (id) => {
        const list = await ShoppingList.getSimpleList(id);
        this.socketServer.emit('shoppingList', list);
      });

      socket.on('addList', async (data) => {
        const userId = SocketUtils.getUserId(socket);

        const newShoppingList = new ShoppingList({
          author: new mongoose.Types.ObjectId(userId),
          creationDate: moment().toDate(),
          name: data.name,
        });
        await newShoppingList.save();

        const lists = await ShoppingList.getSimpleLists();
        this.socketServer.emit('shoppingLists', lists);
      });

      socket.on('addProduct', async (data) => {
        await Product.addNewProduct(data);

        const products = await ShoppingList.getProducts(data.shoppingListId);
        this.socketServer.emit('products', products);

        const lists = await ShoppingList.getSimpleLists();
        this.socketServer.to(data.shoppingListId).emit('shoppingLists', lists);
      });

      socket.on('getProducts', async (listId) => {
        socket.join(listId);

        const products = await ShoppingList.getProducts(listId);
        this.socketServer.to(listId).emit('products', products);
      });

      socket.on('removeProduct', async (data) => {
        await Product.removeProduct(data.listId, data.productId);

        const products = await ShoppingList.getProducts(data.listId);
        this.socketServer.to(data.listId).emit('products', products);

        const lists = await ShoppingList.getSimpleLists();
        this.socketServer.to(data.listId).emit('shoppingLists', lists);
      });

      socket.on('changeInCartState', async (data) => {
        await Product.updateInCartStatus(data.productId, data.newValue);

        const products = await ShoppingList.getProducts(data.listId);
        this.socketServer.to(data.listId).emit('products', products);
      });

      socket.on('closeList', async (id) => {
        const userId = SocketUtils.getUserId(socket);
        const user = await User.findById(userId);
        await ShoppingList.closeList(id);

        this.socketServer.to(id).emit('listClosed', user.login);

        const lists = await ShoppingList.getSimpleLists();
        this.socketServer.to(id).emit('shoppingLists', lists);
      });
    });
  }
}

export default ShoppingListController;
