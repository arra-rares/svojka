<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function leadRespond(int $statusCode, array $payload)
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function leadTruncate(string $value, int $maxLength): string
{
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength);
    }

    return substr($value, 0, $maxLength);
}

function leadCleanString($value, int $maxLength): string
{
    if (!is_string($value)) {
        return '';
    }

    $trimmed = trim($value);
    if ($trimmed === '') {
        return '';
    }

    return leadTruncate($trimmed, $maxLength);
}

function leadLoadConfig(): array
{
    $configPath = __DIR__ . '/lead-config.php';
    if (!is_file($configPath)) {
        leadRespond(500, ['ok' => false, 'error' => 'Missing lead-config.php on server.']);
    }

    $config = require $configPath;
    if (!is_array($config)) {
        leadRespond(500, ['ok' => false, 'error' => 'Invalid lead-config.php format.']);
    }

    return $config;
}

function leadReadJsonBody(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        leadRespond(400, ['ok' => false, 'error' => 'Invalid JSON body.']);
    }

    return $decoded;
}

function leadValidatePayload(array $body): array
{
    $eventDate = leadCleanString($body['event_date'] ?? '', 10);
    $email = leadCleanString($body['email'] ?? '', 254);
    $phone = leadCleanString($body['phone'] ?? '', 40);
    $location = leadCleanString($body['location'] ?? '', 200);
    $type = leadCleanString($body['type'] ?? '', 40);
    $people = leadCleanString($body['people'] ?? '', 10);

    if ($eventDate === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $eventDate)) {
        leadRespond(400, ['ok' => false, 'error' => 'Event date is required.']);
    }

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        leadRespond(400, ['ok' => false, 'error' => 'Valid email is required.']);
    }

    if ($people !== '' && !preg_match('/^\d{1,6}$/', $people)) {
        leadRespond(400, ['ok' => false, 'error' => 'Guest count must be a number.']);
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

function leadIsHoneypotTriggered(array $body): bool
{
    return leadCleanString($body['company_website'] ?? '', 200) !== '';
}

function leadVerifyRecaptcha(array $config, string $token)
{
    $secret = trim($config['recaptcha_secret_key'] ?? '');
    if ($secret === '') {
        leadRespond(500, ['ok' => false, 'error' => 'reCAPTCHA is not configured on the server.']);
    }

    if ($token === '') {
        leadRespond(400, ['ok' => false, 'error' => 'reCAPTCHA verification required.']);
    }

    $payload = http_build_query([
        'secret' => $secret,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
    ]);

    $result = false;

    if (function_exists('curl_init')) {
        $handle = curl_init('https://www.google.com/recaptcha/api/siteverify');
        if ($handle !== false) {
            curl_setopt_array($handle, [
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $payload,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 10,
            ]);
            $result = curl_exec($handle);
            curl_close($handle);
        }
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
        leadRespond(500, ['ok' => false, 'error' => 'Unable to verify reCAPTCHA (server cannot reach Google).']);
    }

    $decoded = json_decode((string) $result, true);
    if (!is_array($decoded) || empty($decoded['success'])) {
        $errorCodes = is_array($decoded['error-codes'] ?? null)
            ? implode(', ', $decoded['error-codes'])
            : 'unknown';
        leadRespond(400, ['ok' => false, 'error' => 'reCAPTCHA verification failed: ' . $errorCodes]);
    }
}

function leadAppendLog(string $logFile, array $lead): bool
{
    $logDir = dirname($logFile);
    if (!is_dir($logDir) && !mkdir($logDir, 0755, true) && !is_dir($logDir)) {
        return false;
    }

    $line = json_encode($lead, JSON_UNESCAPED_UNICODE) . PHP_EOL;
    return file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX) !== false;
}

function leadSendEmail(array $config, array $lead): bool
{
    $to = $config['to_email'] ?? '';
    if ($to === '') {
        return false;
    }

    $fromEmail = $config['from_email'] ?? $to;
    $fromName = $config['from_name'] ?? 'ARRA Website';
    $subject = 'New event inquiry - ' . $lead['event_date'];

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

    $sent = mail($to, $subject, $body, implode("\r\n", $headers));

    // PHP 7.0 mail() can return null on some hosts; strict :bool rejects that.
    return $sent === true;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    leadRespond(405, ['ok' => false, 'error' => 'Method not allowed.']);
}

try {
    $config = leadLoadConfig();
    $body = leadReadJsonBody();

    if (leadIsHoneypotTriggered($body)) {
        leadRespond(200, ['ok' => true]);
    }

    leadVerifyRecaptcha($config, leadCleanString($body['recaptcha_token'] ?? '', 4096));
    $lead = leadValidatePayload($body);

    $logSaved = leadAppendLog($config['log_file'], $lead);
    $mailSent = leadSendEmail($config, $lead);

    if (!$logSaved && !$mailSent) {
        leadRespond(500, [
            'ok' => false,
            'error' => 'Unable to save lead log or send email. Check api/logs permissions on server.',
        ]);
    }

    leadRespond(200, [
        'ok' => true,
        'mail_sent' => $mailSent,
        'log_saved' => $logSaved,
    ]);
} catch (Throwable $error) {
    leadRespond(500, [
        'ok' => false,
        'error' => 'Lead handler error: ' . $error->getMessage(),
    ]);
}
