export const environment = {
  production: false,
  apiBaseUrl: 'https://fakestoreapiserver.reactbd.org/api/products',
  supabaseUrl: 'https://xckhkeelnhlalcckuwkn.supabase.co',
  supabaseKey:
    'SUPABASE_ANON_KEY',
  HuggingFaceApiKey: 'HF_API_KEY',
  MistralApiKey: 'MISTRAL_API_KEY',
  MistralModel: 'mistral-large-latest',
  MistralApiUrl: 'https://api.mistral.ai/v1/chat/completions',
  // MistralApiKey: 'MISTRAL_API_KEY_2',
  ImageModel: 'mistral-medium-3.5',
  TextModel: 'mistral-large-latest',
  paymentApiUrl: 'http://localhost:5000/api/payments',
  stripePublicKey:
    'STRIPE_PUBLIC_KEY',
};
