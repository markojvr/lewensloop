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
  {id:'dokter', g:'Liggaam en gees', n:'Maak \u2019n doktersafspraak', e:'\u{1FA7A}', koste:850, min:1, maks:1,
   ouers:true, kosteTeks:'R850 \u00b7 jou ouers betaal solank jy \u2019n kind is',
   doen:function(){ var w = s.gesondheid<55 ? tussen(9,20) : tussen(3,9);
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
     return ['Jy het laat gestudeer. Dit sal betaal.','skool']; }},
  {id:'bank_klas', g:'Skool', n:'Bank die klas', e:'\u{1F60E}', koste:0, min:13, maks:1,
   as:function(){ return s.skool.vlak==='hoerskool'; },
   doen:function(){ s.geluk=klem(s.geluk+7); s.slim=klem(s.slim-4);
     if(kans(35)) { s.geluk=klem(s.geluk-12); return ['Jy is gevang terwyl jy klas gebank het. Detensie.','sleg']; }
     return ['Jy het klas gebank en niemand het dit agtergekom nie.','neutraal']; }},

  /* --- Geld --- */
  /* Lotto en casino is doelbewus sleg beleggings: oor baie kere verloor jy
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
  {id:'casino', g:'Geld', n:'Dobbel R5 000 by die casino', e:'\u{1F3B2}', koste:5000, min:18, maks:3,
   kosteTeks:'R5 000 \u00b7 38% kans om te wen \u00b7 die huis wen op die lang duur',
   doen:function(){
     if(kans(2)){ var j=tussen(30000,90000); s.geld+=j; s.geluk=klem(s.geluk+16);
       return ['Die masjien het losgebars! Jy het ' + geld(j) + ' gewen!','geld']; }
     if(kans(36)){ var w=tussen(6000,12000); s.geld+=w; s.geluk=klem(s.geluk+6);
       return ['Jy het ' + geld(w) + ' by die casino gewen!','geld']; }
     s.geluk=klem(s.geluk-6); return ['Jy het jou R5 000 by die casino verloor.','sleg']; }}
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
      v.band = klem(v.band + tussen(6,14)); pasVriendskapAan(v);
      klaarAkt('kuier','Jy het by ' + v.naam + ' gaan kuier.','goed');
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

/* ---------- Misdaad ---------- */
function doenMisdaad(id){
  var m = null;
  MISDADE.forEach(function(x){ if(x.id===id) m=x; });
  if(!m || !s.lewe) return;
  if(s.ouderdom<12){ wenk('Jy is te jonk vir die onderwereld.'); return; }
  if((s.gedoen['md_'+id]||0) >= 2){ wenk('Moenie jou geluk vanjaar verder druk nie.'); return; }
  kiesLys(m.n, 'Wat is die teiken?', m.teikens.map(function(teiken){
    return {t:teiken.n, sub:'Buit ' + kortGeld(teiken.buit[0]) + ' tot ' + kortGeld(teiken.buit[1]) +
      ' \u00b7 risiko ' + teiken.risiko + '%', doen:function(){ misdaadMaat(m, teiken); }};
  }));
}
function misdaadMaat(m, teiken){
  if(!m.maat){ misdaadVoertuig(m, teiken, null); return; }
  var opsies = [{t:'Gaan alleen', sub:'Die hele buit is joune', doen:function(){ misdaadVoertuig(m, teiken, null); }}];
  s.verhoudings.filter(function(v){ return v.lewe && v.ouderdom>=12 &&
      ['vriend','broer','suster','klasmaat','kollega','lief','eggenoot'].indexOf(v.tipe)>=0; })
    .sort(function(a,b){ return b.band - a.band; }).slice(0,8)
    .forEach(function(v){
      opsies.push({t:'Vra ' + v.naam, sub: rol(v) + ' \u00b7 band ' + v.band + '% \u00b7 julle deel die buit',
        doen:function(){
          if(v.band < 32 && kans(70)){
            v.band = klem(v.band - 8);
            noteer(v.naam + ' het geweier om saam te gaan en jou skeef aangekyk.','misdaad');
            wenk(v.naam + ' het geweier.');
            sluitModaal(); stoor(); renderAlles(); return;
          }
          misdaadVoertuig(m, teiken, v);
        }});
    });
  kiesLys('Wie gaan saam?','Twee is veiliger as een \u2014 maar julle deel die buit.', opsies);
}
function misdaadVoertuig(m, teiken, maatP){
  if(!m.voertuig){ misdaadUitslag(m, teiken, maatP, null); return; }
  var hetMotor = magBestuur() && s.bates.some(function(b){ return b.t==='motor'; });
  var lys = ONTSNAPVOERTUIE.filter(function(v){ return !v.vereisMotor || hetMotor; });
  kiesLys('Ontsnapvoertuig','Hoe kom julle daar weg?', lys.map(function(v){
    return {t:v.n, sub: v.sub + ' \u00b7 risiko ' + (v.mod>0?'+':'') + v.mod + '%',
      doen:function(){ misdaadUitslag(m, teiken, maatP, v); }};
  }));
}
function misdaadUitslag(m, teiken, maatP, voertuig){
  s.gedoen['md_'+m.id] = (s.gedoen['md_'+m.id]||0) + 1;
  var risiko = teiken.risiko + (voertuig ? voertuig.mod : 0) + (maatP ? -8 : 0)
    + s.rekord.length*3 - Math.round((s.slim-50)/6);
  risiko = Math.max(3, Math.min(95, risiko));
  var hoe = (maatP ? ' saam met ' + maatP.naam : '') + (voertuig ? ', ' + voertuig.n.toLowerCase() : '');
  if(kans(risiko)){
    noteer('Jy is gevang tydens ' + m.n.toLowerCase() + ' (' + teiken.n + ')' + hoe + '.','misdaad');
    s.geluk = klem(s.geluk-14);
    var jare = tussen(m.jare[0], m.jare[1]);
    if(maatP){
      var w = R(100);
      if(w < 28){
        maatP.band = klem(maatP.band - 5);
        noteer(maatP.naam + ' het die hele skuld op hom geneem. Jy stap vry.','misdaad');
        wenk(maatP.naam + ' het die skuld gevat!');
        sluitModaal(); stoor(); renderAlles(); return;
      }
      if(w < 52){
        jare += tussen(2,5); maatP.band = klem(maatP.band - 45);
        noteer(maatP.naam + ' het alles vir die polisie vertel. Jou vonnis is langer.','sleg');
      } else {
        noteer(maatP.naam + ' is saam met jou gevonnis.','misdaad');
      }
    }
    tronkToe(jare, m.n.toLowerCase());
    wenk('Gevang! ' + jare + ' jaar tronkstraf.');
  } else {
    var buit = tussen(teiken.buit[0], teiken.buit[1]);
    var myne = buit;
    if(maatP){ myne = Math.round(buit/2); maatP.band = klem(maatP.band + 12); }
    s.geld += myne; s.geluk = klem(s.geluk + 4);
    if(teiken.geluk) s.geluk = klem(s.geluk + teiken.geluk);
    noteer(m.n + ' (' + teiken.n + ')' + hoe + ' het ' + geld(myne) + ' opgelewer.','misdaad');
    wenk('Jy het ' + geld(myne) + ' gebuit.');
  }
  sluitModaal(); stoor(); renderAlles();
}

/* ---------- Tronk-aksies ---------- */
function tronkAksie(wat){
  if(!s.tronk) return;
  if((s.gedoen['t_'+wat]||0)>=1){ wenk('Een keer per jaar.'); return; }
  s.gedoen['t_'+wat]=1;
  if(wat==='oefen'){ s.gesondheid=klem(s.gesondheid+tussen(3,9));
    noteer('Jy het in die tronk se gimnasium gewerk.','neutraal'); }
  else if(wat==='lees'){ s.slim=klem(s.slim+tussen(3,8));
    noteer('Jy het die tronkbiblioteek leeggelees.','skool'); }
  else if(wat==='vriende'){ s.geluk=klem(s.geluk+tussen(3,8));
    noteer('Jy het vriende gemaak met die ouens in jou blok.','neutraal'); }
  else if(wat==='ontsnap'){
    if(kans(14 + s.slim/12)){ s.tronk=null; s.rekord.push('ontsnapping'); s.geluk=klem(s.geluk+20);
      noteer('Jy het uit die tronk ontsnap! Jy is nou ’n vlugteling.','misdaad'); wenk('Jy is uit!'); }
    else { s.tronk.jare += tussen(2,6); s.geluk=klem(s.geluk-12);
      noteer('Jou ontsnappingspoging het misluk. Jou vonnis is verleng.','sleg'); wenk('Misluk.'); }
  }
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
function werkVereis(j){
  /* A15 — jy kan nie voltyds werk terwyl jy nog op skool is nie. Die
     stelsel vir deeltydse werk en vakansiewerk is item D3 vir later. */
  if(s.skool.vlak==='laerskool' || s.skool.vlak==='hoerskool')
    return 'Jy is nog op skool — voltydse werk moet wag';
  if(s.ouderdom < j.min) return 'Jy moet ' + j.min + ' jaar oud wees';
  if(eduVlak() < j.edu) return EDU_TEKS[j.edu];
  if(j.gr && !j.gr.some(function(g){ return s.skool.grade.indexOf(g)>=0; }))
    return 'Graad in ' + j.gr.join(' of ') + ' nodig';
  if(j.na && !j.na.some(function(g){ return s.skool.nagraads.indexOf(g)>=0; }))
    return j.na.join(' of ') + ' nodig';
  if(s.slim < j.slim) return 'Slimheid ' + j.slim + '+ nodig';
  if(j.ervaring && s.jareGewerk < j.ervaring) return j.ervaring + ' jaar werkservaring nodig';
  if(j.skoon && s.rekord.length) return 'Geen kriminele rekord toegelaat';
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
  if(s.rekord.length) kansie -= 15;
  /* B18 — sonder ’n adres, ’n foon en skoon klere kom jy skaars by die
     onderhoud. ’n NGO se adres en ’n ID maak die groot verskil. */
  if(s.dakloos) kansie *= (s.dakloos.ngo ? DAKLOOS_NGO_KANS : DAKLOOS_WERKKANS);
  if(kans(kansie)){
    s.beroep = {id:j.id, t:j.t, basis:j.s, salaris:j.s, vlak:0, prestasie:tussen(45,68), jare:0, k:j.k};
    s.beroepeGehad.push(j.t);
    s.geluk = klem(s.geluk+12);
    noteer('Jy is aangestel as ' + beroepTitel() + ' teen ' + geld(j.s) + ' per jaar!','werk');
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
    s.gedoen.verhoging=1;
    if(s.beroep.prestasie>=58 && kans(40 + (s.beroep.prestasie-58))){
      var op = tussen(8,24);
      s.beroep.salaris = Math.round(s.beroep.salaris * (1+op/100));
      noteer('Jy het ’n ' + op + '% verhoging gekry! Nou ' + geld(s.beroep.salaris) + '.','geld');
      wenk('Verhoging van ' + op + '%!');
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
function wysStudies(){
  if(!s.skool.matriek){ wenk('Jy het matriek nodig.'); return; }
  if(s.ouderdom<18){ wenk('Jy moet 18 wees.'); return; }
  if(s.skool.vlak==='universiteit'||s.skool.vlak==='nagraads'){ wenk('Jy studeer alreeds.'); return; }
  var opsies = UNIES.map(function(u){
    var kan = s.skool.punte >= u.punte;
    return { t:u.n, klas: kan?'':'grys',
      sub: geld(u.koste) + ' per jaar \u00b7 vereis ' + u.punte + '% in matriek' +
        (kan ? '' : ' \u2014 jy het ' + s.skool.punte + '%'),
      doen:function(){ if(!kan){ wenk('Jou matriekpunt is te laag vir ' + u.n + '.'); return; }
        kiesStudie(u); } };
  });
  opsies.push({t:'Toemaar', klas:'grys', doen:function(){ sluitModaal(); }});
  wysModaal('Universiteit','Waar wil jy studeer?', opsies);
}
function kiesStudie(u){
  var beurs = (s.slim>=82 || s.skool.punte>=80);
  var opsies = STUDIES.map(function(st){
    var kan = s.slim >= st.slim;
    return { t:st.n, klas: kan?'':'grys', sub: kan ? 'Jy kwalifiseer' : 'Slimheid ' + st.slim + '+ nodig',
      doen:function(){
        if(!kan){ wenk('Jy is nie vir ' + st.n + ' aanvaar nie.'); return; }
        var koste = beurs ? 0 : u.koste;
        s.uni = u; s.aansien = u.aansien;
        s.skool = Object.assign(s.skool, {vlak:'universiteit', studie:st.n, jareOor:3,
          koste:koste, beurs:beurs});
        noteer('Jy is by ' + u.n + ' aanvaar vir ' + st.n +
          (beurs ? ' met \u2019n volle beurs!' : ' (' + geld(koste) + ' per jaar).'),'skool');
        maakKlasmaats(u.n);
        sluitModaal(); stoor(); renderAlles();
      }};
  });
  opsies.push({t:'Terug', klas:'grys', doen:function(){ wysStudies(); }});
  wysModaal(u.n, (beurs ? 'Jou punte is goed genoeg vir \u2019n volle beurs! '
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
        s.skool = Object.assign(s.skool, {vlak:'nagraads', studie:ng.n, jareOor:ng.jare, koste:ng.koste, beurs:false});
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
/* Wat die bank jou per jaar sal laat betaal: 33% van jou bruto inkomste. */
function bondVermoe(){ return Math.round(brutoInkomste() * BOND_AFFORDEERBAAR); }
/* Al die verbande wat vir hierdie huis moontlik is, met hul redes. */
function bondOpsies(prys){
  var lys = [];
  BOND_DEPOSITOS.forEach(function(dp){
    BOND_TERMYNE.forEach(function(jare){
      var deposito = Math.round(prys * dp);
      var lening = prys - deposito;
      var paaiement = bondPaaiement(lening, jare);
      var rede = null;
      if(s.swartlys>0) rede = 'Jy is gelys — nog ' + s.swartlys + ' jaar';
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
  if(bedrag==='alles') bedrag = s.geld;
  bedrag = Math.round(bedrag);
  if(bedrag<=0 || s.geld < bedrag){ wenk('Jy het nie soveel kontant nie.'); return; }
  s.geld -= bedrag; s.spaar = (s.spaar||0) + bedrag;
  noteer('Jy het ' + geld(bedrag) + ' na jou spaarrekening geskuif.','geld');
  wenk('Gespaar: ' + geld(bedrag)); stoor(); renderAlles();
}
function uitSpaar(bedrag){
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
  if(bedrag==='alles') bedrag = s.geld;
  if(bedrag<=0 || s.geld < bedrag){ wenk('Jy het nie soveel geld nie.'); return; }
  s.geld -= bedrag; s.belegging += bedrag;
  noteer('Jy het ' + geld(bedrag) + ' in ’n JSE-indeksfonds bele.','geld');
  wenk('Bele: ' + geld(bedrag)); stoor(); renderAlles();
}
function verkoopBelegging(){
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
  if(v.tipe==='eggenoot' && s.ouderdom>=18)
    o.push({t:'Probeer vir \u2019n baba', klas:'pienk', doen:function(){ raak(v,'baba'); }});
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
    noteer('Jy en ' + v.naam + ' is getroud! Die troue het ' + geld(koste) + ' gekos.','liefde'); }
  else if(wat==='baba'){
    if(s.gedoen['baba'+v.id]){ wenk('Een poging per jaar.'); return; }
    s.gedoen['baba'+v.id]=1;
    var kansie = s.ouderdom>44 ? 12 : s.ouderdom>38 ? 30 : 55;
    if(kans(kansie)) kryBaba();
    else noteer('Julle probeer nog vir ’n baba.','neutraal'); }
  else if(wat==='verbreek'){ v.tipe='vriend'; v.band=klem(v.band-25); s.geluk=klem(s.geluk-10);
    noteer('Jy het die verhouding met ' + v.naam + ' verbreek.','sleg'); }
  else if(wat==='skei'){
    v.tipe='vriend'; v.band=klem(v.band-30); s.geluk=klem(s.geluk-18);
    noteer('Jy en ' + v.naam + ' is geskei.','sleg');
    skeiVerdeel(v.naam); }
  pasVriendskapAan(v);
  sluitModaal(); stoor(); renderAlles();
}

function kryBaba(){
  var k = nuweMens(null, 0, s.van);
  k.tipe = k.geslag==='m' ? 'seun' : 'dogter'; k.band = tussen(75,100);
  s.verhoudings.push(k); s.kinders++; s.kindersGebore = (s.kindersGebore||0) + 1;
  s.geluk = klem(s.geluk+18);
  noteer('Julle het \u2019n ' + rol(k).toLowerCase() + ' gekry: ' + k.naam + '!','liefde');
  wenk('Dit is \u2019n ' + rol(k).toLowerCase() + '!');
}

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
