<?php

require_once __DIR__ . '/../../models/User.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = requireAuth();
$profile = User::profile($user['id']);

echo json_encode(['user' => $profile]);
