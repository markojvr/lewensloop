/* ==========================================================================
   8. UITLEG
   Bou die HTML vir elke tab. Hierdie lêer verander net hoe dinge lyk,
   nooit wat die spel doen nie.
   ========================================================================== */

var TABS=[
  {id:'lewe', n:'Lewe', i:'\u{1F9EC}'}, {id:'akt', n:'Aktiwiteite', i:'\u{1F3AF}'},
  {id:'werk', n:'Werk', i:'\u{1F4BC}'}, {id:'mense', n:'Mense', i:'\u{1F49E}'},
  /* Fase 5 — die liggaam kry sy eie blad: siektes, die mediese fonds,
     drank/rook/dwelms en voorbehoeding. */
  {id:'gesond', n:'Gesond', i:'\u{1FA7A}'},
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
  if(s.dakloos) return 'Dakloos' + (s.dakloos.jare ? ' (jaar ' + s.dakloos.jare + ')' : '');
  if(s.beroep) return beroepTitel();
  /* H4 — wie sy eie ding loop, is nie werkloos nie. */
  if(s.besigheid) return 'Eienaar van ' + s.besigheid.naam;
  if(verslaaf()) return GEWOONTES.filter(function(g){
    return gewoonteVlak(g.id)>=3; })[0].vlakke[3];
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
/* B18 — die paneel wat net wys terwyl jy dakloos is, presies soos die
   tronkpaneel. Misdaad bly daaronder staan: dit is dikwels al wat oorbly. */
function renderDakloos(){
  var d = s.dakloos, uit = dakUitKoste();
  var h = '<div class="titel">Op straat</div>';
  h += '<div class="kaart"><div class="hoof">' + (d.jare ? 'Jaar ' + d.jare + ' sonder ’n dak'
      : 'Jou eerste maande sonder ’n dak') + '</div>'+
    '<div class="klein">Jy betaal geen huur of lewenskoste nie, maar elke jaar hier kos jou '+
    'gesondheid en geluk. Skool en studie is toe, en werk kry is swaar' +
    (d.ngo ? ' — die NGO se adres help darem' : ' sonder ’n adres') + '.</div>'+
    '<div class="klein" style="margin-top:6px">' +
    (s.geld<0 ? 'Jy is ' + geld(-s.geld) + ' in die skuld' : 'Jy het ' + geld(s.geld)) +
    '. ’n Verhuurder wil ' + geld(uit) + ' vooruit sien' +
    (s.geld>=uit ? ' — jy het genoeg!' : '.') + '</div>'+
    '<button class="knop grys" onclick="dakloosAksie(\'bedel\')">Bedel by die verkeerslig</button>'+
    '<button class="knop grys" onclick="dakloosAksie(\'loswerk\')">Soek los werk</button>'+
    '<button class="knop grys" onclick="dakloosAksie(\'skuiling\')">Slaap by ’n skuiling</button>'+
    (d.ngo ? '' : '<button class="knop groen" onclick="dakloosAksie(\'ngo\')">Meld by ’n NGO aan</button>')+
    '<button class="knop pienk" onclick="dakloosAksie(\'familie\')">Vra familie om hulp</button>'+
    (s.geld>=uit ? '<button class="knop groen" onclick="kiesBlyplek(\'' + dakTrappe()[0].id +
      '\')">Huur ’n ' + dakTrappe()[0].n.toLowerCase() + '</button>' : '') +
    '</div>';
  return h;
}
/* Die misdaadlys. Dit staan apart sodat die gewone blad en die
   dakloos-paneel albei dit kan wys. */
function renderMisdaad(){
  var h = '<div class="titel">Misdaad</div>';
  if(s.ouderdom<12) return h + '<div class="kaart klein">Jy is nog te jonk vir die onderwereld.</div>';
  MISDADE.forEach(function(m){
    var gedaan = (s.gedoen['md_'+m.id]||0)>=2;
    h += '<div class="kaart klik" onclick="doenMisdaad(\'' + m.id + '\')"><div class="ry">'+
      '<div class="emo">' + m.e + '</div><div class="groei"><div class="hoof">' + m.n + '</div>'+
      '<div class="klein">' + m.teikens.length + ' teikens' + (m.voertuig?' \u00b7 jy kies die ontsnapvoertuig':'') +
      (m.maat?' \u00b7 jy kan iemand saamvat':'') + '</div></div>'+
      '<div class="regs">' + (gedaan?'<span class="merkie">GENOEG</span>':'\u276F') + '</div></div></div>';
  });
  return h;
}
function renderAkt(){
  var h = '';
  if(s.dakloos && !s.tronk) return renderDakloos() + renderMisdaad();
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
      var onder = (typeof a.kosteTeks==='function' ? a.kosteTeks() : a.kosteTeks) ||
        (a.koste ? geld(a.koste) : 'Gratis');
      if(a.koste && kind && !a.kosteTeks) onder += ' \u00b7 jy kan jou ouers vra';
      if(jonk) onder += ' \u00b7 ouderdom ' + a.min + '+';
      h += '<div class="kaart klik" onclick="doenAkt(\'' + a.id + '\')"><div class="ry">'+
        '<div class="emo">' + a.e + '</div><div class="groei"><div class="hoof">' + a.n + '</div>'+
        '<div class="klein">' + onder + '</div></div>'+
        '<div class="regs">' + (klaar ? '<span class="merkie">GEDOEN</span>' :
          jonk ? '\u{1F512}' : arm ? '<span class="slot">te duur</span>' : '\u276F') + '</div></div></div>';
    });
  });
  /* H3 — wat jy al opgebou het. */
  h += renderVaardighede();
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
  h += renderMisdaad();
  return h;
}

/* ---------- H3: jou vaardighede ---------- */
/* Wat jy al opgebou het, met die vlak as 'n balkie. Dit staan onder
   Aktiwiteite, reg onder die knoppie waarmee jy oefen. */
function renderVaardighede(){
  var myne = myVaardighede();
  if(!myne.length) return '';
  var h = '<div class="titel">Jou vaardighede</div>';
  myne.forEach(function(x){
    var v = vaardigVlak(x.id), d = vaardig(x.id);
    var volgende = VAARDIG_PUNTE[v+1];
    h += '<div class="kaart"><div class="ry"><div class="emo">' + x.e + '</div>'+
      '<div class="groei"><div class="hoof">' + x.n + ' \u00b7 vlak ' + v + ' van 5</div>'+
      '<div class="klein">Jy ' + (v ? x.vlakke[v] : x.sub) + ' \u00b7 ' + (d.jare||0) +
      ' jaar geoefen' + (volgende ? ' \u00b7 ' + Math.max(0, volgende - d.punte) +
        ' punte tot vlak ' + (v+1) : ' \u00b7 niks meer om te leer nie') + '</div>'+
      '<div class="baan" style="margin-top:5px"><div class="vul" style="width:' +
      Math.round(v/5*100) + '%;background:var(--pers)"></div></div></div>'+
      '<div class="regs">\u2605' + v + '</div></div>'+
      /* Wat hierdie vlak vir jou oopgemaak het. */
      (x.inkomste && v>=x.inkomste.vanaf ? '<div class="klein">Dit bring nou self geld in.</div>' : '')+
      (x.kos && v>=x.kos.vanaf ? '<div class="klein">Dit sny jou kosrekening.</div>' : '')+
      (x.bele && v>=x.bele.vanaf ? '<div class="klein">Jou beleggings doen beter.</div>' : '')+
      (x.werk && v ? '<div class="klein">Dit help met ’n aansoek as ' +
        lysEn(x.werk.map(function(id){ var j=null; BEROEPE.forEach(function(q){ if(q.id===id) j=q; });
          return j ? j.t.toLowerCase() : id; }), 'of') + '.</div>' : '')+
      (x.besigheid && v ? '<div class="klein">Daarmee kan jy ’n besigheid loop: ' +
        (besigheidSoort(x.besigheid)||{n:''}).n.toLowerCase() + '.</div>' : '')+
      '</div>';
  });
  return h;
}

/* ---------- H4: jou eie besigheid ---------- */
function renderBesigheid(){
  var h = '';
  if(s.besigheid){
    var b = s.besigheid, x = besigheidSoort(b.id) || {wat:'kliënte', waarde:[0,0]};
    var kap = besigheidKapasiteit();
    h += '<div class="titel">Jou besigheid</div>';
    h += '<div class="kaart"><div class="ry"><div class="emo">' + (x.e||'\u{1F4BC}') + '</div>'+
      '<div class="groei"><div class="hoof">' + veilig(b.naam) + '</div>'+
      '<div class="klein">' + veilig(x.n||'') + ' \u00b7 ' + (b.jare||0) + ' jaar oop \u00b7 ' +
      (b.werkers||0) + ' werker' + ((b.werkers||0)===1?'':'s') + '</div></div>'+
      '<div class="regs' + ((b.wins||0)<0 ? ' ' : '') + '" style="color:' +
      ((b.wins||0)>=0 ? 'var(--groen)' : 'var(--rooi)') + '">' + kortGeld(b.wins||0) +
      '<br><span class="klein">wins verlede jaar</span></div></div>';
    h += '<div class="klein" style="margin-top:8px">' + Math.round(b.kliente||0) + ' van ' +
      Math.round(kap) + ' ' + x.wat + ' \u00b7 omset ' + geld(b.omset||0) + ' \u00b7 koste ' +
      geld(b.koste||0) + '</div>';
    h += '<div class="baan" style="margin-top:5px"><div class="vul" style="width:' +
      Math.round(Math.min(100, kap ? (b.kliente/kap)*100 : 0)) +
      '%;background:var(--blou)"></div></div>';
    if(kap && b.kliente/kap >= 0.95)
      h += '<div class="slot">Jy is vol. Huur iemand of koop toerusting as jy wil groei.</div>';
    if(b.verliesJare) h += '<div class="slot">' + b.verliesJare +
      (b.verliesJare===1 ? ' verliesjaar' : ' verliesjare') + ' agtermekaar \u00b7 nog ' +
      (BESIG_VERLIES_MAKS - b.verliesJare) + ' en dit is bankrot</div>';
    h += '<div class="klein" style="margin-top:6px">Bemarking: ' +
      (b.bemarking ? geld(b.bemarking) + ' per jaar' : 'niks') + ' \u00b7 toerusting: ' +
      geld(b.toerusting||0) + ' \u00b7 wat dit werd is: ' + geld(besigheidWaarde()) + '</div>';
    if((b.span||[]).length) h += '<div class="klein">Jou span: ' +
      veilig(b.span.map(function(p){ return p.naam; }).join(', ')) + '</div>';
    h += '<div class="knoppe"><button class="knop klein2" onclick="wysBemarking()">Bemarking</button>'+
      '<button class="knop klein2 groen" onclick="besigAksie(\'huur\')">Huur iemand</button></div>'+
      '<div class="knoppe"><button class="knop klein2" onclick="wysToerusting()">Koop toerusting</button>'+
      '<button class="knop klein2 grys" onclick="besigAksie(\'ontslaan\')">Laat iemand gaan</button></div>'+
      '<div class="knoppe"><button class="knop klein2 grys" onclick="besigAksie(\'verkoop\')">Verkoop</button>'+
      '<button class="knop klein2 rooi" onclick="besigAksie(\'sluit\')">Maak toe</button></div>';
    h += '</div>';
    return h;
  }
  /* Nog geen besigheid nie — wys die deur, as dit nou oop is. */
  if(s.ouderdom < 16 || s.tronk || s.afgetree) return '';
  if(s.skool.vlak==='laerskool') return '';
  h += '<div class="titel">Jou eie ding</div>';
  h += '<div class="kaart klik" onclick="wysBesighede()"><div class="ry">'+
    '<div class="emo">\u{1F680}</div><div class="groei"><div class="hoof">Begin jou eie besigheid</div>'+
    '<div class="klein">Elf soorte, van ’n stalletjie van R9 000 tot ’n plaas. Die wins is ' +
    'joune en word soos ’n salaris belas; ’n verlies kom uit jou sak.</div></div>'+
    '<div class="regs">\u276F</div></div></div>';
  if((s.besighedeGehad||[]).length)
    h += '<div class="kaart klein">Voorheen: ' + veilig(s.besighedeGehad.map(function(q){
      return q.n + ' (' + q.jare + ' jaar, ' + q.einde + ')'; }).join(', ')) + '</div>';
  return h;
}

/* ---------- Deeltydse werk (D3) ---------- */
function renderDeeltyds(){
  var h = '';
  if(s.deeltyds){
    var d = s.deeltyds, j = deeltydsVan(d.id) || {};
    return '<div class="titel">Deeltydse werk</div>'+
      '<div class="kaart"><div class="ry"><div class="emo">\u{1F9F9}</div><div class="groei">'+
      '<div class="hoof">' + veilig(d.t) + '</div><div class="klein">' + veilig(j.ure||'') +
      ' \u00b7 ' + (d.jare||0) + ' jaar' + (j.wenke ? ' \u00b7 die wenke wissel' : '') +
      '</div></div><div class="regs">' + kortGeld(d.s) +
      '<br><span class="klein">per jaar</span></div></div>'+
      /* C9 — langs jou klasse kos dit jou kans om die jaar te slaag. */
      (studeerTans() ? '<div class="slot">Dit kos jou ' + Math.abs(SLAAG_DEELTYDS) +
        ' persentpunte van jou kans om die akademiese jaar te slaag.</div>' : '')+
      '<button class="knop klein2 grys" onclick="losDeeltyds()">Se die werk op</button></div>';
  }
  if(s.beroep || s.afgetree || s.tronk || s.dakloos) return '';
  if(s.ouderdom < 15 || s.ouderdom >= AFTREE_OUDERDOM) return '';
  h += '<div class="titel">Deeltydse werk</div>';
  h += '<div class="kaart klein">Min ure en min geld, maar jy mag dit doen terwyl jy '+
    'op skool of op universiteit is. ' + (DEELTYDS_POGINGS - (s.gedoen.deeltyds||0)) +
    ' van ' + DEELTYDS_POGINGS + ' plekke oor om vanjaar te probeer.</div>';
  DEELTYDS.forEach(function(j){
    var rede = deeltydsVereis(j);
    h += '<div class="kaart' + (rede?'':' klik') + '"' + (rede?' style="opacity:.55"':
      ' onclick="neemDeeltyds(\'' + j.id + '\')"') + '><div class="ry">'+
      '<div class="emo">' + (rede ? '\u{1F512}' : '\u{1F9F9}') + '</div><div class="groei">'+
      '<div class="hoof">' + veilig(j.t) + '</div>'+
      '<div class="klein">' + veilig(j.ure) + (j.sub ? ' \u00b7 ' + veilig(j.sub) : '') + '</div>'+
      (rede ? '<div class="slot">' + veilig(rede) + '</div>' : '')+
      '</div><div class="regs">' + kortGeld(j.s) + '<br><span class="klein">p/j</span></div>'+
      '</div></div>';
  });
  return h;
}

/* ---------- Matriekuitslag per vak (C1 + C2) ---------- */
function vakUitslagHtml(sk){
  var h = '<div class="klein" style="margin-top:8px">Matriekuitslag \u00b7 gemiddeld ' +
    sk.punte + '% \u00b7 APS ' + (sk.aps||0) + ' uit ' + APS_MAKS + '</div>';
  sk.uitslag.forEach(function(r){
    h += '<div class="eind-stat"><span>' + veilig(r.n) +
      (r.aps ? '' : ' <span class="klein">(tel nie vir die APS nie)</span>') + '</span>'+
      '<b>' + r.p + '% \u00b7 vlak ' + r.vlak + '</b></div>';
  });
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
      /* D6 — wat die pos op sy beste kan betaal. */
      (b.plafon ? '<div class="klein" style="margin-top:6px">' +
        (b.salaris >= b.plafon ? 'Jy is op die plafon van hierdie pos — meer verdien jy net in ’n ander pos.'
          : 'Die plafon vir hierdie pos is ' + geld(b.plafon) + ' per jaar.') + '</div>' : '')+
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
      'klaargemaak het, of dit verlaat (jy mag van 16 af). Deeltydse werk mag jy '+
      'wel doen — kyk hieronder.</div></div>';
  } else {
    h += '<div class="kaart"><div class="hoof">Werkloos</div><div class="klein">'+
      'Doen aansoek vir ’n werk hieronder. Jy kry ' +
      (aansoekPerk()===1 ? 'een onderhoud' : aansoekPerk() + ' onderhoude') + ' per jaar (' +
      (aansoekPerk()-s.aansoeke) + ' oor).' +
      /* B18 — sonder ’n adres kom jy skaars by die onderhoud. */
      (s.dakloos ? ' Jy is dakloos: jou kans is net ' +
        persent((s.dakloos.ngo ? DAKLOOS_NGO_KANS : DAKLOOS_WERKKANS)*100) +
        '% van normaal' + (s.dakloos.ngo ? '' : ' — meld by ’n NGO aan onder Aktiwiteite') +
        '.' : '') +
      '</div></div>';
  }
  /* H4 — jou eie besigheid staan langs die werk, want dit is 'n
     alternatief daarvoor. */
  h += renderBesigheid();
  /* D3 — deeltydse werk en vakansiewerk. */
  h += renderDeeltyds();
  /* B17 — pensioen: wat in die fonds is, wat jy bydra, en aftrede. */
  if(s.ouderdom>=18 && !s.afgetree) h += renderPensioen();

  /* Opleiding */
  h += '<div class="titel">Opleiding</div>';
  var sk = s.skool, opl = '';
  if(sk.vlak==='universiteit'||sk.vlak==='nagraads')
    /* C4 — 'n graad is nou so lank as wat hy in die werklikheid is. */
    opl = sk.studie + ' by ' + (s.uni?s.uni.n:'die universiteit') + ' — jaar ' +
      ((sk.geslaagJare||0)+1) + ' van ' + (sk.jare || ((sk.geslaagJare||0) + sk.jareOor));
  else if(sk.vlak==='laerskool'||sk.vlak==='hoerskool') opl = 'Graad ' + sk.graad;
  else if(sk.matriek) opl = 'Matriek geslaag · APS ' + (sk.aps||0) + ' uit ' + APS_MAKS;
  else if(sk.uit) opl = 'Skool verlaat in Graad ' + sk.graad;
  else if(sk.uitslag && sk.uitslag.length) opl = 'Matriek gedruip (' + sk.punte + '%)';
  else opl = 'Nog geen kwalifikasie';
  h += '<div class="kaart"><div class="hoof">' + opl + '</div>';
  /* C9 — op universiteit: hoe jou jaar staan en wat dit kos as jy druip. */
  if(sk.vlak==='universiteit'||sk.vlak==='nagraads'){
    h += '<div class="klein">Kans om die jaar te slaag: ' + slaagKans() + '%' +
      (sk.ywer ? ' — jy studeer hard vanjaar' : ' — "Studeer harder" onder Aktiwiteite help') +
      '</div>';
    h += '<div class="klein">Klasgeld: ' + (sk.beurs ? 'volle beurs' :
      geld(sk.koste||0) + ' per jaar') + '</div>';
    if(sk.herhaal) h += '<div class="slot">' + sk.herhaal + ' jaar gedruip · nog ' +
      (DRUIP_MAKS - sk.herhaal) + ' voor akademiese uitsluiting</div>';
  }
  /* C1 + C2 — jou vakke, en as jy klaar is, die uitslag en die APS. */
  if(sk.uitslag && sk.uitslag.length) h += vakUitslagHtml(sk);
  else if(sk.vakke && sk.vakke.length)
    h += '<div class="klein" style="margin-top:6px">Jou vakke: ' +
      veilig(sk.vakke.join(', ')) + '</div>';
  if(sk.uitgeskop) h += '<div class="slot">Akademies uitgesluit: ' + sk.uitgeskop + ' keer' +
    (sk.uitgeskop>=UITSLUIT_MAKS ? ' — geen universiteit neem jou weer nie' : '') + '</div>';
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
/* E7/E12 — 'n kind se eie lewe en 'n eggenoot se beroep staan op sy
   kaart, want dit is wat jy van hom wil weet. */
function persoonSub(v){
  if(v.tipe==='eggenoot'){
    if(v.afgetree) return 'op pensioen';
    if(v.werk) return v.werk.t.toLowerCase() + ' \u00b7 ' + kortGeld(v.werk.salaris) + '/jaar';
    if(v.tuis) return 'tuis by die kinders';
    return 'werk nie';
  }
  if(v.tipe==='seun'||v.tipe==='dogter'||v.tipe==='kleinkind'){
    var k = v.kl; if(!k) return '';
    if(k.skool.vlak==='laerskool'||k.skool.vlak==='hoerskool') return 'Graad ' + k.skool.graad;
    if(k.skool.vlak==='universiteit') return 'studeer ' + k.skool.studie;
    if(k.beroep) return k.beroep.t.toLowerCase();
    if(v.ouderdom>=18) return k.skool.matriek ? 'matriek, werk nie' : 'geen matriek';
    return '';
  }
  return '';
}
function persoonKaart(v){
  var sub = persoonSub(v);
  return '<div class="kaart klik" onclick="oopPersoon(' + v.id + ')"><div class="ry">'+
    '<div class="emo">' + emoVan(v) + '</div><div class="groei">'+
    '<div class="hoof">' + veilig(v.naam + ' ' + v.van) + '</div>'+
    '<div class="klein">' + rol(v) + ' \u00b7 ' + v.ouderdom + ' jaar' +
      (sub ? ' \u00b7 ' + veilig(sub) : '') + '</div>'+
    '<div class="baan" style="margin-top:5px"><div class="vul" style="width:' + v.band +
    '%;background:var(--pienk)"></div></div></div>'+
    '<div class="regs">' + v.band + '%</div></div></div>';
}
/* H1 — die familielyn: hoeveelste geslag jy is, en wie voor jou was.
   Dit staan bo-aan die Mense-blad, want dit is deel van wie jy is. */
function renderFamilielyn(){
  if((s.generasie||1) <= 1) return '';
  var h = '<div class="titel">Familielyn</div>';
  h += '<div class="kaart"><div class="hoof">' + generasieWoord(s.generasie) +
    ' geslag van die ' + veilig(s.van) + '-familie</div>';
  (s.familielyn||[]).forEach(function(r, i){
    h += '<div class="eind-stat"><span>' + generasieWoord(r.generasie) + ' \u00b7 ' +
      veilig(r.naam) + '</span><b>' + r.ouderdom + ' jaar \u00b7 ' + veilig(r.beroep) +
      ' \u00b7 ' + kortGeld(r.netto) + ' nagelaat</b></div>';
  });
  h += '<div class="eind-stat"><span>' + generasieWoord(s.generasie) + ' \u00b7 ' +
    veilig(s.naam + ' ' + s.van) + ' (jy)</span><b>' + s.ouderdom + ' jaar \u00b7 ' +
    veilig(statusLyn()) + '</b></div>';
  h += '</div>';
  return h;
}
function renderMense(){
  var h = renderFamilielyn(), enige = false;
  var groepe = [
    {t:'Liefde', tipes:['eggenoot','lief']},
    {t:'Gesin', tipes:['ma','pa','broer','suster','seun','dogter']},
    /* E1 en E7 — drie geslagte in een lys. */
    {t:'Grootouers', tipes:['ouma','oupa']},
    {t:'Kleinkinders', tipes:['kleinkind']},
    /* H1 — die generasiespel bring ooms, tantes, neefs en niggies in. */
    {t:'Familie', tipes:['oom','tante','neef','niggie']},
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
  /* B18 — op straat wys die blad wat ’n verhuurder vooruit wil sien. */
  if(s.dakloos){
    h += '<div class="kaart"><div class="hoof">Jy is dakloos</div><div class="klein">'+
      '’n Verhuurder sal jou inneem as jy die eerste jaar se huur en twee maande '+
      'deposito vooruit betaal. ' +
      (s.geld<0 ? 'Jy is ' + geld(-s.geld) + ' in die skuld.' : 'Jy het ' + geld(s.geld) + '.') +
      '</div></div>';
    dakTrappe().forEach(function(p){
      var koste = dakIntrekKoste(p.id), kan = s.geld >= koste;
      h += '<div class="kaart' + (kan?' klik':'') + '"' +
        (kan?' onclick="kiesBlyplek(\'' + p.id + '\')"':'') +
        ' style="' + (kan?'':'opacity:.55') + '"><div class="ry">'+
        '<div class="emo">\u{1F511}</div><div class="groei"><div class="hoof">' + p.n + '</div>'+
        '<div class="klein">' + geld(koste) + ' vooruit \u00b7 ' + p.sub + '</div></div>'+
        '<div class="regs">' + (kan?'\u276F':'<span class="slot">te duur</span>') +
        '</div></div></div>';
    });
    return h;
  }
  var ouers = lewendeOuers().length;
  var byFam = s.blyplek==='familie' ? huisMense('familie')[0] : null;
  if(byFam)
    h += '<div class="kaart"><div class="ry"><div class="emo">\u{1F46A}</div><div class="groei">'+
      '<div class="hoof">By ' + veilig(byFam.naam) + '</div><div class="klein">' +
      rol(byFam) + ' het jou ingetrek. ' +
      geld(Math.round(OUERHUIS_MAAND*12*dorpFaktor())) + ' per jaar as jy verdien.' +
      '</div></div><div class="regs"><span class="merkie">HIER</span></div></div></div>';
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
    '<div class="klein">Waarde: ' + geld(s.belegging) + ' · hoë risiko: meeste jare ' +
      JSE_JARE[2].r[0] + '\u2013' + JSE_JARE[2].r[1] + '%, sowat een uit tien \u2019n crash tot ' +
      JSE_JARE[0].r[0] + '%. Oor 20 jaar klop dit meestal die spaarrekening.</div>'+
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
  else if(s.tab==='gesond') h = renderGesond();
  else h = renderBates();
  el('blad').innerHTML = h;
  el('verjaar').style.display = s.lewe ? 'flex' : 'none';
}

/* ==========================================================================
   DIE GESONDHEIDSBLAD (Fase 5 — F1, F2, F4 en E4)
   Alles wat met die liggaam te doen het op een plek: wat jy het, hoe jy
   daarvoor betaal, wat jy daaraan doen, en die drie gewoontes.
   ========================================================================== */
function renderGesond(){
  var h = '';
  /* --- Hoe dit met jou gaan --- */
  var ch = chronies().length;
  h += '<div class="titel">Jou liggaam</div>';
  h += '<div class="kaart"><div class="hoof">Gesondheid ' + s.gesondheid + '/100</div>'+
    '<div class="klein">' + (s.gene ? 'Jy kom uit ' + veilig(s.gene.n) +
      (s.gene.sub ? ' — ' + veilig(s.gene.sub) : '') + '.' : '') + '</div>'+
    '<div class="klein" style="margin-top:6px">' +
      (ch ? 'Jy leef met ' + ch + ' chroniese toestand' + (ch>1?'e':'') +
        (s.siekJare ? ', al ' + s.siekJare + ' jaar' : '') + '.'
          : 'Jy het geen chroniese toestand nie.') + '</div></div>';

  /* --- F1: jou toestande --- */
  h += '<div class="titel">Siektes en toestande</div>';
  if(!(s.siektes||[]).length){
    h += '<div class="kaart klein">Jy is op die oomblik gesond.</div>';
  } else {
    s.siektes.forEach(function(x){
      var tt = toestandVan(x.id); if(!tt) return;
      var koste = behandelKoste(x);
      var stat = !x.behandel ? 'Onbehandeld'
        : x.wag>0 ? 'Op die staatshospitaal se waglys'
        : x.pad==='fonds' ? 'Deur jou mediese fonds'
        : x.pad==='staat' ? 'By die staatshospitaal'
        : 'Privaat, uit jou eie sak';
      h += '<div class="kaart"><div class="ry"><div class="emo">' + tt.e + '</div>'+
        '<div class="groei"><div class="hoof">' + tt.n + '</div>'+
        '<div class="klein">' + (tt.soort==='chronies' ? 'Chronies' : 'Akuut') +
        ' · jaar ' + x.jare + ' · ' + stat +
        (koste ? ' · ' + geld(koste) + ' per jaar' : '') + '</div>'+
        '<div class="klein">' + tt.sub + '</div></div></div>'+
        (!x.behandel ? '<button class="knop groen" onclick="behandelNou(\'' + x.id +
          '\')">Laat dit behandel</button>' : '') + '</div>';
    });
  }

  /* --- F2: die mediese fonds --- */
  h += '<div class="titel">Mediese sorg</div>';
  if(s.ouderdom<18){
    h += '<div class="kaart klein">Jy is op jou ouers se plan — of by die ' +
      'staatshospitaal, soos die meeste kinders. Van 18 af kies jy self.</div>';
  } else if(s.mediesefonds){
    var f = mediesefonds();
    h += '<div class="kaart klik" onclick="wysMedieseFondse()"><div class="ry">'+
      '<div class="emo">\u{1F3E5}</div><div class="groei">'+
      '<div class="hoof">' + f.n + '</div>'+
      '<div class="klein">' + geld(fondsPremieJaar()) + ' per jaar · dek ' +
      Math.round(f.dek*100) + '% · lid vir ' + s.fondsJare + ' jaar</div>'+
      '<div class="klein">' + f.sub + '</div></div><div class="regs">❯</div></div></div>';
  } else {
    h += '<div class="kaart klik" onclick="wysMedieseFondse()"><div class="ry">'+
      '<div class="emo">\u{1F3E5}</div><div class="groei">'+
      '<div class="hoof">Jy het geen mediese fonds nie</div>'+
      '<div class="klein">Dit is die staatshospitaal, of ’n privaat rekening ' +
      'wat jou kan ruïneer</div></div><div class="regs">❯</div></div></div>';
  }

  /* --- F4: die drie gewoontes --- */
  h += '<div class="titel">Leefstyl</div>';
  GEWOONTES.forEach(function(g){
    var v = gewoonteVlak(g.id);
    var jonk = s.ouderdom < g.min;
    h += '<div class="kaart"><div class="ry"><div class="emo">' + g.e + '</div>'+
      '<div class="groei"><div class="hoof">' + g.n + '</div>'+
      '<div class="klein">Jy ' + g.vlakke[v] + (v ? ' · ' + geld(g.koste[v]) +
        ' per jaar' : '') + (s.gewoonteJare[g.id] ? ' · ' + s.gewoonteJare[g.id] +
        ' jaar' : '') + '</div>'+
      '<div class="klein">' + g.sub + '</div></div>'+
      '<div class="regs">' + (jonk ? '\u{1F512}' : '') + '</div></div>'+
      (jonk ? '' :
        '<button class="knop grys" onclick="beginGewoonte(\'' + g.id + '\')">' +
        (g.id==='drink' ? (v ? 'Gaan uit vir ’n dop' : 'Probeer ’n dop')
         : g.id==='rook' ? (v ? 'Koop ’n pakkie' : 'Probeer ’n sigaret')
         : (v ? 'Gebruik weer' : 'Probeer dit')) + '</button>') +
      (v ? '<button class="knop groen" onclick="wysOphou(\'' + g.id +
        '\')">Probeer ophou</button>' : '') + '</div>';
  });
  if(s.lisensieWeg)
    h += '<div class="kaart klein">Jou rylisensie is nog ' + s.lisensieWeg +
      ' jaar opgeskort weens dronkbestuur.</div>';

  /* --- E4: voorbehoeding --- */
  if(s.ouderdom>=14){
    var vb = voorbehoedingVan();
    h += '<div class="titel">Voorbehoeding</div>';
    h += '<div class="kaart klik" onclick="wysVoorbehoeding()"><div class="ry">'+
      '<div class="emo">\u{1F48A}</div><div class="groei">'+
      '<div class="hoof">' + vb.n + '</div>'+
      '<div class="klein">' + Math.round(vb.f*100) + '% effektief' +
      (vb.koste ? ' · ' + geld(vb.koste) + ' per jaar' : '') + '</div>'+
      '<div class="klein">' + vb.sub + '</div></div>'+
      '<div class="regs">❯</div></div></div>';
  }
  return h;
}
