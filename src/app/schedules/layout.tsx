import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Horários - YhankoEduca",
  description: "Gestão de Horários Escolares",
};

export default function SchedulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Horários</h2>
      </div>
      {children}
    </div>
  );
}
