import { Card, BarList, Title } from "@tremor/react";

const data = [
  {
    name: "Espacios Coworking",
    value: 456,
  },
  {
    name: "Salas de Reuniones",
    value: 351,
  },
  {
    name: "Laboratorios",
    value: 271,
  },
  {
    name: "Auditorios",
    value: 191,
  },
];

export const BarListHero = () => {
  return (
    <Card className="mb-6">
      <Title>Reservas por Tipo de Espacio</Title>
      <BarList data={data} className="mt-4" />
    </Card>
  );
};