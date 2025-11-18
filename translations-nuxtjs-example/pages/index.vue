<template>
  <div class="container">
    <header>
      <h1>Blog Posts</h1>
      <LanguageSwitcher :current-locale="locale" />
    </header>

    <div class="post-list">
      <div v-if="pending">Loading...</div>
      <div v-else-if="posts.length === 0">
        <p>No posts found.</p>
      </div>
      <article
        v-else
        v-for="post in posts"
        :key="post.uuid"
        class="post-card"
      >
        <NuxtLink :to="`/post/${post.uuid}?locale=${locale}`">
          <h2>{{ post.fields.title }}</h2>
        </NuxtLink>
        <p v-if="post.fields.excerpt" class="excerpt">
          {{ post.fields.excerpt }}
        </p>
        <p v-if="post.fields.published_date" class="date">
          {{ formatDate(post.fields.published_date, locale) }}
        </p>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const locale = computed(() => (route.query.locale as string) || 'en');
const { getPosts } = useElmapi();

const { data: posts, pending } = await useAsyncData(
  `posts-${locale.value}`,
  () => getPosts(locale.value)
);

const formatDate = (dateString: string, locale: string) => {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  border-bottom: 1px solid #eaeaea;
  padding: 1rem 0;
  margin-bottom: 2rem;
}

header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.post-list {
  display: grid;
  gap: 2rem;
  margin-top: 2rem;
}

.post-card {
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 1.5rem;
  transition: box-shadow 0.2s;
}

.post-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-card h2 {
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.post-card .excerpt {
  color: #666;
  margin-bottom: 0.5rem;
}

.post-card .date {
  color: #999;
  font-size: 0.875rem;
}
</style>

