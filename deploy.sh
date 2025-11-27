#!/bin/bash
echo "🚀 Starting Meraab Admin Production Deployment"

# Go to your project folder
cd /home/ubuntu/Meraab-Backend/Meraabadmin || exit

echo "📦 Installing production dependencies..."
npm install --only=prod

echo "🛠 Building Strapi Admin with extended memory..."
export NODE_OPTIONS="--max-old-space-size=3072"
npm run build

echo "🔄 Removing previous PM2 process (if any)..."
pm2 delete meraab-admin 2>/dev/null

echo "🚀 Starting Meraab Admin with PM2..."
pm2 start "npm run start" --name "meraab-admin"

echo "💾 Saving PM2 processes..."
pm2 save

echo "🔧 Enabling PM2 auto-start on reboot..."
pm2 startup systemd -u ubuntu --hp /home/ubuntu

echo "📜 Setting up log rotation..."
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 5

echo "🎉 Deployment Complete!"
echo "Meraab Admin is now running in production."
