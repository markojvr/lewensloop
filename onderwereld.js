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
        (j.veilig ? 'geen risiko' : 'risiko ' + j.risiko + '%') +
        ' · rep +' + (REP_PER_ERNS[j.erns] + j.rep), doen:function(){ orgJob(o, j); }};
    }));
}
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
    misdaadBetaal({m:m, t:t, job:j, org:o}, tussen(j.betaal[0], j.betaal[1]), '');
    return;
  }
  misdaadVoertuig({m:m, t:t, job:j, org:o});
}
/* Die misdaadvloei roep dit as die job slaag of misluk. */
function orgJobSlaag(c){
  if(!s.bende || s.bende.id !== c.org.id) return;
  s.bende.jobs++;
  repBy(c.job.rep);
  orgPunte(ORG_PUNTE_SLAAG + c.job.rang);
}
function orgJobMisluk(c){
  if(!s.bende || s.bende.id !== c.org.id) return;
  orgPunte(-1);
}
function orgPunte(n){
  var b = s.bende, o = myOrg(), voor = b.rang;
  b.punte = Math.max(0, b.punte + n);
  b.rang = Math.max(voor, rangVir(b.punte));    /* 'n rang val nie terug nie */
  if(b.rang > voor) noteer('Jy is bevorder: jy is nou ' + o.range[b.rang].toLowerCase() + ' in ' + o.n + '.','misdaad');
}

/* ==========================================================================
   JOU EIE ORGANISASIE
   s.eieOrg = {naam, werkRep, lede:[{naam, vlak 1-5, lojaal 0-100, jare}],
   gestig, jobs, buit}. Sy rep = EIE_ORG_UIT_JOU_REP van jou rep plus
   werkRep. Twee keer per jaar kan jy probeer werf; een keer per jaar
   stuur jy jou mense op 'n job. Elkeen wil 'n loon hê.
   ========================================================================== */
function eieOrgRep(){
  var e = s.eieOrg; if(!e) return 0;
  return klem(Math.round((s.straatRep||0)*EIE_ORG_UIT_JOU_REP + e.werkRep));
}
function eieMaksLede(){ return EIE_LEDE_BASIS + Math.floor(eieOrgRep()/20); }
function eieWerfKans(){ return klem(EIE_WERF_BASIS + eieOrgRep()*EIE_WERF_PER_REP, 5, 85); }

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
  noteer('Jy het ' + naam + ' gestig. Nou moet jy net mense kry.','misdaad');
  sluitModaal(); stoor(); renderAlles();
}
function eieWerf(){
  var e = s.eieOrg; if(!e || s.tronk) return;
  if((s.gedoen.werf||0) >= EIE_WERF_PER_JAAR){ wenk('Jy het vanjaar genoeg rondgevra.'); return; }
  if(e.lede.length >= eieMaksLede()){ wenk('Meer mense as dit kan jy nie dophou nie (rep bepaal hoeveel).'); return; }
  s.gedoen.werf = (s.gedoen.werf||0) + 1;
  var k = eieWerfKans();
  if(kans(k)){
    var vlak = 1 + R(1 + Math.floor(eieOrgRep()/30));
    var lid = {naam:kies(kans(75) ? MANSNAME : VROUENAME) + ' ' + kies(VANNE), vlak:Math.min(5, vlak),
      lojaal:tussen(40,75), jare:0};
    e.lede.push(lid);
    noteer(lid.naam + ' werk nou vir ' + e.naam + ' (vlak ' + lid.vlak + ').','misdaad');
    wenk(lid.naam + ' is aan boord.');
  } else {
    s.hitte = klem((s.hitte||0) + 2);
    noteer('Jy het rondgevra vir mense, maar niemand wil vir ' + e.naam + ' werk nie. Nog nie.','misdaad');
    wenk('Niemand wou nie (' + k + '% kans).');
  }
  stoor(); renderAlles();
}
function eieJobs(){
  var e = s.eieOrg; if(!e || s.tronk) return;
  if(!e.lede.length){ wenk('Jy het nog niemand om te stuur nie.'); return; }
  if(s.gedoen.eieJob){ wenk('Jou mense het vanjaar klaar gewerk.'); return; }
  var r = eieOrgRep();
  kiesLys('\u{1F451} Stuur jou mense', 'Al ' + e.lede.length + ' van jou mense doen dieselfde job. Hulle hou ' +
    Math.round(EIE_DEEL*100) + '% van die buit.', EIE_JOBS.filter(function(j){ return j.orgRep <= r; }).map(function(j){
      return {t:j.n, sub:'Buit ' + kortGeld(j.buit[0]) + ' tot ' + kortGeld(j.buit[1]) + ' elk · sukses sowat ' +
        eieSukses(j, 2) + '% vir vlak 2', doen:function(){ eieStuur(j); }};
    }));
}
function eieSukses(j, vlak){ return klem(88 - 14*j.moeilik + 10*vlak - Math.round((s.hitte||0)/4), 8, 95); }
function eieStuur(j){
  var e = s.eieOrg, myne = 0, reg = 0, sleg = 0, verklik = null, gevang = [];
  s.gedoen.eieJob = 1;
  e.lede.forEach(function(l){
    if(kans(eieSukses(j, l.vlak))){
      var b = tussen(j.buit[0], j.buit[1]), deel = Math.round(b*(1-EIE_DEEL));
      myne += deel; reg++; e.werkRep += j.rep;
      l.lojaal = klem(l.lojaal + 5);
      if(l.vlak < 5 && kans(30)) l.vlak++;
    } else {
      /* 'n Job wat misluk: die helfte van die tyd kom hy met leë hande
         weg, anders word hy gevang — en dan kan hy jou verklik. */
      sleg++; e.werkRep = Math.max(0, e.werkRep - j.rep);
      if(kans(EIE_GEVANG)){
        gevang.push(l);
        if(!verklik && kans((100 - l.lojaal)/2)) verklik = l;
      } else l.lojaal = klem(l.lojaal - 5);
    }
  });
  e.lede = e.lede.filter(function(l){ return gevang.indexOf(l) < 0; });
  e.jobs++; e.buit += myne;
  s.geld += myne; misdaadTel().buit += myne;
  s.hitte = klem((s.hitte||0) + 2 + j.erns*e.lede.length/2 + sleg*3);
  if(reg) repBy(reg);
  s.misdaad.laas = s.ouderdom;
  var teks = 'Jou mense het “' + j.n.toLowerCase() + '” gedoen: ' + reg + ' het geslaag' +
    (sleg - gevang.length ? ', ' + (sleg - gevang.length) + ' het met leë hande teruggekom' : '') +
    (gevang.length ? ', ' + gevang.length + ' is gevang (' + gevang.map(function(l){ return l.naam; }).join(', ') + ')' : '') +
    '. Jou deel: ' + geld(myne) + '.';
  noteer(teks, myne ? 'misdaad' : 'sleg');
  if(verklik){
    noteer(verklik.naam + ' het die polisie alles van ' + e.naam + ' vertel.','sleg');
    wysModaal('\u{1F451} ' + e.naam, teks + '\n\n' + verklik.naam + ' het jou verklik. Die polisie kom vir jou.', [
      {t:'OK', doen:function(){ misdaadTel().gevang++; s.hitte = klem(s.hitte + HITTE_GEVANG);
        hofSaak({n:'bendebedrywighede (' + j.n.toLowerCase() + ')', erns:Math.min(5, j.erns + 1), wapen:false,
          jare:ERNS_JARE[Math.min(5, j.erns + 1)], verklik:true}); }}]);
    return;
  }
  stoor(); renderAlles();
  wysModaal('\u{1F451} ' + e.naam, teks, [{t:'OK', doen:function(){ sluitModaal(); stoor(); renderAlles(); }}]);
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
  var e = s.eieOrg; if(!e) return;
  e.werkRep = Math.round(e.werkRep*(1 - EIE_WERKREP_VERVAL));
  var weg = [];
  e.lede.forEach(function(l){
    l.jare++;
    var loon = EIE_LOON*l.vlak;
    if(!s.tronk && s.geld >= loon){ s.geld -= loon; misdaadTel().koste += loon; }
    else l.lojaal = klem(l.lojaal - 25);
    if(s.tronk) l.lojaal = klem(l.lojaal - 10);
    if(l.lojaal < 15) weg.push(l);
  });
  weg.forEach(function(l){ noteer(l.naam + ' het ' + e.naam + ' verlaat: geen loon, geen lojaliteit.','sleg'); });
  e.lede = e.lede.filter(function(l){ return weg.indexOf(l) < 0; });
}

/* ---------- Die blad ---------- */
function renderOnderwereld(){
  var r = s.straatRep||0, h = '<div class="klein md-groep">Die onderwêreld</div>';
  h += '<div class="kaart"><div class="ry"><div class="emo">\u{1F576}</div><div class="groei">'+
    '<div class="hoof">Rep: ' + r + ' / 100 · ' + repNaam(r) + '</div>'+
    '<div class="balk"><div style="width:' + r + '%;background:var(--pers)"></div></div>'+
    '<div class="klein">Elke misdaad wat slaag bou dit; twee stil jare breek dit af.</div></div></div></div>';
  var o = myOrg();
  if(s.eieOrg){
    var e = s.eieOrg, er = eieOrgRep();
    h += '<div class="kaart"><div class="ry"><div class="emo">\u{1F451}</div><div class="groei">'+
      '<div class="hoof">' + veilig(e.naam) + '</div>'+
      '<div class="klein">Rep ' + er + ' · ' + e.lede.length + ' van ' + eieMaksLede() + ' mense · werfkans ' +
        eieWerfKans() + '% · altesaam ' + kortGeld(e.buit) + ' verdien</div>'+
      '<div class="balk"><div style="width:' + er + '%;background:var(--geel)"></div></div></div></div>'+
      (e.lede.length ? '<div class="klein" style="margin-top:6px">' + e.lede.map(function(l){
        return veilig(l.naam) + ' (vlak ' + l.vlak + ', lojaal ' + l.lojaal + '%)'; }).join(' · ') + '</div>' : '') +
      '<div class="ms-ry"><button class="knop grys" onclick="eieWerf()">Werf iemand<small>' +
        (EIE_WERF_PER_JAAR - (s.gedoen.werf||0)) + (EIE_WERF_PER_JAAR - (s.gedoen.werf||0)===1 ? ' poging' : ' pogings') +
        ' oor</small></button>'+
      '<button class="knop grys" onclick="eieJobs()">Stuur jou mense<small>' + (s.gedoen.eieJob ? 'klaar vanjaar' : 'een keer per jaar') +
        '</small></button></div>'+
      '<button class="knop grys klein2" onclick="eieOntbind()">Ontbind</button></div>';
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
        '+, ' + geld(EIE_ORG_KOSTE) + ' · die moeilikste is om mense te kry</div></div><div class="regs">❯</div></div></div>';
  }
  return h;
}
