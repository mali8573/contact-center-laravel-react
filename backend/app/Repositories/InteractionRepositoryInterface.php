<?php

namespace App\Repositories;

interface InteractionRepositoryInterface
{
    public function getAllByContact($contactId);
    public function findById($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
    public function restore($id);
}