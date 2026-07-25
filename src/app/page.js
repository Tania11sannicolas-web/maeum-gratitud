"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

// --- DICCIONARIO MULTI-IDIOMA (Punto 13) ---
const dict = {
  es: { explore: "Explorar", gallery: "Galería", profile: "Perfil", login: "Entrar", email: "Correo", password: "Contraseña", terms: "Acepto los Términos y Política de Privacidad", register: "Crear cuenta", empty: "Aún no hay destellos guardados.", delete: "Borrar", deleteConfirm: "¿Soltar este recuerdo?", yes: "Sí", no: "No", phrase: "Tu frase inspiradora", save: "Guardar", audio: "Audio" },
  en: { explore: "Explore", gallery: "Gallery", profile: "Profile", login: "Log In", email: "Email", password: "Password", terms: "I accept Terms and Privacy Policy", register: "Sign Up", empty: "No flashes saved yet.", delete: "Delete", deleteConfirm: "Let go of this memory?", yes: "Yes", no: "No", phrase: "Your inspiring quote", save: "Save", audio: "Audio" }
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Perfil y preferencias
  const [likes, setLikes] = useState([]);
  const [userPhrase, setUserPhrase] = useState("");
  const [lang, setLang] = useState("es");
  
  // UX / UI Estados
  const [currentTab, setCurrentTab] = useState("explore"); // explore, gallery, profile
  const [fullScreenPhoto, setFullScreenPhoto] = useState(null);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Motor Unsplash (Puntos 1 y 2)
  const categories = ["nature", "art", "space", "animals", "cities", "minimal"];
  const [activeCategory, setActiveCategory] = useState("nature");
  const [feedPhotos, setFeedPhotos] = useState([]);
  const seenIds = useRef(new Set()); // Evita imágenes repetidas
  const loadingRef = useRef(false);

  // Inicialización (Idioma, Sesión y Audio)
  useEffect(() => {
    const userLang = navigator.language.slice(0, 2);
    if (dict[userLang]) setLang(userLang);

    audioRef.current = new Audio("https://ice1.somafm.com/dronezone-128-mp3");
    audioRef.current.loop = true;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) loadUserData(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadUserData(session.user);
      else { setUser(null); setLikes([]); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = (u) => {
    setUser(u);
    if (u.user_metadata?.likes) setLikes(u.user_metadata.likes);
    if (u.user_metadata?.phrase) setUserPhrase(u.user_metadata.phrase);
  };

  // Carga de fotos
  const loadMorePhotos = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const res = await fetch(`https://api.unsplash.com/photos/random?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_KEY}&count=12&query=${activeCategory}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        const newPhotos = data.filter(img => !seenIds.current.has(img.id)).map(img => {
          seenIds.current.add(img.id);
          return { id: img.id, url: img.urls.regular, title: img.alt_description || "Pausa" };
        });
        setFeedPhotos(prev => [...prev, ...newPhotos]);
      }
    } catch (error) { console.log("Cargando..."); }
    loadingRef.current = false;
  };

  // Recargar si cambia la categoría
  useEffect(() => {
    setFeedPhotos([]);
    seenIds.current.clear();
    loadMorePhotos();
  }, [activeCategory]);

  // Scroll Infinito
  useEffect(() => {
    const handleScroll = () => {
      if (currentTab !== "explore") return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 600) {
        if (!user) setShowAuthModal(true);
        else loadMorePhotos();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [user, currentTab, activeCategory]);

  // Autenticación con Contraseña (Punto 9)
  const handleAuth = async (e) => {
    e.preventDefault();
    if (!isLogin && !acceptedTerms) return alert(dict[lang].terms);

    let authResult;
    if (isLogin) {
      authResult = await supabase.auth.signInWithPassword({ email, password });
    } else {
      authResult = await supabase.auth.signUp({ 
        email, password, 
        options: { data: { full_name: name, likes: [], phrase: "" } }
      });
    }

    if (authResult.error) alert(authResult.error.message);
    else setShowAuthModal(false);
  };

  const toggleLike = async (photo) => {
    if (!user) return setShowAuthModal(true);
    
    let newLikes = [...likes];
    const exists = newLikes.find(p => p.id === photo.id);
    if (exists) newLikes = newLikes.filter(p => p.id !== photo.id);
    else newLikes.push(photo);
    
    setLikes(newLikes);
    // Guardar en Supabase para persistencia (Punto 7)
    await supabase.auth.updateUser({ data: { likes: newLikes } });
  };

  const confirmDelete = async (id) => {
    const newLikes = likes.filter(p => p.id !== id);
    setLikes(newLikes);
    await supabase.auth.updateUser({ data: { likes: newLikes } });
    setPhotoToDelete(null);
    if (fullScreenPhoto?.id === id) setFullScreenPhoto(null);
  };

  const saveProfile = async () => {
    await supabase.auth.updateUser({ data: { phrase: userPhrase } });
    alert(dict[lang].save + " ✓");
  };

  const toggleAudio = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const t = dict[lang] || dict.es;

  return (
    <main className="min-h-screen bg-white text-neutral-800 pb-24 font-light">
      
      {/* HEADER MINIMALISTA Y MÚSICA */}
      <header className="py-8 px-6 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-neutral-100">
        <h1 className="text-xl tracking-widest uppercase font-normal">Maeum</h1>
        <button onClick={toggleAudio} className={`p-2 rounded-full transition-all ${isPlaying ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
           {/* Ícono de Audio */}
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zm12-3c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zM9 10l12-3"/></svg>
        </button>
      </header>

      {/* VISTA EXPLORAR */}
      {currentTab === "explore" && (
        <section className="max-w-6xl mx-auto p-4">
          {/* Categorías Horizontales (Puntos 1 y 2) */}
          <div className="flex overflow-x-auto gap-4 pb-4 mb-6 scrollbar-hide snap-x">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`snap-center whitespace-nowrap px-4 py-1.5 text-xs rounded-full border transition-all ${activeCategory === cat ? 'border-neutral-900 text-neutral-900' : 'border-neutral-200 text-neutral-400'}`}>
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {feedPhotos.map((photo) => {
              const isLiked = likes.some(p => p.id === photo.id);
              return (
                <div key={photo.id} className="relative group bg-neutral-50 overflow-hidden rounded-md">
                  <img src={photo.url} alt={photo.title} loading="lazy" className="w-full h-[28rem] object-cover transition-transform duration-700 group-hover:scale-105" />
                  <button onClick={() => toggleLike(photo)} className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg active:scale-95 transition-all">
                    <svg className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-neutral-400 fill-none'}`} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* VISTA GALERÍA (Puntos 4 y 5) */}
      {currentTab === "gallery" && (
        <section className="max-w-6xl mx-auto p-4">
          <h2 className="text-center text-xs tracking-widest uppercase text-neutral-400 mb-8">{t.gallery} ({likes.length})</h2>
          {likes.length === 0 ? (
            <p className="text-center text-neutral-400 text-sm mt-20">{t.empty}</p>
          ) : (
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {likes.map((photo) => (
                <div key={photo.id} className="relative aspect-square cursor-pointer group" onClick={() => setFullScreenPhoto(photo)}>
                  <img src={photo.url} className="w-full h-full object-cover rounded-sm" />
                  {/* Botón borrar en grilla */}
                  <button onClick={(e) => { e.stopPropagation(); setPhotoToDelete(photo.id); }} className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* FULLSCREEN GALLERY (Punto 4) */}
      {fullScreenPhoto && (
        <div className="fixed inset-0 bg-black z-50 overflow-y-scroll snap-y snap-mandatory">
          <button onClick={() => setFullScreenPhoto(null)} className="fixed top-6 right-6 z-50 bg-white/20 backdrop-blur-md text-white p-3 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          
          {likes.map(photo => (
            <div key={photo.id} className="h-screen w-full snap-start relative flex items-center justify-center">
               <img src={photo.url} className="w-full h-full object-contain" />
               <button onClick={() => setPhotoToDelete(photo.id)} className="absolute bottom-10 bg-red-500/80 text-white px-6 py-2 rounded-full text-sm tracking-widest uppercase">
                 {t.delete}
               </button>
            </div>
          ))}
        </div>
      )}

      {/* VISTA PERFIL (Punto 8) */}
      {currentTab === "profile" && user && (
        <section className="max-w-md mx-auto p-6 mt-10">
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-neutral-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl text-neutral-300">M</div>
            <h2 className="text-xl font-normal">{user.user_metadata?.full_name || "Explorador"}</h2>
            <p className="text-xs text-neutral-400 mt-1">{user.email}</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs tracking-widest uppercase text-neutral-400 mb-2 block">{t.phrase}</label>
              <textarea value={userPhrase} onChange={(e) => setUserPhrase(e.target.value)} placeholder="Ej. Acepto soltar el control..." className="w-full p-4 border border-neutral-200 rounded-md text-sm outline-none focus:border-neutral-900 resize-none h-24" />
            </div>
            <button onClick={saveProfile} className="w-full bg-neutral-900 text-white py-4 text-xs tracking-widest uppercase rounded-md">{t.save}</button>
            
            <button onClick={async () => { await supabase.auth.signOut(); setCurrentTab("explore"); }} className="w-full border border-neutral-200 text-neutral-600 py-4 text-xs tracking-widest uppercase rounded-md mt-4">
              Salir de la cuenta
            </button>
          </div>
        </section>
      )}

      {/* MENÚ FLOTANTE INFERIOR (Punto 3) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900/90 backdrop-blur-lg px-8 py-4 rounded-full shadow-2xl z-40 flex items-center gap-12 text-white">
        <button onClick={() => setCurrentTab("explore")} className={currentTab === "explore" ? "opacity-100" : "opacity-40"}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        </button>
        <button onClick={() => { if(!user) setShowAuthModal(true); else setCurrentTab("gallery"); }} className={currentTab === "gallery" ? "opacity-100" : "opacity-40"}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </button>
        <button onClick={() => { if(!user) setShowAuthModal(true); else setCurrentTab("profile"); }} className={currentTab === "profile" ? "opacity-100" : "opacity-40"}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </button>
      </nav>

      {/* DIÁLOGO CONFIRMAR BORRADO */}
      {photoToDelete && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg max-w-sm w-full text-center">
            <h3 className="text-sm tracking-widest uppercase mb-6">{t.deleteConfirm}</h3>
            <div className="flex gap-4">
              <button onClick={() => setPhotoToDelete(null)} className="flex-1 py-3 border rounded-md text-xs uppercase tracking-widest">{t.no}</button>
              <button onClick={() => confirmDelete(photoToDelete)} className="flex-1 py-3 bg-red-500 text-white rounded-md text-xs uppercase tracking-widest">{t.yes}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL AUTH CONTRASEÑAS Y TÉRMINOS (Puntos 9 y 14) */}
      {showAuthModal && !user && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg max-w-sm w-full relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-neutral-400">✕</button>
            <h3 className="text-sm text-center tracking-widest uppercase mb-6">{isLogin ? t.login : t.register}</h3>
            
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <input type="text" placeholder="Tu nombre" required onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border-b border-neutral-200 text-sm outline-none" />
              )}
              <input type="email" placeholder={t.email} required onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border-b border-neutral-200 text-sm outline-none" />
              <input type="password" placeholder={t.password} required minLength="6" onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border-b border-neutral-200 text-sm outline-none" />
              
              {!isLogin && (
                <label className="flex items-start gap-2 mt-4 text-xs text-neutral-500 cursor-pointer">
                  <input type="checkbox" required onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-0.5" />
                  <span>{t.terms} <a href="#" className="underline">Ver aquí</a></span>
                </label>
              )}

              <button type="submit" className="w-full bg-neutral-900 text-white py-4 mt-6 text-xs uppercase tracking-widest rounded-md">
                {isLogin ? t.login : t.register}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-3">
              <button className="w-full py-3 border rounded-md text-xs flex justify-center items-center gap-2">
                Continuar con Google
              </button>
              <button className="w-full py-3 border rounded-md text-xs flex justify-center items-center gap-2">
                Continuar con Apple
              </button>
            </div>

            <button onClick={() => setIsLogin(!isLogin)} className="w-full text-center mt-6 text-xs text-neutral-400 underline">
              {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}