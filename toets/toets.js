#!/usr/bin/env node
/* ==========================================================================
   TOETS — speel duisende lewens en kyk vir foute.

     node toets/toets.js                     alles, 150 lewens per scenario
     node toets/toets.js -n 500              meer lewens
     node toets/toets.js -s tronk,vlug       net hierdie scenario's
     node toets/toets.js -s tronk --saad 42  speel EEN lewe en wys sy log
     node toets/toets.js tekste > uit.tsv    elke unieke teks, om self te lees
     node toets/toets.js bron                taal-reëls oor die bronkode se strings
     node toets/toets.js lys                 die scenario's

   Dit kyk vir vier dinge: crashes, gebroke invariante, verbode teks in
   'n toestand, en taalfoute. Elke fout kom met 'n saad, sodat
   "--saad <saad>" presies daardie lewe weer speel. Die uitgangskode is
   1 as daar iets is, anders 0.
   ========================================================================== */
var fs = require('fs');
var path = require('path');
var H = require('./harnas.js');
var SC = require('./scenarios.js').SCENARIOS;
var RE = require('./reels.js');

/* ---------- argumente ---------- */
var arg = process.argv.slice(2), opt = {n:150, s:null, saad:null, modus:'alles', wys:6};
for(var i=0; i<arg.length; i++){
  var a = arg[i];
  if(a==='-n') opt.n = Number(arg[++i]);
  else if(a==='-s' || a==='--scenario') opt.s = arg[++i].split(',');
  else if(a==='--saad') opt.saad = Number(arg[++i]);
  else if(a==='--wys') opt.wys = Number(arg[++i]);
  else if(a[0] !== '-') opt.modus = a;
}
var name = opt.s || Object.keys(SC);
name.forEach(function(n){ if(!SC[n]){ console.error('Onbekende scenario: ' + n + ' (probeer "lys")'); process.exit(2); } });

/* Name en getalle word gelyk gemaak, sodat "Jan het R1 200 gekry" en
   "Piet het R9 000 gekry" een sjabloon is en net een keer gerapporteer word. */
var normReel = null;
function sjabloon(t, c){
  if(!normReel){
    var n = [].concat(c.MANSNAME||[], c.VROUENAME||[], c.VANNE||[]).sort(function(a,b){ return b.length-a.length; });
    normReel = new RegExp('\\b(' + n.map(function(x){ return x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }).join('|') + ')\\b', 'g');
  }
  return t.replace(normReel, 'NAAM').replace(/-?R\s?\d[\d  ]*/g, 'R#').replace(/\d+([,.]\d+)?/g, '#');
}

function taalTreffers(teks){
  var uit = [];
  RE.TAAL.forEach(function(r){
    if(r[1].test(teks) && !RE.uitgesonder(r[0], teks)) uit.push(r[0]);
  });
  if(RE.nieNie(teks).length && !RE.uitgesonder('nie-nie', teks)) uit.push('nie-nie');
  return uit;
}

/* ---------- een scenario ---------- */
function loopScenario(naam, n, basis){
  var sc = SC[naam], breuke = [], verbode = [];
  var sp = H.maakSpel({vang:function(t){
    var st = RE.toestand(sp.c);
    RE.VERBODE.forEach(function(v){
      if(v.in.indexOf(st) >= 0 && v.re.test(t))
        verbode.push({saad:sp.saad, o:sp.c.s.ouderdom, n:v.n + ' (' + st + ')', t:t});
    });
  }});
  var ouderdomme = 0;
  for(var i=0; i<n; i++){
    var gebreek = false;
    sp.speelLewe({saad:basis + i, voor:sc.voor, elke:sc.elke, erfgenaam:sc.erfgenaam,
      naJaar:function(c){
        if(gebreek) return;
        RE.INVARIANTE.forEach(function(f){
          if(gebreek) return;
          var r = f(c);
          if(r){ gebreek = true; breuke.push({saad:sp.saad, o:c.s.ouderdom, t:r}); }
        });
      }});
    ouderdomme += sp.c.s.ouderdom;
  }
  var taal = new Map();
  sp.tekste.forEach(function(x, t){
    var tr = taalTreffers(t); if(!tr.length) return;
    var k = sjabloon(t, sp.c);
    if(!taal.has(k)) taal.set(k, {reels:tr, t:t, saad:x.saad, bron:x.bron});
  });
  return {naam:naam, n:n, gem:ouderdomme/n, sp:sp, foute:sp.foute, breuke:breuke, verbode:verbode, taal:taal};
}

function wysLys(kop, lys, f){
  if(!lys.length) return;
  console.log('\n  ' + kop + ' (' + lys.length + ')');
  var gesien = {}, gewys = 0;
  lys.forEach(function(x){
    var k = f(x).sleutel; if(gesien[k] || gewys >= opt.wys) return;
    gesien[k] = 1; gewys++;
    console.log('    · ' + f(x).reel);
  });
}

/* ---------- modusse ---------- */
if(opt.modus==='lys'){
  Object.keys(SC).forEach(function(n){ console.log(n.padEnd(14) + SC[n].beskrywing); });
  process.exit(0);
}

if(opt.modus==='bron'){
  var c0 = H.maakKonteks(), treffers = {};
  H.skripte().concat(['dev.js']).forEach(function(f){
    fs.readFileSync(path.join(H.REPO, f), 'utf8').split('\n').forEach(function(reel, i){
      if(/^\s*(\/\*|\*|\/\/)/.test(reel)) return;
      (reel.match(/'(?:[^'\\]|\\.)*'/g) || []).forEach(function(lit){
        var t = lit.slice(1, -1);
        if(t.length < 4 || !/[A-Za-zÀ-ÿ]{3}/.test(t)) return;
        taalTreffers(t).forEach(function(r){ (treffers[r] = treffers[r] || []).push(f + ':' + (i+1) + '  ' + t); });
      });
    });
  });
  var k = Object.keys(treffers).sort();
  if(!k.length) console.log('Geen treffers in die bronkode nie.');
  k.forEach(function(r){
    console.log('\n--- ' + r + ' (' + treffers[r].length + ')');
    treffers[r].slice(0, 40).forEach(function(x){ console.log('   ' + x); });
  });
  console.log('\n(Die bron-skandering is net ’n wenk: ’n string-fragment is nie ’n hele sin nie, so vals treffers is normaal.)');
  process.exit(0);
}

if(opt.saad !== null){
  /* Een lewe, met sy hele log — om 'n fout na te speur. */
  var naam1 = name[0], sc1 = SC[naam1];
  var sp1 = H.maakSpel();
  var breuk1 = [];
  sp1.speelLewe({saad:opt.saad, voor:sc1.voor, elke:sc1.elke, erfgenaam:sc1.erfgenaam,
    naJaar:function(c){ RE.INVARIANTE.forEach(function(f){ var r = f(c); if(r) breuk1.push(c.s.ouderdom + ': ' + r); }); }});
  sp1.c.s.log.forEach(function(r){ console.log((r.k==='jaar' ? '\n' : '   ') + r.t); });
  console.log('\n=== ' + naam1 + ', saad ' + opt.saad + ': ' + sp1.c.s.naam + ' ' + sp1.c.s.van +
    ', ' + sp1.c.s.ouderdom + ' jaar, ' + (sp1.c.s.oorsaak || ''));
  sp1.foute.forEach(function(f){ console.log('\nCRASH (' + f.waar + ', ouderdom ' + f.ouderdom + ')\n' + f.fout); });
  breuk1.slice(0, 10).forEach(function(b){ console.log('INVARIANT: ' + b); });
  process.exit(sp1.foute.length || breuk1.length ? 1 : 0);
}

var basis = Math.floor(Math.random()*1e6) * 1000;
var resultate = name.map(function(n){ return loopScenario(n, opt.n, basis); });

if(opt.modus==='tekste'){
  var alles = new Map();
  resultate.forEach(function(r){ r.sp.tekste.forEach(function(x, t){
    var k = sjabloon(t, r.sp.c);
    if(!alles.has(k)) alles.set(k, {bron:x.bron, t:t, sc:r.naam, saad:x.saad, keer:0});
    alles.get(k).keer += x.keer;
  }); });
  var uit = [];
  alles.forEach(function(x){ uit.push([x.bron, x.keer, x.sc, x.saad, x.t.replace(/\n/g,' ⏎ ')].join('\t')); });
  uit.sort();
  console.log('bron\tkeer\tscenario\tsaad\tteks');
  console.log(uit.join('\n'));
  console.error(alles.size + ' unieke sjablone uit ' + resultate.length + ' scenario’s × ' + opt.n + ' lewens.');
  process.exit(0);
}

/* ---------- verslag ---------- */
var slegs = 0, taalAlles = new Map();
console.log('scenario       lewens  gem.ouderdom  crashes  invariante  verbode  taal');
resultate.forEach(function(r){
  r.taal.forEach(function(v, k){ if(!taalAlles.has(k)) taalAlles.set(k, {v:v, sc:r.naam}); });
  console.log(r.naam.padEnd(14) + String(r.n).padStart(6) + r.gem.toFixed(1).padStart(14) +
    String(r.foute.length).padStart(9) + String(r.breuke.length).padStart(12) +
    String(r.verbode.length).padStart(9) + String(r.taal.size).padStart(6));
  slegs += r.foute.length + r.breuke.length + r.verbode.length;
});
resultate.forEach(function(r){
  if(!r.foute.length && !r.breuke.length && !r.verbode.length) return;
  console.log('\n=== ' + r.naam);
  wysLys('CRASHES', r.foute, function(f){
    var kop = f.fout.split('\n').slice(0, 3).join(' | ');
    return {sleutel:f.fout.split('\n')[0], reel:'saad ' + f.saad + ', ouderdom ' + f.ouderdom + ' (' + f.waar + '): ' + kop}; });
  wysLys('INVARIANTE', r.breuke, function(b){
    return {sleutel:b.t.replace(/\d+/g,'#'), reel:'saad ' + b.saad + ', ouderdom ' + b.o + ': ' + b.t}; });
  wysLys('VERBODE TEKS', r.verbode, function(v){
    return {sleutel:v.n + sjabloon(v.t, r.sp.c), reel:'saad ' + v.saad + ', ouderdom ' + v.o + ' — ' + v.n + ': ' + v.t}; });
});
if(taalAlles.size){
  console.log('\n=== TAAL (' + taalAlles.size + ' sjablone)');
  var perReel = {};
  taalAlles.forEach(function(x){ x.v.reels.forEach(function(r){ (perReel[r] = perReel[r] || []).push(x); }); });
  Object.keys(perReel).sort().forEach(function(r){
    console.log('\n  ' + r + ' (' + perReel[r].length + ')');
    perReel[r].slice(0, opt.wys).forEach(function(x){
      var ekstra = r==='nie-nie' ? '   ⟶ ' + RE.nieNie(x.v.t).join(' | ') : '';
      console.log('    · [' + x.sc + ', saad ' + x.v.saad + '] ' + x.v.t.replace(/\n/g,' ⏎ ') + ekstra);
    });
  });
}
slegs += taalAlles.size;

/* ---------- ou stoor-lêer ---------- */
/* Elke nuwe veld moet 'n verstek in vulNuweVelde() kry. Hierdie lewe
   het net die velde wat Fase 1 geken het; dit moet laai en 40 jaar speel. */
if(!opt.s){
  var c = H.maakKonteks(), fout = null;
  ['wysModaal','wenk','renderAlles','renderKop','naOnder','wysGrafskrif'].forEach(function(f){
    c[f] = f==='wysModaal' ? function(t, x, o){ o = o && o.length ? o : [{}]; var k = o[0]; if(k.doen) k.doen(); else c.sluitModaal(); } : function(){};
  });
  c.localStorage.setItem(c.SLEUTEL, JSON.stringify({id:500, s:{
    naam:'Marko', van:'Botha', geslag:'m', dorp:c.DORPE[0], ouderdom:34, lewe:true, oorsaak:null,
    geluk:60, gesondheid:70, slim:55, voorkoms:50, geld:50000, totaalVerdien:400000, belegging:0,
    rykdom:'werkersklas', rykf:1, beroep:null, beroepeGehad:[], jareGewerk:4, aansoeke:0, pensioen:0,
    skool:{vlak:'klaar', graad:12, studie:null, jareOor:0, punte:62, matriek:true, grade:[], nagraads:[], uit:false},
    laerskool:null, hoerskool:null, uni:null, aansien:0,
    diere:[{id:'d1', soort:'Hond', naam:'Bliksem', e:'🐕', ouderdom:3, band:80, onderhoud:9500, maks:12}],
    verhoudings:[
      {id:1, naam:'Anel', van:'Botha', geslag:'v', ouderdom:60, band:80, voorkoms:50, lewe:true, tipe:'ma', raak:0},
      {id:2, naam:'Jaco', van:'Botha', geslag:'m', ouderdom:30, band:14, voorkoms:50, lewe:true, tipe:'broer', raak:0},
      {id:3, naam:'Lize', van:'Botha', geslag:'v', ouderdom:8, band:90, voorkoms:50, lewe:true, tipe:'dogter', raak:0}],
    bates:[], log:[], rekord:[], tronk:null, kinders:1, troues:1, gedoen:{}, vlagge:{}, tab:'lewe'}}));
  try{
    if(!c.laai()) fout = 'laai() het false teruggegee';
    for(var j=0; j<40 && !fout && c.s.lewe; j++) c.wordOuer();
  } catch(e){ fout = String(e && e.stack || e).split('\n').slice(0, 3).join(' | '); }
  console.log('\nou stoor-lêer (Fase 1-formaat): ' + (fout ? 'FOUT — ' + fout : 'laai en speel 40 jaar sonder foute'));
  if(fout) slegs++;
}

console.log(slegs ? '\n✗ ' + slegs + ' probleme. Speel een na met: node toets/toets.js -s <scenario> --saad <saad>'
                  : '\n✓ Alles skoon.');
process.exit(slegs ? 1 : 0);
