(function () {
  "use strict";

  var CFG = window.TRAINING_CONFIG;
  var STARTER = window.TRAINING_CONTENT;
  var view = document.getElementById("view");
  var who = document.getElementById("who");

  // ---------- small helpers ----------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("dd:" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("dd:" + k, JSON.stringify(v)); } catch (e) { } }
  };
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function rid(prefix) { return prefix + "-" + Math.random().toString(36).slice(2, 7); }
  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function fmtDay(d) { return DAYS[d.getDay()] + " " + (d.getMonth() + 1) + "/" + d.getDate(); }
  function fmtTime(iso) {
    var d = new Date(iso);
    var h = d.getHours(), m = d.getMinutes();
    var ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12;
    return fmtDay(d) + " " + h + ":" + (m < 10 ? "0" : "") + m + " " + ap;
  }
  function startOfDay(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function parseDate(s) { var p = String(s).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Supabase (REST, no library) ----------
  var remote = !!(CFG.supabaseUrl && CFG.supabaseAnonKey);
  var online = remote;
  var ADMIN_EMAILS = (CFG.adminEmails || []).map(function (e) { return e.toLowerCase(); });

  function auth() { return store.get("auth", null); }
  function anonHeaders() {
    return { apikey: CFG.supabaseAnonKey, Authorization: "Bearer " + CFG.supabaseAnonKey, "Content-Type": "application/json" };
  }
  function rest(path, opts) {
    opts = opts || {};
    return fetch(CFG.supabaseUrl + "/rest/v1/" + path, opts).then(function (r) {
      if (!r.ok) return r.text().then(function (t) {
        var msg = t; try { msg = JSON.parse(t).message || t; } catch (e) { }
        var err = new Error(msg || ("Request failed (" + r.status + ")")); err.status = r.status; throw err;
      });
      return r.status === 204 ? null : r.text().then(function (t) { return t ? JSON.parse(t) : null; });
    });
  }
  function authCall(grant, body) {
    return fetch(CFG.supabaseUrl + "/auth/v1/token?grant_type=" + grant, {
      method: "POST", headers: { apikey: CFG.supabaseAnonKey, "Content-Type": "application/json" }, body: JSON.stringify(body)
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok) throw new Error(j.error_description || j.msg || j.message || "Sign-in failed");
        var a = { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Date.now() + (j.expires_in || 3600) * 1000, email: (j.user && j.user.email || "").toLowerCase() };
        store.set("auth", a);
        return a;
      });
    });
  }
  function adminToken() {
    var a = auth();
    if (!a) return Promise.reject(new Error("Sign in as admin first."));
    if (a.expires_at - 60000 > Date.now()) return Promise.resolve(a.access_token);
    return authCall("refresh_token", { refresh_token: a.refresh_token }).then(function (n) { return n.access_token; })
      .catch(function () { store.set("auth", null); throw new Error("Your admin sign-in expired. Sign in again."); });
  }
  function adminRest(path, opts) {
    return adminToken().then(function (tok) {
      opts = opts || {};
      opts.headers = Object.assign({ apikey: CFG.supabaseAnonKey, Authorization: "Bearer " + tok, "Content-Type": "application/json" }, opts.headers || {});
      return rest(path, opts);
    });
  }
  function isAdmin() {
    if (!remote) return store.get("coachOk", false) === true;
    var a = auth();
    return !!(a && ADMIN_EMAILS.indexOf(a.email) > -1);
  }

  // ---------- content model ----------
  // M.cycles: [{id,title,blurb}], M.sessions: [{key,cycle,week,day,kind,title,minutes,published,slides|activities}]
  var M = { cycles: [], sessions: [], settings: {} };
  var sessions = [], cyclesSorted = [];
  var usingStarter = false;

  function fromStarter() {
    var m = { cycles: [], sessions: [], settings: { program: { programStart: CFG.programStart, trainees: CFG.trainees.slice(), rotation: Object.assign({}, CFG.rotation || {}) }, cheers: clone(STARTER.cheers) } };
    STARTER.cycles.forEach(function (cy) {
      m.cycles.push({ id: cy.id, title: cy.title, blurb: cy.blurb || "" });
      cy.sessions.forEach(function (s) { var x = clone(s); x.cycle = cy.id; x.published = true; m.sessions.push(x); });
    });
    return m;
  }
  function rowToSession(r) {
    var s = { key: r.key, cycle: r.cycle_id, week: r.week, day: r.day, kind: r.kind, title: r.title, minutes: r.minutes, published: r.published };
    if (r.kind === "lesson") s.slides = (r.body && r.body.slides) || []; else s.activities = (r.body && r.body.activities) || [];
    return s;
  }
  function sessionToRow(s) {
    return { key: s.key, cycle_id: s.cycle, week: +s.week || 1, day: s.day, kind: s.kind, title: s.title, minutes: +s.minutes || 10, published: !!s.published,
      body: s.kind === "lesson" ? { slides: s.slides || [] } : { activities: s.activities || [] }, updated_at: new Date().toISOString() };
  }
  function loadContent() {
    if (!remote) {
      M = store.get("content-local-v3", null) || fromStarter();
      usingStarter = !store.get("content-local-v3", null);
      rebuild(); return Promise.resolve();
    }
    return Promise.all([
      rest("training_cycles?select=*&order=id", { headers: anonHeaders() }),
      rest("training_sessions?select=*", { headers: anonHeaders() }),
      rest("training_settings?select=*", { headers: anonHeaders() })
    ]).then(function (res) {
      if (!res[0] || !res[0].length) { M = fromStarter(); usingStarter = true; }
      else {
        usingStarter = false;
        M = { cycles: res[0].map(function (c) { return { id: c.id, title: c.title, blurb: c.blurb || "" }; }), sessions: res[1].map(rowToSession), settings: {} };
        (res[2] || []).forEach(function (r) { M.settings[r.key] = r.value; });
        var base = fromStarter().settings;
        M.settings.program = Object.assign({}, base.program, M.settings.program || {});
        M.settings.cheers = Object.assign({}, base.cheers, M.settings.cheers || {});
      }
      rebuild();
    }).catch(function () { online = false; M = fromStarter(); usingStarter = true; rebuild(); });
  }
  var DAY_ORDER = { tue: 0, fri: 1 };
  function rebuild() {
    cyclesSorted = M.cycles.slice().sort(function (a, b) { return a.id - b.id; });
    var admin = isAdmin();
    sessions = M.sessions.filter(function (s) {
      return cycleById(s.cycle) && (s.published || admin);
    }).sort(function (a, b) {
      return cycleIndex(a.cycle) - cycleIndex(b.cycle) || a.week - b.week || DAY_ORDER[a.day] - DAY_ORDER[b.day] || String(a.title).localeCompare(b.title);
    });
  }
  function cycleById(id) { return cyclesSorted.filter(function (c) { return c.id === id; })[0]; }
  function cycleIndex(id) { for (var i = 0; i < cyclesSorted.length; i++) if (cyclesSorted[i].id === id) return i; return 999; }
  function program() { return (M.settings && M.settings.program) || { programStart: CFG.programStart, trainees: CFG.trainees, rotation: CFG.rotation || {} }; }
  function cheers() { return (M.settings && M.settings.cheers) || STARTER.cheers; }
  function sessionByKey(k) { return sessions.filter(function (s) { return s.key === k; })[0]; }

  // ----- rotation: each trainee gets the weekly units in a different order -----
  // A unit = one topic week (Tuesday lesson + Friday play). Units are ordered by topic, then week.
  function units() {
    var seen = {}, out = [];
    sessions.filter(function (s) { return s.published; }).forEach(function (s) {
      var k = s.cycle + "-" + s.week;
      if (!seen[k]) { seen[k] = 1; out.push({ key: k, cycle: s.cycle, week: +s.week }); }
    });
    return out.sort(function (a, b) { return cycleIndex(a.cycle) - cycleIndex(b.cycle) || a.week - b.week; });
  }
  function unitIndexOf(s) {
    var k = s.cycle + "-" + s.week, u = units();
    for (var i = 0; i < u.length; i++) if (u[i].key === k) return i;
    return -1;
  }
  function offsetFor(name) {
    var n = units().length; if (!n) return 0;
    var rot = program().rotation || {};
    if (rot[name] != null && !isNaN(+rot[name])) return ((+rot[name] % n) + n) % n;
    var list = program().trainees || [], i = Math.max(0, list.indexOf(name));
    return Math.floor(i * n / Math.max(1, list.length)) % n;
  }
  function programWeek() {
    var days = Math.floor((startOfDay(new Date()) - parseDate(program().programStart)) / 86400000);
    return Math.max(0, Math.floor(days / 7));
  }
  function weekNumberFor(s, name) { // 0-based program week when this trainee gets the session
    var n = units().length, u = unitIndexOf(s);
    if (u < 0 || !n) return 0;
    if (!name) return u;
    return (u - offsetFor(name) + n) % n;
  }
  function unlockDate(s, name) {
    if (name === undefined) name = me();
    var d = parseDate(program().programStart);
    d.setDate(d.getDate() + weekNumberFor(s, name) * 7 + (s.day === "fri" ? 3 : 0));
    return d;
  }
  function isUnlocked(s) { return isAdmin() || startOfDay(new Date()) >= unlockDate(s); }
  function thisWeekUnit() {
    var u = units(); if (!u.length) return null;
    return u[(programWeek() + offsetFor(me())) % u.length];
  }

  // Saving content (Supabase for real, this device in practice mode)
  function persistLocal() { store.set("content-local-v3", M); usingStarter = false; }
  function saveCycle(c) {
    var i = M.cycles.findIndex(function (x) { return x.id === c.id; });
    if (i > -1) M.cycles[i] = c; else M.cycles.push(c);
    rebuild();
    if (!remote) { persistLocal(); return Promise.resolve(); }
    return adminRest("training_cycles?on_conflict=id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify([{ id: c.id, title: c.title, blurb: c.blurb, updated_at: new Date().toISOString() }]) });
  }
  function deleteCycle(id) {
    M.cycles = M.cycles.filter(function (c) { return c.id !== id; });
    M.sessions = M.sessions.filter(function (s) { return s.cycle !== id; });
    rebuild();
    if (!remote) { persistLocal(); return Promise.resolve(); }
    return adminRest("training_cycles?id=eq." + id, { method: "DELETE" });
  }
  function saveSession(s) {
    var i = M.sessions.findIndex(function (x) { return x.key === s.key; });
    if (i > -1) M.sessions[i] = s; else M.sessions.push(s);
    rebuild();
    if (!remote) { persistLocal(); return Promise.resolve(); }
    return adminRest("training_sessions?on_conflict=key", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify([sessionToRow(s)]) });
  }
  function deleteSession(key) {
    M.sessions = M.sessions.filter(function (s) { return s.key !== key; });
    rebuild();
    if (!remote) { persistLocal(); return Promise.resolve(); }
    return adminRest("training_sessions?key=eq." + encodeURIComponent(key), { method: "DELETE" });
  }
  function saveSetting(key, value) {
    M.settings[key] = value;
    if (!remote) { persistLocal(); return Promise.resolve(); }
    return adminRest("training_settings?on_conflict=key", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify([{ key: key, value: value, updated_at: new Date().toISOString() }]) });
  }
  function importStarter() {
    var m = fromStarter();
    if (!remote) { M = m; persistLocal(); rebuild(); return Promise.resolve(); }
    return adminRest("training_cycles?on_conflict=id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(m.cycles) })
      .then(function () { return adminRest("training_sessions?on_conflict=key", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(m.sessions.map(sessionToRow)) }); })
      .then(function () { return saveSetting("program", m.settings.program); })
      .then(function () { return saveSetting("cheers", m.settings.cheers); })
      .then(loadContent);
  }

  // ---------- identity ----------
  function me() { return store.get("trainee", null); }
  var previewMode = false; // admin looking at a session without a trainee name: nothing is logged

  // ---------- training log ----------
  function apiInsert(rows) {
    return rest(CFG.table, { method: "POST", headers: Object.assign(anonHeaders(), { Prefer: "return=minimal" }), body: JSON.stringify(rows) });
  }
  function apiList(trainee) {
    var url = CFG.table + "?select=*&order=created_at.desc&limit=3000";
    if (trainee) url += "&trainee=eq." + encodeURIComponent(trainee);
    return rest(url, { headers: anonHeaders() });
  }
  var events = [];
  function localAll() { return store.get("events", []); }
  function flushQueue() {
    if (!remote) return Promise.resolve();
    var q = store.get("queue", []);
    if (!q.length) return Promise.resolve();
    return apiInsert(q).then(function () { store.set("queue", []); online = true; }).catch(function () { online = false; });
  }
  function loadEvents() {
    var name = me();
    if (!name) { events = []; return Promise.resolve(); }
    var local = localAll().filter(function (e) { return e.trainee === name; });
    if (!remote) { events = local; return Promise.resolve(); }
    return flushQueue().then(function () { return apiList(name); }).then(function (rows) {
      online = true;
      var queued = store.get("queue", []).filter(function (e) { return e.trainee === name; });
      events = queued.concat(rows || []);
    }).catch(function () { online = false; events = local; });
  }
  function logEvent(row) {
    row.trainee = me() || "Preview";
    row.created_at = new Date().toISOString();
    row.points = row.points || 0;
    events.unshift(row);
    if (previewMode) return;
    var all = localAll(); all.push(row); if (all.length > 4000) all = all.slice(-4000); store.set("events", all);
    if (remote) {
      apiInsert([row]).then(function () { online = true; }).catch(function () {
        online = false;
        var q = store.get("queue", []); q.push(row); store.set("queue", q);
      });
    }
  }

  // ---------- progress, points, badges ----------
  var LEVELS = [[0, "Rookie dispatcher"], [150, "Clock watcher"], [350, "Clock saver"], [600, "Board boss"], [900, "Desk legend"]];
  function points() { return events.reduce(function (a, e) { return a + (e.points || 0); }, 0); }
  function level(p) { var l = LEVELS[0][1]; LEVELS.forEach(function (x) { if (p >= x[0]) l = x[1]; }); return l; }
  function has(type, key, field) {
    return events.some(function (e) { return e.event_type === type && (key == null || e[field || "item_key"] === key); });
  }
  function sessionDone(s) {
    if (s.kind === "lesson") return has("lesson_complete", s.key, "session_key");
    var acts = s.activities || [];
    return acts.length > 0 && acts.every(function (a) { return has("activity_complete", a.id); });
  }
  var BADGES = [
    { id: "showed-up", name: "Showed up", desc: "Finished your first Tuesday lesson.", color: "var(--green)", test: function () { return has("lesson_complete"); } },
    { id: "flash", name: "Flash master", desc: "Went through a whole flashcard deck.", color: "var(--sky)", test: function () {
      return sessions.some(function (s) { return s.activities && s.activities.some(function (a) { return a.kind === "flashcards" && has("activity_complete", a.id); }); });
    } },
    { id: "clock-saver", name: "Clock saver", desc: "Picked the pro move on 3 real calls.", color: "var(--coral)", test: function () {
      var ids = {}; events.forEach(function (e) { if (e.event_type === "answer" && e.rating === "best") ids[e.item_key] = 1; });
      return Object.keys(ids).length >= 3;
    } },
    { id: "board-builder", name: "Board builder", desc: "Hit 4 or more goals on a real board.", color: "var(--sun)", test: function () {
      return events.some(function (e) { return e.event_type === "board_check" && e.meta && e.meta.hits >= 4; });
    } },
    { id: "two-weeks", name: "Two in a row", desc: "Finished sessions in two different weeks.", color: "var(--green-deep)", test: function () {
      var w = {}; sessions.forEach(function (s) { if (sessionDone(s)) w[s.cycle + "-" + s.week] = 1; });
      return Object.keys(w).length >= 2;
    } },
    { id: "full-cycle", name: "Clock keeper", desc: "Finished every session in a topic.", color: "var(--ink)", test: function () {
      return cyclesSorted.some(function (c) {
        var cs = sessions.filter(function (s) { return s.cycle === c.id && s.published; });
        return cs.length > 0 && cs.every(sessionDone);
      });
    } }
  ];
  function earned() { return BADGES.filter(function (b) { return b.test(); }).map(function (b) { return b.id; }); }
  function checkBadges(before) {
    earned().forEach(function (id) {
      if (before.indexOf(id) === -1) {
        var b = BADGES.filter(function (x) { return x.id === id; })[0];
        logEvent({ event_type: "badge", item_key: id, points: 25 });
        setTimeout(function () { toast("New badge: " + b.name + ". +25 points"); confetti(); }, 900);
      }
    });
    renderWho();
  }
  function withBadges(fn) { var before = earned(); fn(); checkBadges(before); }

  // ---------- toast + confetti ----------
  var toastTimer;
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2800);
  }
  function confetti() {
    if (reduceMotion) return;
    var cv = document.getElementById("confetti"), ctx = cv.getContext("2d");
    var W = cv.width = window.innerWidth, H = cv.height = window.innerHeight;
    var cs = getComputedStyle(document.documentElement);
    var colors = ["--green", "--sun", "--sky", "--coral", "--mint"].map(function (v) { return cs.getPropertyValue(v).trim() || "#0b7a4b"; });
    var parts = [];
    for (var i = 0; i < 140; i++) {
      parts.push({ x: W / 2 + (Math.random() - .5) * 120, y: H * 0.35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, s: 6 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: colors[i % colors.length] });
    }
    var start = performance.now();
    (function frame(t) {
      ctx.clearRect(0, 0, W, H);
      parts.forEach(function (p) {
        p.vy += 0.38; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.vx *= 0.99;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore();
      });
      if (t - start < 2600) requestAnimationFrame(frame); else ctx.clearRect(0, 0, W, H);
    })(start);
  }

  // ---------- top bar ----------
  function renderWho() {
    var name = me();
    var html = "";
    if (name) {
      var p = points();
      html += '<span class="pill">' + esc(name) + "</span>";
      html += '<span class="pill sun num">' + p + " pts</span>";
      html += '<span class="pill hide-sm">' + esc(level(p)) + "</span>";
      html += '<button class="pill link" id="switchBtn">Switch</button>';
    }
    html += '<button class="pill link" id="adminBtn">' + (isAdmin() ? "Admin" : "Admin sign in") + "</button>";
    who.innerHTML = html;
    var sw = document.getElementById("switchBtn");
    if (sw) sw.onclick = function () { store.set("pinok:" + me(), null); store.set("trainee", null); events = []; location.hash = "home"; route(); };
    document.getElementById("adminBtn").onclick = function () { location.hash = "admin"; };
  }

  // ---------- router ----------
  function stopSpeech() { try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) { } }
  var cleanup = null;
  function route() {
    if (cleanup) { cleanup(); cleanup = null; }
    stopSpeech();
    var h = (location.hash || "").replace("#", "");
    window.scrollTo(0, 0);
    previewMode = false;
    renderWho();
    if (h === "admin" || h === "admin-log" || h === "admin-settings") return renderAdmin(h);
    if (h.indexOf("edit-") === 0) return isAdmin() ? renderEditor(h.slice(5)) : renderAdmin("admin");
    if (h.indexOf("s-") === 0) {
      var s = sessionByKey(h.slice(2));
      if (s && me() && pinFor(me()) && store.get("pinok:" + me(), null) !== pinFor(me()) && !isAdmin()) return renderPin(me());
      if (s && isUnlocked(s) && (me() || isAdmin())) {
        if (!me()) { previewMode = true; events = []; }
        return s.kind === "lesson" ? renderLesson(s) : renderPlay(s);
      }
    }
    if (!me()) return renderPicker();
    if (pinFor(me()) && store.get("pinok:" + me(), null) !== pinFor(me())) return renderPin(me());
    renderHome();
  }

  function renderPicker() {
    var names = program().trainees || [];
    view.innerHTML =
      '<section class="picker">' +
      "<h1>Who's on the desk today?</h1>" +
      "<p>Pick your name. Your points, badges and progress follow you.</p>" +
      '<div class="choices">' + names.map(function (n) { return '<button class="big-name" data-n="' + esc(n) + '">' + esc(n) + "</button>"; }).join("") + "</div>" +
      "</section>";
    view.querySelectorAll(".big-name").forEach(function (b) {
      b.onclick = function () {
        var n = b.getAttribute("data-n");
        if (pinFor(n)) return renderPin(n);
        enterAs(n);
      };
    });
  }
  function pinFor(n) { var p = program().pins || {}; return p[n] || null; }
  function enterAs(n) { store.set("trainee", n); loadEvents().then(function () { location.hash = "home"; route(); }); }
  function hashPin(name, pin) {
    var data = new TextEncoder().encode("dispatch-desk|" + String(name).toLowerCase() + "|" + pin);
    return crypto.subtle.digest("SHA-256", data).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (x) { return ("0" + x.toString(16)).slice(-2); }).join("");
    });
  }
  function renderPin(n) {
    view.innerHTML = '<section class="picker"><h1>Hi, ' + esc(n) + '.</h1><p>Enter your PIN to open your board.</p>' +
      '<form class="pin-form" id="pf"><label for="pin" class="sr">PIN</label><input class="input pin" id="pin" type="password" inputmode="numeric" autocomplete="off" maxlength="8" placeholder="PIN">' +
      '<button class="btn primary" type="submit">Open my board</button></form><p class="err" id="perr" hidden></p>' +
      '<button class="back" id="notMe">Not ' + esc(n) + '? Pick another name</button></section>';
    var inp = document.getElementById("pin"); inp.focus();
    document.getElementById("notMe").onclick = function () { store.set("trainee", null); renderPicker(); };
    document.getElementById("pf").onsubmit = function (ev) {
      ev.preventDefault();
      hashPin(n, inp.value.trim()).then(function (h) {
        if (h === pinFor(n)) { store.set("pinok:" + n, h); enterAs(n); }
        else { var e = document.getElementById("perr"); e.textContent = "That PIN doesn't match. Try again, or ask Qais to reset it."; e.hidden = false; inp.value = ""; inp.focus(); }
      });
    };
  }

  // ---------- home ----------
  function dialSVG(done, total) {
    var r = 104, cx = 130, cy = 130, circ = 2 * Math.PI * r;
    var frac = total ? done / total : 0;
    var ticks = "";
    for (var i = 0; i < 12; i++) {
      var a = (i / 12) * 2 * Math.PI - Math.PI / 2;
      var r1 = i % 3 === 0 ? 80 : 86, r2 = 92;
      ticks += '<line x1="' + (cx + r1 * Math.cos(a)).toFixed(1) + '" y1="' + (cy + r1 * Math.sin(a)).toFixed(1) + '" x2="' + (cx + r2 * Math.cos(a)).toFixed(1) + '" y2="' + (cy + r2 * Math.sin(a)).toFixed(1) + '" stroke="var(--muted)" stroke-width="' + (i % 3 === 0 ? 4 : 2) + '" stroke-linecap="round"/>';
    }
    return '<svg class="dial" viewBox="0 0 260 260" role="img" aria-label="' + done + " of " + total + ' sessions done this cycle">' +
      '<circle cx="130" cy="130" r="122" fill="var(--surface)"/>' +
      '<circle cx="130" cy="130" r="' + r + '" fill="none" stroke="var(--line)" stroke-width="14"/>' +
      '<circle id="dialArc" cx="130" cy="130" r="' + r + '" fill="none" stroke="var(--green)" stroke-width="14" stroke-linecap="round" stroke-dasharray="' + circ.toFixed(1) + '" stroke-dashoffset="' + circ.toFixed(1) + '" transform="rotate(-90 130 130)" style="transition: stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)" data-to="' + (circ * (1 - frac)).toFixed(1) + '"/>' +
      ticks +
      '<g id="dialHand" style="transform-origin:130px 130px; transform: rotate(0deg); transition: transform 1.4s cubic-bezier(.2,.8,.2,1)" data-to="' + (frac * 360) + '"><line x1="130" y1="130" x2="130" y2="62" stroke="var(--sun)" stroke-width="7" stroke-linecap="round"/></g>' +
      '<circle cx="130" cy="130" r="9" fill="var(--ink)"/>' +
      '<text x="130" y="178" text-anchor="middle" font-family="var(--display)" font-weight="800" font-size="30" fill="var(--ink)">' + done + "/" + total + "</text>" +
      "</svg>";
  }
  var GLYPH_LEARN = '<svg class="glyph" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="8"/><path d="M40 30 L72 50 L40 70Z" fill="currentColor"/></svg>';
  var GLYPH_PLAY = '<svg class="glyph" viewBox="0 0 100 100" aria-hidden="true"><rect x="14" y="22" width="46" height="62" rx="8" fill="none" stroke="currentColor" stroke-width="8" transform="rotate(-10 37 53)"/><rect x="40" y="16" width="46" height="62" rx="8" fill="currentColor" transform="rotate(8 63 47)"/></svg>';

  function dayCard(s) {
    if (!s) return "";
    var open = isUnlocked(s), done = sessionDone(s);
    var cls = "day-card " + (s.kind === "lesson" ? "learn" : "play") + (open ? "" : " locked") + (done ? " done" : "");
    var dayLabel = s.kind === "lesson" ? "Tuesday. Learn" : "Friday. Play";
    var meta = s.kind === "lesson" ? s.minutes + " min. Watch it or click through it." : s.minutes + " min. Flashcards, real calls, real boards.";
    var go = !open ? "Opens " + fmtDay(unlockDate(s)) : done ? "Done. Play it again" : "Start";
    return '<button class="' + cls + '" ' + (open ? 'data-go="' + esc(s.key) + '"' : 'aria-disabled="true"') + ">" +
      '<span class="day">' + dayLabel + "</span><h3>" + esc(s.title) + '</h3><span class="meta">' + meta + '</span><span class="go">' + go + "</span>" +
      (s.kind === "lesson" ? GLYPH_LEARN : GLYPH_PLAY) + "</button>";
  }
  function badgeIcon(b, on) {
    return '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" fill="' + b.color + '"/><circle cx="24" cy="24" r="15" fill="none" stroke="var(--surface)" stroke-width="3"/>' +
      (on ? '<path d="M16 24.5l5.5 5.5L33 18" fill="none" stroke="var(--surface)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' : '<circle cx="24" cy="24" r="4" fill="var(--surface)"/>') + "</svg>";
  }
  function renderHome() {
    if (!cyclesSorted.length) {
      view.innerHTML = '<section class="picker"><h1>Training starts soon.</h1><p>There are no sessions yet. Check back on Tuesday.</p></section>';
      return;
    }
    var tu = thisWeekUnit();
    var visible = sessions.filter(function (s) { return s.published; }).sort(function (a, b) { return unlockDate(a) - unlockDate(b); });
    if (!tu || !visible.length) {
      view.innerHTML = '<section class="picker"><h1>Training starts soon.</h1><p>There are no sessions yet. Check back on Tuesday.</p></section>';
      return;
    }
    var topic = cycleById(tu.cycle);
    var done = visible.filter(sessionDone).length;
    var thisWeek = visible.filter(function (s) { return s.cycle === tu.cycle && +s.week === tu.week; });
    var hr = new Date().getHours();
    var hi = hr < 12 ? "Morning" : hr < 17 ? "Afternoon" : "Evening";
    var have = earned();

    view.innerHTML =
      '<section class="hero"><div>' +
      "<h1>" + hi + ", " + esc(me()) + ".</h1>" +
      '<p class="sub">Week ' + (programWeek() + 1) + ". This week's topic: " + esc(topic ? topic.title : "") + ".</p>" +
      '<p class="note">This is practice, not a test. Every answer earns points, and every answer comes with a better move to try next time.</p>' +
      (remote && !online ? '<p class="note">Saving is paused because the training log can\'t be reached. Your progress is kept on this device and will catch up on its own.</p>' : "") +
      '</div><div class="dial-box">' + dialSVG(done, visible.length) + '<p class="dial-cap">sessions done so far</p></div></section>' +
      '<section class="rules" aria-label="Desk rules"><div><b>Save the 12-hour clock first.</b><span>Calls that can still make 12 hours go to the top of the board.</span></div><div><b>Fill every board.</b><span>Leftover jobs roll over. Empty hours are gone.</span></div><div><b>Tell them before they ask.</b><span>Techs, stores and Coke hear it from us first.</span></div></section>' +
      '<div class="section-head"><h2>This week</h2><span>New lesson every Tuesday, new games every Friday</span></div>' +
      '<section class="week">' + dayCard(thisWeek.filter(function (s) { return s.day === "tue"; })[0]) + dayCard(thisWeek.filter(function (s) { return s.day === "fri"; })[0]) + "</section>" +
      '<div class="section-head"><h2>Badges</h2><span class="num">' + have.length + " of " + BADGES.length + "</span></div>" +
      '<section class="badges">' + BADGES.map(function (b) {
        var on = have.indexOf(b.id) > -1;
        return '<div class="badge' + (on ? "" : " off") + '">' + badgeIcon(b, on) + "<b>" + esc(b.name) + "</b><span>" + esc(b.desc) + "</span></div>";
      }).join("") + "</section>" +
      '<div class="section-head"><h2>Every session</h2><span>Replays earn new feedback, not new points</span></div>' +
      '<section class="path">' + visible.map(function (s) {
        var open = isUnlocked(s), d = sessionDone(s);
        return '<button class="path-row" ' + (open ? 'data-go="' + esc(s.key) + '"' : 'aria-disabled="true" style="cursor:default"') + ">" +
          '<span class="when num">' + fmtDay(unlockDate(s)) + "</span>" +
          '<span><span class="t">' + esc(s.title) + '</span><br><span class="k">' + esc((cycleById(s.cycle) || {}).title || "") + ". " + (s.kind === "lesson" ? "Learn" : "Play") + "</span></span>" +
          '<span class="state ' + (d ? "done" : open ? "ready" : "locked") + '">' + (d ? "Done" : open ? "Ready" : "Locked") + "</span></button>";
      }).join("") + "</section>";
    view.querySelectorAll("[data-go]").forEach(function (b) { b.onclick = function () { location.hash = "s-" + b.getAttribute("data-go"); }; });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var arc = document.getElementById("dialArc"), hand = document.getElementById("dialHand");
        if (arc) arc.setAttribute("stroke-dashoffset", arc.getAttribute("data-to"));
        if (hand) hand.style.transform = "rotate(" + hand.getAttribute("data-to") + "deg)";
      });
    });
  }

  // ---------- lesson player ----------
  function hasTicket(t) { return t && (t.store || t.wo); }
  function ticketHTML(t) {
    return '<div class="ticket"><div class="stripe"></div><div class="body">' +
      (t.wo ? '<span class="wo">WO <b class="num">' + esc(t.wo) + "</b>" + (t.category ? ". " + esc(t.category) : "") + "</span>" : "") +
      '<span class="store">' + esc(t.store) + '</span><span class="addr">' + esc(t.address) + "</span>" +
      '<div class="clock-row">' + (t.created ? '<span class="chip start">Came in: ' + esc(t.created) + "</span>" : "") + (t.clockEnds ? '<span class="chip end">12-hour clock ends: ' + esc(t.clockEnds) + "</span>" : "") +
      (t.status ? '<span class="chip status">' + esc(t.status) + "</span>" : "") + "</div></div></div>";
  }
  function passfailSVG() {
    function x(h) { return 20 + (h / 40) * 600; }
    return '<div class="timeline-36"><svg viewBox="0 0 640 120" role="img" aria-label="Hours 0 to 40. Calls done at hour 13 and hour 30 both miss the 12 hour mark.">' +
      '<rect x="' + x(0) + '" y="52" width="' + (x(12) - x(0)) + '" height="16" rx="8" fill="var(--green)"/>' +
      '<rect x="' + x(12) + '" y="52" width="' + (x(36) - x(12)) + '" height="16" fill="var(--line)"/>' +
      '<rect x="' + x(36) + '" y="52" width="' + (x(40) - x(36)) + '" height="16" rx="8" fill="var(--coral)"/>' +
      [0, 12, 36].map(function (h) { return '<text x="' + x(h) + '" y="92" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)">' + h + "h</text>"; }).join("") +
      '<text x="' + x(6) + '" y="112" text-anchor="middle" font-size="13" fill="var(--muted)">Made CT&lt;12</text>' +
      '<text x="' + x(24) + '" y="112" text-anchor="middle" font-size="13" fill="var(--muted)">Missed CT&lt;12</text>' +
      '<text x="' + x(38) + '" y="112" text-anchor="middle" font-size="13" fill="var(--muted)">CT&gt;36</text>' +
      [13, 30].map(function (h, i) {
        return '<g style="animation: rise .5s ease ' + (0.3 + i * 0.4) + 's both"><circle cx="' + x(h) + '" cy="60" r="11" fill="var(--sun)" stroke="var(--ink)" stroke-width="2"/>' +
          '<text x="' + x(h) + '" y="30" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)">Done at hour ' + h + "</text></g>";
      }).join("") + "</svg></div>";
  }
  function slideHTML(sl) {
    switch (sl.kind) {
      case "cover": return "<h2>" + esc(sl.title) + '</h2><p class="lead">' + esc(sl.sub) + "</p>";
      case "metrics":
        return "<h2>" + esc(sl.title) + '</h2><div class="metrics">' + (sl.items || []).map(function (m) {
          return '<div class="metric"><span class="n">' + esc(m.name) + '</span><span class="tg">Target: ' + esc(m.target) + "</span><p>" + esc(m.means) + '</p><p class="d">Dispatch controls: ' + esc(m.dispatch) + "</p></div>";
        }).join("") + "</div>";
      case "passfail": return "<h2>" + esc(sl.title) + "</h2>" + passfailSVG() + '<p class="lead">' + esc(sl.text) + "</p>";
      case "bars":
        var tg = +sl.target || 0;
        return "<h2>" + esc(sl.title) + '</h2><div class="bars">' + (sl.rows || []).map(function (r) {
          var v = +r.value || 0;
          return '<div class="bar-row"><span>' + esc(r.label) + '</span><div class="bar-track"><div class="bar-fill' + (v >= tg ? " hit" : "") + '" data-w="' + Math.max(0, Math.min(100, v)) + '"></div><div class="bar-target" style="left:' + tg + '%"></div></div><b class="num">' + v.toFixed(1) + "%</b></div>";
        }).join("") + '<p class="bar-note">' + esc(sl.note) + " The dark line is the target.</p></div>";
      case "steps":
        return "<h2>" + esc(sl.title) + '</h2><ol class="steps">' + (sl.steps || []).map(function (s) { return "<li><span><b>" + esc(s.h) + "</b>" + esc(s.p) + "</span></li>"; }).join("") + "</ol>";
      case "ticket":
        return "<h2>" + esc(sl.title) + '</h2><div class="ticket-grid"><div style="display:grid;gap:16px;min-width:0">' + ticketHTML(sl.ticket || {}) + (sl.lesson ? '<div class="lesson-box">' + esc(sl.lesson) + "</div>" : "") + '</div><ol class="tl">' +
          (sl.timeline || []).map(function (t, i) { return '<li style="animation-delay:' + (i * 0.12) + 's"><b>' + esc(t.when) + "</b><span>" + esc(t.what) + "</span></li>"; }).join("") + "</ol></div>";
      case "list": return "<h2>" + esc(sl.title) + '</h2><ul class="bullets">' + (sl.items || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>";
      case "think":
        return "<h2>" + esc(sl.title) + "</h2>" + (sl.facts && sl.facts.length ? '<ul class="bullets facts">' + sl.facts.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" : "") +
          '<p class="think-q">' + esc(sl.question) + '</p><button class="btn primary" onclick="this.hidden=true;this.nextElementSibling.hidden=false">Show the answer</button><div class="lesson-box think-a" hidden><b>' + esc(sl.answer) + "</b>" + (sl.why ? "<p>" + esc(sl.why) + "</p>" : "") + "</div>";
      case "mission": return "<h2>" + esc(sl.title) + '</h2><p class="lead">' + esc(sl.text) + "</p>";
      case "columns":
        return "<h2>" + esc(sl.title) + '</h2><div class="cols">' + (sl.columns || []).map(function (c, i) {
          return '<div class="col" style="animation-delay:' + (i * 0.1) + 's"><b>' + esc(c.head) + "</b><ul>" + (c.items || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div>";
        }).join("") + "</div>" + (sl.caption ? '<p class="lead cap">' + esc(sl.caption) + "</p>" : "");
      case "stat":
        return "<h2>" + esc(sl.title) + '</h2><div class="stat"><span class="big num">' + esc(sl.big) + '</span><span class="lbl">' + esc(sl.label) + "</span></div>" + (sl.text ? '<p class="lead">' + esc(sl.text) + "</p>" : "");
      case "shifts":
        return "<h2>" + esc(sl.title) + "</h2>" + shiftsHTML(sl.rows || []) + (sl.caption ? '<p class="lead cap">' + esc(sl.caption) + "</p>" : "");
    }
    return "<h2>" + esc(sl.title) + "</h2>";
  }
  var WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function daysOn(spec) {
    var on = {}, parts = String(spec || "").split(",");
    parts.forEach(function (p) {
      var r = p.trim().split("-").map(function (x) { return WEEK.indexOf(x.trim().slice(0, 3)); });
      if (r[0] < 0) return;
      if (r.length === 1 || r[1] < 0) { on[r[0]] = 1; return; }
      for (var i = r[0], guard = 0; guard < 8; i = (i + 1) % 7, guard++) { on[i] = 1; if (i === r[1]) break; }
    });
    return on;
  }
  function shiftsHTML(rows) {
    return '<div class="shift-box"><table class="shifts"><thead><tr><th>Tech</th>' + WEEK.map(function (d) { return "<th>" + d + "</th>"; }).join("") + "<th>Hours</th></tr></thead><tbody>" +
      rows.map(function (r) {
        var on = daysOn(r.days);
        return "<tr><td><b>" + esc(r.name) + "</b>" + (r.base ? '<span class="k">' + esc(r.base) + "</span>" : "") + "</td>" +
          WEEK.map(function (_, i) { return '<td><span class="sh ' + (on[i] ? (r.type === "evening" ? "eve" : "day") : "off") + '" aria-label="' + (on[i] ? "on" : "off") + '"></span></td>'; }).join("") +
          '<td class="num">' + esc(r.hours) + "</td></tr>";
      }).join("") + '</tbody></table></div><p class="k legend"><span class="sh day"></span> Day shift <span class="sh eve"></span> Evening shift</p>';
  }
  function previewBar() {
    return previewMode ? '<p class="banner">Admin preview. Nothing here is logged. <button class="pill link" style="color:inherit" onclick="location.hash=\'admin\'">Back to admin</button></p>' : "";
  }
  function renderLesson(s) {
    var slides = s.slides || [];
    if (!slides.length) { view.innerHTML = previewBar() + '<p class="banner">This lesson has no slides yet.</p>'; return; }
    var idx = 0, started = Date.now(), watching = false, timer = null;
    // Reading gate: each slide has a short reading time (about 5 words a second), then "I read this" unlocks Next.
    var read = {}, gateTimer = null, freeRun = previewMode || sessionDone(s);
    logEvent({ event_type: "session_open", session_key: s.key });
    var voice = "speechSynthesis" in window;
    view.innerHTML = previewBar() +
      '<section class="player">' +
      '<div class="player-top"><button class="back" id="backBtn">Back to the desk</button><div class="segs" id="segs"></div></div>' +
      '<div class="stage" id="stage"></div>' +
      '<div class="controls"><div class="btn-row"><button class="btn" id="prevBtn">Back</button><button class="btn watch" id="watchBtn">' + (voice ? "Watch it" : "Play it") + '</button></div>' +
      '<button class="readchk" id="readBtn" type="button"><span class="fill" id="readFill"></span><span class="box" aria-hidden="true"></span><span id="readTxt">Reading...</span></button><button class="btn primary" id="nextBtn">Next</button></div></section>';
    var stage = document.getElementById("stage");
    document.getElementById("backBtn").onclick = function () { location.hash = previewMode ? "admin" : "home"; };
    function paint() {
      var sl = slides[idx];
      stage.className = "stage k-" + sl.kind;
      stage.innerHTML = '<div class="slide">' + slideHTML(sl) + "</div>";
      document.getElementById("segs").innerHTML = slides.map(function (_, i) { return '<span class="seg' + (i <= idx ? " past" : "") + '"><i></i></span>'; }).join("");
      document.getElementById("prevBtn").disabled = idx === 0;
      document.getElementById("nextBtn").textContent = idx === slides.length - 1 ? "Finish lesson" : "Next";
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        stage.querySelectorAll(".bar-fill").forEach(function (b) { b.style.width = b.getAttribute("data-w") + "%"; });
      }); });
      gate();
      if (watching) narrate();
    }
    function gate() {
      clearInterval(gateTimer);
      var btn = document.getElementById("readBtn"), next = document.getElementById("nextBtn"), fill = document.getElementById("readFill"), txt = document.getElementById("readTxt");
      if (freeRun || read[idx]) { btn.className = "readchk done"; btn.disabled = true; fill.style.width = "100%"; txt.textContent = freeRun && !read[idx] ? "Already done" : "Read"; next.disabled = false; return; }
      var words = (stage.innerText || "").split(/\s+/).filter(Boolean).length;
      var need = Math.max(3, Math.min(45, Math.round(words / 5))) * 1000, t0 = Date.now();
      btn.className = "readchk"; btn.disabled = true; next.disabled = true; fill.style.width = "0%"; txt.textContent = "Reading...";
      function needsReveal() { var b = stage.querySelector(".think-a"); return b && b.hidden; }
      function tick() {
        var f = Math.min(1, (Date.now() - t0) / need);
        fill.style.width = (f * 100) + "%";
        if (f >= 1) {
          if (needsReveal()) { txt.textContent = "Show the answer first"; return; }
          clearInterval(gateTimer); btn.disabled = false; btn.className = "readchk ready"; txt.textContent = "I read this";
          if (watching) markRead();
        }
      }
      gateTimer = setInterval(tick, 150); tick();
    }
    function markRead() {
      read[idx] = true; clearInterval(gateTimer);
      var btn = document.getElementById("readBtn");
      btn.className = "readchk done pop"; btn.disabled = true; document.getElementById("readTxt").textContent = "Read";
      document.getElementById("nextBtn").disabled = false;
      logEvent({ event_type: "slide_read", session_key: s.key, item_key: s.key + ":" + idx });
    }
    document.getElementById("readBtn").onclick = function () { if (!this.disabled) markRead(); };
    function narrate() {
      clearTimeout(timer); stopSpeech();
      var sl = slides[idx];
      var advance = function () {
        if (!watching) return;
        if (!read[idx] && !freeRun) { timer = setTimeout(advance, 500); return; }
        if (idx < slides.length - 1) { idx++; paint(); } else { setWatch(false); }
      };
      if (voice) {
        try {
          var u = new SpeechSynthesisUtterance(sl.narration || sl.title || "");
          u.rate = 1.02;
          u.onend = function () { timer = setTimeout(advance, 700); };
          window.speechSynthesis.speak(u);
          return;
        } catch (e) { }
      }
      timer = setTimeout(advance, 9000);
    }
    function setWatch(on) {
      watching = on;
      var b = document.getElementById("watchBtn");
      b.classList.toggle("on", on);
      b.textContent = on ? "Pause" : (voice ? "Watch it" : "Play it");
      if (on) narrate(); else { clearTimeout(timer); stopSpeech(); }
    }
    document.getElementById("watchBtn").onclick = function () { setWatch(!watching); };
    document.getElementById("prevBtn").onclick = function () { if (idx > 0) { idx--; paint(); } };
    document.getElementById("nextBtn").onclick = function () {
      if (this.disabled) return;
      if (idx < slides.length - 1) { idx++; paint(); return; }
      setWatch(false); finish();
    };
    function onKey(e) {
      if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
      if (e.key === "ArrowRight") document.getElementById("nextBtn").click();
      if (e.key === "ArrowLeft") document.getElementById("prevBtn").click();
    }
    document.addEventListener("keydown", onKey);
    cleanup = function () { clearTimeout(timer); clearInterval(gateTimer); stopSpeech(); document.removeEventListener("keydown", onKey); };
    function finish() {
      var first = !sessionDone(s);
      var secs = Math.round((Date.now() - started) / 1000);
      withBadges(function () { logEvent({ event_type: "lesson_complete", session_key: s.key, points: first ? 50 : 0, duration_sec: secs }); });
      confetti();
      var next = sessions.filter(function (x) { return x.cycle === s.cycle && +x.week === +s.week && x.day === "fri" && x.published; })[0];
      stage.className = "stage k-mission";
      stage.innerHTML = '<div class="slide"><h2>Lesson done.</h2><p class="lead">' +
        (first ? "+50 points. " : "Nice refresher. ") + "You spent " + Math.max(1, Math.round(secs / 60)) + " minutes making the desk sharper." +
        (next ? " Friday brings " + esc(next.title.toLowerCase()) + "." : "") + "</p></div>";
      document.querySelector(".controls").innerHTML = '<span></span><button class="btn sun" id="homeBtn">Back to the desk</button>';
      document.getElementById("homeBtn").onclick = function () { location.hash = previewMode ? "admin" : "home"; };
    }
    paint();
  }

  // ---------- play room ----------
  function renderPlay(s) {
    var acts = s.activities || [];
    logEvent({ event_type: "session_open", session_key: s.key });
    var active = 0;
    view.innerHTML = previewBar() +
      '<section class="play-head"><button class="back" id="backBtn" style="justify-self:start">Back to the desk</button>' +
      "<h1>" + esc(s.title) + "</h1><p>Play as long as you like. Every pick earns points, and the pro move is always shown after.</p>" +
      '<div class="tabs" role="tablist" id="tabs"></div></section><section id="act" style="margin-top:24px"></section>';
    document.getElementById("backBtn").onclick = function () { location.hash = previewMode ? "admin" : "home"; };
    if (!acts.length) { document.getElementById("act").innerHTML = '<p class="banner">This session has no activities yet.</p>'; return; }
    function tabs() {
      document.getElementById("tabs").innerHTML = acts.map(function (a, i) {
        var d = has("activity_complete", a.id);
        return '<button class="tab" role="tab" aria-selected="' + (i === active) + '" data-i="' + i + '">' + esc(a.title) + (d ? " (done)" : "") + "</button>";
      }).join("");
      document.querySelectorAll(".tab").forEach(function (t) { t.onclick = function () { active = +t.getAttribute("data-i"); tabs(); show(); }; });
    }
    function completeActivity(a) {
      if (!has("activity_complete", a.id)) {
        withBadges(function () { logEvent({ event_type: "activity_complete", session_key: s.key, item_key: a.id, points: 20 }); });
        toast(a.title + " done. +20 points");
      }
      tabs();
    }
    function show() {
      var a = acts[active], box = document.getElementById("act");
      if (a.kind === "flashcards") flashcards(a, box, s, completeActivity);
      if (a.kind === "scenarios") scenarios(a, box, s, completeActivity);
      if (a.kind === "board") boardGame(a, box, s, completeActivity);
      if (a.kind === "map") mapGame(a, box, s, completeActivity);
      if (a.kind === "spot") spotGame(a, box, s, completeActivity);
      if (a.kind === "clock") clockGame(a, box, s, completeActivity);
    }
    tabs(); show();
  }

  function flashcards(a, box, s, done) {
    var cards = a.cards || [];
    if (!cards.length) { box.innerHTML = '<p class="banner">No cards in this deck yet.</p>'; return; }
    var order = cards.map(function (_, i) { return i; });
    var pos = 0, seen = {};
    function paint() {
      if (pos >= order.length) {
        box.innerHTML = '<div class="deck"><div class="feedback best" style="width:min(560px,100%)"><h3>Deck done.</h3><p>Every card in the deck, start to finish. That is how it sticks.</p><div class="btn-row"><button class="btn sun" id="again">Shuffle and go again</button></div></div></div>';
        confetti(); done(a);
        document.getElementById("again").onclick = function () { order = cards.map(function (_, i) { return i; }).sort(function () { return Math.random() - .5; }); pos = 0; paint(); };
        return;
      }
      var c = cards[order[pos]];
      box.innerHTML = '<div class="deck"><span class="deck-count num">Card ' + (pos + 1) + " of " + order.length + "</span>" +
        '<div class="flip" id="card" role="button" tabindex="0" aria-label="Flashcard. Press to flip."><div class="flip-inner"><div class="face front"><p>' + esc(c.q) + '</p><span class="hint-flip">Tap the card to see the answer</span></div><div class="face back"><p>' + esc(c.a) + "</p></div></div></div>" +
        '<div class="btn-row" id="cardBtns" hidden><button class="btn" id="againBtn">Show me again later</button><button class="btn primary" id="gotBtn">Got it</button></div></div>';
      var card = document.getElementById("card");
      var flip = function () { card.classList.toggle("turned"); document.getElementById("cardBtns").hidden = false; };
      card.onclick = flip;
      card.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } };
      document.getElementById("gotBtn").onclick = function () {
        var key = a.id + ":" + order[pos];
        var first = !has("card", key);
        if (!seen[key]) { logEvent({ event_type: "card", session_key: s.key, item_key: key, choice: "got", points: first ? 5 : 0 }); seen[key] = 1; renderWho(); }
        pos++; paint();
      };
      document.getElementById("againBtn").onclick = function () {
        logEvent({ event_type: "card", session_key: s.key, item_key: a.id + ":" + order[pos], choice: "again", points: 0 });
        order.push(order[pos]); pos++; paint();
      };
    }
    paint();
  }

  var RATE_LABEL = { best: "Pro move", good: "Good move", ok: "Safe move", miss: "Costly move" };
  var RATE_PTS = { best: 30, good: 20, ok: 10, miss: 2 };
  function rateOf(x) { return x && RATE_PTS.hasOwnProperty(x) ? x : "ok"; }
  // Stable shuffle so the pro move is never in a fixed spot, but the order stays the same on replay.
  function shuffled(n, seed) {
    var h = 2166136261, str = String(seed);
    for (var c = 0; c < str.length; c++) { h ^= str.charCodeAt(c); h = Math.imul(h, 16777619); }
    var idx = []; for (var q = 0; q < n; q++) idx.push(q);
    for (var w = n - 1; w > 0; w--) { h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; var r = h % (w + 1); var tmp = idx[w]; idx[w] = idx[r]; idx[r] = tmp; }
    return idx;
  }
  function scenarios(a, box, s, done) {
    var items = a.items || [];
    if (!items.length) { box.innerHTML = '<p class="banner">No calls in this set yet.</p>'; return; }
    var i = 0;
    function paint() {
      if (i >= items.length) {
        box.innerHTML = '<div class="feedback best"><h3>All calls handled.</h3><p>Every one of these was a real job on our board. You just practiced the moves that save them.</p><div class="btn-row"><button class="btn sun" id="replay">Play them again</button></div></div>';
        confetti(); done(a);
        document.getElementById("replay").onclick = function () { i = 0; paint(); };
        return;
      }
      var it = items[i];
      box.innerHTML = '<div class="scenario">' +
        '<span class="when-line">Call ' + (i + 1) + " of " + items.length + (it.when ? ". " + esc(it.when) : "") + "</span>" +
        (hasTicket(it.ticket) ? ticketHTML(it.ticket) : "") +
        (it.context && it.context.length ? '<ul class="ctx">' + it.context.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>" : "") +
        '<p class="prompt">' + esc(it.prompt) + '</p><div class="options" id="opts">' +
        shuffled((it.options || []).length, a.id + it.id).map(function (k) { var o = it.options[k]; return '<button class="opt" data-k="' + k + '">' + esc(o.label) + "</button>"; }).join("") +
        '</div><div id="fb"></div></div>';
      box.querySelectorAll(".opt").forEach(function (b) { b.onclick = function () { choose(it, +b.getAttribute("data-k")); }; });
    }
    function choose(it, k) {
      var o = it.options[k];
      var rating = rateOf(o.rating);
      var key = a.id + ":" + it.id;
      var first = !has("answer", key);
      var pts = first ? RATE_PTS[rating] : 0;
      withBadges(function () { logEvent({ event_type: "answer", session_key: s.key, item_key: key, choice: o.label, rating: rating, points: pts }); });
      box.querySelectorAll(".opt").forEach(function (b) {
        var j = +b.getAttribute("data-k");
        b.disabled = true;
        var r = rateOf(it.options[j].rating);
        b.innerHTML = esc(it.options[j].label) + '<br><span class="rate ' + r + '">' + RATE_LABEL[r] + "</span>";
        if (j === k) b.classList.add("picked");
      });
      var bestOpts = it.options.filter(function (x) { return x.rating === "best"; });
      var lines = cheers()[rating] || STARTER.cheers[rating];
      var fb = '<div class="feedback ' + rating + '"><h3>' + esc(pick(lines)) + "</h3><p>" + esc(o.why) + "</p>";
      if (rating !== "best") {
        if (bestOpts.length) fb += "<p><b>The pro move:</b> " + esc(bestOpts.map(function (x) { return x.label; }).join(" Or: ")) + "</p>";
        if (o.better && o.better.length) fb += "<ol>" + o.better.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ol>";
      }
      fb += '<p class="pts">' + (pts ? "+" + pts + " points" : "Replay. Points were banked the first time.") + '</p><div class="btn-row"><button class="btn ' + (rating === "best" ? "sun" : "primary") + '" id="nextQ">' + (i < items.length - 1 ? "Next call" : "Wrap it up") + "</button></div></div>";
      document.getElementById("fb").innerHTML = fb;
      if (rating === "best") confetti();
      document.getElementById("nextQ").onclick = function () { i++; paint(); window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); };
      document.getElementById("fb").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    }
    paint();
  }

  function boardGame(a, box, s, done) {
    var lanes = a.lanes || [], jobs = a.jobs || [], goals = a.goals || [];
    var saveKey = "board:" + (me() || "preview") + ":" + a.id;
    var start = {}; jobs.forEach(function (j) { start[j.id] = j.lane; });
    var assign = Object.assign({}, start, store.get(saveKey, {}) || {});
    Object.keys(assign).forEach(function (k) { if (!(k in start)) delete assign[k]; });
    var sel = null, results = null;
    function evalGoals() {
      return goals.map(function (g) {
        var t = g.test || {}, hit = false;
        if (t.job) hit = (t.lanes || []).indexOf(assign[t.job]) > -1;
        if (t.together) hit = t.together.every(function (j) { return assign[j] === assign[t.together[0]]; }) && assign[t.together[0]] !== "unscheduled";
        if (t.minJobs) hit = Object.keys(assign).filter(function (j) { return assign[j] === t.minJobs.lane; }).length >= +t.minJobs.n;
        if (t.maxJobs) hit = Object.keys(assign).filter(function (j) { return assign[j] === t.maxJobs.lane; }).length <= +t.maxJobs.n;
        if (t.jobs) hit = t.jobs.every(function (j) { return (t.lanes || []).indexOf(assign[j]) > -1; });
        if (t.emptyLane) hit = !Object.keys(assign).some(function (j) { return assign[j] === t.emptyLane; });
        if (t.notIn) hit = (t.notIn.jobs || []).every(function (j) { return (t.notIn.lanes || []).indexOf(assign[j]) === -1; });
        return { g: g, hit: hit };
      });
    }
    function paint() {
      var ordered = lanes.filter(function (l) { return l.id === "unscheduled"; }).concat(lanes.filter(function (l) { return l.id !== "unscheduled"; }));
      var lanesHTML = ordered.map(function (l) {
        var lj = jobs.filter(function (j) { return assign[j.id] === l.id; });
        var canDrop = sel && assign[sel] !== l.id;
        return '<div class="lane' + (l.id === "unscheduled" ? " unsched" : "") + (canDrop ? " target" : "") + '" data-lane="' + esc(l.id) + '">' +
          "<h4>" + esc(l.name) + '</h4><span class="li">' + esc(l.info) + "</span>" +
          (canDrop ? '<button class="drop" data-lane="' + esc(l.id) + '">Move here</button>' : "") +
          lj.map(function (j) {
            return '<button class="job' + (sel === j.id ? " sel" : "") + (start[j.id] !== assign[j.id] ? " moved" : "") + '" data-job="' + esc(j.id) + '"><span class="wo num">WO ' + esc(j.id) + "</span><b>" + esc(j.store) + "</b><span>" + esc(j.town) + "</span>" + (j.note ? '<span class="nt">' + esc(j.note) + "</span>" : "") + "</button>";
          }).join("") +
          (lj.length === 0 ? '<span class="li">' + (l.id === "unscheduled" ? "Empty. Nice." : "No jobs") + "</span>" : "") + "</div>";
      }).join("");
      box.innerHTML = '<div class="scenario">' + (a.when ? '<span class="when-line">' + esc(a.when) + "</span>" : "") + '<p class="lead" style="max-width:70ch">' + esc(a.intro) + "</p>" +
        '<div class="board">' + lanesHTML + '</div><div class="btn-row"><button class="btn primary" id="checkBtn">Check my board</button><button class="btn" id="resetBtn">Start over</button></div><div id="res"></div></div>';
      box.querySelectorAll(".job").forEach(function (b) {
        b.onclick = function (e) { e.stopPropagation(); var id = b.getAttribute("data-job"); sel = sel === id ? null : id; paint(); };
      });
      box.querySelectorAll(".lane").forEach(function (l) {
        l.onclick = function () {
          var lane = l.getAttribute("data-lane");
          if (sel && assign[sel] !== lane) { assign[sel] = lane; sel = null; store.set(saveKey, assign); paint(); }
        };
      });
      document.getElementById("checkBtn").onclick = check;
      document.getElementById("resetBtn").onclick = function () { assign = Object.assign({}, start); sel = null; results = null; store.set(saveKey, assign); paint(); };
      if (results) showResults();
    }
    function check() {
      results = evalGoals();
      var hits = results.filter(function (r) { return r.hit; }).length;
      var score = results.reduce(function (t, r) { return t + (r.hit ? (+r.g.points || 0) : 0); }, 0);
      var bestBefore = events.filter(function (e) { return e.event_type === "board_check" && e.item_key === a.id; })
        .reduce(function (m, e) { return Math.max(m, (e.meta && e.meta.score) || 0); }, 0);
      var pts = Math.max(0, score - bestBefore);
      withBadges(function () { logEvent({ event_type: "board_check", session_key: s.key, item_key: a.id, points: pts, meta: { hits: hits, total: results.length, score: score, assignment: assign } }); });
      showResults(pts);
      if (hits >= 4) confetti();
      done(a);
    }
    function showResults(pts) {
      var hits = results.filter(function (r) { return r.hit; }).length, n = results.length;
      var head = hits === n ? "Perfect board. Every clock saved, every truck full." : hits >= 3 ? "That's a seriously good board." : hits >= 1 ? "Good start. A few bonus moves are still on the table." : "Every board starts somewhere. Here's where the wins are hiding.";
      var cls = hits === n || hits >= 4 ? "best" : hits >= 2 ? "good" : "ok";
      var check = '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="var(--green)"/><path d="M9 16.5l4.5 4.5L23 11" stroke="var(--on-green)" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      var star = '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="var(--sun)"/><path d="M16 8l2.4 5 5.5.7-4 3.8 1 5.5L16 20.4 11.1 23l1-5.5-4-3.8 5.5-.7z" fill="#2b1f00"/></svg>';
      document.getElementById("res").innerHTML = '<div class="feedback ' + cls + '"><h3>' + head + '</h3><p class="pts num">' + hits + " of " + n + " goals." + (pts != null ? (pts ? " +" + pts + " points" : " Your best score is already banked.") : "") + '</p></div><div class="results" style="margin-top:12px">' +
        results.map(function (r) {
          return '<div class="goal' + (r.hit ? " hit" : "") + '">' + (r.hit ? check : star) + "<span><b>" + esc(r.g.title) + "</b><p>" + (r.hit ? "Nailed it. " : "Bonus move: ") + esc(r.g.hint) + '</p></span><span class="num">' + esc(r.g.points) + "</span></div>";
        }).join("") + "</div>";
    }
    paint();
  }

  // ---------- shared feedback card ----------
  function feedbackHTML(rating, why, bestLabel, better, pts, nextLabel) {
    var lines = cheers()[rating] || STARTER.cheers[rating];
    var fb = '<div class="feedback ' + rating + '"><h3>' + esc(pick(lines)) + "</h3>" + (why ? "<p>" + esc(why) + "</p>" : "");
    if (rating !== "best") {
      if (bestLabel) fb += "<p><b>The pro move:</b> " + esc(bestLabel) + "</p>";
      if (better && better.length) fb += "<ol>" + better.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ol>";
    }
    fb += '<p class="pts">' + (pts ? "+" + pts + " points" : "Replay. Points were banked the first time.") + "</p>";
    if (nextLabel) fb += '<div class="btn-row"><button class="btn ' + (rating === "best" ? "sun" : "primary") + '" id="nextQ">' + esc(nextLabel) + "</button></div>";
    return fb + "</div>";
  }

  // ---------- Who takes it? (map) ----------
  var PLACES = {
    "hartford": [41.76, -72.68], "milford, ct": [41.22, -73.06], "new haven": [41.31, -72.92], "westport": [41.14, -73.36], "groton": [41.35, -72.08],
    "north haven": [41.39, -72.86], "watertown, ct": [41.61, -73.12], "branford": [41.28, -72.81], "holyoke": [42.20, -72.62], "worcester": [42.26, -71.80],
    "westborough": [42.27, -71.62], "glens falls": [43.31, -73.64], "bennington": [42.88, -73.20], "westfield": [42.12, -72.75], "windsor locks": [41.93, -72.63],
    "springfield": [42.10, -72.59], "palmer": [42.16, -72.33], "waterbury": [41.56, -73.04], "middletown": [41.56, -72.65], "darien": [41.08, -73.47],
    "newton": [42.34, -71.21], "arlington": [42.42, -71.16], "meriden": [41.54, -72.81], "millbury": [42.19, -71.76], "waterford, ct": [41.34, -72.14],
    "charlton": [42.14, -71.97], "carmel": [41.43, -73.68], "danbury": [41.39, -73.45], "boston": [42.36, -71.06], "providence": [41.82, -71.41],
    "albany": [42.65, -73.75], "east lyme": [41.36, -72.23], "norwich": [41.52, -72.08], "enfield": [41.98, -72.59], "torrington": [41.80, -73.12],
    "derby": [41.32, -73.09], "fitchburg": [42.58, -71.80], "ludlow": [42.16, -72.48], "nashua": [42.77, -71.47], "auburn, nh": [43.00, -71.35],
    "jaffrey": [42.81, -72.02], "framingham": [42.28, -71.42], "fairfield": [41.14, -73.26], "trumbull": [41.24, -73.20], "chicopee": [42.15, -72.61],
    "ware": [42.26, -72.24], "athol": [42.60, -72.23], "northampton": [42.32, -72.63], "greenfield": [42.59, -72.60], "adams": [42.62, -73.12],
    "winchendon": [42.69, -72.04], "henniker": [43.18, -71.82], "bellingham": [42.09, -71.47], "mansfield center": [41.77, -72.20], "wenham": [42.60, -70.89],
    "natick": [42.28, -71.35], "hopkinton": [42.23, -71.52], "marlborough": [42.35, -71.55], "naugatuck": [41.49, -73.05], "hudson": [42.39, -71.57]
  };
  var REF_CITIES = ["boston", "providence", "hartford", "springfield", "worcester", "new haven", "albany"];
  function place(town) {
    if (!town) return null;
    var t = String(town).toLowerCase().trim();
    if (PLACES[t]) return PLACES[t];
    var city = t.split(",")[0].trim(), st = (t.split(",")[1] || "").trim();
    if (PLACES[city + ", " + st]) return PLACES[city + ", " + st];
    if (PLACES[city]) return PLACES[city];
    return null;
  }
  function label(town) { return String(town || "").split(",")[0]; }
  function initials(n) { return String(n || "?").split(/\s+/).map(function (w) { return w[0] || ""; }).join("").slice(0, 2).toUpperCase(); }

  // A round lists options (a tech plus a plan). Old rounds used "techs"; both work.
  function opts(r) { return r.options || r.techs || []; }
  function pinTechs(r) {
    var seen = {}, out = [];
    opts(r).forEach(function (o, k) { if (!seen[o.name]) { seen[o.name] = { name: o.name, town: o.town, idx: [k] }; out.push(seen[o.name]); } else seen[o.name].idx.push(k); });
    return out;
  }
  function mapSVG(r, chosen) {
    var pts = [], pins = pinTechs(r);
    var cp = place(r.call && r.call.town);
    if (cp) pts.push(cp);
    pins.forEach(function (t) { var p = place(t.town); if (p) pts.push(p); });
    if (!pts.length) return "";
    var minLat = Math.min.apply(null, pts.map(function (p) { return p[0]; })), maxLat = Math.max.apply(null, pts.map(function (p) { return p[0]; }));
    var minLng = Math.min.apply(null, pts.map(function (p) { return p[1]; })), maxLng = Math.max.apply(null, pts.map(function (p) { return p[1]; }));
    var k = Math.cos(((minLat + maxLat) / 2) * Math.PI / 180);
    var spanX = Math.max(0.5, (maxLng - minLng) * k), spanY = Math.max(0.35, maxLat - minLat);
    var W = 640, H = 380, pad = 70;
    var scale = Math.min((W - pad * 2) / spanX, (H - pad * 2) / spanY);
    var cx = (minLng + maxLng) / 2, cy = (minLat + maxLat) / 2;
    function xy(p) { return [W / 2 + (p[1] - cx) * k * scale, H / 2 - (p[0] - cy) * scale]; }
    var svg = '<svg viewBox="0 0 ' + W + " " + H + '" class="mapsvg" role="img" aria-label="Map of the call and the techs">';
    svg += '<rect x="0" y="0" width="' + W + '" height="' + H + '" rx="18" fill="var(--sky-soft)"/>';
    for (var gx = 40; gx < W; gx += 60) svg += '<line x1="' + gx + '" y1="0" x2="' + gx + '" y2="' + H + '" stroke="var(--surface)" stroke-opacity=".5"/>';
    for (var gy = 40; gy < H; gy += 60) svg += '<line x1="0" y1="' + gy + '" x2="' + W + '" y2="' + gy + '" stroke="var(--surface)" stroke-opacity=".5"/>';
    REF_CITIES.forEach(function (c) {
      var q = xy(PLACES[c]);
      if (q[0] < 12 || q[0] > W - 12 || q[1] < 12 || q[1] > H - 12) return;
      if (pts.some(function (p) { var s2 = xy(p); return Math.abs(s2[0] - q[0]) < 70 && Math.abs(s2[1] - q[1]) < 30; })) return;
      svg += '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="3" fill="var(--muted)" opacity=".6"/><text x="' + (q[0] + 6).toFixed(1) + '" y="' + (q[1] + 4).toFixed(1) + '" font-size="12" fill="var(--muted)" opacity=".8">' + esc(c.replace(/\b\w/g, function (m) { return m.toUpperCase(); })) + "</text>";
    });
    var c = cp ? xy(cp) : null;
    if (c && chosen != null) {
      var t = opts(r)[chosen], tp = place(t.town);
      if (tp) { var q = xy(tp); svg += '<line x1="' + q[0].toFixed(1) + '" y1="' + q[1].toFixed(1) + '" x2="' + c[0].toFixed(1) + '" y2="' + c[1].toFixed(1) + '" stroke="var(--ink)" stroke-width="3" stroke-dasharray="7 6" stroke-linecap="round"/>'; }
    }
    var screen = [];
    pins.forEach(function (t) { var p = place(t.town); if (p) screen.push(xy(p)); });
    if (c) screen.push(c);
    function crowdedBelow(q) { return screen.some(function (o) { return Math.abs(o[0] - q[0]) < 90 && o[1] > q[1] + 1 && o[1] - q[1] < 60; }); }
    pins.forEach(function (t) {
      var p = place(t.town); if (!p) return;
      var q = xy(p), on = t.idx.indexOf(chosen) > -1, ly = crowdedBelow(q) ? q[1] - 28 : q[1] + 36;
      svg += '<g class="pin" data-name="' + esc(t.name) + '"' + (t.idx.length === 1 ? ' data-tech="' + t.idx[0] + '" tabindex="0" role="button"' : "") + ' aria-label="' + esc(t.name) + '">' +
        '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="19" fill="' + (on ? "var(--sun)" : "var(--green)") + '" stroke="var(--surface)" stroke-width="3"/>' +
        '<text x="' + q[0].toFixed(1) + '" y="' + (q[1] + 5).toFixed(1) + '" text-anchor="middle" font-size="14" font-weight="800" fill="' + (on ? "#2b1f00" : "var(--on-green)") + '">' + esc(initials(t.name)) + "</text>" +
        '<text x="' + q[0].toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)" paint-order="stroke" stroke="var(--sky-soft)" stroke-width="4">' + esc(t.name.split(" ").slice(-1)[0]) + " (" + esc(label(t.town)) + ")</text></g>";
    });
    if (c) {
      svg += (reduceMotion ? "" : '<circle cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" r="14" fill="var(--coral)" opacity=".35"><animate attributeName="r" values="12;26;12" dur="1.6s" repeatCount="indefinite"/><animate attributeName="opacity" values=".45;0;.45" dur="1.6s" repeatCount="indefinite"/></circle>') +
        '<circle cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" r="11" fill="var(--coral)" stroke="var(--surface)" stroke-width="3"/>' +
        '<text x="' + c[0].toFixed(1) + '" y="' + (crowdedBelow(c) || c[1] > H - 40 ? c[1] - 20 : c[1] + 30).toFixed(1) + '" text-anchor="middle" font-size="14" font-weight="800" fill="var(--coral)" paint-order="stroke" stroke="var(--sky-soft)" stroke-width="4">' + esc(r.call.store) + "</text>";
    }
    return svg + "</svg>";
  }

  function mapGame(a, box, s, done) {
    var rounds = a.rounds || [];
    if (!rounds.length) { box.innerHTML = '<p class="banner">No calls in this game yet.</p>'; return; }
    var i = 0;
    function paint(chosen) {
      if (i >= rounds.length) {
        box.innerHTML = '<div class="feedback best"><h3>Every call has an owner.</h3><p>Those were real calls from our own boards. You just practiced picking the tech who saves the clock.</p><div class="btn-row"><button class="btn sun" id="replay">Play again</button></div></div>';
        confetti(); done(a);
        document.getElementById("replay").onclick = function () { i = 0; paint(); };
        return;
      }
      var r = rounds[i];
      box.innerHTML = '<div class="scenario">' +
        '<span class="when-line">Call ' + (i + 1) + " of " + rounds.length + (r.when ? ". " + esc(r.when) : "") + "</span>" +
        (hasTicket(r.call) ? ticketHTML(r.call) : "") +
        '<p class="prompt">' + esc(r.prompt || "Who takes it?") + "</p>" +
        '<div class="mapwrap">' + mapSVG(r, chosen) + "</div>" +
        '<p class="k map-tip">Read each tech\'s day before you pick. The closest pin is not always the answer.</p>' +
        '<div class="techs">' + shuffled(opts(r).length, a.id + (r.id || i)).map(function (k) { var t = opts(r)[k];
          var shown = chosen != null;
          var rt = rateOf(t.rating);
          var rows = t.plan || t.now || t.board ? [["Now", t.now], ["Board", t.board], ["Shift", t.shift], ["Drive", t.distance]] : [["Day", t.where], ["Drive", t.eta]];
          return '<button class="tech' + (chosen === k ? " picked" : "") + '" data-k="' + k + '"' + (shown ? " disabled" : "") + '><span class="ini">' + esc(initials(t.name)) + '</span><span class="tech-body"><b>' + esc(t.name) + "</b>" +
            (t.plan ? '<span class="plan">' + esc(t.plan) + "</span>" : "") +
            '<dl class="tday">' + rows.filter(function (x) { return x[1]; }).map(function (x) { return (x[0] ? "<dt>" + esc(x[0]) + "</dt>" : "") + "<dd>" + esc(x[1]) + "</dd>"; }).join("") + "</dl>" +
            (shown ? '<span class="rate ' + rt + '">' + RATE_LABEL[rt] + "</span>" : "") + "</span></button>";
        }).join("") + '</div><div id="fb"></div></div>';
      if (chosen == null) {
        var pickTech = function (k) { choose(k); };
        box.querySelectorAll(".tech").forEach(function (b) { b.onclick = function () { pickTech(+b.getAttribute("data-k")); }; });
        box.querySelectorAll(".pin[data-tech]").forEach(function (g) {
          g.onclick = function () { pickTech(+g.getAttribute("data-tech")); };
          g.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pickTech(+g.getAttribute("data-tech")); } };
        });
      }
    }
    function choose(k) {
      var r = rounds[i], t = opts(r)[k];
      var rating = rateOf(t.rating);
      var key = a.id + ":" + (r.id || i);
      var first = !has("answer", key);
      var pts = first ? RATE_PTS[rating] : 0;
      withBadges(function () { logEvent({ event_type: "answer", session_key: s.key, item_key: key, choice: t.name + (t.plan ? ": " + t.plan : ""), rating: rating, points: pts }); });
      paint(k);
      var best = opts(r).filter(function (x) { return x.rating === "best"; }).map(function (x) { return x.name + (x.plan ? ", " + x.plan.charAt(0).toLowerCase() + x.plan.slice(1) : ""); }).join(" or ");
      document.getElementById("fb").innerHTML = feedbackHTML(rating, t.why, best, r.lesson ? [r.lesson] : [], pts, i < rounds.length - 1 ? "Next call" : "Wrap it up");
      if (rating === "best") { confetti(); if (r.lesson) document.querySelector("#fb .feedback").insertAdjacentHTML("beforeend", '<p class="k" style="color:inherit">' + esc(r.lesson) + "</p>"); }
      document.getElementById("nextQ").onclick = function () { i++; paint(); window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); };
      document.getElementById("fb").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    }
    paint();
  }

  // ---------- Spot the lazy choice ----------
  function spotGame(a, box, s, done) {
    var lanes = a.lanes || [], jobs = a.jobs || [], problems = a.problems || [];
    var found = {}, msgs = [];
    function problemFor(t) { return problems.filter(function (p) { return (p.targets || []).map(String).indexOf(String(t)) > -1; })[0]; }
    function paint() {
      var n = Object.keys(found).length;
      var ordered = lanes.filter(function (l) { return l.id === "unscheduled"; }).concat(lanes.filter(function (l) { return l.id !== "unscheduled"; }));
      box.innerHTML = '<div class="scenario">' + (a.when ? '<span class="when-line">' + esc(a.when) + "</span>" : "") + '<p class="lead" style="max-width:70ch">' + esc(a.intro) + "</p>" +
        '<div class="spot-count"><span class="num">' + n + " of " + problems.length + '</span> found</div>' +
        '<div class="board spot">' + ordered.map(function (l) {
          var lp = problemFor("lane:" + l.id), lf = lp && found[lp.id];
          return '<div class="lane' + (l.id === "unscheduled" ? " unsched" : "") + (lf ? " found" : "") + '"><button class="lane-name" data-t="lane:' + esc(l.id) + '"><h4>' + esc(l.name) + '</h4><span class="li">' + esc(l.info) + "</span></button>" +
            jobs.filter(function (j) { return j.lane === l.id; }).map(function (j) {
              var p = problemFor(j.id), f = p && found[p.id];
              return '<button class="job' + (f ? " found" : "") + '" data-t="' + esc(j.id) + '"><span class="wo num">WO ' + esc(j.id) + "</span><b>" + esc(j.store) + "</b><span>" + esc(j.town) + "</span>" + (j.note ? '<span class="nt">' + esc(j.note) + "</span>" : "") + "</button>";
            }).join("") + "</div>";
        }).join("") + '</div><div id="spotMsgs" class="results">' + msgs.join("") + "</div></div>";
      box.querySelectorAll("[data-t]").forEach(function (b) { b.onclick = function () { tap(b.getAttribute("data-t")); }; });
    }
    function tap(t) {
      var p = problemFor(t);
      if (p && !found[p.id]) {
        found[p.id] = true;
        var key = a.id + ":" + p.id, first = !has("answer", key), pts = first ? 15 : 0;
        withBadges(function () { logEvent({ event_type: "answer", session_key: s.key, item_key: key, choice: "Spotted: " + p.title, rating: "best", points: pts }); });
        msgs.unshift('<div class="goal hit"><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="var(--green)"/><path d="M9 16.5l4.5 4.5L23 11" stroke="var(--on-green)" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg><span><b>' + esc(pick(["Good eye:", "Spotted:", "Nice catch:", "Sharp:"])) + " " + esc(p.title) + "</b><p>" + esc(p.explain) + '</p></span><span class="num">' + (pts ? "+" + pts : "") + "</span></div>");
        paint();
        if (Object.keys(found).length === problems.length) {
          confetti(); done(a);
          document.getElementById("spotMsgs").insertAdjacentHTML("afterbegin", '<div class="feedback best"><h3>All ' + problems.length + ' found. Sharp eyes.</h3><p>That was a real board. Next time you see one of these on yours, you will catch it in seconds.</p><div class="btn-row"><button class="btn sun" id="again">Play again</button></div></div>');
          document.getElementById("again").onclick = function () { found = {}; msgs = []; paint(); window.scrollTo(0, 0); };
        }
        document.getElementById("spotMsgs").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
      } else if (p) {
        toast("Already found that one. Keep going.");
      } else {
        toast((a.fine && a.fine[t]) || "That one looks fine. Keep looking.");
      }
    }
    paint();
  }

  // ---------- Beat the clock ----------
  function fmtMin(m) { m = Math.round(m); var neg = m < 0; m = Math.abs(m); var h = Math.floor(m / 60), r = m % 60; return (neg ? "-" : "") + (h ? h + "h " : "") + r + "m"; }
  function clockRing(left, total, lbl) {
    var r = 70, circ = 2 * Math.PI * r, frac = Math.max(0, Math.min(1, left / total));
    var col = frac > .5 ? "var(--green)" : frac > .2 ? "var(--sun)" : "var(--coral)";
    return '<svg viewBox="0 0 180 180" class="ring" role="img" aria-label="' + esc(lbl) + ": " + fmtMin(left) + ' left"><circle cx="90" cy="90" r="' + r + '" fill="var(--surface)" stroke="var(--line)" stroke-width="16"/>' +
      '<circle cx="90" cy="90" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="16" stroke-linecap="round" stroke-dasharray="' + circ.toFixed(1) + '" stroke-dashoffset="' + (circ * (1 - frac)).toFixed(1) + '" transform="rotate(-90 90 90)" style="transition: stroke-dashoffset .9s cubic-bezier(.2,.8,.2,1), stroke .4s"/>' +
      '<text x="90" y="92" text-anchor="middle" font-family="var(--display)" font-weight="800" font-size="28" fill="var(--ink)">' + (left > 0 ? fmtMin(left) : "0m") + '</text><text x="90" y="116" text-anchor="middle" font-size="13" fill="var(--muted)">left</text></svg>';
  }
  function clockGame(a, box, s, done) {
    var steps = a.steps || [], total = +a.startLeft || 60, base = +a.base || 0;
    if (!steps.length) { box.innerHTML = '<p class="banner">This game has no steps yet.</p>'; return; }
    var step = 0, used = 0, t0 = 0, timer = null;
    function head() {
      return '<div class="clock-head">' + (hasTicket(a.ticket) ? ticketHTML(a.ticket) : "<span></span>") + '<div class="ring-box">' + clockRing(total - base - used, total, a.clockLabel || "Clock") + '<span class="k">' + esc(a.clockLabel || "Clock") + "</span></div></div>" +
        (a.baseNote ? '<p class="k">' + esc(a.baseNote) + (base ? " Already counted: " + fmtMin(base) + "." : "") + "</p>" : "");
    }
    function paint() {
      clearInterval(timer);
      if (step >= steps.length) return finish();
      var st = steps[step];
      box.innerHTML = '<div class="scenario">' + (a.when ? '<span class="when-line">' + esc(a.when) + ". Move " + (step + 1) + " of " + steps.length + "</span>" : "") + head() +
        (st.context && st.context.length ? '<ul class="ctx">' + st.context.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>" : "") +
        '<p class="prompt">' + esc(st.prompt) + '</p><div class="speed"><i id="speedBar"></i></div><p class="k" id="speedNote">Answer in 15 seconds for a speed bonus.</p><div class="options">' +
        shuffled((st.options || []).length, a.id + step).map(function (k) { var o = st.options[k]; return '<button class="opt" data-k="' + k + '">' + esc(o.label) + "</button>"; }).join("") + '</div><div id="fb"></div></div>';
      t0 = Date.now();
      var bar = document.getElementById("speedBar");
      timer = setInterval(function () {
        var f = Math.max(0, 1 - (Date.now() - t0) / 15000);
        if (bar) bar.style.width = (f * 100) + "%";
        if (f <= 0) { clearInterval(timer); var n = document.getElementById("speedNote"); if (n) n.textContent = "No rush. The bonus is gone, but take the time you need."; }
      }, 200);
      box.querySelectorAll(".opt").forEach(function (b) { b.onclick = function () { choose(+b.getAttribute("data-k")); }; });
    }
    function choose(k) {
      clearInterval(timer);
      var st = steps[step], o = st.options[k];
      var rating = rateOf(o.rating);
      var fast = Date.now() - t0 < 15000;
      var key = a.id + ":step" + step;
      var first = !has("answer", key);
      var pts = first ? ({ best: 10, good: 6, ok: 3, miss: 0 }[rating] + (fast ? 5 : 0)) : 0;
      used += +o.cost || 0;
      withBadges(function () { logEvent({ event_type: "answer", session_key: s.key, item_key: key, choice: o.label, rating: rating, points: pts }); });
      box.querySelectorAll(".opt").forEach(function (b) {
        var j = +b.getAttribute("data-k");
        b.disabled = true;
        var r = rateOf(st.options[j].rating);
        b.innerHTML = esc(st.options[j].label) + '<br><span class="rate ' + r + '">' + RATE_LABEL[r] + "</span>" + (st.options[j].cost ? ' <span class="k">costs ' + fmtMin(st.options[j].cost) + "</span>" : "");
        if (j === k) b.classList.add("picked");
      });
      var rb = box.querySelector(".ring-box");
      if (rb) rb.innerHTML = clockRing(total - base - used, total, a.clockLabel || "Clock") + '<span class="k">' + esc(a.clockLabel || "Clock") + (o.cost ? ". That move cost " + fmtMin(o.cost) : "") + "</span>";
      var best = st.options.filter(function (x) { return x.rating === "best"; }).map(function (x) { return x.label; }).join(" Or: ");
      document.getElementById("fb").innerHTML = feedbackHTML(rating, o.why + (fast && first ? " Speed bonus: +5." : ""), best, [], pts, step < steps.length - 1 ? "Next move" : "See how the clock did");
      if (rating === "best") confetti();
      document.getElementById("nextQ").onclick = function () { step++; paint(); window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); };
      document.getElementById("fb").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    }
    function finish() {
      var left = total - base - used, saved = left > 0;
      box.innerHTML = '<div class="scenario">' + head() + '<div class="feedback ' + (saved ? "best" : "good") + '"><h3>' + (saved ? "Clock saved with " + fmtMin(left) + " to spare." : "The clock ran out this time.") + "</h3>" +
        "<p>" + (saved ? "Every quick, clear move bought time back." : "No harm done, this is practice. Look back at which move cost the most time, and try it again.") + "</p>" +
        (a.outcome ? "<p><b>What really happened:</b> " + esc(a.outcome) + "</p>" : "") +
        '<div class="btn-row"><button class="btn sun" id="again">Play again</button></div></div></div>';
      if (saved) confetti();
      done(a);
      document.getElementById("again").onclick = function () { step = 0; used = 0; paint(); };
    }
    cleanup = (function (prev) { return function () { clearInterval(timer); if (prev) prev(); }; })(cleanup);
    paint();
  }

  // =====================================================================
  // ADMIN
  // =====================================================================
  function adminLogin() {
    var practice = !remote;
    view.innerHTML = '<section class="coach" style="max-width:520px"><h1 style="font-size:40px">Admin sign in</h1>' +
      '<p style="color:var(--muted)">Edit lessons, flashcards and real-call scenarios, and see when Dana and Devin trained.</p>' +
      '<form class="admin-form" id="lf">' +
      (practice
        ? '<p class="banner">Practice mode: the database is not connected yet, so sign in with the passcode from config.js. Changes save on this device only.</p><label class="fld"><span>Passcode</span><input class="input" id="pc" type="password" autocomplete="off"></label>'
        : '<label class="fld"><span>Email</span><input class="input" id="em" type="email" autocomplete="username" value="' + esc(ADMIN_EMAILS[0] || "") + '"></label><label class="fld"><span>Password</span><input class="input" id="pw" type="password" autocomplete="current-password"></label>') +
      '<div class="btn-row"><button class="btn primary" type="submit" id="lbtn">Sign in</button><button class="btn" type="button" id="backBtn">Back to the desk</button></div>' +
      '<p class="err" id="lerr" hidden></p></form></section>';
    document.getElementById("backBtn").onclick = function () { location.hash = "home"; };
    document.getElementById("lf").onsubmit = function (ev) {
      ev.preventDefault();
      var err = document.getElementById("lerr");
      err.hidden = true;
      if (practice) {
        if (document.getElementById("pc").value === CFG.coachPasscode) { store.set("coachOk", true); rebuild(); route(); }
        else { err.textContent = "That passcode does not match the one in config.js."; err.hidden = false; }
        return;
      }
      var btn = document.getElementById("lbtn"); btn.disabled = true; btn.textContent = "Signing in...";
      authCall("password", { email: document.getElementById("em").value.trim(), password: document.getElementById("pw").value })
        .then(function (a) {
          if (ADMIN_EMAILS.indexOf(a.email) === -1) { store.set("auth", null); throw new Error("This account is not on the admin list in config.js."); }
          rebuild(); route();
        })
        .catch(function (e) { err.textContent = e.message; err.hidden = false; btn.disabled = false; btn.textContent = "Sign in"; });
    };
  }
  function signOut() {
    store.set("auth", null); store.set("coachOk", false); rebuild(); location.hash = "home"; route();
  }
  function adminShell(tab, inner) {
    var tabsHTML = [["admin", "Content"], ["admin-log", "Activity log"], ["admin-settings", "Settings"]].map(function (t) {
      return '<button class="tab" role="tab" aria-selected="' + (tab === t[0]) + '" data-h="' + t[0] + '">' + t[1] + "</button>";
    }).join("");
    view.innerHTML = '<section class="coach"><div class="form-row" style="justify-content:space-between"><h1 style="font-size:40px">Admin</h1><div class="btn-row"><button class="btn" id="homeBtn">Trainee view</button><button class="btn" id="soBtn">Sign out</button></div></div>' +
      (!remote ? '<p class="banner">Practice mode: the database is not connected, so changes and activity stay on this device. Add the Supabase anon key to config.js to go live.</p>' : "") +
      (remote && usingStarter ? '<p class="banner">The database has no content yet, so trainees see the built-in starter content. Use "Copy starter content to the database" below to make it editable.</p>' : "") +
      '<div class="tabs" role="tablist">' + tabsHTML + '</div><div id="adminBody" style="display:grid;gap:20px">' + inner + "</div></section>";
    view.querySelectorAll("[data-h]").forEach(function (b) { b.onclick = function () { location.hash = b.getAttribute("data-h"); }; });
    document.getElementById("homeBtn").onclick = function () { location.hash = "home"; };
    document.getElementById("soBtn").onclick = signOut;
  }
  function renderAdmin(h) {
    if (!isAdmin()) return adminLogin();
    if (h === "admin-log") return renderLog();
    if (h === "admin-settings") return renderSettings();
    renderContentAdmin();
  }

  // ----- confirm inline (the frame has no confirm()) -----
  function armConfirm(btn, label, onYes) {
    btn.onclick = function () {
      var wrap = document.createElement("span");
      wrap.className = "btn-row";
      wrap.innerHTML = '<button class="btn danger" type="button">' + esc(label) + '</button><button class="btn" type="button">Keep it</button>';
      btn.replaceWith(wrap);
      wrap.children[0].onclick = function () { wrap.children[0].disabled = true; onYes(); };
      wrap.children[1].onclick = function () { wrap.replaceWith(btn); };
    };
  }
  function fail(e) { toast("Couldn't save: " + (e && e.message || "unknown error")); }

  function renderContentAdmin() {
    var cyc = M.cycles.slice().sort(function (a, b) { return a.id - b.id; });
    var html = (remote && usingStarter ? '<div><button class="btn sun" id="importBtn">Copy starter content to the database</button></div>' : "") +
      cyc.map(function (c, ci) {
        var cs = M.sessions.filter(function (s) { return s.cycle === c.id; }).sort(function (a, b) { return a.week - b.week || DAY_ORDER[a.day] - DAY_ORDER[b.day]; });
        return '<div class="coach-card admin-cycle" data-cid="' + c.id + '">' +
          '<div class="form-row" style="justify-content:space-between"><h3>Topic ' + (ci + 1) + '</h3><span class="k">Two weeks: a Tuesday lesson and a Friday play session each week</span></div>' +
          '<label class="fld"><span>Title</span><input class="input" data-cf="title" value="' + esc(c.title) + '"></label>' +
          '<label class="fld"><span>Short description</span><textarea class="input" rows="2" data-cf="blurb">' + esc(c.blurb) + "</textarea></label>" +
          '<div class="btn-row"><button class="btn" data-savecycle="' + c.id + '">Save topic</button><button class="btn danger-ghost" data-delcycle="' + c.id + '">Delete topic</button></div>' +
          '<div class="path">' + (cs.length ? cs.map(function (s) {
            return '<div class="path-row admin-row"><span class="when num">Week ' + s.week + ", " + (s.day === "tue" ? "Tue" : "Fri") + '</span><span><span class="t">' + esc(s.title) + '</span><br><span class="k">' + (s.kind === "lesson" ? (s.slides || []).length + " slides" : (s.activities || []).length + " activities") + (s.published ? ". " + (program().trainees || []).map(function (n) { return esc(n) + ": program week " + (weekNumberFor(s, n) + 1); }).join(", ") : "") + "</span></span>" +
              '<span class="btn-row"><span class="state ' + (s.published ? "done" : "locked") + '">' + (s.published ? "Live" : "Draft") + '</span><button class="btn sm" data-preview="' + esc(s.key) + '">Preview</button><button class="btn sm primary" data-edit="' + esc(s.key) + '">Edit</button></span></div>';
          }).join("") : '<p class="k">No sessions yet.</p>') + "</div>" +
          '<div class="form-row"><label class="fld inline"><span>Add for week</span><select class="input" data-addweek><option value="1">1</option><option value="2">2</option></select></label>' +
          '<button class="btn sm" data-addlesson="' + c.id + '">Add Tuesday lesson</button><button class="btn sm" data-addplay="' + c.id + '">Add Friday play</button></div>' +
          "</div>";
      }).join("") +
      '<div><button class="btn sun" id="addCycle">Add a topic</button></div>';
    adminShell("admin", html);

    var ib = document.getElementById("importBtn");
    if (ib) ib.onclick = function () { ib.disabled = true; importStarter().then(function () { toast("Starter content copied. You can edit it now."); renderContentAdmin(); }).catch(function (e) { ib.disabled = false; fail(e); }); };
    view.querySelectorAll("[data-savecycle]").forEach(function (b) {
      b.onclick = function () {
        var id = +b.getAttribute("data-savecycle"), card = b.closest(".admin-cycle");
        var c = { id: id, title: card.querySelector('[data-cf="title"]').value.trim() || "Untitled cycle", blurb: card.querySelector('[data-cf="blurb"]').value.trim() };
        saveCycle(c).then(function () { toast("Topic saved."); }).catch(fail);
      };
    });
    view.querySelectorAll("[data-delcycle]").forEach(function (b) {
      armConfirm(b, "Yes, delete the topic and its sessions", function () {
        deleteCycle(+b.getAttribute("data-delcycle")).then(function () { toast("Topic deleted."); renderContentAdmin(); }).catch(fail);
      });
    });
    view.querySelectorAll("[data-edit]").forEach(function (b) { b.onclick = function () { location.hash = "edit-" + b.getAttribute("data-edit"); }; });
    view.querySelectorAll("[data-preview]").forEach(function (b) { b.onclick = function () { location.hash = "s-" + b.getAttribute("data-preview"); }; });
    function addSession(cid, kind, btn) {
      var week = +btn.closest(".admin-cycle").querySelector("[data-addweek]").value;
      var day = kind === "lesson" ? "tue" : "fri";
      var s = { key: "c" + cid + "-w" + week + "-" + day + "-" + Math.random().toString(36).slice(2, 6), cycle: cid, week: week, day: day, kind: kind, title: kind === "lesson" ? "New lesson" : "New play session", minutes: kind === "lesson" ? 10 : 12, published: false };
      if (kind === "lesson") s.slides = [SLIDE_KINDS.cover.make()]; else s.activities = [ACT_KINDS.scenarios.make()];
      saveSession(s).then(function () { location.hash = "edit-" + s.key; }).catch(fail);
    }
    view.querySelectorAll("[data-addlesson]").forEach(function (b) { b.onclick = function () { addSession(+b.getAttribute("data-addlesson"), "lesson", b); }; });
    view.querySelectorAll("[data-addplay]").forEach(function (b) { b.onclick = function () { addSession(+b.getAttribute("data-addplay"), "play", b); }; });
    document.getElementById("addCycle").onclick = function () {
      var id = M.cycles.reduce(function (m, c) { return Math.max(m, c.id); }, 0) + 1;
      saveCycle({ id: id, title: "New topic", blurb: "" }).then(function () { toast("Topic added. Give it a title, then add its sessions."); renderContentAdmin(); }).catch(fail);
    };
  }

  // ----- form-based editor -----
  function F(type, key, label, extra) { return Object.assign({ t: type, k: key, l: label }, extra || {}); }
  var NARR = F("area", "narration", "Narration (read aloud when they press Watch it)");
  var TICKET_FIELDS = [F("text", "wo", "WO number"), F("text", "store", "Store"), F("text", "address", "Address"), F("text", "category", "Category"), F("text", "created", "Came in"), F("text", "clockEnds", "12-hour clock ends"), F("text", "status", "Status")];
  var SLIDE_KINDS = {
    cover: { label: "Title slide", fields: [F("text", "title", "Title"), F("area", "sub", "Subtitle"), NARR], make: function () { return { kind: "cover", title: "New slide", sub: "", narration: "" }; } },
    metrics: { label: "Metric cards", fields: [F("text", "title", "Title"), F("list", "items", "Metrics", { item: "metric", fields: [F("text", "name", "Name"), F("text", "target", "Target"), F("area", "means", "What it means"), F("area", "dispatch", "What dispatch controls")], make: function () { return { name: "", target: "", means: "", dispatch: "" }; } }), NARR],
      make: function () { return { kind: "metrics", title: "New slide", items: [{ name: "", target: "", means: "", dispatch: "" }], narration: "" }; } },
    passfail: { label: "CT<12 pass/fail timeline", fields: [F("text", "title", "Title"), F("area", "text", "Text under the timeline"), NARR], make: function () { return { kind: "passfail", title: "CT<12 is pass or fail", text: "", narration: "" }; } },
    bars: { label: "Bar chart vs. target", fields: [F("text", "title", "Title"), F("area", "note", "Note under the chart"), F("num", "target", "Target %"), F("list", "rows", "Bars", { item: "bar", fields: [F("text", "label", "Label"), F("num", "value", "Value %")], make: function () { return { label: "", value: 0 }; } }), NARR],
      make: function () { return { kind: "bars", title: "New slide", note: "", target: 73, rows: [{ label: "", value: 0 }], narration: "" }; } },
    steps: { label: "Numbered steps", fields: [F("text", "title", "Title"), F("list", "steps", "Steps", { item: "step", fields: [F("text", "h", "Step"), F("area", "p", "Detail")], make: function () { return { h: "", p: "" }; } }), NARR],
      make: function () { return { kind: "steps", title: "New slide", steps: [{ h: "", p: "" }], narration: "" }; } },
    ticket: { label: "Real job ticket", fields: [F("text", "title", "Title"), F("group", "ticket", "Work order", { fields: TICKET_FIELDS }), F("list", "timeline", "Timeline", { item: "moment", fields: [F("text", "when", "When"), F("area", "what", "What happened")], make: function () { return { when: "", what: "" }; } }), F("area", "lesson", "The lesson"), NARR],
      make: function () { return { kind: "ticket", title: "Real call", ticket: { wo: "", store: "", address: "", category: "", created: "", clockEnds: "", status: "" }, timeline: [{ when: "", what: "" }], lesson: "", narration: "" }; } },
    think: { label: "You decide (question, then reveal)", fields: [F("text", "title", "Title"), F("lines", "facts", "What they know (one per line)"), F("text", "question", "The question"), F("text", "answer", "The answer (shown on tap)"), F("area", "why", "Why"), NARR], make: function () { return { kind: "think", title: "You decide", facts: [], question: "", answer: "", why: "", narration: "" }; } },
    list: { label: "Bullet list", fields: [F("text", "title", "Title"), F("lines", "items", "Bullets (one per line)"), NARR], make: function () { return { kind: "list", title: "New slide", items: [], narration: "" }; } },
    mission: { label: "Closing / mission", fields: [F("text", "title", "Title"), F("area", "text", "Text"), NARR], make: function () { return { kind: "mission", title: "Your mission this week", text: "", narration: "" }; } },
    columns: { label: "Side-by-side columns", fields: [F("text", "title", "Title"), F("list", "columns", "Columns", { item: "column", fields: [F("text", "head", "Heading"), F("lines", "items", "Items (one per line)")], make: function () { return { head: "", items: [] }; } }), F("area", "caption", "Caption under the columns"), NARR],
      make: function () { return { kind: "columns", title: "New slide", columns: [{ head: "", items: [] }, { head: "", items: [] }], caption: "", narration: "" }; } },
    stat: { label: "Big number", fields: [F("text", "title", "Title"), F("text", "big", "Big number (for example 9 of 25)"), F("area", "label", "What the number means"), F("area", "text", "Text under it"), NARR],
      make: function () { return { kind: "stat", title: "New slide", big: "", label: "", text: "", narration: "" }; } },
    shifts: { label: "Shift chart", fields: [F("text", "title", "Title"), F("list", "rows", "Techs", { item: "tech", fields: [F("text", "name", "Name"), F("text", "base", "Home base"), F("text", "days", "Days (for example Mon-Fri or Tue-Sat)"), F("text", "hours", "Hours"), F("select", "type", "Shift", { options: [["day", "Day shift"], ["evening", "Evening shift"]] })], make: function () { return { name: "", base: "", days: "Mon-Fri", hours: "8:00 AM-4:30 PM", type: "day" }; } }), F("area", "caption", "Caption"), NARR],
      make: function () { return { kind: "shifts", title: "The shift chart", rows: [], caption: "", narration: "" }; } }
  };
  var OPTION_FIELDS = [F("area", "label", "Answer"), F("select", "rating", "Rating", { options: [["best", "Pro move"], ["good", "Good move"], ["ok", "Safe move"], ["miss", "Costly move (trap)"]] }), F("area", "why", "Feedback when they pick it"), F("lines", "better", "How to make it better (one per line, skip for pro moves)")];
  function newOption(r) { return { label: "", rating: r || "ok", why: "", better: [] }; }
  var ACT_KINDS = {
    flashcards: { label: "Flashcards", fields: [F("text", "title", "Tab name"), F("list", "cards", "Cards", { item: "card", fields: [F("area", "q", "Front"), F("area", "a", "Back")], make: function () { return { q: "", a: "" }; } })],
      make: function () { return { kind: "flashcards", id: rid("cards"), title: "Flashcards", cards: [{ q: "", a: "" }] }; } },
    scenarios: { label: "Pick the move", fields: [F("text", "title", "Tab name"), F("list", "items", "Calls", { item: "call", fields: [
      F("text", "when", "When (for example: Tue 10/27, 7:00 AM Dispatch Map)"), F("group", "ticket", "Work order (leave empty to hide)", { fields: TICKET_FIELDS }), F("lines", "context", "What the board looks like (one line each)"), F("area", "prompt", "Question"),
      F("list", "options", "Answers", { item: "answer", fields: OPTION_FIELDS, make: function () { return newOption("ok"); } })
    ], make: function () { return { id: rid("call"), when: "", ticket: {}, context: [], prompt: "", options: [newOption("best"), newOption("good"), newOption("ok")] }; } })],
      make: function () { return { kind: "scenarios", id: rid("calls"), title: "Pick the move", items: [{ id: rid("call"), when: "", ticket: {}, context: [], prompt: "", options: [newOption("best"), newOption("good"), newOption("ok")] }] }; } },
    board: { label: "Fix the board", fields: [F("text", "title", "Tab name"), F("text", "when", "When"), F("area", "intro", "Instructions"),
      F("list", "lanes", "Lanes (techs). Use the id unscheduled for the unscheduled list.", { item: "lane", fields: [F("text", "id", "Lane id (short, no spaces)"), F("text", "name", "Name"), F("text", "info", "Base and hours")], make: function () { return { id: "", name: "", info: "" }; } }),
      F("list", "jobs", "Jobs", { item: "job", fields: [F("text", "id", "WO number"), F("text", "lane", "Starts in lane id"), F("text", "store", "Store"), F("text", "town", "Town"), F("text", "note", "Note")], make: function () { return { id: "", lane: "unscheduled", store: "", town: "", note: "" }; } }),
      F("json", "goals", "Goals (advanced). Each goal: title, hint, points, and a test such as {\"job\":\"WO\",\"lanes\":[\"laneid\"]}, {\"together\":[\"WO\",\"WO\",\"WO\"]}, {\"minJobs\":{\"lane\":\"laneid\",\"n\":3}}, {\"maxJobs\":{\"lane\":\"laneid\",\"n\":4}}, {\"jobs\":[\"WO\"],\"lanes\":[\"laneid\"]}, {\"notIn\":{\"jobs\":[\"WO\"],\"lanes\":[\"laneid\"]}} or {\"emptyLane\":\"unscheduled\"}.")],
      make: function () { return { kind: "board", id: rid("board"), title: "Fix the board", when: "", intro: "Tap a job, then tap the tech you want to give it to.", lanes: [{ id: "unscheduled", name: "Unscheduled", info: "Nobody owns these yet" }], jobs: [], goals: [] }; } },
    map: { label: "Who takes it? (map)", fields: [F("text", "title", "Tab name"), F("area", "intro", "Instructions"),
      F("list", "rounds", "Calls", { item: "call", fields: [
        F("text", "when", "When (for example: Mon 10/26, 7:00 AM Dispatch Map)"),
        F("group", "call", "The call", { fields: [F("text", "wo", "WO number"), F("text", "store", "Store"), F("text", "town", "Town, state (puts the pin on the map)"), F("text", "address", "Address"), F("text", "created", "Came in"), F("text", "clockEnds", "12-hour clock ends"), F("text", "status", "Status")] }),
        F("area", "prompt", "Question"),
        F("list", "options", "Choices (the same tech can appear more than once with a different plan)", { item: "choice", fields: [F("text", "name", "Tech name"), F("text", "town", "Town, state where they are now (map pin)"), F("text", "plan", "The plan (e.g. First stop, After Branford)"), F("text", "now", "What they're on now (e.g. call 3 of 5)"), F("text", "board", "Rest of their board"), F("text", "shift", "Shift / clock-out"), F("text", "distance", "Drive to the call"), F("select", "rating", "Rating", { options: [["best", "Pro move"], ["good", "Good move"], ["ok", "Safe move"], ["miss", "Costly move (trap)"]] }), F("area", "why", "Feedback when picked")], make: function () { return { name: "", town: "", plan: "", now: "", board: "", shift: "", distance: "", rating: "ok", why: "" }; } }),
        F("area", "lesson", "The lesson (shown after they pick)")
      ], make: function () { return { id: rid("round"), when: "", call: {}, prompt: "Who takes it?", options: [], lesson: "" }; } })],
      make: function () { return { kind: "map", id: rid("map"), title: "Who takes it?", intro: "Tap the tech who should take each call.", rounds: [] }; } },
    spot: { label: "Spot the lazy choice", fields: [F("text", "title", "Tab name"), F("text", "when", "When"), F("area", "intro", "Instructions"),
      F("list", "lanes", "Lanes (techs). Use the id unscheduled for the unscheduled list.", { item: "lane", fields: [F("text", "id", "Lane id (short, no spaces)"), F("text", "name", "Name"), F("text", "info", "Base and hours")], make: function () { return { id: "", name: "", info: "" }; } }),
      F("list", "jobs", "Jobs", { item: "job", fields: [F("text", "id", "WO number"), F("text", "lane", "Lane id"), F("text", "store", "Store"), F("text", "town", "Town"), F("text", "note", "Note")], make: function () { return { id: "", lane: "unscheduled", store: "", town: "", note: "" }; } }),
      F("list", "problems", "Hidden problems", { item: "problem", fields: [F("text", "title", "Problem"), F("area", "explain", "Why it's the lazy choice, and the better move"), F("lines", "targets", "What to tap to find it: WO numbers, or lane:laneid (one per line)")], make: function () { return { id: rid("p"), title: "", explain: "", targets: [] }; } })],
      make: function () { return { kind: "spot", id: rid("spot"), title: "Spot the lazy choice", when: "", intro: "Tap a job or a tech's name to call out each lazy choice.", lanes: [{ id: "unscheduled", name: "Unscheduled", info: "Nobody owns these yet" }], jobs: [], problems: [] }; } },
    clock: { label: "Beat the clock", fields: [F("text", "title", "Tab name"), F("text", "when", "When"), F("group", "ticket", "The call", { fields: TICKET_FIELDS }),
      F("text", "clockLabel", "Clock name"), F("num", "startLeft", "Minutes on the clock at the start"), F("num", "base", "Minutes already needed (drive, finishing the current job)"), F("area", "baseNote", "Explain those minutes"),
      F("list", "steps", "Moves", { item: "move", fields: [F("area", "prompt", "Question"), F("lines", "context", "Facts (one per line)"),
        F("list", "options", "Answers", { item: "answer", fields: [F("area", "label", "Answer"), F("select", "rating", "Rating", { options: [["best", "Pro move"], ["good", "Good move"], ["ok", "Safe move"], ["miss", "Costly move (trap)"]] }), F("num", "cost", "Minutes this costs"), F("area", "why", "Feedback")], make: function () { return { label: "", rating: "ok", cost: 0, why: "" }; } })
      ], make: function () { return { prompt: "", context: [], options: [{ label: "", rating: "best", cost: 5, why: "" }, { label: "", rating: "good", cost: 30, why: "" }, { label: "", rating: "ok", cost: 120, why: "" }] }; } }),
      F("area", "outcome", "What really happened")],
      make: function () { return { kind: "clock", id: rid("clock"), title: "Beat the clock", when: "", ticket: {}, clockLabel: "12-hour clock", startLeft: 720, base: 60, baseNote: "", steps: [], outcome: "" }; } }
  };

  function getAt(o, p) { for (var i = 0; i < p.length; i++) { if (o == null) return undefined; o = o[p[i]]; } return o; }
  function setAt(o, p, v) { for (var i = 0; i < p.length - 1; i++) { if (o[p[i]] == null || typeof o[p[i]] !== "object") o[p[i]] = typeof p[i + 1] === "number" ? [] : {}; o = o[p[i]]; } o[p[p.length - 1]] = v; }
  function pathAttr(p) { return esc(JSON.stringify(p)); }

  var listSpecs = [];
  function fieldsHTML(fields, obj, path) {
    return fields.map(function (f) {
      var p = path.concat([f.k]), v = obj ? obj[f.k] : undefined, id = "f" + Math.random().toString(36).slice(2, 9);
      var lab = '<label class="fld" for="' + id + '"><span>' + esc(f.l) + "</span>";
      switch (f.t) {
        case "text": return lab + '<input class="input" id="' + id + '" data-p="' + pathAttr(p) + '" data-t="text" value="' + esc(v) + '"></label>';
        case "num": return lab + '<input class="input" id="' + id + '" type="number" step="any" data-p="' + pathAttr(p) + '" data-t="num" value="' + esc(v) + '"></label>';
        case "area": return lab + '<textarea class="input" id="' + id + '" rows="2" data-p="' + pathAttr(p) + '" data-t="text">' + esc(v) + "</textarea></label>";
        case "lines": return lab + '<textarea class="input" id="' + id + '" rows="3" data-p="' + pathAttr(p) + '" data-t="lines">' + esc((v || []).join("\n")) + "</textarea></label>";
        case "select": return lab + '<select class="input" id="' + id + '" data-p="' + pathAttr(p) + '" data-t="text">' + f.options.map(function (o) { return '<option value="' + o[0] + '"' + (v === o[0] ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") + "</select></label>";
        case "json": return lab + '<textarea class="input mono" id="' + id + '" rows="8" data-p="' + pathAttr(p) + '" data-t="json">' + esc(JSON.stringify(v || [], null, 2)) + '</textarea><em class="json-err" hidden>This is not valid JSON yet, so it will not be saved.</em></label>';
        case "group": return '<fieldset class="grp"><legend>' + esc(f.l) + "</legend>" + fieldsHTML(f.fields, v || {}, p) + "</fieldset>";
        case "list":
          var si = listSpecs.push(f) - 1;
          var arr = v || [];
          return '<fieldset class="grp"><legend>' + esc(f.l) + "</legend>" + arr.map(function (item, i) {
            return '<div class="item"><div class="item-head"><b>' + esc(f.item.charAt(0).toUpperCase() + f.item.slice(1)) + " " + (i + 1) + "</b>" + itemTools(p, i, arr.length) + "</div>" + fieldsHTML(f.fields, item, p.concat([i])) + "</div>";
          }).join("") + '<button class="btn sm" type="button" data-act="add" data-spec="' + si + '" data-p="' + pathAttr(p) + '">Add ' + esc(f.item) + "</button></fieldset>";
      }
      return "";
    }).join("");
  }
  function itemTools(listPath, i, n) {
    var p = pathAttr(listPath);
    return '<span class="btn-row"><button class="btn xs" type="button" data-act="up" data-i="' + i + '" data-p="' + p + '"' + (i === 0 ? " disabled" : "") + '>Move up</button>' +
      '<button class="btn xs" type="button" data-act="down" data-i="' + i + '" data-p="' + p + '"' + (i === n - 1 ? " disabled" : "") + '>Move down</button>' +
      '<button class="btn xs danger-ghost" type="button" data-act="del" data-i="' + i + '" data-p="' + p + '">Remove</button></span>';
  }
  function polyHTML(list, kinds, key, label) {
    var arr = list || [];
    return arr.map(function (item, i) {
      var spec = kinds[item.kind] || { label: item.kind, fields: [F("json", "_raw", "Raw")] };
      return '<div class="coach-card poly"><div class="item-head"><span class="poly-n">' + (i + 1) + '</span><select class="input" data-kind="' + i + '" data-key="' + key + '" aria-label="' + label + " type\">" +
        Object.keys(kinds).map(function (k) { return '<option value="' + k + '"' + (item.kind === k ? " selected" : "") + ">" + esc(kinds[k].label) + "</option>"; }).join("") + "</select>" +
        itemTools([key], i, arr.length) + "</div>" + fieldsHTML(spec.fields, item, [key, i]) + "</div>";
    }).join("") +
      '<div class="form-row"><select class="input" id="newKind" aria-label="New ' + label + ' type">' + Object.keys(kinds).map(function (k) { return '<option value="' + k + '">' + esc(kinds[k].label) + "</option>"; }).join("") + '</select><button class="btn" type="button" data-act="addpoly" data-key="' + key + '">Add ' + label + "</button></div>";
  }

  function renderEditor(key) {
    var orig = M.sessions.filter(function (s) { return s.key === key; })[0];
    if (!orig) { location.hash = "admin"; return; }
    var d = clone(orig), dirty = false;
    var listKey = d.kind === "lesson" ? "slides" : "activities";
    var kinds = d.kind === "lesson" ? SLIDE_KINDS : ACT_KINDS;
    var unitLabel = d.kind === "lesson" ? "slide" : "activity";
    if (!d[listKey]) d[listKey] = [];

    function paint() {
      var y = window.scrollY;
      listSpecs = [];
      var cycOpts = M.cycles.slice().sort(function (a, b) { return a.id - b.id; }).map(function (c, i) { return '<option value="' + c.id + '"' + (c.id === d.cycle ? " selected" : "") + ">Topic " + (i + 1) + ": " + esc(c.title) + "</option>"; }).join("");
      view.innerHTML = '<section class="coach editor">' +
        '<div class="form-row" style="justify-content:space-between"><button class="back" id="backBtn">Back to admin</button><span class="k" id="dirtyNote">' + (dirty ? "Unsaved changes" : "All changes saved") + "</span></div>" +
        '<h1 style="font-size:36px">' + esc(d.title || "Untitled") + "</h1>" +
        '<div class="coach-card"><div class="grid2">' +
        '<label class="fld"><span>Title</span><input class="input" data-p="' + pathAttr(["title"]) + '" data-t="text" value="' + esc(d.title) + '"></label>' +
        '<label class="fld"><span>Topic</span><select class="input" data-p="' + pathAttr(["cycle"]) + '" data-t="num">' + cycOpts + "</select></label>" +
        '<label class="fld"><span>Week</span><select class="input" data-p="' + pathAttr(["week"]) + '" data-t="num"><option value="1"' + (+d.week === 1 ? " selected" : "") + '>Week 1</option><option value="2"' + (+d.week === 2 ? " selected" : "") + ">Week 2</option></select></label>" +
        '<label class="fld"><span>Day it opens</span><select class="input" data-p="' + pathAttr(["day"]) + '" data-t="text"><option value="tue"' + (d.day === "tue" ? " selected" : "") + '>Tuesday</option><option value="fri"' + (d.day === "fri" ? " selected" : "") + ">Friday</option></select></label>" +
        '<label class="fld"><span>Minutes</span><input class="input" type="number" data-p="' + pathAttr(["minutes"]) + '" data-t="num" value="' + esc(d.minutes) + '"></label>' +
        '<label class="fld check"><input type="checkbox" data-p="' + pathAttr(["published"]) + '" data-t="bool"' + (d.published ? " checked" : "") + "><span>Live for trainees (unchecked = draft only you can see)</span></label>" +
        "</div></div>" +
        "<h2 style=\"font-size:24px\">" + (d.kind === "lesson" ? "Slides" : "Activities") + "</h2>" +
        polyHTML(d[listKey], kinds, listKey, unitLabel) +
        '<div class="savebar"><div class="wrap btn-row" style="justify-content:space-between"><span class="btn-row"><button class="btn primary" id="saveBtn">Save</button><button class="btn" id="prevBtn">Save and preview</button></span><button class="btn danger-ghost" id="delBtn">Delete session</button></div></div>' +
        "</section>";
      window.scrollTo(0, y);
      wire();
    }
    function markDirty() { dirty = true; var n = document.getElementById("dirtyNote"); if (n) n.textContent = "Unsaved changes"; }
    function wire() {
      document.getElementById("backBtn").onclick = function () { location.hash = "admin"; };
      view.querySelectorAll("[data-p][data-t]").forEach(function (el) {
        var handler = function () {
          var p = JSON.parse(el.getAttribute("data-p")), t = el.getAttribute("data-t"), v;
          if (t === "num") v = el.value === "" ? null : Number(el.value);
          else if (t === "bool") v = el.checked;
          else if (t === "lines") v = el.value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean);
          else if (t === "json") {
            var errEl = el.parentNode.querySelector(".json-err");
            try { v = JSON.parse(el.value || "[]"); if (errEl) errEl.hidden = true; } catch (e) { if (errEl) errEl.hidden = false; return; }
          } else v = el.value;
          setAt(d, p, v); markDirty();
        };
        el.addEventListener(el.tagName === "SELECT" || el.type === "checkbox" ? "change" : "input", handler);
      });
      view.querySelectorAll("[data-kind]").forEach(function (sel) {
        sel.onchange = function () {
          var i = +sel.getAttribute("data-kind"), old = d[listKey][i], n = kinds[sel.value].make();
          if (old && old.title) n.title = old.title;
          if (old && old.id) n.id = old.id;
          d[listKey][i] = n; markDirty(); paint();
        };
      });
      view.querySelectorAll("[data-act]").forEach(function (b) {
        b.onclick = function () {
          var act = b.getAttribute("data-act");
          if (act === "addpoly") {
            d[listKey].push(kinds[document.getElementById("newKind").value].make());
          } else {
            var p = JSON.parse(b.getAttribute("data-p")), arr = getAt(d, p);
            if (!Array.isArray(arr)) { arr = []; setAt(d, p, arr); }
            var i = +b.getAttribute("data-i");
            if (act === "add") arr.push(listSpecs[+b.getAttribute("data-spec")].make());
            if (act === "del") arr.splice(i, 1);
            if (act === "up" && i > 0) { var t = arr[i - 1]; arr[i - 1] = arr[i]; arr[i] = t; }
            if (act === "down" && i < arr.length - 1) { var u = arr[i + 1]; arr[i + 1] = arr[i]; arr[i] = u; }
          }
          markDirty(); paint();
        };
      });
      document.getElementById("saveBtn").onclick = function () { save(false); };
      document.getElementById("prevBtn").onclick = function () { save(true); };
      armConfirm(document.getElementById("delBtn"), "Yes, delete this session", function () {
        deleteSession(d.key).then(function () { dirty = false; toast("Session deleted."); location.hash = "admin"; }).catch(fail);
      });
    }
    function problems() {
      var out = [];
      if (!String(d.title || "").trim()) out.push("Give the session a title.");
      if (d.kind === "play") (d.activities || []).forEach(function (a, ai) {
        if (a.kind === "scenarios") (a.items || []).forEach(function (it, ii) {
          if (!(it.options || []).some(function (o) { return o.rating === "best"; })) out.push("Activity " + (ai + 1) + ", call " + (ii + 1) + " needs at least one answer rated Pro move.");
          if (!it.id) it.id = rid("call");
        });
        if (!a.id) a.id = rid(a.kind);
      });
      return out;
    }
    function save(thenPreview) {
      var p = problems();
      if (p.length) { toast(p[0]); return; }
      saveSession(clone(d)).then(function () {
        dirty = false; toast("Saved. Trainees see it " + (d.published ? "now." : "once you mark it live."));
        if (thenPreview) location.hash = "s-" + d.key; else paint();
      }).catch(fail);
    }
    function beforeUnload(e) { if (dirty) { e.preventDefault(); e.returnValue = ""; } }
    window.addEventListener("beforeunload", beforeUnload);
    cleanup = function () { window.removeEventListener("beforeunload", beforeUnload); };
    paint();
  }

  // ----- settings -----
  function renderSettings() {
    var pr = program(), ch = cheers();
    var html = '<div class="coach-card"><h3>Program</h3>' +
      '<label class="fld"><span>Start date (a Tuesday). Week 1 opens this day.</span><input class="input" type="date" id="ps" value="' + esc(pr.programStart) + '"></label>' +
      '<label class="fld"><span>Trainees (one name per line)</span><textarea class="input" rows="3" id="tr">' + esc((pr.trainees || []).join("\n")) + "</textarea></label>" +
      '<div><button class="btn primary" id="saveProg">Save program</button></div></div>' +
      '<div class="coach-card"><h3>Trainee PINs</h3><p class="k">Each trainee enters their PIN once per device. Leave a box empty to keep the current PIN. PINs keep Dana and Devin out of each other\'s boards; they are not bank-grade security.</p>' +
      (pr.trainees || []).map(function (n) {
        return '<div class="form-row"><label class="fld" style="flex:1 1 200px"><span>' + esc(n) + " (" + ((pr.pins || {})[n] ? "PIN set" : "no PIN yet") + ')</span><input class="input" type="password" inputmode="numeric" maxlength="8" autocomplete="new-password" placeholder="New PIN, 4 to 8 digits" data-pin="' + esc(n) + '"></label>' +
          ((pr.pins || {})[n] ? '<label class="fld check" style="align-self:end"><input type="checkbox" data-pinoff="' + esc(n) + '"><span>Remove PIN</span></label>' : "") + "</div>";
      }).join("") + '<div><button class="btn primary" id="savePins">Save PINs</button></div></div>' +
      '<div class="coach-card"><h3>Who sees what, when</h3><p class="k">Everyone gets every week eventually, in a different order, so trainees never do the same session in the same week. Pick the week each person starts with.</p>' +
      (pr.trainees || []).map(function (n, i) {
        var u = units(), off = offsetFor(n);
        return '<label class="fld"><span>' + esc(n) + ' starts with</span><select class="input" data-rot="' + esc(n) + '">' +
          u.map(function (x, j) { var c = cycleById(x.cycle); return '<option value="' + j + '"' + (j === off ? " selected" : "") + ">" + (j + 1) + ". " + esc(c ? c.title : "") + ", week " + x.week + "</option>"; }).join("") + "</select></label>";
      }).join("") +
      '<div class="table-box"><table class="rot-table"><thead><tr><th>Program week</th>' + (pr.trainees || []).map(function (n) { return "<th>" + esc(n) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      units().map(function (_, w) {
        var d = parseDate(pr.programStart); d.setDate(d.getDate() + w * 7);
        return '<tr><td class="num">Week ' + (w + 1) + " (" + fmtDay(d) + ")</td>" + (pr.trainees || []).map(function (n) {
          var u = units(), x = u[(w + offsetFor(n)) % u.length], c = x && cycleById(x.cycle);
          return "<td>" + esc(c ? c.title : "") + (x ? ", week " + x.week : "") + "</td>";
        }).join("") + "</tr>";
      }).join("") + '</tbody></table></div><div><button class="btn primary" id="saveRot">Save schedule</button></div></div>' +
      '<div class="coach-card"><h3>Feedback lines</h3><p class="k">One line per row. A random one shows after each answer.</p>' +
      '<label class="fld"><span>After a pro move</span><textarea class="input" rows="5" id="chb">' + esc((ch.best || []).join("\n")) + "</textarea></label>" +
      '<label class="fld"><span>After a good move</span><textarea class="input" rows="4" id="chg">' + esc((ch.good || []).join("\n")) + "</textarea></label>" +
      '<label class="fld"><span>After a safe move</span><textarea class="input" rows="4" id="cho">' + esc((ch.ok || []).join("\n")) + "</textarea></label>" +
      '<div><button class="btn primary" id="saveCheers">Save feedback lines</button></div></div>';
    adminShell("admin-settings", html);
    function lines(id) { return document.getElementById(id).value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean); }
    document.getElementById("saveProg").onclick = function () {
      var v = Object.assign({}, program(), { programStart: document.getElementById("ps").value || program().programStart, trainees: lines("tr") });
      if (!v.trainees.length) { toast("Add at least one trainee."); return; }
      saveSetting("program", v).then(function () { rebuild(); toast("Program saved."); renderSettings(); }).catch(fail);
    };
    document.getElementById("savePins").onclick = function () {
      var pins = Object.assign({}, program().pins || {}), jobs = [], bad = false;
      view.querySelectorAll("[data-pinoff]").forEach(function (c) { if (c.checked) delete pins[c.getAttribute("data-pinoff")]; });
      view.querySelectorAll("[data-pin]").forEach(function (inp) {
        var n = inp.getAttribute("data-pin"), v = inp.value.trim();
        if (!v) return;
        if (!/^[0-9]{4,8}$/.test(v)) { bad = true; return; }
        jobs.push(hashPin(n, v).then(function (h) { pins[n] = h; }));
      });
      if (bad) { toast("PINs are 4 to 8 digits."); return; }
      Promise.all(jobs).then(function () {
        return saveSetting("program", Object.assign({}, program(), { pins: pins }));
      }).then(function () { toast("PINs saved."); renderSettings(); }).catch(fail);
    };
    document.getElementById("saveRot").onclick = function () {
      var rot = {};
      view.querySelectorAll("[data-rot]").forEach(function (s) { rot[s.getAttribute("data-rot")] = +s.value; });
      var v = Object.assign({}, program(), { rotation: rot });
      saveSetting("program", v).then(function () { rebuild(); toast("Schedule saved."); renderSettings(); }).catch(fail);
    };
    document.getElementById("saveCheers").onclick = function () {
      var v = { best: lines("chb"), good: lines("chg"), ok: lines("cho") };
      if (!v.best.length || !v.good.length || !v.ok.length) { toast("Keep at least one line in each box."); return; }
      saveSetting("cheers", v).then(function () { toast("Feedback lines saved."); }).catch(fail);
    };
  }

  // ----- activity log -----
  function describe(e) {
    var s = e.session_key && M.sessions.filter(function (x) { return x.key === e.session_key; })[0];
    var t = s ? s.title : (e.session_key || "");
    switch (e.event_type) {
      case "session_open": return "Opened " + t;
      case "lesson_complete": return "Finished lesson " + t + (e.duration_sec ? " (" + Math.max(1, Math.round(e.duration_sec / 60)) + " min)" : "");
      case "activity_complete": return "Finished an activity in " + t;
      case "answer": return "Answered: " + (e.choice || "");
      case "card": return "Flashcard " + (e.choice === "got" ? "got it" : "see again");
      case "board_check": return "Checked board: " + ((e.meta && e.meta.hits) || 0) + " of " + ((e.meta && e.meta.total) || 5) + " goals";
      case "badge": return "Earned badge " + (e.item_key || "");
    }
    return e.event_type;
  }
  function renderLog() {
    adminShell("admin-log", "<p>Loading the training log...</p>");
    var load = remote ? apiList(null).catch(function () { return null; }) : Promise.resolve(localAll().slice().reverse());
    load.then(function (rows) {
      var note = "";
      if (rows === null) { note = '<p class="banner">The training log could not be reached, so this shows activity from this device only.</p>'; rows = localAll().slice().reverse(); }
      var names = program().trainees || [];
      var cards = names.map(function (n) {
        var ev = rows.filter(function (e) { return e.trainee === n; });
        var pts = ev.reduce(function (a, e) { return a + (e.points || 0); }, 0);
        var last = ev[0] ? fmtTime(ev[0].created_at) : "Not yet";
        var firsts = {}; ev.filter(function (e) { return e.event_type === "answer"; }).slice().reverse().forEach(function (e) { if (!firsts[e.item_key]) firsts[e.item_key] = e; });
        var fa = Object.keys(firsts).map(function (k) { return firsts[k]; });
        var mix = { best: 0, good: 0, ok: 0 }; fa.forEach(function (e) { mix[e.rating] = (mix[e.rating] || 0) + 1; });
        var total = fa.length || 1;
        var lessons = ev.filter(function (e) { return e.event_type === "lesson_complete"; });
        var mins = Math.round(lessons.reduce(function (a, e) { return a + (e.duration_sec || 0); }, 0) / 60);
        var doneKeys = {}; lessons.forEach(function (e) { doneKeys[e.session_key] = 1; });
        var talk = fa.filter(function (e) { return e.rating !== "best"; }).map(function (e) { return e.choice; });
        return '<div class="coach-card"><h3>' + esc(n) + '</h3><div class="kv num"><span>Points</span><b>' + pts + "</b><span>Level</span><b>" + esc(level(pts)) + "</b><span>Last active</span><b>" + last + "</b><span>Lessons finished</span><b>" + Object.keys(doneKeys).length + "</b><span>Lesson time</span><b>" + mins + " min</b><span>Calls answered</span><b>" + fa.length + "</b></div>" +
          '<div class="mix" title="First answers: pro, good, safe"><i style="width:' + (mix.best / total * 100) + '%;background:var(--green)"></i><i style="width:' + (mix.good / total * 100) + '%;background:var(--sky)"></i><i style="width:' + (mix.ok / total * 100) + '%;background:var(--sun)"></i></div>' +
          '<p class="k">First answers: ' + mix.best + " pro, " + mix.good + " good, " + mix.ok + " safe.</p>" +
          (talk.length ? '<p style="font-size:15px"><b>Talk through:</b></p><ul class="talk">' + talk.slice(0, 5).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" : "") + "</div>";
      }).join("");
      var table = '<div class="table-box"><table><thead><tr><th>When</th><th>Who</th><th>What</th><th>Result</th><th>Points</th></tr></thead><tbody>' +
        rows.slice(0, 300).map(function (e) {
          return '<tr><td class="num">' + fmtTime(e.created_at) + "</td><td>" + esc(e.trainee) + "</td><td>" + esc(describe(e)) + "</td><td>" + (e.rating ? '<span class="rate ' + esc(e.rating) + '">' + (RATE_LABEL[e.rating] || "") + "</span>" : "") + '</td><td class="num">' + (e.points || "") + "</td></tr>";
        }).join("") + (rows.length ? "" : '<tr><td colspan="5">No activity yet. It shows up here the moment Dana or Devin opens a session.</td></tr>') + "</tbody></table></div>";
      document.getElementById("adminBody").innerHTML = note + '<div><button class="btn" id="refresh">Refresh</button></div><div class="coach-cards">' + cards + '</div><h2 style="font-size:24px">Activity log</h2>' + table;
      document.getElementById("refresh").onclick = renderLog;
    });
  }

  // ---------- start ----------
  document.getElementById("brand").onclick = function () { location.hash = "home"; route(); };
  window.addEventListener("hashchange", route);
  loadContent().then(loadEvents).then(route);
})();
