import React, { useState } from 'react';
import toast from 'react-hot-toast';

const INIT_PRODUCTS = [
  { _id:'p1', emoji:'👗', name:'Robe Midi Fleurie', brand:'Sandro', category:'Vêtements', price:490, stock:{ XS:4, S:2, M:8, L:5, XL:3 }, active:true, featured:true },
  { _id:'p2', emoji:'🧥', name:'Trench Camel', brand:'Sandro', category:'Vêtements', price:890, stock:{ XS:1, S:3, M:0, L:2, XL:4 }, active:true, featured:false },
  { _id:'p3', emoji:'🥼', name:'Blazer Structuré', brand:'Sandro', category:'Vêtements', price:295, stock:{ XS:6, S:0, M:4, L:3, XL:2 }, active:true, featured:true },
  { _id:'p4', emoji:'👒', name:'Chapeau Panama', brand:'Sandro', category:'Accessoires', price:189, stock:{ 'Unique':12 }, active:true, featured:false },
  { _id:'p5', emoji:'👛', name:'Pochette Satin', brand:'Sandro', category:'Accessoires', price:245, stock:{ 'Unique':0 }, active:false, featured:false },
];

const EMPTY = { emoji:'', name:'', brand:'Sandro', category:'Vêtements', price:'', description:'', sizes:'XS,S,M,L,XL', stockDefault:'5' };

export default function Products() {
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [filterCat, setFilterCat] = useState('all');

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const openNew = () => { setForm(EMPTY); setEditProduct(null); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ ...p, sizes: Object.keys(p.stock).join(','), stockDefault: Object.values(p.stock)[0] });
    setEditProduct(p);
    setShowModal(true);
  };

  const handleSave = () => {
    const sizes = form.sizes.split(',').map(s => s.trim());
    const stock = {};
    sizes.forEach(s => stock[s] = parseInt(form.stockDefault) || 0);

    if (editProduct) {
      setProducts(prev => prev.map(p => p._id === editProduct._id ? { ...p, ...form, price: +form.price, stock } : p));
      toast.success('Produit mis à jour');
    } else {
      const newP = { ...form, _id: 'p' + Date.now(), price: +form.price, stock, active: true, featured: false };
      setProducts(prev => [...prev, newP]);
      toast.success('Produit ajouté !');
    }
    setShowModal(false);
  };

  const toggleActive = (id) => {
    setProducts(prev => prev.map(p => p._id === id ? { ...p, active: !p.active } : p));
    toast.success('Statut mis à jour');
  };

  const updateStock = (id, size, val) => {
    setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: { ...p.stock, [size]: Math.max(0, parseInt(val) || 0) } } : p));
  };

  const filtered = products
    .filter(p => filterCat === 'all' || p.category === filterCat)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const totalStock = (p) => Object.values(p.stock).reduce((a, b) => a + b, 0);

  return (
    <div className="page">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'28px' }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'36px', fontWeight:'400' }}>Produits & Stocks</h1>
          <p style={{ color:'var(--gray)', fontSize:'14px', marginTop:'4px' }}>{products.length} produits · {products.filter(p=>p.active).length} actifs</p>
        </div>
        <button className="btn-gold" onClick={openNew}>+ Ajouter un produit</button>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:'12px', marginBottom:'20px', alignItems:'center' }}>
        <input className="input-field" placeholder="🔍 Rechercher…" value={search} onChange={e=>setSearch(e.target.value)} style={{ maxWidth:'260px' }} />
        {['all','Vêtements','Accessoires','Beauté','Chaussures'].map(c => (
          <button key={c} onClick={()=>setFilterCat(c)} style={{
            padding:'8px 16px', borderRadius:'20px', fontSize:'13px', cursor:'pointer', fontFamily:'var(--font-body)', border:'none',
            background: filterCat===c ? 'var(--noir)' : 'var(--white)',
            color: filterCat===c ? 'var(--white)' : 'var(--gray)',
            fontWeight: filterCat===c ? '500' : '400',
          }}>{c === 'all' ? 'Tous' : c}</button>
        ))}
      </div>

      {/* Products table */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <table className="table">
          <thead>
            <tr><th>Produit</th><th>Catégorie</th><th>Prix</th><th>Stock total</th><th>Par taille</th><th>Statut</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const ts = totalStock(p);
              const lowStock = ts <= 3 && ts > 0;
              const outOfStock = ts === 0;
              return (
                <tr key={p._id}>
                  <td>
                    <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                      <span style={{ fontSize:'24px' }}>{p.emoji}</span>
                      <div>
                        <div style={{ fontWeight:'500', fontSize:'14px' }}>{p.name}</div>
                        <div style={{ fontSize:'12px', color:'var(--gray)' }}>{p.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-gray">{p.category}</span></td>
                  <td style={{ fontWeight:'600' }}>€{p.price}</td>
                  <td>
                    <span style={{ fontWeight:'600', color: outOfStock ? 'var(--error)' : lowStock ? 'var(--warning)' : 'var(--success)' }}>
                      {outOfStock ? '⚠ Rupture' : lowStock ? `⚡ ${ts} restants` : ts}
                    </span>
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                      {Object.entries(p.stock).map(([size, qty]) => (
                        <div key={size} style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                          <span style={{ fontSize:'11px', color:'var(--gray)' }}>{size}:</span>
                          <input type="number" value={qty} min="0"
                            onChange={e => updateStock(p._id, size, e.target.value)}
                            style={{ width:'40px', padding:'3px 6px', border:'1px solid rgba(0,0,0,0.12)', borderRadius:'6px', fontSize:'12px', textAlign:'center', fontFamily:'var(--font-body)', color: qty===0 ? 'var(--error)' : qty<=2 ? 'var(--warning)' : 'var(--noir)' }} />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
                      <button onClick={()=>toggleActive(p._id)} style={{
                        width:'40px', height:'22px', borderRadius:'11px', border:'none', cursor:'pointer',
                        background: p.active ? 'var(--success)' : 'rgba(0,0,0,0.15)',
                        position:'relative', transition:'0.2s',
                      }}>
                        <div style={{ width:'16px', height:'16px', borderRadius:'50%', background:'white', position:'absolute', top:'3px', transition:'0.2s', left: p.active ? '21px' : '3px' }} />
                      </button>
                      <span style={{ fontSize:'12px', color: p.active ? 'var(--success)' : 'var(--gray)' }}>{p.active ? 'Actif' : 'Inactif'}</span>
                    </div>
                  </td>
                  <td>
                    <button className="btn-outline" style={{ padding:'6px 12px', fontSize:'12px' }} onClick={()=>openEdit(p)}>Modifier</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
          <div style={{ background:'var(--white)', borderRadius:'var(--radius-xl)', padding:'36px', width:'100%', maxWidth:'520px', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'24px' }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:'26px', fontWeight:'400' }}>{editProduct ? 'Modifier le produit' : 'Nouveau produit'}</h3>
              <button onClick={()=>setShowModal(false)} style={{ fontSize:'22px', color:'var(--gray)', cursor:'pointer' }}>×</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:'12px' }}>
                <div>
                  <label className="label">Emoji</label>
                  <input className="input-field" value={form.emoji} onChange={set('emoji')} placeholder="👗" style={{ textAlign:'center', fontSize:'24px' }} />
                </div>
                <div>
                  <label className="label">Nom du produit</label>
                  <input className="input-field" value={form.name} onChange={set('name')} />
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div>
                  <label className="label">Marque</label>
                  <input className="input-field" value={form.brand} onChange={set('brand')} />
                </div>
                <div>
                  <label className="label">Prix (€)</label>
                  <input className="input-field" type="number" value={form.price} onChange={set('price')} />
                </div>
              </div>
              <div>
                <label className="label">Catégorie</label>
                <select className="input-field" value={form.category} onChange={set('category')}>
                  {['Vêtements','Chaussures','Accessoires','Beauté','Lifestyle'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Tailles disponibles (séparées par virgule)</label>
                <input className="input-field" value={form.sizes} onChange={set('sizes')} placeholder="XS,S,M,L,XL ou 36,37,38" />
              </div>
              <div>
                <label className="label">Stock initial par taille</label>
                <input className="input-field" type="number" value={form.stockDefault} onChange={set('stockDefault')} />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input-field" value={form.description} onChange={set('description')} rows={3} style={{ resize:'none' }} />
              </div>
              <div style={{ display:'flex', gap:'12px', marginTop:'8px' }}>
                <button className="btn-outline" style={{ flex:1, padding:'13px' }} onClick={()=>setShowModal(false)}>Annuler</button>
                <button className="btn-gold" style={{ flex:1, padding:'13px' }} onClick={handleSave}>
                  {editProduct ? 'Enregistrer' : 'Ajouter le produit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
