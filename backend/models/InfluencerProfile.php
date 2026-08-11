<?php

require_once __DIR__ . '/../config/database.php';

class InfluencerProfile {
    public static function findByUserId(int $userId): ?array {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM influencer_profiles WHERE user_id = ? LIMIT 1');
        $stmt->execute([$userId]);
        return $stmt->fetch() ?: null;
    }

    public static function findById(int $id): ?array {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM influencer_profiles WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public static function create(int $userId): int {
        $db = Database::getInstance();
        $stmt = $db->prepare('INSERT INTO influencer_profiles (user_id) VALUES (?)');
        $stmt->execute([$userId]);
        return (int) $db->lastInsertId();
    }

    public static function update(int $userId, array $data): bool {
        $db = Database::getInstance();
        $fields = [];
        $values = [];

        $allowed = [
            'first_name', 'last_name', 'bio', 'profile_photo', 'cover_photo',
            'country', 'city', 'languages', 'followers', 'engagement_rate',
            'pricing_min', 'pricing_max', 'pricing_currency', 'availability',
            'experience_years', 'accepts_barter', 'barter_description',
            'contact_email', 'contact_phone',
        ];

        foreach ($data as $key => $value) {
            if (in_array($key, $allowed)) {
                $fields[] = "$key = ?";
                $values[] = is_array($value) ? json_encode($value) : $value;
            }
        }

        if (empty($fields)) return false;

        $values[] = $userId;
        $sql = 'UPDATE influencer_profiles SET ' . implode(', ', $fields) . ' WHERE user_id = ?';
        $stmt = $db->prepare($sql);
        return $stmt->execute($values);
    }

    public static function fullProfile(int $userId): ?array {
        $profile = self::findByUserId($userId);
        if (!$profile) return null;

        $db = Database::getInstance();

        // Categories
        $stmt = $db->prepare(
            'SELECT c.* FROM categories c
             JOIN influencer_categories ic ON c.id = ic.category_id
             WHERE ic.influencer_id = ?'
        );
        $stmt->execute([$profile['id']]);
        $profile['categories'] = $stmt->fetchAll();

        // Social links
        $stmt = $db->prepare('SELECT * FROM social_links WHERE influencer_id = ?');
        $stmt->execute([$profile['id']]);
        $profile['social_links'] = $stmt->fetchAll();

        // Gallery
        $stmt = $db->prepare('SELECT * FROM gallery_items WHERE influencer_id = ? ORDER BY sort_order ASC');
        $stmt->execute([$profile['id']]);
        $profile['gallery'] = $stmt->fetchAll();

        // Past collaborations
        $stmt = $db->prepare('SELECT * FROM past_collaborations WHERE influencer_id = ? ORDER BY created_at DESC');
        $stmt->execute([$profile['id']]);
        $profile['collaborations'] = $stmt->fetchAll();

        return $profile;
    }

    public static function sanitizeForPublic(?array $profile): ?array {
        if ($profile === null) return null;

        $privateFields = [
            'pricing_min', 'pricing_max', 'pricing_currency',
            'accepts_barter', 'barter_description',
            'contact_email', 'contact_phone',
            'email',
        ];

        // Remove pricing data from the profile itself
        foreach ($privateFields as $field) {
            unset($profile[$field]);
        }

        // Also remove pricing from nested social links, gallery, collaborations
        // (they don't have pricing, so this is just for completeness)

        return $profile;
    }

    public static function search(array $filters = [], int $page = 1, int $perPage = 12): array {
        $db = Database::getInstance();
        $where = ['ip.id IS NOT NULL'];
        $params = [];

        if (!empty($filters['category'])) {
            $where[] = 'c.slug = ?';
            $params[] = $filters['category'];
        }

        if (!empty($filters['country'])) {
            $where[] = 'ip.country = ?';
            $params[] = $filters['country'];
        }

        if (!empty($filters['city'])) {
            $where[] = 'ip.city = ?';
            $params[] = $filters['city'];
        }

        if (!empty($filters['min_followers'])) {
            $where[] = 'ip.followers >= ?';
            $params[] = (int) $filters['min_followers'];
        }

        if (!empty($filters['max_followers'])) {
            $where[] = 'ip.followers <= ?';
            $params[] = (int) $filters['max_followers'];
        }

        if (!empty($filters['availability'])) {
            $where[] = 'ip.availability = ?';
            $params[] = $filters['availability'];
        }

        if (!empty($filters['search'])) {
            $where[] = '(ip.bio LIKE ? OR u.email LIKE ?)';
            $params[] = "%{$filters['search']}%";
            $params[] = "%{$filters['search']}%";
        }

        $whereClause = implode(' AND ', $where);
        $offset = ($page - 1) * $perPage;

        $countSql = "SELECT COUNT(DISTINCT ip.id) FROM influencer_profiles ip
                     JOIN users u ON u.id = ip.user_id
                     LEFT JOIN influencer_categories ic ON ic.influencer_id = ip.id
                     LEFT JOIN categories c ON c.id = ic.category_id
                     WHERE $whereClause AND u.status = 'active'";
        $countStmt = $db->prepare($countSql);
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();

        $sql = "SELECT DISTINCT ip.*, u.email, u.created_at as member_since
                FROM influencer_profiles ip
                JOIN users u ON u.id = ip.user_id
                LEFT JOIN influencer_categories ic ON ic.influencer_id = ip.id
                LEFT JOIN categories c ON c.id = ic.category_id
                WHERE $whereClause AND u.status = 'active'
                ORDER BY ip.followers DESC
                LIMIT ? OFFSET ?";
        $params[] = $perPage;
        $params[] = $offset;
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $results = $stmt->fetchAll();

        // Attach categories to each result
        foreach ($results as &$result) {
            $catStmt = $db->prepare(
                'SELECT c.* FROM categories c
                 JOIN influencer_categories ic ON c.id = ic.category_id
                 WHERE ic.influencer_id = ?'
            );
            $catStmt->execute([$result['id']]);
            $result['categories'] = $catStmt->fetchAll();
        }

        return [
            'data' => $results,
            'pagination' => [
                'page'       => $page,
                'per_page'   => $perPage,
                'total'      => $total,
                'total_pages'=> ceil($total / $perPage),
            ],
        ];
    }
}
