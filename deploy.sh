#!/bin/bash

# Configuration
REPO_PATH="/home/jsclimbe/repositories/jsclimber"
TEMP_BUILD_PATH="/home/jsclimbe/repositories/jsclimber-temp"
APP_NAME="jsclimber.ir"
LOG_FILE="/home/jsclimbe/deploy.log"

# Start logging
exec > >(tee -a "$LOG_FILE")
exec 2>&1

echo "===== Starting deployment at $(date) ====="

# Step 1: copy repository

echo "Copying repository to temporary path..."
if cp -R "$REPO_PATH" "$TEMP_BUILD_PATH"; then
    echo "Repository copied successfully."
else
    echo "Failed to copy repository." >&2
    exit 1
fi

cd "$TEMP_BUILD_PATH" || { echo "Failed to navigate to $TEMP_BUILD_PATH"; exit 1; }

# Step 2: Git pull
echo "Pulling latest changes from GitHub..."
if git pull origin main; then
    echo "Git pull completed."
else
    echo "Git pull failed." >&2
    exit 1
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

# Step 6: Ensure the public directory exists in REPO_PATH
echo "Checking public directory..."
if [ ! -d "$REPO_PATH/public" ]; then
    mkdir -p "$REPO_PATH/public"
    echo "Public directory created in live path."
else
    echo "Public directory exists in live path."
fi

# Step 7: Deploy to live directory
echo "Deploying files to live directory..."
# Sync all files from the temporary build path to the live repository path
if rsync -a --delete "$TEMP_BUILD_PATH/" "$REPO_PATH/"; then
    echo "Deployment files synced successfully."
else
    echo "File sync failed." >&2
    exit 1
fi

# Step 8: Cleanup temporary build directory
echo "Cleaning up temporary build directory..."
if rm -rf "$TEMP_BUILD_PATH"; then
    echo "Temporary build directory removed."
else
    echo "Failed to remove temporary build directory." >&2
fi

echo "===== Deployment completed successfully at $(date) ====="


# Step 9: Restart the application
echo "Restarting application with PM2..."
cd "$REPO_PATH" || { echo "Failed to navigate to live directory $REPO_PATH"; exit 1; }
if pm2 restart "$APP_NAME" --update-env; then
    echo "Application restarted successfully."
else
    echo "Application restart failed." >&2
    exit 1
fi
