<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
// שינוי ה-Return type מ-Response ל-JsonResponse
use Illuminate\Http\JsonResponse; 
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // 1. קבלת המשתמש שהתחבר
        $user = Auth::user();

        // 2. יצירת טוקן חדש (באמצעות Sanctum)
        $token = $user->createToken('auth_token')->plainTextToken;

        // 3. החזרת המידע ל-React בפורמט שה-Slice מצפה לו
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): JsonResponse
    {
        // מחיקת הטוקנים של המשתמש בעת התנתקות
        $request->user()->currentAccessToken()->delete();

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully']);
    }
}