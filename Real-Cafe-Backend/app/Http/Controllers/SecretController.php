<?php

// app/Http/Controllers/SecretController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SecretController extends Controller
{
    /**
     * Show the secret data.
     *
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        return response()->json(['message' => 'You have access to the secret data.']);
    }
}
