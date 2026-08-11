<?php

require_once __DIR__ . '/../config/database.php';

class User {
    public static function findByEmail(string $email): ?array {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public static function findById(int $id): ?array {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT id, email, role, status, created_at FROM users WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public static function create(array $data): int {
        $db = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO users (email, password, role) VALUES (?, ?, ?)'
        );
        $stmt->execute([
            $data['email'],
            password_hash($data['password'], PASSWORD_BCRYPT),
            $data['role'],
        ]);
        return (int) $db->lastInsertId();
    }

    public static function update(int $id, array $data): bool {
        $db = Database::getInstance();
        $fields = [];
        $values = [];

        foreach ($data as $key => $value) {
            if (in_array($key, ['email', 'password', 'role', 'status'])) {
                $fields[] = "$key = ?";
                $values[] = $value;
            }
        }

        if (empty($fields)) return false;

        $values[] = $id;
        $sql = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $stmt = $db->prepare($sql);
        return $stmt->execute($values);
    }

    public static function delete(int $id): bool {
        $db = Database::getInstance();
        $stmt = $db->prepare('DELETE FROM users WHERE id = ?');
        return $stmt->execute([$id]);
    }

    public static function profile(int $id): ?array {
        $db = Database::getInstance();
        $user = self::findById($id);
        if (!$user) return null;

        $profile = null;
        if ($user['role'] === 'brand') {
            $stmt = $db->prepare('SELECT * FROM brand_profiles WHERE user_id = ? LIMIT 1');
            $stmt->execute([$id]);
            $profile = $stmt->fetch();
        } elseif ($user['role'] === 'influencer') {
            $stmt = $db->prepare('SELECT * FROM influencer_profiles WHERE user_id = ? LIMIT 1');
            $stmt->execute([$id]);
            $profile = $stmt->fetch();
        }

        $user['profile'] = $profile ?: null;
        return $user;
    }
}
