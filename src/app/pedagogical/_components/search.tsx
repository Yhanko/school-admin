import { Input } from "@/components/ui/input";
import { NewTeacher } from "./new-teacher";

export function Search(){
    return(
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 mt-6 w-full px-4">
            <div className="flex flex-col md:flex-row w-full md:w-auto relative gap-4">
                <Input
                    type="text"
                    placeholder="Search here..."
                    className="bg-background border border-border rounded-md h-10 w-full md:w-64 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <NewTeacher />
            </div>
      </div>
    )
}