import React, { useEffect, useState } from 'react'
import '../App.css'
import { get } from '../api/client'
import {useLocation} from 'react-router-dom'
import {Editable, ShowCourses} from '../components/Courses'

function Home({navigation, route}){
    console.log(useLocation().state)
    const {username,type} = useLocation().state
    let [state, setState] = useState(userInfo)

    async function userInfo(){
        try{
            const response = await get(`/users/${username}`)
            setState({
                id: response.id,
                name: response.name,
                address: response.address,
            })
        }catch(error){
            if(error.response.status === 404){
                //setState({error: "No existe el usuario"})
                console.log("No existe el usuario")
            }else if(error.response.status === 500){
                //setState({error: "INTERNAL ERROR SERVER"})
                console.error("Error")
            }
        }
    }

    return (
        <div>
            <h1> Bienvenido {state.name}</h1>
            {(type === 'admin')? (<div>
            <ShowCourses></ShowCourses>
            <Editable></Editable>
            </div>):''}
        </div>
    )
}

export default Home