"use strict";
/* Black Friday Deal Finder — client logic. Data comes from deals.js (window.DEALS).
   No network requests: everything is local. */

var DEALS = window.DEALS || [];

function discountPct(d) {
  return Math.round((1 - d.salePrice / d.usualPrice) * 100);
}

function verdict(d) {
  var pct = discountPct(d);
  if (pct >= 50) return { label: "REAL DEAL", cls: "badge-real" };
  if (pct >= 30 || (pct >= 20 && d.allTimeLow)) return { label: "GOOD DEAL", cls: "badge-good" };
  return { label: "MODEST", cls: "badge-modest" };
}

function money(n) {
  return "$" + n.toFixed(2).replace(/\.00$/, "");
}

function checkDate(iso) {
  var d = new Date(iso);
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[d.getUTCMonth()] + " " + d.getUTCDate() + ", " + d.getUTCFullYear();
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function cardHtml(d) {
  var pct = discountPct(d);
  var v = verdict(d);
  var save = d.usualPrice - d.salePrice;
  return '<article class="card">' +
    '<div class="card-top"><span class="pct">-' + pct + '%</span>' +
    '<span class="badge ' + v.cls + '">' + v.label + '</span></div>' +
    '<h2>' + esc(d.product) + '</h2>' +
    '<p class="meta"><b>' + esc(d.store) + '</b> &middot; ' + esc(d.category) +
    (d.allTimeLow ? ' &middot; All-time low' : '') + '</p>' +
    '<p class="prices"><span class="sale">' + money(d.salePrice) + '</span>' +
    '<span class="was">' + money(d.usualPrice) + '</span>' +
    '<span class="save">Save ' + money(save) + '</span></p>' +
    '<p class="note">' + esc(d.note) + '</p>' +
    '<p class="checked"><span class="tick">&#10003; Verified</span> — price checked ' + checkDate(d.checkedAt) + ' (UTC)</p>' +
    '<a class="store-link" href="' + esc(d.url) + '" target="_blank" rel="noopener">View at ' + esc(d.store) + ' &nearr;</a>' +
    '</article>';
}

function fillSelect(el, values) {
  values.forEach(function (v) {
    var o = document.createElement("option");
    o.value = v; o.textContent = v;
    el.appendChild(o);
  });
}

function init() {
  var categories = [], stores = [];
  DEALS.forEach(function (d) {
    if (categories.indexOf(d.category) === -1) categories.push(d.category);
    if (stores.indexOf(d.store) === -1) stores.push(d.store);
  });
  categories.sort(); stores.sort();
  fillSelect(document.getElementById("category"), categories);
  fillSelect(document.getElementById("store"), stores);

  // Shareable filtered views: ?q=airpods&store=Amazon&min=50&real=1 etc.
  var params = new URLSearchParams(window.location.search);
  var preset = function (id, key) {
    var v = params.get(key);
    if (v !== null) document.getElementById(id).value = v;
  };
  preset("search", "q");
  preset("category", "category");
  preset("store", "store");
  preset("min-discount", "min");
  preset("sort", "sort");
  if (params.get("real") === "1") document.getElementById("real-only").checked = true;

  // Stats bar.
  var totalSave = DEALS.reduce(function (s, d) { return s + (d.usualPrice - d.salePrice); }, 0);
  var avgPct = DEALS.length
    ? Math.round(DEALS.reduce(function (s, d) { return s + discountPct(d); }, 0) / DEALS.length)
    : 0;
  var realCount = DEALS.filter(function (d) { return discountPct(d) >= 50; }).length;
  document.getElementById("stats").innerHTML =
    "<span class='stat'><b>" + DEALS.length + "</b> deals checked</span>" +
    "<span class='stat'><b>" + stores.length + "</b> stores</span>" +
    "<span class='stat'><b>" + realCount + "</b> real deals (50%+ off)</span>" +
    "<span class='stat'>avg discount <b>" + avgPct + "%</b></span>" +
    "<span class='stat'>total savings <b>" + money(totalSave) + "</b></span>";

  // Top picks: the three biggest discounts.
  var top = DEALS.slice().sort(function (a, b) { return discountPct(b) - discountPct(a); }).slice(0, 3);
  document.getElementById("top-picks").innerHTML = top.map(function (d) {
    return "<span class='pick'>Top pick: <b>" + esc(d.product) + "</b> — " + money(d.salePrice) +
      " (" + discountPct(d) + "% off at " + esc(d.store) + ")</span>";
  }).join("");

  ["search", "category", "store", "min-discount", "sort", "real-only"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", render);
    document.getElementById(id).addEventListener("change", render);
  });
  render();
}

function render() {
  var q = document.getElementById("search").value.trim().toLowerCase();
  var cat = document.getElementById("category").value;
  var store = document.getElementById("store").value;
  var minPct = parseInt(document.getElementById("min-discount").value, 10) || 0;
  var sort = document.getElementById("sort").value;
  var realOnly = document.getElementById("real-only").checked;

  var list = DEALS.filter(function (d) {
    if (q && (d.product + " " + d.store + " " + d.category).toLowerCase().indexOf(q) === -1) return false;
    if (cat && d.category !== cat) return false;
    if (store && d.store !== store) return false;
    if (discountPct(d) < minPct) return false;
    if (realOnly && discountPct(d) < 50) return false;
    return true;
  });

  list.sort(function (a, b) {
    if (sort === "savings") return (b.usualPrice - b.salePrice) - (a.usualPrice - a.salePrice);
    if (sort === "price-asc") return a.salePrice - b.salePrice;
    if (sort === "price-desc") return b.salePrice - a.salePrice;
    return discountPct(b) - discountPct(a);
  });

  document.getElementById("grid").innerHTML = list.map(cardHtml).join("");
  document.getElementById("count").textContent =
    "Showing " + list.length + " of " + DEALS.length + " deals";
  document.getElementById("empty").hidden = list.length !== 0;
}

document.addEventListener("DOMContentLoaded", init);
