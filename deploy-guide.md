# دليل رفع الموقع على منصات الاستضافة

## المشكلة الحالية
المشروع حالياً مُصمم كـ Full-Stack Application مع Express server وSupabase، لكن عند رفعه على Vercel أو GitHub Pages يعرض الكود بدلاً من الموقع.

## الحلول المتاحة

### 1. الحل الأول: رفع كـ Static Site (موصى به للبساطة)

يمكن تعديل المشروع ليعمل كـ Static Site بدون Express server ويستخدم Supabase مباشرة من المتصفح:

#### الخطوات:
1. **إزالة Express server**: حذف الـ server routes والاعتماد على Supabase client مباشرة
2. **تحديث Client code**: تعديل الكود ليستدعي Supabase مباشرة بدلاً من الـ API routes
3. **إعداد Build**: استخدام `vite build` فقط
4. **رفع المجلد**: رفع مجلد `dist/public` على Vercel/Netlify

#### ملفات الإعداد المُجهزة:
- `vercel.json` - للرفع على Vercel
- `netlify.toml` - للرفع على Netlify  
- `static.json` - للمنصات الأخرى

#### أوامر البناء:
```bash
npm run build
```

### 2. الحل الثاني: رفع كـ Full-Stack على Vercel

إذا كنت تريد الاحتفاظ بـ Express server:

#### الخطوات:
1. **تحديث vercel.json**: إعداد serverless functions
2. **تعديل Express routes**: جعلها متوافقة مع Vercel serverless
3. **إعداد environment variables**: في Vercel dashboard

### 3. الحل الثالث: استخدام منصة أخرى

منصات تدعم Full-Stack Node.js:
- **Railway**: `railway up`
- **Render**: ربط GitHub repository مباشرة
- **Heroku**: `git push heroku main`

## التوصية

لأقل تعقيد وأفضل أداء، أنصح بـ **الحل الأول** (Static Site) لأن:
- ✅ سرعة تحميل أعلى
- ✅ تكلفة أقل (مجاني على معظم المنصات)
- ✅ أمان أكثر (لا يوجد server)
- ✅ سهولة في الرفع والصيانة

## متطلبات Supabase

للعمل مع Supabase كـ Static Site:
- تأكد من وجود Supabase keys في environment variables
- فعّل Row Level Security (RLS) في Supabase
- إعداد Authentication policies إذا لزم الأمر

هل تريد المتابعة مع أي من هذه الحلول؟