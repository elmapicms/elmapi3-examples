<template>
  <div class="language-switcher">
    <button
      v-for="locale in locales"
      :key="locale.code"
      @click="switchLanguage(locale.code)"
      :disabled="loading === locale.code || currentLocale === locale.code"
      :class="[
        'lang-btn',
        { active: currentLocale === locale.code, loading: loading === locale.code }
      ]"
    >
      {{ locale.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentLocale: string;
  currentPostUuid?: string;
}>();

const router = useRouter();
const route = useRoute();
const { getPostTranslation } = useElmapi();

const locales = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
];

const loading = ref<string | null>(null);

const switchLanguage = async (targetLocale: string) => {
  if (targetLocale === props.currentLocale) return;

  // If we're on a post detail page, get the translation
  if (props.currentPostUuid && route.path.startsWith('/post/')) {
    loading.value = targetLocale;
    try {
      const response = await $fetch(`/api/translations/${props.currentPostUuid}`, {
        params: { locale: targetLocale },
      });
      if (response && response.uuid) {
        await router.push(`/post/${response.uuid}?locale=${targetLocale}`);
      } else {
        // Translation not available, just switch locale on home
        await router.push(`/?locale=${targetLocale}`);
      }
    } catch (error) {
      console.error('Error fetching translation:', error);
      await router.push(`/?locale=${targetLocale}`);
    } finally {
      loading.value = null;
    }
  } else {
    // On home page, just switch locale
    await router.push(`/?locale=${targetLocale}`);
  }
};
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.lang-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.lang-btn:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #999;
}

.lang-btn.active {
  background: #0070f3;
  color: white;
  border-color: #0070f3;
}

.lang-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.lang-btn.loading {
  opacity: 0.7;
}
</style>

