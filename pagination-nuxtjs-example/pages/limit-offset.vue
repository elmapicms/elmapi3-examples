<template>
  <div class="container">
    <header>
      <NuxtLink to="/" class="back-link">← Back to Examples</NuxtLink>
      <h1>Limit/Offset Pagination</h1>
      <p>
        Uses <code>limit</code> and <code>offset</code> parameters
      </p>
    </header>

    <div v-if="articles.length === 0" class="loading">
      No articles found.
    </div>

    <template v-else>
      <div class="articles-list">
        <article v-for="article in articles" :key="article.uuid" class="article-card">
          <div class="article-card-header">
            <h2>{{ article.fields.title }}</h2>
            <div class="article-meta">
              <span v-if="article.fields.category" class="category-badge">
                {{ article.fields.category }}
              </span>
              <span v-if="article.fields.published_date">
                📅 {{ formatDate(article.fields.published_date) }}
              </span>
              <span v-if="article.fields.views">
                👁️ {{ formatViews(article.fields.views) }} views
              </span>
            </div>
            <p v-if="article.fields.excerpt" class="excerpt">
              {{ article.fields.excerpt }}
            </p>
          </div>
        </article>
      </div>

      <div class="pagination">
        <NuxtLink
          v-if="hasPrevious"
          :to="`/limit-offset?limit=${itemsLimit}&offset=${Math.max(0, currentOffset - itemsLimit)}`"
        >
          <button>Previous</button>
        </NuxtLink>

        <span class="pagination-info">
          Showing {{ currentOffset + 1 }} - {{ currentOffset + articles.length }}
        </span>

        <NuxtLink
          v-if="hasMore"
          :to="`/limit-offset?limit=${itemsLimit}&offset=${currentOffset + itemsLimit}`"
        >
          <button>Next</button>
        </NuxtLink>
      </div>

      <div class="info-card" style="margin-top: 2rem">
        <h3 style="margin-bottom: 1rem; font-size: 1.1rem; font-weight: 600; color: var(--text)">
          Pagination Info
        </h3>
        <div class="info-stats">
          <div class="info-stat">
            <span class="info-stat-label">Current Offset</span>
            <span class="info-stat-value">{{ currentOffset }}</span>
          </div>
          <div class="info-stat">
            <span class="info-stat-label">Limit</span>
            <span class="info-stat-value">{{ itemsLimit }}</span>
          </div>
          <div class="info-stat">
            <span class="info-stat-label">Items Shown</span>
            <span class="info-stat-value">{{ articles.length }}</span>
          </div>
          <div class="info-stat">
            <span class="info-stat-label">Range</span>
            <span class="info-stat-value" style="font-size: 1rem">
              {{ currentOffset + 1 }} - {{ currentOffset + articles.length }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { getArticlesLimitOffset } = useElmapi();

const DEFAULT_LIMIT = 10;
const limit = computed(() => parseInt((route.query.limit as string) || String(DEFAULT_LIMIT), 10));
const offset = computed(() => parseInt((route.query.offset as string) || '0', 10));

const { data: articlesResult } = await useAsyncData(
  () => `articles-limit-offset-${limit.value}-${offset.value}`,
  () => getArticlesLimitOffset(limit.value, offset.value, 'en'),
  {
    watch: [limit, offset]
  }
);

const articles = computed(() => articlesResult.value?.data || []);
const itemsLimit = computed(() => articlesResult.value?.limit || DEFAULT_LIMIT);
const currentOffset = computed(() => articlesResult.value?.offset || 0);
const hasMore = computed(() => articles.value.length === itemsLimit.value);
const hasPrevious = computed(() => currentOffset.value > 0);

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatViews(views: string) {
  return parseInt(views).toLocaleString();
}
</script>

<style scoped>
.back-link {
  color: var(--primary);
  text-decoration: none;
  margin-bottom: 1rem;
  display: inline-block;
}
</style>

