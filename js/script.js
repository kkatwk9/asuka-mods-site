document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.sidebar .has-sub').forEach(item=>{
    item.addEventListener('click', ()=>{
      const ul = item.querySelector('ul')
      if(!ul) return
      ul.style.display = (ul.style.display === 'block') ? 'none' : 'block'
    })
  })

  // lazy-load картинок (если используешь data-src)
  document.querySelectorAll('img').forEach(img=>{
    if(img.dataset && img.dataset.src && !img.src){
      img.src = img.dataset.src
    }
  })
})

