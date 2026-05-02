# EmailJS Setup Guide - Sangha Auto Detailing

## Overview
The website now uses **EmailJS** to send booking and contact form emails directly to your inbox. This is a FREE service that requires no backend server!

## How It Works
When visitors submit a booking or contact form, an email is automatically sent to: **sanghaautodetailing@gmail.com**

---

## ✅ Setup Steps (5 minutes)

### Step 1: Create an EmailJS Account
1. Go to https://www.emailjs.com/
2. Click **Sign Up** (or Sign In if you already have an account)
3. Create an account using your email (sanghaautodetailing@gmail.com recommended)
4. Verify your email address

### Step 2: Create an Email Service
1. After login, go to **Email Services** (left sidebar)
2. Click **Add Service**
3. Choose **Gmail** as the service provider
4. Click **Connect with Gmail**
5. Login with your Gmail account and authorize EmailJS
6. A **Service ID** will be generated (e.g., `service_abc123`)

### Step 3: Create an Email Template
1. Go to **Email Templates** (left sidebar)
2. Click **Create New Template**
3. Name it: **template_sangha_booking**
4. In the template editor, paste this code:

```
Subject: New Booking Request from {{from_name}}

From: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

Service: {{service}}
Date: {{date}}
Time: {{time}}
Address: {{address}}

Message:
{{message}}

Cart Items: {{cart_items}}
Total: {{total}}

---
This email was sent from your Sangha Auto Detailing website.
```

5. Click **Save**

### Step 4: Get Your Public Key
1. Go to **Account** (top right menu) → **API Keys**
2. Copy your **Public Key** (shown as a long string)
3. Keep this private!

### Step 5: Update Your Website
1. Open `js/script.js` in your code editor
2. Find this line (around line 9):
   ```javascript
   emailjs.init("YOUR_PUBLIC_KEY_HERE");
   ```
3. Replace `YOUR_PUBLIC_KEY_HERE` with your actual Public Key from Step 4
4. **Save the file**

---

## 🎯 Verify It's Working

1. Go to your website (index.html)
2. Scroll down to the **"Book Your Detail Instantly"** section
3. Fill out the quick booking form with test data:
   - Name: Test User
   - Email: your-email@gmail.com
   - Phone: (647) 323-9286
   - Service: Premium Detail
4. Click **Confirm Booking**
5. Check your email inbox for the booking confirmation

---

## 📧 Email Formats

### Quick Booking Form (on index.html)
Sends to: **sanghaautodetailing@gmail.com**
- Name, Email, Phone, Service

### Full Booking Form (on book.html)
Sends to: **sanghaautodetailing@gmail.com**
- All booking details + cart items + total price

### Contact Form (if available)
Sends to: **sanghaautodetailing@gmail.com**
- Name, Email, Phone, Message

---

## ⚠️ Troubleshooting

### "Email not sending"
- ✓ Check that Service ID is correct in `js/script.js`
- ✓ Verify Gmail is properly connected in EmailJS
- ✓ Check browser console for errors (F12 → Console tab)

### "Only getting emails from one service"
- EmailJS limits free tier to 200 emails/month
- Upgrade to paid plan if needed

### "Template not working"
- Verify template name is exactly: `template_sangha_booking`
- Check that all placeholders {{}} match the template variables

---

## 📝 Email Service ID & Template ID

Once set up, you can also customize by using specific Service ID and Template ID.
In `js/script.js`, line ~115, you'll see:
```javascript
return emailjs.send('gmail', 'template_sangha_booking', {
```

- `'gmail'` = Your Service ID (change if different)
- `'template_sangha_booking'` = Your Template Name (change if different)

---

## 🔐 Security Notes
- Your Public Key is safe to have in client-side code
- Private keys should NEVER be exposed
- EmailJS handles all security
- Emails are rate-limited to prevent abuse

---

## 💡 Customize Email Address

To send emails to a different address, edit `js/script.js` line 8:
```javascript
const ownerEmail = "newemail@example.com";
```

---

## Need Help?
- EmailJS Support: https://www.emailjs.com/docs/
- Check browser console (F12) for error messages
- Verify your Public Key is correct

---

**Your website is now ready to receive emails! 🎉**
