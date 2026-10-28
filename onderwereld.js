/* ==========================================================================
   13. DIE ONDERWÊRELD (Fase 8b)
   Jou reputasie as krimineel (s.straatRep), die organisasies waarby jy
   kan aansluit (s.bende), en jou eie organisasie (s.eieOrg).

   'n Organisasie gee jobs: hulle betaal, bou jou rep, en elke job wat
   slaag, skuif jou nader aan die volgende rang — en 'n hoër rang maak
   beter jobs oop. 'n Beter organisasie vra meer rep om by aan te sluit.
   'n Job loop deur presies dieselfde misdaadvloei as 'n gewone misdaad
   (voertuig, mini-spel, jaagtog, hof) — net met die organisasie se geld.

   Bo EIE_ORG_REP kan jy jou eie organisasie begin. Die moeilikste deel
   is mense werf: die kans hang af van die organisasie se rep, en dié is
   'n deel van jou eie rep plus wat jou mense se jobs opbou. Niemand word
   in enige job doodgemaak of seergemaak nie.

   Die getalle staan in data.js onder "DIE ONDERWÊRELD".
   ========================================================================== */

function repNaam(r){
  var n = REP_NAME[0][1];
  REP_NAME.forEach(function(x){ if((r||0) >= x[0]) n = x[1]; });
  return n;
}
function repBy(n){ s.straatRep = klem((s.straatRep||0) + n); }
function orgVan(id){
  var o = null;
  ORGANISASIES.forEach(function(x){ if(x.id===id) o = x; });
  return o;
}
function myOrg(){ return s.bende ? orgVan(s.bende.id) : null; }
function rangVir(punte){
  var r = 0;
  ORG_RANG_PUNTE.forEach(function(p, i){ if(punte >= p) r = i; });
  return r;
}

/* ---------- Aansluit en verlaat ---------- */
function orgSlot(o){
  if(s.ouderdom < o.min) return 'ouderdom ' + o.min + '+';
  if((s.straatRep||0) < o.rep) return 'rep ' + o.rep + '+';
  return '';
}
function sluitAan(id){
  var o = orgVan(id); if(!o || s.tronk) return;
  var slot = orgSlot(o);
  if(slot){ wenk('Hulle stel nie in jou belang nie (' + slot + ').'); return; }
  if(s.eieOrg){ wenk('Jy het jou eie organisasie.'); return; }
  var oud = myOrg();
  wysModaal(o.e + ' ' + o.n, o.sub + '. Jy begin as ' + o.range[0].toLowerCase() + '.' +
    (oud ? ' Jy los ' + oud.n + ' — hulle sal dit nie vergeet nie.' : ''), [
    {t:'Sluit aan', klas:'groen', doen:function(){
      if(oud && s.bende.rang >= 2){ s.geluk = klem(s.geluk - 6);
        noteer(oud.n + ' was nie bly dat jy weggeloop het nie.','sleg'); }
      s.bende = {id:o.id, punte:0, rang:0, jobs:0, sedert:s.ouderdom};
      noteer('Jy het by ' + o.n + ' aangesluit as ' + o.range[0].toLowerCase() + '.','misdaad');
      wenk('Welkom by ' + o.n + '.');
      sluitModaal(); stoor(); renderAlles(); }},
    {t:'Los dit', klas:'grys', doen:sluitModaal}
  ]);
}
function verlaatOrg(){
  var o = myOrg(); if(!o) return;
  wysModaal(o.e + ' Verlaat ' + o.n + '?', 'Jy verloor jou rang. ’n Luitenant of hoër loop nie sommer weg nie.', [
    {t:'Verlaat hulle', klas:'rooi', doen:function(){
      if(s.bende.rang >= 2){ s.geluk = klem(s.geluk - 8); repBy(-5); }
      noteer('Jy het ' + o.n + ' verlaat.','misdaad');
      s.bende = null; sluitModaal(); stoor(); renderAlles(); }},
    {t:'Bly', klas:'grys', doen:sluitModaal}
  ]);
}

/* ---------- Jobs vir 'n organisasie ---------- */
function orgJobs(){
  var o = myOrg(); if(!o) return;
  if(s.gedoen.laag){ wenk('Jy lê vanjaar laag.'); return; }
  if((s.gedoen.orgJob||0) >= ORG_JOBS_PER_JAAR){ wenk('Die baas het vanjaar genoeg vir jou gehad.'); return; }
  var lys = o.jobs.filter(function(j){ return j.rang <= s.bende.rang; });
  kiesLys(o.e + ' Jobs', 'Wat vra ' + o.n + ' vanjaar? (Jy is ' + o.range[s.bende.rang].toLowerCase() + '.)',
    lys.map(function(j){
      return {t:j.n, sub:'Betaal ' + kortGeld(j.betaal[0]) + ' tot ' + kortGeld(j.betaal[1]) + ' · ' +
        (j.veilig ? 'geen risiko' : 'risiko ' + orgJobRisiko(j) + '%' + (s.bende.rang ? ' ná beskerming' : '')) +
        ' · rep +' + orgJobRep(j) + ' · ' + orgJobPunte(j) + ' punte', doen:function(){ orgJob(o, j); }};
    }));
}
/* Wat 'n job wat slaag, gee: 'n veilige job net sy eie rep en min punte,
   'n riskante job ook die misdaad se rep (REP_PER_ERNS) en meer punte. */
/* Die basisrisiko ná die organisasie se beskerming (hitte en rekord kom nog by). */
function orgJobRisiko(j){ return Math.max(Math.round(j.risiko*RISIKO_VLOER), j.risiko - ORG_BESKERM*s.bende.rang); }
function orgJobRep(j){ return j.veilig ? j.rep : REP_PER_ERNS[j.erns] + j.rep; }
function orgJobPunte(j){ return j.veilig ? ORG_PUNTE_VEILIG + j.rang : ORG_PUNTE_SLAAG + 2*j.rang; }
/* Bou 'n misdaad uit die job, en stuur dit deur die gewone vloei. */
function orgJob(o, j){
  s.gedoen.orgJob = (s.gedoen.orgJob||0) + 1;
  var m = {id:'org', n:j.n, e:o.e, erns:j.erns, hitte:2 + j.erns*2, maat:false, voertuig:!!j.voertuig,
    spel:j.spel, jare:ERNS_JARE[j.erns], wapen:!!j.wapen};
  var t = {n:o.n, buit:j.betaal, risiko:j.risiko, spoed:j.spoed};
  /* 'n Veilige job (kyk, spot, verken) is self nie 'n misdaad nie: geen
     voertuig, geen gevangskans, geen hitte en geen hof — net betaling. */
  if(j.veilig){
    misdaadTel().pogings++; s.misdaad.laas = s.ouderdom;
    misdaadBetaal({m:m, t:t, job:j, org:o, veilig:true}, tussen(j.betaal[0], j.betaal[1]), '');
    return;
  }
  misdaadVoertuig({m:m, t:t, job:j, org:o});
}
/* Die misdaadvloei roep dit as die job slaag of misluk. */
function orgJobSlaag(c){
  if(!s.bende || s.bende.id !== c.org.id) return;
  s.bende.jobs++;
  repBy(c.job.rep);
  orgPunte(orgJobPunte(c.job));
}
function orgJobMisluk(c){
  if(!s.bende || s.bende.id !== c.org.id) return;
  orgPunte(-1);
}
/* Gevang op 'n organisasie se job: dalk maak hulle 'n plan, en die saak
   gaan nooit hof toe nie. Geen geweld: die getuie verander sy storie. */
function orgPlan(c){
  if(!s.bende || s.bende.id !== c.org.id || !kans(ORG_PLAN[s.bende.rang])) return false;
  var o = myOrg(), hoe = kies(['’n getuie het skielik sy storie verander','die dossier het by die polisiekantoor weggeraak',
    '’n speurder het besluit hy het niks gesien nie','die bewyse is “per ongeluk” vernietig']);
  noteer(o.n + ' het ’n plan gemaak: ' + hoe + '. Die saak gaan nie hof toe nie.','misdaad');
  wysModaal(o.e + ' ' + o.n + ' maak ’n plan', 'Jy is in hegtenis geneem, maar ' + hoe + '. Jy stap vry, sonder ’n hofsaak en sonder ’n rekord.',
    [{t:'OK', doen:function(){ sluitModaal(); stoor(); renderAlles(); }}]);
  return true;
}
function orgPunte(n){
  var b = s.bende, o = myOrg(), voor = b.rang;
  b.punte = Math.max(0, b.punte + n);
  b.rang = Math.max(voor, rangVir(b.punte));    /* 'n rang val nie terug nie */
  if(b.rang > voor) noteer('Jy is bevorder: jy is nou ' + o.range[b.rang].toLowerCase() + ' in ' + o.n + '.','misdaad');
}

/* ==========================================================================
   JOU EIE ORGANISASIE
   s.eieOrg = {naam, werkRep, lede, gestig, jobs, buit}. Sy rep =
   EIE_ORG_UIT_JOU_REP van jou rep plus werkRep.

   Elke lid l = {id, pid, naam, rep 0-100, rang 0-2, lojaal 0-100, jare,
   job (die naam van sy laaste job), gewerk (die ouderdom toe hy laas
   gewerk het), tronk (jare oor), jobs, buit}. pid is die id van 'n
   persoon in s.verhoudings as jy hom ken (vriend, familie, maat) — dan
   sterf of sit hy saam met daardie persoon, en hoe jy hom behandel, skuif
   julle band. Jy kan mense wat jy ken vra (die band bepaal die kans), of
   vreemdelinge werf (moeiliker). Elke lid kry sy eie job, een per jaar;
   sy rep maak beter jobs oop en bepaal sy sukses.
   ========================================================================== */
function eieOrgRep(){
  var e = s.eieOrg; if(!e) return 0;
  return klem(Math.round((s.straatRep||0)*EIE_ORG_UIT_JOU_REP + e.werkRep));
}
function eieMaksLede(){ return EIE_LEDE_BASIS + Math.floor(eieOrgRep()/EIE_LEDE_PER_REP); }
function eieWerfKans(){ return klem(Math.round(EIE_WERF_BASIS + eieOrgRep()*EIE_WERF_PER_REP), 5, 85); }
function eieVraKans(v){ return klem(Math.round(v.band - EIE_VRA_AF + eieOrgRep()*EIE_VRA_PER_REP), 3, 95); }
function eieLid(id){
  var l = null;
  if(s.eieOrg) s.eieOrg.lede.forEach(function(x){ if(x.id===id) l = x; });
  return l;
}
function eiePersoon(l){
  if(!l || l.pid===null || l.pid===undefined) return null;
  var v = null;
  s.verhoudings.forEach(function(x){ if(x.id===l.pid) v = x; });
  return v;
}
function eieLidVan(v){
  var l = null;
  if(s.eieOrg && v) s.eieOrg.lede.forEach(function(x){ if(x.pid===v.id) l = x; });
  return l;
}
/* Ou stoor-data: 'n lid was {naam, vlak 1-5, lojaal, jare}. */
function eieLidHerstel(l){
  if(l.rep===undefined) l.rep = klem(((l.vlak||1) - 1)*12 + 5);
  if(l.id===undefined) l.id = volgendeId++;
  if(l.pid===undefined) l.pid = null;
  if(!l.rang) l.rang = 0;
  if(l.job===undefined) l.job = null;
  if(l.gewerk===undefined) l.gewerk = -1;
  if(!l.tronk) l.tronk = 0;
  if(!l.jobs) l.jobs = 0;
  if(!l.buit) l.buit = 0;
  if(!l.geslag) l.geslag = VROUENAME.indexOf(String(l.naam).split(' ')[0]) >= 0 ? 'v' : 'm';
  delete l.vlak;
}
function eieHy(l){ return l.geslag==='v' ? 'sy' : 'hy'; }
function eieHom(l){ return l.geslag==='v' ? 'haar' : 'hom'; }
function eieNuweLid(naam, pid, rep, lojaal, geslag){
  return {id:volgendeId++, pid:pid, naam:naam, geslag:geslag, rep:rep, rang:0, lojaal:lojaal, jare:0,
    job:null, gewerk:-1, tronk:0, jobs:0, buit:0};
}
/* 'n Lid se trou: vir iemand wat jy ken, tel die band saam met die lojaliteit. */
function eieTrou(l){
  var v = eiePersoon(l);
  return v ? Math.round((l.lojaal + v.band)/2) : l.lojaal;
}

function beginEieOrg(){
  if(s.eieOrg || s.tronk) return;
  if((s.straatRep||0) < EIE_ORG_REP || s.ouderdom < EIE_ORG_OUDERDOM){
    wenk('Jy het rep ' + EIE_ORG_REP + ' en ' + EIE_ORG_OUDERDOM + ' jaar nodig.'); return; }
  if(s.geld < EIE_ORG_KOSTE){ wenk('Jy het ' + geld(EIE_ORG_KOSTE) + ' nodig om te begin.'); return; }
  var voorstel = 'Die ' + s.van + '-familie';
  wysModaal('\u{1F451} Jou eie organisasie', 'Dit kos ' + geld(EIE_ORG_KOSTE) + ' om te begin (’n plek, ’n paar ' +
    'kontakte, ’n wapenkas). Wat noem jy dit?', [
    {t:'Begin', klas:'groen', doen:function(){
      var v = el('m-invoer'), naam = v && v.value ? v.value.trim().slice(0,24) : '';
      eieOrgStig(naam || voorstel); }},
    {t:'Los dit', klas:'grys', doen:sluitModaal}
  ], '', {plek:voorstel, waarde:voorstel});
}
function eieOrgStig(naam){
  s.geld -= EIE_ORG_KOSTE; misdaadTel().koste += EIE_ORG_KOSTE;
  var oud = myOrg();
  if(oud) noteer('Jy het ' + oud.n + ' verlaat om jou eie ding te begin.','misdaad');
  s.bende = null;
  s.eieOrg = {naam:naam, werkRep:0, lede:[], gestig:s.ouderdom, jobs:0, buit:0};
  noteer('Jy het ' + naam + ' gestig. Nou moet jy net mense kry — begin by wie jy vertrou.','misdaad');
  sluitModaal(); stoor(); renderAlles();
}

/* ---------- Werf ---------- */
function eieVol(){
  if(s.eieOrg.lede.length >= eieMaksLede()){
    wenk('Meer mense as dit kan jy nie dophou nie (die org se rep bepaal hoeveel).'); return true; }
  return false;
}
/* Wie jy kan vra: grootmense wat jy ken, wat nie al lid is of tronk sit nie. */
function eieKanVra(v){
  return s.eieOrg && v.lewe && v.ouderdom >= 18 && !v.tronk && EIE_VRA_TIPES.indexOf(v.tipe) >= 0 &&
    !eieLidVan(v);
}
function eieVraLys(){
  var e = s.eieOrg; if(!e || s.tronk) return;
  var lys = s.verhoudings.filter(eieKanVra).sort(function(a,b){ return b.band - a.band; });
  if(!lys.length){ wenk('Daar is niemand wat jy ken om te vra nie (18+, nie al by jou nie).'); return; }
  kiesLys('\u{1F451} Vra iemand wat jy ken', 'Hoe naby julle is, bepaal of hulle ja sê. Elkeen kan jy een keer per jaar vra, ' +
    'en ’n nee kos band.', lys.slice(0,14).map(function(v){
      var gevra = v.orgGevra===s.ouderdom;
      return {t:v.naam + ' ' + v.van, sub:rol(v) + ' · band ' + v.band + '% · ' +
        (gevra ? 'het vanjaar al nee gesê' : 'kans ' + eieVraKans(v) + '%'), klas:gevra ? 'grys' : '',
        doen:function(){ eieVra(v); }};
    }));
}
function eieVra(v){
  var e = s.eieOrg; if(!e || !eieKanVra(v)) return;
  if(v.orgGevra===s.ouderdom){ wenk(v.naam + ' het vanjaar al nee gesê.'); return; }
  if(eieVol()) return;
  v.orgGevra = s.ouderdom;
  var k = eieVraKans(v), teks;
  if(kans(k)){
    var l = eieNuweLid(v.naam + ' ' + v.van, v.id, tussen(0,10), klem(Math.round(v.band*0.7) + 20, 30, 95), v.geslag);
    e.lede.push(l);
    v.band = klem(v.band + 3);
    teks = v.naam + ' het ja gesê: ' + (v.geslag==='v' ? 'sy' : 'hy') + ' werk nou vir ' + e.naam + '.';
    noteer(teks,'misdaad');
  } else {
    var af = tussen(EIE_VRA_NEE[0], EIE_VRA_NEE[1]);
    v.band = klem(v.band - af);
    teks = v.naam + ' het nee gesê' + (v.band < 40 ? ' en kyk jou nou skeef aan' : '') + '. (Band −' + af + ')';
    noteer('Jy het ' + v.naam + ' gevra om by ' + e.naam + ' aan te sluit. ' + v.naam + ' het nee gesê.','misdaad');
  }
  wysModaal('\u{1F451} ' + e.naam, teks + ' (' + k + '% kans)', [{t:'OK', doen:function(){ sluitModaal(); stoor(); renderAlles(); }}]);
}
function eieWerf(){
  var e = s.eieOrg; if(!e || s.tronk) return;
  if((s.gedoen.werf||0) >= EIE_WERF_PER_JAAR){ wenk('Jy het vanjaar genoeg op straat rondgevra.'); return; }
  if(eieVol()) return;
  s.gedoen.werf = (s.gedoen.werf||0) + 1;
  var k = eieWerfKans();
  if(kans(k)){
    var g = kans(75) ? 'm' : 'v';
    var l = eieNuweLid(kies(g==='m' ? MANSNAME : VROUENAME) + ' ' + kies(VANNE), null,
      tussen(0, 10 + Math.floor(eieOrgRep()/5)), tussen(40,75), g);
    e.lede.push(l);
    noteer(l.naam + ', ’n vreemdeling van die straat, werk nou vir ' + e.naam + ' (rep ' + l.rep + ').','misdaad');
    wenk(l.naam + ' is aan boord.');
  } else {
    s.hitte = klem((s.hitte||0) + 2);
    noteer('Jy het op straat rondgevra vir mense, maar niemand wil vir ' + e.naam + ' werk nie. Nog nie.','misdaad');
    wenk('Niemand wou nie (' + k + '% kans).');
  }
  stoor(); renderAlles();
}

/* ---------- Een lid ---------- */
function eieLidStatus(l){
  if(l.tronk) return 'in die tronk, ' + l.tronk + ' jaar oor';
  if(l.gewerk===s.ouderdom) return 'klaar gewerk vanjaar';
  return 'beskikbaar';
}
function eieLidMenu(id){
  var e = s.eieOrg, l = eieLid(id); if(!e || !l) return;
  var v = eiePersoon(l), o = [];
  if(!l.tronk && l.gewerk!==s.ouderdom && !s.tronk)
    o.push({t:'Gee ’n job', klas:'groen', sub:l.job ? 'Laas: ' + l.job.toLowerCase() : 'Die rep bepaal watter jobs oop is',
      doen:function(){ eieLidJobs(l); }});
  o.push({t:'Betaal ’n bonus', sub:geld(EIE_BONUS) + ' · lojaliteit +15' + (v ? ', band +8' : '') + (l.tronk ? ' (vir die familie)' : ''),
    doen:function(){ eieLidBonus(l); }});
  var volgende = EIE_LID_RANG_REP[l.rang + 1];
  if(volgende!==undefined)
    o.push({t:'Bevorder tot ' + EIE_LID_RANGE[l.rang + 1].toLowerCase(), klas:l.rep >= volgende ? '' : 'grys',
      sub:(l.rep >= volgende ? '' : 'Vra rep ' + volgende + ' · ') + 'loon ' + kortGeld(EIE_LOON[l.rang + 1]) +
        '/jaar · sukses +' + EIE_RANG_SUKSES + '%', doen:function(){ eieLidBevorder(l); }});
  o.push({t:'Laat ' + l.naam.split(' ')[0] + ' gaan', klas:'rooi', sub:v ? 'Band −10' : (l.geslag==='v' ? 'Sy' : 'Hy') + ' gaan ' + (l.geslag==='v' ? 'haar' : 'sy') + ' eie pad',
    doen:function(){ eieLidLos(l); }});
  o.push({t:'Sluit', klas:'grys', doen:sluitModaal});
  var jl = EIE_JOBS.filter(function(j){ return eieJobOop(l, j); }).length;
  wysModaal('\u{1F451} ' + l.naam, (v ? rol(v) + ' · band ' + v.band + '% · ' : 'Van die straat · ') +
    EIE_LID_RANGE[l.rang] + '\nRep ' + l.rep + ' / 100 · lojaal ' + l.lojaal + '% · ' + l.jare + ' jaar by ' + e.naam +
    '\n' + l.jobs + ' jobs gedoen, ' + geld(l.buit) + ' vir jou ingebring · loon ' + kortGeld(EIE_LOON[l.rang]) + '/jaar' +
    '\n' + jl + ' van ' + EIE_JOBS.length + ' jobs oop · ' + eieLidStatus(l), o);
}
function eieJobOop(l, j){ return j.lidRep <= l.rep && j.orgRep <= eieOrgRep(); }
function eieLidSukses(l, j){
  if(j.veilig) return 100;
  return klem(Math.round(85 - 10*j.moeilik + (l.rep - j.lidRep) - (s.hitte||0)/5 + l.rang*EIE_RANG_SUKSES), 10, 95);
}
function eieLidJobs(l){
  var hy = eieHy(l), sy = l.geslag==='v' ? 'haar' : 'sy';
  kiesLys('\u{1F451} ’n Job vir ' + l.naam.split(' ')[0], hy.charAt(0).toUpperCase() + hy.slice(1) + ' hou ' +
    Math.round(EIE_DEEL*100) + '% van die buit. Hoe hoër ' + sy + ' rep, hoe beter die jobs en hoe groter ' + sy + ' kans.', EIE_JOBS.map(function(j){
      var oop = eieJobOop(l, j);
      return {t:j.n, klas:oop ? '' : 'grys', sub:oop ? 'Buit ' + kortGeld(j.buit[0]) + ' tot ' + kortGeld(j.buit[1]) + ' · ' +
        (j.veilig ? 'geen risiko' : 'sukses ' + eieLidSukses(l, j) + '%') + ' · ' + sy + ' rep +' + j.repLid :
        'Toe: vra lid-rep ' + j.lidRep + (j.orgRep > eieOrgRep() ? ' en org-rep ' + j.orgRep : ''),
        doen:function(){
          if(!oop){ wenk(l.naam.split(' ')[0] + ' is nog nie gereed daarvoor nie.'); return; }
          var u = eieLidDoen(l, j);
          eieUitslag([u]); }};
    }), 'Terug', function(){ eieLidMenu(l.id); });
}
/* Een lid doen een job. Gee die uitslag terug sonder om iets te wys. */
function eieLidDoen(l, j){
  var e = s.eieOrg, v = eiePersoon(l), u = {l:l, j:j, myne:0};
  l.gewerk = s.ouderdom; l.job = j.n; l.jobs++;
  e.jobs++; s.misdaad.laas = s.ouderdom;
  if(!j.veilig) s.hitte = klem((s.hitte||0) + 1 + Math.floor(j.erns/2));
  if(kans(eieLidSukses(l, j))){
    var b = tussen(j.buit[0], j.buit[1]);
    u.myne = Math.round(b*(1-EIE_DEEL)); u.reg = true;
    l.rep = klem(l.rep + j.repLid); l.lojaal = klem(l.lojaal + 3); l.buit += u.myne;
    e.werkRep += j.rep; e.buit += u.myne;
    s.geld += u.myne; misdaadTel().buit += u.myne;
    if(v) v.band = klem(v.band + 2);
    if(!j.veilig) repBy(1);
    return u;
  }
  /* Misluk: die helfte van die tyd kom hy met leë hande weg, anders word
     hy gevang — en dan kan hy jou verklik. */
  l.rep = Math.max(0, l.rep - EIE_LID_REP_AF);
  e.werkRep = Math.max(0, e.werkRep - j.rep);
  s.hitte = klem((s.hitte||0) + 3);
  if(kans(EIE_GEVANG)){
    u.gevang = true;
    l.tronk = tussen(j.tronk[0], j.tronk[1]);
    l.lojaal = klem(l.lojaal - 5);
    if(v){ v.band = klem(v.band - 8); v.tronk = l.tronk; }
    if(kans((100 - eieTrou(l))/2)) u.verklik = true;
  } else l.lojaal = klem(l.lojaal - 5);
  return u;
}
function eieUitslagTeks(u){
  var n = u.l.naam.split(' ')[0], j = u.j.n.toLowerCase();
  if(u.reg) return n + ' het “' + j + '” gedoen: jou deel ' + geld(u.myne) + '.';
  if(!u.gevang) return n + ' het “' + j + '” probeer, maar met leë hande teruggekom.';
  if(u.verklik) return n + ' is gevang met “' + j + '” — en het die polisie alles vertel.';
  return n + ' is gevang met “' + j + '”' + (u.l.tronk ? ' en sit ' + u.l.tronk + ' jaar' : ', maar kom met ’n boete daarvan af') +
    '.' + (u.l.tronk ? ' ' + (u.l.geslag==='v' ? 'Sy' : 'Hy') + ' het jou nie verklik nie.' : '');
}
/* Wys die uitslag van een of meer lede se jobs; 'n verklikker stuur jou hof toe. */
function eieUitslag(lys){
  var e = s.eieOrg, teks = lys.map(eieUitslagTeks).join('\n'), verklik = null;
  lys.forEach(function(u){
    noteer(eieUitslagTeks(u), u.reg ? 'misdaad' : 'sleg');
    if(u.verklik && !verklik) verklik = u;
  });
  /* Wie jou verklik het, is klaar met jou organisasie. */
  lys.forEach(function(u){ if(u.verklik){
    e.lede = e.lede.filter(function(l){ return l!==u.l; });
    var v = eiePersoon(u.l); if(v) v.band = klem(v.band - 20); } });
  if(verklik){
    var j = verklik.j, erns = Math.min(5, j.erns + 1);
    wysModaal('\u{1F451} ' + e.naam, teks + '\n\n' + verklik.l.naam + ' het jou verklik. Die polisie kom vir jou.', [
      {t:'OK', doen:function(){ misdaadTel().gevang++; s.hitte = klem(s.hitte + HITTE_GEVANG);
        hofSaak({n:'bendebedrywighede (' + j.n.toLowerCase() + ')', erns:erns, wapen:false,
          jare:ERNS_JARE[erns], verklik:true}); }}]);
    return;
  }
  stoor(); renderAlles();
  wysModaal('\u{1F451} ' + e.naam, teks, [{t:'OK', doen:function(){ sluitModaal(); stoor(); renderAlles(); }}]);
}
/* Elke lid wat nog vry is, doen sy laaste job weer (of die beste veilige job). */
function eieStuurAlmal(){
  var e = s.eieOrg; if(!e || s.tronk) return;
  var vry = e.lede.filter(function(l){ return !l.tronk && l.gewerk!==s.ouderdom; });
  if(!vry.length){ wenk('Almal het vanjaar klaar gewerk (of sit).'); return; }
  wysModaal('\u{1F451} Stuur almal', vry.length + (vry.length===1 ? ' lid' : ' lede') + ' doen weer hul laaste job ' +
    '(wie nog nie een gehad het nie, spot teikens).\n\n' + vry.map(function(l){
      var j = eieLaasteJob(l);
      return l.naam.split(' ')[0] + ': ' + j.n.toLowerCase() + (j.veilig ? '' : ' (' + eieLidSukses(l, j) + '%)'); }).join('\n'), [
    {t:'Stuur hulle', klas:'groen', doen:function(){
      eieUitslag(vry.map(function(l){ return eieLidDoen(l, eieLaasteJob(l)); })); }},
    {t:'Los dit', klas:'grys', doen:sluitModaal}
  ]);
}
function eieLaasteJob(l){
  var j = null;
  EIE_JOBS.forEach(function(x){ if(x.n===l.job && eieJobOop(l, x)) j = x; });
  return j || EIE_JOBS[0];
}
function eieLidBonus(l){
  if(s.geld < EIE_BONUS){ wenk('Jy het nie ' + geld(EIE_BONUS) + ' nie.'); return; }
  s.geld -= EIE_BONUS; misdaadTel().koste += EIE_BONUS;
  l.lojaal = klem(l.lojaal + 15);
  var v = eiePersoon(l); if(v) v.band = klem(v.band + 8);
  noteer('Jy het ' + l.naam + ' ’n bonus van ' + geld(EIE_BONUS) + ' gegee.','misdaad');
  wenk('Lojaliteit nou ' + l.lojaal + '%.');
  stoor(); renderAlles(); eieLidMenu(l.id);
}
function eieLidBevorder(l){
  var volgende = EIE_LID_RANG_REP[l.rang + 1];
  if(volgende===undefined) return;
  if(l.rep < volgende){ wenk(l.naam.split(' ')[0] + ' het rep ' + volgende + ' nodig.'); return; }
  l.rang++; l.lojaal = klem(l.lojaal + 15);
  var v = eiePersoon(l); if(v) v.band = klem(v.band + 5);
  noteer('Jy het ' + l.naam + ' bevorder tot ' + EIE_LID_RANGE[l.rang].toLowerCase() + ' in ' + s.eieOrg.naam + '.','misdaad');
  stoor(); renderAlles(); eieLidMenu(l.id);
}
function eieLidLos(l){
  var e = s.eieOrg, v = eiePersoon(l);
  e.lede = e.lede.filter(function(x){ return x!==l; });
  if(v) v.band = klem(v.band - 10);
  noteer('Jy het ' + l.naam + ' uit ' + e.naam + ' laat gaan.','misdaad');
  sluitModaal(); stoor(); renderAlles();
}
function eieOntbind(){
  var e = s.eieOrg; if(!e) return;
  wysModaal('\u{1F451} Ontbind ' + e.naam + '?', 'Jou mense gaan hul eie pad. Jou rep bly.', [
    {t:'Ontbind', klas:'rooi', doen:function(){ noteer('Jy het ' + e.naam + ' ontbind.','misdaad');
      s.eieOrg = null; sluitModaal(); stoor(); renderAlles(); }},
    {t:'Hou aan', klas:'grys', doen:sluitModaal}
  ]);
}

/* ---------- Die jaar ---------- */
function onderwereldJaar(){
  /* Rep: tronkjare bou dit, en twee stil jare breek dit af. */
  if(s.tronk) repBy(REP_TRONKJAAR);
  else if((s.straatRep||0) > 0 && s.ouderdom - (s.misdaad.laas||0) >= REP_STIL_JARE)
    s.straatRep = Math.max(0, s.straatRep - Math.max(1, Math.round(s.straatRep*REP_STIL_VERVAL)));
  /* 'n Luitenant kry elke jaar sy deel van die organisasie se wins. */
  var o = myOrg();
  if(o && s.bende.rang >= 3 && !s.tronk){
    var d = Math.round(o.deel*(0.7 + Math.random()*0.6));
    s.geld += d; misdaadTel().buit += d;
    noteer(o.n + ' het jou ' + geld(d) + ' as jou deel van die jaar se wins gegee.','misdaad');
  }
  /* Mense wat jy ken en wat vir jou organisasie gesit het. */
  s.verhoudings.forEach(function(v){
    if(v.tronk){ v.tronk--; if(!v.tronk && v.lewe && !eieLidVan(v)) noteer(v.naam + ' is uit die tronk.','neutraal'); }
  });
  var e = s.eieOrg; if(!e) return;
  e.werkRep = Math.round(e.werkRep*(1 - EIE_WERKREP_VERVAL));
  var weg = [];
  e.lede.forEach(function(l){
    var v = eiePersoon(l);
    if(l.pid!==null && (!v || !v.lewe)){
      weg.push(l); noteer(l.naam + ' is oorlede. ' + e.naam + ' het een minder.','sleg'); return; }
    l.jare++;
    if(l.tronk){
      l.tronk--; l.lojaal = klem(l.lojaal - 3);
      if(v) v.tronk = l.tronk;
      if(!l.tronk) noteer(l.naam + ' is uit die tronk en terug by ' + e.naam + '.','misdaad');
    } else {
      var loon = EIE_LOON[l.rang];
      if(!s.tronk && s.geld >= loon){ s.geld -= loon; misdaadTel().koste += loon; }
      else { l.lojaal = klem(l.lojaal - 25); if(v) v.band = klem(v.band - 8); }
    }
    if(s.tronk) l.lojaal = klem(l.lojaal - 10);
    if(l.lojaal < 15){
      weg.push(l); if(v) v.band = klem(v.band - 10);
      noteer(l.naam + ' het ' + e.naam + ' verlaat: geen loon, geen lojaliteit.','sleg');
    }
  });
  e.lede = e.lede.filter(function(l){ return weg.indexOf(l) < 0; });
}

/* ---------- Die blad ---------- */
function renderOnderwereld(){
  var r = s.straatRep||0, h = '<div class="klein md-groep">Die onderwêreld</div>';
  h += '<div class="kaart"><div class="ry"><div class="emo">\u{1F576}</div><div class="groei">'+
    '<div class="hoof">Rep: ' + r + ' / 100 · ' + repNaam(r) + '</div>'+
    '<div class="balk"><div style="width:' + r + '%;background:var(--pers)"></div></div>'+
    '<div class="klein">Elke misdaad of job wat slaag bou dit; twee stil jare breek dit af.</div></div></div></div>';
  var o = myOrg();
  if(s.eieOrg){
    var e = s.eieOrg, er = eieOrgRep(), vry = e.lede.filter(function(l){ return !l.tronk && l.gewerk!==s.ouderdom; }).length;
    var werfOor = EIE_WERF_PER_JAAR - (s.gedoen.werf||0);
    h += '<div class="kaart"><div class="ry"><div class="emo">\u{1F451}</div><div class="groei">'+
      '<div class="hoof">' + veilig(e.naam) + '</div>'+
      '<div class="klein">Rep ' + er + ' · ' + e.lede.length + ' van ' + eieMaksLede() + ' mense · altesaam ' +
        kortGeld(e.buit) + ' verdien</div>'+
      '<div class="balk"><div style="width:' + er + '%;background:var(--geel)"></div></div></div></div>'+
      '<div class="ms-ry"><button class="knop groen" onclick="eieVraLys()">Vra iemand wat jy ken<small>die band bepaal die kans</small></button>'+
      '<button class="knop grys" onclick="eieWerf()">Werf ’n vreemdeling<small>' + eieWerfKans() + '% · ' +
        werfOor + (werfOor===1 ? ' poging' : ' pogings') + ' oor</small></button></div>'+
      (e.lede.length ? '<div class="ms-ry"><button class="knop grys" onclick="eieStuurAlmal()">Stuur almal<small>' +
        (vry ? vry + ' vry vir ’n job' : 'almal klaar vanjaar') + '</small></button>'+
        '<button class="knop grys" onclick="eieOntbind()">Ontbind<small>jou rep bly</small></button></div>' :
        '<button class="knop grys klein2" onclick="eieOntbind()">Ontbind</button>') + '</div>';
    e.lede.forEach(function(l){
      var v = eiePersoon(l);
      h += '<div class="kaart klik" onclick="eieLidMenu(' + l.id + ')"><div class="ry">'+
        '<div class="emo">' + (l.tronk ? '\u{1F512}' : v ? '\u{1F91D}' : '\u{1F464}') + '</div><div class="groei">'+
        '<div class="hoof">' + veilig(l.naam) + ' · ' + EIE_LID_RANGE[l.rang] + '</div>'+
        '<div class="klein">' + (v ? rol(v) + ' · ' : '') + 'rep ' + l.rep + ' · lojaal ' + l.lojaal + '% · ' + eieLidStatus(l) + '</div>'+
        '<div class="balk"><div style="width:' + l.rep + '%;background:var(--pers)"></div></div></div>'+
        '<div class="regs">❯</div></div></div>';
    });
  } else if(o){
    var b = s.bende, volgende = ORG_RANG_PUNTE[b.rang+1];
    h += '<div class="kaart"><div class="ry"><div class="emo">' + o.e + '</div><div class="groei">'+
      '<div class="hoof">' + o.n + ' · ' + o.range[b.rang] + '</div>'+
      '<div class="klein">' + b.jobs + ' jobs gedoen' + (volgende!==undefined ? ' · ' + b.punte + ' / ' + volgende +
        ' punte tot ' + o.range[b.rang+1].toLowerCase() : ' · die hoogste rang: jy kry elke jaar ’n deel') + '</div></div></div>'+
      '<div class="ms-ry"><button class="knop groen" onclick="orgJobs()">Vra vir ’n job<small>' +
        (ORG_JOBS_PER_JAAR - (s.gedoen.orgJob||0)) + ' oor vanjaar</small></button>'+
      '<button class="knop grys" onclick="verlaatOrg()">Verlaat<small>jy verloor jou rang</small></button></div></div>';
  }
  if(!s.eieOrg){
    ORGANISASIES.forEach(function(x){
      if(o && x.id===o.id) return;
      var slot = orgSlot(x);
      h += '<div class="kaart klik' + (slot ? ' af' : '') + '" onclick="sluitAan(\'' + x.id + '\')"><div class="ry">'+
        '<div class="emo">' + x.e + '</div><div class="groei"><div class="hoof">' + x.n + '</div>'+
        '<div class="klein">' + (slot ? 'Toe: ' + slot : x.sub + ' · sluit aan') + '</div></div>'+
        '<div class="regs">❯</div></div></div>';
    });
    if(r >= EIE_ORG_REP - 15)
      h += '<div class="kaart klik' + (r < EIE_ORG_REP || s.ouderdom < EIE_ORG_OUDERDOM ? ' af' : '') +
        '" onclick="beginEieOrg()"><div class="ry"><div class="emo">\u{1F451}</div><div class="groei">'+
        '<div class="hoof">Begin jou eie organisasie</div><div class="klein">Rep ' + EIE_ORG_REP + '+, ' + EIE_ORG_OUDERDOM +
        '+, ' + geld(EIE_ORG_KOSTE) + ' · begin by vriende en familie wat jou vertrou</div></div><div class="regs">❯</div></div></div>';
  }
  return h;
}
