
const loader=document.getElementById("loader");
const intro=document.getElementById("intro");
const startBtn=document.getElementById("startBtn");
const openBook=document.getElementById("openBook");
const bookContainer=document.getElementById("bookContainer");
const flipbook=document.getElementById("flipbook");
const bgMusic=document.getElementById("bgMusic");
const flipSound=document.getElementById("flipSound");

intro.style.display="none";

startBtn.addEventListener("click",()=>{
  loader.style.display="none";
  intro.style.display="flex";
});

openBook.addEventListener("click",async ()=>{
  intro.style.display="none";
  bookContainer.style.display="block";

  try{ await bgMusic.play(); }catch(e){ console.log("Music blocked:",e); }

  renderPDF("magazine.pdf");
});

async function renderPDF(url){
  flipbook.innerHTML="<p style='padding:20px;color:white'>Loading magazine...</p>";

  const pdf=await pdfjsLib.getDocument(url).promise;
  flipbook.innerHTML="";

  for(let i=1;i<=pdf.numPages;i++){
    const page=await pdf.getPage(i);
    const viewport=page.getViewport({scale:1.6});

    const canvas=document.createElement("canvas");
    const ctx=canvas.getContext("2d");
    canvas.width=viewport.width;
    canvas.height=viewport.height;

    await page.render({
      canvasContext:ctx,
      viewport:viewport
    }).promise;

    const pageDiv=document.createElement("div");
    pageDiv.appendChild(canvas);
    flipbook.appendChild(pageDiv);
  }

  if(typeof $("#flipbook").turn==="function"){
    $("#flipbook").turn({
      width:1000,
      height:700,
      autoCenter:true,
      gradients:true,
      elevation:50,
      when:{
        turning:function(){
          try{flipSound.currentTime=0;flipSound.play();}catch(e){}
        }
      }
    });
  }else{
    console.warn("turn.js not loaded. Pages are displayed without flip animation.");
  }
}
