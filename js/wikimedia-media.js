(function () {
  "use strict";

  const ALLOWED_HOSTS = [
    "upload.wikimedia.org",
    "thumb.wikimedia.org",
    "commons.wikimedia.org"
  ];

  function isValidWikimediaUrl(urlStr) {
    if (!urlStr || typeof urlStr !== "string") return false;
    try {
      const parsed = new URL(urlStr);
      return parsed.protocol === "https:" && ALLOWED_HOSTS.includes(parsed.hostname);
    } catch (e) {
      return false;
    }
  }

  function initArticleFigures() {
    const figures = document.querySelectorAll("figure.article-figure");
    figures.forEach(function (fig) {
      const img = fig.querySelector("img");
      const fallback = fig.querySelector(".image-fallback-box");
      if (!img) return;

      const src = img.getAttribute("src") || "";
      if (!isValidWikimediaUrl(src)) {
        fig.classList.add("is-fallback");
        if (fallback) {
          fallback.textContent = "Image could not be validated from Wikimedia Commons.";
        }
        return;
      }

      img.addEventListener("error", function () {
        fig.classList.add("is-fallback");
      });
    });
  }

  function initWikipediaContext() {
    const box = document.getElementById("wikipedia-context-box");
    if (!box) return;

    const topicTitle = box.getAttribute("data-wiki-title");
    if (!topicTitle) return;

    const cacheKey = "wiki_summary_" + topicTitle;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        renderWikiSummary(box, JSON.parse(cached));
        return;
      }
    } catch (e) {
      // sessionStorage unavailable
    }

    const endpoint =
      "https://en.wikipedia.org/api/rest_v1/page/summary/" +
      encodeURIComponent(topicTitle);

    fetch(endpoint, { headers: { Accept: "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.extract) {
          box.innerHTML =
            '<h4>Background Reference</h4><p>No Wikipedia summary was returned for this topic at the moment.</p>';
          return;
        }
        const payload = {
          title: data.title || topicTitle,
          extract: data.extract,
          pageUrl:
            (data.content_urls &&
              data.content_urls.desktop &&
              data.content_urls.desktop.page) ||
            "https://en.wikipedia.org/wiki/" + encodeURIComponent(topicTitle)
        };
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(payload));
        } catch (e) {
          // ignore storage quota errors
        }
        renderWikiSummary(box, payload);
      })
      .catch(function () {
        box.innerHTML =
          '<h4>Background Reference</h4><p>Live Wikipedia reference could not be loaded right now. You can read the source directly on <a href="https://en.wikipedia.org/wiki/' +
          encodeURIComponent(topicTitle) +
          '" target="_blank" rel="noopener">Wikipedia</a>.</p>';
      });
  }

  function renderWikiSummary(box, payload) {
    box.innerHTML = "";
    const heading = document.createElement("h4");
    heading.textContent = "Wikipedia Context: " + payload.title;

    const para = document.createElement("p");
    para.textContent = payload.extract;

    const link = document.createElement("a");
    link.href = payload.pageUrl;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Read full reference on Wikipedia (CC BY-SA 4.0)";

    box.appendChild(heading);
    box.appendChild(para);
    box.appendChild(link);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initArticleFigures();
    initWikipediaContext();
  });
})();
