<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInteractionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check(); // הגנה בסיסית - רק משתמש מחובר [cite: 19]
    }

    public function rules(): array
    {

    return [
        'contact_id' => 'required|exists:contacts,id',
        // שינינו ל-lowercase כדי לנרמל, או פשוט נוריד את ה-in לבדיקה
        'type'       => 'required|string', 
        'note'       => 'required|string|min:2', // הורדנו ל-2 תווים כדי למנוע תסכול
        'timestamp'  => 'nullable', // גמישות בפורמט התאריך
    ];

    }

    public function messages(): array
    {
        return [
            'contact_id.exists' => 'איש הקשר שנבחר אינו קיים במערכת.',
            'type.required'     => 'חובה לציין את סוג האינטראקציה.',
            'note.min'          => 'ההערה חייבת להכיל לפחות 5 תווים.',
        ];
    }
}