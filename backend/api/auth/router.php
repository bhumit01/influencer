<?php

$action = $segments[1] ?? '';

switch ($action) {
    case 'login':
        require __DIR__ . '/login.php';
        break;
    case 'signup':
        require __DIR__ . '/signup.php';
        break;
    case 'logout':
        require __DIR__ . '/logout.php';
        break;
    case 'me':
        require __DIR__ . '/me.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Auth endpoint not found']);
}
