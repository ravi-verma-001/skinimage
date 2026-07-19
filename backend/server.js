require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectDB, getDBMode } = require('./db');
const dbHelper = require('./dbHelper');
const { protect, adminOnly } = require('./authMiddleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// JWT Sign Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret_skincare_jwt_token_key_123!', {
    expiresIn: '30d',
  });
};

// Connect to Database and Seed
connectDB().then(() => {
  if (!getDBMode()) {
    dbHelper.seedMongoDB();
  }
});

// --- API ROUTES ---

// 1. AUTHENTICATION ENDPOINTS
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await dbHelper.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Make first registered user an admin automatically for easier testing
    // Or check if role is requested as admin (useful for user onboarding)
    const finalRole = role === 'admin' ? 'admin' : 'user';

    const user = await dbHelper.createUser({
      name,
      email,
      password: hashedPassword,
      role: finalRole,
    });

    res.status(201).json({
      _id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id || user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await dbHelper.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        addresses: user.addresses || [],
        wishlist: user.wishlist || [],
        token: generateToken(user._id || user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/auth/profile', protect, async (req, res) => {
  const user = await dbHelper.findUserById(req.user._id || req.user.id);
  if (user) {
    res.json({
      _id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      addresses: user.addresses || [],
      wishlist: user.wishlist || [],
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.put('/api/auth/profile', protect, async (req, res) => {
  try {
    const user = await dbHelper.findUserById(req.user._id || req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }
      if (req.body.addresses) {
        user.addresses = req.body.addresses;
      }
      if (req.body.wishlist) {
        user.wishlist = req.body.wishlist;
      }
      const updatedUser = await dbHelper.updateUser(user._id || user.id, user);
      res.json({
        _id: updatedUser._id || updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        addresses: updatedUser.addresses,
        wishlist: updatedUser.wishlist,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reset password mock
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await dbHelper.findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: 'No user registered with this email' });
  }
  res.json({ message: 'Password reset link sent (Simulated). Please check your inbox.' });
});

// 2. PRODUCT ENDPOINTS
app.get('/api/products', async (req, res) => {
  try {
    const { category, skinType, search, sortPrice, isFeatured, isBestSeller, isNewArrival } = req.query;
    const filters = {};
    if (category) filters.category = category;
    if (skinType) filters.skinType = skinType;
    if (search) filters.search = search;
    if (isFeatured === 'true') filters.isFeatured = true;
    if (isBestSeller === 'true') filters.isBestSeller = true;
    if (isNewArrival === 'true') filters.isNewArrival = true;

    const sort = {};
    if (sortPrice === 'asc') sort.price = 1;
    if (sortPrice === 'desc') sort.price = -1;
    if (sortPrice === 'rating') sort.rating = -1;

    const products = await dbHelper.findProducts(filters, sort);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await dbHelper.findProductById(req.params.id);
    if (product) {
      const reviews = await dbHelper.findReviewsByProduct(req.params.id);
      const productObj = product.toObject ? product.toObject() : { ...product };
      productObj.reviews = reviews;
      res.json(productObj);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin product control
app.post('/api/products', protect, adminOnly, async (req, res) => {
  try {
    const product = await dbHelper.saveProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/products/:id', protect, adminOnly, async (req, res) => {
  try {
    const productData = { ...req.body, id: req.params.id, _id: req.params.id };
    const updatedProduct = await dbHelper.saveProduct(productData);
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/products/:id', protect, adminOnly, async (req, res) => {
  try {
    const success = await dbHelper.deleteProduct(req.params.id);
    if (success) {
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. REVIEW ENDPOINTS
app.post('/api/reviews', protect, async (req, res) => {
  const { productId, rating, comment } = req.body;
  try {
    const review = await dbHelper.createReview({
      productId,
      userName: req.user.name,
      rating: Number(rating),
      comment,
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/reviews/product/:productId', async (req, res) => {
  try {
    const reviews = await dbHelper.findReviewsByProduct(req.params.productId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. ORDER ENDPOINTS
app.post('/api/orders', async (req, res) => {
  const { userId, guestInfo, items, shippingAddress, deliveryMethod, paymentMethod, couponApplied, totals } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items in order' });
  }
  try {
    // Generate simulated tracking number
    const trackingNumber = 'NX-' + Math.floor(100000 + Math.random() * 900000);
    
    // Set payment status (Online is simulated completed, COD is pending)
    const paymentStatus = paymentMethod === 'Online' ? 'Completed' : 'Pending';

    const order = await dbHelper.createOrder({
      userId,
      guestInfo,
      items,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      paymentStatus,
      couponApplied,
      totals,
      trackingNumber,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/orders/myorders', protect, async (req, res) => {
  try {
    const orders = await dbHelper.findOrders({ userId: req.user._id || req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await dbHelper.findOrderById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin update status
app.put('/api/orders/:id/status', protect, adminOnly, async (req, res) => {
  const { status, trackingNumber, paymentStatus } = req.body;
  try {
    const updates = {};
    if (status) updates.status = status;
    if (trackingNumber) updates.trackingNumber = trackingNumber;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const updatedOrder = await dbHelper.updateOrder(req.params.id, updates);
    if (updatedOrder) {
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin get all orders
app.get('/api/admin/orders', protect, adminOnly, async (req, res) => {
  try {
    const orders = await dbHelper.findOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. COUPON ENDPOINTS
app.get('/api/coupons/validate/:code', async (req, res) => {
  try {
    const coupon = await dbHelper.findCouponByCode(req.params.code);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found or invalid' });
    }
    // Check expiry
    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }
    // Check usage limits
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    res.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/coupons', protect, adminOnly, async (req, res) => {
  try {
    const coupons = await dbHelper.getCoupons();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/coupons', protect, adminOnly, async (req, res) => {
  const { code, discountType, discountValue, expiryDate, usageLimit } = req.body;
  try {
    const coupon = await dbHelper.saveCoupon({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      expiryDate: new Date(expiryDate),
      usageLimit: Number(usageLimit || 100),
      usageCount: 0,
    });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/coupons/:code', protect, adminOnly, async (req, res) => {
  try {
    await dbHelper.deleteCoupon(req.params.code);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 6. ADMIN ANALYTICS
app.get('/api/admin/analytics', protect, adminOnly, async (req, res) => {
  try {
    const orders = await dbHelper.findOrders();
    const products = await dbHelper.findProducts();
    
    // Calculate dashboard statistics
    const totalSales = orders
      .filter(o => o.status !== 'Cancelled' && o.paymentStatus === 'Completed')
      .reduce((sum, o) => sum + o.totals.grandTotal, 0);

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Placed' || o.status === 'Processing').length;
    const lowStockProducts = products.filter(p => p.stock < 10).length;

    // Simple sales breakdown by status
    const salesByStatus = {
      Placed: orders.filter(o => o.status === 'Placed').length,
      Processing: orders.filter(o => o.status === 'Processing').length,
      Shipped: orders.filter(o => o.status === 'Shipped').length,
      Delivered: orders.filter(o => o.status === 'Delivered').length,
      Cancelled: orders.filter(o => o.status === 'Cancelled').length,
    };

    res.json({
      totalSales: parseFloat(totalSales.toFixed(2)),
      totalOrders,
      pendingOrders,
      lowStockProducts,
      salesByStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 7. AI SKIN ANALYZER ENDPOINTS
const { analyzeSkin, getReports } = require('./skinAnalyzerController');

const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_skincare_jwt_token_key_123!');
      const user = await dbHelper.findUserById(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch (error) {
      console.warn("Optional auth token verification failed, continuing as guest.");
    }
  }
  next();
};

app.post('/api/skin-analyzer/analyze', optionalProtect, analyzeSkin);
app.get('/api/skin-analyzer/reports', protect, getReports);

// Add a startup test message
app.get('/', (req, res) => {
  res.send('NextSkin Premium Skincare REST API is Running.');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
