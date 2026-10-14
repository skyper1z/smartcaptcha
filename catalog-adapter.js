// Canonical catalog: the single source of approved prices shared with the
// admin portal and the WhatsApp assistant. The site renders from it when it
// is available and falls back to the embedded defaults otherwise.
(function () {
  let pending = null;

  // Must match the code scheme used by the catalog import
  // (smartcaptcha-ai/scripts/extract-website-catalog.mjs).
  function slug(value) {
    return String(value)
      .normalize('NFKD')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Resolves to approved catalog rows, or null when the site should keep
  // using the legacy packages table: the catalog is not deployed here yet,
  // or an admin has not yet switched the website source to 'catalog'
  // (catalog_settings.website_source), e.g. while prices are being reviewed.
  function load() {
    if (!pending) {
      pending = (async () => {
        if (!window.supabaseClient) return null;
        const { data: settings, error: settingsError } = await window.supabaseClient
          .from('catalog_settings')
          .select('website_source')
          .maybeSingle();
        if (settingsError || !settings || settings.website_source !== 'catalog') return null;
        const { data, error } = await window.supabaseClient
          .from('catalog_public')
          .select('code, item_type, title, category, tone, tab, media_path, is_featured, display_order, display_price, pricing_model, inclusions, tags, location, website_group, display')
          .order('display_order', { ascending: true });
        if (error || !Array.isArray(data) || data.length === 0) return null;
        return data;
      })().catch(() => null);
    }
    return pending;
  }

  window.SmartcapCatalog = Object.freeze({ load, slug });
})();
