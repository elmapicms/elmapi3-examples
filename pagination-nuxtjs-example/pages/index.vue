<template>
  <div class="container">
    <header>
      <h1>ElmapiCMS Nuxt.js Pagination Examples</h1>
      <p>Comprehensive examples demonstrating pagination strategies with ElmapiCMS</p>
      <nav>
        <NuxtLink to="/blog">📝 Blog with Filters</NuxtLink>
        <NuxtLink to="/page-based">📄 Page-Based</NuxtLink>
        <NuxtLink to="/limit-offset">🔢 Limit/Offset</NuxtLink>
        <NuxtLink to="/infinite-scroll">♾️ Infinite Scroll</NuxtLink>
        <NuxtLink to="/load-more">➕ Load More</NuxtLink>
      </nav>
    </header>

    <div class="info">
      <strong>About These Examples</strong>
      <p>
        This collection demonstrates different pagination strategies using the ElmapiCMS JavaScript SDK.
        All examples use only the SDK - no manual fetch calls required.
      </p>
      <p style="margin-top: 0.5rem">
        <strong>SDK Methods Used:</strong>
      </p>
      <ul style="margin-left: 1.5rem; margin-top: 0.5rem">
        <li>
          <code>client.getEntries()</code> with <code>paginate</code> and
          <code>page</code> parameters
        </li>
        <li>
          <code>client.getEntries()</code> with <code>limit</code> and
          <code>offset</code> parameters
        </li>
        <li>
          <code>client.getEntries()</code> with <code>where</code> for advanced filtering
        </li>
        <li>
          <code>client.getEntries()</code> with <code>sort</code> for ordering
        </li>
        <li>
          <code>client.getEntry()</code> for single article retrieval
        </li>
      </ul>
    </div>
  </div>
</template>

