<template>
  <div class="container">
    <header>
      <NuxtLink to="/blog" class="back-link">← Back to Blog</NuxtLink>
    </header>

    <article v-if="article" class="article-detail">
      <h1>{{ article.fields.title }}</h1>
      <div class="meta">
        <span v-if="article.fields.category" class="category-badge">
          {{ article.fields.category }}
        </span>
        <span v-if="article.fields.published_date">
          📅 {{ formatDate(article.fields.published_date) }}
        </span>
        <span v-if="article.fields.views">
          👁️ {{ formatViews(article.fields.views) }} views
        </span>
        <span>🌐 {{ article.locale.toUpperCase() }}</span>
      </div>
      <div class="content" v-html="article.fields.content" />
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { getArticle } = useElmapi();

const uuid = route.params.uuid as string;

const { data: article } = await useAsyncData(
  `article-${uuid}`,
  () => getArticle(uuid, 'en')
);

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article Not Found',
  });
}

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

