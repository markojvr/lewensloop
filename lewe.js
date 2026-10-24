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
    deeltyds:null, deeltydsJare:0,
    pensioen:0, pensioenFonds:0, pensioenKoers:0.075, afgetree:false,
    skool:{vlak:'baba', graad:0, studie:null, jareOor:0, punte:0, matriek:false, grade:[], nagraads:[],
      uit:false, agter:0,
      /* C1 — die vakke van Graad 10, en of jy Wiskunde geneem het */
      vakke:null, wiskunde:false,
      /* C2 — jou matriekuitslag per vak, en die APS wat daaruit kom */
      uitslag:[], aps:0,
      /* C9 — hoe hard jy vanjaar studeer, hoeveel jare jy gedruip het,
         hoeveel jy geslaag het, en hoeveel keer jy uitgesluit is */
      ywer:0, herhaal:0, geslaagJare:0, uitgeskop:0, jare:0},
    laerskool:null, hoerskool:null, uni:null, aansien:0, diere:[], lisensie:false,
    verhoudings:[], bates:[], log:[], rekord:[], tronk:null, tronkJare:0,
    dakloos:null, dakloosJare:0,
    kinders:0, kindersGebore:0, troues:0, gedoen:{}, vlagge:{}, tab:'lewe',
    /* F1/F2 — die liggaam: watter toestande jy het, en hoe jy daarvoor betaal */
    siektes:[], mediesefonds:null, fondsJare:0, siekJare:0,
    /* F4 — drank, sigarette en dwelms, elk op vlak 0 tot 3 */
    gewoontes:{drink:0, rook:0, dwelms:0}, gewoonteJare:{}, gewoonteLaas:{}, opgehou:{},
    rehabs:0, lisensieWeg:0, dronkbestuur:0,
    /* E4 — voorbehoeding en hoeveel swangerskappe daar was */
    voorbehoeding:'geen', swangerskappe:0,
    /* F9 — jou familiegeskiedenis, by geboorte gerol */
    gene:null, kleinkinders:0,
    /* H3 — vaardighede en stokperdjies: id -> {vlak, punte, jare, laas} */
    vaardighede:{},
    /* H4 — jou eie besigheid, en wat jy al gehad het */
    besigheid:null, besighedeGehad:[],
    /* H1 — die hoeveelste lewe in hierdie familie, en wie voor jou was */
    generasie:1, familielyn:[],
    /* Fase 7 — wat jy oor jou hele lewe by die casino ingesit en uitgehaal het */
    casino:{sessies:0, ingekoop:0, uitbetaal:0}
  };
  /* F9 — die gene word heel eerste gerol, want elke ander stelsel kan
     daarna daarna kyk (watter siekte in die familie is, hoe lank jy leef). */
  s.gene = rolGene();
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
  maakGrootouers();
  noteer('Jy is in ' + s.dorp + ' gebore in ’n ' + ryk.n + ' gesin.','goed');
  noteer('Jou naam is ' + s.naam + ' ' + s.van + '.','neutraal');
  if(s.vlagge.geenPa) noteer('Jou pa was nie in die prentjie nie.','sleg');
  noteer('Jy kom uit ' + s.gene.n + '.', s.gene.f<1 ? 'goed' : s.gene.f>1 ? 'sleg' : 'neutraal');
  grootouerGeboorte();
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
    klasmaat:'Klasmaat', kollega:'Kollega', baas:'Jou baas',
    /* E1 en E7 */
    ouma:'Ouma', oupa:'Oupa',
    kleinkind: v.geslag==='m'?'Kleinseun':'Kleindogter',
    /* H1 — die generasiespel skuif die familie een plek op: jou pa se
       broer word jou oom, jou kleinkind se niggie word jou niggie. */
    oom:'Oom', tante:'Tante', neef:'Neef', niggie:'Niggie'};
  var n = m[v.tipe] || 'Vriend';
  if((v.tipe==='ouma'||v.tipe==='oupa') && v.kant)
    n += v.kant==='ma' ? ' (ma se kant)' : ' (pa se kant)';
  return n;
}
/* Afrikaans stem die besitlike vorm met die geslag saam: sy seun, haar
   dogter. Sonder hierdie helper staan daar "Carike het sy graad gekry". */
function besit(v){ return v && v.geslag==='v' ? 'haar' : 'sy'; }

/* ==========================================================================
   H14 — VLAE WAT ONTHOU
   Voor Fase 6 het geen keuse ooit 'n latere gebeurtenis verander nie.
   Nou skryf 'n keuse 'n vlag in s.vlagge, en 'n gebeurtenis jare later
   lees dit: die boelie wat jy op tien geslaan het, kom op dertig weer
   voor; die vriend wat jou geld geskuld het, duik weer op.

   'n Vlag hou drie dinge by: in watter jaar dit gestel is ('o'), hoeveel
   keer ('keer'), en wat ook al die gebeurtenis daarby wil onthou ('d',
   gewoonlik 'n naam). Die ou vlae (s.vlagge.gevang, geenPa, aftreeGevra)
   is gewone getalle — vlag() hanteer albei vorms, sodat ou stoor-data
   steeds werk.
   ========================================================================== */
function stelVlag(naam, data){
  if(!s.vlagge) s.vlagge = {};
  var oud = vlag(naam);
  s.vlagge[naam] = {o:s.ouderdom, keer:(oud?oud.keer:0)+1,
    d:(data===undefined ? (oud?oud.d:null) : data)};
  return s.vlagge[naam];
}
function vlag(naam){
  var v = s.vlagge ? s.vlagge[naam] : null;
  if(!v) return null;
  if(typeof v === 'object') return v;
  return {o:0, keer:Number(v)||1, d:null};   /* 'n ou vlag wat net 'n getal was */
}
function hetVlag(naam){ return !!vlag(naam); }
function vlagKeer(naam){ var v = vlag(naam); return v ? v.keer : 0; }
/* Hoeveel jare terug is dit gestel? -1 as dit nooit gebeur het nie. */
function vlagJare(naam){ var v = vlag(naam); return v ? s.ouderdom - v.o : -1; }
function vlagData(naam){ var v = vlag(naam); return v ? v.d : null; }
/* Die naam wat by 'n vlag gestoor is, of 'n terugval as daar nie een is nie. */
function vlagNaam(naam, terugval){
  var d = vlagData(naam);
  if(d && typeof d === 'object' && d.naam) return d.naam;
  if(typeof d === 'string' && d) return d;
  return terugval || kies(MANSNAME);
}
function wisVlag(naam){ if(s.vlagge) delete s.vlagge[naam]; }
/* 'n Vlag wat eers ná 'n paar jaar mag "terugkom": dit moet gestel wees,
   die jare moet verby wees, en dit mag nie klaar afgehandel wees nie. */
function vlagRyp(naam, jare){
  return hetVlag(naam) && vlagJare(naam) >= (jare||1) && !hetVlag(naam + 'Klaar');
}
function sluitVlag(naam){ stelVlag(naam + 'Klaar', null); }
function emoVan(v){
  var m={ma:'\u{1F469}', pa:'\u{1F468}', broer:'\u{1F466}', suster:'\u{1F467}',
    lief:'\u{1F495}', eggenoot:'\u{1F48D}', seun:'\u{1F9D2}', dogter:'\u{1F9D2}',
    klasmaat:'\u{1F392}', kollega:'\u{1F454}', baas:'\u{1F9D1}',
    ouma:'\u{1F475}', oupa:'\u{1F474}', kleinkind:'\u{1F476}',
    oom:'\u{1F9D4}', tante:'\u{1F471}', neef:'\u{1F9D1}', niggie:'\u{1F469}'};
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
  /* Fase 3 — vakke, APS, druipjare en deeltydse werk. */
  if(s.deeltyds===undefined) s.deeltyds = null;         /* D3 */
  if(s.deeltydsJare===undefined) s.deeltydsJare = 0;
  if(s.skool.vakke===undefined) s.skool.vakke = null;   /* C1 */
  if(s.skool.wiskunde===undefined) s.skool.wiskunde = false;
  if(!s.skool.uitslag) s.skool.uitslag = [];            /* C2 */
  if(!s.skool.aps) s.skool.aps = 0;
  if(!s.skool.ywer) s.skool.ywer = 0;                   /* C9 */
  if(!s.skool.herhaal) s.skool.herhaal = 0;
  if(!s.skool.geslaagJare) s.skool.geslaagJare = 0;
  if(!s.skool.uitgeskop) s.skool.uitgeskop = 0;
  if(!s.skool.jare) s.skool.jare = s.skool.jareOor || 0;
  /* Het 'n ou lewe al matriek maar geen APS nie, reken ons een uit sy
     gemiddeld terug — anders sou elke universiteit hom skielik weier. */
  if(s.skool.matriek && !s.skool.aps && s.skool.punte)
    s.skool.aps = apsVanGemiddeld(s.skool.punte);
  /* D6 — 'n ou werk ken nie sy plafon nie. */
  if(s.beroep && !s.beroep.plafon) s.beroep.plafon = beroepPlafon(s.beroep.id);
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
  /* Fase 5 — gesin en gesondheid. 'n Lewe wat voor hierdie fase gestoor
     is, het geen siektes, geen gewoontes, geen gene en geen grootouers
     nie; elke veld kry hier sy verstek sodat so 'n lewe steeds laai. */
  if(!s.siektes) s.siektes = [];                        /* F1 */
  if(s.mediesefonds===undefined) s.mediesefonds = null; /* F2 */
  if(!s.fondsJare) s.fondsJare = 0;
  if(!s.siekJare) s.siekJare = 0;
  if(!s.gewoontes) s.gewoontes = {drink:0, rook:0, dwelms:0};  /* F4 */
  if(!s.gewoonteJare) s.gewoonteJare = {};
  if(!s.gewoonteLaas) s.gewoonteLaas = {};
  if(!s.opgehou) s.opgehou = {};
  if(!s.rehabs) s.rehabs = 0;
  if(!s.lisensieWeg) s.lisensieWeg = 0;
  if(!s.dronkbestuur) s.dronkbestuur = 0;
  if(!s.voorbehoeding) s.voorbehoeding = 'geen';        /* E4 */
  if(!s.swangerskappe) s.swangerskappe = 0;
  if(!s.kleinkinders) s.kleinkinders = 0;               /* E7 */
  if(!s.fiks) s.fiks = 0;
  if(!s.gene) s.gene = rolGene();                       /* F9 */
  /* Fase 6 — vaardighede, 'n eie besigheid en die generasielyn. 'n Lewe
     wat voor hierdie fase gestoor is, weet niks daarvan nie; elke veld
     kry hier sy verstek sodat so 'n lewe steeds laai en verder speel. */
  if(!s.vaardighede) s.vaardighede = {};                /* H3 */
  if(s.besigheid===undefined) s.besigheid = null;       /* H4 */
  if(!s.besighedeGehad) s.besighedeGehad = [];
  if(!s.generasie) s.generasie = 1;                     /* H1 */
  if(!s.familielyn) s.familielyn = [];
  if(!s.vlagge) s.vlagge = {};                          /* H14 */
  /* Fase 7 — die casino se leeftydtelling. */
  if(!s.casino) s.casino = {sessies:0, ingekoop:0, uitbetaal:0};
  /* E7 — 'n ou kind het nog nie 'n eie lewe nie. kindLewe() bou dit
     agteruit uit sy ouderdom, sodat 'n 30-jarige seun nie skielik weer
     in Graad 1 begin nie. E12 doen dieselfde vir 'n eggenoot. */
  s.verhoudings.forEach(function(v){
    if(v.tipe==='seun'||v.tipe==='dogter'||v.tipe==='kleinkind') kindLewe(v);
    if(v.tipe==='eggenoot' && v.werk===undefined) maatBeroepKies(v);
  });
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
  /* H4 — wat iemand vandag vir jou besigheid sou betaal. Die balju en
     'n egskeiding raak dit nie: dit is nie kontant nie, en sonder jou
     is dit meestal niks werd. */
  t += besigheidWaarde();
  return t;
}

/* ==========================================================================
   6. DIE JAARMASJIEN
   ========================================================================== */
function wordOuer(){
  if(!s || !s.lewe) return;
  if(el('modaal').classList.contains('wys')) return;
  s.ouderdom++;
  /* F1 — wat jy VERLEDE jaar vir jou liggaam gedoen het, hou hierdie
     jaar se plafon op gesondheid hoër (sien herstelJaar). */
  s.fiks = (s.gedoen.gim?1:0) + (s.gedoen.draf?1:0) + (s.gedoen.dokter?1:0);
  s.gedoen = {}; s.aansoeke = 0;
  noteer('Jy is nou ' + s.ouderdom + ' jaar oud.','jaar');
  ouderdomDrywing();
  lisensieJaar();
  tronkJaar();
  dakloosJaar();
  skoolJaar();
  beroepJaar();
  aftreeJaar();
  vaardigJaar();                   /* H3 — 'n stokperdjie wat jy laat lê, roes */
  gewoonteJaar();                  /* F4 — drank, rook en dwelms vreet eerste */
  siekteJaar();                    /* F1 — nuwe toestande, en wat hulle doen */
  herstelJaar();                   /* F1/F9 — en dan herstel die liggaam */
  finansiesJaar();                 /* F2 se premie en rekeninge sit hierin */
  verhoudingsJaar();
  grootouerJaar();                 /* E1 */
  lukrakeGebeure();
  s.tab = 'lewe';
  speelWagry(eindeJaar);
}

function eindeJaar(){
  doodKontrole();
  if(!s.lewe){ wysGrafskrif(); return; }
  stoor(); renderAlles(); naOnder();
}

/* F9 — hoe die liggaam oor die jare verval.
   Die ou weergawe het elke jaar ná 56 een tot drie punte, en ná 70 twee
   tot vyf punte afgehaal. Dit het beteken dat ELKE mens se gesondheid
   kort ná 70 op nul was, en nul gesondheid is dood — daarom het almal
   tussen 56 en 72 gesterf, al het hulle niks verkeerd gedoen nie.
   Nou is die verval sagter, en onder 30 punte stabiliseer die liggaam
   op 'n lae vlak in plaas van om reguit na nul te val. Dit maak die
   doodskans in doodKontrole() die werklike oorsaak van die dood, en
   daarmee ook jou gene, jou siektes en jou leefstyl. */
function ouderdomDrywing(){
  var o = s.ouderdom, d;
  if(o<=12)      d = tussen(-1,2);
  else if(o<=25) d = tussen(-1,1);
  else if(o<=40) d = -tussen(0,1);
  else if(o<=55) d = -tussen(0,2);
  else if(o<=70) d = -tussen(0,2);
  else           d = -tussen(1,3);
  /* 'n Taai familie verweer die jare beter; 'n familie met hartsiekte of
     kanker verloor gesondheid vinniger. */
  if(d<0 && s.gene && s.gene.f>1.1 && kans(40)) d -= 1;
  if(d<0 && s.gene && s.gene.f<0.85 && kans(40)) d += 1;
  /* Die liggaam hou onder 30 punte sy lae vlak: 'n ou mens is swak,
     maar nie elke jaar swakker nie. */
  if(d<0 && s.gesondheid<30 && kans(55)) d = Math.ceil(d/2);
  s.gesondheid = klem(s.gesondheid + d);
  /* F4 — rook en dwelms vat jou gesig, nie net jou longe nie. */
  if(o>=20 && (s.gewoontes.rook>=2 || s.gewoontes.dwelms>=2) && kans(55))
    s.voorkoms = klem(s.voorkoms - tussen(1,3));
  if(o>=28) s.voorkoms = klem(s.voorkoms - tussen(0, o>=58?3:1));
  if(o>=5 && s.geluk>32) s.geluk = klem(s.geluk - tussen(0,2));
  if(s.tronk) s.geluk = klem(s.geluk - tussen(5,14));
}

/* ==========================================================================
   F1/F9 — DIE LIGGAAM HERSTEL
   Dit was die ander helfte van die rede waarom almal tussen 56 en 72
   gesterf het: 'gesondheid' het net EEN rigting geken. Elke gebeurtenis,
   elke slegte jaar het 'n punt of twee afgehaal en niks het dit ooit
   teruggegee nie, so die stat het by elke speler teen sowat 70 by nul
   uitgekom — en nul gesondheid is dood.

   Nou het die liggaam 'n natuurlike vlak vir jou ouderdom. 'n Slegte
   jaar stoot jou daaronder en jy klim weer terug; 'n chroniese toestand,
   'n pakkie sigarette per dag of 'n jaar op straat trek die vlak self
   af. Dit is hier waar F1, F2, F4 en jou gene op jou gesondheid uitkom.
   ========================================================================== */
function natuurlikeVlak(){
  var o = s.ouderdom;
  var v = o<=25 ? 92 : o<=40 ? 86 : o<=55 ? 76 : o<=70 ? 62 : o<=82 ? 46 : 32;
  /* F1/F2 — elke toestand trek die vlak af, 'n behandelde een minder. */
  (s.siektes||[]).forEach(function(x){
    var tt = toestandVan(x.id); if(!tt) return;
    var krag = behandelKrag(x);
    v -= Math.round((tt.soort==='chronies' ? 9 : 5) * tt.erns * (1 - krag*0.75));
  });
  /* F4 */
  v -= (s.gewoontes.rook||0)*5 + (s.gewoontes.drink||0)*4 + (s.gewoontes.dwelms||0)*6;
  if(s.dakloos) v -= 14;
  if(s.tronk) v -= 6;
  /* F9 — jou gene, en of iemand na jou kyk. */
  if(s.gene) v -= Math.round((s.gene.f - 1) * 14);
  if(sorgVlak()===2) v += 4;
  else if(sorgVlak()===0) v -= 4;
  return klem(v, 4, 100);
}
function herstelJaar(){
  var doel = natuurlikeVlak();
  /* Oefening lig die plafon: 'n fiks mens van 60 is gesonder as sy
     natuurlike vlak — maar hy is nie 'n twintigjarige nie. Sonder
     hierdie plafon hou gym en draf elke speler op 100 en word niemand
     ooit oud genoeg om te sterf nie. */
  var plafon = klem(doel + (s.fiks||0)*4 + 4);
  if(s.gesondheid < doel)
    s.gesondheid = klem(s.gesondheid + Math.min(tussen(1,4), doel - s.gesondheid));
  else if(s.gesondheid > plafon)
    s.gesondheid = klem(s.gesondheid - Math.min(tussen(1,3), s.gesondheid - plafon));
}

/* ---------- Rylisensie ---------- */
/* A16 — in SA kry jy jou leerlinglisensie op 17 en jou rylisensie op 18.
   Vir nou is dit net 'n ouderdomsvereiste om 'n motor te besit en te
   bestuur; die volle motorstelsel (toetse, versekering, licence disc)
   is item H9 vir later. */
/* F4 — 'n lisensie wat weens dronkbestuur opgeskort is, maak bestuur
   onwettig totdat die jare verby is. */
function magBestuur(){ return s.ouderdom>=18 && !s.lisensieWeg; }
function lisensieJaar(){
  if(s.lisensieWeg>0){
    s.lisensieWeg--;
    if(s.lisensieWeg<=0){ s.lisensie = true;
      noteer('Jy het jou rylisensie terug. Hou dit dié keer.','goed'); }
    else noteer('Jou lisensie is nog ' + s.lisensieWeg + ' jaar opgeskort.','sleg');
    return;
  }
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

/* ==========================================================================
   C1 — VAKKEUSE IN GRAAD 10
   In Graad 10 kies jy sewe vakke, en daardie keuse bepaal alles daarna.
   Die verpligte vier is twee tale, Lewensorientering en Wiskunde OF
   Wiskundige Geletterdheid. Die ander drie kies jy uit wat jou skool
   aanbied. Sonder Wiskunde kan jy nooit die vakvlak kry wat
   Ingenieurswese, Geneeskunde, Rekeningkunde of Rekenaarwetenskap vra.
   ========================================================================== */
function vakVan(naam){
  var r = null;
  VAKKE.forEach(function(x){ if(x.n===naam) r=x; });
  return r;
}
/* Watter keusevakke bied jou skool aan? */
function skoolBied(){ return (s.hoerskool && s.hoerskool.bied) || SKOOL_BIED; }
function hetVak(naam){ return (s.skool.vakke||[]).indexOf(naam)>=0; }
/* Is 'n keusevak vir jou oop? Fisiese Wetenskappe, IT en Elektriese
   Tegnologie werk nie sonder Wiskunde nie — geen skool laat dit toe. */
function vakOop(naam){
  var v = vakVan(naam);
  if(!v) return false;
  if(v.wisk && !s.skool.wiskunde) return false;
  return !hetVak(naam);
}
function vakkeKeuse(){
  wagry.push({titel:'Vakkeuse vir Graad ' + VAKKEUSE_GRAAD,
    vraag:'Jy moet nou kies watter vakke jy tot matriek gaan neem. Die ' +
      'belangrikste besluit is die eerste een, en jy kan dit later nie ' +
      'maklik verander nie.',
    opsies:[
      {t:'Wiskunde', sub:'Swaarder, laer punte — maar Ingenieurswese, ' +
        'Geneeskunde, Rekeningkunde en Rekenaarwetenskap bly oop',
        doen:function(){ stelKernvak('Wiskunde'); }},
      {t:'Wiskundige Geletterdheid', sub:'Baie makliker en ’n beter APS — ' +
        'maar daardie vier studierigtings is dan vir altyd toe',
        doen:function(){ stelKernvak('Wiskundige Geletterdheid'); }}
    ]});
}
function stelKernvak(naam){
  var sk = s.skool;
  sk.wiskunde = (naam==='Wiskunde');
  sk.vakke = VAKKE_VERPLIG.concat([naam]);
  noteer('Jy het ' + naam + ' gekies.','skool');
  vraKeusevak();
}
function vraKeusevak(){
  var sk = s.skool;
  var gekies = sk.vakke.length - VAKKE_VERPLIG.length - 1;
  if(gekies >= KEUSEVAKKE){ klaarVakke(); return; }
  var aanbod = skoolBied().filter(vakOop);
  if(!aanbod.length){ klaarVakke(); return; }
  var opsies = aanbod.map(function(naam){
    var v = vakVan(naam);
    return {t:naam, sub: v.sub || (v.moeilik<=-5 ? 'Een van die swaarder vakke'
        : v.moeilik>=5 ? '’n Vak waarin die punte gewoonlik hoog is' : ''),
      doen:function(){ sk.vakke.push(naam); vraKeusevak(); }};
  });
  wagry.push({titel:'Keusevak ' + (gekies+1) + ' van ' + KEUSEVAKKE,
    vraag:'Jy het ' + sk.vakke.join(', ') + '. Kies nog ' +
      (KEUSEVAKKE-gekies) + ' vak' + (KEUSEVAKKE-gekies===1?'':'ke') + ' by ' +
      (s.hoerskool ? s.hoerskool.n : 'jou skool') + '.',
    opsies:opsies});
}
function klaarVakke(){
  noteer('Jou vakke tot matriek: ' + s.skool.vakke.join(', ') + '.','skool');
  if(!s.skool.wiskunde)
    noteer('Sonder Wiskunde is Ingenieurswese, Geneeskunde, Rekeningkunde en ' +
      'Rekenaarwetenskap na matriek vir jou toe.','neutraal');
}
/* Vir 'n lewe wat die skool verlaat of in die tronk was voordat die
   keuse ooit gekom het, en vir ou stoor-data: die mees algemene
   SA-pakket, met Wiskundige Geletterdheid. */
function verstekVakke(){
  var sk = s.skool;
  sk.wiskunde = false;
  sk.vakke = VAKKE_VERPLIG.concat(['Wiskundige Geletterdheid',
    'Besigheidstudies','Geografie','Toerisme']);
  return sk.vakke;
}

/* ==========================================================================
   C2 — DIE APS
   Matriek gee nie 'n persentasie-gemiddeld vir toelating nie. Elke vak
   kry 'n vlak van 1 tot 7, en jou APS is die som van jou ses beste vakke
   sonder Lewensorientering: 6 x 7 = 42.
   ========================================================================== */
function apsVlak(persent){
  var v = 1;
  for(var i=0;i<APS_VLAKKE.length;i++)
    if(persent >= APS_VLAKKE[i].vanaf){ v = APS_VLAKKE[i].vlak; break; }
  return v;
}
function apsNaam(vlak){
  var n = '';
  APS_VLAKKE.forEach(function(x){ if(x.vlak===vlak) n = x.n; });
  return n;
}
/* 'n Ou lewe het net 'n gemiddeld. Ses vakke op daardie vlak is die
   naaste eerlike skatting van wat sy APS sou wees. */
function apsVanGemiddeld(persent){
  return klem(apsVlak(persent) * APS_VAKKE, 0, APS_MAKS);
}
/* Jou vlak in 'n vak, of 0 as jy dit nooit gehad het nie. Dit is waar
   die vakkeuse van Graad 10 die universiteit se deur toemaak. */
function vakVlak(naam){
  var v = 0;
  (s.skool.uitslag||[]).forEach(function(r){ if(r.n===naam) v = r.vlak; });
  return v;
}
/* Jou matriekuitslag, vak vir vak. 'basis' is jou algemene vlak vir die
   jaar (dieselfde vorm as die ou een-getal-punt, sodat die balans van
   die spel nie skuif nie); elke vak se 'moeilik' skuif dit op of af. */
function berekenUitslag(){
  var sk = s.skool;
  if(!sk.vakke || sk.vakke.length < 4) verstekVakke();
  var bonus = s.hoerskool ? (s.hoerskool.slim||0)*2 : 0;
  var basis = s.slim*0.72 + bonus + tussen(6,20);
  sk.uitslag = sk.vakke.map(function(naam){
    var v = vakVan(naam), p = klem(basis + (v?v.moeilik:0) + tussen(-6,6));
    return {n:naam, p:p, vlak:apsVlak(p), aps: !(v && v.nieAps)};
  });
  var som = 0;
  sk.uitslag.forEach(function(r){ som += r.p; });
  sk.punte = Math.round(som / sk.uitslag.length);
  var vlakke = sk.uitslag.filter(function(r){ return r.aps; })
    .map(function(r){ return r.vlak; }).sort(function(a,b){ return b-a; });
  var aps = 0;
  vlakke.slice(0, APS_VAKKE).forEach(function(v){ aps += v; });
  sk.aps = Math.min(APS_MAKS, aps);
  return sk;
}
function uitslagTeks(){
  return (s.skool.uitslag||[]).map(function(r){
    return r.n + ' ' + r.p + '% (' + r.vlak + ')'; }).join(', ');
}
/* C3 later: sk.uitslag hou elke vak se persentasie en vlak, en daarmee
   kan 'n Hoer Sertifikaat-, Diploma- en Bachelor's-slaag bereken word
   sonder om aan hierdie funksie te raak. */
function matriekJaar(){
  var sk = s.skool;
  berekenUitslag();
  sk.vlak = 'klaar';
  if(sk.punte >= 40){
    sk.matriek = true; s.geluk = klem(s.geluk+12);
    noteer('Jy het matriek geslaag: ’n gemiddeld van ' + sk.punte +
      '% en ’n APS van ' + sk.aps + ' uit ' + APS_MAKS + '.','goed');
    noteer('Jou uitslag: ' + uitslagTeks(),'skool');
    if(sk.punte>=80) noteer('Jy het die graad met onderskeiding deurgekom.','goed');
    if(sk.aps>=36) noteer('Met daardie APS sal enige universiteit na jou kyk.','goed');
    else if(sk.aps<24) noteer('Met ’n APS van ' + sk.aps +
      ' gaan dit moeilik wees om by ’n universiteit in te kom.','neutraal');
  } else {
    s.geluk = klem(s.geluk-16);
    noteer('Jy het matriek gedruip met ’n gemiddeld van ' + sk.punte +
      '%. Dis ’n harde slag.','sleg');
    noteer('Jou uitslag: ' + uitslagTeks(),'skool');
  }
  sluitGroep('klasmaat','na skool');
}

/* ==========================================================================
   C9 — SLAAG OF DRUIP OP UNIVERSITEIT
   Klasgeld betaal was voorheen genoeg om 'n graad te kry. Nou is daar
   elke jaar 'n slaagkans: slimheid help, hard studeer help meer, 'n
   swaar graad maak dit moeiliker, en die eerste jaar is die een waar
   die meeste mense val. Druip jy drie jaar, skryf hulle jou uit.
   ========================================================================== */
function studieVanNaam(naam){
  var r = null;
  STUDIES.forEach(function(x){ if(x.n===naam) r=x; });
  if(!r) NAGRAADS.forEach(function(x){ if(x.n===naam) r=x; });
  return r;
}
function slaagKans(){
  var sk = s.skool, st = studieVanNaam(sk.studie);
  var k = SLAAG_BASIS + (s.slim-50)*SLAAG_SLIM;
  if(sk.ywer) k += SLAAG_YWER;
  if(!sk.geslaagJare && !sk.herhaal) k += SLAAG_EERSTEJAAR;
  if(s.deeltyds) k += SLAAG_DEELTYDS;                         /* D3 */
  if(s.gesondheid < 40) k += SLAAG_SIEK;
  if(st && st.aps) k -= Math.max(0, st.aps - 28) * SLAAG_SWAAR;
  if(st && st.slim) k -= Math.max(0, st.slim - 62) * 0.8;     /* nagraads */
  return Math.max(SLAAG_MIN, Math.min(SLAAG_MAKS, Math.round(k)));
}
function studieJaar(){
  var sk = s.skool;
  var koste = sk.koste || 0;
  if(!sk.beurs && koste>0){
    s.geld -= koste;
    noteer('Jy het ' + geld(koste) + ' klasgeld betaal.','geld');
  }
  s.slim = klem(s.slim + tussen(2,6));
  var kansie = slaagKans(), ywer = sk.ywer;
  sk.ywer = 0;
  if(!kans(kansie)){ druipJaar(ywer); return; }
  sk.geslaagJare = (sk.geslaagJare||0) + 1;
  sk.jareOor--;
  if(sk.jareOor > 0){
    noteer('Jy het jaar ' + sk.geslaagJare + ' van ' + (sk.jare||sk.geslaagJare+sk.jareOor) +
      ' in ' + sk.studie + ' by ' + (s.uni?s.uni.n:'die universiteit') +
      ' geslaag (' + sk.jareOor + ' jaar oor).','skool');
    klasGebeurtenis();
    return;
  }
  if(sk.vlak==='universiteit'){
    sk.grade.push(sk.studie);
    noteer('Jy het gegradueer met ’n graad in ' + sk.studie + '!','goed');
  } else {
    sk.nagraads.push(sk.studie);
    noteer('Jy het ' + sk.studie + ' voltooi. Nou is jy regtig gekwalifiseer.','goed');
  }
  s.geluk = klem(s.geluk + 14);
  sk.vlak='klaar'; sk.studie=null; sk.koste=0; sk.beurs=false;
  sk.jare=0; sk.herhaal=0; sk.geslaagJare=0;
  sluitGroep('klasmaat','na jou studies');
}
function druipJaar(ywer){
  var sk = s.skool;
  sk.herhaal = (sk.herhaal||0) + 1;
  s.geluk = klem(s.geluk - 14);
  noteer('Jy het jou jaar in ' + sk.studie + ' gedruip' +
    (ywer ? ', al het jy hard gewerk' : '') + '. Jy moet dit oordoen.','sleg');
  if(sk.beurs && sk.herhaal >= DRUIP_BEURS){
    sk.beurs = false; sk.koste = s.uni ? s.uni.koste : 0;
    noteer('Jou beurs is opgeskort — van nou af betaal jy self klasgeld.','sleg');
  }
  if(sk.herhaal >= DRUIP_MAKS) uitgesluit();
}
function uitgesluit(){
  var sk = s.skool;
  sk.uitgeskop = (sk.uitgeskop||0) + 1;
  noteer('Akademiese uitsluiting: ' + (s.uni?s.uni.n:'die universiteit') +
    ' het jou na ' + sk.herhaal + ' mislukte jare uitgeskryf.','sleg');
  s.geluk = klem(s.geluk - 20);
  sluitGroep('klasmaat','na jou uitsluiting');
  sk.vlak='klaar'; sk.studie=null; sk.koste=0; sk.beurs=false;
  sk.jareOor=0; sk.jare=0; sk.herhaal=0; sk.geslaagJare=0; sk.ywer=0;
  s.aansien = 0;
}

function skoolJaar(){
  var o = s.ouderdom, sk = s.skool;
  if(s.tronk){ skoolJaarVerloor('in die tronk'); return; }
  /* B18 — op straat is skool en studie toe, net soos in die tronk. */
  if(s.dakloos){ skoolJaarVerloor('op straat'); return; }

  if(sk.vlak==='universiteit' || sk.vlak==='nagraads'){ studieJaar(); return; }
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
    /* C1 — in Graad 10 kies jy jou vakke. 'n Ou stoor-lewe wat al verder
       is, kies dit by die eerste geleentheid wat kom. */
    if(g>=VAKKEUSE_GRAAD && !sk.vakke) vakkeKeuse();
    /* Wiskunde en IT laat jou harder dink as die ander vakke. */
    if(sk.wiskunde) s.slim = klem(s.slim + tussen(0,2));
    if(hetVak('Inligtingstegnologie')) s.slim = klem(s.slim + tussen(0,2));
    klasGebeurtenis(); return;
  }
  if(g>=13 && sk.vlak==='hoerskool'){ matriekJaar(); return; }
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
/* D6 — die meeste wat 'n pos ooit kan betaal. Sonder dit groei 'n
   salaris 4,5% per jaar sonder einde en beteken groot bedrae niks. */
function beroepPlafon(id){
  var p = 0;
  BEROEPE.forEach(function(x){ if(x.id===id) p = x.plafon||0; });
  return p;
}
/* Sny die salaris terug tot by die plafon. Gee terug of dit gesny is. */
function pasPlafonToe(){
  var b = s.beroep;
  if(!b) return false;
  if(!b.plafon) b.plafon = beroepPlafon(b.id);
  if(!b.plafon || b.salaris <= b.plafon) return false;
  b.salaris = b.plafon;
  return true;
}
function beroepJaar(){
  if(!s.beroep) return;
  if(s.tronk){ noteer('Jy het jou werk as ' + beroepTitel() + ' verloor terwyl jy in die tronk is.','werk');
    s.beroep=null; losWerkMense(); return; }
  var b = s.beroep;
  b.jare++; s.jareGewerk++;
  b.salaris = Math.round(b.salaris * 1.045);
  pasPlafonToe();
  b.prestasie = klem(b.prestasie + tussen(-7,4) + Math.round((s.slim-50)/16));
  if(b.prestasie>=72 && b.vlak<4 && kans(26 + (b.prestasie-72))){
    b.vlak++; b.salaris = Math.round(b.basis * VLAK_X[b.vlak] * Math.pow(1.045,b.jare));
    pasPlafonToe();
    b.prestasie = klem(b.prestasie-18);
    s.geluk = klem(s.geluk+11);
    noteer('Bevordering! Jy is nou ' + beroepTitel() + ' teen ' + geld(b.salaris) + ' per jaar.','werk');
  } else if(b.prestasie<=20 && kans(38)){
    noteer('Jy is afgedank as ' + beroepTitel() + '. Jou prestasie was te swak.','sleg');
    s.geluk = klem(s.geluk-16); s.beroep=null; losWerkMense();
    return;
  }
  /* Een keer, wanneer jy die boonste punt van die skaal haal. */
  if(b.plafon && b.salaris >= b.plafon && !b.vol){
    b.vol = 1;
    noteer('Jy verdien nou die meeste wat ’n ' + beroepTitel() +
      ' kan verdien: ' + geld(b.plafon) + ' per jaar.','werk');
  }
}

/* ---------- D3: deeltydse werk ---------- */
/* Min ure, lae betaling, en toelaatbaar terwyl jy op skool of op
   universiteit is. Dit val weg sodra jy voltyds begin werk. Die bedrag
   bly onder SARS se drempel, daarom word dit nie belas nie. */
function deeltydsVan(id){
  var r = null;
  DEELTYDS.forEach(function(x){ if(x.id===id) r=x; });
  return r;
}
/* Kan jy nou 'n deeltydse werk hê? Gee die rede terug as jy nie kan nie. */
function deeltydsVereis(j){
  if(s.beroep) return 'Jy werk al voltyds';
  if(s.tronk) return 'Jy is in die tronk';
  if(s.dakloos) return 'Sonder ’n adres neem hulle jou nie aan nie';
  if(s.afgetree || s.ouderdom>=AFTREE_OUDERDOM) return 'Jy is te oud daarvoor';
  if(s.ouderdom < j.min) return 'Jy moet ' + j.min + ' jaar oud wees';
  if(j.vereisSlim && s.slim < j.vereisSlim) return 'Slimheid ' + j.vereisSlim + '+ nodig';
  return null;
}
function deeltydsJaar(){
  var d = s.deeltyds;
  if(!d) return 0;
  if(s.beroep || s.tronk || s.dakloos || s.afgetree || s.ouderdom>=AFTREE_OUDERDOM){
    noteer('Jy het jou deeltydse werk by ' + d.t + ' laat staan.','werk');
    s.deeltyds = null; return 0;
  }
  var j = deeltydsVan(d.id) || d;
  /* Wenke wissel; die ander werke betaal elke jaar omtrent dieselfde. */
  var bedrag = Math.round(d.s * (j.wenke ? tussen(80,135)/100 : tussen(96,104)/100));
  s.geld += bedrag; s.totaalVerdien += bedrag;
  s.deeltydsJare = (s.deeltydsJare||0) + 1;
  d.jare = (d.jare||0) + 1;
  if(j.geluk) s.geluk = klem(s.geluk + j.geluk);
  if(j.slim) s.slim = klem(s.slim + j.slim);
  if(j.gesondheid) s.gesondheid = klem(s.gesondheid + j.gesondheid);
  noteer('Jou deeltydse werk by ' + d.t + ' het ' + geld(bedrag) + ' ingebring.','geld');
  return bedrag;
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
    if(som > Math.max(0,s.geld) + (s.spaar||0) + huishoudingBruto()*0.35){
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
  besigheidJaar();                 /* H4  — die besigheid se jaar loop eerste, want
                                      sy wins word saam met jou salaris belas */
  var netto = inkomsteJaar();      /* salaris, besigheidswins en pensioen, na belasting */
  netto += deeltydsJaar();         /* D3  — deeltydse of vakansiewerk */
  netto += vaardigInkomsteJaar();  /* H3  — wat 'n stokperdjie self inbring */
  sakgeldJaar();                   /* B14 */
  blyplekJaar(netto);              /* B1  — huur, of by jou ouers */
  bondJaar();                      /* B2  — die huislening */
  fondsJaar();                     /* F2  — die mediese fonds se premie */
  siekteKosteJaar();               /* F1/F2 — die jaar se behandelings */
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
  /* H4 — die wins van jou besigheid is inkomste soos enige ander: SARS
     belas dit, die bank tel dit vir 'n verband, en die krediteure kyk
     daarna. 'n Verlies tel nie as inkomste nie (dit is klaar uit jou
     sak betaal in besigheidJaar). */
  b += Math.max(0, besigheidWins());
  return b;
}
/* E12 — wat jou eggenoot vanjaar verdien. 'n Huishouding is twee
   inkomste as albei werk; die bank en die krediteure kyk na die som. */
function maatSalaris(){
  var m = maat();
  return (m && m.tipe==='eggenoot' && m.werk && !m.afgetree) ? m.werk.salaris : 0;
}
function huishoudingBruto(){ return brutoInkomste() + maatSalaris(); }
/* Die skale is nog grof — B8 maak hulle later marginaal, met rebates. */
function belastingKoers(bedrag){
  return bedrag>900000 ? 0.36 : bedrag>450000 ? 0.30 : bedrag>250000 ? 0.22 : 0.14;
}
function studeerTans(){ return s.skool.vlak==='universiteit' || s.skool.vlak==='nagraads'; }

function inkomsteJaar(){
  var netto = 0, bruto = brutoInkomste();
  if(bruto>0){
    var bydrae = pensioenBydraeJaar();      /* B17 — aftrekbaar voor belasting */
    var belasbaar = Math.max(0, bruto - bydrae);
    netto = Math.round(belasbaar * (1 - belastingKoers(belasbaar)));
    s.geld += netto; s.totaalVerdien += netto;
    noteer('Jy het ' + geld(netto) + ' verdien (na belasting' +
      (bydrae ? ' en jou pensioenbydrae' : '') + ')' +
      (besigheidWins()>0 ? ' — jou salaris en ' + s.besigheid.naam + ' se wins saam' : '') +
      '.','geld');
  }
  /* E12 — SARS belas elke mens apart, dus word haar salaris apart
     bereken en dan by die huishouding se kontant gegooi. */
  var mSal = maatSalaris();
  if(mSal>0){
    var m = maat();
    var mNetto = Math.round(mSal * (1 - belastingKoers(mSal)));
    s.geld += mNetto; s.totaalVerdien += mNetto; netto += mNetto;
    noteer(m.naam + ' het ' + geld(mNetto) + ' verdien as ' +
      m.werk.t.toLowerCase() + ' (na belasting).','geld');
  }
  return netto;
}

/* ---------- B14: sakgeld ---------- */
/* Sakgeld groei met jou ouderdom en jou gesin se rykdom: 'n sewejarige
   kry 'n paar rand per week, 'n matriekleerling genoeg vir 'n fliek of
   twee per maand. Verdien jy self, hou die sakgeld op. */
function sakgeldJaar(){
  var o = s.ouderdom;
  if(o<6 || o>=18 || s.tronk || s.beroep || s.deeltyds) return 0;
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
  var vermoe = blyVermoe(huishoudingBruto());
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
  /* H3 — wie self kook, plant of vang, eet goedkoper. */
  som *= 1 - vaardigKosSny();
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
  var r = trekOpbrengs(PENSIOEN_GROEI)/100;
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
/* Fase 7 — trek 'n jaar se opbrengs (persent) uit 'n tabel van emmers
   soos JSE_JARE: eers die emmer volgens sy kans, dan 'n getal daarin. */
function trekOpbrengs(tabel){
  var e = kiesGeweeg(tabel, function(x){ return x.kans; });
  return tussen(e.r[0], e.r[1]);
}
function beleggingJaar(){
  if(!(s.belegging>0)) return;
  /* H3 — wie jaarverslae lees en 'n besigheid kan waardeer, kry 'n paar
     persent meer uit dieselfde mark. */
  var r = (trekOpbrengs(JSE_JARE) + vaardigBeleggingBonus())/100;
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
  return Math.max(SKULD_MIN_PERK, Math.round(huishoudingBruto() * SKULD_INKOMSTE_PERK));
}
/* Is daar enigiets wat 'n skuldeiser kan vat? */
function hetIetsOmTeVat(){
  return s.bates.length>0 || s.belegging>0 || (s.spaar||0)>0 || huishoudingBruto()>0;
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
    /* E1 — 'n grootouer is al oud wanneer jy hom leer ken, en dié
       kromme moet by die een pas waarmee jy self doodgaan. */
    if((v.tipe==='ouma'||v.tipe==='oupa') && v.ouderdom>70) p += (v.ouderdom-70)*0.8;
    if(kans(p)){
      v.lewe = false;
      if(v.tipe==='seun'||v.tipe==='dogter') s.kinders = Math.max(0, s.kinders-1);
      if(v.tipe==='kleinkind') s.kleinkinders = Math.max(0, (s.kleinkinders||0)-1);
      noteer(v.naam + ' (' + rol(v) + ') is oorlede op ouderdom ' + v.ouderdom + '.','sleg');
      s.geluk = klem(s.geluk - (v.tipe==='ma'||v.tipe==='pa'||v.tipe==='eggenoot' ? tussen(18,32) :
        (v.tipe==='ouma'||v.tipe==='oupa') ? tussen(10,22) : tussen(6,16)));
      if(v.tipe==='ma'||v.tipe==='pa'||v.tipe==='eggenoot'){
        var erf = Math.round(tussen(0,220000) * s.rykf);
        if(erf>2000){ s.geld += erf; noteer('Jy het ' + geld(erf) + ' geerf.','geld'); }
      }
      /* E1 — 'n grootouer los gewoonlik minder, en dit word tussen baie
         kleinkinders verdeel, maar vir 'n jong mens beteken dit baie. */
      if(v.tipe==='ouma'||v.tipe==='oupa'){
        var erfG = Math.round(tussen(GROOTOUER_ERF[0],GROOTOUER_ERF[1]) * s.rykf * (v.band/70));
        if(erfG>1500){ s.geld += erfG;
          noteer('Uit ' + v.naam + ' se boedel het jy ' + geld(erfG) + ' gekry.','geld'); }
      }
      return;
    }
    /* E7 — 'n kind (of kleinkind) leef sy eie jaar: skool, matriek,
       werk, 'n maat en eendag sy eie kinders. */
    if(v.tipe==='seun'||v.tipe==='dogter'||v.tipe==='kleinkind') kindJaar(v);
    /* E12 — jou eggenoot se loopbaan loop ook aan. */
    if(v.tipe==='eggenoot') maatWerkJaar(v);
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
  onbeplanJaar();      /* E4 */
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

/* ==========================================================================
   F9 — DIE DOOD
   Die ou weergawe was een ouderdomskromme plus 'n vaste 0,09%
   ongelukskans: oor 40 lewens het almal tussen 56 en 72 gesterf. Nou is
   die kans om in 'n jaar dood te gaan 'n Gompertz-kromme (dit verdubbel
   ongeveer elke agt jaar) wat deur ses dinge vermenigvuldig word:
     1. jou gene              (by geboorte gerol — GENE in data.js)
     2. jou gesondheid        (die statte wat die hele spel beweeg)
     3. jou siektes           (F1 — behandel of nie)
     4. rook, drank, dwelms   (F4)
     5. of jy mediese sorg kan bekostig (F2)
     6. waar jy is            (tronk, straat)
   Daarby kom ongelukke en geweld, wat in SA veral jong mans vat.
   Die uitkoms is 'n egte verspreiding: 'n mens met kanker, sigarette en
   geen fonds haal selde 60, en 'n gesonde mens uit 'n taai familie met
   'n omvattende plan haal gereeld 90.
   ========================================================================== */
/* Hoe goed kan jy jou gesondheid laat oppas? 2 = 'n mediese fonds,
   1 = jy kan 'n staatshospitaal of 'n dokter uit jou sak bykom,
   0 = daar is niks en niemand nie. */
function sorgVlak(){
  if(s.mediesefonds) return 2;
  if(s.dakloos) return 0;
  if(s.geld + (s.spaar||0) > 3000 || huishoudingBruto() > 80000) return 1;
  return 0;
}
/* Al die siektes se erns bymekaar, elk gedemp deur sy behandeling. */
function siekteErns(){
  var e = 0;
  (s.siektes||[]).forEach(function(x){
    var tt = toestandVan(x.id); if(!tt) return;
    e += tt.erns * (x.behandel ? DOOD_BEHANDEL : DOOD_ONBEHANDEL) *
      (x.behandel && x.pad==='staat' ? 1.6 : 1);
  });
  return e;
}
/* Die kans, in persent, dat hierdie jaar jou laaste is — en waaraan. */
function doodsKans(){
  var o = s.ouderdom;
  /* Kindersterftes: in SA sterf ongeveer een uit 'n paar honderd babas. */
  if(o===0) return {p:DOOD_KIND[0], oorsaak:kies(OORSAKE), soort:'kind'};
  var basis = o<=5 ? DOOD_KIND[1]
    : DOOD_BASIS * Math.exp(DOOD_KROM * (o - 20));
  /* 1. gene */
  basis *= (s.gene ? s.gene.f : 1);
  /* 2. gesondheid */
  basis *= Math.max(DOOD_GESOND_MIN, 1 + (70 - s.gesondheid)/DOOD_GESOND_F);
  /* 3. siektes */
  basis *= (1 + siekteErns());
  /* 4. leefstyl */
  basis *= DOOD_ROOK[s.gewoontes.rook||0];
  basis *= DOOD_DRINK[s.gewoontes.drink||0];
  basis *= DOOD_DWELMS[s.gewoontes.dwelms||0];
  /* 5. mediese sorg */
  var sorg = sorgVlak();
  if(sorg===0) basis *= DOOD_GEEN_SORG;
  else if(sorg===2) basis *= DOOD_GOEIE_SORG;
  /* 6. waar jy is */
  if(s.dakloos) basis *= 1.5;
  /* Die oorsaak kom by voorkeur uit jou ergste siekte. */
  var ergste = null, erg = 0;
  (s.siektes||[]).forEach(function(x){
    var tt = toestandVan(x.id);
    if(tt && tt.erns > erg && (!x.behandel || kans(35))){ erg = tt.erns; ergste = tt; }
  });
  var oorsaak = (ergste && erg>=0.8 && kans(72)) ? ergste.n.toLowerCase() : kies(OORSAKE);
  return {p:basis, oorsaak:oorsaak, soort:'siekte'};
}
/* Ongelukke en geweld: 'n aparte kans, want dit tref 'n gesonde mens
   net so hard. In SA is dit die grootste rede waarom 'n jong man nie
   oud word nie. */
function ongelukKans(){
  var p = DOOD_ONGELUK;
  if(s.ouderdom>=DOOD_JONKMAN[0] && s.ouderdom<=DOOD_JONKMAN[1])
    p += (s.geslag==='m' ? DOOD_JONKMAN_M : DOOD_JONKMAN_V);
  if(s.tronk) p += DOOD_TRONK;
  if(s.dakloos) p += DOOD_DAKLOOS;
  /* F4 — dronk agter die stuur, en dwelms, maak elke jaar gevaarliker. */
  if(s.gewoontes.drink>=2) p += s.gewoontes.drink===3 ? 0.42 : 0.14;
  if(s.gewoontes.dwelms>=2) p += s.gewoontes.dwelms===3 ? 0.65 : 0.20;
  if(s.rekord.length) p += 0.10;      /* die onderwereld bly aan jou vashou */
  return p;
}
function doodKontrole(){
  if(s.gesondheid<=0){
    /* F1 — is daar 'n siekte, is dit waaraan jy sterf, nie 'n vae
       "swak gesondheid" nie. */
    var erg = null, e = 0;
    (s.siektes||[]).forEach(function(x){
      var tt = toestandVan(x.id);
      if(tt && tt.erns > e){ e = tt.erns; erg = tt; }
    });
    sterf(erg ? erg.n.toLowerCase() : kies(SIEKTES));
    return;
  }
  var d = doodsKans();
  if(d.p>0 && kans(d.p)){ sterf(d.oorsaak); return; }
  if(kans(ongelukKans())){ sterf(kies(ONGELUKKE)); return; }
}
function sterf(oorsaak){
  s.lewe = false; s.oorsaak = oorsaak;
  noteer('Jy is oorlede op ouderdom ' + s.ouderdom + ' weens ' + oorsaak + '.','sleg');
  geskiedenisBy(); stoor();
}


/* ==========================================================================
   FASE 5 — GESIN (E1, E4, E7, E12)
   Grootouers wat 'n kinderlewe vul, 'n baba wat ook buite 'n huwelik kan
   kom, kinders met 'n egte lewensloop, en 'n eggenoot wat self verdien.
   ========================================================================== */

/* ---------- F9: jou familiegeskiedenis ---------- */
/* Word een keer by geboorte gerol en verander nooit weer. Dit raak jou
   doodskans (GENE se 'f'), jou gesondheid se drywing, en watter siekte
   in jou familie loop ('neig'). */
function rolGene(){
  var g = kiesGeweeg(GENE, function(x){ return x.kans; }) || GENE[2];
  return {n:g.n, f:g.f, sub:g.sub, neig:g.neig || null};
}

/* ---------- E1: oupas en oumas ---------- */
/* Jou ouers se ouers. Elkeen is 20 tot 38 jaar ouer as sy eie kind, en
   elkeen word apart gerol — party is al dood voor jy gebore word. */
function maakGrootouer(ouer, tipe, kant){
  var o = ouer.ouderdom + tussen(OUMA_OUER[0], OUMA_OUER[1]);
  var g = nuweMens(tipe==='ouma'?'v':'m', o, kant==='pa' ? ouer.van : kies(VANNE));
  g.tipe = tipe; g.kant = kant;
  g.band = tussen(55,100);
  /* Dood voor jou geboorte, of al oud genoeg dat die kromme hom vat. */
  if(kans(GROOTOUER_DOOD) || o>92){ g.lewe = false; g.voorGeboorte = 1; }
  s.verhoudings.push(g);
  return g;
}
function maakGrootouers(){
  var ma = s.verhoudings.filter(function(v){ return v.tipe==='ma'; })[0];
  var pa = s.verhoudings.filter(function(v){ return v.tipe==='pa'; })[0];
  if(ma){ maakGrootouer(ma,'ouma','ma'); maakGrootouer(ma,'oupa','ma'); }
  /* Is daar geen pa in die prentjie nie, ken jy sy ouers meestal ook nie. */
  if(pa && kans(84)){ maakGrootouer(pa,'ouma','pa'); maakGrootouer(pa,'oupa','pa'); }
}
function grootouers(){
  return s.verhoudings.filter(function(v){
    return v.lewe && (v.tipe==='ouma'||v.tipe==='oupa'); });
}
/* Die log-reël by jou geboorte: wie is daar, en wie is nie meer nie. */
function grootouerGeboorte(){
  var lewe = grootouers();
  var weg = s.verhoudings.filter(function(v){ return v.voorGeboorte; });
  if(lewe.length) noteer('Jou grootouers is ' + lewe.map(function(v){
    return v.naam + ' (' + rol(v).toLowerCase() + ')'; }).join(', ') + '.','goed');
  if(weg.length) noteer(weg.map(function(v){ return 'jou ' + rol(v).toLowerCase(); }).join(' en ') +
    ' is voor jou geboorte oorlede.','neutraal');
}
/* Een keer per jaar doen 'n grootouer iets met jou. Dit is die hart van
   E1: 'n kind se lewe staan vol sulke middae. */
function grootouerJaar(){
  var lys = grootouers();
  if(!lys.length) return;
  var g = kies(lys);
  /* 'n Grootouer wat jou nie meer ken nie, kan ook jou sorg nodig kry. */
  if(g.ouderdom>=78 && s.ouderdom>=22 && kans(13)){
    g.band = klem(g.band + tussen(3,9));
    if(s.geld>=6000 && kans(55)){
      var help = tussen(3000, 18000);
      s.geld -= help; s.geluk = klem(s.geluk + tussen(1,5));
      noteer('Jy het ' + geld(help) + ' bygedra vir ' + g.naam +
        ' se sorg in die ouetehuis.','geld');
    } else {
      s.geluk = klem(s.geluk - tussen(2,6));
      noteer(g.naam + ' word oud en daar is niemand om te help nie.','sleg');
    }
    return;
  }
  var dade = GROOTOUER_DADE.filter(function(d){
    return s.ouderdom>=d.min && s.ouderdom<=d.maks && g.band>=d.band; });
  if(!dade.length || !kans(58)) return;
  var d = kies(dade);
  if(d.geld){ var r = Math.round(tussen(d.geld[0],d.geld[1]) * s.rykf); s.geld += r; }
  if(d.slim) s.slim = klem(s.slim + tussen(d.slim[0],d.slim[1]));
  if(d.geluk) s.geluk = klem(s.geluk + tussen(d.geluk[0],d.geluk[1]));
  if(d.gesondheid) s.gesondheid = klem(s.gesondheid + tussen(d.gesondheid[0],d.gesondheid[1]));
  g.band = klem(g.band + tussen(1,5));
  noteer(g.naam + ' ' + d.t + '.','goed');
}

/* ---------- E12: jou eggenoot se beroep ---------- */
/* Mense trou met mense soos hulself, daarom hang haar opleiding aan
   joune. Daarna kry sy 'n pos uit BEROEPE wat by haar opleiding,
   ouderdom en 'n bietjie geluk pas. */
function maatBeroepKies(v){
  v.werk = null;
  v.afgetree = v.ouderdom >= MAAT_AFTREE;
  if(v.afgetree){
    noteer(v.naam + ' is al op pensioen.','neutraal');
    return;
  }
  /* Is daar klein kinders in die huis, bly een ouer soms by hulle. */
  if(kindersTuis()>0 && kans(MAAT_HUISVROU)){
    v.tuis = 1;
    noteer(v.naam + ' bly by die kinders tuis en werk nie.','neutraal');
    return;
  }
  var e = klem(eduVlak() + tussen(-1,1), 0, 3);
  var kan = BEROEPE.filter(function(b){
    return b.edu<=e && b.min<=v.ouderdom && !b.ervaring; });
  if(!kan.length) kan = BEROEPE.filter(function(b){ return b.edu===0; });
  var b = kiesGeweeg(kan, function(x){ return 1 + x.edu*2; }) || kan[0];
  v.werk = {id:b.id, t:b.t, plafon:b.plafon, jare:0,
    salaris: Math.round(b.s * tussen(MAAT_SALARIS_F[0],MAAT_SALARIS_F[1]) / 100)};
  noteer(v.naam + ' werk as ' + b.t.toLowerCase() + ' en verdien ' +
    geld(v.werk.salaris) + ' per jaar.','werk');
}
/* Haar loopbaan loop ook aan: verhogings, 'n plafon, soms 'n afdanking,
   en op 62 is sy klaar. */
function maatWerkJaar(v){
  if(v.werk===undefined){ maatBeroepKies(v); return; }
  if(v.afgetree) return;
  if(v.ouderdom>=MAAT_AFTREE){
    v.afgetree = true;
    if(v.werk){ noteer(v.naam + ' het op ' + v.ouderdom + ' uit haar pos as ' +
      v.werk.t.toLowerCase() + ' getree.','werk'); }
    v.werk = null; return;
  }
  if(v.werk){
    v.werk.jare++;
    v.werk.salaris = Math.round(v.werk.salaris * (1 + tussen(MAAT_GROEI[0],MAAT_GROEI[1])/100));
    if(v.werk.plafon && v.werk.salaris > v.werk.plafon) v.werk.salaris = v.werk.plafon;
    if(kans(MAAT_WERKLOOS_KANS)){
      noteer(v.naam + ' het haar werk as ' + v.werk.t.toLowerCase() + ' verloor.','sleg');
      v.werk = null; v.band = klem(v.band - tussen(2,8)); s.geluk = klem(s.geluk - tussen(4,10));
    }
    return;
  }
  /* Sonder werk: sy soek, of sy is by die kinders tuis tot hulle groot is. */
  if(v.tuis && kindersTuis()>0) return;
  if(v.tuis) v.tuis = 0;
  if(kans(MAAT_WERK_KANS)){
    var e = klem(eduVlak() + tussen(-1,1), 0, 3);
    var kan = BEROEPE.filter(function(b){
      return b.edu<=e && b.min<=v.ouderdom && !b.ervaring; });
    if(!kan.length) return;
    var b = kiesGeweeg(kan, function(x){ return 1 + x.edu*2; }) || kan[0];
    v.werk = {id:b.id, t:b.t, plafon:b.plafon, jare:0,
      salaris: Math.round(b.s * tussen(MAAT_SALARIS_F[0],MAAT_SALARIS_F[1]) / 100)};
    s.geluk = klem(s.geluk + tussen(2,7));
    noteer(v.naam + ' het weer werk gekry, as ' + b.t.toLowerCase() + ' teen ' +
      geld(v.werk.salaris) + ' per jaar.','werk');
  }
}

/* ==========================================================================
   E4 — 'N BABA, BINNE OF BUITE 'N HUWELIK
   Voorheen was 'n baba net vir 'n eggenoot en net as jy die knoppie
   druk. Nou kan 'n lief-verhouding ook 'n kind gee, kan 'n swangerskap
   onbeplan wees, en is voorbehoeding 'n keuse met 'n prys.
   ========================================================================== */
function voorbehoedingVan(id){
  var r = null;
  VOORBEHOEDING.forEach(function(x){ if(x.id===(id||s.voorbehoeding)) r=x; });
  return r || VOORBEHOEDING[0];
}
function voorbehoedingF(){ return voorbehoedingVan().f; }
/* Die kans om swanger te raak as julle doelbewus probeer. */
function babaKans(){
  var k = 12;
  for(var i=0;i<BABA_KANS.length;i++)
    if(s.ouderdom<=BABA_KANS[i][0]){ k = BABA_KANS[i][1]; break; }
  /* Elke kind wat jy al het, maak die volgende minder waarskynlik — en
     'n gesin van tien is ook nie 'n gesin van 2026 nie. */
  return k * Math.pow(BABA_AFNAME, s.kindersGebore||0);
}
/* Die een plek waar 'n baba in die spel kom. 'onbeplan' bepaal die
   boodskap en die gevolge. */
function swangerskap(v, onbeplan){
  s.swangerskappe = (s.swangerskappe||0) + 1;
  var tiener = s.ouderdom < 18;
  /* F2 — waar die baba gebore word, hang aan jou mediese sorg. */
  var koste = s.mediesefonds
    ? Math.round(KRAAM_KOSTE[1] * (1 - mediesefonds().dek))
    : (sorgVlak()>=1 && s.geld > KRAAM_KOSTE[1]*1.5 ? KRAAM_KOSTE[1] : KRAAM_KOSTE[0]);
  var waar = s.mediesefonds ? 'in ’n privaat kraamsaal'
    : (koste>=KRAAM_KOSTE[1] ? 'in ’n privaat kraamsaal, kontant' : 'in die staatshospitaal');
  kryBabaMet(v, onbeplan);
  if(koste>0 && s.ouderdom>=18) betaalWatJyKan(koste, 'die kraamkoste');
  noteer('Die baba is ' + waar + ' gebore (' + geld(koste) + ').','geld');
  if(tiener){
    s.geluk = klem(s.geluk - tussen(10,24));
    lewendeOuers().forEach(function(p){ p.band = klem(p.band - tussen(10,30)); });
    noteer('Jy is ’n ouer op ' + s.ouderdom + '. Jou ouers het dit swaar gevat.','sleg');
    /* Die skool is die eerste ding wat daaronder deurloop. */
    if(['laerskool','hoerskool'].indexOf(s.skool.vlak)>=0){
      if(kans(42)) skoolJaarVerloor('weens die baba');
      else noteer('Jy het aangehou skoolgaan, met ’n baba by die huis.','skool');
    }
  }
  if(onbeplan && v.tipe==='lief'){
    v.band = klem(v.band + (kans(55) ? tussen(4,14) : -tussen(6,20)));
  }
}
/* Die onbeplande swangerskap: elke jaar in 'n verhouding, gedemp deur
   wat jy ook al vir voorbehoeding gekies het. */
function onbeplanJaar(){
  var m = maat();
  if(!m || !m.lewe) return;
  if(s.ouderdom<14 || s.ouderdom>50 || s.tronk) return;
  /* E6 bly oop (geslag word elders geïgnoreer), maar 'n onbeplande
     swangerskap kan net tussen 'n man en 'n vrou gebeur. */
  if(m.geslag===s.geslag) return;
  var basis = s.ouderdom<18 ? ONBEPLAN_TIENER
    : s.ouderdom<30 ? ONBEPLAN_JONK
    : s.ouderdom<=42 ? ONBEPLAN_OUER : 3;
  if(m.tipe==='eggenoot') basis *= 0.55;   /* 'n egpaar beplan meer */
  if(s.ouderdom>44) basis *= 0.4;
  var p = basis * (1 - voorbehoedingF());
  /* F4 — drank en dwelms laat mense vergeet. */
  if(s.gewoontes.drink>=2 || s.gewoontes.dwelms>=2) p *= 1.4;
  if(!kans(p)) return;
  var vb = voorbehoedingVan();
  wagry.push({titel:'Julle gaan ’n baba kry',
    vraag: m.naam + ' is swanger. Dit was nie beplan nie' +
      (vb.id==='geen' ? ' — en julle het niks gebruik nie.' :
       ' — ' + vb.n.toLowerCase() + ' werk nie elke keer nie.') +
      (s.ouderdom<18 ? '\nJy is ' + s.ouderdom + ' jaar oud.' : ''),
    opsies:[{t:'Dit is wat dit is', doen:function(){ swangerskap(m, true); }}]});
}

/* ==========================================================================
   E7 — 'N KIND SE EIE LEWE
   Voorheen het 'n kind net ouer geword en op 18 "die huis verlaat".
   Nou het hy sy eie lewensloop: skool, matriek met 'n APS, studie of
   werk, 'n maat, en sy eie kinders — jou kleinkinders.

   Die datastruktuur ('v.kl') is doelbewus ruim en lyk soos 's' self,
   sodat Fase 6 se generasiespel 'n kind as die volgende speler kan
   oorneem sonder om dit te herbou.
   ========================================================================== */
function kindLewe(v){
  if(v.kl) return v.kl;
  v.kl = {
    slim: klem(tussen(25,80) + Math.round((s.slim-50)/4)),
    geluk: tussen(55,95), gesondheid: tussen(70,100),
    voorkoms: klem(tussen(25,90) + Math.round((s.voorkoms-50)/5)),
    dorp: s.dorp,
    skool:{vlak:'baba', graad:0, matriek:false, aps:0, studie:null, grade:[], jareOor:0},
    beroep:null, salaris:0, jareGewerk:0,
    maat:null, kinders:[], gewoontes:{drink:0, rook:0, dwelms:0}, siektes:[],
    uitHuis:false, studieBetaal:0, geskiedenis:[]
  };
  if(v.ouderdom>0) kindInhaal(v);
  return v.kl;
}
/* Ou stoor-data: 'n kind van 30 moet nie skielik weer in Graad 1 begin
   nie. Hier word sy lewe stil-stil opgebou tot by sy huidige ouderdom. */
function kindInhaal(v){
  var k = v.kl, o = v.ouderdom;
  if(o>=6 && o<=12){ k.skool.vlak='laerskool'; k.skool.graad = o-5; }
  else if(o>=13 && o<=17){ k.skool.vlak='hoerskool'; k.skool.graad = o-5; }
  else if(o>=18){
    k.skool.vlak='klaar';
    k.skool.aps = kindAps(v);
    k.skool.matriek = k.skool.aps >= 20;
    k.uitHuis = true;
    if(k.skool.aps>=KIND_UNI_APS && o>=22 && kans(45)){
      k.skool.grade.push(kies(STUDIES).n);
    }
    if(o>=19) kindWerkKies(v, true);
    if(o>=KIND_TROU_OUDERDOM[0]+2 && kans(62)) kindMaat(v, true);
  }
}
function kindNoteer(v, t, ook, soort){
  /* Moenie dieselfde klein ding twee keer agtermekaar vertel nie. */
  var vorige = v.kl.geskiedenis[v.kl.geskiedenis.length-1];
  if(vorige && vorige.t===t) return;
  v.kl.geskiedenis.push({o:v.ouderdom, t:t});
  if(ook) noteer(v.naam + ' ' + t + '.', soort||'goed');
}
/* Die APS wat 'n kind in matriek haal: sy eie kop, plus wat jy as ouer
   bygedra het (die band met jou, en of jy met huiswerk gehelp het). */
function kindAps(v){
  var k = v.kl;
  return klem(Math.round(KIND_APS_BASIS + k.slim*KIND_APS_SLIM +
    v.band*KIND_APS_OUER + tussen(-3,3)), 6, APS_MAKS);
}
function kindMatriek(v){
  var k = v.kl;
  k.skool.aps = kindAps(v);
  k.skool.vlak = 'klaar';
  if(k.skool.aps >= 20){
    k.skool.matriek = true;
    kindNoteer(v,'het matriek geslaag met ’n APS van ' + k.skool.aps + ' uit ' + APS_MAKS, true, 'skool');
    s.geluk = klem(s.geluk + tussen(5,12));
    /* Oor JOU kind se graad besluit jy; 'n kleinkind se ouers besluit
       self, en jy hoor net wat hy gaan doen. */
    if(k.skool.aps < KIND_UNI_APS) kindWerkKies(v);
    else if(v.tipe==='kleinkind') kindStudieSelf(v);
    else kindStudieVraag(v);
  } else {
    kindNoteer(v,'het matriek gedruip en die skool verlaat', true, 'sleg');
    s.geluk = klem(s.geluk - tussen(3,9));
    kindWerkKies(v);
  }
}
/* E7/E8 — die een oomblik waar jou geld en jou keuse jou kind se hele
   lewe verander: betaal jy vir sy graad of nie? */
function kindStudieVraag(v){
  var k = v.kl, koste = Math.round(tussen(KIND_STUDIE_KOSTE[0],KIND_STUDIE_KOSTE[1]));
  var st = kies(STUDIES.filter(function(x){ return x.aps <= k.skool.aps; }) || STUDIES) || STUDIES[0];
  var beurs = k.skool.aps >= 34;
  var opsies = [{t:'Ja, ek betaal sy klasgeld', sub:geld(koste) + ' per jaar vir ' +
      st.jare + ' jaar', doen:function(){
    k.skool.vlak='universiteit'; k.skool.studie=st.n; k.skool.jareOor=st.jare;
    k.studieBetaal = koste;
    kindNoteer(v,'het ' + st.n + ' op universiteit begin', true, 'skool'); }}];
  if(beurs) opsies.push({t:'Hy kry ’n beurs', sub:'Met ’n APS van ' + k.skool.aps +
    ' bied NSFAS of die universiteit self aan', doen:function(){
      k.skool.vlak='universiteit'; k.skool.studie=st.n; k.skool.jareOor=st.jare;
      k.studieBetaal = 0;
      kindNoteer(v,'het ’n beurs gekry en ' + st.n + ' begin studeer', true, 'skool'); }});
  opsies.push({t:'Hy moet gaan werk', klas:'grys',
    sub:'Daar is nie geld vir ’n graad nie', doen:function(){
      v.band = klem(v.band - tussen(4,14));
      kindNoteer(v,'moes gaan werk in plaas van studeer', true, 'sleg');
      kindWerkKies(v); }});
  wagry.push({titel:v.naam + ' se APS is ' + k.skool.aps,
    vraag:v.naam + ' kan universiteit toe gaan. ’n Graad in ' + st.n + ' duur ' +
      st.jare + ' jaar en kos ongeveer ' + geld(koste) + ' per jaar.' +
      (beurs ? '\nSy punte is goed genoeg vir ’n beurs.' : ''),
    opsies:opsies});
}
/* 'n Kleinkind (of 'n kind van 'n ou gestoorde lewe) se eie besluit. */
function kindStudieSelf(v){
  var k = v.kl;
  var moontlik = STUDIES.filter(function(x){ return x.aps <= k.skool.aps; });
  var st = kies(moontlik.length ? moontlik : STUDIES);
  if(k.skool.aps >= 32 || kans(45)){
    k.skool.vlak='universiteit'; k.skool.studie=st.n; k.skool.jareOor=st.jare;
    k.studieBetaal = 0;
    kindNoteer(v,'het ' + st.n + ' begin studeer', true, 'skool');
  } else kindWerkKies(v);
}
/* Watter werk 'n kind kry, met die opleiding wat hy het. */
function kindWerkKies(v, stil){
  var k = v.kl;
  var e = k.skool.grade.length ? 2 : (k.skool.matriek ? 1 : 0);
  var kan = BEROEPE.filter(function(b){
    return b.edu<=e && b.min<=v.ouderdom && !b.ervaring && b.slim <= k.slim + 12; });
  if(!kan.length) kan = BEROEPE.filter(function(b){ return b.edu===0 && b.min<=v.ouderdom; });
  if(!kan.length) return;
  var b = kiesGeweeg(kan, function(x){ return 1 + x.edu*3; }) || kan[0];
  k.beroep = {id:b.id, t:b.t, plafon:b.plafon};
  k.salaris = Math.round(b.s * tussen(78,116) / 100);
  if(!stil) kindNoteer(v,'werk nou as ' + b.t.toLowerCase() + ' teen ' +
    geld(k.salaris) + ' per jaar', true, 'werk');
}
function kindMaat(v, stil){
  var k = v.kl;
  var g = kans(50) ? 'm' : 'v';
  k.maat = {naam: kies(g==='m'?MANSNAME:VROUENAME), van: kies(VANNE), geslag:g,
    ouderdom: Math.max(18, v.ouderdom + tussen(-5,5)), getroud:1};
  if(!stil){
    kindNoteer(v,'is getroud met ' + k.maat.naam + ' ' + k.maat.van, true, 'liefde');
    s.geluk = klem(s.geluk + tussen(6,14));
  }
}
/* 'n Kleinkind word 'n egte mens in jou lewe: hy staan onder Mense, jy
   kan met hom gesels, en hy loop sy eie kinderjare deur. */
function kleinkindBy(v){
  var k = v.kl;
  /* 'n Kind kry sy pa se van: is jou kind 'n seun, loop die van saam
     met hom; is sy 'n dogter, kry die kleinkind haar man se van. Dit
     is wat die familielyn in die generasiespel (H1) laat klop. */
  var kk = nuweMens(null, 0, v.geslag==='m' ? v.van : (k.maat ? k.maat.van : v.van));
  kk.tipe = 'kleinkind'; kk.ouerId = v.id; kk.band = tussen(70,100);
  kindLewe(kk);
  s.verhoudings.push(kk);
  k.kinders.push({id:kk.id, naam:kk.naam});
  s.kleinkinders = (s.kleinkinders||0) + 1;
  s.geluk = klem(s.geluk + tussen(8,16));
  noteer(v.naam + ' het ’n baba gekry: ' + kk.naam + '. Jy is nou ’n ' +
    (s.geslag==='m' ? 'oupa' : 'ouma') + '!','liefde');
  kindNoteer(v,'het ’n ' + (kk.geslag==='m'?'seun':'dogter') + ' gekry: ' + kk.naam);
}
/* Een jaar in 'n kind (of kleinkind) se lewe. */
function kindJaar(v){
  var k = kindLewe(v), o = v.ouderdom;
  /* --- die kinderjare --- */
  if(o<6){
    if(kans(30)) kindNoteer(v, kies(['het ' + besit(v) + ' eerste woorde gesê','het leer loop',
      'het leer fiets ry','het die hele huis omgekeer','het kleuterskool begin']));
    return;
  }
  if(o===6){ k.skool.vlak='laerskool'; kindNoteer(v,'het Graad 1 begin', true, 'skool'); }
  if(o===13 && k.skool.vlak==='laerskool'){ k.skool.vlak='hoerskool';
    kindNoteer(v,'is nou in die hoërskool', true, 'skool'); }
  if(k.skool.vlak==='laerskool' || k.skool.vlak==='hoerskool'){
    k.skool.graad = o - 5;
    /* 'n Sterk band met jou laat hom beter doen — dit is die ouer se deel. */
    if(kans(35 + v.band/4)) k.slim = klem(k.slim + tussen(0,3));
    if(kans(18)) kindNoteer(v, kies(['het in die skoolspan gekom',
      'het ’n sertifikaat vir wiskunde gekry','het met die onderwyser gesukkel',
      'het ’n nuwe beste vriend','het in die skoolkonsert gespeel',
      'het die hele kwartaal se huiswerk betyds ingegee','het ’n prys op prysuitdeling gekry',
      'het sy eerste rugbywedstryd gespeel','het van skool af weggebly',
      'het ’n liefdesbriefie by die huis laat lê','het leer swem by die skoolgala']));
    if(o===18 && !k.skool.matriek) kindMatriek(v);
    return;
  }
  /* --- 18 en die huis uit --- */
  if(o>=18 && !k.uitHuis){
    k.uitHuis = true;
    noteer(v.naam + ' is 18 en het die huis verlaat.','goed');
    s.geluk = klem(s.geluk + 6);
  }
  /* --- studie --- */
  if(k.skool.vlak==='universiteit'){
    k.skool.jareOor--;
    if(k.studieBetaal>0 && s.ouderdom>=18){
      betaalWatJyKan(k.studieBetaal, v.naam + ' se klasgeld');
    }
    if(k.skool.jareOor<=0){
      k.skool.grade.push(k.skool.studie);
      k.skool.vlak='klaar';
      kindNoteer(v,'het ' + besit(v) + ' graad in ' + k.skool.studie + ' gekry', true, 'skool');
      s.geluk = klem(s.geluk + tussen(8,16));
      kindWerkKies(v);
    } else kindNoteer(v,'is in ' + besit(v) + ' ' + (1 + (kindStudieJaar(k))) + 'e jaar van ' + k.skool.studie);
    return;
  }
  /* --- aftrede. 'n Kind van 70 werk nie nog as kelner nie. --- */
  if(o>=MAAT_AFTREE && k.beroep){
    kindNoteer(v,'het uit ' + besit(v) + ' pos as ' + k.beroep.t.toLowerCase() + ' getree', true, 'werk');
    k.beroep = null; k.salaris = 0; k.afgetree = 1;
  }
  /* --- werk --- */
  if(o>=18 && o<MAAT_AFTREE && !k.beroep && !k.afgetree && kans(55)) kindWerkKies(v);
  if(k.beroep){
    k.jareGewerk++;
    k.salaris = Math.round(k.salaris * 1.045);
    if(k.beroep.plafon && k.salaris > k.beroep.plafon) k.salaris = k.beroep.plafon;
    if(kans(4)){
      kindNoteer(v,'het ' + besit(v) + ' werk as ' + k.beroep.t.toLowerCase() + ' verloor', true, 'sleg');
      k.beroep = null; k.salaris = 0;
    } else if(kans(7)){
      kindNoteer(v,'is bevorder by die werk');
      k.salaris = Math.round(k.salaris * 1.22);
      if(k.beroep.plafon && k.salaris > k.beroep.plafon) k.salaris = k.beroep.plafon;
    }
  }
  /* --- sy eie liefde --- */
  if(!k.maat && o>=KIND_TROU_OUDERDOM[0] && o<=KIND_TROU_OUDERDOM[1] && kans(17)) kindMaat(v);
  /* --- jou kleinkinders. 'n Kleinkind kry nie self kinders nie; dit hou
     die boom begrens en laat Fase 6 die volgende generasie oorneem. --- */
  if(k.maat && v.tipe!=='kleinkind' && o>=KIND_KIND_OUDERDOM[0] && o<=KIND_KIND_OUDERDOM[1] &&
     k.kinders.length<KIND_KINDERS_MAKS && kans(KIND_KIND_KANS)) kleinkindBy(v);
  /* --- sy eie slegte jare --- */
  if(o>=20 && kans(3)){
    var gw = kies(['drink','rook','dwelms']);
    if(k.gewoontes[gw]<2){ k.gewoontes[gw]++;
      kindNoteer(v, gw==='drink' ? 'drink te veel deesdae'
        : gw==='rook' ? 'het begin rook' : 'het by die verkeerde mense beland', true, 'sleg'); }
  }
  if(k.maat && kans(2)){
    kindNoteer(v,'en ' + k.maat.naam + ' is geskei', true, 'sleg');
    k.maat = null; s.geluk = klem(s.geluk - tussen(3,8));
  }
}
function kindStudieJaar(k){
  var st = studieVanNaam(k.skool.studie);
  return st ? (st.jare - k.skool.jareOor) : 1;
}
/* Al jou kinders se kinders bymekaar — vir die grafsteen en die paneel. */
function kleinkinderLys(){
  return s.verhoudings.filter(function(v){ return v.tipe==='kleinkind'; });
}

/* ==========================================================================
   FASE 5 — GESONDHEID (F1, F2, F4)
   Drie stelsels wat in mekaar inhaak. F1 gee jou regte toestande: akuut
   (griep, 'n gebreekte been) teenoor chronies (diabetes, kanker). F2 sê
   hoe jy daarvoor betaal: 'n mediese fonds, die staatshospitaal, of 'n
   privaat rekening wat jou kan ruïneer. F4 is drank, sigarette en
   dwelms, wat die kans op 'n toestand vermeerder. En F9 se doodKontrole
   lees al drie, want 'n siekte sonder 'n doodsverband beteken niks.
   ========================================================================== */

/* ---------- F1: watter toestande jy het ---------- */
function toestandVan(id){
  var r = null;
  TOESTANDE.forEach(function(x){ if(x.id===id) r=x; });
  return r;
}
function hetToestand(id){
  return (s.siektes||[]).some(function(x){ return x.id===id; });
}
function chronies(){
  return (s.siektes||[]).filter(function(x){
    var tt = toestandVan(x.id); return tt && tt.soort==='chronies'; });
}
/* Die kans om vanjaar énige nuwe toestand te kry. Dit styg met jou
   ouderdom, met swak gesondheid, met elke gewoonte, en op straat of in
   die tronk. */
function siekteKansJaar(){
  var p = SIEK_BASIS;
  if(s.ouderdom>30) p += (s.ouderdom-30) * SIEK_OUDERDOM;
  if(s.gesondheid<65) p += (65 - s.gesondheid) * SIEK_SWAK;
  p += SIEK_ROOK[s.gewoontes.rook||0];
  p += SIEK_DRINK[s.gewoontes.drink||0];
  p += SIEK_DWELMS[s.gewoontes.dwelms||0];
  if(s.dakloos) p += SIEK_DAKLOOS;
  if(s.tronk) p += SIEK_TRONK;
  /* 'n Mediese fonds betaal vir die jaarlikse ondersoek wat dinge vroeg
     vang; sonder sorg loop 'n klein ding tot 'n groot een aan. */
  if(s.mediesefonds) p *= 0.88;
  return Math.min(SIEK_MAKS, p);
}
/* Hoe waarskynlik elke toestand is. 'n Roker se longe, 'n drinker se
   lewer en die siekte wat in jou familie loop weeg baie swaarder. */
function toestandGewig(tt){
  if(s.ouderdom < tt.min) return 0;
  /* 'n Chroniese toestand kry jy net een keer. */
  if(tt.soort==='chronies' && hetToestand(tt.id)) return 0;
  if(hetToestand(tt.id)) return 0;
  var g = tt.gewig || 10;
  var h = 1;
  if(ROOK_TOESTANDE.indexOf(tt.id)>=0)  h = Math.max(h, 0.35 + (s.gewoontes.rook||0)*1.4);
  if(DRINK_TOESTANDE.indexOf(tt.id)>=0) h = Math.max(h, 0.35 + (s.gewoontes.drink||0)*1.2);
  if(DWELM_TOESTANDE.indexOf(tt.id)>=0) h = Math.max(h, 0.35 + (s.gewoontes.dwelms||0)*1.5);
  g *= h;
  /* F9 — die siekte wat in jou familie loop, kom baie makliker. */
  if(s.gene && s.gene.neig===tt.id) g *= GENE_NEIG;
  /* Chroniese toestande kom met die jare — gemeet aan jou ouderdom, nie
     aan hoe lank die toestand al moontlik is nie. */
  if(tt.soort==='chronies') g *= 1 + Math.max(0, s.ouderdom - 40) * 0.035;
  /* Op straat en in die tronk is dit TB en longontsteking, nie artritis nie. */
  if((s.dakloos||s.tronk) && ['tb','longontsteking','maag'].indexOf(tt.id)>=0) g *= 4;
  return g;
}
/* ---------- F2: mediese fonds, staat of privaat ---------- */
function mediesefonds(){
  var r = null;
  MEDIESE_FONDSE.forEach(function(x){ if(s.mediesefonds && x.id===s.mediesefonds.id) r=x; });
  return r || MEDIESE_FONDSE[0];
}
/* Die premie per jaar: jy, plus 80% vir 'n maat en 40% per kind. 'n Mens
   met 'n chroniese toestand betaal meer. */
function fondsPremieVan(f){
  var m = maat(), lede = 1;
  if(m && m.tipe==='eggenoot') lede += FONDS_MAAT_F;
  lede += kindersTuis() * FONDS_KIND_F;
  var premie = f.premie * 12 * lede;
  if(chronies().length) premie *= FONDS_SIEK_PREMIE;
  return Math.round(premie);
}
function fondsPremieJaar(){
  return s.mediesefonds ? fondsPremieVan(mediesefonds()) : 0;
}
/* Elke jaar word die premie betaal. Kan jy dit nie meer nie, verval die
   plan — en dan val elke behandeling wat daaraan hang saam om. */
function fondsJaar(){
  if(!s.mediesefonds || s.ouderdom<18) return 0;
  s.fondsJare = (s.fondsJare||0) + 1;
  var premie = fondsPremieJaar();
  var kan = Math.max(0, s.geld) + (s.spaar||0);
  if(premie > kan + Math.max(0, huishoudingBruto()*0.25)){
    noteer('Jy kon nie meer ' + mediesefonds().n.toLowerCase() + ' se ' + geld(premie) +
      ' per jaar bekostig nie. Jou mediese fonds het verval.','sleg');
    s.mediesefonds = null; s.fondsJare = 0;
    /* Elke behandeling wat die fonds betaal het, is nou 'n privaat rekening. */
    (s.siektes||[]).forEach(function(x){ if(x.pad==='fonds') x.pad = 'privaat'; });
    return 0;
  }
  if(s.geld < premie) dekUitSpaar(premie - s.geld);
  s.geld -= premie;
  noteer('Mediese fonds (' + mediesefonds().n.toLowerCase() + '): ' + geld(premie) +
    ' vir die jaar.','geld');
  return premie;
}
/* Wat hierdie behandeling jou vanjaar uit jou eie sak kos, op die pad
   wat jy gekies het. */
function behandelKoste(x){
  var tt = toestandVan(x.id);
  if(!tt || !x.behandel) return 0;
  if(x.pad==='staat') return 0;
  if(x.pad==='fonds'){
    if(!s.mediesefonds){ x.pad = 'privaat'; return Math.round(tt.koste * PRIVAAT_F); }
    /* Nuwe lid met 'n bestaande toestand: die wagperiode. */
    if(s.fondsJare <= FONDS_WAGPERIODE && x.voorFonds) return Math.round(tt.koste * PRIVAAT_F);
    return Math.round(tt.koste * (1 - mediesefonds().dek));
  }
  return Math.round(tt.koste * PRIVAAT_F);
}
/* Hoe goed die behandeling werk. Die staatshospitaal se uitkoms is
   slegter, en 'n jaar op die waglys werk glad nie. */
function behandelKrag(x){
  var tt = toestandVan(x.id);
  if(!tt || !x.behandel || x.wag>0) return 0;
  var k = tt.behandelF;
  if(x.pad==='staat') k *= tt.dringend ? STAAT_DRINGEND : STAAT_UITKOMS;
  return k;
}
/* Die keuse wat die speler kry sodra 'n toestand opduik. Dit is die hart
   van F2: dieselfde siekte, drie heel verskillende lewens daarna. */
function vraBehandeling(x){
  var tt = toestandVan(x.id);
  var vol = tt.koste;
  var opsies = [];
  if(s.mediesefonds){
    var gap = Math.round(vol * (1 - mediesefonds().dek));
    opsies.push({t:'Gebruik jou mediese fonds',
      sub: gap>0 ? 'Jy betaal ' + geld(gap) + ' uit jou eie sak' : 'Volledig gedek',
      doen:function(){ x.behandel=1; x.pad='fonds';
        noteer('Jou mediese fonds dek ' + tt.n.toLowerCase() + '.','geld');
        eersteRekening(x); }});
  }
  opsies.push({t:'Gaan staatshospitaal toe',
    sub: tt.staatGratis ? 'Gratis — die staat se program is goed hiervoor'
      : 'Gratis, maar die waglys is lank en die uitkoms swakker',
    doen:function(){ x.behandel=1; x.pad='staat';
      if(!tt.staatGratis && kans(STAAT_WAG)){
        x.wag = 1;
        noteer('Jy is op die waglys gesit. Die behandeling kom eers volgende jaar.','sleg');
      } else noteer('Die staatshospitaal het jou vir ' + tt.n.toLowerCase() + ' behandel.','neutraal');
    }});
  if(vol>0) opsies.push({t:'Betaal self, privaat',
    sub: geld(vol) + ' per jaar' + (vol > Math.max(0,s.geld)+(s.spaar||0) ?
      ' — jy het dit nie' : ''),
    klas: vol > Math.max(0,s.geld)+(s.spaar||0) ? 'rooi' : '',
    doen:function(){ x.behandel=1; x.pad='privaat';
      noteer('Jy het besluit om ' + tt.n.toLowerCase() + ' privaat te laat behandel.','neutraal');
      eersteRekening(x); }});
  opsies.push({t:'Doen niks daaraan', klas:'grys',
    sub: tt.dringend ? 'Dit is gevaarlik' : 'Dit kos niks, maar dit gaan nie weg nie',
    doen:function(){ x.behandel=0; x.pad=null;
      noteer('Jy het ' + tt.n.toLowerCase() + ' onbehandeld gelaat.','sleg'); }});
  wagry.push({titel:tt.e + ' ' + tt.n,
    vraag: tt.sub + '.\n' + (tt.soort==='chronies'
      ? 'Dit gaan nie weg nie. Die behandeling kos ' + geld(vol) + ' per jaar.'
      : 'Die behandeling kos ' + geld(vol) + '.') +
      (tt.dringend ? '\nDit is dringend.' : ''),
    opsies:opsies});
}
/* Die rekening van die jaar waarin jy die keuse maak, word dadelik
   betaal — anders is die eerste jaar van 'n siekte gratis, want
   siekteKosteJaar() het vroeër in die jaar al geloop. */
function eersteRekening(x){
  var koste = behandelKoste(x);
  if(koste<=0) return;
  var tt = toestandVan(x.id);
  x.betaalJaar = s.ouderdom;
  betaalWatJyKan(koste, tt.n.toLowerCase() + ' se behandeling');
}
/* ---------- F1: die siektejaar ---------- */
function siekteJaar(){
  if(!s.siektes) s.siektes = [];
  /* Vir die grafsteen: hoeveel van jou lewe het jy met 'n chroniese
     toestand saamgeleef? */
  if(chronies().length) s.siekJare = (s.siekJare||0) + 1;
  /* 1. wat jy al het, doen sy werk */
  s.siektes.slice().forEach(function(x){
    var tt = toestandVan(x.id);
    if(!tt){ s.siektes = s.siektes.filter(function(y){ return y!==x; }); return; }
    x.jare = (x.jare||0) + 1;
    if(x.wag>0){ x.wag--;
      if(x.wag<=0) noteer('Jou plek op die staatshospitaal se lys het oopgekom: ' +
        tt.n.toLowerCase() + ' word nou behandel.','goed'); }
    /* 'n Behandelde chroniese toestand maak jou nie elke jaar swakker
       nie — dit hou jou net op 'n laer vlak, en dit is sy erns in
       doodsKans() wat jou uiteindelik vat. Onbehandeld vreet dit elke
       jaar verder. */
    var krag = behandelKrag(x);
    var skade = 0;
    if(tt.soort==='akuut') skade = tussen(tt.gesond[0], tt.gesond[1]) * (1 - krag);
    else if(krag<=0) skade = tussen(tt.gesond[0], tt.gesond[1]);
    else if(kans(30)) skade = tussen(0, tt.gesond[1]) * (1 - krag);
    skade = Math.round(skade);
    s.gesondheid = klem(s.gesondheid - skade);
    x.gekos = (x.gekos||0) + skade;
    /* Onbehandeld kan 'n ernstige toestand enige jaar 'n krisis gee. */
    if(krag<=0 && tt.erns>=1.4 && kans(9)){
      s.gesondheid = klem(s.gesondheid - tussen(6, 10 + Math.round(tt.erns*4)));
      noteer(tt.n + ' het jou vanjaar in die hospitaal laat beland.','sleg');
    }
    if(tt.soort==='chronies' && kans(22))
      s.geluk = klem(s.geluk - tussen(1,5));
    /* Akuut: dit kom en dit gaan — behandel vinniger as onbehandeld. */
    if(tt.soort==='akuut'){
      var duur = tussen(tt.jare[0], tt.jare[1]) + (x.behandel ? 0 : 1);
      if(x.jare >= duur){
        s.siektes = s.siektes.filter(function(y){ return y!==x; });
        /* Jy kom wéér agter die wiel uit: die meeste van wat 'n akute
           siekte jou gekos het, kry jy terug. 'n Griep moet nie vir die
           res van jou lewe van jou gesondheid afkom nie. */
        var terug = Math.round((x.gekos||0) * (x.behandel ? 0.88 : 0.72)) + tussen(0,2);
        s.gesondheid = klem(s.gesondheid + terug);
        noteer('Jy is oor ' + tt.n.toLowerCase() + '.','goed');
      }
      return;
    }
    /* Chronies en onbehandeld: dit word erger, en dit kan 'n tweede
       toestand oopmaak (hoë bloeddruk wat 'n beroerte word). */
    if(!x.behandel && kans(4 + tt.erns*2)){
      var volg = tt.id==='bloeddruk' ? 'beroerte' : tt.id==='diabetes' ? 'hart' : null;
      if(volg && !hetToestand(volg)) kryToestand(volg, 'omdat ' + tt.n.toLowerCase() +
        ' onbehandeld gebly het');
    }
    /* Kanker kan ook verdwyn, as dit behandel word. */
    if(tt.id==='kanker' && x.behandel && x.jare>=tussen(2,4) && kans(38 + krag*40)){
      s.siektes = s.siektes.filter(function(y){ return y!==x; });
      s.geluk = klem(s.geluk + tussen(14,26));
      noteer('Die kanker is in remissie. Jy het dit gewen.','goed');
    }
  });
  /* 2. iets nuuts */
  if(kans(siekteKansJaar())){
    var kan = TOESTANDE.filter(function(tt){ return toestandGewig(tt)>0; });
    var nuut = kiesGeweeg(kan, toestandGewig);
    if(nuut) kryToestand(nuut.id);
  }
}
/* Sit 'n toestand in jou lewe en vra dadelik hoe jy dit gaan laat
   behandel. */
function kryToestand(id, rede){
  var tt = toestandVan(id);
  if(!tt || hetToestand(id)) return;
  var x = {id:id, jare:0, behandel:0, pad:null, wag:0, voorFonds: s.mediesefonds?0:1};
  s.siektes.push(x);
  /* Die diagnose van 'n LEWENSLANGE toestand is die groot slag; daarna is
     dit die behandeling wat bepaal hoe dit verder gaan. 'n Griep kry nie
     so 'n slag nie — dié vat net sy jaar en gaan dan weer weg. */
  if(tt.soort==='chronies')
    s.gesondheid = klem(s.gesondheid - tussen(tt.gesond[0], tt.gesond[1]*2));
  s.geluk = klem(s.geluk - Math.round(tt.erns*4 + 3));
  noteer('Die dokter sê jy het ' + tt.n.toLowerCase() +
    (rede ? ' ' + rede : '') + '.','sleg');
  /* 'n Kind se ouers besluit vir hom, en hulle gaan staat toe as daar
     nie 'n fonds is nie. */
  if(s.ouderdom<18 && !s.mediesefonds){
    x.behandel = 1; x.pad = 'staat';
    noteer('Jou ouers het jou staatshospitaal toe gevat.','neutraal');
    return;
  }
  vraBehandeling(x);
}
/* Die jaar se mediese rekeninge. Kan jy dit nie betaal nie, verval die
   behandeling — en dit is die punt waar F1, F2 en die skuldstelsel van
   Fase 2 bymekaarkom. */
function siekteKosteJaar(){
  var som = 0;
  (s.siektes||[]).forEach(function(x){
    if(x.betaalJaar===s.ouderdom) return;   /* al by die keuse betaal */
    var koste = behandelKoste(x);
    if(koste<=0) return;
    var tt = toestandVan(x.id);
    var ruimte = Math.max(0, s.geld) + (s.spaar||0) + skuldPerk();
    if(koste > ruimte){
      x.behandel = 0; x.pad = null;
      s.geluk = klem(s.geluk - tussen(6,14));
      noteer('Jy kon nie ' + tt.n.toLowerCase() + ' se ' + geld(koste) +
        ' bekostig nie. Die behandeling het opgehou.','sleg');
      /* Die staat is altyd daar, al is die waglys lank. */
      if(kans(62)){ x.behandel = 1; x.pad = 'staat'; x.wag = kans(STAAT_WAG) ? 1 : 0;
        noteer('Jy het by die staatshospitaal se kliniek aangesluit.','neutraal'); }
      return;
    }
    som += betaalWatJyKan(koste, tt.n.toLowerCase() + ' se behandeling');
  });
  /* E4 — voorbehoeding kos ook elke jaar geld. */
  var vb = voorbehoedingVan();
  if(vb.koste>0 && s.ouderdom>=15 && maat()){
    s.geld -= vb.koste; som += vb.koste;
  }
  return som;
}

/* ==========================================================================
   F4 — DRANK, SIGARETTE EN DWELMS
   Vlak 0 is niks, vlak 3 is verslaaf. Elke vlak kos meer geld, meer
   gesondheid, en meer van jou werk en jou mense. Die spiraal is dat 'n
   vlak nie bly staan nie: wie soms drink, drink mettertyd gereeld.
   ========================================================================== */
function gewoonteVan(id){
  var r = null;
  GEWOONTES.forEach(function(x){ if(x.id===id) r=x; });
  return r;
}
function gewoonteVlak(id){ return (s.gewoontes && s.gewoontes[id]) || 0; }
function verslaaf(){
  return GEWOONTES.some(function(g){ return gewoonteVlak(g.id)>=3; });
}
function gewoonteJaar(){
  if(!s.gewoontes) s.gewoontes = {drink:0, rook:0, dwelms:0};
  GEWOONTES.forEach(function(g){
    var v = gewoonteVlak(g.id);
    /* Opgehou? Dan is daar nog die terugval. */
    if(v===0){
      if(s.opgehou[g.id] && kans(TERUGVAL_KANS - Math.min(18, s.opgehou[g.id]*3))){
        s.gewoontes[g.id] = 1;
        noteer('Jy het weer begin ' + (g.id==='drink' ? 'drink' :
          g.id==='rook' ? 'rook' : 'gebruik') + '. Een keer was genoeg.','sleg');
      } else if(s.opgehou[g.id]) s.opgehou[g.id]++;
      return;
    }
    s.gewoonteJare[g.id] = (s.gewoonteJare[g.id]||0) + 1;
    /* Soek jy dit nie meer op nie, sak 'n lae vlak weer terug. Van vlak
       3 af help dit nie — dan moet jy regtig ophou (wysOphou). */
    var stil = s.ouderdom - ((s.gewoonteLaas && s.gewoonteLaas[g.id]) || 0);
    if(stil > GEWOONTE_STIL && kans(GEWOONTE_LOS[v])){
      s.gewoontes[g.id] = v - 1;
      if(v===1) noteer('Jy het sommer opgehou ' + (g.id==='drink' ? 'drink'
        : g.id==='rook' ? 'rook' : 'gebruik') + ' — jy het dit net nie meer opgesoek nie.','goed');
      else noteer('Jy gebruik minder ' + g.n.toLowerCase() + ' as voorheen.','goed');
      return;
    }
    /* Die geld. 'n Kind se ouers betaal dit nie — hy steel of bedel dit. */
    var koste = Math.round(g.koste[v] * dorpFaktor());
    if(koste>0 && s.ouderdom>=15 && !s.tronk){
      if(s.ouderdom>=18 || s.geld>=koste){ s.geld -= koste; }
      else { s.geld -= Math.round(koste*0.4); }
      noteer(g.n + ' het jou ' + geld(koste) + ' gekos vanjaar.','geld');
    }
    /* Die liggaam en die gemoed. */
    if(g.gesond[v]) s.gesondheid = klem(s.gesondheid - tussen(0, g.gesond[v]*2));
    if(g.geluk[v]) s.geluk = klem(s.geluk + (g.geluk[v]>0 ? tussen(0,g.geluk[v])
      : -tussen(0, -g.geluk[v])));
    /* Die werk. */
    if(s.beroep && g.werk[v] && kans(g.werk[v]*2)){
      s.beroep.prestasie = klem(s.beroep.prestasie - tussen(4, 8 + g.werk[v]));
      noteer('Jou werk het gely onder ' + g.n.toLowerCase() + '.','werk');
    }
    /* Die mense. */
    if(g.band[v] && kans(g.band[v]*3)){
      var naby = s.verhoudings.filter(function(x){
        return x.lewe && ['eggenoot','lief','ma','pa','seun','dogter'].indexOf(x.tipe)>=0; });
      if(naby.length){
        var w = kies(naby);
        w.band = klem(w.band - tussen(5, 8 + g.band[v]));
        noteer(w.naam + ' het met jou gepraat oor ' + g.n.toLowerCase() + '.','sleg');
      }
    }
    /* Die spiraal. Op vlak 1 is dit nog jou keuse; van vlak 2 af vat dit
       jou ook as jy dit nie opsoek nie. */
    if(v===1 && stil > GEWOONTE_STIL) return;
    if(g.spiraal[v] && kans(g.spiraal[v])){
      s.gewoontes[g.id] = v + 1;
      noteer('Jy is nou ' + g.vlakke[v+1] + '.', v+1>=3 ? 'sleg' : 'neutraal');
      if(v+1>=3) s.geluk = klem(s.geluk - tussen(5,12));
    }
  });
  /* 'n Verslaafde se jaar kan sommer in die tronk of op straat eindig. */
  if(gewoonteVlak('dwelms')>=3 && s.beroep && kans(9)){
    noteer('Jy is afgedank. Hulle het geweet hoekom.','sleg');
    s.beroep = null; losWerkMense(); s.geluk = klem(s.geluk - tussen(8,16));
  }
}
/* F4 — die drinkouderdom is 18. Is jy jonger en jy drink of rook, kan
   jou ouers jou vang. */
function teJonkGevang(g){
  var ouers = lewendeOuers();
  if(!ouers.length || !kans(ONDERDERTIEN_VANG)) return false;
  var p = kies(ouers);
  p.band = klem(p.band - tussen(8,22));
  s.geluk = klem(s.geluk - tussen(5,12));
  noteer(p.naam + ' het uitgevind van ' + g.n.toLowerCase() + '. Daar was groot moeilikheid.','sleg');
  return true;
}

/* ==========================================================================
   H3 — VAARDIGHEDE EN STOKPERDJIES (Fase 6)
   Die lys self staan in data.js. Hier is net die masjinerie: wat jou
   vlak is, wat 'n jaar se oefening doen, en waar 'n vaardigheid in die
   res van die spel uitkom — geld (vaardigInkomsteJaar), lewenskoste
   (vaardigKosSny), die JSE (vaardigBeleggingBonus), 'n werksaansoek
   (vaardigWerkBonus) en jou besigheid (vaardigBesigheidVlak).
   ========================================================================== */
function vaardigVan(id){
  var r = null;
  VAARDIGHEDE.forEach(function(x){ if(x.id===id) r = x; });
  return r;
}
function vaardig(id){ return (s.vaardighede && s.vaardighede[id]) || null; }
function vaardigVlak(id){ var v = vaardig(id); return v ? (v.vlak||0) : 0; }
function vaardigNaam(id){
  var x = vaardigVan(id), v = vaardigVlak(id);
  return (x && v) ? x.vlakke[v] : '';
}
/* Al die vaardighede wat jy al begin het, van die sterkste af. */
function myVaardighede(){
  var r = [];
  VAARDIGHEDE.forEach(function(x){ if(vaardig(x.id)) r.push(x); });
  r.sort(function(a,b){ return vaardigVlak(b.id) - vaardigVlak(a.id); });
  return r;
}
/* Watter vlak die punte beteken. */
function vlakVanPunte(p){
  var v = 0;
  for(var i=1;i<VAARDIG_PUNTE.length;i++) if(p >= VAARDIG_PUNTE[i]) v = i;
  return v;
}
/* Een jaar se oefening. Gee terug wat gebeur het, sodat die aksie dit
   kan vertel. */
function oefenJaar(id){
  var x = vaardigVan(id);
  if(!x) return null;
  if(!s.vaardighede) s.vaardighede = {};
  var v = s.vaardighede[id] || (s.vaardighede[id] = {vlak:0, punte:0, jare:0, laas:s.ouderdom});
  /* 'n Slim mens vorder vinniger, en 'n kind leer die gouste. Die
     drempels in VAARDIG_PUNTE loop al verder uitmekaar, dus is elke
     vlak hoër as die vorige een se werk. */
  var punte = tussen(VAARDIG_JAAR[0], VAARDIG_JAAR[1]) + s.slim*VAARDIG_SLIM;
  if(s.ouderdom <= VAARDIG_KIND_TOT) punte *= VAARDIG_KIND;
  v.punte += Math.max(1, Math.round(punte));
  v.jare = (v.jare||0) + 1;
  v.laas = s.ouderdom;
  var oud = v.vlak||0, nuut = vlakVanPunte(v.punte);
  if(nuut > oud){
    v.vlak = nuut;
    s.geluk = klem(s.geluk + tussen(3,8));
    noteer('Jy het ’n vlak in ' + x.n.toLowerCase() + ' geklim: jy ' + x.vlakke[nuut] + '.','goed');
  }
  /* Die stats wat die oefening self gee. */
  var st = x.stat || {};
  if(st.slim) s.slim = klem(s.slim + tussen(0, st.slim));
  if(st.geluk) s.geluk = klem(s.geluk + tussen(0, st.geluk));
  if(st.gesondheid) s.gesondheid = klem(s.gesondheid + tussen(0, st.gesondheid));
  if(st.voorkoms) s.voorkoms = klem(s.voorkoms + tussen(0, st.voorkoms));
  return {vlak:v.vlak, opgeklim:nuut>oud, naam:x.vlakke[v.vlak]||''};
}
/* 'n Vaardigheid wat jy jare lank laat lê, roes. Vlak 5 roes ook, net
   stadiger — niemand bly vir ewig 'n konsertpianis as hy nooit meer
   sit nie. */
function vaardigJaar(){
  if(!s.vaardighede) return;
  VAARDIGHEDE.forEach(function(x){
    var v = s.vaardighede[x.id];
    if(!v || !v.punte) return;
    var stil = s.ouderdom - (v.laas===undefined ? s.ouderdom : v.laas);
    if(stil < VAARDIG_ROES_NA) return;
    v.punte = Math.max(0, v.punte - tussen(VAARDIG_ROES[0], VAARDIG_ROES[1]));
    var nuut = vlakVanPunte(v.punte);
    if(nuut < (v.vlak||0)){
      v.vlak = nuut;
      noteer('Jy het ' + x.n.toLowerCase() + ' te lank laat lê. Jy ' +
        (nuut ? x.vlakke[nuut] : 'kan dit skaars meer') + '.','sleg');
    }
  });
}
/* Wat die vaardighede self inbring: die troue wat jy speel, die webwerf
   wat jy oor 'n naweek bou, die boek wat verkoop. Dit is los werk langs
   jou gewone inkomste, en SARS belas dit teen jou gewone koers. */
function vaardigInkomsteJaar(){
  var som = 0;
  VAARDIGHEDE.forEach(function(x){
    if(!x.inkomste) return;
    var v = vaardigVlak(x.id);
    if(v < x.inkomste.vanaf || s.tronk) return;
    /* Hoe hoër die vlak, hoe nader aan die boonste punt van die reeks. */
    var deel = (v - x.inkomste.vanaf + 1) / (VAARDIG_PUNTE.length - x.inkomste.vanaf);
    var lo = x.inkomste.bedrag[0], hi = x.inkomste.bedrag[1];
    var bedrag = Math.round((lo + (hi-lo)*deel) * tussen(55,120)/100);
    if(bedrag < 500) return;
    /* Het jy 'n voltydse werk of 'n besigheid, is daar minder tyd daarvoor. */
    if(s.beroep) bedrag = Math.round(bedrag * 0.45);
    if(s.besigheid) bedrag = Math.round(bedrag * 0.6);
    var netto = Math.round(bedrag * (1 - belastingKoers(bedrag + brutoInkomste())));
    som += netto;
    s.geld += netto; s.totaalVerdien += netto;
    noteer(x.n + ' het ' + geld(netto) + ' ingebring na belasting (jy ' + x.vlakke[v] + ').','geld');
  });
  return som;
}
/* B13 se lewenskoste: wie self kook, plant of vang, eet goedkoper. */
function vaardigKosSny(){
  var sny = 0;
  VAARDIGHEDE.forEach(function(x){
    if(!x.kos) return;
    var v = vaardigVlak(x.id);
    if(v < x.kos.vanaf) return;
    sny += x.kos.sny[0] + (x.kos.sny[1]-x.kos.sny[0]) *
      ((v - x.kos.vanaf) / Math.max(1, VAARDIG_PUNTE.length-1 - x.kos.vanaf));
  });
  return Math.min(0.3, sny);
}
/* Wie waardasie verstaan, kry 'n paar persent meer uit die JSE. */
function vaardigBeleggingBonus(){
  var b = 0;
  VAARDIGHEDE.forEach(function(x){
    if(!x.bele) return;
    var v = vaardigVlak(x.id);
    if(v < x.bele.vanaf) return;
    b += tussen(x.bele.bonus[0], x.bele.bonus[1]) * (v - x.bele.vanaf + 1) / 3;
  });
  return b;
}
/* 'n Aansoek: 'n ontwikkelaar wat self kodeer, kry die werk makliker. */
function vaardigWerkBonus(j){
  var b = 0;
  VAARDIGHEDE.forEach(function(x){
    if(x.werk && x.werk.indexOf(j.id)>=0) b += vaardigVlak(x.id) * VAARDIG_WERK_BONUS;
  });
  return b;
}
/* Die vlak van die vaardigheid agter 'n soort besigheid (H4). */
function vaardigBesigheidVlak(soortId){
  var v = 0;
  VAARDIGHEDE.forEach(function(x){
    if(x.besigheid === soortId) v = Math.max(v, vaardigVlak(x.id));
  });
  return v;
}

/* ==========================================================================
   H4 — JOU EIE BESIGHEID (Fase 6)
   Die soorte besighede en al die getalle staan in data.js. Hier is die
   jaar self: kliënte kom en gaan, die vaste koste loop, die werkers kry
   hul loon, en wat oorbly is wins of verlies.

   Dit loop DEUR die bestaande finansiesketting, nie langs dit nie:
     - wins kom by brutoInkomste() en word saam met jou salaris belas
     - 'n verlies gaan deur betaalWatJyKan(), dus deur B6 se skuld,
       die balju en uiteindelik die straat
     - die waarde van die besigheid tel in netoWaarde()
   ========================================================================== */
function besigheidSoort(id){
  var r = null;
  BESIGHEDE.forEach(function(x){ if(x.id===id) r = x; });
  return r;
}
/* Hoeveel kliënte jy kan hanteer: jyself, plus elke werker, plus wat
   die toerusting waarvoor jy betaal het, bysit. */
function besigheidKapasiteit(){
  var b = s.besigheid; if(!b) return 0;
  var x = besigheidSoort(b.id); if(!x) return 0;
  var kap = x.basis + (b.werkers||0) * x.perWerker;
  kap *= 1 + ((b.toerusting||0)/100000) * BESIG_TOERUSTING;
  /* Die vaardigheid agter die besigheid laat jou self meer doen. */
  kap *= 1 + vaardigBesigheidVlak(x.id) * 0.06;
  return Math.round(kap*10)/10;
}
function besigheidWins(){ return s.besigheid ? (s.besigheid.wins||0) : 0; }
/* Wat iemand vir die besigheid sou betaal: 'n winsgewende een verkoop
   vir 'n veelvoud van sy wins, 'n sukkelende een net vir sy toerusting. */
function besigheidWaarde(){
  var b = s.besigheid; if(!b) return 0;
  var wins = b.wins||0;
  if(wins > 0) return Math.round(wins*BESIG_VERKOOP + (b.toerusting||0)*0.5);
  return Math.round((b.toerusting||0) * BESIG_TOE_F);
}
function besigheidNaam(x){
  /* "Van der Merwe Webwerwe" — jou van, en wat jy doen. */
  return s.van + ' ' + x.n.split(' ')[0];
}
function huurWerkerIn(){
  var b = s.besigheid; if(!b) return null;
  if(!b.span) b.span = [];
  var w = nuweMens(null, tussen(19,56), null);
  var p = {naam:w.naam, van:w.van, geslag:w.geslag, jare:0};
  b.span.push(p);
  b.werkers = b.span.length;
  return p;
}
function besigheidJaar(){
  var b = s.besigheid;
  if(!b){ return 0; }
  var x = besigheidSoort(b.id);
  if(!x){ s.besigheid = null; return 0; }
  /* Sonder jou loop dit nie: in die tronk maak dit toe, en op straat
     hou net 'n stalletjie dit uit. */
  if(s.tronk){ sluitBesigheid('terwyl jy in die tronk was', true); return 0; }
  if(s.dakloos && b.id!=='smous'){
    sluitBesigheid('toe jy jou blyplek verloor het', true); return 0; }
  b.jare = (b.jare||0) + 1;
  var f = x.plaaslik ? dorpFaktor() : 1;
  /* --- kliënte: wat bykom, en wat elke jaar wegval --- */
  var groei = tussen(Math.round(x.groei[0]*10), Math.round(x.groei[1]*10))/10;
  groei *= 1 + vaardigBesigheidVlak(x.id) * BESIG_VAARDIG_F
             + (s.slim-50) * BESIG_SLIM
             + (s.aansien||0) * BESIG_AANSIEN;
  groei += ((b.bemarking||0)/10000) * BESIG_BEMARK_F;
  if(s.beroep) groei *= BESIG_WERK_AANDAG;
  if(groei < 0) groei = 0;
  var verloop = (b.kliente||0) * tussen(BESIG_VERLOOP[0], BESIG_VERLOOP[1])/100;
  var kap = besigheidKapasiteit();
  var oud = b.kliente||0;
  b.kliente = Math.max(0, oud + groei - verloop);
  var vol = false;
  if(b.kliente > kap){ b.kliente = kap; vol = true; }
  /* --- die jaar se omset --- */
  var omset = b.kliente * tussen(x.waarde[0], x.waarde[1]) * f;
  var sleg = kans(x.risiko);
  if(sleg) omset *= tussen(Math.round(BESIG_SLEG[0]*100), Math.round(BESIG_SLEG[1]*100))/100;
  else if(kans(BESIG_GOED))
    omset *= tussen(Math.round(BESIG_GOED_F[0]*100), Math.round(BESIG_GOED_F[1]*100))/100;
  omset = Math.round(omset);
  /* --- die koste --- */
  var koste = Math.round(x.vaste*f + (b.werkers||0)*x.loon + (b.bemarking||0));
  b.omset = omset; b.koste = koste; b.wins = omset - koste;
  b.totaalWins = (b.totaalWins||0) + b.wins;
  if(b.wins > (b.beste||0)) b.beste = b.wins;
  noteer(b.naam + ': ' + Math.round(b.kliente) + ' ' + x.wat + ', omset ' + geld(omset) +
    ', koste ' + geld(koste) + ' — ' + (b.wins>=0 ? 'wins ' : 'verlies ') +
    geld(Math.abs(b.wins)) + (b.wins>=0 ? ' voor belasting' : '') + '.',
    b.wins>=0 ? 'geld' : 'sleg');
  if(sleg) noteer(kies(['’n Groot kliënt het weggeloop.','Dit was ’n stil jaar in die bedryf.',
    '’n Mededinger het oopgemaak reg oorkant jou.','Beurtkrag het jou halwe jaar gevreet.']) +
    ' Die omset was laer as wat dit moes wees.','sleg');
  if(vol) noteer('Jy kon nie meer werk inneem nie — ' + b.naam +
    ' is vol. Huur iemand of koop toerusting as jy wil groei.','neutraal');
  /* --- en dan die geld --- */
  if(b.wins < 0){
    b.verliesJare = (b.verliesJare||0) + 1;
    betaalWatJyKan(-b.wins, b.naam + ' se verlies');
    if(b.verliesJare >= BESIG_VERLIES_MAKS){ besigheidBankrot(); return 0; }
    noteer(b.naam + ' is ' + b.verliesJare + ' jaar agtermekaar in die rooi. Nog ' +
      (BESIG_VERLIES_MAKS - b.verliesJare) + ' so ’n jaar en dit is klaar.','sleg');
  } else {
    b.verliesJare = 0;
    /* Die wins self word in inkomsteJaar() belas en by jou kontant
       gegooi, saam met enige salaris: brutoInkomste() tel dit in. */
  }
  /* 'n Werker wat niks te doen het nie, soek self 'n ander werk. */
  if((b.werkers||0) > 0 && kap > 0 && b.kliente/kap < BESIG_KAPASITEIT_MIN && kans(26)){
    var weg = b.span.pop();
    b.werkers = b.span.length;
    if(weg) noteer(weg.naam + ' het bedank — daar was te min werk vir ' +
      (b.werkers+1) + ' mense by ' + b.naam + '.','werk');
  }
  if(b.span) b.span.forEach(function(p){ p.jare = (p.jare||0) + 1; });
  b.bemarking = b.bemarking||0;
  return b.wins;
}
/* Drie verliesjare agtermekaar, of 'n verlies wat jy nie kan dra nie. */
function besigheidBankrot(){
  var b = s.besigheid; if(!b) return;
  var skuld = Math.round(Math.abs(b.wins||0) * 0.4);
  noteer(b.naam + ' is bankrot. Die deure is toe en die toerusting is ' +
    'opgeveil.','sleg');
  if(skuld>1000){
    s.geld -= skuld;
    noteer('Daar was nog ' + geld(skuld) + ' aan krediteure oor.','geld');
  }
  s.geluk = klem(s.geluk - tussen(14,28));
  s.aansien = Math.max(0, (s.aansien||0) - 1);
  stelVlag('bankrot', {n:b.naam});
  s.besighedeGehad = (s.besighedeGehad||[]);
  s.besighedeGehad.push({n:b.naam, jare:b.jare, einde:'bankrot'});
  s.besigheid = null;
}
/* Maak toe of verkoop. 'stil' is wanneer die lewe dit vir jou toemaak
   (die tronk, die straat) en jy niks daarvoor kry nie. */
function sluitBesigheid(rede, stil){
  var b = s.besigheid; if(!b) return 0;
  var kry = stil ? 0 : besigheidWaarde();
  if(kry>0){ s.geld += kry; }
  noteer(b.naam + ' het toegemaak ' + rede +
    (kry>0 ? '. Jy het ' + geld(kry) + ' daarvoor gekry.' : '.'), kry>0 ? 'geld' : 'sleg');
  s.besighedeGehad = (s.besighedeGehad||[]);
  s.besighedeGehad.push({n:b.naam, jare:b.jare||0, einde: stil ? 'toe' : 'verkoop'});
  s.besigheid = null;
  return kry;
}

/* ==========================================================================
   H1 — DIE GENERASIESPEL (Fase 6)
   Wanneer jy sterf, kan jy as een van jou kinders voortgaan. Dit is
   moontlik omdat E7 'n kind al 'n volle lewe laat leef: hy het sy eie
   slimheid, sy eie skoolloopbaan met 'n APS, dalk 'n graad, 'n werk,
   'n maat en sy eie kinders. Hier word daardie kind die nuwe `s`.

   Drie dinge gebeur:
     1. die boedel word verdeel (boedel, erfDeel) — ná Fase 2 se
        verband- en skuldreëls, want skuld word nie geërf nie
     2. die kind se reeds-geleefde geskiedenis word sy nuwe lewensverhaal
     3. die familie skuif een plek op: jou eggenoot word sy ma of pa,
        jou ander kinders word sy broers en susters, jou kleinkinders
        word sy kinders, jou ouers word sy grootouers, en jou broers en
        susters word sy ooms en tantes

   s.generasie tel hoeveel lewens die familie al geleef het en
   s.familielyn hou elkeen se naam, ouderdom en nalatenskap by.
   ========================================================================== */
function lewendeKinders(){
  return s.verhoudings.filter(function(v){
    return v.lewe && (v.tipe==='seun' || v.tipe==='dogter'); });
}
/* Wat daar is om te erf: alles wat jy besit, min die verband en min jou
   skuld. Is dit netto niks, erf niemand niks — maar niemand erf ook jou
   skuld nie. */
function boedel(){
  var bateSom = 0;
  s.bates.forEach(function(b){ bateSom += b.waarde; });
  var som = s.geld + (s.spaar||0) + s.belegging + (s.pensioenFonds||0) + bateSom - bondSkuld();
  som = Math.max(0, Math.round(som));
  /* Boedelbelasting: SARS vat 20% van alles bo R3,5 miljoen. Dit is ook
     die rede waarom 'n familie se geld nie oor vyf geslagte sonder
     einde aangroei nie. */
  if(som > BOEDEL_VRYSTELLING) som -= Math.round((som - BOEDEL_VRYSTELLING) * BOEDEL_BELASTING);
  return som;
}
/* Die huis waarin die gesin gebly het — die een ding wat 'n erfgenaam
   eerder as kontant wil kry. */
function familieBate(){
  var beste = null;
  s.bates.forEach(function(b){ if(b.t==='huis' && (!beste || b.waarde>beste.waarde)) beste = b; });
  return beste;
}
/* Hoe die boedel verdeel word: 'n lewende eggenoot kry die helfte, en
   die res word gelyk tussen die lewende kinders verdeel. */
function erfDeel(v){
  /* Erf hierdie kind nie die besigheid nie (hy is te jonk, of daar is
     nie een nie), word dit verkoop en is die opbrengs deel van die
     kontant wat verdeel word. */
  var erfBesigheid = !!s.besigheid && v.ouderdom>=16;
  var som = boedel() + (erfBesigheid ? 0 : besigheidWaarde());
  var eg = maat();
  var kinders = lewendeKinders();
  var deel = 0;
  if(kinders.length){
    var virKinders = (eg && eg.tipe==='eggenoot') ? som/2 : som;
    deel = Math.round(virKinders / kinders.length);
  }
  var r = {kontant:deel, bates:[], besigheid:false, deelVan:kinders.length, som:som};
  /* Is sy deel groot genoeg en is die verband afbetaal, kry hy die huis
     self in plaas van kontant daarvoor. */
  var huis = familieBate();
  if(huis && !bondSkuld() && deel >= huis.waarde){
    r.bates.push({id:huis.id, n:huis.n, t:huis.t, waarde:huis.waarde, e:huis.e});
    r.kontant = deel - huis.waarde;
  }
  r.besigheid = erfBesigheid;
  return r;
}
/* Die geskiedenis wat 'n kind as 'n ander mens geleef het, in die eerste
   persoon. kindNoteer() se teks is in die derde persoon ("het sy graad
   gekry"), daarom word 'sy'/'haar' hier 'jou'. */
function kindLogNaJou(t){
  return String(t).replace(/ sy /g, ' jou ').replace(/ haar /g, ' jou ');
}
/* Skuif elke mens in die ou lewe een plek in die familie op. */
function oorgangVerhoudings(v, oud){
  var lys = [], k = v.kl || {};
  /* Die ouer wat pas oorlede is, bly in die geheue staan. */
  lys.push({id:volgendeId++, naam:oud.naam, van:oud.van, geslag:oud.geslag,
    ouderdom:oud.ouderdom, band:100, voorkoms:50, lewe:false, raak:0,
    tipe: oud.geslag==='m' ? 'pa' : 'ma'});
  oud.verhoudings.forEach(function(r){
    if(r===v) return;                       /* hy is nou die speler self */
    var t = r.tipe, nuut = null, kant = r.kant;
    if(t==='eggenoot' || t==='lief'){
      /* Jou maat by jou dood is die kind se ander ouer. */
      nuut = r.geslag==='m' ? 'pa' : 'ma';
    }
    else if(t==='seun' || t==='dogter'){
      nuut = r.geslag==='m' ? 'broer' : 'suster';
    }
    else if(t==='kleinkind'){
      if(r.ouerId === v.id) nuut = r.geslag==='m' ? 'seun' : 'dogter';
      else nuut = r.geslag==='m' ? 'neef' : 'niggie';
    }
    else if(t==='ma' || t==='pa'){
      nuut = r.geslag==='m' ? 'oupa' : 'ouma';
      kant = oud.geslag==='v' ? 'ma' : 'pa';
    }
    else if(t==='broer' || t==='suster'){
      nuut = r.geslag==='m' ? 'oom' : 'tante';
    }
    /* Die ou lewe se oumas en oupas is die kind se oorgrootouers, en sy
       vriende, klasmaats en kollegas was nooit die kind se mense nie. */
    if(!nuut) return;
    /* Dooies bly net staan as hulle naby familie is — anders sou 'In
       geheue' ná 'n lang lewe uit honderd mense bestaan. */
    if(!r.lewe && ['ma','pa','ouma','oupa','seun','dogter'].indexOf(nuut)<0) return;
    r.tipe = nuut;
    if(kant) r.kant = kant; else delete r.kant;
    /* Die band begin by die band wat daardie mens met jou ouer gehad
       het, maar dit is nie dieselfde verhouding nie. */
    r.band = klem(Math.round(r.band * tussen(70,100)/100));
    lys.push(r);
  });
  /* Sy eie maat word 'n egte mens in sy lewe. */
  if(k.maat){
    /* Soos by 'n troue elders in die spel neem die eggenoot jou van. */
    var m = {id:volgendeId++, naam:k.maat.naam, van:v.van, geslag:k.maat.geslag,
      ouderdom:k.maat.ouderdom, band:tussen(58,92), voorkoms:tussen(30,88),
      lewe:true, raak:0, tipe:'eggenoot'};
    lys.push(m);
  }
  /* Twee broers met presies dieselfde naam lees vreemd, en dit kan
     gebeur omdat name lukraak gekies word. Die een wat NIE die speler
     is nie, kry 'n ander naam. */
  lys.forEach(function(r){
    if(r.naam === v.naam && r.lewe && r.id !== v.id)
      r.naam = kies(r.geslag==='m' ? MANSNAME : VROUENAME);
  });
  return lys;
}
/* Die kind se skoolloopbaan, oorgeskryf na die vorm wat s.skool gebruik. */
function oorgangSkool(k, ouderdom){
  var sk = s.skool;
  sk.vlak = k.skool.vlak==='baba' && ouderdom>=6 ? 'laerskool' : k.skool.vlak;
  sk.graad = k.skool.graad || 0;
  sk.matriek = !!k.skool.matriek;
  sk.aps = k.skool.aps || 0;
  sk.punte = sk.aps ? klem(Math.round(32 + sk.aps*1.45)) : 0;
  sk.grade = (k.skool.grade||[]).slice();
  sk.nagraads = [];
  sk.agter = 0;
  sk.uitslag = [];
  /* Het hy matriek, het hy vakke gehad. Ons weet nie watter nie, dus kry
     hy die verstek — met Wiskunde as sy punte goed was. */
  if(sk.aps){ verstekVakke();
    if(sk.aps>=30){ sk.wiskunde = true;
      sk.vakke = VAKKE_VERPLIG.concat(['Wiskunde','Fisiese Wetenskappe',
        'Lewenswetenskappe','Rekeningkunde']); } }
  if(sk.vlak==='universiteit'){
    var st = studieVanNaam(k.skool.studie);
    sk.studie = k.skool.studie;
    sk.jare = st ? st.jare : (k.skool.jareOor||3);
    sk.jareOor = k.skool.jareOor || 1;
    sk.geslaagJare = Math.max(0, sk.jare - sk.jareOor);
    sk.koste = k.studieBetaal || 0;
    sk.beurs = !k.studieBetaal;
    s.uni = kies(UNIES);
    s.aansien = s.uni.aansien;
  } else { sk.studie = null; sk.jareOor = 0; sk.jare = 0; }
}
/* Die kind se werk, oorgeskryf na s.beroep. */
function oorgangBeroep(k){
  if(!k.beroep) return;
  var j = null;
  BEROEPE.forEach(function(x){ if(x.id===k.beroep.id) j = x; });
  s.beroep = {id:k.beroep.id, t:k.beroep.t, basis:j ? j.s : k.salaris,
    salaris:k.salaris || (j?j.s:0), vlak:0, prestasie:tussen(45,70),
    jare:k.jareGewerk||0, k: j ? j.k : 'Werk', plafon:k.beroep.plafon || beroepPlafon(k.beroep.id)};
  s.beroepeGehad = [k.beroep.t];
  s.jareGewerk = k.jareGewerk || 0;
  pasPlafonToe();
}
/* Die hele oorgang. Ná hierdie funksie is `s` die kind. */
function gaanVoortAsKind(id){
  var oud = s;
  var v = null;
  oud.verhoudings.forEach(function(x){ if(x.id===id) v = x; });
  if(!v || !v.lewe) return false;
  var k = v.kl || kindLewe(v);
  var deel = erfDeel(v);
  var ouBesigheid = deel.besigheid ? oud.besigheid : null;
  var ouDiere = (oud.diere||[]).slice();
  /* Die lyn wat agter hom lê, met die ou lewe heel agter by. */
  var lyn = (oud.familielyn||[]).slice();
  lyn.push({naam:oud.naam + ' ' + oud.van, generasie:oud.generasie||1,
    ouderdom:oud.ouderdom, oorsaak:oud.oorsaak,
    beroep: oud.beroepeGehad.length ? oud.beroepeGehad[oud.beroepeGehad.length-1] : 'geen',
    netto: boedel() + besigheidWaarde(), kinders: oud.kindersGebore || oud.kinders});

  /* nuweLewe() gee ons 'n status met presies die regte vorm; daarna
     oorskryf ons alles wat die kind self al geleef het. */
  nuweLewe(v.naam, v.van, v.geslag);
  s.generasie = (oud.generasie||1) + 1;
  s.familielyn = lyn;
  s.ouderdom = v.ouderdom;
  s.geluk = k.geluk; s.gesondheid = k.gesondheid; s.slim = k.slim; s.voorkoms = k.voorkoms;
  s.dorp = k.dorp || oud.dorp;
  s.gene = oud.gene;                 /* F9 — dieselfde familiegeskiedenis */
  s.gewoontes = {drink:(k.gewoontes||{}).drink||0, rook:(k.gewoontes||{}).rook||0,
    dwelms:(k.gewoontes||{}).dwelms||0};
  s.lisensie = v.ouderdom>=18;
  s.diere = ouDiere;                 /* die gesin se diere bly by die huis */
  oorgangSkool(k, v.ouderdom);
  oorgangBeroep(k);
  /* Die nuwe mens het sy eie geheue: nuweLewe() se vlae (soos geenPa)
     hoort by die ouer, nie by hom nie. */
  s.vlagge = {};
  s.verhoudings = oorgangVerhoudings(v, oud);
  s.kinders = s.verhoudings.filter(function(r){
    return r.lewe && (r.tipe==='seun'||r.tipe==='dogter'); }).length;
  s.kindersGebore = s.kinders;
  s.troues = k.maat ? 1 : 0;
  var eg = maat();
  if(eg) maatBeroepKies(eg);         /* E12 — sy eggenoot verdien ook self */
  /* --- die erfenis --- */
  s.geld = Math.max(0, deel.kontant);
  deel.bates.forEach(function(b){ s.bates.push(b); });
  if(ouBesigheid){ s.besigheid = ouBesigheid; }
  var erfSom = deel.kontant;
  deel.bates.forEach(function(b){ erfSom += b.waarde; });
  /* Waarin hy opgegroei het, hang af van wat hy geërf het. */
  s.rykf = erfSom>3000000 ? 6 : erfSom>900000 ? 3 : erfSom>250000 ? 1.6 : erfSom>40000 ? 1 : 0.6;
  s.rykdom = s.rykf>=6 ? 'ryk' : s.rykf>=3 ? 'welgesteld' : s.rykf>=1.6 ? 'middelklas'
    : s.rykf>=1 ? 'werkersklas' : 'arm';
  s.blyplek = s.bates.some(function(b){ return b.t==='huis'; }) ? 'eie'
    : (v.ouderdom<18 ? (lewendeOuers().length ? 'ouers' : 'familie') : 'huur');
  if(v.ouderdom>=18 && s.blyplek==='huur') s.huurPlek = 'kommune';
  /* H3 — een ding wat sy ouer hom geleer het, op vlak 1. */
  var geleer = myVaardighedeVan(oud);
  s.vaardighede = {};
  if(geleer){
    s.vaardighede[geleer.id] = {vlak:1, punte:VAARDIG_PUNTE[1], jare:1, laas:s.ouderdom};
  }
  /* Fase 7 — die casino-telling was die ouer s'n. */
  s.casino = {sessies:0, ingekoop:0, uitbetaal:0};
  /* --- sy lewensverhaal --- */
  s.log = [];
  noteer('Jy is ' + v.naam + ' ' + v.van + ', kind van ' + oud.naam + ' ' + oud.van +
    ' — die ' + generasieWoord(s.generasie) + ' geslag van hierdie familie.','jaar');
  (k.geskiedenis||[]).forEach(function(r){
    s.log.push({o:r.o, t:'Jy ' + kindLogNaJou(r.t) + '.', k:'neutraal'});
  });
  s.log.push({o:v.ouderdom, t:oud.naam + ' is op ' + oud.ouderdom + ' oorlede weens ' +
    oud.oorsaak + '.', k:'sleg'});
  if(erfSom>0) s.log.push({o:v.ouderdom, t:'Jy het ' + geld(erfSom) + ' geërf' +
    (deel.bates.length ? ' (' + deel.bates[0].n + ' inbegrepe)' : '') +
    (deel.deelVan>1 ? ' — die boedel is tussen ' + deel.deelVan + ' kinders verdeel' : '') +
    '.', k:'geld'});
  else s.log.push({o:v.ouderdom, t:'Daar was niks om te erf nie.', k:'neutraal'});
  if(ouBesigheid) s.log.push({o:v.ouderdom, t:'Jy het ' + ouBesigheid.naam +
    ' oorgeneem.', k:'werk'});
  if(geleer) s.log.push({o:v.ouderdom, t:oud.naam + ' het jou ' +
    vaardigVan(geleer.id).n.toLowerCase() + ' geleer.', k:'goed'});
  noteer('Jy is nou ' + s.ouderdom + ' jaar oud.','jaar');
  stelVlag('generasiespeler', {ouer:oud.naam});
  stoor();
  return true;
}
/* Die sterkste vaardigheid van 'n lewe — wat 'n ouer vir sy kind
   nalaat sonder om dit te bedoel. */
function myVaardighedeVan(st){
  var beste = null, hoog = 0;
  VAARDIGHEDE.forEach(function(x){
    var d = st.vaardighede ? st.vaardighede[x.id] : null;
    if(d && (d.vlak||0) > hoog){ hoog = d.vlak; beste = x; }
  });
  return beste;
}
function generasieWoord(n){
  var w = ['','eerste','tweede','derde','vierde','vyfde','sesde','sewende','agste',
    'negende','tiende'];
  return w[n] || (n + 'de');
}
/* Die reël vir die grafsteen en die Mense-blad. */
function familielynTeks(){
  if(!(s.familielyn||[]).length) return '';
  return s.familielyn.map(function(r){
    return r.naam + ' (' + r.ouderdom + ', ' + r.beroep.toLowerCase() + ')'; }).join(' → ');
}
