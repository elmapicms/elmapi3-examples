<template>
  <div class="container">
    <div class="error" style="text-align: center; padding: 3rem">
      <h2 style="font-size: 2rem; margin-bottom: 1rem">{{ error.statusCode === 404 ? 'Article Not Found' : 'Error' }}</h2>
      <p>{{ error.statusCode === 404 ? "The article you're looking for doesn't exist or has been removed." : error.message }}</p>
      <NuxtLink v-if="error.statusCode === 404" to="/blog" class="btn btn-primary" style="margin-top: 1.5rem; display: inline-block">
        Back to Blog
      </NuxtLink>
      <NuxtLink v-else to="/" class="btn btn-primary" style="margin-top: 1.5rem; display: inline-block">
        Back to Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error: {
    statusCode: number;
    statusMessage?: string;
    message?: string;
  };
}

const props = defineProps<Props>();
</script>

