<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContactRequest extends FormRequest
{
    /**
     * בדיקת הרשאות - במערכת כזו כדאי לוודא שהמשתמש מחובר.
     */
    public function authorize(): bool
    {
        // מחזיר אמת אם המשתמש מחובר (Sanctum) 
        return auth()->check();
    }

    /**
     * חוקי ולידציה דינמיים התומכים ביצירה ובעדכון.
     */
    public function rules(): array
    {
        // שליפת ה-ID של איש הקשר מהנתיב (קיים רק בעדכון) 
        $contactId = $this->route('contact');

        return [
            'name' => [
                $this->isMethod('post') ? 'required' : 'sometimes',
                'string',
                'min:2',
                'max:255'
            ],
            'email' => [
                $this->isMethod('post') ? 'required' : 'sometimes',
                'email',
                // שיפור קריטי: החרגת ה-ID הנוכחי בבדיקת ייחודיות כדי לאפשר עדכון [cite: 15, 23]
                Rule::unique('contacts', 'email')->ignore($contactId),
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'company' => ['nullable', 'string', 'max:100'],
        ];
    }

    /**
     * הודעות שגיאה מפורטות בעברית.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'חובה להזין שם מלא.',
            'name.min' => 'השם חייב להכיל לפחות 2 תווים.',
            'email.required' => 'כתובת האימייל היא שדה חובה.',
            'email.email' => 'נא להזין כתובת אימייל תקינה.',
            'email.unique' => 'כתובת האימייל הזו כבר משויכת לאיש קשר אחר.',
            'phone.max' => 'מספר הטלפון ארוך מדי (מקסימום 20 תווים).',
        ];
    }
}