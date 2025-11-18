# SkillMatch Deployment Guide

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No console errors in development
- [ ] Environment variables configured
- [ ] Database connected and tested
- [ ] JWT secret changed from default
- [ ] CORS settings configured
- [ ] All sensitive data in .env files
- [ ] Dependencies up to date
- [ ] Code reviewed and tested

---

## Backend Deployment

### Option 1: Heroku

#### 1. Create Heroku Account
Visit https://www.heroku.com and create an account

#### 2. Install Heroku CLI
```bash
# Windows
choco install heroku-cli

# Mac
brew tap heroku/brew && brew install heroku
```

#### 3. Deploy Backend
```bash
# Login to Heroku
heroku login

# Create app
heroku create skillmatch-api

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key
heroku config:set MONGODB_URI=your_mongodb_url
heroku config:set NODE_ENV=production

# Push to Heroku
git push heroku main
```

#### 4. Monitor Logs
```bash
heroku logs --tail
```

---

### Option 2: DigitalOcean

#### 1. Create Droplet
- Size: Basic (2GB RAM minimum)
- OS: Ubuntu 22.04
- Region: Choose closest to users

#### 2. SSH into Server
```bash
ssh root@your_droplet_ip
```

#### 3. Install Dependencies
```bash
apt update
apt install nodejs npm git nginx

# Install MongoDB
apt install mongodb

# Install PM2
npm install -g pm2
```

#### 4. Deploy Code
```bash
git clone your_repo_url
cd skillmatch-app/backend
npm install
```

#### 5. Configure PM2
```bash
pm2 start server.js --name skillmatch-api
pm2 startup
pm2 save
```

#### 6. Configure Nginx
Create `/etc/nginx/sites-available/skillmatch`:
```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/skillmatch /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 7. Install SSL
```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d your_domain.com
```

---

### Option 3: AWS EC2

#### 1. Launch EC2 Instance
- AMI: Ubuntu 22.04 LTS
- Instance Type: t3.micro (free tier)
- Security Group: Allow ports 22, 80, 443, 5000

#### 2. Connect to Instance
```bash
ssh -i your_key.pem ubuntu@your_instance_ip
```

#### 3. Install Software
```bash
sudo apt update
sudo apt install nodejs npm git mongodb
sudo npm install -g pm2
```

#### 4. Deploy Application
```bash
git clone your_repo_url
cd skillmatch-app/backend
npm install
pm2 start server.js
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

#### 1. Create Vercel Account
Visit https://vercel.com

#### 2. Connect GitHub
Connect your GitHub repository to Vercel

#### 3. Deploy
```bash
# Automatic deployment on push
# Or use Vercel CLI
npm i -g vercel
vercel
```

#### 4. Configure Environment
In Vercel dashboard:
- Settings → Environment Variables
- Add: `REACT_APP_API_URL=your_backend_url`

---

### Option 2: Netlify

#### 1. Create Netlify Account
Visit https://www.netlify.com

#### 2. Deploy
```bash
npm run build
# Drag and drop 'frontend/build' folder to Netlify
```

Or connect GitHub repository

#### 3. Configure Build Settings
- Build command: `npm run build`
- Publish directory: `build`
- Environment variables: `REACT_APP_API_URL`

---

### Option 3: AWS S3 + CloudFront

#### 1. Create S3 Bucket
```bash
# Install AWS CLI
pip install awscli

# Configure credentials
aws configure
```

#### 2. Build and Upload
```bash
npm run build
aws s3 sync build/ s3://your-bucket-name/
```

#### 3. Create CloudFront Distribution
- Origin: S3 bucket
- Default Root Object: index.html
- SSL: Default CloudFront certificate

---

## Database Deployment

### MongoDB Atlas (Recommended)

#### 1. Create Account
Visit https://www.mongodb.com/cloud/atlas

#### 2. Create Cluster
- Shared Cluster (free tier)
- Region: Choose close to application
- Tier: M0 Sandbox

#### 3. Get Connection String
```
mongodb+srv://username:password@cluster.mongodb.net/skillmatch?retryWrites=true&w=majority
```

#### 4. Whitelist IP
- Add application server IP to IP whitelist
- Or allow 0.0.0.0/0 (less secure)

#### 5. Update .env
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillmatch
```

---

### Alternative: Self-Hosted MongoDB

#### 1. Create VPS
Use DigitalOcean, AWS, or Linode

#### 2. Install MongoDB
```bash
apt update
apt install mongodb
systemctl start mongodb
```

#### 3. Configure Replication
For high availability, set up replica sets

#### 4. Backup Strategy
```bash
# Automated daily backup
mongodump --out /backups/mongo-backup-$(date +%Y%m%d)
```

---

## Domain & SSL Setup

### 1. Register Domain
- Namecheap
- GoDaddy
- Route53

### 2. DNS Configuration
Point to your application:
- **Heroku**: CNAME to heroku domain
- **DigitalOcean**: A record to droplet IP
- **Vercel**: CNAME to vercel domain

### 3. SSL Certificate
- Heroku: Automatic
- DigitalOcean: Let's Encrypt (Certbot)
- Vercel/Netlify: Automatic

---

## Performance Optimization

### Backend
```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Add rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Add caching headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});
```

### Frontend
```bash
# Build optimization
npm run build

# Enable gzip compression
# Configure CDN caching
# Minify and bundle
```

### Database
```javascript
// Add indexes for common queries
userSchema.index({ email: 1 });
userSchema.index({ 'location.coordinates': '2dsphere' });

// Use projection to fetch only needed fields
User.find({}, 'firstName lastName email -_id');
```

---

## Monitoring & Logging

### Backend Logging
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('Application started');
```

### Monitoring Services
- **PM2 Plus**: Process monitoring
- **DataDog**: Application monitoring
- **New Relic**: Performance monitoring
- **Sentry**: Error tracking

---

## Scaling Strategy

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Upgrade database tier
- Better for simple applications

### Horizontal Scaling
- Multiple backend instances
- Load balancer (Nginx, AWS ALB)
- Database replica sets
- Better for high-traffic applications

### Caching
```javascript
// Redis caching
const redis = require('redis');
const client = redis.createClient();

app.get('/games', (req, res) => {
  client.get('games', (err, data) => {
    if (data) return res.json(JSON.parse(data));
    // Fetch from database
  });
});
```

---

## Security Best Practices

### Environment Variables
```env
# Use strong secrets
JWT_SECRET=generate_with_crypto_randomBytes(32)

# Never commit .env
echo ".env" >> .gitignore
```

### Database Security
```javascript
// Use prepared statements (Mongoose does this)
User.findOne({ email: email });

// Validate and sanitize input
const { body, validationResult } = require('express-validator');

app.post('/users', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], handler);
```

### API Security
```javascript
// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Helmet for security headers
const helmet = require('helmet');
app.use(helmet());
```

---

## Disaster Recovery

### Backup Strategy
1. **Database**: Automated daily backups
2. **Code**: Version control (GitHub)
3. **Files**: Cloud storage (S3, etc.)

### Recovery Procedures
1. Test backups regularly
2. Document restore process
3. Have rollback plan

### Incident Response
1. Monitor error logs
2. Set up alerts
3. Document incidents
4. Post-mortem analysis

---

## Testing Before Production

### Load Testing
```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:5000/api/games

# Using Artillery
npm install -g artillery
artillery quick --count 300 --num 10 http://localhost:5000/api/games
```

### Security Testing
- Run OWASP ZAP scan
- Check for SQL injection vulnerabilities
- Validate authentication flows
- Test authorization boundaries

### Functionality Testing
- End-to-end tests
- API integration tests
- User scenario tests

---

## Post-Deployment

### Monitoring
```bash
# Check application health
curl http://your_domain.com/api/health

# Monitor logs
tail -f logs/application.log

# Check database
mongosh your_mongodb_connection
```

### Updates & Maintenance
```bash
# Update dependencies
npm outdated
npm update

# Security patches
npm audit fix

# Restart services
systemctl restart your_service
```

### Analytics & Metrics
- Track user registration/login
- Monitor game creation/participation
- Analyze job applications
- Measure API response times

---

## Cost Optimization

### Development
- MongoDB Atlas: Free tier
- Vercel/Netlify: Free tier
- AWS Free Tier: 1 year

### Production Recommendations
- MongoDB Atlas: $57+/month
- Heroku: $7-50/month (backend)
- Vercel: $5-150/month (frontend)
- Total: ~$75-200/month

### Budget Management
- Use free/starter tiers initially
- Monitor resource usage
- Scale as revenue grows
- Consider reserved instances

---

## Troubleshooting Deployment

### Common Issues

**502 Bad Gateway**
```bash
# Check if backend is running
pm2 logs skillmatch-api

# Restart service
pm2 restart skillmatch-api
```

**Database Connection Failed**
- Verify connection string
- Check IP whitelist
- Verify credentials
- Check network connectivity

**CORS Errors**
- Verify CLIENT_URL in .env
- Check CORS configuration
- Test with curl first

**High Memory Usage**
- Check for memory leaks
- Monitor with top/htop
- Consider upgrading instance

---

## Maintenance Schedule

- **Daily**: Monitor logs and errors
- **Weekly**: Review performance metrics
- **Monthly**: Update dependencies
- **Quarterly**: Security audit
- **Annually**: Disaster recovery test

---

**Last Updated:** February 2024
**Version:** 1.0.0
