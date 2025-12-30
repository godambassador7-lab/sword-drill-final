# Stripe Donation Setup Instructions

## Your Stripe API Keys (Stored in .env)
Your Stripe API keys have been securely stored in the `.env` file, which is already in `.gitignore` to prevent them from being committed to GitHub.

The `.env` file contains:
- `REACT_APP_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `REACT_APP_STRIPE_SECRET_KEY` - Your Stripe secret key (for backend use only)

**IMPORTANT:** Never commit the `.env` file or share these keys publicly!

## Setup Steps

### 1. Install Stripe Dependencies

The Stripe packages have been added to `package.json`:
- `@stripe/stripe-js`: ^4.13.0
- `@stripe/react-stripe-js`: ^2.10.0

**To install them**, open your terminal/command prompt in the project directory and run:
```bash
npm install
```

**Note**: If you encounter "npm not found" error, you may need to:
1. Open a new terminal window (to refresh PATH)
2. Or run from VS Code's integrated terminal
3. Or use `npx` if npm is installed via Node.js

This will install the Stripe packages that have been added to `package.json`.

### 2. Create a Stripe Payment Link
To enable donations via Stripe, you need to create a Payment Link in your Stripe Dashboard:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Log in with your Stripe account
3. Navigate to **Payment Links** (in the left sidebar under "Accept Payments")
4. Click **"+ New"** to create a new Payment Link
5. Configure your payment link:
   - **Name**: "Sword Drill Donation"
   - **Amount**: Choose "Customer chooses" to allow any amount
   - **Suggested amounts** (optional): $5, $10, $25, $50, $100
   - **Description**: "Support Sword Drill - Fuel the Fire of the Word"
   - **Success message**: "Thank you for your generous donation!"
6. Click **"Create link"**
7. Copy the Payment Link URL (it will look like: `https://donate.stripe.com/XXXXXXXXXX`)

### 3. Update the Code
Once you have your Stripe Payment Link:

1. Open `src/App.js`
2. Find line 8743 (the Stripe donation button)
3. Replace `'https://donate.stripe.com/YOUR_PAYMENT_LINK_HERE'` with your actual Payment Link URL

Example:
```javascript
window.open('https://donate.stripe.com/test_dR6dRWc3s8ik6CA7ss', '_blank');
```

### 4. Test the Integration
1. Start your development server: `npm start`
2. Navigate to the donation section in your app
3. Click the **"💳 Donate via Credit Card (Stripe)"** button
4. Verify it opens your Stripe Payment Link
5. Make a test donation to ensure everything works

## Security Notes

✅ **Your API keys are secure:**
- Stored in `.env` file (not tracked by Git)
- `.env` is already in `.gitignore`
- Keys will never be committed to your repository

⚠️ **Important:**
- **NEVER** commit your `.env` file to GitHub
- **NEVER** share your Secret Key publicly
- The Secret Key should only be used on your server (backend)
- For this frontend implementation, we're only using the Publishable Key indirectly through the Payment Link

## Alternative: Full Stripe Checkout Integration
If you want a more integrated checkout experience (instead of redirecting to a Payment Link), you can:

1. Set up a backend server to handle Stripe payments
2. Use Stripe Checkout Sessions
3. Implement the full `@stripe/react-stripe-js` integration

This requires more setup but provides a seamless in-app checkout experience.

## Support
If you need help with Stripe setup:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Payment Links Guide](https://stripe.com/docs/payment-links)
- [Stripe Support](https://support.stripe.com)
