<?php

require __DIR__ . '/vendor/autoload.php';

use Mike42\Escpos\Printer;
use Mike42\Escpos\PrintConnectors\FilePrintConnector;

try {
    // Set up the printer connection
    $connector = new FilePrintConnector("/dev/usb/lp0");
    $printer = new Printer($connector);

    // Send test print
    $printer->text("Hello, this is a test print!\n");
    $printer->cut();

    // Close the printer
    $printer->close();
} catch (Exception $e) {
    echo "Could not print to the printer: " . $e->getMessage() . "\n";
}
