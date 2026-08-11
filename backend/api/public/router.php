<?php

$action = $segments[1] ?? '';

switch ($action) {
    case 'categories':
        require __DIR__ . '/categories.php';
        break;
    case 'contact':
        require __DIR__ . '/contact.php';
        break;
    case 'enquiries':
        require __DIR__ . '/enquiries.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Public endpoint not found']);
}
