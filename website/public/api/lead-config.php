<?php

declare(strict_types=1);

$defaults = [
    'to_email' => 'arra@jstudio.sk',
    'from_email' => 'arra@jstudio.sk',
    'from_name' => 'ARRA Website',
    'log_file' => __DIR__ . '/logs/leads.jsonl',
    'recaptcha_secret_key' => '',
];

$localConfigPath = __DIR__ . '/lead-config.local.php';
if (is_file($localConfigPath)) {
    $local = require $localConfigPath;
    if (is_array($local)) {
        return array_merge($defaults, $local);
    }
}

return $defaults;
