<?php

require_once __DIR__ . '/../../models/Category.php';

$db = Database::getInstance();

switch ($method) {
    case 'GET':
        $categories = Category::withInfluencerCount();
        echo json_encode(['categories' => $categories]);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['name']) || empty($input['slug'])) {
            http_response_code(422);
            echo json_encode(['error' => 'name and slug are required']);
            exit;
        }

        $id = Category::create([
            'name' => $input['name'],
            'slug' => $input['slug'],
            'description' => $input['description'] ?? null,
            'icon' => $input['icon'] ?? null,
        ]);

        $category = Category::findById($id);
        http_response_code(201);
        echo json_encode(['category' => $category, 'message' => 'Category created']);
        break;

    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = (int) ($segments[2] ?? 0);

        if (!$id) {
            http_response_code(422);
            echo json_encode(['error' => 'Category ID is required']);
            exit;
        }

        $category = Category::findById($id);
        if (!$category) {
            http_response_code(404);
            echo json_encode(['error' => 'Category not found']);
            exit;
        }

        $fields = [];
        $values = [];
        $allowed = ['name', 'slug', 'description', 'icon'];

        foreach ($input as $key => $value) {
            if (in_array($key, $allowed)) {
                $fields[] = "$key = ?";
                $values[] = $value;
            }
        }

        if (!empty($fields)) {
            $values[] = $id;
            $sql = 'UPDATE categories SET ' . implode(', ', $fields) . ' WHERE id = ?';
            $stmt = $db->prepare($sql);
            $stmt->execute($values);
        }

        $category = Category::findById($id);
        echo json_encode(['category' => $category, 'message' => 'Category updated']);
        break;

    case 'DELETE':
        $id = (int) ($segments[2] ?? 0);

        if (!$id) {
            http_response_code(422);
            echo json_encode(['error' => 'Category ID is required']);
            exit;
        }

        $category = Category::findById($id);
        if (!$category) {
            http_response_code(404);
            echo json_encode(['error' => 'Category not found']);
            exit;
        }

        $stmt = $db->prepare('DELETE FROM categories WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(['message' => 'Category deleted']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
