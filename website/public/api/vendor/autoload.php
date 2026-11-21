<?php

declare(strict_types=1);

/**
 * Minimal autoloader for the vendored PHPMailer 6.9.3 package (PHP >= 5.5 / 7.0 OK).
 */
spl_autoload_register(function ($class) {
    $prefix = 'PHPMailer\\PHPMailer\\';
    $prefixLength = strlen($prefix);
    if (strncmp($prefix, $class, $prefixLength) !== 0) {
        return;
    }

    $relative = substr($class, $prefixLength);
    $file = __DIR__ . '/phpmailer/phpmailer/src/' . str_replace('\\', '/', $relative) . '.php';
    if (is_file($file)) {
        require $file;
    }
});
