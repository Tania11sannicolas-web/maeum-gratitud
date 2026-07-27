"use client";
import { useState, useEffect, useRef, useMemo, Fragment } from "react";
import { supabase } from "@/lib/supabase";

const dict = {
  es: { 
    explore: "Explorar", gallery: "Galería", profile: "Perfil", login: "Entrar", email: "Correo", password: "Contraseña", 
    termsCheck: "Acepto los Términos y Política de Privacidad", viewHere: "Ver aquí", register: "Crear cuenta", empty: "Aún no hay destellos guardados.", 
    deleteConfirm: "¿Soltar este recuerdo?", yes: "Sí", no: "No", phrase: "Tu frase inspiradora", save: "Guardar", 
    newPass: "Nueva contraseña", forgot: "¿Olvidaste tu contraseña?", recover: "Recuperar contraseña", newest: "Más recientes", 
    oldest: "Más antiguas", random: "Aleatorio", installApp: "Instalar App", loginBtn: "Iniciar sesión", 
    profileTagsHint: "En tu perfil puedes elegir las etiquetas de inspiración que prefieras.",
    photoBy: "Foto por", onUnsplash: "en Unsplash", download: "Descargar imagen", deleteFromGallery: "Borrar de mi galería",
    pauseTitle1: "Pausa y Contemplación", pauseDesc1: "El mundo hace demasiado ruido.", 
    pauseText1: "Maeum es tu refugio íntimo. Un espacio libre de algoritmos y exigencias diseñado como medicina para tu sistema nervioso.",
    createRefuge: "Crear mi refugio", pauseTitle2: "Contemplación y Calma", pauseDesc2: "Scroll infinito y presencia.",
    pauseText2: "Aquí puedes hacer scroll infinito —con música ambiental de fondo o en silencio—. La exposición dosificada a la belleza visual reduce los niveles de cortisol. Desplazarte con intención te permite desacelerar el pensamiento.",
    pauseTitle3: "Colección", pauseDesc3: "La colección de destellos.",
    pauseText3: "Guardar fragmentos visuales que resuenan con tu interior funciona como un ancla de gratitud y regulación emocional, permitiéndote evocar estados de seguridad con solo mirar tu archivo.",
    pauseTitle4: "Esencia", pauseDesc4: "Maeum es recordarte que tu atención es sagrada, y tu paz interior, un territorio que merece ser cuidado.",
    viewGrid: "Ver Mosaico", yourName: "Tu Nombre", yourTags: "Tus etiquetas (Máx. 5)", noTags: "Ninguna etiqueta seleccionada.",
    writeTag: "Escribe tu propia etiqueta (ej. gatos)", tagSuggestions: "Sugerencias para inspirarte", phrasePlaceholder: "Ej. Aceptar que se va a escurrir... soltar",
    appearance: "Apariencia", light: "Claro", dark: "Oscuro", language: "Idioma", newPassPlaceholder: "Escribe para cambiar tu contraseña",
    saving: "Guardando...", signOut: "Salir de la cuenta", signingOut: "Saliendo...", followInstagram: "Síguenos en Instagram",
    checkInbox: "Revisa tu bandeja", magicLinkText: "Hemos enviado un enlace mágico para confirmar tu espacio.",
    spamNotice: "*Si no lo ves, por favor revisa tu carpeta de Spam o Correo no deseado.", verifiedEnter: "Ya lo verifiqué → Entrar",
    installTitle: "Instala Maeum", installDesc: "Lleva tu espacio de pausa visual directo en tu pantalla de inicio.",
    understood: "Entendido", noAccount: "¿No tienes cuenta?", haveAccount: "¿Ya tienes cuenta?", backToLogin: "Volver a Iniciar Sesión",
    takeBreakTitle: "Tómate un respiro", takeBreakDesc: "Has contemplado mucha belleza por ahora. Es momento de estar presente en el mundo real, descansar tus ojos y reconectar contigo. Vuelve en una hora.",
    processing: "Procesando..."
  },
  en: { 
    explore: "Explore", gallery: "Gallery", profile: "Profile", login: "Log In", email: "Email", password: "Password", 
    termsCheck: "I accept Terms and Privacy Policy", viewHere: "View here", register: "Sign Up", empty: "No flashes saved yet.", 
    deleteConfirm: "Let go of this memory?", yes: "Yes", no: "No", phrase: "Your inspiring quote", save: "Save", 
    newPass: "New password", forgot: "Forgot your password?", recover: "Recover password", newest: "Newest first", 
    oldest: "Oldest first", random: "Random", installApp: "Install App", loginBtn: "Log In", 
    profileTagsHint: "You can choose your preferred inspiration tags in your profile.",
    photoBy: "Photo by", onUnsplash: "on Unsplash", download: "Download image", deleteFromGallery: "Delete from gallery",
    pauseTitle1: "Pause & Contemplation", pauseDesc1: "The world is too loud.", 
    pauseText1: "Maeum is your intimate refuge. A space free of algorithms designed as medicine for your nervous system.",
    createRefuge: "Create my refuge", pauseTitle2: "Contemplation & Calm", pauseDesc2: "Infinite scroll & presence.",
    pauseText2: "Scroll endlessly with ambient music or in silence. Dosed exposure to visual beauty reduces cortisol levels. Scrolling with intention allows you to slow down your thoughts.",
    pauseTitle3: "Collection", pauseDesc3: "The collection of flashes.",
    pauseText3: "Saving visual fragments that resonate with your soul works as an anchor of gratitude, allowing you to evoke safety states just by looking at your archive.",
    pauseTitle4: "Essence", pauseDesc4: "Maeum reminds you that your attention is sacred, and your inner peace is a territory worth protecting.",
    viewGrid: "View Grid", yourName: "Your Name", yourTags: "Your tags (Max 5)", noTags: "No tags selected.",
    writeTag: "Write your own tag (e.g. cats)", tagSuggestions: "Suggestions for inspiration", phrasePlaceholder: "e.g. Accept that it will slip away... let go",
    appearance: "Appearance", light: "Light", dark: "Dark", language: "Language", newPassPlaceholder: "Type to change your password",
    saving: "Saving...", signOut: "Sign Out", signingOut: "Signing out...", followInstagram: "Follow us on Instagram",
    checkInbox: "Check your inbox", magicLinkText: "We've sent a magic link to confirm your space.",
    spamNotice: "*If you don't see it, please check your Spam folder.", verifiedEnter: "I verified it → Enter",
    installTitle: "Install Maeum", installDesc: "Take your visual pause space directly to your home screen.",
    understood: "Understood", noAccount: "Don't have an account?", haveAccount: "Already have an account?", backToLogin: "Back to Log In",
    takeBreakTitle: "Take a breath", takeBreakDesc: "You've contemplated enough beauty for now. Time to be present in the real world. Come back in about an hour.",
    processing: "Processing..."
  },
  fr: { 
    explore: "Explorer", gallery: "Galerie", profile: "Profil", login: "Connexion", email: "E-mail", password: "Mot de passe", 
    termsCheck: "J'accepte les conditions", viewHere: "Voir ici", register: "S'inscrire", empty: "Aucun souvenir enregistré.", 
    deleteConfirm: "Lâcher ce souvenir?", yes: "Oui", no: "Non", phrase: "Votre citation", save: "Enregistrer", 
    newPass: "Nouveau mot de passe", forgot: "Mot de passe oublié?", recover: "Récupérer", newest: "Plus récents", 
    oldest: "Plus anciens", random: "Aléatoire", installApp: "Installer l'App", loginBtn: "Connexion", 
    profileTagsHint: "Choisissez vos tags d'inspiration dans votre profil.",
    photoBy: "Photo de", onUnsplash: "sur Unsplash", download: "Télécharger", deleteFromGallery: "Supprimer de la galerie",
    pauseTitle1: "Pause et Contemplation", pauseDesc1: "Le monde fait trop de bruit.", 
    pauseText1: "Maeum est votre refuge intime. Un espace sans algorithmes conçu comme un remède pour votre système nerveux.",
    createRefuge: "Créer mon refuge", pauseTitle2: "Contemplation et Calme", pauseDesc2: "Défilement infini.",
    pauseText2: "Faites défiler à l'infini avec de la musique d'ambiance. L'exposition à la beauté visuelle réduit le cortisol.",
    pauseTitle3: "Collection", pauseDesc3: "La collection d'éclats.",
    pauseText3: "Sauvegarder des fragments visuels fonctionne comme une ancre de gratitude et de régulation émotionnelle.",
    pauseTitle4: "Essence", pauseDesc4: "Maeum vous rappelle que votre attention est sacrée.",
    viewGrid: "Voir la mosaïque", yourName: "Votre Nom", yourTags: "Vos tags (Max 5)", noTags: "Aucun tag sélectionné.",
    writeTag: "Écrivez votre propre tag", tagSuggestions: "Suggestions", phrasePlaceholder: "Ex. Lâcher prise...",
    appearance: "Apparence", light: "Clair", dark: "Sombre", language: "Langue", newPassPlaceholder: "Nouveau mot de passe",
    saving: "Enregistrement...", signOut: "Se déconnecter", signingOut: "Déconnexion...", followInstagram: "Suivez-nous sur Instagram",
    checkInbox: "Vérifiez votre boîte", magicLinkText: "Nous avons envoyé un lien magique.",
    spamNotice: "*Vérifiez vos spams si besoin.", verifiedEnter: "Vérifié → Entrer",
    installTitle: "Installer Maeum", installDesc: "Ajoutez Maeum à votre écran d'accueil.",
    understood: "Compris", noAccount: "Pas de compte?", haveAccount: "Déjà un compte?", backToLogin: "Retour",
    takeBreakTitle: "Prenez une pause", takeBreakDesc: "Vous avez contemplé assez de beauté. Revenez dans une heure.",
    processing: "Traitement..."
  },
  ko: { 
    explore: "탐색", gallery: "갤러리", profile: "프로필", login: "로그인", email: "이메일", password: "비밀번호", 
    termsCheck: "이용약관 및 개인정보 보호정책에 동의합니다", viewHere: "여기서 보기", register: "가입하기", empty: "저장된 추억이 없습니다.", 
    deleteConfirm: "이 기억을 놓아주시겠습니까?", yes: "네", no: "아니요", phrase: "영감을 주는 문구", save: "저장", 
    newPass: "새 비밀번호", forgot: "비밀번호를 잊으셨나요?", recover: "비밀번호 찾기", newest: "최신순", 
    oldest: "오래된순", random: "무작위", installApp: "앱 설치", loginBtn: "로그인", 
    profileTagsHint: "프로필에서 원하는 영감 태그를 선택할 수 있습니다.",
    photoBy: "사진 작가:", onUnsplash: "on Unsplash", download: "이미지 다운로드", deleteFromGallery: "갤러리에서 삭제",
    pauseTitle1: "휴식과 명상", pauseDesc1: "세상은 너무 시끄럽습니다.", 
    pauseText1: "Maeum은 당신의 은밀한 피난처입니다. 신경계를 위한 약으로 설계된 알고리즘 없는 공간입니다.",
    createRefuge: "나만의 피난처 만들기", pauseTitle2: "명상과 평온", pauseDesc2: "무한 스크롤과 존재감.",
    pauseText2: "주변 음악과 함께 무한 스크롤을 즐겨보세요. 시각적 아름다움에 노출되면 코르티솔 수치가 감소합니다.",
    pauseTitle3: "컬렉션", pauseDesc3: "빛의 컬렉션.",
    pauseText3: "내면과 공명하는 시각적 조각을 저장하는 것은 감정 조절과 감사의 닻 역할을 합니다.",
    pauseTitle4: "본질", pauseDesc4: "Maeum은 당신의 평화가 지킬 가치가 있는 영토임을 상기시켜줍니다.",
    viewGrid: "그리드 보기", yourName: "이름", yourTags: "태그 (최대 5개)", noTags: "선택된 태그 없음.",
    writeTag: "직접 태그 입력 (예: 고양이)", tagSuggestions: "추천 태그", phrasePlaceholder: "예: 흘러가게 두기... 놓아주기",
    appearance: "테마", light: "라이트", dark: "다크", language: "언어", newPassPlaceholder: "비밀번호 변경을 위해 입력하세요",
    saving: "저장 중...", signOut: "로그아웃", signingOut: "로그아웃 중...", followInstagram: "Instagram 팔로우",
    checkInbox: "이메일을 확인하세요", magicLinkText: "확인을 위한 매직 링크를 보냈습니다.",
    spamNotice: "*보이지 않는다면 스팸함을 확인해 주세요.", verifiedEnter: "확인 완료 → 입장",
    installTitle: "Maeum 설치", installDesc: "홈 화면에 시각적 휴식 공간을 추가하세요.",
    understood: "이해했습니다", noAccount: "계정이 없으신가요?", haveAccount: "이미 계정이 있으신가요?", backToLogin: "로그인으로 돌아가기",
    takeBreakTitle: "잠시 휴식", takeBreakDesc: "충분한 아름다움을 감상하셨습니다. 현실 세계에 머무를 시간입니다. 한 시간 후에 다시 오세요.",
    processing: "처리 중..."
  }
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
  const [customTag, setCustomTag] = useState("");
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("es"); // Por defecto español
  
  const [currentTab, setCurrentTab] = useState("explore"); 
  const [galleryView, setGalleryView] = useState("grid");
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [activeMenuPhotoId, setActiveMenuPhotoId] = useState(null); 
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState("blanco");
  const [feedPhotos, setFeedPhotos] = useState([]);
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

  const displayedGallery = useMemo(() => {
    return normalizedLikes.slice(0, galleryLimit);
  }, [normalizedLikes, galleryLimit]);

  useEffect(() => {
    // Detección de idioma
    const savedLang = localStorage.getItem('maeum-lang');
    if (savedLang && dict[savedLang]) {
      setLang(savedLang);
    } else {
      const userLang = navigator.language.slice(0, 2);
      if (dict[userLang]) {
        setLang(userLang);
      }
    }

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
    
    if (u.user_metadata?.lang && dict[u.user_metadata.lang]) {
      setLang(u.user_metadata.lang);
      localStorage.setItem('maeum-lang', u.user_metadata.lang);
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

  const changeLang = async (newLang) => {
    setLang(newLang);
    localStorage.setItem('maeum-lang', newLang);
    if (user) {
      supabase.auth.updateUser({ data: { lang: newLang } }).catch(console.error);
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
            title: dict[lang].takeBreakTitle,
            text: dict[lang].takeBreakDesc
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
            authorName: img.user?.name || "Unsplash",
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
    if (currentTab === "gallery") setGalleryLimit(12);
  }, [currentTab]);

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
        setAppMessage({ title: "Email", text: dict[lang].magicLinkText });
        setShowAuthModal(false);
      }
      setIsAuthenticating(false);
      return;
    }

    if (!isLogin && !acceptedTerms) {
      setAppMessage({ title: "Aviso", text: dict[lang].termsCheck });
      setIsAuthenticating(false);
      return;
    }

    let authResult;
    const currentTheme = localStorage.getItem('maeum-theme') || "light";
    const currentLang = localStorage.getItem('maeum-lang') || "es";

    if (isLogin) {
      authResult = await supabase.auth.signInWithPassword({ email, password });
    } else {
      authResult = await supabase.auth.signUp({ 
        email, password, 
        options: { data: { full_name: name, phrase: "", tags: [], theme: currentTheme, lang: currentLang } }
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
    } catch(e) { console.warn("Forzando limpieza local.", e); }
    
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
        setAppMessage({ title: "Error", text: "Error base de datos." });
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
    } catch (err) {}
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
      setAppMessage({ title: "Info", text: dict[lang].save + " ✓" });
    } catch (error) {
      setAppMessage({ title: "Error", text: error.message });
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

  const handleAddCustomTag = async (e) => {
    e.preventDefault();
    const tag = customTag.trim().toLowerCase();
    if (!tag) return;
    if (selectedTags.includes(tag)) {
       setCustomTag("");
       return;
    }
    if (selectedTags.length >= 5) {
       setAppMessage({ title: "Info", text: "Max 5 tags." });
       return;
    }
    
    const newTags = [...selectedTags, tag];
    setSelectedTags(newTags);
    setCustomTag("");
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
                {t.installApp}
              </button>
            )}

            {!user && (
              <button 
                onClick={() => { setIsLogin(true); setIsForgotPassword(false); setShowAuthModal(true); }} 
                className={`text-[10px] sm:text-xs tracking-widest uppercase transition-colors active:scale-95 ${isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-900'}`}
              >
                {t.loginBtn}
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
              <p className={`text-xs italic px-2 py-1.5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.profileTagsHint}</p>
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
                      {t.photoBy} {photo.authorName} {t.onUnsplash}
                    </a>

                    <button onClick={(e) => toggleLike(photo, e)} className={`absolute bottom-4 right-4 z-10 backdrop-blur-sm p-3 rounded-full shadow-lg active:scale-90 transition-all ${isDark ? 'bg-neutral-900/80' : 'bg-white/90'}`}>
                      <svg className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : (isDark ? 'text-neutral-500 fill-none' : 'text-neutral-400 fill-none')}`} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                    </button>
                  </div>

                  {!user && index === 1 && (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 py-20 px-6 my-4 flex justify-center">
                      <div className={`max-w-2xl w-full flex flex-col items-center text-center p-8 sm:p-12 bg-gradient-to-b from-transparent to-transparent border-y ${isDark ? 'via-neutral-900/50 border-neutral-900' : 'via-neutral-50/50 border-neutral-100'}`}>
                        <span className={`text-[10px] uppercase tracking-[0.3em] mb-6 font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.pauseTitle1}</span>
                        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-light mb-6 leading-tight tracking-tight ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>
                          {t.pauseDesc1}
                        </h2>
                        <p className={`font-light text-[15px] sm:text-base leading-relaxed max-w-lg mb-10 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          {t.pauseText1}
                        </p>
                        <button 
                          onClick={() => { setIsLogin(false); setIsForgotPassword(false); setShowAuthModal(true); }} 
                          className={`group relative px-8 py-4 text-[10px] sm:text-xs uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 ${isDark ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
                        >
                          <span className="relative z-10 flex items-center gap-3">
                            {t.createRefuge}
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {!user && index === 3 && (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 py-20 px-6 my-4 flex justify-center">
                      <div className={`max-w-2xl w-full flex flex-col items-center text-center p-8 sm:p-12 bg-gradient-to-b from-transparent to-transparent border-y ${isDark ? 'via-neutral-900/50 border-neutral-900' : 'via-neutral-50/50 border-neutral-100'}`}>
                        <span className={`text-[10px] uppercase tracking-[0.3em] mb-6 font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.pauseTitle2}</span>
                        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-light mb-6 leading-tight tracking-tight ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>
                          {t.pauseDesc2}
                        </h2>
                        <p className={`font-light text-[15px] sm:text-base leading-relaxed max-w-lg ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          {t.pauseText2}
                        </p>
                      </div>
                    </div>
                  )}

                  {!user && index === 5 && (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 py-20 px-6 my-4 flex justify-center">
                      <div className={`max-w-2xl w-full flex flex-col items-center text-center p-8 sm:p-12 bg-gradient-to-b from-transparent to-transparent border-y ${isDark ? 'via-neutral-900/50 border-neutral-900' : 'via-neutral-50/50 border-neutral-100'}`}>
                        <span className={`text-[10px] uppercase tracking-[0.3em] mb-6 font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.pauseTitle3}</span>
                        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-light mb-6 leading-tight tracking-tight ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>
                          {t.pauseDesc3}
                        </h2>
                        <p className={`font-light text-[15px] sm:text-base leading-relaxed max-w-lg ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          {t.pauseText3}
                        </p>
                      </div>
                    </div>
                  )}

                  {!user && index === 7 && (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 py-20 px-6 my-4 flex justify-center">
                      <div className={`max-w-2xl w-full flex flex-col items-center text-center p-8 sm:p-12 bg-gradient-to-b from-transparent to-transparent border-y ${isDark ? 'via-neutral-900/50 border-neutral-900' : 'via-neutral-50/50 border-neutral-100'}`}>
                        <span className={`text-[10px] uppercase tracking-[0.3em] mb-6 font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.pauseTitle4}</span>
                        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-light mb-6 leading-relaxed tracking-tight ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>
                          {t.pauseDesc4}
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
                        {t.photoBy} {photo.authorName} {t.onUnsplash}
                      </a>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          downloadImage(photo.url, photo.id, photo.downloadLocation); 
                          setActiveMenuPhotoId(null); 
                        }} 
                        className={`w-full text-left px-3 py-2 text-[11px] uppercase tracking-wider mt-1 rounded ${isDark ? 'text-neutral-400 hover:bg-neutral-800' : 'text-neutral-600 hover:bg-neutral-50'}`}
                      >
                        {t.download}
                      </button>
                      <button 
                        onClick={() => { setActiveMenuPhotoId(null); setPhotoToDelete(photo.id); }} 
                        className={`w-full text-left px-3 py-2 text-[11px] uppercase tracking-wider rounded mt-1 ${isDark ? 'text-red-400 hover:bg-red-900/30' : 'text-red-500 hover:bg-red-50'}`}
                      >
                        {t.deleteFromGallery}
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
                 {t.viewGrid}
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
              placeholder={t.yourName}
              className={`w-full text-2xl font-normal text-center bg-transparent border-b outline-none pb-2 transition-colors text-[16px] sm:text-2xl ${isDark ? 'border-transparent focus:border-neutral-700 text-neutral-100' : 'border-transparent focus:border-neutral-200 text-neutral-900'}`} 
            />
            <p className={`text-xs mt-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{user.email}</p>
          </div>

          <div className="space-y-8">
            
            <div>
              <label className={`text-xs tracking-widest uppercase mb-4 block ${isDark ? 'text-neutral-400' : 'text-neutral-900'}`}>{t.yourTags}</label>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTags.length === 0 && <span className={`text-xs italic ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>{t.noTags}</span>}
                {selectedTags.map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => toggleTag(tag)}
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-full border transition-all active:scale-95 ${isDark ? 'border-neutral-300 bg-neutral-800 text-white hover:bg-neutral-700' : 'border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800'}`}
                  >
                    {tag} 
                    <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                ))}
              </div>

              {selectedTags.length < 5 && (
                <form onSubmit={handleAddCustomTag} className="flex gap-2 mb-6">
                  <input 
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder={t.writeTag}
                    maxLength="20"
                    className={`flex-1 px-4 py-3 rounded-md text-[14px] outline-none border transition-colors ${isDark ? 'bg-neutral-900 border-neutral-800 focus:border-neutral-600 text-neutral-200 placeholder:text-neutral-600' : 'bg-transparent border-neutral-200 focus:border-neutral-900 text-neutral-900 placeholder:text-neutral-400'}`}
                  />
                  <button 
                    type="submit"
                    disabled={!customTag.trim()}
                    className={`px-5 rounded-md text-xs tracking-widest uppercase transition-colors active:scale-95 disabled:opacity-50 ${isDark ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
                  >
                    +
                  </button>
                </form>
              )}

              <label className={`text-[10px] tracking-widest uppercase mb-3 block ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.tagSuggestions}</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.filter(tag => !selectedTags.includes(tag)).map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-xs rounded-full border transition-all active:scale-95 ${isDark ? 'border-neutral-800 text-neutral-500 hover:text-neutral-300' : 'border-neutral-200 text-neutral-500 hover:text-neutral-800'}`}
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`text-xs tracking-widest uppercase mb-2 block ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.phrase}</label>
              <textarea 
                value={userPhrase} 
                onChange={(e) => setUserPhrase(e.target.value)} 
                placeholder={t.phrasePlaceholder}
                className={`w-full p-4 border rounded-md text-[16px] outline-none resize-none h-24 transition-colors ${isDark ? 'bg-neutral-900 border-neutral-800 focus:border-neutral-600 text-neutral-200' : 'bg-transparent border-neutral-200 focus:border-neutral-900 text-neutral-900'}`} 
              />
            </div>

            <div>
              <label className={`text-xs tracking-widest uppercase mb-2 block ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.appearance}</label>
              <div className="flex gap-4">
                <button 
                  onClick={() => changeTheme('light')} 
                  className={`flex-1 py-3 text-xs uppercase tracking-widest rounded-md transition-colors border active:scale-95 ${theme === 'light' ? (isDark ? 'border-neutral-500 text-white bg-neutral-800' : 'border-neutral-900 bg-neutral-900 text-white') : (isDark ? 'border-neutral-800 text-neutral-500' : 'border-neutral-200 text-neutral-500')}`}
                >
                  {t.light}
                </button>
                <button 
                  onClick={() => changeTheme('dark')} 
                  className={`flex-1 py-3 text-xs uppercase tracking-widest rounded-md transition-colors border active:scale-95 ${theme === 'dark' ? (isDark ? 'border-neutral-500 text-white bg-neutral-800' : 'border-neutral-900 bg-neutral-900 text-white') : (isDark ? 'border-neutral-800 text-neutral-500' : 'border-neutral-200 text-neutral-500')}`}
                >
                  {t.dark}
                </button>
              </div>
            </div>
            
            {/* Selector de idiomas agregado al perfil */}
            <div>
              <label className={`text-xs tracking-widest uppercase mb-2 block ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.language}</label>
              <div className="flex gap-2">
                {['es', 'en', 'fr', 'ko'].map(l => (
                  <button 
                    key={l}
                    onClick={() => changeLang(l)} 
                    className={`flex-1 py-3 text-xs uppercase tracking-widest rounded-md transition-colors border active:scale-95 ${lang === l ? (isDark ? 'border-neutral-500 text-white bg-neutral-800' : 'border-neutral-900 bg-neutral-900 text-white') : (isDark ? 'border-neutral-800 text-neutral-500' : 'border-neutral-200 text-neutral-500')}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`text-xs tracking-widest uppercase mb-2 block ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.newPass}</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  placeholder={t.newPassPlaceholder}
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
                  {t.saving}
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
                  {t.signingOut}
                </>
              ) : t.signOut}
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
              {t.followInstagram}
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
            <h3 className={`text-sm tracking-widest uppercase mb-4 font-semibold ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{t.checkInbox}</h3>
            <p className={`text-sm mb-2 font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {t.magicLinkText}
            </p>
            <p className={`text-[11px] mb-8 italic ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
              {t.spamNotice}
            </p>
            <button 
              onClick={() => { 
                setIsEmailSent(false); 
                setIsLogin(true); 
                setShowAuthModal(true); 
              }} 
              className={`w-full py-4 rounded-md text-xs uppercase tracking-widest transition-colors ${isDark ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
            >
              {t.verifiedEnter}
            </button>
          </div>
        </div>
      )}

      {showTerms && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className={`p-6 sm:p-8 rounded-lg max-w-lg w-full relative shadow-2xl max-h-[80vh] overflow-y-auto ${isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-white'}`}>
            <button onClick={() => setShowTerms(false)} className={`absolute top-4 right-4 rounded-full w-8 h-8 flex items-center justify-center transition-colors ${isDark ? 'text-neutral-400 bg-neutral-800 hover:bg-neutral-700' : 'text-neutral-400 bg-white hover:bg-neutral-100'}`}>✕</button>
            <h3 className={`text-lg font-normal mb-6 text-center ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>Términos y Política de Privacidad</h3>
            
            {/* TEXTOS LEGALES (Siempre en idioma base por estándares de App) */}
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
              {t.termsCheck}
            </button>
          </div>
        </div>
      )}

      {showInstallGuide && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 pb-12 sm:pb-4">
          <div className={`p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl relative ${isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-white'}`}>
            <button onClick={() => setShowInstallGuide(false)} className="absolute top-4 right-4 text-neutral-400">✕</button>
            <h3 className={`text-lg font-normal mb-2 ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{t.installTitle}</h3>
            <p className={`text-sm mb-6 font-light ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{t.installDesc}</p>
            
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
              {t.understood}
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
              {t.understood}
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
                <input type="text" placeholder={t.yourName} required onChange={(e) => setName(e.target.value)} className={`w-full px-4 py-3 border-b outline-none transition-colors text-[16px] ${isDark ? 'bg-transparent border-neutral-800 text-neutral-200 focus:border-neutral-600' : 'border-neutral-200 text-neutral-900 focus:border-neutral-900'}`} />
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
                  <span className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>{t.termsCheck} <a href="#" onClick={(e) => { e.preventDefault(); setShowTerms(true); }} className="underline">{t.viewHere}</a></span>
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
                    {t.processing}
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
                {isLogin ? t.noAccount : t.haveAccount}
              </button>
            )}

            {isForgotPassword && (
              <button onClick={() => setIsForgotPassword(false)} className={`w-full text-center mt-6 text-xs underline transition-colors ${isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-700'}`}>
                {t.backToLogin}
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}