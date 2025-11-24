# 🧪 Test Nasıl Yapılır?

## Hızlı Test Adımları

### 1️⃣ Metro Bundler'ı Yeniden Yükleyin

Terminal'de `r` tuşuna basın veya Expo Go'da uygulamayı yeniden başlatın.

### 2️⃣ Console Loglarına Bakın

Uygulama başlarken şu mesajları görmelisiniz:

```
[index] Project ID is: vibecode-project
[supabase] client initialized: https://tfpqemhikqavgfmvnfrq.supabase.co
[auth] ✅ Signed in with test user: [user-id]
```

### 3️⃣ Yeni Cycle Ekleyin

1. **Calendar** sekmesine gidin
2. Bugünün tarihine tıklayın
3. **"Add Period Start"** butonuna basın
4. Console'da şu mesajı görmelisiniz:
   ```
   ✅ Cycle synced to Supabase: [cycle-id]
   ```

### 4️⃣ Supabase'de Kontrol Edin

1. https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq adresine gidin
2. Sol menüden **"Table Editor"** seçin
3. **"cycles"** tablosunu açın
4. **Az önce eklediğiniz cycle'ı görmelisiniz!** 🎉

### 5️⃣ Diary Kaydı Ekleyin

1. **Daily** sekmesine gidin
2. Bir mood seçin (örn: Happy)
3. Not ekleyin
4. Kaydedin
5. Console'da şu mesajı görmelisiniz:
   ```
   ✅ Diary entry synced to Supabase: [diary-id]
   ```

### 6️⃣ Supabase'de Diary'yi Kontrol Edin

1. Supabase Dashboard'a dönün
2. **"diaries"** tablosunu açın
3. **Az önce eklediğiniz diary kaydını görmelisiniz!** 🎉

---

## 🔍 Detaylı Kontrol

### Terminal'den Kontrol

```bash
# Tabloları kontrol et
node check-tables.js

# Test verisi ekle
node add-complete-test-data.js
```

### Supabase SQL Editor'dan Kontrol

Dashboard'da SQL Editor'ı açın ve şu sorguları çalıştırın:

```sql
-- Son eklenen cycle'ları göster
SELECT * FROM cycles 
ORDER BY created_at DESC 
LIMIT 5;

-- Son eklenen diary kayıtlarını göster
SELECT * FROM diaries 
ORDER BY created_at DESC 
LIMIT 5;

-- Kullanıcıları göster
SELECT * FROM users;
```

---

## ✅ Başarı Kriterleri

Aşağıdakilerin hepsi çalışıyorsa entegrasyon başarılı:

- ✅ Uygulama açılırken "Project ID: vibecode-project" görünüyor
- ✅ Authentication başarılı oluyor
- ✅ Yeni cycle eklediğimde Supabase'de görünüyor
- ✅ Yeni diary eklediğimde Supabase'de görünüyor
- ✅ Console'da sync mesajları görünüyor
- ✅ Hata mesajı yok

---

## 🐛 Sorun Çözümleri

### "undefined" hatası
```bash
# Metro'yu yeniden başlat
pkill -f "react-native"
npx expo start --clear
```

### Supabase'de veri görünmüyor
- Internet bağlantınızı kontrol edin
- Console'da hata mesajı var mı bakın
- Supabase Dashboard > Logs'a bakın

### Authentication hatası
```bash
# Test kullanıcı bilgileri
Email: test@venera.app
Password: testpassword123
```

---

**Her şey hazır! Test etmeye başlayabilirsiniz! 🚀**

