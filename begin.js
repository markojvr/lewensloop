/* ==========================================================================
   10. AANVANG
   Die inskryfpunt. Hierdie lêer laai heel laaste, nadat al die ander
   lêers hul funksies en data gelaai het.
   Is daar 'n gestoorde lewe, gaan ons daarmee voort; anders begin ons voor.
   ========================================================================== */

if(laai() && s && s.lewe){ s.tab='lewe'; renderAlles(); naOnder(); }
else { wysBeginskerm(); }
