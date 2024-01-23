import React from 'react'
import "./Items.css"
import axios from 'axios'
import upload_area from "../assets/upload_area.svg"


const Items = () => {

  const [image,setImage] =React.useState(false)

  const imageHandler = (e)=>{
    setImage(e.target.files[0])
  }

  const [addItem,setAddItem] = React.useState({
    itemName:"",
    image:""
  })

  const [listItems, setListItems] = React.useState([])


  const fetchData = async()=>{
    const res = await axios.get("http://localhost:2008/getBreakfastByTimestamp")
    setListItems(res.data)
  }

  React.useEffect(()=>{
    fetchData()
     
  },[])

  const changeHandler = (e) =>{
    setAddItem({...addItem, [e.target.name]:e.target.value})
  }

  const senReq = async()=>{

    const formData = new FormData();
    formData.append('product', image);

    const imageResponse = await axios.post('http://localhost:2008/upload', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data' 
      }
    })

    return await axios.post("http://localhost:2008/addbreakfast",{
      itemName:String(addItem.itemName),
      image: imageResponse.data.image_url
    })
    .then(res=>res.data)
  }

 

  const submitHandler = async(e)=>{
    console.log(addItem)
    
      await senReq()
      setAddItem({ itemName: "",image: null })
      setImage(null)
      fetchData()
  }

  return (
    <div className='container'>
    <div className='menu'>
        <input type='text' name='itemName'
          value={addItem.itemName}
          onChange={changeHandler}
          placeholder='Enter Breakfast Name'
           />

      <label htmlFor='file-input'>
        <img src={image ? URL.createObjectURL(image) : upload_area} alt='' width="80px" />
      </label>
      <input  type='file' name='image' id='file-input' hidden onChange={imageHandler} />


        <button onClick={submitHandler} >ADD</button>
    </div>

    <div >
        <ol className='items'>{listItems.map((item,index)=>{
          return <div key={index} className='item'>
            <li>{item.itemName}</li>
            {item.image && <img  src={item.image} alt={item.itemName} height="180px" width="220px" />}
          </div>
        })}
        </ol>
      </div>

    </div>
  )
}

export default Items