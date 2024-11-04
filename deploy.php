<?php
 // GitHub Webhook secret
$secret = "d44524b14c65c7fd9a016594625d8d63e3879bd3";

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
// TODO: address test in cpanel teminal => tested.
shell_exec('cd /home/jsclimbe/repositories/jsclimber && git pull origin main && npm install && npm run build && npm start');
?>
