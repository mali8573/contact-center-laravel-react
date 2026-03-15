<?php

namespace App\Services;

use App\Repositories\InteractionRepositoryInterface;
use App\Repositories\ContactRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class InteractionService
{
    // תיקון שמות המשתנים לעקביות
    protected $interactionRepository;
    protected $contactRepository;

    public function __construct(
        InteractionRepositoryInterface $interactionRepository,
        ContactRepositoryInterface $contactRepository
    ) {
        $this->interactionRepository = $interactionRepository;
        $this->contactRepository = $contactRepository;
    }

    public function listContactInteractions($contactId)
    {
        // בדיקה שאיש הקשר קיים (דרישה מהמטלה להציג פרטי קשר מלאים) [cite: 13]
        $contact = $this->contactRepository->findById($contactId);
        if (!$contact) {
            throw new ModelNotFoundException("איש הקשר לא נמצא.");
        }

        return $this->interactionRepository->getAllByContact($contactId);
    }

    public function createInteraction(array $data)
    {
        return DB::transaction(function () use ($data) {
            // ולידציה עסקית: וודאי שאיש הקשר קיים לפני שמוסיפים לו הערה [cite: 25]
            $contact = $this->contactRepository->findById($data['contact_id']);
            if (!$contact) {
                throw new ModelNotFoundException("לא ניתן ליצור אינטראקציה עבור איש קשר לא קיים.");
            }

            return $this->interactionRepository->create($data);
        });
    }

    public function updateInteraction($id, array $data)
    {
        // Senior Tip: אפשר להוסיף כאן בדיקה האם מותר לעדכן אינטראקציה ישנה
        return $this->interactionRepository->update($id, $data);
    }

    public function deleteInteraction($id)
    {
        return $this->interactionRepository->delete($id);
    }
    public function getInteraction($id)
{
    return $this->interactionRepository->findById($id);
}
public function restoreInteraction($id)
{
    return $this->interactionRepository->restore($id);
}
}