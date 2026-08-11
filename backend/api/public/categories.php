<?php

require_once __DIR__ . '/../../models/Category.php';

switch ($method) {
    case 'GET':
        $categories = Category::withInfluencerCount();
        echo json_encode(['categories' => $categories]);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
