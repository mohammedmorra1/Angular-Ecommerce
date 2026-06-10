const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '..', '.env');
const isProd = process.argv.includes('--production');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

function env(key) {
  const val = process.env[key];
  if (!val) {
    console.warn(`[set-env] WARNING: ${key} is not set`);
    return '';
  }
  return val;
}

const content = `export const environment = {
  production: ${isProd},
  apiBaseUrl: '${env('API_BASE_URL')}',
  supabaseUrl: '${env('SUPABASE_URL')}',
  supabaseKey: '${env('SUPABASE_KEY')}',
  HuggingFaceApiKey: '${env('HF_API_KEY')}',
  MistralApiKey: '${env('MISTRAL_API_KEY')}',
  MistralModel: '${env('MISTRAL_MODEL')}',
  MistralApiUrl: '${env('MISTRAL_API_URL')}',
  ImageModel: '${env('IMAGE_MODEL')}',
  TextModel: '${env('TEXT_MODEL')}',
  paymentApiUrl: '${env('PAYMENT_API_URL')}',
  stripePublicKey: '${env('STRIPE_PUBLIC_KEY')}',
};
`;

const outDir = path.resolve(__dirname, '..', 'src', 'environments');
fs.mkdirSync(outDir, { recursive: true });

const outFile = path.join(outDir, 'environment.ts');
fs.writeFileSync(outFile, content);
console.log(`[set-env] Generated ${outFile} (production: ${isProd})`);
