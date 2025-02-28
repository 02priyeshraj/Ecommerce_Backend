require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize Express
const app = express();

// Enable CORS for specific origin
const corsOptions = {
  origin: 'http://localhost:5000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies and authorization headers
  optionsSuccessStatus: 204, // Some legacy browsers (IE11, SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Importing Admin Routes
const adminAuthRoutes = require('./routes/admin/authRoutes');
const categoryRoutes = require('./routes/admin/categoryRoutes');
const productRoutes = require('./routes/admin/productRoutes');
const notificationRoutes = require('./routes/admin/notificationRoutes');
const homePageRoutes = require('./routes/admin/homePageRoutes');
const adminOrderRoutes = require('./routes/admin/orderRoutes');
const profileRoutes = require('./routes/admin/profileRoutes');
const adminReturnExchangeRoutes = require('./routes/admin/returnExchangeRoutes');
const userManagementRoutes = require('./routes/admin/userManageRoutes');
const adminBrandRoutes = require('./routes/admin/brandRoutes');

// Importing User Routes
const userRoutes = require('./routes/user/userRoutes');
const userHomePageRoutes = require('./routes/user/homePageRoutes');
const userCategoryRoutes = require('./routes/user/categoryRoutes');
const userProductRoutes = require('./routes/user/productRoutes');
const wishlistRoutes = require('./routes/user/wishlistRoutes');
const cartRoutes = require('./routes/user/cartRoutes');
const userOrderRoutes = require('./routes/user/orderRoutes');
const trackingRoutes = require('./routes/user/orderTrackingRoutes');
const userReturnExchangeRoutes = require('./routes/user/returnExchangeRoutes');
const userNotificationRoutes = require('./routes/user/notificationRoutes');
const userBrandRoutes = require('./routes/user/brandRoutes');

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Admin Routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/category', categoryRoutes);
app.use('/api/admin/products', productRoutes);
app.use('/api/admin/home-page', homePageRoutes);
app.use('/api/admin/notifications', notificationRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin', profileRoutes);
app.use('/api/admin/return-exchange', adminReturnExchangeRoutes);
app.use('/api/admin/user-management', userManagementRoutes);
app.use('/api/admin/brands', adminBrandRoutes);

// User Routes
app.use('/api/user', userRoutes);
app.use('/api/user/home-page', userHomePageRoutes);
app.use('/api/user/categories', userCategoryRoutes);
app.use('/api/user/products', userProductRoutes);
app.use('/api/user/wishlist', wishlistRoutes);
app.use('/api/user/cart', cartRoutes);
app.use('/api/user/orders', userOrderRoutes);
app.use('/api/user/tracking', trackingRoutes);
app.use('/api/user/return-exchange', userReturnExchangeRoutes);
app.use('/api/user/notifications', userNotificationRoutes);
app.use('/api/user/brands', userBrandRoutes);

// Connect to Database
connectDB();


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
