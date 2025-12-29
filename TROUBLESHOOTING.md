# Troubleshooting 500 Internal Server Error

## Common Causes & Solutions

### 1. MongoDB Connection Issues

**Symptoms:**
- 500 error when submitting quiz answers
- Console shows "MongoDB connection error"

**Solutions:**

#### Check MongoDB Atlas IP Whitelist
1. Go to MongoDB Atlas dashboard
2. Click **Network Access** (left sidebar)
3. Make sure your IP is added
4. Or temporarily click **"Allow Access from Anywhere"** (for testing)

#### Verify Connection String
Check your `.env.local` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ces_quiz?retryWrites=true&w=majority
```

**Common issues:**
- ❌ Missing `/ces_quiz` database name
- ❌ Wrong password
- ❌ Special characters in password need URL encoding
- ❌ Missing `?retryWrites=true&w=majority`

#### Test Connection
```bash
# Restart dev server
npm run dev

# Check console for:
# ✅ Connected to MongoDB = Good!
# ❌ MongoDB connection error = Check connection string
```

---

### 2. Missing Environment Variables

**Symptoms:**
- 500 error immediately
- Console shows "MONGODB_URI not configured"

**Solution:**
1. Check `.env.local` exists in project root
2. Verify it contains:
   ```env
   MONGODB_URI=your_connection_string
   SESSION_SECRET=your_secret
   ```
3. Restart dev server after adding variables

---

### 3. Database Collections Not Created

**Symptoms:**
- 500 error when submitting answers
- Error mentions "collection not found"

**Solution:**
- MongoDB creates collections automatically
- Just try registering/submitting again
- Collections will be created on first use

---

### 4. Question Validation Error

**Symptoms:**
- 500 error when submitting quiz answer
- Error about "Invalid question number"

**Solution:**
1. Clear browser cache
2. Refresh the page
3. Start a new quiz session
4. The random question selection should work

---

### 5. Session Cookie Issues

**Symptoms:**
- 500 error with "Session not found"
- Can't submit answers

**Solution:**
1. Clear browser cookies
2. Register again
3. Make sure cookies are enabled in browser

---

## Debugging Steps

### Step 1: Check Server Logs
Look at your terminal/console where `npm run dev` is running:
- Look for error messages
- Check MongoDB connection status
- Note the exact error message

### Step 2: Check Browser Console
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for error messages
4. Go to **Network** tab
5. Click on the failed request
6. Check **Response** tab for error details

### Step 3: Verify MongoDB Connection
```bash
# Test MongoDB connection string format
# Should look like:
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ces_quiz?retryWrites=true&w=majority
```

### Step 4: Test Database Connection
Try connecting with MongoDB Compass:
1. Open MongoDB Compass
2. Paste your connection string
3. Replace password
4. Click Connect
5. If it works → Connection string is correct
6. If it fails → Check IP whitelist

---

## Quick Fixes

### Fix 1: Restart Everything
```bash
# Stop dev server (Ctrl+C)
# Then restart:
npm run dev
```

### Fix 2: Clear and Re-register
1. Clear browser cookies
2. Go to http://localhost:3000
3. Register again
4. Try quiz

### Fix 3: Check MongoDB Atlas
1. Go to https://cloud.mongodb.com
2. Check cluster status (should be green)
3. Verify IP whitelist
4. Check database user exists

### Fix 4: Verify .env.local
```bash
# Make sure file exists and has correct format:
MONGODB_URI=mongodb+srv://...
SESSION_SECRET=...
```

---

## Error Messages Guide

### "MONGODB_URI not configured"
→ Add `MONGODB_URI` to `.env.local` and restart server

### "MongoDB connection error"
→ Check connection string, IP whitelist, password

### "Session not found"
→ Clear cookies, register again

### "Invalid question number"
→ Refresh page, start new quiz

### "Failed to submit answer"
→ Check MongoDB connection, verify database is accessible

---

## Still Having Issues?

1. **Check server logs** - Most errors are logged there
2. **Check browser console** - Client-side errors appear here
3. **Verify MongoDB Atlas** - Make sure cluster is running
4. **Test connection** - Use MongoDB Compass to verify connection string
5. **Restart dev server** - Sometimes fixes connection issues

---

## Need More Help?

Share:
1. The exact error message from server logs
2. The error from browser console
3. What action triggered the error (registration, quiz submission, etc.)
4. Your MongoDB Atlas cluster status

