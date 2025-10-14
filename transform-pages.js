const fs = require('fs');
const path = require('path');

// Color mapping for dark theme transformation
const colorMappings = {
  'bg-dawn-100': 'bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary',
  'bg-dawn-50': 'bg-bg-elevated',
  'bg-dawn-200': 'bg-bg-secondary',
  'bg-dawn-300': 'bg-bg-surface',
  'bg-white': 'bg-bg-surface',
  'text-bark-500': 'text-text-primary',
  'text-bark-400': 'text-text-secondary',
  'text-bark-300': 'text-text-tertiary',
  'text-bark-200': 'text-text-tertiary',
  'text-sunset-500': 'text-accent-gold',
  'text-sunset-600': 'text-accent-orange',
  'text-gold-400': 'text-accent-gold',
  'text-gold-500': 'text-accent-gold',
  'border-sunset-200': 'border-accent-gold/20',
  'border-sunset-300': 'border-accent-gold/30',
  'border-gold-200': 'border-accent-gold/20',
  'border-gold-300': 'border-accent-gold/30',
  'border-border': 'border-border-default',
  'shadow-warm-sm': 'shadow-glow-subtle',
  'shadow-warm-md': 'shadow-glow-medium',
  'shadow-warm-lg': 'shadow-glow-strong',
  'text-gradient-sunset': 'bg-gradient-to-r from-accent-gold to-accent-orange bg-clip-text text-transparent'
};

function transformFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add Framer Motion import if not present
  if (!content.includes('from \'framer-motion\'') && !content.includes('from "framer-motion"')) {
    content = content.replace(
      /^(import.*?from.*?['"]react['"])/m,
      '$1\nimport { motion } from \'framer-motion\''
    );
  }
  
  // Apply all color mappings
  for (const [oldClass, newClass] of Object.entries(colorMappings)) {
    const regex = new RegExp(oldClass, 'g');
    content = content.replace(regex, newClass);
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Transformed: ${path.basename(path.dirname(filePath))}/${path.basename(filePath)}`);
}

// Transform all onboarding pages (except already done)
const pagesToTransform = [
  'apps/web/src/app/onboarding/apps/page.tsx',
  'apps/web/src/app/onboarding/boredom/page.tsx',
  'apps/web/src/app/onboarding/integrations/page.tsx',
  'apps/web/src/app/onboarding/locations/page.tsx',
  'apps/web/src/app/onboarding/recovery/page.tsx',
  'apps/web/src/app/onboarding/ritual/page.tsx'
];

console.log('🌅 Transforming remaining onboarding pages...\n');
pagesToTransform.forEach(transformFile);
console.log('\n✨ Transformation complete!');
