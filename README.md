# 🏛️ Politician Profile Website Template

একটি সম্পূর্ণ **Firebase + Cloudinary** চালিত নেতার ব্যক্তিগত ওয়েবসাইট টেমপ্লেট।
Admin Panel থেকে সব কিছু কন্ট্রোল করা যায়। GitHub Pages-এ সহজে হোস্ট করা যায়।

---

## 📁 File Structure

```
your-repo/
├── index.html          ← মূল ওয়েবসাইট
├── admin.html          ← Admin Panel
├── script.js           ← মূল ওয়েবসাইটের JavaScript
├── admin-script.js     ← Admin Panel JavaScript
├── style.css           ← CSS (সব design)
├── config.json         ← ⚠️ শুধু এই ফাইলটি পরিবর্তন করুন
├── firebase-rules.json ← Firebase নিরাপত্তা নিয়ম (reference)
└── README.md           ← এই ফাইল
```

---

## ⚡ Quick Setup (৫টি ধাপ)

### ধাপ ১ — Firebase Project তৈরি করুন
1. [console.firebase.google.com](https://console.firebase.google.com) যান
2. **"Add project"** → Project Name দিন → Continue
3. **Realtime Database** → Create Database → **Test mode** শুরু করুন
4. **Authentication** → Sign-in method → **Email/Password** চালু করুন
5. Authentication → Users → **Add user** → আপনার admin email ও password দিন
6. Project Settings → **"Your apps"** → Web app যোগ করুন → Config কপি করুন

### ধাপ ২ — Cloudinary Setup
1. [cloudinary.com](https://cloudinary.com) এ ফ্রি account খুলুন
2. Dashboard থেকে **Cloud Name** কপি করুন
3. Settings → Upload → **Add upload preset** → Unsigned করুন → Preset name কপি করুন

### ধাপ ৩ — config.json আপডেট করুন
```json
{
  "firebase": {
    "apiKey": "AIza...",
    "authDomain": "your-project.firebaseapp.com",
    "databaseURL": "https://your-project-default-rtdb.firebaseio.com",
    "projectId": "your-project",
    "storageBucket": "your-project.appspot.com",
    "messagingSenderId": "123456789",
    "appId": "1:123456789:web:abc123"
  },
  "cloudinary": {
    "cloudName": "your-cloud-name",
    "uploadPreset": "your-upload-preset"
  },
  "admin": {
    "email": "admin@yourdomain.com",
    "password": "yourpassword123"
  }
}
```

### ধাপ ৪ — Firebase Security Rules সেট করুন
Firebase Console → Realtime Database → Rules → নিচের rules paste করুন:
```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}
```
**Publish** করুন।

### ধাপ ৫ — GitHub Pages Deploy করুন
1. GitHub-এ নতুন repository তৈরি করুন
2. সব files upload করুন
3. Settings → Pages → Source: **main branch** → Save
4. আপনার সাইট live: `https://yourusername.github.io/your-repo/`
5. Admin panel: `https://yourusername.github.io/your-repo/admin.html`

---

## 🎛️ Admin Panel — কী কী Control করা যায়

| Section | কী পরিবর্তন করা যায় |
|---------|----------------------|
| প্রোফাইল | নাম, পদবী, সংগঠন, স্লোগান, ছবি, favicon |
| পরিসংখ্যান | অভিজ্ঞতা (বছর), এলাকা, কর্মসূচি, অনুসারী |
| পরিচয়/বায়ো | জীবনী, ছবি, জন্ম তারিখ, শিক্ষা, সোশ্যাল লিংক |
| পোস্ট | যোগ/সম্পাদনা/মুছুন, ক্যাটাগরি ফিল্টার, সক্রিয়/নিষ্ক্রিয় |
| গ্যালারি | একাধিক ছবি আপলোড, ক্যাটাগরি |
| টিকার | স্ক্রোলিং নোটিশ যোগ/মুছুন |
| বার্তা | দর্শকদের পাঠানো বার্তা দেখুন |
| যোগাযোগ | ঠিকানা, ফোন, WhatsApp, Google Maps |

---

## 🐛 Fixed Bugs (v2.0)

- ✅ Counter animation race condition — Firebase data আসার আগে counter চলত
- ✅ Footer social links — admin থেকে update করলে website-এ দেখাত না
- ✅ Gallery URL bug — `dataset` এর বদলে closure variable ব্যবহার করা হয়েছে
- ✅ Hardcoded values সরানো হয়েছে — পুরোপুরি config/Firebase-driven
- ✅ Meta tags — Firebase থেকে dynamic update হয়

---

## 🔧 Customization

**রং পরিবর্তন:** `style.css` এর `:root` section-এ:
```css
:root {
    --primary: #006633;    /* সবুজ → আপনার দলের রং দিন */
    --gold: #c9a227;       /* সোনালি accent */
}
```

**নতুন News Category যোগ করতে:**
`index.html` এর `#newsFilters` এবং `admin.html` এর `#newsCategory` select-এ option যোগ করুন।

---

## 📞 Support
Developed by **Csm Mohasin Alam**
