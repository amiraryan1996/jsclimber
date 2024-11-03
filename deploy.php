<?php
 // GitHub Webhook secret
$secret = process.env.GITHUB_SECRET;

// Get the payload
$rawPost = file_get_contents('php://input');
$headers = getallheaders();
$hubSignature = $headers['X-Hub-Signature'];

// Validate the signature
list($algo, $hash) = explode('=', $hubSignature, 2) + ['', ''];
if ($hash !== hash_hmac($algo, $rawPost, $secret)) {
    http_response_code(403);
    die('Invalid signature.');
}

// Deploy the app
shell_exec('cd /home/jsclimbe/jsclimber && git pull origin main && npm install && npm run build');
?>
