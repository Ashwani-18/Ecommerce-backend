const express = require("express");
const connectDB = require("./config/Database");
const cookieParser = require("cookie-parser"); // ✅ Add this
const CreateCategoryRoute = require("./routes/CreateCategoryRoute")
const productRoute = require('./routes/productRoutes')
const CartRoutes = require('./routes/CartRoutes')
const PaymentRoute = require('./routes/PaymentRoutes')
const cors = require('cors')
const OrderRoute = require('./routes/OrderRoute')
require("dotenv").config();

const authRoute = require("./routes/authRoute");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); 
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://ecom-fron-rcogpr7so-ashwanirajput18000-1184s-projects.vercel.app'] 
    : ['http://localhost:3000'],
  credentials: true
}))

// Connect to DB
connectDB();

// Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', CreateCategoryRoute)
app.use('/api/v1/product',productRoute)
app.use('/api/v1/cart', CartRoutes)
app.use('/api/v1/payment', PaymentRoute)
app.use('/api/v1/order', OrderRoute);


// Default route
app.get('/', (req, res) => {
  res.send({
    message: "Welcome to ecommerce platform"
  });
});



// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
