"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Receipt, DollarSign, FileText, Settings } from "@/lib/icons";
import { ProcessPayment } from "./ProcessPayment";
import { ConfirmPayments } from "./ConfirmPayments";
import { TuitionConfig } from "./TuitionConfig";
import { CashFlowReport } from "./CashFlowReport";
import { ReceiptGenerator } from "./ReceiptGenerator";

export function Financial() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Sistema de Gestão Financeira
          </h1>
          <p className="text-muted-foreground text-lg">
            Gerencie pagamentos, propinas e relatórios financeiros
          </p>
        </div>

        <Tabs defaultValue="cashflow" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2 h-auto p-2">
            <TabsTrigger value="cashflow" className="flex items-center gap-2 hover:cursor-pointer">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Fluxo de Caixa</span>
              <span className="sm:hidden">Caixa</span>
            </TabsTrigger>
            <TabsTrigger value="process" className="flex items-center gap-2 hover:cursor-pointer">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Processar Pagamento</span>
              <span className="sm:hidden">Pagar</span>
            </TabsTrigger>
            <TabsTrigger value="confirm" className="flex items-center gap-2 hover:cursor-pointer">
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Confirmar Pagamentos</span>
              <span className="sm:hidden">Confirmar</span>
            </TabsTrigger>
            <TabsTrigger value="receipts" className="flex items-center gap-2 hover:cursor-pointer">
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Emitir Recibo</span>
              <span className="sm:hidden">Recibos</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2 hover:cursor-pointer">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Configurar Propinas</span>
              <span className="sm:hidden">Config</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cashflow">
            <CashFlowReport />
          </TabsContent>

          <TabsContent value="process">
            <ProcessPayment />
          </TabsContent>

          <TabsContent value="confirm">
            <ConfirmPayments />
          </TabsContent>

          <TabsContent value="receipts">
            <ReceiptGenerator />
          </TabsContent>

          <TabsContent value="config">
            <TuitionConfig />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}