module.exports = {
    apps: [
      {
        name: 'securesector', // Ilova nomi
        script: 'npm', // Ishga tushirish uchun npm skripti
        args: 'start', // Next.js ilovasini ishga tushirish uchun npm start
        cwd: './', // Loyiha papkasi (agar boshqa papkada bo‘lsa, yo‘lni o‘zgartiring)
        env: {
          NODE_ENV: 'production', // Production muhiti
          PORT: 3000 // Ilova 3000-portda ishlaydi
        },
        instances: 1, // Faqat bitta instansiya
        exec_mode: 'fork', // Fork rejimida ishlaydi (cluster rejimi ixtiyoriy)
        watch: false, // Fayl o‘zgarishlarini kuzatish o‘chirilgan
        autorestart: true, // Xato yuz bersa avtomatik qayta ishga tushadi
        max_memory_restart: '1G' // Maksimal xotira chegarasi
      }
    ]
  };