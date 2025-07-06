#!/usr/bin/env node

/**
 * 🏗️ Elite Escape SSG Builder
 * Pre-generates static HTML with Supabase data for better SEO and performance
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Supabase configuration (same as in supabase-client.js)
const SUPABASE_URL = 'https://aaqqkxrhtgxxfeexbpgs.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcXFreHJodGd4eGZlZXhicGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTY5NDcsImV4cCI6MjA2NjA5Mjk0N30.5fLV8_EmkbdSx0vCUd8HXMP1SDsOG1p0fyYMqdVmUAQ'

console.log('🏗️ Starting Elite Escape SSG Build...')

async function fetchConfigurationData() {
  console.log('📡 Fetching latest configuration from Supabase...')
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  try {
    const { data, error } = await supabase
      .from('configurations')
      .select('config_data')
      .order('id', { ascending: false })
      .limit(1)

    if (error) {
      console.error('❌ Error fetching configuration:', error)
      return null
    }

    if (data && data.length > 0) {
      const configData = data[0].config_data
      console.log(`✅ Configuration loaded (version: ${configData.version || 'unknown'})`)
      return configData
    }

    console.warn('⚠️ No configuration found in database')
    return null
  } catch (err) {
    console.error('❌ Exception fetching configuration:', err)
    return null
  }
}

function getConfigValue(config, path, fallback = '') {
  try {
    return path.split('.').reduce((obj, key) => obj?.[key], config) || fallback
  } catch {
    return fallback
  }
}

async function generateStaticHTML() {
  console.log('📄 Reading index.html template...')
  
  const indexPath = path.join(process.cwd(), 'index.html')
  let htmlContent = fs.readFileSync(indexPath, 'utf8')
  
  // Fetch configuration data
  const config = await fetchConfigurationData()
  
  if (!config) {
    console.warn('⚠️ Building with default values (no config found)')
    return htmlContent
  }

  console.log('🔄 Pre-populating HTML with configuration data...')

  // Extract data from unified format (config.data) or BOX format (config.box1_2)
  const data = config.data || {}
  const box1_2 = config.box1_2 || {}

  // Helper function to get value from either format
  const getValue = (dataPath, boxPath, fallback) => {
    return getConfigValue(data, dataPath, null) || 
           getConfigValue(box1_2, boxPath, null) || 
           fallback
  }

  // Pre-populate SEO and critical content
  const replacements = {
    // Page title and meta
    '<title>Prenota il tuo Catamarano - Vacanze in Sardegna</title>': 
      `<title>${getValue('page.title', 'box1.page.title', 'Prenota il tuo Catamarano')} - ${getValue('logo.text', 'box1.logo.text', 'Elite Escape')}</title>`,
    
    // Logo and branding
    'Elite Escape': getValue('logo.text', 'box1.logo.text', 'Elite Escape'),
    
    // Catamaran name
    'Violante': getValue('boat.name', 'box2.boat.name', 'Violante'),
    
    // Pricing (extract number from €X.XXX format)
    '€2.999': getValue('badge.price', 'box2.badge.price', '€2.999'),
    '€ 3.499': (() => {
      const badgePrice = getValue('badge.price', 'box2.badge.price', '€3.499')
      const numericPrice = badgePrice.replace(/[€.,]/g, '') || '3499'
      return `€ ${parseInt(numericPrice).toLocaleString()}`
    })(),
    
    // Technical specs
    'Anno 2025': getValue('technical.year', 'box2.technical.year', 'Anno 2025'),
    '11.8 m': getValue('technical.length', 'box2.technical.length', '11.8 m'),
    '4 cabine +1 skipper': getValue('technical.cabins', 'box2.technical.cabins', '4 cabine +1 skipper'),
    '4 bagni +1 skipper': getValue('technical.bathrooms', 'box2.technical.bathrooms', '4 bagni +1 skipper'),
    '60 HP': getValue('technical.engine', 'box2.technical.engine', '60 HP'),
    
    // Skipper pricing
    '€200': (() => {
      const skipperPrice = getValue('skipper.price', 'box3.skipper.price', 200)
      return `€${skipperPrice}`
    })()
  }

  // Apply replacements
  Object.entries(replacements).forEach(([search, replace]) => {
    htmlContent = htmlContent.replace(new RegExp(search, 'g'), replace)
  })

  // Add SSG metadata
  const buildTime = new Date().toISOString()
  const configVersion = config.version || Date.now()
  
  const ssgMeta = `
<!-- SSG Build Info -->
<meta name="ssg-build-time" content="${buildTime}">
<meta name="ssg-config-version" content="${configVersion}">
<meta name="ssg-generator" content="Elite Escape SSG v1.0">

<!-- Enhanced SEO with dynamic content -->
<meta name="description" content="Prenota ${getValue('boat.name', 'box2.boat.name', 'Violante')} - Catamarano ${getValue('technical.length', 'box2.technical.length', '11.8m')} per vacanze in Sardegna. ${getValue('technical.cabins', 'box2.technical.cabins', '4 cabine')}, a partire da ${getValue('badge.price', 'box2.badge.price', '€2.999')}.">
<meta property="og:title" content="${getValue('page.title', 'box1.page.title', 'Prenota il tuo Catamarano')} - ${getValue('logo.text', 'box1.logo.text', 'Elite Escape')}">
<meta property="og:description" content="Catamarano ${getValue('boat.name', 'box2.boat.name', 'Violante')} per vacanze indimenticabili in Sardegna. Prenota ora!">
<meta property="og:type" content="website">
`

  // Insert SSG meta after existing head content
  htmlContent = htmlContent.replace('</head>', ssgMeta + '</head>')

  console.log('✅ HTML pre-populated with live data')
  console.log(`📊 Config version: ${configVersion}`)
  console.log(`🕐 Build time: ${buildTime}`)

  return htmlContent
}

async function main() {
  try {
    // Generate static HTML with pre-populated data
    const staticHTML = await generateStaticHTML()
    
    // Create dist directory
    const distDir = path.join(process.cwd(), 'dist')
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true })
    }

    // Write static index.html
    const outputPath = path.join(distDir, 'index.html')
    fs.writeFileSync(outputPath, staticHTML)
    console.log(`✅ Static index.html written to: ${outputPath}`)

    // Copy other static files to dist
    const staticFiles = [
      'Admin-Configurazione-Catamarano.html',
      'catamaran-config.js',
      'supabase-client.js',
      'auth-manager.js',
      'storage-wrapper.js',
      'template-email-prenotazione.html',
      'netlify.toml'
    ]

    staticFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(distDir, file))
        console.log(`📁 Copied: ${file}`)
      }
    })

    console.log('🚀 SSG Build completed successfully!')
    console.log(`📂 Output directory: ${distDir}`)
    
  } catch (error) {
    console.error('❌ Build failed:', error)
    process.exit(1)
  }
}

// Run the build
main()