<?php

require_once __DIR__ . '/../../models/Enquiry.php';

$db = Database::getInstance();

switch ($method) {
    case 'GET':
        $page = (int) ($_GET['page'] ?? 1);
        $perPage = min((int) ($_GET['per_page'] ?? 20), 50);
        $status = $_GET['status'] ?? null;
        $offset = ($page - 1) * $perPage;

        $where = '';
        $params = [];
        if ($status) {
            $where = 'WHERE e.status = ?';
            $params[] = $status;
        }

        $countStmt = $db->prepare("SELECT COUNT(*) FROM enquiries e $where");
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();

        $stmt = $db->prepare(
            "SELECT e.*, ip.first_name, ip.last_name, ip.profile_photo, ip.country,
                    u.email as brand_email, bp.company_name
             FROM enquiries e
             JOIN influencer_profiles ip ON ip.id = e.influencer_id
             LEFT JOIN users u ON u.id = e.brand_id
             LEFT JOIN brand_profiles bp ON bp.user_id = e.brand_id
             $where
             ORDER BY e.created_at DESC
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
        $id = (int) ($segments[2] ?? 0);

        if (!$id) {
            http_response_code(422);
            echo json_encode(['error' => 'Enquiry ID is required']);
            exit;
        }

        $enquiry = Enquiry::findById($id);
        if (!$enquiry) {
            http_response_code(404);
            echo json_encode(['error' => 'Enquiry not found']);
            exit;
        }

        if (isset($input['status'])) {
            $allowedStatuses = ['pending', 'read', 'replied', 'closed'];
            if (!in_array($input['status'], $allowedStatuses)) {
                http_response_code(422);
                echo json_encode(['error' => 'Invalid status']);
                exit;
            }
            $stmt = $db->prepare('UPDATE enquiries SET status = ? WHERE id = ?');
            $stmt->execute([$input['status'], $id]);
        }

        if (isset($input['admin_notes'])) {
            $stmt = $db->prepare('UPDATE enquiries SET admin_notes = ? WHERE id = ?');
            $stmt->execute([$input['admin_notes'], $id]);
        }

        $enquiry = Enquiry::findById($id);
        echo json_encode(['enquiry' => $enquiry, 'message' => 'Enquiry updated']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
