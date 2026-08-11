<?php

require_once __DIR__ . '/../../config/database.php';

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$required = ['name', 'email', 'message'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        http_response_code(422);
        echo json_encode(['error' => "Field '$field' is required"]);
        exit;
    }
}

if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['error' => 'Invalid email']);
    exit;
}

$db = Database::getInstance();
$stmt = $db->prepare(
    'INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)'
);
$stmt->execute([
    $input['name'],
    $input['email'],
    $input['subject'] ?? null,
    $input['message'],
]);

http_response_code(201);
echo json_encode(['message' => 'Message sent successfully']);
