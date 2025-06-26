-- إنشاء جداول قاعدة بيانات تطبيق راحة العقاري
-- Raha Real Estate App Database Tables

-- 1. جدول المباني | Buildings Table
CREATE TABLE buildings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT,
  description_en TEXT,
  location TEXT NOT NULL,
  location_en TEXT NOT NULL,
  price_range TEXT,
  building_type TEXT CHECK (building_type IN ('residential', 'commercial', 'mixed')),
  total_floors INTEGER,
  total_units INTEGER,
  amenities TEXT[], -- مجموعة من المميزات
  images TEXT[], -- مجموعة من روابط الصور
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold_out')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. جدول الشقق/الوحدات | Apartments/Units Table
CREATE TABLE apartments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
  apartment_number TEXT NOT NULL,
  floor_number INTEGER,
  apartment_type TEXT NOT NULL, -- "1 bedroom", "2 bedroom", etc
  area_sqm DECIMAL(8,2),
  price DECIMAL(12,2),
  price_currency TEXT DEFAULT 'USD',
  bedrooms INTEGER,
  bathrooms INTEGER,
  balconies INTEGER DEFAULT 0,
  parking_spaces INTEGER DEFAULT 0,
  view_type TEXT, -- "sea view", "city view", etc
  features TEXT[], -- مميزات الشقة
  images TEXT[], -- صور الشقة
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold', 'rented')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(building_id, apartment_number)
);

-- 3. جدول المستخدمين | User Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  date_of_birth DATE,
  nationality TEXT,
  occupation TEXT,
  preferred_language TEXT DEFAULT 'ar' CHECK (preferred_language IN ('ar', 'en')),
  profile_image TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- 4. جدول الحجوزات | Bookings Table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
  apartment_id UUID REFERENCES apartments(id) ON DELETE CASCADE,
  booking_type TEXT CHECK (booking_type IN ('purchase', 'rent', 'viewing')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  booking_date TIMESTAMP WITH TIME ZONE,
  preferred_time TEXT,
  message TEXT,
  contact_method TEXT DEFAULT 'whatsapp' CHECK (contact_method IN ('whatsapp', 'phone', 'email')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. جدول طلبات الصيانة | Maintenance Requests Table
CREATE TABLE maintenance_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
  apartment_id UUID REFERENCES apartments(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('plumbing', 'electrical', 'ac', 'general', 'emergency', 'appliances')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'emergency')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  images TEXT[], -- صور للمشكلة
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  preferred_time TEXT,
  contact_method TEXT DEFAULT 'whatsapp' CHECK (contact_method IN ('whatsapp', 'phone', 'email')),
  technician_notes TEXT,
  completion_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. جدول تأجير السيارات | Car Rentals Table
CREATE TABLE car_rentals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  car_type TEXT NOT NULL,
  rental_duration INTEGER NOT NULL, -- عدد الأيام
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  pickup_location TEXT,
  dropoff_location TEXT,
  total_price DECIMAL(10,2),
  insurance_included BOOLEAN DEFAULT true,
  driver_included BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  special_requests TEXT,
  contact_method TEXT DEFAULT 'whatsapp' CHECK (contact_method IN ('whatsapp', 'phone', 'email')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. جدول المفضلة | Favorites Table
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
  apartment_id UUID REFERENCES apartments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, building_id, apartment_id)
);

-- إنشاء فهارس لتحسين الأداء | Create indexes for performance
CREATE INDEX idx_buildings_status ON buildings(status);
CREATE INDEX idx_buildings_type ON buildings(building_type);
CREATE INDEX idx_apartments_building ON apartments(building_id);
CREATE INDEX idx_apartments_status ON apartments(status);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_maintenance_user ON maintenance_requests(user_id);
CREATE INDEX idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX idx_car_rentals_user ON car_rentals(user_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);

-- تفعيل Row Level Security (RLS)
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان | Create Security Policies

-- سياسة قراءة المباني والشقق للجميع
CREATE POLICY "العامة يمكنها قراءة المباني" ON buildings FOR SELECT USING (true);
CREATE POLICY "العامة يمكنها قراءة الشقق" ON apartments FOR SELECT USING (true);

-- سياسة البروفايلات - المستخدم يمكنه فقط رؤية وتعديل بروفايله
CREATE POLICY "المستخدم يمكنه رؤية بروفايله" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "المستخدم يمكنه تعديل بروفايله" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "المستخدم يمكنه إنشاء بروفايل" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- سياسة الحجوزات - المستخدم يمكنه فقط رؤية وإدارة حجوزاته
CREATE POLICY "المستخدم يمكنه رؤية حجوزاته" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "المستخدم يمكنه إنشاء حجوزات" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "المستخدم يمكنه تعديل حجوزاته" ON bookings FOR UPDATE USING (auth.uid() = user_id);

-- سياسة طلبات الصيانة
CREATE POLICY "المستخدم يمكنه رؤية طلبات الصيانة" ON maintenance_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "المستخدم يمكنه إنشاء طلبات صيانة" ON maintenance_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "المستخدم يمكنه تعديل طلبات الصيانة" ON maintenance_requests FOR UPDATE USING (auth.uid() = user_id);

-- سياسة تأجير السيارات
CREATE POLICY "المستخدم يمكنه رؤية طلبات تأجير السيارات" ON car_rentals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "المستخدم يمكنه إنشاء طلبات تأجير" ON car_rentals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "المستخدم يمكنه تعديل طلبات التأجير" ON car_rentals FOR UPDATE USING (auth.uid() = user_id);

-- سياسة المفضلة
CREATE POLICY "المستخدم يمكنه رؤية مفضلاته" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "المستخدم يمكنه إضافة للمفضلة" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "المستخدم يمكنه حذف من المفضلة" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- إنشاء triggers للتحديث التلقائي لـ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON buildings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_apartments_updated_at BEFORE UPDATE ON apartments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON maintenance_requests FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_car_rentals_updated_at BEFORE UPDATE ON car_rentals FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- إدراج بيانات تجريبية | Insert Sample Data

-- إدراج مباني تجريبية
INSERT INTO buildings (name, name_en, description, description_en, location, location_en, price_range, building_type, total_floors, total_units, amenities, images, featured) VALUES
('أستر السكني', 'Aster Residence', 'مجمع سكني فاخر يقع في منطقة الشرق', 'Luxurious residential complex located in the Eastern District', 'الشرق - بيتشود', 'East - Baytowd', '$150,000 - $300,000', 'residential', 25, 200, 
 ARRAY['مسبح', 'جيم', 'حديقة', 'أمن 24/7', 'مواقف سيارات', 'مصعد'], 
 ARRAY['https://example.com/aster1.jpg', 'https://example.com/aster2.jpg'], true),

('الفانتج', 'The Vantage', 'أبراج سكنية حديثة مع إطلالة بحرية', 'Modern residential towers with sea view', 'المنطقة الوسطى', 'Central District', '$200,000 - $500,000', 'residential', 30, 300,
 ARRAY['إطلالة بحرية', 'مسبح', 'جيم', 'مطاعم', 'تسوق'], 
 ARRAY['https://example.com/vantage1.jpg', 'https://example.com/vantage2.jpg'], true),

('شقق المستشفى', 'Hospital Apartments', 'شقق مفروشة بجانب كليفلاند كلينك', 'Furnished apartments next to Cleveland Clinic', 'بجانب المستشفى', 'Next to Hospital', '$100,000 - $200,000', 'residential', 15, 120,
 ARRAY['مفروش', 'قريب من المستشفى', 'مواقف', 'أمن'], 
 ARRAY['https://example.com/hospital1.jpg'], false),

('لوموس', 'Lumos', 'مجمع سكني عصري', 'Modern residential complex', 'المنطقة الجنوبية', 'Southern District', '$120,000 - $250,000', 'residential', 20, 150,
 ARRAY['حديقة', 'ملاعب', 'مسبح', 'جيم'], 
 ARRAY['https://example.com/lumos1.jpg'], false);

-- إدراج شقق تجريبية
INSERT INTO apartments (building_id, apartment_number, floor_number, apartment_type, area_sqm, price, bedrooms, bathrooms, view_type, features, status) 
SELECT 
  b.id,
  'A' || generate_series(101, 110),
  floor(random() * 20) + 1,
  (ARRAY['1 bedroom', '2 bedroom', '3 bedroom', 'studio'])[floor(random() * 4) + 1],
  80 + random() * 100,
  150000 + random() * 150000,
  floor(random() * 3) + 1,
  floor(random() * 2) + 1,
  (ARRAY['sea view', 'city view', 'garden view'])[floor(random() * 3) + 1],
  ARRAY['تكييف مركزي', 'مطبخ مجهز', 'بلكونة'],
  'available'
FROM buildings b; 