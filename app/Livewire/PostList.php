<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;
use Livewire\WithPagination;

class PostList extends Component {
    use WithPagination;

    public function render() {
        return view('livewire.post-list', [
            'posts' => Post::latest()->paginate(10)
        ]);
    }
}
