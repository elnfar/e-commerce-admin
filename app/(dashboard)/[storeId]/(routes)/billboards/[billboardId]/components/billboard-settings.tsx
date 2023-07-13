"use client"

import Alert from "@/components/modals/alert-modal"
import { ApiAlert } from "@/components/ui/api-alert"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Heading from "@/components/ui/heading"
import ImageUpload from "@/components/ui/image-upload"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useOrigin } from "@/hooks/use-origin"
import { zodResolver } from "@hookform/resolvers/zod"
import { Billboard, Store } from "@prisma/client"
import axios from "axios"
import { Trash } from "lucide-react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from "zod"

interface BFormProps {
    initialData: Billboard | null
}


const formSchema = z.object({
    label:z.string().min(1),
    imageUrl:z.string().min(2)
});

type BFormValues = z.infer<typeof formSchema>;

export default function BillBoardForm({initialData}:BFormProps) {

    const [open,setOpen] = useState(false)
    const [loading,setLoading] = useState(false)
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();
    const form = useForm<BFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData || {
            label:'',
            imageUrl:''
        }
    })

    const title = initialData ? "Edit Billboard" : "Creat";
    const desc = initialData ? "Edit a Billboard" : "Add a billboard";
    const toastMessage = initialData ? "Updated" : "Created";
    const action = initialData ? "Save changes" : "Create";


    const onSubmit = async (data:BFormValues) => {
       
        try {
            setLoading(true)

            if(initialData) {
                await axios.patch(`/api/${params.storeId}/billboards`,data)
            } else {
               await axios.post(`/api/${params.storeId}/billboards`,data)
            }
            router.refresh();
            toast.success("Billboard Created")
        }catch(error) {
            toast.error("Something went wrong")
        }finally {
            setLoading(false)
        }
        
    }

    const onDelete = async () => {
        try {
            setLoading(true)

            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh();
            router.push('/');
            toast.success("Billboard created");
        }catch(error){
            toast.error("Make sure you removed all categories")
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
        title={title}
        description={desc}
        />

    {initialData && (
        <Button disabled={loading} variant="destructive" size="sm" onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4"/>
        </Button>
    )}
    </div>

    <Separator/>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">

                    <FormField control={form.control} name="imageUrl" render={({field}) => (
                        <FormItem>
                            <FormLabel>Bg Image</FormLabel>
                            <FormControl>
                                <ImageUpload
                                value={field.value ? [field.value] : []} 
                                disabled={loading}
                                onChange={(url) => field.onChange(url)} 
                                onRemove={() => field.onChange("")}   
                                />
                            </FormControl>

                            <FormMessage/>
                        </FormItem>
                    )}/>

                <div className="grid grid-cols-3 gap-8">
                    <FormField control={form.control} name="label" render={({field}) => (
                        <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Billboard Name" {...field}/>
                            </FormControl>

                            <FormMessage/>
                        </FormItem>
                    )}/>
                </div>

                        


                <Button disabled={loading} className="ml-auto" type="submit">{action}</Button>


            </form>
        </Form>
        <Separator/>
    </>
  )
}
