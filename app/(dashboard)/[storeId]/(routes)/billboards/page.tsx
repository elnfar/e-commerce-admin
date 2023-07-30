import prismadb from "@/lib/prismadb";
import BillBoardClient from "./components/client";
import { BillboardColumn } from "./components/columns";

export default async  function page({params}:{
  params:{storeId:string}
}) {

  const billboards = await prismadb.billboard.findMany({
      where: {
        storeId:params.storeId
      },
      orderBy: {
        createdAt:'desc'
      }
  })

  const formatBill:BillboardColumn[] = billboards.map((item) => ({
    id:item.id,
    label:item.label,
    createdAt:item.createdAt.toLocaleString()
  })) 

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <BillBoardClient data={formatBill}/>
        </div>
    </div>
  )
}
