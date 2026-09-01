(function(){
  var eventDate=new Date("2026-11-06T17:00:00-08:00").getTime(),d=document.getElementById("days"),h=document.getElementById("hours"),m=document.getElementById("minutes"),s=document.getElementById("seconds");
  function update(){var r=Math.max(0,eventDate-Date.now());d.textContent=String(Math.floor(r/86400000)).padStart(3,"0");h.textContent=String(Math.floor(r/3600000%24)).padStart(2,"0");m.textContent=String(Math.floor(r/60000%60)).padStart(2,"0");s.textContent=String(Math.floor(r/1000%60)).padStart(2,"0")}update();setInterval(update,1000);
  var menuToggle=document.querySelector(".menu-toggle");
  if(menuToggle)menuToggle.addEventListener("click",function(){document.querySelector(".menu").classList.toggle("open")});
  document.addEventListener("click",function(event){
    var question=event.target.closest(".faq-question");
    if(question){var item=question.closest(".faq-item");if(item)item.classList.toggle("open");return}
    var more=event.target.closest(".faq-more");
    if(more){var extra=document.getElementById(more.getAttribute("aria-controls")),open=!more.classList.contains("open"),label=more.querySelector(".more-label");more.classList.toggle("open",open);more.setAttribute("aria-expanded",open?"true":"false");if(extra){extra.classList.toggle("open",open);if(!open)extra.querySelectorAll(".faq-item.open").forEach(function(item){item.classList.remove("open")})}if(label)label.textContent=open?more.dataset.less:more.dataset.more}
  });
  document.querySelectorAll(".menu a").forEach(function(link){link.addEventListener("click",function(){document.querySelector(".menu").classList.remove("open")})});
  var applyModal=document.getElementById("apply-modal"),applyClose=document.querySelector(".apply-close");
  function openApply(event){
    if(!applyModal)return;
    event.preventDefault();
    applyModal.classList.add("open");
    applyModal.setAttribute("aria-hidden","false");
    document.documentElement.style.overflow="hidden";
  }
  function closeApply(){
    if(!applyModal)return;
    applyModal.classList.remove("open");
    applyModal.setAttribute("aria-hidden","true");
    document.documentElement.style.overflow="";
  }
  document.querySelectorAll(".apply-link").forEach(function(link){link.addEventListener("click",openApply)});
  if(applyClose)applyClose.addEventListener("click",closeApply);
  if(applyModal)applyModal.addEventListener("click",function(event){if(event.target===applyModal)closeApply()});
  document.addEventListener("keydown",function(event){if(event.key==="Escape")closeApply()});
  var carousel=document.querySelector(".track-carousel");
  if(carousel){
    var trackCards=[].slice.call(carousel.querySelectorAll(".track")),trackDots=carousel.querySelector(".track-dots"),trackIndex=0;
    trackCards.forEach(function(card,i){
      var dot=document.createElement("button");
      dot.className="track-dot";
      dot.type="button";
      dot.setAttribute("aria-label","Show track "+(i+1));
      dot.addEventListener("click",function(){setTrack(i)});
      trackDots.appendChild(dot);
    });
    function setTrack(index){
      trackIndex=(index+trackCards.length)%trackCards.length;
      trackCards.forEach(function(card,i){
        var offset=(i-trackIndex+trackCards.length)%trackCards.length;
        card.classList.remove("is-active","is-prev","is-next","is-far-prev","is-far-next");
        if(offset===0)card.classList.add("is-active");
        if(offset===1)card.classList.add("is-next");
        if(offset===trackCards.length-1)card.classList.add("is-prev");
        if(offset===2)card.classList.add("is-far-next");
        if(offset===trackCards.length-2)card.classList.add("is-far-prev");
        card.setAttribute("aria-hidden",offset===0?"false":"true");
      });
      [].slice.call(trackDots.children).forEach(function(dot,i){
        dot.classList.toggle("is-active",i===trackIndex);
        dot.setAttribute("aria-current",i===trackIndex?"true":"false");
      });
    }
    carousel.querySelector(".prev").addEventListener("click",function(){setTrack(trackIndex-1)});
    carousel.querySelector(".next").addEventListener("click",function(){setTrack(trackIndex+1)});
    carousel.addEventListener("keydown",function(event){
      if(event.key==="ArrowLeft")setTrack(trackIndex-1);
      if(event.key==="ArrowRight")setTrack(trackIndex+1);
    });
    setTrack(0);
  }
  if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    document.documentElement.classList.add("motion-ready");
    var sectionObserver=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){entry.target.classList.toggle("in-view",entry.isIntersecting)});
    },{rootMargin:"-16% 0px -18% 0px",threshold:.12});
    document.querySelectorAll("section.content,.dna-bridge,.vessel-divider").forEach(function(section){sectionObserver.observe(section)});
  }else{
    document.querySelectorAll("section.content,.dna-bridge,.vessel-divider").forEach(function(section){section.classList.add("in-view")});
  }
  var hero=document.querySelector(".hero"),hackResult=document.querySelector(".hack-result"),eventStrip=document.querySelector(".event-strip"),titleEcg=document.querySelector(".title-ecg"),buildCircle=document.querySelector(".build-circle"),ticking=false;
  var revealLines=["Build the unexpected","Health is a team sport","Prototype the possible"];
  var revealIndex=-1,revealArmed=true;
  function syncEcgPowerLine(){
    if(!titleEcg||!buildCircle)return;
    titleEcg.style.removeProperty("width");
    var ecgRect=titleEcg.getBoundingClientRect(),circleRect=buildCircle.getBoundingClientRect();
    var targetX=circleRect.left+2;
    var dynamicWidth=Math.floor(targetX-ecgRect.left);
    var maxWidth=Math.max(40,window.innerWidth-ecgRect.left-18);
    dynamicWidth=Math.max(40,Math.min(dynamicWidth,maxWidth));
    titleEcg.style.setProperty("--ecg-width",dynamicWidth+"px");
  }
  function breakHero(){
    var rect=hero.getBoundingClientRect(),distance=Math.min(hero.offsetHeight*.58,560);
    var progress=Math.max(0,Math.min(1,-rect.top/distance));
    if(progress>.22&&revealArmed){
      revealIndex=(revealIndex+1)%revealLines.length;
      hackResult.textContent=revealLines[revealIndex];
      hackResult.classList.toggle("team-sport",revealLines[revealIndex]==="Health is a team sport");
      revealArmed=false;
    }
    if(progress<.06)revealArmed=true;
    var heroRect=hero.getBoundingClientRect(),stripRect=eventStrip.getBoundingClientRect();
    var centerX=hero.offsetWidth/2,centerY=hero.offsetHeight*.48;
    var landingX=(stripRect.left-heroRect.left)+(stripRect.width/2);
    var stripBottom=stripRect.bottom-heroRect.top;
    var grayEnd=hero.offsetHeight-95;
    var landingY=stripBottom+((grayEnd-stripBottom)*.64);
    var dropProgress=Math.max(0,Math.min(1,(progress-.2)/.55));
    var resultX=centerX+(landingX-centerX)*dropProgress;
    var resultY=centerY+(landingY-centerY)*dropProgress;
    hero.style.setProperty("--result-x",resultX+"px");
    hero.style.setProperty("--result-y",resultY+"px");
    hero.style.setProperty("--break",progress.toFixed(3));
    syncEcgPowerLine();
    ticking=false;
  }
  window.addEventListener("scroll",function(){if(!ticking){requestAnimationFrame(breakHero);ticking=true}},{passive:true});
  window.addEventListener("resize",breakHero);
  window.addEventListener("load",breakHero);
  breakHero();
})();
