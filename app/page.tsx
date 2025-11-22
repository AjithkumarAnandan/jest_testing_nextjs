'use client'
import api from "@/Redux/interceptors";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
    try {
        // const response = await fetch('https://dummyjson.com/recipes/search?q')
        // const res = await response.json();
        // const res=await api.post("/api/", {name:"ajithkumar", email:"aak@gmail.com", age:26});
        const res=await api.get("/api/"); 
        setData(res.data.data)
      }      
    catch (error) {
      setData([])      
    }}
    fetchData()
  }, [])

  // console.log("data",data);

  return (
    <div className="ml-8 min-h-screen bg-zinc-50 font-sans dark:bg-black">
         { Array.isArray(data) && data.map((item:any,id)=>{
        return <div key={item.id}>{
          <p>{item.name}</p>
        }</div>
      })}
    </div>
  );
}
