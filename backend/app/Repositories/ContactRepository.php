<?php

namespace App\Repositories;

use App\Models\Contact;

class ContactRepository implements ContactRepositoryInterface
{
    /**
     * פונקציה מאוחדת: שליפה, סינון, ספירת אינטראקציות ופגינציה
     */
    public function getFilteredContacts($perPage = 10, $search = null)
    {
        // אנחנו מתחילים עם השאילתה ומוסיפים ספירה של אינטראקציות (דרישת בונוס מעולה)
        $query = Contact::withCount('interactions');

        // אם יש מילת חיפוש - נוסיף את הסינון
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%");
            });
        }

        // החזרה עם סדר יורד ופגינציה
        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findById($id)
    {
        return Contact::with('interactions')->find($id);
    }

    public function create(array $data)
    {
        return Contact::create($data);
    }

    public function restore($id)
    {
        $contact = Contact::withTrashed()->findOrFail($id);
        $contact->restore();
        return $contact;
    }

    public function update($id, array $data)
    {
        $contact = Contact::findOrFail($id);
        $contact->update($data);
        return $contact;
    }

    public function delete($id)
    {
        $contact = Contact::findOrFail($id);
        return $contact->delete();
    }
}