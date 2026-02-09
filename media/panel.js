(function () {
  var titleEl = document.getElementById('title');
  var contentEl = document.getElementById('content');
  var searchEl = document.getElementById('search');

  function esc(t) {
    return t
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Golden angle produces maximally distinct hues
  function borderColor(i) {
    var hue = (i * 137.508) % 360;
    return 'hsl(' + hue + ', 70%, 55%)';
  }

  function render(data) {
    titleEl.textContent = data.fileName;
    var groups = data.groups;

    if (!groups.length) {
      contentEl.innerHTML = '<p class="empty">No console messages for this file.</p>';
      searchEl.parentElement.style.display = 'none';
      return;
    }

    searchEl.parentElement.style.display = '';
    var html = '';
    for (var i = 0; i < groups.length; i++) {
      var g = groups[i];
      html += '<div class="line-group" style="border-left-color:' + borderColor(i) + '">';
      html += '<div class="line-header">';
      html += '<span class="line-number">Line ' + esc(g.line) + '</span> ';
      html +=
        '<span class="badge" style="background:' +
        esc(g.typeColor) +
        '">' +
        esc(g.label) +
        '</span> ';
      html += '<span class="counter">&times;' + g.counter + '</span>';
      html += '</div>';
      for (var j = 0; j < g.messages.length; j++) {
        var m = g.messages[j];
        html += '<div class="message">';
        html += '<div class="timestamp">' + esc(m.time) + '</div>';
        html += '<pre><code>' + esc(m.body) + '</code></pre>';
        html += '</div>';
      }
      html += '</div>';
    }
    html += '<p class="no-results" id="noResults">No matching messages.</p>';
    contentEl.innerHTML = html;
    applyFilter();
  }

  function applyFilter() {
    var term = searchEl.value.toLowerCase();
    var groups = contentEl.querySelectorAll('.line-group');
    var noResults = document.getElementById('noResults');
    var visible = 0;
    for (var i = 0; i < groups.length; i++) {
      var match = !term || groups[i].textContent.toLowerCase().indexOf(term) !== -1;
      groups[i].classList.toggle('hidden', !match);
      if (match) visible++;
    }
    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  searchEl.addEventListener('input', applyFilter);

  // Batch rapid updates into a single render frame
  var pendingFrame = null;
  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'update') {
      if (pendingFrame) cancelAnimationFrame(pendingFrame);
      pendingFrame = requestAnimationFrame(function () {
        pendingFrame = null;
        render(e.data);
      });
    }
  });

  // Initial render from data embedded by the extension
  render(PANEL_DATA);
})();
