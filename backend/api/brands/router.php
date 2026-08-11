<?php

require_once __DIR__ . '/../../middleware/auth.php';
$user = requireRole('brand');

$action = $segments[1] ?? '';

switch ($action) {
    case 'profile':
        require __DIR__ . '/profile.php';
        break;
    case 'enquiries':
        require __DIR__ . '/enquiries.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Brand endpoint not found']);
}
