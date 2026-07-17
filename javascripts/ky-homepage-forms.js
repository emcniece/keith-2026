/* Homepage AJAX form submissions — signup (CTA + platform) and contact */
(function () {
  'use strict';

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function parseName(value) {
    var parts = (value || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return { first: '', last: '' };
    if (parts.length === 1) return { first: parts[0], last: '' };
    return { first: parts[0], last: parts.slice(1).join(' ') };
  }

  function getCsrf(form) {
    var f = form && form.querySelector('[name="authenticity_token"]');
    if (f && f.value) return f.value;
    var m = document.querySelector('meta[name="csrf-token"]');
    return m ? m.getAttribute('content') : '';
  }

  function ajaxPost(url, data, csrf) {
    return fetch(url, {
      method: 'POST',
      body: data,
      credentials: 'same-origin',
      redirect: 'manual',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': csrf,
        'Accept': 'text/html, */*; q=0.01'
      }
    }).then(function (r) {
      if (r.type === 'opaqueredirect' || (r.status >= 200 && r.status < 400)) {
        return { ok: true };
      }
      return r.text().then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var errEl = doc.querySelector('.form-errors');
        var msg = errEl ? errEl.textContent.replace(/\s+/g, ' ').trim() : '';
        return { ok: false, msg: msg || 'Something went wrong. Please try again.' };
      });
    });
  }

  function setFeedback(form, type, msg) {
    var s = form.querySelector('.ky-form-feedback--success');
    var e = form.querySelector('.ky-form-feedback--error');
    if (s) s.hidden = type !== 'success';
    if (e) {
      e.hidden = type !== 'error';
      if (type === 'error') e.textContent = msg || 'Something went wrong. Please try again.';
    }
  }

  function clearFeedback(form) {
    var s = form.querySelector('.ky-form-feedback--success');
    var e = form.querySelector('.ky-form-feedback--error');
    if (s) s.hidden = true;
    if (e) e.hidden = true;
  }

  // ── Signup forms (CTA + platform) ─────────────────────────────────────
  document.querySelectorAll('[data-ajax-signup]').forEach(function (form) {
    var nameInput  = form.querySelector('.ky-ajax-name');
    var emailInput = form.querySelector('.ky-ajax-email');
    var btn        = form.querySelector('[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearFeedback(form);

      var name  = nameInput  ? nameInput.value.trim()  : '';
      var email = emailInput ? emailInput.value.trim() : '';
      var valid = true;

      if (nameInput) nameInput.setAttribute('aria-invalid', name  ? 'false' : 'true');
      if (emailInput) emailInput.setAttribute('aria-invalid', EMAIL_RE.test(email) ? 'false' : 'true');

      if (!name || !EMAIL_RE.test(email)) {
        setFeedback(form, 'error', 'Please enter your name and a valid email address.');
        if (!name && nameInput) nameInput.focus();
        else if (!EMAIL_RE.test(email) && emailInput) emailInput.focus();
        return;
      }

      var names   = parseName(name);
      var csrf    = getCsrf(form);
      var pageId  = (form.querySelector('[name="page_id"]') || {}).value || '';
      var action  = form.getAttribute('action') || '/forms/signups';
      var data    = new FormData();
      data.append('authenticity_token',    csrf);
      data.append('page_id',               pageId);
      data.append('signup[first_name]',    names.first);
      data.append('signup[last_name]',     names.last);
      data.append('signup[email]',         email);
      data.append('signup[email_opt_in]',  '1');

      if (btn) btn.disabled = true;

      ajaxPost(action, data, csrf)
        .then(function (result) {
          if (btn) btn.disabled = false;
          if (result.ok) {
            setFeedback(form, 'success');
            form.reset();
            if (nameInput)  nameInput.setAttribute('aria-invalid',  'false');
            if (emailInput) emailInput.setAttribute('aria-invalid', 'false');
          } else {
            setFeedback(form, 'error', result.msg);
          }
        })
        .catch(function () {
          if (btn) btn.disabled = false;
          setFeedback(form, 'error', 'Something went wrong. Please try again.');
        });
    });

    [nameInput, emailInput].forEach(function (input) {
      if (!input) return;
      input.addEventListener('input', function () {
        input.setAttribute('aria-invalid', 'false');
        clearFeedback(form);
      });
    });
  });

  // ── Contact form ──────────────────────────────────────────────────────
  var contactForm = document.querySelector('[data-ajax-contact]');
  if (!contactForm) return;

  var contactEmail = contactForm.querySelector('[name="signup[email]"]');
  var contactBtn   = contactForm.querySelector('[type="submit"]');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearFeedback(contactForm);

    var email = contactEmail ? contactEmail.value.trim() : '';
    if (!EMAIL_RE.test(email)) {
      if (contactEmail) contactEmail.setAttribute('aria-invalid', 'true');
      setFeedback(contactForm, 'error', 'Please enter a valid email address.');
      if (contactEmail) contactEmail.focus();
      return;
    }
    if (contactEmail) contactEmail.setAttribute('aria-invalid', 'false');

    var csrf   = getCsrf(contactForm);
    var data   = new FormData(contactForm);
    var action = contactForm.getAttribute('action') || '/forms/signups';

    if (contactBtn) contactBtn.disabled = true;

    ajaxPost(action, data, csrf)
      .then(function (result) {
        if (contactBtn) contactBtn.disabled = false;
        if (result.ok) {
          setFeedback(contactForm, 'success');
          contactForm.reset();
        } else {
          setFeedback(contactForm, 'error', result.msg);
        }
      })
      .catch(function () {
        if (contactBtn) contactBtn.disabled = false;
        setFeedback(contactForm, 'error', 'Something went wrong. Please try again.');
      });
  });

  if (contactEmail) {
    contactEmail.addEventListener('input', function () {
      contactEmail.setAttribute('aria-invalid', 'false');
      clearFeedback(contactForm);
    });
  }
})();
