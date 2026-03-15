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
    return DB::transaction(function () use ($id) {
        // מציאת איש הקשר גם אם הוא מחוק
        $contact = \App\Models\Contact::withTrashed()->findOrFail($id);
        
        // שחזור איש הקשר
        $contact->restore();

        // שחזור כל האינטראקציות שנמחקו יחד איתו
        $contact->interactions()->restore();

        return $contact;
    });
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
    return DB::transaction(function () use ($id) {
        // 1. מציאת איש הקשר (כולל האינטראקציות שלו)
        $contact = $this->getContactDetails($id);

        // 2. מחיקה רכה של כל האינטראקציות (בגלל ה-Trait הן רק יקבלו deleted_at)
        $contact->interactions()->delete();

        // 3. מחיקה רכה של איש הקשר עצמו
        return $this->repository->delete($id);
    });
}
  
    
}