<?php
/**
 * InfluenceHub API - Entry Point
 *
 * Routes all API requests through a simple router.
 * Works with Apache mod_rewrite (.htaccess) or PHP built-in server.
 */

require_once __DIR__ . '/config/app.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/middleware/cors.php';

handleCors();

header('Content-Type: application/json; charset=utf-8');

$url = $_GET['url'] ?? '';
$url = rtrim($url, '/');
$method = $_SERVER['REQUEST_METHOD'];

$segments = explode('/', $url);
$base = $segments[0] ?? '';

$routes = [
    'auth'       => __DIR__ . '/api/auth/router.php',
    'brands'     => __DIR__ . '/api/brands/router.php',
    'influencers' => __DIR__ . '/api/influencers/router.php',
    'public'     => __DIR__ . '/api/public/router.php',
    'admin'      => __DIR__ . '/api/admin/router.php',
];

if (isset($routes[$base])) {
    require $routes[$base];
} else {
    // Health check / API info
    if ($url === '' || $url === '/') {
        echo json_encode([
            'name'    => APP_NAME,
            'version' => API_VERSION,
            'status'  => 'running',
            'endpoints' => [
                'auth'        => '/auth/*',
                'brands'      => '/brands/*',
                'influencers' => '/influencers/*',
                'public'      => '/public/*',
                'admin'       => '/admin/*',
            ],
        ]);
        exit;
    }

    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
}
