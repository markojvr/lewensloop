/* ==========================================================================
   1. HULPMIDDELS
   Klein funksies wat die hele spel gebruik: lukrake getalle, kanse,
   geldformatering. Hierdie lêer laai eerste en hang van niks af.
   ========================================================================== */

function R(n){ return Math.floor(Math.random()*n); }
function tussen(a,b){ return a + R(b-a+1); }
function kies(a){ return a[R(a.length)]; }
function kans(p){ return Math.random()*100 < p; }
function klem(v,lo,hi){ lo=(lo===undefined?0:lo); hi=(hi===undefined?100:hi);
  return Math.max(lo,Math.min(hi,Math.round(v))); }
function geld(n){
  var neg = n<0; n = Math.abs(Math.round(n));
  return (neg?'-R':'R') + String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
}
function kortGeld(n){
  var a = Math.abs(n);
  if(a>=1e9) return (n<0?'-':'')+'R'+(Math.abs(n)/1e9).toFixed(1).replace('.',',')+' mrd';
  if(a>=1e6) return (n<0?'-':'')+'R'+(Math.abs(n)/1e6).toFixed(1).replace('.',',')+' m';
  return geld(n);
}
/* 7.5 word "7,5" — Afrikaans skryf 'n desimale komma, nie 'n punt nie. */
function persent(n){ return String(Math.round(n*10)/10).replace('.',','); }
function el(id){ return document.getElementById(id); }
/* Kies een item uit 'n lys waar elke item sy eie gewig het: 'n item met
   gewig 20 kom tien keer so dikwels as een met gewig 2. Fase 5 gebruik
   dit om 'n siekte te kies — 'n roker kry longsiekte, 'n nie-roker
   byna nooit. */
function kiesGeweeg(lys, gewigF){
  var som=0, g=[];
  lys.forEach(function(x){ var w = Math.max(0, gewigF(x)); g.push(w); som += w; });
  if(som<=0) return null;
  var r = Math.random()*som;
  for(var i=0;i<lys.length;i++){ r -= g[i]; if(r<=0) return lys[i]; }
  return lys[lys.length-1];
}

/* ==========================================================================
   O — TAALHULPMIDDELS
   Byna al die speler-sigbare teks in die spel word met
   string-konkatenasie gebou, en dit is presies waar die taalfoute
   inkruip: "1 jare", "2 dier(e)", "Anna en Jan en Pieter", "sy 2e jaar".
   Hierdie vier funksies vat elkeen van daardie foute op EEN plek vas,
   sodat die res van die spel dit net kan gebruik.
   ========================================================================== */

/* Enkelvoud of meervoud volgens die getal: meerv(1,'jaar','jare') gee
   "1 jaar", meerv(3,'jaar','jare') gee "3 jare". Laat die getal weg met
   'n vierde argument van true as jy net die woord wil hê. */
function meerv(n, enkel, meervoud, sonderGetal){
  var w = (Math.abs(n)===1) ? enkel : meervoud;
  return sonderGetal ? w : (n + ' ' + w);
}
/* 'n Lys name soos Afrikaans dit skryf: "Anna", "Anna en Jan",
   "Anna, Jan en Pieter" — nie "Anna en Jan en Pieter" nie. */
function lysTeks(lys, voegwoord){
  var a = (lys||[]).filter(function(x){ return x!==undefined && x!==null && x!==''; })
    .map(function(x){ return String(x); });
  if(!a.length) return '';
  if(a.length===1) return a[0];
  return a.slice(0,-1).join(', ') + ' ' + (voegwoord||'en') + ' ' + a[a.length-1];
}
/* Afrikaanse ranggetalle: 1ste, 2de, 3de, 4de … — nie "1e" of "2e" nie. */
function rangTel(n){
  n = Math.round(n);
  if(n===1) return '1ste';
  if(n===8) return '8ste';
  if(n>=20 && n%10===1) return n + 'ste';
  if(n>=20 && n%10===8) return n + 'ste';
  return n + 'de';
}
/* Maak die eerste letter 'n hoofletter — vir 'n frase wat aan die begin
   van 'n sin ingeplak word. */
function hoofletter(t){
  t = String(t||'');
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : t;
}
