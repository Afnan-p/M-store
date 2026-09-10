export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getBatteryBadgeColor(batteryHealth?: number): { bg: string; text: string; border: string } {
  if (!batteryHealth) return { bg: 'bg-zinc-800', text: 'text-zinc-300', border: 'border-zinc-700' };
  
  if (batteryHealth >= 90) {
    return { bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-800/50' };
  } else if (batteryHealth >= 85) {
    return { bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-800/50' };
  } else {
    return { bg: 'bg-orange-950/60', text: 'text-orange-400', border: 'border-orange-800/50' };
  }
}
