<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);
    exit;
}

$config = require __DIR__ . '/lead-config.php';

function respond(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function readJsonBody(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        respond(400, ['ok' => false, 'error' => 'Invalid JSON body.']);
    }

    return $decoded;
}

function cleanString(mixed $value, int $maxLength): string
{
    if (!is_string($value)) {
        return '';
    }

    $trimmed = trim($value);
    if ($trimmed === '') {
        return '';
    }

    return mb_substr($trimmed, 0, $maxLength);
}

function validateLead(array $body): array
{
    $eventDate = cleanString($body['event_date'] ?? '', 10);
    $email = cleanString($body['email'] ?? '', 254);
    $phone = cleanString($body['phone'] ?? '', 40);
    $location = cleanString($body['location'] ?? '', 200);
    $type = cleanString($body['type'] ?? '', 40);
    $people = cleanString($body['people'] ?? '', 10);

    if ($eventDate === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $eventDate)) {
        respond(400, ['ok' => false, 'error' => 'Event date is required.']);
    }

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respond(400, ['ok' => false, 'error' => 'Valid email is required.']);
    }

    if ($people !== '' && !preg_match('/^\d{1,6}$/', $people)) {
        respond(400, ['ok' => false, 'error' => 'Guest count must be a number.']);
    }

    return [
        'date' => gmdate('c'),
        'event_date' => $eventDate,
        'email' => $email,
        'phone' => $phone,
        'location' => $location,
        'type' => $type,
        'people' => $people,
    ];
}

function isHoneypotTriggered(array $body): bool
{
    return cleanString($body['company_website'] ?? '', 200) !== '';
}

function verifyRecaptcha(array $config, string $token): void
{
    $secret = trim($config['recaptcha_secret_key'] ?? '');
    if ($secret === '') {
        respond(500, ['ok' => false, 'error' => 'reCAPTCHA is not configured on the server.']);
    }

    if ($token === '') {
        respond(400, ['ok' => false, 'error' => 'reCAPTCHA verification required.']);
    }

    $payload = http_build_query([
        'secret' => $secret,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
    ]);

    $result = false;

    if (function_exists('curl_init')) {
        $handle = curl_init('https://www.google.com/recaptcha/api/siteverify');
        curl_setopt_array($handle, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
        ]);
        $result = curl_exec($handle);
        curl_close($handle);
    }

    if ($result === false) {
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
                'content' => $payload,
                'timeout' => 10,
                'ignore_errors' => true,
            ],
        ]);

        $result = @file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $context);
    }

    if ($result === false) {
        respond(500, ['ok' => false, 'error' => 'Unable to verify reCAPTCHA.']);
    }

    $decoded = json_decode((string) $result, true);
    if (!is_array($decoded) || empty($decoded['success'])) {
        $errorCodes = is_array($decoded['error-codes'] ?? null)
            ? implode(', ', $decoded['error-codes'])
            : 'unknown';
        respond(400, ['ok' => false, 'error' => 'reCAPTCHA verification failed: ' . $errorCodes]);
    }
}

function appendLeadLog(string $logFile, array $lead): void
{
    $logDir = dirname($logFile);
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }

    $line = json_encode($lead, JSON_UNESCAPED_UNICODE) . PHP_EOL;
    file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);
}

function sendLeadEmail(array $config, array $lead): bool
{
    $to = $config['to_email'] ?? '';
    if ($to === '') {
        return false;
    }

    $fromEmail = $config['from_email'] ?? $to;
    $fromName = $config['from_name'] ?? 'ARRA Website';
    $subject = 'New event inquiry — ' . $lead['event_date'];

    $lines = [
        'New booking request from the website',
        '',
        'Submitted: ' . $lead['date'],
        'Event date: ' . $lead['event_date'],
        'Email: ' . $lead['email'],
        'Phone: ' . ($lead['phone'] !== '' ? $lead['phone'] : '(not provided)'),
        'Location: ' . ($lead['location'] !== '' ? $lead['location'] : '(not provided)'),
        'Event type: ' . ($lead['type'] !== '' ? $lead['type'] : '(not provided)'),
        'Guests: ' . ($lead['people'] !== '' ? $lead['people'] : '(not provided)'),
    ];

    $body = implode("\n", $lines);
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'From: ' . sprintf('%s <%s>', $fromName, $fromEmail),
        'Reply-To: ' . $lead['email'],
    ];

    return mail($to, $subject, $body, implode("\r\n", $headers));
}

$body = readJsonBody();

if (isHoneypotTriggered($body)) {
    respond(200, ['ok' => true]);
}

verifyRecaptcha($config, cleanString($body['recaptcha_token'] ?? '', 4096));
$lead = validateLead($body);

try {
    appendLeadLog($config['log_file'], $lead);
} catch (Throwable $error) {
    respond(500, ['ok' => false, 'error' => 'Unable to save lead.']);
}

$mailSent = sendLeadEmail($config, $lead);

respond(200, [
    'ok' => true,
    'mail_sent' => $mailSent,
]);
