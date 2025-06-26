# دليل إعداد قاعدة بيانات Supabase | Supabase Database Setup Guide

## المحتوى | Table of Contents

1. [إنشاء حساب Supabase](#إنشاء-حساب-supabase)
2. [إعداد المشروع](#إعداد-المشروع)
3. [إنشاء الجداول](#إنشاء-الجداول)
4. [ربط التطبيق](#ربط-التطبيق)
5. [أمثلة الاستخدام](#أمثلة-الاستخدام)
6. [الأمان والصلاحيات](#الأمان-والصلاحيات)

## إنشاء حساب Supabase

### الخطوة 1: التسجيل

1. اذهب إلى [supabase.com](https://supabase.com)
2. انقر على "Start your project"
3. سجل باستخدام GitHub أو البريد الإلكتروني

### الخطوة 2: إنشاء مشروع جديد

1. انقر "New project"
2. اختر المنظمة أو أنشئ جديدة
3. أدخل تفاصيل المشروع:
   - **اسم المشروع**: `raha-real-estate`
   - **كلمة مرور قاعدة البيانات**: استخدم مولد كلمات مرور قوية
   - **المنطقة**: اختر الأقرب لك (مثل Middle East)

## إعداد المشروع

### الخطوة 3: الحصول على مفاتيح API

بعد إنشاء المشروع، اذهب إلى:
`Settings` → `API`

ستحتاج إلى:

- **Project URL**: `https://your-project.supabase.co`
- **anon public key**: للوصول العام
- **service_role key**: للعمليات الإدارية

### الخطوة 4: تحديث ملف التكوين

```javascript
// في ملف supabaseConfig.js
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-anon-key-here';
```

## إنشاء الجداول

### الخطوة 5: تشغيل استعلامات SQL

1. اذهب إلى `SQL Editor` في لوحة تحكم Supabase
2. انسخ محتوى ملف `database_setup.sql`
3. شغل الاستعلام

سيتم إنشاء الجداول التالية:

- `buildings` - المباني
- `apartments` - الشقق
- `profiles` - بيانات المستخدمين
- `bookings` - الحجوزات
- `maintenance_requests` - طلبات الصيانة
- `car_rentals` - تأجير السيارات
- `favorites` - المفضلة

## ربط التطبيق

### الخطوة 6: تثبيت المكتبات

```bash
npm install @supabase/supabase-js
```

### الخطوة 7: إعداد الاتصال

```javascript
// استيراد الخدمات في الكومبوننت
import { buildingsService, bookingsService } from './services/database';

// استخدام الخدمات
const buildings = await buildingsService.getAllBuildings();
```

## أمثلة الاستخدام

### 1. جلب المباني

```javascript
import { buildingsService } from './services/database';

const fetchBuildings = async () => {
  try {
    const buildings = await buildingsService.getAllBuildings();
    setBuildings(buildings);
  } catch (error) {
    console.error('خطأ في جلب المباني:', error);
  }
};
```

### 2. إنشاء حجز

```javascript
import { bookingsService } from './services/database';

const createBooking = async (buildingId, apartmentId) => {
  const bookingData = {
    user_id: currentUserId,
    building_id: buildingId,
    apartment_id: apartmentId,
    booking_type: 'viewing',
    booking_date: new Date().toISOString(),
    message: 'أرغب في زيارة الشقة',
  };

  try {
    const booking = await bookingsService.createBooking(bookingData);
    Alert.alert('نجح', 'تم حجز الموعد بنجاح');
  } catch (error) {
    Alert.alert('خطأ', 'فشل في الحجز');
  }
};
```

### 3. إرسال طلب صيانة

```javascript
import { maintenanceService } from './services/database';

const submitMaintenance = async () => {
  const requestData = {
    user_id: currentUserId,
    building_id: buildingId,
    apartment_id: apartmentId,
    request_type: 'plumbing',
    priority: 'high',
    title: 'تسريب مياه',
    description: 'تسريب في المطبخ',
    contact_method: 'whatsapp',
  };

  const request =
    await maintenanceService.submitMaintenanceRequest(requestData);
};
```

## الأمان والصلاحيات

### Row Level Security (RLS)

تم تفعيل RLS على جميع الجداول مع السياسات التالية:

#### سياسات المباني والشقق:

- قراءة عامة للجميع
- التعديل للمدراء فقط

#### سياسات البيانات الشخصية:

- المستخدم يرى بياناته فقط
- يمكن تعديل بياناته الخاصة

#### سياسات الحجوزات والصيانة:

- المستخدم يرى طلباته فقط
- يمكن إنشاء طلبات جديدة
- يمكن تعديل طلباته الخاصة

### مصادقة المستخدمين

```javascript
// تسجيل الدخول
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// تسجيل الخروج
await supabase.auth.signOut();

// الحصول على المستخدم الحالي
const {
  data: { user },
} = await supabase.auth.getUser();
```

## ميزات إضافية

### Real-time Updates

```javascript
// الاستماع لتغييرات المباني
const subscription = supabase
  .channel('buildings-changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'buildings' },
    payload => {
      console.log('تغيير:', payload);
      // تحديث الواجهة
    }
  )
  .subscribe();

// إلغاء الاشتراك
supabase.removeChannel(subscription);
```

### رفع الملفات (Storage)

```javascript
// إعداد Storage bucket
const { data, error } = await supabase.storage
  .from('property-images')
  .upload('building1/image1.jpg', file);

// جلب رابط الصورة
const { data } = supabase.storage
  .from('property-images')
  .getPublicUrl('building1/image1.jpg');
```

## نصائح مهمة

### 1. الأداء

- استخدم الفهارس للبحث السريع
- حدد الأعمدة المطلوبة فقط في `select()`
- استخدم `limit()` للتصفح المتدرج

### 2. الأمان

- لا تضع `service_role` key في العميل
- استخدم RLS دائماً
- تحقق من المدخلات قبل الحفظ

### 3. التطوير

- استخدم TypeScript للأمان النوعي
- اختبر الاستعلامات في SQL Editor أولاً
- راقب الاستخدام في لوحة التحكم

## دعم إضافي

### الروابط المفيدة

- [وثائق Supabase](https://supabase.com/docs)
- [مرجع JavaScript](https://supabase.com/docs/reference/javascript)
- [أمثلة React Native](https://supabase.com/docs/guides/getting-started/quickstarts/react-native)

### خدمة العملاء

- Discord: [supabase.com/discord](https://supabase.com/discord)
- GitHub: [github.com/supabase/supabase](https://github.com/supabase/supabase)

---

## ملف التكوين النهائي

بعد إكمال جميع الخطوات، يجب أن يبدو ملف `supabaseConfig.js` كالتالي:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-anon-key-here';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

🎉 **تهانينا!** تم إعداد قاعدة البيانات بنجاح وأصبح تطبيق راحة العقاري جاهزاً للاستخدام!
