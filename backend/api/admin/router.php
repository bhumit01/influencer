<?php

require_once __DIR__ . '/../../middleware/auth.php';
$adminUser = requireRole('admin');

$action = $segments[1] ?? '';

switch ($action) {
    case 'enquiries':
        require __DIR__ . '/enquiries.php';
        break;
    case 'categories':
        require __DIR__ . '/categories.php';
        break;
    case 'creators':
        require __DIR__ . '/creators.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Admin endpoint not found']);
}
