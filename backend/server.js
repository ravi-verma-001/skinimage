require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB, getDBMode } = require('./db');
const dbHelper = require('./dbHelper');
const { protect, adminOnly } = require('./authMiddleware');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy_client_id');
const https = require('https');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

function httpsRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const requestOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = https.request(requestOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          text: async () => body,
          json: async () => {
            try {
              return JSON.parse(body);
            } catch (e) {
              return { error: 'Failed to parse JSON', raw: body };
            }
          }
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

const app = express();
app.set('trust proxy', 1);

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rate Limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// JWT Sign Helper storing only essential info: User ID, Email, Role
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id || user.id, 
      email: user.email, 
      role: user.role 
    }, 
    process.env.JWT_SECRET || 'supersecret_skincare_jwt_token_key_123!', 
    { expiresIn: '24h' }
  );
};

// Connect to Database and Seed
connectDB().then(() => {
  if (!getDBMode()) {
    dbHelper.seedMongoDB();
  }
});

// --- API ROUTES ---

// 1. AUTHENTICATION ENDPOINTS
app.post('/api/auth/register', authLimiter, async (req, res) => {
  const { name, email, password } = req.body;
  if (!password || password.trim().length === 0) {
    return res.status(400).json({ message: 'Password is required for email registration' });
  }
  const normalizedEmail = email ? email.toLowerCase().trim() : '';
  try {
    const userExists = await dbHelper.findUserByEmail(normalizedEmail);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Enforce role as 'user' for public signup
    const finalRole = 'user';

    const user = await dbHelper.createUser({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: finalRole,
    });

    res.status(201).json({
      _id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email ? email.toLowerCase().trim() : '';
  try {
    const user = await dbHelper.findUserByEmail(normalizedEmail);
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        addresses: user.addresses || [],
        wishlist: user.wishlist || [],
        token: generateToken(user),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GOOGLE AUTHENTICATION ENDPOINT
app.post('/api/auth/google', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ message: 'Google ID Token is required' });
  }

  try {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    let email, name, picture, googleId;

    if (!GOOGLE_CLIENT_ID || idToken.startsWith('mock_google_token_')) {
      console.warn('Using simulated Google verification mode.');
      
      // Fallback/Mock Mode if GOOGLE_CLIENT_ID is missing or token is simulated
      email = 'google_user@example.com';
      name = 'Google User';
      googleId = 'google_id_123456';
      picture = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';

      if (idToken.startsWith('mock_google_token_')) {
        const parts = idToken.split('_');
        googleId = parts[2] || googleId;
        email = parts[3] || email;
        name = parts[4] ? parts[4].replace(/-/g, ' ') : name;
      }
    } else {
      // Real token verification via Google Identity API
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) {
        return res.status(400).json({ message: 'Invalid Google ID Token payload' });
      }
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
      googleId = payload.sub;
    }

    const normalizedEmail = email ? email.toLowerCase().trim() : '';

    let user = await dbHelper.findUserByEmail(normalizedEmail);
    if (user) {
      // Connect local account if they log in via Google for the first time
      if (user.provider !== 'google') {
        await dbHelper.updateUser(user._id || user.id, {
          provider: 'google',
          googleId: googleId,
          avatar: picture || user.avatar
        });
        user.provider = 'google';
        user.googleId = googleId;
        user.avatar = picture || user.avatar;
      }
    } else {
      // Create a brand new user
      user = await dbHelper.createUser({
        name,
        email: normalizedEmail,
        provider: 'google',
        googleId,
        avatar: picture || ''
      });
    }

    const token = generateToken(user);

    // Save token as HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({
      _id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || '',
      addresses: user.addresses || [],
      wishlist: user.wishlist || [],
      token
    });
  } catch (err) {
    console.error('Google verification error:', err);
    res.status(400).json({ message: 'Google authentication failed: ' + err.message });
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
        const salt = await bcrypt.genSalt(12);
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

// FORGOT PASSWORD
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email address is required' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await dbHelper.findUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(404).json({ message: 'No account registered with this email' });
    }

    // Generate secure random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save token and expiry
    await dbHelper.updateUser(user._id || user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires
    });

    // Determine domain origin dynamically
    const clientOrigin = req.headers.referer 
      ? new URL(req.headers.referer).origin 
      : 'http://localhost:3000';
      
    const resetUrl = `${clientOrigin}/reset-password?token=${resetToken}`;

    // Resend configuration
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_FROM = process.env.RESEND_FROM || 'onboarding@resend.dev';

    if (RESEND_API_KEY) {
      try {
        // Send real email via Resend HTTP API
        const resendRes = await httpsRequest('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          }
        }, {
          from: RESEND_FROM,
          to: normalizedEmail,
          subject: 'NextSkin - Password Reset Request',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h2 style="font-family: serif; color: #047857; text-align: center;">NextSkin</h2>
              <hr style="border-top: 1px solid #e5e7eb; margin: 20px 0;"/>
              <p>Hello ${user.name || 'Valued Customer'},</p>
              <p>We received a request to reset your password. Click the button below to set a new password. This link is valid for 15 minutes:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">Reset Password</a>
              </div>
              <p style="font-size: 12px; color: #6b7280; text-align: center;">
                If you didn't request this, you can ignore this email safely.
              </p>
            </div>
          `
        });

        const resendData = await resendRes.json();
        if (!resendRes.ok) {
          throw new Error(resendData.message || 'Resend API failed to dispatch email');
        }

        res.json({ message: 'Password reset link has been sent to your email.' });
      } catch (emailErr) {
        console.error('Email dispatch failed, falling back to mock response:', emailErr);
        res.json({
          message: `Email delivery failed (${emailErr.message}). Copy this link to reset your password: ${resetUrl}`,
          resetUrl
        });
      }
    } else {
      // Fallback/Mock mode if Resend is missing
      console.warn('----------------------------------------');
      console.warn('RESEND_API_KEY NOT CONFIGURED. MOCKING PASSWORD RESET EMAIL.');
      console.warn(`RESET LINK: ${resetUrl}`);
      console.warn('----------------------------------------');
      res.json({ 
        message: 'Password reset link sent (Simulated). Please copy the link from the server console: ' + resetUrl,
        resetUrl
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: error.message });
  }
});

// RESET PASSWORD
app.post('/api/auth/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    const user = await dbHelper.findUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save and clear token fields
    await dbHelper.updateUser(user._id || user.id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined
    });

    res.json({ message: 'Your password has been successfully reset! You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: error.message });
  }
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
const badWords = ['spam', 'scam', 'fake', 'abuse', 'shit', 'fucking', 'fuck', 'bastard', 'bitch', 'asshole'];
function filterProfanity(text) {
  let filtered = text;
  badWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filtered = filtered.replace(regex, '***');
  });
  return filtered;
}

app.post('/api/reviews', async (req, res) => {
  const { productId, rating, comment, website, email_confirm, orderId } = req.body;
  let { email, userName } = req.body;

  // Honeypot spam trap check
  if (website || email_confirm) {
    return res.status(201).json({ message: 'Thank you! Your review will appear after moderation.' });
  }

  // Input validation
  if (!productId || !rating || !comment) {
    return res.status(400).json({ message: 'Product ID, rating, and comment are required.' });
  }
  const ratingNum = Number(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
  }
  if (comment.trim().length < 3) {
    return res.status(400).json({ message: 'Comment must be at least 3 characters long.' });
  }

  try {
    let user;
    // Check if authorization token is provided for logged-in user
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_skincare_jwt_token_key_123!');
        user = await dbHelper.findUserById(decoded.id);
        if (user) {
          email = user.email;
          userName = user.name;
        }
      } catch (err) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }

    if (!email || !userName) {
      if (!email || !userName) {
        return res.status(400).json({ message: 'Name and Email are required for submitting a review.' });
      }
    }

    // Verify Purchase Check
    let isVerifiedPurchase = false;
    if (dbHelper.getDBMode()) {
      // Local JSON DB Verification
      const data = dbHelper.readLocalDB();
      const matchedOrders = data.orders.filter(o => 
        (user && o.userId === user.id) || 
        (o.guestInfo && o.guestInfo.email && o.guestInfo.email.toLowerCase() === email.toLowerCase()) ||
        (orderId && (o.id === orderId || o._id === orderId))
      );
      isVerifiedPurchase = matchedOrders.some(o => 
        o.status === 'Delivered' && 
        o.items.some(item => item.productId === productId)
      );
    } else {
      // MongoDB Verification
      const query = {
        status: 'Delivered',
        'items.productId': productId,
        $or: []
      };
      if (user) {
        query.$or.push({ userId: user._id.toString() });
      }
      query.$or.push({ 'guestInfo.email': email.toLowerCase() });
      if (orderId) {
        if (mongoose.Types.ObjectId.isValid(orderId)) {
          query.$or.push({ _id: new mongoose.Types.ObjectId(orderId) });
        } else {
          query.$or.push({ _id: orderId });
        }
      }
      if (query.$or.length === 0) delete query.$or;

      const orderCount = await dbHelper.Order.countDocuments(query);
      isVerifiedPurchase = orderCount > 0;
    }

    const cleanComment = filterProfanity(comment);

    const review = await dbHelper.createReview({
      productId,
      userName,
      email: email.toLowerCase(),
      rating: ratingNum,
      comment: cleanComment,
      isVerifiedPurchase,
      isApproved: false
    });

    res.status(201).json({ 
      message: 'Thank you! Your review will appear after moderation.',
      review 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// Admin Review Moderation Endpoints
app.get('/api/admin/reviews', protect, adminOnly, async (req, res) => {
  try {
    const reviews = await dbHelper.getAllReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/reviews/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const review = await dbHelper.approveReview(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review approved successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/reviews/:id', protect, adminOnly, async (req, res) => {
  try {
    const success = await dbHelper.deleteReview(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted/rejected successfully' });
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
    
    // Set payment status (Online is pending till verified, COD is pending)
    const paymentStatus = 'Pending';

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

    let paymentSessionId = null;
    let cfOrderId = null;

    if (paymentMethod === 'Online') {
      try {
        const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID;
        const CASHFREE_CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET;
        const CASHFREE_ENV = process.env.CASHFREE_ENV || 'sandbox';

        let customerEmail = 'guest@example.com';
        let customerPhone = '9999999999';
        let customerName = 'Guest User';

        if (userId) {
          const user = await dbHelper.findUserById(userId);
          if (user) {
            customerEmail = user.email || customerEmail;
            customerPhone = user.phone || customerPhone;
            customerName = user.name || customerName;
          }
        } else if (guestInfo) {
          customerEmail = guestInfo.email || customerEmail;
          customerPhone = guestInfo.phone || customerPhone;
          customerName = guestInfo.name || customerName;
        }

        // Clean phone number: Cashfree requires numeric and at least 10 digits
        let cleanPhone = customerPhone.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
          cleanPhone = '9999999999';
        } else if (cleanPhone.length > 10) {
          cleanPhone = cleanPhone.slice(-10);
        }

        if (CASHFREE_CLIENT_ID && CASHFREE_CLIENT_SECRET) {
          const cashfreeUrl = CASHFREE_ENV === 'production' 
            ? 'https://api.cashfree.com/pg/orders' 
            : 'https://sandbox.cashfree.com/pg/orders';

          const cfPayload = {
            order_amount: parseFloat(order.totals.grandTotal.toFixed(2)),
            order_currency: 'INR',
            order_id: order._id.toString(),
            customer_details: {
              customer_id: userId ? userId.toString() : 'guest_' + Date.now(),
              customer_name: customerName,
              customer_email: customerEmail,
              customer_phone: cleanPhone
            },
            order_meta: {
              return_url: `${req.headers.origin || 'http://localhost:3000'}/checkout/verify?order_id={order_id}`
            }
          };

          const response = await httpsRequest(cashfreeUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-version': '2023-08-01',
              'x-client-id': CASHFREE_CLIENT_ID,
              'x-client-secret': CASHFREE_CLIENT_SECRET
            }
          }, cfPayload);

          if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Cashfree PG API Error: ${response.status} - ${errText}`);
          }

          const cfData = await response.json();
          paymentSessionId = cfData.payment_session_id;
          cfOrderId = cfData.cf_order_id;

          // Update MongoDB order with payment session details
          await dbHelper.updateOrder(order._id.toString(), {
            paymentDetails: {
              paymentSessionId: paymentSessionId,
              cfOrderId: String(cfOrderId),
              status: 'Created',
              environment: CASHFREE_ENV
            }
          });

          // Inject details to return in HTTP response
          order.paymentDetails = {
            paymentSessionId: paymentSessionId,
            cfOrderId: String(cfOrderId),
            status: 'Created',
            environment: CASHFREE_ENV
          };
        } else {
          console.warn('CASHFREE KEYS NOT CONFIGURED IN .env. RUNNING IN MOCK MODE.');
          paymentSessionId = 'mock_session_' + Math.random().toString(36).substring(2, 15);
          cfOrderId = 'mock_cf_' + Math.floor(100000 + Math.random() * 900000);

          await dbHelper.updateOrder(order._id.toString(), {
            paymentDetails: {
              paymentSessionId: paymentSessionId,
              cfOrderId: String(cfOrderId),
              status: 'MockCreated',
              environment: 'sandbox'
            }
          });

          order.paymentDetails = {
            paymentSessionId: paymentSessionId,
            cfOrderId: String(cfOrderId),
            status: 'MockCreated',
            environment: 'sandbox'
          };
        }
      } catch (err) {
        console.error('Error creating Cashfree order:', err);
        try {
          await dbHelper.updateOrder(order._id.toString(), {
            status: 'Cancelled',
            paymentStatus: 'Failed',
            paymentDetails: {
              status: 'Failed',
              error: err.message
            }
          });
        } catch (dbErr) {
          console.error('Failed to cancel order in DB:', dbErr);
        }
        return res.status(400).json({ message: 'Payment gateway initialization failed: ' + err.message });
      }
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// VERIFY CASHFREE PAYMENT STATUS
app.post('/api/orders/verify-payment', async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required' });
  }

  try {
    const order = await dbHelper.findOrderById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentMethod !== 'Online') {
      return res.json({ success: true, status: 'COD' });
    }

    // Check if the order is already marked Completed
    if (order.paymentStatus === 'Completed') {
      return res.json({ success: true, status: 'Completed' });
    }

    const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID;
    const CASHFREE_CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET;
    const CASHFREE_ENV = process.env.CASHFREE_ENV || 'sandbox';

    if (CASHFREE_CLIENT_ID && CASHFREE_CLIENT_SECRET) {
      const cashfreeUrl = CASHFREE_ENV === 'production'
        ? `https://api.cashfree.com/pg/orders/${orderId}`
        : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

      const response = await httpsRequest(cashfreeUrl, {
        method: 'GET',
        headers: {
          'x-api-version': '2023-08-01',
          'x-client-id': CASHFREE_CLIENT_ID,
          'x-client-secret': CASHFREE_CLIENT_SECRET
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Cashfree Order Status API Error: ${response.status} - ${errText}`);
      }

      const cfData = await response.json();

      if (cfData.order_status === 'PAID') {
        await dbHelper.updateOrder(orderId, {
          paymentStatus: 'Completed',
          status: 'Placed',
          paymentDetails: {
            ...Object.fromEntries(order.paymentDetails || new Map()),
            status: 'Paid',
            cfPaymentId: String(cfData.cf_payment_id || ''),
            paymentMessage: 'Paid successfully via Cashfree'
          }
        });
        return res.json({ success: true, status: 'Completed' });
      } else {
        await dbHelper.updateOrder(orderId, {
          paymentStatus: 'Failed',
          paymentDetails: {
            ...Object.fromEntries(order.paymentDetails || new Map()),
            status: cfData.order_status,
            paymentMessage: 'Payment was not success. Cashfree status: ' + cfData.order_status
          }
        });
        return res.json({ success: false, status: cfData.order_status });
      }
    } else {
      // Mock flow: If keys are missing, simulate success for testing
      console.warn('CASHFREE KEYS NOT CONFIGURED. MOCK VERIFYING PAYMENT SUCCESS.');
      await dbHelper.updateOrder(orderId, {
        paymentStatus: 'Completed',
        status: 'Placed',
        paymentDetails: {
          ...Object.fromEntries(order.paymentDetails || new Map()),
          status: 'Paid',
          paymentMessage: 'Mock verified'
        }
      });
      return res.json({ success: true, status: 'Completed', mock: true });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: error.message });
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

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Health check passed', timestamp: new Date() });
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
