import { createClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const IS_MOCK = !supabaseUrl || !supabaseAnonKey

const mockFileStore = new Map<string, { data: string; mime: string }>()

async function fileToBase64(file: any): Promise<string | null> {
  if (file?.arrayBuffer) { const buf = await file.arrayBuffer(); return Buffer.from(buf).toString("base64") }
  if (file?.buffer) return Buffer.from(file.buffer).toString("base64")
  if (typeof file === "string") return Buffer.from(file).toString("base64")
  return null
}

function buildMockClient(): SupabaseClient {
  const store: Record<string, any[]> = {
    profiles: [
      { id: "mock_admin_1", email: "admin@mazayacuisine.com", full_name: "Admin", role: "admin", created_at: new Date().toISOString() },
    ],
    settings: [
      { id: "mock_settings_1", restaurant_name: "Mazaya Continental Cuisine", tagline: "Continental Dining Experience in Dubai", phone: "+97145911911", email: "info@mazayacuisine.com", address: "26, Al-Saudia St., Al-Montazah, Sidi Gaber, Alexandria", instagram: "https://instagram.com/mazaya_continental", opening_hours: "Mon-Sun: 12:00 PM - 12:00 AM", currency: "AED", primary_color: "#C8A45C", secondary_color: "#B8933D", accent_color: "#D4C9C0", dark_mode: true, font_heading: "Playfair Display", font_body: "Inter", footer_copyright: "© 2026 Mazaya Continental Cuisine. All rights reserved.", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ],
  }
  const mockAuthUsers: Array<{ id: string; email: string; password: string }> = [
    { id: "mock_admin_1", email: "admin@mazayacuisine.com", password: "Mazaya2026!" },
  ]

  function queryChain(table: string) {
    let operation: string | null = null
    let payload: any[] | null = null
    let filters: Array<{ col: string; val: any }> = []
    let orderCol: string | null = null
    let orderDir = true
    let isSingle = false

    function execute() {
      let rows = [...(store[table] || [])]

      for (const f of filters) {
        rows = rows.filter((r) => r[f.col] === f.val)
      }

      if (orderCol) {
        const col = orderCol
        rows.sort((a, b) => {
          const av = a[col] ?? ""
          const bv = b[col] ?? ""
          const cmp = av < bv ? -1 : av > bv ? 1 : 0
          return orderDir ? cmp : -cmp
        })
      }

      if (operation === "insert" && payload) {
        const items = Array.isArray(payload) ? payload : [payload]
        const inserted = items.map((item: any) => ({
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
          ...item,
          is_active: true,
          created_at: new Date().toISOString(),
        }))
        store[table] = [...(store[table] || []), ...inserted]
        return { data: isSingle ? inserted[0] : inserted, error: null }
      }

      if (operation === "update" && payload) {
        const updates = Array.isArray(payload) ? payload : [payload]
        for (const row of rows) {
          Object.assign(row, ...updates)
        }
        if (isSingle) {
          if (rows.length === 0) return { data: null, error: { message: "No rows matched the update criteria", details: "", code: "PGRST116" } }
          return { data: rows[0], error: null }
        }
        return { data: rows, error: null }
      }

      if (operation === "delete") {
        if (rows.length === 0 && isSingle) return { data: null, error: { message: "No rows matched the delete criteria", details: "", code: "PGRST116" } }
        const ids = new Set(rows.map((r) => r.id))
        store[table] = (store[table] || []).filter((r) => !ids.has(r.id))
        return { data: null, error: null }
      }

      if (isSingle) {
        if (rows.length === 0) return { data: null, error: { message: "No rows found matching the query", details: "", code: "PGRST116" } }
        return { data: rows[0], error: null }
      }
      return { data: rows, error: null }
    }

    const handler = {
      get: (_target: any, prop: string | symbol) => {
        if (prop === "then") return (resolve: (v: any) => void) => resolve(execute())
        if (prop === "toJSON") return undefined
        return (...args: any[]) => {
          switch (prop) {
            case "select": break
            case "insert": operation = "insert"; payload = args[0]; break
            case "update": operation = "update"; payload = [args[0]]; break
            case "delete": operation = "delete"; break
            case "eq": filters.push({ col: args[0], val: args[1] }); break
            case "order": orderCol = args[0]; orderDir = args[1]?.ascending !== false; break
            case "single": isSingle = true; break
            case "range": break
            case "limit": break
          }
          return chain
        }
      }
    }

    const chain = new Proxy({} as any, handler)
    return chain
  }

  return {
    from: (table: string) => queryChain(table),
    storage: (() => {
      const buckets: Record<string, any[]> = {}
      return {
        from: (bucketName: string) => ({
          upload: async (path: string, file: any) => {
            const id = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
            const mime = file?.type || "image/jpeg"
            const b64 = await fileToBase64(file)
            const entry = { id, name: path, created_at: new Date().toISOString(), metadata: { size: file?.size || 0, mimetype: mime } }
            if (b64) mockFileStore.set(id, { data: b64, mime })
            if (!buckets[bucketName]) buckets[bucketName] = []
            buckets[bucketName].push(entry)
            return { data: { path: entry.name, id: entry.id }, error: null }
          },
          getPublicUrl: (path: string) => {
            const found = buckets[bucketName]?.find(e => e.name === path)
            const stored = found?.id ? mockFileStore.get(found.id) : null
            if (stored) return { data: { publicUrl: `data:${stored.mime};base64,${stored.data}` } }
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect fill="%231A1A1A" width="800" height="600"/><text fill="%23C8A45C" font-family="sans-serif" font-size="20" x="50%" y="50%" text-anchor="middle" dy=".3em">${bucketName}</text></svg>`
            return { data: { publicUrl: `data:image/svg+xml,${svg}` } }
          },
          remove: (paths: string[]) => { for (const b in buckets) { buckets[b] = buckets[b].filter((e: any) => !paths.includes(e.name)) }; return Promise.resolve({ data: null, error: null }) },
          list: () => { const data = buckets[bucketName] || []; return Promise.resolve({ data, error: null }) },
        }),
      }
    })(),
    auth: {
      signInWithPassword: ({ email, password }: { email: string; password: string }) => {
        const found = mockAuthUsers.find(u => u.email === email && u.password === password)
        if (!found) return Promise.resolve({ data: { user: null, session: null }, error: { message: "Invalid credentials", status: 401 } })
        const mockSession = { user: { id: found.id, email: found.email, app_metadata: {}, user_metadata: {}, aud: "authenticated" }, access_token: `mock_at_${Date.now()}`, refresh_token: `mock_rt_${Date.now()}`, expires_in: 604800 }
        return Promise.resolve({ data: { user: mockSession.user, session: mockSession }, error: null })
      },
      signUp: ({ email, password }: { email: string; password: string }) => {
        const existing = mockAuthUsers.find(u => u.email === email)
        if (existing) return Promise.resolve({ data: { user: null, session: null }, error: { message: "User already registered", status: 400 } })
        const id = `mock_user_${Date.now().toString(36)}`
        mockAuthUsers.push({ id, email, password })
        store.profiles = [...(store.profiles || []), { id, email, full_name: "", role: "user", created_at: new Date().toISOString() }]
        const mockUser = { id, email, app_metadata: {}, user_metadata: {}, aud: "authenticated" }
        const mockSession = { user: mockUser, access_token: `mock_at_${Date.now()}`, refresh_token: `mock_rt_${Date.now()}`, expires_in: 604800 }
        return Promise.resolve({ data: { user: mockUser, session: mockSession }, error: null })
      },
      signInWithOAuth: ({ provider }: { provider: string }) => {
        return Promise.resolve({ data: { url: `/auth/callback?code=mock_oauth&provider=${provider}` }, error: null })
      },
      exchangeCodeForSession: (code: string) => {
        if (code.startsWith("mock_oauth")) {
          const id = `mock_oauth_${Date.now().toString(36)}`
          const email = `oauth_${code.split("=")[1]}_${Date.now()}@mock.com`
          mockAuthUsers.push({ id, email, password: "" })
          const mockSession = { user: { id, email, app_metadata: {}, user_metadata: {}, aud: "authenticated" }, access_token: `mock_oat_${Date.now()}`, refresh_token: `mock_ort_${Date.now()}`, expires_in: 604800 }
          return Promise.resolve({ data: { session: mockSession }, error: null })
        }
        return Promise.resolve({ data: { session: null }, error: { message: "Invalid OAuth code" } })
      },
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    rpc: () => Promise.resolve({ data: null, error: null }),
  } as any
}

let mockClient: SupabaseClient | null = null

function getMockClient() {
  if (!mockClient) mockClient = buildMockClient()
  return mockClient
}

export function getSupabaseClient(): SupabaseClient {
  if (IS_MOCK) return getMockClient()
  return createClient(supabaseUrl!, supabaseAnonKey!)
}

export function getServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return getMockClient()
  return createClient(url, key, { auth: { persistSession: false } })
}

export const supabase = getSupabaseClient()
export const createServerClient = getServerClient

export const STORAGE_BUCKETS = {
  MENU: "menu-images",
  GALLERY: "gallery-images",
  LOGO: "logos",
  HERO: "hero",
  STORY: "story-images",
  FULL_HOUSE: "full-house-images",
  FEATURED: "featured-images",
  ICONS: "icons",
} as const
