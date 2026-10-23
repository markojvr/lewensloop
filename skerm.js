/* ==========================================================================
   9. MODAAL, WENKE, BEGIN EN EINDE
   Die vensters waarmee die speler praat: keuses, wenke, die grafsteen
   en die beginskerm.
   ========================================================================== */

function wysModaal(titel, teks, opsies, klas, invoer){
  var m = el('modaal');
  m.innerHTML = '<div class="mk ' + (klas||'') + '"><div class="m-titel">' + titel + '</div>'+
    '<div class="m-teks">' + teks + '</div>'+
    (invoer ? '<input class="veld" id="m-invoer" maxlength="16" placeholder="' +
      veilig(invoer.plek||'') + '" value="' + veilig(invoer.waarde||'') + '">' : '')+
    '<div class="m-lys" id="m-lys"></div></div>';
  var box = el('m-lys');
  (opsies||[{t:'OK'}]).forEach(function(o){
    var b = document.createElement('button');
    b.className = 'knop ' + (o.klas||'');
    b.innerHTML = veilig(o.t) + (o.sub ? '<small>' + veilig(o.sub) + '</small>' : '');
    b.onclick = function(){ if(o.doen) o.doen(); else sluitModaal(); };
    box.appendChild(b);
  });
  m.classList.add('wys');
}
/* Wys 'n keuselys met 'n "los dit"-knoppie onderaan. */
function kiesLys(titel, teks, opsies, terugT, terugF){
  if(!opsies.length){ wenk('Daar is niks om van te kies nie.'); return; }
  var o = opsies.slice();
  o.push({t: terugT||'Los dit', klas:'grys', doen: terugF || function(){ sluitModaal(); }});
  wysModaal(titel, teks, o);
}
/* Kies iemand uit jou lewe. filter() bepaal wie in die lys kom. */
function kiesPersoon(titel, teks, filter, terugroep, alleenT){
  var lys = s.verhoudings.filter(function(v){ return v.lewe && filter(v); });
  lys.sort(function(a,b){ return b.band - a.band; });
  var opsies = [];
  if(alleenT !== false) opsies.push({t: alleenT || 'Gaan alleen', doen:function(){ terugroep(null); }});
  lys.slice(0,12).forEach(function(v){
    opsies.push({t: v.naam + ' ' + v.van, sub: rol(v) + ' \u00b7 ' + v.ouderdom + ' jaar \u00b7 band ' + v.band + '%',
      doen:function(){ terugroep(v); }});
  });
  if(!opsies.length){ wenk('Jy ken nog niemand om saam te vat nie.'); return; }
  kiesLys(titel, teks, opsies);
}
function saamFilter(v){
  return ['vriend','lief','eggenoot','broer','suster','ma','pa','seun','dogter','klasmaat','kollega',
    /* H1 — die familie wat met die generasiespel bykom. */
    'oom','tante','neef','niggie','kleinkind']
    .indexOf(v.tipe) >= 0;
}
/* Betaal self, of (as kind) vra jou ouers. ouersOutomaties = hulle betaal sonder om te vra. */
function betaalEnDoen(koste, wat, klaar, ouersOutomaties){
  if(!koste){ klaar(); return; }
  var ouers = lewendeOuers();
  if(s.ouderdom>=18 || !ouers.length){
    if(s.geld < koste){ wenk('Jy het nie ' + geld(koste) + ' nie.'); sluitModaal(); return; }
    s.geld -= koste; klaar(); return;
  }
  if(ouersOutomaties){
    var p = kies(ouers);
    noteer(p.naam + ' het die rekening van ' + geld(koste) + ' betaal.','geld');
    klaar(); return;
  }
  var opsies = ouers.map(function(p){
    return {t:'Vra ' + rol(p), sub: p.naam + ' \u00b7 julle band is ' + p.band + '%',
      doen:function(){ vraOuer(p, koste, wat, klaar); }};
  });
  if(s.geld >= koste) opsies.push({t:'Betaal met jou eie sakgeld',
    sub:'Jy het ' + geld(s.geld), doen:function(){ s.geld -= koste; klaar(); }});
  kiesLys('Wie betaal?', wat + ' kos ' + geld(koste) + ', en jy is ' + s.ouderdom + ' jaar oud.', opsies);
}
function vraOuer(p, koste, wat, klaar){
  var kansie = 44 + p.band/2.2 + (s.rykf-1)*7 - koste/1500;
  if(kans(kansie)){
    p.band = klem(p.band+2);
    noteer(p.naam + ' het ingestem om vir ' + wat.toLowerCase() + ' te betaal (' + geld(koste) + ').','geld');
    klaar();
  } else {
    s.geluk = klem(s.geluk-4); p.band = klem(p.band-1);
    noteer(p.naam + ' het nee gese oor ' + wat.toLowerCase() + '. "Ons het nie nou die geld nie."','sleg');
    wenk(p.naam + ' het nee gese.');
    sluitModaal(); stoor(); renderAlles();
  }
}

function sluitModaal(){ el('modaal').classList.remove('wys'); el('modaal').innerHTML=''; }
var wenkTyd = null;
function wenk(teks){
  var w = el('wenk'); w.textContent = teks; w.classList.add('wys');
  clearTimeout(wenkTyd); wenkTyd = setTimeout(function(){ w.classList.remove('wys'); }, 2600);
}

function wysGrafskrif(){
  renderKop(); renderAlles();
  var jare = s.ouderdom;
  var h = '<div class="groot">\u{1F56F}</div>'+
    '<div class="m-titel">' + veilig(s.naam + ' ' + s.van) + '</div>'+
    '<div class="m-teks" style="margin-bottom:12px">Oorlede op ' + jare + ' jaar weens ' + s.oorsaak + '.' +
      /* H1 — die hoeveelste lewe in hierdie familie. */
      ((s.generasie||1) > 1 ? '\n' + generasieWoord(s.generasie) + ' geslag van die ' +
        veilig(s.van) + '-familie.' : '') + '</div>'+
    ((s.familielyn||[]).length ? '<div class="eind-stat"><span>Voor jou</span><b>' +
      veilig(familielynTeks()) + '</b></div>' : '')+
    '<div class="eind-stat"><span>Netto waarde</span><b>' + geld(netoWaarde()) + '</b></div>'+
    '<div class="eind-stat"><span>Totaal verdien</span><b>' + geld(s.totaalVerdien) + '</b></div>'+
    '<div class="eind-stat"><span>Laaste beroep</span><b>' +
      (s.beroepeGehad.length ? s.beroepeGehad[s.beroepeGehad.length-1] : 'geen') + '</b></div>'+
    '<div class="eind-stat"><span>Kwalifikasies</span><b>' +
      (s.skool.nagraads.concat(s.skool.grade).join(', ') || (s.skool.matriek?'Matriek':'geen')) + '</b></div>'+
    /* C2 — die APS staan by die matriek, ook as jy later gegradueer het. */
    (s.skool.aps ? '<div class="eind-stat"><span>Matriek-APS</span><b>' + s.skool.aps +
      ' uit ' + APS_MAKS + ' · gemiddeld ' + s.skool.punte + '%' +
      (s.skool.wiskunde ? ' · met Wiskunde' : '') + '</b></div>' : '')+
    /* D3 — die jare wat jy deeltyds gewerk het terwyl jy geleer het. */
    (s.deeltydsJare ? '<div class="eind-stat"><span>Jare deeltyds gewerk</span><b>' +
      s.deeltydsJare + '</b></div>' : '')+
    '<div class="eind-stat"><span>Kinders</span><b>' + s.kinders +
      ((s.kindersGebore||s.kinders) > s.kinders ? ' van ' + s.kindersGebore + ' gebore' : '') + '</b></div>'+
    /* E7 — die derde geslag, en wat van jou kinders geword het. */
    ((s.kleinkinders||0) ? '<div class="eind-stat"><span>Kleinkinders</span><b>' +
      s.kleinkinders + '</b></div>' : '')+
    (kindOpsomming() ? '<div class="eind-stat"><span>Jou kinders</span><b>' +
      veilig(kindOpsomming()) + '</b></div>' : '')+
    '<div class="eind-stat"><span>Troues</span><b>' + s.troues + '</b></div>'+
    /* H4 — wat jy self gebou het. */
    (s.besigheid ? '<div class="eind-stat"><span>Jou besigheid</span><b>' +
      veilig(s.besigheid.naam) + ' (' + s.besigheid.jare + ' jaar, wins ' +
      kortGeld(s.besigheid.wins||0) + ')</b></div>' : '')+
    ((s.besighedeGehad||[]).length ? '<div class="eind-stat"><span>Besighede gehad</span><b>' +
      veilig(s.besighedeGehad.map(function(q){ return q.n + ' (' + q.einde + ')'; }).join(', ')) +
      '</b></div>' : '')+
    /* H3 — die vaardighede wat jy oor 'n leeftyd opgebou het. */
    (vaardigOpsomming() ? '<div class="eind-stat"><span>Vaardighede</span><b>' +
      veilig(vaardigOpsomming()) + '</b></div>' : '')+
    /* F1/F2 — met watter toestande het jy geleef, en wie het betaal. */
    (chronies().length ? '<div class="eind-stat"><span>Chroniese toestande</span><b>' +
      chronies().map(function(x){ var tt=toestandVan(x.id); return tt?tt.n:''; }).join(', ') +
      '</b></div>' : '')+
    (s.siekJare ? '<div class="eind-stat"><span>Jare met ’n chroniese toestand</span><b>' +
      s.siekJare + '</b></div>' : '')+
    '<div class="eind-stat"><span>Mediese sorg</span><b>' +
      (s.mediesefonds ? mediesefonds().n + ' (' + s.fondsJare + ' jaar)' :
        'staatshospitaal') + '</b></div>'+
    /* F4 — die gewoontes wat jy saamgedra het. */
    (gewoonteOpsomming() ? '<div class="eind-stat"><span>Leefstyl</span><b>' +
      veilig(gewoonteOpsomming()) + '</b></div>' : '')+
    /* F9 — waaruit jy kom. */
    (s.gene ? '<div class="eind-stat"><span>Familiegeskiedenis</span><b>' +
      veilig(s.gene.n) + '</b></div>' : '')+
    '<div class="eind-stat"><span>Jare in die tronk</span><b>' + (s.tronkJare||0) + '</b></div>'+
    (s.dakloosJare ? '<div class="eind-stat"><span>Jare op straat</span><b>' +
      s.dakloosJare + '</b></div>' : '')+
    '<div class="eind-stat"><span>Geluk by die einde</span><b>' + s.geluk + '%</b></div>';
  var m = el('modaal');
  /* H1 — is daar 'n lewende kind, kan die speler as hom voortgaan. Die
     boedel is klaar verdeel voordat hy kies, sodat hy sien wat elke
     kind sou erf. */
  var kinders = lewendeKinders();
  if(kinders.length) h += '<div class="m-teks" style="margin-top:10px">Jou lyn hou aan: ' +
    'kies een van jou kinders en speel sy lewe verder, met sy deel van die boedel.</div>';
  m.innerHTML = '<div class="mk graf">' + h + '<div class="m-lys" id="m-lys"></div></div>';
  kinders.sort(function(a,b){ return b.ouderdom - a.ouderdom; });
  kinders.slice(0,6).forEach(function(v){
    var deel = erfDeel(v);
    var kb = document.createElement('button');
    kb.className = 'knop groen';
    kb.innerHTML = 'Gaan voort as ' + veilig(v.naam) +
      '<small>' + v.ouderdom + ' jaar \u00b7 ' + veilig(kindKort(v)) + ' \u00b7 erf ' +
      kortGeld(deel.kontant + (deel.bates[0] ? deel.bates[0].waarde : 0)) +
      (deel.bates.length ? ' met ' + veilig(deel.bates[0].n) : '') +
      (deel.besigheid ? ' en die besigheid' : '') + '</small>';
    kb.onclick = function(){
      var id = v.id;
      sluitModaal();
      if(gaanVoortAsKind(id)){
        el('verjaar').style.display='flex';
        renderAlles(); naOnder();
        wenk('Jy is nou ' + s.naam + ', die ' + generasieWoord(s.generasie) + ' geslag.');
      } else wysBeginskerm();
    };
    el('m-lys').appendChild(kb);
  });
  var b = document.createElement('button');
  b.className = kinders.length ? 'knop grys' : 'knop';
  b.textContent='Begin ’n nuwe lewe';
  b.onclick = function(){ sluitModaal(); try{ localStorage.removeItem(SLEUTEL); }catch(e){} wysBeginskerm(); };
  el('m-lys').appendChild(b);
  m.classList.add('wys');
  el('verjaar').style.display='none';
}
/* H1 — een kort reël oor waar 'n kind in sy lewe staan, vir die knoppie. */
function kindKort(v){
  var k = v.kl || kindLewe(v);
  if(k.beroep) return k.beroep.t.toLowerCase();
  if(k.skool.vlak==='universiteit') return 'studeer ' + k.skool.studie;
  if(k.skool.vlak==='laerskool' || k.skool.vlak==='hoerskool') return 'Graad ' + k.skool.graad;
  if(v.ouderdom<6) return 'nog klein';
  return k.skool.matriek ? 'matriek, werk nie' : 'geen matriek';
}
/* H3 — die vaardighede wat saam met jou gaan, vir die grafsteen. */
function vaardigOpsomming(){
  return myVaardighede().filter(function(x){ return vaardigVlak(x.id)>0; })
    .map(function(x){ return x.n.toLowerCase() + ' (vlak ' + vaardigVlak(x.id) + ')'; })
    .join(', ');
}

var beginGeslag = '?';
function kiesGeslag(g){ beginGeslag = g; wysBeginskerm(true); }
function wysBeginskerm(herhaal){
  var naam = '', van = '';
  if(herhaal){ naam = el('i-naam').value; van = el('i-van').value; }
  var hist = [];
  try{ hist = JSON.parse(localStorage.getItem(GESKIEDENIS)||'[]'); }catch(e){}
  var hh = '';
  if(hist.length){
    hh = '<div class="titel" style="margin-top:18px">Vorige lewens</div>';
    hist.forEach(function(r){
      hh += '<div class="kaart"><div class="ry"><div class="groei">'+
        '<div class="hoof" style="font-size:13.5px">' + veilig(r.naam) + '</div>'+
        '<div class="klein">' + r.ouderdom + ' jaar · ' + veilig(r.beroep) + ' · ' + r.oorsaak + '</div>'+
        '</div><div class="regs">' + kortGeld(r.geld) + '</div></div></div>';
    });
  }
  el('begin').innerHTML = '<div class="mk" style="background:none;border:0;box-shadow:none">'+
    '<div class="mid" style="margin-bottom:14px">'+
      '<div style="font-size:40px">\u{1F9EC}</div>'+
      '<div style="font-size:26px;font-weight:800;letter-spacing:-.5px">LEWENSLOOP</div>'+
      '<div class="klein">Een lewe. Een jaar op ’n slag.</div></div>'+
    '<input class="veld" id="i-naam" placeholder="Naam (los leeg vir lukraak)" value="' + veilig(naam) + '">'+
    '<input class="veld" id="i-van" placeholder="Van" value="' + veilig(van) + '">'+
    '<div class="keuse">'+
      '<button class="' + (beginGeslag==='m'?'aan':'') + '" onclick="kiesGeslag(\'m\')">Seun</button>'+
      '<button class="' + (beginGeslag==='v'?'aan':'') + '" onclick="kiesGeslag(\'v\')">Dogter</button>'+
      '<button class="' + (beginGeslag==='?'?'aan':'') + '" onclick="kiesGeslag(\'?\')">Verras my</button>'+
    '</div>'+
    '<button class="knop groen" style="margin-top:14px" onclick="beginLewe()">Word gebore</button>'+
    hh + '</div>';
  el('begin').classList.add('wys');
}
function beginLewe(){
  var naam = veilig(el('i-naam').value).trim().slice(0,18);
  var van  = veilig(el('i-van').value).trim().slice(0,18);
  nuweLewe(naam||null, van||null, beginGeslag);
  el('begin').classList.remove('wys');
  renderAlles(); naOnder();
}

/* E7 — 'n reël vir die grafsteen: wat van jou kinders geword het. */
function kindOpsomming(){
  var lys = s.verhoudings.filter(function(v){
    return (v.tipe==='seun'||v.tipe==='dogter') && v.kl; });
  if(!lys.length) return '';
  return lys.map(function(v){
    var k = v.kl;
    var wat = k.beroep ? k.beroep.t.toLowerCase()
      : k.skool.vlak==='universiteit' ? 'studeer'
      : k.skool.grade.length ? k.skool.grade[0].toLowerCase()
      : v.ouderdom<18 ? 'Graad ' + Math.max(0, k.skool.graad)
      : k.skool.matriek ? 'matriek' : 'geen matriek';
    return v.naam + ' (' + wat + (v.lewe ? '' : ', oorlede') + ')';
  }).join(', ');
}
/* F4 — net die gewoontes wat nog by jou was, of wat jy afgeskud het. */
function gewoonteOpsomming(){
  var r = [];
  GEWOONTES.forEach(function(g){
    var v = gewoonteVlak(g.id);
    if(v) r.push(g.vlakke[v]);
    else if(s.opgehou && s.opgehou[g.id]) r.push('opgehou met ' + g.n.toLowerCase());
  });
  return r.join(', ');
}
