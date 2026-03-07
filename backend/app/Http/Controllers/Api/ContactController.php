<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Http\Resources\ContactResource;
use App\Services\ContactService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ContactController extends Controller
{
    protected $service;

    public function __construct(ContactService $service)
    {
        $this->service = $service;
    }

 public function index(Request $request)
    {
        // חילוץ פרמטרים מה-URL
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);

        // קריאה לשירות
        $contacts = $this->service->getPaginatedList($perPage, $search);
        
        return ContactResource::collection($contacts);
    }
    public function store(StoreContactRequest $request)
    {
        // יצירת איש קשר חדש [cite: 14, 18]
        $contact = $this->service->createNewContact($request->validated());
        return (new ContactResource($contact))
                ->response()
                ->setStatusCode(Response::HTTP_CREATED); // קוד 201 נוצר
    }

    public function show($id)
    {
        // כולם יכולים לראות פרטים [cite: 13]
        $contact = $this->service->getContactDetails($id);
        return new ContactResource($contact);
    }

    public function update(Request $request, $id)
    {
        // הגנה: רק מנהל יכול לעדכן איש קשר
        if (!auth()->user()->is_admin) {
            return response()->json(['message' => 'Forbidden: Admins only'], Response::HTTP_FORBIDDEN); // 403
        }

        $contact = $this->service->updateContact($id, $request->all());
        return new ContactResource($contact);
    }

    public function destroy($id)
    {
        // הגנה: רק מנהל יכול למחוק [cite: 16]
        if (!auth()->user()->is_admin) {
            return response()->json(['message' => 'Forbidden: Admins only'], Response::HTTP_FORBIDDEN); // 403
        }

        $this->service->deleteContact($id);
        return response()->json(['message' => 'Contact deleted successfully'], Response::HTTP_OK);
    }

    public function restore($id)
    {
        // הגנה: רק מנהל יכול לשחזר
        if (!auth()->user()->is_admin) {
            return response()->json(['message' => 'Forbidden: Admins only'], Response::HTTP_FORBIDDEN); // 403
        }

        $contact = $this->service->restoreContact($id);
        return response()->json([
            'message' => 'Contact restored successfully',
            'data' => new ContactResource($contact)
        ], Response::HTTP_OK);
    }
}