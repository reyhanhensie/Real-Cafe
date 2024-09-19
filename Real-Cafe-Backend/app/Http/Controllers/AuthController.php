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
        $tokenKasir = env(key: 'TOKEN_KASIR');
        $tokenDapur = env(key: 'TOKEN_DAPUR');
        $tokenAdmin = "KJGI41";
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:5',
            'secret_token' => 'required|string',
        ]);

        // If validation fails, return the errors
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Determine the role based on the secret token
        if ($request->secret_token === $tokenKasir) {
            $role = User::ROLE_KASIR;
        } elseif ($request->secret_token === $tokenDapur) {
            $role = User::ROLE_DAPUR;
        } elseif ($request->secret_token === $tokenAdmin) {
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

        //return response JSON user is created
        if ($user) {
            return response()->json([
                'success' => true,
                'user'    => $user,
            ], status: 201);
        }

        //return JSON process insert failed 
        return response()->json([
            'success' => false,
        ], status: 409);
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
        //set validation
        $validator = Validator::make($request->all(), [
            'username'  => 'required',
            'password'  => 'required'
        ]);

        //if validation fails
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        //get credentials from request
        $credentials = $request->only('username', 'password');

        //if auth failed
        if (!$token = auth()->guard('api')->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau Password Anda salah'
            ], 401);
        }

        //if auth success
        return response()->json([
            'success' => true,
            'user'    => auth()->guard('api')->user(),
            'token'   => $token
        ], 200);
    }



    public function me()
    {
        return response()->json([
            'user' => Auth::user(),
            'role' => Auth::user()->role,
        ]);
    }


    /**
     * Handle user logout and session destruction.
     */
    public function logout(Request $request)
    {
        //remove token
        $removeToken = JWTAuth::invalidate(JWTAuth::getToken());

        if ($removeToken) {
            //return response JSON
            return response()->json([
                'success' => true,
                'message' => 'Logout Berhasil!',
            ]);
        }
    }
}
