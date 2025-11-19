<template>
  <NuxtLink
    :to="`/load-more?page=${nextPage}`"
    class="load-more-btn"
    style="margin-top: 2rem; display: inline-block"
    @click="handleClick"
  >
    Load More
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  nextPage: number;
}

const props = defineProps<Props>();
const router = useRouter();

onMounted(() => {
  // Restore scroll position after navigation and content render
  const restoreScroll = () => {
    const savedPosition = sessionStorage.getItem('load-more-position');
    if (savedPosition) {
      requestAnimationFrame(() => {
        window.scrollTo(0, parseInt(savedPosition, 10));
        sessionStorage.removeItem('load-more-position');
      });
    }
  };

  // Use setTimeout to ensure DOM is updated
  setTimeout(restoreScroll, 0);
});

const handleClick = (e: Event) => {
  e.preventDefault();
  // Save current scroll position before navigation
  sessionStorage.setItem('load-more-position', String(window.scrollY));
  router.push(`/load-more?page=${props.nextPage}`);
};
</script>

