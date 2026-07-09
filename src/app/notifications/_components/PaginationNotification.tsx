import React from "react";
import { PaginationProps } from "@/types/interfaces";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { Button } from "@/components/ui/button";


export default function PaginationNotification({ page, pages, onPageChange }: PaginationProps) {
  function previusPage() {
    if (page > 1) {
      onPageChange(page - 1); // Retrocede para a página anterior
    }
  }

  function nextPage() {
    if (page < pages) {
      onPageChange(page + 1); // Avança para a próxima página
    }
  }

  // Função para renderizar os botões das páginas
  const renderPageButtons = () => {
    const buttons: React.ReactNode[] = [];

    // Criar um intervalo de páginas a ser exibido
    const start = 1;
    const end = pages;

    // Gerar os botões de página
    for (let i = start; i <= end; i++) {
      buttons.push(
        <Button
          key={i}
          variant="outline"
          size="icon"
          className={`h-7 w-5 cursor-pointer shadow-none border-none hover:cursor-pointer ${
            i === page ? 'text-[#1D5298]' : 'text-[#C0C2C6] hover:bg-transparent hover:text-[#1D5298]'
          }`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="h-20 pt-8 flex justify-end space-x-1">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-5 shadow-none border-none cursor-pointer hover:bg-transparent text-[#C0C2C6] hover:text-[#1D5298]"
        onClick={previusPage}
        disabled={page <= 1} // Desabilita o botão na primeira página
      >
        <ChevronLeft className="h-7 w-4" />
      </Button>

      {renderPageButtons()}

      <Button
        variant="outline"
        size="icon"
        className="h-7 w-5 shadow-none border-none cursor-pointer text-[#C0C2C6] hover:bg-transparent hover:text-[#1D5298]"
        onClick={nextPage}
        disabled={page >= pages} // Desabilita o botão na última página
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
}
