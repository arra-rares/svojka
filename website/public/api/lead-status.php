<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);
    exit;
}

$configPath = __DIR__ . '/lead-config.php';
$localPath = __DIR__ . '/lead-config.local.php';
$logDir = __DIR__ . '/logs';

$config = is_file($configPath) ? require $configPath : [];
$secret = trim($config['recaptcha_secret_key'] ?? '');

$logDirWritable = is_dir($logDir) ? is_writable($logDir) : is_writable(__DIR__);

echo json_encode([
    'ok' => true,
    'lead_php' => true,
    'local_config_exists' => is_file($localPath),
    'recaptcha_configured' => $secret !== '',
    'recaptcha_secret_length' => strlen($secret),
    'curl_available' => function_exists('curl_init'),
    'log_dir_writable' => $logDirWritable,
    'php_version' => PHP_VERSION,
], JSON_UNESCAPED_UNICODE);
