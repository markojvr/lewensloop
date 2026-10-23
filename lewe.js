/* ==========================================================================
   4-6. DIE LEWE SELF
   Die speler se status (s), stoor en laai, en die jaarmasjien:
   wordOuer() is die hart van die spel — alles wat elke jaar gebeur,
   gebeur hier: skool, werk, geld, verhoudings, gebeure, dood.
   ========================================================================== */

/* ---------- 4. Status ---------- */
var SLEUTEL='lewensloop-v2', GESKIEDENIS='lewensloop-geskiedenis';
var s=null, wagry=[], volgendeId=1;

function nuweMens(geslag, ouderdom, van){
  var g = geslag || kies(['m','v']);
  return { id: volgendeId++, naam: kies(g==='m'?MANSNAME:VROUENAME),
    van: van || kies(VANNE), geslag:g, ouderdom: ouderdom, band: tussen(55,95),
    voorkoms: tussen(20,95), lewe:true, tipe:'vriend', raak:0 };
}

function nuweLewe(naam, van, geslag){
  var g = (geslag==='m'||geslag==='v') ? geslag : kies(['m','v']);
  var ryk = kies(RYKDOM);
  s = {
    naam: naam || kies(g==='m'?MANSNAME:VROUENAME),
    van:  van  || kies(VANNE),
    geslag:g, dorp:kies(DORPE), ouderdom:0, lewe:true, oorsaak:null,
    geluk:tussen(55,95), gesondheid:tussen(70,100), slim:tussen(20,85), voorkoms:tussen(20,92),
    geld:0, spaar:0, totaalVerdien:0, belegging:0,
    rykdom:ryk.n, rykf:ryk.f,
    blyplek:'ouers', huurPlek:'kommune', bond:null, swartlys:0,
    beroep:null, beroepeGehad:[], jareGewerk:0, aansoeke:0,
    pensioen:0, pensioenFonds:0, pensioenKoers:0.075, afgetree:false,
    skool:{vlak:'baba', graad:0, studie:null, jareOor:0, punte:0, matriek:false, grade:[], nagraads:[],
      uit:false, agter:0},
    laerskool:null, hoerskool:null, uni:null, aansien:0, diere:[], lisensie:false,
    verhoudings:[], bates:[], log:[], rekord:[], tronk:null, tronkJare:0,
    dakloos:null, dakloosJare:0,
    kinders:0, kindersGebore:0, troues:0, gedoen:{}, vlagge:{}, tab:'lewe'
  };
  /* Familie */
  var maVan = s.van, ma = nuweMens('v', tussen(19,41), maVan); ma.tipe='ma'; ma.band=tussen(70,100);
  s.verhoudings.push(ma);
  if(kans(84)){ var pa = nuweMens('m', tussen(20,47), s.van); pa.tipe='pa'; pa.band=tussen(60,100);
    s.verhoudings.push(pa);
  } else { s.vlagge.geenPa=1; }
  var broers = kans(62) ? tussen(1,3) : 0;
  for(var i=0;i<broers;i++){
    var b = nuweMens(null, tussen(1,13), s.van);
    b.tipe = b.geslag==='m' ? 'broer' : 'suster';
    b.band = tussen(40,95);
    s.verhoudings.push(b);
  }
  noteer('Jy is in ' + s.dorp + ' gebore in ’n ' + ryk.n + ' gesin.','goed');
  noteer('Jou naam is ' + s.naam + ' ' + s.van + '.','neutraal');
  if(s.vlagge.geenPa) noteer('Jou pa was nie in die prentjie nie.','sleg');
  stoor();
}

function noteer(teks, soort){ s.log.push({o:s.ouderdom, t:teks, k:soort||'neutraal'}); }
function eduVlak(){
  if(s.skool.nagraads.length) return 3;
  if(s.skool.grade.length) return 2;
  if(s.skool.matriek) return 1;
  return 0;
}
function rol(v){
  var m={ma:'Ma', pa:'Pa', broer:'Broer', suster:'Suster',
    lief: v.geslag==='m'?'Kerel':'Meisie', eggenoot: v.geslag==='m'?'Man':'Vrou',
    seun:'Seun', dogter:'Dogter', vriend: v.geslag==='m'?'Vriend':'Vriendin',
    klasmaat:'Klasmaat', kollega:'Kollega', baas:'Jou baas'};
  return m[v.tipe] || 'Vriend';
}
function emoVan(v){
  var m={ma:'\u{1F469}', pa:'\u{1F468}', broer:'\u{1F466}', suster:'\u{1F467}',
    lief:'\u{1F495}', eggenoot:'\u{1F48D}', seun:'\u{1F9D2}', dogter:'\u{1F9D2}',
    klasmaat:'\u{1F392}', kollega:'\u{1F454}', baas:'\u{1F9D1}'};
  return m[v.tipe] || (v.geslag==='m'?'\u{1F9D1}':'\u{1F469}');
}
function maat(){ return s.verhoudings.filter(function(v){
  return v.lewe && (v.tipe==='lief'||v.tipe==='eggenoot'); })[0]; }

/* ---------- 5. Stoor en laai ---------- */
function stoor(){ try{ localStorage.setItem(SLEUTEL, JSON.stringify({s:s, id:volgendeId})); }catch(e){} }
function laai(){
  try{ var r = localStorage.getItem(SLEUTEL); if(!r) return false;
    var d = JSON.parse(r); if(!d || !d.s) return false;
    s = d.s; volgendeId = d.id || 500; vulNuweVelde(); return true;
  }catch(e){ return false; }
}
/* 'n Lewe wat voor Fase 2 gestoor is, weet niks van spaargeld, huur,
   verbande of 'n pensioenfonds nie. Hier gee ons daardie velde hul
   verstekwaardes, sodat 'n ou lewe steeds laai en verder speel. */
function vulNuweVelde(){
  if(s.spaar===undefined) s.spaar = 0;
  if(s.swartlys===undefined) s.swartlys = 0;
  if(s.bond===undefined) s.bond = null;
  if(s.dakloos===undefined) s.dakloos = null;          /* B18 */
  if(s.dakloosJare===undefined) s.dakloosJare = 0;
  if(s.pensioenFonds===undefined) s.pensioenFonds = 0;
  if(s.pensioenKoers===undefined) s.pensioenKoers = 0.075;
  if(s.afgetree===undefined) s.afgetree = !!s.pensioen;
  /* Was jy al op pensioen, bou ons agteruit 'n fonds wat daardie
     inkomste kan dra, anders sou jou pensioen sommer verdwyn. */
  if(s.afgetree && s.pensioen>0 && !s.pensioenFonds)
    s.pensioenFonds = Math.round(s.pensioen / ANNUITEIT_TREK);
  if(!s.huurPlek) s.huurPlek = 'kommune';
  if(!s.blyplek)
    s.blyplek = s.bates.some(function(b){ return b.t==='huis'; }) ? 'eie'
      : (s.ouderdom<18 || lewendeOuers().length) ? 'ouers' : 'huur';
}
function geskiedenisBy(){
  try{
    var lys = JSON.parse(localStorage.getItem(GESKIEDENIS)||'[]');
    lys.unshift({naam:s.naam+' '+s.van, ouderdom:s.ouderdom, oorsaak:s.oorsaak,
      geld:netoWaarde(), beroep: s.beroepeGehad.length? s.beroepeGehad[s.beroepeGehad.length-1] : 'geen'});
    localStorage.setItem(GESKIEDENIS, JSON.stringify(lys.slice(0,6)));
  }catch(e){}
}
/* Alles wat jy besit, min alles wat jy skuld: kontant, spaargeld,
   beleggings, jou pensioenfonds en jou bates, min die verband. */
function netoWaarde(){
  var t = s.geld + (s.spaar||0) + s.belegging + (s.pensioenFonds||0) - bondSkuld();
  s.bates.forEach(function(b){ t += b.waarde; });
  return t;
}

/* ==========================================================================
   6. DIE JAARMASJIEN
   ========================================================================== */
function wordOuer(){
  if(!s || !s.lewe) return;
  if(el('modaal').classList.contains('wys')) return;
  s.ouderdom++;
  s.gedoen = {}; s.aansoeke = 0;
  noteer('Jy is nou ' + s.ouderdom + ' jaar oud.','jaar');
  ouderdomDrywing();
  lisensieJaar();
  tronkJaar();
  dakloosJaar();
  skoolJaar();
  beroepJaar();
  aftreeJaar();
  finansiesJaar();
  verhoudingsJaar();
  lukrakeGebeure();
  s.tab = 'lewe';
  speelWagry(eindeJaar);
}

function eindeJaar(){
  doodKontrole();
  if(!s.lewe){ wysGrafskrif(); return; }
  stoor(); renderAlles(); naOnder();
}

function ouderdomDrywing(){
  var o = s.ouderdom, d;
  if(o<=12)      d = tussen(-1,2);
  else if(o<=25) d = tussen(-1,1);
  else if(o<=40) d = -tussen(0,1);
  else if(o<=55) d = -tussen(0,2);
  else if(o<=70) d = -tussen(1,3);
  else           d = -tussen(2,5);
  s.gesondheid = klem(s.gesondheid + d);
  if(o>=28) s.voorkoms = klem(s.voorkoms - tussen(0, o>=58?3:1));
  if(o>=5 && s.geluk>32) s.geluk = klem(s.geluk - tussen(0,2));
  if(s.tronk) s.geluk = klem(s.geluk - tussen(5,14));
}

/* ---------- Rylisensie ---------- */
/* A16 — in SA kry jy jou leerlinglisensie op 17 en jou rylisensie op 18.
   Vir nou is dit net 'n ouderdomsvereiste om 'n motor te besit en te
   bestuur; die volle motorstelsel (toetse, versekering, licence disc)
   is item H9 vir later. */
function magBestuur(){ return s.ouderdom>=18; }
function lisensieJaar(){
  if(s.lisensie || s.ouderdom<18) return;
  s.lisensie = true;
  noteer('Jy het jou rylisensie by die verkeersdepartement gekry.','goed');
}

/* ---------- Skool ---------- */
/* Watter skooljaar behoort jy vanjaar te wees? Normaalweg is dit net jou
   ouderdom min 5 (6 jaar oud = Graad 1), maar elke jaar wat jy in die
   tronk verloor het, skuif dit terug sodat jy ná vrylating inhaal
   eerder as om vir ewig in dieselfde graad vas te steek. */
function skoolGraad(){ return s.ouderdom - 5 - (s.skool.agter||0); }

/* 'n Jaar wat jy nie op skool was nie — in die tronk of op straat.
   Jy val een jaar agter en haal later in waar jy opgehou het. */
function skoolJaarVerloor(waar){
  var sk = s.skool;
  if(sk.uit || ['laerskool','hoerskool','kleuterskool'].indexOf(sk.vlak)<0) return;
  sk.agter = (sk.agter||0) + 1;
  noteer('Jy het die skooljaar ' + waar + ' verloor. Jy is nou ' + sk.agter +
    ' jaar agter met skool.','skool');
}

function skoolJaar(){
  var o = s.ouderdom, sk = s.skool;
  if(s.tronk){ skoolJaarVerloor('in die tronk'); return; }
  /* B18 — op straat is skool en studie toe, net soos in die tronk. */
  if(s.dakloos){ skoolJaarVerloor('op straat'); return; }

  if(sk.vlak==='universiteit' || sk.vlak==='nagraads'){
    var koste = sk.koste || 0;
    if(!sk.beurs && koste>0){
      s.geld -= koste;
      noteer('Jy het ' + geld(koste) + ' klasgeld betaal.','geld');
    }
    sk.jareOor--;
    s.slim = klem(s.slim + tussen(2,6));
    if(sk.jareOor>0){
      noteer('Jy studeer ' + sk.studie + ' by ' + (s.uni?s.uni.n:'die universiteit') +
        ' (' + sk.jareOor + ' jaar oor).','skool');
      klasGebeurtenis();
    } else {
      if(sk.vlak==='universiteit'){ sk.grade.push(sk.studie);
        noteer('Jy het gegradueer met \u2019n graad in ' + sk.studie + '!','goed');
      } else { sk.nagraads.push(sk.studie);
        noteer('Jy het ' + sk.studie + ' voltooi. Nou is jy regtig gekwalifiseer.','goed'); }
      s.geluk = klem(s.geluk + 14);
      sk.vlak='klaar'; sk.studie=null; sk.koste=0; sk.beurs=false;
      sluitGroep('klasmaat','na jou studies');
    }
    return;
  }
  if(sk.uit || sk.vlak==='klaar') return;

  /* g is die graad waarin jy vanjaar hoort — sien skoolGraad(). */
  var g = skoolGraad();
  /* Jy haal in deur weer skool te gaan, nie deur grade oor te slaan nie.
     Dit vang ook ou stoor-data op wat voorheen vasgesteek het. */
  if(sk.graad && g > sk.graad+1){ sk.agter = o - 5 - (sk.graad+1); g = skoolGraad(); }
  if(g<1){ if(o===3){ sk.vlak='kleuterskool';
      noteer('Jy het kleuterskool begin. Jy het vinnig vriende gemaak.','skool'); }
    return; }
  if(g===1 && sk.vlak!=='laerskool'){ kiesLaerskool(); return; }
  if(g>=2 && g<=7 && sk.vlak==='laerskool'){
    sk.graad = g; skoolBonus(s.laerskool);
    noteer('Jy is in Graad ' + sk.graad + ' by ' + (s.laerskool?s.laerskool.n:'die skool') + '.','skool');
    klasGebeurtenis(); return;
  }
  if(g===8 && sk.vlak==='laerskool'){ sluitGroep('klasmaat','na laerskool'); kiesHoerskool(); return; }
  if(g>=9 && g<=12 && sk.vlak==='hoerskool'){
    sk.graad = g; skoolBonus(s.hoerskool);
    noteer('Jy is in Graad ' + sk.graad + ' by ' + (s.hoerskool?s.hoerskool.n:'die skool') +
      (o > g+6 ? ', en jy is die oudste in die klas' : '') + '.','skool');
    klasGebeurtenis(); return;
  }
  if(g>=13 && sk.vlak==='hoerskool'){
    var bonus = s.hoerskool ? (s.hoerskool.slim||0)*2 : 0;
    var punt = klem(Math.round(s.slim*0.72 + tussen(8,26) + bonus));
    sk.punte = punt; sk.vlak='klaar';
    if(punt>=40){ sk.matriek=true; s.geluk=klem(s.geluk+12);
      noteer('Jy het matriek geslaag met \u2019n gemiddeld van ' + punt + '%!','goed');
      if(punt>=80) noteer('Jy het die graad met onderskeiding deurgekom.','goed');
    } else { s.geluk=klem(s.geluk-16);
      noteer('Jy het matriek gedruip met ' + punt + '%. Dis \u2019n harde slag.','sleg'); }
    sluitGroep('klasmaat','na skool');
    return;
  }
}
function skoolBonus(sk){
  if(!sk) return;
  if(sk.slim) s.slim = klem(s.slim + tussen(0, sk.slim));
  if(sk.gesondheid) s.gesondheid = klem(s.gesondheid + tussen(0, sk.gesondheid));
  if(sk.geluk) s.geluk = klem(s.geluk + tussen(0, sk.geluk));
}
function kanBekostig(koste){ return !koste || koste <= s.rykf*45000 || s.geld >= koste*2; }
function kiesLaerskool(){
  s.skool.vlak='laerskool'; s.skool.graad=1;
  var opsies = LAERSKOLE.filter(function(x){ return kanBekostig(x.koste); }).map(function(x){
    return { t:x.n, sub: x.t + ' \u00b7 ' + (x.koste ? geld(x.koste) + ' per jaar (jou ouers betaal)' : 'gratis'),
      doen:function(){ s.laerskool = x; skoolBonus(x);
        noteer('Jy het Graad 1 by ' + x.n + ' begin.','skool'); maakKlasmaats(x.n); } };
  });
  wagry.push({titel:'Jou eerste skooldag', vraag:'Waarheen gaan jy laerskool toe?', opsies:opsies});
}
function kiesHoerskool(){
  s.skool.vlak='hoerskool'; s.skool.graad=8;
  var opsies = HOERSKOLE.filter(function(x){
      return kanBekostig(x.koste) && (!x.vereisSlim || s.slim>=x.vereisSlim); }).map(function(x){
    return { t:x.n, sub: x.t + ' \u00b7 ' + (x.koste ? geld(x.koste) + ' per jaar (jou ouers betaal)' : 'gratis'),
      doen:function(){ s.hoerskool = x; skoolBonus(x);
        noteer('Jy het Graad 8 by ' + x.n + ' begin.','skool'); maakKlasmaats(x.n); } };
  });
  wagry.push({titel:'Hoerskool', vraag:'Watter hoerskool kies jy?', opsies:opsies});
}

function lewendeOuers(){
  return s.verhoudings.filter(function(v){ return v.lewe && (v.tipe==='ma'||v.tipe==='pa'); });
}
function maakGroep(tipe, aantal, ouderdomF, lo, hi){
  var nuut=[];
  for(var i=0;i<aantal;i++){
    var p = nuweMens(null, ouderdomF(), kies(VANNE));
    p.tipe = tipe; p.band = tussen(lo,hi);
    s.verhoudings.push(p); nuut.push(p);
  }
  return nuut;
}
function name(lys){ return lys.map(function(p){ return p.naam; }).join(', '); }

function maakKlasmaats(plek){
  var nuut = maakGroep('klasmaat', tussen(3,5), function(){ return s.ouderdom + tussen(-1,1); }, 30, 65);
  noteer('In jou klas by ' + plek + ' het jy ' + name(nuut) + ' ontmoet.','skool');
}
function maakKollegas(){
  var nuut = maakGroep('kollega', tussen(2,4), function(){ return tussen(22,58); }, 20, 52);
  var baas = nuweMens(null, tussen(35,62), kies(VANNE));
  baas.tipe='baas'; baas.band=tussen(20,50); s.verhoudings.push(baas);
  noteer('Jou baas is ' + baas.naam + ' ' + baas.van + '. Jou kollegas is ' + name(nuut) + '.','werk');
}
/* Wanneer 'n skoolfase of werk eindig: sterk bande word vriendskappe, die res verdwyn. */
function sluitGroep(tipe, rede){
  var bly=[], weg=0;
  s.verhoudings.forEach(function(v){
    if(v.tipe!==tipe || !v.lewe) return;
    if(v.band>=48){ v.tipe='vriend'; bly.push(v.naam); } else { v.weg=true; weg++; }
  });
  s.verhoudings = s.verhoudings.filter(function(v){ return !v.weg; });
  if(bly.length) noteer(bly.join(' en ') + ' het jou vriende gebly ' + rede + '.','goed');
  if(weg) noteer('Jy het kontak verloor met ' + weg + ' ander ' +
    (tipe==='kollega'?'kollegas':'klasmaats') + ' ' + rede + '.','neutraal');
}
function losWerkMense(){
  sluitGroep('kollega','na die werk');
  s.verhoudings = s.verhoudings.filter(function(v){ return v.tipe!=='baas'; });
}
/* 'n Klasmaat of kollega word 'n regte vriend sodra die band sterk genoeg is. */
function pasVriendskapAan(v){
  if((v.tipe==='klasmaat'||v.tipe==='kollega') && v.band>=65){
    var oud = v.tipe==='kollega' ? 'kollega' : 'klasmaat';
    v.tipe='vriend';
    noteer(v.naam + ' is nou \u2019n regte vriend, nie net \u2019n ' + oud + ' nie.','goed');
  }
}
function klasGebeurtenis(){
  var maats = s.verhoudings.filter(function(v){ return v.lewe && v.tipe==='klasmaat'; });
  if(!maats.length || !kans(45)) return;
  var m = kies(maats), w = R(4);
  if(w===0){ m.band=klem(m.band+tussen(6,14)); s.slim=klem(s.slim+2);
    noteer('Jy en ' + m.naam + ' het saam aan \u2019n projek gewerk.','skool'); }
  else if(w===1){ m.band=klem(m.band-tussen(8,18)); s.geluk=klem(s.geluk-4);
    noteer('Jy en ' + m.naam + ' het op die rugbyveld gestry.','sleg'); }
  else if(w===2){ m.band=klem(m.band+tussen(4,10));
    noteer(m.naam + ' het sy kosblik met jou gedeel.','goed'); }
  else { m.band=klem(m.band+tussen(3,9)); s.geluk=klem(s.geluk+3);
    noteer('Jy en ' + m.naam + ' het die hele pouse gelag.','goed'); }
}

/* ---------- Beroep ---------- */
function beroepJaar(){
  if(!s.beroep) return;
  if(s.tronk){ noteer('Jy het jou werk as ' + beroepTitel() + ' verloor terwyl jy in die tronk is.','werk');
    s.beroep=null; losWerkMense(); return; }
  var b = s.beroep;
  b.jare++; s.jareGewerk++;
  b.salaris = Math.round(b.salaris * 1.045);
  b.prestasie = klem(b.prestasie + tussen(-7,4) + Math.round((s.slim-50)/16));
  if(b.prestasie>=72 && b.vlak<4 && kans(26 + (b.prestasie-72))){
    b.vlak++; b.salaris = Math.round(b.basis * VLAK_X[b.vlak] * Math.pow(1.045,b.jare));
    b.prestasie = klem(b.prestasie-18);
    s.geluk = klem(s.geluk+11);
    noteer('Bevordering! Jy is nou ' + beroepTitel() + ' teen ' + geld(b.salaris) + ' per jaar.','werk');
  } else if(b.prestasie<=20 && kans(38)){
    noteer('Jy is afgedank as ' + beroepTitel() + '. Jou prestasie was te swak.','sleg');
    s.geluk = klem(s.geluk-16); s.beroep=null; losWerkMense();
  }
}
function beroepTitel(){
  if(!s.beroep) return 'werkloos';
  return VLAK_NAAM[s.beroep.vlak] + s.beroep.t;
}

/* B17 — op 65 vra die spel self of jy wil aftree, of jy nou nog 'n werk
   het of nie. Jou fonds bepaal jou pensioen, nie of jy daardie oomblik
   toevallig aangestel is nie. Se jy nee, vra dit weer oor vyf jaar. */
function aftreeJaar(){
  if(s.afgetree || s.tronk || s.ouderdom < AFTREE_OUDERDOM+5) return;
  if(s.ouderdom < (s.vlagge.aftreeGevra||0) + 5) return;
  var fonds = s.pensioenFonds||0;
  if(fonds<=0 && !s.beroep) return;
  s.vlagge.aftreeGevra = s.ouderdom;
  var derde = Math.round(fonds/3), opsies = [];
  if(fonds>0){
    opsies.push({t:'Ja — alles in ’n lewende annuiteit',
      sub:geld(Math.round(fonds*ANNUITEIT_TREK)) + ' per jaar',
      doen:function(){ treeAf(0); }});
    opsies.push({t:'Ja — en neem ’n derde kontant',
      sub:geld(derde - kontantBelasting(derde)) + ' nou, dan ' +
        geld(Math.round((fonds-derde)*ANNUITEIT_TREK)) + ' per jaar',
      doen:function(){ treeAf(derde); }});
  } else {
    opsies.push({t:'Ja, ek hou op werk', sub:'Daar is geen fonds om van te lewe nie',
      doen:function(){ treeAf(0); }});
  }
  opsies.push({t: s.beroep ? 'Nee, ek werk nog aan' : 'Nee, nog nie', klas:'grys'});
  wagry.push({titel:'Wil jy aftree?',
    vraag:'Jy is ' + s.ouderdom + '. Jou pensioenfonds is ' + geld(fonds) + ' werd' +
      (fonds>0 ? ' en kan ' + geld(Math.round(fonds*ANNUITEIT_TREK)) + ' per jaar uitbetaal.'
        : ', want jy het nooit bygedra nie.'), opsies:opsies});
}

/* ---------- Finansies ---------- */
/* 'n Kind kos jou geld tot hy op 18 die huis verlaat — nie vir ewig nie.
   Kinders wat oorlede is, tel ook nie meer nie. */
function kindersTuis(){
  return s.verhoudings.filter(function(v){
    return v.lewe && (v.tipe==='seun'||v.tipe==='dogter') && v.ouderdom<18; }).length;
}
/* A12 — troeteldiere kos elke jaar geld, ook as jy nog 'n kind is. Dan
   betaal jou ouers, maar net as hulle dit kan bekostig. Die funksie gee
   terug hoeveel JY self moet betaal. */
function diereKosteJaar(){
  var som = 0;
  (s.diere||[]).forEach(function(d){ som += d.onderhoud; });
  if(!som) return 0;
  var ouers = lewendeOuers();
  if(s.ouderdom>=18 || !ouers.length){
    /* B13 — het jy self niks, kan jy ook nie 'n dier aanhou nie. */
    if(som > Math.max(0,s.geld) + (s.spaar||0) + brutoInkomste()*0.35){
      var los = s.diere[s.diere.length-1];
      s.diere = s.diere.filter(function(x){ return x!==los; });
      s.geluk = klem(s.geluk - tussen(10,20));
      noteer('Jy kon nie meer ' + los.naam + ' se ' + geld(los.onderhoud) +
        ' per jaar bekostig nie. ' + los.naam + ' is SPCA toe.','sleg');
      return diereKosteJaar();
    }
    return som;
  }
  if(som > s.rykf * 30000){
    var weg = s.diere[s.diere.length-1];
    s.diere = s.diere.filter(function(x){ return x!==weg; });
    s.geluk = klem(s.geluk - tussen(8,18));
    noteer('Jou ouers kon nie ' + weg.naam + ' se ' + geld(weg.onderhoud) +
      ' per jaar bekostig nie. ' + weg.naam + ' is SPCA toe.','sleg');
    return 0;
  }
  var p = kies(ouers);
  p.band = klem(p.band - tussen(0,2));
  noteer(p.naam + ' het ' + geld(som) + ' vir jou diere se kos en die dierearts betaal.','geld');
  return 0;
}
/* ==========================================================================
   DIE GELDJAAR  (Fase 2 — B1, B2, B5, B6, B13, B14, B17)
   finansiesJaar() is net die dirigent: dit roep elke stuk in die regte
   orde, en elke stuk doen een ding. Wil jy die balans verander, is die
   getalle in data.js onder "EKONOMIE".
   ========================================================================== */
function finansiesJaar(){
  var netto = inkomsteJaar();      /* salaris en pensioen, na belasting */
  sakgeldJaar();                   /* B14 */
  blyplekJaar(netto);              /* B1  — huur, of by jou ouers */
  bondJaar();                      /* B2  — die huislening */
  uitgawesJaar(netto);             /* B13 — lewenskoste */
  spaarRenteJaar();                /* B5  — rente op spaargeld */
  pensioenFondsJaar();             /* B17 — die fonds groei of betaal uit */
  beleggingJaar();
  bateWaardesJaar();
  skuldJaar();                     /* B6  — rente op skuld, en die gevolge */
  if(s.swartlys>0) s.swartlys--;
}

/* ---------- Inkomste en belasting ---------- */
/* Hoe duur is die dorp waarin jy bly? 1 = die landsgemiddeld. */
function dorpFaktor(){ return DORP_KOSTE[s.dorp] || 1; }
/* Wat verdien jy vanjaar voor belasting? */
function brutoInkomste(){
  var b = 0;
  if(s.beroep) b += s.beroep.salaris;
  if(s.pensioen) b += s.pensioen;
  return b;
}
/* Die skale is nog grof — B8 maak hulle later marginaal, met rebates. */
function belastingKoers(bedrag){
  return bedrag>900000 ? 0.36 : bedrag>450000 ? 0.30 : bedrag>250000 ? 0.22 : 0.14;
}
function studeerTans(){ return s.skool.vlak==='universiteit' || s.skool.vlak==='nagraads'; }

function inkomsteJaar(){
  var bruto = brutoInkomste();
  if(bruto<=0) return 0;
  var bydrae = pensioenBydraeJaar();        /* B17 — aftrekbaar voor belasting */
  var belasbaar = Math.max(0, bruto - bydrae);
  var netto = Math.round(belasbaar * (1 - belastingKoers(belasbaar)));
  s.geld += netto; s.totaalVerdien += netto;
  noteer('Jy het ' + geld(netto) + ' verdien (na belasting' +
    (bydrae ? ' en jou pensioenbydrae' : '') + ').','geld');
  return netto;
}

/* ---------- B14: sakgeld ---------- */
/* Sakgeld groei met jou ouderdom en jou gesin se rykdom: 'n sewejarige
   kry 'n paar rand per week, 'n matriekleerling genoeg vir 'n fliek of
   twee per maand. Verdien jy self, hou die sakgeld op. */
function sakgeldJaar(){
  var o = s.ouderdom;
  if(o<6 || o>=18 || s.tronk || s.beroep) return 0;
  var week = (o - 4) * SAKGELD_WEEK * s.rykf;
  if(!lewendeOuers().length) week = week/2;  /* niemand by die huis nie — familie help bietjie */
  var jaar = Math.round(week * 52 * tussen(85,115)/100);
  if(jaar<=0) return 0;
  s.geld += jaar;
  noteer('Sakgeld vir die jaar: ' + geld(jaar) + ' — ongeveer ' +
    geld(Math.round(jaar/52)) + ' per week.','geld');
  return jaar;
}

/* ---------- B1: waar jy bly ---------- */
function hetHuis(){ return s.bates.some(function(b){ return b.t==='huis'; }); }
function huurTarief(id){
  var p = null;
  HUURPLEKKE.forEach(function(x){ if(x.id===id) p=x; });
  return p || HUURPLEKKE[1];
}
function huurPerJaar(id){ return Math.round(huurTarief(id).maand * 12 * dorpFaktor()); }
/* B18 — 'n broer of suster wat oud genoeg is om jou in te neem as jy
   nie meer 'n plek het nie. */
function familieHuis(){
  return s.verhoudings.filter(function(v){
    return v.lewe && (v.tipe==='broer'||v.tipe==='suster') && v.ouderdom>=21; });
}
/* Waarheen jy terugval as jy nie meer vir 'n plek kan betaal nie: eers
   die ouerhuis, dan 'n broer of suster se huis, anders moet jy huur. */
function terugvalBlyplek(){
  return lewendeOuers().length ? 'ouers' : (familieHuis().length ? 'familie' : 'huur');
}
/* Wie se huis is dit waarin jy bly? */
function huisMense(wat){
  return wat==='ouers' ? lewendeOuers() : wat==='familie' ? familieHuis() : [];
}
/* Is daar iets wat jy kan verkoop om 'n rekening te dek? */
function hetIetsOmTeVerkoop(){
  return s.bates.length>0 || s.belegging>0 || (s.spaar||0)>0;
}
/* Wat jy vanjaar op blyplek kan spandeer: jou inkomste plus 'n stukkie
   van wat jy gespaar het. */
function blyVermoe(netto){
  return netto + Math.round((Math.max(0,s.geld) + (s.spaar||0)) * 0.2);
}
/* Die beste huurplek wat minder as 35% van jou vermoe kos. */
function pasHuurBy(vermoe){
  var keuse = HUURPLEKKE[1].id;
  HUURPLEKKE.forEach(function(p){ if(huurPerJaar(p.id) <= vermoe*0.35) keuse = p.id; });
  return keuse;
}
function blyplekJaar(netto){
  var o = s.ouderdom, vermoe = blyVermoe(netto);
  if(o<18){ s.blyplek='ouers'; return 0; }
  /* B18 — is jy dakloos, is daar geen huur nie: dit is die ontlaaiklep.
     Die pad terug loop deur dakloosJaar() en die aksies op die
     Aktiwiteite-blad. */
  if(s.dakloos){ s.blyplek='dakloos'; return 0; }
  /* Besit jy 'n huis, bly jy daarin. Die verband en die onderhoud word
     elders bereken; blyplek self kos jou dan niks. */
  if(hetHuis()){
    if(s.blyplek!=='eie'){ s.blyplek='eie'; noteer('Jy bly nou in jou eie huis.','goed'); }
    if(!s.tronk) s.geluk = klem(s.geluk + 2);
    return 0;
  }
  if(s.blyplek==='eie') s.blyplek = terugvalBlyplek();
  if(s.tronk){
    if(s.blyplek==='huur'){
      s.blyplek = terugvalBlyplek();
      if(s.blyplek!=='huur') noteer('Jy het jou huurplek verloor terwyl jy in die tronk is.','sleg');
    }
    return 0;
  }
  /* By die familie: jou ouers se huis, of 'n broer of suster wat jou
     ingetrek het. Dit kos byna niks, maar dit knaag aan jou. */
  if(s.blyplek==='ouers' || s.blyplek==='familie'){
    var saam = huisMense(s.blyplek);
    if(!saam.length){
      var waar = s.blyplek==='ouers' ? 'ouerhuis' : 'familie se huis';
      s.blyplek = terugvalBlyplek();
      saam = huisMense(s.blyplek);
      if(!saam.length){
        s.blyplek='huur'; s.huurPlek = pasHuurBy(vermoe);
        noteer('Daar is niemand meer in die ' + waar + ' nie. Jy moes jou eie plek kry.','sleg');
      }
    }
    if(saam.length){
      var by = netto>0 ? Math.round(OUERHUIS_MAAND*12*dorpFaktor()) : 0;
      var wie = s.blyplek==='ouers' ? 'jou ouers' : saam[0].naam;
      if(by>0){ s.geld -= by;
        noteer('Jy bly by ' + wie + ' en dra ' + geld(by) + ' by tot die rekeninge.','geld'); }
      /* Dis goedkoop, maar 'n grootmens wat nog in iemand anders se huis
         bly, voel dit met die jare al hoe meer. */
      if(o>=25){
        s.geluk = klem(s.geluk - tussen(1, Math.min(7, o-24)));
        if(kans(40)) noteer('Jy is ' + o + ' en bly nog in ' +
          (s.blyplek==='ouers' ? 'jou ouers se huis' : wie + ' se spaarkamer') +
          '. Dit knaag aan jou.','sleg');
      }
      vraBlyplek();
      return by;
    }
  }
  if(!s.huurPlek) s.huurPlek = pasHuurBy(vermoe);
  var huur = huurPerJaar(s.huurPlek), plek = huurTarief(s.huurPlek);
  /* B18 — het 'n maatskaplike werker jou vanjaar van die straat af
     ingesit, is die eerste jaar se huur betaal. Sonder dit sou jy
     dieselfde jaar weer uitgesit word, en dan was die hulp sinneloos. */
  if(s.vlagge.huurBetaal === s.ouderdom){
    noteer('Die NGO het vanjaar se huur van ' + geld(huur) + ' vir jou betaal.','goed');
    return huur;
  }
  var betaal = betaalWatJyKan(huur, 'jou huur');
  noteer('Huur vir ' + plek.n.toLowerCase() + ' in ' + s.dorp + ': ' + geld(huur) + '.','geld');
  s.geluk = klem(s.geluk + Math.round(plek.geluk/5));
  /* B18 — kon jy nie eens die huur bybring nie, moet jy kleiner trek of
     by familie gaan bly. Is daar nie 'n kleiner plek, geen familiehuis
     en niks om te verkoop nie, is die straat al wat oorbly. */
  if(betaal < huur){
    if(!kleinerBlyplek() && !hetIetsOmTeVerkoop())
      raakDakloos('Die verhuurder het jou uitgesit omdat jy nie die huur kon betaal nie');
  } else if(huur > vermoe*0.5){
    /* Vreet die huur meer as die helfte van alles op, kan jy nie daar bly nie. */
    kleinerBlyplek();
  }
  return huur;
}
/* Jy kan nie onbeperk op skuld leef nie — niemand gee jou meer krediet
   as skuldPerk() nie. Wat jy nie kan betaal nie, moet jy ontbeer: dit
   kos jou geluk en gesondheid, maar dit maak nie jou skuld groter nie.
   Dit is die rede waarom niemand in 'n eindelose skuldspiraal beland nie. */
function betaalWatJyKan(bedrag, wat){
  bedrag = Math.round(bedrag);
  if(bedrag<=0) return 0;
  if(s.geld < bedrag) dekUitSpaar(bedrag - s.geld);
  var ruimte = s.geld + skuldPerk();
  var betaal = Math.min(bedrag, Math.max(0, ruimte));
  s.geld -= betaal;
  if(betaal < bedrag){
    s.geluk = klem(s.geluk - tussen(4,10));
    s.gesondheid = klem(s.gesondheid - tussen(1,4));
    noteer('Jy kon net ' + geld(betaal) + ' van ' + wat + ' se ' + geld(bedrag) +
      ' betaal. Jy het swaar gekry.','sleg');
    /* B18 — besit jy nog iets, moet jy die kans kry om dit self te
       verkoop voordat die balju dit teen 75% kom haal. */
    vraVerkoop(bedrag - betaal, wat);
  }
  return betaal;
}

/* Een keer, sodra jy 18 is en klaar met skool, vra die spel waar jy wil
   bly. Daarna verander jy dit self op die Bates-blad. */
function vraBlyplek(){
  if(s.vlagge.blyplekGevra || s.ouderdom<18) return;
  if(s.skool.vlak==='laerskool' || s.skool.vlak==='hoerskool') return;
  s.vlagge.blyplekGevra = 1;
  var vermoe = blyVermoe(brutoInkomste());
  var opsies = [{t:'Bly by my ouers',
    sub:'Goedkoop, maar dit begin na \u2019n paar jaar aan jou knaag',
    doen:function(){ s.blyplek='ouers'; }}];
  HUURPLEKKE.forEach(function(p){
    var koste = huurPerJaar(p.id);
    if(koste > Math.max(vermoe, 60000)) return;
    opsies.push({t:'Huur ' + p.n.toLowerCase(), sub:geld(koste) + ' per jaar \u00b7 ' + p.sub,
      doen:function(){ s.blyplek='huur'; s.huurPlek=p.id;
        s.geluk = klem(s.geluk + Math.round(p.geluk/2));
        noteer('Jy het in \u2019n ' + p.n.toLowerCase() + ' ingetrek.','geld'); }});
  });
  wagry.push({titel:'Waar gaan jy bly?',
    vraag:'Jy is 18. Jy kan by jou ouers bly en spaar, of jou eie plek kry. ' +
      'Jy kan dit later op die Bates-blad verander.', opsies:opsies});
}
/* Trek kleiner, of gaan by familie bly. Gee terug of daar nog 'n trappie
   oor was — is daar nie, dan wag die straat (B18). */
function kleinerBlyplek(){
  var i = -1;
  HUURPLEKKE.forEach(function(p, n){ if(p.id===s.huurPlek) i=n; });
  if(i>0){
    s.huurPlek = HUURPLEKKE[i-1].id; s.geluk = klem(s.geluk-6);
    noteer('Jy kon nie die huur hou nie en het na ’n ' +
      HUURPLEKKE[i-1].n.toLowerCase() + ' getrek.','sleg');
    return true;
  }
  var val = terugvalBlyplek();
  if(val!=='huur' && s.blyplek==='huur'){
    var wie = val==='ouers' ? 'jou ouers' : huisMense(val)[0].naam;
    s.blyplek = val; s.geluk = klem(s.geluk-8);
    noteer('Jy kon nie meer huur bekostig nie en het teruggetrek na ' + wie + '.','sleg');
    return true;
  }
  return false;
}

/* ---------- B2: die verband (huislening) ---------- */
function bondSkuld(){ return s.bond ? s.bond.saldo : 0; }
/* Die jaarlikse paaiement op 'n lening — die gewone annuiteitsformule.
   P = die lening, r = rente per jaar, n = die termyn in jare. */
function bondPaaiement(lening, jare){
  var r = BOND_KOERS;
  return Math.round(lening * r / (1 - Math.pow(1+r, -jare)));
}
/* Hoeveel jaar is nog oor teen die huidige paaiement? Betaal jy ekstra
   in, word hierdie getal kleiner — dis die hele punt van ekstra betaal. */
function bondJareOor(){
  var b = s.bond; if(!b || b.saldo<=0) return 0;
  var rente = b.saldo * b.koers;
  if(b.paaiement <= rente) return 99;
  return Math.ceil(Math.log(b.paaiement/(b.paaiement - rente)) / Math.log(1+b.koers));
}
/* Die bank trek eers uit jou gekoppelde spaarrekening as die
   tjekrekening te min het. */
function dekUitSpaar(bedrag){
  if(bedrag<=0 || !(s.spaar>0)) return 0;
  var trek = Math.min(s.spaar, Math.round(bedrag));
  s.spaar -= trek; s.geld += trek;
  noteer(geld(trek) + ' is uit jou spaarrekening getrek om die rekeninge te dek.','geld');
  return trek;
}
function bondJaar(){
  var b = s.bond;
  if(!b) return 0;
  var rente = Math.round(b.saldo * b.koers);
  b.saldo += rente;
  b.renteBetaal = (b.renteBetaal||0) + rente;
  var verskuldig = Math.min(b.paaiement, b.saldo);
  if(s.geld < verskuldig) dekUitSpaar(verskuldig - s.geld);
  if(s.geld >= verskuldig){
    s.geld -= verskuldig; b.saldo -= verskuldig;
    if(b.agter){ b.agter = 0; noteer('Jy het jou verband weer op datum gekry.','goed'); }
    noteer('Verbandpaaiement ' + geld(verskuldig) + ' betaal, waarvan ' + geld(rente) +
      ' rente is. Nog ' + geld(Math.max(0,b.saldo)) + ' uitstaande.','geld');
  } else {
    var deel = Math.max(0, s.geld);
    s.geld -= deel; b.saldo -= deel;
    b.agter = (b.agter||0) + 1;
    s.geluk = klem(s.geluk-10);
    noteer('Jy kon net ' + geld(deel) + ' van jou verbandpaaiement van ' + geld(verskuldig) +
      ' betaal. Jy is nou ' + b.agter + ' jaar agter.','sleg');
    if(b.agter >= BOND_AGTER_MAKS){ bankVatHuis(); return 0; }
    noteer('Die bank se prokureurs het geskryf. Raak jy ' + BOND_AGTER_MAKS +
      ' jaar agter, verkoop hulle die huis.','sleg');
  }
  if(b.saldo<=0){
    s.bond = null; s.geluk = klem(s.geluk+20);
    noteer('Jou verband is afbetaal! Die huis is nou heeltemal joune.','goed');
  }
  return verskuldig;
}
function bankVatHuis(){
  var b = s.bond, huis = null;
  s.bates.forEach(function(x){ if(x.id===b.bateId) huis=x; });
  if(!huis) s.bates.forEach(function(x){ if(x.t==='huis' && !huis) huis=x; });
  var naam = huis ? huis.n : 'jou huis';
  var opbrengs = huis ? verkoopBateUit(huis, VEILING_F) : 0;
  if(s.bond){ s.geld -= s.bond.saldo; s.bond = null; }
  s.swartlys = 7; s.geluk = klem(s.geluk-30);
  noteer('Die bank het ' + naam + ' op ’n veiling verkoop vir ' + geld(opbrengs) +
    '. Jy is vir sewe jaar by die kredietburo gelys.','sleg');
}
/* Verkoop 'n bate en kry die geld. Is daar 'n verband daarop, word die
   bank eerste betaal en jy kry net wat oorbly. 'f' is watter deel van
   die waarde jy kry — 1 is die volle prys, minder by 'n gedwonge verkoping. */
function verkoopBateUit(b, f){
  /* Besit jy dit nie meer nie (die balju was netnou hier), is daar niks
     om te verkoop — anders sou dieselfde huis twee keer geld inbring. */
  if(s.bates.indexOf(b)<0) return 0;
  s.bates = s.bates.filter(function(x){ return x!==b; });
  var opbrengs = Math.round(b.waarde * (f===undefined ? 1 : f));
  s.geld += opbrengs;
  if(s.bond && s.bond.bateId===b.id){
    s.geld -= s.bond.saldo;
    noteer('Die verband van ' + geld(s.bond.saldo) + ' is eerste uit die opbrengs betaal.','geld');
    s.bond = null;
  }
  if(b.t==='huis' && !hetHuis() && s.blyplek==='eie')
    s.blyplek = lewendeOuers().length ? 'ouers' : 'huur';
  return opbrengs;
}

/* ---------- B13: lewenskoste ---------- */
/* Wat dit kos om te lewe, afgesien van blyplek: kos, klere, vervoer,
   selfoon en rekeninge. Dit skaal met jou dorp, jou gesin en jou
   inkomste — 'n student eet noedels, 'n chirurg eet uit. */
function lewenskosteJaar(netto){
  var f = dorpFaktor();
  var basis = KOSTE_BASIS * f;
  if(studeerTans() && !s.beroep) basis *= KOSTE_STUDENT;
  /* Jy kan nie uitgee wat jy nie het nie: verdien jy min, leef jy karig. */
  if(netto < basis*1.7) basis = Math.max(KOSTE_MINIMUM*f, netto*0.55);
  /* Bly jy by jou ouers en verdien jy nog niks, sit hulle die kos op die
     tafel. Jy betaal net vir jou eie goed — 'n student of 'n jong mens
     tussen werke beland dus nie sommer in die skuld nie. */
  if(s.blyplek==='ouers' && netto < basis) basis = Math.max(0, netto*0.35);
  /* Leefstyl-inflasie: elke rand netto bo R220 000 laat jou 18c meer spandeer. */
  if(netto > LEEFSTYL_VANAF) basis += (netto - LEEFSTYL_VANAF) * LEEFSTYL_F;
  var som = basis, m = maat();
  if(m && m.tipe==='eggenoot') som += KOSTE_BASIS * f * KOSTE_MAAT;
  som += kindersTuis() * KOSTE_KIND * f;
  return Math.round(som);
}
function uitgawesJaar(netto){
  var diereKoste = diereKosteJaar();
  /* B18 — in die tronk en op straat is daar geen lewenskoste nie. Dit
     is die ontlaaiklep: 'n mens sonder 'n dak kan nie 'n huishouding
     bekostig nie, en daarom kan sy skuld ook nie eindeloos groei nie. */
  if(s.ouderdom<18 || s.tronk || s.dakloos){
    if(diereKoste){ s.geld -= diereKoste;
      noteer('Jou diere het ' + geld(diereKoste) + ' gekos.','geld'); }
    return diereKoste;
  }
  var uit = lewenskosteJaar(netto) + diereKoste;
  s.bates.forEach(function(b){ uit += Math.round(b.waarde * (b.t==='huis'?0.018:0.05)); });
  noteer('Lewenskoste en rekeninge: ' + geld(uit) + '.','geld');
  return betaalWatJyKan(uit, 'jou lewenskoste');
}

/* ---------- B5: rente op spaargeld ---------- */
/* Geld in die spaarrekening groei; geld in die tjekrekening doen niks.
   SARS gee jou die eerste R23 800 rente per jaar belastingvry. */
function spaarRenteJaar(){
  if(!(s.spaar>0)){
    if(s.ouderdom>=18 && s.geld>120000 && kans(35))
      noteer('Jy het ' + geld(s.geld) + ' in die tjekrekening wat niks verdien nie. ' +
        '’n Spaarrekening sou daarop rente betaal.','neutraal');
    return 0;
  }
  var k = tussen(SPAAR_KOERS[0], SPAAR_KOERS[1]);
  var rente = Math.round(s.spaar * k/100);
  s.spaar += rente;
  noteer('Jou spaarrekening het ' + geld(rente) + ' rente verdien (' + k + '%).','geld');
  var belasbaar = rente - RENTE_VRY;
  if(belasbaar>0){
    var bel = Math.round(belasbaar * belastingKoers(brutoInkomste() + rente));
    s.geld -= bel;
    noteer('Belasting op die rente bo ' + geld(RENTE_VRY) + ': ' + geld(bel) + '.','geld');
  }
  return rente;
}

/* ---------- B17: pensioen ---------- */
/* Elke jaar wat jy werk, gaan 'n deel van jou salaris in 'n fonds en
   jou werkgewer pas dit tot 7,5%. Die fonds bly joune ook as jy die
   werk verloor — dis die hele punt. */
function pensioenBydraeJaar(){
  if(!s.beroep || s.afgetree) return 0;
  var koers = s.pensioenKoers||0;
  if(koers<=0) return 0;
  var myne = Math.round(s.beroep.salaris * koers);
  var baas = Math.round(s.beroep.salaris * Math.min(koers, PENSIOEN_WERKGEWER));
  s.pensioenFonds = (s.pensioenFonds||0) + myne + baas;
  noteer('Pensioen: jy het ' + geld(myne) + ' bygedra en jou werkgewer ' + geld(baas) +
    '. Die fonds staan op ' + geld(s.pensioenFonds) + '.','geld');
  return myne;
}
function pensioenFondsJaar(){
  if(!(s.pensioenFonds>0)) return;
  var r = tussen(PENSIOEN_GROEI[0], PENSIOEN_GROEI[1])/100;
  var groei = Math.round(s.pensioenFonds * r);
  s.pensioenFonds += groei;
  if(s.afgetree){
    /* 'n Lewende annuiteit: wat jy vanjaar getrek het, kom uit die fonds,
       en volgende jaar se inkomste is 5,5% van wat oorbly. */
    s.pensioenFonds = Math.max(0, s.pensioenFonds - (s.pensioen||0));
    s.pensioen = Math.round(s.pensioenFonds * ANNUITEIT_TREK);
    if(s.pensioenFonds<=0 && s.pensioen<=0)
      noteer('Jou pensioenfonds is leeg. Daar kom niks meer in nie.','sleg');
  } else if(groei>0 && kans(50)){
    noteer('Jou pensioenfonds het ' + Math.round(r*100) + '% gegroei tot ' +
      geld(s.pensioenFonds) + '.','geld');
  }
}

/* ---------- Beleggings en bates ---------- */
function beleggingJaar(){
  if(!(s.belegging>0)) return;
  var r = tussen(-24,34)/100;
  var w = Math.round(s.belegging * r);
  s.belegging = Math.max(0, s.belegging + w);
  noteer('Jou beleggings het ' + (w>=0?'gegroei met ':'gedaal met ') + geld(Math.abs(w)) +
    ' (' + (r>=0?'+':'') + Math.round(r*100) + '%).', w>=0?'geld':'sleg');
}
function bateWaardesJaar(){
  s.bates.forEach(function(b){
    b.waarde = Math.max(1000, Math.round(b.waarde * (b.t==='huis' ? (1 + tussen(-2,11)/100)
      : b.t==='motor' ? 0.87 : 0.97)));
  });
}

/* ---------- B6: skuld en sy gevolge ---------- */
/* Hoeveel skuld laat die bank toe voor hulle goed kom vat? */
function skuldPerk(){
  return Math.max(SKULD_MIN_PERK, Math.round(brutoInkomste() * SKULD_INKOMSTE_PERK));
}
/* Is daar enigiets wat 'n skuldeiser kan vat? */
function hetIetsOmTeVat(){
  return s.bates.length>0 || s.belegging>0 || (s.spaar||0)>0 || brutoInkomste()>0;
}
/* 'n Boedelbevel is net die moeite werd as die skuld groot genoeg is, en
   dit kan net een keer elke tien jaar — daarna moet jy eers
   gerehabiliteer word. Is die skuld klein, bly dit net staan: niemand
   sleep jou hof toe oor 'n paar duisend rand nie. */
function magSekwestreer(){
  return -s.geld >= SEKWESTRASIE_MIN && s.ouderdom >= (s.vlagge.boedelJaar||-99) + 10;
}
function skuldJaar(){
  if(s.geld<0) dekUitSpaar(-s.geld);
  /* Uit die skuld is 'n skoon blad: het jy vroeer geweier om te verkoop,
     mag jy weer kies as dit weer so ver kom. */
  if(s.geld>=0){ s.vlagge.weierVerkoop = 0; return; }
  var perk = skuldPerk();
  /* Is daar niks by jou te haal nie en is die skuld bo die perk, is dit
     klaar: of die hof skryf alles af, of die rekening bly net staan as
     oninvorderbaar. Geen rente loop verder nie — anders sou die skuld
     vir ewig groei sonder dat iets kan gebeur. */
  if(!hetIetsOmTeVat() && -s.geld > perk){
    if(magSekwestreer()) sekwestrasie();
    else if(kans(30)) noteer('Jou skuldeisers het opgehou bel. Daar is niks by jou te haal nie.','neutraal');
    return;
  }
  var rente = Math.round(-s.geld * SKULD_KOERS);
  s.geld -= rente;
  s.geluk = klem(s.geluk-9);
  noteer('Jy is ' + geld(-s.geld) + ' in die skuld. Die rente van ' + geld(rente) +
    ' teen ' + Math.round(SKULD_KOERS*100) + '% maak dit elke jaar erger.','sleg');
  /* B18 — die balju tree op sodra die skuld die perk haal, nie net
     daarbo nie. Anders bly iemand met 'n huis en geen inkomste vir ewig
     op die plafon sit: hy betaal elke jaar 'n stukkie, ly swaar, en sy
     netto waarde groei steeds. Jy kry wel eers 'n jaar se kans om self
     te verkoop (vraVerkoop); het jy dit van die hand gewys, verkoop die
     balju vir jou — teen 75%. */
  /* Wag 'n vraag in die wagry of jy self wil verkoop, hou die balju
     hierdie jaar sy hande tuis — anders vat hy die huis voordat jy kon
     antwoord, en dan is die vraag sinneloos. */
  if(hetIetsOmTeVerkoop() && !s.vlagge.weierVerkoop && s.gedoen.vraVerkoop) return;
  var byPerk = s.vlagge.weierVerkoop && -s.geld >= perk;
  if(-s.geld <= perk && !byPerk) return;
  noteer('Jou skuld is ' + (byPerk?'by':'bo') + ' die ' + geld(perk) +
    ' wat die bank wil dra. Hulle eis nou op.','sleg');
  if(s.belegging>0){
    var opge = Math.min(s.belegging, -s.geld);
    s.belegging -= opge; s.geld += opge;
    noteer('Beleggings van ' + geld(opge) + ' is opgeeis om die skuld te betaal.','sleg');
  }
  /* Hoeveel skuld hulle laat staan: normaalweg net wat bo die perk is,
     maar het jy geweier om self te verkoop, eis hulle die hele skuld op. */
  var los = byPerk ? 0 : perk;
  while(-s.geld > los && s.bates.length) baljuVat();
  if(-s.geld > perk && magSekwestreer()) sekwestrasie();
  if(!hetIetsOmTeVerkoop()) s.vlagge.weierVerkoop = 0;
}
/* Die balju vat die goedkoopste ding wat die skuld sal dek — hulle
   verkoop nie 'n strandhuis om 'n rekening van R40 000 te betaal nie.
   Is niks groot genoeg nie, gaan die duurste eerste. */
function baljuVat(){
  var nodig = -s.geld;
  var op = s.bates.slice().sort(function(a,b){ return a.waarde - b.waarde; });
  var vat = null;
  op.forEach(function(b){ if(!vat && b.waarde*GEDWONGE_F >= nodig) vat = b; });
  if(!vat) vat = op[op.length-1];
  var naam = vat.n;
  var opbrengs = verkoopBateUit(vat, GEDWONGE_F);
  s.geluk = klem(s.geluk-12);
  noteer('Die balju het ' + naam + ' kom haal. Dit het net ' + geld(opbrengs) +
    ' op die veiling gemaak.','sleg');
}
/* Die ondergrens: is daar niks meer om te vat nie, kry jy 'n boedelbevel.
   Jou skuld word afgeskryf, maar alles wat jy besit, is weg. */
function sekwestrasie(){
  var skuld = -s.geld;
  s.geld = 0; s.spaar = 0; s.belegging = 0; s.bates = []; s.bond = null;
  s.swartlys = 10; s.geluk = klem(s.geluk-30);
  s.vlagge.boedelJaar = s.ouderdom;
  s.blyplek = lewendeOuers().length ? 'ouers' : 'huur';
  s.huurPlek = HUURPLEKKE[0].id;
  noteer('Die hof het ’n boedelbevel teen jou toegestaan. ' + geld(skuld) +
    ' se skuld is afgeskryf, maar alles wat jy besit het, is weg.','sleg');
  noteer('Jy is vir tien jaar by die kredietburo gelys. Niemand sal jou geld leen nie.','sleg');
}

/* ==========================================================================
   B18 — DAKLOOSHEID
   Die ekonomie het 'n muur (jy kan nie meer uitgee as geld + skuldperk
   nie) maar dit het nooit 'n bodem gehad nie. Dit is die bodem.

   Jy raak dakloos as al drie geld: jy kan jou blyplek nie betaal nie, jy
   het niks verkoopbaars oor nie, en daar is geen familiehuis om na terug
   te gaan nie. Terwyl jy daar is, val jou lewenskoste weg — dit is die
   ontlaaiklep — maar gesondheid en geluk daal elke jaar, skool en studie
   is toe soos in die tronk, en werk kry is baie swaar.

   Dit is doelbewus moeilik maar uitkombaar. Daar is vier paaie terug:
   genoeg geld vir 'n deposito, familie wat jou intrek, werk deur 'n
   skuiling, en 'n maatskaplike werker wat jou by 'n plek kry (die kans
   groei elke jaar wat jy daar is).
   ========================================================================== */

/* B18 — kon jy nie jou rekeninge dek nie en besit jy nog iets, kry jy
   die kans om dit self te verkoop. Doen jy dit, kry jy die volle prys;
   wys jy dit van die hand, kom die balju dit haal teen 75% (sien die
   'weierVerkoop'-vlag in skuldJaar). Dit is wat gekeer het dat iemand
   met 'n strandhuis van R2,8 m en geen inkomste vir ewig op die
   skuldplafon sit en honger ly terwyl sy netto waarde groei. */
function vraVerkoop(kort, wat){
  if(s.gedoen.vraVerkoop || s.vlagge.weierVerkoop || !hetIetsOmTeVerkoop()) return;
  s.gedoen.vraVerkoop = 1;
  var opsies = [];
  if(s.belegging>0) opsies.push({t:'Verkoop jou beleggings',
    sub:geld(s.belegging) + ' · jy kry die volle waarde',
    doen:function(){
      var w = s.belegging; s.geld += w; s.belegging = 0; s.vlagge.weierVerkoop = 0;
      noteer('Jy het jou beleggings van ' + geld(w) + ' verkoop om die rekeninge te dek.','geld');
    }});
  s.bates.slice().sort(function(a,b){ return a.waarde - b.waarde; }).forEach(function(b){
    opsies.push({t:'Verkoop ' + b.n.toLowerCase(),
      sub:geld(b.waarde) + ' · jy kry die volle waarde, nie 75% nie',
      doen:function(){
        var naam = b.n, kry = verkoopBateUit(b, 1);
        s.vlagge.weierVerkoop = 0;
        noteer('Jy het ' + naam + ' self verkoop vir ' + geld(kry) + '.','geld');
      }});
  });
  opsies.push({t:'Nee, ek hou alles', klas:'rooi',
    sub:'Die balju kom dit volgende jaar haal — teen 75% van die waarde',
    doen:function(){
      s.vlagge.weierVerkoop = s.ouderdom;
      noteer('Jy het geweier om iets te verkoop. Die skuld bly staan.','sleg');
    }});
  wagry.push({titel:'Jy kort ' + geld(kort),
    vraag:'Jy kon nie ' + wat + ' volledig betaal nie en jy kort ' + geld(kort) +
      '. Jy besit nog iets — verkoop jy dit self, of laat jy die balju kom?',
    opsies:opsies});
}

/* Van watter trappie af kan jy weer huur? 'n Informele woning staan op
   iemand anders se erf, en sonder 'n adres of 'n inkomste gee niemand jou
   daar 'n plek nie — jou eerste trappie terug is 'n agterkamer. */
function dakTrappe(){
  var van = 0;
  HUURPLEKKE.forEach(function(p, i){ if(p.id===DAKLOOS_TRAP) van = i; });
  return HUURPLEKKE.slice(van);
}
/* Wat 'n verhuurder vooruit wil sien: die eerste jaar se huur plus twee
   maande deposito — en het jy geen inkomste nie, ook genoeg vir kos,
   anders is jy volgende jaar weer op straat. */
function dakIntrekKoste(id){
  var jaar = huurPerJaar(id);
  return Math.round(jaar * (1 + DEPOSITO_MAANDE/12)) +
    (brutoInkomste()>0 ? 0 : Math.round(KOSTE_MINIMUM * dorpFaktor()));
}
function dakUitKoste(){ return dakIntrekKoste(DAKLOOS_TRAP); }

function raakDakloos(rede){
  if(s.dakloos) return;
  s.dakloos = {jare:0, ngo:false};
  s.blyplek = 'dakloos';
  s.huurPlek = DAKLOOS_TRAP;        /* waar jy weer wil begin as jy uitkom */
  s.vlagge.weierVerkoop = 0;
  s.geluk = klem(s.geluk - tussen(14,26));
  s.gesondheid = klem(s.gesondheid - tussen(2,8));
  noteer(rede + '. Jy het nie meer ’n dak oor jou kop nie.','sleg');
  noteer('Jy slaap die eerste nag met jou goed in twee sakke onder ’n afdak in ' +
    s.dorp + '.','sleg');
  if(s.skool.vlak==='universiteit' || s.skool.vlak==='nagraads'){
    noteer('Jou studies in ' + s.skool.studie + ' is gestaak — jy kon nie klasgeld ' +
      'of ’n kamer betaal nie.','sleg');
    s.skool.vlak = 'klaar'; s.skool.studie = null;
  }
  (s.diere||[]).slice().forEach(function(d){
    s.geluk = klem(s.geluk - tussen(6,14));
    noteer(d.naam + ' kon nie saam straat toe nie en is SPCA toe.','sleg');
  });
  s.diere = [];
}

/* Die pad terug. 'plekId' is die huurplek waarin jy trek, of null as
   familie jou ingetrek het. */
function uitDakloosheid(plekId, hoe){
  if(!s.dakloos) return;
  var jare = s.dakloos.jare;
  s.dakloos = null;
  if(plekId){ s.blyplek = 'huur'; s.huurPlek = plekId; }
  s.geluk = klem(s.geluk + tussen(18,30));
  noteer(hoe,'goed');
  noteer('Jy was ' + (jare<1 ? 'minder as ’n jaar' : jare + ' jaar') +
    ' op straat. Die eerste warm bad voel soos ’n nuwe lewe.','goed');
}
/* Familie trek jou in: 'n ouer se huis, of 'n broer of suster se spaarkamer. */
function familieTrekJouIn(v){
  var waar = (v.tipe==='ma' || v.tipe==='pa') ? 'ouers' : 'familie';
  v.band = klem(v.band - tussen(0,6));
  uitDakloosheid(null, v.naam + ' het jou kom haal en ’n kamer vir jou gemaak.');
  s.blyplek = waar;
}
/* Wie van jou familie jou sou intrek, as jy hulle vra of as hulle jou
   kom soek. Hoe sterker die band, hoe groter die kans. */
function familieHelpers(){
  return s.verhoudings.filter(function(v){
    return v.lewe && ['ma','pa','broer','suster'].indexOf(v.tipe)>=0 &&
      (v.tipe==='ma' || v.tipe==='pa' || v.ouderdom>=21);
  }).sort(function(a,b){ return b.band - a.band; });
}

function dakloosJaar(){
  if(!s.dakloos) return;
  /* In die tronk het jy darem 'n dak en 'n bord kos — die jare op straat
     tel dan nie, en jy kom net so dakloos weer uit. */
  if(s.tronk) return;
  var d = s.dakloos;
  d.jare++;
  s.dakloosJare = (s.dakloosJare||0) + 1;
  s.gesondheid = klem(s.gesondheid - tussen(DAKLOOS_GESONDHEID[0], DAKLOOS_GESONDHEID[1]));
  s.geluk = klem(s.geluk - tussen(DAKLOOS_GELUK[0], DAKLOOS_GELUK[1]));
  noteer('Jaar ' + d.jare + ' op straat in ' + s.dorp + '.','sleg');
  if(kans(45)) noteer(kies(DAKLOOS_NAGTE),'sleg');
  /* Het jy weer 'n huis gekry (geerf of gekoop), trek jy dadelik in. */
  if(hetHuis()){
    uitDakloosheid(null, 'Jy het ’n huis van jou eie en het die dag ingetrek.');
    s.blyplek = 'eie';
    return;
  }
  /* Familie wat nog sterk aan jou vashou, kom jou soek. */
  var fam = familieHelpers()[0];
  if(fam && fam.band >= DAKLOOS_FAMILIE_BAND + 8 && kans(22)){
    familieTrekJouIn(fam);
    return;
  }
  /* 'n Skuiling of 'n maatskaplike werker kry jou aan die gang. Die kans
     groei elke jaar wat jy daar is, en 'n NGO-registrasie help baie —
     daarom is dit nie 'n doodloopstraat nie. Die orde maak saak: 'n dak
     sonder 'n inkomste hou nie, so werk kom eerste. */
  var hulp = DAKLOOS_HULP_KANS + d.jare*DAKLOOS_HULP_GROEI + (d.ngo ? 14 : 0);
  if(kans(hulp)){
    if(!s.beroep && skuilingWerk('’n Maatskaplike werker')) return;
    if(brutoInkomste()>0 || s.geld>=0){
      var plek = dakTrappe()[0];
      s.vlagge.huurBetaal = s.ouderdom;
      uitDakloosheid(plek.id, '’n Maatskaplike werker het ’n ' + plek.n.toLowerCase() +
        ' vir jou gekry en die eerste jaar se huur betaal.');
      return;
    }
    if(s.geld<0){
      /* Niks om jou in te sit en geen werk nie — maar 'n skuldberader kry
         die ou rekeninge afgeskryf, en dan het jy weer krediet-ruimte om
         jouself uit te werk. */
      var af = -s.geld; s.geld = 0; s.geluk = klem(s.geluk + tussen(5,12));
      noteer('’n Skuldberader by ’n NGO het jou ' + geld(af) +
        ' se ou rekeninge laat afskryf. Jy begin met ’n skoon blad.','goed');
      return;
    }
  }
  /* Het jy self genoeg bymekaargekry, vra die spel of jy wil intrek. */
  if(s.geld >= dakUitKoste()) vraDakTerug();
}
/* Werk deur 'n skuiling — een van die paaie uit. Gee terug of dit
   geluk het. 'wie' is net die naam in die log-reel. */
function skuilingWerk(wie){
  if(s.beroep) return false;
  var oop = BEROEPE.filter(function(j){
    return DAKLOOS_WERKE.indexOf(j.id)>=0 && !werkVereis(j); });
  if(!oop.length) return false;
  var j = kies(oop);
  s.beroep = {id:j.id, t:j.t, basis:j.s, salaris:j.s, vlak:0,
    prestasie:tussen(40,62), jare:0, k:j.k};
  s.beroepeGehad.push(j.t);
  s.geluk = klem(s.geluk + tussen(10,18));
  noteer(wie + ' het jou by ’n werk gekry: ' + j.t + ' teen ' + geld(j.s) +
    ' per jaar. Nou kan jy weer ’n plek bekostig.','werk');
  maakKollegas();
  return true;
}

/* Genoeg geld vir 'n deposito: waar trek jy in? */
function vraDakTerug(){
  if(s.gedoen.dakTerug) return;
  var opsies = [];
  dakTrappe().forEach(function(p){
    var koste = dakIntrekKoste(p.id);
    if(koste > s.geld) return;
    opsies.push({t:'Trek in: ' + p.n.toLowerCase(),
      sub:geld(koste) + ' vooruit · ' + p.sub,
      doen:function(){
        s.geld -= koste;
        uitDakloosheid(p.id, 'Jy het ' + geld(koste) + ' vooruit betaal en in ’n ' +
          p.n.toLowerCase() + ' ingetrek.');
      }});
  });
  if(!opsies.length) return;
  s.gedoen.dakTerug = 1;
  opsies.push({t:'Hou die geld nog ’n jaar', klas:'grys',
    sub:'Jy bly op straat, maar die geld bly joune', doen:function(){}});
  wagry.push({titel:'Jy het genoeg vir ’n deposito',
    vraag:'Jy het ' + geld(s.geld) + ' bymekaar. ’n Verhuurder sal jou inneem as jy ' +
      'die eerste jaar se huur en ’n deposito vooruit betaal.',
    opsies:opsies});
}

/* ---------- Verhoudings ---------- */
/* A10 — by 'n egskeiding word alles in die helfte verdeel: kontant,
   spaargeld, beleggings en bates. Is daar nie genoeg kontant nie, moet
   bates verkoop word om die skikking te betaal — die duurste eerste.
   B2 — 'n huis met 'n verband is net werd wat na die bank oorbly.
   Die pensioenfonds bly buite rekening.
   Gee terug hoeveel die skikking jou gekos het. */
function skeiVerdeel(naam){
  var bateSom = 0;
  s.bates.forEach(function(b){ bateSom += b.waarde; });
  /* Die skikking is die helfte van wat julle saam opgebou het — skuld
     trek dus af. Is dit netto niks, is daar niks om te verdeel nie. */
  var helfte = Math.round((s.geld + (s.spaar||0) + s.belegging + bateSom - bondSkuld()) / 2);
  if(helfte<=0){ noteer('Daar was niks om te verdeel nie.','neutraal'); return 0; }

  var tekort = helfte - Math.max(0,s.geld) - (s.spaar||0) - s.belegging;
  if(tekort>0){
    s.bates.slice().sort(function(a,b){ return b.waarde - a.waarde; }).forEach(function(b){
      if(tekort<=0) return;
      var kry = verkoopBateUit(b, 1);
      tekort -= kry;
      noteer(b.n + ' is verkoop om die skikking te betaal (' + geld(kry) + ').','sleg');
    });
  }
  var uit = Math.min(Math.max(0,s.geld), helfte);
  s.geld -= uit;
  var oor = helfte - uit;
  if(oor>0 && s.spaar>0){
    var uitS = Math.min(s.spaar, oor);
    s.spaar -= uitS; uit += uitS; oor -= uitS;
    if(uitS>0) noteer('Die helfte van jou spaargeld (' + geld(uitS) + ') is oorgedra.','sleg');
  }
  if(oor>0){
    var uitB = Math.min(s.belegging, oor);
    s.belegging -= uitB; uit += uitB;
    if(uitB>0) noteer('Die helfte van jou beleggings (' + geld(uitB) + ') is oorgedra.','sleg');
  }
  noteer(naam + ' het ' + geld(uit) + ' uit die skikking gekry.','sleg');
  return uit;
}
function verhoudingsJaar(){
  s.verhoudings.forEach(function(v){
    if(!v.lewe) return;
    v.ouderdom++; v.raak = 0;
    var verval = (v.tipe==='klasmaat'||v.tipe==='kollega'||v.tipe==='baas') ? tussen(0,4) : tussen(0,3);
    v.band = klem(v.band - verval);
    var p = 0;
    if(v.ouderdom>62) p = (v.ouderdom-62)*0.45;
    if(v.ouderdom>85) p += (v.ouderdom-85)*2.6;
    if(kans(p)){
      v.lewe = false;
      if(v.tipe==='seun'||v.tipe==='dogter') s.kinders = Math.max(0, s.kinders-1);
      noteer(v.naam + ' (' + rol(v) + ') is oorlede op ouderdom ' + v.ouderdom + '.','sleg');
      s.geluk = klem(s.geluk - (v.tipe==='ma'||v.tipe==='pa'||v.tipe==='eggenoot' ? tussen(18,32) : tussen(6,16)));
      if(v.tipe==='ma'||v.tipe==='pa'||v.tipe==='eggenoot'){
        var erf = Math.round(tussen(0,220000) * s.rykf);
        if(erf>2000){ s.geld += erf; noteer('Jy het ' + geld(erf) + ' geerf.','geld'); }
      }
      return;
    }
    if(v.tipe==='eggenoot' && v.band<22 && kans(16)){
      v.tipe='vriend'; v.band=klem(v.band-10); s.geluk=klem(s.geluk-20);
      noteer(v.naam + ' het van jou geskei.','sleg');
      skeiVerdeel(v.naam);
    }
    if(v.tipe==='lief' && v.band<18 && kans(22)){
      v.tipe='vriend'; s.geluk=klem(s.geluk-13);
      noteer(v.naam + ' het die verhouding verbreek.','sleg');
    }
    if(v.tipe==='vriend' && v.band<=0 && kans(22)){
      v.weg=true;
      noteer('Jy en ' + v.naam + ' het heeltemal uitmekaar gedryf.','neutraal');
    }
    if((v.tipe==='seun'||v.tipe==='dogter') && v.ouderdom===18){
      noteer(v.naam + ' het matriek klaargemaak en huis verlaat.','goed'); s.geluk=klem(s.geluk+6);
    }
  });
  s.verhoudings = s.verhoudings.filter(function(v){ return !v.weg; });
  /* nuwe boetie of sussie */
  var ma = s.verhoudings.filter(function(v){ return v.tipe==='ma' && v.lewe; })[0];
  if(ma && s.ouderdom>=2 && s.ouderdom<=11 && ma.ouderdom<43 && kans(9)){
    var b = nuweMens(null, 0, s.van);
    b.tipe = b.geslag==='m' ? 'broer' : 'suster'; b.band = tussen(50,90);
    s.verhoudings.push(b);
    noteer('Jou ma het ’n baba gekry: ' + b.naam + ' is jou nuwe ' + rol(b).toLowerCase() + '.','goed');
  }
  troeteldierJaar();
}

/* ---------- Troeteldiere ---------- */
function troeteldierJaar(){
  if(!s.diere) s.diere=[];
  s.diere.slice().forEach(function(d){
    d.ouderdom++; d.band = klem(d.band - tussen(0,5));
    var p = d.ouderdom > d.maks ? 55 : (d.ouderdom > d.maks-2 ? 18 : 1);
    if(kans(p)){
      s.diere = s.diere.filter(function(x){ return x!==d; });
      s.geluk = klem(s.geluk - tussen(10,22));
      noteer(d.naam + ' die ' + d.soort.toLowerCase() + ' is oorlede op ' + d.ouderdom + ' jaar.','sleg');
    } else if(kans(14)){
      s.geluk = klem(s.geluk + tussen(2,7));
      noteer(d.naam + ' het jou die hele jaar geselskap gehou.','goed');
    }
  });
}

/* ---------- Tronk ---------- */
function tronkJaar(){
  if(!s.tronk) return;
  s.tronk.gedien++;
  s.tronkJare = (s.tronkJare||0) + 1;   /* elke jaar tel, ook die jaar waarin jy vrykom */
  if(s.tronk.gedien >= s.tronk.jare){
    s.tronk = null; s.geluk = klem(s.geluk+16);
    noteer('Jy is uit die tronk vrygelaat. ’n Nuwe begin.','goed');
    if(s.skool.agter && !s.skool.uit && s.skool.vlak!=='klaar')
      noteer('Jy is ' + s.skool.agter + ' jaar agter met skool. Jy begin weer waar jy opgehou het.','skool');
  } else {
    noteer('Jy sit tronk: jaar ' + s.tronk.gedien + ' van ' + s.tronk.jare + '.','misdaad');
  }
}
function tronkToe(jare, waarvoor){
  s.tronk = {jare:jare, gedien:0};
  s.rekord.push(waarvoor);
  noteer('Jy is gevonnis tot ' + jare + ' jaar in die tronk vir ' + waarvoor + '.','misdaad');
  if(s.beroep){
    noteer('Jy het jou werk as ' + beroepTitel() + ' verloor.','werk');
    s.beroep = null; losWerkMense();
  }
  if(s.skool.vlak==='universiteit'||s.skool.vlak==='nagraads'){
    noteer('Jou studies in ' + s.skool.studie + ' is gestaak.','sleg');
    s.skool.vlak='klaar'; s.skool.studie=null;
  }
}

/* ---------- Lukrake gebeure ---------- */
function lukrakeGebeure(){
  if(s.ouderdom<1) return;
  var geskik = GEBEURE.filter(function(g){
    return s.ouderdom>=g.min && s.ouderdom<=g.max && (!g.as || g.as());
  });
  if(!geskik.length) return;
  var hoeveel = s.tronk ? 1 : (kans(32) ? 2 : 1);
  var gebruik = [];
  for(var i=0;i<hoeveel;i++){
    var g = kies(geskik);
    if(gebruik.indexOf(g)>=0) continue;
    gebruik.push(g);
    if(g.vraag) wagry.push(g);
    else { var r = g.doen(); if(r) noteer(r[0], r[1]); }
  }
}

function speelWagry(klaar){
  if(!s.lewe){ wagry=[]; sluitModaal(); wysGrafskrif(); return; }
  if(!wagry.length){ sluitModaal(); if(klaar) klaar(); return; }
  var g = wagry.shift();
  var opsies = (g.opsies||[{t:'OK'}]).map(function(o){
    return { t:o.t, sub:o.sub, klas:o.klas, doen:function(){
      if(o.doen) o.doen();
      renderKop(); speelWagry(klaar);
    }};
  });
  wysModaal(g.titel||'Lewe gebeur', g.vraag||g.teks, opsies);
}

/* ---------- Dood ---------- */
var SIEKTES=['longontsteking','hartversaking','’n lang siekte','orgaanversaking','swak gesondheid'];
var OORSAKE=['ouderdom','’n hartaanval','’n beroerte','longontsteking','natuurlike oorsake'];
var ONGELUKKE=['’n motorongeluk','’n val van ’n leer','’n swemongeluk',
  '’n blitsslag','’n ongeluk met ’n braaidrom','’n haaiaanval'];

function doodKontrole(){
  if(s.gesondheid<=0){ sterf(kies(SIEKTES)); return; }
  var p = 0, o = s.ouderdom;
  if(o>58) p += (o-58)*0.32;
  if(o>80) p += (o-80)*1.4;
  if(o>95) p += (o-95)*4;
  p *= (1 + (70 - s.gesondheid)/90);
  if(p>0 && kans(p)){ sterf(kies(OORSAKE)); return; }
  if(kans(0.09 + (s.tronk?0.3:0))){ sterf(kies(ONGELUKKE)); return; }
}
function sterf(oorsaak){
  s.lewe = false; s.oorsaak = oorsaak;
  noteer('Jy is oorlede op ouderdom ' + s.ouderdom + ' weens ' + oorsaak + '.','sleg');
  geskiedenisBy(); stoor();
}

