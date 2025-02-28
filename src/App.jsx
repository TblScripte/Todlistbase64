import axios from "axios";
import { useEffect, useState } from "react";

const api = "https://to-dos-api.softclub.tj/api/to-dos";

const App = () => {
  const [serverData, setServerData] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [name1, setName1] = useState("");
  const [desc1, setDesc1] = useState("");
  const [file, setFile] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [dialog1, setDialog1] = useState(false);
  const [dialog3, setDialog3] = useState(false);
  const [id, setId] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [idx,setIdx] = useState(false)
  const [dialog2, setDialog2] = useState(false);
  const [date, setDate] = useState({});
  const [images,setImages] = useState(null)

  async function Get() {
    try {
      const { data } = await axios.get(api);
      setServerData(data.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function Del(id) {
    try {
      const { data } = await axios.delete(`${api}?id=${id}`);
      Get();
    } catch (error) {
      console.error(error);
    }
  }

  async function Edit1() {
    try {
      const { data } = await axios.put(api, { name: name1, description: desc1, id });
      Get();
      setDialog1(false);
    } catch (error) {
      console.error(error);
    }
  }

  const FileChange = (e) => {
    const selectedFiles = e.target.files;
    setImages(selectedFiles);
    const previews = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === selectedFiles.length) {
          setImagePreviews(previews); 
        }
      };
      reader.readAsDataURL(selectedFiles[i]);
    }
  };

  const AddPhoto = async() =>{
    const formatData = new FormData()
    for(let i=0;i<images.length;i++){
      formatData.append("Images",images[i])
    }
    try {
      await axios.post(`${api}/${idx}/images`,formatData)
      Get()
      setDialog3(false)
      setImagePreviews([])
      setIdx("")
    } catch (error) {
      console.error(error);
    }
  }


  async function Add() {
    const formdata = new FormData();
    formdata.append("Name", name);
    formdata.append("Description", desc);
    for (let i = 0; i < file.length; i++) {
      formdata.append("Images", file[i]);
    }
    try {
      const { data } = await axios.post(api, formdata);
      Get();
      setDialog(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function Info(id) {
    try {
      const { data } = await axios.get(`${api}/${id}`);
      setDate(data.data);
      setDialog2(true);
    } catch (error) {
      console.error(error);
    }
  }

  function Edit(elem) {
    setDialog1(true);
    setDesc1(elem.name);
    setName1(elem.name);
    setId(elem.id);
  }

  async function DelImg(id) {
    try {
      const {data} = await axios.delete(`https://to-dos-api.softclub.tj/api/to-dos/images/${id}`)
      Get()
    } catch (error) {
      console.error(error);
    }
  }

  async function Cheked(id,cheked){
    try {
      const {data} = await axios.put(`https://to-dos-api.softclub.tj/completed?id=${id}`,{cheked})
      Get()
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    Get();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => setDialog(true)}
        className="bg-blue-600 text-white p-3 rounded-lg shadow-lg mb-6 hover:bg-blue-700 transition duration-300"
      >
        Add New Item
      </button>

      {dialog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Item</h2>
            <input
              type="text"
              value={name}
              onChange={(el) => setName(el.target.value)}
              placeholder="Name"
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={desc}
              onChange={(el) => setDesc(el.target.value)}
              placeholder="Description"
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="file"
              onChange={(el) => setFile(el.target.files)}
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none"
            />
            <div className="flex justify-between items-center">
              <button
                onClick={Add}
                className="bg-blue-600 text-white p-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
              >
                Add
              </button>
              <button
                onClick={() => setDialog(false)}
                className="bg-red-600 text-white p-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {dialog2 && (
        <div className="w-[35%] z-10 h-[100vh] shadow absolute top-0 right-0 fixed bg-white p-6 overflow-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Name : {date.name}</h1>
          <h2 className="text-lg text-gray-600 mb-4">Description : {date.description}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {date.images?.map((img) => (
              <div key={img.id} className="overflow-hidden rounded-lg">
                <img
                  src={`https://to-dos-api.softclub.tj/images/${img.imageName}`}
                  alt=""
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
          <button
                onClick={() => setDialog2(false)}
                className=" mt-[20px] bg-red-600 text-white p-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
              >
                Cancel
              </button>
        </div>
      )}


      
      {
        dialog3 &&(
          <div className="bg-gray-100 z-20 fixed inset-0 m-auto w-[500px] h-[450px] flex flex-col items-center text-black gap-4 p-6 rounded-3xl border-2 border-blue-900 shadow-xl">
          <p className="font-bold text-2xl text-blue-900">Add Image</p>
        
          <input 
            type="file" 
            multiple 
            className="w-full border border-blue-900 py-3 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white" 
            onChange={FileChange} 
          />
        
          <div className="flex gap-2 flex-wrap justify-center">
            {imagePreviews?.map((el) => (
              <img key={el.id} src={el} className="w-24 h-24 object-cover rounded-lg shadow-md border border-gray-300" />
            ))}
          </div>
        
          <div className="flex gap-3">
            <button 
              className="bg-blue-900 hover:bg-blue-700 transition-colors duration-300 rounded-lg text-white px-6 py-2 shadow-md"
              onClick={AddPhoto}
            >
              Save
            </button>
        
            <button 
              className="bg-gray-700 hover:bg-gray-600 transition-colors duration-300 rounded-lg text-white px-6 py-2 shadow-md"
              onClick={() => setDialog3(false)}
            >
              Close
            </button>
          </div>
        </div>
        
        )
      }

      {dialog1 && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Item</h2>
            <input
              type="text"
              value={name1}
              onChange={(el) => setName1(el.target.value)}
              placeholder="Name"
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={desc1}
              onChange={(el) => setDesc1(el.target.value)}
              placeholder="Description"
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-between items-center">
              <button
                onClick={Edit1}
                className="bg-blue-600 text-white p-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
              >
                Save Changes
              </button>
              <button
                onClick={() => setDialog1(false)}
                className="bg-red-600 text-white p-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {serverData?.map((el) => (
          <div
            key={el.id}
            className="bg-white z-0 shadow-lg rounded-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105"
          >
            {
            el.isCompleted ? <h1 className="text-2xl font-semibold text-gray-800 mb-2 line-through">{el.name}</h1> : 
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">{el.name}</h1>
          }
            <h2 className="text-lg text-gray-600 mb-4">{el.description}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full mb-4">
              {el.images.map((img) => (
                <div key={img.id} className="overflow-hidden flex-wrap rounded-lg z-0">
                  <img
                    src={"https://to-dos-api.softclub.tj/images/" + img.imageName}
                    alt=""
                    className="w-full h-32 object-cover rounded-lg transition-transform transform hover:scale-105"
                  />
                  <button
                onClick={() => DelImg(img.id)}
                className=" mt-[10px] bg-red-600 text-white p-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
              >
                DeletImg
              </button>
                </div>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap mt-4">
              <button
                onClick={() => Edit(el)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => Del(el.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
              <button
                onClick={() => Info(el.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
              >
                Info
              </button>
              <button
                onClick={() => {setDialog3(true),setIdx(el.id)}}
                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
              >
                AddPhoto
              </button>
              <input type="checkbox" checked={el.isCompleted} onChange={()=>Cheked(el.id,!el.isCompleted)} />              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
