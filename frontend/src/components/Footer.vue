<template>
  <footer class="bg-white border-t border-slate-100 mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand Info -->
        <div class="md:col-span-2 space-y-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🌴</span>
            <span class="font-extrabold text-xl text-slate-900">
              Visayas<span class="text-amber-500">BucketList</span>
            </span>
          </div>
          <p class="text-slate-500 text-sm max-w-sm leading-relaxed">
            Your interactive travel companion to explore, save, and conquer the most breathtaking islands, waterfalls, beaches, and summits across the Visayas, Philippines.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
            Regions Covered
          </h4>
          <ul class="space-y-2 text-sm text-slate-500">
            <li>Central Visayas (Cebu, Bohol, Siquijor)</li>
            <li>Western Visayas (Aklan, Iloilo, Antique)</li>
            <li>Eastern Visayas (Leyte, Samar, Biliran)</li>
          </ul>
        </div>

        <!-- About -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
            Platform
          </h4>
          <ul class="space-y-2 text-sm text-slate-500">
            <li>
              <RouterLink to="/explore" class="hover:text-teal-600 transition-colors">
                Explore All Destinations
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/bucket-list" class="hover:text-teal-600 transition-colors">
                Personal Bucket List
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/favorites" class="hover:text-teal-600 transition-colors">
                Favorite Spots
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© 2026 VisayasBucketList. Proudly Philippine-made 🇵🇭.</p>
        <p>Built with Vue 3, Vite, Tailwind CSS, Node.js & Prisma.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>
