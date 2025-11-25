'use client'
import api from "@/Redux/interceptors";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const [data, setData] = useState([])
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/");
        console.log("res.data.data", res.data.data)
        const sortedRes = res.data.data.sort((a: any, b: any) => a.id - b.id)
        setData(sortedRes)
      }
      catch (error) {
        setData([])
      }
    }
    fetchData()
  }, [])

  const handleChangeEdit = (e:any) => {
    const val = e.target.value;
    const updatedData: any = data.map((item: any) => {
      if (item.id === editId) {
        return { ...item, name: val }; // update immutably
      }
      return item;
    });

    setData(updatedData);
  };

  const handleApi = async ({ id, name }: {id:number, name:string}) => {
    try {
      const response = await api.put("/api/", { id, name });
      if (response.status == 201) {
        toast(response.data?.message ?? "Updated successfully");
      }
    } catch (error) {
      toast((error as Error).message ?? "Something went wrong");
    }
  }
  const onDelete = async(id: number) => { 
    try {
       const result=[...data].filter((item)=>{
        const itemId:number=(item as any).id;
      return id!==itemId
    });
    setData(result)
    const response = await api.delete("/api/", {  data: { id } });
      if (response.status == 201) {
       toast(response.data?.message ?? "Deleted successfully");
      }
    } catch (error) {
      toast((error as Error).message ?? "Something went wrong");
    }  
  }
  

  return (
    <div className="ml-8 min-h-screen bg-zinc-50 font-sans dark:bg-black">
      {Array.isArray(data) && data.map((item: any, id) => {
        return <div key={item.id} className="flex gap-2 my-2">
          {item.id == editId ? <span className="w-40">
            <input aria-label={`edit-input-${item.id}`} type="text" className="border border-1 w-40 rounded-sm p-1" defaultValue={item.name} onChange={handleChangeEdit} onKeyDown={(e) => {
              if (e.key === "Enter") {
                const { id, name } = item;
                handleApi({ id, name });
              }
            }} />
          </span> : <p  aria-label={`recipe-${item.id}`} className="w-40"> {item.name}</p>
          }
          <button
           aria-label={`edit-${item.id}`}
            className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
            onClick={() => {
              const { id, name } = item;
              item.id == editId ? handleApi({ id, name }) : "";
              setEditId(editId ? null : id)
            }}
          >
            {item.id == editId ?
              "Save" : "Edit"}
          </button>
          <button 
          aria-label="onDelete"
            className="px-2 py-1 text-sm bg-red-500 text-white rounded"
            onClick={() => onDelete(item.id)}
          >
            Delete
          </button>
        </div>
      }
      )}
    </div>
  );
}
