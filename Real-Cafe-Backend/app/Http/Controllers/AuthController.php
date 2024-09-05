<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    // Secret token required for registration and password reset

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

        // Determine the role based on the secret token
        if ($request->secret_token === env('TOKEN_USER')) {
            $role = User::ROLE_USER;
        } elseif ($request->secret_token === env('TOKEN_ADMIN')) {
            $role = User::ROLE_ADMIN;
        } else {
            return response()->json(['error' => 'Invalid secret token.'], 401);
        }

        // Create a new user with the determined role
        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => $role, // Assign the role based on the secret token
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
        if ($request->secret_token !== env('TOKEN_RESET')) {
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

        if (!$token = Auth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials.'], 401);
        }

        // Return the JWT token and user details using the helper method
        return $this->respondWithToken($token);
    }



    public function me()
    {
        return response()->json([
            'user' => Auth::user(),
            'role' => Auth::user()->role,
        ]);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::factory()->getTTL() * 60,
            'user' => Auth::user(), // User details along with the token
            'role' => Auth::user()->role, // Include the user's role in the response
        ]);
    }


    /**
     * Handle user logout and session destruction.
     */
    public function logout(Request $request)
    {
        // Invalidate the JWT token
        JWTAuth::invalidate(JWTAuth::getToken());

        // Optionally, invalidate the session (for web-based session)
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logout successful.'], 200);
    }
}
