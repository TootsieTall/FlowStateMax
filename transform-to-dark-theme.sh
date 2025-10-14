#!/bin/bash

# Dark Sunrise Theme Automated Transformation Script
# This script transforms all pages from light theme to dark theme

echo "🌅 Starting Dark Sunrise Theme Transformation..."

# Define color mappings for sed replacements
declare -A color_map=(
  ["bg-dawn-100"]="bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary"
  ["bg-dawn-50"]="bg-bg-elevated"
  ["bg-dawn-200"]="bg-bg-secondary"
  ["bg-white"]="bg-bg-surface"
  ["text-bark-500"]="text-text-primary"
  ["text-bark-400"]="text-text-secondary"
  ["text-bark-300"]="text-text-tertiary"
  ["text-bark-200"]="text-text-tertiary"
  ["text-bark-100"]="text-text-tertiary"
  ["text-sunset-500"]="text-accent-gold"
  ["text-sunset-600"]="text-accent-orange"
  ["text-sunset-700"]="text-accent-orange"
  ["text-gold-400"]="text-accent-gold"
  ["text-gold-500"]="text-accent-gold"
  ["border-sunset-200"]="border-accent-gold/20"
  ["border-sunset-300"]="border-accent-gold/30"
  ["border-sunset-400"]="border-accent-gold"
  ["border-border"]="border-border-default"
  ["border-gold-200"]="border-accent-gold/20"
  ["border-gold-300"]="border-accent-gold/30"
  ["border-gold-400"]="border-accent-gold"
  ["shadow-warm-sm"]="shadow-glow-subtle"
  ["shadow-warm-md"]="shadow-glow-medium"
  ["shadow-warm-lg"]="shadow-glow-strong"
  ["shadow-warm-xl"]="shadow-glow-strong"
  ["shadow-warm-2xl"]="shadow-glow-strong"
  ["card-elevated"]="bg-bg-elevated rounded-2xl border border-accent-gold/30 p-8 shadow-glow-strong"
  ["btn-primary"]="bg-gradient-to-r from-accent-gold to-accent-orange text-bg-primary font-semibold px-6 py-3 rounded-lg shadow-glow-strong hover:shadow-glow-interactive transition-all"
  ["btn-secondary"]="bg-transparent border-2 border-accent-gold/30 text-accent-gold hover:border-accent-gold hover:bg-accent-gold/10 transition-all px-6 py-3 rounded-lg"
  ["btn-ghost"]="bg-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary px-4 py-2 rounded-lg transition-all"
)

# Find all page.tsx files
pages=$(find apps/web/src/app -name "page.tsx" -type f ! -path "*/theme-test/*")

echo "Found $(echo "$pages" | wc -l) pages to transform"
echo ""

for page in $pages; do
  echo "Transforming: $page"

  # Add Framer Motion import if not present
  if ! grep -q "import.*framer-motion" "$page"; then
    sed -i '' "/^import.*useState/a\\
import { motion } from 'framer-motion'
" "$page"
  fi

  # Apply color transformations
  for old_class in "${!color_map[@]}"; do
    new_class="${color_map[$old_class]}"
    sed -i '' "s/$old_class/$new_class/g" "$page"
  done

  echo "  ✓ Transformed"
done

echo ""
echo "✨ Transformation complete!"
echo "Run 'npm run dev' and check your pages"
