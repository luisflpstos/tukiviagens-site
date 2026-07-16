/**
 * Fork of Kortex lead-tracker.js for Tuki Viagens.
 * Change vs upstream: POST path uses trailing slash so Astro `trailingSlash: 'always'`
 * matches `/api/kortex/public/leads/form/` (same-origin proxy; avoids sendBeacon CORS).
 * Upstream: https://bff.kortex.app.br/api/v1/public/lead-tracker.js
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'kortex_first_touch_v1';
  var THROTTLE_MS = 5000;
  var SCRIPT_MARKER = '/public/lead-tracker.js';

  function readTrackerConfig(scriptEl) {
    var projectKey = scriptEl.getAttribute('data-project-key') || '';
    var apiBase = (scriptEl.getAttribute('data-api-base') || '').replace(/\/$/, '');
    var formSelector =
      scriptEl.getAttribute('data-form-selector') || 'form[data-kortex-form]';
    var autoCaptureAttr = scriptEl.getAttribute('data-auto-capture');
    var autoCapture = autoCaptureAttr !== 'false';

    if (!apiBase) {
      var src = scriptEl.src || '';
      var idx = src.indexOf(SCRIPT_MARKER);
      apiBase = idx >= 0 ? src.slice(0, idx) : '';
    }

    return {
      projectKey: projectKey,
      apiBase: apiBase,
      formSelector: formSelector,
      autoCapture: autoCapture,
    };
  }

  function readParams(search) {
    var params = new URLSearchParams(search || '');
    return {
      utm: {
        source: params.get('utm_source') || undefined,
        medium: params.get('utm_medium') || undefined,
        campaign: params.get('utm_campaign') || undefined,
        term: params.get('utm_term') || undefined,
        content: params.get('utm_content') || undefined,
      },
      clickIds: {
        gclid: params.get('gclid') || undefined,
        gbraid: params.get('gbraid') || undefined,
        wbraid: params.get('wbraid') || undefined,
        fbclid: params.get('fbclid') || undefined,
      },
    };
  }

  function createFirstTouchStore(storage, locationRef, documentRef) {
    function loadFirstTouch() {
      try {
        var raw = storage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (_error) {
        return null;
      }
    }

    function saveFirstTouch(payload) {
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (_error) {
        // ignore quota errors
      }
    }

    function ensureFirstTouch() {
      var existing = loadFirstTouch();
      if (existing) {
        return existing;
      }

      var captured = readParams(locationRef.search);
      var payload = {
        capturedAt: new Date().toISOString(),
        page: {
          url: locationRef.href,
          title: documentRef.title || undefined,
          referrer: documentRef.referrer || undefined,
        },
        utm: captured.utm,
        clickIds: captured.clickIds,
      };
      saveFirstTouch(payload);
      return payload;
    }

    return {
      loadFirstTouch: loadFirstTouch,
      saveFirstTouch: saveFirstTouch,
      ensureFirstTouch: ensureFirstTouch,
    };
  }

  function uuid(cryptoRef) {
    if (cryptoRef && cryptoRef.randomUUID) {
      return cryptoRef.randomUUID();
    }
    return 'kortex-' + Date.now() + '-' + Math.random().toString(16).slice(2);
  }

  function normalizePhone(value) {
    if (!value) return undefined;
    var digits = String(value).replace(/\D/g, '');
    return digits.length >= 10 ? digits : undefined;
  }

  function extractIdentity(fields) {
    var entries = Object.entries(fields || {});
    var name;
    var email;
    var phone;

    entries.forEach(function (pair) {
      var key = pair[0].toLowerCase();
      var value = String(pair[1] || '').trim();
      if (!value) return;

      if (!name && /name|nome/.test(key)) name = value;
      if (!email && (key.includes('email') || key.includes('e-mail'))) {
        email = value;
      }
      if (!phone && /phone|tel|whatsapp|celular|telefone/.test(key)) {
        phone = normalizePhone(value) || value;
      }
    });

    return { name: name, email: email, phone: phone };
  }

  function collectFormFields(form) {
    var fields = {};
    var elements = form.querySelectorAll('input, select, textarea');

    elements.forEach(function (el) {
      var input = el;
      var key = input.name || input.id;
      if (!key || input.type === 'password' || input.type === 'hidden') return;
      if (input.type === 'checkbox' && !input.checked) return;
      if (input.type === 'radio' && !input.checked) return;
      fields[key] = String(input.value || '').trim();
    });

    return fields;
  }

  function resolveFormId(form) {
    return (
      form.getAttribute('data-kortex-form') ||
      form.id ||
      form.getAttribute('name') ||
      undefined
    );
  }

  function buildSubmissionPayload(deps) {
    var form = deps.form;
    var extra = deps.extra;
    var firstTouchStore = deps.firstTouchStore;
    var cryptoRef = deps.cryptoRef;
    var firstTouch = firstTouchStore.ensureFirstTouch();
    var fields = form ? collectFormFields(form) : extra && extra.fields ? extra.fields : {};
    var identity = extractIdentity(fields);
    var payload = {
      name: (extra && extra.name) || identity.name,
      email: (extra && extra.email) || identity.email,
      phone: (extra && extra.phone) || identity.phone,
      fields: fields,
      page: firstTouch.page,
      utm: firstTouch.utm,
      clickIds: firstTouch.clickIds,
      formId: form ? resolveFormId(form) : extra && extra.formId,
      dedupeKey: uuid(cryptoRef),
      occurredAt: new Date().toISOString(),
    };

    if (extra && typeof extra === 'object') {
      Object.assign(payload, extra);
      if (form) {
        payload.fields = fields;
        payload.formId = resolveFormId(form);
      }
    }

    return payload;
  }

  function createEligibilityPolicy(rules) {
    return {
      isEligible: function (form, context) {
        for (var i = 0; i < rules.length; i++) {
          if (!rules[i].isEligible(form, context)) {
            return false;
          }
        }
        return true;
      },
    };
  }

  var eligibilityRules = {
    notIgnored: {
      name: 'notIgnored',
      isEligible: function (form) {
        return form.getAttribute('data-kortex-ignore') !== 'true';
      },
    },
    notExplicitlyBound: {
      name: 'notExplicitlyBound',
      isEligible: function (form) {
        return form.getAttribute('data-kortex-bound') !== '1';
      },
    },
    noPasswordField: {
      name: 'noPasswordField',
      isEligible: function (form) {
        return form.querySelectorAll('input[type=password]').length === 0;
      },
    },
    hasContactIdentity: {
      name: 'hasContactIdentity',
      isEligible: function (form) {
        var identity = extractIdentity(collectFormFields(form));
        return Boolean(identity.email || identity.phone);
      },
    },
    notThrottled: {
      name: 'notThrottled',
      isEligible: function (form, context) {
        var lastSent = context.throttleMap.get(form);
        if (!lastSent) return true;
        return context.now() - lastSent >= THROTTLE_MS;
      },
    },
  };

  function createTransport(config, navigatorRef, fetchRef) {
    function sendPayload(payload) {
      var url =
        config.apiBase +
        '/public/leads/form/?projectKey=' +
        encodeURIComponent(config.projectKey);
      var body = JSON.stringify(payload);

      if (navigatorRef && navigatorRef.sendBeacon) {
        var blob = new Blob([body], { type: 'application/json' });
        if (navigatorRef.sendBeacon(url, blob)) {
          return Promise.resolve({ ok: true });
        }
      }

      return fetchRef(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Project-Key': config.projectKey,
        },
        body: body,
        keepalive: true,
      });
    }

    return { send: sendPayload };
  }

  function createAutoCaptureController(deps) {
    var policy = deps.policy;
    var buildPayload = deps.buildPayload;
    var transport = deps.transport;
    var throttleMap = deps.throttleMap;
    var now = deps.now;

    function handleSubmit(event) {
      var form = event.target;
      if (!form || form.tagName !== 'FORM') return;

      var context = { throttleMap: throttleMap, now: now };
      if (!policy.isEligible(form, context)) return;

      var payload = buildPayload({ form: form });
      transport.send(payload);
      throttleMap.set(form, now());
    }

    return { handleSubmit: handleSubmit };
  }

  function createExplicitBinder(deps) {
    var documentRef = deps.documentRef;
    var formSelector = deps.formSelector;
    var buildPayload = deps.buildPayload;
    var transport = deps.transport;

    function bindForms() {
      var forms = documentRef.querySelectorAll(formSelector);
      forms.forEach(function (form) {
        if (form.getAttribute('data-kortex-bound') === '1') return;
        form.setAttribute('data-kortex-bound', '1');
        form.addEventListener('submit', function (event) {
          event.preventDefault();
          var payload = buildPayload({ form: form });
          transport
            .send(payload)
            .then(function () {
              form.dispatchEvent(
                new CustomEvent('kortex:submitted', { detail: payload }),
              );
            })
            .catch(function (error) {
              console.error('[KortexLeads] submit failed', error);
            });
        });
      });
    }

    return { bindForms: bindForms };
  }

  function bootstrapBrowser(script, deps) {
    var config = readTrackerConfig(script);
    if (!config.projectKey) {
      console.warn('[KortexLeads] data-project-key is required');
      return null;
    }

    var documentRef = deps.documentRef;
    var windowRef = deps.windowRef;
    var storage = deps.storage;
    var locationRef = deps.locationRef;
    var navigatorRef = deps.navigatorRef;
    var fetchRef = deps.fetchRef;
    var cryptoRef = deps.cryptoRef;

    var firstTouchStore = createFirstTouchStore(storage, locationRef, documentRef);
    var transport = createTransport(config, navigatorRef, fetchRef);
    var throttleMap = new WeakMap();

    function buildPayload(depsInner) {
      return buildSubmissionPayload({
        form: depsInner.form,
        extra: depsInner.extra,
        firstTouchStore: firstTouchStore,
        cryptoRef: cryptoRef,
      });
    }

    function track(extra) {
      return transport.send(
        buildPayload({
          extra: Object.assign(
            {
              page: firstTouchStore.ensureFirstTouch().page,
              utm: firstTouchStore.ensureFirstTouch().utm,
              clickIds: firstTouchStore.ensureFirstTouch().clickIds,
            },
            extra || {},
          ),
        }),
      );
    }

    var explicitBinder = createExplicitBinder({
      documentRef: documentRef,
      formSelector: config.formSelector,
      buildPayload: buildPayload,
      transport: transport,
    });

    if (config.autoCapture) {
      var autoPolicy = createEligibilityPolicy([
        eligibilityRules.notIgnored,
        eligibilityRules.notExplicitlyBound,
        eligibilityRules.noPasswordField,
        eligibilityRules.hasContactIdentity,
        eligibilityRules.notThrottled,
      ]);
      var autoController = createAutoCaptureController({
        policy: autoPolicy,
        buildPayload: buildPayload,
        transport: transport,
        throttleMap: throttleMap,
        now: function () {
          return Date.now();
        },
      });
      documentRef.addEventListener('submit', autoController.handleSubmit, true);
    }

    windowRef.KortexLeads = {
      track: track,
      captureFirstTouch: firstTouchStore.ensureFirstTouch,
      bindForms: explicitBinder.bindForms,
    };

    firstTouchStore.ensureFirstTouch();
    explicitBinder.bindForms();
    if (documentRef.readyState === 'loading') {
      documentRef.addEventListener('DOMContentLoaded', explicitBinder.bindForms);
    }

    return windowRef.KortexLeads;
  }

  var exports = {
    STORAGE_KEY: STORAGE_KEY,
    THROTTLE_MS: THROTTLE_MS,
    SCRIPT_MARKER: SCRIPT_MARKER,
    readTrackerConfig: readTrackerConfig,
    readParams: readParams,
    createFirstTouchStore: createFirstTouchStore,
    uuid: uuid,
    normalizePhone: normalizePhone,
    extractIdentity: extractIdentity,
    collectFormFields: collectFormFields,
    resolveFormId: resolveFormId,
    buildSubmissionPayload: buildSubmissionPayload,
    createEligibilityPolicy: createEligibilityPolicy,
    eligibilityRules: eligibilityRules,
    createTransport: createTransport,
    createAutoCaptureController: createAutoCaptureController,
    createExplicitBinder: createExplicitBinder,
    bootstrapBrowser: bootstrapBrowser,
  };

  if (typeof module === 'object' && module.exports) {
    module.exports = exports;
    return;
  }

  if (typeof document === 'undefined') {
    return;
  }

  var script = document.currentScript;
  if (!script) {
    return;
  }

  bootstrapBrowser(script, {
    documentRef: document,
    windowRef: global,
    storage: global.localStorage,
    locationRef: global.location,
    navigatorRef: global.navigator,
    fetchRef: global.fetch.bind(global),
    cryptoRef: global.crypto,
  });
})(typeof window !== 'undefined' ? window : globalThis);
