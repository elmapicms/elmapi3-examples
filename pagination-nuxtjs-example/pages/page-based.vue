<template>
  <div class="container">
    <header>
      <NuxtLink to="/" class="back-link">← Back to Examples</NuxtLink>
      <h1>Page-Based Pagination</h1>
      <p>
        Uses <code>paginate</code> and <code>page</code> parameters
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
          v-if="page > 1"
          :to="`/page-based?page=${page - 1}&per_page=${itemsPerPage}`"
        >
          <button>Previous</button>
        </NuxtLink>

        <template v-if="pageNumbers.length > 0">
          <template v-for="(pageNum, index) in pageNumbers" :key="index">
            <span v-if="pageNum === '...'" class="pagination-ellipsis">
              ...
            </span>
            <NuxtLink
              v-else
              :to="`/page-based?page=${pageNum}&per_page=${itemsPerPage}`"
            >
              <button :class="{ active: pageNum === page }">
                {{ pageNum }}
              </button>
            </NuxtLink>
          </template>
        </template>
        <span v-else class="pagination-info">Page {{ page }}</span>

        <NuxtLink
          v-if="hasMore"
          :to="`/page-based?page=${page + 1}&per_page=${itemsPerPage}`"
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
            <span class="info-stat-label">Current Page</span>
            <span class="info-stat-value">{{ page }}</span>
          </div>
          <div class="info-stat">
            <span class="info-stat-label">Items Per Page</span>
            <span class="info-stat-value">{{ itemsPerPage }}</span>
          </div>
          <div class="info-stat">
            <span class="info-stat-label">Items on This Page</span>
            <span class="info-stat-value">{{ articles.length }}</span>
          </div>
          <div v-if="total !== undefined && total !== null && typeof total === 'number'" class="info-stat">
            <span class="info-stat-label">Total Items</span>
            <span class="info-stat-value">{{ formatNumber(total) }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { getArticlesPage } = useElmapi();
const { generatePageNumbers } = usePagination();

const currentPage = computed(() => parseInt((route.query.page as string) || '1', 10));
const perPage = computed(() => parseInt((route.query.per_page as string) || '10', 10));

const { data: articlesResult } = await useAsyncData(
  () => `articles-page-${currentPage.value}-${perPage.value}`,
  () => getArticlesPage(currentPage.value, perPage.value, { locale: 'en' }),
  {
    watch: [currentPage, perPage]
  }
);

const articles = computed(() => articlesResult.value?.data || []);
const page = computed(() => articlesResult.value?.page || 1);
const itemsPerPage = computed(() => articlesResult.value?.perPage || 10);
const total = computed(() => articlesResult.value?.total);
const hasMore = computed(() => articles.value.length === itemsPerPage.value);
const totalPages = computed(() => total.value ? Math.ceil(total.value / itemsPerPage.value) : undefined);
const pageNumbers = computed(() => totalPages.value ? generatePageNumbers(page.value, totalPages.value) : []);

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

function formatNumber(num: number) {
  return num.toLocaleString();
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

