<?php

namespace App\Repositories;

interface ContactRepositoryInterface
{
public function getFilteredContacts($perPage = 10, $search = null);
    public function findById($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
    public function restore($id);
}