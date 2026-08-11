<?php

require_once __DIR__ . '/../../models/InfluencerProfile.php';
require_once __DIR__ . '/../../models/User.php';

$id = (int) ($_GET['id'] ?? 0);
if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid influencer ID']);
    exit;
}

$profile = InfluencerProfile::findById($id);
if (!$profile) {
    http_response_code(404);
    echo json_encode(['error' => 'Influencer not found']);
    exit;
}

$full = InfluencerProfile::fullProfile($profile['user_id']);
$user = User::findById($profile['user_id']);

// Sanitize private data from public profile
$full = InfluencerProfile::sanitizeForPublic($full);

echo json_encode([
    'influencer' => $full,
    'user'       => $user,
]);
