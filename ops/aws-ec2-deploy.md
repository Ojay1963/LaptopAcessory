# AWS EC2 Deployment

This app is best deployed to a single Amazon EC2 instance right now.

Why this path fits:

- Express already serves both the API and the built frontend
- the repo already includes [`deploy.sh`](/c:/Users/user/Desktop/SOFTWARE/Lap/laptop-store/ops/deploy.sh)
- runtime data is stored in [`server/data/store.json`](/c:/Users/user/Desktop/SOFTWARE/Lap/laptop-store/server/data/store.json), so horizontal scaling would cause data drift

## Architecture

- EC2 instance: runs Node.js app with PM2
- Nginx: reverse proxy on port `80`
- Optional Route 53 domain: points your domain to the EC2 public IP
- Optional SSL: add Certbot after DNS is working

## 1. Launch the server

Use:

- AMI: Amazon Linux 2023
- Instance type: `t3.small` or larger
- Storage: at least `16 GB`

Security group inbound rules:

- `22` from your IP only
- `80` from `0.0.0.0/0`
- `443` from `0.0.0.0/0`

## 2. Connect and prepare folders

SSH into the server, then create the app folder:

```bash
sudo mkdir -p /var/www/laptop-store
sudo chown -R ec2-user:ec2-user /var/www/laptop-store
```

## 3. Upload the project

From your local machine, copy the repo to the instance:

```bash
scp -i /path/to/key.pem -r laptop-store ec2-user@YOUR_EC2_PUBLIC_IP:/var/www/
```

If the folder already exists on the server, update it with `git pull` or re-copy the files.

## 4. Configure environment variables

On the EC2 instance:

```bash
cd /var/www/laptop-store
cp server/.env.example server/.env
```

Set production values in `server/.env`.

Minimum values to change:

- `NODE_ENV=production`
- `PORT=5000`
- `FRONTEND_ORIGIN=https://your-domain.com` or `http://YOUR_EC2_PUBLIC_IP`
- `JWT_SECRET=` a long random secret
- `ADMIN_EMAIL=`
- `ADMIN_PASSWORD=`
- `PAYSTACK_CALLBACK_URL=https://your-domain.com/checkout/callback`

If you use Brevo, Cloudinary, or Paystack, also set their keys here.

You usually do not need `client/.env.local` in production because the frontend uses same-origin requests when `VITE_API_BASE_URL` is empty.

## 5. Run the deploy script

On the EC2 instance:

```bash
cd /var/www/laptop-store
chmod +x ops/deploy.sh
DOMAIN=your-domain.com PORT=5000 ./ops/deploy.sh
```

If you do not have a domain yet, you can deploy with the public IP:

```bash
DOMAIN=YOUR_EC2_PUBLIC_IP PORT=5000 ./ops/deploy.sh
```

What the script does:

- installs Node.js
- installs PM2
- installs Nginx
- runs `npm ci`
- runs the frontend build
- starts the app with PM2
- configures Nginx to proxy traffic to the Node server

## 6. Point your domain

If you use Route 53 or another DNS provider:

- create an `A` record for your domain
- point it to the EC2 public IP

Wait for DNS to resolve, then test:

```bash
curl http://your-domain.com/api/health
```

## 7. Add HTTPS

After DNS is live, install Certbot on the server and issue a certificate for Nginx. A typical Amazon Linux flow is:

```bash
sudo dnf install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Then verify renewal:

```bash
sudo certbot renew --dry-run
```

## 8. Useful checks

PM2 status:

```bash
pm2 status
pm2 logs oj-devices
```

Nginx status:

```bash
sudo nginx -t
sudo systemctl status nginx
```

App health:

```bash
curl http://127.0.0.1:5000/api/health
curl http://your-domain.com/api/health
```

## Important limitation

[`server/data/store.json`](/c:/Users/user/Desktop/SOFTWARE/Lap/laptop-store/server/data/store.json) is a local file. That means:

- data lives on one machine
- replacing the instance can lose data unless you back it up
- running multiple instances behind a load balancer will not work correctly

If you want a more production-ready AWS setup later, the next step is moving app data into RDS or DynamoDB, then deploying behind Elastic Beanstalk, ECS, or an Auto Scaling group.
