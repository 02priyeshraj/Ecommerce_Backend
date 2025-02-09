require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

//Importing Admin Routes
const adminAuthRoutes = require('./routes/admin/authRoutes');
const categoryRoutes = require('./routes/admin/categoryRoutes');
const productRoutes = require('./routes/admin/productRoutes');
const notificationRoutes = require('./routes/admin/notificationRoutes');
const homePageRoutes = require('./routes/admin/homePageRoutes');
const adminOrderRoutes = require('./routes/admin/orderRoutes');
const adminUserRoutes = require('./routes/admin/adminUserRoutes');
const profileRoutes = require('./routes/admin/profileRoutes');
const adminReturnExchangeRoutes = require('./routes/admin/returnExchangeRoutes');
const userManagementRoutes = require('./routes/admin/userManageRoutes');


//Importing User Routes
const userRoutes = require('./routes/user/userRoutes');
const userHomePageRoutes = require('./routes/user/homePageRoutes');
const userProductRoutes = require('./routes/user/productRoutes');
const wishlistRoutes = require('./routes/user/wishlistRoutes');
const cartRoutes = require('./routes/user/cartRoutes');
const userOrderRoutes = require('./routes/user/orderRoutes');
const trackingRoutes = require('./routes/user/orderTrackingRoutes');
const userReturnExchangeRoutes = require('./routes/user/returnExchangeRoutes');
const userNotificationRoutes = require('./routes/user/notificationRoutes');


// Initialize Express
const app = express();

// Middleware
app.use(express.json());

// Admin Routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/category', categoryRoutes);
app.use('/api/admin/products', productRoutes);
app.use('/api/admin/home-page', homePageRoutes);
app.use('/api/admin/notifications', notificationRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin', adminUserRoutes);
app.use('/api/admin', profileRoutes);
app.use('/api/admin/return-exchange', adminReturnExchangeRoutes);
app.use('/api/admin/user-management', userManagementRoutes);

//User Routes
app.use('/api/user', userRoutes);
app.use('/api/user/home-page', userHomePageRoutes);
app.use('/api/user/products', userProductRoutes);
app.use('/api/user/wishlist', wishlistRoutes);
app.use('/api/user/cart', cartRoutes);
app.use('/api/user/orders', userOrderRoutes);
app.use('/api/user/tracking', trackingRoutes);
app.use('/api/user/return-exchange', userReturnExchangeRoutes);
app.use('/api/user/notifications', userNotificationRoutes);




// Connect to Database
connectDB();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
