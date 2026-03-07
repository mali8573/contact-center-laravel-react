<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
public function run(): void
{
    // 1. יצירת מנהל מערכת (Admin) - בעל הרשאות מחיקה ועריכה
    \App\Models\User::factory()->create([
        'name' => 'Admin User',
        'email' => 'admin@example.com',
        'password' => bcrypt('password'), // חשוב להגדיר סיסמה ידועה לבדיקות
        'is_admin' => true,                // השדה שהוספנו במיגרציה
    ]);

    // 2. יצירת עובד רגיל (Agent) - יכול רק לצפות ולהוסיף אינטראקציות
    \App\Models\User::factory()->create([
        'name' => 'Agent User',
        'email' => 'agent@example.com',
        'password' => bcrypt('password'),
        'is_admin' => false,
    ]);

    // 3. יצירת נתוני בדיקה לאנשי קשר ואינטראקציות (דרישת המשימה)
    // המשימה דורשת seeders עם sample contact and interaction data [cite: 19, 40]
    \App\Models\Contact::factory(10)
        ->hasInteractions(3) 
        ->create();
}}
