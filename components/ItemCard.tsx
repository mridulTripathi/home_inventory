import Image from 'next/image';
import { InventoryItem } from '@/../lib/types';

type Props = {
  item: InventoryItem;
  onUpdate: (item: InventoryItem) => void;
};

export default function ItemCard({ item, onUpdate }: Props) {
  const now = new Date();
  const expiry = new Date(item.expiryDate);
  const isExpired = expiry < now;
  const expiringSoon = expiry < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const expiringMonth = expiry < new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  let borderColor = 'border-gray-300';
  if (isExpired) borderColor = 'border-red-500';
  else if (expiringSoon) borderColor = 'border-orange-500';
  else if (expiringMonth) borderColor = 'border-yellow-300';
  else if (item.quantity === '0') borderColor = 'border-red-500';
  else borderColor = 'border-green-500';

  return (
    <div className={`flex items-center p-2 border-2 rounded-xl ${borderColor} shadow-sm bg-white`}>
      <Image
        src={item.image || '/placeholder.png'}
        alt={item.name}
        width={80}
        height={80}
        className="rounded-md object-cover"
      />
      <div className="ml-4 flex-1">
        <div className="font-bold text-lg">{item.name}</div>
        <div className="text-sm text-gray-500">📍 {item.location} | 🗂️ {item.category}</div>
        <div className="text-sm text-gray-600">⏳ {item.expiryDate} | Qty: {item.quantity}</div>
        <div className="mt-1 flex gap-2 text-xs">
          <button className="px-2 py-1 bg-blue-100 rounded" onClick={() =>
            onUpdate({ ...item, quantity: (parseInt(item.quantity) + 1).toString() })
          }>+ Qty</button>
          <button className="px-2 py-1 bg-red-100 rounded" onClick={() =>
            onUpdate({ ...item, quantity: Math.max(0, parseInt(item.quantity) - 1).toString() })
          }>- Qty</button>
        </div>
      </div>
    </div>
  );
}
