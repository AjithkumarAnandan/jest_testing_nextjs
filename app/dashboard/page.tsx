"use client"
import { useState } from 'react'
import api from '@/Redux/interceptors'


interface FormDataProps {
    username: string;
    email: string;
    age: null | string | number
}

function DashboardPage() {
    const [isSuccess, setIsSuccess] = useState(false)
    // const [formData, setFormData] = useState<FormDataProps>({
    //     username: "", email: "", age: null
    // })
    const [error, setError] = useState("")

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsSuccess(false);
        // const form = e.target as HTMLFormElement;
        const form = e.currentTarget;
        const formData = new FormData(form);
        const name = formData.get("username");
        const email = formData.get("email");
        const age = formData.get("age");
         const ageValue = Number(age)
        if (!name || isNaN(ageValue) || ageValue < 0 || !email) {
            setError("Invalid data: name, age, and email cannot be empty.");
            return;
        }
        const fetchData = async ({ name, age, email }: any) => {
            try {
                const response = await api.post('/api/', {name, age, email})
                setIsSuccess(response.data.status == 200)
            } catch (error) {
                setError("Failed to fetch recipes")
            }
        }       
        fetchData({ name, age, email })
    }

    return (<>
        <form onSubmit={handleSubmit}>
            <div className='my-3 w-[100rem]'>
                <label htmlFor="username">Username</label>
                <input className="border-2 border-red-100 rounded-sm ml-2 focus-visible:ring-red-500"
                    id="username"
                    type="text"
                    name="username"
                    // onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                    />
            </div>
            <div className='my-3 w-[100rem]'>
                <label htmlFor="email">Email</label>
                <input className="border-2 border-red-100 rounded-sm ml-2 focus-visible:ring-red-500"
                    id="email"
                    type="text"
                    name="email"
                    // onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                     />
            </div>
            <div className='my-3 w-[100rem]'>
                <label htmlFor="age">Age</label>
                <input className="border-2 border-red-100 rounded-sm ml-2 focus-visible:ring-red-500"
                    id="age"
                    type="number"
                    name="age"
                    // onChange={(e) => setFormData({ ...formData, age: e.target.value })} 
                    />
            </div>

            <button type="submit" className=' border-1 border-blue-300 p-2  rounded-xl bg-[#C5FCF0]'>Submit</button>
        </form>
        {error && <p>{error}</p>}
        {isSuccess && <p>Successfully done</p>}
        {/* <div>{Array.isArray(data) && data.map((item: any, i) => {
            return <div key={item.id}>{item.name}</div>
        })}</div> */}
    </>
    )
}

export default DashboardPage