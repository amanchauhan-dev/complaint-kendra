import { ChartAreaInteractive } from "./_components/chart-area-interactive"
import { DataTable } from "./_components/data-table"
import { SectionCards } from "./_components/section-cards"
import data from "./data.json"
import AIBox from "./_components/ai-box"

export default function Page() {
    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4">
                <SectionCards />
                <div className=" lg:grid grid-cols-[auto_300px] gap-4">
                    <ChartAreaInteractive />
                    <AIBox />
                </div>
                <DataTable data={data} />
            </div>
        </div>
    )
}
