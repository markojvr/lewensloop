/* ==========================================================================
   DIE REËLS
   Wat die harnas as 'n fout tel. Drie soorte:

   1. TAAL       — regex-reëls oor elke stuk teks wat 'n speler sien.
   2. VERBODE    — teks wat in 'n sekere toestand nie mag verskyn nie
                   (die hond wat jou huis toe volg terwyl jy in die tronk is).
   3. INVARIANTE — dinge wat ná elke jaar waar moet wees (geen NaN, geen
                   werk in die tronk, 'n ma ouer as haar kind).

   Kry jy 'n fout reg, voeg 'n reël hier by sodat dit nooit terugkom nie.
   Is 'n treffer vals, voeg 'n uitsondering by UITSONDER — met 'n rede.
   ========================================================================== */

/* ---------- 1. Taal ---------- */
var TAAL = [
  ['dubbele spasie',       /\S  +\S/],
  ['1 met meervoud',       /(^|[^\d,])1 (jare|kinders|teikens|maande|weke|dae|punte|lede|vriende|broers|susters|kaartjies|lewens)\b/],
  ['(e)-noodoplossing',    /\w\((e|s|te)\)/],
  ['punt as desimaal',     /\d\.\d/],
  ['R met punt',           /R\s?\d+\.\d/],
  ['ASCII-apostroof by ’n', /(^|[\s(">\-])'n\b/],
  ['dubbele ’n',           /’n ’n\b/],
  ['nie nie',              /\bnie nie\b/],
  ['twee punte',           /[^.]\.\.(?!\.)/],
  ['spasie voor leesteken', /\s[.,!?;:](\s|$)/],
  ['dubbele woord',        /\b(die|jou|het|van|is|een|te|om|in|op|en|’n|sy|haar|jy|hy|wat|se)\s+\1\b/i],
  ['diakritiese teken weg', /\b(gese|geeet|geerf|gele|kliente|hoerskool|Hoerskool|vroeer|beindruk|beinvloed|wereld|onderwereld|reen|bele|prive|annuiteit|Lewensorientering)\b/],
  ['Engels',               /\b(the|and|you|your|with|from|about|house|money|friend|very|have|that|this|will|would|there|which|their|because|people|happy)\b/],
  ['undefined/NaN/null',   /\bundefined\b|\bNaN\b|\bnull\b|\[object Object\]/],
  ['hakies binne hakies',  /\([^()]*\(/]
];

/* Afrikaans se dubbele ontkenning: ná nie/geen/nooit/niks/niemand moet
   daar later in die sin nog 'n "nie" kom — tensy die ontkenning die
   laaste woord is. Gee die stout sinne terug. */
var ONTKEN = /^(nie|geen|nooit|niks|niemand|nêrens|g’n)$/i;
/* 'n Fragment sonder werkwoord ("Kontant, geen kontrak.") kry nie 'n
   tweede nie nie, so die toets loop net as die sin 'n werkwoord het. */
var WERKWOORD = /^(is|was|het|kan|kon|sal|sou|wil|wou|moet|mag|gaan|word|kry|hoef|kom|wees|weet|ken|sien|hou|doen|maak|gee|bly|lyk|voel|dink|praat|sê|loop|werk|betaal)$/i;
function nieNie(t){
  var stout = [];
  String(t).split(/(?<=[.!?])\s+|\s*·\s*|\n|\s+—\s+|:\s/).forEach(function(sin){
    var w = sin.replace(/[«»"“”()]/g, ' ').trim().split(/\s+/).map(function(x){
      return x.replace(/^[^A-Za-zÀ-ÿ’]+/, '').replace(/[^A-Za-zÀ-ÿ’]+$/, '');
    }).filter(Boolean);
    if(!w.some(function(x){ return WERKWOORD.test(x); })) return;
    for(var i=0; i<w.length; i++){
      if(!ONTKEN.test(w[i])) continue;
      if(i === w.length-1) break;
      var j = -1;
      for(var k=i+1; k<w.length; k++) if(w[k].toLowerCase()==='nie'){ j = k; break; }
      if(j < 0){ stout.push(sin.trim()); break; }
      i = j;
    }
  });
  return stout;
}

/* ---------- 2. Verbode teks per toestand ---------- */
/* toestand(c) gee een van: 'tronk', 'jeugsorg', 'straat', 'vlug', 'kind', 'buite'. */
function toestand(c){
  var s = c.s;
  if(s.tronk) return s.tronk.jeug ? 'jeugsorg' : 'tronk';
  if(s.dakloos) return 'straat';
  if(s.vlug) return 'vlug';
  if(s.ouderdom < 13) return 'kind';
  return 'buite';
}
var TUIS = /hond volg jou huis toe|geyser het gebars|in die yskas laat vrot|bank in die tuin|Jou motor se diens|Waar gaan jy bly/;
var VERBODE = [
  {in:['tronk','jeugsorg'], n:'huis-gebeure in die tronk', re:TUIS},
  {in:['tronk','jeugsorg'], n:'buite-lewe in die tronk',
    re:/matriekafskeid|op vakansie|Jy het getrou|aftreeoord|Sakgeld vir die jaar|het jou aangestel|Jy is bevorder/},
  {in:['straat'], n:'huis-gebeure op straat', re:TUIS},
  {in:['straat'], n:'huur op straat', re:/Huur vir |Sakgeld vir die jaar/},
  {in:['kind'], n:'grootmens-goed as kind',
    re:/Jy is afgedank|Jy is bevorder|Jy het getrou|egskeiding|jou verband|Lotto|casino|Jy het jou rylisensie/i}
];

/* ---------- 3. Invariante ---------- */
/* Elkeen gee 'n string terug as dit verbreek is, anders niks. */
var STATTE = ['geluk','gesondheid','slim','voorkoms'];
var GETALLE = ['geld','spaar','belegging','ouderdom','hitte','straatRep','pensioenFonds','totaalVerdien'];
var INVARIANTE = [
  function(c){ var s = c.s;
    for(var i=0;i<GETALLE.length;i++){ var v = s[GETALLE[i]];
      if(v!==undefined && (typeof v!=='number' || !isFinite(v))) return GETALLE[i] + ' is ' + v; } },
  function(c){ var s = c.s;
    for(var i=0;i<STATTE.length;i++){ var v = s[STATTE[i]];
      if(typeof v!=='number' || !isFinite(v) || v<0 || v>100) return STATTE[i] + ' is ' + v; } },
  function(c){ var s = c.s; if(s.tronk && s.vlug) return 'in die tronk én op die vlug'; },
  function(c){ var s = c.s; if(s.tronk && s.beroep) return 'het ’n werk in die tronk: ' + s.beroep.t; },
  function(c){ var s = c.s;
    if(s.beroep && ['laerskool','hoerskool','kleuterskool'].indexOf(s.skool.vlak)>=0 && !s.skool.uit)
      return 'voltydse werk terwyl op ' + s.skool.vlak; },
  function(c){ var s = c.s;
    if(s.bond && !s.bates.some(function(b){ return b.t==='huis'; })) return 'verband sonder ’n huis'; },
  function(c){ var s = c.s;
    /* 'n Dooie ouer se ouderdom staan stil — net die lewendes tel. */
    var ouers = s.verhoudings.filter(function(v){ return v.lewe && (v.tipe==='ma' || v.tipe==='pa'); });
    for(var i=0;i<ouers.length;i++) if(ouers[i].ouderdom <= s.ouderdom)
      return ouers[i].tipe + ' (' + ouers[i].ouderdom + ') nie ouer as jy (' + s.ouderdom + ')'; },
  function(c){ var s = c.s;
    var e = s.verhoudings.filter(function(v){ return v.lewe && v.tipe==='eggenoot'; });
    if(e.length > 1) return e.length + ' lewende eggenote'; },
  function(c){ var s = c.s;
    for(var i=0;i<s.verhoudings.length;i++){ var v = s.verhoudings[i];
      if(typeof v.ouderdom!=='number' || !isFinite(v.ouderdom)) return v.naam + ' se ouderdom is ' + v.ouderdom;
      if(typeof v.band!=='number' || !isFinite(v.band)) return v.naam + ' se band is ' + v.band; } },
  function(c){ var s = c.s;
    var m = s.verhoudings.filter(function(v){ return v.lewe && (v.tipe==='lief' || v.tipe==='eggenoot'); })[0];
    /* E9 — onder 18 is die gaping hoogstens 2 jaar (liefOuderdomPas()). 'n Maat
       wat 'n jaar voor jou 18 word, is reg; 'n 25-jarige is nie. */
    if(m && s.ouderdom < 18 && m.ouderdom - s.ouderdom > 2) return 'jy is ' + s.ouderdom + ' en jou maat ' + m.ouderdom; }
];

/* Bekende vals treffers: [reël-naam, regex oor die teks, rede]. */
var UITSONDER = [
  ['punt as desimaal', /\bv\d+\.\d/, 'weergawe-nommers'],
  ['dubbele spasie', /^\S{1,3}  [A-ZÀ-ÿ’]/u, 'knoppie-etiket: emoji, twee spasies, naam'],
  ['Engels', /\b(Blackjack|Video poker|slots)\b/i, 'speletjie-name']
];

function uitgesonder(reel, teks){
  return UITSONDER.some(function(u){ return u[0]===reel && u[1].test(teks); });
}

module.exports = {TAAL:TAAL, nieNie:nieNie, VERBODE:VERBODE, toestand:toestand,
  INVARIANTE:INVARIANTE, UITSONDER:UITSONDER, uitgesonder:uitgesonder};
