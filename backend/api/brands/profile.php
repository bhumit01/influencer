<?php

require_once __DIR__ . '/../../models/BrandProfile.php';

switch ($method) {
    case 'GET':
        $profile = BrandProfile::findByUserId($user['id']);
        if (!$profile) {
            http_response_code(404);
            echo json_encode(['error' => 'Profile not found']);
            exit;
        }
        echo json_encode(['profile' => $profile]);
        break;

    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            http_response_code(422);
            echo json_encode(['error' => 'Invalid input']);
            exit;
        }
        BrandProfile::update($user['id'], $input);
        $profile = BrandProfile::findByUserId($user['id']);
        echo json_encode(['profile' => $profile, 'message' => 'Profile updated']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
