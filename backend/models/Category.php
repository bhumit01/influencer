<?php

require_once __DIR__ . '/../config/database.php';

class Category {
    public static function all(): array {
        $db = Database::getInstance();
        $stmt = $db->query('SELECT * FROM categories ORDER BY name ASC');
        return $stmt->fetchAll();
    }

    public static function findBySlug(string $slug): ?array {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM categories WHERE slug = ? LIMIT 1');
        $stmt->execute([$slug]);
        return $stmt->fetch() ?: null;
    }

    public static function findById(int $id): ?array {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM categories WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public static function create(array $data): int {
        $db = Database::getInstance();
        $stmt = $db->prepare('INSERT INTO categories (name, slug, description, icon) VALUES (?, ?, ?, ?)');
        $stmt->execute([$data['name'], $data['slug'], $data['description'] ?? null, $data['icon'] ?? null]);
        return (int) $db->lastInsertId();
    }

    public static function withInfluencerCount(): array {
        $db = Database::getInstance();
        $stmt = $db->query(
            'SELECT c.*, COUNT(ic.influencer_id) as influencer_count
             FROM categories c
             LEFT JOIN influencer_categories ic ON c.id = ic.category_id
             LEFT JOIN influencer_profiles ip ON ic.influencer_id = ip.id
             LEFT JOIN users u ON u.id = ip.user_id AND u.status = "active"
             GROUP BY c.id
             ORDER BY influencer_count DESC, c.name ASC'
        );
        return $stmt->fetchAll();
    }
}
