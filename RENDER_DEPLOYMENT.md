# Render Deployment Guide

This guide will help you deploy your e-commerce application to Render.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **MongoDB Atlas**: Set up a cloud database at [mongodb.com](https://mongodb.com)
3. **Razorpay Account**: Set up payment gateway at [razorpay.com](https://razorpay.com)
4. **GitHub Repository**: Push your code to GitHub

## Step 1: Set Up MongoDB Atlas

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace `your_username`, `your_password`, and `your_cluster` in the connection string

## Step 2: Set Up Razorpay

1. Create a Razorpay account
2. Get your API keys from the dashboard
3. Note down your `Key ID` and `Key Secret`

## Step 3: Deploy to Render

### Option A: Deploy via render.yaml (Recommended)

1. **Push your code to GitHub** with the `render.yaml` file

2. **Connect to Render**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Set Environment Variables**:
   - In the Render dashboard, go to your backend service
   - Navigate to "Environment" tab
   - Add the following variables:
     - `MONGOOSE_URL`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A secure random string
     - `RAZORPAY_KEY_ID`: Your Razorpay Key ID
     - `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret

4. **Deploy**:
   - Click "Create Blueprint Instance"
   - Render will deploy both backend and frontend

### Option B: Manual Deployment

#### Deploy Backend First:

1. **Create Web Service**:
   - Go to Render dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Backend**:
   - **Name**: `ecommerce-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

3. **Set Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGOOSE_URL`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret

4. **Deploy Backend**

#### Deploy Frontend:

1. **Create Static Site**:
   - Go to Render dashboard
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

2. **Configure Frontend**:
   - **Name**: `ecommerce-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Plan**: Free

3. **Set Environment Variables**:
   - `REACT_APP_API_URL`: `https://your-backend-name.onrender.com`
   - `REACT_APP_RAZORPAY_KEY_ID`: Your Razorpay Key ID

4. **Deploy Frontend**

## Step 4: Update CORS Configuration

After deployment, update the CORS configuration in your backend:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-name.onrender.com'] 
    : ['http://localhost:3000'],
  credentials: true
}))
```

## Step 5: Test Your Deployment

1. Test user registration/login
2. Test product browsing
3. Test cart functionality
4. Test payment integration
5. Test order placement

## Environment Variables Summary

### Backend Environment Variables
```
NODE_ENV=production
PORT=10000
MONGOOSE_URL=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
JWT_SECRET=your_secure_jwt_secret
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Frontend Environment Variables
```
REACT_APP_API_URL=https://your-backend-name.onrender.com
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

## Render-Specific Features

1. **Auto-Deploy**: Render automatically deploys when you push to your main branch
2. **Custom Domains**: You can add custom domains to your services
3. **SSL Certificates**: Automatic SSL certificates for HTTPS
4. **Logs**: Real-time logs in the Render dashboard
5. **Health Checks**: Automatic health checks for your services

## Troubleshooting

1. **Build Failures**: Check the build logs in Render dashboard
2. **Environment Variables**: Ensure all variables are set correctly
3. **Database Connection**: Verify MongoDB Atlas network access
4. **CORS Issues**: Check that frontend URL is correctly set in CORS
5. **Port Issues**: Render uses port 10000 by default

## Security Notes

1. Never commit `.env` files to version control
2. Use strong, unique JWT secrets
3. Keep your Razorpay keys secure
4. Enable MongoDB Atlas security features

## Support

If you encounter issues:
1. Check Render deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Check browser console for frontend errors
5. Review Render documentation at [render.com/docs](https://render.com/docs) 