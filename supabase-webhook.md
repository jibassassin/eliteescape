# 🔄 Supabase → Netlify Auto-Rebuild Setup

## How It Works
When admin saves configuration → Supabase webhook → Netlify rebuild → Fresh static site

## Setup Instructions

### 1. Get Netlify Build Hook URL
1. Go to Netlify Dashboard → Your Site → Site Settings
2. Build & Deploy → Build hooks
3. Click "Add build hook"
4. Name: "Supabase Config Update"
5. Branch: "master"
6. Copy the webhook URL (looks like: `https://api.netlify.com/build_hooks/YOUR_HOOK_ID`)

### 2. Create Supabase Webhook Function
1. Go to Supabase Dashboard → Edge Functions
2. Create new function: `netlify-rebuild`
3. Use this code:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const NETLIFY_BUILD_HOOK = 'YOUR_NETLIFY_WEBHOOK_URL_HERE'

serve(async (req) => {
  // Only trigger on INSERT/UPDATE to configurations table
  const { table, eventType, new: newRecord } = await req.json()
  
  if (table === 'configurations' && ['INSERT', 'UPDATE'].includes(eventType)) {
    console.log('🔄 Configuration changed, triggering Netlify rebuild...')
    
    try {
      const response = await fetch(NETLIFY_BUILD_HOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: 'supabase-config-update' })
      })
      
      if (response.ok) {
        console.log('✅ Netlify rebuild triggered successfully')
        return new Response('Rebuild triggered', { status: 200 })
      } else {
        console.error('❌ Failed to trigger Netlify rebuild:', response.status)
        return new Response('Rebuild failed', { status: 500 })
      }
    } catch (error) {
      console.error('❌ Error triggering rebuild:', error)
      return new Response('Error: ' + error.message, { status: 500 })
    }
  }
  
  return new Response('No action needed', { status: 200 })
})
```

### 3. Create Database Webhook Trigger
Run this SQL in Supabase SQL Editor:

```sql
-- Create webhook trigger function
CREATE OR REPLACE FUNCTION trigger_netlify_rebuild()
RETURNS trigger AS $$
BEGIN
  -- Call the Edge Function to trigger Netlify rebuild
  PERFORM net.http_post(
    url := 'https://YOUR_PROJECT.supabase.co/functions/v1/netlify-rebuild',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
    ),
    body := jsonb_build_object(
      'table', TG_TABLE_NAME,
      'eventType', TG_OP,
      'new', row_to_json(NEW),
      'old', CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger on configurations table
DROP TRIGGER IF EXISTS configurations_netlify_rebuild ON configurations;
CREATE TRIGGER configurations_netlify_rebuild
  AFTER INSERT OR UPDATE OR DELETE ON configurations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_netlify_rebuild();
```

## Result
- ⚡ **Instant rebuilds** when admin saves changes
- 🚀 **Fresh static content** with SEO benefits
- 📱 **Client-side real-time** still works for immediate preview
- 🔄 **Best of both worlds**: Static generation + Real-time updates

## Testing
1. Save configuration in admin panel
2. Check Netlify deploy logs for auto-triggered build
3. Verify new static site reflects changes
4. Confirm client-side real-time still works for immediate feedback