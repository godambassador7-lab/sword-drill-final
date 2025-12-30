# 🔗 Stripe Payment Link Setup Guide

This guide will walk you through creating a Stripe Payment Link for accepting donations.

## Step 1: Log into Stripe Dashboard

1. Go to https://dashboard.stripe.com
2. Log in with your Stripe account credentials
3. Make sure you're in **Live Mode** (toggle in top-right corner should show "LIVE")

## Step 2: Navigate to Payment Links

1. In the left sidebar, look for **"Payment links"** under the "Accept payments" section
2. Click on **"Payment links"**
3. You'll see a list of your payment links (if any exist)

## Step 3: Create New Payment Link

1. Click the **"+ New"** or **"Create payment link"** button
2. You'll see a form to configure your payment link

## Step 4: Configure Payment Link Settings

Fill in the following details:

### Product Details
- **Name**: `Sword Drill Donation`
- **Description**: `Support Sword Drill - Fuel the Fire of the Word. Your donation helps place Bibles into the hands of those seeking God's light and keeps this app alive.`
- **Image** (optional): Upload a logo or image for your donation page

### Pricing
- **Price**: Select **"Customers choose what to pay"**
- **Minimum amount**: $1.00 (or your preferred minimum)
- **Suggested amounts** (optional but recommended):
  - $5
  - $10
  - $25
  - $50
  - $100

### Payment Options
- ✅ Enable **Card payments** (Visa, Mastercard, Amex, etc.)
- ✅ Enable **Apple Pay** (if available)
- ✅ Enable **Google Pay** (if available)
- ✅ Enable **Link** (Stripe's one-click payment)
- (Optional) Enable other payment methods like ACH, Cash App, etc.

### After Payment
- **Success message**:
  ```
  🙏 Thank you for your generous donation!

  Your contribution helps spread God's Word and supports believers worldwide.
  May the Lord bless you abundantly for your faithfulness.
  ```
- **Redirect URL** (optional): Leave blank or set to your app URL

### Additional Settings
- **Collect customer's billing address**: Optional (recommended for tax purposes)
- **Collect customer's phone number**: Optional
- **Quantity**: Set to **1** (customers donate once per transaction)

## Step 5: Save and Get Your Payment Link

1. Review all settings
2. Click **"Create link"** button
3. Your Payment Link will be created instantly
4. You'll see a URL that looks like:
   ```
   https://donate.stripe.com/test_XXXXXXXXXX
   ```
   or (for live mode):
   ```
   https://buy.stripe.com/XXXXXXXXXX
   ```

## Step 6: Copy Your Payment Link

1. Click the **"Copy link"** button next to your new payment link
2. The URL is now in your clipboard

## Step 7: Update Your .env File

1. Open your `.env` file in the project root
2. Find the line:
   ```
   REACT_APP_STRIPE_PAYMENT_LINK=https://donate.stripe.com/YOUR_PAYMENT_LINK_HERE
   ```
3. Replace `https://donate.stripe.com/YOUR_PAYMENT_LINK_HERE` with your actual payment link
4. Example:
   ```
   REACT_APP_STRIPE_PAYMENT_LINK=https://buy.stripe.com/abc123xyz789
   ```
5. Save the file

## Step 8: Restart Your Development Server

If your app is running:
1. Stop the server (Ctrl+C)
2. Start it again:
   ```bash
   npm start
   ```

This ensures the new environment variable is loaded.

## Step 9: Test Your Donation Flow

1. Open your app in the browser
2. Navigate to the donation section
3. Click **"💳 Donate via Credit Card (Stripe)"**
4. You should be redirected to your Stripe Payment Link page
5. Test with a card:
   - **Test card** (if in test mode): `4242 4242 4242 4242`
   - **Expiry**: Any future date (e.g., 12/34)
   - **CVC**: Any 3 digits (e.g., 123)

## Step 10: Go Live (When Ready)

### In Test Mode First
1. Test thoroughly with test cards
2. Verify donations appear in your Stripe Dashboard
3. Check email confirmations work correctly

### Switch to Live Mode
1. In Stripe Dashboard, toggle to **"LIVE"** mode
2. Create a new Payment Link in LIVE mode (repeat steps above)
3. Update your `.env` file with the LIVE payment link
4. Deploy to production

## 🔐 Security Notes

- ✅ Your `.env` file is gitignored - API keys stay private
- ✅ Payment processing is handled entirely by Stripe (PCI compliant)
- ✅ No credit card data touches your server
- ✅ Stripe handles all security, fraud detection, and compliance

## 💰 Managing Donations

### View Donations
1. Go to https://dashboard.stripe.com/payments
2. See all successful payments and their details

### Export Donation Data
1. Go to https://dashboard.stripe.com/payments
2. Click **"Export"** to download CSV/Excel

### Set Up Payouts
1. Go to https://dashboard.stripe.com/settings/payouts
2. Connect your bank account
3. Configure payout schedule (daily, weekly, monthly)

## 📧 Email Receipts

Stripe automatically sends email receipts to donors. You can customize these:

1. Go to https://dashboard.stripe.com/settings/emails
2. Customize receipt templates
3. Add your logo and branding
4. Preview and save

## ❓ Troubleshooting

### "Payment link not configured" error
- Check that `.env` file has the correct payment link URL
- Restart your development server after updating `.env`
- Verify the URL doesn't contain `YOUR_PAYMENT_LINK_HERE`

### Payment link opens but doesn't work
- Ensure you're in the correct mode (test vs live)
- Check Stripe Dashboard for any errors
- Verify your account is fully set up

### Donations not showing in dashboard
- Make sure you're viewing the correct mode (test vs live)
- Check the date range filter in Stripe Dashboard

## 🆘 Support

- **Stripe Documentation**: https://stripe.com/docs/payment-links
- **Stripe Support**: https://support.stripe.com
- **Test Cards**: https://stripe.com/docs/testing

---

**That's it!** Your Stripe donation integration is now complete and ready to accept donations. 🎉
