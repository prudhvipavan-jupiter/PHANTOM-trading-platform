// P.H.A.N.T.O.M WebSocket Service
// Handles real-time communication and data streaming

import { logger } from '../utils/logger.js';

class WebSocketService {
  constructor(io) {
    this.io = io;
    this.connectedClients = new Map();
    this.rooms = new Map();
    this.isInitialized = false;
  }

  // Initialize WebSocket service
  async initialize() {
    try {
      logger.info('🔌 Initializing WebSocket Service...');
      
      // Set up event handlers
      this.setupEventHandlers();
      
      // Start periodic data broadcasts
      this.startDataBroadcasts();
      
      this.isInitialized = true;
      logger.info('✅ WebSocket Service initialized successfully');
      
      return true;
    } catch (error) {
      logger.error('❌ Failed to initialize WebSocket Service:', error);
      throw error;
    }
  }

  // Set up WebSocket event handlers
  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      logger.info(`🔌 Client connected: ${socket.id}`);
      
      // Store client information
      this.connectedClients.set(socket.id, {
        id: socket.id,
        connectedAt: new Date(),
        rooms: new Set(),
        userId: null
      });

      // Handle authentication
      socket.on('authenticate', (data) => {
        this.handleAuthentication(socket, data);
      });

      // Handle joining rooms
      socket.on('join_room', (data) => {
        this.handleJoinRoom(socket, data);
      });

      // Handle leaving rooms
      socket.on('leave_room', (data) => {
        this.handleLeaveRoom(socket, data);
      });

      // Handle market data subscriptions
      socket.on('subscribe_market_data', (data) => {
        this.handleMarketDataSubscription(socket, data);
      });

      // Handle trading updates
      socket.on('subscribe_trading_updates', (data) => {
        this.handleTradingUpdatesSubscription(socket, data);
      });

      // Handle portfolio updates
      socket.on('subscribe_portfolio_updates', (data) => {
        this.handlePortfolioUpdatesSubscription(socket, data);
      });

      // Handle AI predictions
      socket.on('subscribe_ai_predictions', (data) => {
        this.handleAIPredictionsSubscription(socket, data);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });

      // Send welcome message
      socket.emit('connected', {
        message: 'Connected to P.H.A.N.T.O.M Trading Platform',
        timestamp: new Date(),
        socketId: socket.id
      });
    });
  }

  // Handle client authentication
  handleAuthentication(socket, data) {
    try {
      const { userId, token } = data;
      
      if (!userId || !token) {
        socket.emit('auth_error', { message: 'Missing authentication data' });
        return;
      }

      // In a real implementation, you would validate the token
      const client = this.connectedClients.get(socket.id);
      if (client) {
        client.userId = userId;
        socket.userId = userId;
      }

      socket.emit('authenticated', {
        message: 'Authentication successful',
        userId: userId,
        timestamp: new Date()
      });

      logger.info(`🔐 Client authenticated: ${socket.id} (User: ${userId})`);
    } catch (error) {
      logger.error('❌ Authentication error:', error);
      socket.emit('auth_error', { message: 'Authentication failed' });
    }
  }

  // Handle joining rooms
  handleJoinRoom(socket, data) {
    try {
      const { room } = data;
      
      if (!room) {
        socket.emit('error', { message: 'Room name required' });
        return;
      }

      socket.join(room);
      
      const client = this.connectedClients.get(socket.id);
      if (client) {
        client.rooms.add(room);
      }

      // Track room membership
      if (!this.rooms.has(room)) {
        this.rooms.set(room, new Set());
      }
      this.rooms.get(room).add(socket.id);

      socket.emit('room_joined', {
        room: room,
        message: `Joined room: ${room}`,
        timestamp: new Date()
      });

      logger.info(`🏠 Client ${socket.id} joined room: ${room}`);
    } catch (error) {
      logger.error('❌ Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  }

  // Handle leaving rooms
  handleLeaveRoom(socket, data) {
    try {
      const { room } = data;
      
      if (!room) {
        socket.emit('error', { message: 'Room name required' });
        return;
      }

      socket.leave(room);
      
      const client = this.connectedClients.get(socket.id);
      if (client) {
        client.rooms.delete(room);
      }

      // Remove from room tracking
      if (this.rooms.has(room)) {
        this.rooms.get(room).delete(socket.id);
        if (this.rooms.get(room).size === 0) {
          this.rooms.delete(room);
        }
      }

      socket.emit('room_left', {
        room: room,
        message: `Left room: ${room}`,
        timestamp: new Date()
      });

      logger.info(`🚪 Client ${socket.id} left room: ${room}`);
    } catch (error) {
      logger.error('❌ Error leaving room:', error);
      socket.emit('error', { message: 'Failed to leave room' });
    }
  }

  // Handle market data subscriptions
  handleMarketDataSubscription(socket, data) {
    try {
      const { symbols } = data;
      
      if (!symbols || !Array.isArray(symbols)) {
        socket.emit('error', { message: 'Symbols array required' });
        return;
      }

      // Join market data room for each symbol
      symbols.forEach(symbol => {
        const roomName = `market_data_${symbol}`;
        socket.join(roomName);
        
        const client = this.connectedClients.get(socket.id);
        if (client) {
          client.rooms.add(roomName);
        }
      });

      socket.emit('market_data_subscribed', {
        symbols: symbols,
        message: `Subscribed to market data for: ${symbols.join(', ')}`,
        timestamp: new Date()
      });

      logger.info(`📊 Client ${socket.id} subscribed to market data: ${symbols.join(', ')}`);
    } catch (error) {
      logger.error('❌ Error subscribing to market data:', error);
      socket.emit('error', { message: 'Failed to subscribe to market data' });
    }
  }

  // Handle trading updates subscriptions
  handleTradingUpdatesSubscription(socket, data) {
    try {
      const { userId } = data;
      
      if (!userId) {
        socket.emit('error', { message: 'User ID required' });
        return;
      }

      const roomName = `trading_updates_${userId}`;
      socket.join(roomName);
      
      const client = this.connectedClients.get(socket.id);
      if (client) {
        client.rooms.add(roomName);
      }

      socket.emit('trading_updates_subscribed', {
        userId: userId,
        message: 'Subscribed to trading updates',
        timestamp: new Date()
      });

      logger.info(`📈 Client ${socket.id} subscribed to trading updates for user: ${userId}`);
    } catch (error) {
      logger.error('❌ Error subscribing to trading updates:', error);
      socket.emit('error', { message: 'Failed to subscribe to trading updates' });
    }
  }

  // Handle portfolio updates subscriptions
  handlePortfolioUpdatesSubscription(socket, data) {
    try {
      const { userId } = data;
      
      if (!userId) {
        socket.emit('error', { message: 'User ID required' });
        return;
      }

      const roomName = `portfolio_updates_${userId}`;
      socket.join(roomName);
      
      const client = this.connectedClients.get(socket.id);
      if (client) {
        client.rooms.add(roomName);
      }

      socket.emit('portfolio_updates_subscribed', {
        userId: userId,
        message: 'Subscribed to portfolio updates',
        timestamp: new Date()
      });

      logger.info(`💼 Client ${socket.id} subscribed to portfolio updates for user: ${userId}`);
    } catch (error) {
      logger.error('❌ Error subscribing to portfolio updates:', error);
      socket.emit('error', { message: 'Failed to subscribe to portfolio updates' });
    }
  }

  // Handle AI predictions subscriptions
  handleAIPredictionsSubscription(socket, data) {
    try {
      const { symbols } = data;
      
      if (!symbols || !Array.isArray(symbols)) {
        socket.emit('error', { message: 'Symbols array required' });
        return;
      }

      // Join AI predictions room for each symbol
      symbols.forEach(symbol => {
        const roomName = `ai_predictions_${symbol}`;
        socket.join(roomName);
        
        const client = this.connectedClients.get(socket.id);
        if (client) {
          client.rooms.add(roomName);
        }
      });

      socket.emit('ai_predictions_subscribed', {
        symbols: symbols,
        message: `Subscribed to AI predictions for: ${symbols.join(', ')}`,
        timestamp: new Date()
      });

      logger.info(`🤖 Client ${socket.id} subscribed to AI predictions: ${symbols.join(', ')}`);
    } catch (error) {
      logger.error('❌ Error subscribing to AI predictions:', error);
      socket.emit('error', { message: 'Failed to subscribe to AI predictions' });
    }
  }

  // Handle client disconnect
  handleDisconnect(socket) {
    try {
      logger.info(`🔌 Client disconnected: ${socket.id}`);
      
      // Clean up client data
      this.connectedClients.delete(socket.id);
      
      // Remove from all rooms
      this.rooms.forEach((clients, room) => {
        clients.delete(socket.id);
        if (clients.size === 0) {
          this.rooms.delete(room);
        }
      });
    } catch (error) {
      logger.error('❌ Error handling disconnect:', error);
    }
  }

  // Start periodic data broadcasts
  startDataBroadcasts() {
    // Broadcast market data every 5 seconds
    setInterval(() => {
      this.broadcastMarketData();
    }, 5000);

    // Broadcast system status every 30 seconds
    setInterval(() => {
      this.broadcastSystemStatus();
    }, 30000);
  }

  // Broadcast market data
  broadcastMarketData() {
    try {
      // Simulate market data
      const marketData = {
        type: 'market_data',
        data: {
          NIFTY: {
            price: 19500 + Math.random() * 100,
            change: Math.random() * 2 - 1,
            volume: Math.floor(Math.random() * 1000000)
          },
          SENSEX: {
            price: 65000 + Math.random() * 200,
            change: Math.random() * 2 - 1,
            volume: Math.floor(Math.random() * 2000000)
          }
        },
        timestamp: new Date()
      };

      // Broadcast to market data rooms
      Object.keys(marketData.data).forEach(symbol => {
        const roomName = `market_data_${symbol}`;
        this.io.to(roomName).emit('market_data_update', marketData);
      });
    } catch (error) {
      logger.error('❌ Error broadcasting market data:', error);
    }
  }

  // Broadcast system status
  broadcastSystemStatus() {
    try {
      const systemStatus = {
        type: 'system_status',
        data: {
          connectedClients: this.connectedClients.size,
          activeRooms: this.rooms.size,
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          timestamp: new Date()
        }
      };

      this.io.emit('system_status', systemStatus);
    } catch (error) {
      logger.error('❌ Error broadcasting system status:', error);
    }
  }

  // Send message to specific user
  sendToUser(userId, event, data) {
    try {
      this.io.to(`user_${userId}`).emit(event, data);
    } catch (error) {
      logger.error(`❌ Error sending message to user ${userId}:`, error);
    }
  }

  // Send message to specific room
  sendToRoom(room, event, data) {
    try {
      this.io.to(room).emit(event, data);
    } catch (error) {
      logger.error(`❌ Error sending message to room ${room}:`, error);
    }
  }

  // Broadcast to all connected clients
  broadcast(event, data) {
    try {
      this.io.emit(event, data);
    } catch (error) {
      logger.error('❌ Error broadcasting message:', error);
    }
  }

  // Get connected clients count
  getConnectedClientsCount() {
    return this.connectedClients.size;
  }

  // Get active rooms count
  getActiveRoomsCount() {
    return this.rooms.size;
  }
}

// Export the WebSocket service class
export { WebSocketService };

// Export initialization function
export const initializeWebSocketService = async (io) => {
  const wsService = new WebSocketService(io);
  return await wsService.initialize();
}; 