"use client";
//Componentes
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
//Hooks
import { useState } from "react";
import axiosInstance from '../service/api';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/store/useAuth";


interface LogOutProps {
  children: React.ReactNode;
}

export function LogOutModal({ children }: LogOutProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const removeCookie = async function() {
    // Close dialog first to avoid blocking navigation
    setOpen(false);
    try {
      await axiosInstance.post(`/auth/logout`).catch(() => {});
    } catch (e) {
      console.error(e);
    } finally {
      // Clear global state and cookies
      logout();
      // Remove token from axios defaults
      axiosInstance.defaults.headers.common['Authorization'] = '';
      // Use replace so the protected page is removed from history
      router.replace("/");
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open} >
      <DialogTrigger asChild>
          { children }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[300px] flex flex-col items-center space-y-4">
        <DialogHeader className="flex items-center flex-col space-y-4 pt-4 mt-4">
          <DialogTitle className="text-lg text-center font-medium text-[#282A37]">
            Tem certeza que deseja  <br/>sair da sua conta?
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center w-full space-x-4">
          <Button 
            onClick={() => {setOpen(false)}} 
            variant="default"
            className="w-28 h-12 cursor-pointer shadow-none focus-visible:ring-0 text-[#717F96] hover:bg-[#F1F5F7] bg-[#F1F5F7]">
              Cancelar
          </Button>
          <Button
            variant="default"
            className="w-28 h-12 cursor-pointer shadow-none text-white hover:bg-[#EB5656] bg-[#EB5656]"
            onClick={() => removeCookie()}
            >
              Sair
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}