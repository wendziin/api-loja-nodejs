const { exec } = require('child_process');
const path = require('path');

const migrate = () => {
  console.log('Iniciando Migrations...');
  const cmd = `npx sequelize-cli db:migrate --env production`;
  
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro nas Migrations: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr Migrations: ${stderr}`);
    }
    console.log(`Stdout Migrations: ${stdout}`);
    
    console.log('Iniciando Seeders...');
    const seedCmd = `npx sequelize-cli db:seed:all --env production`;
    exec(seedCmd, (errorSeed, stdoutSeed, stderrSeed) => {
      if (errorSeed) {
        console.error(`Erro nos Seeders: ${errorSeed.message}`);
        return;
      }
      console.log(`Stdout Seeders: ${stdoutSeed}`);
      console.log('Banco de dados pronto!');
    });
  });
};

migrate();
