<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
   ->withMiddleware(function (Middleware $middleware) {
    // 1. הוספת CORS כעדיפות עליונה
    $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);

    $middleware->validateCsrfTokens(except: [
        'api/*', 
    ]);

    $middleware->api(prepend: [
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    ]);

    $middleware->alias([
        'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
    ]);
})
 ->withExceptions(function (Exceptions $exceptions) {
    $exceptions->render(function (\Throwable $e, $request) {
        if ($request->is('api/*')) {
            // זיהוי קוד השגיאה - אם אין קוד (כמו בשגיאות קוד PHP), נשתמש ב-500
            $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
            
            // טיפול ספציפי במודל לא נמצא (404)
            if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                $statusCode = 404;
            }

            return response()->json([
                'error' => true,
                'message' => $e->getMessage(),
                'type' => get_class($e), // עוזר מאוד לניפוי שגיאות
            ], $statusCode);
        }
    });
})->create();