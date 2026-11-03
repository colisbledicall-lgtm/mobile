/* Colisbledi — application unifiée : trajets, dossier colis (suivi, messages, assurance, signatures, feuille de route) */
'use strict';
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eur = n => Number(n).toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' €';
const pr = n => Number(n).toLocaleString('fr-FR', {maximumFractionDigits: 2});
const dAdd = n => { const d = new Date(); d.setDate(d.getDate() + n); d.setHours(9, 0, 0, 0); return d.toISOString(); };
const nowIso = () => new Date().toISOString();
const fd = iso => new Date(iso).toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'});
const fdShort = iso => new Date(iso).toLocaleDateString('fr-FR', {weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'});
const fts = iso => new Date(iso).toLocaleString('fr-FR', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'});
const ftl = iso => new Date(iso).toLocaleString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
const ini = n => String(n).split(/\s+/).map(x => x[0]).join('').slice(0, 2).toUpperCase();

const IC = {
  ship: '<path d="M3 17c1.5 1.5 3 1.5 4.5 0s3-1.5 4.5 0 3 1.5 4.5 0 3-1.5 4.5 0M5 14l-1-5h16l-1 5M8 9V5h8v4M12 5V3"/>',
  plane: '<path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  car: '<path d="M5 16V11l2-5h10l2 5v5M3 16h18v3H3zM7 19v2M17 19v2M7 12h10"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  filter: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  box: '<path d="M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18M16 15h2"/>',
  route: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  star: '<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.3l1.1-6.2L3 9.7l6.2-.9z"/>',
  truck: '<path d="M2 6h12v10H2zM14 9h4l3 3v4h-7M6 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01"/>',
  bank: '<path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/>',
  cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/>',
  more: '<circle cx="12" cy="5" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="12" cy="19" r="1.2"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  check: '<path d="M5 12l4 4 10-10"/>',
  chev: '<path d="M9 5l7 7-7 7"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 8l9 6 9-6"/>',
  send: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.3 10.8l7.4-3.6M8.3 13.2l7.4 3.6"/>',
  pin: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  flag: '<path d="M5 21V4M5 4h12l-2 4 2 4H5"/>',
  medal: '<circle cx="12" cy="9" r="5"/><path d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  file: '<path d="M6 3h8l5 5v13H6zM14 3v5h5M9 13h7M9 17h7"/>',
  pen: '<path d="M4 20l1-4L17 4l3 3L8 19zM14 7l3 3"/>',
  wa: '<path d="M4 20l1.300-4A8 8 0 1 1 8 18.700z"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'
  ,bell: '<path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4zM10 21h4"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="3"/><path d="M11 18h2"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  refund: '<path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"/>'
};
const ico = (k, cls) => '<svg class="i ' + (cls || '') + '" viewBox="0 0 24 24">' + IC[k] + '</svg>';
const modeIc = m => ico(m === 'avion' ? 'plane' : m === 'voiture' ? 'car' : 'ship');

/* ---------- Données (fictives, enregistrées dans ce navigateur) ---------- */
const TIERS = [[50, 2], [100, 3.5], [250, 5], [500, 8], [1000, 13]];
const planFor = v => TIERS.findIndex(t => v <= t[0]);
const SIZES = {S: ['Petit', 'Documents, clés', 1, 'mail'], M: ['Moyen', 'Boîte à chaussures', 3, 'box'], L: ['Grand', 'Valise cabine', 10, 'box'], XL: ['Très grand', 'Vélos, meuble', 25, 'truck']};
const STEPS = ['Demande envoyée', 'Colis accepté', 'Paiement confirmé', 'En route', 'Livré'];
const KEY = 'colisbledi_app_v3';
const ME = {name: 'Vous', carrier: 'Transporteur Démo', rating: 5.0, reviews: 2};
const CITY = {Paris: [48.85, 2.35], Lyon: [45.76, 4.84], Marseille: [43.3, 5.37], Lille: [50.63, 3.06], Toulouse: [43.6, 1.44], Bruxelles: [50.85, 4.35], Londres: [51.5, -0.12], Rennes: [48.11, -1.68], Rouen: [49.44, 1.1], Caen: [49.18, -0.37], Narbonne: [43.18, 3], Montpellier: [43.61, 3.88], Tunis: [36.8, 10.18], Sfax: [34.74, 10.76], Sousse: [35.83, 10.64], Monastir: [35.78, 10.83], Nabeul: [36.45, 10.73], Bizerte: [37.27, 9.87], Gabès: [33.88, 10.1]};

function mkParcel(o) {
  const p = Object.assign({recipient: {name: '', phone: ''}, content: '', accepted: false, sig: {sender: null, dest: null}, hist: [], ins: true, pay: 'espèces', size: 'S', kg: 1, value: 100, sender: ME.name}, o);
  recalc(p); return p;
}
function seed() {
  const T = [
    ['t1', 'Nadia M.', 5.0, 3, 'Tunisie', 'France', 'bateau', 2, 0, 'Tunis', 'Marseille', '33700000001'],
    ['t2', 'Yassine K.', null, 0, 'France', 'Tunisie', 'bateau', 3.5, 2, 'Paris', 'Tunis', '33700000002'],
    ['t3', 'Imen S.', 4.9, 12, 'France', 'Tunisie', 'avion', 4, 5, 'Lyon', 'Sfax', '33700000003'],
    ['t4', 'Walid H.', 4.8, 7, 'France', 'Tunisie', 'voiture', 3, 9, 'Marseille', 'Sousse', '33700000004'],
    ['t5', 'Hela D.', null, 0, 'Tunisie', 'France', 'avion', 5, 12, 'Tunis', 'Paris', '33700000005'],
    ['t6', 'Anis G.', 4.7, 5, 'France', 'Tunisie', 'bateau', 2.5, 16, 'Toulouse', 'Tunis', '33700000006']
  ].map(a => ({id: a[0], name: a[1], rating: a[2], reviews: a[3], from: a[4], to: a[5], mode: a[6], price: a[7], date: dAdd(a[8]), fromCity: a[9], toCity: a[10], phone: a[11]}));
  const ST = {t2: ['Lyon', 'Marseille'], t3: ['Lyon'], t4: ['Lyon'], t6: ['Narbonne', 'Marseille'], m3: ['Marseille']};
  T.forEach((x, i) => { x.stops = ST[x.id] || []; x.done = 12 + i * 9; x.sent = 8 + i * 5; });
  const mine = [['m1', 'Narbonne', 'Tunisie', -11], ['m2', 'Montpellier', 'Tunisie', -11], ['m3', 'Tunis', 'Toulouse', 6]].map((a, i) => ({id: a[0], name: ME.carrier, rating: 5, reviews: 2, from: a[1], to: a[2], mode: 'bateau', price: 4, date: dAdd(a[3]), fromCity: a[1], toCity: a[2], mine: true, tickets: i === 2 ? 1 : 0, stops: ST[a[0]] || [], done: 58, sent: 8, phone: ''}));
  const h = (n, base) => { const a = []; for (let i = 0; i <= n; i++) a.push({s: i, t: new Date(new Date(dAdd(base)).getTime() + i * 72e5).toISOString()}); return a; };
  const parcels = [
    mkParcel({id: 15913, tripId: 't2', from: 'Paris', to: 'Tunis', size: 'S', kg: 2, content: 'Vêtements et documents pour la famille', recipient: {name: 'Mounir A.', phone: ''}, value: 180, step: 1, hist: h(1, -1), created: dAdd(-1), demo: true}),
    mkParcel({id: 15703, tripId: 't1', from: 'Tunis', to: 'Marseille', size: 'M', kg: 3, content: 'Cadeaux et produits artisanaux', recipient: {name: 'Lamia B.', phone: ''}, value: 80, step: 3, hist: h(3, -9), created: dAdd(-9), demo: true})
  ];
  const DBx = {
    trips: T.concat(mine),
    ads: [
      {id: 'a1', name: 'Rachid B.', from: 'Marseille', to: 'Sfax', kg: 6, budget: 30, note: 'Cadeaux de famille', date: dAdd(10)},
      {id: 'a2', name: 'Karima F.', from: 'Lyon', to: 'Sousse', kg: 2, budget: 15, note: 'Documents, colis léger', date: dAdd(7)},
      {id: 'a3', name: 'Omar D.', from: 'Bruxelles', to: 'Tunis', kg: 4, budget: 25, note: 'Médicaments, à vérifier par un pharmacien', date: dAdd(14)}
    ],
    parcels,
    chats: [
      {id: 'c15913', parcelId: 15913, unread: true, msgs: [{me: false, t: 'Bonjour, je suis disponible pour votre colis. Où peut-on se retrouver à Paris ?', d: dAdd(-1)}]},
      {id: 'c15703', parcelId: 15703, unread: false, msgs: [{me: true, t: 'Bonjour, mon colis est prêt.', d: dAdd(-9)}, {me: false, t: 'Parfait, je pars demain par le bateau.', d: dAdd(-8)}]}
    ],
    incidents: [],
    notifs: [
      {t: 'Le colis 15913 est accepté par Yassine K.', d: dAdd(-1)},
      {t: 'Le colis 15703 est en route vers Marseille.', d: dAdd(-3)},
      {t: 'Le colis 11280 est livré automatiquement.', d: dAdd(-12)}
    ],
    prefs: {push: true, email: true, wa: false, colis: true, msg: true, pay: true, promo: false},
    bank: null, me: {bio: 'Je voyage régulièrement entre la France et la Tunisie.', langs: ['Français', 'Arabe'], verif: {id: false, phone: true, email: true}, since: 2025},
    ops: [{id: 1, type: 'versement', label: 'Colis 11280 livré', amount: 24, date: dAdd(-12), status: 'Effectué', pid: 11280}, {id: 2, type: 'remboursement', label: 'Colis 11102 annulé', amount: 4.5, date: dAdd(-20), status: 'Remboursée', pid: 11102, rid: 1}],
    refunds: [{id: 1, pid: 11102, amount: 4.5, status: 2, date: dAdd(-20), reason: 'Annulation avant le départ'}],
    nextId: 15914, nextInc: 1, nextOp: 3, nextRef: 2
  };
  DBx.notifs.forEach((n, i) => { n.type = nTypeOf(n.t); n.pid = +((n.t.match(/olis (\d+)/) || [])[1] || 0); n.read = i > 1; });
  return DBx;
}
function nTypeOf(t) { return /répondu|message/i.test(t) ? 'msg' : /rembours|retrait|versement|paiement|virement|compte bancaire/i.test(t) ? 'pay' : 'colis'; }
let DB;
try { DB = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
if (!DB || !DB.trips || !DB.parcels || !DB.ops) { DB = seed(); DB.parcels.forEach(recalc); }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) {} };

const getP = id => DB.parcels.find(p => p.id === +id);
const tripOf = p => DB.trips.find(t => t.id === p.tripId);
const chatOf = p => DB.chats.find(c => c.parcelId === p.id);
const pStatus = p => p.step >= 4 ? 'LIVRÉ' : 'EN COURS';
function recalc(p) {
  const t = DB && DB.trips ? DB.trips.find(x => x.id === p.tripId) : null;
  const v = parseFloat(p.value) || 0, i = planFor(v);
  p.transport = (parseFloat(p.kg) || 0) * (t ? t.price : 0);
  p.tier = i;
  p.insPrice = p.ins && i >= 0 ? TIERS[i][1] : 0;
  p.amount = p.transport + p.insPrice;
}
function setStep(p, s) {
  if (s <= p.step && p.hist.some(h => h.s === s)) return;
  p.step = s; p.hist.push({s, t: nowIso()});
  const t = tripOf(p);
  notify('Colis ' + p.id + ' : ' + STEPS[s].toLowerCase() + (t ? ' (' + t.name + ')' : '') + '.', nowIso());
}
let toastT;
const toast = m => { const t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 3200); };
function copyTxt(s, msg) {
  const ok = () => toast(msg || 'Copié dans le presse-papiers.');
  const fb = () => { const t = document.createElement('textarea'); t.value = s; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); let r = false; try { r = document.execCommand('copy'); } catch (e) {} t.remove(); toast(r ? (msg || 'Copié.') : 'Copie impossible : sélectionnez le texte à la main.'); };
  try { navigator.clipboard.writeText(s).then(ok, fb); } catch (e) { fb(); }
}
const waUrl = (phone, text) => 'https://wa.me/' + (/^\d{8,15}$/.test(String(phone || '').replace(/\D/g, '')) ? String(phone).replace(/\D/g, '') : '') + '?text=' + encodeURIComponent(text);
async function sha(text) {
  try { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)); return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('').slice(0, 24).toUpperCase(); }
  catch (e) { let h = 5381; for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0; return 'L' + h.toString(16).toUpperCase().padStart(8, '0'); }
}

/* ---------- Navigation ---------- */
const NAVD = [['trips', 'Trajets'], ['chats', 'Messages'], ['colis', 'Colis'], ['mytrips', 'Mes trajets'], ['pay', 'Paiements'], ['profile', 'Profil']];
const NAVM = [['trips', 'Trajets', 'route'], ['chats', 'Messages', 'chat'], ['colis', 'Colis', 'box'], ['pay', 'Paiements', 'wallet'], ['profile', 'Profil', 'user']];
const SUB = {import: 'profile', user: 'trips', notifs: 'profile', trip: 'trips', parcel: 'colis', req: 'colis', mytrips: 'profile'};
let page = 'trips', tab = 'trips', q = '', fl = {from: '', to: '', mode: ''}, chatFilter = 'all', sort = 'recent';
let curTrip = '', prevPage = 'trips', pid = 0, ptab = 'trajet';
const unreadN = () => DB.chats.filter(c => c.unread).length;
function nav() {
  const cur = SUB[page] || page, bd = id => id === 'chats' && unreadN() ? id : '';
  $('tabbar').innerHTML = NAVM.map(([id, l, ic]) => `<button type="button" data-go="${id}"${id === cur ? ' class="on"' : ''}><span class="tb">${ico(ic)}</span>${l}${bd(id) ? `<span class="nb">${unreadN()}</span>` : ''}</button>`).join('');
  const dcur = page === 'parcel' || page === 'req' ? 'colis' : page === 'trip' ? 'trips' : page;
  $('dnav').innerHTML = NAVD.map(([id, l]) => `<button type="button" data-go="${id}"${id === dcur ? ' class="on"' : ''}>${l}${bd(id) ? `<span class="badge-n">${unreadN()}</span>` : ''}</button>`).join('');
  $('bdot').hidden = !DB.notifs.some(n => !n.read);
}
function go(p) { if (p === 'trip') prevPage = page === 'trip' ? prevPage : page; page = p; closePops(); render(); window.scrollTo(0, 0); }
function openParcel(id, t) { pid = +id; ptab = t || 'trajet'; if (page !== 'parcel') prevPage = page; page = 'parcel'; closeSheet(); closePops(); render(); window.scrollTo(0, 0); }
function render() {
  nav();
  $('fab').hidden = !(page === 'trips' || page === 'mytrips');
  Object.keys(pads).forEach(k => delete pads[k]);
  $('view').innerHTML = V[page]();
  drawQr(); initPads();
  const pt = document.querySelector('.ptabs'), on = pt && pt.querySelector('.on'); if (on) pt.scrollLeft = on.offsetLeft - (pt.clientWidth - on.offsetWidth) / 2;
}
function drawQr() {
  document.querySelectorAll('[data-qr]').forEach(el => {
    if (typeof QRCode === 'undefined' || el.dataset.done) return;
    try { el.textContent = ''; new QRCode(el, {text: el.dataset.qr, width: 92, height: 92, colorDark: '#054D28', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M}); el.dataset.done = '1'; } catch (e) { el.textContent = el.dataset.qr; }
  });
}

/* ---------- Éléments communs ---------- */
const empty = (t, s) => `<div class="card" style="text-align:center;padding:40px 20px"><b style="font-size:18px">${t}</b><p class="muted" style="margin-top:6px;font-weight:500">${s}</p></div>`;
const rating = t => t.rating ? `<small>${ico('star')}${t.rating.toFixed(1)} (${t.reviews} avis)</small>` : `<small>${ico('star')}Nouveau</small>`;
const cities = () => [...new Set(DB.trips.flatMap(t => [t.from, t.to]).concat(DB.ads.flatMap(a => [a.from, a.to])))].sort();
const stTag = p => p.cancelled ? '<span class="status">ANNULÉ</span>' : `<span class="status${p.step >= 4 ? ' ok' : ''}">${pStatus(p)}</span>`;
const checks = p => [
  ['Trajet et transporteur choisis', !!tripOf(p)],
  ['Paiement confirmé', p.step >= 2],
  ['Assurance renseignée et règles acceptées', !!p.accepted],
  ['Signature de l’expéditeur', !!p.sig.sender],
  ['Signature du destinataire à la remise', !!p.sig.dest]
];
const complete = p => checks(p).every(c => c[1]);

function mapSvg(t) {
  const names = [t.fromCity || t.from].concat(t.stops || [], [t.toCity || t.to]);
  const pts = names.map(n => CITY[n] ? {n, p: CITY[n]} : null).filter(Boolean);
  const W = 320, H = 300, x = l => (l + 3) / 15 * W, y = la => (52 - la) / 20 * H;
  let g = ''; for (let i = 0; i <= 5; i++) g += `<line x1="0" x2="${W}" y1="${i * H / 5}" y2="${i * H / 5}" stroke="rgba(5,77,40,.1)"/><line y1="0" y2="${H}" x1="${i * W / 5}" x2="${i * W / 5}" stroke="rgba(5,77,40,.1)"/>`;
  const path = pts.map((a, i) => (i ? 'L' : 'M') + x(a.p[1]).toFixed(1) + ' ' + y(a.p[0]).toFixed(1)).join(' ');
  const dots = pts.map((a, i) => { const e = i === 0 || i === pts.length - 1, px = x(a.p[1]), right = px > 230; return `<circle cx="${px.toFixed(1)}" cy="${y(a.p[0]).toFixed(1)}" r="${e ? 7 : 5}" fill="${i === 0 ? '#9FE870' : e ? '#054D28' : '#fff'}" stroke="#054D28" stroke-width="2.5"/><text x="${(px + (right ? -11 : 11)).toFixed(1)}" text-anchor="${right ? 'end' : 'start'}" y="${(y(a.p[0]) + 4).toFixed(1)}" font-size="11" font-weight="800" fill="#163300" font-family="Inter,sans-serif">${a.n}</text>`; }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Schéma du trajet ${esc(names.join(', '))}" style="min-height:240px"><rect width="${W}" height="${H}" fill="#E2F6D5"/>${g}<text x="${W / 2}" y="${H * 0.6}" text-anchor="middle" font-size="22" font-weight="900" fill="rgba(5,77,40,.14)" font-family="Inter,sans-serif">MÉDITERRANÉE</text><path d="${path}" fill="none" stroke="#054D28" stroke-width="3" stroke-dasharray="7 6" stroke-linecap="round"/>${dots}</svg>`;
}
function tlTrip(t) {
  const st = t.stops || [];
  return `<div class="tlv"><div><span class="d s">${modeIc(t.mode)}</span><p><b>${esc(t.fromCity || t.from)}</b><span>Départ · ${fd(t.date)}</span></p></div>${st.map((s, i) => `<div><span class="d">${ico('pin')}</span><p><b>${esc(s)}</b><span>Escale ${i + 1}</span></p></div>`).join('')}<div><span class="d">${ico('flag')}</span><p><b>${esc(t.toCity || t.to)}</b><span>Destination</span></p></div></div>`;
}

/* ---------- Vues ---------- */
const V = {
  trips() {
    const s = q.toLowerCase();
    const m = x => (!fl.from || x.from === fl.from) && (!fl.to || x.to === fl.to) && (!s || (x.name + ' ' + x.from + ' ' + x.to + ' ' + (x.fromCity || '') + ' ' + (x.toCity || '')).toLowerCase().includes(s));
    const trips = DB.trips.filter(t => !t.mine && new Date(t.date) > new Date(Date.now() - 864e5) && m(t) && (!fl.mode || t.mode === fl.mode)).sort((a, b) => a.date.localeCompare(b.date));
    const ads = DB.ads.filter(m);
    const opts = v => '<option value="">Tous</option>' + cities().map(c => `<option${c === v ? ' selected' : ''}>${esc(c)}</option>`).join('');
    return `<div class="hero-note"><div><b>Vos colis, <span>sans frontières.</span></b><p>Choisissez un voyageur, puis gérez tout le dossier au même endroit.</p></div><button class="btn" type="button" id="heroPub">Publier un trajet</button></div>
    <div class="searchbar"><span class="si">${ico('search')}</span><input id="q" placeholder="Rechercher un trajet…" value="${esc(q)}" aria-label="Rechercher"><button class="ib" type="button" id="ftog" aria-label="Filtres">${ico('filter')}</button></div>
    <div class="filters" id="filters" hidden><div class="field"><label for="ff">Départ</label><select id="ff">${opts(fl.from)}</select></div><div class="field"><label for="ft">Arrivée</label><select id="ft">${opts(fl.to)}</select></div><div class="field"><label for="fm">Transport</label><select id="fm"><option value="">Tous</option>${['bateau', 'avion', 'voiture'].map(x => `<option${fl.mode === x ? ' selected' : ''}>${x}</option>`).join('')}</select></div></div>
    <div class="seg" role="tablist"><button type="button" data-tab="trips" class="${tab === 'trips' ? 'on' : ''}">Trajets</button><button type="button" data-tab="ads" class="${tab === 'ads' ? 'on' : ''}">Annonces</button></div>` +
      (tab === 'trips' ? (trips.length ? `<div class="list">${trips.map(tripCard).join('')}</div>` : empty('Aucun trajet trouvé.', 'Modifiez la recherche ou les filtres.')) : (ads.length ? `<div class="list">${ads.map(adCard).join('')}</div>` : empty('Aucune annonce.', 'Les demandes d’expéditeurs apparaissent ici.')));
  },

  trip() {
    const t = DB.trips.find(x => x.id === curTrip); if (!t) return empty('Trajet introuvable.', 'Retournez à la liste.');
    const mine = DB.parcels.filter(p => p.tripId === t.id);
    return `<button class="back" type="button" data-back>${ico('back')} Retour</button>
    <div class="card" style="margin-top:6px"><div class="sec">Itinéraire</div>${tlTrip(t)}</div>
    ${contactBtns(t.name) ? `<div style="margin-top:14px">${contactBtns(t.name)}</div>` : ''}${carteCard(t.name)}
    <div class="mapc" style="margin:16px 0">${mapSvg(t)}<div class="ov"><div><small>DATE DE DÉPART</small><b>${new Date(t.date).toLocaleDateString('fr-FR', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}</b></div><span class="tag dark">Validé</span></div></div>
    <div class="card tcol"><div class="sec">Informations du trajet</div><div class="stat2" style="margin:0"><div class="ibox"><i>${ico('cash')}</i><small>Prix au kg</small><b>${pr(t.price)} €/kg</b></div><div class="ibox"><i>${modeIc(t.mode)}</i><small>Moyen de transport</small><b style="text-transform:capitalize">${t.mode}</b></div></div></div>
    <div class="card" style="margin-top:16px"><div class="sec">À propos de ce transporteur</div><div class="stat2" style="margin:0"><div class="ibox"><i>${ico('cal')}</i><small>Trajets effectués</small><b>${t.done || 0}</b></div><div class="ibox"><i>${ico('box')}</i><small>Colis envoyés</small><b>${t.sent || 0}</b></div></div></div>
    ${mine.length ? `<div class="card" style="margin-top:16px"><div class="sec">Vos colis sur ce trajet</div>${mine.map(p => `<button class="pcard" type="button" data-parcel="${p.id}" style="border:0;text-align:left;width:100%;margin-bottom:8px"><span class="pi">${ico('box')}</span><span class="mid">#${p.id} · ${esc(p.from)} → ${esc(p.to)}<small>${STEPS[p.step]}</small></span>${stTag(p)}</button>`).join('')}</div>` : ''}
    <div style="display:grid;gap:12px;margin-top:16px"><button class="btn dark full" type="button" data-similar="${t.id}">${ico('search')} Voir trajets similaires</button><button class="btn ghost full" type="button" data-user="${esc(t.name)}">${ico('user')} Voir le profil de ${esc(t.name)}</button></div><div style="height:84px"></div>${t.mine ? '' : `<div class="cta-bar"><div><small>À partir de</small><b>${pr(t.price)} €/kg</b></div><button class="btn" type="button" data-book="${t.id}">${ico('send')} Réserver</button></div>`}`;
  },

  chats() {
    const L = DB.chats.filter(c => chatFilter === 'all' || c.unread);
    return `<div class="ph"><span class="ic">${ico('chat')}</span><h1>Mes conversations</h1><span class="count">${DB.chats.length}</span></div>
    <div class="chips"><button class="chip${chatFilter === 'all' ? ' on' : ''}" data-cf="all" type="button">Tous les chats</button><button class="chip${chatFilter === 'unread' ? ' on' : ''}" data-cf="unread" type="button">Non lus${unreadN() ? ' (' + unreadN() + ')' : ''}</button></div>` +
      (L.length ? `<div class="list">${L.map(c => { const p = getP(c.parcelId), t = p && tripOf(p), last = c.msgs[c.msgs.length - 1]; if (!p) return ''; return `<div class="item cv"><div class="who"><div class="av">${esc(ini(t ? t.name : '?'))}</div><div style="flex:1;min-width:0"><b>${esc(t ? t.name : 'Transporteur')} ${c.unread ? '<span class="unread" aria-label="non lu"></span>' : ''}</b><small style="color:var(--slate)">Colis #${p.id} · ${esc(p.from)} → ${esc(p.to)}</small></div>${stTag(p)}</div><div class="msg">${esc(last.t)}<br><span class="muted small">${fts(last.d)}</span></div><div class="acts"><button class="btn" type="button" data-open="${p.id}" data-t="msg">Répondre</button><button class="btn ghost" type="button" data-open="${p.id}" data-t="suivi">Suivi</button></div></div>`; }).join('')}</div>` : empty('Aucune conversation.', 'Réservez un trajet pour démarrer un échange.'));
  },

  colis() {
    const L = DB.parcels.slice().sort((a, b) => b.id - a.id);
    return `<div class="ph"><span class="ic">${ico('box')}</span><h1>Mes colis</h1><span class="count">${L.length}</span></div>
    <p class="muted" style="font-weight:500;margin-bottom:14px">Chaque colis a son dossier : trajet, suivi, messages, assurance avec signatures et feuille de route.</p>
    <div class="chips"><button class="btn ghost sm" type="button" data-go="req">Voir les billets (QR)</button><button class="btn sm" type="button" data-go="trips">+ Nouveau colis</button></div>` +
      (L.length ? `<div class="list">${L.map(p => { const t = tripOf(p), c = checks(p); return `<div class="item"><div class="who"><div class="av">${esc(ini(t ? t.name : '?'))}</div><div style="flex:1;min-width:0"><b>${esc(p.from)} → ${esc(p.to)}</b><small style="color:var(--slate)">#${p.id} · ${esc(t ? t.name : '')}</small></div>${stTag(p)}</div>
      <div class="prog">${STEPS.map((s, i) => `<i class="${i < p.step ? 'on' : i === p.step ? 'cur' : ''}"></i>`).join('')}</div><div class="prog-l"><span>${STEPS[p.step]}</span><span>${c.filter(x => x[1]).length}/${c.length} étapes du dossier</span></div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">${p.accepted ? '<span class="tag ok">Assurance ✓</span>' : '<span class="tag warn">Assurance à remplir</span>'}${p.sig.sender ? '<span class="tag ok">Signé expéditeur</span>' : ''}${p.sig.dest ? '<span class="tag ok">Remise signée</span>' : ''}${complete(p) ? '<span class="tag dark">Feuille prête</span>' : ''}</div>
      <div class="foot2 one"><span class="date">${ico('cal')}${new Date(p.created).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short', year: 'numeric'})}</span><button class="btn" type="button" data-parcel="${p.id}">Détail</button></div></div>`; }).join('')}</div>` : empty('Aucun colis.', 'Réservez un trajet pour créer votre premier dossier.'));
  },

  parcel() {
    const p = getP(pid); if (!p) return empty('Colis introuvable.', 'Retournez à la liste.');
    const t = tripOf(p), c = checks(p);
    const tabs = [['trajet', 'Trajet', 'route', !!t], ['suivi', 'Suivi', 'pin', p.step >= 4], ['msg', 'Messages', 'chat', false], ['assur', 'Assurance', 'shield', p.accepted && !!p.sig.sender], ['feuille', 'Feuille de route', 'file', complete(p)]];
    return `<button class="back noprint" type="button" data-back-colis>${ico('back')} Mes colis</button>
    <div class="dh"><div class="top2"><div><div class="eyebrow">Dossier colis</div><h1>#${p.id} · ${esc(p.from)} → ${esc(p.to)}</h1></div>${stTag(p)}</div>
    <div><div class="prog">${STEPS.map((s, i) => `<i class="${i < p.step ? 'on' : i === p.step ? 'cur' : ''}"></i>`).join('')}</div><div class="prog-l"><span>${STEPS[p.step]}</span><span>${c.filter(x => x[1]).length}/${c.length} étapes du dossier</span></div></div></div>
    <div class="ptabs" role="tablist">${tabs.map(x => `<button type="button" role="tab" data-ptab="${x[0]}" class="${ptab === x[0] ? 'on' : ''}">${ico(x[2])}${x[1]}${x[3] ? `<span class="ok">${ico('check')}</span>` : ''}</button>`).join('')}</div>
    <div class="panel2" id="ptab">${PT[ptab](p, t)}</div>`;
  },

  mytrips() {
    const L = DB.trips.filter(t => t.mine).sort((a, b) => sort === 'recent' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
    return `<button class="back" type="button" data-go="profile">${ico('back')} Profil</button><div class="ph"><span class="ic">${ico('route')}</span><h1>Mes trajets</h1><span class="count">${L.length}</span></div>
    <div class="chips"><button class="chip${sort === 'recent' ? ' on' : ''}" data-sort="recent" type="button">Trier : récent</button><button class="chip${sort === 'old' ? ' on' : ''}" data-sort="old" type="button">Trier : ancien</button><button class="chip" data-go="import" type="button">Importer une annonce</button></div>` +
      (L.length ? `<div class="list">${L.map(t => `<div class="item"><div class="who"><div class="av">${esc(ini(t.name))}</div><div style="min-width:0;flex:1"><b>${esc(t.name)}</b>${rating(t)}</div><div class="price"><small>${fd(t.date)}</small><b>${pr(t.price)}€<span>/kg</span></b></div></div>
      <div class="route"><span class="mode">${modeIc(t.mode)}</span><span class="city">${esc(t.from)}</span><span class="line"></span><span class="city">${esc(t.to)}</span></div>
      <div class="foot2"><button class="btn dark" type="button" data-trip="${t.id}">Détail</button><span class="date">${ico('box')} ${t.tickets || 0} billet${(t.tickets || 0) > 1 ? 's' : ''}</span><button class="ib" type="button" data-deltrip="${t.id}" aria-label="Supprimer le trajet">${ico('more')}</button></div></div>`).join('')}</div>` : empty('Aucun trajet publié.', 'Appuyez sur + pour publier votre premier trajet.'));
  },

  req() {
    const L = DB.parcels.slice().sort((a, b) => sort === 'recent' ? b.id - a.id : a.id - b.id);
    return `<button class="back" type="button" data-go="colis">${ico('back')} Mes colis</button><div class="ph"><span class="ic">${ico('box')}</span><h1>Billets</h1><span class="count">${L.length}</span></div>
    <div class="chips"><button class="chip${sort === 'recent' ? ' on' : ''}" data-sort="recent" type="button">Trier : plus récent</button><button class="chip${sort === 'old' ? ' on' : ''}" data-sort="old" type="button">Trier : plus ancien</button></div>` +
      (L.length ? `<div class="list">${L.map(p => { const t = tripOf(p); return `<div class="tk"><div class="tk-top"><div><b>${esc(t ? t.name : 'Transporteur')}</b><span>${esc(p.sender)}</span></div><button class="ib" type="button" data-copyref="CB-${p.id}" aria-label="Copier la référence" style="background:rgba(255,255,255,.15);color:#fff">${ico('copy')}</button></div>
      <div class="tk-mid"><div class="pl"><div><small>Départ</small><b>${esc(p.from)}</b></div><div><small>Arrivée</small><b>${esc(p.to)}</b></div></div><div class="qr" data-qr="CB-${p.id}">CB-${p.id}</div></div>
      <div class="tk-bot"><div><small>ID</small><b>#${p.id}</b></div><div><small>Statut</small><b>${p.step >= 4 ? 'Livré' : 'En cours'}</b></div><div><small>Poids</small><b>${p.size}</b></div><div><small>Date</small><b>${new Date(p.created).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: '2-digit'})}</b></div></div>
      <div style="padding:0 22px 18px;background:var(--canvas)"><button class="btn dark sm full" type="button" data-parcel="${p.id}">Voir le détail</button></div></div>`; }).join('')}</div>` : empty('Aucun billet.', 'Réservez un trajet pour créer votre premier colis.'));
  }
};

function tripCard(t) {
  const st = t.stops || [];
  return `<div class="item"><div class="who" data-trip="${t.id}" style="cursor:pointer"><div class="av" data-user="${esc(t.name)}" title="Voir le profil">${esc(ini(t.name))}</div><div style="min-width:0;flex:1"><b>${esc(t.name)}</b>${rating(t)}</div><div class="price"><small>À partir de</small><b>${pr(t.price)}€<span>/kg</span></b></div></div>
  <div class="route rc"><span class="city">${esc(t.from)}</span><button class="mode" type="button" data-stops="${t.id}" title="Escales" aria-label="Voir les escales">${modeIc(t.mode)}</button><span class="city">${esc(t.to)}</span><button class="ib ring" type="button" data-trip="${t.id}" aria-label="Voir le détail">${ico('chev')}</button></div>
  <div class="stp" id="stp-${t.id}" hidden><b>ESCALES</b>${st.length ? st.map(s => `<span>${esc(s)}</span>`).join('') : '<span>Trajet direct</span>'}</div>
  <div class="foot2 one"><span class="date">${ico('cal')}${new Date(t.date).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short', year: 'numeric'})}</span><button class="btn" type="button" data-book="${t.id}">Réserver</button></div></div>`;
}
function adCard(a) {
  return `<div class="item"><div class="who"><div class="av">${esc(ini(a.name))}</div><div style="min-width:0;flex:1"><b>${esc(a.name)}</b><small>Cherche un voyageur</small></div><div class="price"><small>Budget</small><b>${pr(a.budget)}€</b></div></div>
  <div class="route"><span class="city">${esc(a.from)}</span><span class="mode">${ico('box')}</span><span class="city">${esc(a.to)}</span></div><p class="small" style="font-weight:600;color:var(--charcoal)">${a.kg} kg · ${esc(a.note)}</p>
  <div class="foot2 one"><span class="date">${ico('cal')}${new Date(a.date).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short', year: 'numeric'})}</span><button class="btn" type="button" data-offer="${a.id}">Réserver</button></div></div>`;
}

/* ---------- Onglets du dossier ---------- */
const PT = {
  trajet(p, t) {
    if (!t) return empty('Transporteur introuvable.', 'Ce trajet a été supprimé.');
    return `<div class="card"><div class="who" style="gap:14px"><div class="av">${esc(ini(t.name))}</div><div style="flex:1;min-width:0"><b style="font-size:20px">${esc(t.name)}</b>${rating(t)}</div><button class="btn ghost sm" type="button" data-user="${esc(t.name)}">Profil</button></div>
    <div style="border-top:1px solid var(--ring);margin-top:16px;padding-top:6px">${tlTrip(t)}</div></div>
    <div class="mapc">${mapSvg(t)}<div class="ov"><div><small>DATE DE DÉPART</small><b>${new Date(t.date).toLocaleDateString('fr-FR', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}</b></div><span class="tag dark">Validé</span></div></div>
    <div class="card"><div class="sec">Le colis</div><div class="kv"><div><small>Taille</small><b>${SIZES[p.size][0]} (${esc(SIZES[p.size][1])})</b></div><div><small>Poids</small><b>${pr(p.kg)} kg</b></div><div><small>Contenu</small><b>${esc(p.content || '—')}</b></div><div><small>Valeur déclarée</small><b>${eur(p.value)}</b></div><div><small>Expéditeur</small><b>${esc(p.sender)}</b></div><div><small>Destinataire</small><b>${esc(p.recipient.name || '—')}${p.recipient.phone ? ' · ' + esc(p.recipient.phone) : ''}</b></div></div></div>
    <div class="card"><div class="sec">Prix et paiement</div><div class="sum" style="margin:0"><div><span>Transport (${pr(p.kg)} kg × ${pr(t.price)} €)</span><span>${eur(p.transport)}</span></div><div><span>Assurance</span><span>${p.ins && p.tier >= 0 ? eur(p.insPrice) : p.ins ? 'Sur devis' : 'Non assuré'}</span></div><div><span>Paiement</span><span style="text-transform:capitalize">${p.pay}</span></div><div class="tot"><span>Total</span><span>${eur(p.amount)}</span></div></div></div>${refundBox(p)}`;
  },

  suivi(p) {
    const tl = STEPS.map((l, i) => { const h = p.hist.find(x => x.s === i); return `<div class="tl-i ${i < p.step ? 'done' : i === p.step ? 'now' : ''}"><div class="tl-dot">${i < p.step ? '✓' : i + 1}</div><div><b>${l}</b><span>${h ? ftl(h.t) : 'À venir'}</span></div></div>`; }).join('');
    const mine = DB.incidents.filter(i => i.pid === p.id);
    return `<div class="card"><h2>Suivi du colis</h2><div class="tl">${tl}</div>
    ${p.cancelled ? '<p class="tag warn" style="margin-top:18px">Ce colis est annulé.</p>' : p.step < 3 ? `<button class="btn full noprint" type="button" data-adv="${p.id}" style="margin-top:20px">Étape suivante : ${STEPS[p.step + 1]} (démo)</button>` : p.step === 3 ? `<div class="lock" style="margin-top:18px">${ico('pen')} Le colis est en route. La remise se valide avec la signature du destinataire, dans l’onglet Assurance.</div><button class="btn dark full noprint" type="button" data-ptab="assur" style="margin-top:12px">Aller à la signature</button>` : '<p class="tag ok" style="margin-top:18px">Livraison confirmée par signature</p>'}</div>
    <div class="card noprint"><h3>Signaler un incident</h3><form id="incForm" data-pid="${p.id}" novalidate><div class="field"><label for="itype">Type</label><select id="itype"><option>Dommage</option><option>Perte</option><option>Retard</option><option>Transporteur injoignable</option><option>Autre</option></select></div><div class="field"><label for="idet">Détails</label><textarea id="idet" rows="3" placeholder="Décrivez la situation. Gardez photos et emballage."></textarea></div><div class="form-error" id="ierr" role="alert"></div><button class="btn" type="submit">Créer le ticket</button></form>
    ${mine.length ? mine.map(i => `<div class="tog"><span><b>INC-${String(i.n).padStart(3, '0')}</b> · ${esc(i.type)}<br><span class="muted small" style="font-weight:500">${esc(i.details)}</span></span><button class="tag ${i.open ? 'warn' : 'ok'}" style="border:0" data-toginc="${i.n}" type="button">${i.open ? 'Ouvert' : 'Résolu'}</button></span></div>`).join('') : ''}</div>`;
  },

  msg(p, t) {
    const c = chatOf(p) || (DB.chats.push({id: 'c' + p.id, parcelId: p.id, unread: false, msgs: []}), chatOf(p));
    if (c.unread) { c.unread = false; save(); nav(); }
    const QK = ['Où peut-on se retrouver ?', 'Le colis est prêt.', 'Quelle heure de départ ?', 'Merci beaucoup !'];
    return `<div class="card"><div class="who" style="margin-bottom:14px"><div class="av">${esc(ini(t ? t.name : '?'))}</div><div style="flex:1;min-width:0"><b>${esc(t ? t.name : 'Transporteur')}</b><small style="color:var(--slate)">Colis #${p.id}</small></div>${t ? `<a class="btn ghost sm noprint" target="_blank" rel="noopener" href="${waUrl(t.phone, 'Bonjour ' + t.name.split(' ')[0] + ', concernant le colis CB-' + p.id + ' (' + p.from + ' → ' + p.to + ').')}">${ico('wa')} WhatsApp</a>` : ''}</div>
    <div class="chat2" id="chatBox">${c.msgs.length ? c.msgs.map(m => `<div class="bub${m.me ? ' me' : ''}">${esc(m.t)}</div>`).join('') : '<p class="muted" style="font-weight:500">Aucun message. Écrivez le premier.</p>'}</div>
    <div class="qk noprint">${QK.map(x => `<button type="button" data-qk="${esc(x)}">${esc(x)}</button>`).join('')}</div>
    <form class="sendrow noprint" id="sendForm" data-pid="${p.id}"><input class="inp" id="smsg" placeholder="Votre message" autocomplete="off" aria-label="Message"><button class="btn" type="submit">Envoyer</button></form></div>`;
  },

  assur(p, t) {
    const locked = !!p.sig.sender;
    const arrived = p.step >= 3;
    return `<div class="card linen"><h2>Assurance du colis</h2><p style="font-weight:500;color:var(--charcoal);margin-bottom:12px">Choisissez le niveau selon la valeur déclarée, puis signez. À l’arrivée, le destinataire signe à son tour : la remise est datée et enregistrée.</p>
    <ul class="rules"><li>Emballage solide, contenu protégé, colis bien fermé.</li><li>Le numéro du colis (CB-${p.id}) est écrit lisiblement dessus.</li><li>En cas de dommage : signalez-le tout de suite, photographiez le colis et gardez l’emballage.</li><li>En cas de perte : une recherche est lancée, puis un dossier de sinistre si besoin.</li><li>L’indemnisation éventuelle dépend du contrat de l’assureur partenaire.</li></ul></div>
    <div class="card"><div class="sec">Niveau d’assurance</div>
    <div class="frow"><div class="field"><label for="pv">Valeur déclarée (€)</label><input id="pv" data-pf="value" type="number" min="0" step="1" value="${p.value}" inputmode="decimal"${locked ? ' disabled' : ''}></div><div class="field"><label for="pp2">Paiement</label><select id="pp2" data-pf="pay"${locked ? ' disabled' : ''}><option value="espèces"${p.pay === 'espèces' ? ' selected' : ''}>Espèces au transporteur</option><option value="virement"${p.pay === 'virement' ? ' selected' : ''}>Virement</option></select></div></div>
    <label class="check"><input id="pi" data-pf="ins" type="checkbox"${p.ins ? ' checked' : ''}${locked ? ' disabled' : ''}><span>J’assure ce colis.</span></label><div id="insBox">${insBox(p)}</div></div>
    <div class="sigblk${p.sig.sender ? ' done' : ''}"><h3 style="margin-bottom:6px">1. Signature de l’expéditeur</h3><p class="muted small" style="font-weight:500;margin-bottom:12px">Au dépôt du colis. Elle confirme la valeur déclarée et l’acceptation des règles.</p>${sigPart(p, 'sender', !p.sig.sender ? `<label class="check"><input id="acc" data-pf="accepted" type="checkbox"${p.accepted ? ' checked' : ''}><span>J’accepte les règles de livraison et je reconnais que l’indemnisation éventuelle est soumise aux conditions du contrat d’assurance.</span></label>` : '', p.sender)}</div>
    <div class="sigblk${p.sig.dest ? ' done' : ''}"><h3 style="margin-bottom:6px">2. Signature du destinataire</h3><p class="muted small" style="font-weight:500;margin-bottom:12px">À la remise, sur le téléphone ou l’ordinateur du destinataire. Elle passe le colis en « Livré ».</p>${!arrived && !p.sig.dest ? `<div class="lock">${ico('pen')} Disponible quand le colis est en route (étape « En route »). Étape actuelle : ${STEPS[p.step]}.</div>` : sigPart(p, 'dest', '', p.recipient.name)}</div>`;
  },

  feuille(p, t) {
    const c = checks(p), ok = complete(p), text = roadText(p, t);
    const sg = (r, lab) => p.sig[r] ? `<div class="bx"><small>${lab}</small><img src="${p.sig[r].img}" alt="Signature ${lab}"><b>${esc(p.sig[r].name)}</b><small>${ftl(p.sig[r].date)} · ${esc(p.sig[r].hash)}</small></div>` : `<div class="bx"><small>${lab}</small><p class="muted" style="font-weight:600;margin-top:10px">Non signé</p></div>`;
    return `<div class="card noprint"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px"><h2>Feuille de route</h2><span class="tag ${ok ? 'ok' : 'warn'}">${ok ? 'Prête à envoyer' : 'Incomplète'}</span></div>
    <ul class="cklist">${c.map(x => `<li class="${x[1] ? 'ok' : ''}"><span class="b">${x[1] ? ico('check') : ''}</span>${x[0]}</li>`).join('')}</ul>
    <div class="send" style="margin-top:18px"><a class="btn" target="_blank" rel="noopener" href="${waUrl(t && t.phone, text)}">${ico('wa')} Envoyer au transporteur</a><a class="btn dark" target="_blank" rel="noopener" href="${waUrl(p.recipient.phone, text)}">${ico('wa')} Envoyer au destinataire</a><button class="btn ghost" type="button" data-copyroad="${p.id}">${ico('copy')} Copier le texte</button></div>
    <p class="muted small" style="margin-top:10px;font-weight:500">WhatsApp s’ouvre avec le message prêt à envoyer. ${p.recipient.phone ? '' : 'Ajoutez le numéro du destinataire à la réservation pour l’ouvrir directement.'}</p></div>
    <div class="card" style="text-align:center;display:grid;justify-items:center;gap:8px"><div class="qr" data-qr="CB-${p.id}">CB-${p.id}</div><h3>Colis CB-${p.id}</h3><p class="muted" style="font-weight:600">${esc(p.from)} → ${esc(p.to)} · ${STEPS[p.step]}</p><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center"><span class="tag ${p.sig.sender ? 'ok' : 'warn'}">Expéditeur ${p.sig.sender ? 'signé' : 'à signer'}</span><span class="tag ${p.sig.dest ? 'ok' : 'warn'}">Destinataire ${p.sig.dest ? 'signé' : 'à signer'}</span></div></div>`;
  }
};
function insBox(p) {
  const v = parseFloat(p.value) || 0, i = planFor(v);
  const tiers = TIERS.map((t, k) => `<div class="tier${p.ins && k === i ? ' sel' : ''}"><span>Jusqu’à ${t[0].toLocaleString('fr-FR')} €</span><b>${eur(t[1])}</b></div>`).join('');
  return `<div class="tiers">${tiers}</div><p class="small" style="margin-top:10px;font-weight:700">${!p.ins ? 'Colis non assuré.' : i < 0 ? 'Au-delà de 1 000 € : devis nécessaire.' : 'Niveau retenu : jusqu’à ' + TIERS[i][0].toLocaleString('fr-FR') + ' € pour ' + eur(TIERS[i][1]) + '.'} Total du colis : <b>${eur(p.amount)}</b>.</p><p class="muted small" style="font-weight:500">Tarifs indicatifs, à confirmer avec l’assureur partenaire.</p>`;
}
function sigPart(p, role, extra, defName) {
  const s = p.sig[role];
  if (s) return `<p style="font-weight:800">Signé par ${esc(s.name)}</p><p class="muted small" style="font-weight:600">${ftl(s.date)} · empreinte ${esc(s.hash)}</p><img class="sigimg" src="${s.img}" alt="Signature de ${esc(s.name)}">`;
  return `<div class="field"><label for="sn-${role}">Nom du signataire</label><input id="sn-${role}" value="${esc(defName || '')}" autocomplete="name"></div>${extra}<div class="pad"><canvas data-pad="${role}" aria-label="Zone de signature"></canvas><div class="bar"><span>Signez avec le doigt ou la souris</span><button type="button" class="btn ghost sm" data-padclear="${role}">Effacer</button></div></div><div class="form-error" id="se-${role}" role="alert"></div><button class="btn noprint" type="button" data-sign="${role}" style="margin-top:6px">✓ Valider la signature</button>`;
}
function roadText(p, t) {
  return ['FEUILLE DE ROUTE — Colisbledi', 'Colis : CB-' + p.id, 'Statut : ' + STEPS[p.step],
    'Trajet : ' + p.from + ' → ' + p.to + (t ? ' · départ le ' + fd(t.date) + ' · ' + t.mode : ''), t && t.stops && t.stops.length ? 'Escales : ' + t.stops.join(', ') : 'Escales : direct',
    'Transporteur : ' + (t ? t.name : '—'), 'Expéditeur : ' + p.sender, 'Destinataire : ' + (p.recipient.name || '—') + (p.recipient.phone ? ' (' + p.recipient.phone + ')' : ''),
    'Colis : ' + SIZES[p.size][0] + ', ' + pr(p.kg) + ' kg — ' + (p.content || '—'), 'Valeur déclarée : ' + eur(p.value),
    'Assurance : ' + (p.ins && p.tier >= 0 ? 'jusqu’à ' + TIERS[p.tier][0] + ' € (' + eur(p.insPrice) + ')' : p.ins ? 'sur devis' : 'non assuré'), 'Paiement : ' + p.pay + ' — total ' + eur(p.amount),
    'Signature expéditeur : ' + (p.sig.sender ? p.sig.sender.name + ' le ' + ftl(p.sig.sender.date) + ' [' + p.sig.sender.hash + ']' : 'non signée'),
    'Signature destinataire : ' + (p.sig.dest ? p.sig.dest.name + ' le ' + ftl(p.sig.dest.date) + ' [' + p.sig.dest.hash + ']' : 'non signée')].join('\n');
}

/* ---------- Signature (plusieurs zones) ---------- */
const pads = {};
function initPads() {
  document.querySelectorAll('canvas[data-pad]').forEach(c => {
    const P = {c, x: c.getContext('2d'), strokes: [], cur: null}; pads[c.dataset.pad] = P; sizePad(P);
    const pt = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
    c.addEventListener('pointerdown', e => { e.preventDefault(); c.setPointerCapture(e.pointerId); P.cur = [pt(e)]; P.strokes.push(P.cur); drawPad(P); });
    c.addEventListener('pointermove', e => { if (!P.cur) return; e.preventDefault(); P.cur.push(pt(e)); drawPad(P); });
    const up = () => { P.cur = null; }; c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
  });
}
function sizePad(P) {
  if (!P.c.isConnected) return; const r = P.c.getBoundingClientRect(), d = window.devicePixelRatio || 1;
  P.c.width = Math.max(1, Math.round(r.width * d)); P.c.height = Math.max(1, Math.round(r.height * d)); drawPad(P);
}
function drawPad(P) {
  const c = P.c, x = P.x; x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, c.width, c.height);
  x.lineWidth = 2.6 * (window.devicePixelRatio || 1); x.lineCap = 'round'; x.lineJoin = 'round'; x.strokeStyle = '#054D28';
  P.strokes.forEach(s => { x.beginPath(); s.forEach((p, i) => { const px = p[0] * c.width, py = p[1] * c.height; if (i) x.lineTo(px, py); else x.moveTo(px, py); }); if (s.length === 1) x.lineTo(s[0][0] * c.width + .1, s[0][1] * c.height); x.stroke(); });
}
window.addEventListener('resize', () => Object.values(pads).forEach(sizePad));
async function signSubmit(role) {
  const p = getP(pid), P = pads[role], err = $('se-' + role); if (!p || !P) return;
  if (p.cancelled) { err.textContent = 'Ce colis est annulé.'; return; }
  const name = $('sn-' + role).value.trim();
  if (!name) { err.textContent = 'Indiquez le nom du signataire.'; return; }
  if (role === 'sender' && !p.accepted) { err.textContent = 'Cochez l’acceptation des règles avant de signer.'; return; }
  if (role === 'dest' && p.step < 3) { err.textContent = 'Le colis doit d’abord être en route.'; return; }
  if (!P.strokes.length) { err.textContent = 'Signez dans la zone prévue.'; return; }
  const img = P.c.toDataURL('image/png'), date = nowIso();
  const hash = await sha('CB-' + p.id + '|' + role + '|' + name + '|' + date + '|' + img.length + '|' + img.slice(-200));
  p.sig[role] = {name, date, img, hash};
  if (role === 'dest') { setStep(p, 4); DB.ops.unshift({id: DB.nextOp++, type: 'versement', label: 'Colis ' + p.id + ' livré', amount: p.amount, date, status: 'Effectué', pid: p.id}); notify('Colis ' + p.id + ' : paiement de ' + eur(p.amount) + ' disponible sur votre solde.'); }
  else notify('Colis ' + p.id + ' : signature de l’expéditeur enregistrée.', date);
  save(); render(); toast(role === 'dest' ? 'Remise enregistrée. Colis livré.' : 'Signature enregistrée.');
}

/* ---------- Fenêtres ---------- */
function sheet(h) { $('modal').innerHTML = `<div class="sheet-bg" data-x="1"><div class="sheet" role="dialog" aria-modal="true">${h}</div></div>`; }
const closeSheet = () => { $('modal').innerHTML = ''; };
let bk = null;
function bookSheet(id) {
  bk = {id, step: 1, size: 'S', kg: 1, content: 'Bonjour, je souhaite envoyer un colis (type : vêtements / documents / petit objet). Le colis est bien emballé. Merci !', value: 100, ins: true, pay: 'espèces', recName: '', recPhone: ''};
  bookRender();
}
function stepper(n) {
  const S = [['Trajet', 'route'], ['Demande d’envoi', 'box'], ['Livraison', 'truck']];
  return `<div class="stepper">${S.map((s, i) => (i ? `<div class="ln${n > i ? ' done' : ''}"></div>` : '') + `<div class="sc${n === i + 1 ? ' on' : n > i + 1 ? ' done' : ''}"><i>${ico(s[1])}</i>${s[0]}</div>`).join('')}</div>`;
}
function bookSum() {
  const t = DB.trips.find(x => x.id === bk.id), kg = parseFloat(bk.kg) || 0, v = parseFloat(bk.value) || 0;
  const i = planFor(v), ip = bk.ins && i >= 0 ? TIERS[i][1] : 0, tp = kg * t.price;
  const el = $('bsum'); if (el) el.innerHTML = `<div><span>Transport (${kg} kg × ${pr(t.price)} €)</span><span>${eur(tp)}</span></div><div><span>Assurance${bk.ins && i >= 0 ? ' (jusqu’à ' + TIERS[i][0] + ' €)' : bk.ins ? ' (sur devis > 1 000 €)' : ''}</span><span>${eur(ip)}</span></div><div class="tot"><span>Total</span><span>${eur(tp + ip)}</span></div>`;
}
function bookRender() {
  const t = DB.trips.find(x => x.id === bk.id); if (!t) return;
  const head = `<div style="display:flex;justify-content:space-between;align-items:center"><div><div class="eyebrow">Réservation</div><h2>${esc(t.from)} → ${esc(t.to)}</h2></div><button class="ib" data-x="1" type="button" aria-label="Fermer">✕</button></div>${stepper(bk.step)}`;
  let b = '';
  if (bk.step === 1) b = `<div class="sum"><div><span>Transporteur</span><span>${esc(t.name)}</span></div><div><span>Départ</span><span>${fd(t.date)}</span></div><div><span>Transport</span><span>${t.mode}</span></div><div><span>Escales</span><span>${esc((t.stops || []).join(', ') || 'Direct')}</span></div><div class="tot"><span>Prix</span><span>${pr(t.price)} €/kg</span></div></div><button class="btn full" type="button" data-bks="2">Continuer</button>`;
  else if (bk.step === 2) b = `<h3 style="margin-bottom:10px">Quelle est la taille du colis ? <span style="color:var(--alarm)">*</span></h3><div class="sizes">${Object.entries(SIZES).map(([k, s]) => `<button type="button" class="sz${bk.size === k ? ' on' : ''}" data-size="${k}"><i>${ico(s[3])}</i><b>${s[0]}</b><span>${s[1]}</span></button>`).join('')}</div>
    <div class="field"><label for="bk">Poids estimé (kg)</label><input id="bk" data-bkf="kg" type="number" min="0.5" step="0.5" value="${bk.kg}" inputmode="decimal"></div>
    <div class="field"><label for="bc">Contenu du colis</label><textarea id="bc" data-bkf="content" rows="4">${esc(bk.content)}</textarea><span class="hint">Décrivez brièvement le contenu et l’état de l’emballage.</span></div>
    <div style="display:flex;gap:10px"><button class="btn ghost" type="button" data-bks="1">Retour</button><button class="btn" style="flex:1" type="button" data-bks="3">Continuer</button></div>`;
  else b = `<div class="frow"><div class="field"><label for="br">Destinataire</label><input id="br" data-bkf="recName" value="${esc(bk.recName)}" placeholder="Nom et prénom"></div><div class="field"><label for="brp">WhatsApp du destinataire</label><input id="brp" data-bkf="recPhone" value="${esc(bk.recPhone)}" inputmode="tel" placeholder="21620123456"></div></div>
    <div class="frow"><div class="field"><label for="bv">Valeur déclarée (€)</label><input id="bv" data-bkf="value" type="number" min="0" step="1" value="${bk.value}" inputmode="decimal"></div><div class="field"><label for="bp">Paiement</label><select id="bp" data-bkf="pay"><option value="espèces"${bk.pay === 'espèces' ? ' selected' : ''}>Espèces au transporteur</option><option value="virement"${bk.pay === 'virement' ? ' selected' : ''}>Virement</option></select></div></div>
    <label class="check"><input id="bi" data-bkf="ins" type="checkbox"${bk.ins ? ' checked' : ''}><span>J’assure le colis (tarif selon la valeur déclarée).</span></label><div class="sum" id="bsum"></div><div class="form-error" id="berr" role="alert"></div>
    <div style="display:flex;gap:10px"><button class="btn ghost" type="button" data-bks="2">Retour</button><button class="btn" style="flex:1" type="button" data-bkok="1">Envoyer la demande</button></div>`;
  sheet(head + b); if (bk.step === 3) bookSum();
}
function submitBook() {
  const t = DB.trips.find(x => x.id === bk.id), kg = parseFloat(bk.kg);
  if (!(kg > 0)) return $('berr').textContent = 'Indiquez un poids valide.';
  if (!bk.recName.trim()) return $('berr').textContent = 'Indiquez le nom du destinataire.';
  const id = DB.nextId++;
  const p = mkParcel({id, tripId: t.id, from: t.fromCity || t.from, to: t.toCity || t.to, size: bk.size, kg, content: bk.content, recipient: {name: bk.recName.trim(), phone: bk.recPhone.trim()}, value: parseFloat(bk.value) || 0, ins: bk.ins, pay: bk.pay, step: 0, hist: [{s: 0, t: nowIso()}], created: nowIso()});
  DB.parcels.push(p);
  DB.chats.unshift({id: 'c' + id, parcelId: id, unread: false, msgs: [{me: true, t: bk.content, d: nowIso()}]});
  notify('Votre demande pour le colis ' + id + ' a été envoyée à ' + t.name + '.', nowIso());
  save(); closeSheet(); openParcel(id, 'assur'); toast('Demande envoyée. Complétez maintenant l’assurance.');
}
function pubSheet() {
  const c = ['Paris', 'Lyon', 'Marseille', 'Lille', 'Toulouse', 'Bruxelles', 'Londres', 'Tunis', 'Sfax', 'Sousse', 'Monastir'].map(x => `<option>${x}</option>`).join('');
  sheet(`<div style="display:flex;justify-content:space-between"><div><div class="eyebrow">Nouveau</div><h2>Publier un trajet</h2></div><button class="ib" data-x="1" type="button" aria-label="Fermer">✕</button></div>
  <form id="pubForm" style="margin-top:14px" novalidate><div class="frow"><div class="field"><label for="pf">Départ</label><select id="pf">${c}</select></div><div class="field"><label for="pt">Arrivée</label><select id="pt">${c.replace('<option>Tunis', '<option selected>Tunis')}</select></div></div>
  <div class="frow"><div class="field"><label for="pd">Date de départ</label><input id="pd" type="date" required></div><div class="field"><label for="pm">Transport</label><select id="pm"><option>bateau</option><option>avion</option><option>voiture</option></select></div></div>
  <div class="field"><label for="pp">Prix par kg (€)</label><input id="pp" type="number" min="0.5" step="0.5" value="4" inputmode="decimal"></div><div class="form-error" id="perr" role="alert"></div><button class="btn full" type="submit">Publier</button></form>`);
}

/* ---------- Popovers ---------- */
function closePops() { $('npop').hidden = true; $('gmenu').hidden = true; }
$('bell').addEventListener('click', e => { e.stopPropagation(); const o = $('npop'), was = o.hidden; closePops(); if (was) { o.innerHTML = DB.notifs.slice(0, 5).map(n => `<div class="n"><span class="ni">${ico('box')}</span><div><p>${n.read ? '' : '<span class="unread"></span> '}${esc(n.t)}</p><small>${fts(n.d)}</small></div></div>`).join('') + '<button class="all" type="button" data-notif-all>Toutes mes notifications</button>'; o.hidden = false; } });
$('globe').addEventListener('click', e => { e.stopPropagation(); const o = $('gmenu'), was = o.hidden; closePops(); o.hidden = !was; });
document.addEventListener('click', e => { if (!e.target.closest('.pop-rel')) closePops(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closePops(); closeSheet(); } });

/* ---------- Événements ---------- */
function sendMsg(id, text) {
  const p = getP(id), c = chatOf(p); if (!text.trim()) return;
  c.msgs.push({me: true, t: text.trim(), d: nowIso()}); save(); render(); simReply(p.id);
  const b = $('chatBox'); if (b) b.scrollTop = b.scrollHeight;
}
document.addEventListener('click', e => {
  const c = sel => e.target.closest(sel); let t;
  if (t = c('[data-user]')) { if (page !== 'user') prevPage = page; curUser = t.dataset.user; closeSheet(); closePops(); page = 'user'; render(); window.scrollTo(0, 0); return; }
  if (t = c('[data-go]')) { closeSheet(); return go(t.dataset.go); }
  if (c('button[data-x]') || (e.target.classList && e.target.classList.contains('sheet-bg'))) return closeSheet();
  if (t = c('[data-stops]')) { const s = $('stp-' + t.dataset.stops); s.hidden = !s.hidden; }
  else if (t = c('[data-trip]')) { curTrip = t.dataset.trip; closeSheet(); go('trip'); }
  else if (c('[data-back-colis]')) go(prevPage === 'req' ? 'req' : 'colis');
  else if (c('[data-back]')) { const from = page, to = prevPage || 'trips'; go(to); if (from === 'user' && to === 'trip') prevPage = 'trips'; }
  else if (t = c('[data-similar]')) { const x = DB.trips.find(z => z.id === t.dataset.similar); fl = {from: x.from, to: x.to, mode: ''}; tab = 'trips'; q = ''; go('trips'); }
  else if (t = c('[data-copyref]')) copyTxt(t.dataset.copyref, 'Référence copiée : ' + t.dataset.copyref);
  else if (t = c('[data-copyroad]')) { const p = getP(t.dataset.copyroad); copyTxt(roadText(p, tripOf(p)), 'Feuille de route copiée.'); }
  else if (t = c('[data-bks]')) { bk.step = +t.dataset.bks; bookRender(); }
  else if (t = c('[data-size]')) { bk.size = t.dataset.size; bk.kg = SIZES[bk.size][2]; bookRender(); }
  else if (c('[data-bkok]')) submitBook();
  else if (t = c('[data-tab]')) { tab = t.dataset.tab; render(); }
  else if (t = c('[data-book]')) bookSheet(t.dataset.book);
  else if (c('[data-offer]')) toast('Réservation envoyée à l’expéditeur (démo).');
  else if (t = c('[data-cf]')) { chatFilter = t.dataset.cf; render(); }
  else if (t = c('[data-sort]')) { sort = t.dataset.sort; render(); }
  else if (t = c('[data-open]')) openParcel(t.dataset.open, t.dataset.t);
  else if (t = c('[data-parcel]')) openParcel(t.dataset.parcel, 'trajet');
  else if (t = c('[data-ptab]')) { ptab = t.dataset.ptab; render(); window.scrollTo(0, 0); }
  else if (t = c('[data-deltrip]')) { DB.trips = DB.trips.filter(x => x.id !== t.dataset.deltrip); save(); render(); toast('Trajet supprimé.'); }
  else if (t = c('[data-adv]')) { const p = getP(t.dataset.adv); setStep(p, p.step + 1); save(); render(); toast('Étape mise à jour.'); }
  else if (t = c('[data-toginc]')) { const i = DB.incidents.find(x => x.n === +t.dataset.toginc); i.open = !i.open; save(); render(); }
  else if (t = c('[data-qk]')) sendMsg(pid, t.dataset.qk);
  else if (t = c('[data-padclear]')) { const P = pads[t.dataset.padclear]; if (P) { P.strokes = []; drawPad(P); } }
  else if (t = c('[data-sign]')) signSubmit(t.dataset.sign);
  else if (t = c('[data-msguser]')) { const p = DB.parcels.find(x => { const tt = tripOf(x); return tt && tt.name === t.dataset.msguser && !x.cancelled; }); if (p) openParcel(p.id, 'msg'); else toast('Réservez un trajet avec ce voyageur pour lui écrire.'); }
  else if (t = c('[data-nf]')) { nf = t.dataset.nf; render(); }
  else if (c('[data-markall]')) { DB.notifs.forEach(n => n.read = true); save(); render(); toast('Tout est marqué comme lu.'); }
  else if (t = c('[data-nopen]')) { const n = DB.notifs[+t.dataset.nopen]; n.read = true; save(); if (n.pid && getP(n.pid)) openParcel(n.pid, n.type === 'msg' ? 'msg' : n.type === 'pay' ? 'trajet' : 'suivi'); else if (n.type === 'pay') go('pay'); else render(); }
  else if (t = c('[data-withdraw]')) wdSheet(t.dataset.withdraw);
  else if (c('[data-wdok]')) submitWd();
  else if (c('[data-bank]')) bankSheet();
  else if (c('[data-bankok]')) submitBank();
  else if (c('[data-bankdel]')) { DB.bank = null; save(); render(); toast('Compte supprimé.'); }
  else if (t = c('[data-cancel]')) cancelSheet(t.dataset.cancel);
  else if (t = c('[data-cancelok]')) cancelOk(t.dataset.cancelok);
  else if (t = c('[data-radv]')) { const r = DB.refunds.find(x => x.id === +t.dataset.radv); if (r.status < 2) { r.status++; const o = DB.ops.find(x => x.rid === r.id); if (o) o.status = REF[r.status]; notify('Remboursement de ' + eur(r.amount) + ' (colis ' + r.pid + ') : ' + REF[r.status].toLowerCase() + '.'); save(); render(); } }
  else if (t = c('[data-verif]')) { DB.me.verif[t.dataset.verif] = true; notify('Vérification enregistrée (simulation).'); save(); render(); toast('Vérification simulée.'); }
  else if (t = c('[data-impex]')) { imp.text = EXAMPLES[+t.dataset.impex]; imp.res = null; render(); }
  else if (c('[data-impparse]')) { const tx = ($('imtxt').value || '').trim(); if (tx.length < 8) return toast('Collez d’abord le texte de l’annonce.'); imp.text = tx; imp.res = parseAnnonce(tx); render(); }
  else if (c('[data-impok]')) impOk();
  else if (t = c('[data-cside]')) { cside = t.dataset.cside; render(); }
  else if (c('#ftog')) $('filters').hidden = !$('filters').hidden;
  else if (c('#fab') || c('#heroPub')) pubSheet();
  else if (c('[data-notif-all]')) { closePops(); go('notifs'); }
  else if (c('#resetDb')) { DB = seed(); DB.parcels.forEach(recalc); save(); render(); toast('Démo réinitialisée.'); }
});
document.addEventListener('input', e => {
  const d = e.target.dataset || {};
  if (e.target.id === 'q') { q = e.target.value; const pos = e.target.selectionStart; render(); const n = $('q'); n.focus(); n.setSelectionRange(pos, pos); }
  if (d.bkf && bk && e.target.type !== 'checkbox' && e.target.tagName !== 'SELECT') { bk[d.bkf] = e.target.value; if (bk.step === 3) bookSum(); }
  if (d.impf && imp) { if (d.impf === 'text') imp.text = e.target.value; else if (imp.res && e.target.type !== 'checkbox') imp.res[d.impf] = e.target.value; }
  if (d.wdf && wd && (e.target.type !== 'radio' || e.target.checked)) { wd[d.wdf] = e.target.value; if (e.target.type === 'radio') wdRender(); else wdSum(); }
  if (d.pf === 'value') { const p = getP(pid); p.value = e.target.value; recalc(p); save(); $('insBox').innerHTML = insBox(p); }
});
document.addEventListener('change', e => {
  const t = e.target, d = t.dataset || {};
  if (t.id === 'ff' || t.id === 'ft' || t.id === 'fm') { fl = {from: $('ff').value, to: $('ft').value, mode: $('fm').value}; render(); $('filters').hidden = false; }
  if (d.impf === 'consent' && imp.res) imp.res.consent = t.checked;
  if (d.impf === 'mode' && imp.res) imp.res.mode = t.value;
  if (t.id === 'imimg' && t.files && t.files[0]) { try { imp.img = URL.createObjectURL(t.files[0]); render(); } catch (x) {} }
  if (d.pref) { DB.prefs[d.pref] = t.checked; save(); toast('Préférence enregistrée.'); }
  if (d.bkf && bk && (t.type === 'checkbox' || t.tagName === 'SELECT')) { bk[d.bkf] = t.type === 'checkbox' ? t.checked : t.value; if (bk.step === 3) bookSum(); }
  if (d.pf && d.pf !== 'value') { const p = getP(pid); if (d.pf === 'ins') { p.ins = t.checked; recalc(p); $('insBox').innerHTML = insBox(p); } else if (d.pf === 'pay') p.pay = t.value; else if (d.pf === 'accepted') p.accepted = t.checked; save(); }
});
document.addEventListener('submit', e => {
  e.preventDefault(); const id = e.target.id;
  if (id === 'pubForm') {
    const dt = $('pd').value, pp = parseFloat($('pp').value);
    if (!dt) return $('perr').textContent = 'Choisissez une date de départ.';
    if ($('pf').value === $('pt').value) return $('perr').textContent = 'Le départ et l’arrivée doivent être différents.';
    if (!(pp > 0)) return $('perr').textContent = 'Indiquez un prix par kg.';
    DB.trips.push({id: 'm' + Date.now(), name: ME.carrier, rating: 5, reviews: 2, from: $('pf').value, to: $('pt').value, mode: $('pm').value, price: pp, date: new Date(dt + 'T09:00').toISOString(), fromCity: $('pf').value, toCity: $('pt').value, mine: true, tickets: 0, stops: [], done: 58, sent: 8, phone: ''});
    save(); closeSheet(); go('mytrips'); toast('Trajet publié.');
  }
  if (id === 'profForm') { DB.me.bio = $('pbio').value.trim(); DB.me.langs = $('plg').value.split(',').map(x => x.trim()).filter(Boolean); save(); render(); toast('Profil enregistré.'); }
  if (id === 'sendForm') { sendMsg(+e.target.dataset.pid, $('smsg').value); }
  if (id === 'incForm') {
    const det = $('idet').value.trim(); if (det.length < 5) return $('ierr').textContent = 'Décrivez la situation en quelques mots.';
    DB.incidents.unshift({n: DB.nextInc++, pid: +e.target.dataset.pid, type: $('itype').value, details: det, open: true, date: nowIso()});
    notify('Incident créé pour le colis ' + e.target.dataset.pid + '.', nowIso()); save(); render(); toast('Ticket créé.');
  }
});

/* ---------- v5 : notifications, profils publics, paiements ---------- */
const REF = ['Demande envoyée', 'Acceptée', 'Remboursée'];
let nf = 'all', curUser = '', wd = null;
const balance = () => DB.ops.filter(o => o.type !== 'remboursement').reduce((x, o) => x + o.amount, 0);
const maskIban = s => { s = String(s).replace(/\s/g, ''); return s.slice(0, 4) + ' •••• •••• ' + s.slice(-4); };
function ibanOk(s) {
  s = String(s).replace(/\s/g, '').toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(s)) return false;
  const r = (s.slice(4) + s.slice(0, 4)).replace(/[A-Z]/g, c => c.charCodeAt(0) - 55);
  let m = 0; for (const ch of r) m = (m * 10 + +ch) % 97; return m === 1;
}
const wdFee = (a, mode) => mode === 'instant' ? Math.max(0.5, +(a * 0.01).toFixed(2)) : 0;
const dayLabel = iso => { const a = new Date(); a.setHours(0, 0, 0, 0); const d = Math.round((a - new Date(new Date(iso).setHours(0, 0, 0, 0))) / 864e5); return d <= 0 ? 'Aujourd’hui' : d === 1 ? 'Hier' : 'Plus ancien'; };
const stars = r => '★'.repeat(r) + '☆'.repeat(5 - r);

const PROF = {
  'Nadia M.': {since: 2023, resp: '98 %', delay: 'moins d’1 h', bio: 'Je fais la traversée Tunis–Marseille plusieurs fois par an. Colis emballés avec soin, remise en main propre.', langs: ['Français', 'Arabe'], verif: {id: true, phone: true, email: true}, reviews: [['Sonia L.', 5, 'Très ponctuelle, colis remis en main propre.', -30], ['Karim B.', 5, 'Je recommande, communication parfaite.', -75]]},
  'Yassine K.': {since: 2026, resp: '90 %', delay: 'quelques heures', bio: 'Étudiant, je rentre régulièrement en Tunisie. Je prends des colis légers.', langs: ['Français', 'Arabe'], verif: {id: false, phone: true, email: true}, reviews: []},
  'Imen S.': {since: 2024, resp: '100 %', delay: 'moins d’1 h', bio: 'Vols Lyon–Sfax réguliers. Documents, vêtements, cadeaux : je prends soin de tout.', langs: ['Français', 'Arabe', 'Anglais'], verif: {id: true, phone: true, email: true}, reviews: [['Hatem R.', 5, 'Colis arrivé en 2 jours, très sérieuse.', -20], ['Nour A.', 5, 'Parfait.', -48], ['Mehdi Z.', 4, 'Un peu de retard mais bien prévenu.', -90]]},
  'Walid H.': {since: 2024, resp: '94 %', delay: 'moins de 2 h', bio: 'Je voyage en voiture Marseille–Sousse. Place pour des colis plus volumineux.', langs: ['Français', 'Arabe'], verif: {id: true, phone: true, email: false}, reviews: [['Salma D.', 5, 'Il a pu prendre un grand carton, merci !', -35], ['Ali M.', 4, 'Bon contact.', -80]]},
  'Hela D.': {since: 2026, resp: '88 %', delay: 'quelques heures', bio: '', langs: ['Français', 'Arabe'], verif: {id: false, phone: true, email: true}, reviews: []},
  'Anis G.': {since: 2025, resp: '96 %', delay: 'moins d’1 h', bio: 'Départ de Toulouse avec escales à Narbonne et Marseille, puis bateau pour Tunis.', langs: ['Français', 'Arabe'], verif: {id: true, phone: true, email: true}, reviews: [['Rim T.', 5, 'Très fiable.', -25], ['Yacine H.', 5, 'Tout s’est bien passé.', -60]]},
  'Transporteur Démo': {since: 2025, resp: '100 %', delay: 'moins d’1 h', bio: '', langs: [], verif: {}, reviews: [['Lina O.', 5, 'Voyageur sérieux et réactif.', -15], ['Fares J.', 5, 'Rien à redire.', -40]]}
};
const profOf = nm => nm === ME.carrier ? Object.assign({}, PROF[nm], DB.me) : (PROF[nm] || {since: 2025, resp: '—', delay: '—', bio: '', langs: ['Français'], verif: {phone: true, email: true}, reviews: []});

function notify(t, d) {
  const type = nTypeOf(t); if (DB.prefs[type] === false) return;
  DB.notifs.unshift({t, d: d || nowIso(), read: false, type, pid: +((t.match(/olis (\d+)/) || [])[1] || 0)});
}
const REPL = ['Parfait, merci. Je vous confirme le point de rendez-vous demain.', 'D’accord, pas de souci.', 'Très bien, je note. À bientôt !'];
function simReply(id) {
  setTimeout(() => {
    const p = getP(id); if (!p || p.cancelled) return; const c = chatOf(p), t = tripOf(p); if (!c) return;
    c.msgs.push({me: false, t: REPL[c.msgs.length % 3], d: nowIso()});
    const viewing = page === 'parcel' && pid === id && ptab === 'msg';
    if (!viewing) { c.unread = true; notify((t ? t.name : 'Le transporteur') + ' vous a répondu au sujet du colis ' + id + '.'); }
    save();
    if (viewing && $('smsg') && !$('smsg').value) { render(); const b = $('chatBox'); if (b) b.scrollTop = b.scrollHeight; } else nav();
  }, 2500);
}

V.notifs = function () {
  const un = DB.notifs.filter(n => !n.read).length, NI = {colis: 'box', msg: 'chat', pay: 'wallet'};
  const L = DB.notifs.map((n, i) => ({n, i})).filter(x => nf === 'all' || (nf === 'unread' ? !x.n.read : x.n.type === nf));
  const F = [['all', 'Toutes'], ['unread', 'Non lues' + (un ? ' (' + un + ')' : '')], ['colis', 'Colis'], ['msg', 'Messages'], ['pay', 'Paiements']];
  let last = '', rows = '';
  L.forEach(x => { const lab = dayLabel(x.n.d); if (lab !== last) { rows += `<div class="sec" style="margin:18px 0 8px">${lab}</div>`; last = lab; }
    rows += `<button type="button" class="nit${x.n.read ? '' : ' unr'}" data-nopen="${x.i}"><span class="ni">${ico(NI[x.n.type] || 'box')}</span><span class="nt"><b>${esc(x.n.t)}</b><small>${fts(x.n.d)}</small></span>${x.n.read ? '' : '<span class="unread" aria-label="non lue"></span>'}</button>`; });
  const tg = (k, l) => `<label class="tog">${l}<input type="checkbox" data-pref="${k}"${DB.prefs[k] ? ' checked' : ''}></label>`;
  return `<button class="back" type="button" data-go="profile">${ico('back')} Profil</button>
  <div class="ph"><span class="ic">${ico('bell')}</span><h1>Notifications</h1><span class="count">${DB.notifs.length}</span></div>
  <div class="chips">${F.map(f => `<button class="chip${nf === f[0] ? ' on' : ''}" type="button" data-nf="${f[0]}">${f[1]}</button>`).join('')}</div>
  ${un ? '<button class="btn ghost sm" type="button" data-markall style="margin-bottom:6px">Tout marquer comme lu</button>' : ''}
  ${L.length ? '<div class="list" style="gap:8px">' + rows + '</div>' : empty('Rien à afficher.', 'Vos notifications apparaissent ici.')}
  <div class="card" style="margin-top:22px"><h3>Comment être prévenu</h3>${tg('push', 'Notifications sur mon téléphone')}${tg('email', 'Email')}${tg('wa', 'WhatsApp')}</div>
  <div class="card" style="margin-top:16px"><h3>Quoi recevoir</h3>${tg('colis', 'Suivi des colis')}${tg('msg', 'Messages des voyageurs')}${tg('pay', 'Paiements et remboursements')}${tg('promo', 'Actualités et offres')}<p class="muted small" style="margin-top:10px;font-weight:500">Démo : les préférences restent dans ce navigateur et aucun message réel n’est envoyé.</p></div>`;
};

V.user = function () {
  const nm = curUser, mine = nm === ME.carrier, P = profOf(nm), tr = DB.trips.filter(t => t.name === nm), t0 = tr[0] || {};
  const rv = P.reviews, avg = t0.rating || (rv.length ? rv.reduce((x, r) => x + r[1], 0) / rv.length : 0);
  const vb = (k, l, ic) => `<div class="vb${P.verif[k] ? ' ok' : ''}"><i>${ico(P.verif[k] ? 'check' : ic)}</i><span>${l}</span>${mine && !P.verif[k] ? `<button class="btn ghost sm" type="button" data-verif="${k}">Vérifier</button>` : `<small>${P.verif[k] ? 'Vérifié' : 'Non vérifié'}</small>`}</div>`;
  const pct = mine ? [true, !!P.bio, !!P.verif.id, !!P.verif.phone, !!P.verif.email].filter(Boolean).length * 20 : 0;
  const upcoming = tr.filter(t => !t.mine && new Date(t.date) > new Date(Date.now() - 864e5));
  return `<button class="back" type="button" data-back>${ico('back')} Retour</button>
  <div class="card" style="text-align:center;display:grid;justify-items:center;gap:10px;margin-top:6px"><div class="av lg">${esc(ini(nm))}</div><h1 style="font-size:28px">${esc(nm)}</h1>
  <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center">${avg ? `<b>${avg.toFixed(1)} ★</b><span class="muted" style="font-weight:600">${rv.length || t0.reviews || 0} avis</span>` : '<span class="tag">Nouveau membre</span>'}${P.verif.id ? `<span class="tag ok">${ico('shield')} Identité vérifiée</span>` : ''}</div>
  <p class="muted" style="font-weight:600">Membre depuis ${P.since}</p>${contactBtns(nm)}${mine ? '' : `<button class="btn ghost" type="button" data-msguser="${esc(nm)}">${ico('chat')} Message dans l’application</button>`}</div>
  ${carteCard(nm)}
  ${mine ? `<div class="card" style="margin-top:16px"><div class="sec">Profil complété à ${pct} %</div><div class="prog"><i class="${pct >= 20 ? 'on' : ''}"></i><i class="${pct >= 40 ? 'on' : ''}"></i><i class="${pct >= 60 ? 'on' : ''}"></i><i class="${pct >= 80 ? 'on' : ''}"></i><i class="${pct >= 100 ? 'on' : ''}"></i></div><p class="muted small" style="font-weight:500">Un profil complet et vérifié inspire confiance aux expéditeurs.</p></div>` : ''}
  <div class="card" style="margin-top:16px"><div class="sec">Confiance</div><div class="vbs">${vb('id', 'Pièce d’identité', 'shield')}${vb('phone', 'Téléphone', 'phone')}${vb('email', 'Adresse email', 'mail')}</div></div>
  <div class="card" style="margin-top:16px"><div class="sec">Activité</div><div class="stat2" style="margin:0"><div class="ibox"><i>${ico('cal')}</i><small>Trajets effectués</small><b>${t0.done || 0}</b></div><div class="ibox"><i>${ico('box')}</i><small>Colis envoyés</small><b>${t0.sent || 0}</b></div><div class="ibox"><i>${ico('chat')}</i><small>Taux de réponse</small><b>${esc(P.resp)}</b></div><div class="ibox"><i>${ico('send')}</i><small>Répond en</small><b>${esc(P.delay)}</b></div></div></div>
  ${mine ? `<form class="card" id="profForm" style="margin-top:16px" novalidate><div class="sec">À propos de moi</div><div class="field"><label for="pbio">Présentation</label><textarea id="pbio" rows="4" maxlength="400" placeholder="Parlez de vos trajets, de votre façon de voyager…">${esc(P.bio || '')}</textarea></div><div class="field"><label for="plg">Langues parlées</label><input id="plg" value="${esc((P.langs || []).join(', '))}" placeholder="Français, Arabe"></div><button class="btn" type="submit">Enregistrer</button></form>`
    : `<div class="card" style="margin-top:16px"><div class="sec">À propos</div><p style="font-weight:500">${esc(P.bio || 'Ce membre n’a pas encore rédigé de présentation.')}</p>${P.langs && P.langs.length ? `<p class="muted small" style="margin-top:8px;font-weight:600">Langues : ${esc(P.langs.join(', '))}</p>` : ''}</div>`}
  <div class="card" style="margin-top:16px"><div class="sec">Avis (${rv.length})</div>${rv.length ? rv.map(r => `<div class="rev"><div class="who"><div class="av">${esc(ini(r[0]))}</div><div><b>${esc(r[0])}</b><small style="color:var(--slate)">${fd(dAdd(r[3]))}</small></div><span class="stars" aria-label="${r[1]} sur 5">${stars(r[1])}</span></div><p>${esc(r[2])}</p></div>`).join('') : '<p class="muted" style="font-weight:500">Pas encore d’avis.</p>'}</div>
  ${upcoming.length ? `<div class="sec" style="margin:22px 0 10px">Prochains trajets</div><div class="list">${upcoming.map(tripCard).join('')}</div>` : ''}`;
};

V.pay = function () {
  const bal = balance(), run = DB.parcels.filter(p => p.step >= 2 && p.step < 4 && !p.cancelled), pend = run.reduce((x, p) => x + p.amount, 0);
  const out = -DB.ops.filter(o => o.type === 'retrait').reduce((x, o) => x + o.amount, 0), rf = DB.refunds.reduce((x, r) => x + r.amount, 0);
  const OI = {versement: 'wallet', retrait: 'bank', remboursement: 'refund'};
  const ops = DB.ops.slice().sort((a, b) => b.date.localeCompare(a.date));
  const b = DB.bank;
  return `<div class="money"><small>Disponible</small><b>${eur(bal)}</b><small>${run.length ? run.length + ' colis en cours, ' + eur(pend) + ' à recevoir après la remise' : 'Aucun versement en attente'}</small>
  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px"><button class="btn" type="button" data-withdraw="instant">${ico('bolt')} Virement instantané</button><button class="btn ghost" type="button" data-withdraw="std" style="background:rgba(255,255,255,.12);color:#fff;border-color:rgba(255,255,255,.3)">Virement standard</button></div></div>
  <div class="stat2"><div class="card"><div class="l">${ico('bank')}Total retiré</div><div class="v">${eur(out)}</div></div><div class="card"><div class="l">${ico('refund')}Remboursements</div><div class="v">${eur(rf)}</div></div></div>
  <div class="card"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px"><h3>Compte bancaire</h3>${b ? `<button class="btn ghost sm" type="button" data-bank="1">Modifier</button>` : ''}</div>
  ${b ? `<div class="bankc"><i>${ico('bank')}</i><div><b>${esc(b.holder)}</b><span>${esc(b.bankName || 'Banque')} · ${maskIban(b.iban)}</span>${b.bic ? `<small>BIC ${esc(b.bic)}</small>` : ''}</div></div><button class="btn danger sm" type="button" data-bankdel="1" style="margin-top:12px">Supprimer ce compte</button>`
    : `<p class="muted" style="font-weight:500;margin-bottom:12px">Ajoutez un compte pour recevoir vos virements, instantanés ou standard.</p><button class="btn" type="button" data-bank="1">Ajouter un compte bancaire</button>`}
  <p class="muted small" style="margin-top:12px;font-weight:500">Démo : les données restent dans ce navigateur. N’entrez pas de vrais identifiants bancaires dans cet aperçu.</p></div>
  <div class="card linen" style="margin-top:16px;padding:18px"><p style="font-weight:600;color:var(--spruce)">Virement standard : gratuit, reçu en 1 à 2 jours ouvrés. Virement instantané : reçu en quelques secondes, 1 % de frais (minimum 0,50 €). Tarifs et délais indicatifs.</p></div>
  <h2 style="font-size:24px;margin:26px 0 12px">Historique</h2>
  ${ops.length ? `<div class="list" style="gap:8px">${ops.map(o => `<div class="opr"><span class="ni">${ico(o.type === 'retrait' && /instantané/.test(o.label) ? 'bolt' : OI[o.type])}</span><span class="nt"><b>${esc(o.label)}</b><small>${fts(o.date)} · ${esc(o.status)}${o.fee ? ' · frais ' + eur(o.fee) : ''}</small></span><span class="am ${o.amount < 0 ? 'neg' : 'pos'}">${o.amount < 0 ? '−' : '+'}${eur(Math.abs(o.amount))}</span></div>`).join('')}</div>` : empty('Aucune opération.', 'Vos versements, retraits et remboursements apparaissent ici.')}
  ${DB.refunds.length ? `<h2 style="font-size:24px;margin:26px 0 12px">Remboursements</h2><div class="list">${DB.refunds.map(r => `<div class="item"><div class="who"><span class="pi" style="width:44px;height:44px;border-radius:50%;background:var(--linen);display:grid;place-items:center">${ico('refund')}</span><div style="flex:1;min-width:0"><b>Colis #${r.pid}</b><small style="color:var(--slate)">${esc(r.reason)} · ${fd(r.date)}</small></div><b>${eur(r.amount)}</b></div><div class="rf">${REF.map((s, i) => `<div class="${i <= r.status ? 'on' : ''}"><i>${i <= r.status ? '✓' : i + 1}</i><span>${s}</span></div>`).join('')}</div><div class="foot2">${r.status < 2 ? `<button class="btn ghost sm" type="button" data-radv="${r.id}">Étape suivante (démo)</button>` : '<span class="tag ok">Remboursé</span>'}${getP(r.pid) ? `<button class="btn dark sm" type="button" data-parcel="${r.pid}">Voir le dossier</button>` : ''}</div></div>`).join('')}</div>` : ''}
  <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin:26px 0 12px"><h2 style="font-size:24px">Mes colis</h2><button class="btn ghost sm" type="button" data-go="colis">Voir les dossiers</button></div>
  ${DB.parcels.length ? `<div class="list">${DB.parcels.slice().sort((a, b) => b.id - a.id).map(p => `<button class="pcard${p.step >= 4 ? ' done' : ''}" type="button" data-parcel="${p.id}" style="border:0;text-align:left;width:100%"><span class="pi">${ico(p.step >= 4 ? 'truck' : 'box')}</span><span class="mid">${esc(p.from)} → ${esc(p.to)}<small>#${p.id} · ${p.pay}</small></span><span class="am">${eur(p.amount)}<br>${stTag(p)}</span></button>`).join('')}</div>` : empty('Aucun colis.', 'Vos colis réservés apparaissent ici.')}`;
};

V.profile = function () {
  const T = DB.trips.filter(t => t.mine).length, rec = DB.ops.filter(o => o.type === 'versement').reduce((x, o) => x + o.amount, 0), inc = DB.incidents, un = DB.notifs.filter(n => !n.read).length;
  return `<div class="card" style="text-align:center;display:grid;justify-items:center;gap:10px"><div class="av lg">DT</div><h1 style="font-size:28px">${ME.carrier}</h1><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center"><b>${ME.rating.toFixed(1)} ★</b><span class="muted" style="font-weight:600">${ME.reviews} avis</span><span class="tag ok" style="padding:6px 14px;font-size:13px">${ico('medal')} Super voyageur</span></div>
  <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn dark sm" type="button" data-user="${ME.carrier}">Mon profil public</button><button class="btn ghost sm" type="button" data-go="notifs">${ico('bell')} Notifications${un ? ' (' + un + ')' : ''}</button></div></div>
  <div class="money" style="margin:14px 0"><small>Solde disponible</small><b>${eur(balance())}</b><small>Montant total reçu : ${eur(rec)}</small></div>
  <div class="stat2"><button class="card" type="button" data-go="mytrips" style="text-align:left;border:0"><div class="l">${ico('cal')}Mes trajets</div><div class="v">${T}</div></button><button class="card" type="button" data-go="colis" style="text-align:left;border:0"><div class="l">${ico('box')}Mes colis</div><div class="v">${DB.parcels.length}</div></button></div>
  <div class="card"><h3>Incidents signalés</h3>${inc.length ? inc.map(i => `<div class="tog"><span><b>INC-${String(i.n).padStart(3, '0')}</b> · colis #${i.pid} · ${esc(i.type)}<br><span class="muted small" style="font-weight:500">${esc(i.details)}</span></span><button class="tag ${i.open ? 'warn' : 'ok'}" style="border:0" data-toginc="${i.n}" type="button">${i.open ? 'Ouvert' : 'Résolu'}</button></div>`).join('') : '<p class="muted" style="font-weight:500">Aucun incident. Signalez un problème depuis l’onglet Suivi d’un colis.</p>'}</div>
  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px"><button class="btn" type="button" data-go="pay">${ico('wallet')} Paiements</button><button class="btn ghost" type="button" data-go="import">${ico('file')} Importer une annonce</button><a class="btn dark" href="assurance.html">Assurance & garanties</a><button class="btn danger" type="button" id="resetDb">Réinitialiser la démo</button></div>`;
};

function refundBox(p) {
  const r = DB.refunds.find(x => x.pid === p.id); let h;
  if (r) h = `<div class="sec">Remboursement</div><div class="rf">${REF.map((s, i) => `<div class="${i <= r.status ? 'on' : ''}"><i>${i <= r.status ? '✓' : i + 1}</i><span>${s}</span></div>`).join('')}</div><p style="font-weight:800;margin-top:10px">${eur(r.amount)} · ${esc(r.reason)}</p><p class="muted small" style="font-weight:500">Remboursé sur le moyen de paiement d’origine (délai indicatif : 3 à 5 jours ouvrés).</p>`;
  else if (p.cancelled) h = '<div class="sec">Annulation</div><p class="muted" style="font-weight:500">Demande annulée avant paiement : rien à rembourser.</p>';
  else if (p.step <= 2) h = `<div class="sec">Annulation et remboursement</div><p class="muted small" style="font-weight:500;margin-bottom:10px">${p.step >= 2 ? 'Avant le départ, l’annulation donne droit à un remboursement intégral de ' + eur(p.amount) + '.' : 'Vous pouvez annuler cette demande tant que le paiement n’est pas confirmé.'}</p><button class="btn danger sm" type="button" data-cancel="${p.id}">Annuler le colis</button>`;
  else if (p.step === 3) h = '<div class="sec">Remboursement</div><p class="muted small" style="font-weight:500">Le colis est en route. En cas de problème, signalez un incident dans l’onglet Suivi : un remboursement peut être étudié.</p>';
  else return '';
  return `<div class="card noprint" style="margin-top:16px">${h}</div>`;
}
function bankSheet() {
  const b = DB.bank || {};
  sheet(`<div style="display:flex;justify-content:space-between;align-items:center"><div><div class="eyebrow">Paiements</div><h2>Compte bancaire</h2></div><button class="ib" data-x="1" type="button" aria-label="Fermer">✕</button></div>
  <div style="margin-top:14px"><div class="field"><label for="bh">Titulaire du compte</label><input id="bh" value="${esc(b.holder || '')}" autocomplete="name"></div><div class="field"><label for="bi">IBAN</label><input id="bi" value="${esc(b.iban || '')}" placeholder="FR76 3000 6000 0112 3456 7890 189" autocomplete="off"></div>
  <div class="frow"><div class="field"><label for="bb">BIC (facultatif)</label><input id="bb" value="${esc(b.bic || '')}"></div><div class="field"><label for="bn">Banque</label><input id="bn" value="${esc(b.bankName || '')}"></div></div>
  <div class="form-error" id="bkerr" role="alert"></div><p class="muted small" style="font-weight:500;margin-bottom:12px">Démo : n’entrez pas de vrais identifiants bancaires.</p><button class="btn full" type="button" data-bankok="1">Enregistrer le compte</button></div>`);
}
function wdSheet(mode) {
  if (!DB.bank) { bankSheet(); $('bkerr').textContent = 'Ajoutez d’abord un compte bancaire pour retirer votre solde.'; return; }
  wd = {mode, amount: balance().toFixed(2)}; wdRender();
}
function wdRender() {
  const opt = (m, t, d) => `<label class="opt${wd.mode === m ? ' on' : ''}"><input type="radio" name="wm" data-wdf="mode" value="${m}"${wd.mode === m ? ' checked' : ''}><span><b>${t}</b><small>${d}</small></span></label>`;
  sheet(`<div style="display:flex;justify-content:space-between;align-items:center"><div><div class="eyebrow">Retrait</div><h2>Virement vers mon compte</h2></div><button class="ib" data-x="1" type="button" aria-label="Fermer">✕</button></div>
  <p class="muted" style="font-weight:600;margin:10px 0">Disponible : ${eur(balance())} · vers ${maskIban(DB.bank.iban)}</p>
  <div class="field"><label for="wa">Montant (€)</label><input id="wa" data-wdf="amount" type="number" min="1" step="0.01" value="${wd.amount}" inputmode="decimal"></div>
  <div class="opts">${opt('instant', 'Instantané', 'En quelques secondes · 1 % de frais (min. 0,50 €)')}${opt('std', 'Standard', '1 à 2 jours ouvrés · gratuit')}</div>
  <div class="sum" id="wsum"></div><div class="form-error" id="werr" role="alert"></div><button class="btn full" type="button" data-wdok="1">Confirmer le virement</button>`);
  wdSum();
}
function wdSum() {
  const a = parseFloat(wd.amount) || 0, f = wdFee(a, wd.mode), el = $('wsum');
  if (el) el.innerHTML = `<div><span>Montant retiré</span><span>${eur(a)}</span></div><div><span>Frais</span><span>${eur(f)}</span></div><div class="tot"><span>Vous recevez</span><span>${eur(Math.max(0, a - f))}</span></div>`;
}
function submitWd() {
  const a = parseFloat(wd.amount), err = $('werr');
  if (!(a >= 1)) return err.textContent = 'Montant minimum : 1 €.';
  if (a > balance() + 1e-9) return err.textContent = 'Le montant dépasse votre solde disponible.';
  const f = wdFee(a, wd.mode), inst = wd.mode === 'instant';
  DB.ops.unshift({id: DB.nextOp++, type: 'retrait', label: (inst ? 'Virement instantané' : 'Virement standard') + ' vers ' + maskIban(DB.bank.iban), amount: -a, fee: f, date: nowIso(), status: inst ? 'Effectué' : 'En cours (1 à 2 jours ouvrés)'});
  notify('Retrait de ' + eur(a) + (inst ? ' effectué par virement instantané.' : ' en cours par virement standard.'));
  save(); closeSheet(); render(); toast(inst ? 'Virement instantané effectué.' : 'Virement standard programmé.');
}
function submitBank() {
  const h = $('bh').value.trim(), i = $('bi').value.replace(/\s/g, '').toUpperCase(), err = $('bkerr');
  if (h.length < 3) return err.textContent = 'Indiquez le nom du titulaire.';
  if (!ibanOk(i)) return err.textContent = 'IBAN invalide. Vérifiez les chiffres et les lettres.';
  DB.bank = {holder: h, iban: i, bic: $('bb').value.trim().toUpperCase(), bankName: $('bn').value.trim()};
  notify('Compte bancaire enregistré : ' + maskIban(i) + '.'); save(); closeSheet(); render(); toast('Compte bancaire enregistré.');
}
function cancelSheet(id) {
  const p = getP(id), paid = p.step >= 2;
  sheet(`<div style="display:flex;justify-content:space-between;align-items:center"><div><div class="eyebrow">Colis #${p.id}</div><h2>Annuler ce colis ?</h2></div><button class="ib" data-x="1" type="button" aria-label="Fermer">✕</button></div>
  <p style="font-weight:500;margin:12px 0">${paid ? 'Le colis n’est pas encore parti : vous serez remboursé de <b>' + eur(p.amount) + '</b> sur votre moyen de paiement d’origine.' : 'Le paiement n’est pas encore confirmé : rien à rembourser.'}</p>
  <div style="display:flex;gap:10px"><button class="btn ghost" type="button" data-x="1">Garder le colis</button><button class="btn danger" style="flex:1" type="button" data-cancelok="${p.id}">Confirmer l’annulation</button></div>`);
}
function cancelOk(id) {
  const p = getP(id); p.cancelled = true;
  if (p.step >= 2) {
    const r = {id: DB.nextRef++, pid: p.id, amount: p.amount, status: 0, date: nowIso(), reason: 'Annulation avant le départ'};
    DB.refunds.unshift(r); DB.ops.unshift({id: DB.nextOp++, type: 'remboursement', label: 'Colis ' + p.id + ' annulé', amount: p.amount, date: r.date, status: REF[0], pid: p.id, rid: r.id});
    notify('Remboursement de ' + eur(p.amount) + ' demandé pour le colis ' + p.id + '.');
  } else notify('Colis ' + p.id + ' annulé.');
  save(); closeSheet(); render(); toast('Colis annulé.');
}

/* ---------- Import d'annonces (extraction assistée) ---------- */
let imp = {text: '', res: null, name: '', img: ''};
const MONTHS = {janvier: 1, février: 2, fevrier: 2, mars: 3, avril: 4, mai: 5, juin: 6, juillet: 7, août: 8, aout: 8, septembre: 9, octobre: 10, novembre: 11, décembre: 12, decembre: 12};
const COUNTRY = {Tunis: 'Tunisie', Sfax: 'Tunisie', Sousse: 'Tunisie', Monastir: 'Tunisie', Nabeul: 'Tunisie', Bizerte: 'Tunisie', Gabès: 'Tunisie', Bruxelles: 'Belgique', Londres: 'Royaume-Uni'};
const EXAMPLES = [
  'Voyage Paris ➡ Tunis le 12/11 par bateau, escale Lyon et Marseille. 4€ le kg. Contact 06 12 34 56 78',
  'Départ Lyon vers Sfax le 5 décembre en avion, 6 euros/kg, colis légers acceptés.',
  'Marseille – Sousse en voiture, départ 20 novembre 2026. Prix 3,5 €/kg'
];
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
function parseAnnonce(txt) {
  const n = norm(txt), found = [];
  Object.keys(CITY).forEach(c => { const i = n.indexOf(norm(c)); if (i >= 0) found.push([i, c]); });
  found.sort((a, b) => a[0] - b[0]);
  const names = found.map(x => x[1]);
  const from = names[0] || '';
  let to = '';
  if (found.length > 1) {
    const endA = found[0][0] + norm(found[0][1]).length;
    const nx = found.slice(1).find(f => /^\s*(?:➡️?|→|->|=>|vers|a|-|–|—|pour|direction)\s*$/.test(n.slice(endA, f[0])));
    to = nx ? nx[1] : names[1];
  }
  const stops = names.slice(1).filter(c => c !== to);
  let date = '';
  let m = n.match(/(\d{1,2})[\/.\-](\d{1,2})(?:[\/.\-](\d{2,4}))?/);
  const y0 = new Date().getFullYear();
  if (m && +m[1] <= 31 && +m[2] <= 12) { let y = m[3] ? +m[3] : y0; if (y < 100) y += 2000; date = y + '-' + String(m[2]).padStart(2, '0') + '-' + String(m[1]).padStart(2, '0'); }
  else { m = n.match(/(\d{1,2})\s*(?:er)?\s*(janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)(?:\s*(\d{4}))?/); if (m) { date = (m[3] || y0) + '-' + String(MONTHS[m[2]]).padStart(2, '0') + '-' + String(m[1]).padStart(2, '0'); } }
  if (date && !txt.match(/\d{4}/) && new Date(date) < new Date(Date.now() - 864e5)) date = (y0 + 1) + date.slice(4);
  const pm = n.match(/(\d+(?:[.,]\d+)?)\s*(?:€|euros?|eur)\s*(?:\/|le|par|du)?\s*kg/) || n.match(/kg[^\d]{0,12}(\d+(?:[.,]\d+)?)\s*(?:€|euros?|eur)/) || n.match(/prix[^\d]{0,12}(\d+(?:[.,]\d+)?)/);
  const price = pm ? pm[1].replace(',', '.') : '';
  const mode = /avion|vol\b|aerien/.test(n) ? 'avion' : /voiture|van\b|camion|route/.test(n) ? 'voiture' : 'bateau';
  const ph = txt.match(/(?:\+|00)?\d[\d .]{8,16}\d/); const phone = ph ? ph[0].replace(/\D/g, '') : '';
  const filled = [from, to, date, price].filter(Boolean).length;
  return {from, to, stops: stops.join(', '), date, price, mode, phone, name: imp.name || '', consent: false, conf: filled};
}
V.import = function () {
  const r = imp.res, cl = cities().concat(Object.keys(CITY)).filter((v, i, a) => a.indexOf(v) === i);
  const f = (id, lab, k, type, ph) => `<div class="field"><label for="${id}">${lab}</label><input id="${id}" data-impf="${k}" type="${type || 'text'}" value="${esc(r ? r[k] : '')}" list="${type ? '' : 'clist'}" placeholder="${ph || ''}"></div>`;
  return `<button class="back" type="button" data-go="mytrips">${ico('back')} Mes trajets</button>
  <div class="ph"><span class="ic">${ico('file')}</span><h1>Importer une annonce</h1></div>
  <p class="muted" style="font-weight:500;margin-bottom:14px">Collez le texte d’une annonce de transporteur. La plateforme repère le trajet, vous vérifiez, puis vous publiez.</p>
  <div class="card"><div class="sec">1. L’annonce</div>
  <div class="field"><label for="imtxt">Texte de l’annonce</label><textarea id="imtxt" data-impf="text" rows="5" placeholder="Ex. : Voyage Paris ➡ Tunis le 12/11 par bateau, 4 € le kg…">${esc(imp.text)}</textarea></div>
  <div class="qk">${EXAMPLES.map((x, i) => `<button type="button" data-impex="${i}">Exemple ${i + 1}</button>`).join('')}</div>
  <div class="field" style="margin-top:12px"><label for="imimg">Ou une capture d’écran (aperçu)</label><input id="imimg" type="file" accept="image/*"></div>
  ${imp.img ? `<img src="${imp.img}" alt="Capture de l’annonce" style="max-width:100%;max-height:260px;border-radius:18px;border:1px solid var(--ring)"><p class="muted small" style="font-weight:500;margin-top:8px">Aperçu seulement : recopiez le texte de la capture dans la zone ci-dessus.</p>` : ''}
  <button class="btn full" type="button" data-impparse="1" style="margin-top:14px">Analyser l’annonce</button></div>
  <datalist id="clist">${cl.map(c => `<option value="${esc(c)}">`).join('')}</datalist>
  ${r ? `<div class="card" style="margin-top:16px"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px"><div class="sec" style="margin:0">2. Vérifier et compléter</div><span class="tag ${r.conf >= 4 ? 'ok' : 'warn'}">${r.conf}/4 champs repérés</span></div>
  <div class="frow">${f('ifrom', 'Départ', 'from')}${f('ito', 'Arrivée', 'to')}</div><div class="frow">${f('idate', 'Date de départ', 'date', 'date')}${f('iprice', 'Prix par kg (€)', 'price', 'number')}</div>
  <div class="frow"><div class="field"><label for="imode">Transport</label><select id="imode" data-impf="mode">${['bateau', 'avion', 'voiture'].map(x => `<option${r.mode === x ? ' selected' : ''}>${x}</option>`).join('')}</select></div>${f('istops', 'Escales (séparées par une virgule)', 'stops')}</div>
  <div class="frow">${f('iname', 'Nom du transporteur', 'name', '', 'Prénom et initiale')}${f('iphone', 'WhatsApp (chiffres)', 'phone', '', '21620123456')}</div>
  <label class="check"><input type="checkbox" data-impf="consent"${r.consent ? ' checked' : ''}><span>Le transporteur m’a donné son accord pour publier cette annonce et son numéro.</span></label>
  <div class="form-error" id="imerr" role="alert"></div><button class="btn full" type="button" data-impok="1">Publier le trajet</button></div>` : ''}`;
};
function impOk() {
  const r = imp.res, err = $('imerr'); if (!r) return;
  if (!CITY[r.from] && !r.from) return err.textContent = 'Indiquez la ville de départ.';
  if (!r.to || r.to === r.from) return err.textContent = 'Indiquez une arrivée différente du départ.';
  if (!r.date) return err.textContent = 'Indiquez la date de départ.';
  const pr2 = parseFloat(r.price); if (!(pr2 > 0)) return err.textContent = 'Indiquez un prix par kg.';
  if (!r.name.trim()) return err.textContent = 'Indiquez le nom du transporteur.';
  if (!r.consent) return err.textContent = 'Confirmez l’accord du transporteur avant de publier.';
  const ph = String(r.phone || '').replace(/\D/g, '');
  const t = {id: 'i' + Date.now(), name: r.name.trim(), rating: null, reviews: 0, from: COUNTRY[r.from] || 'France', to: COUNTRY[r.to] || 'France', mode: r.mode, price: pr2, date: new Date(r.date + 'T09:00').toISOString(), fromCity: r.from, toCity: r.to, stops: r.stops.split(',').map(x => x.trim()).filter(Boolean), done: 0, sent: 0, phone: /^\d{8,15}$/.test(ph) ? ph : '', imported: true};
  DB.trips.push(t); notify('Trajet de ' + t.name + ' publié : ' + r.from + ' → ' + r.to + '.'); save();
  imp = {text: '', res: null, name: '', img: ''}; curTrip = t.id; go('trip'); toast('Trajet publié.');
}


let cside = 'recto';
const CARRIER_ORDER = ['Transporteur Démo', 'Nadia M.', 'Yassine K.', 'Imen S.', 'Walid H.', 'Hela D.', 'Anis G.'];
function carrierInfo(nm) {
  const tr = DB.trips.filter(t => t.name === nm), t0 = tr[0] || {}, P = profOf(nm);
  const idx = CARRIER_ORDER.indexOf(nm), badge = 'TRP-' + (1000 + (idx >= 0 ? idx : (nm.length * 7) % 90 + 10));
  const route = tr.find(t => !t.mine) || t0;
  const cityList = []; tr.forEach(t => [t.fromCity || t.from].concat(t.stops || [], [t.toCity || t.to]).forEach(c => { if (c && cityList.indexOf(c) < 0) cityList.push(c); }));
  const phone = (tr.find(t => t.phone) || {}).phone || '';
  const pro = nm === ME.carrier || (t0.rating >= 4.8 && t0.reviews >= 3);
  return {tr, t0, P, badge, route, cityList, phone, pro, avg: t0.rating, nrev: t0.reviews || 0};
}
function carteCard(nm) {
  const I = carrierInfo(nm), r = I.route || {}, back = cside === 'verso';
  const line = nm.toUpperCase() + ' • ' + String(r.from || 'France').toUpperCase() + ' ⇄ ' + String(r.to || 'Tunisie').toUpperCase();
  const pick = I.tr.filter(t => !t.mine || true).map(t => t.fromCity || t.from).filter((c, i, a) => c && a.indexOf(c) === i);
  const stops = []; I.tr.forEach(t => (t.stops || []).forEach(c => { if (stops.indexOf(c) < 0) stops.push(c); }));
  const dest = []; I.tr.forEach(t => { const c = t.toCity || t.to; if (c && dest.indexOf(c) < 0) dest.push(c); });
  const face = !back ? `<div class="cc-top"><div><b>ColisBledi</b><small>TRANSPORTEUR OFFICIEL</small></div>${I.pro ? `<span class="cc-pro">${ico('shield')}<span>SUPER VOYAGEUR</span></span>` : ''}</div>
    <div class="cc-l"><small>LIGNE & TRANSPORTEUR</small><h3>${esc(line)}</h3></div><div class="cc-chip" aria-hidden="true"></div>
    <div class="cc-f"><div><small>BADGE</small><b>${I.badge}</b></div><div><small>VILLES</small><b>${esc(I.cityList.join(', ') || '—')}</b></div></div>`
  : `<div class="cc-top"><div><b>Points de passage</b><small>${I.badge} · ${esc(nm)}</small></div></div>
    <div class="cc-v"><div><small>POINT DE RAMASSAGE</small><b>${esc(pick.join(', ') || '—')}</b><span>Lieu précis convenu par message, de préférence un lieu public.</span></div>
    <div><small>POINTS DE ROUTE</small><b>${esc(stops.join(' → ') || 'Trajet direct')}</b></div>
    <div><small>POINT DE REMISE</small><b>${esc(dest.join(', ') || '—')}</b></div></div>`;
  return `<div class="card" style="margin-top:16px"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px"><div style="display:flex;gap:10px;align-items:center"><span class="ic" style="width:38px;height:38px;border-radius:12px;background:var(--linen);display:grid;place-items:center;color:var(--spruce)">${ico('user')}</span><h3>Carte Transporteur</h3></div>
  <div class="segm" role="tablist"><button type="button" data-cside="recto" class="${!back ? 'on' : ''}">Recto</button><button type="button" data-cside="verso" class="${back ? 'on' : ''}">Verso</button></div></div>
  <div class="ccard${back ? ' back' : ''}"><img class="cc-wm" src="assets/logo.png" alt="">${face}</div></div>`;
}
function contactBtns(nm) {
  const I = carrierInfo(nm); if (nm === ME.carrier) return '';
  const ph = String(I.phone).replace(/\D/g, '');
  return `<div class="send" style="width:100%"><a class="btn dark" href="${ph ? 'tel:+' + ph : '#'}" ${ph ? '' : 'aria-disabled="true"'}>${ico('phone')} Appeler</a><a class="btn" target="_blank" rel="noopener" href="${waUrl(ph, 'Bonjour, je vous contacte depuis Colisbledi au sujet de votre trajet.')}">${ico('wa')} WhatsApp</a></div>`;
}

/* ---------- Démarrage (liens profonds : #colis, #trajets, #messages…) ---------- */
const HASH = {trajets: 'trips', messages: 'chats', colis: 'colis', paiements: 'pay', profil: 'profile', envoyer: 'trips', assurance: 'colis'};
const h0 = (location.hash || '').slice(1);
if (HASH[h0]) page = HASH[h0];
render();
