<?php

namespace App\Services;

use App\Repositories\ContactRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Contact;
use Exception;

class ContactService
{
    protected $repository;

    public function __construct(ContactRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

     public function getPaginatedList($perPage = 10, $search = null)
    {
        return $this->repository->getFilteredContacts($perPage, $search);
    }

   public function createNewContact(array $data)
{
    return DB::transaction(function () use ($data) {
        // 1. נחפש אם יש איש קשר כזה ב"סל המחזור" (כולל מחוקים) לפי אימייל
        $existing = Contact::withTrashed()->where('email', $data['email'])->first();

        if ($existing) {
            if ($existing->trashed()) {
                // 2. אם הוא מחוק - נשחזר אותו ונעדכן את הפרטים החדשים
                $existing->restore();
                $existing->update($data);
                return $existing;
            }
            // אם הוא קיים ולא מחוק - זורקים שגיאה (כי האימייל תפוס)
            throw new Exception("איש קשר עם אימייל זה כבר קיים במערכת.");
        }

        // 3. אם הוא לא קיים בכלל - יוצרים חדש כרגיל
        return $this->repository->create($data);
    });
}
public function restoreContact($id)
{
    // שימוש במודל עם withTrashed כדי למצוא גם את אלו שב"סל המחזור"
    $contact = \App\Models\Contact::withTrashed()->findOrFail($id);
    $contact->restore();
    return $contact;
}
    public function getContactDetails($id)
    {
        $contact = $this->repository->findById($id);
        
        if (!$contact) {
            throw new ModelNotFoundException("איש הקשר המבוקש לא נמצא.");
        }

        return $contact;
    }

    public function updateContact($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $this->getContactDetails($id); 
            return $this->repository->update($id, $data);
        });
    }

    public function deleteContact($id)
    {
        $contact = $this->getContactDetails($id);

        // ולידציה עסקית מתקדמת
        if ($contact->interactions()->exists()) {
            throw new Exception("מטעמי אבטחת מידע, לא ניתן למחוק איש קשר עם היסטוריית פעולות.");
        }

        return $this->repository->delete($id);
    }
  
    
}