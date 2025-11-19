<template>
  <div ref="observerTarget" style="height: 20px; margin-top: 2rem">
    <div v-if="hasMore" class="loading">Loading more articles...</div>
    <div v-else class="loading">No more articles to load.</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number;
  hasMore: boolean;
}

const props = defineProps<Props>();
const router = useRouter();
const observerTarget = ref<HTMLDivElement | null>(null);

onMounted(() => {
  // Restore scroll position after navigation and content render
  const restoreScroll = () => {
    const savedPosition = sessionStorage.getItem('infinite-scroll-position');
    if (savedPosition) {
      requestAnimationFrame(() => {
        window.scrollTo(0, parseInt(savedPosition, 10));
        sessionStorage.removeItem('infinite-scroll-position');
      });
    }
  };

  // Use setTimeout to ensure DOM is updated
  setTimeout(restoreScroll, 0);

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && props.hasMore) {
        // Save scroll position before navigation
        sessionStorage.setItem('infinite-scroll-position', String(window.scrollY));
        router.push(`/infinite-scroll?page=${props.currentPage + 1}`);
      }
    },
    { threshold: 1.0 }
  );

  const currentTarget = observerTarget.value;
  if (currentTarget) {
    observer.observe(currentTarget);
  }

  onUnmounted(() => {
    if (currentTarget) {
      observer.unobserve(currentTarget);
    }
  });
});
</script>
