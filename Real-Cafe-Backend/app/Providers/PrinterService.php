<?php

namespace App\Services;

use Mike42\Escpos\Printer;
use Mike42\Escpos\PrintConnectors\FilePrintConnector;

class PrinterService
{
    public function printReceipt(string $message)
    {
        try {
            // Connect to the thermal printer
            $connector = new FilePrintConnector("/dev/usb/lp0");
            $printer = new Printer($connector);

            // Print the message
            $printer->text($message . "\n");
            $printer->cut();

            // Close the connection
            $printer->close();
        } catch (\Exception $e) {
            // Handle errors (log or rethrow)
            throw new \Exception("Printing failed: " . $e->getMessage());
        }
    }
}
