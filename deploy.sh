#!/bin/bash

REPO_PATH="/home/jsclimbe/repositories/jsclimber"
TEMP_BUILD_PATH="/home/jsclimbe/repositories/jsclimber-temp"
APP_NAME="jsclimber.ir"

exec > >(tee -i /home/jsclimbe/deploy.log)
exec 2>&1

echo "Starting deployment..."

rm -rf $TEMP_BUILD_PATH
cp -R $REPO_PATH $TEMP_BUILD_PATH
cd $TEMP_BUILD_PATH || exit

echo "Pulling latest changes..."
git pull origin main || exit

echo "Clearing cache and reinstalling dependencies..."
rm -rf .next
rm -rf node_modules

echo "Installing dependencies..."
npm install --production || exit 1

echo "Building the project..."
npm run build || exit 1

# Ensure the public directory exists in the temp build
if [ ! -d "$TEMP_BUILD_PATH/public" ]; then
    mkdir -p $TEMP_BUILD_PATH/public
fi

echo "Deploying to live directory..."
rsync -a --delete $TEMP_BUILD_PATH/.next $REPO_PATH/.next
rsync -a --delete $TEMP_BUILD_PATH/node_modules $REPO_PATH/node_modules
rsync -a --delete $TEMP_BUILD_PATH/package.json $REPO_PATH/package.json
rsync -a --delete $TEMP_BUILD_PATH/public $REPO_PATH/public

echo "Restarting the application..."
pm2 restart $APP_NAME --update-env

echo "Deployment completed successfully!"
