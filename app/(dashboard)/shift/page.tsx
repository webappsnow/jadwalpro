'use client';
import { useState, useEffect } from 'react';
import { useData } from '@/hooks/useData';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/useToast';
import { SHIFT_ORDER, HARI_ORDER, HARI_LABELS } from '@/lib/constants';
import type { ShiftCode } from '@/lib/types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function shiftClass(val: string) {
  const u = (val || '').toUpperCase();
  if (u === 'P') return 'badge-p';
  if (u === 'S') return 'badge-s';
  if (u === 'L') return 'badge-l';
  if (u === 'OFF') return 'badge-off';
  return 'badge-empty';
}

function SortableRow({ row, idx, isAdmin, updateShift, data }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: 'relative' as const,
    background: isDragging ? '#f8fafc' : 'transparent',
  };

  const color = data.colors[row.brand] || '#e2e8f0';

  return (
    <tr ref={setNodeRef} style={style} className={idx % 2 === 1 ? 'pair-divider' : ''}>
      <td style={{ textAlign: 'center', color: '#94a3b8', fontWeight: 600, cursor: isAdmin ? 'grab' : 'default' }} {...attributes} {...listeners}>
        {isAdmin ? '⠿' : idx + 1}
      </td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }}></span>
          <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.brand}</span>
        </div>
      </td>
      <td style={{ fontWeight: 500, color: '#475569' }}>{row.name}</td>
      {HARI_ORDER.map((day: any) => {
        const val = row[day as keyof typeof row] as string || '';
        return (
          <td key={day} style={{ textAlign: 'center' }}>
            <span 
              className={`badge-shift ${shiftClass(val)} ${!isAdmin ? 'admin-locked' : ''}`}
              onClick={() => updateShift(idx, day, val)}
            >
              {val || '-'}
            </span>
          </td>
        );
      })}
    </tr>
  );
}

export default function ShiftPage() {
  const { data, saveData } = useData();
  const { isAdmin } = useAdmin();
  const { show } = useToast();
  
  const [sales, setSales] = useState(data.sales);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setSales(data.sales);
    setIsMounted(true);
  }, [data.sales]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const updateShift = async (idx: number, day: string, current: string) => {
    if (!isAdmin) { show('Silakan login admin dulu', true); return; }
    const curIdx = SHIFT_ORDER.indexOf((current || '') as ShiftCode);
    const next = SHIFT_ORDER[(curIdx + 1) % SHIFT_ORDER.length];
    const newSales = data.sales.map((s, i) =>
      i === idx ? { ...s, [day]: next as ShiftCode } : s
    );
    const ok = await saveData({ sales: newSales });
    if (ok) show('Shift diubah');
    else show('Gagal menyimpan', true);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!isAdmin || !over || active.id === over.id) return;

    const oldIndex = sales.findIndex((s: any) => s.id === active.id);
    const newIndex = sales.findIndex((s: any) => s.id === over.id);

    const newSales = arrayMove(sales, oldIndex, newIndex);
    setSales(newSales);
    
    const ok = await saveData({ sales: newSales });
    if (ok) show('Urutan disimpan');
    else show('Gagal menyimpan urutan', true);
  };

  return (
    <section>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Jadwal Shift Promotor</h2>
      </div>
      
      <div className="card-glass" style={{ padding: '0px', overflow: 'hidden' }}>
        
        <div className="desktop-only">
          {isMounted ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <table className="table-modern" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ width: '50px', textAlign: 'center' }}>#</th>
                    <th style={{ width: '130px' }}>BRAND</th>
                    <th style={{ width: '130px' }}>NAMA</th>
                    {HARI_ORDER.map(day => (
                      <th key={day} style={{ textAlign: 'center' }}>{HARI_LABELS[day]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <SortableContext items={sales.map((s: any) => s.id)} strategy={verticalListSortingStrategy}>
                    {sales.map((row: any, idx: number) => (
                      <SortableRow 
                        key={row.id} 
                        row={row} 
                        idx={idx} 
                        isAdmin={isAdmin} 
                        updateShift={updateShift} 
                        data={data} 
                      />
                    ))}
                  </SortableContext>
                </tbody>
              </table>
            </DndContext>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Memuat tabel...</div>
          )}
        </div>

        {/* Mobile View (Kartu Lama) */}
        <div className="mobile-only" style={{ padding: '16px' }}>
          {data.sales.map((row, idx) => {
            const color = data.colors[row.brand] || '#e2e8f0';
            const isPairEnd = (idx % 2 === 1) && (idx < data.sales.length - 1);
            const dividerClass = isPairEnd ? 'pair-divider-mobile' : '';

            return (
              <div key={row.id} className={`shift-card ${dividerClass}`}>
                <div className="shift-card-header">
                  <div className="shift-card-title-wrap">
                    <span className="brand-color-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }}></span>
                    <span className="shift-card-title">{row.brand}</span>
                    <span className="shift-card-name">{row.name}</span>
                  </div>
                </div>
                <div className="day-grid">
                  {HARI_ORDER.map(day => {
                    const val = row[day as keyof typeof row] as string || '';
                    return (
                      <div key={day} className="day-cell">
                        <span className="day-label">{HARI_LABELS[day].substring(0,3)}</span>
                        <span 
                          className={`badge-shift ${shiftClass(val)} ${!isAdmin ? 'admin-locked' : ''}`}
                          onClick={() => updateShift(idx, day, val)}
                        >
                          <span className="badge-label">{val || '-'}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}