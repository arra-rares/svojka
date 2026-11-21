<?php

declare(strict_types=1);

/**
 * Example SMTP config for ARRA lead emails (PHPMailer).
 *
 * Preferred production path (outside the website document root):
 *   /www_root/smtp-config.local.php
 *   (loaded by api/lead.php via __DIR__ . '/../../smtp-config.local.php')
 *
 * Fallback (still gitignored; blocked from web by api/.htaccess):
 *   website/public/api/smtp-config.local.php  →  uploaded as api/smtp-config.local.php
 *
 * Copy this file, rename to smtp-config.local.php, set the real password, never commit it.
 */
return [
    'host' => 'mail.webhouse.sk',
    'port' => 587,
    'encryption' => 'tls', // STARTTLS
    'username' => 'arra@jstudio.sk',
    'password' => 'REPLACE_WITH_MAILBOX_PASSWORD',
    'to_email' => 'arra@jstudio.sk',
    'from_email' => 'arra@jstudio.sk',
    'from_name' => 'ARRA Website',
];
