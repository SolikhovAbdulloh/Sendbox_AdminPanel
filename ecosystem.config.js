module.exports = {
    apps: [
      {
        name: 'securesector',
        script: 'npm',
        args: 'start',
        cwd: '/home/baxa/coding/front-sendbox', // Loyiha papkangizning to‘g‘ri yo‘li
        env: {
          NODE_ENV: 'production',
          PORT: 3000,
          HOST: '0.0.0.0' // Barcha interfeyslarda eshitadi
        },
        instances: 1,
        exec_mode: 'fork',
        watch: false,
        autorestart: true,
        max_memory_restart: '1G'
      }
    ]
  };