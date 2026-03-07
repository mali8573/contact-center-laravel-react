<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
 public function toArray($request): array
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        'email' => $this->email,
        'phone' => $this->phone,
        'company' => $this->company,
'interactions_count' => $this->interactions_count ?? $this->interactions()->count(),
'interactions' => InteractionResource::collection($this->whenLoaded('interactions')),
        'created_at' => $this->created_at->format('d/m/Y'),
    ];
}
}
