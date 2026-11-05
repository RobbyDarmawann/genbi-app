<?php

namespace App\Actions\Kepengurusan;

use App\Models\AuditLog;
use App\Models\Kepengurusan;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReorderKepengurusanAction
{
    public function handle(Kepengurusan $kepengurusan, string $direction, User $actor, ?string $ipAddress = null): Kepengurusan
    {
        return DB::transaction(function () use ($kepengurusan, $direction, $actor, $ipAddress): Kepengurusan {
            $groupItems = Kepengurusan::query()
                ->where('periode_id', $kepengurusan->periode_id)
                ->when(
                    $kepengurusan->komsat_id !== null,
                    fn ($q) => $q->where('komsat_id', $kepengurusan->komsat_id),
                    fn ($q) => $q->whereNull('komsat_id'),
                )
                ->orderBy('urutan')
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->values();

            $currentIndex = $groupItems->search(fn (Kepengurusan $item): bool => $item->id === $kepengurusan->id);

            if ($currentIndex === false) {
                throw ValidationException::withMessages(['direction' => 'Data pengurus tidak ditemukan dalam kelompok ini.']);
            }

            $targetIndex = $direction === 'up' ? $currentIndex - 1 : $currentIndex + 1;

            if ($targetIndex < 0 || $targetIndex >= $groupItems->count()) {
                throw ValidationException::withMessages(['direction' => 'Urutan sudah berada pada batas kelompok.']);
            }

            /** @var Kepengurusan $currentItem */
            $currentItem = $groupItems->get($currentIndex);
            /** @var Kepengurusan $neighborItem */
            $neighborItem = $groupItems->get($targetIndex);

            if ($currentItem->urutan !== $neighborItem->urutan) {
                $oldUrutan = $currentItem->urutan;
                $currentItem->update(['urutan' => $neighborItem->urutan]);
                $neighborItem->update(['urutan' => $oldUrutan]);
            } else {
                $swapped = $groupItems->all();
                $swapped[$currentIndex] = $neighborItem;
                $swapped[$targetIndex] = $currentItem;

                foreach ($swapped as $idx => $item) {
                    $item->update(['urutan' => $idx + 1]);
                }
            }

            AuditLog::catat(
                aksi: 'kepengurusan.reordered',
                userId: $actor->id,
                subjectType: Kepengurusan::class,
                subjectId: $currentItem->id,
                metadata: [
                    'periode_id' => $currentItem->periode_id,
                    'komsat_id' => $currentItem->komsat_id,
                    'direction' => $direction,
                    'swapped_with_id' => $neighborItem->id,
                    'urutan_baru' => $currentItem->urutan,
                ],
                ipAddress: $ipAddress,
            );

            return $currentItem->fresh() ?? $currentItem;
        });
    }
}
