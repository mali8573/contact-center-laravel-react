<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Contact;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Interaction>
 */
class InteractionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // קישור אוטומטי לאיש קשר קיים או יצירת חדש
            'contact_id' => Contact::factory(), 
            
            // סוגי האינטראקציות כפי שנדרש במשימה
            'type' => fake()->randomElement(['Call', 'Email', 'Meeting']),
            
            // עדכון שם השדה ל-timestamp (במקום interaction_date)
            'timestamp' => fake()->dateTimeBetween('-1 year', 'now'),
            
            // עדכון שם השדה ל-note ביחיד (במקום notes)
            'note' => fake()->sentence(), 
        ];
    }
}