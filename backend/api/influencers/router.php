<?php

$action = $segments[1] ?? '';

switch ($action) {
    case 'list':
        require __DIR__ . '/list.php';
        break;
    case 'profile':
        require __DIR__ . '/profile.php';
        break;
    case 'upload':
        require __DIR__ . '/upload.php';
        break;
    case 'collaborations':
        require __DIR__ . '/collaborations.php';
        break;
    default:
        // /influencers/{id}
        if (is_numeric($action)) {
            $_GET['id'] = $action;
            require __DIR__ . '/single.php';
            break;
        }
        http_response_code(404);
        echo json_encode(['error' => 'Influencer endpoint not found']);
}
