<?php

require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../models/Enquiry.php';
require_once __DIR__ . '/../../models/InfluencerProfile.php';
require_once __DIR__ . '/../../models/BrandProfile.php';
require_once __DIR__ . '/../../models/Category.php';

$adminUser = requireRole('admin');

$action = $segments[1] ?? '';
$subAction = $segments[2] ?? '';

// Handle stats endpoint
if ($action === 'stats') {
    $db = Database::getInstance();
    
    // Total influencers
    $stmt = $db->prepare("SELECT COUNT(*) FROM users WHERE role = 'influencer'");
    $stmt->execute();
    $total_influencers = (int) $stmt->fetchColumn();
    
    // Total brands
    $stmt = $db->prepare("SELECT COUNT(*) FROM users WHERE role = 'brand'");
    $stmt->execute();
    $total_brands = (int) $stmt->fetchColumn();
    
    // Total enquiries
    $stmt = $db->prepare("SELECT COUNT(*) FROM enquiries");
    $stmt->execute();
    $total_enquiries = (int) $stmt->fetchColumn();
    
    // Pending enquiries
    $stmt = $db->prepare("SELECT COUNT(*) FROM enquiries WHERE status = 'pending'");
    $stmt->execute();
    $pending_enquiries = (int) $stmt->fetchColumn();
    
    // Total categories
    $stmt = $db->prepare("SELECT COUNT(*) FROM categories");
    $stmt->execute();
    $total_categories = (int) $stmt->fetchColumn();
    
    echo json_encode([
        'total_influencers' => $total_influencers,
        'total_brands' => $total_brands,
        'total_enquiries' => $total_enquiries,
        'pending_enquiries' => $pending_enquiries,
        'total_categories' => $total_categories,
    ]);
    exit;
}

switch ($action) {
    case 'enquiries':
        require __DIR__ . '/enquiries.php';
        break;
    case 'categories':
        require __DIR__ . '/categories.php';
        break;
    case 'creators':
        require __DIR__ . '/creators.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Admin endpoint not found']);
}
