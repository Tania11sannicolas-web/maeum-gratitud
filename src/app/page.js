"use client";
import { useState, useEffect, useRef, useMemo, Fragment } from "react";
import { supabase } from "@/lib/supabase";

const dict = {
  es: { explore: "Explorar", gallery: "Galería", profile: "Perfil", login: "Entrar", email: "Correo", password: "Contraseña", terms: "Acepto los Términos y Política de Privacidad", register: "Crear cuenta", empty: "Aún no hay destellos guardados.", delete: "Borrar", deleteConfirm: "¿Soltar este recuerdo?", yes: "Sí", no: "No", phrase: "Tu frase inspiradora", save: "Guardar", audio: "Audio", newPass: "Nueva contraseña", forgot: "¿Olvidaste tu contraseña?", recover: "Recuperar contraseña", newest: "Más recientes", oldest: "Más antiguas", random: "Aleatorio" },
  en: { explore: "Explore", gallery: "Gallery", profile: "Profile", login: "Log In", email: "Email", password: "Password", terms: "I accept Terms and Privacy Policy", register: "Sign Up", empty: "No flashes saved yet.", delete: "Delete", deleteConfirm: "Let go of this memory?", yes: "Yes", no: "No", phrase: "Your inspiring quote", save: "Save", audio: "Audio", newPass: "New password", forgot: "Forgot your password?", recover: "Recover password", newest: "Newest first", oldest: "Oldest first", random: "Random" }
};

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
  
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(true);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const [likes, setLikes] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [userPhrase, setUserPhrase] = useState("");
  const [profileName, setProfileName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("es");
  
  const [currentTab, setCurrentTab] = useState("explore"); 
  const [galleryView, setGalleryView] = useState("grid");
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [activeMenuPhotoId, setActiveMenuPhotoId] = useState(null); 
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState("blanco");
  const [feedPhotos, setFeedPhotos] = useState([]);
  
  // Límite de fotos para el scroll infinito de la galería
  const [galleryLimit, setGalleryLimit] = useState(12);
  
  const seenIds = useRef(new Set()); 
  const loadingRef = useRef(false);

  const isDark = theme === "dark";

  const normalizedLikes = useMemo(() => {
    let arr = likes.map(p => ({
      id: p.id,
      url: p.url,
      title: p.title || "Destello",
      authorName: p.authorName || "Autor",
      authorUsername: p.authorUsername || "unsplash",
      downloadLocation: p.downloadLocation || `https://api.unsplash.com/photos/${p.id}/download`
    }));

    if (sortOrder === "newest") return arr.reverse();
    if (sortOrder === "random") return arr.sort(() => Math.random() - 0.5);
    return arr;
  }, [likes, sortOrder]);

  // Lista memoizada para renderizar solo el límite actual de la galería (Optimización de RAM)
  const displayedGallery = useMemo(() => {
    return normalizedLikes.slice(0, galleryLimit);
  }, [normalizedLikes, galleryLimit]);

  useEffect(() => {
    const userLang = navigator.language.slice(0, 2);
    if (dict[userLang]) setLang(userLang);

    const savedTheme = localStorage.getItem('maeum-theme');
    if (savedTheme) setTheme(savedTheme);

    audioRef.current = new Audio("https://ice1.somafm.com/dronezone-128-mp3");
    audioRef.current.loop = true;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) loadUserData(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserData(session.user);
        setIsEmailSent(false); 
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

  const loadUserData = async (u) => {
    setUser(u);
    if (u.user_metadata?.phrase) setUserPhrase(u.user_metadata.phrase);
    if (u.user_metadata?.full_name) setProfileName(u.user_metadata.full_name);
    
    if (u.user_metadata?.theme) {
      setTheme(u.user_metadata.theme);
      localStorage.setItem('maeum-theme', u.user_metadata.theme);
    }
    
    if (u.user_metadata?.tags) {
      setSelectedTags(u.user_metadata.tags);
    } else {
      setSelectedTags([]);
    }

    const { data, error } = await supabase
      .from('user_likes')
      .select('*')
      .eq('user_id', u.id);

    if (!error && data) {
      setLikes(data.map(item => ({
        id: item.photo_id,
        url: item.photo_url,
        authorName: item.author_name,
        authorUsername: item.author_username,
        downloadLocation: item.download_location
      })));
    }
  };

  const changeTheme = async (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('maeum-theme', newTheme);
    if (user) {
      supabase.auth.updateUser({ data: { theme: newTheme } }).catch(console.error);
    }
  };

  const loadMorePhotos = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const querySearch = activeCategory || (selectedTags.length > 0 ? selectedTags.join(",") : "blanco");
      const res = await fetch(`https://api.unsplash.com/photos/random?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_KEY}&count=12&query=${querySearch}`);
      
      if (!res.ok) {
        if (res.status === 403 || res.status === 429) {
          setAppMessage({
            title: "Tómate un respiro",
            text: "Has contemplado mucha belleza por ahora. Es momento de estar presente en el mundo real, descansar tus ojos y reconectar contigo. Vuelve en una hora aproximadamente, cuando este espacio vuelva a florecer."
          });
        }
        loadingRef.current = false;
        return;
      }

      const data = await res.json();
      
      if (Array.isArray(data)) {
        const newPhotos = data.filter(img => !seenIds.current.has(img.id)).map(img => {
          seenIds.current.add(img.id);
          return { 
            id: img.id, 
            url: img.urls.regular, 
            title: img.alt_description || "Pausa",
            authorName: img.user?.name || "Fotógrafo",
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

  // Resetea el límite al cambiar de pestaña para limpiar memoria visual
  useEffect(() => {
    if (currentTab === "gallery") setGalleryLimit(12);
  }, [currentTab]);

  // Manejador de scroll súper optimizado (RequestAnimationFrame + Passive)
  useEffect(() => {
    let isScrolling = false;
    const handleScroll = () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
            if (currentTab === "explore") {
              if (!user) {
                 if (feedPhotos.length > 0) setShowAuthModal(true);
              } else {
                 loadMorePhotos();
              }
            } else if (currentTab === "gallery") {
               setGalleryLimit(prev => prev + 12);
            }
          }
          isScrolling = false;
        });
        isScrolling = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [user, currentTab, feedPhotos.length]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    
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
      setIsAuthenticating(false);
      return;
    }

    if (!isLogin && !acceptedTerms) {
      setAppMessage({ title: "Aviso", text: dict[lang].terms });
      setIsAuthenticating(false);
      return;
    }

    let authResult;
    const currentTheme = localStorage.getItem('maeum-theme') || "light";

    if (isLogin) {
      authResult = await supabase.auth.signInWithPassword({ email, password });
    } else {
      authResult = await supabase.auth.signUp({ 
        email, password, 
        options: { data: { full_name: name, phrase: "", tags: [], theme: currentTheme } }
      });
    }

    if (authResult.error) {
      setAppMessage({ title: "Error", text: authResult.error.message });
    } else {
      if (!isLogin && authResult.data?.user && !authResult.data?.session) {
        setIsEmailSent(true);
        setShowAuthModal(false);
      } else {
        setShowAuthModal(false);
      }
    }
    setIsAuthenticating(false);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
    } catch(e) { console.warn("Supabase bloqueó la salida segura, forzando limpieza local.", e); }
    
    for (let key in localStorage) {
      if (key.startsWith('sb-')) {
        localStorage.removeItem(key);
      }
    }
    
    setUser(null);
    setLikes([]);
    setSelectedTags([]);
    setProfileName("");
    setCurrentTab("explore");
    setIsSigningOut(false);
  };

  const toggleLike = async (photo, e) => {
    if (e) e.preventDefault();
    if (!user) return setShowAuthModal(true);
    
    const exists = likes.find(p => p.id === photo.id);
    
    if (exists) {
      const newLikes = likes.filter(p => p.id !== photo.id);
      setLikes(newLikes);
      await supabase.from('user_likes').delete().eq('user_id', user.id).eq('photo_id', photo.id);
    } else {
      const newPhotoRecord = {
        user_id: user.id,
        photo_id: photo.id,
        photo_url: photo.url,
        author_name: photo.authorName,
        author_username: photo.authorUsername,
        download_location: photo.downloadLocation
      };
      
      setLikes(prev => [...prev, photo]);
      
      const { error } = await supabase.from('user_likes').insert([newPhotoRecord]);
      if (error) {
        setAppMessage({ title: "Error", text: "No se pudo guardar el destello en la base de datos." });
        setLikes(likes);
      }
    }
  };

  const confirmDelete = async (id) => {
    const newLikes = likes.filter(p => p.id !== id);
    setLikes(newLikes);
    setPhotoToDelete(null);
    setActiveMenuPhotoId(null);
    
    if (user) {
      await supabase.from('user_likes').delete().eq('user_id', user.id).eq('photo_id', id);
    }
  };

  const triggerUnsplashDownload = async (downloadLocation) => {
    if (!downloadLocation) return;
    try {
      await fetch(`${downloadLocation}?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_KEY}`);
    } catch (err) {
      console.log("Download event registered");
    }
  };

  const downloadImage = async (url, id, downloadLocation) => {
    try {
      if (downloadLocation) triggerUnsplashDownload(downloadLocation);
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `maeum-${id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(url, '_blank');
    }
  };

  const saveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const updates = { data: { full_name: profileName, phrase: userPhrase } };
      const { error } = await supabase.auth.updateUser(updates);
      
      if (error) throw error;

      if (newPassword) {
        const { error: passError } = await supabase.auth.updateUser({ password: newPassword });
        if (passError) throw passError;
        setNewPassword("");
      }
      setAppMessage({ title: "Actualizado", text: dict[lang].save + " con éxito." });
    } catch (error) {
      setAppMessage({ title: "Error al guardar", text: error.message || "No se pudo actualizar el perfil." });
    } finally {
      setIsSavingProfile(false);
    }
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
      await supabase.auth.updateUser({ data: { tags: newTags } }).catch(console.error);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const t = dict[lang] || dict.es;

  return (
    <main className={`min-h-screen pb-24 font-light transition-colors duration-500 ${isDark ? 'bg-neutral-950 text-neutral-300' : 'bg-white text-neutral-800'}`}>
      
      <header className={`sticky top-0 z-40 border-b flex flex-col transition-all duration-500 backdrop-blur-md ${isDark ? 'bg-neutral-950/90 border-neutral-900' : 'bg-white/90 border-neutral-100'}`}>
        <div className="py-6 px-6 flex justify-between items-center">
          <h1 className={`text-xl tracking-widest uppercase font-normal ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>Maeum</h1>
          <div className="flex items-center gap-4 sm:gap-6">
            
            {!isStandalone && (
              <button 
                onClick={handleInstallClick} 
                className={`text-[10px] sm:text-xs tracking-widest uppercase border px-3 py-1.5 rounded-full transition-colors active:scale-95 ${isDark ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white' : 'border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white'}`}
              >
                Instalar App
              </button>
            )}

            {!user && (
              <button 
                onClick={() => { setIsLogin(true); setIsForgotPassword(false); setShowAuthModal(true); }} 
                className={`text-[10px] sm:text-xs tracking-widest uppercase transition-colors active:scale-95 ${isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-900'}`}
              >
                Iniciar sesión
              </button>
            )}
            
            <button onClick={toggleAudio} className={`p-2 rounded-full transition-all active:scale-95 ${isPlaying ? (isDark ? 'bg-neutral-800 text-white' : 'bg-neutral-900 text-white') : (isDark ? 'bg-neutral-900 text-neutral-600' : 'bg-neutral-100 text-neutral-400')}`}>
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zm12-3c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zM9 10l12-3"/></svg>
            </button>
          </div>
        </div>

        {currentTab === "explore" && (
          <div className="flex overflow-x-auto gap-4 pb-4 px-6 scrollbar-hide snap-x" style={{ willChange: "transform" }}>
            {selectedTags.length === 0 ? (
              <p className={`text-xs italic px-2 py-1.5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>En tu perfil puedes elegir las etiquetas de inspiración que prefieras.</p>
            ) : (
              selectedTags.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`snap-center whitespace-nowrap px-4 py-1.5 text-xs rounded-full border transition-all active:scale-95 ${activeCategory === cat ? (isDark ? 'border-neutral-300 text-neutral-100 bg-neutral-900' : 'border-neutral-900 text-neutral-900') : (isDark ? 'border-neutral-800 text-neutral-500' : 'border-neutral-200 text-neutral-400')}`}>
                  {cat.toUpperCase()}
                </button>
              ))
            )}
          </div>
        )}
      </header>

      {currentTab === "explore" && (
        <section className="max-w-6xl mx-auto p-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {feedPhotos.map((photo, index) => {
              const isLiked = likes.some(p => p.id === photo.id);
              return (
                <Fragment key={photo.id}>
                  <div 
                    className={`relative group overflow-hidden rounded-md transition-colors ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}
                    onDoubleClick={(e) => toggleLike(photo, e)} 
                    style={{ touchAction: 'manipulation' }}
                  >
                    <img src={photo.url} alt={photo.title} loading="lazy" decoding="async" className="w-full h-[28rem] object-cover transition-transform duration-700 group-hover:scale-105" style={{ willChange: "transform" }} />
                    
                    <a 
                      href={`https://unsplash.com/@${photo.authorUsername || 'unsplash'}?utm_source=maeum_gratitud&utm_medium=referral`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute bottom-6 left-5 z-10 text-[9px] uppercase tracking-widest text-white/70 hover:text-white transition-colors"
                      style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
                    >
                      Foto por {photo.authorName || "Autor"} en Unsplash
                    </a>

                    <button onClick={(e) => toggleLike(photo, e)} className={`absolute bottom-4 right-4 z-10 backdrop-blur-sm p-3 rounded-full shadow-lg active:scale-90 transition-all ${isDark ? 'bg-neutral-900/80' : 'bg-white/90'}`}>
                      <svg className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : (isDark ? 'text-neutral-500 fill-none' : 'text-neutral-400 fill-none')}`} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                    </button>
                  </div>

                  {!user && index === 1 && (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 py-20 px-6 my-4 flex justify-center">
                      <div className={`max-w-2xl w-full flex flex-col items-center text-center p-8 sm:p-12 bg-gradient-to-b from-transparent to-transparent border-y ${isDark ? 'via-neutral-900/50 border-neutral-900' : 'via-neutral-50/50 border-neutral-100'}`}>
                        <span className={`text-[10px] uppercase tracking-[0.3em] mb-6 font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Pausa y Contemplación</span>
                        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-light mb-6 leading-tight tracking-tight ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>
                          El mundo hace <br className="sm:hidden" /> demasiado ruido.
                        </h2>
                        <p className={`font-light text-[15px] sm:text-base leading-relaxed max-w-lg mb-10 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          Maeum es tu refugio íntimo. Un espacio libre de algoritmos y exigencias diseñado como medicina para tu sistema nervioso.
                        </p>
                        <button 
                          onClick={() => { setIsLogin(false); setIsForgotPassword(false); setShowAuthModal(true); }} 
                          className={`group relative px-8 py-4 text-[10px] sm:text-xs uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 ${isDark ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
                        >
                          <span className="relative z-10 flex items-center gap-3">
                            Crear mi refugio
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {!user && index === 3 && (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 py-20 px-6 my-4 flex justify-center">
                      <div className={`max-w-2xl w-full flex flex-col items-center text-center p-8 sm:p-12 bg-gradient-to-b from-transparent to-transparent border-y ${isDark ? 'via-neutral-900/50 border-neutral-900' : 'via-neutral-50/50 border-neutral-100'}`}>
                        <span className={`text-[10px] uppercase tracking-[0.3em] mb-6 font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Contemplación y Calma</span>
                        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-light mb-6 leading-tight tracking-tight ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>
                          Scroll infinito y presencia.
                        </h2>
                        <p className={`font-light text-[15px] sm:text-base leading-relaxed max-w-lg ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          Aquí puedes hacer scroll infinito —con música ambiental de fondo o en completo silencio—. Desde la psicología, la exposición dosificada a la belleza visual reduce de forma notable los niveles de cortisol y la sobrecarga cognitiva. Desplazarte con intención te permite desacelerar el pensamiento, induciendo un estado de atención plena o trance suave similar a una meditación activa, donde el sistema nervioso parasimpático toma el control y descansa.
                        </p>
                      </div>
                    </div>
                  )}

                  {!user && index === 5 && (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 py-20 px-6 my-4 flex justify-center">
                      <div className={`max-w-2xl w-full flex flex-col items-center text-center p-8 sm:p-12 bg-gradient-to-b from-transparent to-transparent border-y ${isDark ? 'via-neutral-900/50 border-neutral-900' : 'via-neutral-50/50 border-neutral-100'}`}>
                        <span className={`text-[10px] uppercase tracking-[0.3em] mb-6 font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Colección</span>
                        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-light mb-6 leading-tight tracking-tight ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>
                          La colección de destellos.
                        </h2>
                        <p className={`font-light text-[15px] sm:text-base leading-relaxed max-w-lg ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          Guardar fragmentos visuales que resuenan con tu interior tiene profundas ventajas psicológicas y espirituales. Psicológicamente, funciona como un ancla de gratitud y regulación emocional, permitiéndote evocar estados de seguridad con solo mirar tu archivo. Espiritualmente, es un acto de reconocimiento de lo sagrado cotidiano, creando un altar personal de imágenes que reflejan la belleza esencial de tu alma.
                        </p>
                      </div>
                    </div>
                  )}

                  {!user && index === 7 && (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 py-20 px-6 my-4 flex justify-center">
                      <div className={`max-w-2xl w-full flex flex-col items-center text-center p-8 sm:p-12 bg-gradient-to-b from-transparent to-transparent border-y ${isDark ? 'via-neutral-900/50 border-neutral-900' : 'via-neutral-50/50 border-neutral-100'}`}>
                        <span className={`text-[10px] uppercase tracking-[0.3em] mb-6 font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Esencia</span>
                        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-light mb-6 leading-relaxed tracking-tight ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>
                          Maeum es recordarte que tu atención es sagrada, y tu paz interior, un territorio que merece ser cuidado.
                        </h2>
                      </div>
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </section>
      )}

      {currentTab === "gallery" && (
        <section className="max-w-6xl mx-auto p-4">
          
          <div className="flex flex-col items-center mb-10 mt-4 text-center">
             <h2 className={`text-xl font-normal mb-2 ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{profileName || "Explorador"}</h2>
             {userPhrase && <p className={`text-sm italic font-light max-w-md mx-auto px-4 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>"{userPhrase}"</p>}
          </div>

          <div className={`mb-6 border-b pb-4 ${isDark ? 'border-neutral-900' : 'border-neutral-100'}`}>
            <div className="flex justify-between items-center px-2">
               <h2 className={`text-xs tracking-widest uppercase ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                 {t.gallery} ({normalizedLikes.length})
               </h2>
               
               {normalizedLikes.length > 0 && (
                 <select 
                   value={sortOrder} 
                   onChange={(e) => setSortOrder(e.target.value)}
                   className={`text-[10px] tracking-widest uppercase bg-transparent outline-none cursor-pointer text-right border-none ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}
                 >
                   <option value="newest">{t.newest}</option>
                   <option value="oldest">{t.oldest}</option>
                   <option value="random">{t.random}</option>
                 </select>
               )}
            </div>
          </div>

          {normalizedLikes.length === 0 ? (
            <p className={`text-center text-sm mt-20 ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>{t.empty}</p>
          ) : galleryView === "grid" ? (
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {displayedGallery.map((photo) => (
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
                  <img src={photo.url} loading="lazy" decoding="async" className="w-full h-full object-cover rounded-sm" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-12">
              {displayedGallery.map((photo) => (
                <div 
                  id={`feed-photo-${photo.id}`}
                  key={photo.id} 
                  className={`relative group overflow-hidden rounded-md transition-transform ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}
                >
                  <img src={photo.url} alt={photo.title} loading="lazy" decoding="async" className="w-full h-[28rem] object-cover" />
                  
                  <button 
                    onClick={() => setActiveMenuPhotoId(activeMenuPhotoId === photo.id ? null : photo.id)} 
                    className={`absolute top-4 right-4 backdrop-blur-sm p-2 rounded-full shadow-md transition-all z-20 active:scale-90 ${isDark ? 'bg-neutral-900/80 text-neutral-200 hover:bg-neutral-800' : 'bg-white/90 text-neutral-800 hover:bg-white'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                    </svg>
                  </button>

                  {activeMenuPhotoId === photo.id && (
                    <div className={`absolute top-16 right-4 backdrop-blur-md rounded-lg shadow-xl border p-2 z-30 min-w-[200px] text-left ${isDark ? 'bg-neutral-900/95 border-neutral-800' : 'bg-white/95 border-neutral-100'}`}>
                      <a 
                        href={`https://unsplash.com/@${photo.authorUsername || 'unsplash'}?utm_source=maeum_gratitud&utm_medium=referral`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => triggerUnsplashDownload(photo.downloadLocation)}
                        className={`block px-3 py-2 text-[11px] uppercase tracking-wider border-b ${isDark ? 'text-neutral-400 hover:text-neutral-200 border-neutral-800' : 'text-neutral-600 hover:text-neutral-900 border-neutral-100'}`}
                      >
                        Foto por {photo.authorName || "Autor"} en Unsplash
                      </a>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          downloadImage(photo.url, photo.id, photo.downloadLocation); 
                          setActiveMenuPhotoId(null); 
                        }} 
                        className={`w-full text-left px-3 py-2 text-[11px] uppercase tracking-wider mt-1 rounded ${isDark ? 'text-neutral-400 hover:bg-neutral-800' : 'text-neutral-600 hover:bg-neutral-50'}`}
                      >
                        Descargar imagen
                      </button>
                      <button 
                        onClick={() => { setActiveMenuPhotoId(null); setPhotoToDelete(photo.id); }} 
                        className={`w-full text-left px-3 py-2 text-[11px] uppercase tracking-wider rounded mt-1 ${isDark ? 'text-red-400 hover:bg-red-900/30' : 'text-red-500 hover:bg-red-50'}`}
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
                   setTimeout(() => {
                     window.scrollTo({ top: 0, behavior: 'smooth' });
                   }, 50);
                 }} 
                 className={`backdrop-blur-lg px-6 py-3 rounded-full shadow-2xl text-xs tracking-widest uppercase transition-all active:scale-95 ${isDark ? 'bg-neutral-800/90 text-white hover:bg-neutral-700' : 'bg-neutral-900/90 text-white hover:bg-neutral-800'}`}
               >
                 Ver Mosaico
               </button>
             </div>
          )}
        </section>
      )}

      {currentTab === "profile" && user && (
        <section className="max-w-md mx-auto p-6 mt-6">
          <div className="text-center mb-8">
            <input 
              type="text" 
              value={profileName} 
              onChange={(e) => setProfileName(e.target.value)} 
              placeholder="Tu Nombre"
              className={`w-full text-2xl font-normal text-center bg-transparent border-b outline-none pb-2 transition-colors text-[16px] sm:text-2xl ${isDark ? 'border-transparent focus:border-neutral-700 text-neutral-100' : 'border-transparent focus:border-neutral-200 text-neutral-900'}`} 
            />
            <p className={`text-xs mt-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{user.email}</p>
          </div>

          <div className="space-y-8">
            
            <div>
              <label className={`text-xs tracking-widest uppercase mb-4 block ${isDark ? 'text-neutral-400' : 'text-neutral-900'}`}>Tus etiquetas (Máx. 5)</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-xs rounded-full border transition-all active:scale-95 ${selectedTags.includes(tag) ? (isDark ? 'border-neutral-300 bg-neutral-800 text-white' : 'border-neutral-900 bg-neutral-900 text-white') : (isDark ? 'border-neutral-800 text-neutral-500' : 'border-neutral-200 text-neutral-500')}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`text-xs tracking-widest uppercase mb-2 block ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.phrase}</label>
              <textarea 
                value={userPhrase} 
                onChange={(e) => setUserPhrase(e.target.value)} 
                placeholder="Ej. Aceptar que se va a escurrir... soltar" 
                className={`w-full p-4 border rounded-md text-[16px] outline-none resize-none h-24 transition-colors ${isDark ? 'bg-neutral-900 border-neutral-800 focus:border-neutral-600 text-neutral-200' : 'bg-transparent border-neutral-200 focus:border-neutral-900 text-neutral-900'}`} 
              />
            </div>

            <div>
              <label className={`text-xs tracking-widest uppercase mb-2 block ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Apariencia</label>
              <div className="flex gap-4">
                <button 
                  onClick={() => changeTheme('light')} 
                  className={`flex-1 py-3 text-xs uppercase tracking-widest rounded-md transition-colors border active:scale-95 ${theme === 'light' ? (isDark ? 'border-neutral-500 text-white bg-neutral-800' : 'border-neutral-900 bg-neutral-900 text-white') : (isDark ? 'border-neutral-800 text-neutral-500' : 'border-neutral-200 text-neutral-500')}`}
                >
                  Claro
                </button>
                <button 
                  onClick={() => changeTheme('dark')} 
                  className={`flex-1 py-3 text-xs uppercase tracking-widest rounded-md transition-colors border active:scale-95 ${theme === 'dark' ? (isDark ? 'border-neutral-500 text-white bg-neutral-800' : 'border-neutral-900 bg-neutral-900 text-white') : (isDark ? 'border-neutral-800 text-neutral-500' : 'border-neutral-200 text-neutral-500')}`}
                >
                  Oscuro
                </button>
              </div>
            </div>

            <div>
              <label className={`text-xs tracking-widest uppercase mb-2 block ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.newPass}</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  placeholder="Escribe para cambiar tu contraseña" 
                  minLength="6" 
                  className={`w-full p-4 pr-12 border rounded-md text-[16px] outline-none transition-colors ${isDark ? 'bg-neutral-900 border-neutral-800 focus:border-neutral-600 text-neutral-200' : 'bg-transparent border-neutral-200 focus:border-neutral-900 text-neutral-900'}`} 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-800'}`}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button 
              onClick={saveProfile} 
              disabled={isSavingProfile}
              className={`w-full py-4 text-xs tracking-widest uppercase rounded-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait active:scale-95 transition-all ${isDark ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
            >
              {isSavingProfile ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : t.save}
            </button>
            
            <button 
              onClick={handleSignOut} 
              disabled={isSigningOut}
              className={`w-full border py-4 text-xs tracking-widest uppercase rounded-md mt-4 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait active:scale-95 ${isDark ? 'border-neutral-800 text-neutral-400 hover:bg-neutral-900' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
            >
              {isSigningOut ? (
                <>
                  <svg className={`animate-spin h-4 w-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saliendo...
                </>
              ) : "Salir de la cuenta"}
            </button>

            <a 
              href="https://www.instagram.com/maeum_gratitud/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`w-full flex items-center justify-center gap-2 py-6 mt-4 text-[11px] tracking-widest uppercase transition-colors ${isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-900'}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              Síguenos en Instagram
            </a>

          </div>
        </section>
      )}

      <nav className={`fixed bottom-6 left-1/2 -translate-x-1/2 backdrop-blur-lg px-8 py-4 rounded-full shadow-2xl z-40 flex items-center gap-12 text-white ${isDark ? 'bg-neutral-800/90 border border-neutral-700/50' : 'bg-neutral-900/90'}`}>
        <button onClick={() => { 
            setCurrentTab("explore"); 
            setActiveCategory("blanco"); 
            setTimeout(() => { window.scrollTo({top: 0, behavior: 'smooth'}); }, 100); 
          }} 
          className={`active:scale-90 transition-transform ${currentTab === "explore" ? "opacity-100" : "opacity-40"}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        </button>
        <button onClick={() => { 
            if(!user) { 
              setIsForgotPassword(false); 
              setShowAuthModal(true); 
            } else {
              setCurrentTab("gallery"); 
              setTimeout(() => { window.scrollTo({top: 0, behavior: 'smooth'}); }, 100);
            }
          }} 
          className={`active:scale-90 transition-transform ${currentTab === "gallery" ? "opacity-100" : "opacity-40"}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </button>
        <button onClick={() => { 
            if(!user) { 
              setIsForgotPassword(false); 
              setShowAuthModal(true); 
            } else {
              setCurrentTab("profile"); 
              setTimeout(() => { window.scrollTo({top: 0, behavior: 'smooth'}); }, 100);
            }
          }} 
          className={`active:scale-90 transition-transform ${currentTab === "profile" ? "opacity-100" : "opacity-40"}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </button>
      </nav>

      {isEmailSent && (
        <div className="fixed inset-0 bg-neutral-900/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-6 text-center">
          <div className={`p-8 rounded-2xl max-w-sm w-full shadow-2xl ${isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-white'}`}>
            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-6 ${isDark ? 'bg-neutral-800' : 'bg-neutral-100'}`}>
              <svg className={`w-6 h-6 ${isDark ? 'text-neutral-200' : 'text-neutral-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            </div>
            <h3 className={`text-sm tracking-widest uppercase mb-4 font-semibold ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>Revisa tu bandeja</h3>
            <p className={`text-sm mb-2 font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Hemos enviado un enlace mágico para confirmar tu espacio.
            </p>
            <p className={`text-[11px] mb-8 italic ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
              *Si no lo ves, por favor revisa tu carpeta de Spam o Correo no deseado.
            </p>
            <button 
              onClick={() => { 
                setIsEmailSent(false); 
                setIsLogin(true); 
                setShowAuthModal(true); 
              }} 
              className={`w-full py-4 rounded-md text-xs uppercase tracking-widest transition-colors ${isDark ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
            >
              Ya lo verifiqué → Entrar
            </button>
          </div>
        </div>
      )}

      {showTerms && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className={`p-6 sm:p-8 rounded-lg max-w-lg w-full relative shadow-2xl max-h-[80vh] overflow-y-auto ${isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-white'}`}>
            <button onClick={() => setShowTerms(false)} className={`absolute top-4 right-4 rounded-full w-8 h-8 flex items-center justify-center transition-colors ${isDark ? 'text-neutral-400 bg-neutral-800 hover:bg-neutral-700' : 'text-neutral-400 bg-white hover:bg-neutral-100'}`}>✕</button>
            <h3 className={`text-lg font-normal mb-6 text-center ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>Términos y Política de Privacidad</h3>
            <div className={`text-xs space-y-4 font-light leading-relaxed text-justify ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              
              <h4 className={`font-semibold uppercase tracking-widest text-[10px] mt-6 ${isDark ? 'text-neutral-200' : 'text-neutral-900'}`}>1. Términos y Condiciones de Uso</h4>
              <p className="italic">Última actualización: Julio de 2026</p>
              <p>Bienvenido a Maeum. Al acceder, registrarte o utilizar nuestra aplicación web y PWA (en adelante, "la App"), aceptas cumplir y estar sujeto a los siguientes Términos y Condiciones de Uso. Por favor, léelos detenidamente.</p>
              
              <p className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>1. Descripción del Servicio</p>
              <p>Maeum es una plataforma digital de inspiración visual y bienestar diseñada para ofrecer un espacio de pausa, contemplación y refugio estético. Permite a los usuarios explorar contenido visual curado (proveniente de la API de Unsplash), guardar favoritos en una galería personal, personalizar frases de inspiración y reproducir audio ambiental.</p>
              
              <p className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>2. Cuentas de Usuario y Registro</p>
              <ul className="list-disc pl-4 space-y-2">
                <li>Para acceder a ciertas funciones, como guardar tu galería o personalizar tu perfil, es necesario crear una cuenta con un correo electrónico válido.</li>
                <li>Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.</li>
              </ul>
              
              <p className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>3. Planes de Suscripción (Free y Premium)</p>
              <p>Maeum ofrece dos modalidades de uso:</p>
              <ul className="list-disc pl-4 space-y-2">
                <li>Plan Gratuito (Free): Permite seleccionar un máximo de 2 etiquetas de inspiración, almacenar hasta 21 fotos en la galería personal y disfrutar de un límite de 3 minutos de reproducción continua de audio ambiental por sesión.</li>
                <li>Plan Premium: Mediante una suscripción de pago ($5 USD al mes o $35 USD al año), el usuario desbloquea hasta 5 etiquetas simultáneas, galería ilimitada de fotos guardadas y reproducción de audio ambiental ilimitada.</li>
              </ul>
              
              <p className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>4. Pagos y Procesamiento a través de Stripe</p>
              <ul className="list-disc pl-4 space-y-2">
                <li>Los pagos de las suscripciones Premium son procesados de forma segura a través de Stripe. Al suscribirte, aceptas que Stripe recopile y almacene de forma cifrada los datos de tu tarjeta de pago de acuerdo con sus propias políticas de seguridad y cumplimiento normativo (PCI-DSS).</li>
                <li>Maeum no almacena directamente los números completos de tus tarjetas de crédito o débito en sus servidores. Las suscripciones se renuevan de manera automática según el periodo elegido (mensual o anual), pudiendo cancelarse en cualquier momento desde la configuración de tu cuenta.</li>
              </ul>

              <p className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>5. Propiedad Intelectual y Contenido</p>
              <ul className="list-disc pl-4 space-y-2">
                <li>El diseño, código fuente, logotipos y la marca Maeum son propiedad exclusiva de sus creadores.</li>
                <li>Las imágenes mostradas son proporcionadas a través de la API de Unsplash y pertenecen a sus respectivos fotógrafos. Está prohibido extraer masivamente o utilizar las imágenes con fines comerciales no autorizados fuera de la App.</li>
              </ul>

              <p className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>6. Limitación de Responsabilidad</p>
              <p>Maeum se proporciona "tal cual". No garantizamos que el servicio sea interrumpido o libre de errores en todo momento. No nos hacemos responsables de interrupciones temporales en la transmisión de audio ambiental (SomaFM) o de la API de Unsplash.</p>

              <p className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>7. Modificaciones</p>
              <p>Podemos actualizar estos Términos ocasionalmente. Notificaremos cambios significativos a través de la App. El uso continuado tras dichos cambios implica su aceptación.</p>

              <hr className={`my-6 ${isDark ? 'border-neutral-800' : 'border-neutral-100'}`} />

              <h4 className={`font-semibold uppercase tracking-widest text-[10px] ${isDark ? 'text-neutral-200' : 'text-neutral-900'}`}>2. Política de Privacidad</h4>
              <p className="italic">Última actualización: Julio de 2026</p>
              <p>En Maeum, valoramos profundamente tu privacidad y tu tranquilidad digital. Esta Política de Privacidad explica qué datos recopilamos, cómo los utilizamos y cómo los protegemos.</p>

              <p className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>1. Información que Recopilamos</p>
              <p>Cuando creas una cuenta o utilizas Maeum, recopilamos únicamente la información esencial para el funcionamiento de la App:</p>
              <ul className="list-disc pl-4 space-y-2">
                <li>Datos de Registro: Tu dirección de correo electrónico y tu nombre (opcional), gestionados a través de nuestro proveedor de autenticación (Supabase).</li>
                <li>Preferencias de Perfil: Las etiquetas de inspiración seleccionadas, tu frase inspiradora personal y las fotografías guardadas en tu galería.</li>
                <li>Datos de Pago (Stripe): Si decides adquirir el plan Premium, los datos financieros y de cobro (como tarjetas de crédito o débito) son recopilados, procesados y almacenados de manera directa y segura por Stripe, nuestro procesador de pagos certificado. Maeum solo recibe confirmaciones de estado de pago (activo/inactivo) para habilitar tus beneficios.</li>
              </ul>

              <p className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>2. Cómo Utilizamos tu Información</p>
              <p>Utilizamos tus datos exclusivamente para:</p>
              <ul className="list-disc pl-4 space-y-2">
                <li>Autenticar tu acceso, gestionar tu cuenta y permitirte recuperar tu contraseña.</li>
                <li>Sincronizar tu galería personal, preferencias estéticas y nivel de suscripción (Free o Premium) en tus dispositivos.</li>
                <li>Nunca vendemos, rentamos ni compartimos tus datos personales con terceros con fines publicitarios o comerciales.</li>
              </ul>

              <p className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>3. Seguridad de los Datos</p>
              <p>Utilizamos servicios de infraestructura en la nube seguros y estándares de la industria (Supabase y pasarelas de pago cifradas como Stripe con protocolo HTTPS) para garantizar que tu información y credenciales estén protegidas contra accesos no autorizados.</p>

              <p className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>4. Tus Derechos</p>
              <p>Tienes el derecho absoluto de acceder a tu información, modificarla desde tu perfil o solicitar la eliminación de tu cuenta y todos los datos asociados en cualquier momento.</p>

              <p className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>5. Contacto</p>
              <p>Si tienes dudas o solicitudes sobre esta política o tus datos personales, puedes escribirnos a través de nuestras redes oficiales (como nuestro Instagram @maeum_gratitud).</p>
            </div>
            
            <button onClick={() => setShowTerms(false)} className={`w-full py-4 mt-8 rounded-md text-xs uppercase tracking-widest transition-colors sticky bottom-0 ${isDark ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}>
              He leído y acepto
            </button>
          </div>
        </div>
      )}

      {showInstallGuide && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 pb-12 sm:pb-4">
          <div className={`p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl relative ${isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-white'}`}>
            <button onClick={() => setShowInstallGuide(false)} className="absolute top-4 right-4 text-neutral-400">✕</button>
            <h3 className={`text-lg font-normal mb-2 ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>Instala Maeum</h3>
            <p className={`text-sm mb-6 font-light ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Lleva tu espacio de pausa visual directo en tu pantalla de inicio.</p>
            
            {isIOS ? (
              <div className={`p-4 rounded-lg text-left space-y-4 ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
                <div className="flex gap-3 items-center">
                  <span className={`p-2 rounded shadow-sm text-blue-500 ${isDark ? 'bg-neutral-900' : 'bg-white'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                  </span>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>1. Toca el botón de <strong>Compartir</strong> en la barra inferior de Safari.</p>
                </div>
                <div className="flex gap-3 items-center">
                  <span className={`p-2 rounded shadow-sm ${isDark ? 'bg-neutral-900 text-neutral-300' : 'bg-white text-neutral-700'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4"/></svg>
                  </span>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>2. Desliza hacia abajo y selecciona <strong>Agregar a inicio</strong>.</p>
                </div>
              </div>
            ) : (
              <div className={`p-4 rounded-lg text-left space-y-4 ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
                <div className="flex gap-3 items-center">
                  <span className={`p-2 rounded shadow-sm ${isDark ? 'bg-neutral-900 text-neutral-300' : 'bg-white text-neutral-700'}`}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                  </span>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>1. Toca el menú de <strong>tres puntos</strong> de tu navegador.</p>
                </div>
                <div className="flex gap-3 items-center">
                  <span className={`p-2 rounded shadow-sm ${isDark ? 'bg-neutral-900 text-neutral-300' : 'bg-white text-neutral-700'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4"/></svg>
                  </span>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>2. Selecciona <strong>Instalar aplicación</strong> o Agregar a inicio.</p>
                </div>
              </div>
            )}
            
            <button onClick={() => setShowInstallGuide(false)} className={`w-full py-3 mt-6 rounded-md text-xs uppercase tracking-widest transition-colors ${isDark ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}>
              Entendido
            </button>
          </div>
        </div>
      )}

      {photoToDelete && (
        <div 
          className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPhotoToDelete(null)}
        >
          <div 
            className={`p-8 rounded-lg max-w-sm w-full text-center shadow-xl ${isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={`text-sm tracking-widest uppercase mb-6 ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{t.deleteConfirm}</h3>
            <div className="flex gap-4">
              <button 
                onClick={() => { setPhotoToDelete(null); setActiveMenuPhotoId(null); }} 
                className={`flex-1 py-3 border rounded-md text-xs uppercase tracking-widest ${isDark ? 'border-neutral-700 text-neutral-300' : 'text-neutral-600'}`}
              >
                {t.no}
              </button>
              <button 
                onClick={() => confirmDelete(photoToDelete)} 
                className="flex-1 py-3 bg-red-500 text-white rounded-md text-xs uppercase tracking-widest hover:bg-red-600"
              >
                {t.yes}
              </button>
            </div>
          </div>
        </div>
      )}

      {appMessage && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`p-8 rounded-lg max-w-sm w-full text-center shadow-2xl relative ${isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-white'}`}>
            <h3 className={`text-sm tracking-widest uppercase mb-4 ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{appMessage.title}</h3>
            <p className={`text-sm mb-8 font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{appMessage.text}</p>
            <button onClick={() => setAppMessage(null)} className={`w-full py-4 rounded-md text-xs uppercase tracking-widest transition-colors ${isDark ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}>
              Entendido
            </button>
          </div>
        </div>
      )}

      {showAuthModal && !user && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`p-8 rounded-lg max-w-sm w-full relative shadow-2xl ${isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-white'}`}>
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-neutral-400">✕</button>
            
            <h3 className={`text-sm text-center tracking-widest uppercase mb-6 ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>
              {isForgotPassword ? t.recover : (isLogin ? t.login : t.register)}
            </h3>
            
            <form onSubmit={handleAuth} className="space-y-4">
              
              {!isLogin && !isForgotPassword && (
                <input type="text" placeholder="Tu nombre" required onChange={(e) => setName(e.target.value)} className={`w-full px-4 py-3 border-b outline-none transition-colors text-[16px] ${isDark ? 'bg-transparent border-neutral-800 text-neutral-200 focus:border-neutral-600' : 'border-neutral-200 text-neutral-900 focus:border-neutral-900'}`} />
              )}
              
              <input type="email" placeholder={t.email} required onChange={(e) => setEmail(e.target.value)} className={`w-full px-4 py-3 border-b outline-none transition-colors text-[16px] ${isDark ? 'bg-transparent border-neutral-800 text-neutral-200 focus:border-neutral-600' : 'border-neutral-200 text-neutral-900 focus:border-neutral-900'}`} />
              
              {!isForgotPassword && (
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder={t.password} 
                    required 
                    minLength="6" 
                    onChange={(e) => setPassword(e.target.value)} 
                    className={`w-full px-4 py-3 pr-10 border-b outline-none transition-colors text-[16px] ${isDark ? 'bg-transparent border-neutral-800 text-neutral-200 focus:border-neutral-600' : 'border-neutral-200 text-neutral-900 focus:border-neutral-900'}`} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 ${isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-800'}`}
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
                <label className="flex items-start gap-2 mt-4 text-xs cursor-pointer">
                  <input type="checkbox" required onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-0.5" />
                  <span className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>{t.terms} <a href="#" onClick={(e) => { e.preventDefault(); setShowTerms(true); }} className="underline">Ver aquí</a></span>
                </label>
              )}

              <button 
                type="submit" 
                disabled={isAuthenticating}
                className={`w-full py-4 mt-6 text-xs uppercase tracking-widest rounded-md disabled:opacity-60 disabled:cursor-wait transition-colors flex items-center justify-center gap-2 ${isDark ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
              >
                {isAuthenticating ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (isForgotPassword ? t.recover : (isLogin ? t.login : t.register))}
              </button>
            </form>

            {!isForgotPassword && isLogin && (
              <button onClick={() => setIsForgotPassword(true)} className={`w-full text-center mt-4 text-xs transition-colors ${isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-700'}`}>
                {t.forgot}
              </button>
            )}

            {!isForgotPassword && (
              <button onClick={() => setIsLogin(!isLogin)} className={`w-full text-center mt-6 text-xs underline transition-colors ${isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-700'}`}>
                {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
              </button>
            )}

            {isForgotPassword && (
              <button onClick={() => setIsForgotPassword(false)} className={`w-full text-center mt-6 text-xs underline transition-colors ${isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-700'}`}>
                Volver a Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}