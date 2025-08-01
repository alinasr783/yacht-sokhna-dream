# 🚀 دليل رفع موقع تأجير اليخوت

## المشكلة المُحلّة ✅

تم حل مشكلة ظهور الكود JavaScript بدلاً من الموقع عند الرفع على Vercel أو منصات الاستضافة الأخرى.

## الحل المُطبق

### 1. إعدادات Vercel (`vercel.json`)
```json
{
  "version": 2,
  "buildCommand": "vite build",
  "outputDirectory": "dist/public",
  "framework": "vite",
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### 2. إعدادات Netlify (`netlify.toml`)
```toml
[build]
  publish = "dist/public"
  command = "vite build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## خطوات الرفع على Vercel 🌐

### الطريقة 1: من خلال Git (موصى بها)
1. ارفع الكود على GitHub
2. اذهب إلى [vercel.com](https://vercel.com)
3. اربط حساب GitHub
4. اختر الRepository واضغط Deploy
5. Vercel سيكتشف إعدادات المشروع تلقائياً

### الطريقة 2: من خلال Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

## خطوات الرفع على Netlify 🟢

### الطريقة 1: من خلال Git
1. ارفع على GitHub
2. اذهب إلى [netlify.com](https://netlify.com)
3. اربط Repository
4. اختر branch وأضغط Deploy

### الطريقة 2: رفع مباشر
1. قم ببناء المشروع: `npm run build`
2. ارفع مجلد `dist/public` على Netlify

## متطلبات Environment Variables 🔐

أضف هذه المتغيرات في لوحة التحكم:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### في Vercel:
1. اذهب إلى Project Settings
2. اختر Environment Variables
3. أضف المتغيرات أعلاه

### في Netlify:
1. اذهب إلى Site Settings
2. اختر Environment Variables
3. أضف المتغيرات أعلاه

## اختبار المشروع محلياً قبل الرفع 🧪

```bash
# تأكد من عمل البناء
npm run build

# اختبر النتيجة محلياً
npx serve dist/public
```

## ملاحظات مهمة ⚠️

1. **SEO محسّن**: المشروع يحتوي على SEO ديناميكي للغتين
2. **Responsive**: يعمل على جميع الشاشات
3. **PWA Ready**: يمكن تحويله لـ Progressive Web App
4. **Performance**: محسّن للسرعة مع lazy loading

## في حال مواجهة مشاكل 🔧

### مشكلة: الصفحات الفرعية تعطي 404
**الحل**: تأكد من وجود ملف `_redirects` في مجلد البناء

### مشكلة: الصور لا تظهر
**الحل**: تأكد من رفع متغيرات Supabase في لوحة التحكم

### مشكلة: البيانات لا تتحمّل
**الحل**: تأكد من إعدادات Supabase RLS policies

## الدعم والمساعدة 💬

في حال مواجهة أي مشاكل:
1. تحقق من Console في المتصفح
2. تأكد من Environment Variables
3. تحقق من إعدادات Supabase
4. راجع هذا الدليل مرة أخرى

---

✅ **النتيجة**: موقع سريع ومحسّن يعمل على جميع منصات الاستضافة