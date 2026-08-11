<?php

require_once __DIR__ . '/../../middleware/auth.php';
$user = requireRole('influencer');

require_once __DIR__ . '/../../models/InfluencerProfile.php';

switch ($method) {
    case 'GET':
        $profile = InfluencerProfile::fullProfile($user['id']);
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

        InfluencerProfile::update($user['id'], $input);
        $profile = InfluencerProfile::fullProfile($user['id']);
        echo json_encode(['profile' => $profile, 'message' => 'Profile updated']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
