export interface CodeSnippetItem {
  id: string;
  title: string;
  category: 'architecture' | 'migrations' | 'adapters' | 'jobs' | 'livewire' | 'pwa';
  filename: string;
  language: 'php' | 'blade' | 'json' | 'javascript' | 'bash';
  description: string;
  code: string;
}

export const LARAVEL_CODE_SNIPPETS: CodeSnippetItem[] = [
  {
    id: 'arch-tree',
    title: '1. Estructura de Directorios Laravel 11',
    category: 'architecture',
    filename: 'streampulse-laravel11-tree.txt',
    language: 'bash',
    description: 'Estructura modular orientada a Dominio y Servicios bajo el estándar de Laravel 11',
    code: `streampulse-core/
├── app/
│   ├── Actions/                          # Single Responsibility Actions
│   │   ├── Feeds/
│   │   │   ├── IngestSourceAction.php
│   │   │   └── SanitizeFeedHtmlAction.php
│   │   └── Widgets/
│   │       └── SaveDashboardLayoutAction.php
│   ├── Adapters/                         # Adaptadores de fuentes externas
│   │   ├── Contracts/
│   │   │   └── SourceAdapterInterface.php
│   │   ├── DTOs/
│   │   │   └── NormalizedFeedItemDTO.php
│   │   ├── Exceptions/
│   │   │   └── AdapterRateLimitException.php
│   │   ├── GitHubAdapter.php
│   │   ├── RedditAdapter.php
│   │   ├── RssAdapter.php
│   │   ├── TwitchAdapter.php
│   │   └── YouTubeAdapter.php
│   ├── Console/
│   │   └── Commands/
│   │       └── StreamPulseSyncCommand.php
│   ├── Events/
│   │   └── FeedItemIngestedEvent.php     # Reverb WebSocket Broadcast
│   ├── Jobs/
│   │   ├── FetchSingleSourceJob.php     # Queue worker
│   │   └── ProcessBatchIngestionJob.php
│   ├── Livewire/
│   │   ├── Dashboard/
│   │   │   ├── BunkerGrid.php           # Gridstack desktop manager
│   │   │   ├── PiPPlayer.php            # Floating video player
│   │   │   └── ReaderDrawer.php         # Clean readability modal
│   │   └── Mobile/
│   │       └── MobileFeedStream.php     # PWA touch feed
│   ├── Models/
│   │   ├── DashboardWidget.php
│   │   ├── FeedItem.php
│   │   ├── Platform.php
│   │   ├── Source.php
│   │   ├── User.php
│   │   └── UserItemState.php
│   └── Services/
│       ├── FeedRateLimiterService.php    # Redis token bucket
│       └── ReadabilityCleanerService.php # FiveFilters readability wrapper
├── config/
│   ├── horizon.php                       # Redis workers config
│   ├── reverb.php                        # WebSockets config
│   └── streampulse.php
├── database/
│   └── migrations/
│       ├── 2026_10_01_000001_create_platforms_table.php
│       ├── 2026_10_01_000002_create_sources_table.php
│       ├── 2026_10_01_000003_create_user_sources_table.php
│       ├── 2026_10_01_000004_create_feed_items_table.php
│       ├── 2026_10_01_000005_create_dashboards_widgets_table.php
│       └── 2026_10_01_000006_create_user_item_states_table.php
├── public/
│   ├── manifest.json
│   └── sw.js                             # Service Worker PWA
├── resources/
│   ├── js/
│   │   ├── app.js
│   │   ├── bootstrap.js                  # Laravel Echo + Reverb init
│   │   ├── gridstack-init.js             # Alpine + Gridstack bridge
│   │   └── pwa-register.js
│   └── views/
│       ├── components/
│       │   └── layouts/app.blade.php
│       └── livewire/
│           ├── dashboard/bunker-grid.blade.php
│           ├── dashboard/pip-player.blade.php
│           └── dashboard/reader-drawer.blade.php
└── routes/
    ├── channels.php                      # Reverb authorization channels
    ├── console.php                       # Scheduled tasks
    └── web.php`
  },
  {
    id: 'mig-platforms-sources',
    title: '2.1 Migración: Platforms, Sources & UserSources',
    category: 'migrations',
    filename: '2026_10_01_000001_create_platforms_and_sources_table.php',
    language: 'php',
    description: 'Migraciones con llaves foráneas en cascada e índices compuestos para rendimiento en consultas',
    code: `<?php

declare(strict_types=1);

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tabla de Plataformas Soportadas
        Schema::create('platforms', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->string('slug', 30)->unique(); // 'youtube', 'reddit', 'rss', 'github', 'twitch'
            $table->string('icon', 50)->default('rss');
            $table->string('api_base_url', 255)->nullable();
            $table->enum('auth_type', ['none', 'api_key', 'oauth2'])->default('none');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Tabla de Fuentes Agregadas
        Schema::create('sources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('platform_id')->constrained('platforms')->cascadeOnDelete();
            $table->string('external_id', 190); // channel_id, subreddit, rss_url hash, repo_slug
            $table->string('title', 255);
            $table->string('url', 500);
            $table->string('avatar_url', 500)->nullable();
            $table->unsignedSmallInteger('fetch_interval_minutes')->default(15);
            $table->timestamp('last_fetched_at')->nullable()->index();
            $table->enum('status', ['active', 'syncing', 'error', 'paused'])->default('active')->index();
            $table->text('last_error_message')->nullable();
            $table->timestamps();

            // Índice único para evitar fuentes duplicadas por plataforma
            $table->unique(['platform_id', 'external_id'], 'uq_sources_platform_external');
        });

        // 3. Relación M:N entre Usuarios y Fuentes con personalización individual
        Schema::create('user_sources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('source_id')->constrained('sources')->cascadeOnDelete();
            $table->string('custom_label', 100)->nullable();
            $table->string('category', 50)->default('General')->index();
            $table->string('color_accent', 20)->default('#06b6d4');
            $table->boolean('is_muted')->default(false);
            $table->timestamps();

            $table->unique(['user_id', 'source_id'], 'uq_user_sources_user_source');
            $table->index(['user_id', 'category'], 'idx_user_sources_category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_sources');
        Schema::dropIfExists('sources');
        Schema::dropIfExists('platforms');
    }
};`
  },
  {
    id: 'mig-feed-items',
    title: '2.2 Migración: FeedItems & UserItemStates',
    category: 'migrations',
    filename: '2026_10_01_000004_create_feed_items_and_states_table.php',
    language: 'php',
    description: 'Tabla de items con índice compuesto (source_id, published_at), contenido limpio y estado de lectura',
    code: `<?php

declare(strict_types=1);

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 4. Elementos y publicaciones recolectadas
        Schema::create('feed_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('source_id')->constrained('sources')->cascadeOnDelete();
            $table->string('external_id', 190); // ID único en el origen (ej: YouTube videoId, Reddit t3_id)
            $table->string('title', 300);
            $table->text('summary')->nullable();
            $table->mediumText('content_clean_html')->nullable(); // Texto procesado por Readability
            $table->string('url', 750);
            $table->string('media_url', 750)->nullable(); // Video stream URL o imagen destacada
            $table->string('media_type', 30)->nullable(); // 'youtube_video', 'twitch_stream', 'article'
            $table->string('author_name', 100)->nullable();
            $table->timestamp('published_at')->index();
            $table->json('raw_metadata_json')->nullable(); // Upvotes, retweets, metrics
            $table->timestamps();

            // Garantiza que el item sea único por fuente
            $table->unique(['source_id', 'external_id'], 'uq_feed_items_source_external');
            // Índice compuesto crítico para orden cronológico ultra rápido
            $table->index(['source_id', 'published_at'], 'idx_feed_items_source_published');
        });

        // 5. Configuración de Widgets del Dashboard en PC
        Schema::create('dashboards_widgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('source_id_or_category', 100);
            $table->string('widget_type', 40)->default('source_feed'); // 'source_feed', 'category_feed'
            $table->unsignedTinyInteger('pos_x')->default(0);
            $table->unsignedTinyInteger('pos_y')->default(0);
            $table->unsignedTinyInteger('width')->default(2);
            $table->unsignedTinyInteger('height')->default(2);
            $table->boolean('is_visible')->default(true);
            $table->timestamps();

            $table->index(['user_id', 'is_visible']);
        });

        // 6. Estado de Interacción por Usuario (Leído, Guardado, Bookmark)
        Schema::create('user_item_states', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('feed_item_id')->constrained('feed_items')->cascadeOnDelete();
            $table->boolean('is_read')->default(false)->index();
            $table->boolean('is_bookmarked')->default(false)->index();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'feed_item_id'], 'uq_user_item_state');
            $table->index(['user_id', 'is_bookmarked', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_item_states');
        Schema::dropIfExists('dashboards_widgets');
        Schema::dropIfExists('feed_items');
    }
};`
  },
  {
    id: 'adapter-interface',
    title: '3.1 SourceAdapterInterface & DTO',
    category: 'adapters',
    filename: 'app/Adapters/Contracts/SourceAdapterInterface.php',
    language: 'php',
    description: 'Contrato estricto para desacoplar APIs externas y estandarizar la ingestión de datos',
    code: `<?php

declare(strict_types=1);

namespace App\\Adapters\\Contracts;

use App\\Models\\Source;
use Illuminate\\Support\\Collection;

interface SourceAdapterInterface
{
    /**
     * Consume la API externa o endpoint feed respetando límites de rate limit.
     *
     * @param Source $source
     * @return array|string Payload crudo obtenido
     * @throws \\App\\Adapters\\Exceptions\\AdapterRateLimitException
     */
    public function fetch(Source $source): mixed;

    /**
     * Parsea el contenido crudo en una colección homogénea de DTOs normalizados.
     *
     * @param mixed $rawPayload
     * @param Source $source
     * @return Collection<int, \\App\\Adapters\\DTOs\\NormalizedFeedItemDTO>
     */
    public function parse(mixed $rawPayload, Source $source): Collection;

    /**
     * Pipeline integral: fetch, parse y normalización final.
     *
     * @param Source $source
     * @return Collection<int, \\App\\Adapters\\DTOs\\NormalizedFeedItemDTO>
     */
    public function ingest(Source $source): Collection;
}

// DTO Normalizado para Ingestión Homogénea
namespace App\\Adapters\\DTOs;

use Carbon\\CarbonInterface;

final readonly class NormalizedFeedItemDTO
{
    public function __construct(
        public string $externalId,
        public string $title,
        public ?string $summary,
        public ?string $contentCleanHtml,
        public string $url,
        public ?string $mediaUrl,
        public ?string $mediaType, // 'youtube_video', 'twitch_stream', 'article', 'code'
        public ?string $authorName,
        public CarbonInterface $publishedAt,
        public array $rawMetadata = []
    ) {}
}`
  },
  {
    id: 'adapter-rss-yt',
    title: '3.2 RssAdapter & YouTubeAdapter',
    category: 'adapters',
    filename: 'app/Adapters/RssAdapter.php',
    language: 'php',
    description: 'Implementación completa con SimplePie, Readability.php y GuzzleHttp para YouTube Data API',
    code: `<?php

declare(strict_types=1);

namespace App\\Adapters;

use App\\Adapters\\Contracts\\SourceAdapterInterface;
use App\\Adapters\\DTOs\\NormalizedFeedItemDTO;
use App\\Models\\Source;
use Carbon\\Carbon;
use FiveFilters\\Readability\\Readability;
use FiveFilters\\Readability\\Configuration;
use GuzzleHttp\\Client as GuzzleClient;
use Illuminate\\Support\\Collection;
use Illuminate\\Support\\Facades\\Log;
use SimplePie\\SimplePie;

final class RssAdapter implements SourceAdapterInterface
{
    public function __construct(
        private readonly GuzzleClient $httpClient
    ) {}

    public function fetch(Source $source): string
    {
        $response = $this->httpClient->get($source->url, [
            'timeout' => 8.0,
            'headers' => [
                'User-Agent' => 'StreamPulse-FeedBot/1.0 (+https://streampulse.io)'
            ]
        ]);

        return (string) $response->getBody();
    }

    public function parse(mixed $rawPayload, Source $source): Collection
    {
        $feed = new SimplePie();
        $feed->set_raw_data((string) $rawPayload);
        $feed->enable_cache(false);
        $feed->init();

        $items = collect();
        $readabilityConfig = new Configuration();
        $readabilityConfig->setFixRelativeURLs(true);

        foreach ($feed->get_items(0, 30) as $item) {
            $url = $item->get_permalink() ?? $source->url;
            $rawHtml = $item->get_content() ?? $item->get_description() ?? '';
            
            // Limpieza con Readability para eliminar scripts, estilos y trackers
            $cleanHtml = $rawHtml;
            try {
                if (!empty($rawHtml)) {
                    $readability = new Readability($readabilityConfig);
                    if ($readability->parse($rawHtml)) {
                        $cleanHtml = $readability->getContent();
                    }
                }
            } catch (\\Throwable $e) {
                // Fallback a strip_tags seguro si falla el parseo DOM
                $cleanHtml = strip_tags($rawHtml, '<p><br><a><b><strong><i><em><code><pre><ul><ol><li><img>');
            }

            $items->push(new NormalizedFeedItemDTO(
                externalId: $item->get_id() ?: md5($url),
                title: html_entity_decode($item->get_title() ?? 'Sin Título', ENT_QUOTES | ENT_HTML5),
                summary: strip_tags($item->get_description() ?? ''),
                contentCleanHtml: $cleanHtml,
                url: $url,
                mediaUrl: $item->get_enclosure()?->get_link(),
                mediaType: 'article',
                authorName: $item->get_author()?->get_name() ?? $source->title,
                publishedAt: Carbon::parse($item->get_date() ?? now()),
                rawMetadata: [
                    'categories' => $item->get_categories()
                ]
            ));
        }

        return $items;
    }

    public function ingest(Source $source): Collection
    {
        $raw = $this->fetch($source);
        return $this->parse($raw, $source);
    }
}

// -------------------------------------------------------------
// YouTubeAdapter con Rate Limit y Token Bucket
// -------------------------------------------------------------
namespace App\\Adapters;

use App\\Adapters\\Contracts\\SourceAdapterInterface;
use App\\Adapters\\DTOs\\NormalizedFeedItemDTO;
use App\\Models\\Source;
use Carbon\\Carbon;
use GuzzleHttp\\Client as GuzzleClient;
use Illuminate\\Support\\Collection;
use Illuminate\\Support\\Facades\\Redis;

final class YouTubeAdapter implements SourceAdapterInterface
{
    private const string API_URL = 'https://www.googleapis.com/youtube/v3/search';

    public function __construct(
        private readonly GuzzleClient $httpClient,
        private readonly string $apiKey
    ) {}

    public function fetch(Source $source): array
    {
        // Rate limit check con Redis: 10,000 quota units / día
        $quotaKey = 'ratelimit:youtube:' . date('Y-m-d');
        if ((int) Redis::get($quotaKey) > 9500) {
            throw new \\RuntimeException('YouTube API daily quota threshold reached.');
        }

        $response = $this->httpClient->get(self::API_URL, [
            'query' => [
                'part' => 'snippet',
                'channelId' => $source->external_id,
                'maxResults' => 15,
                'order' => 'date',
                'type' => 'video',
                'key' => $this->apiKey,
            ]
        ]);

        Redis::incrby($quotaKey, 100); // 100 unidades por endpoint search
        return json_decode((string) $response->getBody(), true);
    }

    public function parse(mixed $rawPayload, Source $source): Collection
    {
        return collect($rawPayload['items'] ?? [])->map(function (array $item) use ($source) {
            $snippet = $item['snippet'];
            $videoId = $item['id']['videoId'] ?? '';
            $videoUrl = "https://www.youtube.com/watch?v={$videoId}";

            return new NormalizedFeedItemDTO(
                externalId: $videoId,
                title: html_entity_decode($snippet['title'] ?? '', ENT_QUOTES),
                summary: $snippet['description'] ?? '',
                contentCleanHtml: "<p>{$snippet['description']}</p>",
                url: $videoUrl,
                mediaUrl: $videoId, // Utilizado por el PiP player flotante
                mediaType: 'youtube_video',
                authorName: $snippet['channelTitle'] ?? $source->title,
                publishedAt: Carbon::parse($snippet['publishedAt']),
                rawMetadata: [
                    'thumbnails' => $snippet['thumbnails'] ?? []
                ]
            );
        });
    }

    public function ingest(Source $source): Collection
    {
        return $this->parse($this->fetch($source), $source);
    }
}`
  },
  {
    id: 'jobs-reverb',
    title: '3.3 Laravel Queue Job & Reverb Broadcast Event',
    category: 'jobs',
    filename: 'app/Jobs/FetchSingleSourceJob.php',
    language: 'php',
    description: 'Procesamiento en segundo plano con Redis Queues, inserción masiva y WebSocket push',
    code: `<?php

declare(strict_types=1);

namespace App\\Jobs;

use App\\Adapters\\Contracts\\SourceAdapterInterface;
use App\\Events\\FeedItemIngestedEvent;
use App\\Models\\FeedItem;
use App\\Models\\Source;
use Illuminate\\Bus\\Queueable;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Foundation\\Bus\\Dispatchable;
use Illuminate\\Queue\\InteractsWithQueue;
use Illuminate\\Queue\\SerializesModels;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Facades\\Log;

final class FetchSingleSourceJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 60;
    public int $backoff = 30;

    public function __construct(
        public readonly Source $source
    ) {
        $this->onQueue('feed-ingestion');
    }

    public function handle(
        \\App\\Services\\AdapterFactoryService $adapterFactory
    ): void {
        $source = $this->source;
        $source->update(['status' => 'syncing']);

        try {
            /** @var SourceAdapterInterface $adapter */
            $adapter = $adapterFactory->make($source->platform->slug);
            $normalizedItems = $adapter->ingest($source);

            $newItemsCount = 0;

            DB::transaction(function () use ($normalizedItems, $source, &$newItemsCount) {
                foreach ($normalizedItems as $dto) {
                    /** @var \\App\\Adapters\\DTOs\\NormalizedFeedItemDTO $dto */
                    $feedItem = FeedItem::firstOrCreate(
                        [
                            'source_id' => $source->id,
                            'external_id' => $dto->externalId,
                        ],
                        [
                            'title' => $dto->title,
                            'summary' => $dto->summary,
                            'content_clean_html' => $dto->contentCleanHtml,
                            'url' => $dto->url,
                            'media_url' => $dto->mediaUrl,
                            'media_type' => $dto->mediaType,
                            'author_name' => $dto->authorName,
                            'published_at' => $dto->publishedAt,
                            'raw_metadata_json' => $dto->rawMetadata,
                        ]
                    );

                    // Si el elemento fue recién insertado, emitimos evento Reverb
                    if ($feedItem->wasRecentlyCreated) {
                        $newItemsCount++;
                        broadcast(new FeedItemIngestedEvent($feedItem))->toOthers();
                    }
                }
            });

            $source->update([
                'status' => 'active',
                'last_fetched_at' => now(),
                'last_error_message' => null,
            ]);

            Log::info("Ingestión completada para fuente {$source->title}: {$newItemsCount} nuevos items.");

        } catch (\\Throwable $e) {
            $source->update([
                'status' => 'error',
                'last_error_message' => substr($e->getMessage(), 0, 500),
            ]);

            Log::error("Error en FetchSingleSourceJob para fuente ID {$source->id}: " . $e->getMessage());
            throw $e;
        }
    }
}

// -------------------------------------------------------------
// Broadcast Event para Laravel Reverb WebSockets
// -------------------------------------------------------------
namespace App\\Events;

use App\\Models\\FeedItem;
use Illuminate\\Broadcasting\\Channel;
use Illuminate\\Broadcasting\\InteractsWithSockets;
use Illuminate\\Contracts\\Broadcasting\\ShouldBroadcastNow;
use Illuminate\\Foundation\\Events\\Dispatchable;
use Illuminate\\Queue\\SerializesModels;

final class FeedItemIngestedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly FeedItem $feedItem
    ) {}

    public function broadcastOn(): array
    {
        // Canal público o canal privado por usuario suscrito
        return [
            new Channel('source.' . $this->feedItem->source_id),
            new Channel('streampulse-live')
        ];
    }

    public function broadcastAs(): string
    {
        return 'item.ingested';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->feedItem->id,
            'source_id' => $this->feedItem->source_id,
            'title' => $this->feedItem->title,
            'platform' => $this->feedItem->source->platform->slug,
            'media_url' => $this->feedItem->media_url,
            'media_type' => $this->feedItem->media_type,
            'published_at' => $this->feedItem->published_at->diffForHumans(),
        ];
    }
}`
  },
  {
    id: 'livewire-bunker',
    title: '4. Componente Livewire 3 + Alpine.js con Gridstack',
    category: 'livewire',
    filename: 'resources/views/livewire/dashboard/bunker-grid.blade.php',
    language: 'blade',
    description: 'Búnker de monitoreo multiventana reordenable con Alpine.js, Gridstack y Reverb listeners',
    code: `<!-- resources/views/livewire/dashboard/bunker-grid.blade.php -->
<div 
    x-data="streamPulseDashboard({
        widgets: @entangle('widgets'),
        userId: {{ auth()->id() ?? 1 }}
    })"
    x-init="initGrid()"
    class="min-h-screen bg-[#070a12] text-slate-100 p-4"
>
    <!-- Top Command HUD -->
    <header class="flex items-center justify-between pb-4 border-b border-cyan-900/30">
        <div class="flex items-center gap-3">
            <div class="h-3 w-3 rounded-full bg-cyan-400 animate-ping"></div>
            <h1 class="font-bold text-xl tracking-wider text-cyan-400 font-mono">
                STREAMPULSE // COMMAND_CENTER
            </h1>
            <span class="text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                REVERB: ACTIVE
            </span>
        </div>

        <div class="flex items-center gap-3">
            <button 
                wire:click="syncAllSources" 
                class="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/50 rounded text-cyan-300 text-sm font-mono transition"
            >
                [ SYNC_ALL ]
            </button>
            <button 
                @click="$dispatch('open-reader', { id: null })"
                class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-mono"
            >
                MODO LECTURA
            </button>
        </div>
    </header>

    <!-- Gridstack Container -->
    <div class="grid-stack mt-4" id="streampulse-grid">
        @foreach($widgets as $widget)
            <div 
                class="grid-stack-item" 
                gs-id="{{ $widget['id'] }}" 
                gs-w="{{ $widget['width'] }}" 
                gs-h="{{ $widget['height'] }}"
                gs-x="{{ $widget['pos_x'] }}" 
                gs-y="{{ $widget['pos_y'] }}"
            >
                <div class="grid-stack-item-content bg-[#0d1322] border border-cyan-950/60 rounded-lg p-3 shadow-lg flex flex-col overflow-hidden">
                    <!-- Widget Header -->
                    <div class="flex items-center justify-between pb-2 border-b border-slate-800 cursor-move">
                        <span class="text-xs font-semibold uppercase text-cyan-400 font-mono">
                            {{ $widget['title'] }}
                        </span>
                        <div class="flex items-center gap-1.5">
                            <span class="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                                {{ count($widget['items'] ?? []) }} items
                            </span>
                        </div>
                    </div>

                    <!-- Feed List -->
                    <div class="flex-1 overflow-y-auto space-y-2 mt-2 pr-1">
                        @forelse($widget['items'] ?? [] as $item)
                            <article 
                                class="p-2 rounded bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/50 transition cursor-pointer"
                                @click="handleItemClick(@js($item))"
                            >
                                <h3 class="text-sm font-medium text-slate-200 line-clamp-2">
                                    {{ $item['title'] }}
                                </h3>
                                <div class="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                                    <span>{{ $item['author_name'] }}</span>
                                    <span>{{ $item['published_at'] }}</span>
                                </div>
                            </article>
                        @empty
                            <p class="text-xs text-slate-500 text-center py-6">Sin elementos nuevos</p>
                        @endforelse
                    </div>
                </div>
            </div>
        @endforeach
    </div>

    <!-- Alpine.js & Gridstack script bridge -->
    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('streamPulseDashboard', (config) => ({
                grid: null,
                initGrid() {
                    this.grid = GridStack.init({
                        cellHeight: 180,
                        margin: 10,
                        float: true,
                        animate: true
                    }, '#streampulse-grid');

                    this.grid.on('change', (event, items) => {
                        const layoutData = items.map(node => ({
                            id: node.id,
                            x: node.x,
                            y: node.y,
                            w: node.w,
                            h: node.h
                        }));
                        // Enviar coordenadas al backend de Livewire
                        @this.saveWidgetPositions(layoutData);
                    });

                    // Escuchar eventos de Laravel Reverb
                    window.Echo.channel('streampulse-live')
                        .listen('.item.ingested', (e) => {
                            @this.handleRealtimeItem(e);
                        });
                },
                handleItemClick(item) {
                    if (item.media_type === 'youtube_video' || item.media_type === 'twitch_stream') {
                        // Despachar al reproductor flotante Picture-in-Picture
                        Livewire.dispatch('play-pip-video', { 
                            videoId: item.media_url, 
                            title: item.title,
                            type: item.media_type 
                        });
                    } else {
                        // Despachar al drawer de lectura limpia
                        Livewire.dispatch('open-reader', { itemId: item.id });
                    }
                }
            }));
        });
    </script>
</div>`
  },
  {
    id: 'pwa-manifest-sw',
    title: '5. Configuración PWA & Service Worker',
    category: 'pwa',
    filename: 'public/manifest.json & sw.js',
    language: 'json',
    description: 'Manifest Web App para soporte standalone en Android/iOS y Service Worker para modo offline',
    code: `/* public/manifest.json */
{
  "id": "/",
  "name": "StreamPulse Command Center",
  "short_name": "StreamPulse",
  "description": "Centro de Comando de Feeds y Tendencias de alto rendimiento sin algoritmos distractores.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#070a12",
  "theme_color": "#090d16",
  "categories": ["news", "productivity", "utilities"],
  "icons": [
    {
      "src": "/icon.svg",
      "sizes": "192x192 512x512",
      "type": "image/svg+xml",
      "purpose": "any"
    },
    {
      "src": "/icon.svg",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "maskable"
    }
  ]
}

/* public/sw.js (Resumen de Estrategia de Caché) */
const CACHE_NAME = 'streampulse-v1.2';
self.addEventListener('fetch', (event) => {
  // Stale-While-Revalidate para feeds dinámicos
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return res;
      });
      return cached || network;
    })
  );
});`
  }
];
