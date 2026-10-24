/* ==========================================================================
   11. MINI-SPELE (Fase 7)
   'n Volskerm-paneel bo-oor die toestel waarin jy self iets speel. Elke
   mini-spel is 'n object met begin(opts), en roep opts.klaar(uitslag)
   wanneer jy klaar is; die raamwerk maak die paneel toe en gee die
   uitslag terug aan wie die spel oopgemaak het (hier: die casino).

   Elke ingang bied twee knoppies: "Speel self" en "Doen dit vinnig". Die
   vinnige een simuleer 'n hele sessie in een slag, by 'n effens swakker
   tafel — self speel betaal dus effens beter, maar die huis wen steeds.

   Die spelreëls (die "enjins") is los van die skerm, sodat die vinnige
   sessie en 'n Monte Carlo-toets presies dieselfde kode gebruik as wat
   jy op die skerm speel.
   ========================================================================== */

/* ---------- Die raamwerk ---------- */
var msHuidig = null;   /* die spel wat nou oop is, vir die "Stap weg"-knoppie */

function msPaneel(){
  var p = el('minispel');
  if(!p){ p = document.createElement('div'); p.id = 'minispel'; el('toestel').appendChild(p); }
  return p;
}
function msMaakToe(){
  var p = msPaneel(); p.classList.remove('wys'); p.innerHTML = ''; msHuidig = null;
}
/* Die ingang: wat die spel is, en die twee maniere om dit te speel.
   opts: {chips, teks, voor(), klaar(uitslag), los()} — voor() loop net
   voordat albei maniere begin (die casino koop dan die chips). */
function minispelIngang(spel, opts){
  wysModaal(spel.e + ' ' + spel.n, opts.teks || spel.uitleg, [
    {t:'Speel self', klas:'groen', sub:spel.selfSub, doen:function(){
      sluitModaal(); if(opts.voor) opts.voor(); minispelSelf(spel, opts); }},
    {t:'Doen dit vinnig', sub:spel.vinnigSub, doen:function(){
      sluitModaal(); if(opts.voor) opts.voor();
      var u = spel.vinnig(opts.chips); u.self = false; opts.klaar(u); }},
    {t:'Los dit', klas:'grys', doen:function(){ sluitModaal(); if(opts.los) opts.los(); }}
  ]);
}
function minispelSelf(spel, opts){
  var p = msPaneel(); p.innerHTML = ''; p.classList.add('wys');
  msHuidig = spel;
  spel.begin({paneel:p, chips:opts.chips, klaar:function(u){
    msMaakToe(); u.self = true; opts.klaar(u); }});
}
function msStapWeg(){ if(msHuidig) msHuidig.stapWeg(); }

/* Die raam wat elke spel deel: kop met chips en "Stap weg", die tafel,
   'n boodskapreël en die knoppies onderaan. */
function msRaam(spel, tafel){
  return '<div class="ms-kop"><div class="ms-naam">' + spel.e + ' ' + spel.n + '</div>'+
    '<div class="ms-chips"><small>Chips</small><span id="ms-chips"></span></div>'+
    '<button class="ms-weg" onclick="msStapWeg()">Stap weg</button></div>'+
    '<div class="ms-tafel">' + tafel + '<div class="ms-boods" id="ms-boods"></div></div>'+
    '<div class="ms-beheer" id="ms-beheer"></div>';
}
function msChips(n){ el('ms-chips').textContent = geld(n); }
function msBoods(t, soort){
  var b = el('ms-boods'); b.textContent = t||''; b.className = 'ms-boods ' + (soort||''); }

/* 'n Mooi inset naby x: 10, 20, 50, 100, 200, 500 ... */
function mooiGetal(x){
  if(x <= 10) return 10;
  var p = Math.pow(10, Math.floor(Math.log(x)/Math.LN10)), m = x/p;
  return (m>=5 ? 5 : m>=2 ? 2 : 1) * p;
}
/* Een "eenheid" is sowat 'n twintigste van wat jy ingekoop het. */
function msEenheid(chips){ return mooiGetal(chips/20); }
function msInsetKnoppe(gekies, eenheid, chips, funk){
  return '<div class="ms-insette">' + [1,2,5].map(function(x){
    var b = eenheid*x;
    return '<button class="ms-inset' + (b===gekies?' aan':'') + (b>chips?' af':'') +
      '" onclick="' + funk + '(' + b + ')">' + kortGeld(b) + '</button>';
  }).join('') + '</div>';
}
function skommel(a){
  for(var i=a.length-1;i>0;i--){ var j = R(i+1), t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}
/* 'n Vinnige sessie: tot VINNIG_RONDTES rondtes teen 'n tiende van jou
   chips elk, of tot jy nie meer kan nie. rondte(chips, inset) gee jou
   nuwe chips terug. */
var VINNIG_RONDTES = 25;
function msVinnigSessie(chips, rondte){
  var inset = mooiGetal(chips/10), n = 0;
  while(n < VINNIG_RONDTES && chips >= inset){ chips = rondte(chips, inset); n++; }
  return {chips:chips, rondtes:n, teks:'Jy het sonder veel aandag teen ' + geld(inset) +
    ' per rondte gespeel, by die tafel naaste aan die deur.'};
}

/* ---------- Speelkaarte ---------- */
var KAART_KLEURE = ['♠','♥','♦','♣'];   /* skoppens, hartens, ruitens, klawers */
function kaartNaam(c){
  return c.r===1||c.r===14 ? 'A' : c.r===11 ? 'J' : c.r===12 ? 'Q' : c.r===13 ? 'K' : String(c.r);
}
/* Net 'n kaart wat pas op die tafel geland het, gly in; die res staan
   stil as die tafel oorgeteken word. */
var msGesien = {};
function msNuut(sleutel){
  if(msGesien[sleutel]) return '';
  msGesien[sleutel] = 1; return ' nuut';
}
function kaartHtml(c, toe, ekstra){
  if(toe) return '<div class="ms-kaart toe' + (ekstra||'') + '"></div>';
  return '<div class="ms-kaart' + (c.k===1||c.k===2 ? ' rooi' : '') + (ekstra||'') + '">' +
    kaartNaam(c) + '<span>' + KAART_KLEURE[c.k] + '</span></div>';
}

/* ==========================================================================
   BLACKJACK — 6 pakke, die dealer staan op (sagte) 17, blackjack betaal
   3:2, trek/staan/verdubbel/verdeel (een keer). Die dealer loer vir
   blackjack. Met basiese strategie is die huisvoordeel ± 0,5%. Die
   vinnige tafel betaal blackjack net 6:5.
   ========================================================================== */
var BJ_PAKKE = 6;
var BJ_BETAAL_SELF = 1.5, BJ_BETAAL_VINNIG = 1.2;

function bjNuweSkoen(){
  var k = [];
  for(var p=0;p<BJ_PAKKE;p++) for(var r=1;r<=13;r++) for(var su=0;su<4;su++) k.push({r:r, k:su});
  return {k:skommel(k), i:0};
}
function bjTrek(sk){ return sk.k[sk.i++]; }
/* Driekwart deur die skoen word daar weer geskommel. */
function bjKykSkoen(sk){ return sk.i > sk.k.length*0.75 ? bjNuweSkoen() : sk; }
function bjTien(c){ return Math.min(10, c.r); }
function bjWaarde(kaarte){
  var t = 0, aas = false;
  kaarte.forEach(function(c){ t += bjTien(c); if(c.r===1) aas = true; });
  var sag = aas && t+10 <= 21;
  return {t: sag ? t+10 : t, sag:sag};
}
function bjIsBJ(kaarte){ return kaarte.length===2 && bjWaarde(kaarte).t===21; }

/* 'n Nuwe rondte: speler, dealer, speler, dealer. Het iemand blackjack,
   is die rondte dadelik verby. */
function bjBegin(sk, inset){
  var r = {hande:[{k:[], inset:inset, klaar:false}], dealer:[], aktief:0, klaar:false, gesplit:false};
  r.hande[0].k.push(bjTrek(sk)); r.dealer.push(bjTrek(sk));
  r.hande[0].k.push(bjTrek(sk)); r.dealer.push(bjTrek(sk));
  if(bjIsBJ(r.hande[0].k) || bjIsBJ(r.dealer)){ r.hande[0].klaar = true; r.klaar = true; }
  return r;
}
/* Wat mag jy nou doen? (Of jy genoeg chips het, kyk die roeper.) */
function bjMag(r){
  var h = r.hande[r.aktief];
  if(r.klaar || !h) return {};
  var twee = h.k.length===2;
  return {h:true, s:true, d:twee, p: twee && !r.gesplit && bjTien(h.k[0])===bjTien(h.k[1])};
}
function bjDoen(r, a, sk){
  var h = r.hande[r.aktief];
  if(a==='h'){ h.k.push(bjTrek(sk)); if(bjWaarde(h.k).t >= 21) h.klaar = true; }
  else if(a==='s'){ h.klaar = true; }
  else if(a==='d'){ h.inset *= 2; h.k.push(bjTrek(sk)); h.klaar = true; }
  else if(a==='p'){
    var tweede = {k:[h.k.pop()], inset:h.inset, klaar:false};
    r.gesplit = true;
    h.k.push(bjTrek(sk)); tweede.k.push(bjTrek(sk));
    r.hande.push(tweede);
    /* Verdeelde ase kry net een kaart elk. */
    if(h.k[0].r===1){ h.klaar = true; tweede.klaar = true; }
    if(bjWaarde(h.k).t===21) h.klaar = true;
    if(bjWaarde(tweede.k).t===21) tweede.klaar = true;
  }
  while(r.aktief < r.hande.length && r.hande[r.aktief].klaar) r.aktief++;
  if(r.aktief >= r.hande.length) bjDealer(r, sk);
}
function bjDealer(r, sk){
  r.klaar = true;
  if(r.hande.every(function(h){ return bjWaarde(h.k).t > 21; })) return;
  while(bjWaarde(r.dealer).t < 17) r.dealer.push(bjTrek(sk));   /* staan op sagte 17 */
}
/* Hoeveel chips kom terug (inset plus wins), en wat het elke hand gedoen. */
function bjAfreken(r, bjBetaal){
  var d = bjWaarde(r.dealer).t, dBJ = bjIsBJ(r.dealer), terug = 0, uit = [];
  r.hande.forEach(function(h){
    var p = bjWaarde(h.k).t, pBJ = !r.gesplit && bjIsBJ(h.k), w, u;
    if(pBJ && !dBJ){ w = h.inset*(1+bjBetaal); u = 'Blackjack!'; }
    else if(dBJ){ w = pBJ ? h.inset : 0; u = pBJ ? 'Gelykop' : 'Dealer het blackjack'; }
    else if(p > 21){ w = 0; u = 'Bust'; }
    else if(d > 21 || p > d){ w = h.inset*2; u = 'Gewen'; }
    else if(p === d){ w = h.inset; u = 'Gelykop'; }
    else { w = 0; u = 'Verloor'; }
    terug += w; uit.push(u);
  });
  return {terug:Math.round(terug), uitslae:uit};
}
/* Basiese strategie vir 6 pakke, staan op sagte 17, verdubbel ná
   verdeel. mag sê wat jy kan bekostig. */
function bjStrategie(r, mag){
  var h = r.hande[r.aktief], w = bjWaarde(h.k), o = r.dealer[0].r===1 ? 11 : bjTien(r.dealer[0]);
  if(mag.p){
    var pr = h.k[0].r===1 ? 11 : bjTien(h.k[0]);
    if(pr===11 || pr===8) return 'p';
    if(pr===9 && o!==7 && o<10) return 'p';
    if((pr===7 || pr===3 || pr===2) && o<=7) return 'p';
    if(pr===6 && o<=6) return 'p';
    if(pr===4 && (o===5 || o===6)) return 'p';
  }
  var t = w.t;
  if(w.sag){
    if(t>=19) return 's';
    if(t===18){ if(o>=3 && o<=6) return mag.d ? 'd' : 's'; return o<=8 ? 's' : 'h'; }
    if(t===17) return o>=3 && o<=6 && mag.d ? 'd' : 'h';
    if(t>=15) return o>=4 && o<=6 && mag.d ? 'd' : 'h';
    return o>=5 && o<=6 && mag.d ? 'd' : 'h';
  }
  if(t>=17) return 's';
  if(t>=13) return o<=6 ? 's' : 'h';
  if(t===12) return o>=4 && o<=6 ? 's' : 'h';
  if(t===11) return o<=10 && mag.d ? 'd' : 'h';
  if(t===10) return o<=9 && mag.d ? 'd' : 'h';
  if(t===9) return o>=3 && o<=6 && mag.d ? 'd' : 'h';
  return 'h';
}
var BJ_AKSIES = {h:'Trek', s:'Staan', d:'Verdubbel', p:'Verdeel'};
/* Een volle rondte met basiese strategie. Gee terug wat ingesit en wat
   teruggekom het, sodat die vinnige sessie en die toets dit kan gebruik. */
function bjSpeelRondte(sk, inset, bjBetaal, beskikbaar){
  var r = bjBegin(sk, inset);
  beskikbaar = beskikbaar===undefined ? Infinity : beskikbaar - inset;
  while(!r.klaar){
    var mag = bjMag(r), h = r.hande[r.aktief];
    if(beskikbaar < h.inset){ mag.d = false; mag.p = false; }
    var a = bjStrategie(r, mag);
    if(a==='d' || a==='p') beskikbaar -= h.inset;
    bjDoen(r, a, sk);
  }
  var ingesit = 0; r.hande.forEach(function(h){ ingesit += h.inset; });
  return {ingesit:ingesit, terug:bjAfreken(r, bjBetaal).terug};
}

var bj = null;
var BLACKJACK = {
  id:'blackjack', n:'Blackjack', e:'\u{1F0CF}',
  uitleg:'Kom so na aan 21 as wat jy kan sonder om oor te gaan. Die dealer staan op 17, ' +
    'en blackjack betaal 3:2.',
  selfSub:'Jy besluit elke hand self · huisvoordeel ± 0,5% met basiese strategie',
  vinnigSub:'Jy speel 25 hande op outomaat by die tafel waar blackjack net 6:5 betaal',
  begin:function(o){
    bj = {klaar:o.klaar, chips:o.chips, begin:o.chips, eenheid:msEenheid(o.chips),
      sk:bjNuweSkoen(), r:null, rondtes:0, wenk:false};
    bj.inset = bj.eenheid;
    o.paneel.innerHTML = msRaam(BLACKJACK,
      '<div class="ms-etiket">Dealer <b id="bj-dt"></b></div><div class="ms-hand" id="bj-dealer"></div>'+
      '<div class="ms-etiket">Jy</div><div id="bj-speler"></div>');
    msBoods('Kies jou inset en deel.');
    bjTeken();
  },
  stapWeg:function(){
    if(bj.r && !bj.r.klaar){ msBoods('Speel eers die hand klaar.','sleg'); return; }
    bj.klaar({chips:bj.chips, rondtes:bj.rondtes});
  },
  vinnig:function(chips){
    var sk = bjNuweSkoen();
    return msVinnigSessie(chips, function(c, inset){
      sk = bjKykSkoen(sk);
      var u = bjSpeelRondte(sk, inset, BJ_BETAAL_VINNIG, c);
      return c - u.ingesit + u.terug;
    });
  }
};
function bjTeken(){
  var r = bj.r, b = '';
  msChips(bj.chips);
  el('bj-dealer').innerHTML = r ? r.dealer.map(function(c, i){
    var toe = i===1 && !r.klaar;
    return kaartHtml(c, toe, msNuut('d' + i + toe)); }).join('') : '';
  el('bj-dt').textContent = !r ? '' : r.klaar ? bjWaarde(r.dealer).t :
    r.dealer[0].r===1 ? 'A' : bjTien(r.dealer[0]);
  el('bj-speler').innerHTML = r ? r.hande.map(function(h, i){
    var w = bjWaarde(h.k);
    return '<div class="ms-hand' + (r.hande.length>1 && i===r.aktief && !r.klaar ? ' aktief' : '') + '">' +
      h.k.map(function(c, j){ return kaartHtml(c, false, msNuut('h' + i + '-' + j + kaartNaam(c) + c.k)); }).join('') +
      '<div class="ms-tot">' + (w.sag && w.t<21 ? (w.t-10) + '/' : '') + w.t +
      '<small>' + geld(h.inset) + '</small></div></div>';
  }).join('') : '';
  if(!r || r.klaar){
    b = msInsetKnoppe(bj.inset, bj.eenheid, bj.chips, 'bjInset') +
      '<button class="knop groen" onclick="bjDeel()">Deel</button>';
  } else {
    var mag = bjMag(r), h = r.hande[r.aktief], ryk = bj.chips >= h.inset;
    b = '<div class="ms-ry">' + ['h','s','d','p'].map(function(a){
      var mog = mag[a] && (a==='h' || a==='s' || ryk);
      return '<button class="knop' + (a==='s' ? ' rooi' : '') + (mog ? '' : ' af') +
        '" onclick="bjAksie(\'' + a + '\')">' + BJ_AKSIES[a] + '</button>';
    }).join('') + '</div>';
    b += '<button class="ms-wenk" onclick="bjWenk()">' + (bj.wenk ? 'Basiese strategie sê: ' +
      BJ_AKSIES[bjStrategie(r, {h:1, s:1, d:mag.d && ryk, p:mag.p && ryk})] : 'Wat sê basiese strategie?') +
      '</button>';
  }
  el('ms-beheer').innerHTML = b;
}
function bjInset(b){ if(b <= bj.chips){ bj.inset = b; bjTeken(); } }
function bjDeel(){
  if(bj.chips < bj.inset){
    if(bj.chips < bj.eenheid){ msBoods('Jy het nie meer genoeg chips nie.','sleg'); return; }
    bj.inset = bj.eenheid;
  }
  bj.sk = bjKykSkoen(bj.sk);
  bj.chips -= bj.inset; bj.rondtes++; bj.wenk = false;
  bj.r = bjBegin(bj.sk, bj.inset); msGesien = {};
  msBoods('');
  if(bj.r.klaar) bjKlaar(); else bjTeken();
}
function bjAksie(a){
  var r = bj.r; if(!r || r.klaar) return;
  var mag = bjMag(r), h = r.hande[r.aktief];
  if(!mag[a]) return;
  if(a==='d' || a==='p'){
    if(bj.chips < h.inset){ msBoods('Jy het nie genoeg chips daarvoor nie.','sleg'); return; }
    bj.chips -= h.inset;
  }
  bj.wenk = false;
  bjDoen(r, a, bj.sk);
  if(r.klaar) bjKlaar(); else bjTeken();
}
function bjWenk(){ bj.wenk = true; bjTeken(); }
function bjKlaar(){
  var a = bjAfreken(bj.r, BJ_BETAAL_SELF), ingesit = 0;
  bj.r.hande.forEach(function(h){ ingesit += h.inset; });
  bj.chips += a.terug;
  var netto = a.terug - ingesit;
  msBoods(a.uitslae.join(' · ') + (netto ? ' (' + (netto>0?'+':'') + geld(netto) + ')' : ''),
    netto>0 ? 'goed' : netto<0 ? 'sleg' : '');
  bjTeken();
}

/* ==========================================================================
   ROULETTE — die Europese wiel met een nul (huisvoordeel 2,7%). Rooi of
   swart, ewe of onewe en die dosyne betaal 1:1 en 2:1; 'n enkelgetal
   betaal 35:1. Die vinnige tafel is die Amerikaanse wiel met 'n dubbelnul
   (5,3%).
   ========================================================================== */
var RL_WIEL = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
var RL_ROOI = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
var RL_BUITE = [{id:'rooi', n:'Rooi'}, {id:'swart', n:'Swart'}, {id:'ewe', n:'Ewe'}, {id:'onewe', n:'Onewe'},
  {id:'d1', n:'1–12'}, {id:'d2', n:'13–24'}, {id:'d3', n:'25–36'}];

function rlKleur(n){ return n===0 || n===37 ? 'groen' : RL_ROOI.indexOf(n)>=0 ? 'rooi' : 'swart'; }
/* 37 is die dubbelnul (00) van die Amerikaanse wiel. */
function rlDraai(dubbelNul){ return R(dubbelNul ? 38 : 37); }
/* Hoeveel keer die inset terugkom (insluitend die inset self). */
function rlBetaal(soort, n){
  if(soort.charAt(0)==='n') return +soort.slice(1)===n ? 36 : 0;
  if(n===0 || n===37) return 0;
  if(soort==='rooi') return rlKleur(n)==='rooi' ? 2 : 0;
  if(soort==='swart') return rlKleur(n)==='swart' ? 2 : 0;
  if(soort==='ewe') return n%2===0 ? 2 : 0;
  if(soort==='onewe') return n%2===1 ? 2 : 0;
  var d = +soort.charAt(1);
  return n > (d-1)*12 && n <= d*12 ? 3 : 0;
}

var rl = null;
var ROULETTE = {
  id:'roulette', n:'Roulette', e:'\u{1F3A1}',
  uitleg:'Sit jou chips op rooi of swart, ewe of onewe, ’n dosyn of ’n enkelgetal, en draai die wiel.',
  selfSub:'Die Europese wiel met een nul · die huis vat 2,7%',
  vinnigSub:'Jy sit 25 keer op rooi of swart by die tafel met ’n dubbelnul (5,3%)',
  begin:function(o){
    rl = {klaar:o.klaar, chips:o.chips, eenheid:msEenheid(o.chips), insette:{}, draai:false,
      rot:0, laaste:[], rondtes:0};
    rl.fiche = rl.eenheid;
    var a = 360/RL_WIEL.length, gr = [];
    RL_WIEL.forEach(function(n, i){
      var k = {groen:'#1f8a46', rooi:'#c0392b', swart:'#161b22'}[rlKleur(n)];
      gr.push(k + ' ' + (i*a).toFixed(3) + 'deg ' + ((i+1)*a).toFixed(3) + 'deg');
    });
    o.paneel.innerHTML = msRaam(ROULETTE,
      '<div class="rl-bo"><div class="rl-wys"></div><div class="rl-wiel" id="rl-wiel" style="background:conic-gradient(' +
        gr.join(',') + ')">' + RL_WIEL.map(function(n, i){
          return '<span style="transform:rotate(' + ((i+0.5)*a).toFixed(2) + 'deg) translateY(-78px)">' + n + '</span>';
        }).join('') + '<div class="rl-naaf" id="rl-naaf"></div></div></div>'+
      '<div class="rl-laaste" id="rl-laaste"></div>');
    msBoods('Tik op die bord om chips neer te sit.');
    rlTeken();
  },
  stapWeg:function(){
    if(rl.draai) return;
    rlVeeUit();
    rl.klaar({chips:rl.chips, rondtes:rl.rondtes});
  },
  vinnig:function(chips){
    return msVinnigSessie(chips, function(c, inset){
      return c - inset + inset*rlBetaal(kies(['rooi','swart']), rlDraai(true));
    });
  }
};
function rlTotaal(){ var t = 0; for(var k in rl.insette) t += rl.insette[k]; return t; }
function rlTeken(){
  msChips(rl.chips);
  el('rl-laaste').innerHTML = rl.laaste.map(function(n){
    return '<span class="' + rlKleur(n) + '">' + (n===37?'00':n) + '</span>'; }).join('');
  function vak(id, teks, klas){
    var b = rl.insette[id];
    return '<button class="rl-vak ' + (klas||'') + '" onclick="rlSit(\'' + id + '\')">' + teks +
      (b ? '<i>' + kortGeld(b) + '</i>' : '') + '</button>';
  }
  var h = '<div class="rl-bord">' + vak('n0','0','groen nul');
  for(var n=1;n<=36;n++) h += vak('n'+n, n, rlKleur(n));
  h += '</div><div class="rl-buite">' + RL_BUITE.map(function(x){
    return vak(x.id, x.n, x.id==='rooi'||x.id==='swart' ? x.id : ''); }).join('') + '</div>';
  h += msInsetKnoppe(rl.fiche, rl.eenheid, Infinity, 'rlFiche') +
    '<div class="ms-ry"><button class="knop grys klein2" onclick="rlVeeUit()">Vee uit</button>' +
    '<button class="knop groen klein2" onclick="rlSpin()">Draai' +
      (rlTotaal() ? ' (' + kortGeld(rlTotaal()) + ')' : '') + '</button></div>';
  el('ms-beheer').innerHTML = h;
}
function rlFiche(b){ rl.fiche = b; rlTeken(); }
function rlSit(id){
  if(rl.draai) return;
  if(rl.chips < rl.fiche){ msBoods('Jy het nie genoeg chips vir nog een nie.','sleg'); return; }
  rl.chips -= rl.fiche; rl.insette[id] = (rl.insette[id]||0) + rl.fiche;
  rlTeken();
}
function rlVeeUit(){
  if(rl.draai) return;
  rl.chips += rlTotaal(); rl.insette = {}; rlTeken();
}
function rlSpin(){
  if(rl.draai) return;
  if(!rlTotaal()){ msBoods('Sit eers chips op die bord.','sleg'); return; }
  rl.draai = true; rl.rondtes++;
  var n = rlDraai(false), i = RL_WIEL.indexOf(n), a = 360/RL_WIEL.length;
  /* Draai vorentoe tot die regte vak bo onder die wyser is. */
  var nou = ((rl.rot % 360) + 360) % 360, doel = ((-(i+0.5)*a % 360) + 360) % 360;
  rl.rot += 360*5 + ((doel - nou + 360) % 360);
  el('rl-wiel').style.transform = 'rotate(' + rl.rot + 'deg)';
  el('rl-naaf').textContent = '';
  msBoods('Die bal rol ...');
  setTimeout(function(){
    var terug = 0, ingesit = rlTotaal();
    for(var k in rl.insette) terug += rl.insette[k] * rlBetaal(k, n);
    rl.chips += terug; rl.insette = {}; rl.draai = false;
    rl.laaste.unshift(n); rl.laaste = rl.laaste.slice(0,10);
    var naaf = el('rl-naaf'); naaf.textContent = n; naaf.className = 'rl-naaf ' + rlKleur(n);
    var netto = terug - ingesit;
    msBoods(n + ' ' + {groen:'groen', rooi:'rooi', swart:'swart'}[rlKleur(n)] + ' — ' +
      (netto>0 ? 'jy wen ' + geld(netto) + '!' : terug ? 'jy kry ' + geld(terug) + ' terug.' :
        'die huis vat alles.'), netto>0 ? 'goed' : netto<0 ? 'sleg' : '');
    rlTeken();
  }, 3300);
}

/* ==========================================================================
   SLOTS — drie rolle en een betaallyn. Die rolle van die masjien waarby
   jy self speel, betaal ± 92,7% terug; die vinnige masjien het 'n paar
   ekstra vrugte op elke rol en betaal ± 87,8%. (Uitgewerk deur al
   8 × 8 × 8 uitkomste deur te tel.)
   ========================================================================== */
var SL_SIMBOLE = ['\u{1F352}','\u{1F34B}','\u{1F34A}','\u{1F347}','\u{1F514}','⭐','7️⃣',''];
/* Hoeveel kere elke simbool op 'n rol staan (kersie, suurlemoen, lemoen,
   druiwe, klok, ster, sewe, leeg). */
var SL_ROL_SELF   = [4,4,5,4,3,3,2,4];
var SL_ROL_VINNIG = [4,5,5,5,3,3,2,4];
/* Drie van 'n soort; kersies tel ook as daar een of twee is. */
var SL_DRIE = [20,10,15,20,30,60,200];
var SL_KERSIES = [0,1,5,20];

function slRol(rol){ return kiesGeweeg([0,1,2,3,4,5,6,7], function(x){ return rol[x]; }); }
function slBetaal(a, b, c){
  if(a===b && b===c && a>0 && a<7) return SL_DRIE[a];
  return SL_KERSIES[(a===0?1:0) + (b===0?1:0) + (c===0?1:0)];
}

var sl = null;
var SLOTS = {
  id:'slots', n:'Slots', e:'\u{1F3B0}',
  uitleg:'Drie rolle, een lyn. ’n Kersie gee jou inset terug; drie sewes betaal 200 keer jou inset.',
  selfSub:'Jy trek self die hefboom · die masjien betaal ± 92% terug',
  vinnigSub:'Jy druk 25 keer die knoppie by die masjien by die deur (± 88%)',
  begin:function(o){
    sl = {klaar:o.klaar, chips:o.chips, eenheid:msEenheid(o.chips), rol:[6,6,6], draai:false, rondtes:0};
    sl.inset = sl.eenheid;
    o.paneel.innerHTML = msRaam(SLOTS,
      '<div class="sl-masjien"><div class="sl-rol" id="sl-0"></div><div class="sl-rol" id="sl-1"></div>'+
      '<div class="sl-rol" id="sl-2"></div></div>'+
      '<div class="sl-tabel">' + [6,5,4,3,2,1].map(function(x){
        return '<span>' + SL_SIMBOLE[x] + SL_SIMBOLE[x] + SL_SIMBOLE[x] + ' <b>' + SL_DRIE[x] + '×</b></span>';
      }).join('') + '<span>\u{1F352}\u{1F352}\u{1F352} <b>' + SL_KERSIES[3] + '×</b></span>'+
      '<span>\u{1F352}\u{1F352} <b>' + SL_KERSIES[2] + '×</b></span>'+
      '<span>\u{1F352} <b>' + SL_KERSIES[1] + '×</b></span></div>');
    msBoods('Kies jou inset en trek.');
    slTeken();
  },
  stapWeg:function(){
    if(sl.draai) return;
    sl.klaar({chips:sl.chips, rondtes:sl.rondtes});
  },
  vinnig:function(chips){
    return msVinnigSessie(chips, function(c, inset){
      return c - inset + inset*slBetaal(slRol(SL_ROL_VINNIG), slRol(SL_ROL_VINNIG), slRol(SL_ROL_VINNIG));
    });
  }
};
function slTeken(){
  msChips(sl.chips);
  for(var i=0;i<3;i++) el('sl-'+i).textContent = SL_SIMBOLE[sl.rol[i]];
  el('ms-beheer').innerHTML = msInsetKnoppe(sl.inset, sl.eenheid, sl.chips, 'slInset') +
    '<button class="knop groen" onclick="slDraai()">Trek die hefboom</button>';
}
function slInset(b){ if(!sl.draai && b <= sl.chips){ sl.inset = b; slTeken(); } }
function slDraai(){
  if(sl.draai) return;
  if(sl.chips < sl.inset){
    if(sl.chips < sl.eenheid){ msBoods('Jy het nie meer genoeg chips nie.','sleg'); return; }
    sl.inset = sl.eenheid;
  }
  sl.draai = true; sl.rondtes++; sl.chips -= sl.inset; msChips(sl.chips);
  var uit = [slRol(SL_ROL_SELF), slRol(SL_ROL_SELF), slRol(SL_ROL_SELF)];
  msBoods('');
  var t = 0, stop = [9, 15, 21];
  var tik = setInterval(function(){
    t++;
    for(var i=0;i<3;i++){
      var r = el('sl-'+i);
      if(t < stop[i]){ r.textContent = SL_SIMBOLE[R(7)]; r.className = 'sl-rol draai'; }
      else { r.textContent = SL_SIMBOLE[uit[i]]; r.className = 'sl-rol'; }
    }
    if(t >= stop[2]){
      clearInterval(tik);
      sl.rol = uit; sl.draai = false;
      var m = slBetaal(uit[0], uit[1], uit[2]), terug = sl.inset*m;
      sl.chips += terug;
      msBoods(m >= 20 ? 'JACKPOT! ' + geld(terug) + '!' : m>1 ? 'Jy wen ' + geld(terug) + '.' :
        m===1 ? 'Jy kry jou inset terug.' : 'Niks nie.', m>1 ? 'goed' : m===1 ? '' : 'sleg');
      slTeken();
    }
  }, 70);
}

/* ==========================================================================
   VIDEO POKER — Jacks or Better ("Boere of beter"). Vyf kaarte, hou wat
   jy wil, trek een keer. Die 9/6-tabel van die self-masjien betaal
   99,5% terug as jy perfek speel; die vinnige masjien is 8/5 (97,3%).
   ========================================================================== */
var VP_TABEL = [
  {id:'rf', n:'Royal flush', b:800}, {id:'sf', n:'Straight flush', b:50},
  {id:'vk', n:'Vier van ’n soort', b:25}, {id:'vh', n:'Full house', b:9},
  {id:'fl', n:'Flush', b:6}, {id:'st', n:'Straight', b:4},
  {id:'dk', n:'Drie van ’n soort', b:3}, {id:'tp', n:'Twee pare', b:2},
  {id:'jb', n:'Boere of beter', b:1}];
var VP_VINNIG = {vh:8, fl:5};

function vpPak(){
  var k = [];
  for(var r=2;r<=14;r++) for(var su=0;su<4;su++) k.push({r:r, k:su});
  return skommel(k);
}
function vpHand(h){
  var r = h.map(function(c){ return c.r; }).sort(function(a,b){ return a-b; }), tel = {};
  r.forEach(function(x){ tel[x] = (tel[x]||0) + 1; });
  var g = Object.keys(tel).map(function(x){ return tel[x]; }).sort(function(a,b){ return b-a; });
  var kleur = h.every(function(c){ return c.k===h[0].k; });
  var reeks = g.length===5 && (r[4]-r[0]===4 || (r[4]===14 && r[3]===5));
  if(reeks && kleur) return r[0]===10 ? 'rf' : 'sf';
  if(g[0]===4) return 'vk';
  if(g[0]===3 && g[1]===2) return 'vh';
  if(kleur) return 'fl';
  if(reeks) return 'st';
  if(g[0]===3) return 'dk';
  if(g[0]===2 && g[1]===2) return 'tp';
  if(g[0]===2){
    for(var x in tel) if(tel[x]===2 && +x>=11) return 'jb';
  }
  return null;
}
function vpBetaal(id, vinnig){
  if(!id) return 0;
  if(vinnig && VP_VINNIG[id]) return VP_VINNIG[id];
  for(var i=0;i<VP_TABEL.length;i++) if(VP_TABEL[i].id===id) return VP_TABEL[i].b;
  return 0;
}
/* Al die groepies van n kaarte uit die hand (as indekse). */
function vpGroepe(idx, n){
  if(n===0) return [[]];
  if(idx.length < n) return [];
  var eerste = idx[0], rus = idx.slice(1);
  return vpGroepe(rus, n-1).map(function(g){ return [eerste].concat(g); }).concat(vpGroepe(rus, n));
}
/* Pas n kaarte van dieselfde kleur binne 'n straight van vyf? */
function vpSfGroep(h, n){
  var idx = [0,1,2,3,4], g = vpGroepe(idx, n);
  for(var i=0;i<g.length;i++){
    var gr = g[i], c = gr.map(function(j){ return h[j]; });
    if(!c.every(function(x){ return x.k===c[0].k; })) continue;
    var r = c.map(function(x){ return x.r; });
    if(r.some(function(x, j){ return r.indexOf(x)!==j; })) continue;
    var hoog = Math.max.apply(null, r) - Math.min.apply(null, r);
    var laag = r.map(function(x){ return x===14 ? 1 : x; });
    if(hoog <= 4 || Math.max.apply(null, laag) - Math.min.apply(null, laag) <= 4) return gr;
  }
  return null;
}
/* Die eenvoudige strategie vir 9/6 Jacks or Better: watter kaarte om te hou. */
function vpHou(h){
  var alle = [0,1,2,3,4], pat = vpHand(h), i, k;
  if(pat==='rf' || pat==='sf' || pat==='vk') return alle;
  var perK = [[],[],[],[]], tel = {};
  h.forEach(function(c, j){ perK[c.k].push(j); (tel[c.r] = tel[c.r]||[]).push(j); });
  function royal(n){
    for(var k=0;k<4;k++){ var x = perK[k].filter(function(j){ return h[j].r>=10; }); if(x.length>=n) return x; }
    return null;
  }
  var r4 = royal(4); if(r4) return r4;
  if(pat==='vh' || pat==='fl' || pat==='st') return alle;
  if(pat==='dk'){ for(k in tel) if(tel[k].length===3) return tel[k]; }
  var sf4 = vpSfGroep(h, 4); if(sf4) return sf4;
  var pare = []; for(k in tel) if(tel[k].length===2) pare.push(tel[k]);
  if(pare.length===2) return pare[0].concat(pare[1]);
  if(pare.length===1 && h[pare[0][0]].r>=11) return pare[0];
  var r3 = royal(3); if(r3) return r3;
  for(k=0;k<4;k++) if(perK[k].length===4) return perK[k];
  if(pare.length===1) return pare[0];
  /* Vier na 'n oop straight (aan albei kante oop). */
  var g4 = vpGroepe(alle, 4);
  for(i=0;i<g4.length;i++){
    var r = g4[i].map(function(j){ return h[j].r; });
    if(r.some(function(x, j){ return r.indexOf(x)!==j; })) continue;
    var lo = Math.min.apply(null, r), hi = Math.max.apply(null, r);
    if(hi-lo===3 && hi<=13) return g4[i];
  }
  var hoog = alle.filter(function(j){ return h[j].r>=11; });
  for(k=0;k<4;k++){ var hk = perK[k].filter(function(j){ return h[j].r>=11; }); if(hk.length>=2) return hk.slice(0,2); }
  var sf3 = vpSfGroep(h, 3); if(sf3) return sf3;
  if(hoog.length>=2){ hoog.sort(function(a,b){ return h[a].r - h[b].r; }); return hoog.slice(0,2); }
  for(i=0;i<5;i++) if(h[i].r===10){
    for(var j=0;j<5;j++) if(j!==i && h[j].k===h[i].k && h[j].r>=11 && h[j].r<=13) return [i,j];
  }
  if(hoog.length) return [hoog[0]];
  return [];
}
/* Een volle hand: deel, hou volgens die strategie, trek. */
function vpSpeelRondte(vinnig){
  var pak = vpPak(), h = pak.slice(0,5), hou = vpHou(h), p = 5;
  for(var i=0;i<5;i++) if(hou.indexOf(i)<0) h[i] = pak[p++];
  return vpBetaal(vpHand(h), vinnig);
}

var vp = null;
var VIDEOPOKER = {
  id:'videopoker', n:'Video poker', e:'\u{1F3B4}',
  uitleg:'Jacks or Better: jy kry vyf kaarte, tik op dié wat jy wil hou, en trek een keer. ' +
    '’n Paar boere of beter betaal jou inset terug.',
  selfSub:'Die 9/6-masjien · ± 99,5% terug as jy perfek speel',
  vinnigSub:'Jy speel 25 hande op outomaat by die 8/5-masjien (± 97%)',
  begin:function(o){
    vp = {klaar:o.klaar, chips:o.chips, eenheid:msEenheid(o.chips), hand:null, hou:[], fase:'wag',
      pak:null, rondtes:0, uit:null};
    vp.inset = vp.eenheid;
    o.paneel.innerHTML = msRaam(VIDEOPOKER, '<div class="vp-tabel" id="vp-tabel"></div>'+
      '<div class="vp-hand" id="vp-hand"></div>');
    msBoods('Kies jou inset en deel.');
    vpTeken();
  },
  stapWeg:function(){
    if(vp.fase==='gedeel'){ msBoods('Trek eers jou kaarte.','sleg'); return; }
    vp.klaar({chips:vp.chips, rondtes:vp.rondtes});
  },
  vinnig:function(chips){
    return msVinnigSessie(chips, function(c, inset){ return c - inset + inset*vpSpeelRondte(true); });
  }
};
function vpTeken(){
  msChips(vp.chips);
  el('vp-tabel').innerHTML = VP_TABEL.map(function(x){
    return '<div class="' + (vp.uit===x.id ? 'aan' : '') + '"><span>' + x.n + '</span><b>' + kortGeld(x.b*vp.inset) +
      '</b></div>'; }).join('');
  el('vp-hand').innerHTML = vp.hand ? vp.hand.map(function(c, i){
    var hou = vp.hou.indexOf(i)>=0;
    return '<div class="vp-plek" onclick="vpHouKaart(' + i + ')">' +
      kaartHtml(c, false, (hou ? ' hou' : '') + msNuut(i + kaartNaam(c) + c.k)) +
      '<small>' + (hou ? 'HOU' : '') + '</small></div>';
  }).join('') : '';
  var b;
  if(vp.fase==='gedeel'){
    b = '<button class="knop groen" onclick="vpTrek()">Trek</button>'+
      '<button class="ms-wenk" onclick="vpWenk()">Wat sou ’n kenner hou?</button>';
  } else {
    b = msInsetKnoppe(vp.inset, vp.eenheid, vp.chips, 'vpInset') +
      '<button class="knop groen" onclick="vpDeel()">Deel</button>';
  }
  el('ms-beheer').innerHTML = b;
}
function vpInset(b){ if(vp.fase!=='gedeel' && b <= vp.chips){ vp.inset = b; vpTeken(); } }
function vpDeel(){
  if(vp.chips < vp.inset){
    if(vp.chips < vp.eenheid){ msBoods('Jy het nie meer genoeg chips nie.','sleg'); return; }
    vp.inset = vp.eenheid;
  }
  vp.chips -= vp.inset; vp.rondtes++;
  vp.pak = vpPak(); vp.hand = vp.pak.slice(0,5); vp.hou = []; vp.fase = 'gedeel'; msGesien = {};
  vp.uit = vpHand(vp.hand);
  msBoods(vp.uit ? 'Jy het reeds ' + VP_TABEL.filter(function(x){ return x.id===vp.uit; })[0].n.toLowerCase() +
    '. Tik op die kaarte wat jy wil hou.' : 'Tik op die kaarte wat jy wil hou.');
  vpTeken();
}
function vpHouKaart(i){
  if(vp.fase!=='gedeel') return;
  var j = vp.hou.indexOf(i);
  if(j>=0) vp.hou.splice(j,1); else vp.hou.push(i);
  vpTeken();
}
function vpWenk(){ if(vp.fase==='gedeel'){ vp.hou = vpHou(vp.hand); vpTeken(); } }
function vpTrek(){
  if(vp.fase!=='gedeel') return;
  var p = 5;
  for(var i=0;i<5;i++) if(vp.hou.indexOf(i)<0) vp.hand[i] = vp.pak[p++];
  vp.uit = vpHand(vp.hand); vp.fase = 'wag'; vp.hou = [];
  var terug = vp.inset * vpBetaal(vp.uit, false);
  vp.chips += terug;
  var naam = vp.uit ? VP_TABEL.filter(function(x){ return x.id===vp.uit; })[0].n : '';
  msBoods(!vp.uit ? 'Niks nie.' : naam + ' — ' + (terug > vp.inset ? 'jy wen ' + geld(terug) + '!' :
    'jy kry jou inset terug.'), terug > vp.inset ? 'goed' : terug ? '' : 'sleg');
  vpTeken();
}

/* ==========================================================================
   DIE CASINO
   Jy koop chips (hoeveel hang af van jou kontant), speel by een van die
   vier tafels, en stap weg wanneer jy wil. Wat jy uitbetaal word, gaan
   na jou kontant en in jou lewensverhaal. s.casino hou oor jou hele lewe
   by hoeveel jy ingesit en uitgehaal het.
   ========================================================================== */
var CASINO_SPELE = [BLACKJACK, ROULETTE, SLOTS, VIDEOPOKER];
var CASINO_CHIPS = [500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000];

function casinoTeks(){
  var c = s.casino;
  if(!c || !c.sessies) return 'Blackjack, roulette, slots of video poker · die huis wen op die lang duur';
  var n = c.uitbetaal - c.ingekoop;
  return c.sessies + ' besoek' + (c.sessies===1 ? '' : 'e') + ' · jy is altesaam ' +
    (n>=0 ? geld(n) + ' voor' : geld(-n) + ' agter') + ' by die casino';
}
function casinoVloei(){
  if(s.geld < CASINO_CHIPS[0]){ wenk('Jy het minstens ' + geld(CASINO_CHIPS[0]) + ' kontant nodig vir chips.'); return; }
  kiesLys('Die casino', 'Waar wil jy speel?', CASINO_SPELE.map(function(x){
    return {t:x.e + ' ' + x.n, sub:x.uitleg, doen:function(){ casinoChips(x); }};
  }));
}
function casinoChips(spel){
  var bedrae = CASINO_CHIPS.filter(function(b){ return b <= s.geld; }).slice(-4);
  kiesLys('Koop chips', 'Hoeveel chips koop jy vir ' + spel.n.toLowerCase() + '? Jy het ' + geld(s.geld) + ' kontant.',
    bedrae.map(function(b){
      return {t:geld(b), sub: Math.round(b/s.geld*100) + '% van jou kontant', doen:function(){ casinoIngang(spel, b); }};
    }), 'Terug', casinoVloei);
}
function casinoIngang(spel, chips){
  minispelIngang(spel, {chips:chips,
    teks:spel.uitleg + '\n\nJy koop ' + geld(chips) + ' se chips.',
    voor:function(){ s.geld -= chips; },
    klaar:function(u){ casinoKlaar(spel, chips, u); },
    los:casinoVloei});
}
function casinoKlaar(spel, ingekoop, u){
  var uit = Math.max(0, Math.round(u.chips)), netto = uit - ingekoop;
  s.geld += uit;
  if(!s.casino) s.casino = {sessies:0, ingekoop:0, uitbetaal:0};
  s.casino.sessies++; s.casino.ingekoop += ingekoop; s.casino.uitbetaal += uit;
  s.gedoen.casino = (s.gedoen.casino||0) + 1;
  if(netto > 0) s.geluk = klem(s.geluk + Math.min(16, 3 + Math.round(netto/ingekoop*10)));
  else if(netto < 0) s.geluk = klem(s.geluk - Math.min(10, 2 + Math.round(-netto/ingekoop*8)));
  var teks = 'By die casino (' + spel.n.toLowerCase() + (u.self ? '' : ', vinnig') + ') het jy ' + geld(ingekoop) +
    ' se chips gekoop, ' + u.rondtes + (u.rondtes===1 ? ' rondte' : ' rondtes') + ' gespeel en met ' + geld(uit) +
    ' weggestap (' + (netto>=0 ? '+' : '') + geld(netto) + ').';
  noteer(teks, netto > 0 ? 'geld' : netto < 0 ? 'sleg' : 'neutraal');
  stoor(); renderAlles();
  wysModaal(netto > 0 ? 'Jy is voor!' : netto < 0 ? 'Die huis wen' : 'Gelykop',
    teks + (u.teks && !u.self ? '\n\n' + u.teks : ''), [{t:'OK', doen:sluitModaal}]);
}
