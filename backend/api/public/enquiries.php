<?php

require_once __DIR__ . '/../../models/Enquiry.php';

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['influencer_id']) || empty($input['message'])) {
    http_response_code(422);
    echo json_encode(['error' => 'influencer_id and message are required']);
    exit;
}

$id = Enquiry::create([
    'influencer_id'    => (int) $input['influencer_id'],
    'subject'          => $input['subject'] ?? null,
    'message'          => $input['message'],
    'budget_range'     => $input['budget_range'] ?? null,
    'campaign_details' => $input['campaign_details'] ?? null,
    'contact_name'     => $input['contact_name'] ?? null,
    'contact_email'    => $input['contact_email'] ?? null,
]);

$enquiry = Enquiry::findById($id);
http_response_code(201);
echo json_encode(['enquiry' => $enquiry, 'message' => 'Enquiry submitted successfully']);
