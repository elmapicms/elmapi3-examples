<template>
  <div class="filters">
    <div class="filters-grid">
      <div class="filter-group">
        <label for="search">Search</label>
        <input
          id="search"
          v-model="searchInput"
          type="text"
          placeholder="Search articles..."
        />
      </div>

      <div class="filter-group">
        <label for="category">Category</label>
        <select id="category" :value="currentFilters.category || ''" @change="handleFilterChange('category', ($event.target as HTMLSelectElement).value)">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label for="sort">Sort By</label>
        <select id="sort" :value="currentFilters.sort || 'id:ASC'" @change="handleFilterChange('sort', ($event.target as HTMLSelectElement).value)">
          <optgroup label="ID">
            <option value="id:ASC">ID ASC</option>
            <option value="id:DESC">ID DESC</option>
          </optgroup>
          <optgroup label="Title">
            <option value="title:ASC">Title A-Z</option>
            <option value="title:DESC">Title Z-A</option>
          </optgroup>
          <optgroup label="Views">
            <option value="views:DESC">Most Views</option>
            <option value="views:ASC">Least Views</option>
          </optgroup>
          <optgroup label="Published Date">
            <option value="published_date:DESC">Newest Published</option>
            <option value="published_date:ASC">Oldest Published</option>
          </optgroup>
          <optgroup label="Category">
            <option value="category:ASC">Category A-Z</option>
            <option value="category:DESC">Category Z-A</option>
          </optgroup>
        </select>
      </div>

      <div class="filter-group">
        <label for="per_page">Items Per Page</label>
        <select id="per_page" :value="currentFilters.per_page || 10" @change="handleFilterChange('per_page', ($event.target as HTMLSelectElement).value)">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>

    <div class="filter-actions">
      <NuxtLink to="/blog" class="btn btn-secondary">
        Clear Filters
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  categories: string[];
  currentFilters: {
    category?: string;
    search?: string;
    sort?: string;
    per_page?: number;
  };
}

const props = defineProps<Props>();
const route = useRoute();
const router = useRouter();

const searchInput = ref(props.currentFilters.search || '');
const debouncedSearch = ref(searchInput.value);

// Sync search input with props when they change
watch(() => props.currentFilters.search, (newValue) => {
  if (newValue !== searchInput.value) {
    searchInput.value = newValue || '';
    debouncedSearch.value = newValue || '';
  }
}, { immediate: true });

// Debounce search input
let searchTimer: ReturnType<typeof setTimeout> | null = null;
watch(searchInput, (newValue) => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    debouncedSearch.value = newValue;
  }, 500);
});

// Update URL when search changes (debounced)
watch(debouncedSearch, (newValue) => {
  const currentSearch = (route.query.search as string) || '';
  if (newValue === currentSearch) return;

  const params = new URLSearchParams(route.query as Record<string, string>);
  
  if (newValue) {
    params.set('search', newValue);
  } else {
    params.delete('search');
  }
  
  params.set('page', '1'); // Reset to page 1 on search
  router.push(`/blog?${params.toString()}`);
});

const handleFilterChange = (name: string, value: string) => {
  const params = new URLSearchParams(route.query as Record<string, string>);
  
  if (value) {
    params.set(name, value);
  } else {
    params.delete(name);
  }
  
  params.set('page', '1'); // Reset to page 1 when filters change
  router.push(`/blog?${params.toString()}`);
};
</script>

