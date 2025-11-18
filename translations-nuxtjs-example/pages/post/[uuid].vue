<template>
  <div class="container">
    <header>
      <NuxtLink :to="`/?locale=${locale}`" class="back-link">
        ← Back to Posts
      </NuxtLink>
      <LanguageSwitcher
        :current-locale="locale"
        :current-post-uuid="post?.uuid"
      />
    </header>

    <article v-if="post" class="post-detail">
      <h1>{{ post.fields.title }}</h1>
      <div class="meta">
        <span>
          {{
            post.fields.published_date
              ? formatDate(post.fields.published_date, locale)
              : 'No date'
          }}
        </span>
        <span style="margin-left: 1rem; color: #999">
          ({{ post.locale.toUpperCase() }})
        </span>
      </div>
      <div
        class="content"
        v-html="post.fields.content"
      />
    </article>
    <div v-else-if="pending">Loading...</div>
    <div v-else>Post not found</div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const uuid = route.params.uuid as string;
const locale = computed(() => (route.query.locale as string) || 'en');
const { getPost } = useElmapi();

const { data: post, pending } = await useAsyncData(
  `post-${uuid}-${locale.value}`,
  () => getPost(uuid, locale.value)
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

.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: #666;
}

.back-link:hover {
  color: #0070f3;
}

.post-detail {
  max-width: 800px;
  margin: 0 auto;
}

.post-detail h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.post-detail .meta {
  color: #666;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eaeaea;
}

.post-detail .content {
  line-height: 1.8;
}

.post-detail .content :deep(p) {
  margin-bottom: 1rem;
}
</style>

