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

  // Resolves to approved catalog rows, or null if the catalog is not
  // available (e.g. not yet deployed to this environment).
  function load() {
    if (!pending) {
      pending = (async () => {
        if (!window.supabaseClient) return null;
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
