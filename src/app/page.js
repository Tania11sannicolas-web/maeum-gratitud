"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

const dict = {
  es: { explore: "Explorar", gallery: "Galería", profile: "Perfil", login: "Entrar", email: "Correo", password: "Contraseña", terms: "Acepto los Términos y Política de Privacidad", register: "Crear cuenta", empty: "Aún no hay destellos guardados.", delete: "Borrar", deleteConfirm: "¿Soltar este recuerdo?", yes: "Sí", no: "No", phrase: "Tu frase inspiradora", save: "Guardar", audio: "Audio", newPass: "Nueva contraseña", avatar: "URL de tu foto de perfil (Opcional)", forgot: "¿Olvidaste tu contraseña?", recover: "Recuperar contraseña" },
  en: { explore: "Explore", gallery: "Gallery", profile: "Profile", login: "Log In", email: "Email", password: "Password", terms: "I accept Terms and Privacy Policy", register: "Sign Up", empty: "No flashes saved yet.", delete: "Delete", deleteConfirm: "Let go of this memory?", yes: "Yes", no: "No", phrase: "Your inspiring quote", save: "Save", audio: "Audio", newPass: "New password", avatar: "Profile photo URL (Optional)", forgot: "Forgot your password?", recover: "Recover password" }
};

const AVAILABLE_TAGS = ["nature", "minimal", "art", "space", "animals", "cities", "flowers", "colors", "ocean", "botanical", "warm", "desert", "abstract", "vintage", "neon", "geometry", "texture", "landscape", "portrait", "macro"];

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Perfil
  const [likes, setLikes] = useState([]);
  const [userPhrase, setUserPhrase] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [profileName, setProfileName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [lang, setLang] = useState("es");
  
  // UX
  const [currentTab, setCurrentTab] = useState("explore"); 
  const [galleryView, setGalleryView] = useState("grid");
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Motor Unsplash
  const [activeCategory, setActiveCategory] = useState("");
  const [feedPhotos, setFeedPhotos] = useState([]);
  const seenIds = useRef(new Set()); 
  const loadingRef = useRef(false);

  // Gestos
  const [longPressedId, setLongPressedId] = useState(null);
  const pressTimer = useRef(null);
  const [swipeStartX, setSwipeStartX] = useState(null);
  const [swipeOffset, setSwipeOffset] = useState({});

  useEffect(() => {
    const userLang = navigator.language.slice(0, 2);
    if (dict[userLang]) setLang(userLang);

    audioRef.current = new Audio("/bg-music.mp3");
    audioRef.current.loop = true;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) loadUserData(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadUserData(session.user);
      else { setUser(null); setLikes([]); setSelectedTags([]); setProfileName(""); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = (u) => {
    setUser(u);
    if (u.user_metadata?.likes) setLikes(u.user_metadata.likes);
    if (u.user_metadata?.phrase) setUserPhrase(u.user_metadata.phrase);
    if (u.user_metadata?.avatarUrl) setAvatarUrl(u.user_metadata.avatarUrl);
    if (u.user_metadata?.full_name) setProfileName(u.user_metadata.full_name);
    
    if (u.user_metadata?.tags && u.user_metadata.tags.length > 0) {
      setSelectedTags(u.user_metadata.tags);
      if(!activeCategory) setActiveCategory(u.user_metadata.tags[0]);
    } else {
      setSelectedTags([]);
      setActiveCategory("");
    }
  };

  const loadMorePhotos = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const querySearch = activeCategory || "minimal,aesthetic";
      const res = await fetch(`https://api.unsplash.com/photos/random?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_KEY}&count=12&query=${querySearch}`);
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

  useEffect(() => {
    setFeedPhotos([]);
    seenIds.current.clear();
    loadMorePhotos();
  }, [activeCategory]);

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

  const handleAuth = async (e) => {
    e.preventDefault();
    
    if (isForgotPassword) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) alert(error.message);
      else {
        alert("Te enviamos un enlace para recuperar tu contraseña.");
        setShowAuthModal(false);
      }
      return;
    }

    if (!isLogin && !acceptedTerms) return alert(dict[lang].terms);

    let authResult;
    if (isLogin) {
      authResult = await supabase.auth.signInWithPassword({ email, password });
    } else {
      authResult = await supabase.auth.signUp({ 
        email, password, 
        options: { data: { full_name: name, likes: [], phrase: "", tags: [], avatarUrl: "" } }
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
    await supabase.auth.updateUser({ data: { likes: newLikes } });
  };

  const confirmDelete = async (id) => {
    const newLikes = likes.filter(p => p.id !== id);
    setLikes(newLikes);
    await supabase.auth.updateUser({ data: { likes: newLikes } });
    setPhotoToDelete(null);
    setLongPressedId(null);
    setSwipeOffset({});
  };

  const saveProfile = async () => {
    const updates = { data: { full_name: profileName, phrase: userPhrase, avatarUrl } };
    await supabase.auth.updateUser(updates);
    if (newPassword) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) alert(error.message);
      else setNewPassword("");
    }
    alert(dict[lang].save + " ✓");
  };

  const toggleTag = async (tag) => {
    let newTags = [...selectedTags];
    if (newTags.includes(tag)) {
      newTags = newTags.filter(t => t !== tag);
    } else {
      if (newTags.length < 5) newTags.push(tag);
    }
    setSelectedTags(newTags);
    if (user) {
      await supabase.auth.updateUser({ data: { tags: newTags } });
    }
  };

  const toggleAudio = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  // Gestos
  const startPress = (id) => {
    pressTimer.current = setTimeout(() => setLongPressedId(id), 600);
  };
  const cancelPress = () => clearTimeout(pressTimer.current);

  const onTouchStart = (e, id) => setSwipeStartX({ x: e.touches[0].clientX, id });
  const onTouchMove = (e, id) => {
    if (swipeStartX?.id === id) {
      const diff = e.touches[0].clientX - swipeStartX.x;
      setSwipeOffset({ [id]: diff });
    }
  };
  const onTouchEnd = (id) => {
    if (swipeOffset[id] && Math.abs(swipeOffset[id]) > 100) {
      setPhotoToDelete(id);
    }
    setSwipeStartX(null);
    setTimeout(() => setSwipeOffset({}), 300);
  };

  const t = dict[lang] || dict.es;

  return (
    <main className="min-h-screen bg-white text-neutral-800 pb-24 font-light">
      
      {/* HEADER */}
      <header className="py-8 px-6 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-neutral-100">
        <h1 className="text-xl tracking-widest uppercase font-normal">Maeum</h1>
        <div className="flex items-center gap-6">
          {!user && (
            <button 
              onClick={() => { setIsLogin(true); setIsForgotPassword(false); setShowAuthModal(true); }} 
              className="text-[10px] sm:text-xs tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              Iniciar sesión / Regístrate
            </button>
          )}
          <button onClick={toggleAudio} className={`p-2 rounded-full transition-all ${isPlaying ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zm12-3c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zM9 10l12-3"/></svg>
          </button>
        </div>
      </header>

      {/* VISTA EXPLORAR */}
      {currentTab === "explore" && (
        <section className="max-w-6xl mx-auto p-4">
          <div className="flex overflow-x-auto gap-4 pb-4 mb-6 scrollbar-hide snap-x">
            {selectedTags.length === 0 ? (
              <p className="text-xs text-neutral-400 italic px-4 py-1.5">En tu perfil puedes elegir las etiquetas de inspiración que prefieras.</p>
            ) : (
              selectedTags.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`snap-center whitespace-nowrap px-4 py-1.5 text-xs rounded-full border transition-all ${activeCategory === cat ? 'border-neutral-900 text-neutral-900' : 'border-neutral-200 text-neutral-400'}`}>
                  {cat.toUpperCase()}
                </button>
              ))
            )}
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

      {/* VISTA GALERÍA */}
      {currentTab === "gallery" && (
        <section className="max-w-6xl mx-auto p-4">
          <div className="flex flex-col items-center mb-10 mt-4 text-center">
             {avatarUrl ? (
               <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover shadow-sm mb-4" />
             ) : (
               <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center text-2xl text-neutral-300 mb-4">
                 {profileName.charAt(0) || "M"}
               </div>
             )}
             {userPhrase && <p className="text-sm italic text-neutral-500 font-light max-w-md mx-auto">"{userPhrase}"</p>}
          </div>

          <div className="flex justify-between items-center mb-6 border-b border-neutral-100 pb-2">
             <h2 className="text-xs tracking-widest uppercase text-neutral-400">{t.gallery} ({likes.length})</h2>
             {galleryView === "feed" && (
               <button onClick={() => setGalleryView("grid")} className="text-xs uppercase text-neutral-900 border px-3 py-1 rounded-full">
                 Ver Mosaico
               </button>
             )}
          </div>

          {likes.length === 0 ? (
            <p className="text-center text-neutral-400 text-sm mt-20">{t.empty}</p>
          ) : galleryView === "grid" ? (
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {likes.map((photo) => (
                <div 
                  key={photo.id} 
                  className="relative aspect-square cursor-pointer overflow-hidden" 
                  onClick={() => { if(longPressedId !== photo.id) setGalleryView("feed"); }}
                  onMouseDown={() => startPress(photo.id)}
                  onMouseUp={cancelPress}
                  onMouseLeave={cancelPress}
                  onTouchStart={() => startPress(photo.id)}
                  onTouchEnd={cancelPress}
                >
                  <img src={photo.url} className="w-full h-full object-cover rounded-sm" />
                  
                  {longPressedId === photo.id && (
                    <div onClick={(e) => { e.stopPropagation(); setPhotoToDelete(photo.id); }} className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 transition-opacity">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {likes.map((photo) => (
                <div 
                  key={photo.id} 
                  className="relative group bg-neutral-50 overflow-hidden rounded-md transition-transform"
                  style={{ transform: `translateX(${swipeOffset[photo.id] || 0}px)` }}
                  onTouchStart={(e) => onTouchStart(e, photo.id)}
                  onTouchMove={(e) => onTouchMove(e, photo.id)}
                  onTouchEnd={() => onTouchEnd(photo.id)}
                >
                  <img src={photo.url} alt={photo.title} loading="lazy" className="w-full h-[28rem] object-cover" />
                </div>
              ))}
              <p className="text-center text-xs text-neutral-400 col-span-full mt-4">Desliza una imagen para borrarla</p>
            </div>
          )}
        </section>
      )}

      {/* VISTA PERFIL */}
      {currentTab === "profile" && user && (
        <section className="max-w-md mx-auto p-6 mt-6">
          <div className="text-center mb-8">
            <input 
              type="text" 
              value={profileName} 
              onChange={(e) => setProfileName(e.target.value)} 
              placeholder="Tu Nombre"
              className="w-full text-2xl font-normal text-center bg-transparent border-b border-transparent focus:border-neutral-200 outline-none pb-2 transition-colors" 
            />
            <p className="text-xs text-neutral-400 mt-2">{user.email}</p>
          </div>

          <div className="space-y-8">
            
            {/* Opciones de Etiquetas */}
            <div>
              <label className="text-xs tracking-widest uppercase text-neutral-900 mb-4 block">Tus etiquetas (Máx. 5)</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-xs rounded-full border transition-all ${selectedTags.includes(tag) ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-500'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Datos y Personalización */}
            <div>
              <label className="text-xs tracking-widest uppercase text-neutral-400 mb-2 block">{t.phrase}</label>
              <textarea value={userPhrase} onChange={(e) => setUserPhrase(e.target.value)} placeholder="Ej. Aceptar que se va a escurrir... soltar" className="w-full p-4 border border-neutral-200 rounded-md text-sm outline-none focus:border-neutral-900 resize-none h-24" />
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-neutral-400 mb-2 block">{t.avatar}</label>
              <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." className="w-full p-4 border border-neutral-200 rounded-md text-sm outline-none focus:border-neutral-900" />
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-neutral-400 mb-2 block">{t.newPass}</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  placeholder="Escribe para cambiar tu contraseña" 
                  minLength="6" 
                  className="w-full p-4 pr-12 border border-neutral-200 rounded-md text-sm outline-none focus:border-neutral-900" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-800"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button onClick={saveProfile} className="w-full bg-neutral-900 text-white py-4 text-xs tracking-widest uppercase rounded-md">{t.save}</button>
            
            <button onClick={async () => { await supabase.auth.signOut(); setCurrentTab("explore"); }} className="w-full border border-neutral-200 text-neutral-600 py-4 text-xs tracking-widest uppercase rounded-md mt-4 transition-colors hover:bg-neutral-50">
              Salir de la cuenta
            </button>
          </div>
        </section>
      )}

      {/* MENÚ FLOTANTE INFERIOR */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900/90 backdrop-blur-lg px-8 py-4 rounded-full shadow-2xl z-40 flex items-center gap-12 text-white">
        <button onClick={() => setCurrentTab("explore")} className={currentTab === "explore" ? "opacity-100" : "opacity-40"}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        </button>
        <button onClick={() => { if(!user) { setIsForgotPassword(false); setShowAuthModal(true); } else setCurrentTab("gallery"); }} className={currentTab === "gallery" ? "opacity-100" : "opacity-40"}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </button>
        <button onClick={() => { if(!user) { setIsForgotPassword(false); setShowAuthModal(true); } else setCurrentTab("profile"); }} className={currentTab === "profile" ? "opacity-100" : "opacity-40"}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </button>
      </nav>

      {/* DIÁLOGO CONFIRMAR BORRADO */}
      {photoToDelete && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg max-w-sm w-full text-center">
            <h3 className="text-sm tracking-widest uppercase mb-6">{t.deleteConfirm}</h3>
            <div className="flex gap-4">
              <button onClick={() => { setPhotoToDelete(null); setSwipeOffset({}); }} className="flex-1 py-3 border rounded-md text-xs uppercase tracking-widest">{t.no}</button>
              <button onClick={() => confirmDelete(photoToDelete)} className="flex-1 py-3 bg-red-500 text-white rounded-md text-xs uppercase tracking-widest">{t.yes}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL AUTH */}
      {showAuthModal && !user && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg max-w-sm w-full relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-neutral-400">✕</button>
            
            <h3 className="text-sm text-center tracking-widest uppercase mb-6">
              {isForgotPassword ? t.recover : (isLogin ? t.login : t.register)}
            </h3>
            
            <form onSubmit={handleAuth} className="space-y-4">
              
              {!isLogin && !isForgotPassword && (
                <input type="text" placeholder="Tu nombre" required onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border-b border-neutral-200 text-sm outline-none" />
              )}
              
              <input type="email" placeholder={t.email} required onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border-b border-neutral-200 text-sm outline-none" />
              
              {!isForgotPassword && (
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder={t.password} 
                    required 
                    minLength="6" 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full px-4 py-3 pr-10 border-b border-neutral-200 text-sm outline-none" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-800"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              )}
              
              {!isLogin && !isForgotPassword && (
                <label className="flex items-start gap-2 mt-4 text-xs text-neutral-500 cursor-pointer">
                  <input type="checkbox" required onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-0.5" />
                  <span>{t.terms} <a href="#" className="underline">Ver aquí</a></span>
                </label>
              )}

              <button type="submit" className="w-full bg-neutral-900 text-white py-4 mt-6 text-xs uppercase tracking-widest rounded-md">
                {isForgotPassword ? t.recover : (isLogin ? t.login : t.register)}
              </button>
            </form>

            {!isForgotPassword && isLogin && (
              <button onClick={() => setIsForgotPassword(true)} className="w-full text-center mt-4 text-xs text-neutral-400 hover:text-neutral-700">
                {t.forgot}
              </button>
            )}

            {!isForgotPassword && (
              <button onClick={() => setIsLogin(!isLogin)} className="w-full text-center mt-6 text-xs text-neutral-400 underline">
                {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
              </button>
            )}

            {isForgotPassword && (
              <button onClick={() => setIsForgotPassword(false)} className="w-full text-center mt-6 text-xs text-neutral-400 underline">
                Volver a Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}