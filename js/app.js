/* HM Pools architect's guide: behaviour.
   Plain JavaScript, no build step. Content comes from js/data.js (window.HM). */
(function (HM) {
  "use strict";

  /* ---------- State ---------- */

var state = {
  picks: {},
  browsing: {},
  advice: {},
  multiPicks: {},
  otherText: {},
  dims: {},
  files: [],
  notes: ""
};

  HM.sections.forEach(function (s) {
  if (s.choices) {
    state.picks[s.id] = null;

    if (s.multiple) {
      state.multiPicks[s.id] = [];
    }
  }
});

  /* ---------- Helpers ---------- */

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function sectionById(id) {
    return HM.sections.filter(function (s) { return s.id === id; })[0];
  }

  function currentChoice(section) {
    if (!section || !section.choices) return null;
    if (section.kind === 'info') return section.choices[0];
    if (state.advice[section.id]) return null;
    var id = state.picks[section.id];
    if (section.multiple) {
      var selected = state.multiPicks[section.id] || [];
      id = selected.indexOf(state.browsing[section.id]) !== -1 ? state.browsing[section.id] : selected[selected.length - 1];
    }
    return section.choices.filter(function(c) { return c.id === id; })[0] || null;
  }

  function dimSummary() {
    return state.dims.l && state.dims.w ? state.dims.l + " \u00d7 " + state.dims.w + " m" : "Not set";
  }

  function fileSummary() {
    var n = state.files.length;
    return n ? n + (n === 1 ? " file" : " files") : "Optional";
  }

  function headerValue(section) {
  if (state.advice[section.id]) return "Needs advice";
  if (section.kind === "dims") return dimSummary();

  if (section.kind === "upload") {
    return state.files.length ? fileSummary() : "Not set";
  }

  if (section.kind === "info") {
    return "Information";
  }

  if (section.multiple) {
    var selected = state.multiPicks[section.id] || [];

    if (!selected.length) return "Not set";

    if (selected.length === 1) {
      var choice = section.choices.filter(function (c) {
        return c.id === selected[0];
      })[0];

      return choice ? choice.label : "1 selected";
    }

    return selected.length + " selected";
  }

  if (!state.picks[section.id]) {
    return "Not set";
  }

  return section.choices.filter(function (c) { return c.id === state.picks[section.id]; })[0].label;
}

  function specList(specs) {
    return '<h4 class="acc__subhead">What it means for your design</h4><dl class="specs">' +
      specs.map(function (r) {
        return '<div class="specs__row"><dt>' + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>";
      }).join("") + "</dl>";
  }

  /* ---------- Section bodies ---------- */

  function actionButton(action, section, label, pressed, choice) {
    return '<button class="chip' + (action === 'advice' ? ' chip--advice' : '') + '" type="button" data-action="' + action + '" data-section="' + section +
      '" data-choice="' + (choice || '') + '" data-focus-key="' + action + '-' + section + '-' + (choice || '') +
      '" aria-pressed="' + Boolean(pressed) + '">' + (action === 'advice' ? '<span class="chip__icon" aria-hidden="true">?</span>' : '') + esc(label) + '</button>';
  }

  function bodyChoice(section) {
    var cur = currentChoice(section);
    var selected = state.multiPicks[section.id] || [];
    if (section.kind === 'info') {
      return '<p class="acc__text">' + esc(cur.blurb) + '</p>' +
        (cur.specs && cur.specs.length ? specList(cur.specs) : '') +
        '<div class="project-answer"><h4 class="acc__subhead">Would you like help?</h4><div class="choices">' +
        actionButton('advice', section.id, 'I need technical space advice', state.advice[section.id]) + '</div></div>';
    }
    var chips = '<p class="acc__subhead">' + (section.multiple ? 'What interests you?' : 'What seems right for this project?') + '</p>' +
      '<p class="preference-hint">Select what you know. You can always change your answers later.</p>' +
      '<div class="choices choices--answers">' + section.choices.map(function(c) {
        return actionButton('pick', section.id, c.label,
          section.multiple ? selected.indexOf(c.id) !== -1 : state.picks[section.id] === c.id, c.id);
      }).join('') + actionButton('advice', section.id, 'Not decided - I need advice', state.advice[section.id]) + '</div>';
    if (section.multiple && selected.indexOf('other') !== -1) {
      chips += '<div class="field"><label for="other-features">Other requirement</label><input id="other-features" data-other="features" value="' + esc(state.otherText.features || '') + '"></div>';
    }
    if (!cur) return chips;
    return chips + '<div class="choice-detail" aria-live="polite">' +
      (section.multiple ? '<p class="choice-detail__label">Showing details for ' + esc(cur.label) + '</p>' : '') +
      contextualMedia(section) + '<p class="acc__text">' + esc(cur.blurb) + '</p>' +
      (cur.specs && cur.specs.length ? specList(cur.specs) : '') + '</div>';
  }

  function bodyDims(section) {
    var fields = section.fields.map(function (f) {
      var id = "dim-" + f[0];
      return '<div class="field"><label for="' + id + '">' + esc(f[1]) + "</label>" +
        '<input id="' + id + '" type="number" inputmode="decimal" min="0" step="0.1" data-dim="' + f[0] +
        '" placeholder="' + esc(f[2]) + '" value="' + esc(state.dims[f[0]] || "") + '"></div>';
    }).join("");
    return '<p class="acc__text">' + esc(section.blurb) + '</p>' + specList(section.specs) + '<h4 class="acc__subhead">Your approximate dimensions</h4><div class="fields">' + fields + '</div>';
  }

  function bodyUpload(section) {
    var files = state.files.map(function (f) {
      return '<li class="file"><span class="file__name">' + esc(f.name) + "</span>" +
        '<button class="file__remove" type="button" data-action="remove-file" data-file="' + f.id +
        '" aria-label="Remove ' + esc(f.name) + '" title="Remove file">' +
        '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12"/></svg></button></li>';
    }).join("");
    return '<p class="acc__text">' + esc(section.blurb) + "</p>" +
      '<label class="dropzone">' +
      '<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><path d="M11 15V3M6 8l5-5 5 5M2 15v5h18v-5"/></svg>' +
      '<span class="dropzone__title">Drop files or click to upload</span>' +
      '<span class="dropzone__hint">' + esc(section.formats) + "</span>" +
      '<input class="dropzone__input" type="file" multiple accept="' + esc(section.accept) + '" data-action="upload">' +
      "</label>" +
      (files ? '<ul class="files">' + files + "</ul>" : "") +
      '<h4 class="acc__subhead">Helpful to include</h4><ul class="helpful">' +
      section.helpful.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul>" +
      '<div class="field"><label for="notes">Notes for HM Pools</label>' +
      '<textarea id="notes" rows="3" data-notes placeholder="Timeline, budget range, client wishes\u2026">' + esc(state.notes) + "</textarea></div>";
  }

  function sectionBody(section) {
    var body = section.kind === 'dims' ? bodyDims(section) : section.kind === 'upload' ? bodyUpload(section) : bodyChoice(section);
    var index = HM.sections.indexOf(section);
    var next = HM.sections[index + 1];
    var intro = section.intro ? '<div class="key-reminder"><strong>Before you design</strong><p>' + esc(section.intro) + '</p></div>' : '';
    if (section.kind === 'dims') body += '<div class="choices">' + actionButton('advice', 'dims', 'Dimensions not decided - I need advice', state.advice.dims) + '</div>';
    return intro + body + '<div class="section-next">' + (next ?
      '<button class="section-next__link" type="button" data-action="next" data-section="' + next.id + '">Next: ' + esc(next.title) + ' <span aria-hidden="true">↘</span></button>' :
      '<button class="btn btn--solid" type="button" data-action="review">Request a call <span aria-hidden="true">↗</span></button>') + '</div>';
  }

  /* ---------- Rendering ---------- */

  var groups = [
    {start: 0, end: 4, title: 'Essential project information', text: 'These early details help HM Pools prepare for a conversation. Share what you know, or ask for advice.'},
    {start: 4, end: 5, title: 'Have a project in mind?', text: 'Already have drawings or sketches? Share them to help HM Pools understand your project. You can also continue exploring without uploading anything.'},
    {start: 5, end: 11, title: 'Plan the supporting details', text: 'Discover more possibilities for your pool, from technical solutions to finishing details. Explore what interests you and leave the rest for later.'}
  ];
  var activeSection = null;
  function contextualMedia(section) {
    var choice = currentChoice(section);
    if (!choice || section.noPhoto || section.kind === 'info' || choice.noPhoto) return '';
    var result = '';
    if (section.id === 'type') {
      result += '<figure class="drawing"><img class="drawing__img" data-type="' + choice.id + '" src="img/drawings/' + choice.id + '.svg" alt="Schematic section of a ' + esc(choice.label) + ' pool" width="880" height="420">' +
        '<button class="drawing__expand" type="button" data-action="expand" aria-label="Enlarge section drawing" title="Enlarge drawing"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg></button><figcaption>Schematic section, not to scale.</figcaption></figure>' +
        '<dl class="stats">' + HM.stats[choice.id].map(function(r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl>';
    }
    var ref = HM.refByImg[choice.img];
    if (ref) result += '<figure class="context-photo"><img src="' + esc(choice.img) + '" alt="' + esc(ref.name) + '" loading="lazy" width="800" height="450"><figcaption><span>Built example: ' + esc(ref.name) + '</span><a href="' + esc(ref.url) + '" target="_blank" rel="noopener">View project</a></figcaption></figure>';
    return result;
  }
  function renderSections() {
    $('#sections').innerHTML = groups.map(function(g, groupIndex) {
      return '<section class="content-group" aria-labelledby="group-' + groupIndex + '"><header class="section-group"><h2 id="group-' + groupIndex + '">' + esc(g.title) + '</h2><p>' + esc(g.text) + '</p></header>' +
        HM.sections.slice(g.start,g.end).map(function(section,index) {
          return '<section class="guide-section" id="section-' + section.id + '" data-id="' + section.id + '" aria-labelledby="heading-' + section.id + '"><header class="section-heading"><span class="section-number">' + String(g.start+index+1).padStart(2,'0') + '</span><h3 id="heading-' + section.id + '" tabindex="-1">' + esc(section.title) + '</h3></header><div id="body-' + section.id + '">' + sectionBody(section) + '</div></section>';
        }).join('') + '</section>';
    }).join('');
    $('#project-nav').innerHTML = groups.map(function(g) {
      return '<div class="nav-group"><h3>' + esc(g.title) + '</h3>' + HM.sections.slice(g.start,g.end).map(function(section) {
        return '<a href="#section-' + section.id + '" data-action="next" data-section="' + section.id + '"><span>' + esc(section.title) + '</span><small data-status="' + section.id + '"></small></a>';
      }).join('') + '</div>';
    }).join('');
    $('#mobile-section').innerHTML = groups.map(function(g) { return '<optgroup label="' + esc(g.title) + '">' + HM.sections.slice(g.start,g.end).map(function(section) { return '<option value="' + section.id + '">' + esc(section.title) + '</option>'; }).join('') + '</optgroup>'; }).join('');
  }
  function updateSection(id) {
    var focusKey = document.activeElement && document.activeElement.dataset.focusKey;
    $('#body-' + id).innerHTML = sectionBody(sectionById(id));
    if (focusKey) {
      var next = $('[data-focus-key="' + focusKey + '"]');
      if (next) next.focus({preventScroll:true});
    }
    renderPlan();
    scheduleActive();
  }
  function sectionStatus(section) {
    if (state.advice[section.id]) return ['advice','Needs advice'];
    if (section.kind === 'info') return ['empty','Not started'];
    if (section.kind === 'dims') {
      if (isComplete(section.id)) return ['provided','Information provided'];
      return Object.keys(state.dims).some(function(k) { return state.dims[k] !== ''; }) ? ['progress','In progress'] : ['empty','Not started'];
    }
    var provided = section.kind === 'upload' ? state.files.length || state.notes.trim() : section.multiple ? state.multiPicks[section.id].length : state.picks[section.id];
    return provided ? ['provided','Information provided'] : ['empty','Not started'];
  }
  var activeFrame = null;
  function scheduleActive() {
    if (activeFrame !== null) return;
    activeFrame = requestAnimationFrame(function() {
      activeFrame = null;
      var threshold = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anchor-offset')) + 40;
      var current = null;
      $$('.guide-section').forEach(function(section) {
        var rect = section.getBoundingClientRect();
        if (rect.top <= threshold && rect.bottom > 0) current = section.dataset.id;
      });
      if (!current) {
        var first = $$('.guide-section').find(function(section) { var r=section.getBoundingClientRect(); return r.top > 0 && r.top < innerHeight * .75; });
        if (first) current=first.dataset.id;
      }
      if (current === activeSection) return;
      activeSection = current;
      $$('#project-nav a').forEach(function(a) { if (a.dataset.section === current) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current'); });
      if(current) $('#mobile-section').value=current;
    });
  }
  function updateHeaderValue() { renderPlan(); }
  function isComplete(id) {
    if (state.advice[id]) return true;
    return id === 'dims' ? Number(state.dims.l) > 0 && Number(state.dims.w) > 0 : Boolean(state.picks[id]);
  }
  function essentialsComplete() { return ['use', 'install', 'type', 'dims'].every(isComplete); }
  function renderPlan() {
    var completed = ['use','install','type','dims'].filter(isComplete).length;
    $('#plan-count').textContent = completed + '/4 basic questions answered';
    $('#mobile-progress').textContent = completed + '/4';
    $('#project-ready').textContent = completed === 4 ? 'Your project brief is ready to discuss.' : "Let's discuss what you know so far.";
    HM.sections.forEach(function(section) {
      var status=sectionStatus(section);
      var el=$('[data-status="' + section.id + '"]');
      if(el) { el.textContent=status[1]; el.dataset.state=status[0]; }
      var option=$('#mobile-section option[value="' + section.id + '"]');
      if(option) option.textContent=section.title + ' — ' + status[1];
    });
  }
  function renderRefs() {
    $('#refs').innerHTML = HM.refs.map(function(r) { return '<a class="ref" href="' + esc(r.url) + '" target="_blank" rel="noopener"><img src="' + esc(r.img) + '" alt="" loading="lazy" width="600" height="400"><span>' + esc(r.tag) + '</span><strong>' + esc(r.name) + '</strong></a>'; }).join('');
  }
  function render() { renderSections(); renderPlan(); scheduleActive(); }
  function pickChoice(id,choice) {
    state.advice[id]=false;
    if(sectionById(id).multiple) {
      var values=state.multiPicks[id], index=values.indexOf(choice);
      if(index<0) { values.push(choice); state.browsing[id]=choice; }
      else { values.splice(index,1); state.browsing[id]=values[values.length-1] || null; }
    } else state.picks[id]=state.picks[id]===choice ? null : choice;
    updateSection(id);
  }
  function goToSection(id) {
    var heading=$('#heading-' + id);
    heading.focus({preventScroll:true});
    $('#section-' + id).scrollIntoView({block:'start',behavior:scrollBehavior()});
  }
  function addFiles(input) {
    Array.prototype.forEach.call(input.files || [],function(file,i) { state.files.push({id:Date.now().toString(36)+i+Math.random().toString(36).slice(2,6),name:file.name,file:file}); });
    input.value='';
    updateSection('upload');
  }
  function removeFile(id) {
    state.files=state.files.filter(function(file) {return file.id!==id;});
    updateSection('upload');
    $('.dropzone__input').focus({preventScroll:true});
  }
  /* ---------- Consultation dialog ---------- */

  var dialog = $("#consult");
  var form = $("#consult-form");
  var consultOpener = null;

  function planSummary() {
    var rows = HM.sections.map(function(s) {
      var value = headerValue(s);
      if (s.multiple && !state.advice[s.id]) value = (state.multiPicks[s.id] || []).map(function(id) {
        return s.choices.filter(function(c) { return c.id === id; })[0].label + (id === 'other' && state.otherText[s.id] ? ': ' + state.otherText[s.id] : '');
      }).join(', ') || 'Not provided';
      if (s.kind === 'upload') value = state.files.map(function(f) { return f.name; }).join(', ') || 'No attachments';
      if (s.kind === 'dims') {
        var measurements = s.fields.filter(function(f) { return Number(state.dims[f[0]]) > 0; }).map(function(f) { return f[1] + ': ' + state.dims[f[0]]; }).join(', ');
        value = (state.advice.dims ? 'Needs advice' : '') + (measurements ? (state.advice.dims ? ' - ' : '') + measurements : state.advice.dims ? '' : 'Not provided');
      }
      return '<div><dt>' + esc(s.title) + '</dt><dd>' + esc(value) + '</dd><button type="button" class="summary-edit" data-action="edit" data-section="' + s.id + '">Edit<span class="sr-only"> ' + esc(s.title) + '</span></button></div>';
    });
    rows.push('<div><dt>Project notes</dt><dd>' + esc(state.notes || 'None added') + '</dd></div>');
    return rows.join('');
  }
  function showReview() {
    $('#review-step').hidden = false;
    $('#contact-step').hidden = true;
    $('#consult-title').textContent = 'A quick project check';
    $('#consult-lead').textContent = 'Review what you have shared, then tell us how to reach you.';
    var missing = ['use','install','type','dims'].filter(function(id) { return !isComplete(id); });
    $('#review-missing').textContent = missing.length ? 'Tip: A few basic project details help us prepare for our first conversation.' : '';
    $('#review-missing').hidden = !missing.length;
    $('#review-summary-count').textContent = HM.sections.filter(function(section) { return state.advice[section.id] || sectionStatus(section)[0] === 'provided'; }).length + ' shared';
  }
  function openConsult() {
    consultOpener = document.activeElement;
    $('#consult-plan').innerHTML = planSummary();
    var msg = $('#c-message');
    if (!msg.value && state.notes) msg.value = state.notes;
    form.hidden = false;
    $('#consult-done').hidden = true;
    showReview();
    dialog.showModal();
    $('#consult-title').focus();
  }

  function closeConsult() {
    dialog.close();
    if (consultOpener && consultOpener.isConnected) consultOpener.focus({preventScroll:true});
  }

  var directDialog = $('#direct-contact');
  var directForm = $('#direct-contact-form');
  var directOpener = null;
  function openDirectContact() {
    directOpener = document.activeElement;
    directDialog.showModal();
    $('#direct-contact-title').focus();
  }
  function closeDirectContact() {
    directDialog.close();
    if (directOpener && directOpener.isConnected) directOpener.focus({preventScroll:true});
  }
  directForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var required = [
      ['direct-name', function(v) { return v.trim().length > 0; }],
      ['direct-email', function(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }],
      ['direct-message', function(v) { return v.trim().length > 0; }]
    ];
    var firstBad = null;
    required.forEach(function(entry) {
      var input = $('#' + entry[0]);
      var valid = entry[1](input.value);
      input.setAttribute('aria-invalid', String(!valid));
      input.setAttribute('aria-describedby', entry[0] + '-error');
      $('#' + entry[0] + '-error').hidden = valid;
      if (!valid && !firstBad) firstBad = input;
    });
    if (firstBad) { firstBad.focus(); return; }
    var lines = [
      'Name: ' + $('#direct-name').value.trim(),
      'Email: ' + $('#direct-email').value.trim(),
      'Phone: ' + ($('#direct-phone').value.trim() || 'Not provided'),
      'Company: ' + ($('#direct-company').value.trim() || 'Not provided'),
      '',
      $('#direct-message').value.trim()
    ];
    var link = $('#direct-email-link');
    link.href = 'mailto:info@hmpools.fi?subject=' + encodeURIComponent('HM Pools contact enquiry') + '&body=' + encodeURIComponent(lines.join('\n'));
    link.click();
  });
  directForm.addEventListener('input', function(e) {
    if (e.target.getAttribute('aria-invalid') === 'true') {
      e.target.removeAttribute('aria-invalid');
      var error = $('#' + e.target.id + '-error');
      if (error) error.hidden = true;
    }
  });
  directDialog.addEventListener('click', function(e) { if (e.target === directDialog) closeDirectContact(); });
  $('[data-direct-close]').addEventListener('click', closeDirectContact);

  var CHECKS = [
    ["#c-name", function (v) { return v.trim().length > 0; }],
    ["#c-phone", function (v) { return v.replace(/[^0-9]/g, "").length >= 6; }],
    ["#c-email", function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }]
  ];

  function validate() {
    var firstBad = null;
    CHECKS.forEach(function (c) {
      var input = $(c[0]);
      var ok = c[1](input.value);
      input.setAttribute("aria-invalid", String(!ok));
      input.setAttribute("aria-describedby", c[0].slice(1) + "-err");
      $(c[0] + "-err").hidden = ok;
      if (!ok && !firstBad) firstBad = input;
    });
    var consent = $("#c-consent");
    $("#c-consent-err").hidden = consent.checked;
    if (!consent.checked && !firstBad) firstBad = consent;
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;
    // Prototype: nothing is sent anywhere.
    form.hidden = true;
    $("#consult-done").hidden = false;
    $("#consult-done .modal__title").focus();
    form.reset();
    $$("[aria-invalid]", form).forEach(function (el) { el.removeAttribute("aria-invalid"); });
  });

  // Re-check a field once the user fixes it.
  form.addEventListener("input", function (e) {
    if (e.target.getAttribute("aria-invalid") === "true") validate();
  });

  // Click on the dimmed backdrop closes the dialog.
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) closeConsult();
  });

  function scrollBehavior() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
  }
  var guideScrollFrame = null;
  function cancelGuideScroll() {
    if (guideScrollFrame !== null) cancelAnimationFrame(guideScrollFrame);
    guideScrollFrame = null;
  }
  ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function(event) {
    window.addEventListener(event, cancelGuideScroll, {passive: true});
  });
  function scrollToGuide(animateEntry) {
    cancelGuideScroll();
    var start = window.scrollY;
    var target = $('#guide');
    var end = target.getBoundingClientRect().top + start - (parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
    end = Math.max(0, Math.min(end, document.documentElement.scrollHeight - window.innerHeight));
    if (!animateEntry && scrollBehavior() === 'instant') { window.scrollTo({top: end, behavior: 'instant'}); return; }
    var started = null;
    function step(time) {
      if (started === null) started = time;
      var progress = Math.min((time - started) / 1200, 1);
      var eased = (1 - Math.cos(Math.PI * progress)) / 2;
      window.scrollTo({top: start + (end - start) * eased, behavior: 'instant'});
      guideScrollFrame = progress < 1 ? requestAnimationFrame(step) : null;
    }
    guideScrollFrame = requestAnimationFrame(step);
  }
  function showLanding() {
    cancelGuideScroll();
    window.scrollTo({top: 0, behavior: scrollBehavior()});
    $('.hero__cta').focus({preventScroll: true});
  }
  function enterGuide(animateEntry) {
    scrollToGuide(animateEntry);
    $('#guide').focus({preventScroll: true});
  }
  if (location.hash === '#guide') enterGuide();
  /* ---------- Events ---------- */
  document.addEventListener('click',function(e) {
    if(e.target.closest('[data-home], [data-architect]')) { e.preventDefault(); showLanding(); return; }
    if(e.target.closest('.hero__cta, .hero__scroll, .skip-link')) { e.preventDefault(); enterGuide(Boolean(e.target.closest('.hero__cta, .hero__scroll'))); return; }
    var el=e.target.closest('[data-action], [data-close], #book');
    if(!el)return;
    if(el.matches('a'))e.preventDefault();
    if(el.dataset.action==='direct-contact') {openDirectContact();return;}
    if(el.id==='book'||el.dataset.action==='review') {openConsult();return;}
    if(el.hasAttribute('data-close')) {closeConsult();return;}
    var id=el.dataset.section;
    switch(el.dataset.action) {
      case 'next': goToSection(id); break;
      case 'edit': dialog.close();goToSection(id);break;
      case 'pick':pickChoice(id,el.dataset.choice);break;
      case 'advice':state.advice[id]=!state.advice[id];if(state.advice[id]) {state.picks[id]=null;state.browsing[id]=null;if(state.multiPicks[id])state.multiPicks[id]=[];} updateSection(id);break;
      case 'remove-file':removeFile(el.dataset.file);break;
      case 'expand':
        var drawing=el.closest('.drawing').querySelector('img');
        $('#image-lightbox-img').src=drawing.src;$('#image-lightbox-img').alt=drawing.alt;
        $('#image-lightbox').showModal();break;
    }
  });
    document.addEventListener("input", function (e) {
  var t = e.target;

  if (t.dataset.dim) {
  state.dims[t.dataset.dim] = t.value;
  renderPlan();
  }

  if (t.hasAttribute("data-notes")) {
    state.notes = t.value; renderPlan();
  }

  if (t.dataset.other) {
    state.otherText[t.dataset.other] = t.value; renderPlan();
  }
});

document.addEventListener('change', function(e) {
    if (e.target.matches('input[type="file"][data-action="upload"]')) addFiles(e.target);
  });
  document.addEventListener('dragover', function(e) {
    if (e.target.closest('.dropzone')) e.preventDefault();
  });
  document.addEventListener('drop', function(e) {
    if (!e.target.closest('.dropzone')) return;
    e.preventDefault();
    addFiles({ files: Array.prototype.filter.call(e.dataTransfer.files, function(f) { return /\.(pdf|dwg|dxf|ifc|jpe?g|png)$/i.test(f.name); }), value: '' });
  });
  $('#download-summary').addEventListener('click', function() {
    window.print();
  });
  var reviewWasOpenForPrint = false;
  window.addEventListener('beforeprint', function() {
    reviewWasOpenForPrint = $('#review-summary').open;
    $('#review-summary').open = true;
  });
  window.addEventListener('afterprint', function() {
    $('#review-summary').open = reviewWasOpenForPrint;
  });
  $('#continue-contact').addEventListener('click', function() {
    $('#review-step').hidden = true;
    $('#contact-step').hidden = false;
    $('#consult-title').textContent = 'Request a call';
    $('#consult-lead').textContent = 'Tell us how to reach you. We can discuss open questions together. This prototype does not send a request.';
    $('#c-name').focus();
  });
  $('#back-review').addEventListener('click', function() { showReview(); $('#consult-title').focus(); });

/* ---------- Shared lightbox and document navigation ---------- */
  $('#image-lightbox-close').addEventListener('click',function() {$('#image-lightbox').close();});
  $('#image-lightbox').addEventListener('click',function(e) {if(e.target===this)this.close();});
  document.addEventListener('keydown',function(e) {
    if(e.key !== 'Escape') return;
    if($('#image-lightbox').open) { e.preventDefault(); $('#image-lightbox').close(); }
    else if(directDialog.open) { e.preventDefault(); closeDirectContact(); }
    else if(dialog.open) { e.preventDefault(); closeConsult(); }
  });
  $('#mobile-section').addEventListener('change',function() {goToSection(this.value);});
  function updateOffsets() {
    var offset = Math.ceil($('.site-header').getBoundingClientRect().bottom + 20);
    document.documentElement.style.setProperty('--nav-offset',offset+'px');
    var compactHeight = window.innerWidth <= 1024 ? $('.mobile-project').getBoundingClientRect().height + 16 : 0;
    document.documentElement.style.setProperty('--anchor-offset',(offset+compactHeight)+'px');
    scheduleActive();
  }
  new ResizeObserver(updateOffsets).observe($('.site-header'));
  window.addEventListener('resize',updateOffsets);
  window.addEventListener('scroll',scheduleActive,{passive:true});
  updateOffsets();
    /* ---------- Start ---------- */

  renderRefs();
  render();
})(window.HM);
