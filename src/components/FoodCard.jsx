import React from 'react';

export default function FoodCard({
    image = 'https://via.placeholder.com/300x200?text=Food+Image',
    title = 'Beef with Rice',
    price = 'KSH 450',
    description = 'Delicious seasoned beef served with steamed basmati rice and fresh veggies.',
    onBuy,
    onAddToCart,
}) {
    return (
        <div className="w-80 bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex flex-col">

            <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                {image ? (
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-400 font-bold uppercase text-xs">IMAGE</span>
                )}
            </div>


            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                <h3 className="font-bold text-sm text-gray-800 tracking-wide uppercase">{title}</h3>
                <span className="font-black text-xs text-black">{price}</span>
            </div>

            <div className="bg-[#FF7A38] p-4 flex flex-col justify-between flex-1 text-white">
                <p className="text-xs uppercase font-medium leading-relaxed tracking-wider mb-4 opacity-95">
                    {description}
                </p>


                <div className="flex gap-2 pt-2">
                    <button
                        onClick={onBuy}
                        className="flex-1 bg-black text-white text-[10px] font-black uppercase tracking-wider py-2 px-1 rounded hover:bg-gray-800 transition-colors"
                    >
                        Buy Munchies
                    </button>
                    <button
                        onClick={onAddToCart}
                        className="flex-1 bg-black text-white text-[10px] font-black uppercase tracking-wider py-2 px-1 rounded hover:bg-gray-800 transition-colors"
                    >
                        Add To FoodCart
                    </button>
                </div>
            </div>
        </div>
    );
}