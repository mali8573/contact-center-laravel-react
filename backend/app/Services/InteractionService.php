<?php

namespace App\Services;

use App\Repositories\InteractionRepositoryInterface;
use Illuminate\Support\Facades\DB;

class InteractionService
{
    protected $repository;
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
        // 1. בדיקה שאיש הקשר קיים במערכת (וזמין - לא ב-Soft Delete)
        $contact = $this->contactRepository->findById($contactId);
        
        if (!$contact) {
            throw new ModelNotFoundException("לא ניתן לשלוף אינטראקציות: איש הקשר לא נמצא.");
        }

        // 2. שליפת האינטראקציות דרך הרפוסיטורי
        return $this->interactionRepository->getAllByContact($contactId);
    }
public function getInteraction($id)
{
    return $this->repository->findById($id);
}
    public function createInteraction(array $data)
    {
        return DB::transaction(function () use ($data) {
            // כאן אפשר להוסיף לוגיקה, למשל: עדכון "תאריך קשר אחרון" במודל Contact
            return $this->repository->create($data);
        });
    }

    public function updateInteraction($id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteInteraction($id)
    {
        return $this->repository->delete($id);
    }

    public function restoreInteraction($id)
    {
        return $this->repository->restore($id);
    }
}