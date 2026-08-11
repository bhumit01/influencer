<?php

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// JWT is stateless — client discards token.
// For blacklist support, store revoked tokens in a table.
echo json_encode(['message' => 'Logged out successfully']);
