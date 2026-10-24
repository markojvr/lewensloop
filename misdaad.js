/* ==========================================================================
   12. MISDAAD EN REG (Fase 8)
   Die hele misdaadvloei: kies 'n teiken, wie saamgaan, hoe julle
   wegkom, speel die mini-spel (of doen dit vinnig), en dan die uitslag.
   Wie wegkom, verkoop goedere by die heler; wie gevang word, kan nog
   probeer wegjaag, en anders gaan dit hof toe. Die hof is nie meer
   outomaties tronk nie: 'n kind kry jeugreg, en 'n grootmens kry 'n
   waarskuwing, 'n boete, gemeenskapsdiens, 'n opgeskorte vonnis of
   tronkstraf na gelang van die misdaad en sy rekord.

   Hitte (s.hitte, 0-100) is hoe naby die polisie jou dophou. Dit styg
   met elke misdaad, val elke jaar, en maak elke volgende misdaad
   riskanter. Jy kan laag lê of 'n polisieman omkoop.

   Die getalle staan in data.js onder "MISDAAD EN REG". Niemand word in
   enige misdaad doodgemaak of beseer nie.
   ========================================================================== */

function misdaadVan(id){
  var m = null;
  MISDADE.forEach(function(x){ if(x.id===id) m = x; });
  return m;
}
function misdaadErns(m, t){ return t.erns || m.erns; }
/* 'n Bate se motor in TE_KOOP: die id is "porsche_12345". */
function motorVan(b){
  var id = String(b.id||'').split('_')[0], r = null;
  TE_KOOP.forEach(function(x){ if(x.id===id && x.t==='motor') r = x; });
  return r;
}
/* Jou eie motors as ontsnapvoertuie. */
function eieOntsnapMotors(){
  if(!magBestuur()) return [];
  var lys = [];
  s.bates.forEach(function(b){
    if(b.t!=='motor') return;
    var mt = motorVan(b) || {spoed:160, ontsnap:8};
    lys.push({id:'eie', n:'Jou ' + b.n, mod:-mt.ontsnap, spoed:mt.spoed, bate:b,
      sub:mt.spoed + ' km/h · jy parkeer hom om die hoek, nie op die toneel nie'});
  });
  return lys;
}
function hitteRisiko(){ return Math.round((s.hitte||0)/HITTE_PER_RISIKO); }
function misdaadTel(){
  if(!s.misdaad) s.misdaad = {pogings:0, gevang:0, buit:0, koste:0};
  return s.misdaad;
}

/* Waarom kan jy hierdie misdaad nie nou doen nie? '' as jy kan. */
function misdaadSlot(m){
  if(s.ouderdom < m.min) return 'ouderdom ' + m.min + '+';
  if(m.vereis==='werk' && !s.beroep) return 'jy het ’n werk nodig';
  if(m.vereis==='kodeer' && vaardigVlak('kodeer') < 2) return 'kodeer vlak 2+';
  return '';
}
function teikenOop(m, t){
  if(t.kodeer && vaardigVlak('kodeer') < t.kodeer) return false;
  if(t.salaris && (!s.beroep || s.beroep.salaris < t.salaris)) return false;
  return true;
}
function buitTeks(m, t){
  var lo, hi;
  if(t.buitF){ var sal = s.beroep ? s.beroep.salaris : 0;
    lo = Math.round(sal*t.buitF[0]); hi = Math.round(sal*t.buitF[1]); }
  else { lo = t.buit[0]; hi = t.buit[1]; }
  return (t.goed ? 'Goedere van ' : 'Buit ') + kortGeld(lo) + ' tot ' + kortGeld(hi);
}

/* ---------- Die vloei ---------- */
function doenMisdaad(id){
  var m = misdaadVan(id);
  if(!m || !s.lewe) return;
  if(s.ouderdom<12){ wenk('Jy is te jonk vir die onderwereld.'); return; }
  var slot = misdaadSlot(m);
  if(slot){ wenk('Nog nie: ' + slot + '.'); return; }
  if(s.gedoen.laag){ wenk('Jy lê vanjaar laag.'); return; }
  if((s.gedoen['md_'+id]||0) >= (m.perJaar||2)){ wenk('Moenie jou geluk vanjaar verder druk nie.'); return; }
  var lys = m.teikens.filter(function(t){ return teikenOop(m, t); });
  kiesLys(m.n, 'Wat is die teiken?' + (s.hitte>=10 ? ' Die polisie hou jou dop: +' + hitteRisiko() +
    '% op elke risiko.' : ''), lys.map(function(t){
    return {t:t.n, sub:buitTeks(m, t) + ' · risiko ' + t.risiko + '%', doen:function(){
      misdaadMaat({m:m, t:t}); }};
  }));
}
function misdaadMaat(c){
  if(!c.m.maat){ misdaadVoertuig(c); return; }
  var opsies = [{t:'Gaan alleen', sub:'Die hele buit is joune', doen:function(){ misdaadVoertuig(c); }}];
  s.verhoudings.filter(function(v){ return v.lewe && v.ouderdom>=12 &&
      ['vriend','broer','suster','klasmaat','kollega','lief','eggenoot'].indexOf(v.tipe)>=0; })
    .sort(function(a,b){ return b.band - a.band; }).slice(0,8)
    .forEach(function(v){
      opsies.push({t:'Vra ' + v.naam, sub: rol(v) + ' · band ' + v.band + '% · julle deel die buit',
        doen:function(){
          if(v.band < 32 && kans(70)){
            v.band = klem(v.band - 8);
            noteer(v.naam + ' het geweier om saam te gaan en jou skeef aangekyk.','misdaad');
            wenk(v.naam + ' het geweier.');
            sluitModaal(); stoor(); renderAlles(); return;
          }
          c.maat = v; misdaadVoertuig(c);
        }});
    });
  kiesLys('Wie gaan saam?','Twee is veiliger as een — maar julle deel die buit.', opsies);
}
function misdaadVoertuig(c){
  if(!c.m.voertuig){ misdaadSpel(c); return; }
  var lys = ONTSNAPVOERTUIE.concat(eieOntsnapMotors());
  kiesLys('Ontsnapvoertuig', c.maat ? 'Hoe kom julle daar weg?' : 'Hoe kom jy daar weg?', lys.map(function(v){
    return {t:v.n, sub: v.sub + ' · risiko ' + (v.mod>0?'+':'') + v.mod + '%',
      doen:function(){ c.voertuig = v; misdaadSpel(c); }};
  }));
}
function misdaadSpel(c){
  var spel = c.m.spel ? MD_SPELE[c.m.spel] : null;
  if(!spel){ misdaadUitslag(c); return; }
  minispelIngang(spel, {
    teks: spel.uitleg + '\n\nJou gevangskans soos dit nou staan: ' + misdaadRisiko(c) + '%.',
    klaar:function(u){ c.q = u.q; c.self = u.self; c.spelTeks = u.teks; misdaadUitslag(c); },
    los:function(){ wenk('Jy het jou bedenkinge gekry.'); }});
}

/* Die gevangskans. Die voertuig, 'n maat, jou slimheid en die mini-spel
   kan dit hoogstens tot RISIKO_VLOER van die basis druk; hitte en jou
   rekord kom daarna nog by. */
function spelMod(q){ return q===undefined || q===null ? 0 : Math.round((0.6 - q)*15); }
function misdaadRisiko(c){
  var t = c.t;
  var mods = (c.voertuig ? c.voertuig.mod : 0) + (c.maat ? -8 : 0)
    - Math.round((s.slim-50)/6) + spelMod(c.q);
  if(c.m.vereis==='kodeer') mods -= 2*Math.max(0, vaardigVlak('kodeer') - (t.kodeer||2));
  var r = Math.max(Math.round(t.risiko*RISIKO_VLOER), t.risiko + mods);
  r += s.rekord.length*3 + hitteRisiko();
  return Math.max(3, Math.min(95, r));
}
/* Wat die misdaad werd is, voor die heler en voor jy met 'n maat deel. */
function misdaadBuit(c){
  var t = c.t, b;
  if(t.buitF){
    var sal = s.beroep ? s.beroep.salaris : 0;
    b = Math.round(sal*(t.buitF[0] + Math.random()*(t.buitF[1]-t.buitF[0])));
  } else b = tussen(t.buit[0], t.buit[1]);
  /* Die kluis en die sakkerollery: hoe goed jy gespeel het, bepaal ook hoeveel jy kry. */
  if(c.q!==undefined && c.q!==null && (c.m.spel==='kluis' || c.m.spel==='sak'))
    b = Math.round(b*(0.35 + 0.65*c.q));
  return b;
}
function hoeTeks(c){
  var v = c.voertuig;
  return (c.maat ? ' saam met ' + c.maat.naam : '') +
    (v ? ', ' + (v.bate ? 'met jou ' + v.bate.n : v.n.toLowerCase()) : '');
}

function misdaadUitslag(c){
  var m = c.m, t = c.t;
  s.gedoen['md_'+m.id] = (s.gedoen['md_'+m.id]||0) + 1;
  misdaadTel().pogings++;
  var risiko = misdaadRisiko(c);
  s.hitte = klem((s.hitte||0) + m.hitte + Math.round(t.risiko/5));
  if(kans(risiko)) misdaadGevang(c);
  else misdaadSlaag(c);
}

/* ---------- As jy wegkom ---------- */
function misdaadSlaag(c){
  var m = c.m, t = c.t, waarde = misdaadBuit(c);
  if(t.goed){ helerVloei(c, waarde); return; }
  misdaadBetaal(c, waarde, '');
}
function misdaadBetaal(c, bedrag, ekstra){
  var m = c.m, t = c.t, myne = bedrag;
  if(c.maat){ myne = Math.round(bedrag/2); c.maat.band = klem(c.maat.band + 12); }
  s.geld += myne; s.geluk = klem(s.geluk + 4);
  misdaadTel().buit += myne;
  if(t.geluk) s.geluk = klem(s.geluk + t.geluk);
  /* G8 — witboordjie-misdaad: niemand sien dit nou nie, maar die oudit kom. */
  if(t.oudit) ouditBy(m, t, bedrag);
  var teks = m.n + ' (' + t.n + ')' + hoeTeks(c) + ' het ' + geld(myne) + ' opgelewer' +
    (c.maat ? ' (julle het ' + geld(bedrag) + ' gedeel)' : '') + '.' + (ekstra||'');
  if(m.wapen) teks += ' Niemand is beseer nie.';
  noteer(teks,'misdaad');
  wenk('Jy het ' + geld(myne) + ' gebuit.');
  sluitModaal(); stoor(); renderAlles();
}

/* ---------- Die heler ---------- */
/* Goedere is nie kontant nie: die heler betaal jou 30-60% van wat dit
   werd is, en minder as die hele dorp weet dit is gesteel. Jy kan een
   keer onderhandel. */
function helerAanbod(){
  return klem(tussen(HELER[0], HELER[1]) - Math.round((s.hitte||0)/12), HELER[0], HELER[1]);
}
function helerVloei(c, waarde){
  var pct = helerAanbod();
  var wat = c.m.id==='motor' ? 'Die chop shop in Bellville' : 'Die heler agter die kroeg';
  wysModaal('\u{1F91D} Die heler', (c.maat ? 'Julle' : 'Jy') + ' het weggekom met goedere van ' + geld(waarde) + '. ' + wat +
    ' bied ' + pct + '%: ' + geld(waarde*pct/100) + '.', [
    {t:'Vat sy aanbod', sub:geld(waarde*pct/100), doen:function(){
      misdaadBetaal(c, Math.round(waarde*pct/100), ' Die heler het ' + pct + '% betaal.'); }},
    {t:'Onderhandel', sub:'Hy kan opskuif — of kwaad word', doen:function(){
      var r = R(100), nuut = pct, teks;
      if(r < 50){ nuut = Math.min(HELER[1], pct + tussen(4,12)); teks = 'Hy sug en skuif op na ' + nuut + '%.'; }
      else if(r < 80){ teks = 'Hy skud sy kop. ' + pct + '%, en dis dit.'; }
      else { nuut = Math.max(HELER[0], pct - 8); teks = 'Hy hou nie van gierigheid nie. Nou bied hy net ' + nuut + '%.'; }
      wysModaal('\u{1F91D} Die heler', teks, [{t:'Vat ' + geld(waarde*nuut/100), doen:function(){
        misdaadBetaal(c, Math.round(waarde*nuut/100), ' Die heler het ' + nuut + '% betaal.'); }}]);
    }}
  ]);
}

/* ---------- As jy gevang word ---------- */
function misdaadGevang(c){
  var m = c.m, t = c.t;
  misdaadTel().gevang++;
  s.hitte = klem(s.hitte + HITTE_GEVANG);
  s.geluk = klem(s.geluk - 10);
  noteer('Die polisie het jou betrap tydens ' + m.n.toLowerCase() + ' (' + t.n + ')' + hoeTeks(c) + '.','misdaad');
  if(c.maat){
    var w = R(100);
    if(w < 28){
      c.maat.band = klem(c.maat.band - 5);
      noteer(c.maat.naam + ' het die hele skuld op ' + (c.maat.geslag==='v'?'haar':'hom') +
        ' geneem. Jy stap vry.','misdaad');
      wenk(c.maat.naam + ' het die skuld gevat!');
      sluitModaal(); stoor(); renderAlles(); return;
    }
    if(w < 52){
      c.verklik = true; c.maat.band = klem(c.maat.band - 45);
      noteer(c.maat.naam + ' het alles vir die polisie vertel.','sleg');
    }
  }
  var spoed = c.voertuig ? (c.voertuig.spoed||0) : (m.id==='motor' ? (t.spoed||0) : 0);
  if(spoed && kans(JAAGTOG_KANS)){
    var met = c.voertuig ? (c.voertuig.bate ? 'jou ' + c.voertuig.bate.n : c.voertuig.n.toLowerCase()) : 'die gesteelde motor';
    wysModaal('\u{1F6A8} Die polisie is agter jou!', 'Blou ligte in die truspieël. Jy sit in ' + met +
      ' (' + spoed + ' km/h). Jou kans om weg te kom is sowat ' + jaagBasis(spoed) + '% — en vang hulle jou ' +
      'ná ’n jaagtog, is die vonnis swaarder.', [
      {t:'Trap die petrol', klas:'rooi', sub:'’n Jaagtog: jou motor se spoed is jou spoed', doen:function(){
        sluitModaal(); jaagIngang(c, spoed); }},
      {t:'Trek af en gee jou oor', sub:'Die hof kyk gunstiger na wie saamwerk', doen:function(){
        c.oorgegee = true; misdaadHof(c); }}
    ]);
    return;
  }
  misdaadHof(c);
}
function jaagBasis(spoed){ return klem(10 + (spoed-150)*0.25, 8, 45); }
function jaagIngang(c, spoed){
  JAAGTOG.spoed = spoed;
  minispelIngang(JAAGTOG, {
    teks: JAAGTOG.uitleg + '\n\nJou spoed: ' + spoed + ' km/h, die polisie s’n ' + POLISIE_SPOED +
      ' km/h. Sonder ’n fout is jou kans sowat ' + Math.round(jaagBasis(spoed)*1.25) + '%.',
    klaar:function(u){ jaagKlaar(c, spoed, u.q); },
    los:function(){ c.oorgegee = true; misdaadHof(c); }});
}
function jaagKlaar(c, spoed, q){
  var p = jaagBasis(spoed)*(0.5 + 0.75*q);
  if(kans(p)){
    s.hitte = klem(s.hitte + 5);
    noteer('Jy het die polisie in ’n jaagtog afgeskud.','misdaad');
    misdaadSlaag(c);
    return;
  }
  c.jaag = true;
  if(q < 0.25){
    s.gesondheid = Math.max(10, s.gesondheid - tussen(8,20));
    noteer('Jy het in die jaagtog teen ’n paal vasgery. Jy is seer, maar niemand anders is beseer nie.','sleg');
  } else noteer('Die polisie het jou ná ’n jaagtog vasgekeer.','misdaad');
  if(c.voertuig && c.voertuig.bate && misdaadErns(c.m, c.t)>=4 && kans(MOTOR_BESLAG)){
    var b = c.voertuig.bate;
    s.bates = s.bates.filter(function(x){ return x!==b; });
    noteer('Die staat het beslag gelê op jou ' + b.n + ' (' + geld(b.waarde) + ').','sleg');
  }
  misdaadHof(c);
}
function misdaadHof(c){
  var m = c.m, t = c.t;
  hofSaak({n:m.n.toLowerCase(), erns:Math.min(5, misdaadErns(m, t) + (c.voertuig && c.voertuig.ekstra || 0)),
    wapen:!!m.wapen, jare:m.jare, verklik:!!c.verklik, jaag:!!c.jaag, oorgegee:!!c.oorgegee,
    maat:c.maat || null});
}

/* ==========================================================================
   DIE HOF (G1-G4)
   Een aanklag a = {n, erns (1-5), wapen, jare:[lo,hi], verklik, jaag,
   oorgegee, bedrag (witboordjie: wat terugbetaal moet word)}.
   hofSaak() vra jou keuses een vir een (prokureur, borgtog, pleit);
   hofBeslis() neem daardie keuses en doen die uitspraak. Die oudit (wat
   in die jaarmasjien gebeur) roep hofBeslis() direk met verstekkeuses.
   ========================================================================== */
var HOF_MIN = [0, 0, 0, 3, 7, 9];   /* die ligste uitkoms wat elke erns kan kry */

function hofSaak(a){
  if(s.ouderdom < 18){ jeugHof(a); return; }
  var opsies = PROKUREURS.filter(function(p){ return !p.koste || p.koste*a.erns <= s.geld; }).map(function(p){
    return {t:p.n, sub:p.sub + (p.koste ? ' · ' + geld(p.koste*a.erns) : ''), doen:function(){
      hofBorg(a, p); }};
  });
  wysModaal('⚖ Jy is in hegtenis geneem', 'Die aanklag: ' + a.n + (a.wapen ? ' met ’n wapen' : '') +
    '. Wie verdedig jou?', opsies);
}
function hofBorg(a, p){
  if(a.erns < 2){ hofPleit(a, p, 'waarskuwing'); return; }
  var borg = BORG_PER_ERNS * a.erns * a.erns;
  var opsies = [];
  if(s.geld >= borg) opsies.push({t:'Betaal borgtog', sub:geld(borg) + ' · jy kry dit ná die saak terug',
    doen:function(){ hofPleit(a, p, 'borg'); }});
  opsies.push({t:'Bly in aanhouding', sub: a.erns>=3 && s.beroep ? 'Maande in die selle — jou werk gaan verlore' :
    'Maande in die selle tot die verhoor', doen:function(){ hofPleit(a, p, 'aanhouding'); }});
  wysModaal('⚖ Borgtog', 'Die landdros stel borgtog op ' + geld(borg) + '.', opsies);
}
function hofPleit(a, p, borg){
  var k = onskuldigKans(a, p.bonus);
  wysModaal('⚖ Hoe pleit jy?', 'Jou prokureur: ' + p.n + '. Die aanklaer bied ’n pleitooreenkoms aan.', [
    {t:'Pleit skuldig', sub:'’n Ligter vonnis, maar geen kans om vry te kom nie', doen:function(){
      hofKlaar(a, {prokureur:p, borg:borg, pleit:'skuldig'}); }},
    {t:'Pleit onskuldig', sub:'Sowat ' + k + '% kans dat jy vrygespreek word; anders swaarder', doen:function(){
      hofKlaar(a, {prokureur:p, borg:borg, pleit:'onskuldig'}); }}
  ]);
}
function hofKlaar(a, keuses){
  var teks = hofBeslis(a, keuses);
  stoor(); renderAlles();
  wysModaal('⚖ Die uitspraak', teks, [{t:'OK', doen:function(){ sluitModaal(); stoor(); renderAlles(); }}]);
}
function onskuldigKans(a, bonus){
  return klem(14 + 11*bonus - 3*a.erns + (s.slim-50)/10 - (a.verklik?10:0) - (a.jaag?8:0) - (a.oudit?6:0), 3, 45);
}
/* Die vonnis self, sonder skerm: gee die soort uitkoms en die getalle. */
function hofVonnis(a, bonus, pleit){
  if(pleit==='onskuldig' && kans(onskuldigKans(a, bonus))) return {soort:'onskuldig'};
  var tel = s.rekord.length;
  var punte = a.erns*2 + Math.min(tel,4)*1.5 + (a.wapen?2:0) + (a.verklik?2:0) + (a.jaag?2:0)
    - (a.oorgegee?1:0) - bonus + (pleit==='skuldig' ? -2 : 1) + tussen(-1,2) + (s.opgeskort?2:0);
  punte = Math.max(punte, HOF_MIN[a.erns]);
  if(punte <= 2 && !tel) return {soort:'teruggetrek'};
  if(punte <= 4){
    var boete = Math.round(tussen(2000,6000)*a.erns*(1 + Math.min(tel,3)*0.5)/100)*100;
    return {soort:'boete', boete:boete};
  }
  if(punte <= 6) return {soort:'diens', ure:tussen(8,40)*10};
  var lo = a.jare[0], hi = a.jare[1];
  if(punte <= 8) return {soort:'opgeskort', jare:tussen(lo, Math.round((lo+hi)/2)), tot:tussen(3,5)};
  var f = Math.max(0, Math.min(1, (punte-9)/7));
  return {soort:'tronk', jare:Math.min(hi, Math.round(lo + f*(hi-lo)) + R(2))};
}
/* Doen die uitspraak en gee die teks terug. */
function hofBeslis(a, k){
  var p = k.prokureur || PROKUREURS[0], tel = misdaadTel(), teks = [];
  var koste = p.koste*a.erns;
  if(koste){ s.geld -= koste; tel.koste += koste; }
  var borg = k.borg==='borg' ? BORG_PER_ERNS*a.erns*a.erns : 0;
  if(borg) s.geld -= borg;
  if(k.borg==='aanhouding'){
    s.geluk = klem(s.geluk - 8);
    teks.push('Jy het maande in aanhouding op jou verhoor gewag.');
    if(a.erns>=3 && s.beroep){
      noteer('Jy het jou werk as ' + beroepTitel() + ' verloor terwyl jy in aanhouding was.','werk');
      teks.push('Jy het jou werk verloor.');
      s.beroep = null; losWerkMense();
    }
  }
  var v = hofVonnis(a, p.bonus, k.pleit);
  var skuldig = v.soort!=='onskuldig' && v.soort!=='teruggetrek';
  /* Wie skuldig bevind word terwyl 'n opgeskorte vonnis (of parool) loop,
     gaan sit daardie jare uit. */
  var opJare = 0;
  if(skuldig && s.opgeskort){ opJare = s.opgeskort.jare; s.opgeskort = null; }
  if(v.soort==='onskuldig'){
    s.geluk = klem(s.geluk + 10);
    teks.push('Die hof het jou onskuldig bevind op ' + a.n + '. Jy stap vry, sonder ’n rekord.');
  } else if(v.soort==='teruggetrek'){
    teks.push('Die aanklaer het die saak teruggetrek, met ’n streng waarskuwing. Dit kom nie op jou rekord nie.');
  } else if(v.soort==='boete'){
    s.rekord.push(a.n); tel.koste += v.boete;
    teks.push('Skuldig aan ' + a.n + '. Die hof het jou ' + geld(v.boete) + ' beboet.');
    betaalWatJyKan(v.boete, 'die boete');
  } else if(v.soort==='diens'){
    s.rekord.push(a.n); s.geluk = klem(s.geluk - 6);
    teks.push('Skuldig aan ' + a.n + '. Jy moet ' + v.ure + ' uur gemeenskapsdiens doen.');
  } else if(v.soort==='opgeskort'){
    s.rekord.push(a.n); s.geluk = klem(s.geluk - 4);
    if(!opJare) s.opgeskort = {jare:v.jare, tot:s.ouderdom + v.tot, vir:a.n};
    teks.push('Skuldig aan ' + a.n + '. ' + v.jare + ' jaar tronkstraf, opgeskort vir ' + v.tot +
      ' jaar: word jy in daardie tyd weer skuldig bevind, gaan sit jy dit uit.');
  }
  /* Wat jy gesteel het, betaal jy terug — selfs as die saak teruggetrek word. */
  if(a.bedrag && v.soort!=='onskuldig'){
    var terug = Math.round(a.bedrag*TERUGBETAAL);
    tel.koste += terug;
    teks.push('Jy moet ' + geld(terug) + ' terugbetaal.');
    betaalWatJyKan(terug, 'die terugbetaling');
  }
  if(a.oudit && skuldig && a.erns>=3 && s.beroep && v.soort!=='tronk'){
    noteer('Jy is as ' + beroepTitel() + ' afgedank.','werk');
    teks.push('Jou werkgewer het jou afgedank.');
    s.beroep = null; losWerkMense();
  }
  var jare = (v.soort==='tronk' ? v.jare : 0) + opJare;
  if(opJare) teks.push('Jou opgeskorte vonnis van ' + opJare + ' jaar is in werking gestel.');
  if(v.soort==='tronk') teks.push('Skuldig aan ' + a.n + '. Die hof het jou tot ' + v.jare + ' jaar tronkstraf gevonnis.');
  if(borg){ s.geld += borg; teks.push('Jou borggeld is terugbetaal.'); }
  if(jare){ s.geluk = klem(s.geluk - 4); tronkToe(jare, a.n); }
  if(a.maat && a.maat.lewe) noteer(a.maat.naam + ' is saam met jou aangekla.','misdaad');
  var t = teks.join(' ');
  noteer(t, skuldig ? 'misdaad' : 'goed');
  wenk(v.soort==='tronk' || jare ? 'Tronk: ' + jare + ' jaar.' : skuldig ? 'Skuldig bevind.' : 'Jy stap vry!');
  return t;
}

/* G1 — die Child Justice Act: 'n kind van 12 of 13 word nie vervolg nie
   (diversie), en 'n kind tot 17 gaan eerder na 'n diversieprogram as na
   die hof. Net wie herhaaldelik of ernstig oortree, gaan na 'n
   jeugsorgsentrum (child and youth care centre) — nooit 'n tronk vir
   grootmense nie, en hoogstens tot 21. */
function jeugHof(a){
  var vorige = vlagKeer('diversie') + s.rekord.filter(function(r){ return /\(jeug\)$/.test(r); }).length;
  var teks;
  if(s.ouderdom < 14 || (vorige===0 && a.erns<=3) || (a.erns<=2 && vorige<=1)){
    stelVlag('diversie');
    s.geluk = klem(s.geluk - 6);
    lewendeOuers().forEach(function(p){ p.band = klem(p.band - 6); });
    teks = 'Omdat jy ' + s.ouderdom + ' is, het jou saak na die kinderhof gegaan. Jy is na ’n diversieprogram ' +
      'verwys: lewensvaardighede, gemeenskapswerk en ’n gesprek met die slagoffer. Dit kom nie op jou rekord nie.';
    noteer(teks,'misdaad');
    wenk('Diversie, nie tronk nie.');
  } else {
    var jare = Math.max(1, Math.min(4, a.erns - 1 + vorige, 21 - s.ouderdom));
    teks = 'Die kinderhof het jou na ’n jeugsorgsentrum gestuur vir ' + jare + ' jaar (' + a.n + '). ' +
      'Jy gaan daar skool, maar jy kom nie huis toe nie.';
    tronkToe(jare, a.n + ' (jeug)', {jeug:true});
    wenk('Jeugsorgsentrum: ' + jare + ' jaar.');
  }
  stoor(); renderAlles();
  wysModaal('⚖ Die kinderhof', teks, [{t:'OK', doen:function(){ sluitModaal(); stoor(); renderAlles(); }}]);
}

/* ---------- G8 — die oudit ---------- */
/* Elke witboordjie-misdaad gaan as 'n saak in die vlag "oudit". Elke
   jaar ná die eerste kan die oudit dit uitbring, tot OUDIT_JARE verby is. */
function ouditBy(m, t, bedrag){
  var d = vlagData('oudit') || {sake:[]};
  var perJaar = Math.round((1 - Math.pow(1 - t.oudit/100, 1/OUDIT_JARE))*1000)/10;
  d.sake.push({n:t.n.charAt(0).toLowerCase() + t.n.slice(1), m:m.n.toLowerCase(), bedrag:bedrag, o:s.ouderdom, kans:perJaar,
    erns:misdaadErns(m, t)});
  stelVlag('oudit', d);
}
function ouditJaar(){
  var d = vlagData('oudit');
  if(!d || !d.sake || !d.sake.length || s.tronk) return;
  var oop = [], gevang = null;
  d.sake.forEach(function(k){
    var jare = s.ouderdom - k.o;
    if(!gevang && jare>=1 && kans(k.kans)){ gevang = k; return; }
    if(jare >= OUDIT_JARE){
      noteer('Niemand het ooit uitgevind van jou ' + k.n + ' nie.','misdaad'); return; }
    oop.push(k);
  });
  stelVlag('oudit', {sake:oop});
  if(!gevang) return;
  noteer('’n Forensiese oudit het jou ' + gevang.n + ' (' + geld(gevang.bedrag) + ') uitgebring.','misdaad');
  s.hitte = klem((s.hitte||0) + HITTE_GEVANG);
  misdaadTel().gevang++;
  var a = {n:gevang.m, erns:gevang.erns, wapen:false, jare:[3,10], bedrag:gevang.bedrag, oudit:true};
  /* Die jaarmasjien kan nie 'n hele hofsaak vra nie (die wagry wys een
     vraag op 'n slag), so die keuse is een stap: pleit skuldig met
     Regshulp, of veg dit met Regshulp of met 'n advokaat. */
  var regs = PROKUREURS[0], adv = PROKUREURS[PROKUREURS.length-1];
  function uitspraak(p, pleit){ return function(){
    wagry.unshift({titel:'\u2696 Die uitspraak', teks:hofBeslis(a, {prokureur:p, borg:'waarskuwing', pleit:pleit})}); }; }
  var opsies = [
    {t:'Pleit skuldig en betaal terug', sub:'Regshulp \u00b7 ’n ligter vonnis', doen:uitspraak(regs, 'skuldig')},
    {t:'Veg dit met Regshulp', sub:'Sowat ' + onskuldigKans(a, regs.bonus) + '% kans om vry te kom', doen:uitspraak(regs, 'onskuldig')}];
  if(adv.koste*a.erns <= s.geld) opsies.push({t:'Veg dit met ’n advokaat', sub:geld(adv.koste*a.erns) + ' \u00b7 sowat ' +
    onskuldigKans(a, adv.bonus) + '% kans om vry te kom', doen:uitspraak(adv, 'onskuldig')});
  wagry.push({titel:'\u{1F9FE} Die oudit het jou gevang',
    vraag:'Die oudit het jou ' + gevang.n + ' van ' + (s.ouderdom - gevang.o) + ' jaar gelede uitgebring (' +
      geld(gevang.bedrag) + ').', opsies:opsies});
}

/* ---------- Die jaar: hitte, opgeskorte vonnisse, oudits ---------- */
function misdaadJaar(){
  if(s.hitte) s.hitte = Math.max(0, Math.round(s.hitte*(1-HITTE_VERVAL)) - HITTE_VERVAL_VAS);
  if(s.opgeskort && s.ouderdom >= s.opgeskort.tot && !s.tronk){
    noteer(s.opgeskort.vir==='parool' ? 'Jou parool is verby. Jy is heeltemal vry.' :
      'Jou opgeskorte vonnis het verval. Die skoon blad is joune.','goed');
    s.opgeskort = null;
  }
  ouditJaar();
}

/* ---------- Hitte laat sak ---------- */
function laagLe(){
  if(s.gedoen.laag){ wenk('Jy lê al laag.'); return; }
  s.gedoen.laag = 1;
  s.hitte = Math.round((s.hitte||0)/2);
  s.geluk = klem(s.geluk - 2);
  noteer('Jy lê laag: geen misdaad vanjaar nie, en die polisie se aandag verflou.','misdaad');
  wenk('Hitte nou ' + s.hitte + '.');
  stoor(); renderAlles();
}
function omkoopPrys(){ return Math.round((OMKOOP_BASIS + (s.hitte||0)*OMKOOP_PER_HITTE)/500)*500; }
function omkoop(){
  if(s.ouderdom < 18){ wenk('Jy is te jonk om ’n polisieman om te koop.'); return; }
  if((s.hitte||0) < 10){ wenk('Niemand stel nou in jou belang nie.'); return; }
  if(s.gedoen.omkoop){ wenk('Een keer per jaar.'); return; }
  var prys = omkoopPrys();
  if(s.geld < prys){ wenk('Hy wil ' + geld(prys) + ' kontant sien.'); return; }
  wysModaal('\u{1F46E} Koop ’n polisieman om', 'Kaptein ' + kies(VANNE) + ' kan jou lêer laat wegraak vir ' +
    geld(prys) + '. Maar nie elke polisieman is te koop nie.', [
    {t:'Betaal hom', sub:geld(prys) + ' · sowat ' + (100-OMKOOP_EERLIK) + '% kans dat hy dit vat', doen:function(){
      s.gedoen.omkoop = 1;
      if(kans(100-OMKOOP_EERLIK)){
        s.geld -= prys; misdaadTel().koste += prys;
        s.hitte = Math.round(s.hitte*0.35);
        noteer('Jy het ’n polisieman ' + geld(prys) + ' betaal. Jou lêer het weggeraak.','misdaad');
        wenk('Hitte nou ' + s.hitte + '.');
        sluitModaal(); stoor(); renderAlles();
      } else {
        noteer('Die polisieman was eerlik — en hy het jou dadelik vir omkopery gearresteer.','misdaad');
        misdaadTel().gevang++;
        hofSaak({n:'omkopery', erns:2, wapen:false, jare:[1,5]});
      }
    }},
    {t:'Los dit', klas:'grys', doen:sluitModaal}
  ]);
}

/* ==========================================================================
   MISDAAD-MINI-SPELE
   Elkeen gee 'n gehalte q van 0 tot 1 terug. "Doen dit vinnig" trek q
   tussen 0,45 en 0,75 (gemiddeld 0,6) — dit is presies die gelykbreek-
   punt van spelMod(), so vinnig verander die risiko gemiddeld nie. 'n
   Goeie speler haal 0,8 tot 1 en kry 3 tot 6% minder risiko (en by die
   kluis en die sakkerollery ook meer buit); 'n slordige speler betaal.
   ========================================================================== */
function mdVinnig(teks){ return {q:0.45 + Math.random()*0.3, teks:teks}; }
function mdRaam(spel, tafel, etiket){
  return '<div class="md-agter"><div class="ms-kop"><div class="ms-naam">' + spel.e + ' ' + spel.n + '</div>'+
    '<div class="ms-chips"><small>' + etiket + '</small><span id="ms-chips"></span></div>'+
    '<button class="ms-weg" onclick="msStapWeg()">Gee op</button></div>'+
    '<div class="ms-tafel">' + tafel + '<div class="ms-boods" id="ms-boods"></div></div>'+
    '<div class="ms-beheer" id="ms-beheer"></div></div>';
}
var md = null;   /* die mini-spel wat nou loop */
function mdStop(){ if(md && md.tik){ clearInterval(md.tik); md.tik = null; } }
function mdKlaar(q){
  if(!md) return;
  mdStop(); var k = md.klaar; md = null;
  k({q:Math.max(0, Math.min(1, q))});
}

/* ---------- Slotoopsteek (huisinbraak) ---------- */
/* Vyf penne. 'n Merker gly heen en weer; druk as hy in die groen sone
   is. Elke pen is vinniger en die sone smaller. Elke fout is lawaai. */
var SLOT_PENNE = 5, SLOT_FOUTE = 4;
function slotQ(foute, klaar){ return klaar ? Math.max(0, 1 - foute*0.2) : 0.1; }
var SLOTOOP = {
  id:'slot', n:'Slotoopsteek', e:'\u{1F510}',
  uitleg:'Steek die agterdeur se slot oop: druk elke keer as die merker in die groen sone is. Vyf penne; elke fout maak lawaai.',
  selfSub:'Jy steek self die slot oop · goeie werk haal tot 6% van die risiko af',
  vinnigSub:'Jy wikkel en hoop vir die beste · die risiko bly min of meer dieselfde',
  begin:function(o){
    md = {klaar:o.klaar, pen:0, foute:0, pos:0, rig:1};
    o.paneel.innerHTML = mdRaam(SLOTOOP, '<div class="md-penne" id="md-penne"></div>'+
      '<div class="md-baan"><div class="md-sone" id="md-sone"></div><div class="md-merk" id="md-merk"></div></div>', 'Penne');
    el('ms-beheer').innerHTML = '<button class="knop groen md-groot" onclick="slotDruk()">Lig die pen</button>';
    slotSone(); slotTeken(); msBoods('Druk as die merker in die groen is.');
    md.tik = setInterval(function(){
      var v = 0.8 + md.pen*0.25;
      md.pos += md.rig*v;
      if(md.pos >= 100){ md.pos = 100; md.rig = -1; }
      if(md.pos <= 0){ md.pos = 0; md.rig = 1; }
      el('md-merk').style.left = md.pos + '%';
    }, 16);
  },
  stapWeg:function(){ if(md) mdKlaar(md.pen/SLOT_PENNE*0.5); },
  vinnig:function(){ return mdVinnig('Jy het aan die slot gewikkel tot hy oopgegee het.'); }
};
function slotSone(){
  var w = 22 - md.pen*2, a = 8 + Math.random()*(84 - w);
  md.sone = [a, a+w];
  var z = el('md-sone'); z.style.left = a + '%'; z.style.width = w + '%';
}
function slotTeken(){
  el('ms-chips').textContent = md.pen + '/' + SLOT_PENNE;
  var h = '';
  for(var i=0;i<SLOT_PENNE;i++) h += '<span class="' + (i<md.pen ? 'aan' : '') + '"></span>';
  el('md-penne').innerHTML = h;
}
function slotDruk(){
  if(!md || !md.sone || !md.tik) return;
  if(md.pos >= md.sone[0] && md.pos <= md.sone[1]){
    md.pen++; slotTeken();
    if(md.pen >= SLOT_PENNE){ msBoods('Klik! Die deur is oop.','goed');
      var q = slotQ(md.foute, true); mdStop(); setTimeout(function(){ mdKlaar(q); }, 600); return; }
    msBoods('Pen ' + md.pen + ' sit.','goed'); slotSone();
  } else {
    md.foute++;
    if(md.foute >= SLOT_FOUTE){ msBoods('Die slot breek. Jy skop die deur oop — met ’n lawaai.','sleg');
      mdStop(); setTimeout(function(){ mdKlaar(slotQ(md.foute, false)); }, 900); return; }
    msBoods('Kras! Te veel lawaai (' + md.foute + ' van ' + SLOT_FOUTE + ').','sleg');
  }
}

/* ---------- 'n Motor sonder sleutel aanskakel (motordiefstal) ---------- */
/* Vyf drade. Die volgorde flits een keer; tik dit dan na voor die
   alarm afgaan. 'n Verkeerde draad gee 'n vonk. */
var DRADE = [{n:'rooi', k:'#e53935'}, {n:'blou', k:'#1e88e5'}, {n:'geel', k:'#fdd835'},
  {n:'groen', k:'#43a047'}, {n:'wit', k:'#eceff1'}];
var DRAAD_LENGTE = 4, DRAAD_TYD = 9000, DRAAD_FOUTE = 3;
function draadQ(foute, klaar, deelTyd, pos){
  if(!klaar) return 0.15 + 0.1*pos;
  return Math.max(0, 1 - foute*0.25 - deelTyd*0.2);
}
var AANSKAKEL = {
  id:'aanskakel', n:'Draai die drade', e:'\u{1F50C}',
  uitleg:'Geen sleutel nie. Kyk hoe die drade flits, en tik hulle dan in dieselfde volgorde voor die alarm afgaan.',
  selfSub:'Jy draai self die drade · goeie werk haal tot 6% van die risiko af',
  vinnigSub:'Jy trek drade tot die enjin vat · die risiko bly min of meer dieselfde',
  begin:function(o){
    var volg = skommel([0,1,2,3,4]).slice(0, DRAAD_LENGTE);
    md = {klaar:o.klaar, volg:volg, pos:0, foute:0, wys:true};
    o.paneel.innerHTML = mdRaam(AANSKAKEL, '<div class="md-drade">' + DRADE.map(function(d, i){
      return '<button class="md-draad" id="md-d' + i + '" style="--k:' + d.k + '" onclick="draadTik(' + i + ')">' +
        '<span></span>' + d.n + '</button>';
    }).join('') + '</div><div class="md-tydbalk"><div id="md-tyd"></div></div>', 'Drade');
    el('ms-chips').textContent = '0/' + DRAAD_LENGTE;
    msBoods('Kyk mooi…');
    var i = 0;
    md.tik = setInterval(function(){
      DRADE.forEach(function(d, j){ el('md-d'+j).classList.remove('flits'); });
      if(i < volg.length*2){ if(i%2===0) el('md-d'+volg[i/2]).classList.add('flits'); i++; return; }
      clearInterval(md.tik); md.wys = false; md.begin = Date.now();
      msBoods('Nou jy!');
      md.tik = setInterval(function(){
        var oor = 1 - (Date.now()-md.begin)/DRAAD_TYD;
        el('md-tyd').style.width = Math.max(0, oor*100) + '%';
        if(oor <= 0){ msBoods('Die alarm gaan af! Jy ry net so weg.','sleg');
          var q = draadQ(md.foute, false, 1, md.pos); mdStop(); setTimeout(function(){ mdKlaar(q); }, 900); }
      }, 50);
    }, 380);
  },
  stapWeg:function(){ if(md) mdKlaar(0.1); },
  vinnig:function(){ return mdVinnig('Jy het drade getrek tot die enjin gevat het.'); }
};
function draadTik(i){
  if(!md || md.wys || !md.tik) return;
  if(md.volg[md.pos]===i){
    el('md-d'+i).classList.add('reg'); md.pos++;
    el('ms-chips').textContent = md.pos + '/' + DRAAD_LENGTE;
    if(md.pos >= md.volg.length){
      var q = draadQ(md.foute, true, (Date.now()-md.begin)/DRAAD_TYD, md.pos);
      msBoods('Die enjin vat! Ry!','goed'); mdStop(); setTimeout(function(){ mdKlaar(q); }, 600);
    }
  } else {
    md.foute++;
    if(md.foute >= DRAAD_FOUTE){ msBoods('’n Vonk, en die alarm gaan af!','sleg');
      var q2 = draadQ(md.foute, false, 1, md.pos); mdStop(); setTimeout(function(){ mdKlaar(q2); }, 900); return; }
    msBoods('Vonk! Verkeerde draad.','sleg');
  }
}

/* ---------- Die kluis se draaiskyf (bankroof) ---------- */
/* Drie getalle van 0 tot 39. Die stetoskoop sê hoe naby jy is; by
   "KLIK" druk jy "Hou hier". Hoe vinniger, hoe meer kry julle uit die
   kluis voor die polisie daar is. 'n Verkeerde "Hou hier" kos tyd. */
var KLUIS_TYD = 40000, KLUIS_STRAF = 3000;
function kluisAfstand(a, b){ var d = Math.abs(a-b) % 40; return Math.min(d, 40-d); }
function kluisQ(gevind, oorDeel){ return gevind>=3 ? 0.5 + 0.5*oorDeel : 0.15*gevind; }
var KLUIS = {
  id:'kluis', n:'Die kluis', e:'\u{1F512}',
  uitleg:'Draai die skyf en luister: by “KLIK” is jy op die regte getal. Drie getalle. Hoe vinniger jy is, hoe meer kry julle uit die kluis.',
  selfSub:'Jy kraak self die kluis · vinnig werk gee meer buit en minder risiko',
  vinnigSub:'Jy draai tot dit oopgaan · gemiddelde buit, die risiko bly dieselfde',
  begin:function(o){
    md = {klaar:o.klaar, kode:[R(40), R(40), R(40)], idx:0, w:0, begin:Date.now(), straf:0};
    o.paneel.innerHTML = mdRaam(KLUIS, '<div class="md-skyf"><div class="md-wys" id="md-wys"></div>'+
      '<div class="md-getal" id="md-getal">0</div></div>'+
      '<div class="md-steto"><div id="md-steto"></div></div><div class="md-gehoor" id="md-gehoor"></div>'+
      '<div class="md-tydbalk"><div id="md-tyd"></div></div>', 'Getalle');
    el('ms-beheer').innerHTML = '<div class="ms-ry">' + [-5,-1,1,5].map(function(x){
      return '<button class="knop grys" onclick="kluisDraai(' + x + ')">' + (x>0?'+':'−') + Math.abs(x) + '</button>';
    }).join('') + '</div><button class="knop groen md-groot" onclick="kluisHou()">Hou hier</button>';
    kluisTeken(); msBoods('Luister na die skyf.');
    md.tik = setInterval(function(){
      var oor = 1 - (Date.now()-md.begin+md.straf)/KLUIS_TYD;
      el('md-tyd').style.width = Math.max(0, oor*100) + '%';
      if(oor <= 0){ msBoods('Die sirenes! Julle gryp wat in die laaie is en hardloop.','sleg');
        var q = kluisQ(md.idx, 0); mdStop(); setTimeout(function(){ mdKlaar(q); }, 900); }
    }, 50);
  },
  stapWeg:function(){ if(md) mdKlaar(kluisQ(md.idx, 0)); },
  vinnig:function(){ return mdVinnig('Jy het die skyf gedraai tot die kluis oopgegaan het.'); }
};
function kluisTeken(){
  el('ms-chips').textContent = md.idx + '/3';
  el('md-getal').textContent = md.w;
  el('md-wys').style.transform = 'rotate(' + (md.w*9) + 'deg)';
  var d = kluisAfstand(md.w, md.kode[md.idx]);
  el('md-steto').style.width = Math.max(4, 100 - d*5) + '%';
  el('md-gehoor').textContent = d===0 ? '\u{1F50A} KLIK' : d<=2 ? 'Warm… baie naby' : d<=6 ? 'Lou' : 'Stil';
}
function kluisDraai(x){ if(!md || !md.tik) return; md.w = (md.w + x + 40) % 40; kluisTeken(); }
function kluisHou(){
  if(!md || !md.tik) return;
  if(md.w===md.kode[md.idx]){
    md.idx++;
    if(md.idx >= 3){
      var q = kluisQ(3, Math.max(0, 1 - (Date.now()-md.begin+md.straf)/KLUIS_TYD));
      el('ms-chips').textContent = '3/3';
      msBoods('Die kluis swaai oop!','goed'); mdStop(); setTimeout(function(){ mdKlaar(q); }, 700); return;
    }
    msBoods('Getal ' + md.idx + ' sit.','goed'); kluisTeken();
  } else { md.straf += KLUIS_STRAF; msBoods('Verkeerd. Dit kos jou tyd.','sleg'); }
}

/* ---------- Sakkerollery-timing ---------- */
/* Die slagoffer se aandag dwaal op en af. Gryp as dit laag (groen) is.
   Drie grepe; twee keer betrap, en hy hardloop weg. */
var SAK_GREPE = 3, SAK_FOUTE = 2, SAK_TYD = 15000, SAK_DREMPEL = 35;
function sakQ(grepe, foute){ return Math.max(0, Math.min(1, grepe/SAK_GREPE - foute*0.2)); }
var SAKKE = {
  id:'sak', n:'Die greep', e:'\u{1F91A}',
  uitleg:'Hou die meter dop: gryp as die slagoffer se aandag in die groen is. Drie grepe; word jy twee keer gevoel, is dit verby.',
  selfSub:'Jy kies self die oomblik · goeie timing gee meer buit en minder risiko',
  vinnigSub:'Jy gryp en loop · gemiddelde buit, die risiko bly dieselfde',
  begin:function(o){
    md = {klaar:o.klaar, a:60, doel:60, grepe:0, foute:0, begin:Date.now(), wissel:0};
    o.paneel.innerHTML = mdRaam(SAKKE, '<div class="md-slagoffer">\u{1F9CD}</div>'+
      '<div class="md-aandag"><div class="md-groen" style="width:' + SAK_DREMPEL + '%"></div>'+
      '<div class="md-merk" id="md-merk"></div></div><div class="md-gehoor">Aandag</div>'+
      '<div class="md-tydbalk"><div id="md-tyd"></div></div>', 'Grepe');
    el('ms-beheer').innerHTML = '<button class="knop groen md-groot" onclick="sakGryp()">Gryp!</button>';
    el('ms-chips').textContent = '0/' + SAK_GREPE;
    msBoods('Wag vir jou oomblik.');
    md.tik = setInterval(function(){
      /* Die aandag swaai na 'n nuwe doel elke 0,5-1,3 sekondes. */
      if(--md.wissel <= 0){ md.doel = R(101); md.wissel = 10 + R(16); }
      md.a += (md.doel - md.a)*0.14;
      el('md-merk').style.left = md.a + '%';
      var oor = 1 - (Date.now()-md.begin)/SAK_TYD;
      el('md-tyd').style.width = Math.max(0, oor*100) + '%';
      if(oor <= 0){ msBoods('Die skare beweeg aan.',''); var q = sakQ(md.grepe, md.foute); mdStop();
        setTimeout(function(){ mdKlaar(q); }, 700); }
    }, 50);
  },
  stapWeg:function(){ if(md) mdKlaar(sakQ(md.grepe, md.foute)); },
  vinnig:function(){ return mdVinnig('Jy het gegryp en in die skare verdwyn.'); }
};
function sakGryp(){
  if(!md || !md.tik || Date.now() < (md.wag||0)) return;
  md.wag = Date.now() + 450;    /* jy kan nie die knoppie net druk-druk-druk nie */
  if(md.a < SAK_DREMPEL){
    md.grepe++; el('ms-chips').textContent = md.grepe + '/' + SAK_GREPE;
    msBoods(['Die beursie!','Die foon!','Die horlosie!'][md.grepe-1] || 'Nog iets!','goed');
    md.doel = 70 + R(30); md.wissel = 15;
  } else {
    md.foute++; msBoods('Hy het iets gevoel!','sleg');
    md.doel = 100; md.wissel = 20;
  }
  if(md.grepe >= SAK_GREPE || md.foute >= SAK_FOUTE){
    var q = sakQ(md.grepe, md.foute); mdStop(); setTimeout(function(){ mdKlaar(q); }, 700); }
}

/* ---------- Die jaagtog ---------- */
/* Drie bane; hindernisse kom van voor af. Tik links of regs om uit te
   swaai. 'n Vinniger motor het 'n beter kans, maar die pad kom ook
   vinniger op jou af. q is hoeveel van die hindernisse jy ontwyk het. */
var JAAG_HINDERNIS = 14;
var JAAG_DINGE = ['\u{1F6A7}','\u{1F697}','\u{1F69A}','\u{1F404}','\u{1F6A7}'];
var JAAGTOG = {
  id:'jaag', n:'Jaagtog', e:'\u{1F6A8}', spoed:160,
  uitleg:'Swaai uit vir die hindernisse: tik links of regs. Hoe minder jy raakry, hoe beter jou kans om die polisie af te skud.',
  selfSub:'Jy bestuur self · sonder ’n fout is jou kans ’n kwart beter',
  vinnigSub:'Jy trap net die petrol · jou kans hang net van die motor af',
  begin:function(o){
    md = {klaar:o.klaar, baan:1, dinge:[], gestuur:0, raak:0, verby:0, tel:0,
      v:1.1 + JAAGTOG.spoed/260};
    o.paneel.innerHTML = mdRaam(JAAGTOG, '<div class="md-pad" id="md-pad" onclick="jaagTikPad(event)">'+
      '<div class="md-lyn" style="left:33.3%"></div><div class="md-lyn" style="left:66.6%"></div>'+
      '<div class="md-ek" id="md-ek">\u{1F697}</div><div class="md-polisie">\u{1F693}</div></div>', 'Ontwyk');
    el('ms-beheer').innerHTML = '<div class="ms-ry"><button class="knop grys md-groot" onclick="jaagSwaai(-1)">◀ Links</button>'+
      '<button class="knop grys md-groot" onclick="jaagSwaai(1)">Regs ▶</button></div>';
    jaagTeken(); msBoods(JAAGTOG.spoed + ' km/h — swaai uit!');
    md.tik = setInterval(jaagTik, 30);
  },
  stapWeg:function(){ if(md) mdKlaar(md.verby/JAAG_HINDERNIS*0.5); },
  vinnig:function(){ return mdVinnig('Jy het jou voet plat op die petrol gehou.'); }
};
function jaagTeken(){
  el('ms-chips').textContent = md.verby + '/' + JAAG_HINDERNIS;
  el('md-ek').style.left = (md.baan*33.33 + 16.66) + '%';
}
function jaagSwaai(r){ if(!md || !md.tik) return; md.baan = Math.max(0, Math.min(2, md.baan + r)); jaagTeken(); }
function jaagTikPad(e){
  var pad = el('md-pad'); if(!pad) return;
  var b = pad.getBoundingClientRect();
  jaagSwaai(e.clientX - b.left < b.width/2 ? -1 : 1);
}
function jaagTik(){
  md.tel++;
  /* Elke ~0,8 sekonde 'n nuwe hindernis, in 'n baan wat nie altyd joune is nie. */
  if(md.gestuur < JAAG_HINDERNIS && md.tel % 26 === 0){
    var d = document.createElement('div');
    d.className = 'md-ding'; d.textContent = kies(JAAG_DINGE);
    var baan = R(3);
    d.style.left = (baan*33.33 + 16.66) + '%';
    el('md-pad').appendChild(d);
    md.dinge.push({baan:baan, y:-8, el:d, klaar:false});
    md.gestuur++;
  }
  md.dinge.forEach(function(x){
    if(x.klaar) return;
    x.y += md.v; x.el.style.top = x.y + '%';
    if(x.y >= 74 && x.y <= 86 && x.baan===md.baan){
      x.klaar = true; md.raak++; x.el.classList.add('raak');
      setTimeout(function(){ x.el.remove(); }, 400);
      msBoods('Bam! Jy verloor spoed.','sleg');
    } else if(x.y > 86){ x.klaar = true; md.verby++; x.el.remove(); jaagTeken(); }
  });
  if(md.gestuur >= JAAG_HINDERNIS && md.dinge.every(function(x){ return x.klaar; })){
    var q = md.verby/JAAG_HINDERNIS;
    msBoods(q >= 0.85 ? 'Skoon gery! Die afrit is voor jou…' : 'Die afrit is voor jou…', q>=0.85?'goed':'');
    mdStop(); setTimeout(function(){ mdKlaar(q); }, 700);
  }
}

var MD_SPELE = {slot:SLOTOOP, aanskakel:AANSKAKEL, kluis:KLUIS, sak:SAKKE};
