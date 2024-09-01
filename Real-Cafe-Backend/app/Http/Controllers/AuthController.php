<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Secret token required for registration and password reset
    private $secretToken = 'X7P2L';

    /**
     * Handle the registration of a new user.
     */
    public function register(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:6',
            'secret_token' => 'required|string',
        ]);

        // If validation fails, return the errors
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if the provided secret token matches the predefined token
        if ($request->secret_token !== $this->secretToken) {
            return response()->json(['error' => 'Invalid secret token.'], 401);
        }

        // Create a new user
        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
        ]);

        // Return a success response
        return response()->json(['message' => 'User registered successfully.'], 201);
    }

    /**
     * Handle password reset for a user.
     */
    public function resetPassword(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|exists:users,username',
            'new_password' => 'required|string|min:6',
            'secret_token' => 'required|string',
        ]);

        // If validation fails, return the errors
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if the provided secret token matches the predefined token
        if ($request->secret_token !== $this->secretToken) {
            return response()->json(['error' => 'Invalid secret token.'], 401);
        }

        // Find the user by username
        $user = User::where('username', $request->username)->first();

        // Update the user's password
        $user->password = Hash::make($request->new_password);
        $user->save();

        // Return a success response
        return response()->json(['message' => 'Password reset successfully.'], 200);
    }

    /**
     * Handle user login and session creation.
     */
    public function login(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // If validation fails, return the errors
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Attempt to authenticate the user
        $credentials = $request->only('username', 'password');

        if (Auth::attempt($credentials)) {
            // Authentication passed, generate session token
            $request->session()->regenerate();

            return response()->json([
                'message' => 'Login successful.',
                'user' => Auth::user(),
            ], 200);
        }

        // Authentication failed
        return response()->json(['error' => 'Invalid credentials.'], 401);
    }

    /**
     * Handle user logout and session destruction.
     */
    public function logout(Request $request)
    {
        Auth::logout();

        // Invalidate the session
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logout successful.'], 200);
    }
}
