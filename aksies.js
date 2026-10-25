/* ==========================================================================
   7. AKSIES
   Alles wat die speler self kies om te doen: aktiwiteite, misdaad, werk,
   studie, bates en beleggings, verhoudings, troeteldiere.
   ========================================================================== */

var AKTIWITEITE=[
  /* --- Liggaam en gees --- */
  {id:'gim', g:'Liggaam en gees', n:'Gaan gimnasium', e:'\u{1F3CB}', koste:1200, min:14, maks:1,
   doen:function(){ s.gesondheid=klem(s.gesondheid+tussen(4,10)); s.voorkoms=klem(s.voorkoms+tussen(0,3));
     return ['Jy het die jaar gereeld gym toe gegaan.','goed']; }},
  {id:'draf', g:'Liggaam en gees', n:'Draf in die bos', e:'\u{1F3C3}', koste:0, min:8, maks:1,
   doen:function(){ s.gesondheid=klem(s.gesondheid+tussen(2,6)); s.geluk=klem(s.geluk+2);
     return ['Jy het gereeld in die bos gaan draf.','goed']; }},
  /* F1/F2 — die doktersbesoek is nou 'n diagnose: hy vang 'n chroniese
     toestand vroeg, en 'n mediese fonds maak die konsultasie goedkoper. */
  {id:'dokter', g:'Liggaam en gees', n:'Maak \u2019n doktersafspraak', e:'\u{1FA7A}', min:1, maks:1,
   ouers:true, koste:850,
   kosteTeks:'R850 \u00b7 jou fonds of jou ouers kan dit dek',
   doen:function(){
     /* Is daar iets wat onbehandeld loop, is dit waaroor hy wil praat. */
     var los = (s.siektes||[]).filter(function(x){ return !x.behandel; })[0];
     if(los){
       var tt = toestandVan(los.id);
       vraBehandeling(los);
       return ['Die dokter het oor ' + tt.n.toLowerCase() + ' met jou gepraat.','neutraal'];
     }
     /* Niks verkeerd nie? Dan is dit 'n ondersoek wat iets kan oplig. */
     if(s.ouderdom>=35 && kans(14)){
       var kan = TOESTANDE.filter(function(x){
         return x.soort==='chronies' && toestandGewig(x)>0; });
       var vind = kiesGeweeg(kan, toestandGewig);
       if(vind){ kryToestand(vind.id, '\u2014 die dokter het dit vroeg gevang');
         return ['Die ondersoek het iets opgetel.','sleg']; }
     }
     var w = s.gesondheid<55 ? tussen(9,20) : tussen(3,9);
     s.gesondheid=klem(s.gesondheid+w);
     return ['Die dokter het jou nagekyk. Gesondheid +' + w + '.','goed']; }},
  {id:'tandarts', g:'Liggaam en gees', n:'Gaan tandarts toe', e:'\u{1F9B7}', koste:1600, min:4, maks:1,
   ouers:true, kosteTeks:'R1 600 \u00b7 jou ouers betaal solank jy \u2019n kind is',
   doen:function(){ s.voorkoms=klem(s.voorkoms+tussen(1,5)); s.gesondheid=klem(s.gesondheid+1);
     return ['Jou tande is skoon en reguit.','goed']; }},
  {id:'mediteer', g:'Liggaam en gees', n:'Mediteer', e:'\u{1F9D8}', koste:0, min:8, maks:1,
   doen:function(){ s.geluk=klem(s.geluk+tussen(4,9));
     return ['Jy het leer stil sit. Jou kop is helderder.','goed']; }},
  {id:'lees', g:'Liggaam en gees', n:'Lees \u2019n boek', e:'\u{1F4DA}', koste:0, min:6, maks:1,
   kosteTeks:'Gratis \u00b7 jy kies die boek', vloei:leesVloei},
  {id:'chirurgie', g:'Liggaam en gees', n:'Plastiese chirurgie', e:'\u{1F485}', koste:85000, min:18, maks:1,
   doen:function(){ if(kans(16)){ s.voorkoms=klem(s.voorkoms-12); s.gesondheid=klem(s.gesondheid-10);
       return ['Die operasie het verkeerd gegaan. Jy lyk erger.','sleg']; }
     s.voorkoms=klem(s.voorkoms+tussen(8,22)); s.geluk=klem(s.geluk+6);
     return ['Die chirurg het goeie werk gedoen.','goed']; }},

  /* --- Pret --- */
  {id:'fliek', g:'Pret', n:'Gaan fliek', e:'\u{1F37F}', min:6, maks:1,
   kosteTeks:'Jy kies die fliek en wie saamgaan', vloei:fliekVloei},
  {id:'kuier', g:'Pret', n:'Gaan kuier by iemand', e:'\u{1F389}', min:8, maks:2,
   kosteTeks:'R350 \u00b7 jy kies by wie', vloei:kuierVloei},
  {id:'vakansie', g:'Pret', n:'Gaan op vakansie', e:'\u{1F334}', min:8, maks:1,
   kosteTeks:'Jy kies die bestemming en wie saamgaan', vloei:vakansieVloei},

  /* --- Gesin --- */
  {id:'sakgeld', g:'Gesin', n:'Vra jou ouers vir geld', e:'\u{1F64F}', min:5, maks:2,
   kosteTeks:'Hulle se nie altyd ja nie', as:function(){ return s.ouderdom<26 && lewendeOuers().length>0; },
   vloei:vraGeldVloei},

  /* --- Skool --- */
  {id:'studeer', g:'Skool', n:'Studeer harder', e:'\u{1F4D6}', koste:0, min:6, maks:1,
   as:function(){ return ['laerskool','hoerskool','universiteit','nagraads'].indexOf(s.skool.vlak)>=0; },
   doen:function(){ s.slim=klem(s.slim+tussen(4,9)); s.geluk=klem(s.geluk-4);
     /* C9 — op universiteit is dit die ywer waarop jou slaagkans hang. */
     if(studeerTans()) s.skool.ywer = 1;
     return ['Jy het laat gestudeer. Dit sal betaal.','skool']; }},
  {id:'bank_klas', g:'Skool', n:'Bank die klas', e:'\u{1F60E}', koste:0, min:13, maks:1,
   as:function(){ return s.skool.vlak==='hoerskool'; },
   doen:function(){ s.geluk=klem(s.geluk+7); s.slim=klem(s.slim-4);
     if(kans(35)) { s.geluk=klem(s.geluk-12); return ['Jy is gevang terwyl jy klas gebank het. Detensie.','sleg']; }
     return ['Jy het klas gebank en niemand het dit agtergekom nie.','neutraal']; }},

  /* --- Vaardighede en stokperdjies (H3) --- */
  /* Een inskrywing wat die hele lys oopmaak: jy kan twee vaardighede
     per jaar oefen, en elkeen vra sy eie geld (of jou ouers se geld). */
  {id:'vaardig', g:'Vaardighede', n:'Oefen ’n vaardigheid', e:'\u{1F3AF}',
   min:6, maks:VAARDIG_PER_JAAR,
   kosteTeks:'Jy kies watter een \u00b7 twee per jaar \u00b7 \u2019n kind kan sy ouers vra',
   as:function(){ return !s.tronk; }, vloei:vaardigheidVloei},

  /* --- Geld --- */
  /* Lotto is doelbewus 'n slegte belegging: oor baie kere verloor jy
     geld. Die prysstruktuur hier gee jou ongeveer R18 terug vir elke R30
     wat jy inbetaal \u2014 net soos die regte ding. */
  {id:'lotto', g:'Geld', n:'Koop \u2019n Lotto-kaartjie', e:'\u{1F39F}', koste:30, min:18, maks:5,
   kosteTeks:'R30 \u00b7 jackpot-kans \u00b1 1 uit 2 miljoen \u00b7 hoogstens 5 kaartjies per jaar',
   doen:function(){
     if(kans(0.00005)){ var j=tussen(9000000,45000000); s.geld+=j; s.geluk=klem(s.geluk+40);
       return ['JY HET DIE LOTTO GEWEN! ' + geld(j) + '!!','geld']; }
     if(kans(0.004)){ var v=tussen(12000,70000); s.geld+=v; s.geluk=klem(s.geluk+12);
       return ['Vyf nommers reg! ' + geld(v) + ' op die Lotto.','geld']; }
     if(kans(0.1)){ var h=tussen(500,2500); s.geld+=h;
       return ['Vier nommers reg: ' + geld(h) + ' op die Lotto.','geld']; }
     if(kans(1.5)){ var k=tussen(50,150); s.geld+=k;
       return ['Drie nommers reg: ' + geld(k) + '. Net genoeg vir \u2019n koffie.','geld']; }
     return ['Geen nommers reg nie. Volgende keer weer.','neutraal']; }},
  /* Fase 7 — die casino is nou vier mini-spele (minispel.js). Jy koop
     chips, speel self of laat dit vinnig gebeur, en stap weg wanneer jy wil. */
  {id:'casino', g:'Geld', n:'Gaan casino toe', e:'\u{1F3B2}', min:18, maks:3,
   kosteTeks:function(){ return casinoTeks(); },
   as:function(){ return !s.tronk; }, vloei:function(){ casinoVloei(); }}
];

function doenAkt(id){
  var a = null;
  AKTIWITEITE.forEach(function(x){ if(x.id===id) a=x; });
  if(!a || !s.lewe) return;
  if(s.ouderdom < a.min){ wenk('Jy is te jonk daarvoor.'); return; }
  if(a.maks && (s.gedoen[id]||0) >= a.maks){ wenk('Jy het dit al vanjaar gedoen.'); return; }
  if(a.as && !a.as()){ wenk('Dit is nie nou vir jou moontlik nie.'); return; }
  if(a.vloei){ a.vloei(); return; }
  betaalEnDoen(a.koste||0, a.n, function(){
    s.gedoen[id] = (s.gedoen[id]||0) + 1;
    var r = a.doen();
    if(r){ noteer(r[0], r[1]); wenk(r[0]); }
    sluitModaal(); stoor(); renderAlles();
    /* Het die aktiwiteit 'n vraag opgelewer (soos die dokter se
       behandelingskeuse), vra dit nou en nie eers volgende jaar nie. */
    if(wagry.length) speelWagry(function(){ stoor(); renderAlles(); });
  }, a.ouers);
}
function klaarAkt(id, teks, soort){
  s.gedoen[id] = (s.gedoen[id]||0) + 1;
  noteer(teks, soort||'neutraal'); wenk(teks);
  sluitModaal(); stoor(); renderAlles();
}

/* ---------- Aktiwiteite met keuses ---------- */
function leesVloei(){
  kiesLys('Watter boek?','Kies iets om vanjaar te lees:', BOEKE.map(function(b){
    return {t:b.n, sub:b.a, doen:function(){
      s.slim = klem(s.slim + b.slim); s.geluk = klem(s.geluk + b.geluk);
      klaarAkt('lees','Jy het "' + b.n + '" gelees.', b.slim>=6?'skool':'goed');
    }};
  }));
}
/* ==========================================================================
   H3 — OEFEN 'N VAARDIGHEID
   Die vloei agter die "Oefen 'n vaardigheid"-aktiwiteit. Jy sien al die
   vaardighede wat jou ouderdom toelaat, met jou vlak by elkeen, en wat
   die volgende vlak gaan oopmaak. Die geld loop deur betaalEnDoen(),
   dus kan 'n kind sy ouers vra om vir die klasse te betaal.
   ========================================================================== */
function vaardigheidVloei(){
  var opsies = [];
  /* Die wat jy al begin het, staan eerste — dit is waar jy wil aanhou. */
  var lys = VAARDIGHEDE.slice().sort(function(a,b){
    return (vaardigVlak(b.id) - vaardigVlak(a.id)) || (a.g < b.g ? -1 : 1); });
  lys.forEach(function(x){
    if(s.ouderdom < x.min) return;
    if(s.gedoen['v_'+x.id]) return;              /* nie twee keer dieselfde jaar nie */
    var v = vaardigVlak(x.id);
    var sub = (v ? 'Vlak ' + v + ' van 5 \u00b7 jy ' + x.vlakke[v] : x.sub) +
      ' \u00b7 ' + geld(x.koste) + ' vir die jaar';
    opsies.push({t:x.e + '  ' + x.n + (v ? '  \u2605' + v : ''), sub:sub, doen:function(){
      betaalEnDoen(x.koste, x.n, function(){
        s.gedoen['v_'+x.id] = 1;
        var r = oefenJaar(x.id);
        var teks = r && r.opgeklim
          ? 'Jy het ’n jaar lank ' + x.n.toLowerCase() + ' geoefen \u2014 jy ' + r.naam + '.'
          : 'Jy het ’n jaar lank ' + x.n.toLowerCase() + ' geoefen.';
        klaarAkt('vaardig', teks, r && r.opgeklim ? 'goed' : 'neutraal');
      }, false);
    }});
  });
  if(!opsies.length){ wenk('Daar is nie nou ’n vaardigheid om te oefen nie.'); return; }
  kiesLys('Vaardighede en stokperdjies',
    'Elke jaar se oefening bou punte op; vyf vlakke en elke vlak maak iets oop. ' +
    'Laat jy dit jare lank lê, roes dit.', opsies);
}

/* ==========================================================================
   H4 — JOU EIE BESIGHEID
   Die knoppies op die Werk-blad: begin, bemark, huur, koop toerusting,
   verkoop of maak toe. Die jaar self loop in besigheidJaar() (lewe.js).
   ========================================================================== */
function besigheidVereis(x){
  if(s.besigheid) return 'Jy loop al ’n besigheid';
  if(s.tronk) return 'Jy is in die tronk';
  if(vlugToe() && x.id!=='smous') return vlugToe() + ' kan jy niks registreer nie';
  if(s.dakloos && x.id!=='smous') return 'Sonder ’n adres begin niemand so iets nie';
  if(s.ouderdom < x.min) return 'Jy moet ' + x.min + ' jaar oud wees';
  if(s.swartlys>0 && x.kapitaal>100000) return 'Jy is gelys — niemand gee jou krediet nie';
  if(s.geld < x.kapitaal) return 'Jy het ' + geld(x.kapitaal) + ' kontant nodig';
  return null;
}
function wysBesighede(){
  var opsies = [];
  BESIGHEDE.forEach(function(x){
    var rede = besigheidVereis(x);
    var vv = x.vaardig ? vaardigVlak(x.vaardig) : 0;
    var sub = x.sub + ' \u00b7 ' + geld(x.kapitaal) + ' om te begin, ' +
      geld(x.vaste) + ' vaste koste per jaar';
    if(x.vaardig) sub += ' \u00b7 ' + (vv ? 'jou ' + vaardigVan(x.vaardig).n.toLowerCase() +
      ' is vlak ' + vv : 'sonder ' + vaardigVan(x.vaardig).n.toLowerCase() + ' is dit swaar');
    if(rede){ sub = rede + ' \u00b7 ' + sub; }
    opsies.push({t:x.e + '  ' + x.n, sub:sub, klas: rede ? 'grys' : '', doen:function(){
      if(rede){ wenk(rede + '.'); return; }
      bevestigBesigheid(x);
    }});
  });
  kiesLys('Begin jou eie besigheid',
    'Jou eie ding is ’n egte alternatief vir ’n werk: die wins is joune en dit word ' +
    'soos ’n salaris belas — maar ’n verlies kom uit jou eie sak, en drie verliesjare ' +
    'agtermekaar maak dit toe.', opsies);
}
function bevestigBesigheid(x){
  var vv = x.vaardig ? vaardigVlak(x.vaardig) : 0;
  wysModaal(x.n, 'Dit kos ' + geld(x.kapitaal) + ' om te begin en ' + geld(x.vaste) +
    ' per jaar om oop te hou, of jy kliënte het of nie. Een kliënt bring ' +
    geld(x.waarde[0]) + ' tot ' + geld(x.waarde[1]) + ' per jaar in, en jy kan ' +
    x.basis + ' ' + x.wat + ' alleen hanteer.' +
    (x.vaardig && !vv ? '\n\nJy het geen ' + vaardigVan(x.vaardig).n.toLowerCase() +
      ' nie. Dit kan werk, maar jy gaan stadig groei.' : ''),
    [{t:'Begin dit', klas:'groen', doen:function(){ beginBesigheid(x.id); }},
     {t:'Nog nie', klas:'grys', doen:function(){ sluitModaal(); }}]);
}
function beginBesigheid(id){
  var x = besigheidSoort(id);
  if(!x) return;
  var rede = besigheidVereis(x);
  if(rede){ wenk(rede + '.'); sluitModaal(); return; }
  s.geld -= x.kapitaal;
  s.besigheid = {id:x.id, n:x.n, naam:besigheidNaam(x), kliente:0, werkers:0, span:[],
    bemarking:0, toerusting:0, jare:0, omset:0, koste:0, wins:0, verliesJare:0,
    totaalWins:0, beste:0, kapitaalIn:x.kapitaal};
  s.geluk = klem(s.geluk + tussen(8,16));
  stelVlag('besigheidBegin', {n:s.besigheid.naam});
  noteer('Jy het ' + s.besigheid.naam + ' begin (' + x.n.toLowerCase() + ') vir ' +
    geld(x.kapitaal) + '.','werk');
  wenk(s.besigheid.naam + ' is oop!');
  sluitModaal(); stoor(); renderAlles();
}
function besigAksie(wat, waarde){
  var b = s.besigheid;
  if(!b){ wenk('Jy het nie ’n besigheid nie.'); return; }
  var x = besigheidSoort(b.id);
  if(wat==='bemark'){
    var bedrag = Number(waarde)||0;
    if(bedrag > s.geld + s.spaar){ wenk('Jy het nie ' + geld(bedrag) + ' nie.'); return; }
    b.bemarking = bedrag;
    noteer('Jy het ' + (bedrag ? geld(bedrag) + ' vir bemarking opsy gesit'
      : 'die bemarking gestop') + ' by ' + b.naam + '.','werk');
    wenk(bedrag ? 'Bemarking: ' + geld(bedrag) + ' per jaar' : 'Geen bemarking nie');
  }
  else if(wat==='huur'){
    if(s.geld < x.loon*0.25){ wenk('Jy kan nie nou ’n loon bekostig nie.'); return; }
    var p = huurWerkerIn();
    noteer(p.naam + ' ' + p.van + ' werk nou by ' + b.naam + ' teen ' + geld(x.loon) +
      ' per jaar. Julle kan nou ' + Math.round(besigheidKapasiteit()) + ' ' + x.wat +
      ' hanteer.','werk');
    wenk(p.naam + ' is aangestel.');
  }
  else if(wat==='ontslaan'){
    if(!(b.span||[]).length){ wenk('Jy het nie werkers nie.'); return; }
    var kiesl = b.span.map(function(p, i){
      return {t:p.naam + ' ' + p.van, sub:(p.jare||0) + ' jaar by ' + b.naam +
        ' \u00b7 ' + geld(x.loon) + ' per jaar', doen:function(){
        b.span.splice(i,1); b.werkers = b.span.length;
        s.geluk = klem(s.geluk - tussen(2,7));
        noteer('Jy het ' + p.naam + ' by ' + b.naam + ' laat gaan.','werk');
        sluitModaal(); stoor(); renderAlles();
      }};
    });
    kiesLys('Wie moet gaan?', 'Dit sny die loonrekening, maar ook wat julle kan hanteer.', kiesl);
    return;
  }
  else if(wat==='toerusting'){
    var som = Number(waarde)||0;
    if(s.geld < som){ wenk('Jy het nie ' + geld(som) + ' nie.'); return; }
    s.geld -= som;
    b.toerusting = (b.toerusting||0) + som;
    noteer('Jy het ' + geld(som) + ' se toerusting vir ' + b.naam + ' gekoop. ' +
      'Julle kan nou ' + Math.round(besigheidKapasiteit()) + ' ' + x.wat + ' hanteer.','geld');
    wenk('Kapasiteit: ' + Math.round(besigheidKapasiteit()) + ' ' + x.wat);
  }
  else if(wat==='verkoop'){
    var prys = besigheidWaarde();
    wysModaal('Verkoop ' + b.naam + '?',
      (b.wins>0 ? 'Iemand bied ' + geld(prys) + ' \u2014 ongeveer ' + BESIG_VERKOOP +
        ' keer verlede jaar se wins van ' + geld(b.wins) + '.'
        : 'Die besigheid maak nie wins nie, dus bied niemand meer as ' + geld(prys) +
          ' vir die toerusting nie.') + '\n\nDit is onomkeerbaar.',
      [{t:'Verkoop vir ' + geld(prys), klas:'rooi', doen:function(){
        sluitBesigheid('toe jy dit verkoop het');
        sluitModaal(); stoor(); renderAlles(); }},
       {t:'Hou dit', klas:'grys', doen:function(){ sluitModaal(); }}]);
    return;
  }
  else if(wat==='sluit'){
    wysModaal('Maak ' + b.naam + ' toe?',
      'Jy kry net ' + geld(Math.round((b.toerusting||0)*BESIG_TOE_F)) +
      ' vir die toerusting terug. Dit is onomkeerbaar.',
      [{t:'Maak toe', klas:'rooi', doen:function(){
        var kry = Math.round((b.toerusting||0)*BESIG_TOE_F);
        s.geld += kry;
        noteer(b.naam + ' het toegemaak. Jy het ' + geld(kry) + ' vir die toerusting gekry.','sleg');
        s.besighedeGehad.push({n:b.naam, jare:b.jare||0, einde:'toe'});
        s.besigheid = null;
        sluitModaal(); stoor(); renderAlles(); }},
       {t:'Hou aan', klas:'grys', doen:function(){ sluitModaal(); }}]);
    return;
  }
  sluitModaal(); stoor(); renderAlles();
}
/* Die bemarkingsbegroting as 'n keuselys, want dit is vier vaste keuses. */
function wysBemarking(){
  var b = s.besigheid; if(!b) return;
  kiesLys('Bemarking per jaar',
    'Bemarking bring kliënte: elke R10 000 bring ongeveer ' + BESIG_BEMARK_F +
    ' nuwe kliënte by. Dit is deel van jou koste, ook in ’n slegte jaar.',
    BESIG_BEMARK.map(function(v){
      return {t: v ? geld(v) + ' per jaar' : 'Niks \u2014 net mond-tot-mond',
        sub: (b.bemarking===v ? 'dit is wat jy nou doen' : ''),
        doen:function(){ besigAksie('bemark', v); }};
    }));
}
function wysToerusting(){
  var b = s.besigheid; if(!b) return;
  var x = besigheidSoort(b.id);
  kiesLys('Koop toerusting',
    'Toerusting lig jou kapasiteit: elke R100 000 laat julle ongeveer ' +
    Math.round(BESIG_TOERUSTING*100) + '% meer ' + x.wat + ' hanteer. Jy het nou ' +
    geld(b.toerusting||0) + ' se toerusting.',
    [25000, 100000, 400000].filter(function(v){ return s.geld >= v; }).map(function(v){
      return {t:geld(v), sub:'kontant, nou', doen:function(){ besigAksie('toerusting', v); }};
    }));
}

/* Kinders onder 13 en pensioenarisse betaal 'n kinderkaartjie. */
function kaartjiePrys(f, ouderdom){
  return (ouderdom<13 || ouderdom>=60) ? f.kinderPrys : f.koste;
}
/* Onder 13 mag jy nie alleen fliek of op vakansie gaan nie \u2014 'n grootmens
   moet saamgaan. Dit geld ook vir wie in die lys van maats mag wees. */
function teJonkAlleen(){ return s.ouderdom < 13; }
function grootmensFilter(v){ return saamFilter(v) && v.ouderdom>=18; }
function saamgaanFilter(){ return teJonkAlleen() ? grootmensFilter : saamFilter; }
function geenGrootmens(){
  return !s.verhoudings.some(function(v){ return v.lewe && grootmensFilter(v); });
}
function fliekVloei(){
  kiesLys('Watter fliek?','Wat gaan jy kyk?', FLIEKS.map(function(f){
    var mag = s.ouderdom >= (f.ouderdomsbeperking||0);
    return {t:f.n, klas: mag?'':'grys',
      sub: geld(kaartjiePrys(f, s.ouderdom)) + ' vir jou kaartjie \u00b7 ' +
        (f.ouderdomsbeperking ? f.ouderdomsbeperking + ' jaar en ouer' : 'alle ouderdomme'),
      doen:function(){
        if(!mag){ wenk('Dit is \u2019n ' + f.ouderdomsbeperking +
          '-fliek. Hulle laat jou nie in nie.'); return; }
        fliekMaat(f);
      }};
  }));
}
function fliekMaat(f){
  if(teJonkAlleen() && geenGrootmens()){
    wenk('Jy is te jonk om alleen te gaan, en daar is nie \u2019n grootmens wat kan saamgaan nie.');
    return;
  }
  var teks = teJonkAlleen() ? 'Jy is te jonk om alleen te gaan \u2014 \u2019n grootmens moet saamgaan.'
    : 'Elke grootmens betaal sy eie kaartjie; vir \u2019n kind betaal jy.';
  kiesPersoon('Wie vat jy saam?', teks, saamgaanFilter(), function(v){
    /* Jy betaal jou eie kaartjie, en die van 'n kind wat jy saamvat.
       'n Grootmens wat saamgaan, betaal self. */
    var koste = kaartjiePrys(f, s.ouderdom) +
      (v && v.ouderdom<18 ? kaartjiePrys(f, v.ouderdom) : 0);
    betaalEnDoen(koste, 'die fliek', function(){
      s.geluk = klem(s.geluk + f.geluk + (v?4:0));
      if(f.slim) s.slim = klem(s.slim + f.slim);
      if(f.gesondheid) s.gesondheid = klem(s.gesondheid + f.gesondheid);
      if(v){ v.band = klem(v.band + tussen(5,12)); pasVriendskapAan(v); }
      klaarAkt('fliek','Jy het ' + f.n + ' gaan kyk' + (v ? ' saam met ' + v.naam : '') + '.','goed');
    });
  }, teJonkAlleen() ? false : undefined);
}
function vakansieVloei(){
  kiesLys('Waarheen?','Kies jou bestemming:', VAKANSIES.map(function(k){
    return {t:k.n, sub:geld(k.koste) + ' vir een persoon', doen:function(){ vakansieMaat(k); }};
  }));
}
function vakansieMaat(k){
  if(teJonkAlleen() && geenGrootmens()){
    wenk('Jy is te jonk om alleen te reis, en daar is nie \u2019n grootmens wat kan saamgaan nie.');
    return;
  }
  var teks = teJonkAlleen()
    ? 'Jy is te jonk om alleen te reis \u2014 \u2019n grootmens moet saamgaan.'
    : 'Iemand saamvat kos 80% meer, maar is baie lekkerder.';
  kiesPersoon('Wie gaan saam?', teks,
    saamgaanFilter(), function(v){
      betaalEnDoen(Math.round(k.koste * (v?1.8:1)), 'die vakansie', function(){
        s.geluk = klem(s.geluk + k.geluk + (v?5:0));
        if(k.gesondheid) s.gesondheid = klem(s.gesondheid + k.gesondheid);
        if(k.slim) s.slim = klem(s.slim + k.slim);
        if(k.voorkoms) s.voorkoms = klem(s.voorkoms + k.voorkoms);
        if(v){ v.band = klem(v.band + tussen(8,18)); pasVriendskapAan(v); }
        klaarAkt('vakansie','Jy was ' + k.n.toLowerCase() + (v ? ' saam met ' + v.naam : ' alleen') + '.','goed');
      });
  }, teJonkAlleen() ? false : undefined);
}
function kuierVloei(){
  kiesPersoon('By wie gaan kuier jy?','Kies iemand om tyd mee deur te bring:', saamFilter, function(v){
    betaalEnDoen(350, 'die kuier', function(){
      s.geluk = klem(s.geluk + tussen(4,10));
      v.band = klem(v.band + tussen(6,14));
      /* H3 — wie kan kook, braai of speel, is ’n beter gas. Die beste
         van die drie tel, nie al drie saam nie. */
      var ekstra = Math.max(vaardigVlak('kook'), vaardigVlak('braai'),
        vaardigVlak('klavier'), vaardigVlak('kitaar'));
      if(ekstra){
        v.band = klem(v.band + ekstra*2); s.geluk = klem(s.geluk + ekstra);
      }
      pasVriendskapAan(v);
      klaarAkt('kuier','Jy het by ' + v.naam + ' gaan kuier' +
        (ekstra>=3 ? ' — en die aand oorgeneem' : '') + '.','goed');
    });
  }, false);
}
function vraGeldVloei(){
  var ouers = lewendeOuers();
  if(!ouers.length){ wenk('Jou ouers is nie hier nie.'); return; }
  var bedrae = s.ouderdom<13 ? [50,200,500] : [200,1000,5000];
  var opsies = [];
  ouers.forEach(function(p){
    bedrae.forEach(function(b){
      opsies.push({t:'Vra ' + rol(p) + ' vir ' + geld(b), sub: p.naam + ' \u00b7 band ' + p.band + '%',
        doen:function(){
          var kansie = 58 + p.band/2.5 + (s.rykf-1)*8 - b/(s.rykf*140);
          if(kans(kansie)){ s.geld += b;
            klaarAkt('sakgeld', p.naam + ' het jou ' + geld(b) + ' gegee.','geld'); }
          else { s.geluk = klem(s.geluk-3); p.band = klem(p.band-1);
            klaarAkt('sakgeld', p.naam + ' het nee gese. "Geld groei nie aan bome nie."','sleg'); }
        }});
    });
  });
  kiesLys('Vra vir geld','Wie vra jy, en hoeveel?', opsies);
}

/* ---------- Misdaad ----------
   Fase 8 — die hele misdaadvloei (teiken, maat, voertuig, mini-spel,
   die heler, hitte en die hof) staan nou in misdaad.js. */

/* ---------- Tronk-aksies ---------- */
function tronkAksie(wat){
  if(!s.tronk) return;
  /* Fase 9 — die ontsnapping is nou 'n plan oor jare en 'n mini-spel (ontsnap.js). */
  if(wat==='ontsnap'){ ontsnapMenu(); return; }
  if((s.gedoen['t_'+wat]||0)>=1){ wenk('Een keer per jaar.'); return; }
  s.gedoen['t_'+wat]=1;
  if(wat==='oefen'){ s.gesondheid=klem(s.gesondheid+tussen(3,9));
    noteer('Jy het in die tronk se gimnasium gewerk.','neutraal'); }
  else if(wat==='lees'){ s.slim=klem(s.slim+tussen(3,8));
    noteer('Jy het die tronkbiblioteek leeggelees.','skool'); }
  else if(wat==='vriende'){ s.geluk=klem(s.geluk+tussen(3,8));
    noteer('Jy het vriende gemaak met die ouens in jou blok.','neutraal'); }
  stoor(); renderAlles();
}

/* ==========================================================================
   B18 — AKSIES OP STRAAT
   Presies soos tronkAksie(): 'n klein, beperkte stel keuses wat net
   bestaan terwyl s.dakloos aan is. Misdaad bly ook beskikbaar — dit haak
   by die gewone misdaadstelsel in.
   ========================================================================== */
function dakloosAksie(wat){
  if(!s.dakloos) return;
  var maks = {bedel:2, loswerk:2, skuiling:1, ngo:1, familie:1}[wat] || 1;
  if((s.gedoen['d_'+wat]||0) >= maks){
    wenk(maks>1 ? maks + ' keer per jaar is al wat jy uithou.' : 'Een keer per jaar.'); return; }
  s.gedoen['d_'+wat] = (s.gedoen['d_'+wat]||0) + 1;

  if(wat==='bedel'){
    var dae = tussen(BEDEL_DAE[0], BEDEL_DAE[1]);
    var in1 = Math.round(dae * tussen(BEDEL_DAG[0], BEDEL_DAG[1]) * (0.7 + s.voorkoms/200));
    s.geld += in1;
    s.geluk = klem(s.geluk - tussen(3,9));
    s.gesondheid = klem(s.gesondheid - tussen(0,3));
    noteer('Jy het ' + dae + ' dae by die verkeerslig gestaan en ' + geld(in1) +
      ' bymekaargemaak.','geld');
    wenk('Jy het ' + geld(in1) + ' gebedel.');
  }
  else if(wat==='loswerk'){
    if(s.gesondheid < 25){ wenk('Jy is te swak om te werk.'); return; }
    var d2 = tussen(LOSWERK_DAE[0], LOSWERK_DAE[1]);
    var in2 = Math.round(d2 * tussen(LOSWERK_DAG[0], LOSWERK_DAG[1]));
    s.geld += in2; s.totaalVerdien += in2;
    s.gesondheid = klem(s.gesondheid - tussen(2,7));
    s.geluk = klem(s.geluk + tussen(1,5));
    noteer('Jy het ' + d2 + ' dae se los werk gekry — tuinwerk, karwag, ’n vragmotor ' +
      'aflaai — en ' + geld(in2) + ' verdien.','geld');
    wenk('Los werk: ' + geld(in2));
  }
  else if(wat==='skuiling'){
    s.gesondheid = klem(s.gesondheid + tussen(3,9));
    s.geluk = klem(s.geluk + tussen(4,10));
    noteer('Jy het die winter by ’n skuiling geslaap: ’n bed, ’n warm bad en kos.','goed');
    /* Werk deur ’n skuiling — een van die paaie uit. Met ’n NGO agter jou
       naam staan die deur verder oop. */
    if(kans(s.dakloos.ngo ? 30 : 12) && skuilingWerk('Die skuiling'))
      wenk('Die skuiling het jou werk gekry!');
    else wenk('Jy het by ’n skuiling geslaap.');
  }
  else if(wat==='ngo'){
    if(s.dakloos.ngo){ wenk('Jy is al aangemeld.'); return; }
    if(vlugToe()){ wenk('Die NGO wil jou ID-nommer hê — en dit is op die polisie se lys.'); return; }
    s.dakloos.ngo = true;
    s.geluk = klem(s.geluk + tussen(3,8));
    noteer('Jy het by ’n NGO aangemeld. Hulle het jou gehelp om ’n ID te kry en ' +
      'gee jou hul adres om op aansoekvorms te skryf.','goed');
    wenk('Aangemeld. Werk kry word makliker.');
  }
  else if(wat==='familie'){
    var lys = familieHelpers();
    if(!lys.length){ wenk('Daar is niemand om te vra nie.'); return; }
    kiesLys('Wie gaan jy vra?','’n Sterk band maak die verskil. Vra jy iemand wat jou ' +
      'kwalik neem, maak dit net erger.', lys.slice(0,8).map(function(v){
      return {t:v.naam + ' ' + v.van, sub:rol(v) + ' · band ' + v.band + '%',
        doen:function(){ vraFamilieHulp(v); }};
    }));
    return;
  }
  stoor(); renderAlles();
}
function vraFamilieHulp(v){
  sluitModaal();
  if(v.band >= DAKLOOS_FAMILIE_BAND && kans(v.band)){
    familieTrekJouIn(v);
    wenk(v.naam + ' het jou ingetrek.');
  } else if(kans(v.band)){
    var hulp = Math.round(tussen(1500, 9000) * (0.5 + v.band/100));
    s.geld += hulp; v.band = klem(v.band - tussen(2,8));
    noteer(v.naam + ' kon jou nie inneem nie, maar het ' + geld(hulp) + ' gegee.','geld');
    wenk(v.naam + ' het ' + geld(hulp) + ' gegee.');
  } else {
    v.band = klem(v.band - tussen(4,12));
    s.geluk = klem(s.geluk - tussen(4,10));
    noteer(v.naam + ' het gesê hulle kan nie help nie. Dit was ’n swaar oproep.','sleg');
    wenk(v.naam + ' het nee gesê.');
  }
  stoor(); renderAlles();
}

/* ---------- Werk ---------- */
var EDU_TEKS=['','Matriek nodig','Universiteitsgraad nodig','Nagraadse kwalifikasie nodig'];
/* Alles wat jy klaargemaak het: jou grade en jou nagraadse studies. Die
   LLB en die MBChB kan nou langs albei paaie kom (sien STUDIES), daarom
   soek 'gr' in albei lyste. */
function kwalifikasies(){ return s.skool.grade.concat(s.skool.nagraads); }
function werkVereis(j){
  /* A15 — jy kan nie voltyds werk terwyl jy nog op skool is nie. Vir
     deeltydse werk en vakansiewerk, sien DEELTYDS (D3) hieronder. */
  if(s.skool.vlak==='laerskool' || s.skool.vlak==='hoerskool')
    return 'Jy is nog op skool — voltydse werk moet wag';
  if(s.ouderdom < j.min) return 'Jy moet ' + j.min + ' jaar oud wees';
  if(eduVlak() < j.edu) return EDU_TEKS[j.edu];
  if(j.gr && !j.gr.some(function(g){ return kwalifikasies().indexOf(g)>=0; }))
    return 'Kwalifikasie in ' + j.gr.join(' of ') + ' nodig';
  if(j.na && !j.na.some(function(g){ return s.skool.nagraads.indexOf(g)>=0; }))
    return j.na.join(' of ') + ' nodig';
  if(s.slim < j.slim) return 'Slimheid ' + j.slim + '+ nodig';
  if(j.ervaring && s.jareGewerk < j.ervaring) return j.ervaring + ' jaar werkservaring nodig';
  if(j.skoon && s.rekord.length) return 'Geen kriminele rekord toegelaat';
  /* Fase 9 — 'n vlugteling sonder 'n vals ID kan nie sy ID-nommer op 'n vorm skryf nie. */
  if(vlugToe()) return vlugToe() + ' kan jy nie aansoek doen nie';
  return null;
}
/* Hoeveel onderhoude jy vanjaar kan kry. */
function aansoekPerk(){ return s.dakloos ? 1 : 3; }
function doenAansoek(id){
  var j = null;
  BEROEPE.forEach(function(x){ if(x.id===id) j=x; });
  if(!j) return;
  if(s.tronk){ wenk('Jy is in die tronk.'); return; }
  var rede = werkVereis(j);
  if(rede){ wenk(rede + '.'); return; }
  /* B18 — sonder ’n foon, vervoer en skoon klere kom jy by een
     onderhoud per jaar uit, nie drie nie. */
  if(s.aansoeke >= aansoekPerk()){
    wenk(s.dakloos ? 'Een onderhoud per jaar is al waarby jy kom.'
      : 'Drie onderhoude per jaar is genoeg.'); return; }
  s.aansoeke++;
  var kansie = 48 + (s.slim - j.slim)/2 + (s.voorkoms-50)/5 + Math.min(20, s.jareGewerk*2) + (s.aansien||0)*4;
  /* H3 — 'n ontwikkelaar wat self kodeer of 'n kok wat regtig kan kook,
     kry die werk makliker. */
  kansie += vaardigWerkBonus(j);
  if(s.rekord.length) kansie -= 15;
  /* B18 — sonder ’n adres, ’n foon en skoon klere kom jy skaars by die
     onderhoud. ’n NGO se adres en ’n ID maak die groot verskil. */
  if(s.dakloos) kansie *= (s.dakloos.ngo ? DAKLOOS_NGO_KANS : DAKLOOS_WERKKANS);
  if(kans(kansie)){
    s.beroep = {id:j.id, t:j.t, basis:j.s, salaris:j.s, vlak:0, prestasie:tussen(45,68), jare:0,
      k:j.k, plafon:j.plafon||0};
    s.beroepeGehad.push(j.t);
    s.geluk = klem(s.geluk+12);
    noteer('Jy is aangestel as ' + beroepTitel() + ' teen ' + geld(j.s) + ' per jaar!','werk');
    /* D3 — voltydse werk en 'n Saterdagwerk gaan nie saam nie. */
    if(s.deeltyds){
      noteer('Jy het jou deeltydse werk by ' + s.deeltyds.t + ' laat staan.','werk');
      s.deeltyds = null;
    }
    maakKollegas(); wenk('Jy het die werk gekry!');
  } else {
    s.geluk = klem(s.geluk-5);
    noteer('Jou aansoek vir ' + j.t + ' is afgekeur.','sleg');
    wenk('Afgekeur. Probeer weer.');
  }
  stoor(); renderAlles();
}
function werkAksie(wat){
  if(!s.beroep){ wenk('Jy het nie ’n werk nie.'); return; }
  if(wat==='harder'){
    if(s.gedoen.harder){ wenk('Jy werk al hard vanjaar.'); return; }
    s.gedoen.harder=1;
    s.beroep.prestasie = klem(s.beroep.prestasie + tussen(7,15));
    s.geluk = klem(s.geluk-5); s.gesondheid = klem(s.gesondheid-2);
    noteer('Jy het harder gewerk. Jou prestasie is ' + s.beroep.prestasie + '%.','werk');
    wenk('Prestasie: ' + s.beroep.prestasie + '%');
  }
  else if(wat==='verhoging'){
    if(s.gedoen.verhoging){ wenk('Jy het al vanjaar gevra.'); return; }
    /* D6 — bo die plafon van jou pos is daar niks meer om te vra nie.
       Wil jy meer verdien, moet jy 'n ander pos kry. */
    if(s.beroep.plafon && s.beroep.salaris >= s.beroep.plafon){
      wenk('Jy verdien reeds die boonste punt van die skaal vir hierdie pos.');
      return; }
    s.gedoen.verhoging=1;
    if(s.beroep.prestasie>=58 && kans(40 + (s.beroep.prestasie-58))){
      var op = tussen(8,24);
      s.beroep.salaris = Math.round(s.beroep.salaris * (1+op/100));
      var gesny = pasPlafonToe();
      noteer('Jy het ’n ' + op + '% verhoging gekry! Nou ' + geld(s.beroep.salaris) +
        (gesny ? ' — die boonste punt van die skaal.' : '.'),'geld');
      wenk(gesny ? 'Verhoging tot by die plafon.' : 'Verhoging van ' + op + '%!');
    } else {
      s.beroep.prestasie = klem(s.beroep.prestasie-6); s.geluk=klem(s.geluk-5);
      noteer('Jou baas het die verhoging geweier.','sleg'); wenk('Geweier.');
    }
  }
  else if(wat==='bedank'){
    noteer('Jy het bedank as ' + beroepTitel() + '.','werk');
    s.beroep=null; losWerkMense(); s.geluk=klem(s.geluk+4); wenk('Jy het bedank.');
  }
  stoor(); renderAlles();
}

/* ==========================================================================
   D3 — DEELTYDSE WERK
   Die ander kant van A15: voltydse werk is toe terwyl jy op skool is,
   maar 'n Saterdagwerk of 'n Desember-vakansiewerk is nie. Dit betaal
   min, kos jou geluk of punte, en jy mag net een op 'n keer hê.
   ========================================================================== */
function neemDeeltyds(id){
  var j = deeltydsVan(id);
  if(!j || !s.lewe) return;
  if(s.deeltyds){ wenk('Jy het al ’n deeltydse werk.'); return; }
  var rede = deeltydsVereis(j);
  if(rede){ wenk(rede + '.'); return; }
  if((s.gedoen.deeltyds||0) >= DEELTYDS_POGINGS){
    wenk(DEELTYDS_POGINGS + ' plekke per jaar is al waarby jy kom.'); return; }
  s.gedoen.deeltyds = (s.gedoen.deeltyds||0) + 1;
  /* Hierdie werke is maklik om te kry; jou voorkoms en 'n bietjie
     slimheid maak die verskil, en 'n rekord maak dit moeiliker. */
  var kansie = 74 + (s.voorkoms-50)/5 + (s.slim-50)/8;
  if(s.rekord.length) kansie -= 20;
  if(kans(kansie)){
    s.deeltyds = {id:j.id, t:j.t, s:j.s, jare:0};
    s.geluk = klem(s.geluk+5);
    noteer('Jy het deeltydse werk gekry: ' + j.t + ' (' + geld(j.s) + ' per jaar).','werk');
    wenk('Jy het die werk gekry!');
  } else {
    noteer('Hulle het iemand anders geneem vir ' + j.t.toLowerCase() + '.','sleg');
    wenk('Afgekeur. Probeer elders.');
  }
  stoor(); renderAlles();
}
function losDeeltyds(){
  if(!s.deeltyds){ wenk('Jy het nie deeltydse werk nie.'); return; }
  noteer('Jy het jou deeltydse werk by ' + s.deeltyds.t + ' opgese.','werk');
  s.deeltyds = null; s.geluk = klem(s.geluk+3);
  wenk('Jy het opgese.'); stoor(); renderAlles();
}

/* ==========================================================================
   B17 — PENSIOEN
   Jou pensioen is nie ’n geskenk nie: dit is wat jy en jou werkgewer
   jaar na jaar bygedra het, plus die groei daarop. Die fonds bly joune
   ook as jy die werk verloor, en jy kan aftree of jy nou werk of nie.
   ========================================================================== */
function stelPensioenKoers(k){
  if(!s.beroep){ wenk('Jy moet ’n werk hê om by te dra.'); return; }
  if(s.afgetree){ wenk('Jy is reeds afgetree.'); return; }
  s.pensioenKoers = k;
  noteer('Jy dra nou ' + persent(k*100) + '% van jou salaris tot jou pensioen by.','geld');
  wenk('Bydrae: ' + persent(k*100) + '%');
  stoor(); renderAlles();
}
function magAftree(){ return s.ouderdom>=VROEG_AFTREE && !s.afgetree; }
/* Twee keuses by aftrede: alles in ’n lewende annuiteit, of eers ’n
   derde kontant uit (die eerste R550 000 daarvan is belastingvry) en
   die res in die annuiteit. Meer kontant nou is minder inkomste later. */
function wysAftrede(){
  if(!magAftree()){
    wenk(s.afgetree ? 'Jy is reeds afgetree.' : 'Jy moet ' + VROEG_AFTREE + ' wees om af te tree.');
    return;
  }
  var fonds = s.pensioenFonds||0;
  if(fonds<=0){
    wysModaal('Aftrede','Jy het nooit in ’n pensioenfonds bygedra nie, so daar is niks ' +
      'om van af te tree nie. Wil jy steeds ophou werk?',
      [{t:'Ja, ek hou op werk', doen:function(){ sluitModaal(); treeAf(0); }},
       {t:'Nee, los dit', klas:'grys', doen:function(){ sluitModaal(); }}]);
    return;
  }
  var derde = Math.round(fonds/3);
  var vroeg = s.ouderdom < AFTREE_OUDERDOM;
  kiesLys('Aftrede op ' + s.ouderdom,
    'Jou pensioenfonds is ' + geld(fonds) + ' werd' +
    (vroeg ? '. Jy tree vroeg af, so die fonds moet langer hou' : '') + '.',
    [
      {t:'Alles in ’n lewende annuiteit',
       sub:'Geen kontant nou · ' + geld(Math.round(fonds*ANNUITEIT_TREK)) + ' per jaar',
       doen:function(){ sluitModaal(); treeAf(0); }},
      {t:'Neem ’n derde kontant',
       sub:geld(derde - kontantBelasting(derde)) + ' nou · ' +
         geld(Math.round((fonds-derde)*ANNUITEIT_TREK)) + ' per jaar',
       doen:function(){ sluitModaal(); treeAf(derde); }}
    ]);
}
/* Die eerste R550 000 van ’n aftree-uitbetaling is belastingvry. */
function kontantBelasting(bedrag){
  return Math.round(Math.max(0, bedrag - KONTANT_DERDE_VRY) * KONTANT_DERDE_KOERS);
}
function treeAf(kontant){
  var fonds = s.pensioenFonds||0;
  kontant = Math.min(kontant||0, Math.round(fonds/3));
  if(kontant>0){
    var bel = kontantBelasting(kontant);
    s.pensioenFonds = fonds - kontant;
    s.geld += kontant - bel;
    noteer('Jy het ' + geld(kontant) + ' uit jou pensioenfonds geneem; ' + geld(bel) +
      ' het belasting toe gegaan.','geld');
  }
  s.afgetree = true;
  s.pensioen = Math.round((s.pensioenFonds||0) * ANNUITEIT_TREK);
  if(s.beroep){
    noteer('Jy het afgetree as ' + beroepTitel() + '.','werk');
    s.beroep = null; losWerkMense();
  }
  s.geluk = klem(s.geluk+15);
  if(s.pensioen>0) noteer('Jy is op pensioen met ' + geld(s.pensioen) + ' per jaar uit ’n fonds van ' +
    geld(s.pensioenFonds) + '.','werk');
  else noteer('Jy het opgehou werk, maar daar is geen pensioen om van te lewe nie.','sleg');
  wenk(s.pensioen>0 ? 'Geniet die pensioen!' : 'Jy is afgetree — sonder pensioen.');
  stoor(); renderAlles();
}
/* Die duurste fout wat mense maak: die fonds uittrek as jy van werk
   verander. Net die eerste R27 500 is vry; die res word swaar belas. */
function trekPensioenUit(){
  if(s.beroep){ wenk('Jy moet eers die werk verlaat.'); return; }
  if(s.afgetree){ wenk('Jy is reeds afgetree.'); return; }
  var fonds = s.pensioenFonds||0;
  if(fonds<=0){ wenk('Jy het geen pensioenfonds nie.'); return; }
  var bel = Math.round(Math.max(0, fonds - UITTREE_VRY) * UITTREE_KOERS);
  wysModaal('Trek jou pensioenfonds uit?',
    'Jou fonds is ' + geld(fonds) + '. Trek jy dit nou uit, vat SARS ' + geld(bel) +
    ' en jy hou ' + geld(fonds-bel) + '. Jy begin weer van nul af vir jou aftrede.',
    [{t:'Ja, trek dit uit', klas:'rooi', doen:function(){
        s.pensioenFonds = 0; s.geld += fonds - bel;
        noteer('Jy het jou hele pensioenfonds van ' + geld(fonds) + ' uitgetrek. ' +
          geld(bel) + ' het belasting toe gegaan.','sleg');
        s.geluk = klem(s.geluk+5);
        sluitModaal(); stoor(); renderAlles();
      }},
     {t:'Nee, los dit om te groei', klas:'grys', doen:function(){ sluitModaal(); }}]);
}

/* ---------- Studie ---------- */
/* C2 — wat hierdie universiteit vir hierdie program vra: die program se
   eie APS plus wat die plek self bo-op vra (UCT vra vier meer as UP vir
   dieselfde graad; UNISA vra vyf minder). */
function apsVereis(st, u){ return klem(st.aps + (u.apsEkstra||0), 14, APS_MAKS); }
/* C1 — die vakvereistes. Jou vlak in 'n vak wat jy nooit gehad het nie
   is 0, en daarom is dit hier waar die Graad 10-keuse die deur toemaak. */
/* 'a, b en c' in plaas van 'a en b en c'. */
function lysEn(lys, woord){
  if(lys.length<2) return lys.join('');
  return lys.slice(0,-1).join(', ') + ' ' + (woord||'en') + ' ' + lys[lys.length-1];
}
function vakTeKort(st){
  var k, mis = [];
  if(st.vak) for(k in st.vak) if(vakVlak(k) < st.vak[k]) mis.push(k + ' op vlak ' + st.vak[k]);
  if(mis.length) return lysEn(mis) + ' nodig';
  if(st.ofVak){
    var oor = false, lys = [];
    for(k in st.ofVak){ lys.push(k + ' vlak ' + st.ofVak[k]); if(vakVlak(k) >= st.ofVak[k]) oor = true; }
    if(!oor) return lysEn(lys, 'of') + ' nodig';
  }
  return null;
}
/* Hoekom is hierdie program vir jou toe? null beteken jy kom in. */
function studieToe(st, u){
  if(u.nie && u.nie.indexOf(st.n)>=0) return 'Word nie hier aangebied nie';
  var nodig = apsVereis(st, u);
  if((s.skool.aps||0) < nodig) return 'APS ' + nodig + ' nodig, jy het ' + (s.skool.aps||0);
  return vakTeKort(st);
}
function oopProgramme(u){
  return STUDIES.filter(function(st){ return !studieToe(st, u); });
}
function wysStudies(){
  if(!s.skool.matriek){ wenk('Jy het matriek nodig.'); return; }
  if(s.ouderdom<18){ wenk('Jy moet 18 wees.'); return; }
  if(s.skool.vlak==='universiteit'||s.skool.vlak==='nagraads'){ wenk('Jy studeer alreeds.'); return; }
  /* C9 — na twee akademiese uitsluitings is die deur toe. */
  if((s.skool.uitgeskop||0) >= UITSLUIT_MAKS){
    wenk('Na ' + UITSLUIT_MAKS + ' uitsluitings neem geen universiteit jou weer nie.'); return; }
  var aps = s.skool.aps||0;
  var opsies = UNIES.map(function(u){
    var oop = oopProgramme(u).length;
    return { t:u.n, klas: oop?'':'grys',
      sub: geld(u.koste) + ' per jaar \u00b7 ' + (oop
        ? oop + ' van ' + STUDIES.length + ' programme is oop vir jou'
        : 'geen program is oop vir \u2019n APS van ' + aps),
      doen:function(){ if(!oop){ wenk('Jou APS is te laag vir alles wat ' + u.n + ' aanbied.'); return; }
        kiesStudie(u); } };
  });
  opsies.push({t:'Toemaar', klas:'grys', doen:function(){ sluitModaal(); }});
  wysModaal('Universiteit','Jou APS is ' + aps + ' uit ' + APS_MAKS +
    '. Waar wil jy studeer?', opsies);
}
function kiesStudie(u){
  var aps = s.skool.aps||0;
  /* 'n Volle beursie kom van 'n APS wat uitstaan, of van pure slimheid.
     NSFAS en studenteskuld is C7 en C8 vir later. */
  var beurs = (aps>=38 || s.slim>=82);
  var opsies = STUDIES.map(function(st){
    var rede = studieToe(st, u);
    return { t:st.n + ' \u2014 ' + st.vol, klas: rede?'grys':'',
      sub: rede ? rede : st.jare + ' jaar \u00b7 APS ' + apsVereis(st,u) + ' nodig, jy het ' + aps,
      doen:function(){
        if(rede){ wenk(st.n + ': ' + rede + '.'); return; }
        var koste = beurs ? 0 : u.koste;
        s.uni = u; s.aansien = u.aansien;
        /* C4 — elke graad is nou sy regte lengte lank. */
        s.skool = Object.assign(s.skool, {vlak:'universiteit', studie:st.n,
          jare:st.jare, jareOor:st.jare, koste:koste, beurs:beurs,
          herhaal:0, geslaagJare:0, ywer:0});
        noteer('Jy is by ' + u.n + ' aanvaar vir ' + st.vol + ' in ' + st.n + ' \u2014 ' +
          st.jare + ' jaar' + (beurs ? ', met \u2019n volle beurs!'
            : ' teen ' + geld(koste) + ' per jaar.'),'skool');
        maakKlasmaats(u.n);
        sluitModaal(); stoor(); renderAlles();
      }};
  });
  opsies.push({t:'Terug', klas:'grys', doen:function(){ wysStudies(); }});
  wysModaal(u.n, 'Jou APS is ' + aps + '. ' + (beurs ? 'Dit is goed genoeg vir \u2019n volle beurs! '
    : 'Klasgeld is ' + geld(u.koste) + ' per jaar. ') + 'Wat wil jy studeer?', opsies);
}

function wysNagraads(){
  if(!s.skool.grade.length){ wenk('Jy het eers ’n graad nodig.'); return; }
  if(s.skool.vlak==='universiteit'||s.skool.vlak==='nagraads'){ wenk('Jy studeer alreeds.'); return; }
  var opsies = NAGRAADS.map(function(ng){
    var kan = s.slim>=ng.slim && (!ng.vereis || ng.vereis.some(function(g){ return s.skool.grade.indexOf(g)>=0; }))
      && s.skool.nagraads.indexOf(ng.n)<0;
    return { t: ng.n + ' — ' + ng.jare + ' jaar, ' + geld(ng.koste) + '/jaar', klas: kan?'':'grys',
      doen:function(){
        if(!kan){ wenk('Jy kwalifiseer nie: slimheid ' + ng.slim + '+' +
          (ng.vereis?' en ’n graad in ' + ng.vereis.join(' of '):'') + '.'); return; }
        s.skool = Object.assign(s.skool, {vlak:'nagraads', studie:ng.n, jare:ng.jare,
          jareOor:ng.jare, koste:ng.koste, beurs:false, herhaal:0, geslaagJare:0, ywer:0});
        noteer('Jy is vir ' + ng.n + ' ingeskryf.','skool');
        sluitModaal(); stoor(); renderAlles();
      }};
  });
  opsies.push({t:'Toemaar', klas:'grys', doen:function(){ sluitModaal(); }});
  wysModaal('Nagraadse studie','Kies ’n program:', opsies);
}
function losSkool(){
  if(s.skool.vlak==='universiteit'||s.skool.vlak==='nagraads'){
    s.skool.vlak='klaar'; s.skool.studie=null; s.geluk=klem(s.geluk-6);
    s.skool.jareOor=0; s.skool.jare=0; s.skool.herhaal=0;
    s.skool.geslaagJare=0; s.skool.ywer=0;
    noteer('Jy het jou studies gestaak.','sleg'); stoor(); renderAlles(); return;
  }
  if(s.ouderdom<16){ wenk('Jy mag eers op 16 die skool verlaat.'); return; }
  if(s.skool.vlak!=='hoerskool'){ wenk('Jy is nie op skool nie.'); return; }
  s.skool.uit=true; s.skool.vlak='klaar'; s.geluk=klem(s.geluk+3);
  noteer('Jy het die skool in Graad ' + s.skool.graad + ' verlaat.','sleg');
  stoor(); renderAlles();
}

/* ---------- Bates en beleggings ---------- */
function koopBate(id){
  var b = null;
  TE_KOOP.forEach(function(x){ if(x.id===id) b=x; });
  if(!b) return;
  if(b.t==='motor' && !magBestuur()){
    wenk('Jy moet 18 wees en ’n rylisensie hê om ’n motor te koop.'); return; }
  /* B2 — ’n huis hoef jy nie kontant te koop nie: die bank leen jou die res. */
  if(b.t==='huis' && s.geld < b.p){ wysBondOpsies(b); return; }
  if(s.geld < b.p){ wenk('Jy kort ' + geld(b.p - s.geld) + '.'); return; }
  s.geld -= b.p;
  voegBateBy(b);
  noteer('Jy het ' + b.n + ' kontant gekoop vir ' + geld(b.p) + '.','geld');
  wenk('Gekoop: ' + b.n);
  stoor(); renderAlles();
}
function voegBateBy(b){
  var bate = {id:b.id+'_'+R(99999), n:b.n, t:b.t, waarde:b.p, e:b.e};
  s.bates.push(bate);
  s.geluk = klem(s.geluk + (b.t==='huis'?11:b.t==='motor'?8:5));
  if(b.t==='huis') s.blyplek = 'eie';   /* B1 — jy trek dadelik in */
  return bate;
}
function verkoopBate(idx){
  var b = s.bates[idx]; if(!b) return;
  var waarde = b.waarde, skuld = (s.bond && s.bond.bateId===b.id) ? s.bond.saldo : 0;
  var kry = verkoopBateUit(b, 1);
  noteer('Jy het ' + b.n + ' vir ' + geld(waarde) + ' verkoop.','geld');
  wenk(skuld ? 'Verkoop; ' + geld(skuld) + ' verband afbetaal' : 'Verkoop vir ' + geld(kry));
  stoor(); renderAlles();
}

/* ==========================================================================
   B2 — ’N VERBAND (HUISLENING)
   Jy betaal ’n deposito, die bank leen jou die res, en jy betaal dit oor
   20 of 30 jaar met rente af. Hoe langer die termyn, hoe kleiner die
   paaiement — maar hoe meer rente betaal jy in totaal.
   ========================================================================== */
/* Wat die bank jou per jaar sal laat betaal: 33% van die huishouding se
   bruto inkomste — E12 se twee salarisse tel saam, soos by 'n egte bank. */
function bondVermoe(){ return Math.round(huishoudingBruto() * BOND_AFFORDEERBAAR); }
/* Al die verbande wat vir hierdie huis moontlik is, met hul redes. */
function bondOpsies(prys){
  var lys = [];
  BOND_DEPOSITOS.forEach(function(dp){
    BOND_TERMYNE.forEach(function(jare){
      var deposito = Math.round(prys * dp);
      var lening = prys - deposito;
      var paaiement = bondPaaiement(lening, jare);
      var rede = null;
      if(vlugToe()) rede = 'Die bank wil jou ID sien';
      else if(s.swartlys>0) rede = 'Jy is gelys — nog ' + s.swartlys + ' jaar';
      else if(s.bond) rede = 'Jy het reeds ’n verband';
      else if(s.geld < deposito) rede = 'Jy kort ' + geld(deposito - s.geld) + ' deposito';
      else if(paaiement > bondVermoe()) rede = 'Te duur vir jou inkomste';
      lys.push({deposito:deposito, lening:lening, jare:jare, paaiement:paaiement,
        totaal:paaiement*jare + deposito, rede:rede});
    });
  });
  return lys;
}
function wysBondOpsies(b){
  if(s.ouderdom<18){ wenk('Jy moet 18 wees om ’n huis te koop.'); return; }
  var opsies = bondOpsies(b.p).map(function(o){
    return { t: (o.jare + ' jaar, ' + Math.round(o.deposito/b.p*100) + '% deposito'),
      klas: o.rede ? 'grys' : '',
      sub: o.rede ? o.rede
        : geld(o.deposito) + ' nou, dan ' + geld(o.paaiement) + ' per jaar · ' +
          geld(o.totaal) + ' in totaal',
      doen: function(){
        if(o.rede){ wenk(o.rede + '.'); return; }
        neemBond(b, o); sluitModaal();
      }};
  });
  kiesLys('Verband vir ' + b.n,
    'Die huis kos ' + geld(b.p) + ' en jy het ' + geld(s.geld) + '. Die bank vra ' +
    persent(BOND_KOERS*100) + '% rente per jaar en sal jou tot ' +
    geld(bondVermoe()) + ' per jaar laat betaal.', opsies);
}
function neemBond(b, o){
  s.geld -= o.deposito;
  var bate = voegBateBy(b);
  s.bond = {bateId:bate.id, saldo:o.lening, oorspronklik:o.lening, koers:BOND_KOERS,
    termyn:o.jare, paaiement:o.paaiement, agter:0, renteBetaal:0};
  noteer('Jy het ' + b.n + ' gekoop met ’n deposito van ' + geld(o.deposito) +
    ' en ’n verband van ' + geld(o.lening) + ' oor ' + o.jare + ' jaar.','geld');
  noteer('Jou paaiement is ' + geld(o.paaiement) + ' per jaar.','geld');
  wenk('Die huis is joune!');
  stoor(); renderAlles();
}
/* Betaal jy ekstra in, gaan alles direk teen die kapitaal — dit spaar
   jou jare se rente. Dis die goedkoopste belegging wat die meeste
   mense ooit sal maak. */
function betaalEkstraBond(bedrag){
  if(!s.bond){ wenk('Jy het nie ’n verband nie.'); return; }
  if(bedrag==='alles') bedrag = Math.min(s.geld, s.bond.saldo);
  bedrag = Math.min(bedrag, s.bond.saldo);
  if(bedrag<=0 || s.geld < bedrag){ wenk('Jy het nie soveel kontant nie.'); return; }
  var voor = bondJareOor();
  s.geld -= bedrag; s.bond.saldo -= bedrag;
  if(s.bond.saldo<=0){
    s.bond = null; s.geluk = klem(s.geluk+20);
    noteer('Jy het jou verband afbetaal! Die huis is nou heeltemal joune.','goed');
    wenk('Verband afbetaal!');
  } else {
    var na = bondJareOor();
    noteer('Jy het ' + geld(bedrag) + ' ekstra op jou verband ingebetaal. Nog ' +
      geld(s.bond.saldo) + ' oor' + (voor>na ? ', en ' + (voor-na) + ' jaar korter' : '') + '.','geld');
    wenk(voor>na ? (voor-na) + ' jaar korter!' : 'Ingebetaal: ' + geld(bedrag));
  }
  stoor(); renderAlles();
}

/* ---------- B5: die spaarrekening ---------- */
function naSpaar(bedrag){
  if(vlugBank()) return;
  if(bedrag==='alles') bedrag = s.geld;
  bedrag = Math.round(bedrag);
  if(bedrag<=0 || s.geld < bedrag){ wenk('Jy het nie soveel kontant nie.'); return; }
  s.geld -= bedrag; s.spaar = (s.spaar||0) + bedrag;
  noteer('Jy het ' + geld(bedrag) + ' na jou spaarrekening geskuif.','geld');
  wenk('Gespaar: ' + geld(bedrag)); stoor(); renderAlles();
}
function uitSpaar(bedrag){
  if(vlugBank()) return;
  if(bedrag==='alles') bedrag = s.spaar||0;
  bedrag = Math.round(bedrag);
  if(bedrag<=0 || (s.spaar||0) < bedrag){ wenk('Soveel is nie in die spaarrekening nie.'); return; }
  s.spaar -= bedrag; s.geld += bedrag;
  noteer('Jy het ' + geld(bedrag) + ' uit jou spaarrekening getrek.','geld');
  wenk('Getrek: ' + geld(bedrag)); stoor(); renderAlles();
}

/* ---------- B1: waar jy bly ---------- */
function kiesBlyplek(id){
  if(s.ouderdom<18){ wenk('Jy bly by jou ouers.'); return; }
  if(hetHuis()){ wenk('Jy besit ’n huis — verkoop dit eers.'); return; }
  if(s.tronk){ wenk('Jy is in die tronk.'); return; }
  /* B18 — is jy dakloos, moet jy die deposito en die eerste jaar se huur
     vooruit betaal voordat ’n verhuurder jou inneem. */
  if(s.dakloos){ dakloosHuur(id); return; }
  if(id==='ouers'){
    if(!lewendeOuers().length){ wenk('Daar is niemand meer in die ouerhuis nie.'); return; }
    if(s.blyplek==='ouers'){ wenk('Jy bly reeds daar.'); return; }
    s.blyplek='ouers';
    noteer('Jy het teruggetrek na jou ouers se huis.','neutraal');
    wenk('Jy bly nou by jou ouers.');
  } else {
    var p = huurTarief(id);
    if(s.blyplek==='huur' && s.huurPlek===id){ wenk('Jy bly reeds daar.'); return; }
    s.blyplek='huur'; s.huurPlek=id;
    s.geluk = klem(s.geluk + Math.round(p.geluk/2));
    noteer('Jy het in ’n ' + p.n.toLowerCase() + ' in ' + s.dorp + ' ingetrek — ' +
      geld(huurPerJaar(id)) + ' huur per jaar.','geld');
    wenk('Ingetrek: ' + p.n);
  }
  stoor(); renderAlles();
}
/* B18 — van die straat af ’n plek huur. */
function dakloosHuur(id){
  if(id==='ouers' || id==='familie'){
    wenk('Vra familie onder Aktiwiteite om jou in te neem.'); return; }
  var trap = dakTrappe().filter(function(p){ return p.id===id; })[0];
  if(!trap){ wenk('Sonder ’n adres gee niemand jou ’n plek op sy erf nie.'); return; }
  var koste = dakIntrekKoste(id);
  if(s.geld < koste){ wenk('Jy kort ' + geld(koste - s.geld) + ' vir die deposito.'); return; }
  s.geld -= koste;
  uitDakloosheid(id, 'Jy het ' + geld(koste) + ' vooruit betaal en in ’n ' +
    trap.n.toLowerCase() + ' ingetrek.');
  wenk('Jy het ’n dak oor jou kop.');
  stoor(); renderAlles();
}
function bele(bedrag){
  if(vlugBank()) return;
  if(bedrag==='alles') bedrag = s.geld;
  if(bedrag<=0 || s.geld < bedrag){ wenk('Jy het nie soveel geld nie.'); return; }
  s.geld -= bedrag; s.belegging += bedrag;
  noteer('Jy het ' + geld(bedrag) + ' in ’n JSE-indeksfonds bele.','geld');
  wenk('Bele: ' + geld(bedrag)); stoor(); renderAlles();
}
function verkoopBelegging(){
  if(vlugBank()) return;
  if(s.belegging<=0){ wenk('Jy het geen beleggings nie.'); return; }
  s.geld += s.belegging;
  noteer('Jy het jou beleggings van ' + geld(s.belegging) + ' verkoop.','geld');
  s.belegging = 0; stoor(); renderAlles();
}

/* ---------- Verhoudings ---------- */
function soekLief(){
  if(s.ouderdom<15){ wenk('Jy is te jonk.'); return; }
  if(maat()){ wenk('Jy is al in \u2019n verhouding.'); return; }
  if((s.gedoen.soek||0) >= 2){ wenk('Genoeg gesoek vir vanjaar.'); return; }
  var bekend = s.verhoudings.filter(function(v){
    return v.lewe && ['vriend','klasmaat','kollega'].indexOf(v.tipe)>=0 &&
      v.ouderdom>=15 && Math.abs(v.ouderdom - s.ouderdom) <= 12; });
  bekend.sort(function(a,b){ return b.band - a.band; });
  var opsies = bekend.slice(0,8).map(function(v){
    return {t:'Vra ' + v.naam + ' uit', sub: rol(v) + ' \u00b7 ' + v.ouderdom + ' jaar \u00b7 band ' + v.band + '%',
      doen:function(){ s.gedoen.soek = (s.gedoen.soek||0)+1; raak(v,'date'); }};
  });
  opsies.push({t:'Gaan uit en ontmoet iemand nuut', klas:'pienk',
    sub:'Jy weet nooit wie jy raakloop nie', doen:function(){
      s.gedoen.soek = (s.gedoen.soek||0)+1; vreemdeling(); }});
  kiesLys('Liefde', bekend.length ? 'Jy ken reeds \u2019n paar mense:'
    : 'Jy ken nog niemand goed genoeg nie \u2014 maak eers by die skool of werk vriende.', opsies);
}
function vreemdeling(){
  var k = nuweMens(kans(50)?'m':'v', Math.max(15, s.ouderdom + tussen(-4,4)), kies(VANNE));
  k.voorkoms = tussen(20,95); k.tipe='vriend'; k.band = tussen(30,60);
  wysModaal('Jy het iemand ontmoet',
    k.naam + ' ' + k.van + '\nOuderdom: ' + k.ouderdom + '\nVoorkoms: ' + k.voorkoms + '/100',
    [
      {t:'Vra uit', doen:function(){
        var p = 40 + (s.voorkoms - k.voorkoms)/2 + (s.geluk-50)/6;
        if(kans(p)){ k.tipe='lief'; k.band=tussen(55,80); s.verhoudings.push(k);
          s.geluk=klem(s.geluk+16);
          noteer('Jy en ' + k.naam + ' is nou saam!','liefde'); wenk('Hulle het ja gese!'); }
        else { s.geluk=klem(s.geluk-7);
          noteer(k.naam + ' het jou afgesit.','sleg'); wenk('Afgesit. Ai.'); }
        sluitModaal(); stoor(); renderAlles(); }},
      {t:'Loop weg', klas:'grys', doen:function(){ sluitModaal(); }}
    ]);
}

function oopPersoon(id){
  var v = null;
  s.verhoudings.forEach(function(x){ if(x.id===id) v=x; });
  if(!v) return;
  if(!v.lewe){
    wysModaal(v.naam + ' ' + v.van, rol(v) + ' \u2014 oorlede op ' + v.ouderdom + '.',
      [{t:'Sluit', klas:'grys', doen:function(){ sluitModaal(); }}]);
    return;
  }
  var o=[];
  o.push({t:'Gesels', doen:function(){ raak(v,'gesels'); }});
  o.push({t:'Gee \u2019n komplimentjie', doen:function(){ raak(v,'kompliment'); }});
  o.push({t:'Koop \u2019n geskenk', sub:'R2 500', doen:function(){ raak(v,'geskenk'); }});
  if(v.tipe==='klasmaat'||v.tipe==='kollega')
    o.push({t:'Nooi ' + v.naam + ' om te kuier', sub:'So word klasmaats en kollegas vriende',
      doen:function(){ raak(v,'tyd'); }});
  else o.push({t:'Spandeer tyd saam', doen:function(){ raak(v,'tyd'); }});
  if(v.tipe==='baas')
    o.push({t:'Maak indruk op die baas', sub:'Goed vir jou prestasie', doen:function(){ raak(v,'indruk'); }});
  if(v.tipe==='klasmaat' && s.skool.vlak==='hoerskool')
    o.push({t:'Werk saam aan huiswerk', sub:'Goed vir albei se punte', doen:function(){ raak(v,'huiswerk'); }});
  if(['vriend','klasmaat','kollega'].indexOf(v.tipe)>=0 && s.ouderdom>=15 && v.ouderdom>=15 && !maat())
    o.push({t:'Vra op \u2019n date uit', klas:'pienk', doen:function(){ raak(v,'date'); }});
  if(v.tipe==='lief' && s.ouderdom>=18)
    o.push({t:'Vra ten huwelik', klas:'pienk', doen:function(){ raak(v,'trou'); }});
  /* E4 — 'n baba is nie meer net vir 'n eggenoot nie. */
  if((v.tipe==='eggenoot'||v.tipe==='lief') && s.ouderdom>=18)
    o.push({t:'Probeer vir \u2019n baba', klas:'pienk',
      sub: v.tipe==='lief' ? 'Julle is nie getroud nie' : '', doen:function(){ raak(v,'baba'); }});
  /* E7 — jou kind se eie lewe: help hom, en lees wat van hom geword het. */
  if(v.tipe==='seun'||v.tipe==='dogter'||v.tipe==='kleinkind'){
    if(v.ouderdom>=6 && v.ouderdom<18)
      o.push({t:'Help met die huiswerk', sub:'Dit maak sy punte in matriek beter',
        doen:function(){ raak(v,'kindhuiswerk'); }});
    o.push({t:'Lees ' + v.naam + ' se lewensverhaal', klas:'grys',
      sub:'Wat alles met hom gebeur het', doen:function(){ wysKindLewe(v); }});
  }
  if(v.tipe==='lief') o.push({t:'Verbreek die verhouding', klas:'rooi', doen:function(){ raak(v,'verbreek'); }});
  if(v.tipe==='eggenoot') o.push({t:'Skei', klas:'rooi', doen:function(){ raak(v,'skei'); }});
  o.push({t:'Maak rusie', klas:'rooi', doen:function(){ raak(v,'rusie'); }});
  o.push({t:'Sluit', klas:'grys', doen:function(){ sluitModaal(); }});
  wysModaal(v.naam + ' ' + v.van,
    rol(v) + ' \u2014 ' + v.ouderdom + ' jaar oud\nVerhouding: ' + v.band + '/100', o);
}

function raak(v, wat){
  if(v.raak>=3 && ['gesels','kompliment','tyd','rusie'].indexOf(wat)>=0){
    wenk('Julle het vanjaar genoeg tyd saam gehad.'); return;
  }
  if(['gesels','kompliment','tyd','rusie'].indexOf(wat)>=0) v.raak++;
  if(wat==='gesels'){ v.band=klem(v.band+tussen(3,9)); s.geluk=klem(s.geluk+2);
    noteer('Jy het lekker met ' + v.naam + ' gesels.','neutraal'); }
  else if(wat==='kompliment'){ v.band=klem(v.band+tussen(2,8));
    noteer('Jy het ' + v.naam + ' ’n komplimentjie gegee.','neutraal'); }
  else if(wat==='geskenk'){
    if(s.geld<2500){ wenk('Jy het nie R2 500 nie.'); return; }
    s.geld-=2500; v.band=klem(v.band+tussen(7,15)); s.geluk=klem(s.geluk+3);
    noteer('Jy het vir ' + v.naam + ' ’n geskenk gekoop.','liefde'); }
  else if(wat==='tyd'){ v.band=klem(v.band+tussen(5,12)); s.geluk=klem(s.geluk+5);
    noteer('Jy het die dag saam met ' + v.naam + ' deurgebring.','goed'); }
  else if(wat==='rusie'){ v.band=klem(v.band-tussen(8,20)); s.geluk=klem(s.geluk-6);
    noteer('Jy en ' + v.naam + ' het ’n groot rusie gehad.','sleg'); }
  else if(wat==='indruk'){
    if(!s.beroep){ wenk('Jy werk nie meer daar nie.'); return; }
    v.band=klem(v.band+tussen(4,10));
    s.beroep.prestasie=klem(s.beroep.prestasie+tussen(4,11));
    noteer('Jy het indruk gemaak op ' + v.naam + '. Jou prestasie is ' + s.beroep.prestasie + '%.','werk'); }
  else if(wat==='huiswerk'){
    v.band=klem(v.band+tussen(5,12)); s.slim=klem(s.slim+tussen(2,5));
    noteer('Jy en ' + v.naam + ' het saam huiswerk gedoen.','skool'); }
  else if(wat==='date'){
    var p = 35 + (v.band-50)/2 + (s.voorkoms-50)/4;
    if(kans(p)){ v.tipe='lief'; v.band=klem(v.band+12); s.geluk=klem(s.geluk+15);
      noteer('Jy en ' + v.naam + ' is nou ’n paartjie!','liefde'); }
    else { v.band=klem(v.band-12); s.geluk=klem(s.geluk-8);
      noteer(v.naam + ' wil net vriende bly. Ongemaklik.','sleg'); } }
  else if(wat==='trou'){
    if(v.band<70){ wenk('Julle verhouding is nie sterk genoeg nie (70+ nodig).'); return; }
    var koste = tussen(60000,160000);
    if(s.geld<koste){ wenk('’n Troue kos ongeveer ' + geld(koste) + '.'); return; }
    s.geld-=koste; v.tipe='eggenoot'; v.band=klem(v.band+12); v.van=s.van;
    s.troues++; s.geluk=klem(s.geluk+26);
    noteer('Jy en ' + v.naam + ' is getroud! Die troue het ' + geld(koste) + ' gekos.','liefde');
    /* E12 — een huishouding, twee inkomste: sy het ook 'n beroep. */
    maatBeroepKies(v); }
  else if(wat==='baba'){
    if(s.gedoen['baba'+v.id]){ wenk('Een poging per jaar.'); return; }
    s.gedoen['baba'+v.id]=1;
    /* E4 — doelbewus probeer. Voorbehoeding wat jy self gekies het, keer
       dit steeds; die spel sê vir jou hoekom niks gebeur nie. */
    var vb = voorbehoedingVan();
    if(vb.f>=0.95){
      wenk('Jy gebruik ' + vb.n.toLowerCase() + '. Gaan verander dit eers onder Gesondheid.');
      noteer('Julle probeer vir ’n baba, maar jy gebruik nog ' + vb.n.toLowerCase() + '.','neutraal');
    }
    else if(kans(babaKans())) swangerskap(v, false);
    else noteer('Julle probeer nog vir ’n baba.','neutraal'); }
  /* E7 */
  else if(wat==='kindhuiswerk'){
    var k = kindLewe(v);
    k.slim = klem(k.slim + tussen(2,6)); v.band = klem(v.band + tussen(3,8));
    s.slim = klem(s.slim + 1);
    noteer('Jy het ' + v.naam + ' met die huiswerk gehelp.','skool'); }
  else if(wat==='verbreek'){ v.tipe='vriend'; v.band=klem(v.band-25); s.geluk=klem(s.geluk-10);
    noteer('Jy het die verhouding met ' + v.naam + ' verbreek.','sleg'); }
  else if(wat==='skei'){
    v.tipe='vriend'; v.band=klem(v.band-30); s.geluk=klem(s.geluk-18);
    noteer('Jy en ' + v.naam + ' is geskei.','sleg');
    skeiVerdeel(v.naam); }
  pasVriendskapAan(v);
  sluitModaal(); stoor(); renderAlles();
}

/* E7 — 'n baba is nou 'n mens met 'n eie lewe: kindLewe() gee hom sy
   eie slimheid, skool, loopbaan en eendag sy eie kinders. */
function kryBabaMet(v, onbeplan){
  var k = nuweMens(null, 0, s.van);
  k.tipe = k.geslag==='m' ? 'seun' : 'dogter'; k.band = tussen(75,100);
  k.ouerNaam = v ? v.naam : null;
  kindLewe(k);
  s.verhoudings.push(k); s.kinders++; s.kindersGebore = (s.kindersGebore||0) + 1;
  s.geluk = klem(s.geluk + (onbeplan ? tussen(4,12) : 18));
  noteer((onbeplan ? 'Die baba is hier' : 'Julle het \u2019n ' + rol(k).toLowerCase() +
    ' gekry') + ': ' + k.naam + '!','liefde');
  wenk('Dit is \u2019n ' + rol(k).toLowerCase() + '!');
  return k;
}
/* Die ou naam bly staan sodat niks wat dit nog roep, breek. */
function kryBaba(){ return kryBabaMet(maat(), false); }

/* ---------- Troeteldierwinkel ---------- */
function wysTroeteldierwinkel(){
  kiesLys('Troeteldierwinkel','Elke dier kos geld om aan te hou \u2014 kies mooi:',
    TROETELDIERE.map(function(d){
      return {t:d.e + '  ' + d.n, sub: geld(d.p) + ' \u00b7 ' + geld(d.onderhoud) + ' per jaar \u00b7 leef ' +
        d.jare[0] + ' tot ' + d.jare[1] + ' jaar', doen:function(){ koopTroeteldier(d.id); }};
    }));
}
function koopTroeteldier(id){
  var d = null;
  TROETELDIERE.forEach(function(x){ if(x.id===id) d=x; });
  if(!d) return;
  if((s.diere||[]).length >= 6){ wenk('Ses diere is genoeg vir een huis.'); return; }
  betaalEnDoen(d.p, '\u2019n ' + d.n.toLowerCase(), function(){ noemTroeteldier(d); });
}
function noemTroeteldier(d){
  var voorstel = kies(TROETELNAME);
  wysModaal('Jou nuwe ' + d.n.toLowerCase(), 'Wat gaan jy hom of haar noem?', [
    {t:'Neem hom huis toe', doen:function(){
      var inv = el('m-invoer');
      var naam = (inv && inv.value.trim()) || voorstel;
      registreerDier(d, naam.slice(0,16)); }},
    {t:'Stel \u2019n ander naam voor', klas:'grys', doen:function(){ noemTroeteldier(d); }}
  ], null, {plek:'Naam', waarde:voorstel});
}
/* Sit 'n dier in jou lewe. Word deur die winkel gebruik, en ook deur die
   hond wat jou in gebeure.js huis toe volg. */
function voegDierBy(d, naam, ouderdom){
  if(!s.diere) s.diere=[];
  s.diere.push({id:'d'+(volgendeId++), soort:d.n, naam:veilig(naam), e:d.e, ouderdom:ouderdom||0,
    band:tussen(60,90), onderhoud:d.onderhoud, maks:tussen(d.jare[0], d.jare[1]), artsBonus:0});
  s.geluk = klem(s.geluk + tussen(8,16));
}
function registreerDier(d, naam){
  voegDierBy(d, naam);
  noteer('Jy het ' + naam + ' die ' + d.n.toLowerCase() + ' huis toe gebring!','goed');
  wenk(naam + ' is nou deel van die gesin.');
  sluitModaal(); stoor(); renderAlles();
}
function oopTroeteldier(id){
  var d = null;
  (s.diere||[]).forEach(function(x){ if(x.id===id) d=x; });
  if(!d) return;
  wysModaal(d.naam, d.soort + ' \u00b7 ' + d.ouderdom + ' jaar oud\nBand: ' + d.band + '/100', [
    {t:'Speel met ' + d.naam, doen:function(){ troetelAksie(d,'speel'); }},
    {t:'Gee \u2019n lekkerny', sub:'R120', doen:function(){ troetelAksie(d,'lekker'); }},
    {t:'Gaan stap saam', doen:function(){ troetelAksie(d,'stap'); }},
    {t:'Leer hom \u2019n truuk', doen:function(){ troetelAksie(d,'truuk'); }},
    {t:'Neem na die dierearts', sub:'R1 400', doen:function(){ troetelAksie(d,'arts'); }},
    {t:'Sluit', klas:'grys', doen:function(){ sluitModaal(); }}
  ]);
}
function troetelAksie(d, wat){
  if(s.gedoen['d'+d.id+wat]){ wenk('Een keer per jaar.'); return; }
  function klaar(teks, soort){
    s.gedoen['d'+d.id+wat] = 1;
    noteer(teks, soort||'goed'); wenk(teks);
    sluitModaal(); stoor(); renderAlles();
  }
  if(wat==='speel'){ d.band=klem(d.band+tussen(6,14)); s.geluk=klem(s.geluk+tussen(3,8));
    klaar('Jy het met ' + d.naam + ' gespeel.'); }
  else if(wat==='stap'){ d.band=klem(d.band+tussen(4,10)); s.gesondheid=klem(s.gesondheid+tussen(1,5));
    klaar('Jy en ' + d.naam + ' was lekker stap.'); }
  else if(wat==='truuk'){
    if(kans(55)){ d.band=klem(d.band+tussen(5,12)); s.geluk=klem(s.geluk+5);
      klaar(d.naam + ' het geleer om ' + kies(['sit','pootjie gee','rol','bly']) + '!'); }
    else { s.geluk=klem(s.geluk-2); klaar(d.naam + ' het jou net aangekyk en weggestap.','neutraal'); }
  }
  else if(wat==='lekker'){ betaalEnDoen(120, '\u2019n lekkerny', function(){
      d.band=klem(d.band+tussen(5,11)); klaar('Jy het ' + d.naam + ' \u2019n lekkerny gegee.'); }); }
  else if(wat==='arts'){ betaalEnDoen(1400, 'die dierearts', function(){
      d.band=klem(d.band+tussen(2,6));
      /* Goeie sorg help, maar net tot twee jaar in totaal — anders word
         'n goudvis veertig jaar oud. */
      var ekstra = '';
      if((d.artsBonus||0) < 2){
        d.artsBonus = (d.artsBonus||0) + 1; d.maks += 1;
        ekstra = ' Die dierearts dink hy sal langer lewe as gevolg daarvan.';
      }
      klaar(d.naam + ' is deur die dierearts nagekyk en is gesond.' + ekstra); }, true); }
}

/* ==========================================================================
   FASE 5 — DIE AKSIES VAN GESIN EN GESONDHEID
   Alles wat die speler self kies: 'n mediese fonds, voorbehoeding, 'n
   behandeling, en die drie gewoontes van F4.
   ========================================================================== */

/* ---------- E7: 'n kind se lewensverhaal ---------- */
function wysKindLewe(v){
  var k = kindLewe(v);
  var r = [];
  r.push(rol(v) + ' · ' + v.ouderdom + ' jaar · slimheid ' + k.slim + '/100');
  if(k.skool.vlak==='laerskool'||k.skool.vlak==='hoerskool')
    r.push('In Graad ' + k.skool.graad + '.');
  if(k.skool.vlak==='universiteit')
    r.push('Studeer ' + k.skool.studie + ', nog ' + k.skool.jareOor + ' jaar.');
  if(k.skool.aps) r.push('Matriek-APS: ' + k.skool.aps + ' uit ' + APS_MAKS +
    (k.skool.matriek ? '' : ' — gedruip'));
  if(k.skool.grade.length) r.push('Kwalifikasies: ' + k.skool.grade.join(', ') + '.');
  if(k.beroep) r.push('Werk as ' + k.beroep.t.toLowerCase() + ' teen ' + geld(k.salaris) + ' per jaar.');
  else if(v.ouderdom>=18) r.push('Werk nie op die oomblik nie.');
  if(k.maat) r.push('Getroud met ' + k.maat.naam + ' ' + k.maat.van + '.');
  if(k.kinders.length) r.push('Kinders: ' + k.kinders.map(function(x){ return x.naam; }).join(', ') + '.');
  var g = k.geskiedenis.slice(-14).map(function(x){ return x.o + ': ' + x.t; });
  wysModaal(v.naam + ' ' + v.van, r.join('\n') + (g.length ? '\n\n' + g.join('\n') : ''),
    [{t:'Terug', klas:'grys', doen:function(){ oopPersoon(v.id); }},
     {t:'Sluit', klas:'grys', doen:function(){ sluitModaal(); }}]);
}

/* ---------- F2: die mediese fonds ---------- */
function wysMedieseFondse(){
  if(s.ouderdom<18){ wenk('Jy is op jou ouers se plan.'); return; }
  var opsies = MEDIESE_FONDSE.map(function(f){
    var premie = fondsPremieVan(f);
    return {t:f.n, sub:geld(premie) + ' per jaar · dek ' +
      Math.round(f.dek*100) + '% · ' + f.sub,
      klas: s.mediesefonds && s.mediesefonds.id===f.id ? 'groen' : '',
      doen:function(){ sluitFondsAan(f.id); }};
  });
  if(s.mediesefonds) opsies.push({t:'Kanselleer jou mediese fonds', klas:'rooi',
    sub:'Dan is dit die staatshospitaal of jou eie sak', doen:function(){ losFonds(); }});
  kiesLys('Mediese fonds', 'Een uit vier Suid-Afrikaners is op ’n mediese fonds. ' +
    'Sonder een is dit die staatshospitaal — gratis, maar die waglys is lank — ' +
    'of ’n privaat rekening wat jou kan ruïneer.' +
    (chronies().length ? '\nJy het ’n chroniese toestand, so hulle vra ' +
      Math.round((FONDS_SIEK_PREMIE-1)*100) + '% meer en daar is ’n wagperiode van ’n jaar.' : ''),
    opsies);
}
function sluitFondsAan(id){
  var f = null;
  MEDIESE_FONDSE.forEach(function(x){ if(x.id===id) f=x; });
  if(!f) return;
  if(s.mediesefonds && s.mediesefonds.id===id){ wenk('Jy is al op daardie plan.'); return; }
  if(vlugToe()){ wenk('Die fonds wil jou ID-nommer hê. Jy het ’n vals ID nodig.'); return; }
  var premie = fondsPremieVan(f);
  if(premie > Math.max(0,s.geld) + (s.spaar||0) + Math.max(0, huishoudingBruto()*0.25)){
    wenk('Jy kan nie ' + geld(premie) + ' per jaar bekostig nie.'); return;
  }
  s.mediesefonds = {id:f.id}; s.fondsJare = 0;
  noteer('Jy het by ' + f.n.toLowerCase() + ' aangesluit: ' + geld(premie) + ' per jaar.','geld');
  /* 'n Bestaande toestand kom eers ná die wagperiode in. */
  (s.siektes||[]).forEach(function(x){ x.voorFonds = 1; });
  if(chronies().length) noteer('Jou bestaande toestande is eers ná ’n jaar gedek.','neutraal');
  sluitModaal(); stoor(); renderAlles();
}
function losFonds(){
  if(!s.mediesefonds) return;
  noteer('Jy het jou mediese fonds gekanselleer.','sleg');
  s.mediesefonds = null; s.fondsJare = 0;
  (s.siektes||[]).forEach(function(x){ if(x.pad==='fonds') x.pad = 'privaat'; });
  sluitModaal(); stoor(); renderAlles();
}
/* F1 — 'n toestand wat jy onbehandeld gelaat het, kan jy later nog laat
   behandel. Dit is dieselfde keuse as toe dit begin het. */
function behandelNou(id){
  var x = null;
  (s.siektes||[]).forEach(function(y){ if(y.id===id) x=y; });
  if(!x){ wenk('Jy het dit nie meer nie.'); return; }
  if((s.gedoen['beh'+id]||0) >= 1){ wenk('Een besluit per jaar.'); return; }
  s.gedoen['beh'+id] = 1;
  vraBehandeling(x);
  sluitModaal();
  speelWagry(function(){ stoor(); renderAlles(); });
}

/* ---------- E4: voorbehoeding ---------- */
function wysVoorbehoeding(){
  if(s.ouderdom<14){ wenk('Dit is nog nie vir jou nie.'); return; }
  var opsies = VOORBEHOEDING.filter(function(x){
    /* Sterilisasie is 'n operasie, en nie 'n keuse wat jy terugdraai nie. */
    return x.id!=='steriel' || s.ouderdom>=21;
  }).map(function(x){
    return {t:x.n, klas: s.voorbehoeding===x.id ? 'groen' : '',
      sub: (x.id==='steriel' ? geld(STERILISASIE_KOSTE) + ' eenmalig'
        : x.koste ? geld(x.koste) + ' per jaar' : 'Gratis') +
        ' · ' + Math.round(x.f*100) + '% effektief · ' + x.sub,
      doen:function(){ kiesVoorbehoeding(x.id); }};
  });
  kiesLys('Voorbehoeding', 'Hoe jy dit hanteer, bepaal of ’n swangerskap ’n ' +
    'keuse of ’n verrassing is. Niks is 100% nie.', opsies);
}
function kiesVoorbehoeding(id){
  var x = voorbehoedingVan(id);
  if(id==='steriel'){
    if(s.geld < STERILISASIE_KOSTE && !s.mediesefonds){
      wenk('Die operasie kos ' + geld(STERILISASIE_KOSTE) + '.'); return; }
    var koste = s.mediesefonds ? Math.round(STERILISASIE_KOSTE*(1-mediesefonds().dek)) : STERILISASIE_KOSTE;
    s.geld -= koste;
    noteer('Jy is gesteriliseer (' + geld(koste) + '). Daar kom nie meer kinders nie.','neutraal');
  } else noteer('Jy gebruik nou ' + x.n.toLowerCase() + '.','neutraal');
  s.voorbehoeding = id;
  sluitModaal(); stoor(); renderAlles();
}

/* ==========================================================================
   F4 — DRANK, SIGARETTE EN DWELMS
   Elke een begin met een keuse en hou dan aan uit sy eie.
   ========================================================================== */
function beginGewoonte(id){
  var g = gewoonteVan(id);
  if(!g) return;
  var v = gewoonteVlak(id);
  if((s.gedoen['gw'+id]||0) >= 1){ wenk('Genoeg daarvan vir vanjaar.'); return; }
  s.gedoen['gw'+id] = 1;
  s.gewoonteLaas[id] = s.ouderdom;   /* F4 — hoe onlangs jy dit opgesoek het */
  /* Die wettige ouderdom in SA is 18 vir drank. Jonger is dit nie
     onmoontlik nie — net gevaarliker, en jou ouers kan jou vang. */
  if(s.ouderdom < g.min){ wenk('Jy is te jonk daarvoor.'); return; }
  var tejonk = id==='drink' && s.ouderdom<18;
  var koste = Math.round((id==='drink' ? 450 : id==='rook' ? 120 : 900) * dorpFaktor());
  if(s.geld < koste && s.ouderdom<18){ wenk('Jy het nie die geld nie.'); return; }
  s.geld -= koste;
  if(v===0){
    s.gewoontes[id] = 1;
    s.opgehou[id] = 0;
    noteer(id==='drink' ? 'Jy het vir die eerste keer gedrink.'
      : id==='rook' ? 'Jy het jou eerste sigaret gerook.'
      : 'Jy het dwelms probeer. Net hierdie een keer, het jy gesê.', 'sleg');
  } else {
    s.geluk = klem(s.geluk + tussen(2,8));
    noteer(id==='drink' ? 'Jy het lekker gekuier.'
      : id==='rook' ? 'Jy het nog ’n pakkie gekoop.'
      : 'Jy het weer gebruik.', 'neutraal');
    /* Die spiraal werk ook as jy dit self opsoek. */
    if(v<3 && kans(g.spiraal[v] + 10)){
      s.gewoontes[id] = v+1;
      noteer('Jy is nou ' + g.vlakke[v+1] + '.','sleg');
    }
  }
  if(tejonk) teJonkGevang(g);
  if(id==='dwelms' && kans(6 + gewoonteVlak('dwelms')*7)){
    tronkToe(tussen(1,3), 'dwelmbesit');
  }
  sluitModaal(); stoor(); renderAlles();
  /* F4 — en dan die vraag wat 'n lewe kan kos. */
  if(id==='drink' && s.lisensie && magBestuur() && hetMotor()) vraRyHuisToe();
}
function hetMotor(){ return s.bates.some(function(b){ return b.t==='motor'; }); }
/* F4 + Fase 1 se lisensiestelsel: dronkbestuur het regte gevolge. */
function vraRyHuisToe(){
  var uber = Math.round(380 * dorpFaktor());
  wysModaal('Hoe kom jy huis toe?',
    'Jy het te veel gehad en jou motor staan buite.',
    [
      {t:'Bestuur self', klas:'rooi', sub:'Dit is net ’n paar blokke', doen:function(){
        sluitModaal(); dronkBestuur(); }},
      {t:'Kry ’n e-hailing', sub:geld(uber), doen:function(){
        s.geld -= uber;
        noteer('Jy het ’n e-hailing huis toe geneem (' + geld(uber) + ').','geld');
        sluitModaal(); stoor(); renderAlles(); }},
      {t:'Slaap daar', klas:'grys', sub:'Op iemand se bank', doen:function(){
        s.gesondheid = klem(s.gesondheid - tussen(0,2));
        noteer('Jy het op ’n vriend se bank geslaap.','neutraal');
        sluitModaal(); stoor(); renderAlles(); }}
    ]);
}
function dronkBestuur(){
  s.dronkbestuur = (s.dronkbestuur||0) + 1;
  if(kans(DRONKBESTUUR_ONGELUK)){
    var erg = kans(40);
    s.gesondheid = klem(s.gesondheid - tussen(erg?20:6, erg?45:18));
    noteer('Jy het dronk in ’n ongeluk gery.','sleg');
    if(erg) kryToestand('been');
    /* Die motor is op, en die versekering betaal nie vir dronkbestuur nie. */
    var motor = s.bates.filter(function(b){ return b.t==='motor'; })[0];
    if(motor){
      s.bates = s.bates.filter(function(b){ return b!==motor; });
      noteer(motor.n + ' is opgemors. Die versekering betaal nie vir dronkbestuur nie.','sleg');
    }
    s.lisensie = false; s.lisensieWeg = tussen(LISENSIE_TERUG[0], LISENSIE_TERUG[1]) + 1;
    s.rekord.push('dronkbestuur');
    noteer('Jou lisensie is opgeskort en dronkbestuur staan op jou rekord.','misdaad');
    if(erg && kans(45)) tronkToe(tussen(1,4), 'dronkbestuur met ernstige beserings');
  } else if(kans(DRONKBESTUUR_VANG)){
    var boete = Math.round(tussen(DRONKBESTUUR_BOETE[0], DRONKBESTUUR_BOETE[1]));
    betaalWatJyKan(boete, 'die boete vir dronkbestuur');
    s.lisensie = false; s.lisensieWeg = tussen(LISENSIE_TERUG[0], LISENSIE_TERUG[1]);
    s.rekord.push('dronkbestuur');
    s.geluk = klem(s.geluk - tussen(8,16));
    noteer('Die sperwyer het jou gevang. Boete ' + geld(boete) +
      ', en jou lisensie is ' + s.lisensieWeg + ' jaar opgeskort.','misdaad');
  } else {
    noteer('Jy het dronk huis toe gery en niks het gebeur. Dié keer.','neutraal');
  }
  stoor(); renderAlles();
}
/* Ophou is die moeilikste deel: self, by die kliniek, of in 'n privaat
   rehabilitasiesentrum wat werk maar baie kos. */
function wysOphou(id){
  var g = gewoonteVan(id);
  var v = gewoonteVlak(id);
  if(!v){ wenk('Jy doen dit nie.'); return; }
  if((s.gedoen['op'+id]||0) >= 1){ wenk('Jy het dit vanjaar al probeer.'); return; }
  var opsies = [
    {t:'Probeer op jou eie ophou', sub: ONTNUGTER_SELF + (v<2 ? ' + ' : '') +
      (v<2 ? '30' : '0') + '% kans · gratis',
      doen:function(){ probeerOphou(id, 'self'); }},
    {t:'Gaan kliniek toe', sub:'Die staat se program · gratis · ' +
      Math.round(ONTNUGTER_KANS*0.62) + '% kans',
      doen:function(){ probeerOphou(id, 'kliniek'); }}
  ];
  if(v>=2) opsies.push({t:'Gaan rehabilitasie toe', klas:'groen',
    sub: geld(ONTNUGTER_KOSTE) + ' · ' + ONTNUGTER_KANS + '% kans' +
      (s.mediesefonds ? ' · jou fonds help' : ''),
    doen:function(){ probeerOphou(id, 'rehab'); }});
  kiesLys('Ophou met ' + g.n.toLowerCase(),
    'Jy is ' + g.vlakke[v] + '. ' + (v>=3
      ? 'Dit het jou vas, en dit gaan nie van self weggaan nie.'
      : 'Nou is dit nog makliker as later.'), opsies);
}
function probeerOphou(id, hoe){
  var g = gewoonteVan(id), v = gewoonteVlak(id);
  s.gedoen['op'+id] = 1;
  var p = hoe==='self' ? ONTNUGTER_SELF + (v<2 ? 30 : 0)
    : hoe==='kliniek' ? Math.round(ONTNUGTER_KANS*0.62)
    : ONTNUGTER_KANS;
  if(hoe==='rehab'){
    var koste = s.mediesefonds
      ? Math.round(ONTNUGTER_KOSTE * (1 - mediesefonds().dek))
      : ONTNUGTER_KOSTE;
    if(koste > Math.max(0,s.geld) + (s.spaar||0) + skuldPerk()){
      wenk('Rehabilitasie kos ' + geld(koste) + '.'); return; }
    betaalWatJyKan(koste, 'die rehabilitasiesentrum');
    s.rehabs = (s.rehabs||0) + 1;
    /* Elke keer wat jy al daar was, maak die volgende keer swaarder. */
    p -= (s.rehabs-1) * 7;
  }
  if(hoe==='kliniek') s.geluk = klem(s.geluk - tussen(0,4));
  if(kans(p)){
    s.gewoontes[id] = 0;
    s.opgehou[id] = 1;
    s.geluk = klem(s.geluk + tussen(6,14));
    s.gesondheid = klem(s.gesondheid + tussen(2,7));
    noteer('Jy het opgehou met ' + g.n.toLowerCase() + '. Dit was die moeilikste jaar.','goed');
  } else {
    s.geluk = klem(s.geluk - tussen(4,11));
    noteer('Jy het probeer ophou met ' + g.n.toLowerCase() + ' en dit nie gehou nie.','sleg');
    if(v<3 && kans(22)){ s.gewoontes[id] = v+1;
      noteer('Dit is nou erger as voorheen: jy is ' + g.vlakke[v+1] + '.','sleg'); }
  }
  sluitModaal(); stoor(); renderAlles();
}
