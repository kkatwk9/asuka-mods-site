import React, {useState, useEffect} from 'react'

const defaultCards = [
  {id:1,title:'BOOM REDUX V3',thumb:'/placeholder.png',slug:'boom-redux-v3'},
  {id:2,title:'KATANA V2 REDUX',thumb:'/placeholder.png',slug:'katana-v2'}
]

function App(){
  const [cards, setCards] = useState(()=>{
    try{
      const t = localStorage.getItem('asuka_cards')
      return t? JSON.parse(t): defaultCards
    }catch(e){ return defaultCards }
  })
  useEffect(()=>{
    localStorage.setItem('asuka_cards', JSON.stringify(cards))
  },[cards])

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">ASUKA-MODS</h1>
          <a className="px-3 py-1 bg-indigo-600 rounded" href="#/admin">Admin</a>
        </header>

        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cards.map(c=> (
            <article key={c.id} className="bg-gray-800 p-4 rounded-lg shadow">
              <div className="h-40 bg-gray-700 rounded overflow-hidden flex items-center justify-center">
                <img src={c.thumb} alt={c.title} className="object-cover h-full w-full"/>
              </div>
              <h3 className="mt-3 font-semibold">{c.title}</h3>
            </article>
          ))}
        </section>

        <AdminPanel cards={cards} setCards={setCards} />
      </div>
    </div>
  )
}

function AdminPanel({cards,setCards}){
  const [open,setOpen] = useState(false)
  const [title,setTitle] = useState('')
  function addCard(){
    if(!title.trim()) return
    const id = Date.now()
    setCards([{id,title,thumb:'/placeholder.png',slug:title.toLowerCase().replace(/\s+/g,'-')},...cards])
    setTitle('')
  }
  return (
    <div className="mt-8">
      <button onClick={()=>setOpen(!open)} className="px-3 py-1 bg-gray-700 rounded">Toggle Admin</button>
      {open && (
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <h4 className="font-bold mb-2">Admin — Управление карточками</h4>
          <div className="flex gap-2">
            <input value={title} onChange={(e)=>setTitle(e.target.value)} className="px-2 py-1 bg-gray-700 rounded flex-1" placeholder="Название карточки"/>
            <button onClick={addCard} className="px-3 py-1 bg-indigo-600 rounded">Добавить</button>
          </div>
          <div className="mt-3 space-y-2">
            {cards.map(c=> (
              <div key={c.id} className="flex items-center gap-2">
                <div className="flex-1">{c.title}</div>
                <button onClick={()=>{
                  setCards(cards.filter(x=>x.id!==c.id))
                }} className="px-2 py-1 bg-red-600 rounded">Удалить</button>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <button onClick={()=>{
              const a = document.createElement('a')
              const blob = new Blob([JSON.stringify(cards, null, 2)], {type:'application/json'})
              a.href = URL.createObjectURL(blob)
              a.download = 'asuka_cards.json'
              a.click()
            }} className="px-3 py-1 bg-green-600 rounded">Экспорт JSON</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
