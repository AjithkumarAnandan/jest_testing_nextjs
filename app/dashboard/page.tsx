"use client"
import { useState } from 'react'
import axios from 'axios'
import api from '@/Redux/interceptors'
interface FormDataProps{
     username: string ;
      email: string;
      age:null | string | number
}

function DashboardPage() {
    // const [data, setData] = useState([])
    const [formData, setFormData] = useState<FormDataProps>({
        username: "", email: "",age:null
    })
    const [error, setError] = useState("")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")

        // if (formData.username !== "username" || formData.password !== "password") {
        // if (formData.username !== "username" || formData.email !== "ak@gmail.com") {
        //     setError("Invalid credentials")
        //     setData([])
        //     return
        // }
        const fetchData = async () => {
            try {
                // const response = await axios.get('https://dummyjson.com/recipes/search?q')
                const response = await api.post('/api/', {name:formData.username, email:formData.email, age:formData.age})
                // setData(response.data)
            } catch (error) {
                setError("Failed to fetch recipes")
                // setData([])
            }
        }
        fetchData()
    }

    return (<>
       <form onSubmit={handleSubmit}>
            <div className='my-3 w-[100rem]'>
                <label htmlFor="username">Username</label>
                <input  className="border-2 border-red-100 rounded-sm ml-2 focus-visible:ring-red-500"
                    id="username"
                    type="text" 
                    name="username"
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
            </div>
                       <div className='my-3 w-[100rem]'>
                <label htmlFor="username">Email</label>
                <input  className="border-2 border-red-100 rounded-sm ml-2 focus-visible:ring-red-500"
                    id="email"
                    type="text" 
                    name="email"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
                       <div className='my-3 w-[100rem]'>
                <label htmlFor="username">Age</label>
                <input  className="border-2 border-red-100 rounded-sm ml-2 focus-visible:ring-red-500"
                    id="age"
                    type="number" 
                    name="age"
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
            </div>
            {/* <div className='my-3 w-[100rem]'>
                <label htmlFor="password">Password</label>
                <input className='border border-2 border-red-100  rounded-sm ml-2 focus:border-red-500 '
                    id="password"
                    type="text"
                    name="password"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div> */}

            <button type="submit" className=' border-1 border-blue-300 p-2  rounded-xl bg-[#C5FCF0]'>Submit</button>
        </form>

        {error && <div>{error}</div>}
        {/* <div>{Array.isArray(data) && data.map((item: any, i) => {
            return <div key={item.id}>{item.name}</div>
        })}</div> */}
    </>
    )
}

export default DashboardPage