<?php

define('APP_NAME', 'InfluenceHub');
define('APP_ENV', 'development'); // production
define('APP_DEBUG', true);
define('APP_URL', 'http://localhost/influencehub');
define('API_VERSION', 'v1');

// JWT secret (change in production)
define('JWT_SECRET', 'ih-secret-key-change-in-production-2024');
define('JWT_EXPIRY', 86400); // 24 hours

// Upload configuration
define('UPLOAD_DIR', __DIR__ . '/../uploads');
define('MAX_UPLOAD_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'mp4']);

// Pagination
define('DEFAULT_PER_PAGE', 12);
define('MAX_PER_PAGE', 50);

// Timezone
date_default_timezone_set('UTC');

// Error reporting
if (APP_DEBUG) {
    error_reporting(E_ALL);
    ini_set('display_errors', '0');
} else {
    error_reporting(0);
    ini_set('display_errors', '0');
}
