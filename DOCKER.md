# Docker Setup Guide

This guide explains how to run the CES Quiz Website using Docker.

## Prerequisites

- Docker Desktop installed (https://www.docker.com/products/docker-desktop)
- Docker Compose (included with Docker Desktop)

## Quick Start

### Production Mode

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

### Development Mode

```bash
# Start with development configuration
docker-compose -f docker-compose.dev.yml up

# Stop development services
docker-compose -f docker-compose.dev.yml down
```

---

## Services

### 1. MongoDB Database
- **Port**: 27017
- **Username**: admin
- **Password**: password123 (change in production!)
- **Database**: ces_quiz
- **Connection String**: `mongodb://admin:password123@localhost:27017/ces_quiz?authSource=admin`

### 2. Next.js Application
- **Port**: 3000
- **URL**: http://localhost:3000
- **Environment**: Set via docker-compose.yml

---

## Configuration

### Environment Variables

Create a `.env` file in the project root (optional):

```env
SESSION_SECRET=your-secret-key-here
MONGODB_URI=mongodb://admin:password123@mongodb:27017/ces_quiz?authSource=admin
```

Or modify `docker-compose.yml` directly:

```yaml
environment:
  - SESSION_SECRET=your-secret-key-here
  - MONGODB_URI=mongodb://admin:password123@mongodb:27017/ces_quiz?authSource=admin
```

---

## Production Deployment

### Step 1: Build Image

```bash
docker build -t ces-quiz-website .
```

### Step 2: Run Container

```bash
docker run -d \
  --name ces-quiz-app \
  -p 3000:3000 \
  -e MONGODB_URI=your_mongodb_connection_string \
  -e SESSION_SECRET=your_secret_key \
  ces-quiz-website
```

### Step 3: Using Docker Compose

```bash
# Update docker-compose.yml with production values
# Then run:
docker-compose up -d
```

---

## Development Workflow

### Using Development Compose

```bash
# Start services
docker-compose -f docker-compose.dev.yml up

# The app will hot-reload on file changes
# MongoDB data persists in volumes
```

### Accessing MongoDB

```bash
# Connect to MongoDB shell
docker exec -it ces-quiz-mongodb mongosh -u admin -p password123 --authenticationDatabase admin

# Or use MongoDB Compass
# Connection: mongodb://admin:password123@localhost:27017/?authSource=admin
```

---

## Common Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f mongodb
```

### Restart Services
```bash
docker-compose restart
docker-compose restart app
```

### Rebuild After Changes
```bash
# Rebuild and restart
docker-compose up -d --build

# Development
docker-compose -f docker-compose.dev.yml up --build
```

### Access Container Shell
```bash
# App container
docker exec -it ces-quiz-app sh

# MongoDB container
docker exec -it ces-quiz-mongodb mongosh
```

### Clean Up
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (deletes database data)
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

---

## Troubleshooting

### Port Already in Use

If port 3000 or 27017 is already in use:

```yaml
# In docker-compose.yml, change ports:
ports:
  - "3001:3000"  # Use 3001 instead of 3000
```

### MongoDB Connection Issues

1. Check MongoDB is running:
   ```bash
   docker-compose ps
   ```

2. Check MongoDB logs:
   ```bash
   docker-compose logs mongodb
   ```

3. Verify connection string in docker-compose.yml

### Build Failures

1. Clear Docker cache:
   ```bash
   docker system prune -a
   ```

2. Rebuild without cache:
   ```bash
   docker-compose build --no-cache
   ```

### Permission Issues

If you get permission errors:

```bash
# Fix ownership (Linux/Mac)
sudo chown -R $USER:$USER .
```

---

## Production Considerations

### Security

1. **Change Default Passwords**
   - Update MongoDB root password in docker-compose.yml
   - Use strong SESSION_SECRET

2. **Use Environment Variables**
   - Don't hardcode secrets in docker-compose.yml
   - Use Docker secrets or environment files

3. **Network Security**
   - Don't expose MongoDB port in production
   - Use internal Docker network only

### Example Production docker-compose.yml

```yaml
services:
  mongodb:
    # Remove ports section to not expose MongoDB
    # ports:
    #   - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}  # From .env
    networks:
      - internal  # Internal network only

  app:
    environment:
      MONGODB_URI: mongodb://admin:${MONGO_PASSWORD}@mongodb:27017/ces_quiz?authSource=admin
      SESSION_SECRET: ${SESSION_SECRET}  # From .env
    networks:
      - internal
      - public  # Only app exposed

networks:
  internal:
    internal: true  # No external access
  public:
    # Public network for app
```

---

## Volumes

Data persists in Docker volumes:

- `mongodb_data` - MongoDB database files
- `mongodb_config` - MongoDB configuration

To backup:
```bash
docker run --rm -v ces-quiz-website_mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb-backup.tar.gz /data
```

To restore:
```bash
docker run --rm -v ces-quiz-website_mongodb_data:/data -v $(pwd):/backup alpine tar xzf /backup/mongodb-backup.tar.gz -C /
```

---

## Multi-Stage Build Benefits

The Dockerfile uses multi-stage builds:

1. **deps** - Install dependencies only
2. **builder** - Build the Next.js app
3. **runner** - Final lightweight image with only runtime files

This results in a smaller final image (~150MB vs ~1GB).

---

## Next Steps

1. Update `docker-compose.yml` with your production values
2. Set up environment variables
3. Build and test locally
4. Deploy to your Docker host (AWS ECS, DigitalOcean, etc.)

---

## Support

For issues:
- Check Docker logs: `docker-compose logs`
- Verify environment variables
- Ensure ports are available
- Check MongoDB connection string format

