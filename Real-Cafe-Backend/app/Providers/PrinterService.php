<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use Mike42\Escpos\Printer;
use Mike42\Escpos\PrintConnectors\FilePrintConnector;

use Illuminate\Support\Facades\Log;

namespace App\Services;

class PrinterService
{
    protected $printer;
    protected $connector;

    public function connect()
    {
        if ($this->printer === null) {
            $this->connector = new FilePrintConnector("/dev/usb/lp0");
            $this->printer = new Printer($this->connector);
        }
    }

    public function printTest()
    {
        try {
            $this->connect(); // Connect when printing is called
            $this->printer->text("Direct Test Print\n");
            $this->printer->cut();
            $this->printer->close();
        } catch (\Exception $e) {
            Log::info("Printer error: " . $e->getMessage());
        }
    }
}
