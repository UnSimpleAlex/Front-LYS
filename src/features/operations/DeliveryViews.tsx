import { useState } from 'react';
import { useOperations, changeStatus, type Order } from './operationsStore';
import { Empty, OrderCard, OrderDetail, Stats, Tabs } from './OperationsUI';

export function DeliveryViews({notify}: {notify:(task:()=>void)=>void}) {
  const state = useOperations();
  const [filter,setFilter] = useState('Pendientes');
  const [search,setSearch] = useState('');
  const [detail,setDetail] = useState<Order|null>(null);
  const deliveries = state.orders.filter(o => !o.draft && o.channel === 'Delivery');
  const rows = deliveries.filter(o => (filter === 'Completadas' ? o.status === 'Entregado' : filter === 'En camino' ? o.status === 'En camino' : ['Listo','En camino'].includes(o.status)) && `${o.id} ${o.customer} ${o.address}`.toLowerCase().includes(search.toLowerCase()));
  return <>
    <Stats entries={[
      {label:'Listos para recoger',value:deliveries.filter(o=>o.status==='Listo').length,icon:'bag'},
      {label:'En camino',value:deliveries.filter(o=>o.status==='En camino').length,icon:'truck'},
      {label:'Entregas completadas',value:deliveries.filter(o=>o.status==='Entregado').length,icon:'check'},
    ]}/>
    <div className="ops-toolbar"><Tabs options={['Pendientes','En camino','Completadas']} value={filter} onChange={setFilter}/><input aria-label="Buscar entrega" placeholder="Pedido, cliente o dirección" value={search} onChange={e=>setSearch(e.target.value)}/></div>
    <div className="ops-incoming-grid">{rows.map(order=><OrderCard key={order.id} order={order} onDetail={()=>setDetail(order)} onStatus={(id,status)=>notify(()=>changeStatus(id,status))}/>)}</div>
    {!rows.length && <Empty>{search ? 'No hay entregas que coincidan con la búsqueda.' : 'No hay entregas en este estado.'}</Empty>}
    {detail && <OrderDetail order={state.orders.find(o=>o.id===detail.id)||detail} onClose={()=>setDetail(null)}/>}
  </>;
}
