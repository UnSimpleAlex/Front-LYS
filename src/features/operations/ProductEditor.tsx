import { useState } from "react";
import { categories } from "../carta/catalog";
import { OperationsDialog } from "./OperationsDialog";
import { ProductDetails } from "./ProductDetails";
import { Icon } from "./OperationsVisuals";
import { readUpload } from "./imageUpload";
import { saveProduct, type MenuProduct } from "./operationsStore";
import { productSku } from "./productHelpers";

export function ProductEditor({initial,exists,notify,onClose}: {initial:MenuProduct;exists:boolean;notify:(task:()=>void)=>void;onClose:()=>void}) {
  const [product,setProduct]=useState<MenuProduct>({...initial,sku:productSku(initial),ingredients:[...(initial.ingredients || [])],channels:initial.channels || ["Salón","Recojo","Delivery"]});
  const [error,setError]=useState("");
  const [preview,setPreview]=useState(false);
  const patch=(value:Partial<MenuProduct>)=>setProduct(p=>({...p,...value}));
  const images=[...new Set([product.image,...(product.gallery || [])])];
  return <><OperationsDialog title={exists ? "Editar producto":"Nuevo producto"} icon="box" onClose={onClose} className="ops-product-dialog">
    <form className="ops-product-form" onSubmit={e=>{e.preventDefault();notify(()=>{saveProduct(product);onClose();});}}>
      <div className="ops-product-editor-layout">
        <section className="ops-product-media"><h3>Imágenes del producto</h3><p>Imagen principal y galería de fotos</p>
          <img className="ops-editor-photo" src={product.image} alt="Vista previa del producto"/>
          <div className="ops-product-thumbnails">{images.map((src,i)=><button key={src} type="button" aria-label={`Usar imagen ${i+1} como principal`} aria-pressed={src===product.image} onClick={()=>patch({image:src,gallery:images.filter(s=>s!==src)})}><img src={src} alt=""/></button>)}</div>
          <label className="ops-product-upload"><Icon name="grid"/><span>Cambiar imagen<small>JPG, PNG o WebP · Máx. 5 MB</small></span><input aria-label="Imagen del producto" type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>{const file=e.target.files?.[0];if(file) void readUpload(file).then(image=>{setProduct(p=>({...p,image,gallery:[...new Set([...(p.gallery || []),p.image])].filter(s=>s!=="/images/logo.webp")}));setError("");}).catch(err=>setError(err.message));}}/></label>
          {error && <p role="alert">{error}</p>}
          <section className="ops-product-publication"><h3>Estado y publicación</h3><p>Controla la visibilidad del producto</p><label className="ops-check"><input type="checkbox" checked={product.active} onChange={e=>patch({active:e.target.checked})}/>Producto disponible</label><h4>Canales de venta</h4><div className="ops-product-channels">{["Salón","Recojo","Delivery"].map(channel=><label className="ops-check" key={channel}><input type="checkbox" checked={product.channels?.includes(channel)} onChange={e=>patch({channels:e.target.checked ? [...(product.channels || []),channel]:(product.channels || []).filter(c=>c!==channel)})}/>{channel}</label>)}</div></section>
        </section>
        <div className="ops-product-fields">
          <div className="ops-field-grid"><label>Nombre del producto<input required value={product.name} onChange={e=>patch({name:e.target.value})}/></label><label>Categoría<select value={product.category} onChange={e=>patch({category:e.target.value})}>{categories.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></label></div>
          <div className="ops-field-grid three"><label>Precio (S/)<input type="number" required min="0.01" step="0.01" value={product.price} onChange={e=>patch({price:Number(e.target.value)})}/></label><label>Stock<input type="number" required min="0" step="1" value={product.stock ?? 0} onChange={e=>patch({stock:Number(e.target.value)})}/></label><label>SKU<input value={product.sku || ""} placeholder="Código interno" onChange={e=>patch({sku:e.target.value})}/></label></div>
          <div className="ops-field-grid"><label>Sucursal<input value={product.branch || "Principal"} onChange={e=>patch({branch:e.target.value})}/></label><label>Tiempo estimado (min)<input type="number" min="1" step="1" value={product.preparationMinutes ?? ""} onChange={e=>patch({preparationMinutes:e.target.value ? Number(e.target.value):undefined})}/></label></div>
          <label>Descripción<textarea rows={3} value={product.description} onChange={e=>patch({description:e.target.value})}/></label>
          <section className="ops-ingredient-editor"><h3>Ingredientes y acompañamientos</h3><p>Agrega lo que incluye este producto</p>{product.ingredients?.map((ingredient,i)=><div key={i}><input aria-label={`Ingrediente ${i+1}`} value={ingredient} required onChange={e=>patch({ingredients:product.ingredients?.map((s,index)=>index===i ? e.target.value:s)})}/><button type="button" aria-label={`Eliminar ingrediente ${i+1}`} onClick={()=>patch({ingredients:product.ingredients?.filter((_,index)=>i!==index)})}><Icon name="trash"/></button></div>)}<button type="button" onClick={()=>patch({ingredients:[...(product.ingredients || []),""]})}><Icon name="plus"/>Agregar ingrediente</button></section>
          <label>Observaciones<textarea rows={3} value={product.observations || ""} onChange={e=>patch({observations:e.target.value})}/></label>
        </div>
      </div>
      <footer className="ops-dialog-footer"><button type="button" onClick={onClose}>Cancelar</button><button type="button" onClick={()=>setPreview(true)}><Icon name="eye"/>Vista previa</button><button className="ops-primary"><Icon name="save"/>Guardar producto</button></footer>
    </form>
  </OperationsDialog>{preview && <ProductDetails product={product} onClose={()=>setPreview(false)} onEdit={()=>setPreview(false)}/>}</>;
}
