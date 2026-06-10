export const environment = {
  production: false,
  apiBaseUrl: 'http://ecommerce-be.runasp.net/api/Product',
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
  paymentApiUrl: 'http://ecommerce-be.runasp.net/api/Payments/create-payment-intent',
  stripePublicKey:
    'STRIPE_PUBLIC_KEY',
};
