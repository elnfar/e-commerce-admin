"use client"

import Alert from "@/components/modals/alert-modal"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Heading from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Store } from "@prisma/client"
import axios from "axios"
import { Trash } from "lucide-react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from "zod"

interface SFormProps {
    initialData: Store
}


const formSchema = z.object({
    name:z.string().min(1),
});

type SFormValues = z.infer<typeof formSchema>;

export default function SettingsForm({initialData}:SFormProps) {

    const [open,setOpen] = useState(false)
    const [loading,setLoading] = useState(false)
    const params = useParams();
    const router = useRouter();

    const form = useForm<SFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData
    })

    const onSubmit = async (data:SFormValues) => {
       
        try {
            setLoading(true)
            await axios.patch(`/api/stores/${params.storeId}`,data)
            router.refresh();
            toast.success("Store updated")
        }catch(error) {
            toast.error("Something went wrong")
        }finally {
            setLoading(false)
        }
        
    }

    const onDelete = async () => {
        try {
            setLoading(true)

            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh();
            router.push('/');
            toast.success("store created");
        }catch(error){
            toast.error("Make sure you removed all products and cat first")
        }
        finally {
            setLoading(false)
        }
    }

  return (
    <>
    <Alert
    isOpen={open}
    onClose={() => setOpen(false)}
    onConfirm={onDelete}
    loading={loading}
    />
    <div className="flex items-center justify-between">
        <Heading
        title="Settings"
        description="Manage store preferences"
        />

        <Button disabled={loading} variant="destructive" size="sm" onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4"/>
        </Button>
    </div>

    <Separator/>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <div className="grid grid-cols-3 gap-8">
                    <FormField control={form.control} name="name" render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Store Name" {...field}/>
                            </FormControl>

                            <FormMessage/>
                        </FormItem>
                    )}/>
                </div>

                        

                <Button disabled={loading} className="ml-auto" type="submit">Save Changes</Button>


            </form>
        </Form>

    </>
  )
}
