// js/script.js — ASUKA interactive + admin (localStorage)
// Minimal, dependency-free
(function(){
  const $ = (s, r=document)=>r.querySelector(s);
  const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));
  const uid = ()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);

  // default dataset (only used if nothing in storage)
  const defaultData = {
    redux: [
      {id: uid(), title: "BOOM REDUX V3", thumb: "https://via.placeholder.com/640x360.png?text=BOOM", desc: "Описание BOOM REDUX V3", download:"#", youtube:"", category:"redux"},
      {id: uid(), title: "KATANA V2 REDUX", thumb: "https://via.placeholder.com/640x360.png?text=KATANA", desc: "Описание KATANA", download:"#", youtube:"", category:"redux"}
    ],
    clothes: [
      {id: uid(), title:"Sample Jacket", thumb:"https://via.placeholder.com/640x360.png?text=JACKET", desc:"A sample cloth", download:"#", youtube:"", category:"clothes"}
    ],
    trees: [
      {id: uid(), title:"Pine Pack", thumb:"https://via.placeholder.com/640x360.png?text=PINE", desc:"Pine trees", download:"#", youtube:"", category:"trees"}
    ],
    mods: []
  };

  const STORE_KEY = "asuka_data_v1";
  const ADMIN_KEY = "asuka_admin_pass";
  const DEFAULT_ADMIN_PASS = "asuka123";

  function loadData(){
    try{
      const raw = localStorage.getItem(STORE_KEY);
      if(!raw){ localStorage.setItem(STORE_KEY, JSON.stringify(defaultData)); return JSON.parse(JSON.stringify(defaultData)); }
      return JSON.parse(raw);
    }catch(e){ console.warn(e); localStorage.setItem(STORE_KEY, JSON.stringify(defaultData)); return JSON.parse(JSON.stringify(defaultData)); }
  }
  function saveData(obj){ localStorage.setItem(STORE_KEY, JSON.stringify(obj)); }

  let data = loadData();
  let currentCategory = "redux";

  function renderCatalog(cat){
    currentCategory = cat;
    const container = document.querySelector(".catalog");
    if(!container) return;
    container.innerHTML = "";
    const arr = data[cat]||[];
    if(arr.length===0){ container.innerHTML = `<div style="color:#bbb;padding:18px">В этой категории пока нет элементов.</div>`; return; }
    arr.forEach(item=>{
      const a = document.createElement("a");
      a.className = "card";
      a.href = "javascript:void(0)";
      a.dataset.id = item.id;
      a.innerHTML = `<div class="thumb"><img src="${item.thumb}" alt="${item.title}"></div><div class="card-title">${item.title}</div>`;
      a.addEventListener("click", ()=> openItem(item.id));
      container.appendChild(a);
    });
  }

  function openItem(id){
    const all = Object.values(data).flat();
    const it = all.find(x=>x.id===id);
    if(!it) return alert("Элемент не найден");
    $("#modalTitle").textContent = it.title;
    $("#modalDesc").textContent = it.desc || "";
    const v = $("#modalVideo");
    v.innerHTML = "";
    if(it.youtube){
      v.innerHTML = `<iframe width="100%" height="420" src="https://www.youtube.com/embed/${encodeURIComponent(it.youtube)}" frameborder="0" allowfullscreen></iframe>`;
    }
    const dl = $("#modalDownloads");
    dl.innerHTML = "";
    if(it.download){
      const a = document.createElement("a");
      a.href = it.download;
      a.target = "_blank";
      a.className = "download-btn";
      a.textContent = "Download";
      dl.appendChild(a);
    }
    $("#itemModal").style.display = "flex";
    $("#itemModal").setAttribute("aria-hidden","false");
  }

  function closeModal(){
    $("#itemModal").style.display = "none";
    $("#itemModal").setAttribute("aria-hidden","true");
    $("#modalVideo").innerHTML = "";
  }

  function attachSidebar(){
    // attach clicks to li[data-cat] and plain li text mapping
    $$("li[data-cat]").forEach(li=>{
      li.style.cursor = "pointer";
      li.addEventListener("click", ()=> renderCatalog(li.getAttribute("data-cat")));
    });
    // also items where text equals category name (fallback)
    $$(".side-nav li").forEach(li=>{
      if(!li.hasAttribute("data-cat")){
        const txt = (li.textContent||"").trim().toLowerCase();
        const map = {trees:"trees", redux:"redux", clothes:"clothes", mods:"mods"};
        if(map[txt]){ li.style.cursor="pointer"; li.addEventListener("click", ()=> renderCatalog(map[txt])); }
      }
    });
  }

  // ADMIN logic
  function toggleAdmin(){
    const panel = $("#adminPanel");
    if(panel.style.display === "block"){ panel.style.display = "none"; return; }
    const saved = localStorage.getItem(ADMIN_KEY) || DEFAULT_ADMIN_PASS;
    const entered = prompt("Admin password:");
    if(!entered) return;
    if(entered !== saved){ alert("Wrong password"); return; }
    panel.style.display = "block";
    renderAdminList();
  }

  function renderAdminList(){
    const wrap = $("#adminList");
    wrap.innerHTML = "";
    Object.keys(data).forEach(cat=>{
      const h = document.createElement("h4"); h.textContent = cat.toUpperCase(); wrap.appendChild(h);
      data[cat].forEach(item=>{
        const row = document.createElement("div"); row.style.display="flex"; row.style.justifyContent="space-between"; row.style.gap="8px"; row.style.alignItems="center";
        const left = document.createElement("div"); left.textContent = item.title; left.style.flex="1";
        const edit = document.createElement("button"); edit.textContent="Edit"; edit.dataset.edit=item.id;
        const del = document.createElement("button"); del.textContent="Delete"; del.dataset.del=item.id;
        row.appendChild(left); row.appendChild(edit); row.appendChild(del);
        wrap.appendChild(row);
      });
    });
    // handlers
    $$("button[data-edit]", wrap).forEach(b=>b.addEventListener("click", e=> fillAdminForm(e.target.dataset.edit)));
    $$("button[data-del]", wrap).forEach(b=>b.addEventListener("click", e=> { if(confirm("Удалить?")) deleteItem(e.target.dataset.del); }));
  }

  function fillAdminForm(id){
    const all = Object.values(data).flat();
    const it = all.find(x=>x.id===id);
    if(!it) return alert("Not found");
    const f = $("#adminForm");
    f.id.value = it.id;
    f.title.value = it.title;
    f.thumb.value = it.thumb;
    f.desc.value = it.desc;
    f.download.value = it.download||"";
    f.youtube.value = it.youtube||"";
    f.category.value = it.category;
    window.scrollTo({top:0, behavior:"smooth"});
  }

  function deleteItem(id){
    Object.keys(data).forEach(cat=> data[cat] = data[cat].filter(x=>x.id!==id));
    saveData(data); renderAdminList(); if(currentCategory) renderCatalog(currentCategory);
  }

  function resetAdminForm(){
    const f = $("#adminForm");
    f.reset();
    f.id.value = "";
  }

  function exportJSON(){
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "asuka_data.json"; a.click();
  }

  function importJSON(file){
    const r = new FileReader();
    r.onload = e=>{
      try{
        const obj = JSON.parse(e.target.result);
        if(typeof obj !== "object") throw new Error("Invalid");
        data = Object.assign({}, obj);
        saveData(data); renderAdminList(); if(currentCategory) renderCatalog(currentCategory); alert("Imported");
      }catch(err){ alert("Import error: "+err.message); }
    };
    r.readAsText(file);
  }

  // admin form submit
  function onAdminSubmit(e){
    e.preventDefault();
    const f = e.target;
    const id = f.id.value || uid();
    const item = {
      id,
      title: f.title.value,
      thumb: f.thumb.value || "https://via.placeholder.com/640x360.png?text=No+image",
      desc: f.desc.value,
      download: f.download.value,
      youtube: f.youtube.value,
      category: f.category.value
    };
    // remove existing with same id (if edited)
    Object.keys(data).forEach(cat=> data[cat] = data[cat].filter(x=>x.id!==id));
    data[item.category] = data[item.category] || [];
    data[item.category].unshift(item);
    saveData(data);
    resetAdminForm(); renderAdminList(); if(currentCategory===item.category) renderCatalog(currentCategory);
  }

  // init UI and events
  function init(){
    attachSidebar();
    renderCatalog(currentCategory);

    // modal
    $("#modalClose").addEventListener("click", closeModal);
    $("#itemModal").addEventListener("click", e=> { if(e.target.classList.contains("modal-backdrop")) closeModal(); });

    // create Toggle Admin button
    const btn = document.createElement("button");
    btn.textContent = "Toggle Admin";
    btn.style.position = "fixed"; btn.style.right = "12px"; btn.style.bottom = "12px";
    btn.style.zIndex = 9999; btn.style.background="#222"; btn.style.color="#fff"; btn.style.border="1px solid rgba(255,255,255,0.04)";
    btn.style.padding="8px 10px"; btn.style.borderRadius="8px"; document.body.appendChild(btn);
    btn.addEventListener("click", toggleAdmin);

    // admin listeners
    $("#adminForm").addEventListener("submit", onAdminSubmit);
    $("#adminCancel").addEventListener("click", resetAdminForm);
    $("#exportBtn").addEventListener("click", exportJSON);
    $("#importFile").addEventListener("change", e=> { if(e.target.files[0]) importJSON(e.target.files[0]); });

    // keyboard quick open (optional): press 'a' to open admin prompt
    document.addEventListener("keydown", e=> {
      if(e.key === "/" && !e.ctrlKey && !e.metaKey){ e.preventDefault(); const q = prompt("Search (title contains)"); if(q){ searchAndOpen(q); } }
    });
  }

  function searchAndOpen(q){
    q = q.toLowerCase();
    const all = Object.values(data).flat();
    const found = all.find(x=> (x.title||"").toLowerCase().includes(q));
    if(found) openItem(found.id); else alert("Not found");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
