# 🚀 Deployment Guide

## Server Information
- **Server IP:** 102.211.209.82
- **Stack:** Next.js + MongoDB + Docker

## Prerequisites

1. **SSH Access** to your server
2. **Git** installed on server
3. **Docker & Docker Compose** installed on server
4. **Domain name** (optional, can use IP directly)

---

## Step 1: Prepare Your Repository

### Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: CES Quiz Website"
```

### Push to GitHub/GitLab/Bitbucket
```bash
# Add your remote repository
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

---

## Step 2: Server Setup

### Connect to Your Server
```bash
ssh root@102.211.209.82
# or
ssh your-username@102.211.209.82
```

### Install Required Software on Server

#### Install Docker
```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

#### Install Git (if not installed)
```bash
apt install git -y
```

#### Install Node.js (for building, optional if using Docker)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

---

## Step 3: Clone Repository on Server

```bash
# Create project directory
mkdir -p /var/www/ces-quiz-website
cd /var/www/ces-quiz-website

# Clone your repository
git clone <your-repo-url> .

# Or if you need to set up SSH keys first:
# git clone git@github.com:yourusername/ces-quiz-website.git .
```

---

## Step 4: Configure Environment Variables

```bash
# Create .env.production file
nano .env.production
```

Add the following:
```env
MONGODB_URI=mongodb://localhost:27017/ces-quiz
SESSION_SECRET=your-super-secret-session-key-change-this
NODE_ENV=production
NEXT_PUBLIC_APP_URL=http://102.211.209.82
```

**Important:** Replace `your-super-secret-session-key-change-this` with a strong random string.

---

## Step 5: Deploy with Docker Compose

### Option A: Production Deployment (Recommended)

```bash
# Build and start containers
docker compose up -d --build

# Check logs
docker compose logs -f

# Check status
docker compose ps
```

### Option B: Development Deployment

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

---

## Step 6: Configure Nginx (Reverse Proxy)

### Install Nginx
```bash
apt install nginx -y
```

### Create Nginx Configuration
```bash
nano /etc/nginx/sites-available/ces-quiz
```

Add:
```nginx
server {
    listen 80;
    server_name 102.211.209.82;  # Replace with your domain if you have one

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
```

### Enable Site
```bash
ln -s /etc/nginx/sites-available/ces-quiz /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## Step 7: Set Up SSL (Optional but Recommended)

### Install Certbot
```bash
apt install certbot python3-certbot-nginx -y
```

### Get SSL Certificate
```bash
# If you have a domain name:
certbot --nginx -d yourdomain.com

# Or use Let's Encrypt with IP (requires DNS challenge)
certbot certonly --manual -d yourdomain.com
```

---

## Step 8: MongoDB Setup

### Option A: Use MongoDB in Docker (Recommended for simplicity)

The `docker-compose.yml` already includes MongoDB. Just make sure it's running:

```bash
docker compose ps
```

### Option B: Use MongoDB Atlas (Cloud)

1. Update `.env.production` with your MongoDB Atlas connection string
2. Remove MongoDB service from `docker-compose.yml` if using Atlas

---

## Step 9: Firewall Configuration

```bash
# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS
ufw allow 443/tcp

# Allow SSH (important!)
ufw allow 22/tcp

# Enable firewall
ufw enable
```

---

## Step 10: Verify Deployment

1. **Check Docker containers:**
   ```bash
   docker compose ps
   ```

2. **Check application logs:**
   ```bash
   docker compose logs nextjs
   docker compose logs mongodb
   ```

3. **Test the application:**
   - Visit: `http://102.211.209.82`
   - Test registration
   - Test quiz functionality
   - Check leaderboard

---

## Updating the Application

When you make changes:

```bash
# On your local machine
git add .
git commit -m "Your update message"
git push

# On server
cd /var/www/ces-quiz-website
git pull
docker compose up -d --build
```

---

## Troubleshooting

### Check if containers are running
```bash
docker compose ps
```

### View logs
```bash
docker compose logs -f nextjs
docker compose logs -f mongodb
```

### Restart services
```bash
docker compose restart
```

### Rebuild after code changes
```bash
docker compose up -d --build
```

### Check MongoDB connection
```bash
docker compose exec mongodb mongosh
```

### Check Next.js build
```bash
docker compose exec nextjs npm run build
```

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/ces-quiz` |
| `SESSION_SECRET` | Secret for session encryption | Random 32+ character string |
| `NODE_ENV` | Environment mode | `production` |
| `NEXT_PUBLIC_APP_URL` | Public URL of your app | `http://102.211.209.82` |

---

## Security Checklist

- [ ] Change `SESSION_SECRET` to a strong random value
- [ ] Set up firewall rules
- [ ] Use HTTPS (SSL certificate)
- [ ] Keep Docker images updated
- [ ] Use strong MongoDB credentials
- [ ] Restrict MongoDB access (only allow localhost)
- [ ] Set up regular backups
- [ ] Monitor server logs

---

## Backup Strategy

### Backup MongoDB
```bash
# Create backup script
nano /root/backup-mongodb.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

docker compose exec -T mongodb mongodump --archive > $BACKUP_DIR/mongodb_$DATE.archive

# Keep only last 7 days
find $BACKUP_DIR -name "mongodb_*.archive" -mtime +7 -delete
```

```bash
chmod +x /root/backup-mongodb.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /root/backup-mongodb.sh
```

---

## Monitoring

### Check resource usage
```bash
docker stats
```

### Check disk space
```bash
df -h
```

### Check memory
```bash
free -h
```

---

## Quick Deploy Script

Create `/root/deploy.sh`:

```bash
#!/bin/bash
cd /var/www/ces-quiz-website
git pull
docker compose down
docker compose up -d --build
docker compose logs -f --tail=50
```

Make it executable:
```bash
chmod +x /root/deploy.sh
```

Then deploy with:
```bash
/root/deploy.sh
```

---

## Support

If you encounter issues:
1. Check Docker logs: `docker compose logs`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Verify environment variables are set correctly
4. Ensure MongoDB is accessible
5. Check firewall rules

