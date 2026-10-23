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
