#!/usr/bin/env node
/**
 * Complete Test Data Insertion for Venera App
 * This script adds realistic test data to all tables with proper validation
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_VIBECODE_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_VIBECODE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧪 Venera App - Kapsamlı Test Verisi Ekleme\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

async function addCompleteTestData() {
  try {
    // Step 1: Create test user
    console.log('1️⃣  Test kullanıcısı oluşturuluyor...\n');
    
    const testEmail = `ayse.yilmaz.${Date.now()}@venera.app`;
    const testPassword = 'TestPassword123!';
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Ayşe Yılmaz'
        }
      }
    });

    if (authError) {
      console.log('⚠️  Kullanıcı oluşturma hatası:', authError.message);
      console.log('   Mevcut kullanıcı ile devam ediliyor...\n');
      
      // Try to sign in with existing user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'test_1763133910691@venera.app',
        password: 'TestPassword123!'
      });
      
      if (signInError) {
        console.log('❌ Oturum açma başarısız. Lütfen Supabase dashboard\'tan email onayını yapın.');
        console.log('   Dashboard: https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq/auth/users\n');
        return;
      }
      
      var userId = signInData.user.id;
      console.log(`✅ Mevcut kullanıcı ile giriş yapıldı: ${signInData.user.email}`);
      console.log(`   User ID: ${userId}\n`);
    } else {
      var userId = authData.user.id;
      console.log(`✅ Yeni kullanıcı oluşturuldu: ${testEmail}`);
      console.log(`   Password: ${testPassword}`);
      console.log(`   User ID: ${userId}\n`);
    }

    // Step 2: Add user profile
    console.log('2️⃣  Kullanıcı profili ekleniyor...\n');
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: testEmail,
        name: 'Ayşe Yılmaz'
      })
      .select();

    if (userError) {
      console.log('⚠️  Kullanıcı profili:', userError.message);
    } else {
      console.log('✅ Kullanıcı profili eklendi\n');
    }

    // Step 3: Add cycles (last 6 months with realistic dates)
    console.log('3️⃣  Cycles tablosuna gerçekçi kayıtlar ekleniyor...\n');
    console.log('   📅 Son 6 aydan döngü kayıtları:\n');
    
    const cycles = [
      {
        user_id: userId,
        start_date: '2024-11-01',
        end_date: '2024-11-05',
        cycle_length: 28,
        period_length: 5,
      },
      {
        user_id: userId,
        start_date: '2024-11-28',
        end_date: '2024-12-03',
        cycle_length: 29,
        period_length: 6,
      },
      {
        user_id: userId,
        start_date: '2024-12-27',
        end_date: '2024-12-31',
        cycle_length: 28,
        period_length: 5,
      },
      {
        user_id: userId,
        start_date: '2025-01-24',
        end_date: '2025-01-28',
        cycle_length: 28,
        period_length: 5,
      },
      {
        user_id: userId,
        start_date: '2025-02-21',
        end_date: '2025-02-26',
        cycle_length: 28,
        period_length: 6,
      },
      {
        user_id: userId,
        start_date: '2025-03-21',
        end_date: '2025-03-25',
        cycle_length: 28,
        period_length: 5,
      },
    ];

    const { data: cyclesData, error: cyclesError } = await supabase
      .from('cycles')
      .insert(cycles)
      .select();

    if (cyclesError) {
      console.log('❌ Cycles hatası:', cyclesError.message, '\n');
    } else {
      console.log(`✅ ${cyclesData.length} döngü kaydı eklendi:\n`);
      cyclesData.forEach((cycle, idx) => {
        const start = new Date(cycle.start_date);
        const end = new Date(cycle.end_date);
        const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
        console.log(`   ${idx + 1}. ${cycle.start_date} → ${cycle.end_date} (${days} gün)`);
      });
      console.log('');
    }

    // Step 4: Add diaries
    console.log('4️⃣  Diaries tablosuna günlük kayıtları ekleniyor...\n');
    
    const diaries = [
      {
        user_id: userId,
        date: '2024-11-01',
        mood: 'tired',
        symptoms: ['cramps', 'headache'],
        notes: 'İlk gün, biraz yorgun hissediyorum ama idare ediyorum.',
      },
      {
        user_id: userId,
        date: '2024-11-15',
        mood: 'energetic',
        symptoms: ['bloating'],
        notes: 'Bugün çok enerjik! Spor yaptım, harika hissediyorum.',
      },
      {
        user_id: userId,
        date: '2024-12-01',
        mood: 'happy',
        symptoms: [],
        notes: 'Aralık ayına harika bir başlangıç, ruh halim çok iyi.',
      },
      {
        user_id: userId,
        date: '2025-01-01',
        mood: 'neutral',
        symptoms: ['back pain'],
        notes: 'Yeni yıl kutlu olsun! Hafif bel ağrısı var.',
      },
      {
        user_id: userId,
        date: '2025-02-14',
        mood: 'happy',
        symptoms: [],
        notes: 'Sevgililer günü 💕 Harika bir gün geçiriyorum.',
      },
      {
        user_id: userId,
        date: '2025-03-08',
        mood: 'energetic',
        symptoms: [],
        notes: 'Kadınlar günü kutlu olsun! Kendimi harika hissediyorum.',
      },
    ];

    const { data: diariesData, error: diariesError } = await supabase
      .from('diaries')
      .insert(diaries)
      .select();

    if (diariesError) {
      console.log('❌ Diaries hatası:', diariesError.message, '\n');
    } else {
      console.log(`✅ ${diariesData.length} günlük kaydı eklendi:\n`);
      diariesData.forEach((diary, idx) => {
        console.log(`   ${idx + 1}. ${diary.date} - ${diary.mood} (${diary.symptoms.length} semptom)`);
      });
      console.log('');
    }

    // Step 5: Add user settings
    console.log('5️⃣  User settings ekleniyor...\n');
    
    const { data: settingsData, error: settingsError } = await supabase
      .from('user_settings')
      .insert({
        user_id: userId,
        cycle_length: 28,
        period_length: 5,
        language: 'tr',
      })
      .select();

    if (settingsError) {
      console.log('⚠️  Settings hatası:', settingsError.message, '\n');
    } else {
      console.log('✅ Kullanıcı ayarları eklendi\n');
      console.log(`   • Döngü uzunluğu: ${settingsData[0].cycle_length} gün`);
      console.log(`   • Periyot uzunluğu: ${settingsData[0].period_length} gün`);
      console.log(`   • Dil: ${settingsData[0].language}\n`);
    }

    // Step 6: Verify all data
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('6️⃣  Tüm tablolar kontrol ediliyor...\n');

    // Check users
    const { data: allUsers, error: usersCheckError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId);

    console.log(`📊 Users Tablosu:`);
    console.log(`   • Toplam kayıt: ${allUsers?.length || 0}`);
    if (allUsers && allUsers.length > 0) {
      console.log(`   • İsim: ${allUsers[0].name}`);
      console.log(`   • Email: ${allUsers[0].email}`);
    }
    console.log('');

    // Check cycles
    const { data: allCycles, error: cyclesCheckError } = await supabase
      .from('cycles')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    console.log(`📊 Cycles Tablosu:`);
    console.log(`   • Toplam kayıt: ${allCycles?.length || 0}`);
    if (allCycles && allCycles.length > 0) {
      const avgCycleLength = allCycles.reduce((sum, c) => sum + (c.cycle_length || 0), 0) / allCycles.length;
      const avgPeriodLength = allCycles.reduce((sum, c) => sum + (c.period_length || 0), 0) / allCycles.length;
      console.log(`   • Ortalama döngü: ${avgCycleLength.toFixed(1)} gün`);
      console.log(`   • Ortalama periyot: ${avgPeriodLength.toFixed(1)} gün`);
      console.log(`   • En son: ${allCycles[0].start_date}`);
      console.log(`   • En eski: ${allCycles[allCycles.length - 1].start_date}`);
    }
    console.log('');

    // Check diaries
    const { data: allDiaries, error: diariesCheckError } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    console.log(`📊 Diaries Tablosu:`);
    console.log(`   • Toplam kayıt: ${allDiaries?.length || 0}`);
    if (allDiaries && allDiaries.length > 0) {
      const moods = [...new Set(allDiaries.map(d => d.mood))];
      console.log(`   • Farklı ruh hali: ${moods.length} (${moods.join(', ')})`);
      console.log(`   • En son kayıt: ${allDiaries[0].date}`);
    }
    console.log('');

    // Check settings
    const { data: allSettings, error: settingsCheckError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId);

    console.log(`📊 User Settings Tablosu:`);
    console.log(`   • Toplam kayıt: ${allSettings?.length || 0}`);
    if (allSettings && allSettings.length > 0) {
      console.log(`   • Ayarlar: ${allSettings[0].cycle_length}/${allSettings[0].period_length} gün`);
      console.log(`   • Dil: ${allSettings[0].language}`);
    }
    console.log('');

    // Final summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✨ TEST VERİLERİ BAŞARIYLA EKLENDİ!\n');
    console.log('📋 Özet:');
    console.log(`   ✅ Kullanıcı: ${testEmail || 'Mevcut kullanıcı'}`);
    console.log(`   ✅ Cycles: ${allCycles?.length || 0} kayıt (Son 6 ay)`);
    console.log(`   ✅ Diaries: ${allDiaries?.length || 0} kayıt`);
    console.log(`   ✅ Settings: ${allSettings?.length || 0} kayıt`);
    console.log('');
    console.log('🌐 Verilerinizi görüntüleyin:');
    console.log('   • Dashboard: https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq/editor');
    console.log('   • Table Editor: https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq/editor');
    console.log('');
    console.log('🚀 Uygulamanızı başlatın:');
    console.log('   $ npm start');
    console.log('');
    console.log('🎉 Venera uygulamanız test verileri ile kullanıma hazır!');
    console.log('');

  } catch (error) {
    console.error('\n❌ Beklenmeyen hata:', error.message);
    console.log('\n🔧 Sorun giderme:');
    console.log('   1. .env dosyasının doğru olduğunu kontrol edin');
    console.log('   2. Supabase bağlantısını test edin');
    console.log('   3. Email onayını kontrol edin');
    console.log('   4. RLS politikalarını kontrol edin');
  }
}

addCompleteTestData().finally(() => {
  console.log('👋 Script tamamlandı.\n');
  process.exit(0);
});

