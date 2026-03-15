<?php

namespace App\Repositories;

use App\Models\Interaction;

class InteractionRepository implements InteractionRepositoryInterface
{
public function getAllByContact($contactId)
{
    return Interaction::where('contact_id', $contactId)
        ->orderBy('timestamp', 'desc') // שינוי ל-timestamp לפי הדרישות
        ->get();
}

    public function findById($id)
    {
        return Interaction::withTrashed()->findOrFail($id);
    }

    public function create(array $data)
    {
        return Interaction::create($data);
    }

    public function update($id, array $data)
    {
        $interaction = Interaction::findOrFail($id);
        $interaction->update($data);
        return $interaction;
    }

    public function delete($id)
    {
        return Interaction::findOrFail($id)->delete();
    }

    public function restore($id)
    {
        $interaction = Interaction::withTrashed()->findOrFail($id);
        $interaction->restore();
        return $interaction;
    }
}