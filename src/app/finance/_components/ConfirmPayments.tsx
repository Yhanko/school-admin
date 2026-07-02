"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaymentWithStudent } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "@/lib/icons";
import { useEffect } from "react";
import axiosInstance from "@/service/api";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ConfirmPayments() {
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [confirmedBy, setConfirmedBy] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axiosInstance.get('/finance/payments');
      const payments = response.data;
      // Filter only pending
      setPendingPayments(payments.filter((p: any) => p.status === 'pending'));
    } catch (error) {
      console.error("Failed to fetch payments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await axiosInstance.patch(`/finance/payments/${id}/confirm`);
      toast({ title: "Sucesso", description: "Pagamento confirmado com sucesso." });
      setPendingPayments(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao confirmar pagamento", variant: "destructive" });
    }
  };

  const handleCancel = async (id: string) => {
    // Basic cancel logic, just an example since backend only has confirm out of the box in controller right now.
    // Assuming backend might implement /cancel or update later.
    toast({ title: "Info", description: "Funcionalidade de cancelamento a ser implementada no backend." });
  };


  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle>Confirmar Pagamentos Pendentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Confirmado por:</label>
          <Input
            value={confirmedBy}
            onChange={(e) => setConfirmedBy(e.target.value)}
            placeholder="Nome de quem está confirmando"
          />
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : pendingPayments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Não há pagamentos pendentes no momento.
            </p>
          ) : (
            pendingPayments.map((payment) => (
              <div
                key={payment.id}
                className="border rounded-lg p-4 space-y-3 hover:bg-accent/5 transition-smooth"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold text-lg">{payment.student?.name || 'Aluno Desconhecido'}</p>
                    <Badge variant="secondary">
                      {payment.type === 'tuition' ? 'Propina' : payment.type === 'enrollment' ? 'Matrícula' : payment.type}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Registrado em: {new Date(payment.createdAt || payment.created_at).toLocaleString('pt-AO')}
                    </p>
                    {payment.notes && (
                      <p className="text-sm text-muted-foreground">Obs: {payment.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gradient-primary">
                      {payment.amount} KZ
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    variant="default"
                    onClick={() => handleConfirm(payment.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleCancel(payment.id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
