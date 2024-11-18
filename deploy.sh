#!/bin/bash

# Configuration
REPO_PATH="/home/jsclimbe/repositories/jsclimber"
TEMP_BUILD_PATH="/home/jsclimbe/repositories/jsclimber-temp"
APP_NAME="jsclimber.ir"
LOG_FILE="/home/jsclimbe/deploy_jsclimber.log"
HTACCESS="/home/jsclimbe/public_html/.htaccess"

# Start logging
exec > >(tee -a "$LOG_FILE")
exec 2>&1

echo "===== Starting deployment at $(date) ====="

# Step 1: copy repository

echo "Copying repository to temporary path..."
if cp -R "$REPO_PATH" "$TEMP_BUILD_PATH"; then
    echo "Repository copied successfully ."
else
    echo "Failed to copy repository." >&2
    exit 1
fi

cd "$TEMP_BUILD_PATH" || { echo "Failed to navigate to $TEMP_BUILD_PATH"; exit 1; }

# Step 2: Git pull
echo "Pulling latest changes from GitHub..."
retry_count=0
max_retries=3

until git pull origin main || [ "$retry_count" -ge "$max_retries" ]; do
    retry_count=$((retry_count+1))
    echo "Git pull failed. Retrying... ($retry_count/$max_retries)"
    sleep 5
done
if [ "$retry_count" -ge "$max_retries" ]; then
    echo "Git pull failed after $max_retries attempts." >&2
    exit 1
else
    echo "Git pull completed."
fi

# Step 3: Cache and dependencies cleanup
echo "Clearing .next cache and node_modules..."
if rm -rf .next node_modules; then
    echo "Caches cleared successfully."
else
    echo "Failed to clear caches." >&2
    exit 1
fi

# Step 4: Install dependencies
echo "Installing production dependencies..."
if npm install --production; then
    echo "Dependencies installed successfully."
else
    echo "Dependency installation failed." >&2
    exit 1
fi

# Step 5: Build project
echo "Building the project..."
if npm run build; then
    echo "Build completed successfully."
else
    echo "Build failed." >&2
    exit 1
fi

# Step 6: Clear .htaccess file content while keeping the first 5 lines
echo "Clearing .htaccess file content while keeping the first 5 lines..."
if head -n 5 "$HTACCESS" > "${HTACCESS}.tmp" && mv "${HTACCESS}.tmp" "$HTACCESS"; then
    echo ".htaccess file cleared successfully, keeping the first 5 lines."
else
    echo "Failed to clear .htaccess file while keeping the first 5 lines." >&2
    exit 1
fi

# Step 7: Ensure the public directory exists in REPO_PATH
echo "Checking public directory..."
if [ ! -d "$REPO_PATH/public" ]; then
    mkdir -p "$REPO_PATH/public"
    echo "Public directory created in live path."
else
    echo "Public directory exists in live path."
fi

# Step 8: Deploy to live directory
echo "Deploying files to live directory..."
# Sync all files from the temporary build path to the live repository path
if rsync -a --delete "$TEMP_BUILD_PATH/" "$REPO_PATH/"; then
    echo "Deployment files synced successfully."
else
    echo "File sync failed." >&2
    exit 1
fi

# Step 9: Cleanup temporary build directory
echo "Cleaning up temporary build directory..."
if rm -rf "$TEMP_BUILD_PATH"; then
    echo "Temporary build directory removed."
else
    echo "Failed to remove temporary build directory." >&2
fi

echo "===== Deployment completed successfully at $(date) ====="


# Step 10: Restart the application
echo "Restarting application with PM2..."
cd "$REPO_PATH" || { echo "Failed to navigate to live directory $REPO_PATH"; exit 1; }
if pm2 restart "$APP_NAME" --update-env; then
    echo "Application restarted successfully."
else
    echo "Application restart failed." >&2
    exit 1
fi
