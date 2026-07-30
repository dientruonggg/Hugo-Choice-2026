import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

const STORAGE_KEY_GUESTS = 'hugo_award_2026_guest_list';

export interface GuestEntry {
  name: string;
  addedAt: string;
}

export const getGuestEntries = (): GuestEntry[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_GUESTS);
    if (saved) return JSON.parse(saved);
  } catch {
    // Ignore
  }
  return [];
};

export const addGuestName = (guestName: string): GuestEntry[] => {
  const cleanName = guestName.trim();
  if (!cleanName) return getGuestEntries();

  const current = getGuestEntries();
  const exists = current.some(g => g.name.toLowerCase() === cleanName.toLowerCase());
  
  if (!exists) {
    const newEntry: GuestEntry = {
      name: cleanName,
      addedAt: new Date().toISOString()
    };
    const updated = [newEntry, ...current];
    try {
      localStorage.setItem(STORAGE_KEY_GUESTS, JSON.stringify(updated));
    } catch {
      // Ignore
    }

    // Save to Firestore 'guests' collection separately from official members
    saveGuestToFirestore(newEntry);

    return updated;
  }
  return current;
};

const saveGuestToFirestore = async (guest: GuestEntry) => {
  if (!db) return;
  try {
    const docId = guest.name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    await setDoc(doc(db, 'guests', docId), {
      name: guest.name,
      addedAt: guest.addedAt,
      type: 'guest'
    }, { merge: true });
  } catch (err) {
    console.warn("Could not save guest name to Firestore:", err);
  }
};

export const exportGuestListTxt = () => {
  const guests = getGuestEntries();
  if (guests.length === 0) return;

  const content = [
    "=== DANH SÁCH KHÁCH MỜI / GUEST NAMES (HUGO CHOICE 2026) ===",
    `Ngày xuất file: ${new Date().toLocaleString('vi-VN')}`,
    "--------------------------------------------------",
    ...guests.map((g, idx) => `${idx + 1}. ${g.name} - Ngày đăng ký: ${new Date(g.addedAt).toLocaleString('vi-VN')}`),
    "--------------------------------------------------",
    `Tổng số khách mời: ${guests.length}`
  ].join('\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hugo_guest_list_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
