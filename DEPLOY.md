# Deployment Guide: AWS EC2

This guide walks through deploying the MERN application to AWS EC2 using Docker Compose.

This guide assumes we deploy two images: one for the backend, one for the frontend, using docker-compose. But EC2 t3 only has 1GB of RAM, so I think that might be a problem.

## Prerequisites

- AWS account (new accounts get 12 months free tier)
- SSH key pair for EC2 access
- Domain name (optional, for custom domain)

## Overview

This deployment uses:
- **EC2 **t3.micro** instance (750 hours/month free tier)**
  - In a few regions, t3 may not be available. Use t2 instead.
- **Docker Compose** to run all services
- **MongoDB** running in a Docker container on the same instance
- **30GB EBS storage** (free tier)

## Step 1: Create SSH key

 - **Key pair**: Create new or use existing SSH key pair
    (Recommended) Use existing
      - Go to EC2 > Key Pairs
      - Actions > Import Key Pair
      - Give it a name
      - Either upload your public key or paste its contents

## Step 2: Launch EC2 Instance

1. Log into AWS Console and navigate to EC2
2. Click **Launch Instance**
3. Configure the instance:
   - **Name**: your app name
   - **AMI**: Ubuntu Server 24.04 LTS
   - **Instance type**: t2.micro or t3.micro (free tier eligible)
   - **SSH key**: use the SSH key from step 1
   - **Network settings**:
    (Maybe we shouldn't use 0.0.0.0/0 for port 3001)
     - Allow SSH (port 22) from your IP
     - Allow HTTP (port 80) from anywhere (0.0.0.0/0)
     - Allow HTTPS (port 443) from anywhere (0.0.0.0/0)
     - Allow custom TCP port 3001 from anywhere (for API) (Edit > Add security group rule, set port, set 0.0.0.0/0)
   - **Storage**: 30GB gp3 (free tier includes 30GB) (Advanced > increase from 8 to 30)
4. Click **Launch Instance**
5. Wait for instance to reach "Running" state
6. Note the **Public IPv4 address**

## Step 2: Connect to EC2 Instance

This assumes the SSH key use set up is already added to a running agent locally. Then all you need to do is

```
ssh USERNAME@PUBLIC_IP
```

For me, the username was `ubuntu`. The public IP can be found in the instance page.

## Step 3: Install Docker and Docker Compose

### For Ubuntu:

```bash
# Update packages
sudo apt update && sudo apt upgrade -y
```

**Note:** if you are prompted with "Restarting the system to load the new kernel will not be handled automatically, so you should consider rebooting.", then do this:

- reboot with `sudo reboot` (this will close the SSH connection)
- wait 30s
- reconnect via SSH

```bash
# Install Docker from official repository
# Add Docker's official GPG key
sudo apt-get update
sudo apt-get install ca-certificates curl -y
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# Install Docker Engine and Docker Compose plugin
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

# Add current user to docker group
sudo usermod -aG docker ubuntu # change username 'ubuntu' as needed

# Log out and back in for group changes to take effect
exit
# Then reconnect via SSH
```

## Step 4: Install Git and Clone Repository

```bash
# Install Git
sudo apt install git -y

# Clone your repository
git clone https://github.com/USERNAME/REPO_NAME.git
cd REPO_NAME
```

**Key changes:**
- MongoDB service is included
- Frontend maps port 80 (not 3000) so it's accessible via HTTP
- All services have `restart: unless-stopped`

## Step 6: Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Create .env file
nano .env
```

Add the following (adjust as needed):

```env
NODE_PORT=3001
MONGODB_URI=mongodb://mongodb:27017/wtwr_db
NODE_ENV=production
JWT_SECRET=<random-secret>
```

**Important**: Use `mongodb://mongodb:27017/wtwr_db` because Docker Compose uses service names for DNS resolution.

Save and exit (Ctrl+X, then Y, then Enter).

## Step 7: Build and Start Services

```bash
# Build and start all services in detached mode
docker compose up -d --build

# Check that all containers are running
docker compose ps

# View logs
docker compose logs -f

# Or view logs for specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongodb
```

## Step 8: Verify Deployment

1. **Check backend health**:
   ```bash
   # from deployed server
   curl http://localhost:3001/health
   ```

2. **Access the application**:
   - Frontend: `http://your-ec2-public-ip`
   - Backend API: `http://your-ec2-public-ip:3001`

3. **Check MongoDB connection**:
   ```bash
   docker exec -it wtwr-mongodb mongosh wtwr_db
   # Inside mongosh:
   show dbs
   exit
   ```

## Step 9: (Optional) Set Up Custom Domain

### Using Route 53 and your domain:

1. In Route 53, create an **A record** pointing to your EC2 public IP
2. Update your frontend to use the custom domain

### Set up HTTPS with Let's Encrypt:

Since the frontend uses Caddy, it can automatically provision SSL certificates:

1. Update `docker-compose.yml` frontend service:
   ```yaml
   frontend:
     # ... other config
     ports:
       - "80:80"
       - "443:443"
     volumes:
       - caddy_data:/data
       - caddy_config:/config
   ```

2. Create a `Caddyfile` in the frontend directory:
   ```
   yourdomain.com {
       root * /usr/share/caddy
       file_server
       try_files {path} /index.html
   }
   ```

3. Update frontend Dockerfile to copy Caddyfile:
   ```dockerfile
   COPY ./Caddyfile /etc/caddy/Caddyfile
   ```

4. Add volumes to docker-compose.yml:
   ```yaml
   volumes:
     mongodb_data:
     caddy_data:
     caddy_config:
   ```

## Monitoring and Maintenance

### View logs:
```bash
docker compose logs -f
```

### Restart services:
```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart backend
```

### Stop services:
```bash
docker compose down
```

### Update application (pull latest code):
```bash
cd /path/to/your-repo
git pull origin main
docker compose up -d --build
```

### Check disk usage:
```bash
df -h
docker system df
```

### Cleanup unused Docker resources:
```bash
docker system prune -a
```

### Monitor container resource usage:
```bash
docker stats
```

## Troubleshooting

### Containers won't start:
```bash
# Check logs
docker compose logs

# Check if ports are already in use
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :3001
```

### Out of memory (t2.micro has only 1GB RAM):
```bash
# Check memory usage
free -h
docker stats

# Consider adding swap space:
sudo dd if=/dev/zero of=/swapfile bs=1M count=1024
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### MongoDB data persistence:
```bash
# Check volumes
docker volume ls
docker volume inspect docker-mern-demo_mongodb_data

# Backup MongoDB data
docker exec wtwr-mongodb mongodump --out=/data/backup
docker cp wtwr-mongodb:/data/backup ./mongodb-backup
```

### Application not accessible from browser:
- Verify EC2 Security Group allows inbound traffic on ports 80, 443, and 3001
- Check if containers are running: `docker compose ps`
- Verify frontend is listening on port 80 (not 3000)

## Cost Monitoring

- EC2 t2.micro/t3.micro: Free for 12 months (750 hours/month)
- EBS 30GB: Free for 12 months
- After 12 months: ~$8-10/month for t2.micro + storage
- Monitor usage in AWS Billing Dashboard

## Security Best Practices

1. **Restrict SSH access**: In EC2 Security Group, only allow SSH (port 22) from your IP
2. **Use environment variables**: Never commit `.env` file to Git
3. **Regular updates**: Keep Docker images and system packages updated
4. **Firewall**: Only expose necessary ports (80, 443, 3001)
5. **Backup data**: Regularly backup MongoDB data
6. **Monitor logs**: Check for suspicious activity

## Shutting Down

To stop spending money or if done with the instance:

```bash
# On EC2 instance
docker compose down

# In AWS Console
# Terminate the EC2 instance (cannot be undone)
# Or Stop the instance (can be restarted later, minimal costs)
```

---

## Summary

You now have a fully functional MERN stack running on AWS EC2 with:
- ✅ MongoDB in Docker container with persistent storage
- ✅ Node.js/Express backend API
- ✅ React frontend served by Caddy
- ✅ Free for 12 months (for new AWS accounts)
- ✅ All managed with Docker Compose