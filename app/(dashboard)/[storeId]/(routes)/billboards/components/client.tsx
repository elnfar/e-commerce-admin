"use client"

import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Billboard } from "@prisma/client"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { BillboardColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

interface Props {
  data:BillboardColumn[]
}

export default function BillBoardClient({data}:Props) {

    const router = useRouter()
    const params = useParams()

  return (
    <>
    <div className="flex items-center justify-between">
        <Heading
        title={`Boards (${data.length})`}
        description="Manage Billboards for your store"
        />

        <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}><Plus className="mr-2 h-4 w-4"/>Add New</Button>
    </div>
    <Separator/>

    <DataTable columns={columns} data={data}/>
    </>
  )
}
