<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UserResource;

class PostResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'created_at' => $this->created_at,
            'image' => $this->image,
            'width' => $this->width,
            'height' => $this->height,
            'text' => $this->text,
            'user_id' => $this->user_id,
            'likes_count' => $this->likes_count,
            'is_liked' => $this->is_liked,
            'user' => new UserResource($this->user),
        ];
    }
}
