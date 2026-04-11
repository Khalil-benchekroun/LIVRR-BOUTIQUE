import { useState, useEffect, useCallback, useRef } from "react";

/* ============================================================
   LIVRR — Notifications Push Simulées
   Usage dans Sidebar.js :
     import { useNotifications } from "./useNotifications";
     const { notifs, unreadCount, markRead, markAllRead } = useNotifications();
   ============================================================ */

const NOTIF_POOL = [
  { type:"order",   icon:"📦", getText:() => `Nouvelle commande #LV-${String(Math.floor(Math.random()*900)+100).padStart(5,"0")} — ${randomClient()}` },
  { type:"stock",   icon:"⚠️", getText:() => `Stock critique : ${randomProduit()} (${Math.floor(Math.random()*3)+1} restant${Math.random()>0.5?"s":""})` },
  { type:"payment", icon:"💳", getText:() => `Versement de ${(Math.floor(Math.random()*2000)+500).toLocaleString("fr")} € effectué sur votre compte` },
  { type:"return",  icon:"↩️", getText:() => `Demande de retour — Commande #LV-${String(Math.floor(Math.random()*900)+100).padStart(5,"0")}` },
  { type:"psp",     icon:"⏳", getText:() => `Fonds disponibles après délai PSP : ${(Math.floor(Math.random()*1500)+200).toLocaleString("fr")} €` },
  { type:"message", icon:"💬", getText:() => `Nouveau message de ${randomClient()} : "${randomMessage()}"` },
  { type:"avis",    icon:"⭐", getText:() => `Nouvel avis ${randomStars()} de ${randomClient()}` },
  { type:"livraison",icon:"🛵",getText:() => `Livraison #LV-${String(Math.floor(Math.random()*900)+100).padStart(5,"0")} confirmée par le coursier` },
];

const CLIENTS = ["Sophie M.","Camille D.","Marie L.","Julie P.","Emma B.","Sarah K.","Léa R.","Inès T.","Clara B.","Nadia S."];
const PRODUITS = ["Robe Midi Fleurie","Trench Camel","Blazer Structuré","Mules Beige","Sérum Éclat","Parfum Oud","Sac Cabas","Pull Cachemire"];
const MESSAGES = ["Est-ce que cette robe est disponible en 38 ?","Livraison possible avant 18h ?","Merci pour la rapidité !","Pouvez-vous emballer en cadeau ?"];
const STARS_LIST = ["⭐⭐⭐⭐⭐","⭐⭐⭐⭐","⭐⭐⭐⭐⭐"];

const randomClient  = () => CLIENTS[Math.floor(Math.random()*CLIENTS.length)];
const randomProduit = () => PRODUITS[Math.floor(Math.random()*PRODUITS.length)];
const randomMessage = () => MESSAGES[Math.floor(Math.random()*MESSAGES.length)];
const randomStars   = () => STARS_LIST[Math.floor(Math.random()*STARS_LIST.length)];

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60)   return "À l'instant";
  if (diff < 3600) return `Il y a ${Math.floor(diff/60)} min`;
  if (diff < 86400)return `Il y a ${Math.floor(diff/3600)}h`;
  return `Il y a ${Math.floor(diff/86400)}j`;
};

const INIT_NOTIFS = [
  { id:1, type:"order",   icon:"📦", text:"Nouvelle commande #LV-00249 — Sophie M.", timestamp: Date.now()-120000,  read:false },
  { id:2, type:"stock",   icon:"⚠️", text:"Stock critique : Robe Midi Fleurie (2 restants)", timestamp: Date.now()-900000,  read:false },
  { id:3, type:"payment", icon:"💳", text:"Versement de 1 284 € effectué sur votre compte", timestamp: Date.now()-3600000, read:false },
  { id:4, type:"return",  icon:"↩️", text:"Demande de retour — Commande #LV-00220", timestamp: Date.now()-7200000, read:true  },
  { id:5, type:"psp",     icon:"⏳", text:"Fonds disponibles après délai PSP : 712 €", timestamp: Date.now()-10800000,read:true  },
];

let nextId = 10;

export function useNotifications(intervalMs = 45000) {
  const [notifs, setNotifs] = useState(INIT_NOTIFS);
  const [lastNotif, setLastNotif] = useState(null);
  const timerRef = useRef(null);

  // Génère une nouvelle notif simulée
  const generateNotif = useCallback(() => {
    const pool = NOTIF_POOL[Math.floor(Math.random() * NOTIF_POOL.length)];
    const newNotif = {
      id: ++nextId,
      type: pool.type,
      icon: pool.icon,
      text: pool.getText(),
      timestamp: Date.now(),
      read: false,
    };
    setNotifs(prev => [newNotif, ...prev].slice(0, 20)); // max 20 notifs
    setLastNotif(newNotif);
    return newNotif;
  }, []);

  // Lance l'intervalle de génération
  useEffect(() => {
    timerRef.current = setInterval(generateNotif, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [generateNotif, intervalMs]);

  // Mise à jour des timestamps affichés
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const t = setInterval(() => forceUpdate(n => n+1), 30000);
    return () => clearInterval(t);
  }, []);

  const markRead     = (id) => setNotifs(prev => prev.map(n => n.id===id ? {...n, read:true} : n));
  const markAllRead  = ()   => setNotifs(prev => prev.map(n => ({...n, read:true})));
  const deleteNotif  = (id) => setNotifs(prev => prev.filter(n => n.id !== id));
  const clearAll     = ()   => setNotifs([]);

  const unreadCount = notifs.filter(n => !n.read).length;

  // Notifs avec temps relatif calculé
  const notifsWithTime = notifs.map(n => ({
    ...n,
    timeLabel: timeAgo(n.timestamp),
  }));

  return {
    notifs: notifsWithTime,
    unreadCount,
    markRead,
    markAllRead,
    deleteNotif,
    clearAll,
    lastNotif,
    generateNotif, // pour tester manuellement
  };
}