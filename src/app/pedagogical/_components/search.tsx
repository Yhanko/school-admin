import { Button } from "@/components/ui/button";
import { Plus } from "@/lib/icons";
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";

export function Search(){
    const router = useRouter();
        
  function goTo(link:string){
    router.push(link)
  }
    return(
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 mt-6 w-full px-4">
            <div className="flex flex-col md:flex-row w-full md:w-auto relative gap-4">
                <Input
                    type="text"
                    placeholder="Search here..."
                    className="bg-background border border-border rounded-md h-10 w-full md:w-64 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Button
                    onClick={()=>goTo("/newteacher")}
                    variant="outline" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-6 h-10 font-medium cursor-pointer w-full md:w-auto"
                >
                        
                    <Plus className="mr-2 h-4 w-4" />
                    New Teacher
                </Button>
            </div>
      </div>
    )
}