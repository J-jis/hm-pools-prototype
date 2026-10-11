/* HM Pools architect's guide: behaviour.
   Plain JavaScript, no build step. Content comes from js/data.js (window.HM). */
(function (HM) {
  "use strict";

  var DEFAULT_PHOTO = "img/saana.jpg";
  var REFERENCES_URL = "https://hmpools.fi/en/references/";

  /* ---------- State ---------- */

var state = {
  open: "use",
  focus: "use",
  view: "photo",
  picks: {},
  browsing: {},
  advice: {},
  multiPicks: {},
  otherText: {},
  seen: { type: true },
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

  var id = state.browsing[section.id];

  return section.choices.filter(function (c) {
    return c.id === id;
  })[0] || section.choices[0];
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
    return '<button class="chip" type="button" data-action="' + action + '" data-section="' + section +
      '" data-choice="' + (choice || '') + '" data-focus-key="' + action + '-' + section + '-' + (choice || '') +
      '" aria-pressed="' + Boolean(pressed) + '">' + esc(label) + '</button>';
  }

  function bodyChoice(section) {
    var cur = currentChoice(section);
    var selected = state.multiPicks[section.id] || [];
    var saved = section.multiple ? selected.indexOf(cur.id) !== -1 : state.picks[section.id] === cur.id;
    var chips = section.kind === 'info' ? '' : '<p class="acc__subhead">Explore the options</p><div class="choices">' +
      section.choices.map(function(c) {
        return actionButton('browse', section.id, c.label, cur.id === c.id, c.id);
      }).join('') + '</div>';
    var answer = '<div class="project-answer"><h4 class="acc__subhead">' +
      (section.kind === 'info' ? 'Would you like help?' : 'Your current project preference') + '</h4>';
    if (section.kind !== 'info') {
      answer += '<p class="answer-status" role="status">Recorded: ' + esc(headerValue(section)) + '</p><div class="choices">' +
        actionButton('pick', section.id, saved ? 'Remove: ' + cur.label : 'Use for my project: ' + cur.label, saved, cur.id);
    } else { answer += '<div class="choices">'; }
    answer += actionButton('advice', section.id, section.kind === 'info' ? 'I need technical space advice' : 'Not decided - I need advice', state.advice[section.id]) + '</div>';
    if (section.multiple && selected.indexOf('other') !== -1) {
      answer += '<div class="field"><label for="other-features">Other requirement</label><input id="other-features" data-other="features" value="' + esc(state.otherText.features || '') + '"></div>';
    }
    answer += '</div>';
    return chips + '<p class="acc__text">' + esc(cur.blurb) + '</p>' +
      (cur.specs && cur.specs.length ? specList(cur.specs) : '') + answer;
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
      '<button class="btn btn--ghost" type="button" data-action="next" data-section="' + next.id + '">Next: ' + esc(next.title) + ' &rarr;</button>' :
      '<button class="btn btn--solid" type="button" data-action="review">Review project summary</button>') + '</div>';
  }

  /* ---------- Rendering ---------- */

  function renderSections() {
    var active = document.activeElement;
    var focusKey = active && active.getAttribute("data-focus-key");

    $("#sections").innerHTML = HM.sections.map(function (s, index) {
  var groupHeading = "";

  if (index === 0) {
  groupHeading =
    '<div class="section-group">' +
    '<h3 class="section-group__title">Essential project information</h3>' +
    '<p class="section-group__desc">Please answer these four questions before sending an enquiry. Rough estimates or Needs advice are enough. Exploring an option does not record it.</p>' +
    '</div>';
}

if (s.id === "upload") {
  groupHeading =
    '<div class="section-group section-group--upload">' +
    '<h3 class="section-group__title">Have a project in mind?</h3>' +
    '<p class="section-group__desc">Already have drawings or sketches? Share them to help HM Pools understand your project. You can also continue exploring without uploading anything.</p>' +
    '</div>';
}

if (s.id === "plant") {
  groupHeading =
    '<div class="section-group section-group--optional">' +
    '<h3 class="section-group__title">Plan the supporting details</h3>' +
    '<p class="section-group__desc">Read these early design considerations. Record preferences or ask for advice where useful; answers here are optional.</p>' +
    '</div>';
}
      var open = state.open === s.id;
      return groupHeading +
  '<div class="acc' + (index < 4 ? ' acc--essential' : '') +
  '" data-id="' + s.id + '">' +
        '<h3 class="acc__heading"><button class="acc__head" type="button" data-action="toggle" data-section="' + s.id +
        '" data-focus-key="head-' + s.id + '" aria-expanded="' + open + '" aria-controls="body-' + s.id + '">' +
        '<span class="acc__title">' + esc(s.title) + "</span>" +
        '<span class="acc__value" data-value="' + s.id + '">' + esc(headerValue(s)) + "</span>" +
        '<span class="acc__icon" aria-hidden="true"></span></button></h3>' +
        '<div class="acc__body" id="body-' + s.id + '"' + (open ? "" : " hidden") + ">" + (open ? sectionBody(s) : "") + "</div>" +
        "</div>";
    }).join("");

    // Keep keyboard focus on the control that triggered the re-render.
    $$("#sections .chip").forEach(function (b) {
      b.setAttribute("data-focus-key", b.dataset.action + "-" + b.dataset.section + "-" + b.dataset.choice);
    });
    if (focusKey) {
      var again = $('[data-focus-key="' + focusKey + '"]');
      if (again) again.focus();
    }
  }

  function updateHeaderValue(id) {
    var el = $('[data-value="' + id + '"]');
    if (el) el.textContent = headerValue(sectionById(id));
  }

  function renderStage() {
    var type = currentChoice(sectionById("type"));
    var focusSection = sectionById(state.focus) || sectionById("type");
    var focusChoice = currentChoice(focusSection);
    var ref = HM.refByImg[focusChoice.img] || {};

    $$("[data-panel]").forEach(function (p) { p.hidden = p.dataset.panel !== state.view; });
    $$(".drawing__img").forEach(function (img) { img.hidden = img.dataset.type !== type.id; });

    var title = type.label + " pool";
    if (state.view === "photo") title = focusSection.title + ": " + focusChoice.label;
    if (state.view === "refs") title = "Reference projects";
    $("#stage-title").textContent = title;
    $(".stage__note").hidden = state.view !== "section";
    $("#stats").hidden = state.view !== "section";

    var img = $("#photo-img");
    var src = focusChoice.img || DEFAULT_PHOTO;
    if (img.getAttribute("src") !== src) img.setAttribute("src", src);
    img.alt = ref.name || "";
    $("#photo-name").textContent = ref.name || "";
    $("#photo-link").href = ref.url || REFERENCES_URL;

    $("#stats").innerHTML = HM.stats[type.id].map(function (r) {
      return '<div class="stats__item"><dt>' + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>";
    }).join("");
  }

  function isComplete(id) {
    if (state.advice[id]) return true;
    return id === 'dims' ? Number(state.dims.l) > 0 && Number(state.dims.w) > 0 : Boolean(state.picks[id]);
  }
  function essentialsComplete() { return ['use', 'install', 'type', 'dims'].every(isComplete); }
  function renderPlan() {
    var completed = ['use', 'install', 'type', 'dims'].filter(isComplete).length;
    $('#plan-count').textContent = completed === 4 ? '4/4 answered · Ready to review' : completed + '/4 basic questions answered';
  }

  function renderRefs() {
    $("#refs").innerHTML = HM.refs.map(function (r) {
      return '<a class="ref" href="' + esc(r.url) + '" target="_blank" rel="noopener">' +
        '<span class="ref__media"><img src="' + esc(r.img) + '" alt="" loading="lazy" decoding="async"></span>' +
        '<span class="ref__tag">' + esc(r.tag) + "</span>" +
        '<span class="ref__name">' + esc(r.name) + "</span></a>";
    }).join("");
  }

  function render() {
    renderStage();
    renderSections();
    renderPlan();
  }

  /* ---------- Actions ---------- */

  function showsPhoto(section) {
    return section.choices && section.kind !== "info" && !section.noPhoto;
  }

 function toggleSection(id) {
  var section = sectionById(id);
  state.seen[id] = true;
  state.open = state.open === id ? null : id;

  if (showsPhoto(section)) {
    state.focus = id;
    state.view = id === "type" ? "section" : "photo";
  }

  render();
}

  function browseChoice(sectionId, choiceId) {
    state.browsing[sectionId] = choiceId;
    if (showsPhoto(sectionById(sectionId)) && choiceId !== 'other') {
      state.focus = sectionId;
      state.view = sectionId === 'type' ? 'section' : 'photo';
    }
    render();
  }
  function pickChoice(sectionId, choiceId) {
    state.advice[sectionId] = false;
    if (sectionById(sectionId).multiple) {
      var selected = state.multiPicks[sectionId];
      var index = selected.indexOf(choiceId);
      if (index < 0) selected.push(choiceId); else selected.splice(index, 1);
    } else state.picks[sectionId] = state.picks[sectionId] === choiceId ? null : choiceId;
    render();
  }
  function goToSection(id) {
    state.open = null;
    toggleSection(id);
    var head = $('[data-focus-key="head-' + id + '"]');
    head.focus({preventScroll: true});
    head.scrollIntoView({block: 'nearest', behavior: 'smooth'});
  }

  function addFiles(input) {
    Array.prototype.forEach.call(input.files || [], function (file, i) {
      state.files.push({ id: Date.now().toString(36) + i + Math.random().toString(36).slice(2, 6), name: file.name, file: file });
    });
    input.value = ""; // lets the same file be chosen again after removing it
    renderSections();
  }

  function removeFile(id) {
    state.files = state.files.filter(function (f) { return f.id !== id; });
    renderSections();
    var zone = $(".dropzone__input");
    if (zone) zone.focus();
  }

  /* ---------- Consultation dialog ---------- */

  var dialog = $("#consult");
  var form = $("#consult-form");

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
    $('#consult-title').textContent = 'Review your project';
    $('#consult-lead').textContent = 'Check your answers and questions before adding your contact details.';
    $('#review-missing').textContent = essentialsComplete() ? 'Basic project information recorded. You can still edit any answer.' : 'Please answer the four basic questions before continuing. Choose Needs advice if you are unsure.';
    $('#continue-contact').disabled = !essentialsComplete();
  }
  function openConsult() {
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
    $("#book").focus();
  }

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
    if (!essentialsComplete()) { showReview(); return; }
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
    if (state.view !== 'refs') {
      $$('.site-nav a').forEach(function(link) { link.removeAttribute('aria-current'); });
      $('[data-architect]').setAttribute('aria-current', 'page');
    }
    $('#guide').focus({preventScroll: true});
  }
  if (location.hash === '#guide') enterGuide();
  /* ---------- Events ---------- */

  document.addEventListener("click", function (e) {
    if (e.target.closest('[data-home]')) {
      e.preventDefault();
      showLanding();
      $$('.site-nav a').forEach(function(link) { link.removeAttribute('aria-current'); });
      $('.site-nav [data-home]').setAttribute('aria-current', 'page');
      $('.hero__cta').focus({preventScroll: true});
      return;
    }
    if (e.target.closest('.hero__cta, .hero__scroll, .skip-link')) {
      e.preventDefault();
      enterGuide(Boolean(e.target.closest('.hero__cta, .hero__scroll')));
      return;
    }
      var referencesLink = e.target.closest("[data-references]");

if (referencesLink) {
  e.preventDefault();

  state.view = "refs";
  renderStage();

  // Move active navigation underline to References
  $$(".site-nav a").forEach(function (link) {
    link.removeAttribute("aria-current");
  });
  referencesLink.setAttribute("aria-current", "page");

  enterGuide();

  return;
}

var architectLink = e.target.closest("[data-architect]");

if (architectLink) {
  e.preventDefault();

  state.view = state.focus === "type" ? "section" : "photo";
  renderStage();

  // Move active navigation underline back to Architect's guide
  $$(".site-nav a").forEach(function (link) {
    link.removeAttribute("aria-current");
  });
  architectLink.setAttribute("aria-current", "page");

  showLanding();

  return;
}

  if (referencesLink) {
    e.preventDefault();

    state.view = "refs";
    renderStage();

    document.querySelector("#guide").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    return;
  }


  if (e.target.closest("[data-nav]")) {
    e.preventDefault();
    return;
  }

  var el = e.target.closest("[data-action], [data-close], #book");
  if (!el) return;

  if (el.id === "book") {
    openConsult();
    return;
  }

  if (el.hasAttribute("data-close")) {
    closeConsult();
    return;
  }

  switch (el.dataset.action) {
    case "review": openConsult(); break;
    case "next": goToSection(el.dataset.section); break;
    case "edit": dialog.close(); goToSection(el.dataset.section); break;
    case "browse": browseChoice(el.dataset.section, el.dataset.choice); break;
    case "advice":
      var id = el.dataset.section;
      state.advice[id] = !state.advice[id];
      if (state.advice[id]) { state.picks[id] = null; if (state.multiPicks[id]) state.multiPicks[id] = []; }
      render(); break;
    case "toggle":
      toggleSection(el.dataset.section);
      break;

    case "pick":
      pickChoice(el.dataset.section, el.dataset.choice);
      break;

    case "remove-file":
      removeFile(el.dataset.file);
      break;
  }
});

  document.addEventListener("input", function (e) {
  var t = e.target;

  if (t.dataset.dim) {
  state.dims[t.dataset.dim] = t.value;
  updateHeaderValue("dims");
  renderPlan();
  }

  if (t.hasAttribute("data-notes")) {
    state.notes = t.value;
  }

  if (t.dataset.other) {
    state.otherText[t.dataset.other] = t.value;
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
  $('#continue-contact').addEventListener('click', function() {
    if (!essentialsComplete()) return;
    $('#review-step').hidden = true;
    $('#contact-step').hidden = false;
    $('#consult-title').textContent = 'Contact HM Pools';
    $('#consult-lead').textContent = 'Add your contact details to your project summary.';
    $('#c-name').focus();
  });
  $('#back-review').addEventListener('click', function() { showReview(); $('#consult-title').focus(); });

/* ---------- Image lightbox ---------- */

var drawingExpand = $("#drawing-expand");
var imageLightbox = $("#image-lightbox");
var lightboxImg = $("#image-lightbox-img");
var lightboxClose = $("#image-lightbox-close");

if (drawingExpand && imageLightbox && lightboxImg && lightboxClose) {

  // Open the currently visible section drawing
  drawingExpand.addEventListener("click", function () {
    var currentDrawing = $(".drawing__img:not([hidden])");

    if (!currentDrawing) return;

    lightboxImg.src = currentDrawing.src;
    lightboxImg.alt = currentDrawing.alt || "Enlarged section drawing";

    imageLightbox.showModal();
  });

  // Close with the X button
  lightboxClose.addEventListener("click", function () {
    imageLightbox.close();
  });

  // Close by clicking outside the image
  imageLightbox.addEventListener("click", function (e) {
    if (e.target === imageLightbox) {
      imageLightbox.close();
    }
  });

}

/* ---------- Manual panel resize ---------- */

var resizeButton = $(".panel__resize");

if (resizeButton) {
  resizeButton.addEventListener("click", function () {
    var guide = $(".guide");
    var expanded = guide.classList.toggle("is-configuring");

    resizeButton.setAttribute("aria-expanded", String(expanded));
    resizeButton.setAttribute(
      "aria-label",
      expanded ? "Collapse information panel" : "Expand information panel"
    );

    $(".panel__resize-icon").textContent = expanded ? "›" : "‹";
  });
}

  /* ---------- Start ---------- */

  renderRefs();
  render();
})(window.HM);
