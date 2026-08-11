<?php

require_once __DIR__ . '/../../middleware/auth.php';
$user = requireRole('influencer');

require_once __DIR__ . '/../../models/InfluencerProfile.php';

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$type = $_POST['type'] ?? '';
if (!in_array($type, ['profile_photo', 'cover_photo', 'gallery'])) {
    http_response_code(422);
    echo json_encode(['error' => 'Invalid upload type. Must be profile_photo, cover_photo, or gallery']);
    exit;
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(422);
    echo json_encode(['error' => 'File upload failed']);
    exit;
}

$file = $_FILES['file'];

if ($file['size'] > MAX_UPLOAD_SIZE) {
    http_response_code(422);
    echo json_encode(['error' => 'File size exceeds maximum of ' . (MAX_UPLOAD_SIZE / 1024 / 1024) . 'MB']);
    exit;
}

$extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($extension, ALLOWED_EXTENSIONS)) {
    http_response_code(422);
    echo json_encode(['error' => 'File type not allowed. Allowed: ' . implode(', ', ALLOWED_EXTENSIONS)]);
    exit;
}

$profile = InfluencerProfile::findByUserId($user['id']);
if (!$profile) {
    http_response_code(404);
    echo json_encode(['error' => 'Profile not found']);
    exit;
}

// Create subdirectory for this influencer
$userDir = UPLOAD_DIR . '/user_' . $user['id'];
if (!is_dir($userDir)) {
    mkdir($userDir, 0755, true);
}

$filename = $type . '_' . time() . '.' . $extension;
$destPath = $userDir . '/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save file']);
    exit;
}

$url = 'uploads/user_' . $user['id'] . '/' . $filename;

$db = Database::getInstance();

if ($type === 'gallery') {
    $title = $_POST['title'] ?? null;
    $stmt = $db->prepare(
        'INSERT INTO gallery_items (influencer_id, image_url, title, sort_order) VALUES (?, ?, ?, ?)'
    );
    $stmt->execute([$profile['id'], $url, $title, 0]);
    echo json_encode([
        'message' => 'Gallery image uploaded',
        'url' => $url,
        'id' => (int) $db->lastInsertId(),
    ]);
} else {
    InfluencerProfile::update($user['id'], [$type => $url]);
    echo json_encode([
        'message' => ucfirst(str_replace('_', ' ', $type)) . ' updated',
        'url' => $url,
    ]);
}
