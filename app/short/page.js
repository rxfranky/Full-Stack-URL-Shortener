'use client'

import Main from "@/root-components/main";
import Navbar from "@/root-components/navbar";
import deleteIcon from '../assets/icons/delete.png'
import editIcon from '../assets/icons/editing.png'
import TableData from "./_components/table-data";
import authState from "@/util/auth-status"
import { useEffect, useState } from "react";


export default function Short() {
    const [data, setData] = useState([])
    const [editVals, setEditVals] = useState({})

    const { session, userData } = authState()

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('http://localhost:4000/getShorts', {
                headers: {
                    email: userData.email || session.user.email
                }
            })
            const data = await response.json()
            setData(data.data)
        }
        fetchData()
    }, [])

    function handleEditClick(id, preferedText, url) {
        setEditVals({ id, preferedText, url })
    }

    async function handleDeleteClick(id) {
        const response = await fetch('http://localhost:4000/deleteShort', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ id })
        })
        const data = await response.json()
        console.log('dataAfterDelete-', data)
    }

    return (
        <>
            <Navbar />
            <Main
                placeholder_1={"enter your URL"}
                placeholder_2={"enter your prefered text"}
                name_1='url'
                name_2='preferedText'
                editVals={editVals}
            />
            <div className="parent">
                <table className="table-auto m-auto mt-20 w-[70vw]">
                    <thead className="bg-purple-600">
                        <tr>
                            <th className="rounded-tl-md p-2 pl-7 pr-7 ">Shorturls</th>
                            <th className="p-2 pl-7 pr-7">Original link</th>
                            <th className="rounded-tr-md p-2 pl-7 pr-7">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-purple-100">
                        {data.map(data => (
                            <tr key={data._id.toString()}>

                                <TableData preferedText={data.preferedText} forShortUrl id={data._id.toString()} />

                                <TableData preferedText={data.url} url={data.url} />
                                <td className="outline-1 outline-white pt-2 pb-2">
                                    <div className='flex gap-3 justify-center'>
                                        <span>
                                            <img onClick={() => handleEditClick(data._id, data.preferedText, data.url)} className='cursor-pointer' src={editIcon.src} width={20} alt="" />
                                        </span>

                                        <img onClick={() => handleDeleteClick(data._id)} className='cursor-pointer' src={deleteIcon.src} width={20} alt="" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}