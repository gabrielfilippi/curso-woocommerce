<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit8d631394ae6d8cfb6d8d026362a49ce4
{
    public static $prefixLengthsPsr4 = array (
        'c' => 
        array (
            'chillerlan\\Settings\\' => 20,
            'chillerlan\\QRCode\\' => 18,
        ),
        'P' => 
        array (
            'Piggly\\WC\\Pix\\' => 14,
            'Piggly\\Pix\\' => 11,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'chillerlan\\Settings\\' => 
        array (
            0 => __DIR__ . '/..' . '/chillerlan/php-settings-container/src',
        ),
        'chillerlan\\QRCode\\' => 
        array (
            0 => __DIR__ . '/..' . '/chillerlan/php-qrcode/src',
        ),
        'Piggly\\WC\\Pix\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src',
        ),
        'Piggly\\Pix\\' => 
        array (
            0 => __DIR__ . '/..' . '/piggly/php-pix/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit8d631394ae6d8cfb6d8d026362a49ce4::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit8d631394ae6d8cfb6d8d026362a49ce4::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit8d631394ae6d8cfb6d8d026362a49ce4::$classMap;

        }, null, ClassLoader::class);
    }
}
