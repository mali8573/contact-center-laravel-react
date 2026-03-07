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
            'contact_id' => 'required|exists:contacts,id', // מוודא שאיש הקשר קיים בבסיס הנתונים 
            'type'       => 'required|string|in:phone,email,meeting,other', // מגביל לסוגים הגיוניים
            'note'       => 'required|string|min:5', // הערה היא חובה לפי הלוגיקה של המערכת 
            'timestamp'  => 'nullable|date', // אם לא נשלח, הקונטרולר יציב את הזמן הנוכחי 
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