# ⚡ Quick Deployment Steps

## Your Server: 102.211.209.82

### Step 1: Push to Git Repository

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit: CES Quiz Website"

# Add your remote repository
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

---

### Step 2: Connect to Your Server

```bash
ssh root@102.211.209.82
# or
ssh your-username@102.211.209.82
```

---

### Step 3: Install Docker on Server

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Verify
docker --version
docker compose version
```

---

### Step 4: Clone Repository on Server

```bash
mkdir -p /var/www/ces-quiz-website
cd /var/www/ces-quiz-website
git clone <your-repo-url> .
```

---

### Step 5: Create Environment File

```bash
nano .env.production
```

Add:
```env
MONGODB_URI=mongodb://admin:password123@mongodb:27017/ces_quiz?authSource=admin
SESSION_SECRET=change-this-to-a-random-32-character-string
NODE_ENV=production
NEXT_PUBLIC_APP_URL=http://102.211.209.82
```

**Note:** The MongoDB URI matches your `docker-compose.yml` configuration. For production, consider changing the MongoDB password.

**Generate a secure SESSION_SECRET:**
```bash
openssl rand -base64 32
```

---

### Step 6: Deploy with Docker

```bash
# Build and start
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f
```

---

### Step 7: Set Up Nginx (Reverse Proxy)

```bash
# Install Nginx
apt install nginx -y

# Create config
cat > /etc/nginx/sites-available/ces-quiz << 'EOF'
server {
    listen 80;
    server_name 102.211.209.82;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/ces-quiz /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

---

### Step 8: Configure Firewall

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

### Step 9: Test Your Deployment

Visit: **http://102.211.209.82**

---

## 🔄 Updating Your App

After making changes:

**On your local machine:**
```bash
git add .
git commit -m "Update message"
git push
```

**On server:**
```bash
cd /var/www/ces-quiz-website
git pull
docker compose up -d --build
```

Or use the deploy script:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🐛 Troubleshooting

### Check if containers are running:
```bash
docker compose ps
```

### View logs:
```bash
docker compose logs -f nextjs
docker compose logs -f mongodb
```

### Restart everything:
```bash
docker compose restart
```

### Rebuild from scratch:
```bash
docker compose down
docker compose up -d --build
```

---

## 📋 Checklist

- [ ] Git repository created and code pushed
- [ ] Server has Docker installed
- [ ] Repository cloned on server
- [ ] `.env.production` file created with correct values
- [ ] Docker containers running (`docker compose ps`)
- [ ] Nginx configured and running
- [ ] Firewall configured
- [ ] Application accessible at http://102.211.209.82
- [ ] MongoDB connection working
- [ ] Registration form works
- [ ] Quiz functionality works
- [ ] Leaderboard displays correctly

---

## 🔐 Security Notes

1. **Change SESSION_SECRET** - Use a strong random string
2. **MongoDB Security** - Consider adding authentication
3. **Firewall** - Only open necessary ports
4. **SSL/HTTPS** - Set up SSL certificate for production
5. **Backups** - Set up regular MongoDB backups

---

## 📞 Need Help?

Check the full `DEPLOYMENT.md` guide for detailed instructions.

