#!/bin/bash

# Define environment variables
REPO_PATH="/home/jsclimbe/repositories/jsclimber"
TEMP_BUILD_PATH="/home/jsclimbe/repositories/jsclimber-temp"
APP_NAME="jsclimber.ir"

# Pull latest changes into a temporary directory
echo "Starting deployment..."
rm -rf $TEMP_BUILD_PATH
cp -R $REPO_PATH $TEMP_BUILD_PATH
cd $TEMP_BUILD_PATH || exit

echo "Pulling latest changes..."
git pull origin main || exit

echo "Installing dependencies..."
npm install || exit

echo "Clearing .next cache..."
rm -rf $TEMP_BUILD_PATH/.next

echo "Building the project..."
npm run build || exit

# Copy built files to the main app directory
echo "Deploying to live directory..."
rsync -a --delete $TEMP_BUILD_PATH/.next $REPO_PATH/.next
rsync -a --delete $TEMP_BUILD_PATH/node_modules $REPO_PATH/node_modules
rsync -a --delete $TEMP_BUILD_PATH/package.json $REPO_PATH/package.json
rsync -a --delete $TEMP_BUILD_PATH/public $REPO_PATH/public

# Restart the application with pm2
echo "Restarting the application..."
pm2 restart $APP_NAME

echo "Deployment completed successfully!"
