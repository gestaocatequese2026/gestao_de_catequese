const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Basic .env.local parser
function getEnv() {
    const envPath = path.join(process.cwd(), '.env.local');
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    const env = {};
    lines.forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) env[key.trim()] = value.trim();
    });
    return env;
}

const env = getEnv();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function runTest() {
    console.log(`Testando conexão para: ${env.NEXT_PUBLIC_SUPABASE_URL}`);
    const { data, error } = await supabase.from('classes').select('*').limit(1);
    
    if (error) {
        console.error('❌ ERRO NA CONEXÃO:', error.message);
        process.exit(1);
    } else {
        console.log('✅ SUCESSO! Conexão estabelecida com o novo banco de dados.');
        console.log('Tabelas acessíveis (RLS verificado para leitura anônima).');
        process.exit(0);
    }
}

runTest();
