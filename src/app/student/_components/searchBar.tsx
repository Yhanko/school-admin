"use client"
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation'

export function SearchBar() {
    const router = useRouter();
      
    function goTo(link:string){
      router.push(link)
    }
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 mt-6 w-full px-4">
      {/* Search Input */}
      <div className="flex-1 max-w-md relative">
        <Input
          type="text"
          placeholder="Search here..."
          className="bg-background border border-border rounded-md h-10 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent w-full"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* New Student Button */}
        <Button onClick={()=>goTo("/newstudent")} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-6 h-10 font-medium cursor-pointer w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Student
        </Button>
      </div>
    </div>
  );
};