<?php

require_once __DIR__ . '/../../models/InfluencerProfile.php';
require_once __DIR__ . '/../../models/User.php';

$db = Database::getInstance();

switch ($method) {
    case 'GET':
        $page = (int) ($_GET['page'] ?? 1);
        $perPage = min((int) ($_GET['per_page'] ?? 20), 50);
        $search = $_GET['search'] ?? null;
        $status = $_GET['status'] ?? null;
        $offset = ($page - 1) * $perPage;

        $where = "u.role = 'influencer'";
        $params = [];

        if ($status) {
            $where .= ' AND u.status = ?';
            $params[] = $status;
        }

        if ($search) {
            $where .= ' AND (ip.first_name LIKE ? OR ip.last_name LIKE ? OR u.email LIKE ?)';
            $params[] = "%{$search}%";
            $params[] = "%{$search}%";
            $params[] = "%{$search}%";
        }

        $countStmt = $db->prepare(
            "SELECT COUNT(*) FROM users u
             JOIN influencer_profiles ip ON ip.user_id = u.id
             WHERE $where"
        );
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();

        $stmt = $db->prepare(
            "SELECT u.id as user_id, u.email, u.role, u.status, u.created_at,
                    ip.*
             FROM users u
             JOIN influencer_profiles ip ON ip.user_id = u.id
             WHERE $where
             ORDER BY u.created_at DESC
             LIMIT ? OFFSET ?"
        );
        $params[] = $perPage;
        $params[] = $offset;
        $stmt->execute($params);
        $data = $stmt->fetchAll();

        echo json_encode([
            'data' => $data,
            'pagination' => [
                'page'        => $page,
                'per_page'    => $perPage,
                'total'       => $total,
                'total_pages' => ceil($total / $perPage),
            ],
        ]);
        break;

    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        $userId = (int) ($segments[2] ?? 0);

        if (!$userId) {
            http_response_code(422);
            echo json_encode(['error' => 'User ID is required']);
            exit;
        }

        $user = User::findById($userId);
        if (!$user || $user['role'] !== 'influencer') {
            http_response_code(404);
            echo json_encode(['error' => 'Influencer not found']);
            exit;
        }

        // Update user status if provided
        if (isset($input['status'])) {
            $allowedStatuses = ['active', 'inactive', 'suspended'];
            if (!in_array($input['status'], $allowedStatuses)) {
                http_response_code(422);
                echo json_encode(['error' => 'Invalid status']);
                exit;
            }
            User::update($userId, ['status' => $input['status']]);
            unset($input['status']);
        }

        // Update profile fields
        if (!empty($input)) {
            InfluencerProfile::update($userId, $input);
        }

        $profile = InfluencerProfile::fullProfile($userId);
        echo json_encode(['profile' => $profile, 'message' => 'Creator updated']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
