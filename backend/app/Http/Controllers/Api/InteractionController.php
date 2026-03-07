<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InteractionResource;
use App\Http\Requests\StoreInteractionRequest;
use App\Services\InteractionService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InteractionController extends Controller
{
    protected $service;

    public function __construct(InteractionService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $request->validate(['contact_id' => 'required|exists:contacts,id']);
        
        // כל עובד מחובר יכול לצפות
        $interactions = $this->service->listContactInteractions($request->query('contact_id'));
        return InteractionResource::collection($interactions);
    }

    public function store(StoreInteractionRequest $request)
    {
        // כל עובד מחובר יכול ליצור אינטראקציה חדשה (לפי שאלתך)
        $interaction = $this->service->createInteraction($request->validated());
        
        return (new InteractionResource($interaction))
                ->response()
                ->setStatusCode(Response::HTTP_CREATED); // 201
    }

    public function show($id)
    {
        $interaction = $this->service->getInteraction($id);
        return new InteractionResource($interaction);
    }

    public function update(Request $request, $id)
    {
        // הגנה: יצירה כולם יכולים, אבל עדכון - רק מנהל (לפי שאלתך)
        if (!auth()->user()->is_admin) {
            return response()->json(['message' => 'Forbidden: Only admins can update interactions'], Response::HTTP_FORBIDDEN);
        }

        $data = $request->validate([
            'type'      => 'sometimes|string',
            'note'      => 'nullable|string', 
            'timestamp' => 'sometimes|date',
        ]);

        $interaction = $this->service->updateInteraction($id, $data);
        return new InteractionResource($interaction);
    }

    public function destroy($id)
    {
        // הגנה: רק מנהל יכול למחוק
        if (!auth()->user()->is_admin) {
            return response()->json(['message' => 'Forbidden: Only admins can delete interactions'], Response::HTTP_FORBIDDEN);
        }

        $this->service->deleteInteraction($id);
        return response()->json(['message' => 'Deleted successfully'], Response::HTTP_NO_CONTENT); // 204
    }

    public function restore($id)
    {
        // הגנה: רק מנהל יכול לשחזר
        if (!auth()->user()->is_admin) {
            return response()->json(['message' => 'Forbidden: Only admins can restore interactions'], Response::HTTP_FORBIDDEN);
        }

        $interaction = $this->service->restoreInteraction($id);
        return new InteractionResource($interaction);
    }
}