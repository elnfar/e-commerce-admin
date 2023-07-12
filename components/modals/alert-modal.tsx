"use client"

import { useEffect, useState } from "react"
import { Modal } from "../ui/modal"
import { Button } from "../ui/button"


interface AModalProp {
    isOpen:boolean
    onClose:() => void
    onConfirm:() => void
    loading:boolean
}

export default function Alert({isOpen,onClose,onConfirm,loading}:AModalProp) {
    const [isMounted,setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    },[])

    if(!isMounted) {
        return null
    }

  return (  
    <Modal title="Are you sure ?" description="This action can't be undone" isOpen={isOpen} onClose={onClose}>
        <div className="pt-6 space-x-2 flex justify-end w-full">
            <Button disabled={loading} variant="outline" onClick={onClose}>Cancel</Button>
            <Button disabled={loading} variant="destructive" onClick={onConfirm}>Continue</Button>

        </div>
    </Modal>
  )
}
