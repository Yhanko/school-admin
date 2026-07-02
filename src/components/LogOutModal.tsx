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
  const [close, setClosed] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const closeDialog = (value: boolean) => setClosed(value);

  const removeCookie = async function() {
    try {
      await axiosInstance.post(`/auth/logout`).catch(() => {});
    } catch (e) {
      console.error(e);
    } finally {
      // Clear global state
      logout();
      // Temporarily remove token from axios
      axiosInstance.defaults.headers.common['Authorization'] = '';
      router.push("/");
    }
  };

  return (
    <Dialog onOpenChange={closeDialog} open={close} >
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
            onClick={() => {setClosed(false)}} 
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