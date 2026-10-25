/* ==========================================================================
   ONTWIKKELAAR-PANEEL (playtest)
   Net aktief as die adres ?dev of #dev bevat, bv.
     index.html?dev      of      https://markojvr.github.io/lewensloop/?dev
   Gewone spelers sien niks hiervan nie. Dit gee 'n 🛠-knoppie bo-links met
   kortpaaie: statte en geld stel, jare spring, tronk/vlug/straat, organisasies,
   en elke mini-spel direk oopmaak sonder die vloei daarvoor.
   Hierdie lêer laai laaste en verander niks aan die spel as dev af is nie.
   ========================================================================== */

var DEV = typeof location!=='undefined' && /[?&#]dev\b/.test(location.search + location.hash);
var devOnsterflik = false;

if(DEV){
  /* Onsterflik: die dood word oorgeslaan solank dit aan is. */
  var devOuDood = doodKontrole;
  doodKontrole = function(){
    if(devOnsterflik && s){ s.gesondheid = Math.max(s.gesondheid, 1); return; }
    devOuDood();
  };
  devKnop();
}

function devKnop(){
  var b = document.createElement('button');
  b.id = 'dev-knop'; b.textContent = '\u{1F6E0}'; b.title = 'Ontwikkelaar';
  b.onclick = devOop;
  el('toestel').appendChild(b);
  var p = document.createElement('div'); p.id = 'dev-paneel';
  el('toestel').appendChild(p);
}
function devToe(){ el('dev-paneel').classList.remove('wys'); }
function devKlaar(teks){ if(teks) wenk(teks); stoor(); renderAlles(); devOop(); }

/* ---------- Die paneel ---------- */
function devOop(){
  var p = el('dev-paneel');
  if(!s || !s.lewe){
    p.innerHTML = devKop() + '<div class="dev-blok">Begin eers ’n lewe.</div>';
    p.classList.add('wys'); return;
  }
  var stat = function(id, n, w){
    return '<label>' + n + '<input type="number" id="dev-' + id + '" value="' + Math.round(w||0) + '"></label>'; };
  var k = function(t, f, klas){ return '<button class="dev-k ' + (klas||'') + '" onclick="' + f + '">' + t + '</button>'; };
  var tronk = s.tronk ? 'In die tronk: ' + (s.tronk.jare - (s.tronk.gedien||0)) + ' jaar oor' :
    s.vlug ? 'Op die vlug: ' + s.vlug.oor + ' jaar oop' : s.dakloos ? 'Dakloos' : 'Vry';
  p.innerHTML = devKop() +
    '<div class="dev-blok"><b>' + s.naam + ' ' + s.van + '</b> · ' + s.ouderdom + ' jaar · ' + tronk +
      ' · rep ' + (s.straatRep||0) + ' · hitte ' + (s.hitte||0) + '</div>' +

    '<div class="dev-blok"><div class="dev-t">Statte</div><div class="dev-rooster">' +
      stat('ouderdom','Ouderdom',s.ouderdom) + stat('geld','Kontant',s.geld) +
      stat('geluk','Geluk',s.geluk) + stat('gesondheid','Gesondheid',s.gesondheid) +
      stat('slim','Slim',s.slim) + stat('voorkoms','Voorkoms',s.voorkoms) +
      stat('straatRep','Straat-rep',s.straatRep) + stat('hitte','Hitte',s.hitte) +
    '</div>' + k('Pas toe','devStatte()','groen') +
      k('Alles 100','devMaks()') + k('+R1 m','devGeld(1e6)') + k('+R10 m','devGeld(1e7)') +
      '<label class="dev-vink"><input type="checkbox" ' + (devOnsterflik?'checked':'') +
        ' onchange="devOnsterflik=this.checked">Onsterflik</label></div>' +

    '<div class="dev-blok"><div class="dev-t">Tyd</div>' +
      k('+1 jaar','devJare(1)') + k('+5 jaar','devJare(5)') + k('+10 jaar','devJare(10)') +
      '<label class="dev-vink"><input type="checkbox" id="dev-outo" checked>Antwoord vrae outomaties</label>' +
      '<div class="dev-klein">Spring stop by ’n mini-spel. Sonder outo-antwoord stop dit by die eerste vraag.</div></div>' +

    '<div class="dev-blok"><div class="dev-t">Mini-spele (direk, sonder gevolge)</div>' +
      CASINO_SPELE.map(function(x, i){ return k(x.e + ' ' + x.n, 'devCasino(' + i + ')'); }).join('') +
      Object.keys(MD_SPELE).map(function(id){ return k(MD_SPELE[id].e + ' ' + MD_SPELE[id].n, 'devMd(\'' + id + '\')'); }).join('') +
      k('\u{1F693} Jaagtog: Tazz','devJaag(155,2,3)') + k('\u{1F693} Jaagtog: Porsche','devJaag(293,5,3)') +
      k('\u{1F693} Jaagtog: bankroof','devJaag(250,4,5)') +
      k('\u{1F6A7} Ontsnapping: niks','devOntsnapSpel(false)') + k('\u{1F6A7} Ontsnapping: alles','devOntsnapSpel(true)') +
    '</div>' +

    '<div class="dev-blok"><div class="dev-t">Toestande</div>' +
      k('Tronk toe (8 jaar)','devTronk(8)') + k('Gee alle ontsnap-voorbereiding','devPlan()') +
      k('Ontsnap nou (regte vloei)','devOntsnap()') + k('Word vlugteling','devVlug()') +
      k('Laat vry','devVry()') + k('Word dakloos','devDakloos()') +
      k('Hitte 0, rekord skoon','devSkoon()') +
    '</div>' +

    '<div class="dev-blok"><div class="dev-t">Onderwêreld</div>' +
      ORGANISASIES.map(function(o){ return k(o.e + ' ' + o.n, 'devOrg(\'' + o.id + '\')'); }).join('') +
      k('Rang op','devRang()') + k('Begin eie organisasie','devEieOrg()') +
      k('+3 lede in eie org','devLede()') +
    '</div>' +

    '<div class="dev-blok"><div class="dev-t">Werk en bates</div>' +
      k('Kry ’n werk…','devWerk()') + k('Gee motor…','devMotor()') + k('Rylisensie','devLisensie()') +
    '</div>' +

    '<div class="dev-blok"><div class="dev-t">Stoor</div>' +
      k('Kopieer stoor','devKopieer()') + k('Laai stoor uit knipbord','devPlak()') +
      k('Nuwe lewe','devNuwe()','rooi') +
    '</div>';
  p.classList.add('wys');
}
function devKop(){
  return '<div class="dev-kop"><b>\u{1F6E0} Ontwikkelaar</b><button class="dev-x" onclick="devToe()">✕</button></div>';
}

/* ---------- Statte en geld ---------- */
function devStatte(){
  ['ouderdom','geld','geluk','gesondheid','slim','voorkoms','straatRep','hitte'].forEach(function(id){
    var v = Number(el('dev-' + id).value);
    if(isNaN(v)) return;
    s[id] = (id==='geld' || id==='ouderdom') ? Math.round(v) : klem(v);
  });
  devKlaar('Statte gestel.');
}
function devMaks(){
  ['geluk','gesondheid','slim','voorkoms'].forEach(function(id){ s[id] = 100; });
  devKlaar('Alles op 100.');
}
function devGeld(n){ s.geld += n; devKlaar('+' + kortGeld(n)); }

/* ---------- Tyd ---------- */
function devJare(n){
  devToe();
  var outo = el('dev-outo') && el('dev-outo').checked, gedoen = 0, tel = 0;
  while(gedoen < n && s.lewe && tel < 400){
    tel++;
    var ms = el('minispel');
    if(ms && ms.classList.contains('wys')) break;          /* 'n mini-spel wag op jou */
    var m = el('modaal');
    if(m.classList.contains('wys')){
      if(!outo) break;
      var b = m.querySelector('button.knop:not(.grys)') || m.querySelector('button.knop');
      if(!b) break;
      b.click(); continue;
    }
    var voor = s.ouderdom;
    wordOuer();
    if(s.ouderdom > voor) gedoen++;
  }
  /* Laat die laaste jaar se vrae (en die grafsteen) aan die speler oor. */
  if(outo){
    var m2 = el('modaal'), t2 = 0;
    while(m2.classList.contains('wys') && s.lewe && t2++ < 30){
      var b2 = m2.querySelector('button.knop:not(.grys)') || m2.querySelector('button.knop');
      if(!b2) break; b2.click();
    }
  }
  if(s.lewe){ stoor(); renderAlles(); }
  wenk(gedoen + ' jaar gespring.');
}

/* ---------- Mini-spele direk ---------- */
function devUitslag(naam){
  return function(u){
    var d = [];
    ['q','ontsnap','raak','uit','alarm','chips','teks'].forEach(function(k){
      if(u && u[k]!==undefined) d.push(k + ': ' + (typeof u[k]==='number' ? Math.round(u[k]*100)/100 : u[k])); });
    wysModaal('\u{1F6E0} ' + naam, (u && u.self ? 'Self gespeel. ' : 'Vinnig. ') + d.join(' · '),
      [{t:'Terug na paneel', doen:function(){ sluitModaal(); devOop(); }}, {t:'Sluit', klas:'grys', doen:sluitModaal}]);
  };
}
function devCasino(i){
  devToe();
  var spel = CASINO_SPELE[i], chips = 10000;
  minispelIngang(spel, {chips:chips, teks:'Ontwikkelaar: ' + geld(chips) + ' se chips, geen geld word afgetrek nie.',
    klaar:devUitslag(spel.n), los:devOop});
}
function devMd(id){
  devToe();
  var spel = MD_SPELE[id];
  minispelIngang(spel, {teks:spel.uitleg + '\n\nOntwikkelaar: geen risiko, geen gevolge.',
    klaar:devUitslag(spel.n), los:devOop});
}
function devJaag(spoed, kanse, erns){
  devToe();
  var op = jaagOpstel(spoed, kanse, erns);
  JAAGTOG.op = op;
  minispelIngang(JAAGTOG, {teks:JAAGTOG.uitleg + '\n\nOntwikkelaar: ' + spoed + ' km/h, ' + kanse + ' kanse, erns ' +
    erns + ', ' + op.lengte + ' hindernisse.', klaar:devUitslag('Jaagtog'), los:devOop});
}
function devOntsnapSpel(alles){
  devToe();
  ONTSNAP_SPEL.prep = alles ? {tonnel:3, laken:true, uniform:true, roete:true, helper:true, bewaarder:true}
    : {tonnel:0, laken:false, uniform:false, roete:false, helper:false, bewaarder:false};
  minispelIngang(ONTSNAP_SPEL, {teks:ONTSNAP_SPEL.uitleg + '\n\nOntwikkelaar: ' +
    (alles ? 'alle voorbereiding.' : 'geen voorbereiding.') + ' Geen gevolge.', klaar:devUitslag('Ontsnapping'), los:devOop});
}

/* ---------- Toestande ---------- */
function devTronk(j){
  if(s.tronk){ wenk('Jy sit al.'); return; }
  if(s.vlug) s.vlug = null;
  tronkToe(j, 'toetsing (ontwikkelaar)');
  devKlaar('Tronk toe vir ' + j + ' jaar.');
}
function devPlan(){
  if(!s.tronk){ wenk('Gaan eers tronk toe.'); return; }
  var p = tronkPlan();
  p.tonnel = 3; p.laken = p.uniform = p.roete = p.helper = p.bewaarder = p.kar = true;
  devKlaar('Alle voorbereiding gedoen.');
}
function devOntsnap(){
  if(!s.tronk){ wenk('Gaan eers tronk toe.'); return; }
  if(s.tronk.jeug){ wenk('Uit ’n jeugsorgsentrum is daar geen ontsnapping nie.'); return; }
  s.gedoen.t_ontsnap = 0; devToe(); ontsnapPoging();
}
function devVlug(){
  if(s.vlug){ wenk('Jy is al op die vlug.'); return; }
  if(!s.tronk) tronkToe(8, 'toetsing (ontwikkelaar)');
  if(s.tronk.jeug){ wenk('Uit ’n jeugsorgsentrum is daar geen ontsnapping nie.'); return; }
  vlugBegin(55, 'Ontwikkelaar: jy is uit.');   /* wys self 'n venster */
  stoor(); renderAlles(); devToe();
}
function devVry(){
  s.tronk = null; s.vlug = null;
  if(s.dakloos){ s.dakloos = null; s.blyplek = 'ouers'; }
  devKlaar('Vry.');
}
function devDakloos(){
  if(s.ouderdom < 18){ wenk('Net vir 18+.'); return; }
  s.tronk = null; s.vlug = null; raakDakloos('toetsing (ontwikkelaar)');
  devKlaar('Op straat.');
}
function devSkoon(){ s.hitte = 0; s.rekord = []; s.opgeskort = null; devKlaar('Skoon.'); }

/* ---------- Onderwêreld ---------- */
function devOrg(id){
  var o = orgVan(id);
  s.eieOrg = null;
  s.straatRep = Math.max(s.straatRep||0, o.rep);
  if(s.ouderdom < o.min) s.ouderdom = o.min;
  s.bende = {id:o.id, punte:0, rang:0, jobs:0, sedert:s.ouderdom};
  noteer('Ontwikkelaar: by ' + o.n + ' aangesluit.','misdaad');
  devKlaar('Lid van ' + o.n + '.');
}
function devRang(){
  if(!s.bende){ wenk('Sluit eers by ’n organisasie aan.'); return; }
  var b = s.bende;
  if(b.rang >= ORG_RANG_PUNTE.length - 1){ wenk('Reeds die hoogste rang.'); return; }
  b.rang++; b.punte = Math.max(b.punte, ORG_RANG_PUNTE[b.rang]);
  devKlaar('Rang: ' + myOrg().range[b.rang] + '.');
}
function devEieOrg(){
  if(s.eieOrg){ wenk('Jy het reeds een.'); return; }
  s.straatRep = Math.max(s.straatRep||0, EIE_ORG_REP);
  if(s.ouderdom < EIE_ORG_OUDERDOM) s.ouderdom = EIE_ORG_OUDERDOM;
  s.geld = Math.max(s.geld, EIE_ORG_KOSTE);
  eieOrgStig('Die ' + s.van + '-familie');
  devKlaar('Organisasie gestig.');
}
function devLede(){
  var e = s.eieOrg; if(!e){ wenk('Begin eers jou eie organisasie.'); return; }
  for(var i=0;i<3;i++){
    var m = kans(50);
    e.lede.push({naam:kies(m ? MANSNAME : VROUENAME) + ' ' + kies(VANNE), vlak:tussen(1,3), lojaal:tussen(50,80), jare:0});
  }
  devKlaar('+3 lede.');
}

/* ---------- Werk en bates ---------- */
function devWerk(){
  devToe();
  kiesLys('\u{1F6E0} Kry ’n werk', 'Direk aangestel, sonder vereistes.', BEROEPE.map(function(j){
    return {t:j.t, sub:geld(j.s), doen:function(){
      s.beroep = {id:j.id, t:j.t, basis:j.s, salaris:j.s, vlak:0, prestasie:60, jare:0, k:j.k, plafon:j.plafon||0};
      s.beroepeGehad.push(j.t);
      if(typeof maakKollegas==='function') maakKollegas();
      sluitModaal(); devKlaar('Aangestel as ' + j.t + '.'); }};
  }), 'Terug', function(){ sluitModaal(); devOop(); });
}
function devMotor(){
  devToe();
  kiesLys('\u{1F6E0} Gee motor', 'Gratis, met ’n rylisensie.', TE_KOOP.filter(function(b){ return b.t==='motor'; }).map(function(b){
    return {t:b.n, sub:(b.spoed||'?') + ' km/h · ' + (b.kanse||'?') + ' kanse', doen:function(){
      devLisensieStil(); voegBateBy(b); sluitModaal(); devKlaar(b.n + ' gekry.'); }};
  }), 'Terug', function(){ sluitModaal(); devOop(); });
}
function devLisensieStil(){ s.lisensie = true; s.lisensieWeg = 0; if(s.ouderdom < 18) s.ouderdom = 18; }
function devLisensie(){ devLisensieStil(); devKlaar('Rylisensie.'); }

/* ---------- Stoor ---------- */
function devKopieer(){
  var t = JSON.stringify({s:s, id:volgendeId});
  try{ navigator.clipboard.writeText(t).then(function(){ wenk('Stoor gekopieer (' + t.length + ' karakters).'); },
    function(){ wenk('Kon nie kopieer nie.'); }); }catch(e){ wenk('Kon nie kopieer nie.'); }
}
function devPlak(){
  try{
    navigator.clipboard.readText().then(function(t){
      var d = JSON.parse(t);
      if(!d || !d.s){ wenk('Dit lyk nie na ’n stoor nie.'); return; }
      localStorage.setItem(SLEUTEL, t); location.reload();
    }, function(){ wenk('Kon nie die knipbord lees nie.'); });
  }catch(e){ wenk('Kon nie laai nie.'); }
}
function devNuwe(){
  if(!confirm('Gooi hierdie lewe weg en begin oor?')) return;
  try{ localStorage.removeItem(SLEUTEL); }catch(e){}
  location.reload();
}
