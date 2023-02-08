import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import { nanoid } from 'nanoid'

const socket = io.connect('http://localhost:8000')

function App() {
  const [name, setName] = useState("")
  const [chat, setChat] = useState([])
  const [message, setMessage] = useState("")

  const [sessionActive, setSessionActive] = useState(false)

  let sessionName = sessionStorage.getItem("name")
  useEffect(() => {
    if (!sessionName != "") {
      setSessionActive(true)
    }
  }, [sessionName, sessionActive])

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("chat", { "message": message, "user": sessionName })
    setMessage("")
  }

  const handleNameAdd = (e) => {
    // e.preventDefault()
    sessionStorage.setItem('name', name)
    setSessionActive(true)
  }

  useEffect(() => {
    socket.on('chat', (payload) => {
      setChat([...chat, payload])
    })
    console.log(chat)
  })


  return (
    <>
      <div className="p-10 flex justify-center bg-slate-300 h-screen w-screen">
        <div className='bg-white h-[100%] rounded-lg shadow-lg w-full lg:w-[60%]'>
          <div className='text-center font-bold text-lg p-5'>{sessionName ? `${sessionName?.toUpperCase()}` : ""} LET'S CHAT</div>

          {sessionActive ?
            <form onSubmit={handleNameAdd} className='flex flex-col gap-5 p-5'>
              <input type="text" name="name" onChange={e => setName(e.target.value)} value={name}
                className="border-2 rounded px-5 py-2"
                placeholder='ENTER YOUR NAME...'
              />
              <button className='bg-purple-600 text-white font-bold text-xl px-5 py-2'>
                JOIN CHAT
              </button>
            </form>
            :
            <div className='p-5 flex flex-col h-[79vh]'>
              <div className='h-[90%] overflow-y-auto'>
                <div className='flex gap-5 flex-col p-2'>
                  {chat.map((payload, index) => {
                    return (
                      <>
                        {
                          payload.user === sessionName ? <div className='bg-slate-200 w-max px-3 py-1 rounded self-end shadow-lg shadow-slate-300 flex items-center gap-1'><div className='text-xs opacity-40'>{payload.user}</div><div>{payload.message}</div></div> :
                            <div className='bg-purple-600 text-white w-max px-3 py-1 rounded shadow-lg shadow-slate-300 flex items-center gap-1'><div>{payload.message}</div><div className='text-xs opacity-40'>{payload.user}</div></div>
                        }
                      </>
                    )
                  })}

                </div>

              </div>
              <form onSubmit={sendMessage} action="" className='flex w-full items-center align-bottom'>
                <input className='focus:border-purple-600 border-2 px-5 py-2 w-[93%] hover:border-purple-300 transition-all ease-out duration-300' placeholder='type a message...' value={message}
                  onChange={e => setMessage(e.target.value)} type="text" />
                <button className='py-2 px-5 bg-purple-600 text-white font-bold text-xl w-auto'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                  </svg>
                </button>
              </form>
            </div>
          }

        </div>
      </div>
    </>
  )
}

export default App
