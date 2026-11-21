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
$smtpOutsidePath = __DIR__ . '/../../smtp-config.local.php';
$smtpLocalPath = __DIR__ . '/smtp-config.local.php';
$logDir = __DIR__ . '/logs';
$phpmailerAutoload = __DIR__ . '/vendor/autoload.php';

$config = [];
$configError = '';

if (!is_file($configPath)) {
    $configError = 'lead-config.php is missing.';
} else {
    try {
        $loaded = require $configPath;
        if (!is_array($loaded)) {
            $configError = 'lead-config.php did not return an array.';
        } else {
            $config = $loaded;
        }
    } catch (Throwable $error) {
        $configError = $error->getMessage();
    }
}

$smtp = [];
$smtpPathUsed = '';
foreach ([$smtpOutsidePath, $smtpLocalPath] as $candidate) {
    if (!is_file($candidate)) {
        continue;
    }
    try {
        $loadedSmtp = require $candidate;
        if (is_array($loadedSmtp)) {
            $smtp = $loadedSmtp;
            $smtpPathUsed = basename(dirname($candidate)) . '/' . basename($candidate);
            break;
        }
    } catch (Throwable $error) {
        $configError = $configError !== '' ? $configError : 'smtp-config load failed.';
    }
}

$secret = trim($config['recaptcha_secret_key'] ?? '');
$smtpPassword = (string) ($smtp['password'] ?? '');
$smtpHost = trim((string) ($smtp['host'] ?? ''));
$smtpUser = trim((string) ($smtp['username'] ?? ''));
$logDirWritable = is_dir($logDir) ? is_writable($logDir) : is_writable(__DIR__);

$testLogWrite = false;
if ($logDirWritable) {
    if (!is_dir($logDir)) {
        $logDirWritable = @mkdir($logDir, 0755, true);
    }
    if (is_dir($logDir) && is_writable($logDir)) {
        $testLogWrite = @file_put_contents($logDir . '/.write-test', "ok\n", FILE_APPEND) !== false;
        if ($testLogWrite) {
            @unlink($logDir . '/.write-test');
        }
    }
}

echo json_encode([
    'ok' => $configError === '',
    'config_error' => $configError,
    'lead_php' => true,
    'local_config_exists' => is_file($localPath),
    'recaptcha_configured' => $secret !== '',
    'recaptcha_secret_length' => strlen($secret),
    'smtp_config_exists' => $smtpPathUsed !== '',
    'smtp_configured' => $smtpHost !== '' && $smtpUser !== '' && $smtpPassword !== '',
    'smtp_host_set' => $smtpHost !== '',
    'phpmailer_present' => is_file($phpmailerAutoload),
    'curl_available' => function_exists('curl_init'),
    'openssl_available' => extension_loaded('openssl'),
    'mbstring_available' => function_exists('mb_substr'),
    'log_dir_exists' => is_dir($logDir),
    'log_dir_writable' => $logDirWritable,
    'log_write_test' => $testLogWrite,
    'php_version' => PHP_VERSION,
], JSON_UNESCAPED_UNICODE);
