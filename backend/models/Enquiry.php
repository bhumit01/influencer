<?php

require_once __DIR__ . '/../config/database.php';

class Enquiry {
    public static function create(array $data): int {
        $db = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO enquiries (brand_id, influencer_id, subject, message, budget_range, campaign_details, contact_name, contact_email)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['brand_id'] ?? null,
            $data['influencer_id'],
            $data['subject'] ?? null,
            $data['message'],
            $data['budget_range'] ?? null,
            $data['campaign_details'] ?? null,
            $data['contact_name'] ?? null,
            $data['contact_email'] ?? null,
        ]);
        return (int) $db->lastInsertId();
    }

    public static function findById(int $id): ?array {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM enquiries WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public static function findByBrand(int $brandId, int $page = 1, int $perPage = 20): array {
        $db = Database::getInstance();
        $offset = ($page - 1) * $perPage;

        $countStmt = $db->prepare('SELECT COUNT(*) FROM enquiries WHERE brand_id = ?');
        $countStmt->execute([$brandId]);
        $total = (int) $countStmt->fetchColumn();

        $stmt = $db->prepare(
            'SELECT e.*, ip.first_name, ip.last_name, ip.profile_photo, ip.country
             FROM enquiries e
             JOIN influencer_profiles ip ON ip.id = e.influencer_id
             WHERE e.brand_id = ?
             ORDER BY e.created_at DESC
             LIMIT ? OFFSET ?'
        );
        $stmt->execute([$brandId, $perPage, $offset]);
        $data = $stmt->fetchAll();

        return [
            'data' => $data,
            'pagination' => [
                'page'        => $page,
                'per_page'    => $perPage,
                'total'       => $total,
                'total_pages' => ceil($total / $perPage),
            ],
        ];
    }

    public static function updateStatus(int $id, string $status): bool {
        $db = Database::getInstance();
        $stmt = $db->prepare('UPDATE enquiries SET status = ? WHERE id = ?');
        return $stmt->execute([$status, $id]);
    }
}
