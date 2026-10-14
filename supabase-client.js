// Environment selection. Local development (localhost / 127.0.0.1) uses the
// isolated development Supabase project; every other host (the live site)
// uses production exactly as before. Only browser-safe keys belong here.
(function () {
  const ENVIRONMENTS = {
    production: {
      supabaseUrl: 'https://kcatufanwxhcoagyeskf.supabase.co',
      supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjYXR1ZmFud3hoY29hZ3llc2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NDUwNDcsImV4cCI6MjA5NjQyMTA0N30.l9tXgvvRt6AKQg3lmrk5WUNCEHPr9xu-CisV0uk-Jis'
    },
    development: {
      supabaseUrl: 'https://ayfardmgbgbiaqjtizap.supabase.co',
      supabaseKey: 'sb_publishable_oBiBZi7JP1Cp7kr3xeXX0w_5iMOn-jl'
    }
  };
  const host = window.location.hostname;
  const name = host === 'localhost' || host === '127.0.0.1' ? 'development' : 'production';
  const config = ENVIRONMENTS[name];
  window.SMARTCAP_ENV = Object.freeze({ name, ...config });
  window.supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseKey);
})();
