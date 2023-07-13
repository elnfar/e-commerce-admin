import prismadb from "@/lib/prismadb";
import SettingsForm from "../../settings/components/SettingsForm";
import BillBoardForm from "./components/billboard-settings";


const BillboardPage = async ({
  params
}: {
  params: { billboardId: string }
}) => {
  const billboards = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillBoardForm initialData={billboards  }/>
      </div>
    </div>
  );
}

export default BillboardPage;