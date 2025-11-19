<template>
  <div class="container">
    <header>
      <NuxtLink to="/" class="back-link">← Back to Examples</NuxtLink>
      <h1>Infinite Scroll</h1>
      <p>
        Automatically loads more content as you scroll using Intersection Observer
      </p>
    </header>

    <div v-if="allArticles.length === 0" class="loading">
      No articles found.
    </div>

    <template v-else>
      <div class="articles-list">
        <article v-for="article in allArticles" :key="article.uuid" class="article-card">
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

      <InfiniteScrollClient :current-page="currentPage" :has-more="hasMore" />
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { getArticlesPage } = useElmapi();

const ITEMS_PER_PAGE = 10;
const currentPage = computed(() => parseInt((route.query.page as string) || '1', 10));

// Store all articles and track which pages we've loaded
const allArticles = ref<any[]>([]);
const loadedPages = ref<Set<number>>(new Set());
const hasMore = ref(true);

// Fetch a single page (useAsyncData automatically caches by key)
async function fetchPage(page: number) {
  const { data } = await useAsyncData(
    `articles-infinite-page-${page}`,
    () => getArticlesPage(page, ITEMS_PER_PAGE, { locale: 'en' })
  );
  return data.value;
}

// Load all pages up to current page
async function loadPages() {
  // Only fetch pages we haven't loaded yet
  for (let page = 1; page <= currentPage.value; page++) {
    if (!loadedPages.value.has(page)) {
      const articlesResult = await fetchPage(page);
      const articles = articlesResult?.data || [];
      
      if (articles.length > 0) {
        allArticles.value.push(...articles);
        loadedPages.value.add(page);
        
        if (articles.length < ITEMS_PER_PAGE) {
          hasMore.value = false;
          break;
        }
      } else {
        hasMore.value = false;
        break;
      }
    }
  }

  // Check if there's more (only check when we've loaded a new page)
  if (hasMore.value) {
    const nextPage = currentPage.value + 1;
    // Only check if we haven't already loaded this page
    if (!loadedPages.value.has(nextPage)) {
      const { data: nextPageData } = await useAsyncData(
        `articles-infinite-check-next-${nextPage}`,
        () => getArticlesPage(nextPage, ITEMS_PER_PAGE, { locale: 'en' })
      );
      hasMore.value = (nextPageData.value?.data || []).length > 0;
    }
  }
}

// Initial load
await loadPages();

// Watch for page changes and only load new pages (when page increases)
watch(currentPage, async (newPage, oldPage) => {
  if (newPage > (oldPage || 0)) {
    await loadPages();
  }
});

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

