// Sidebar submenus
document.querySelectorAll('.sidebar .has-sub').forEach(item=>{
  item.addEventListener('click',e=>{
    item.classList.toggle('open')
    const ul = item.querySelector('ul')
    if(!ul) return
    if(ul.style.display==='block') ul.style.display='none'
    else ul.style.display='block'
  })
})