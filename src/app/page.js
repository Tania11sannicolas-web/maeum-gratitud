"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "@/lib/supabase";

const dict = {
  es: { explore: "Explorar", gallery: "Galería", profile: "Perfil", login: "Entrar", email: "Correo", password: "Contraseña", terms: "Acepto los Términos y Política de Privacidad", register: "Crear cuenta", empty: "Aún no hay destellos guardados.", delete: "Borrar", deleteConfirm: "¿Soltar este recuerdo?", yes: "Sí", no: "No", phrase: "Tu frase inspiradora", save: "Guardar", audio: "Audio", newPass: "Nueva contraseña", forgot: "¿Olvidaste tu contraseña?", recover: "Recuperar contraseña", newest: "Más recientes", oldest: "Más antiguas", random: "Aleatorio" },
  en: { explore: "Explore", gallery: "Gallery", profile: "Profile", login: "Log In", email: "Email", password: "Password", terms: "I accept Terms and Privacy Policy", register: "Sign Up", empty: "No flashes saved yet.", delete: "Delete", deleteConfirm: "Let go of this memory?", yes: "Yes", no: "No", phrase: "Your inspiring quote", save: "Save", audio: "Audio", newPass: "New password", forgot: "Forgot your password?", recover: "Recover password", newest: "Newest first", oldest: "Oldest first", random: "Random" }
};

// Se eliminó 'portrait' y se agregó 'clouds' para evitar personas
const AVAILABLE_TAGS = ["nature", "minimal", "art", "space", "animals", "cities", "flowers", "colors", "ocean", "botanical", "warm", "desert", "abstract", "vintage", "neon", "geometry", "texture", "landscape", "clouds", "macro"];

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
  const [appMessage, setAppMessage] = useState(null);
  
  // PWA Instalación y Detección
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(true);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Perfil y Galería
  const [likes, setLikes] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest"); // Control del orden de galería
  const [userPhrase, setUserPhrase] = useState("");
  const [profileName, setProfileName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [lang, setLang] = useState("es");
  
  // UX
  const [currentTab, setCurrentTab] = useState("explore"); 
  const [galleryView, setGalleryView] = useState("grid");
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [activeMenuPhotoId, setActiveMenuPhotoId] = useState(null); 
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Motor Unsplash
  const [activeCategory, setActiveCategory] = useState("blanco");
  const [feedPhotos, setFeedPhotos] = useState([]);
  const seenIds = useRef(new Set()); 
  const loadingRef = useRef(false);

  // Filtrado y Orden de Galería en tiempo real
  const sortedLikes = useMemo(() => {
    let arr = [...likes];
    if (sortOrder === "newest") return arr.reverse();
    if (sortOrder === "random") return arr.sort(() => Math.random() - 0.5);
    return arr; // "oldest" se queda como está
  }, [likes, sortOrder]);

  useEffect(() => {
    const userLang = navigator.language.slice(0, 2);
    if (dict[userLang]) setLang(userLang);

    audioRef.current = new Audio("https://ice1.somafm.com/dronezone-128-mp3");
    audioRef.current.loop = true;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) loadUserData(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserData(session.user);
      } else { 
        setUser(null); 
        setLikes([]); 
        setSelectedTags([]); 
        setProfileName(""); 
      }
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(checkStandalone);
    
    const iosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iosDevice);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallGuide(true);
    }
  };

  const loadUserData = (u) => {
    setUser(u);
    if (u.user_metadata?.likes) setLikes(u.user_metadata.likes);
    if (u.user_metadata?.phrase) setUserPhrase(u.user_metadata.phrase);
    if (u.user_metadata?.full_name) setProfileName(u.user_metadata.full_name);
    
    if (u.user_metadata?.tags && u.user_metadata.tags.length > 0) {
      setSelectedTags(u.user_metadata.tags);
    } else {
      setSelectedTags([]);
    }
  };

  const loadMorePhotos = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const querySearch = activeCategory || (selectedTags.length > 0 ? selectedTags.join(",") : "blanco");
      const res = await fetch(`https://api.unsplash.com/photos/random?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_KEY}&count=12&query=${querySearch}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        const newPhotos = data.filter(img => !seenIds.current.has(img.id)).map(img => {
          seenIds.current.add(img.id);
          return { 
            id: img.id, 
            url: img.urls.regular, 
            title: img.alt_description || "Pausa",
            authorName: img.user?.name || "Fotógrafo en Unsplash",
            authorUsername: img.user?.username || "unsplash",
            downloadLocation: img.links?.download_location
          };
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
      if (error) {
        setAppMessage({ title: "Error", text: error.message });
      } else {
        setAppMessage({ title: "Enlace enviado", text: "Te enviamos un correo con las instrucciones para recuperar tu contraseña." });
        setShowAuthModal(false);
      }
      return;
    }

    if (!isLogin && !acceptedTerms) {
      setAppMessage({ title: "Aviso", text: dict[lang].terms });
      return;
    }

    let authResult;
    if (isLogin) {
      authResult = await supabase.auth.signInWithPassword({ email, password });
    } else {
      authResult = await supabase.auth.signUp({ 
        email, password, 
        options: { data: { full_name: name, likes: [], phrase: "", tags: [] } }
      });
    }

    if (authResult.error) {
      setAppMessage({ title: "Error", text: authResult.error.message });
    } else {
      if (!isLogin && authResult.data?.user && !authResult.data?.session) {
        setAppMessage({ 
          title: "Confirma tu correo", 
          text: "Hemos enviado un enlace de confirmación a tu correo. Por favor, confírmalo para poder iniciar sesión y guardar tu galería." 
        });
        setIsLogin(true);
      }
      setShowAuthModal(false);
    }
  };

  const toggleLike = async (photo, e) => {
    if (e) e.preventDefault();
    if (!user) return setShowAuthModal(true);
    let newLikes = [...likes];
    const exists = newLikes.find(p => p.id === photo.id);
    if (exists) newLikes = newLikes.filter(p => p.id !== photo.id);
    else newLikes.push(photo);
    
    setLikes(newLikes);
    await supabase.auth.updateUser({ data: { likes: newLikes } });
  };

  const triggerUnsplashDownload = async (downloadLocation) => {
    if (!downloadLocation) return;
    try {
      await fetch(`${downloadLocation}?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_KEY}`);
    } catch (err) {
      console.log("Download event registered");
    }
  };

  const confirmDelete = async (id) => {
    // Actualización optimista para evitar trabas
    const newLikes = likes.filter(p => p.id !== id);
    setLikes(newLikes);
    setPhotoToDelete(null);
    setActiveMenuPhotoId(null);
    
    if (user) {
      await supabase.auth.updateUser({ data: { likes: newLikes } });
    }
  };

  const saveProfile = async () => {
    const updates = { data: { full_name: profileName, phrase: userPhrase } };
    await supabase.auth.updateUser(updates);
    if (newPassword) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setAppMessage({ title: "Error", text: error.message });
        return;
      }
      else setNewPassword("");
    }
    setAppMessage({ title: "Actualizado", text: dict[lang].save + " con éxito." });
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

  const t = dict[lang] || dict.es;

  return (
    <main className="min-h-screen bg-white text-neutral-800 pb-24 font-light">
      
      {/* HEADER CON ETIQUETAS ESTATICAS */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md z-40 border-b border-neutral-100 flex flex-col transition-all">
        <div className="py-6 px-6 flex justify-between items-center">
          <h1 className="text-xl tracking-widest uppercase font-normal">Maeum</h1>
          <div className="flex items-center gap-4 sm:gap-6">
            
            {!isStandalone && (
              <button 
                onClick={handleInstallClick} 
                className="text-[10px] sm:text-xs tracking-widest uppercase border border-neutral-900 text-neutral-900 px-3 py-1.5 rounded-full hover:bg-neutral-900 hover:text-white transition-colors"
              >
                Instalar App
              </button>
            )}

            {!user && (
              <button 
                onClick={() => { setIsLogin(true); setIsForgotPassword(false); setShowAuthModal(true); }} 
                className="text-[10px] sm:text-xs tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                Iniciar sesión
              </button>
            )}
            
            <button onClick={toggleAudio} className={`p-2 rounded-full transition-all ${isPlaying ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zm12-3c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zM9 10l12-3"/></svg>
            </button>
          </div>
        </div>

        {currentTab === "explore" && (
          <div className="flex overflow-x-auto gap-4 pb-4 px-6 scrollbar-hide snap-x">
            {selectedTags.length === 0 ? (
              <p className="text-xs text-neutral-400 italic px-2 py-1.5">En tu perfil puedes elegir las etiquetas de inspiración que prefieras.</p>
            ) : (
              selectedTags.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`snap-center whitespace-nowrap px-4 py-1.5 text-xs rounded-full border transition-all ${activeCategory === cat ? 'border-neutral-900 text-neutral-900' : 'border-neutral-200 text-neutral-400'}`}>
                  {cat.toUpperCase()}
                </button>
              ))
            )}
          </div>
        )}
      </header>

      {/* VISTA EXPLORAR */}
      {currentTab === "explore" && (
        <section className="max-w-6xl mx-auto p-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {feedPhotos.map((photo) => {
              const isLiked = likes.some(p => p.id === photo.id);
              return (
                <div key={photo.id} className="relative group bg-neutral-50 overflow-hidden rounded-md">
                  <img src={photo.url} alt={photo.title} loading="lazy" className="w-full h-[28rem] object-cover transition-transform duration-700 group-hover:scale-105" />
                  <button onClick={(e) => toggleLike(photo, e)} className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg active:scale-95 transition-all">
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
             <h2 className="text-xl font-normal text-neutral-900 mb-2">{profileName || "Explorador"}</h2>
             {userPhrase && <p className="text-sm italic text-neutral-500 font-light max-w-md mx-auto px-4">"{userPhrase}"</p>}
          </div>

          <div className="flex justify-between items-center mb-6 border-b border-neutral-100 pb-2 px-2">
             <h2 className="text-xs tracking-widest uppercase text-neutral-400">{t.gallery} ({likes.length})</h2>
             
             {likes.length > 0 && (
               <select 
                 value={sortOrder} 
                 onChange={(e) => setSortOrder(e.target.value)}
                 className="text-[10px] tracking-widest uppercase text-neutral-500 bg-transparent outline-none cursor-pointer text-right border-none"
               >
                 <option value="newest">{t.newest}</option>
                 <option value="oldest">{t.oldest}</option>
                 <option value="random">{t.random}</option>
               </select>
             )}
          </div>

          {likes.length === 0 ? (
            <p className="text-center text-neutral-400 text-sm mt-20">{t.empty}</p>
          ) : galleryView === "grid" ? (
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {sortedLikes.map((photo) => (
                <div 
                  key={photo.id} 
                  className="relative aspect-square cursor-pointer overflow-hidden group" 
                  onClick={() => { 
                    setGalleryView("feed");
                    setTimeout(() => {
                      const el = document.getElementById(`feed-photo-${photo.id}`);
                      if(el) {
                        const y = el.getBoundingClientRect().top + window.scrollY - 160;
                        window.scrollTo({top: y, behavior: 'smooth'});
                      }
                    }, 50);
                  }}
                >
                  <img src={photo.url} className="w-full h-full object-cover rounded-sm" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-12">
              {sortedLikes.map((photo) => (
                <div 
                  id={`feed-photo-${photo.id}`}
                  key={photo.id} 
                  className="relative group bg-neutral-50 overflow-hidden rounded-md transition-transform"
                >
                  <img src={photo.url} alt={photo.title} loading="lazy" className="w-full h-[28rem] object-cover" />
                  
                  <button 
                    onClick={() => setActiveMenuPhotoId(activeMenuPhotoId === photo.id ? null : photo.id)} 
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md text-neutral-800 hover:bg-white transition-all z-20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                    </svg>
                  </button>

                  {activeMenuPhotoId === photo.id && (
                    <div className="absolute top-16 right-4 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-neutral-100 p-2 z-30 min-w-[200px] text-left">
                      <a 
                        href={`https://unsplash.com/@${photo.authorUsername || 'unsplash'}?utm_source=maeum_gratitud&utm_medium=referral`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => triggerUnsplashDownload(photo.downloadLocation)}
                        className="block px-3 py-2 text-[11px] uppercase tracking-wider text-neutral-600 hover:text-neutral-900 border-b border-neutral-100"
                      >
                        Foto por {photo.authorName || "Autor"} en Unsplash
                      </a>
                      <button 
                        onClick={() => { setActiveMenuPhotoId(null); setPhotoToDelete(photo.id); }} 
                        className="w-full text-left px-3 py-2 text-[11px] uppercase tracking-wider text-red-500 hover:bg-red-50 rounded mt-1"
                      >
                        Borrar de mi galería
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {galleryView === "feed" && (
             <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40">
               <button 
                 onClick={() => {
                   setGalleryView("grid");
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                 }} 
                 className="bg-neutral-900/90 backdrop-blur-lg text-white px-6 py-3 rounded-full shadow-2xl text-xs tracking-widest uppercase hover:bg-neutral-800 transition-all"
               >
                 Ver Mosaico
               </button>
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
              className="w-full text-2xl font-normal text-center bg-transparent border-b border-transparent focus:border-neutral-200 outline-none pb-2 transition-colors text-[16px] sm:text-2xl" 
            />
            <p className="text-xs text-neutral-400 mt-2">{user.email}</p>
          </div>

          <div className="space-y-8">
            
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

            <div>
              <label className="text-xs tracking-widest uppercase text-neutral-400 mb-2 block">{t.phrase}</label>
              <textarea value={userPhrase} onChange={(e) => setUserPhrase(e.target.value)} placeholder="Ej. Aceptar que se va a escurrir... soltar" className="w-full p-4 border border-neutral-200 rounded-md text-[16px] outline-none focus:border-neutral-900 resize-none h-24" />
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
                  className="w-full p-4 pr-12 border border-neutral-200 rounded-md text-[16px] outline-none focus:border-neutral-900" 
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

            {/* ENLACE INSTAGRAM ESTÉTICO */}
            <a 
              href="https://www.instagram.com/maeum_gratitud/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full flex items-center justify-center gap-2 text-neutral-400 py-6 mt-4 text-[11px] tracking-widest uppercase hover:text-neutral-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              Síguenos en Instagram
            </a>

          </div>
        </section>
      )}

      {/* MENÚ FLOTANTE INFERIOR */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900/90 backdrop-blur-lg px-8 py-4 rounded-full shadow-2xl z-40 flex items-center gap-12 text-white">
        <button onClick={() => { 
            setCurrentTab("explore"); 
            setActiveCategory("blanco"); 
            window.scrollTo({top: 0, behavior: 'smooth'}); 
          }} 
          className={currentTab === "explore" ? "opacity-100" : "opacity-40"}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        </button>
        <button onClick={() => { if(!user) { setIsForgotPassword(false); setShowAuthModal(true); } else setCurrentTab("gallery"); }} className={currentTab === "gallery" ? "opacity-100" : "opacity-40"}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </button>
        <button onClick={() => { if(!user) { setIsForgotPassword(false); setShowAuthModal(true); } else setCurrentTab("profile"); }} className={currentTab === "profile" ? "opacity-100" : "opacity-40"}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </button>
      </nav>

      {/* MODAL GUÍA DE INSTALACIÓN PWA */}
      {showInstallGuide && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 pb-12 sm:pb-4">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl relative">
            <button onClick={() => setShowInstallGuide(false)} className="absolute top-4 right-4 text-neutral-400">✕</button>
            <h3 className="text-lg font-normal mb-2 text-neutral-900">Instala Maeum</h3>
            <p className="text-sm text-neutral-500 mb-6 font-light">Lleva tu espacio de pausa visual directo en tu pantalla de inicio.</p>
            
            {isIOS ? (
              <div className="bg-neutral-50 p-4 rounded-lg text-left space-y-4">
                <div className="flex gap-3 items-center">
                  <span className="bg-white p-2 rounded shadow-sm text-blue-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                  </span>
                  <p className="text-xs text-neutral-600 leading-relaxed">1. Toca el botón de <strong>Compartir</strong> en la barra inferior de Safari.</p>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="bg-white p-2 rounded shadow-sm text-neutral-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4"/></svg>
                  </span>
                  <p className="text-xs text-neutral-600 leading-relaxed">2. Desliza hacia abajo y selecciona <strong>Agregar a inicio</strong>.</p>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-50 p-4 rounded-lg text-left space-y-4">
                <div className="flex gap-3 items-center">
                  <span className="bg-white p-2 rounded shadow-sm text-neutral-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                  </span>
                  <p className="text-xs text-neutral-600 leading-relaxed">1. Toca el menú de <strong>tres puntos</strong> de tu navegador.</p>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="bg-white p-2 rounded shadow-sm text-neutral-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4"/></svg>
                  </span>
                  <p className="text-xs text-neutral-600 leading-relaxed">2. Selecciona <strong>Instalar aplicación</strong> o Agregar a inicio.</p>
                </div>
              </div>
            )}
            
            <button onClick={() => setShowInstallGuide(false)} className="w-full bg-neutral-900 text-white py-3 mt-6 rounded-md text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors">
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* DIÁLOGO CONFIRMAR BORRADO */}
      {photoToDelete && (
        <div 
          className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPhotoToDelete(null)}
        >
          <div 
            className="bg-white p-8 rounded-lg max-w-sm w-full text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm tracking-widest uppercase mb-6 text-neutral-900">{t.deleteConfirm}</h3>
            <div className="flex gap-4">
              <button 
                onClick={() => { setPhotoToDelete(null); setActiveMenuPhotoId(null); }} 
                className="flex-1 py-3 border rounded-md text-xs uppercase tracking-widest text-neutral-600"
              >
                {t.no}
              </button>
              <button 
                onClick={() => confirmDelete(photoToDelete)} 
                className="flex-1 py-3 bg-red-500 text-white rounded-md text-xs uppercase tracking-widest"
              >
                {t.yes}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALES HERMOSOS DE AVISOS */}
      {appMessage && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg max-w-sm w-full text-center shadow-2xl relative">
            <h3 className="text-sm tracking-widest uppercase mb-4 text-neutral-900">{appMessage.title}</h3>
            <p className="text-sm text-neutral-500 mb-8 font-light leading-relaxed">{appMessage.text}</p>
            <button onClick={() => setAppMessage(null)} className="w-full bg-neutral-900 text-white py-4 rounded-md text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors">
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* MODAL AUTH */}
      {showAuthModal && !user && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg max-w-sm w-full relative shadow-2xl">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-neutral-400">✕</button>
            
            <h3 className="text-sm text-center tracking-widest uppercase mb-6 text-neutral-900">
              {isForgotPassword ? t.recover : (isLogin ? t.login : t.register)}
            </h3>
            
            <form onSubmit={handleAuth} className="space-y-4">
              
              {!isLogin && !isForgotPassword && (
                <input type="text" placeholder="Tu nombre" required onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border-b border-neutral-200 text-[16px] outline-none" />
              )}
              
              <input type="email" placeholder={t.email} required onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border-b border-neutral-200 text-[16px] outline-none" />
              
              {!isForgotPassword && (
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder={t.password} 
                    required 
                    minLength="6" 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full px-4 py-3 pr-10 border-b border-neutral-200 text-[16px] outline-none" 
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

              <button type="submit" className="w-full bg-neutral-900 text-white py-4 mt-6 text-xs uppercase tracking-widest rounded-md hover:bg-neutral-800 transition-colors">
                {isForgotPassword ? t.recover : (isLogin ? t.login : t.register)}
              </button>
            </form>

            {!isForgotPassword && isLogin && (
              <button onClick={() => setIsForgotPassword(true)} className="w-full text-center mt-4 text-xs text-neutral-400 hover:text-neutral-700 transition-colors">
                {t.forgot}
              </button>
            )}

            {!isForgotPassword && (
              <button onClick={() => setIsLogin(!isLogin)} className="w-full text-center mt-6 text-xs text-neutral-400 underline transition-colors hover:text-neutral-700">
                {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
              </button>
            )}

            {isForgotPassword && (
              <button onClick={() => setIsForgotPassword(false)} className="w-full text-center mt-6 text-xs text-neutral-400 underline transition-colors hover:text-neutral-700">
                Volver a Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}