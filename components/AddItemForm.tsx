'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { addItemToSheet } from '@/../lib/sheets';
import { InventoryItem } from '@/../lib/types';

type Props = {
  onAdd: (item: InventoryItem) => void;
};

export default function AddItemForm({ onAdd }: Props) {
  const [form, setForm] = useState<Omit<InventoryItem, 'id'>>({
    name: '',
    location: '',
    expiryDate: '',
    quantity: '1',
    category: '',
    image: '',
    barcode: '',
  });

  const [scanning, setScanning] = useState(false);
  const readerRef = useRef<HTMLDivElement>(null);

  const handleScanSuccess = (decodedText: string) => {
    setForm(prev => ({ ...prev, barcode: decodedText }));
    setScanning(false);
  };

  const startScanner = () => {
    if (!readerRef.current) return;
    const html5QrCode = new Html5Qrcode('reader', {
      verbose: false,
      formatsToSupport: [
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
      ]
    });

    html5QrCode.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: 250,
      },
      (decodedText) => {
        html5QrCode.stop().then(() => {
          handleScanSuccess(decodedText);
        });
      },
      (errorMessage) => {
        // Optional: console.log(errorMessage);
      }
    ).catch(err => {
      console.error('Failed to start QR code scanner', err);
    });

    setScanning(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = await addItemToSheet(form);
    onAdd(newItem);
    setForm({ name: '', location: '', expiryDate: '', quantity: '1', category: '', image: '', barcode: '' });
  };

  return (
    <form className="space-y-2 mb-4" onSubmit={handleSubmit}>
      <input className="w-full border p-2 rounded" placeholder="Item Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
      <input className="w-full border p-2 rounded" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
      <input className="w-full border p-2 rounded" placeholder="Expiry Date" type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} />
      <input className="w-full border p-2 rounded" placeholder="Quantity" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
      <input className="w-full border p-2 rounded" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
      <input className="w-full border p-2 rounded" placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
      <input className="w-full border p-2 rounded" placeholder="Barcode" value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} />

      <button type="button" onClick={startScanner} className="w-full bg-blue-500 text-white py-2 rounded">
        Scan Barcode
      </button>

      {/* This is the important line */}
      <div id="reader" ref={readerRef} className="w-full max-w-xs mx-auto"></div>

      <button className="w-full bg-green-500 text-white py-2 rounded" type="submit">
        Add Item
      </button>
    </form>
  );
}
