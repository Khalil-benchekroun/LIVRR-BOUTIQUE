import { db } from './firebaseClient';
import { ref, push, serverTimestamp } from 'firebase/database';

const PAGE_LABELS = {
  "/": "Vue d'ensemble",
  "/statistiques": "Statistiques & Rapports",
  "/commandes": "Commandes",
  "/commandes-pos": "Commande Manuelle",
  "/retours": "Retours",
  "/produits": "Produits",
  "/categories": "Catégories",
  "/qrcode": "QR Code",
  "/marketing": "Marketing & Coupons",
  "/vendeurs": "Vendeurs",
  "/clients": "Clients",
  "/services": "Services",
  "/messages": "Messages",
  "/parametres": "Paramètres",
  "/finance": "Finance",
  "/support": "Support",
  "/livraisons": "Livraisons",
  "/avis": "Avis clients",
  "/calendrier": "Calendrier",
};

const normalizeId = (id) =>
  id.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');

export const trackEvent = (boutiqueId, eventType, data = {}) => {
  try {
    const id = normalizeId(boutiqueId);
    const eventsRef = ref(db, `tracking/${id}/events`);
    const label = PAGE_LABELS[eventType] || eventType;
    push(eventsRef, {
      type: 'page_view',
      path: eventType,
      label,
      data,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error('Firebase tracking error:', err);
  }
};