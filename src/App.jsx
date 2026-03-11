import { useReducer, useState } from 'react'

// ── PRODUCTS ───────────────────────────────────────────────────
const products = [
  {
    id: 1,
    name: 'Merino Overshirt',
    category: 'Knitwear',
    price: 340,
    color: 'Oatmeal',
    description: 'Brushed merino wool, relaxed silhouette. Ethically sourced.',
    bg: '#e8e2d9',
    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
  },
  {
    id: 2,
    name: 'Cotton Twill Trouser',
    category: 'Trousers',
    price: 280,
    color: 'Chalk',
    description: 'Mid-rise, tapered leg. Japanese cotton twill.',
    bg: '#ddd8cf',
    img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80',
  },
  {
    id: 3,
    name: 'Cashmere Crewneck',
    category: 'Knitwear',
    price: 520,
    color: 'Camel',
    description: 'Grade-A Mongolian cashmere. Ribbed hem and cuffs.',
    bg: '#d4c4a8',
    img: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&q=80',
  },
  {
    id: 4,
    name: 'Linen Field Jacket',
    category: 'Outerwear',
    price: 460,
    color: 'Sage',
    description: 'Washed Italian linen. Four-pocket utility silhouette.',
    bg: '#c8d4c4',
    img: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&q=80',
  },
  {
    id: 5,
    name: 'Suede Derby',
    category: 'Footwear',
    price: 390,
    color: 'Tan',
    description: 'Full-grain suede upper. Leather sole, Goodyear welted.',
    bg: '#d4c0a0',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  },
  {
    id: 6,
    name: 'Canvas Tote',
    category: 'Accessories',
    price: 120,
    color: 'Natural',
    description: 'Heavy-duty waxed canvas. Brass hardware.',
    bg: '#e0d8cc',
    img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
  },
]

// ── REDUCER ────────────────────────────────────────────────────
const initialState = {
  items: [],
  isOpen: false,
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, qty: 1 }],
      }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    case 'INCREMENT':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload ? { ...i, qty: i.qty + 1 } : i
        ),
      }
    case 'DECREMENT':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload
            ? { ...i, qty: Math.max(1, i.qty - 1) }
            : i
        ),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    default:
      return state
  }
}

// ── HELPERS ────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n)

// ── PRODUCT CARD ───────────────────────────────────────────────
function ProductCard({ product, onAdd }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="product-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="product-image" style={{ background: product.bg }}>
        <img src={product.img} alt={product.name} className="product-img" />
        <div className="product-category">{product.category}</div>
        <button
          className={`product-add ${hovered ? 'visible' : ''}`}
          onClick={() => onAdd(product)}
        >
          Add to Cart
        </button>
      </div>
      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div className="product-meta">
          <span className="product-color">{product.color}</span>
          <span className="product-price">{fmt(product.price)}</span>
        </div>
        <div className="product-desc">{product.description}</div>
      </div>
    </div>
  )
}

// ── CART DRAWER ────────────────────────────────────────────────
function CartDrawer({ state, dispatch }) {
  const total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = state.items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <>
      <div
        className={`cart-backdrop ${state.isOpen ? 'open' : ''}`}
        onClick={() => dispatch({ type: 'TOGGLE_CART' })}
      />
      <div className={`cart-drawer ${state.isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div className="cart-title">Cart <span className="cart-count">{count}</span></div>
          <button className="cart-close" onClick={() => dispatch({ type: 'TOGGLE_CART' })}>
            Close
          </button>
        </div>

        <div className="cart-body">
          {state.items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">∅</div>
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="cart-items">
              {state.items.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.img} alt={item.name} className="cart-item-swatch" style={{ objectFit: 'cover' }} />
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-color">{item.color}</div>
                    <div className="cart-item-price">{fmt(item.price)}</div>
                  </div>
                  <div className="cart-item-controls">
                    <button onClick={() => dispatch({ type: 'DECREMENT', payload: item.id })}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => dispatch({ type: 'INCREMENT', payload: item.id })}>+</button>
                    <button
                      className="cart-item-remove"
                      onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {state.items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>
            <button className="cart-checkout">Proceed to Checkout</button>
            <button
              className="cart-clear"
              onClick={() => dispatch({ type: 'CLEAR' })}
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// ── APP ────────────────────────────────────────────────────────
function App() {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const [filter, setFilter] = useState('All')

  const categories = ['All', ...new Set(products.map(p => p.category))]
  const filtered = filter === 'All' ? products : products.filter(p => p.category === filter)
  const cartCount = state.items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">CARTEX</div>
          <nav className="nav">
            {categories.map(c => (
              <button
                key={c}
                className={`nav-btn ${filter === c ? 'active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </nav>
          <button
            className="cart-trigger"
            onClick={() => dispatch({ type: 'TOGGLE_CART' })}
          >
            Bag
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      <main className="main">
        <div className="hero">
          <div className="hero-eyebrow">New Collection</div>
          <h1 className="hero-title">Considered<br /><em>Essentials</em></h1>
          <p className="hero-sub">Refined basics. Lasting quality. No compromise.</p>
        </div>

        <div className="product-grid">
          {filtered.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              onAdd={(product) => dispatch({ type: 'ADD_ITEM', payload: product })}
            />
          ))}
        </div>
      </main>

      <CartDrawer state={state} dispatch={dispatch} />

      <footer className="footer">
        <span>Cartex</span>
      </footer>
    </div>
  )
}

export default App