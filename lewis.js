(function(){
var O=JSON.stringify({width:-1,height:-1,bondLineWidth:1.5,padding:.12,addStereoAnnotation:false,addAtomIndices:false,explicitMethyl:false,atomColourPalette:{6:[.17,.24,.31],7:[.13,.46,.78],8:[.75,.22,.17],9:[.15,.68,.38],15:[.9,.49,.13],16:[.79,.64,0],17:[.09,.63,.52],35:[.65,.4,.25],53:[.56,.27,.68],5:[.83,.33,0],14:[.5,.55,.55],1:[.5,.5,.5]}});
var OH=JSON.stringify({width:-1,height:-1,bondLineWidth:1.5,padding:.12,addChiralHs:true,addStereoAnnotation:false,addAtomIndices:false,explicitMethyl:false,atomColourPalette:{6:[.17,.24,.31],7:[.13,.46,.78],8:[.75,.22,.17],9:[.15,.68,.38],15:[.9,.49,.13],16:[.79,.64,0],17:[.09,.63,.52],35:[.65,.4,.25],53:[.56,.27,.68],5:[.83,.33,0],14:[.5,.55,.55],1:[.5,.5,.5]}});
function pd(s){var w=s.match(/\bwidth=["']([0-9.]+)px?["']/),h=s.match(/\bheight=["']([0-9.]+)px?["']/);return{w:w?parseFloat(w[1]):300,h:h?parseFloat(h[1]):300}}
function iv(s){return s.replace(/^[\s\S]*?<svg[^>]*>/i,'').replace(/<\/svg>\s*$/i,'')}
function eh(s){return(s||'').replace(/[&<>"']/g,function(m){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]})}
function run(RDKit){
  var els=Array.prototype.slice.call(document.querySelectorAll('.mol-canvas[data-smiles]'));
  if(!els.length)return;
  var dW=els[0].clientWidth||280;
  var rd=els.map(function(el){
    var sm=el.getAttribute('data-smiles'),xh=el.getAttribute('data-explicit-h')==='true',eW=el.clientWidth||dW;
    try{
      var svg,m;
      if(xh){m=RDKit.get_mol(sm);if(!m)throw 0;var s2=m.add_hs();m.delete();m=RDKit.get_mol(s2);if(!m)throw 0;svg=m.get_svg_with_highlights(OH);m.delete();}
      else{m=RDKit.get_mol(sm);if(!m)throw 0;svg=m.get_svg_with_highlights(O);m.delete();}
      var d=pd(svg);return{el:el,in:iv(svg),w:d.w,h:d.h,eW:eW};
    }catch(e){return{el:el,err:true,sm:sm,eW:eW}}
  });
  var mW=0;rd.forEach(function(d){if(!d.err)mW=Math.max(mW,d.w)});
  var cp=rd.map(function(d){var c=d.el.querySelector('.mol-caption');if(c)return c.outerHTML;var t=d.el.getAttribute('data-caption')||'';return t?'<div class="mol-caption">'+eh(t)+'</div>':''});
  rd.forEach(function(d,i){
    if(d.err){d.el.innerHTML='<div class="mol-error">\u26a0 '+eh((d.sm||'').substring(0,40))+'</div>'+cp[i];return}
    var sc=d.eW/(mW*0.59),sw=(d.w*sc).toFixed(1),sh=(d.h*sc).toFixed(1);
    d.el.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+d.w+' '+d.h+'" width="'+sw+'" height="'+sh+'" style="display:block;margin:10px auto 0"><rect width="'+d.w+'" height="'+d.h+'" fill="#fff"/>'+ d.in+'</svg>'+cp[i];
  });
}
if(window.__lewisLoaded)return;window.__lewisLoaded=true;
function ls(u,ok,no){var s=document.createElement('script');s.src=u;s.onload=ok;s.onerror=no;document.head.appendChild(s)}
var cdn=['https://unpkg.com/@rdkit/rdkit/dist/RDKit_minimal.js','https://cdn.jsdelivr.net/npm/@rdkit/rdkit/dist/RDKit_minimal.js'],ci=0;
function go(){if(ci>=cdn.length)return;ls(cdn[ci++],function(){if(typeof window.initRDKitModule!=='function'){go();return}window.initRDKitModule().then(function(R){window.__RDKit=R;run(R)}).catch(go)},go)}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',go):go();
})();
