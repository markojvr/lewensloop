/* ==========================================================================
   8. UITLEG
   Bou die HTML vir elke tab. Hierdie lêer verander net hoe dinge lyk,
   nooit wat die spel doen nie.
   ========================================================================== */

var TABS=[
  {id:'lewe', n:'Lewe', i:'\u{1F9EC}'}, {id:'akt', n:'Aktiwiteite', i:'\u{1F3AF}'},
  {id:'werk', n:'Werk', i:'\u{1F4BC}'}, {id:'mense', n:'Mense', i:'\u{1F49E}'},
  {id:'bates', n:'Bates', i:'\u{1F3E1}'}
];
var IKONE={goed:'✨', sleg:'\u{1F4A5}', geld:'\u{1F4B0}', skool:'\u{1F4D8}',
  liefde:'\u{1F496}', misdaad:'\u{1F6A8}', werk:'\u{1F4BC}', neutraal:'•'};

function veilig(t){ return String(t).replace(/[<>&"]/g,''); }
function bar(naam, waarde, kleur){
  return '<div class="stat"><b><span>'+naam+'</span><span>'+waarde+'</span></b>'+
    '<div class="baan"><div class="vul" style="width:'+waarde+'%;background:'+kleur+'"></div></div></div>';
}
function statusLyn(){
  if(!s.lewe) return 'Oorlede';
  if(s.tronk) return 'In die tronk (' + (s.tronk.jare - s.tronk.gedien) + ' jaar oor)';
  if(s.beroep) return beroepTitel();
  if(s.skool.vlak==='universiteit'||s.skool.vlak==='nagraads') return 'Student: ' + s.skool.studie;
  if(s.skool.vlak==='laerskool'||s.skool.vlak==='hoerskool') return 'Graad ' + s.skool.graad;
  if(s.skool.vlak==='kleuterskool') return 'Kleuterskool';
  if(s.afgetree) return 'Op pensioen';
  if(s.ouderdom<6) return 'Kleinding';
  return 'Werkloos';
}
function renderKop(){
  el('kop').innerHTML =
    '<div class="kop-ry"><div class="groei"><div class="kop-naam">' + veilig(s.naam+' '+s.van) + '</div>'+
    '<div class="kop-sub">' + s.ouderdom + ' jaar · ' + s.dorp + ' · ' + statusLyn() + '</div></div>'+
    '<div class="kop-geld' + (s.geld<0?' skuld':'') + '">' + kortGeld(s.geld) + '<small>Kontant</small></div></div>'+
    '<div class="statte">' +
      bar('Geluk', s.geluk, 'var(--geel)') + bar('Gesondheid', s.gesondheid, 'var(--groen)') +
      bar('Slim', s.slim, 'var(--blou)') + bar('Voorkoms', s.voorkoms, 'var(--pienk)') +
    '</div>';
}
function renderBalk(){
  el('balk').innerHTML = TABS.map(function(t){
    return '<button class="' + (s.tab===t.id?'aktief':'') + '" onclick="gaanTab(\'' + t.id + '\')">'+
      '<i>' + t.i + '</i>' + t.n + '</button>';
  }).join('');
}
function gaanTab(id){ s.tab=id; renderAlles();
  if(id==='lewe') naOnder(); else el('blad').scrollTop = 0; }
function naOnder(){ var b=el('blad'); b.scrollTop = b.scrollHeight; }

/* ---------- Lewe ---------- */
function renderLewe(){
  var h = '';
  s.log.forEach(function(r){
    if(r.k==='jaar'){ h += '<div class="jaarlyn">' + veilig(r.t) + '</div>'; }
    else h += '<div class="ins ' + r.k + '"><span class="i">' + (IKONE[r.k]||'•') + '</span>'+
      '<span>' + veilig(r.t) + '</span></div>';
  });
  return h || '<div class="kaart mid klein">Jou lewe begin nou.</div>';
}

/* ---------- Aktiwiteite ---------- */
function renderAkt(){
  var h = '';
  if(s.tronk){
    h += '<div class="titel">Tronklewe</div>';
    h += '<div class="kaart"><div class="hoof">Jaar ' + s.tronk.gedien + ' van ' + s.tronk.jare + '</div>'+
      '<div class="klein">Jy kan nie werk of studeer terwyl jy hier is nie.</div>'+
      '<button class="knop grys" onclick="tronkAksie(\'oefen\')">Oefen in die gym</button>'+
      '<button class="knop grys" onclick="tronkAksie(\'lees\')">Lees in die biblioteek</button>'+
      '<button class="knop grys" onclick="tronkAksie(\'vriende\')">Maak vriende in jou blok</button>'+
      '<button class="knop rooi" onclick="tronkAksie(\'ontsnap\')">Probeer ontsnap</button></div>';
    return h;
  }
  var groepe = [];
  AKTIWITEITE.forEach(function(a){ if(groepe.indexOf(a.g)<0) groepe.push(a.g); });
  groepe.forEach(function(g){
    var lys = AKTIWITEITE.filter(function(a){ return a.g===g && (!a.as || a.as()); });
    if(!lys.length) return;
    h += '<div class="titel">' + g + '</div>';
    lys.forEach(function(a){
      var klaar = a.maks && (s.gedoen[a.id]||0) >= a.maks;
      var jonk  = s.ouderdom < a.min;
      var kind  = s.ouderdom < 18 && lewendeOuers().length > 0;
      var arm   = !a.vloei && a.koste && s.geld < a.koste && !kind;
      var onder = a.kosteTeks || (a.koste ? geld(a.koste) : 'Gratis');
      if(a.koste && kind && !a.kosteTeks) onder += ' \u00b7 jy kan jou ouers vra';
      if(jonk) onder += ' \u00b7 ouderdom ' + a.min + '+';
      h += '<div class="kaart klik" onclick="doenAkt(\'' + a.id + '\')"><div class="ry">'+
        '<div class="emo">' + a.e + '</div><div class="groei"><div class="hoof">' + a.n + '</div>'+
        '<div class="klein">' + onder + '</div></div>'+
        '<div class="regs">' + (klaar ? '<span class="merkie">GEDOEN</span>' :
          jonk ? '\u{1F512}' : arm ? '<span class="slot">te duur</span>' : '\u276F') + '</div></div></div>';
    });
  });
  /* Troeteldiere */
  h += '<div class="titel">Troeteldiere</div>';
  h += '<div class="kaart klik" onclick="wysTroeteldierwinkel()"><div class="ry">'+
    '<div class="emo">\u{1F43E}</div><div class="groei"><div class="hoof">Gaan troeteldierwinkel toe</div>'+
    '<div class="klein">' + ((s.diere||[]).length ? 'Jy het ' + s.diere.length + ' dier(e) \u00b7 ' : '') +
    'kyk onder Mense om met hulle te speel</div></div><div class="regs">\u276F</div></div></div>';
  /* Liefde */
  h += '<div class="titel">Liefde</div>';
  h += '<div class="kaart klik" onclick="soekLief()"><div class="ry"><div class="emo">\u{1F495}</div>'+
    '<div class="groei"><div class="hoof">Soek iemand om uit te vra</div>'+
    '<div class="klein">' + (s.ouderdom<15 ? 'Ouderdom 15+' : maat() ? 'Jy is al in \u2019n verhouding' :
      'Begin by mense wat jy ken') + '</div></div><div class="regs">\u276F</div></div></div>';
  /* Misdaad */
  h += '<div class="titel">Misdaad</div>';
  if(s.ouderdom<12){
    h += '<div class="kaart klein">Jy is nog te jonk vir die onderwereld.</div>';
  } else {
    MISDADE.forEach(function(m){
      var gedaan = (s.gedoen['md_'+m.id]||0)>=2;
      h += '<div class="kaart klik" onclick="doenMisdaad(\'' + m.id + '\')"><div class="ry">'+
        '<div class="emo">' + m.e + '</div><div class="groei"><div class="hoof">' + m.n + '</div>'+
        '<div class="klein">' + m.teikens.length + ' teikens' + (m.voertuig?' \u00b7 jy kies die ontsnapvoertuig':'') +
        (m.maat?' \u00b7 jy kan iemand saamvat':'') + '</div></div>'+
        '<div class="regs">' + (gedaan?'<span class="merkie">GENOEG</span>':'\u276F') + '</div></div></div>';
    });
  }
  return h;
}

/* ---------- Pensioen (B17) ---------- */
function renderPensioen(){
  var fonds = s.pensioenFonds||0, koers = s.pensioenKoers||0;
  var h = '<div class="titel">Pensioen</div>';
  h += '<div class="kaart"><div class="ry"><div class="emo">\u{1F3D6}</div><div class="groei">'+
    '<div class="hoof">Jou pensioenfonds</div><div class="klein">'+
    (fonds>0 ? 'Dit sou nou ' + geld(Math.round(fonds*ANNUITEIT_TREK)) + ' per jaar betaal.'
      : 'Jy het nog niks bygedra nie. Elke jaar wat jy wag, kos jou groei.') +
    '</div></div><div class="regs" style="font-size:16px;color:var(--groen)">' +
    kortGeld(fonds) + '</div></div>';
  if(s.beroep){
    h += '<div class="klein" style="margin-top:8px">Jy dra ' + persent(koers*100) +
      '% by; jou werkgewer pas dit tot ' + persent(PENSIOEN_WERKGEWER*100) + '%. '+
      'Die bydrae is belastingaftrekbaar.</div><div class="knoppe">'+
      PENSIOEN_KEUSES.map(function(k){
        return '<button class="knop klein2' + (k===koers?'':' grys') + '" onclick="stelPensioenKoers(' +
          k + ')">' + persent(k*100) + '%</button>';
      }).join('') + '</div>';
  } else if(fonds>0){
    h += '<div class="klein" style="margin-top:8px">Die fonds bly joune en groei verder, ook '+
      'sonder \u2019n werk. Trek jy dit nou uit, vat SARS die grootste deel.</div>'+
      '<button class="knop klein2 rooi" onclick="trekPensioenUit()">Trek die fonds uit</button>';
  }
  if(s.ouderdom>=VROEG_AFTREE)
    h += '<button class="knop klein2 groen" onclick="wysAftrede()">Tree af' +
      (s.ouderdom<AFTREE_OUDERDOM ? ' (vroeg)' : '') + '</button>';
  else if(s.ouderdom>=45)
    h += '<div class="klein" style="margin-top:8px">Jy kan van ' + VROEG_AFTREE +
      ' af aftree, met of sonder \u2019n werk.</div>';
  return h + '</div>';
}

/* ---------- Werk ---------- */
function renderWerk(){
  var h = '';
  h += '<div class="titel">Jou werk</div>';
  if(s.beroep){
    var b = s.beroep;
    h += '<div class="kaart"><div class="ry"><div class="emo">\u{1F4BC}</div><div class="groei">'+
      '<div class="hoof">' + beroepTitel() + '</div><div class="klein">' + b.k + ' · ' + b.jare +
      ' jaar in die pos</div></div><div class="regs">' + kortGeld(b.salaris) + '<br><span class="klein">per jaar</span></div></div>'+
      '<div class="statte" style="margin-top:10px">' + bar('Prestasie', b.prestasie, 'var(--pers)') + '</div>'+
      '<div class="knoppe"><button class="knop klein2" onclick="werkAksie(\'harder\')">Werk harder</button>'+
      '<button class="knop klein2 groen" onclick="werkAksie(\'verhoging\')">Vra verhoging</button></div>'+
      '<div class="knoppe"><button class="knop klein2 grys" onclick="werkAksie(\'bedank\')">Bedank</button>'+
      '</div></div>';
  } else if(s.afgetree){
    h += '<div class="kaart"><div class="hoof">Op pensioen</div>'+
      '<div class="klein">Jou lewende annuiteit betaal ' + geld(s.pensioen) + ' per jaar uit \u2019n ' +
      'fonds van ' + geld(s.pensioenFonds||0) + '.</div></div>';
  } else if(s.skool.vlak==='laerskool' || s.skool.vlak==='hoerskool'){
    /* A15 — solank jy op skool is, is voltydse werk toe. */
    h += '<div class="kaart"><div class="hoof">Nog op skool</div><div class="klein">'+
      'Jy is in Graad ' + s.skool.graad + '. Voltydse werk moet wag tot jy die skool '+
      'klaargemaak het, of dit verlaat (jy mag van 16 af).</div></div>';
  } else {
    h += '<div class="kaart"><div class="hoof">Werkloos</div><div class="klein">'+
      'Doen aansoek vir ’n werk hieronder. Jy kry drie onderhoude per jaar (' +
      (3-s.aansoeke) + ' oor).</div></div>';
  }
  /* B17 — pensioen: wat in die fonds is, wat jy bydra, en aftrede. */
  if(s.ouderdom>=18 && !s.afgetree) h += renderPensioen();

  /* Opleiding */
  h += '<div class="titel">Opleiding</div>';
  var sk = s.skool, opl = '';
  if(sk.vlak==='universiteit'||sk.vlak==='nagraads')
    opl = sk.studie + ' by ' + (s.uni?s.uni.n:'die universiteit') + ' — ' + sk.jareOor + ' jaar oor';
  else if(sk.vlak==='laerskool'||sk.vlak==='hoerskool') opl = 'Graad ' + sk.graad;
  else if(sk.matriek) opl = 'Matriek geslaag (' + sk.punte + '%)';
  else if(sk.uit) opl = 'Skool verlaat in Graad ' + sk.graad;
  else opl = 'Nog geen kwalifikasie';
  h += '<div class="kaart"><div class="hoof">' + opl + '</div>';
  if(sk.grade.length) h += '<div class="klein">Grade: ' + sk.grade.join(', ') + '</div>';
  if(sk.nagraads.length) h += '<div class="klein">Nagraads: ' + sk.nagraads.join(', ') + '</div>';
  if(s.rekord.length) h += '<div class="slot">Kriminele rekord: ' + s.rekord.join(', ') + '</div>';
  if(sk.matriek && sk.vlak!=='universiteit' && sk.vlak!=='nagraads')
    h += '<button class="knop" onclick="wysStudies()">Skryf in by universiteit</button>';
  if(sk.grade.length && sk.vlak!=='universiteit' && sk.vlak!=='nagraads')
    h += '<button class="knop grys" onclick="wysNagraads()">Nagraadse studie</button>';
  if(sk.vlak==='hoerskool'||sk.vlak==='universiteit'||sk.vlak==='nagraads')
    h += '<button class="knop rooi" onclick="losSkool()">Los die skool/studies</button>';
  h += '</div>';
  /* Vakante poste */
  h += '<div class="titel">Vakante poste</div>';
  var oop=[], toe=[];
  BEROEPE.forEach(function(j){ (werkVereis(j) ? toe : oop).push(j); });
  oop.sort(function(a,b){ return b.s - a.s; });
  toe.sort(function(a,b){ return a.s - b.s; });
  oop.forEach(function(j){
    h += '<div class="kaart klik" onclick="doenAansoek(\'' + j.id + '\')"><div class="ry">'+
      '<div class="emo">\u{1F4C4}</div><div class="groei"><div class="hoof">' + j.t + '</div>'+
      '<div class="klein">' + j.k + '</div></div>'+
      '<div class="regs">' + kortGeld(j.s) + '<br><span class="klein">p/j</span></div></div></div>';
  });
  toe.forEach(function(j){
    h += '<div class="kaart" style="opacity:.55"><div class="ry">'+
      '<div class="emo">\u{1F512}</div><div class="groei"><div class="hoof">' + j.t + '</div>'+
      '<div class="slot">' + werkVereis(j) + '</div></div>'+
      '<div class="regs">' + kortGeld(j.s) + '</div></div></div>';
  });
  return h;
}

/* ---------- Mense ---------- */
function persoonKaart(v){
  return '<div class="kaart klik" onclick="oopPersoon(' + v.id + ')"><div class="ry">'+
    '<div class="emo">' + emoVan(v) + '</div><div class="groei">'+
    '<div class="hoof">' + veilig(v.naam + ' ' + v.van) + '</div>'+
    '<div class="klein">' + rol(v) + ' \u00b7 ' + v.ouderdom + ' jaar</div>'+
    '<div class="baan" style="margin-top:5px"><div class="vul" style="width:' + v.band +
    '%;background:var(--pienk)"></div></div></div>'+
    '<div class="regs">' + v.band + '%</div></div></div>';
}
function renderMense(){
  var h = '', enige = false;
  var groepe = [
    {t:'Liefde', tipes:['eggenoot','lief']},
    {t:'Gesin', tipes:['ma','pa','broer','suster','seun','dogter']},
    {t:'Vriende', tipes:['vriend']},
    {t:'By die skool', tipes:['klasmaat']},
    {t:'By die werk', tipes:['baas','kollega']}
  ];
  groepe.forEach(function(g){
    var lys = s.verhoudings.filter(function(v){ return v.lewe && g.tipes.indexOf(v.tipe)>=0; });
    if(!lys.length) return;
    enige = true;
    lys.sort(function(a,b){ return b.band - a.band; });
    h += '<div class="titel">' + g.t + '</div>';
    lys.forEach(function(v){ h += persoonKaart(v); });
  });
  if(!enige) h += '<div class="kaart klein">Jy is heeltemal alleen.</div>';
  if(!maat() && s.ouderdom>=15)
    h += '<button class="knop pienk" onclick="soekLief()">Soek iemand om uit te vra</button>';

  h += '<div class="titel">Troeteldiere</div>';
  if(!(s.diere||[]).length){
    h += '<div class="kaart klein">Jy het nog geen troeteldier nie. Gaan kyk by die ' +
      'troeteldierwinkel onder Aktiwiteite.</div>';
  } else {
    s.diere.forEach(function(d){
      h += '<div class="kaart klik" onclick="oopTroeteldier(\'' + d.id + '\')"><div class="ry">'+
        '<div class="emo">' + d.e + '</div><div class="groei">'+
        '<div class="hoof">' + veilig(d.naam) + '</div>'+
        '<div class="klein">' + d.soort + ' \u00b7 ' + d.ouderdom + ' jaar \u00b7 ' +
        geld(d.onderhoud) + ' per jaar</div>'+
        '<div class="baan" style="margin-top:5px"><div class="vul" style="width:' + d.band +
        '%;background:var(--geel)"></div></div></div>'+
        '<div class="regs">' + d.band + '%</div></div></div>';
    });
  }

  var dood = s.verhoudings.filter(function(v){ return !v.lewe; });
  if(dood.length){
    h += '<div class="titel">In geheue</div>';
    dood.forEach(function(v){
      h += '<div class="kaart" style="opacity:.5"><div class="ry"><div class="emo">\u{1F56F}</div>'+
        '<div class="groei"><div class="hoof">' + veilig(v.naam) + '</div>'+
        '<div class="klein">' + rol(v) + ' \u00b7 oorlede op ' + v.ouderdom + '</div></div></div></div>';
    });
  }
  return h;
}

/* ---------- Bates ---------- */
/* B1 — waar jy bly: by jou ouers, in 'n huurplek of in jou eie huis. */
function renderBlyplek(){
  var h = '<div class="titel">Waar jy bly</div>';
  if(s.ouderdom<18)
    return h + '<div class="kaart klein">Jy bly by jou ouers. Van 18 af kies jy self.</div>';
  if(hetHuis())
    return h + '<div class="kaart"><div class="hoof">Jou eie huis</div><div class="klein">'+
      'Jy betaal geen huur nie \u2014 net die verband, die erfbelasting en die herstelwerk.'+
      '</div></div>';
  var ouers = lewendeOuers().length;
  h += '<div class="kaart' + (s.blyplek==='ouers'?'':' klik') + '"' +
    (s.blyplek==='ouers'?'':' onclick="kiesBlyplek(\'ouers\')"') +
    ' style="' + (ouers?'':'opacity:.55') + '"><div class="ry"><div class="emo">\u{1F46A}</div>'+
    '<div class="groei"><div class="hoof">By jou ouers</div><div class="klein">'+
    (ouers ? geld(Math.round(OUERHUIS_MAAND*12*dorpFaktor())) + ' per jaar as jy verdien' +
        (s.ouderdom>=25 ? ' \u00b7 dit kos jou geluk op jou ouderdom' : '')
      : 'Daar is niemand meer in die ouerhuis nie') +
    '</div></div><div class="regs">' + (s.blyplek==='ouers'?'<span class="merkie">HIER</span>':'\u276F') +
    '</div></div></div>';
  HUURPLEKKE.forEach(function(p){
    var hier = s.blyplek==='huur' && s.huurPlek===p.id;
    h += '<div class="kaart' + (hier?'':' klik') + '"' +
      (hier?'':' onclick="kiesBlyplek(\'' + p.id + '\')"') + '><div class="ry">'+
      '<div class="emo">\u{1F511}</div><div class="groei"><div class="hoof">' + p.n + '</div>'+
      '<div class="klein">' + p.sub + '</div></div><div class="regs">' +
      (hier ? '<span class="merkie">HIER</span>' : kortGeld(huurPerJaar(p.id)) +
        '<br><span class="klein">per jaar</span>') + '</div></div></div>';
  });
  return h;
}
/* B2 — die verband: wat nog uitstaan, wat dit per jaar kos, en hoeveel
   jaar jy afsny as jy ekstra inbetaal. */
function renderBond(){
  var b = s.bond;
  if(!b) return '';
  var jare = bondJareOor();
  return '<div class="titel">Jou verband</div>'+
    '<div class="kaart"><div class="ry"><div class="emo">\u{1F3E6}</div><div class="groei">'+
    '<div class="hoof">Nog ' + geld(b.saldo) + ' uitstaande</div><div class="klein">'+
    geld(b.paaiement) + ' per jaar \u00b7 ' + persent(b.koers*100) + '% rente \u00b7 ' +
    (jare>=99 ? 'dit kom nooit af teen hierdie paaiement nie' : 'ongeveer ' + jare + ' jaar oor') +
    (b.agter ? ' \u00b7 ' + b.agter + ' jaar agter' : '') + '</div></div>'+
    '<div class="regs">' + kortGeld(-b.saldo) + '</div></div>'+
    '<div class="klein" style="margin-top:8px">Jy het al ' + geld(b.renteBetaal||0) +
    ' rente betaal. Elke rand wat jy ekstra inbetaal, sny rente af.</div>'+
    '<div class="knoppe"><button class="knop klein2" onclick="betaalEkstraBond(25000)">R25k ekstra</button>'+
    '<button class="knop klein2" onclick="betaalEkstraBond(100000)">R100k ekstra</button>'+
    '<button class="knop klein2 grys" onclick="betaalEkstraBond(\'alles\')">Alles</button></div></div>';
}
function renderBates(){
  var h = '';
  h += '<div class="titel">Finansies</div>';
  h += '<div class="kaart"><div class="ry"><div class="groei"><div class="hoof">Netto waarde</div>'+
    '<div class="klein">Kontant ' + geld(s.geld) + ' \u00b7 spaar ' + geld(s.spaar||0) +
    ' \u00b7 beleggings ' + geld(s.belegging) +
    (s.pensioenFonds ? ' \u00b7 pensioen ' + geld(s.pensioenFonds) : '') +
    (bondSkuld() ? ' \u00b7 verband -' + geld(bondSkuld()) : '') + '</div></div>'+
    '<div class="regs" style="font-size:16px;color:var(--groen)">' + kortGeld(netoWaarde()) + '</div></div></div>';
  if(s.swartlys>0) h += '<div class="kaart klein">Jy is by die kredietburo gelys \u2014 nog ' +
    s.swartlys + ' jaar. Geen bank sal jou \u2019n verband gee nie.</div>';
  /* B5 — geld in die tjekrekening verdien niks; geld in die spaarrekening wel. */
  h += '<div class="kaart"><div class="hoof">Spaarrekening</div>'+
    '<div class="klein">Balans: ' + geld(s.spaar||0) + ' \u00b7 ' + SPAAR_KOERS[0] + '\u2013' +
    SPAAR_KOERS[1] + '% rente per jaar. Geld in die tjekrekening groei glad nie.</div>'+
    '<div class="knoppe"><button class="knop klein2" onclick="naSpaar(10000)">Spaar R10k</button>'+
    '<button class="knop klein2" onclick="naSpaar(100000)">Spaar R100k</button>'+
    '<button class="knop klein2 grys" onclick="naSpaar(\'alles\')">Alles</button></div>'+
    '<button class="knop klein2 rooi" onclick="uitSpaar(\'alles\')">Trek alles uit</button></div>';
  h += renderBond();
  h += '<div class="kaart"><div class="hoof">JSE-indeksfonds</div>'+
    '<div class="klein">Waarde: ' + geld(s.belegging) + ' · historiese opbrengs -24% tot +34% per jaar</div>'+
    '<div class="knoppe"><button class="knop klein2" onclick="bele(10000)">Bele R10k</button>'+
    '<button class="knop klein2" onclick="bele(100000)">Bele R100k</button>'+
    '<button class="knop klein2 grys" onclick="bele(\'alles\')">Alles</button></div>'+
    '<button class="knop klein2 rooi" onclick="verkoopBelegging()">Verkoop alles</button></div>';
  h += renderBlyplek();
  h += '<div class="titel">Jou bates</div>';
  if(!s.bates.length) h += '<div class="kaart klein">Jy besit nog niks.</div>';
  s.bates.forEach(function(b, i){
    h += '<div class="kaart"><div class="ry"><div class="emo">' + b.e + '</div><div class="groei">'+
      '<div class="hoof">' + b.n + '</div><div class="klein">Huidige waarde: ' + geld(b.waarde) + '</div></div>'+
      '<div class="regs"><button class="knop klein2 grys" style="margin:0"'+
      ' onclick="verkoopBate(' + i + ')">Verkoop</button></div></div></div>';
  });
  h += '<div class="titel">Te koop</div>';
  TE_KOOP.forEach(function(b){
    var magRy = b.t!=='motor' || magBestuur();
    /* B2 — 'n huis kan jy met 'n verband koop, so dit tel as bekostigbaar
       sodra een van die verbandopsies deur die bank sou kom. */
    var metBond = b.t==='huis' && s.ouderdom>=18 && bondOpsies(b.p).some(function(o){ return !o.rede; });
    var kan = (s.geld >= b.p || metBond) && magRy;
    h += '<div class="kaart klik" onclick="koopBate(\'' + b.id + '\')" style="' + (kan?'':'opacity:.55') + '">'+
      '<div class="ry"><div class="emo">' + b.e + '</div><div class="groei"><div class="hoof">' + b.n + '</div>'+
      '<div class="klein">' + (b.t==='huis'?'Eiendom':b.t==='motor'?'Voertuig':'Luukse item') +
      (metBond ? ' \u00b7 verband vanaf ' + geld(Math.round(b.p*BOND_DEPOSITOS[0])) + ' deposito' : '') +
      (magRy ? '' : ' \u00b7 rylisensie nodig (18+)') + '</div></div>'+
      '<div class="regs">' + kortGeld(b.p) + '</div></div></div>';
  });
  return h;
}

function renderAlles(){
  if(!s) return;
  renderKop(); renderBalk();
  var h = '';
  if(s.tab==='lewe') h = renderLewe();
  else if(s.tab==='akt') h = renderAkt();
  else if(s.tab==='werk') h = renderWerk();
  else if(s.tab==='mense') h = renderMense();
  else h = renderBates();
  el('blad').innerHTML = h;
  el('verjaar').style.display = s.lewe ? 'flex' : 'none';
}
