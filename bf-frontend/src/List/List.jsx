import axios from 'axios'
import React from 'react'
import "./List.css"


const Popup = ({ message, handleClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
       <p>{message}</p>
       <button onClick={handleClose}>X</button>
      </div>
    </div>
  )
}


const List = () => {
  
  const [listItems, setListItems] = React.useState([])

  const [enable,setEnable] = React.useState(true)

  const [showPopup, setShowPopup] = React.useState(false)

  const [popupMessage, setPopupMessage] = React.useState('')

  const submitVote = async (itemName) => {
    try {
      const userId = localStorage.getItem("user-id")
      const voteData = {
        userId: userId,
        itemName: itemName
      }

      const res = await axios.post(`http://localhost:2008/vote/${userId}`, voteData)

      if (res.data === "Already voted today")
      {
        setPopupMessage("You have already voted today.")
        setShowPopup(true)
      } 
      
      else 
      {
        const votedItem = listItems.find(item => item.itemName === itemName)
        if(votedItem) 
        {
          setPopupMessage(`Your vote has been added to ${votedItem.itemName}`)
          setShowPopup(true)
        }
      }
    } 
    
    catch(error) 
    {
      console.log("Error submitting vote:", error)
      setPopupMessage("Already voted")
      setShowPopup(true)
    }
  }


  const fetchData = async()=>{
    const res = await axios.get("http://localhost:2008/getbreakfastbytimestamp")
    setListItems(res.data)
  }


  React.useEffect(()=>{
    fetchData()
    
  },[])



  React.useEffect(() => {
    const interval = setInterval(()=>{
      const currentTime = new Date()
      const currentHour = currentTime.getHours()
      const currentMinutes = currentTime.getMinutes()
  
      if (currentHour === 11 && currentMinutes <= 59) {
        setEnable(true)
      } else {
        setEnable(false)
      }
    }, 1)

    return ()=> clearInterval(interval)
    },[])


    React.useEffect(() => {
      let timeoutId
      if(showPopup) 
      {
        timeoutId = setTimeout(() => 
        {
          setShowPopup(false)
        }, 5000)
      }
  
      return () => {
        clearTimeout(timeoutId)
      }
    }, [showPopup])


    const closePopup = () => {
      setShowPopup(false)
    }

  
  return (
    <div className='container'>

        <div className='vote-title'>
            {enable ? <p className='vote-bf'>Vote for your favorite Breakfast</p> : 
            <p className='timup-title'>Sorry, time up for voting</p>}

        </div>
    {listItems.length <= 0 ?  "Items List is empty" :

      <div className='list-items'>

        <ol className='list-items-list'>{listItems.map((item,index)=>{
          return <div key={index} className='item-in-list'>
            
            <img className='list-img' 
                src={item.image} alt={item.itemName} 
             />
            
            <button disabled={!enable} onClick={()=>submitVote(item.itemName)} 
               className='vote-button'>Vote</button>
            <p className='list-itemName'>{item.itemName} </p>

          </div>
        })}
        </ol>
      </div>  
    }

        {showPopup && <Popup message={popupMessage} 
            handleClose={closePopup} />}
      
    </div>
  )
}

export default List