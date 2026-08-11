<?php

require_once __DIR__ . '/../config/database.php';

class BrandProfile {
    public static function findByUserId(int $userId): ?array {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM brand_profiles WHERE user_id = ? LIMIT 1');
        $stmt->execute([$userId]);
        return $stmt->fetch() ?: null;
    }

    public static function create(int $userId, array $data): int {
        $db = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO brand_profiles (user_id, company_name, industry, website, description)
             VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $userId,
            $data['company_name'] ?? 'My Company',
            $data['industry'] ?? null,
            $data['website'] ?? null,
            $data['description'] ?? null,
        ]);
        return (int) $db->lastInsertId();
    }

    public static function update(int $userId, array $data): bool {
        $db = Database::getInstance();
        $fields = [];
        $values = [];

        $allowed = ['company_name', 'industry', 'website', 'logo', 'description', 'location'];

        foreach ($data as $key => $value) {
            if (in_array($key, $allowed)) {
                $fields[] = "$key = ?";
                $values[] = $value;
            }
        }

        if (empty($fields)) return false;

        $values[] = $userId;
        $sql = 'UPDATE brand_profiles SET ' . implode(', ', $fields) . ' WHERE user_id = ?';
        $stmt = $db->prepare($sql);
        return $stmt->execute($values);
    }
}
