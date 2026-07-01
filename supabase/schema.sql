-- ============================================================
-- MAZAYA CONTINENTAL CUISINE - FULL PRODUCTION SCHEMA
-- ============================================================

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SETTINGS (single row)
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_name TEXT NOT NULL DEFAULT 'Mazaya Continental Cuisine',
  restaurant_name_ar TEXT DEFAULT 'مزايا كونتيننتال',
  tagline TEXT DEFAULT 'Experience the Finest Continental & Egyptian Cuisine',
  tagline_ar TEXT DEFAULT 'تذوق أرقى المأكولات العالمية والمصرية',
  description TEXT DEFAULT '',
  logo TEXT DEFAULT '',
  hero_video TEXT DEFAULT '',
  hero_image TEXT DEFAULT '',
  phone TEXT DEFAULT '+20 128 234 5667',
  whatsapp_number TEXT DEFAULT '201282345667',
  email TEXT DEFAULT 'info@mazayacuisine.com',
  address TEXT DEFAULT '26، Al-Saudia St., Al-Montazah, Sidi Gaber, Alexandria',
  address_ar TEXT DEFAULT '٢٦ ش السعودية، المنتزه، سيدي جابر، الإسكندرية',
  opening_hours TEXT DEFAULT 'Mon-Sun: 12:00 PM - 12:00 AM',
  instagram TEXT DEFAULT 'https://instagram.com/mazaya_continental',
  facebook TEXT DEFAULT '',
  google_review_url TEXT DEFAULT '',
  currency TEXT DEFAULT 'EGP',
  rating DECIMAL(2,1) DEFAULT 4.9,
  social_links JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT DEFAULT '',
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#C8A45C',
  icon TEXT DEFAULT 'FolderTree',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MENU ITEMS
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT DEFAULT '',
  description TEXT DEFAULT '',
  description_ar TEXT DEFAULT '',
  price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT DEFAULT '',
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RESERVATIONS
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  guest_email TEXT DEFAULT '',
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests INTEGER NOT NULL DEFAULT 2,
  special_requests TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')),
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. GALLERY
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  alt TEXT DEFAULT '',
  alt_ar TEXT DEFAULT '',
  category TEXT DEFAULT 'general' CHECK (category IN ('interior','food','events','exterior','general')),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CUSTOMERS (aggregated from reservations)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  reservation_count INTEGER DEFAULT 0,
  last_reservation TIMESTAMPTZ,
  notes TEXT DEFAULT '',
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(phone)
);

-- 8. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('reservation','message','system','review')),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT false,
  actionable BOOLEAN DEFAULT false,
  action_label TEXT DEFAULT '',
  action_href TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ADMINS (seed reference — actual auth via Supabase Auth)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin','manager','editor')),
  avatar TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_archived ON messages(is_archived);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

-- Admin-only write policies
CREATE POLICY "Admin all settings" ON settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all menu_items" ON menu_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all reservations" ON reservations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all messages" ON messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all customers" ON customers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all notifications" ON notifications FOR ALL USING (auth.role() = 'authenticated');

-- Public insert for reservations & messages (contact form)
CREATE POLICY "Public insert reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert messages" ON messages FOR INSERT WITH CHECK (true);

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO settings (id) VALUES (gen_random_uuid()) ON CONFLICT DO NOTHING;

INSERT INTO notifications (type, title, description, actionable, action_label, action_href) VALUES
  ('system', 'Welcome to Mazaya Admin', 'Your admin dashboard is ready. Start by adding menu items and categories.', false, '', ''),
  ('system', 'Quick Setup Guide', 'Complete your restaurant profile in Settings, then add your menu categories and items.', true, 'Go to Settings', '/admin/settings')
ON CONFLICT DO NOTHING;
