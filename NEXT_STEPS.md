# الخطوات التالية | Next Steps

## 🔑 الحصول على مفاتيح API | Get API Keys

### الخطوة 1:

اذهب إلى لوحة التحكم: **https://fpdglqjayvkcirwbufnr.supabase.co**

### الخطوة 2:

انقر **Settings** → **API**

### الخطوة 3:

انسخ **anon public** key

## 📝 تحديث المفتاح | Update Key

افتح ملف `supabaseConfig.js` وضع المفتاح:

```javascript
const supabaseAnonKey = 'YOUR_ANON_KEY_FROM_DASHBOARD';
```

## 🗄️ إنشاء قاعدة البيانات | Create Database

### الخطوة 1:

اذهب إلى **SQL Editor** في لوحة تحكم Supabase

### الخطوة 2:

انسخ كامل محتوى ملف `database_setup.sql`

### الخطوة 3:

الصق المحتوى واضغط **Run**

## ✅ اختبار الاتصال | Test Connection

```javascript
import { buildingsService } from './services/database';

const test = async () => {
  const buildings = await buildingsService.getAllBuildings();
  console.log('نجح الاتصال!', buildings);
};
```

---

## 🎯 نصائح مهمة | Important Tips

1. **لا تشارك service_role key** - استخدم anon key فقط في التطبيق
2. **تأكد من تشغيل جميع استعلامات SQL** قبل الاختبار
3. **اقرأ ملف SUPABASE_GUIDE.md** للتفاصيل الكاملة

🚀 **مشروعك جاهز للانطلاق!**
