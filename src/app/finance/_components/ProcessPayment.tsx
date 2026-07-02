"use client"
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Student, PaymentType } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/service/api";
import { Loader2 } from "lucide-react";

export function ProcessPayment() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType>("tuition");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get('/users?role=STUDENT');
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post('/finance/payments', {
        studentId: selectedStudent,
        type: paymentType,
        amount: parseFloat(amount),
        notes: notes,
      });

      toast({
        title: "Pagamento registrado",
        description: "O pagamento foi registrado com sucesso e está pendente de confirmação.",
      });

      setSelectedStudent("");
      setAmount("");
      setNotes("");
    } catch (error) {
      toast({
        title: "Erro ao processar pagamento",
        description: "Ocorreu um erro ao processar o pagamento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processar Novo Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student">Estudante</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent} required>
              <SelectTrigger id="student">
                <SelectValue placeholder="Selecione um estudante" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Pagamento</Label>
            <Select value={paymentType} onValueChange={(v) => setPaymentType(v as PaymentType)} required>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enrollment">Matrícula</SelectItem>
                <SelectItem value="tuition">Propina</SelectItem>
                <SelectItem value="activity">Atividade</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (AOA)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informações adicionais sobre o pagamento"
            />
          </div>

          <Button type="submit" className="w-full rounded-full bg-[#5856eb] text-white hover:text-white hover:bg-[#3d3ae7] hover:cursor-pointer" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Registrar Pagamento"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}