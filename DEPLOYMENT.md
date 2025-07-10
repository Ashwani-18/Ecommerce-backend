# Vercel Deployment Guide

This guide will help you deploy your e-commerce application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
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

## Step 3: Deploy Backend API

### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the backend:
   ```bash
   cd /path/to/your/project
   vercel
   ```

4. Set environment variables in Vercel dashboard:
   - `MONGOOSE_URL`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret
   - `PORT`: 8000 (or let Vercel set it automatically)

### Option B: Deploy via GitHub Integration

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## Step 4: Deploy Frontend

### Option A: Deploy via Vercel CLI

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Deploy frontend:
   ```bash
   vercel
   ```

3. Set environment variables:
   - `REACT_APP_RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `REACT_APP_API_URL`: Your backend API URL (e.g., https://your-backend.vercel.app)

### Option B: Deploy via GitHub Integration

1. Create a separate repository for frontend or use a subdirectory
2. Connect to Vercel
3. Set environment variables
4. Deploy

## Step 5: Update Frontend Configuration

After deploying the backend, update your frontend's API calls to use the production URL:

1. Update `frontend/package.json`:
   ```json
   {
     "proxy": "https://your-backend-domain.vercel.app"
   }
   ```

2. Or update individual API calls to use the full URL:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-domain.vercel.app';
   ```

## Step 6: Test Your Deployment

1. Test user registration/login
2. Test product browsing
3. Test cart functionality
4. Test payment integration
5. Test order placement

## Environment Variables Summary

### Backend (.env)
```
PORT=8000
MONGOOSE_URL=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
JWT_SECRET=your_secure_jwt_secret
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Frontend (.env)
```
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_key_id
REACT_APP_API_URL=https://your-backend-domain.vercel.app
```

## Troubleshooting

1. **CORS Issues**: Ensure your backend CORS configuration allows your frontend domain
2. **Database Connection**: Verify MongoDB Atlas network access settings
3. **Environment Variables**: Double-check all environment variables are set correctly
4. **API Endpoints**: Ensure all API endpoints are working in production

## Security Notes

1. Never commit `.env` files to version control
2. Use strong, unique JWT secrets
3. Keep your Razorpay keys secure
4. Enable MongoDB Atlas security features

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Check browser console for frontend errors 