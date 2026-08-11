<?php

require_once __DIR__ . '/../../models/InfluencerProfile.php';

$page = (int) ($_GET['page'] ?? 1);
$perPage = min((int) ($_GET['per_page'] ?? DEFAULT_PER_PAGE), MAX_PER_PAGE);

$filters = [
    'search'         => $_GET['search'] ?? null,
    'category'       => $_GET['category'] ?? null,
    'country'        => $_GET['country'] ?? null,
    'city'           => $_GET['city'] ?? null,
    'min_followers'  => $_GET['min_followers'] ?? null,
    'max_followers'  => $_GET['max_followers'] ?? null,
    'availability'   => $_GET['availability'] ?? null,
];

$result = InfluencerProfile::search($filters, $page, $perPage);

// Sanitize private data from public listing
$result['data'] = array_map(['InfluencerProfile', 'sanitizeForPublic'], $result['data']);

echo json_encode($result);
