"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";

export function StudentTable ({ payments = [] }: { payments?: any[] }) {
  const getInitials = (name: string) => {
    return name ? name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'N/A';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Pagamentos Pendentes/Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full boder-[1px] boder-gray-200">
            <tbody className="divide-y divide-border border-[1px] border-gray-200">
              {payments.map((payment, index) => (
                <tr key={index} className="hover:bg-muted/50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-lg">{getInitials(payment.student?.name)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-foreground">{payment.student?.name || 'Desconhecido'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-blue-600 font-medium">{payment.id.split('-')[0]}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-orange-100 p-2 rounded-full mr-2">
                        <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <span className="text-sm text-muted-foreground">{payment.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-lg font-bold text-foreground">{payment.amount} KZ</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">1-5 of <span className="font-semibold text-foreground">100</span></p>
          <div className="flex space-x-2">
            <Button variant="default" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}