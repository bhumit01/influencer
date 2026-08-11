<?php

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/../../models/User.php';
require_once __DIR__ . '/../../middleware/auth.php';

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['email']) || empty($input['password'])) {
    http_response_code(422);
    echo json_encode(['error' => 'Email and password are required']);
    exit;
}

$user = User::findByEmail($input['email']);

if (!$user || !password_verify($input['password'], $user['password'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
    exit;
}

if ($user['status'] !== 'active') {
    http_response_code(403);
    echo json_encode(['error' => 'Account is inactive or suspended']);
    exit;
}

$token = generateJWT([
    'id'   => $user['id'],
    'email'=> $user['email'],
    'role' => $user['role'],
]);

$profile = User::profile($user['id']);

echo json_encode([
    'token' => $token,
    'user'  => $profile,
]);
