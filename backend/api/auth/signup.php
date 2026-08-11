<?php

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/../../models/User.php';
require_once __DIR__ . '/../../models/BrandProfile.php';
require_once __DIR__ . '/../../models/InfluencerProfile.php';
require_once __DIR__ . '/../../middleware/auth.php';

$input = json_decode(file_get_contents('php://input'), true);

$required = ['email', 'password', 'role'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        http_response_code(422);
        echo json_encode(['error' => "Field '$field' is required"]);
        exit;
    }
}

if (!in_array($input['role'], ['brand', 'influencer'])) {
    http_response_code(422);
    echo json_encode(['error' => 'Role must be brand or influencer']);
    exit;
}

if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['error' => 'Invalid email format']);
    exit;
}

if (strlen($input['password']) < 8) {
    http_response_code(422);
    echo json_encode(['error' => 'Password must be at least 8 characters']);
    exit;
}

if (User::findByEmail($input['email'])) {
    http_response_code(409);
    echo json_encode(['error' => 'Email already registered']);
    exit;
}

$userId = User::create([
    'email'    => $input['email'],
    'password' => $input['password'],
    'role'     => $input['role'],
]);

if ($input['role'] === 'brand') {
    BrandProfile::create($userId, $input);
} else {
    InfluencerProfile::create($userId);
}

$token = generateJWT([
    'id'   => $userId,
    'email'=> $input['email'],
    'role' => $input['role'],
]);

$user = User::profile($userId);

http_response_code(201);
echo json_encode([
    'token' => $token,
    'user'  => $user,
]);
