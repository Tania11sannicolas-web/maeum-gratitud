"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [country, setCountry] = useState("");
  const [sex, setSex] = useState("");
  
  const [sent, setSent] = useState(false);
  const [likes, setLikes] = useState([]); 
  const [viewGallery, setViewGallery] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Nuevo estado para saber si el usuario se está registrando o solo entrando
  const [isLogin, setIsLogin] = useState(false);
  
  const [feedPhotos, setFeedPhotos] = useState([]);
  const loadingRef = useRef(false);
  const userRef = useRef(user); 

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadMorePhotos = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const res = await fetch(`https://api.unsplash.com/photos/random?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_KEY}&count=12&query=nature,minimal,warm,botanical,ocean,desert,abstract`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        const newPhotos = data.map(img => ({
          id: img.id,
          url: img.urls.regular,
          title: img.alt_description || "Pausa visual"
        }));
        setFeedPhotos(prev => [...prev, ...newPhotos]);
      }
    } catch (error) {
      console.log("Esperando recarga visual...");
    }
    loadingRef.current = false;
  };

  useEffect(() => {
    loadMorePhotos();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 600) {
        if (!userRef.current) {
          setShowAuthModal(true);
        } else {
          loadMorePhotos();
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    
    // Si es login, solo mandamos el correo. Si es registro, mandamos toda la metadata.
    const authData = isLogin 
      ? { email, options: { emailRedirectTo: window.location.origin } }
      : {
          email,
          options: { 
            data: { full_name: name, age_range: ageRange, country: country, sex: sex },
            emailRedirectTo: window.location.origin 
          }
        };

    const { error } = await supabase.auth.signInWithOtp(authData);
    if (error) {
      console.log(error);
      setSent(true); 
    } else {
      setSent(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSent(false);
  };

  const toggleLike = (url) => {
    if (!user && likes.length === 0) {
      setShowAuthModal(true);
    }
    if (likes.includes(url)) {
      setLikes(likes.filter(likedUrl => likedUrl !== url));
    } else {
      setLikes([...likes, url]);
    }
  };

  const savedPhotos = likes.map((url, index) => ({ url, id: index, title: "Destello guardado" }));
  
  const userName = user?.user_metadata?.full_name?.split(" ")[0] || "Explorador";

  return (
    <main className="min-h-screen bg-white text-neutral-800 relative">
      <header className="py-12 px-6 text-center border-b border-neutral-100 flex flex-col items-center">
        <h1 className="text-xl font-light tracking-widest uppercase cursor-pointer" onClick={() => setViewGallery(false)}>
          Maeum Gratitud
        </h1>
        {user ? (
          <p className="text-xs text-neutral-400 font-light mt-1">Hola {userName}, este es tu espacio de pausa visual.</p>
        ) : (
          <p className="text-xs text-neutral-400 font-light mt-1">Espacio de contemplación y pausa visual.</p>
        )}
        
        <div className="mt-6 flex items-center gap-6 text-xs tracking-wide">
          <button 
            onClick={() => setViewGallery(false)}
            className={`transition-colors ${!viewGallery ? 'text-neutral-900 border-b border-neutral-900 pb-1' : 'text-neutral-400 hover:text-neutral-600'}`}
          >
            Explorar
          </button>
          <button 
            onClick={() => setViewGallery(true)}
            className={`transition-colors ${viewGallery ? 'text-neutral-900 border-b border-neutral-900 pb-1' : 'text-neutral-400 hover:text-neutral-600'}`}
          >
            Mi Galería ({likes.length})
          </button>
          {user ? (
            <button onClick={handleLogout} className="text-neutral-400 hover:text-neutral-600">
              Salir
            </button>
          ) : (
            <button onClick={() => { setIsLogin(false); setShowAuthModal(true); }} className="text-neutral-900 font-medium underline underline-offset-4">
              Entrar
            </button>
          )}
        </div>
      </header>

      <section className="max-w-6xl mx-auto p-6">
        {!viewGallery ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {feedPhotos.map((photo, index) => {
                const isLiked = likes.includes(photo.url);
                return (
                  <div key={`${photo.id}-${index}`} className="relative group bg-neutral-50 overflow-hidden rounded-sm shadow-sm transition-all duration-300">
                    <img 
                      src={photo.url} 
                      alt={photo.title} 
                      onError={(e) => e.target.parentElement.style.display = 'none'}
                      className="w-full h-96 object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-700" 
                    />
                    <button 
                      onClick={() => toggleLike(photo.url)}
                      className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition-all"
                    >
                      <svg className={`w-5 h-5 transition-colors ${isLiked ? 'text-neutral-900 fill-neutral-900' : 'text-neutral-400 fill-none'}`} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
            
            {!user && feedPhotos.length > 0 && (
              <div className="text-center py-12 text-xs text-neutral-400 tracking-widest uppercase font-light cursor-pointer" onClick={() => { setIsLogin(false); setShowAuthModal(true); }}>
                Descubre más guardando tus destellos...
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-sm font-light tracking-widest text-neutral-500 uppercase">La curaduría de {userName}</h2>
            </div>
            {savedPhotos.length === 0 ? (
              <div className="text-center py-20 text-neutral-400 text-sm font-light">
                Aún no has guardado ningún destello en tu galería personal.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {savedPhotos.map((photo) => (
                  <div key={photo.id} className="relative group bg-neutral-50 overflow-hidden rounded-sm shadow-sm">
                    <img 
                      src={photo.url} 
                      alt={photo.title} 
                      onError={(e) => e.target.parentElement.style.display = 'none'}
                      className="w-full h-96 object-cover" 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Muro Amable: Login vs Registro */}
      {showAuthModal && !user && (
        <div className="fixed inset-0 bg-neutral-900/25 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-sm max-w-md w-full shadow-lg border border-neutral-100 text-center relative overflow-y-auto max-h-[90vh]">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 text-sm"
            >
              ✕
            </button>
            <h3 className="text-sm font-light tracking-widest uppercase text-neutral-800 mb-2">
              {isLogin ? "Bienvenida de vuelta" : "Únete al espacio"}
            </h3>
            <p className="text-xs text-neutral-400 font-light mb-6">
              {isLogin 
                ? "Ingresa tu correo para acceder a tu galería personal." 
                : "Regístrate para guardar tu galería y desbloquear la contemplación infinita."}
            </p>

            {!sent ? (
              <form onSubmit={handleAuth} className="space-y-4">
                
                {/* Campos exclusivos para usuarios NUEVOS */}
                {!isLogin && (
                  <>
                    <input 
                      type="text" 
                      required
                      placeholder="Tu nombre (Ej. Tania)" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 text-xs border-b border-neutral-200 focus:outline-none focus:border-neutral-800 text-center bg-transparent placeholder:text-neutral-300"
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <select 
                        required 
                        value={ageRange} 
                        onChange={(e) => setAgeRange(e.target.value)}
                        className="w-full px-4 py-3 text-xs border-b border-neutral-200 focus:outline-none focus:border-neutral-800 text-center text-neutral-500 bg-transparent"
                      >
                        <option value="" disabled>Edad</option>
                        <option value="18-24">18 - 24</option>
                        <option value="25-34">25 - 34</option>
                        <option value="35-44">35 - 44</option>
                        <option value="45-54">45 - 54</option>
                        <option value="55+">55+</option>
                      </select>

                      <select 
                        required 
                        value={sex} 
                        onChange={(e) => setSex(e.target.value)}
                        className="w-full px-4 py-3 text-xs border-b border-neutral-200 focus:outline-none focus:border-neutral-800 text-center text-neutral-500 bg-transparent"
                      >
                        <option value="" disabled>Sexo</option>
                        <option value="Mujer">Mujer</option>
                        <option value="Hombre">Hombre</option>
                        <option value="Otro">Otro / Prefiero no decir</option>
                      </select>
                    </div>

                    <input 
                      type="text" 
                      required
                      placeholder="País (Ej. México)" 
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-3 text-xs border-b border-neutral-200 focus:outline-none focus:border-neutral-800 text-center bg-transparent placeholder:text-neutral-300"
                    />
                  </>
                )}

                {/* El campo de correo siempre aparece */}
                <input 
                  type="email" 
                  required
                  placeholder="tucorreo@dominio.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-xs border-b border-neutral-200 focus:outline-none focus:border-neutral-800 text-center bg-transparent placeholder:text-neutral-300"
                />

                <button 
                  type="submit"
                  className="w-full bg-neutral-900 text-white py-3 mt-4 text-xs tracking-widest uppercase rounded-sm hover:bg-neutral-800 transition-all"
                >
                  Enviar enlace mágico
                </button>
              </form>
            ) : (
              <div className="text-xs text-neutral-600 font-light bg-neutral-50 p-4 rounded-sm">
                Hemos enviado un enlace a <strong>{email}</strong>. Revisa tu bandeja de entrada para entrar.
              </div>
            )}

            {/* El botón sutil para alternar entre Login y Registro */}
            {!sent && (
              <div className="mt-6 pt-4 border-t border-neutral-100">
                <button 
                  onClick={() => setIsLogin(!isLogin)} 
                  className="text-xs text-neutral-400 hover:text-neutral-800 transition-colors"
                >
                  {isLogin ? "¿No tienes cuenta? Crea tu galería aquí" : "¿Ya tienes una galería? Entra aquí"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}