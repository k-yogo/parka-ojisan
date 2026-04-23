<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class IconImageService {
  public function store(UploadedFile $file): string {
    $manager = new ImageManager(new Driver());
    $image = $manager->read($file);
    $image->scaleDown(width: 500, height: 500);
    $filename = str()->random(40) . '.webp';
    $path = 'icons/' . $filename;
    $image->toWebp(quality: 80)->save(storage_path('app/public/' . $path));
    return $path;
  }
}
