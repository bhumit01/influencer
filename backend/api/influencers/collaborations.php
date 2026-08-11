<?php

require_once __DIR__ . '/../../middleware/auth.php';
$user = requireRole('influencer');

require_once __DIR__ . '/../../models/InfluencerProfile.php';

$db = Database::getInstance();
$profile = InfluencerProfile::findByUserId($user['id']);

if (!$profile) {
    http_response_code(404);
    echo json_encode(['error' => 'Profile not found']);
    exit;
}

switch ($method) {
    case 'GET':
        $stmt = $db->prepare('SELECT * FROM past_collaborations WHERE influencer_id = ? ORDER BY created_at DESC');
        $stmt->execute([$profile['id']]);
        echo json_encode(['collaborations' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['brand_name'])) {
            http_response_code(422);
            echo json_encode(['error' => 'brand_name is required']);
            exit;
        }

        $stmt = $db->prepare(
            'INSERT INTO past_collaborations (influencer_id, brand_name, description, image_url, start_date, end_date)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $profile['id'],
            $input['brand_name'],
            $input['description'] ?? null,
            $input['image_url'] ?? null,
            $input['start_date'] ?? null,
            $input['end_date'] ?? null,
        ]);

        $id = (int) $db->lastInsertId();
        $stmt = $db->prepare('SELECT * FROM past_collaborations WHERE id = ?');
        $stmt->execute([$id]);
        $collab = $stmt->fetch();

        http_response_code(201);
        echo json_encode(['collaboration' => $collab, 'message' => 'Collaboration added']);
        break;

    case 'DELETE':
        $id = (int) ($_GET['id'] ?? 0);
        if (!$id) {
            http_response_code(422);
            echo json_encode(['error' => 'Collaboration ID required']);
            exit;
        }

        $stmt = $db->prepare('DELETE FROM past_collaborations WHERE id = ? AND influencer_id = ?');
        $stmt->execute([$id, $profile['id']]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Collaboration not found']);
            exit;
        }

        echo json_encode(['message' => 'Collaboration deleted']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
