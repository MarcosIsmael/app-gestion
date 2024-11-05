// AcumuladoGastos.js
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Enero', gastos: 4000 },
  { name: 'Febrero', gastos: 3000 },
  { name: 'Marzo', gastos: 2000 },
  { name: 'Abril', gastos: 2780 },
  { name: 'Mayo', gastos: 1890 },
  { name: 'Junio', gastos: 2390 },
  { name: 'Julio', gastos: 3490 },
];

type DataType = {
  name:string,
  monto:number
}
interface Props {
  data :DataType[]
}

 export const AcumuladoGraficoComponent = ({ data}:Props) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="monto" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

