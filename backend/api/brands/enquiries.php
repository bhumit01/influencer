<?php

require_once __DIR__ . '/../../models/Enquiry.php';

switch ($method) {
    case 'GET':
        $page = (int) ($_GET['page'] ?? 1);
        $result = Enquiry::findByBrand($user['id'], $page);
        echo json_encode($result);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['influencer_id']) || empty($input['message'])) {
            http_response_code(422);
            echo json_encode(['error' => 'influencer_id and message are required']);
            exit;
        }

        $id = Enquiry::create([
            'brand_id'         => $user['id'],
            'influencer_id'    => (int) $input['influencer_id'],
            'subject'          => $input['subject'] ?? null,
            'message'          => $input['message'],
            'budget_range'     => $input['budget_range'] ?? null,
            'campaign_details' => $input['campaign_details'] ?? null,
        ]);

        $enquiry = Enquiry::findById($id);
        http_response_code(201);
        echo json_encode(['enquiry' => $enquiry, 'message' => 'Enquiry sent to admin']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
