import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import { categories, normalize } from "../carta/catalog";
import { OperationsTable } from "./OperationsTable";
import { Badge, Empty, Stats } from "./OperationsUI";
import { Icon } from "./OperationsVisuals";
import { ProductDetails, ProductDeactivate } from "./ProductDetails";
import { productSku } from "./productHelpers";
import { OperationsPageActions } from "./operationsPageContext";
import { ProductEditor } from "./ProductEditor";
import { downloadCsv, dateText } from "./operationsFiles";
import { useOperations, saveProduct, deleteProduct, money, type MenuProduct } from "./operationsStore";

const blankProduct=():MenuProduct=>({id:crypto.randomUUID(),name:"",description:"",category:"pollo",price:0,stock:0,active:true,image:"/images/logo.webp",size:"Personal",popular:0,isNew:false,promo:false});
export function ProductManager({notify}:{notify:(task:()=>void)=>void}) {
  const data=useOperations();
  const [editor,setEditor]=useState<MenuProduct|null>(null);
  const [detail,setDetail]=useState<MenuProduct|null>(null);
  const [confirm,setConfirm]=useState<MenuProduct[]>([]);
  const [selected,setSelected]=useState<string[]>([]);
  const [search,setSearch]=useState("");
  const [category,setCategory]=useState("Todas");
  const [availability,setAvailability]=useState("Todas");
  const [branch,setBranch]=useState("Todas");
  const [page,setPage]=useState(1);
  const actionHost=useContext(OperationsPageActions);
  const rows=data.products.filter(p=>(category==="Todas" || p.category===category) && (branch==="Todas" || (p.branch || "Principal")===branch) && (availability==="Todas" || (availability==="Activos" ? p.active:availability==="Inactivos" ? !p.active:(p.stock ?? 0)===0)) && normalize(`${p.name} ${productSku(p)}`).includes(normalize(search)));
  const maxPage=Math.max(1,Math.ceil(rows.length/7));
  const currentPage=Math.min(page,maxPage);
  const visible=rows.slice((currentPage-1)*7,currentPage*7);
  const updateFilters=(task:()=>void)=>{task();setPage(1);setSelected([]);};
  const create=<button className="ops-primary" onClick={()=>setEditor(blankProduct())}><Icon name="plus"/>Nuevo producto</button>;
  const selectedProducts=data.products.filter(p=>selected.includes(p.id));
  return <div className="ops-product-manager">
    {actionHost ? createPortal(create,actionHost):create}
    <Stats entries={[{label:"Productos activos",value:data.products.filter(p=>p.active).length,icon:"box",hint:"Disponibles en el menú"},{label:"Sin stock",value:data.products.filter(p=>(p.stock ?? 0)===0).length,icon:"box",tone:"gold",hint:"Requieren reposición"},{label:"Categorías",value:categories.length,icon:"tag",tone:"blue",hint:"Total de categorías"},{label:"Promociones",value:data.products.filter(p=>p.promo).length,icon:"tag",tone:"green",hint:"Productos en promoción"}]}/>
    <section className="ops-product-filters" aria-label="Filtros de productos">
      <label className="ops-product-search"><span>Buscar producto</span><input aria-label="Buscar producto" placeholder="Buscar producto…" value={search} onChange={e=>updateFilters(()=>setSearch(e.target.value))}/></label>
      <label>Categoría<select aria-label="Categoría de productos" value={category} onChange={e=>updateFilters(()=>setCategory(e.target.value))}><option>Todas</option>{categories.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></label>
      <label>Disponibilidad<select value={availability} onChange={e=>updateFilters(()=>setAvailability(e.target.value))}>{["Todas","Activos","Inactivos","Sin stock"].map(s=><option key={s}>{s}</option>)}</select></label>
      <label>Sucursal<select value={branch} onChange={e=>updateFilters(()=>setBranch(e.target.value))}><option>Todas</option>{[...new Set(data.products.map(p=>p.branch || "Principal"))].map(s=><option key={s}>{s}</option>)}</select></label>
      <button onClick={()=>downloadCsv("productos",["Producto","SKU","Categoría","Precio","Stock","Estado"],rows.map(p=>[p.name,productSku(p),categories.find(c=>c.id===p.category)?.name || p.category,p.price,p.stock ?? 0,p.active ? "Activo":"Inactivo"]))}><Icon name="download"/>Exportar</button>
      <button onClick={()=>updateFilters(()=>{setSearch("");setCategory("Todas");setAvailability("Todas");setBranch("Todas");})}>Limpiar</button>
    </section>
    <section className="ops-product-list" aria-label="Lista de productos">
      <div className="ops-product-bulk"><label><input type="checkbox" aria-label="Seleccionar productos de esta página" checked={visible.length>0 && visible.every(p=>selected.includes(p.id))} onChange={e=>setSelected(e.target.checked ? [...new Set([...selected,...visible.map(p=>p.id)])]:selected.filter(id=>!visible.some(p=>p.id===id)))}/>{selected.length} seleccionados</label><button disabled={!selected.length} onClick={()=>notify(()=>{selectedProducts.forEach(p=>saveProduct({...p,active:true}));setSelected([]);})}>Activar</button><button disabled={!selected.length} onClick={()=>setConfirm(selectedProducts)}>Desactivar</button></div>
      {rows.length ? <div className="ops-table-wrap"><OperationsTable><thead><tr>{["Selección","Producto","SKU","Categoría","Precio","Stock","Estado","Actualizado","Acciones"].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{visible.map(p=><tr key={p.id}>
        <td><input type="checkbox" aria-label={`Seleccionar ${p.name}`} checked={selected.includes(p.id)} onChange={e=>setSelected(e.target.checked ? [...selected,p.id]:selected.filter(id=>id!==p.id))}/></td>
        <td><div className="ops-product-cell"><img src={p.image} alt=""/><div><strong>{p.name}</strong><small>{p.description}</small></div></div></td><td className="ops-sku">{productSku(p)}</td><td><span className="ops-category-label"><Icon name={p.category==="bebidas" ? "drink":p.category==="parrillas" ? "grill":"chicken"}/>{categories.find(c=>c.id===p.category)?.name || p.category}</span></td><td>{money(p.price)}</td><td>{p.stock ?? 0}</td><td><Badge value={p.active ? "Activo":"Inactivo"}/></td><td>{p.updatedAt ? dateText(p.updatedAt):"Sin registrar"}</td>
        <td><div className="ops-actions ops-product-actions"><button title={`Ver ${p.name}`} aria-label={`Ver ${p.name}`} onClick={()=>setDetail(p)}><Icon name="eye"/></button><button title={`Editar ${p.name}`} aria-label={`Editar ${p.name}`} onClick={()=>setEditor({...p})}><Icon name="edit"/></button><button title={`Desactivar ${p.name}`} aria-label={`Desactivar ${p.name}`} disabled={!p.active} onClick={()=>setConfirm([p])}><Icon name="trash"/></button></div></td>
      </tr>)}</tbody></OperationsTable></div>:<Empty>No se encontraron productos. Prueba con otros filtros.</Empty>}
    </section>
    <div className="ops-pagination"><span>Mostrando {rows.length ? (currentPage-1)*7+1:0} a {Math.min(currentPage*7,rows.length)} de {rows.length} productos</span><button disabled={currentPage===1} onClick={()=>setPage(currentPage-1)}>Anterior</button><span aria-current="page">{currentPage}</span><button disabled={currentPage===maxPage} onClick={()=>setPage(currentPage+1)}>Siguiente</button></div>
    {editor && <ProductEditor initial={editor} exists={data.products.some(p=>p.id===editor.id)} onClose={()=>setEditor(null)} notify={notify}/>}
    {detail && <ProductDetails product={detail} onClose={()=>setDetail(null)} onEdit={()=>{setEditor({...detail});setDetail(null);}} onDeactivate={()=>{setConfirm([detail]);setDetail(null);}}/>}
    {confirm.length>0 && <ProductDeactivate products={confirm} onClose={()=>setConfirm([])} onConfirm={()=>notify(()=>{confirm.forEach(p=>deleteProduct(p.id));setConfirm([]);setSelected([]);})}/>}
  </div>;
}
