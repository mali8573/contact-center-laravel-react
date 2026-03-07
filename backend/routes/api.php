<?php

use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\InteractionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// 1. חיבור נתיבי האימות (Login, Register וכו') מהקובץ ששלחת
require __DIR__.'/auth.php';

// 2. נתיבים מוגנים - רק למשתמש שנכנס עם אימייל וסיסמה
Route::middleware('auth:sanctum')->group(function () {

    // שחזור ממחיקה (חייב להופיע מעל ה-Resource)
    Route::post('contacts/{id}/restore', [ContactController::class, 'restore']);
    Route::post('interactions/{id}/restore', [InteractionController::class, 'restore']);

    // ניהול אנשי קשר ואינטראקציות
    Route::apiResource('contacts', ContactController::class);
    Route::apiResource('interactions', InteractionController::class);

    // קבלת פרטי המשתמש המחובר (בשביל ה-Header ב-React)
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});