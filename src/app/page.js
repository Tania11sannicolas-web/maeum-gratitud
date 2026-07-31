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
    photoBy: "Foto por", onUnsplash: "en Pexels", download: "Descargar imagen", deleteFromGallery: "Borrar de mi galería",
    pauseTitle1: "Pausa y Contemplación", pauseDesc1: "El mundo hace demasiado ruido.", 
    pauseText1: "Maeum es tu refugio íntimo. Un espacio libre de algoritmos y exigencias diseñado como medicina para tu sistema nervioso.",
    createRefuge: "Crear mi refugio", pauseTitle2: "Contemplación y Calma", pauseDesc2: "Scroll infinito y presencia.",
    pauseText2: "Aquí puedes hacer scroll infinito —con música ambiental de fondo o en silencio—. La exposición dosificada a la belleza visual reduce los niveles de cortisol. Desplazarte con intención te permite desacelerar el pensamiento.",
    pauseTitle3: "Un Santuario en tu Bolsillo", pauseDesc3: "Tu atención es sagrada.",
    pauseText3: "Maeum no es solo una galería, es una herramienta terapéutica. Cada imagen es seleccionada para anclarte al presente y devolverle el ritmo natural a tu respiración.",
    pauseTitle4: "Colección", pauseDesc4: "La colección de destellos.",
    pauseText4: "Guardar fragmentos visuales que resuenan con tu interior funciona como un ancla de gratitud y regulación emocional.",
    pauseTitle5: "Esencia", pauseDesc5: "Maeum es recordarte que tu atención es sagrada, y tu paz interior, un territorio que merece ser cuidado.",
    viewGrid: "Ver Mosaico", yourName: "Tu Nombre", yourTags: "Tus etiquetas (Máx. 5)", noTags: "Ninguna etiqueta seleccionada.",
    writeTag: "Escribe tu propia etiqueta (ej. gatos)", tagSuggestions: "Sugerencias para inspirarte", phrasePlaceholder: "Ej. Aceptar que se va a escurrir... soltar",
    appearance: "Apariencia", light: "Claro", dark: "Oscuro", language: "Idioma", newPassPlaceholder: "Escribe para cambiar tu contraseña",
    saving: "Guardando...", signOut: "Salir de la cuenta", signingOut: "Saliendo...", followInstagram: "Síguenos en Instagram",
    checkInbox: "Revisa tu bandeja", magicLinkText: "Hemos enviado un enlace mágico para confirmar tu espacio.",
    spamNotice: "*Si no lo ves, por favor revisa tu carpeta de Spam o Correo no deseado.", verifiedEnter: "Ya lo verifiqué → Entrar",
    installTitle: "Instala Maeum", installDesc: "Lleva tu espacio de pausa visual directo en tu pantalla de inicio.",
    understood: "Entendido", noAccount: "¿No tienes cuenta?", haveAccount: "¿Ya tienes cuenta?", backToLogin: "Volver a Iniciar Sesión",
    takeBreakTitleFree: "Límite alcanzado", takeBreakDescFree: "Has contemplado mucha belleza por ahora. Vuelve en una hora para seguir viendo o actualiza a Premium para extender tu tiempo.",
    takeBreakTitlePremium: "Tómate un respiro", takeBreakDescPremium: "Es momento de estar presente en la vida real. Relaja tu mente, descansa tus ojos y reconecta contigo. Vuelve en una hora.",
    processing: "Procesando...",
    pricingTitle: "Elige tu Refugio", pricingFree: "Pausa Continua", pricingPremium: "Refugio Profundo",
    freeBenefit1: "Hasta 5 etiquetas de inspiración", freeBenefit2: "Guarda 24 destellos en tu galería", freeBenefit3: "3 pausas intencionales por hora",
    premiumBenefit1: "Hasta 5 etiquetas de inspiración", premiumBenefit2: "Guarda hasta 300 destellos en tu galería", premiumBenefit3: "5 pausas intencionales por hora",
    monthly: "$3 / mes", yearly: "$33 / año", subscribeBtn: "Actualizar a Premium", manageSubscription: "Gestionar Suscripción", galleryFull: "Galería llena",
    galleryFullDescFree: "Has alcanzado tu límite de 24 destellos. Actualiza a Premium para guardar hasta 300.", galleryFullDescPremium: "Has alcanzado el límite máximo de 300 destellos.",
    tags: { nature: "naturaleza", minimal: "minimalista", art: "arte", space: "espacio", animals: "animales", cities: "ciudades", flowers: "flores", colors: "colores", ocean: "océano", botanical: "botánica", warm: "cálido", desert: "desierto", abstract: "abstracto", vintage: "vintage", neon: "neón", geometry: "geometría", texture: "textura", landscape: "paisaje", clouds: "nubes", macro: "macro" },
    deleteAccount: "Eliminar cuenta permanentemente", deleteAccountConfirm: "Esta acción borrará tu galería, perfil y cancelará cualquier suscripción activa. No se puede deshacer. ¿Estás seguro/a?",
    premiumActive: "Premium Activo", lifetimeActive: "Premium de por Vida", loginErrorTitle: "Acceso denegado", tryAgain: "Volver a intentarlo", invalidCredentials: "El correo o la contraseña son incorrectos.",
    
    startIntentionalBtnTop: "Comenzar tu pausa intencional",
    audioSuggest: "Recomendamos activar el audio para una experiencia de regulación más profunda.",
    audioToggleOn: "Activar Audio", audioToggleOff: "Silenciar Audio",
    intentionalLimitReached: "Has abrazado suficientes pausas por ahora. Deja que las semillas germinen en la vida real. Regresa en una hora.",
    limitReachedTitle: "Descanso Sagrado",
    
    checkinTitle: "¿Cómo se siente tu sistema nervioso ahora mismo?",
    checkinSubtitle: "Elige el estado que más resuene contigo para recibir tu medicina visual.",
    startPause: "Comenzar pausa intencional",
    closeReflection: "Cerrar reflexión",
    therapyStates: [
      { id: 'anxious', label: 'Ansioso / Acelerado', prescriptions: [
        { tag: 'minimal', instruction: 'Busca el espacio vacío en estas imágenes. El cerebro ansioso busca amenazas constantes; observar el espacio negativo le enseña físicamente a tu mente que aquí no hay peligro.', reflection: '¿Notas si tu respiración se ha vuelto un poco más profunda y lenta?' },
        { tag: 'clouds', instruction: 'Observa la inmensidad. Las nubes se mueven lento y siempre cambian, sin esfuerzo. Sincronizar la vista con objetos lentos desactiva la urgencia de la amígdala.', reflection: '¿Qué sensación física cambió en tu pecho al mirar hacia arriba?' },
        { tag: 'ocean', instruction: 'Imagina el ritmo de las olas entrando y saliendo. La ritmicidad visual del agua ayuda a inducir coherencia cardíaca.', reflection: '¿Sientes que tu pulso se ha alineado un poco más con las imágenes?' },
        { tag: 'space', instruction: 'Contempla la escala del universo. Ante la inmensidad estelar, el cerebro relativiza la urgencia de los problemas inmediatos, reduciendo el cortisol.', reflection: '¿Tus preocupaciones se sienten un poco menos pesadas ahora?' },
        { tag: 'macro', instruction: 'Enfoca tu mirada en los microdetalles. Al obligar a los ojos a enfocar de cerca, evitas que el cerebro escanee el entorno buscando peligro.', reflection: '¿Se siente tu mente un poco más anclada en el presente?' },
        { tag: 'texture', instruction: 'Imagina la sensación táctil de estas superficies. Involucrar la memoria sensoriomotora aterriza tu energía ansiosa de vuelta al cuerpo físico.', reflection: '¿Qué parte de tu cuerpo se siente más presente?' },
        { tag: 'nature', instruction: 'Absorbe los patrones verdes. La fractalidad de la naturaleza ha demostrado clínicamente reducir la respuesta de lucha o huida en minutos.', reflection: '¿Sientes un poco más de frescura o calma interior?' },
        { tag: 'landscape', instruction: 'Amplía tu horizonte. La ansiedad provoca "visión de túnel". Observar panorámicas horizontales relaja los músculos oculares y el sistema nervioso simpático.', reflection: '¿Se ha suavizado la tensión en tu mandíbula?' },
        { tag: 'abstract', instruction: 'Deja que tu mente navegue sin buscar lógica. Romper el intento de "entender" todo relaja la corteza prefrontal sobreexigida.', reflection: '¿Hay más espacio mental en tu cabeza ahora?' },
        { tag: 'botanical', instruction: 'Sigue las líneas orgánicas de las hojas. Las curvas biológicas señalan a nuestra biología ancestral que estamos en un entorno nutritivo y seguro.', reflection: '¿Sientes tus hombros un poco más sueltos?' }
      ]},
      { id: 'exhausted', label: 'Agotado / Denso', prescriptions: [
        { tag: 'warm', instruction: 'Permite que los tonos cálidos bañen tus ojos. Los colores ámbar imitan la luz del atardecer, señalándole a tu cerebro que ya es seguro descansar.', reflection: '¿Puedes sentir un ligero calor o relajación en tu rostro?' },
        { tag: 'colors', instruction: 'Deja que los tonos vibrantes estimulen suavemente tu nervio óptico. Es una dosis de dopamina visual que despierta sin exigir energía física.', reflection: '¿Sientes tu mirada un poco menos pesada?' },
        { tag: 'flowers', instruction: 'Observa la delicadeza efímera. Ver flores activa asociaciones biológicas de vitalidad y renovación celular.', reflection: '¿Qué pequeño chispazo de energía notas en tu pecho?' },
        { tag: 'vintage', instruction: 'Sumérgete en la nostalgia estética. Los tonos apagados requieren menos procesamiento cognitivo, dándole a tu cerebro un descanso activo.', reflection: '¿Se siente tu mente menos saturada ahora?' },
        { tag: 'art', instruction: 'Observa el trazo y el color sin analizar. Contemplar arte activa áreas de placer pasivo en el cerebro, nutriendo sin agotar.', reflection: '¿Qué emoción suave se asomó al ver estas obras?' },
        { tag: 'animals', instruction: 'Conecta con la mirada de estos seres. Los mamíferos nos corregulamos; ver criaturas en reposo le transfiere su estado de ahorro de energía a tu cuerpo.', reflection: '¿Sientes tu respiración más parecida a la de ellos?' },
        { tag: 'nature', instruction: 'Deja que el verde actúe como un filtro. La biofilia pasiva ayuda a restaurar la fatiga de atención dirigida.', reflection: '¿Sientes un poco más de claridad detrás de tus ojos?' },
        { tag: 'ocean', instruction: 'Imagina la flotabilidad del agua. Sentir visualmente que el agua te sostiene ayuda a soltar el peso corporal que cargas por agotamiento.', reflection: '¿Tu espalda se siente un gramo más ligera?' },
        { tag: 'minimal', instruction: 'Menos es medicina. Reducir la cantidad de elementos visuales en pantalla apaga el esfuerzo de procesamiento de tu cerebro.', reflection: '¿Sientes alivio al no tener tanto que procesar?' },
        { tag: 'clouds', instruction: 'Mira la suavidad del cielo. Su falta de aristas sólidas permite que los ojos y la mente vaguen sin consumir reservas de energía.', reflection: '¿Sientes que la densidad mental se ha disipado un poco?' }
      ]},
      { id: 'sad', label: 'Triste / Melancólico', prescriptions: [
        { tag: 'botanical', instruction: 'La naturaleza es maestra en ciclos. Observar plantas te recuerda biológicamente que después del otoño e invierno, la vitalidad siempre regresa.', reflection: '¿Puedes sentir un pequeño espacio de aceptación dentro de ti?' },
        { tag: 'ocean', instruction: 'El agua contiene y limpia. Visualiza que las corrientes marinas sostienen esa pesadez que hoy llevas en el corazón.', reflection: '¿Sientes que tienes permiso para soltar una lágrima o un suspiro?' },
        { tag: 'flowers', instruction: 'Contempla su belleza frágil. Reconocer la belleza en lo transitorio ayuda a abrazar nuestras propias emociones temporales.', reflection: '¿Sientes un poco más de ternura hacia ti mismo?' },
        { tag: 'warm', instruction: 'Visualiza que esta luz cálida es un abrazo físico. La psicología del color asocia estos tonos con contención y refugio maternal.', reflection: '¿Se siente tu pecho un poco más abrigado?' },
        { tag: 'vintage', instruction: 'Observa la belleza del paso del tiempo. Entender que las cosas antiguas tienen valor te ayuda a abrazar tus propias cicatrices.', reflection: '¿Sientes menos urgencia por "arreglar" cómo te sientes?' },
        { tag: 'art', instruction: 'Alguien más sintió lo mismo y lo volvió color. El arte nos demuestra que no estamos solos en el espectro del dolor humano.', reflection: '¿Te sientes un poco más acompañado/a en tu experiencia?' },
        { tag: 'animals', instruction: 'Busca sus ojos amables. La presencia animal ofrece amor sin juicio, desactivando la sensación de aislamiento emocional.', reflection: '¿Sientes tu corazón un poco más blando?' },
        { tag: 'space', instruction: 'Observa las estrellas. Ante el infinito, nuestras penas no desaparecen, pero ganan una perspectiva que nos permite respirarlas mejor.', reflection: '¿Sientes que el universo es lo suficientemente grande para sostener tu tristeza?' },
        { tag: 'clouds', instruction: 'Las nubes no intentan quedarse quietas, solo pasan. Intenta observar tu tristeza con esa misma permisividad, sin retenerla.', reflection: '¿Sientes que la emoción fluye un poco más libre?' },
        { tag: 'nature', instruction: 'Busca raíces y troncos fuertes. Visualizar el enraizamiento profundo te da un suelo firme cuando las emociones intentan desbordarte.', reflection: '¿Sientes tus pies más firmes sobre la tierra?' }
      ]},
      { id: 'apathetic', label: 'Desconectado / Apático', prescriptions: [
        { tag: 'macro', instruction: 'Obliga a tus ojos a ver lo que el mundo ignora. El micro-asombro es la forma más rápida de reiniciar un sistema nervioso entumecido.', reflection: '¿Sientes un pequeño destello de curiosidad regresando?' },
        { tag: 'colors', instruction: 'Inyecta intensidad a tu corteza visual. Los contrastes fuertes actúan como un desfibrilador suave para la apatía emocional.', reflection: '¿Tu energía vital se siente un poco más despierta?' },
        { tag: 'neon', instruction: 'Deja que la luz artificial rompa la niebla mental. El brillo del neón estimula respuestas atencionales inmediatas en el cerebro.', reflection: '¿Se siente tu mente un poco más nítida?' },
        { tag: 'cities', instruction: 'Observa el pulso de la humanidad. Aunque te sientas lejos, mirar el flujo urbano reactiva sutilmente tus neuronas espejo de conexión social.', reflection: '¿Sientes un leve deseo de movimiento en tu cuerpo?' },
        { tag: 'abstract', instruction: 'Reta a tu mente a encontrar significado donde no lo hay. Esto obliga a la neuroplasticidad a encenderse para sacarte del modo automático.', reflection: '¿Qué forma o idea inesperada captó tu atención?' },
        { tag: 'art', instruction: 'Deja que la provocación de otros te toque. El arte expresivo puede actuar como un espejo para emociones que no sabías que estaban bloqueadas.', reflection: '¿Qué emoción sutil lograste identificar al ver esto?' },
        { tag: 'texture', instruction: 'Despierta tus sentidos. Imaginar rugosidades y relieves estimula la corteza somatosensorial, devolviéndote al cuerpo físico.', reflection: '¿Sientes más tus manos o tu piel en este instante?' },
        { tag: 'geometry', instruction: 'Sigue las líneas. Obligar a los ojos a rastrear patrones complejos "despierta" el estado de alerta pasiva de manera segura.', reflection: '¿Te sientes un poco más enfocado/a?' },
        { tag: 'animals', instruction: 'Busca movimiento e intención en ellos. Observar a un ser vivo persiguiendo un objetivo primario nos contagia sutilmente su vitalidad.', reflection: '¿Hay alguna parte de ti que quiera estirarse o moverse?' },
        { tag: 'flowers', instruction: 'Busca el contraste de la flor contra su fondo. La vitalidad concentrada de la flor actúa como un recordatorio biológico de la vida vibrante.', reflection: '¿Pudiste conectar con al menos un detalle hermoso?' }
      ]},
      { id: 'frustrated', label: 'Frustrado / Enojado', prescriptions: [
        { tag: 'geometry', instruction: 'Cuando hay caos emocional, el cerebro necesita orden visual. La simetría le otorga un patrón predecible y seguro donde anclarse.', reflection: '¿Sientes que el "ruido" mental ha bajado su volumen?' },
        { tag: 'landscape', instruction: 'El enojo cierra nuestro foco visual (visión de túnel). Mirar horizontes amplios desactiva mecánicamente la respuesta fisiológica de lucha.', reflection: '¿Se ha relajado la tensión en tus puños o mandíbula?' },
        { tag: 'ocean', instruction: 'Sincronízate con la inmensidad azul. La psicología del color demuestra que los tonos fríos y expansivos reducen directamente la frecuencia cardíaca.', reflection: '¿Sientes que la presión en tu pecho ha disminuido?' },
        { tag: 'minimal', instruction: 'Quita fricción a tu alrededor. La rabia consume mucha RAM mental; observar imágenes limpias le quita carga de procesamiento a tu cerebro.', reflection: '¿Sientes un poco más de espacio entre tus pensamientos?' },
        { tag: 'space', instruction: 'Cambia la escala del problema. Al observar la galaxia, nuestra amígdala relativiza el detonante del enojo frente a la inmensidad del todo.', reflection: '¿Tu frustración se siente un poco más lejana o pequeña?' },
        { tag: 'clouds', instruction: 'Observa la falta de rigidez. La frustración es energía atascada; ver formas fluidas le recuerda a tu mente que ceder no es perder.', reflection: '¿Hay alguna parte de tu cuerpo que logró soltarse un poco?' },
        { tag: 'abstract', instruction: 'Suelta la necesidad de controlar o entender. El arte abstracto desprograma la necesidad del ego de tener siempre la razón.', reflection: '¿Sientes que puedes dejar de pelear mentalmente por un instante?' },
        { tag: 'nature', instruction: 'Busca colores tierra y verdes. Son entornos biológicamente neutros donde tu cerebro reptiliano sabe que no necesita defenderse.', reflection: '¿Tu respiración ha dejado de ser cortada y rápida?' },
        { tag: 'texture', instruction: 'Imagina tocar superficies rugosas o frías. Cambiar la temperatura o textura imaginada redirige la sangre del cerebro límbico a la corteza sensorial.', reflection: '¿Te sientes un poco más "enfriado/a" internamente?' },
        { tag: 'macro', instruction: 'Redirige tu foco. Forzar a tu mente a analizar el detalle de un insecto o una gota rompe el bucle de pensamientos obsesivos que alimentan el enojo.', reflection: '¿Lograste olvidarte del detonante durante estos segundos?' }
      ]},
      { id: 'vulnerable', label: 'Inseguro / Vulnerable', prescriptions: [
        { tag: 'animals', instruction: 'Busca la mirada compasiva. Como mamíferos, nos regulamos en manada. Observar animales nos brinda la seguridad de un afecto que no exige nada a cambio.', reflection: '¿Sientes un poco más de calor protector en tu estómago?' },
        { tag: 'art', instruction: 'Contempla la historia humana. El arte te recuerda que innumerables personas han cruzado la incertidumbre y han creado belleza a partir de ella.', reflection: '¿Te sientes un poco más capaz de sostener tu propia fragilidad?' },
        { tag: 'warm', instruction: 'Deja que los tonos cálidos actúen como un refugio. Visualmente imitan el calor de un fuego o un hogar seguro, calmando la sensación de exposición.', reflection: '¿Sientes que tienes un escudo sutil protegiéndote ahora?' },
        { tag: 'nature', instruction: 'Observa la solidez de los árboles. La naturaleza sobrevive a todas las tormentas anclándose profundo, no huyendo. Pide prestada esa fuerza visual.', reflection: '¿Sientes tus pies más anclados al piso en este momento?' },
        { tag: 'vintage', instruction: 'Conecta con la permanencia. Las cosas del pasado que perduran nos recuerdan que también nosotros tenemos resiliencia para sobrevivir al tiempo.', reflection: '¿Sientes un poco más de seguridad en tu propia historia?' },
        { tag: 'botanical', instruction: 'Observa el crecimiento constante. Cada planta encuentra la manera de buscar la luz, incluso en terrenos difíciles. Así como tú.', reflection: '¿Sientes un destello de confianza en tus propios recursos?' },
        { tag: 'landscape', instruction: 'Busca el refugio en la inmensidad. Un entorno visual amplio pero pacífico le dice a tu mente subconsciente que hay espacio seguro para ti en el mundo.', reflection: '¿Sientes que el mundo es un poco menos amenazante hoy?' },
        { tag: 'minimal', instruction: 'Descansa en el silencio visual. Cuando te sientes expuesto, el exceso de información hiere. La simplicidad te abraza sin hacer preguntas.', reflection: '¿Sientes alivio al no tener que protegerte de lo que ves?' },
        { tag: 'ocean', instruction: 'Deja que la profundidad del agua te sostenga. Visualiza que el océano es lo suficientemente fuerte para cargar con tus dudas por ti.', reflection: '¿Te sientes un poco más sostenido/a por la vida?' },
        { tag: 'clouds', instruction: 'Contempla la suavidad. Al no haber bordes afilados en las nubes, tu mente relaja sus barreras defensivas instintivas.', reflection: '¿Ha disminuido un poco la necesidad de protegerte?' }
      ]},
      { id: 'overwhelmed', label: 'Abrumado / Sobrestimulado', prescriptions: [
        { tag: 'minimal', instruction: 'Bienvenido al silencio visual. Tu carga cognitiva está al límite; permite que el espacio negativo vacíe la caché de tu cerebro exhausto.', reflection: '¿Sientes que hay menos "ruido" compitiendo por tu atención?' },
        { tag: 'ocean', instruction: 'Busca el ruido blanco visual. El flujo constante e ininterrumpido del agua plancha los picos de estrés causados por la sobreinformación.', reflection: '¿Sientes que tus pensamientos van un poco más despacio?' },
        { tag: 'clouds', instruction: 'Observa la baja saturación. Los colores suaves del cielo reducen el estímulo lumínico agresivo de las pantallas, sedando la hipervigilancia.', reflection: '¿Sientes alivio en la presión detrás de tus ojos?' },
        { tag: 'space', instruction: 'Encuentra calma en el vacío inmenso. El contraste entre estrellas y oscuridad profunda reinicia tu medidor de urgencia neurológica.', reflection: '¿Se siente tu mente un poco más descongestionada?' },
        { tag: 'macro', instruction: 'Filtra el mundo a una sola cosa. El cerebro abrumado sufre por la multitarea. Mirar un detalle microscópico te devuelve el foco singular.', reflection: '¿Fue un alivio tener que mirar solo un objeto a la vez?' },
        { tag: 'texture', instruction: 'Ancla tu atención. Recorrer visualmente una textura repetitiva bloquea la entrada de nuevos estímulos estresantes.', reflection: '¿Sientes que tu mente se dejó de dispersar por un instante?' },
        { tag: 'geometry', instruction: 'Descansa en la estructura matemática. Frente al caos externo, un patrón visual perfecto no exige energía para ser interpretado.', reflection: '¿Se siente reconfortante este nivel de orden?' },
        { tag: 'landscape', instruction: 'Aleja el zoom. Estás demasiado cerca de tus problemas. Visualizar la lejanía relaja mecánicamente el cristalino y la mente.', reflection: '¿Sientes que tu visión periférica se ha relajado?' },
        { tag: 'abstract', instruction: 'Desengancha la narrativa. No intentes buscarle historias a estas imágenes, úsalas solo como parches de color para descansar el lenguaje.', reflection: '¿Lograste silenciar tu voz interna por un segundo?' },
        { tag: 'botanical', instruction: 'Busca el verde monocromático. Está demostrado que rodearse visualmente de un solo tono natural disminuye la frecuencia cardíaca y la presión arterial.', reflection: '¿Sientes que tu cuerpo ha soltado el modo de "alerta"?' }
      ]},
      { id: 'stuck', label: 'Estancado / Bloqueado', prescriptions: [
        { tag: 'abstract', instruction: 'Fuerza nuevas rutas neuronales. Mirar formas que no tienen lógica predefinida estimula el pensamiento lateral y la creatividad bloqueada.', reflection: '¿Qué formas o figuras inesperadas descubrió tu cerebro aquí?' },
        { tag: 'neon', instruction: 'Enciende la chispa dopaminérgica. Los colores eléctricos de alto contraste despiertan al sistema nervioso simpático, empujándolo a la acción.', reflection: '¿Sientes un ligero incremento en tus ganas de hacer algo?' },
        { tag: 'cities', instruction: 'Contágiate del flujo. Observar la arquitectura y el movimiento humano reactiva la percepción que el mundo avanza, llevándote con él.', reflection: '¿Sientes un poco de esa energía colectiva en ti?' },
        { tag: 'colors', instruction: 'Rompe la monotonía mental. Inyectar colores puros y variados sacude la habituación visual, el primer paso para salir del estancamiento.', reflection: '¿Tu percepción del momento actual se siente más vívida?' },
        { tag: 'art', instruction: 'Usa la perspectiva de otro. Ver cómo un artista resolvió un lienzo te recuerda que siempre hay más de una forma de ver tu propia situación.', reflection: '¿Lograste sentir inspiración o asombro genuino?' },
        { tag: 'macro', instruction: 'Cambia radicalmente tu ángulo. Si estás bloqueado en el panorama general, sumergirte en lo minúsculo resetea tu marco de referencia cognitivo.', reflection: '¿Te diste cuenta de cuánta complejidad hay en lo pequeño?' },
        { tag: 'space', instruction: 'Contempla lo ilimitado. Sentirse atascado es una ilusión de encierro; ver el cosmos te recuerda que las posibilidades son literalmente infinitas.', reflection: '¿Sientes que tus opciones se han expandido ligeramente?' },
        { tag: 'clouds', instruction: 'Recuerda el principio del movimiento perpetuo. Ninguna nube se queda estática. Tu bloqueo también es una nube temporal que pasará.', reflection: '¿Sientes un poco más de fluidez en tu actitud?' },
        { tag: 'ocean', instruction: 'Sintoniza con las corrientes. El agua nunca se estanca, siempre encuentra un cauce. Imagina que tu mente copia esa misma propiedad fluida.', reflection: '¿Sientes que la resistencia interior cedió un poco?' },
        { tag: 'geometry', instruction: 'Busca nuevos ángulos de intersección. Identificar cómo las formas se unen visualmente ayuda al cerebro a buscar conexiones creativas en tus propios bloqueos.', reflection: '¿Pudiste ver algún patrón que te generara claridad?' }
      ]}
    ]
  },
  en: { 
    explore: "Explore", gallery: "Gallery", profile: "Profile", login: "Log In", email: "Email", password: "Password", 
    termsCheck: "I accept Terms and Privacy Policy", viewHere: "View here", register: "Sign Up", empty: "No flashes saved yet.", 
    deleteConfirm: "Let go of this memory?", yes: "Yes", no: "No", phrase: "Your inspiring quote", save: "Save", 
    newPass: "New password", forgot: "Forgot your password?", recover: "Recover password", newest: "Newest first", 
    oldest: "Oldest first", random: "Random", installApp: "Install App", loginBtn: "Log In", 
    profileTagsHint: "You can choose your preferred inspiration tags in your profile.",
    photoBy: "Photo by", onUnsplash: "on Pexels", download: "Download image", deleteFromGallery: "Delete from gallery",
    pauseTitle1: "Pause & Contemplation", pauseDesc1: "The world is too loud.", 
    pauseText1: "Maeum is your intimate refuge. A space free of algorithms designed as medicine for your nervous system.",
    createRefuge: "Create my refuge", pauseTitle2: "Contemplation & Calm", pauseDesc2: "Infinite scroll & presence.",
    pauseText2: "Scroll endlessly with ambient music or in silence. Dosed exposure to visual beauty reduces cortisol levels. Scrolling with intention allows you to slow down your thoughts.",
    pauseTitle3: "A Sanctuary in your Pocket", pauseDesc3: "Your attention is sacred.",
    pauseText3: "Maeum is not just a gallery, it's a therapeutic tool. Every image is selected to anchor you to the present and return the natural rhythm to your breathing.",
    pauseTitle4: "Collection", pauseDesc4: "The collection of flashes.",
    pauseText4: "Saving visual fragments that resonate with your soul works as an anchor of gratitude and emotional regulation.",
    pauseTitle5: "Essence", pauseDesc5: "Maeum reminds you that your attention is sacred, and your inner peace is a territory worth protecting.",
    viewGrid: "View Grid", yourName: "Your Name", yourTags: "Your tags (Max 5)", noTags: "No tags selected.",
    writeTag: "Write your own tag (e.g. cats)", tagSuggestions: "Suggestions for inspiration", phrasePlaceholder: "e.g. Accept that it will slip away... let go",
    appearance: "Appearance", light: "Light", dark: "Dark", language: "Language", newPassPlaceholder: "Type to change your password",
    saving: "Saving...", signOut: "Sign Out", signingOut: "Signing out...", followInstagram: "Follow us on Instagram",
    checkInbox: "Check your inbox", magicLinkText: "We've sent a magic link to confirm your space.",
    spamNotice: "*If you don't see it, please check your Spam folder.", verifiedEnter: "I verified it → Enter",
    installTitle: "Install Maeum", installDesc: "Take your visual pause space directly to your home screen.",
    understood: "Understood", noAccount: "Don't have an account?", haveAccount: "Already have an account?", backToLogin: "Back to Log In",
    takeBreakTitleFree: "Limit reached", takeBreakDescFree: "You've contemplated a lot of beauty for now. Come back in an hour to keep viewing or upgrade to Premium for more time.",
    takeBreakTitlePremium: "Take a breath", takeBreakDescPremium: "It's time to be present in the real world. Relax your mind, rest your eyes, and reconnect. Come back in an hour.",
    processing: "Processing...", pricingTitle: "Choose your Refuge", pricingFree: "Continuous Pause", pricingPremium: "Deep Refuge",
    freeBenefit1: "Up to 5 inspiration tags", freeBenefit2: "Save 24 flashes in your gallery", freeBenefit3: "3 intentional pauses per hour",
    premiumBenefit1: "Up to 5 inspiration tags", premiumBenefit2: "Save up to 300 flashes in your gallery", premiumBenefit3: "5 intentional pauses per hour",
    monthly: "$3 / month", yearly: "$33 / year", subscribeBtn: "Upgrade to Premium", manageSubscription: "Manage Subscription", galleryFull: "Gallery full",
    galleryFullDescFree: "You've reached your limit of 24 flashes. Upgrade to Premium to save up to 300.", galleryFullDescPremium: "You've reached the maximum limit of 300 flashes.",
    tags: { nature: "nature", minimal: "minimal", art: "art", space: "space", animals: "animals", cities: "cities", flowers: "flowers", colors: "colors", ocean: "ocean", botanical: "botanical", warm: "warm", desert: "desert", abstract: "abstract", vintage: "vintage", neon: "neon", geometry: "geometry", texture: "texture", landscape: "landscape", clouds: "clouds", macro: "macro" },
    deleteAccount: "Delete account permanently", deleteAccountConfirm: "This action will delete your gallery, profile, and cancel any active subscription. It cannot be undone. Are you sure?",
    premiumActive: "Active Premium", lifetimeActive: "Lifetime Premium", loginErrorTitle: "Access Denied", tryAgain: "Try Again", invalidCredentials: "Email or password is incorrect.",
    
    startIntentionalBtnTop: "Start your intentional pause",
    audioSuggest: "We recommend turning on the audio for a deeper regulatory experience.",
    audioToggleOn: "Turn on Audio", audioToggleOff: "Mute Audio",
    intentionalLimitReached: "You have embraced enough pauses for now. Let the seeds grow in real life. Come back in an hour.",
    limitReachedTitle: "Sacred Rest",

    checkinTitle: "How is your nervous system feeling right now?",
    checkinSubtitle: "Choose the state that resonates with you to receive your visual medicine.",
    startPause: "Begin intentional pause",
    closeReflection: "Close reflection",
    therapyStates: [
      { id: 'anxious', label: 'Anxious / Rushed', prescriptions: [
        { tag: 'minimal', instruction: 'Look for the empty space in these images. The anxious brain constantly looks for threats; observing negative space physically teaches your mind that there is no danger here.', reflection: 'Do you notice if your breathing has become a little deeper and slower?' },
        { tag: 'clouds', instruction: 'Observe the vastness. Clouds move slowly and always change, effortlessly. Synchronizing your sight with slow objects deactivates the urgency of the amygdala.', reflection: 'What physical sensation shifted in your chest while looking up?' },
        { tag: 'ocean', instruction: 'Imagine the rhythm of the waves coming in and out. The visual rhythmicity of water helps induce cardiac coherence.', reflection: 'Do you feel your pulse has aligned a bit more with the images?' },
        { tag: 'space', instruction: 'Contemplate the scale of the universe. Faced with stellar immensity, the brain relativizes the urgency of immediate problems, reducing cortisol.', reflection: 'Do your worries feel a bit less heavy now?' },
        { tag: 'macro', instruction: 'Focus your gaze on micro details. By forcing your eyes to focus closely, you prevent the brain from scanning the environment for danger.', reflection: 'Does your mind feel a bit more anchored in the present?' },
        { tag: 'texture', instruction: 'Imagine the tactile sensation of these surfaces. Engaging sensorimotor memory grounds your anxious energy back into the physical body.', reflection: 'Which part of your body feels more present?' },
        { tag: 'nature', instruction: 'Absorb the green patterns. Nature\'s fractals have been clinically proven to reduce the fight-or-flight response in minutes.', reflection: 'Do you feel a bit more freshness or inner calm?' },
        { tag: 'landscape', instruction: 'Expand your horizon. Anxiety causes tunnel vision. Observing horizontal panoramas relaxes the eye muscles and the sympathetic nervous system.', reflection: 'Has the tension in your jaw softened?' },
        { tag: 'abstract', instruction: 'Let your mind wander without seeking logic. Breaking the attempt to "understand" everything relaxes the overdemanded prefrontal cortex.', reflection: 'Is there more mental space in your head now?' },
        { tag: 'botanical', instruction: 'Follow the organic lines of the leaves. Biological curves signal to our ancestral biology that we are in a nourishing and safe environment.', reflection: 'Do your shoulders feel a little looser?' }
      ]},
      { id: 'exhausted', label: 'Exhausted / Heavy', prescriptions: [
        { tag: 'warm', instruction: 'Allow warm tones to bathe your eyes. Amber colors mimic evening light, signaling to your brain that it is now safe to rest.', reflection: 'Can you feel a slight warmth or relaxation in your face?' },
        { tag: 'colors', instruction: 'Let vibrant tones gently stimulate your optic nerve. It’s a visual dopamine dose that awakens without demanding physical energy.', reflection: 'Does your gaze feel a little less heavy?' },
        { tag: 'flowers', instruction: 'Observe the ephemeral delicacy. Seeing flowers activates biological associations of vitality and cellular renewal.', reflection: 'What small spark of energy do you notice in your chest?' },
        { tag: 'vintage', instruction: 'Immerse yourself in aesthetic nostalgia. Muted tones require less cognitive processing, giving your brain an active rest.', reflection: 'Does your mind feel less saturated now?' },
        { tag: 'art', instruction: 'Observe stroke and color without analyzing. Contemplating art activates passive pleasure areas in the brain, nourishing without exhausting.', reflection: 'What soft emotion emerged when seeing these works?' },
        { tag: 'animals', instruction: 'Connect with the gaze of these beings. Mammals co-regulate; seeing creatures at rest transfers their energy-saving state to your body.', reflection: 'Do you feel your breathing more similar to theirs?' },
        { tag: 'nature', instruction: 'Let the green act as a filter. Passive biophilia helps restore directed attention fatigue.', reflection: 'Do you feel a bit more clarity behind your eyes?' },
        { tag: 'ocean', instruction: 'Imagine the buoyancy of water. Visually feeling that water holds you helps release the physical weight you carry from exhaustion.', reflection: 'Does your back feel an ounce lighter?' },
        { tag: 'minimal', instruction: 'Less is medicine. Reducing the amount of visual elements on screen turns off your brain\'s processing effort.', reflection: 'Do you feel relief in not having so much to process?' },
        { tag: 'clouds', instruction: 'Look at the softness of the sky. Its lack of solid edges allows eyes and mind to wander without consuming energy reserves.', reflection: 'Do you feel the mental density has dissipated a bit?' }
      ]},
      { id: 'sad', label: 'Sad / Melancholic', prescriptions: [
        { tag: 'botanical', instruction: 'Nature is a master of cycles. Observing plants biologically reminds you that after autumn and winter, vitality always returns.', reflection: 'Can you feel a small space of acceptance inside you?' },
        { tag: 'ocean', instruction: 'Water contains and cleanses. Visualize ocean currents holding that heaviness you carry in your heart today.', reflection: 'Do you feel you have permission to release a tear or a sigh?' },
        { tag: 'flowers', instruction: 'Contemplate their fragile beauty. Recognizing beauty in the transient helps embrace our own temporary emotions.', reflection: 'Do you feel a bit more tenderness towards yourself?' },
        { tag: 'warm', instruction: 'Visualize this warm light as a physical embrace. Color psychology associates these tones with containment and maternal refuge.', reflection: 'Does your chest feel a little warmer?' },
        { tag: 'vintage', instruction: 'Observe the beauty of passing time. Understanding that old things hold value helps you embrace your own scars.', reflection: 'Do you feel less urgency to "fix" how you feel?' },
        { tag: 'art', instruction: 'Someone else felt the same and turned it into color. Art shows us we are not alone in the spectrum of human pain.', reflection: 'Do you feel a little more accompanied in your experience?' },
        { tag: 'animals', instruction: 'Look for their kind eyes. Animal presence offers love without judgment, deactivating the feeling of emotional isolation.', reflection: 'Do you feel your heart a bit softer?' },
        { tag: 'space', instruction: 'Observe the stars. Faced with infinity, our sorrows don’t disappear, but they gain a perspective that allows us to breathe them better.', reflection: 'Do you feel the universe is big enough to hold your sadness?' },
        { tag: 'clouds', instruction: 'Clouds don’t try to stay still, they just pass. Try to observe your sadness with that same permissiveness, without holding it.', reflection: 'Do you feel the emotion flowing a bit more freely?' },
        { tag: 'nature', instruction: 'Look for strong roots and trunks. Visualizing deep grounding gives you a firm floor when emotions try to overwhelm you.', reflection: 'Do your feet feel firmer on the ground?' }
      ]},
      { id: 'apathetic', label: 'Disconnected / Apathetic', prescriptions: [
        { tag: 'macro', instruction: 'Force your eyes to see what the world ignores. Micro-awe is the fastest way to reboot a numb nervous system.', reflection: 'Do you feel a small flash of curiosity returning?' },
        { tag: 'colors', instruction: 'Inject intensity into your visual cortex. Strong contrasts act as a gentle defibrillator for emotional apathy.', reflection: 'Does your vital energy feel a bit more awake?' },
        { tag: 'neon', instruction: 'Let the artificial light break the mental fog. Neon glow stimulates immediate attentional responses in the brain.', reflection: 'Does your mind feel a bit sharper?' },
        { tag: 'cities', instruction: 'Observe the pulse of humanity. Even if you feel far away, looking at urban flow subtly reactivates your mirror neurons of social connection.', reflection: 'Do you feel a slight desire for movement in your body?' },
        { tag: 'abstract', instruction: 'Challenge your mind to find meaning where there is none. This forces neuroplasticity to ignite to break you out of autopilot.', reflection: 'What unexpected shape or idea caught your attention?' },
        { tag: 'art', instruction: 'Let the provocation of others touch you. Expressive art can act as a mirror for emotions you didn’t know were blocked.', reflection: 'What subtle emotion did you manage to identify seeing this?' },
        { tag: 'texture', instruction: 'Awaken your senses. Imagining roughness and reliefs stimulates the somatosensory cortex, returning you to the physical body.', reflection: 'Do you feel your hands or your skin more in this instant?' },
        { tag: 'geometry', instruction: 'Follow the lines. Forcing the eyes to track complex patterns "wakes up" the state of passive alertness safely.', reflection: 'Do you feel a little more focused?' },
        { tag: 'animals', instruction: 'Look for movement and intention in them. Observing a living being pursuing a primary goal subtly infects us with its vitality.', reflection: 'Is there any part of you that wants to stretch or move?' },
        { tag: 'flowers', instruction: 'Look for the flower’s contrast against its background. The concentrated vitality of the flower acts as a biological reminder of vibrant life.', reflection: 'Were you able to connect with at least one beautiful detail?' }
      ]},
      { id: 'frustrated', label: 'Frustrated / Angry', prescriptions: [
        { tag: 'geometry', instruction: 'When there is emotional chaos, the brain needs visual order. Symmetry gives it a predictable and safe pattern to anchor to.', reflection: 'Do you feel the mental "noise" has turned its volume down?' },
        { tag: 'landscape', instruction: 'Anger narrows our visual focus (tunnel vision). Looking at wide horizons mechanically deactivates the physiological fight response.', reflection: 'Has the tension in your fists or jaw relaxed?' },
        { tag: 'ocean', instruction: 'Synchronize with the blue immensity. Color psychology proves that cold and expansive tones directly reduce heart rate.', reflection: 'Do you feel the pressure in your chest has decreased?' },
        { tag: 'minimal', instruction: 'Remove friction around you. Rage consumes a lot of mental RAM; observing clean images removes processing load from your brain.', reflection: 'Do you feel a bit more space between your thoughts?' },
        { tag: 'space', instruction: 'Change the scale of the problem. Looking at the galaxy, our amygdala relativizes the anger trigger against the immensity of everything.', reflection: 'Does your frustration feel a bit more distant or small?' },
        { tag: 'clouds', instruction: 'Observe the lack of rigidity. Frustration is stuck energy; seeing fluid shapes reminds your mind that yielding is not losing.', reflection: 'Is there any part of your body that managed to let go a bit?' },
        { tag: 'abstract', instruction: 'Release the need to control or understand. Abstract art deprograms the ego\'s need to always be right.', reflection: 'Do you feel you can stop fighting mentally for an instant?' },
        { tag: 'nature', instruction: 'Look for earth tones and greens. They are biologically neutral environments where your reptilian brain knows it doesn\'t need to defend itself.', reflection: 'Has your breathing stopped being short and fast?' },
        { tag: 'texture', instruction: 'Imagine touching rough or cold surfaces. Changing the imagined temperature or texture redirects blood from the limbic brain to the sensory cortex.', reflection: 'Do you feel a bit more "cooled down" internally?' },
        { tag: 'macro', instruction: 'Redirect your focus. Forcing your mind to analyze the detail of an insect or a drop breaks the loop of obsessive thoughts that feed anger.', reflection: 'Did you manage to forget the trigger during these seconds?' }
      ]},
      { id: 'vulnerable', label: 'Insecure / Vulnerable', prescriptions: [
        { tag: 'animals', instruction: 'Look for the compassionate gaze. As mammals, we regulate in packs. Observing animals gives us the security of affection that demands nothing in return.', reflection: 'Do you feel a bit more protective warmth in your stomach?' },
        { tag: 'art', instruction: 'Contemplate human history. Art reminds you that countless people have crossed uncertainty and created beauty from it.', reflection: 'Do you feel a bit more capable of holding your own fragility?' },
        { tag: 'warm', instruction: 'Let warm tones act as a refuge. Visually they mimic the heat of a fire or a safe home, calming the feeling of exposure.', reflection: 'Do you feel you have a subtle shield protecting you now?' },
        { tag: 'nature', instruction: 'Observe the solidity of trees. Nature survives all storms by anchoring deep, not running away. Borrow that visual strength.', reflection: 'Do your feet feel more anchored to the floor right now?' },
        { tag: 'vintage', instruction: 'Connect with permanence. Things from the past that endure remind us that we too have resilience to survive time.', reflection: 'Do you feel a bit more security in your own story?' },
        { tag: 'botanical', instruction: 'Observe the constant growth. Every plant finds a way to seek light, even in difficult terrains. Just like you.', reflection: 'Do you feel a flash of confidence in your own resources?' },
        { tag: 'landscape', instruction: 'Seek refuge in immensity. A wide but peaceful visual environment tells your subconscious mind there is safe space for you in the world.', reflection: 'Do you feel the world is a bit less threatening today?' },
        { tag: 'minimal', instruction: 'Rest in visual silence. When you feel exposed, excess information hurts. Simplicity embraces you without asking questions.', reflection: 'Do you feel relief not having to protect yourself from what you see?' },
        { tag: 'ocean', instruction: 'Let the depth of the water hold you. Visualize that the ocean is strong enough to carry your doubts for you.', reflection: 'Do you feel a bit more supported by life?' },
        { tag: 'clouds', instruction: 'Contemplate the softness. With no sharp edges in the clouds, your mind relaxes its instinctive defensive barriers.', reflection: 'Has the need to protect yourself decreased a bit?' }
      ]},
      { id: 'overwhelmed', label: 'Overwhelmed / Overstimulated', prescriptions: [
        { tag: 'minimal', instruction: 'Welcome to visual silence. Your cognitive load is at its limit; allow negative space to clear the cache of your exhausted brain.', reflection: 'Do you feel there is less "noise" competing for your attention?' },
        { tag: 'ocean', instruction: 'Look for visual white noise. The constant and uninterrupted flow of water irons out the stress peaks caused by overinformation.', reflection: 'Do you feel your thoughts going a bit slower?' },
        { tag: 'clouds', instruction: 'Observe the low saturation. The soft colors of the sky reduce the aggressive light stimulus of screens, sedating hypervigilance.', reflection: 'Do you feel relief in the pressure behind your eyes?' },
        { tag: 'space', instruction: 'Find calm in the vast emptiness. The contrast between stars and deep darkness resets your neurological urgency meter.', reflection: 'Does your mind feel a bit more decongested?' },
        { tag: 'macro', instruction: 'Filter the world to a single thing. The overwhelmed brain suffers from multitasking. Looking at a microscopic detail returns your singular focus.', reflection: 'Was it a relief to only have to look at one object at a time?' },
        { tag: 'texture', instruction: 'Anchor your attention. Visually touring a repetitive texture blocks the entry of new stressful stimuli.', reflection: 'Do you feel your mind stopped scattering for an instant?' },
        { tag: 'geometry', instruction: 'Rest in mathematical structure. Faced with external chaos, a perfect visual pattern demands no energy to be interpreted.', reflection: 'Does this level of order feel comforting?' },
        { tag: 'landscape', instruction: 'Zoom out. You are too close to your problems. Visualizing distance mechanically relaxes the lens and the mind.', reflection: 'Do you feel your peripheral vision has relaxed?' },
        { tag: 'abstract', instruction: 'Unhook the narrative. Don’t try to find stories in these images, use them only as color patches to rest your language.', reflection: 'Did you manage to silence your inner voice for a second?' },
        { tag: 'botanical', instruction: 'Look for monochromatic green. It is proven that visually surrounding yourself with a single natural tone lowers heart rate and blood pressure.', reflection: 'Do you feel your body has let go of the "alert" mode?' }
      ]},
      { id: 'stuck', label: 'Stuck / Blocked', prescriptions: [
        { tag: 'abstract', instruction: 'Force new neural pathways. Looking at shapes that have no predefined logic stimulates lateral thinking and blocked creativity.', reflection: 'What unexpected shapes or figures did your brain discover here?' },
        { tag: 'neon', instruction: 'Ignite the dopaminergic spark. High-contrast electric colors awaken the sympathetic nervous system, pushing it to action.', reflection: 'Do you feel a slight increase in your desire to do something?' },
        { tag: 'cities', instruction: 'Catch the flow. Observing architecture and human movement reactivates the perception that the world is moving forward, taking you with it.', reflection: 'Do you feel a bit of that collective energy in you?' },
        { tag: 'colors', instruction: 'Break the mental monotony. Injecting pure and varied colors shakes up visual habituation, the first step to get out of stagnation.', reflection: 'Does your perception of the current moment feel more vivid?' },
        { tag: 'art', instruction: 'Use someone else\'s perspective. Seeing how an artist resolved a canvas reminds you there is always more than one way to see your own situation.', reflection: 'Did you manage to feel genuine inspiration or awe?' },
        { tag: 'macro', instruction: 'Radically change your angle. If you are stuck in the big picture, diving into the minuscule resets your cognitive frame of reference.', reflection: 'Did you realize how much complexity there is in the small?' },
        { tag: 'space', instruction: 'Contemplate the limitless. Feeling stuck is an illusion of confinement; seeing the cosmos reminds you that possibilities are literally infinite.', reflection: 'Do you feel your options have expanded slightly?' },
        { tag: 'clouds', instruction: 'Remember the principle of perpetual motion. No cloud stays static. Your block is also a temporary cloud that will pass.', reflection: 'Do you feel a bit more fluidity in your attitude?' },
        { tag: 'ocean', instruction: 'Tune into the currents. Water never stagnates, it always finds a channel. Imagine your mind copying that same fluid property.', reflection: 'Do you feel the inner resistance gave way a bit?' },
        { tag: 'geometry', instruction: 'Look for new angles of intersection. Identifying how shapes visually join helps the brain seek creative connections in your own blocks.', reflection: 'Were you able to see any pattern that generated clarity for you?' }
      ]}
    ]
  },
  fr: { 
    explore: "Explorer", gallery: "Galerie", profile: "Profil", login: "Connexion", email: "E-mail", password: "Mot de passe", 
    termsCheck: "J'accepte les conditions", viewHere: "Voir ici", register: "S'inscrire", empty: "Aucun souvenir enregistré.", 
    deleteConfirm: "Lâcher ce souvenir?", yes: "Oui", no: "Non", phrase: "Votre citation", save: "Enregistrer", 
    newPass: "Nouveau mot de passe", forgot: "Mot de passe oublié?", recover: "Récupérer", newest: "Plus récents", 
    oldest: "Plus anciens", random: "Aléatoire", installApp: "Installer l'App", loginBtn: "Connexion", 
    profileTagsHint: "Choisissez vos tags d'inspiration dans votre profil.",
    photoBy: "Photo de", onUnsplash: "sur Pexels", download: "Télécharger", deleteFromGallery: "Supprimer de la galerie",
    pauseTitle1: "Pause et Contemplation", pauseDesc1: "Le monde fait trop de bruit.", 
    pauseText1: "Maeum est votre refuge intime. Un espace sans algorithmes conçu comme un remède pour votre système nerveux.",
    createRefuge: "Créer mon refuge", pauseTitle2: "Contemplation et Calme", pauseDesc2: "Défilement infini et présence.",
    pauseText2: "Faites défiler à l'infini avec de la musique d'ambiance. L'exposition à la beauté visuelle réduit le cortisol.",
    pauseTitle3: "Un Sanctuaire dans votre Poche", pauseDesc3: "Votre attention est sacrée.",
    pauseText3: "Maeum n'est pas seulement une galerie, c'est un outil thérapeutique. Chaque image est sélectionnée pour vous ancrer dans le présent.",
    pauseTitle4: "Collection", pauseDesc4: "La collection d'éclats.",
    pauseText4: "Sauvegarder des fragments visuels qui résonnent avec votre intérieur fonctionne comme une ancre de gratitude.",
    pauseTitle5: "Essence", pauseDesc5: "Maeum vous rappelle que votre attention est sacrée.",
    viewGrid: "Voir la mosaïque", yourName: "Votre Nom", yourTags: "Vos tags (Max 5)", noTags: "Aucun tag sélectionné.",
    writeTag: "Écrivez votre propre tag", tagSuggestions: "Suggestions", phrasePlaceholder: "Ex. Lâcher prise...",
    appearance: "Apparence", light: "Clair", dark: "Sombre", language: "Langue", newPassPlaceholder: "Nouveau mot de passe",
    saving: "Enregistrement...", signOut: "Se déconnecter", signingOut: "Déconnexion...", followInstagram: "Suivez-nous sur Instagram",
    checkInbox: "Vérifiez votre boîte", magicLinkText: "Nous avons envoyé un lien magique.",
    spamNotice: "*Vérifiez vos spams si besoin.", verifiedEnter: "Vérifié → Entrer",
    installTitle: "Installer Maeum", installDesc: "Ajoutez Maeum à votre écran d'accueil.",
    understood: "Compris", noAccount: "Pas de compte?", haveAccount: "Déjà un compte?", backToLogin: "Retour",
    takeBreakTitleFree: "Limite atteinte", takeBreakDescFree: "Vous avez contemplé beaucoup de beauté pour l'instant. Revenez dans une heure ou passez à Premium pour prolonger votre temps.",
    takeBreakTitlePremium: "Prenez une pause", takeBreakDescPremium: "Il est temps d'être présent dans le monde réel. Détendez votre esprit, reposez vos yeux. Revenez dans une heure.",
    processing: "Traitement...", pricingTitle: "Choisissez votre Refuge", pricingFree: "Pause Continue", pricingPremium: "Refuge Profond",
    freeBenefit1: "Jusqu'à 5 tags d'inspiration", freeBenefit2: "Sauvegardez 24 éclats dans votre galerie", freeBenefit3: "3 pauses intentionnelles par heure",
    premiumBenefit1: "Jusqu'à 5 tags d'inspiration", premiumBenefit2: "Sauvegardez jusqu'à 300 éclats", premiumBenefit3: "5 pauses intentionnelles par heure",
    monthly: "3 $ / mois", yearly: "33 $ / an", subscribeBtn: "Passer à Premium", manageSubscription: "Gérer l'abonnement", galleryFull: "Galerie pleine",
    galleryFullDescFree: "Vous avez atteint votre limite de 24 éclats.", galleryFullDescPremium: "Vous avez atteint la limite maximale de 300 éclats.",
    tags: { nature: "nature", minimal: "minimaliste", art: "art", space: "espace", animals: "animaux", cities: "villes", flowers: "fleurs", colors: "couleurs", ocean: "océan", botanical: "botanique", warm: "chaud", desert: "désert", abstract: "abstrait", vintage: "vintage", neon: "néon", geometry: "géométrie", texture: "texture", landscape: "paysage", clouds: "nuages", macro: "macro" },
    deleteAccount: "Supprimer le compte définitivement", deleteAccountConfirm: "Cette action supprimera votre galerie, votre profil et annulera tout abonnement actif. Elle est irréversible. Êtes-vous sûr(e)?",
    premiumActive: "Premium Actif", lifetimeActive: "Premium à Vie", loginErrorTitle: "Accès Refusé", tryAgain: "Réessayer", invalidCredentials: "L'e-mail ou le mot de passe est incorrect.",
    
    startIntentionalBtnTop: "Commencer votre pause intentionnelle",
    audioSuggest: "Nous recommandons d'activer l'audio pour une expérience plus profonde.",
    audioToggleOn: "Activer l'Audio", audioToggleOff: "Couper l'Audio",
    intentionalLimitReached: "Vous avez embrassé assez de pauses pour l'instant. Laissez les graines pousser. Revenez dans une heure.",
    limitReachedTitle: "Repos Sacré",

    checkinTitle: "Comment se sent votre système nerveux en ce moment ?",
    checkinSubtitle: "Choisissez l'état qui résonne en vous pour recevoir votre médecine visuelle.",
    startPause: "Commencer la pause intentionnelle",
    closeReflection: "Fermer la réflexion",
    therapyStates: [
      { id: 'anxious', label: 'Anxieux / Pressé', prescriptions: [
        { tag: 'minimal', instruction: 'Cherchez l’espace vide. Le cerveau anxieux cherche des menaces constantes ; observer l’espace négatif lui apprend physiquement qu’il n’y a aucun danger ici.', reflection: 'Votre respiration est-elle devenue un peu plus profonde ?' },
        { tag: 'clouds', instruction: 'Observez l\'immensité. Les nuages bougent lentement et sans effort. Synchroniser votre vue avec des objets lents désactive l\'urgence de l\'amygdale.', reflection: 'Quelle sensation physique a changé dans votre poitrine ?' },
        { tag: 'ocean', instruction: 'Imaginez le rythme des vagues. La rythmicité visuelle de l\'eau aide à induire la cohérence cardiaque.', reflection: 'Sentez-vous que votre pouls s\'est un peu aligné avec les images ?' },
        { tag: 'space', instruction: 'Contemplez l\'échelle de l\'univers. Face à l\'immensité, le cerveau relativise l\'urgence des problèmes, réduisant le cortisol.', reflection: 'Vos inquiétudes semblent-elles un peu moins lourdes maintenant ?' },
        { tag: 'macro', instruction: 'Concentrez-vous sur les micro-détails. En forçant les yeux à se concentrer de près, vous empêchez le cerveau de scanner l\'environnement en quête de danger.', reflection: 'Votre esprit se sent-il un peu plus ancré dans le présent ?' },
        { tag: 'texture', instruction: 'Imaginez la sensation tactile. Engager la mémoire sensori-motrice ramène votre énergie anxieuse dans le corps physique.', reflection: 'Quelle partie de votre corps se sent plus présente ?' },
        { tag: 'nature', instruction: 'Absorbez les motifs verts. Il est cliniquement prouvé que les fractales de la nature réduisent la réponse de fuite ou de combat en quelques minutes.', reflection: 'Ressentez-vous un peu plus de fraîcheur intérieure ?' },
        { tag: 'landscape', instruction: 'Élargissez votre horizon. L\'anxiété provoque une vision en tunnel. Observer des panoramas détend le système nerveux sympathique.', reflection: 'La tension dans votre mâchoire s\'est-elle adoucie ?' },
        { tag: 'abstract', instruction: 'Laissez votre esprit naviguer sans chercher de logique. Ne pas essayer de "comprendre" détend le cortex préfrontal.', reflection: 'Y a-t-il plus d\'espace mental dans votre tête maintenant ?' },
        { tag: 'botanical', instruction: 'Suivez les lignes organiques. Les courbes biologiques signalent à notre biologie que nous sommes dans un environnement sûr.', reflection: 'Vos épaules se sentent-elles un peu plus relâchées ?' }
      ]},
      { id: 'exhausted', label: 'Épuisé / Lourd', prescriptions: [
        { tag: 'warm', instruction: 'Laissez les tons chauds baigner vos yeux. Les couleurs ambrées imitent la lumière du soir, signalant au cerveau qu\'il est sûr de se reposer.', reflection: 'Ressentez-vous une légère chaleur sur votre visage ?' },
        { tag: 'colors', instruction: 'Laissez les tons vibrants stimuler doucement votre nerf optique. C\'est une dose de dopamine visuelle qui éveille sans exiger d\'énergie.', reflection: 'Votre regard vous semble-t-il un peu moins lourd ?' },
        { tag: 'flowers', instruction: 'Observez la délicatesse éphémère. Voir des fleurs active des associations biologiques de vitalité et de renouvellement cellulaire.', reflection: 'Quelle petite étincelle d\'énergie remarquez-vous dans votre poitrine ?' },
        { tag: 'vintage', instruction: 'Plongez dans la nostalgie esthétique. Les tons sourds nécessitent moins de traitement cognitif, offrant un repos actif au cerveau.', reflection: 'Votre esprit se sent-il moins saturé maintenant ?' },
        { tag: 'art', instruction: 'Observez le trait et la couleur sans analyser. Contempler l\'art active les zones de plaisir passif dans le cerveau, nourrissant sans épuiser.', reflection: 'Quelle douce émotion est apparue en voyant ces œuvres ?' },
        { tag: 'animals', instruction: 'Connectez-vous au regard de ces êtres. Voir des créatures au repos transfère leur état d\'économie d\'énergie à votre corps.', reflection: 'Sentez-vous votre respiration plus semblable à la leur ?' },
        { tag: 'nature', instruction: 'Laissez le vert agir comme un filtre. La biophilie passive aide à restaurer la fatigue de l\'attention dirigée.', reflection: 'Sentez-vous un peu plus de clarté derrière vos yeux ?' },
        { tag: 'ocean', instruction: 'Imaginez la flottabilité de l\'eau. Sentir visuellement que l\'eau vous soutient aide à relâcher le poids physique de l\'épuisement.', reflection: 'Votre dos semble-t-il un gramme plus léger ?' },
        { tag: 'minimal', instruction: 'Moins, c\'est de la médecine. Réduire la quantité d\'éléments visuels éteint l\'effort de traitement de votre cerveau.', reflection: 'Ressentez-vous du soulagement à ne pas avoir autant à traiter ?' },
        { tag: 'clouds', instruction: 'Regardez la douceur du ciel. L\'absence de bords solides permet aux yeux et à l\'esprit de vagabonder sans consommer d\'énergie.', reflection: 'Sentez-vous que la densité mentale s\'est un peu dissipée ?' }
      ]},
      { id: 'sad', label: 'Triste / Mélancolique', prescriptions: [
        { tag: 'botanical', instruction: 'La nature est maîtresse des cycles. Observer les plantes vous rappelle biologiquement qu\'après l\'hiver, la vitalité revient toujours.', reflection: 'Pouvez-vous ressentir un petit espace d\'acceptation en vous ?' },
        { tag: 'ocean', instruction: 'L\'eau contient et nettoie. Visualisez que les courants marins soutiennent cette lourdeur que vous portez dans le cœur aujourd\'hui.', reflection: 'Sentez-vous que vous avez la permission de relâcher un soupir ?' },
        { tag: 'flowers', instruction: 'Contemplez leur beauté fragile. Reconnaître la beauté dans l\'éphémère aide à embrasser nos propres émotions temporaires.', reflection: 'Ressentez-vous un peu plus de tendresse envers vous-même ?' },
        { tag: 'warm', instruction: 'Visualisez cette lumière chaude comme une étreinte physique. La psychologie des couleurs associe ces tons au confinement et au refuge maternel.', reflection: 'Votre poitrine se sent-elle un peu plus au chaud ?' },
        { tag: 'vintage', instruction: 'Observez la beauté du temps qui passe. Comprendre que les choses anciennes ont de la valeur vous aide à embrasser vos propres cicatrices.', reflection: 'Ressentez-vous moins l\'urgence de "réparer" ce que vous ressentez ?' },
        { tag: 'art', instruction: 'Quelqu\'un d\'autre a ressenti la même chose et l\'a transformé en couleur. L\'art nous montre que nous ne sommes pas seuls dans la douleur.', reflection: 'Vous sentez-vous un peu plus accompagné(e) dans votre expérience ?' },
        { tag: 'animals', instruction: 'Cherchez leurs yeux gentils. La présence animale offre un amour sans jugement, désactivant le sentiment d\'isolement émotionnel.', reflection: 'Sentez-vous votre cœur un peu plus tendre ?' },
        { tag: 'space', instruction: 'Observez les étoiles. Face à l\'infini, nos peines ne disparaissent pas, mais elles gagnent une perspective qui nous permet de mieux les respirer.', reflection: 'Sentez-vous que l\'univers est assez grand pour contenir votre tristesse ?' },
        { tag: 'clouds', instruction: 'Les nuages n\'essaient pas de rester immobiles, ils passent. Essayez d\'observer votre tristesse avec cette même permissivité.', reflection: 'Sentez-vous que l\'émotion circule un peu plus librement ?' },
        { tag: 'nature', instruction: 'Cherchez des racines et des troncs solides. Visualiser l\'enracinement vous donne un sol ferme lorsque les émotions tentent de vous submerger.', reflection: 'Sentez-vous vos pieds plus fermes sur le sol ?' }
      ]},
      { id: 'apathetic', label: 'Déconnecté / Apathique', prescriptions: [
        { tag: 'macro', instruction: 'Forcez vos yeux à voir ce que le monde ignore. Le micro-émerveillement est le moyen le plus rapide de redémarrer un système nerveux engourdi.', reflection: 'Ressentez-vous une petite étincelle de curiosité revenir ?' },
        { tag: 'colors', instruction: 'Injectez de l\'intensité dans votre cortex visuel. Les contrastes forts agissent comme un doux défibrillateur pour l\'apathie émotionnelle.', reflection: 'Votre énergie vitale se sent-elle un peu plus éveillée ?' },
        { tag: 'neon', instruction: 'Laissez la lumière artificielle briser le brouillard mental. L\'éclat du néon stimule des réponses attentionnelles immédiates dans le cerveau.', reflection: 'Votre esprit se sent-il un peu plus net ?' },
        { tag: 'cities', instruction: 'Observez le pouls de l\'humanité. Regarder le flux urbain réactive subtilement vos neurones miroirs de connexion sociale.', reflection: 'Ressentez-vous un léger désir de mouvement dans votre corps ?' },
        { tag: 'abstract', instruction: 'Mettez votre esprit au défi de trouver un sens là où il n\'y en a pas. Cela force la neuroplasticité pour vous sortir du pilote automatique.', reflection: 'Quelle forme ou idée inattendue a attiré votre attention ?' },
        { tag: 'art', instruction: 'Laissez la provocation des autres vous toucher. L\'art expressif peut agir comme un miroir pour des émotions que vous ignoriez être bloquées.', reflection: 'Quelle émotion subtile avez-vous réussi à identifier en voyant cela ?' },
        { tag: 'texture', instruction: 'Éveillez vos sens. Imaginer des rugosités stimule le cortex somatosensoriel, vous ramenant au corps physique.', reflection: 'Sentez-vous davantage vos mains ou votre peau en cet instant ?' },
        { tag: 'geometry', instruction: 'Suivez les lignes. Forcer les yeux à suivre des modèles complexes "réveille" l\'état d\'alerte passive de manière sûre.', reflection: 'Vous sentez-vous un peu plus concentré(e) ?' },
        { tag: 'animals', instruction: 'Cherchez le mouvement et l\'intention en eux. Observer un être vivant poursuivre un objectif nous transmet subtilement sa vitalité.', reflection: 'Y a-t-il une partie de vous qui veut s\'étirer ou bouger ?' },
        { tag: 'flowers', instruction: 'Cherchez le contraste de la fleur avec son fond. La vitalité concentrée de la fleur agit comme un rappel biologique de la vie vibrante.', reflection: 'Avez-vous pu vous connecter avec au moins un détail magnifique ?' }
      ]},
      { id: 'frustrated', label: 'Frustré / En colère', prescriptions: [
        { tag: 'geometry', instruction: 'En cas de chaos émotionnel, le cerveau a besoin d\'ordre visuel. La symétrie lui donne un modèle prévisible et sûr pour s\'ancrer.', reflection: 'Sentez-vous que le "bruit" mental a baissé de volume ?' },
        { tag: 'landscape', instruction: 'La colère rétrécit notre champ visuel (vision en tunnel). Regarder de vastes horizons désactive mécaniquement la réponse de lutte.', reflection: 'La tension dans vos poings ou votre mâchoire s\'est-elle relâchée ?' },
        { tag: 'ocean', instruction: 'Synchronisez-vous avec l\'immensité bleue. La psychologie des couleurs prouve que les tons froids réduisent directement la fréquence cardiaque.', reflection: 'Sentez-vous que la pression dans votre poitrine a diminué ?' },
        { tag: 'minimal', instruction: 'Supprimez la friction autour de vous. La rage consomme beaucoup de RAM mentale ; observer des images épurées allège votre cerveau.', reflection: 'Ressentez-vous un peu plus d\'espace entre vos pensées ?' },
        { tag: 'space', instruction: 'Changez l\'échelle du problème. En observant la galaxie, notre amygdale relativise le déclencheur de la colère face à l\'immensité du tout.', reflection: 'Votre frustration semble-t-elle un peu plus lointaine ou petite ?' },
        { tag: 'clouds', instruction: 'Observez l\'absence de rigidité. La frustration est une énergie bloquée ; voir des formes fluides rappelle à votre esprit que céder n\'est pas perdre.', reflection: 'Y a-t-il une partie de votre corps qui a réussi à se relâcher un peu ?' },
        { tag: 'abstract', instruction: 'Relâchez le besoin de contrôler ou de comprendre. L\'art abstrait déprogramme le besoin de l\'ego d\'avoir toujours raison.', reflection: 'Sentez-vous que vous pouvez arrêter de vous battre mentalement pour un instant ?' },
        { tag: 'nature', instruction: 'Cherchez les tons terre et verts. Ce sont des environnements biologiquement neutres où votre cerveau reptilien sait qu\'il n\'a pas besoin de se défendre.', reflection: 'Votre respiration a-t-elle cessé d\'être courte et rapide ?' },
        { tag: 'texture', instruction: 'Imaginez toucher des surfaces rugueuses ou froides. Changer la texture imaginée redirige le sang du cerveau limbique vers le cortex sensoriel.', reflection: 'Vous sentez-vous un peu plus "refroidi(e)" intérieurement ?' },
        { tag: 'macro', instruction: 'Redirigez votre attention. Forcer votre esprit à analyser le détail d\'un insecte ou d\'une goutte brise la boucle des pensées obsessionnelles.', reflection: 'Avez-vous réussi à oublier le déclencheur pendant ces secondes ?' }
      ]},
      { id: 'vulnerable', label: 'Insécure / Vulnérable', prescriptions: [
        { tag: 'animals', instruction: 'Cherchez le regard compatissant. En tant que mammifères, nous nous régulons en meute. Observer des animaux nous offre la sécurité d\'une affection sans attente.', reflection: 'Ressentez-vous un peu plus de chaleur protectrice dans votre ventre ?' },
        { tag: 'art', instruction: 'Contemplez l\'histoire humaine. L\'art vous rappelle que d\'innombrables personnes ont traversé l\'incertitude et ont créé de la beauté à partir d\'elle.', reflection: 'Vous sentez-vous un peu plus capable de soutenir votre propre fragilité ?' },
        { tag: 'warm', instruction: 'Laissez les tons chauds agir comme un refuge. Visuellement, ils imitent la chaleur d\'un feu ou d\'un foyer sûr, calmant le sentiment d\'exposition.', reflection: 'Sentez-vous que vous avez un bouclier subtil qui vous protège maintenant ?' },
        { tag: 'nature', instruction: 'Observez la solidité des arbres. La nature survit à toutes les tempêtes en s\'ancrant profondément. Empruntez cette force visuelle.', reflection: 'Sentez-vous vos pieds plus ancrés au sol en ce moment ?' },
        { tag: 'vintage', instruction: 'Connectez-vous à la permanence. Les choses du passé qui perdurent nous rappellent que nous avons aussi la résilience pour survivre au temps.', reflection: 'Sentez-vous un peu plus de sécurité dans votre propre histoire ?' },
        { tag: 'botanical', instruction: 'Observez la croissance constante. Chaque plante trouve un moyen de chercher la lumière, même dans des terrains difficiles. Tout comme vous.', reflection: 'Ressentez-vous un éclair de confiance en vos propres ressources ?' },
        { tag: 'landscape', instruction: 'Cherchez refuge dans l\'immensité. Un environnement visuel vaste mais pacifique dit à votre subconscient qu\'il y a un espace sûr pour vous dans le monde.', reflection: 'Sentez-vous que le monde est un peu moins menaçant aujourd\'hui ?' },
        { tag: 'minimal', instruction: 'Reposez-vous dans le silence visuel. Quand vous vous sentez exposé, l\'excès d\'informations blesse. La simplicité vous embrasse sans poser de questions.', reflection: 'Ressentez-vous du soulagement à ne pas avoir à vous protéger de ce que vous voyez ?' },
        { tag: 'ocean', instruction: 'Laissez la profondeur de l\'eau vous soutenir. Visualisez que l\'océan est assez fort pour porter vos doutes à votre place.', reflection: 'Vous sentez-vous un peu plus soutenu(e) par la vie ?' },
        { tag: 'clouds', instruction: 'Contemplez la douceur. En l\'absence de bords tranchants dans les nuages, votre esprit détend ses barrières défensives instinctives.', reflection: 'Le besoin de vous protéger a-t-il un peu diminué ?' }
      ]},
      { id: 'overwhelmed', label: 'Surmené / Surstimulé', prescriptions: [
        { tag: 'minimal', instruction: 'Bienvenue dans le silence visuel. Votre charge cognitive est à sa limite ; permettez à l\'espace négatif de vider le cache de votre cerveau épuisé.', reflection: 'Sentez-vous qu\'il y a moins de "bruit" en compétition pour votre attention ?' },
        { tag: 'ocean', instruction: 'Cherchez le bruit blanc visuel. Le flux constant et ininterrompu de l\'eau lisse les pics de stress causés par la surinformation.', reflection: 'Sentez-vous que vos pensées vont un peu plus lentement ?' },
        { tag: 'clouds', instruction: 'Observez la faible saturation. Les couleurs douces du ciel réduisent le stimulus lumineux agressif des écrans, calmant l\'hypervigilance.', reflection: 'Ressentez-vous un soulagement de la pression derrière vos yeux ?' },
        { tag: 'space', instruction: 'Trouvez le calme dans le vaste vide. Le contraste entre les étoiles et l\'obscurité profonde réinitialise votre indicateur d\'urgence neurologique.', reflection: 'Votre esprit se sent-il un peu plus décongestionné ?' },
        { tag: 'macro', instruction: 'Filtrez le monde à une seule chose. Le cerveau submergé souffre du multitâche. Regarder un détail microscopique vous rend votre concentration singulière.', reflection: 'Était-ce un soulagement de n\'avoir à regarder qu\'un seul objet à la fois ?' },
        { tag: 'texture', instruction: 'Ancrez votre attention. Parcourir visuellement une texture répétitive bloque l\'entrée de nouveaux stimuli stressants.', reflection: 'Sentez-vous que votre esprit a cessé de s\'éparpiller un instant ?' },
        { tag: 'geometry', instruction: 'Reposez-vous dans la structure mathématique. Face au chaos externe, un modèle visuel parfait n\'exige aucune énergie pour être interprété.', reflection: 'Ce niveau d\'ordre est-il réconfortant ?' },
        { tag: 'landscape', instruction: 'Dézoomez. Vous êtes trop près de vos problèmes. Visualiser l\'éloignement détend mécaniquement le cristallin et l\'esprit.', reflection: 'Sentez-vous que votre vision périphérique s\'est détendue ?' },
        { tag: 'abstract', instruction: 'Décrochez la narration. N\'essayez pas de trouver des histoires à ces images, utilisez-les uniquement comme des taches de couleur pour reposer le langage.', reflection: 'Avez-vous réussi à faire taire votre voix intérieure une seconde ?' },
        { tag: 'botanical', instruction: 'Cherchez le vert monochromatique. Il est prouvé que s\'entourer visuellement d\'un seul ton naturel abaisse la fréquence cardiaque.', reflection: 'Sentez-vous que votre corps a relâché le mode "alerte" ?' }
      ]},
      { id: 'stuck', label: 'Bloqué / Stagnant', prescriptions: [
        { tag: 'abstract', instruction: 'Forcez de nouvelles voies neuronales. Regarder des formes qui n\'ont pas de logique prédéfinie stimule la pensée latérale et la créativité bloquée.', reflection: 'Quelles formes inattendues votre cerveau a-t-il découvertes ici ?' },
        { tag: 'neon', instruction: 'Allumez l\'étincelle dopaminergique. Les couleurs électriques très contrastées éveillent le système nerveux sympathique, le poussant à l\'action.', reflection: 'Ressentez-vous une légère augmentation de votre envie de faire quelque chose ?' },
        { tag: 'cities', instruction: 'Contaminez-vous par le flux. Observer l\'architecture et le mouvement humain réactive la perception que le monde avance.', reflection: 'Ressentez-vous un peu de cette énergie collective en vous ?' },
        { tag: 'colors', instruction: 'Brisez la monotonie mentale. Injecter des couleurs pures et variées secoue l\'habituation visuelle, premier pas pour sortir de la stagnation.', reflection: 'Votre perception du moment présent semble-t-elle plus vive ?' },
        { tag: 'art', instruction: 'Utilisez la perspective d\'un autre. Voir comment un artiste a résolu une toile vous rappelle qu\'il y a toujours plus d\'une façon de voir votre situation.', reflection: 'Avez-vous réussi à ressentir une véritable inspiration ?' },
        { tag: 'macro', instruction: 'Changez radicalement votre angle. Si vous êtes bloqué dans la vue d\'ensemble, plonger dans le minuscule réinitialise votre cadre de référence.', reflection: 'Avez-vous réalisé la complexité de ce qui est petit ?' },
        { tag: 'space', instruction: 'Contemplez l\'illimité. Se sentir coincé est une illusion d\'enfermement ; voir le cosmos vous rappelle que les possibilités sont infinies.', reflection: 'Sentez-vous que vos options se sont légèrement élargies ?' },
        { tag: 'clouds', instruction: 'Rappelez-vous le principe du mouvement perpétuel. Aucun nuage ne reste statique. Votre blocage est aussi un nuage temporaire qui passera.', reflection: 'Ressentez-vous un peu plus de fluidité dans votre attitude ?' },
        { tag: 'ocean', instruction: 'Syntonisez les courants. L\'eau ne stagne jamais, elle trouve toujours un lit. Imaginez que votre esprit copie cette même propriété fluide.', reflection: 'Sentez-vous que la résistance intérieure a un peu cédé ?' },
        { tag: 'geometry', instruction: 'Cherchez de nouveaux angles d\'intersection. Identifier comment les formes s\'unissent aide le cerveau à chercher des connexions créatives.', reflection: 'Avez-vous pu voir un motif qui a généré de la clarté pour vous ?' }
      ]}
    ]
  },
  ko: { 
    explore: "탐색", gallery: "갤러리", profile: "프로필", login: "로그인", email: "이메일", password: "비밀번호", 
    termsCheck: "이용약관 및 개인정보 보호정책에 동의합니다", viewHere: "여기서 보기", register: "가입하기", empty: "저장된 추억이 없습니다.", 
    deleteConfirm: "이 기억을 놓아주시겠습니까?", yes: "네", no: "아니요", phrase: "영감을 주는 문구", save: "저장", 
    newPass: "새 비밀번호", forgot: "비밀번호를 잊으셨나요?", recover: "비밀번호 찾기", newest: "최신순", 
    oldest: "오래된순", random: "무작위", installApp: "앱 설치", loginBtn: "로그인", 
    profileTagsHint: "프로필에서 원하는 영감 태그를 선택할 수 있습니다.",
    photoBy: "사진 작가:", onUnsplash: "on Pexels", download: "이미지 다운로드", deleteFromGallery: "갤러리에서 삭제",
    pauseTitle1: "휴식과 명상", pauseDesc1: "세상은 너무 시끄럽습니다.", 
    pauseText1: "Maeum은 당신의 은밀한 피난처입니다. 신경계를 위한 약으로 설계된 알고리즘 없는 공간입니다.",
    createRefuge: "나만의 피난처 만들기", pauseTitle2: "명상과 평온", pauseDesc2: "무한 스크롤과 존재감.",
    pauseText2: "주변 음악과 함께 무한 스크롤을 즐겨보세요. 시각적 아름다움을 감상하면 코르티솔 수치가 감소합니다.",
    pauseTitle3: "주머니 속의 성소", pauseDesc3: "당신의 주의력은 신성합니다.",
    pauseText3: "Maeum은 단순한 갤러리가 아닌 치료 도구입니다. 각 이미지는 당신을 현재에 정박시키기 위해 선택되었습니다.",
    pauseTitle4: "컬렉션", pauseDesc4: "빛의 컬렉션.",
    pauseText4: "내면과 공명하는 시각적 조각을 저장하는 것은 감정 조절과 감사의 닻 역할을 합니다.",
    pauseTitle5: "본질", pauseDesc5: "Maeum은 당신의 평화가 지킬 가치가 있는 영토임을 상기시켜줍니다.",
    viewGrid: "그리드 보기", yourName: "이름", yourTags: "태그 (최대 5개)", noTags: "선택된 태그 없음.",
    writeTag: "직접 태그 입력 (예: 고양이)", tagSuggestions: "추천 태그", phrasePlaceholder: "예: 흘러가게 두기... 놓아주기",
    appearance: "테마", light: "라이트", dark: "다크", language: "언어", newPassPlaceholder: "비밀번호 변경을 위해 입력하세요",
    saving: "저장 중...", signOut: "로그아웃", signingOut: "로그아웃 중...", followInstagram: "Instagram 팔로우",
    checkInbox: "이메일을 확인하세요", magicLinkText: "확인을 위한 매직 링크를 보냈습니다.",
    spamNotice: "*보이지 않는다면 스팸함을 확인해 주세요.", verifiedEnter: "확인 완료 → 입장",
    installTitle: "Maeum 설치", installDesc: "홈 화면에 시각적 휴식 공간을 추가하세요.",
    understood: "이해했습니다", noAccount: "계정이 없으신가요?", haveAccount: "이미 계정이 있으신가요?", backToLogin: "로그인으로 돌아가기",
    takeBreakTitleFree: "한도 도달", takeBreakDescFree: "충분한 아름다움을 감상하셨습니다. 계속 보시려면 한 시간 후에 다시 오시거나 프리미엄으로 업그레이드하세요.",
    takeBreakTitlePremium: "잠시 휴식", takeBreakDescPremium: "현실 세계에 머무를 시간입니다. 마음을 편안하게 하고 눈을 쉬게 하세요. 한 시간 후에 다시 오세요.",
    processing: "처리 중...", pricingTitle: "피난처 선택", pricingFree: "지속적인 휴식", pricingPremium: "깊은 피난처",
    freeBenefit1: "최대 5개의 영감 태그", freeBenefit2: "갤러리에 24개의 추억 저장", freeBenefit3: "시간당 3번의 의도적 휴식",
    premiumBenefit1: "최대 5개의 영감 태그", premiumBenefit2: "갤러리에 최대 300개의 추억 저장", premiumBenefit3: "시간당 5번의 의도적 휴식",
    monthly: "월 $3", yearly: "연 $33", subscribeBtn: "프리미엄으로 업그레이드", manageSubscription: "구독 관리", galleryFull: "갤러리 가득 참",
    galleryFullDescFree: "24개의 저장 한도에 도달했습니다. 최대 300개를 저장하려면 프리미엄으로 업그레이드하세요.", galleryFullDescPremium: "최대 300개 저장 한도에 도달했습니다.",
    tags: { nature: "자연", minimal: "미니멀", art: "예술", space: "우주", animals: "동물", cities: "도시", flowers: "꽃", colors: "색상", ocean: "바다", botanical: "식물", warm: "따뜻한", desert: "사막", abstract: "추상", vintage: "빈티지", neon: "네온", geometry: "기하학", texture: "질감", landscape: "풍경", clouds: "구름", macro: "매크로" },
    deleteAccount: "계정 영구 삭제", deleteAccountConfirm: "이 작업은 갤러리, 프로필을 삭제하고 활성 구독을 취소합니다. 취소할 수 없습니다. 확실합니까?",
    premiumActive: "프리미엄 활성", lifetimeActive: "평생 프리미엄", loginErrorTitle: "접근 거부", tryAgain: "다시 시도", invalidCredentials: "이메일 또는 비밀번호가 올바르지 않습니다.",
    
    startIntentionalBtnTop: "의도적인 휴식 시작하기",
    audioSuggest: "더 깊은 경험을 위해 오디오를 켜는 것을 권장합니다.",
    audioToggleOn: "오디오 켜기", audioToggleOff: "오디오 끄기",
    intentionalLimitReached: "당신은 충분한 휴식을 취했습니다. 현실에서 씨앗이 자라게 두세요. 한 시간 후에 다시 오세요.",
    limitReachedTitle: "신성한 휴식",

    checkinTitle: "지금 당신의 신경계는 어떤 상태인가요?",
    checkinSubtitle: "당신과 공명하는 상태를 선택하여 시각적 처방을 받으세요.",
    startPause: "의도적 휴식 시작",
    closeReflection: "닫기",
    therapyStates: [
      { id: 'anxious', label: '불안한 / 조급한', prescriptions: [
        { tag: 'minimal', instruction: '이 이미지들에서 빈 공간을 찾으세요. 불안한 뇌는 끊임없이 위협을 찾습니다. 여백을 관찰하는 것은 당신의 마음에 이곳이 안전하다는 것을 육체적으로 가르쳐줍니다.', reflection: '호흡이 조금 더 깊고 느려졌는지 느껴지나요?' },
        { tag: 'clouds', instruction: '광활함을 관찰하세요. 구름은 천천히 움직이고 노력 없이 변합니다. 느린 대상에 시선을 동기화하면 편도체의 긴박함이 비활성화됩니다.', reflection: '화면으로라도 위를 올려다볼 때 가슴의 어떤 감각이 변했나요?' },
        { tag: 'ocean', instruction: '밀려오고 밀려가는 파도의 리듬을 상상해 보세요. 물의 시각적 리듬은 심장 일관성을 유도하는 데 도움이 됩니다.', reflection: '맥박이 이미지와 조금 더 일치하는 느낌이 드나요?' },
        { tag: 'space', instruction: '우주의 규모를 숙고해 보세요. 별의 광활함 앞에서는 뇌가 당면한 문제의 긴급성을 상대화하여 코르티솔을 감소시킵니다.', reflection: '당신의 걱정이 지금은 조금 덜 무겁게 느껴지나요?' },
        { tag: 'macro', instruction: '아주 작은 세부 사항에 시선을 집중하세요. 눈을 가까이 초점 맞추게 함으로써 뇌가 위험을 찾아 주변을 스캔하는 것을 방지합니다.', reflection: '마음이 현재에 조금 더 정박한 느낌이 드나요?' },
        { tag: 'texture', instruction: '이 표면들의 촉감을 상상해 보세요. 감각운동 기억을 자극하면 불안한 에너지가 다시 육체로 내려앉습니다.', reflection: '몸의 어느 부분이 더 선명하게 느껴지나요?' },
        { tag: 'nature', instruction: '녹색 패턴을 흡수하세요. 자연의 프랙탈은 몇 분 안에 투쟁-도피 반응을 감소시키는 것으로 임상적으로 증명되었습니다.', reflection: '조금 더 상쾌하거나 내면의 고요함이 느껴지나요?' },
        { tag: 'landscape', instruction: '시야를 넓히세요. 불안은 터널 시야를 유발합니다. 수평적인 파노라마를 관찰하면 눈 근육과 교감 신경계가 이완됩니다.', reflection: '턱의 긴장이 부드러워졌나요?' },
        { tag: 'abstract', instruction: '논리를 찾지 말고 마음이 항해하게 두세요. 모든 것을 "이해"하려는 시도를 멈추면 과부하된 전두엽이 이완됩니다.', reflection: '지금 머릿속에 정신적 공간이 더 생겼나요?' },
        { tag: 'botanical', instruction: '나뭇잎의 유기적인 선을 따라가 보세요. 생물학적 곡선은 우리가 영양가 있고 안전한 환경에 있다는 것을 조상 대대로의 생물학에 신호합니다.', reflection: '어깨가 조금 더 느슨해진 것을 느끼나요?' }
      ]},
      { id: 'exhausted', label: '지친 / 무거운', prescriptions: [
        { tag: 'warm', instruction: '따뜻한 색조가 눈을 감싸게 하세요. 호박색은 저녁 빛을 모방하여 뇌에 이제 쉬어도 안전하다는 신호를 보냅니다.', reflection: '얼굴에 약간의 따뜻함이나 이완이 느껴지나요?' },
        { tag: 'colors', instruction: '생생한 색상이 시신경을 부드럽게 자극하게 두세요. 육체적 에너지를 요구하지 않고 깨우는 시각적 도파민 복용량입니다.', reflection: '시선이 조금 덜 무겁게 느껴지나요?' },
        { tag: 'flowers', instruction: '찰나의 섬세함을 관찰하세요. 꽃을 보는 것은 생명력과 세포 재생의 생물학적 연관성을 활성화합니다.', reflection: '가슴에서 어떤 작은 에너지의 불꽃을 알아차렸나요?' },
        { tag: 'vintage', instruction: '미적 향수에 푹 빠져보세요. 차분한 색조는 인지 처리를 덜 요구하여 뇌에 적극적인 휴식을 제공합니다.', reflection: '지금 마음이 덜 포화된 느낌인가요?' },
        { tag: 'art', instruction: '분석하지 말고 선과 색을 관찰하세요. 예술을 감상하는 것은 뇌의 수동적 기쁨 영역을 활성화하여 소모 없이 영양을 공급합니다.', reflection: '이 작품들을 보았을 때 어떤 부드러운 감정이 나타났나요?' },
        { tag: 'animals', instruction: '이 존재들의 눈빛과 교감하세요. 포유류는 상호 조절합니다. 휴식 중인 동물을 보면 그들의 에너지 절약 상태가 몸으로 전해집니다.', reflection: '호흡이 그들의 호흡과 더 비슷해졌나요?' },
        { tag: 'nature', instruction: '녹색이 필터 역할을 하게 두세요. 수동적 바이오필리아는 지향적 주의력 피로를 회복하는 데 도움이 됩니다.', reflection: '눈 뒤편이 조금 더 맑아진 느낌이 드나요?' },
        { tag: 'ocean', instruction: '물의 부력을 상상해 보세요. 물이 당신을 지탱하고 있다는 것을 시각적으로 느끼는 것은 지쳐서 지고 있는 육체적 무게를 놓는 데 도움이 됩니다.', reflection: '등이 1그램 더 가벼워진 느낌인가요?' },
        { tag: 'minimal', instruction: '적은 것이 약입니다. 화면의 시각적 요소 수를 줄이면 뇌의 처리 노력이 꺼집니다.', reflection: '처리할 것이 많지 않다는 사실에 안도감을 느끼나요?' },
        { tag: 'clouds', instruction: '하늘의 부드러움을 바라보세요. 단단한 모서리가 없기 때문에 눈과 마음이 에너지 비축량을 소모하지 않고 방황할 수 있습니다.', reflection: '정신적 밀도가 조금 흩어진 느낌이 드나요?' }
      ]},
      { id: 'sad', label: '슬픈 / 우울한', prescriptions: [
        { tag: 'botanical', instruction: '자연은 순환의 대가입니다. 식물을 관찰하는 것은 가을과 겨울이 지나면 생명력이 항상 돌아온다는 것을 생물학적으로 상기시켜 줍니다.', reflection: '내면에서 작은 수용의 공간을 느낄 수 있나요?' },
        { tag: 'ocean', instruction: '물은 품어주고 씻어냅니다. 오늘 마음에 품고 있는 그 무거움을 해류가 지탱하고 있다고 상상해 보세요.', reflection: '눈물이나 한숨을 흘려보내도 좋다는 허락을 받은 느낌인가요?' },
        { tag: 'flowers', instruction: '그들의 연약한 아름다움을 관찰하세요. 덧없는 것에서 아름다움을 인식하는 것은 우리 자신의 일시적인 감정을 포용하는 데 도움이 됩니다.', reflection: '자신에 대해 조금 더 부드러움이 느껴지나요?' },
        { tag: 'warm', instruction: '이 따뜻한 빛을 육체적인 포옹으로 시각화하세요. 색채 심리학은 이러한 색조를 억제 및 모성적 피난처와 연관시킵니다.', reflection: '가슴이 조금 더 따뜻해진 느낌인가요?' },
        { tag: 'vintage', instruction: '흐르는 시간의 아름다움을 관찰하세요. 오래된 것이 가치가 있다는 것을 이해하면 자신의 상처를 포용하는 데 도움이 됩니다.', reflection: '자신의 감정을 "고쳐야 한다"는 조급함이 줄어들었나요?' },
        { tag: 'art', instruction: '다른 누군가도 같은 것을 느끼고 그것을 색으로 바꿨습니다. 예술은 인간 고통의 스펙트럼에서 우리가 혼자가 아님을 보여줍니다.', reflection: '당신의 경험에서 조금 더 동반자가 생긴 느낌인가요?' },
        { tag: 'animals', instruction: '그들의 다정한 눈을 찾으세요. 동물의 존재는 판단 없는 사랑을 제공하여 감정적 고립감을 비활성화합니다.', reflection: '마음이 조금 더 부드러워진 느낌인가요?' },
        { tag: 'space', instruction: '별을 관찰하세요. 무한함 앞에서도 우리의 슬픔은 사라지지 않지만, 그것을 더 잘 호흡할 수 있게 해주는 관점을 얻게 됩니다.', reflection: '우주가 당신의 슬픔을 담을 만큼 크다고 느껴지나요?' },
        { tag: 'clouds', instruction: '구름은 가만히 있으려 하지 않고 그냥 지나갑니다. 슬픔을 붙잡지 말고 그와 같은 허용성으로 슬픔을 관찰해 보세요.', reflection: '감정이 조금 더 자유롭게 흐르는 느낌인가요?' },
        { tag: 'nature', instruction: '강한 뿌리와 줄기를 찾으세요. 깊은 뿌리내림을 시각화하면 감정이 당신을 압도하려 할 때 단단한 바닥을 제공합니다.', reflection: '발이 땅에 더 단단히 고정된 느낌인가요?' }
      ]},
      { id: 'apathetic', label: '무기력한 / 단절된', prescriptions: [
        { tag: 'macro', instruction: '세상이 무시하는 것을 강제로 눈으로 보게 하세요. 미세한 경이로움은 무감각해진 신경계를 재부팅하는 가장 빠른 방법입니다.', reflection: '호기심의 작은 불꽃이 돌아오는 것을 느끼나요?' },
        { tag: 'colors', instruction: '시각 피질에 강렬함을 주입하세요. 강한 대비는 감정적 무관심에 대한 부드러운 제세동기 역할을 합니다.', reflection: '생명 에너지가 조금 더 깨어난 느낌인가요?' },
        { tag: 'neon', instruction: '인공적인 빛이 정신적 안개를 걷어내게 하세요. 네온의 빛은 뇌에서 즉각적인 주의 반응을 자극합니다.', reflection: '마음이 조금 더 선명해진 느낌인가요?' },
        { tag: 'cities', instruction: '인류의 맥박을 관찰하세요. 멀리 떨어져 있다고 느끼더라도, 도시의 흐름을 바라보는 것은 사회적 연결의 거울 뉴런을 미묘하게 재활성화합니다.', reflection: '몸에 약간의 움직임 욕구가 느껴지나요?' },
        { tag: 'abstract', instruction: '아무것도 없는 곳에서 의미를 찾도록 마음에 도전하세요. 이것은 신경 가소성을 점화시켜 자동 조종 장치에서 벗어나게 합니다.', reflection: '어떤 예상치 못한 모양이나 아이디어가 주의를 끌었나요?' },
        { tag: 'art', instruction: '다른 사람들의 도발이 당신을 만지게 두세요. 표현주의 예술은 막혀 있는지 몰랐던 감정의 거울 역할을 할 수 있습니다.', reflection: '이것을 보면서 어떤 미묘한 감정을 식별할 수 있었나요?' },
        { tag: 'texture', instruction: '감각을 일깨우세요. 거칠음과 양각을 상상하는 것은 체성감각 피질을 자극하여 육체로 당신을 되돌려 보냅니다.', reflection: '이 순간 손이나 피부가 더 많이 느껴지나요?' },
        { tag: 'geometry', instruction: '선을 따라가 보세요. 눈으로 하여금 복잡한 패턴을 쫓게 하는 것은 안전한 방식으로 수동적 경계 상태를 "깨웁니다".', reflection: '조금 더 집중된 느낌인가요?' },
        { tag: 'animals', instruction: '그들에게서 움직임과 의도를 찾으세요. 1차적인 목표를 추구하는 생명체를 관찰하면 그들의 활력이 우리에게 미묘하게 전염됩니다.', reflection: '스트레칭을 하거나 움직이고 싶은 내면의 충동이 있나요?' },
        { tag: 'flowers', instruction: '배경과 대비되는 꽃을 찾으세요. 꽃의 응축된 활력은 생동감 넘치는 삶의 생물학적 알림 역할을 합니다.', reflection: '아름다운 세부 사항을 최소한 하나라도 연결할 수 있었나요?' }
      ]},
      { id: 'frustrated', label: '좌절한 / 화가 난', prescriptions: [
        { tag: 'geometry', instruction: '감정적 혼란이 있을 때, 뇌는 시각적 질서를 필요로 합니다. 대칭은 닻을 내릴 수 있는 예측 가능하고 안전한 패턴을 제공합니다.', reflection: '정신적 "소음"의 볼륨이 줄어든 것 같나요?' },
        { tag: 'landscape', instruction: '분노는 시야를 좁힙니다(터널 시야). 넓은 수평선을 바라보는 것은 생리적인 투쟁 반응을 기계적으로 비활성화합니다.', reflection: '주먹이나 턱의 긴장이 풀렸나요?' },
        { tag: 'ocean', instruction: '푸른 광활함과 동기화하세요. 색채 심리학은 차갑고 넓은 색조가 심박수를 직접적으로 낮춘다는 것을 증명합니다.', reflection: '가슴의 압박감이 감소한 것을 느끼나요?' },
        { tag: 'minimal', instruction: '주변의 마찰을 제거하세요. 분노는 많은 정신적 RAM을 소모합니다. 깨끗한 이미지를 관찰하면 뇌에서 처리 부하가 제거됩니다.', reflection: '생각 사이에 조금 더 공간이 생긴 느낌인가요?' },
        { tag: 'space', instruction: '문제의 규모를 변경하세요. 은하계를 관찰할 때, 편도체는 모든 것의 광활함에 비례하여 분노의 방아쇠를 상대화합니다.', reflection: '당신의 좌절감이 조금 더 멀거나 작게 느껴지나요?' },
        { tag: 'clouds', instruction: '경직성이 없음을 관찰하세요. 좌절은 막힌 에너지입니다. 유동적인 형태를 보는 것은 양보하는 것이 지는 것이 아님을 마음에게 일깨워 줍니다.', reflection: '조금이라도 놓아버린 신체의 일부가 있나요?' },
        { tag: 'abstract', instruction: '통제하거나 이해하려는 필요성을 놓으세요. 추상 미술은 항상 옳아야 하는 자아의 필요성을 디프로그래밍합니다.', reflection: '잠시라도 머릿속에서 싸우는 것을 멈출 수 있다고 느끼나요?' },
        { tag: 'nature', instruction: '대지색과 녹색을 찾으세요. 이들은 파충류 뇌가 자신을 방어할 필요가 없다는 것을 아는 생물학적으로 중립적인 환경입니다.', reflection: '호흡이 짧고 빠른 상태를 멈추었나요?' },
        { tag: 'texture', instruction: '거칠거나 차가운 표면을 만지는 것을 상상해 보세요. 상상된 온도나 질감을 바꾸면 대뇌 변연계에서 감각 피질로 혈류 방향이 바뀝니다.', reflection: '내부적으로 조금 더 "식은" 느낌인가요?' },
        { tag: 'macro', instruction: '초점을 다시 맞추세요. 강박적인 생각의 고리를 끊기 위해 곤충이나 물방울의 디테일을 분석하도록 마음을 강제하세요.', reflection: '이 몇 초 동안 당신을 화나게 한 원인을 잊을 수 있었나요?' }
      ]},
      { id: 'vulnerable', label: '취약한 / 불안정한', prescriptions: [
        { tag: 'animals', instruction: '자비로운 시선을 찾으세요. 포유류로서 우리는 무리 안에서 조절됩니다. 동물을 관찰하는 것은 보답을 요구하지 않는 애정의 안도감을 제공합니다.', reflection: '배에 보호하는 듯한 따뜻함이 조금 더 느껴지나요?' },
        { tag: 'art', instruction: '인간의 역사를 관찰하세요. 예술은 셀 수 없이 많은 사람들이 불확실성을 건너 그 속에서 아름다움을 창조했음을 상기시켜 줍니다.', reflection: '자신의 연약함을 조금 더 잘 지탱할 수 있을 것 같나요?' },
        { tag: 'warm', instruction: '따뜻한 색조가 피난처 역할을 하게 하세요. 시각적으로 이들은 안전한 난로나 가정의 따뜻함을 모방하여 노출된 느낌을 진정시킵니다.', reflection: '이제 당신을 보호하는 미묘한 방패가 있는 것 같나요?' },
        { tag: 'nature', instruction: '나무의 견고함을 관찰하세요. 자연은 도망치지 않고 깊이 뿌리내려 모든 폭풍우에서 살아남습니다. 그 시각적 힘을 빌리세요.', reflection: '지금 발이 바닥에 더 단단히 고정된 느낌인가요?' },
        { tag: 'vintage', instruction: '영속성과 연결하세요. 견뎌내는 과거의 것들은 우리 역시 시간을 이겨낼 회복력이 있음을 상기시켜 줍니다.', reflection: '당신 자신의 이야기에 대해 조금 더 안심이 되나요?' },
        { tag: 'botanical', instruction: '끊임없는 성장을 관찰하세요. 모든 식물은 거친 지형에서도 빛을 찾는 방법을 찾아냅니다. 당신처럼요.', reflection: '자신의 자원에 대한 약간의 자신감이 번뜩이는 것을 느끼나요?' },
        { tag: 'landscape', instruction: '광활함 속에서 피난처를 찾으세요. 넓지만 평화로운 시각적 환경은 무의식에 세상에 당신을 위한 안전한 공간이 있음을 알려줍니다.', reflection: '오늘 세상이 조금 덜 위협적으로 느껴지나요?' },
        { tag: 'minimal', instruction: '시각적 침묵 속에서 쉬세요. 노출되었다고 느낄 때 너무 많은 정보는 상처를 줍니다. 단순함은 질문 없이 당신을 안아줍니다.', reflection: '보는 것으로부터 자신을 방어할 필요가 없어 안도감이 드나요?' },
        { tag: 'ocean', instruction: '물의 깊이가 당신을 지탱하게 하세요. 바다가 당신을 대신해 당신의 의심을 짊어질 만큼 충분히 강하다고 상상하세요.', reflection: '삶이 당신을 조금 더 지탱해 주는 느낌인가요?' },
        { tag: 'clouds', instruction: '부드러움을 명상하세요. 구름에는 날카로운 모서리가 없기 때문에 마음은 본능적인 방어 장벽을 완화합니다.', reflection: '자신을 보호해야 할 필요성이 조금 줄어들었나요?' }
      ]},
      { id: 'overwhelmed', label: '압도된 / 과자극된', prescriptions: [
        { tag: 'minimal', instruction: '시각적 침묵에 오신 것을 환영합니다. 당신의 인지 부하는 한계에 다달았습니다. 여백이 지친 뇌의 캐시를 비우도록 허용하세요.', reflection: '당신의 주의력을 다투는 "소음"이 줄어든 것 같나요?' },
        { tag: 'ocean', instruction: '시각적 백색소음을 찾으세요. 끊임없고 방해받지 않는 물의 흐름은 과잉 정보로 인한 스트레스의 피크를 다듬어 줍니다.', reflection: '생각이 조금 더 느려지는 것을 느끼나요?' },
        { tag: 'clouds', instruction: '낮은 채도를 관찰하세요. 하늘의 부드러운 색상은 화면의 공격적인 빛 자극을 줄여 과각성을 진정시킵니다.', reflection: '눈 뒤의 압박감이 완화되는 것을 느끼나요?' },
        { tag: 'space', instruction: '광활한 텅 빔 속에서 평온을 찾으세요. 별과 깊은 어둠의 대비는 신경학적 긴박감 측정기를 재설정합니다.', reflection: '마음의 울혈이 조금 풀린 느낌인가요?' },
        { tag: 'macro', instruction: '세상을 단 하나로 필터링하세요. 압도된 뇌는 멀티태스킹으로 고통받습니다. 미세한 디테일을 보는 것은 단일한 초점을 회복시켜 줍니다.', reflection: '한 번에 하나의 대상만 볼 수 있어서 안도감이 들었나요?' },
        { tag: 'texture', instruction: '주의를 닻 내리세요. 반복적인 질감을 시각적으로 훑어보는 것은 스트레스를 주는 새로운 자극의 입력을 차단합니다.', reflection: '순간적으로 마음이 흩어지는 것을 멈춘 느낌인가요?' },
        { tag: 'geometry', instruction: '수학적 구조 안에서 쉬세요. 외부의 혼란 앞에서도, 완벽한 시각적 패턴은 해석하는 데 에너지를 요구하지 않습니다.', reflection: '이 정도의 질서가 위안이 되나요?' },
        { tag: 'landscape', instruction: '줌 아웃 하세요. 당신은 당신의 문제에 너무 가까이 있습니다. 멀리 있는 것을 시각화하는 것은 기계적으로 수정체와 마음을 이완시킵니다.', reflection: '주변 시야가 이완된 것을 느끼나요?' },
        { tag: 'abstract', instruction: '서사에서 벗어나세요. 이 이미지들에서 이야기를 찾으려 하지 말고, 언어의 휴식을 위한 색깔 패치로만 사용하세요.', reflection: '잠시 내면의 목소리를 잠재울 수 있었나요?' },
        { tag: 'botanical', instruction: '단색의 녹색을 찾으세요. 단일한 자연의 색으로 시각을 둘러싸는 것이 심박수와 혈압을 낮춘다는 것이 증명되었습니다.', reflection: '몸이 "경계" 모드를 놓은 것을 느끼나요?' }
      ]},
      { id: 'stuck', label: '막힌 / 정체된', prescriptions: [
        { tag: 'abstract', instruction: '새로운 신경 경로를 강제하세요. 사전 정의된 논리가 없는 형태를 보는 것은 수평적 사고와 막힌 창의성을 자극합니다.', reflection: '뇌가 여기서 어떤 예상치 못한 형태나 인물을 발견했나요?' },
        { tag: 'neon', instruction: '도파민의 불꽃을 점화하세요. 대비가 높은 강렬한 색상은 교감 신경계를 깨워 행동을 재촉합니다.', reflection: '무엇인가 하고 싶은 욕구가 조금 증가한 것을 느끼나요?' },
        { tag: 'cities', instruction: '흐름에 전염되세요. 건축물과 인간의 움직임을 관찰하면 세상이 전진하며 당신을 데려가고 있다는 인식을 재활성화합니다.', reflection: '내면에서 그 집단적 에너지가 조금 느껴지나요?' },
        { tag: 'colors', instruction: '정신적 단조로움을 깨세요. 순수하고 다양한 색상을 주입하면 시각적 습관화가 흔들리며, 이는 정체에서 벗어나는 첫 걸음입니다.', reflection: '현재 순간에 대한 인식이 더 생생하게 느껴지나요?' },
        { tag: 'art', instruction: '다른 사람의 관점을 사용하세요. 예술가가 캔버스를 어떻게 해결했는지 보는 것은 당신의 상황을 보는 데 항상 둘 이상의 방법이 있음을 상기시켜 줍니다.', reflection: '진정한 영감이나 경외감을 느낄 수 있었나요?' },
        { tag: 'macro', instruction: '각도를 극적으로 변경하세요. 큰 그림에서 막혀 있다면, 아주 작은 것에 몰입하는 것은 인지적 참조 틀을 재설정합니다.', reflection: '작은 것 속에 얼마나 많은 복잡성이 있는지 깨달았나요?' },
        { tag: 'space', instruction: '무한함을 숙고하세요. 갇힌 느낌은 갇혀 있다는 환상입니다. 우주를 보는 것은 가능성이 말 그대로 무한하다는 것을 상기시켜 줍니다.', reflection: '당신의 선택지가 약간 확장된 느낌인가요?' },
        { tag: 'clouds', instruction: '영구 운동의 원리를 기억하세요. 어떤 구름도 정지해 있지 않습니다. 당신의 막힘 또한 지나갈 일시적인 구름입니다.', reflection: '태도에 약간의 유동성이 더해진 느낌인가요?' },
        { tag: 'ocean', instruction: '해류에 주파수를 맞추세요. 물은 결코 정체되지 않으며 항상 길을 찾습니다. 당신의 마음이 그와 같은 유동적인 속성을 모방한다고 상상하세요.', reflection: '내면의 저항이 조금 양보한 느낌인가요?' },
        { tag: 'geometry', instruction: '교차하는 새로운 각도를 찾으세요. 모양이 시각적으로 어떻게 결합되는지 파악하는 것은 뇌가 당신의 막힌 부분에서 창의적인 연결을 찾도록 돕습니다.', reflection: '당신에게 명확성을 가져다주는 어떤 패턴을 볼 수 있었나요?' }
      ]}
    ]
  }
};

const AVAILABLE_TAGS = ["nature", "minimal", "art", "space", "animals", "cities", "flowers", "colors", "ocean", "botanical", "warm", "desert", "abstract", "vintage", "neon", "geometry", "texture", "landscape", "clouds", "macro"];

// Configuración de límites
const LIMITS = {
  free: { apiCalls: 15, gallery: 24, intentional: 3 },
  premium: { apiCalls: 50, gallery: 300, intentional: 5 },
  lifetime: { apiCalls: 50, gallery: 300, intentional: 5 }
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [userPlan, setUserPlan] = useState("free"); 
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [appMessage, setAppMessage] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
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
  const [lang, setLang] = useState("es"); 
  
  const [currentTab, setCurrentTab] = useState("explore"); 
  const [galleryView, setGalleryView] = useState("grid");
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [activeMenuPhotoId, setActiveMenuPhotoId] = useState(null); 
  const [activeInfoId, setActiveInfoId] = useState(null); 
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState("Minimalista");
  const [feedPhotos, setFeedPhotos] = useState([]);
  const [galleryLimit, setGalleryLimit] = useState(12);
  
  const seenIds = useRef(new Set()); 
  const loadingRef = useRef(false);

  // Estados: Check-in Somático y Pausa Intencional
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [activePrescription, setActivePrescription] = useState(null);
  const [showReflection, setShowReflection] = useState(false);
  const [isIntentionalPauseActive, setIsIntentionalPauseActive] = useState(false);

  const isDark = theme === "dark";
  const t = dict[lang] || dict.es;

  const currentLimits = LIMITS[userPlan] || LIMITS.free;

  const checkApiLimit = () => {
    const now = Date.now();
    const storedData = JSON.parse(localStorage.getItem('maeum_api_tracker') || '{"count": 0, "timestamp": 0}');
    if (now - storedData.timestamp > 3600000) {
      localStorage.setItem('maeum_api_tracker', JSON.stringify({ count: 1, timestamp: now }));
      return true;
    }
    if (storedData.count >= currentLimits.apiCalls) return false;
    localStorage.setItem('maeum_api_tracker', JSON.stringify({ count: storedData.count + 1, timestamp: storedData.timestamp }));
    return true;
  };

  const checkIntentionalLimit = () => {
    const now = Date.now();
    const storedData = JSON.parse(localStorage.getItem('maeum_intentional_tracker') || '{"count": 0, "timestamp": 0}');
    if (now - storedData.timestamp > 3600000) {
      localStorage.setItem('maeum_intentional_tracker', JSON.stringify({ count: 1, timestamp: now }));
      return true;
    }
    if (storedData.count >= currentLimits.intentional) return false;
    localStorage.setItem('maeum_intentional_tracker', JSON.stringify({ count: storedData.count + 1, timestamp: storedData.timestamp }));
    return true;
  };

  const normalizedLikes = useMemo(() => {
    let arr = likes.map(p => ({
      id: p.id, url: p.url, title: p.title || "Destello", authorName: p.authorName || "Autor",
      authorUsername: p.authorUsername || "unsplash", downloadLocation: p.downloadLocation || null
    }));
    if (sortOrder === "newest") arr = arr.reverse();
    if (sortOrder === "random") arr = arr.sort(() => Math.random() - 0.5);
    return arr.slice(0, currentLimits.gallery);
  }, [likes, sortOrder, currentLimits.gallery]);

  const displayedGallery = useMemo(() => {
    return normalizedLikes.slice(0, galleryLimit);
  }, [normalizedLikes, galleryLimit]);

  useEffect(() => {
    const savedLang = localStorage.getItem('maeum-lang');
    if (savedLang && dict[savedLang]) setLang(savedLang);
    else {
      const browserLang = typeof window !== 'undefined' ? (navigator.language || navigator.userLanguage || '').slice(0, 2) : 'es';
      if (dict[browserLang]) { setLang(browserLang); localStorage.setItem('maeum-lang', browserLang); } 
      else setLang('es');
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
        setUser(null); setLikes([]); setSelectedTags([]); setProfileName(""); setUserPlan("free");
      }
    });

    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(console.error);
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(checkStandalone);
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);

    const handleBeforeInstallPrompt = (e) => { e.preventDefault(); setDeferredPrompt(e); };
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
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else setShowInstallGuide(true);
  };

  const loadUserData = async (u) => {
    setUser(u);
    if (u.user_metadata?.phrase) setUserPhrase(u.user_metadata.phrase);
    if (u.user_metadata?.full_name) setProfileName(u.user_metadata.full_name);
    
    const { data: profileData } = await supabase.from('profiles').select('plan').eq('id', u.id).single();
    if (profileData && profileData.plan) setUserPlan(profileData.plan);
    else setUserPlan("free");
    
    if (u.user_metadata?.theme) { setTheme(u.user_metadata.theme); localStorage.setItem('maeum-theme', u.user_metadata.theme); }
    if (u.user_metadata?.lang && dict[u.user_metadata.lang]) { setLang(u.user_metadata.lang); localStorage.setItem('maeum-lang', u.user_metadata.lang); }
    if (u.user_metadata?.tags) setSelectedTags(u.user_metadata.tags); else setSelectedTags([]);

    const { data, error } = await supabase.from('user_likes').select('*').eq('user_id', u.id);
    if (!error && data) {
      setLikes(data.map(item => ({
        id: item.photo_id, url: item.photo_url, title: item.title, authorName: item.author_name,
        authorUsername: item.author_username, downloadLocation: item.download_location
      })));
    }
  };

  const changeTheme = async (newTheme) => {
    setTheme(newTheme); localStorage.setItem('maeum-theme', newTheme);
    if (user) supabase.auth.updateUser({ data: { theme: newTheme } }).catch(console.error);
  };

  const changeLang = async (newLang) => {
    setLang(newLang); localStorage.setItem('maeum-lang', newLang);
    if (user) supabase.auth.updateUser({ data: { lang: newLang } }).catch(console.error);
  };

  const loadMorePhotos = async () => {
    if (loadingRef.current || isIntentionalPauseActive) return; 
    if (!checkApiLimit()) {
      setAppMessage({ title: userPlan === 'free' ? t.takeBreakTitleFree : t.takeBreakTitlePremium, text: userPlan === 'free' ? t.takeBreakDescFree : t.takeBreakDescPremium });
      return;
    }

    loadingRef.current = true;
    try {
      const querySearch = activeCategory || (selectedTags.length > 0 ? selectedTags.join(",") : "Minimalista");
      const randomPage = Math.floor(Math.random() * 5) + 1;
      
      const res = await fetch(`https://api.pexels.com/v1/search?query=${querySearch}&per_page=15&page=${randomPage}`, {
        headers: { Authorization: process.env.NEXT_PUBLIC_PEXELS_KEY }
      });
      
      if (!res.ok) {
        if (res.status === 403 || res.status === 429) {
          setAppMessage({ title: "Pausa obligatoria", text: "El mundo requiere tu presencia. La API necesita un respiro. Vuelve pronto." });
        }
        loadingRef.current = false;
        return;
      }

      const data = await res.json();
      const forbiddenWords = ['people', 'person', 'man', 'woman', 'portrait', 'face', 'model', 'child', 'boy', 'girl', 'computer', 'laptop', 'phone', 'screen', 'car', 'vehicle', 'traffic', 'crowd', 'office', 'desk'];

      if (data.photos && Array.isArray(data.photos)) {
        const newPhotos = data.photos
          .filter(img => {
            const altText = (img.alt || "").toLowerCase();
            return !forbiddenWords.some(word => altText.includes(word));
          })
          .filter(img => !seenIds.current.has(img.id.toString()))
          .map(img => {
            seenIds.current.add(img.id.toString());
            return { 
              id: img.id.toString(), url: img.src.large2x || img.src.large, title: img.alt || "Destello",
              authorName: img.photographer || "Pexels", authorUsername: img.photographer_url || "https://www.pexels.com", downloadLocation: null
            };
          });
        setFeedPhotos(prev => [...prev, ...newPhotos]);
      }
    } catch (error) { console.log("Cargando..."); }
    loadingRef.current = false;
  };

  useEffect(() => {
    if (!isIntentionalPauseActive) { setFeedPhotos([]); seenIds.current.clear(); loadMorePhotos(); }
  }, [activeCategory]);

  useEffect(() => { if (currentTab === "gallery") setGalleryLimit(12); }, [currentTab]);

  useEffect(() => {
    let isScrolling = false;
    const handleScroll = () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
            if (currentTab === "explore" && !isIntentionalPauseActive) {
              if (!user) { if (feedPhotos.length > 0) setShowAuthModal(true); } 
              else loadMorePhotos();
            } else if (currentTab === "gallery") {
               setGalleryLimit(prev => prev + 12);
            }
          }
          if (currentTab === "explore" && isIntentionalPauseActive && activePrescription && window.scrollY > 2000 && !showReflection) {
            setShowReflection(true);
          }
          isScrolling = false;
        });
        isScrolling = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [user, currentTab, feedPhotos.length, isIntentionalPauseActive, activePrescription, showReflection]);

  const handleAuth = async (e) => {
    e.preventDefault(); setIsAuthenticating(true);
    if (isForgotPassword) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
      if (error) setAppMessage({ title: "Error", text: error.message });
      else { setAppMessage({ title: "Email", text: t.magicLinkText }); setShowAuthModal(false); }
      setIsAuthenticating(false); return;
    }
    if (!isLogin && !acceptedTerms) { setAppMessage({ title: "Aviso", text: t.termsCheck }); setIsAuthenticating(false); return; }
    
    let authResult;
    const currentTheme = localStorage.getItem('maeum-theme') || "light";
    const currentLang = localStorage.getItem('maeum-lang') || "es";
    
    if (isLogin) authResult = await supabase.auth.signInWithPassword({ email, password });
    else authResult = await supabase.auth.signUp({ email, password, options: { data: { full_name: name, phrase: "", tags: [], theme: currentTheme, lang: currentLang, plan: "free" } } });
    
    if (authResult.error) {
      if (isLogin) {
        setShowAuthModal(false);
        const isInvalid = authResult.error.message.toLowerCase().includes("invalid");
        setLoginError(isInvalid ? t.invalidCredentials : authResult.error.message);
      } else setAppMessage({ title: "Error", text: authResult.error.message });
    } else {
      if (!isLogin && authResult.data?.user && !authResult.data?.session) { setIsEmailSent(true); setShowAuthModal(false); } 
      else setShowAuthModal(false);
    }
    setIsAuthenticating(false);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try { await supabase.auth.signOut(); } catch(e) { console.warn("Limpieza", e); }
    for (let key in localStorage) { if (key.startsWith('sb-')) localStorage.removeItem(key); }
    setUser(null); setLikes([]); setSelectedTags([]); setProfileName(""); setUserPlan("free"); setCurrentTab("explore"); setIsSigningOut(false);
  };

  const executeDeleteAccount = async () => {
    setShowDeleteConfirm(false); setIsSigningOut(true);
    try {
      await fetch('/api/delete-account', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id }) });
      await supabase.auth.signOut();
      for (let key in localStorage) { if (key.startsWith('sb-')) localStorage.removeItem(key); }
      setUser(null); setLikes([]); setSelectedTags([]); setProfileName(""); setUserPlan("free"); setCurrentTab("explore");
    } catch (error) { setAppMessage({ title: "Error", text: "Problema al eliminar." }); } 
    finally { setIsSigningOut(false); }
  };

  const toggleLike = async (photo, e) => {
    if (e) e.preventDefault();
    if (!user) return setShowAuthModal(true);
    const exists = likes.find(p => p.id === photo.id);
    if (exists) {
      setLikes(likes.filter(p => p.id !== photo.id));
      await supabase.from('user_likes').delete().eq('user_id', user.id).eq('photo_id', photo.id);
    } else {
      if (likes.length >= currentLimits.gallery) {
        setAppMessage({ title: t.galleryFull, text: userPlan === 'free' ? t.galleryFullDescFree : t.galleryFullDescPremium }); return;
      }
      const newRecord = { user_id: user.id, photo_id: photo.id, photo_url: photo.url, title: photo.title, author_name: photo.authorName, author_username: photo.authorUsername, download_location: photo.downloadLocation };
      setLikes(prev => [...prev, photo]);
      const { error } = await supabase.from('user_likes').insert([newRecord]);
      if (error) { setAppMessage({ title: "Error", text: "Error base de datos." }); setLikes(likes); }
    }
  };

  const confirmDelete = async (id) => {
    setLikes(likes.filter(p => p.id !== id)); setPhotoToDelete(null); setActiveMenuPhotoId(null);
    if (user) await supabase.from('user_likes').delete().eq('user_id', user.id).eq('photo_id', id);
  };

  const triggerUnsplashDownload = async (downloadLocation) => {
    if (!downloadLocation) return;
    try { await fetch(`${downloadLocation}?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_KEY}`); } catch (err) {}
  };

  const downloadImage = async (url, id, downloadLocation) => {
    try {
      if (downloadLocation) triggerUnsplashDownload(downloadLocation);
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], `maeum-${id}.jpg`, { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Maeum', text: 'Destello de Maeum' });
      } else {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl; a.download = `maeum-${id}.jpg`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); window.URL.revokeObjectURL(blobUrl);
      }
    } catch (err) { window.open(url, '_blank'); }
  };

  const saveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const updates = { data: { full_name: profileName, phrase: userPhrase } };
      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      if (newPassword) {
        const { error: passError } = await supabase.auth.updateUser({ password: newPassword });
        if (passError) throw passError; setNewPassword("");
      }
      setAppMessage({ title: "Info", text: t.save + " ✓" });
    } catch (error) { setAppMessage({ title: "Error", text: error.message }); } 
    finally { setIsSavingProfile(false); }
  };

  const toggleTag = async (tag) => {
    let newTags = [...selectedTags];
    if (newTags.includes(tag)) newTags = newTags.filter(t => t !== tag);
    else { if (newTags.length < 5) newTags.push(tag); }
    setSelectedTags(newTags);
    if (user) await supabase.auth.updateUser({ data: { tags: newTags } }).catch(console.error);
  };

  const handleAddCustomTag = async (e) => {
    e.preventDefault(); const tag = customTag.trim().toLowerCase();
    if (!tag) return;
    if (selectedTags.includes(tag)) { setCustomTag(""); return; }
    if (selectedTags.length >= 5) { setAppMessage({ title: "Info", text: "Max 5 tags." }); return; }
    const newTags = [...selectedTags, tag]; setSelectedTags(newTags); setCustomTag("");
    if (user) await supabase.auth.updateUser({ data: { tags: newTags } }).catch(console.error);
  };

  const toggleAudio = () => {
    if (isPlaying) audioRef.current.pause(); else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleSelectState = (stateObj) => {
    const randIndex = Math.floor(Math.random() * stateObj.prescriptions.length);
    const prescription = stateObj.prescriptions[randIndex];
    setActivePrescription(prescription);
    
    if (user) {
      supabase.from('therapy_logs').insert([{ 
        user_id: user.id, state_selected: stateObj.id, tag_recommended: prescription.tag 
      }]).catch(e => console.log(e));
    }
  };

  const startTherapySession = async () => {
    if (!user) {
      setShowCheckInModal(false);
      setShowAuthModal(true);
      return;
    }
    if (!checkIntentionalLimit()) {
      setShowCheckInModal(false);
      setAppMessage({ title: t.limitReachedTitle, text: t.intentionalLimitReached });
      return;
    }

    setShowCheckInModal(false);
    setShowReflection(false);
    
    if (activePrescription) {
      setIsIntentionalPauseActive(true);
      setActiveCategory(activePrescription.tag);
      setFeedPhotos([]); 
      seenIds.current.clear();
      
      loadingRef.current = true;
      try {
        const randomPage = Math.floor(Math.random() * 5) + 1;
        const res = await fetch(`https://api.pexels.com/v1/search?query=${activePrescription.tag}&per_page=12&page=${randomPage}`, {
          headers: { Authorization: process.env.NEXT_PUBLIC_PEXELS_KEY }
        });
        
        if (res.ok) {
          const data = await res.json();
          const forbiddenWords = ['people', 'person', 'man', 'woman', 'portrait', 'face', 'model', 'child', 'boy', 'girl', 'computer', 'laptop', 'phone', 'screen', 'car', 'vehicle', 'traffic', 'crowd', 'office', 'desk'];
          if (data.photos && Array.isArray(data.photos)) {
            const newPhotos = data.photos
              .filter(img => {
                const altText = (img.alt || "").toLowerCase();
                return !forbiddenWords.some(word => altText.includes(word));
              })
              .map(img => {
                return { 
                  id: img.id.toString(), url: img.src.large2x || img.src.large, title: img.alt || "Destello",
                  authorName: img.photographer || "Pexels", authorUsername: img.photographer_url || "https://www.pexels.com", downloadLocation: null
                };
              });
            setFeedPhotos(newPhotos.slice(0, 12)); 
          }
        }
      } catch (error) { console.log(error); }
      loadingRef.current = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const closeTherapySession = () => {
    setIsIntentionalPauseActive(false);
    setActivePrescription(null);
    setShowReflection(false);
    setActiveCategory(selectedTags.length > 0 ? selectedTags[0] : "Minimalista");
  };

  return (
    <main className={`min-h-screen pb-24 font-light transition-colors duration-500 ${isDark ? 'bg-neutral-950 text-neutral-300' : 'bg-white text-neutral-800'}`}>
      
      <header className={`sticky top-0 z-40 border-b flex flex-col transition-all duration-500 backdrop-blur-md ${isDark ? 'bg-neutral-950/90 border-neutral-900' : 'bg-white/90 border-neutral-100'}`}>
        <div className="py-6 px-6 flex justify-between items-center">
          <h1 className={`text-xl tracking-widest uppercase font-normal ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>Maeum</h1>
          <div className="flex items-center gap-3 sm:gap-6">
            
            <button 
              onClick={() => { setActivePrescription(null); setShowCheckInModal(true); }}
              className={`p-2 rounded-full transition-all active:scale-95 ${isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-400 hover:text-neutral-900'}`}
              title="Somatic Check-in"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {!isStandalone && (
              <button onClick={handleInstallClick} className={`text-[10px] sm:text-xs tracking-widest uppercase border px-3 py-1.5 rounded-full transition-colors active:scale-95 ${isDark ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white' : 'border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white'}`}>
                {t.installApp}
              </button>
            )}

            {!user && (
              <button onClick={() => { setIsLogin(true); setIsForgotPassword(false); setShowAuthModal(true); }} className={`text-[10px] sm:text-xs tracking-widest uppercase transition-colors active:scale-95 ${isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-900'}`}>
                {t.loginBtn}
              </button>
            )}
            
            <button onClick={toggleAudio} className={`p-2 rounded-full transition-all active:scale-95 ${isPlaying ? (isDark ? 'bg-neutral-800 text-white' : 'bg-neutral-900 text-white') : (isDark ? 'bg-neutral-900 text-neutral-600' : 'bg-neutral-100 text-neutral-400')}`}>
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zm12-3c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zM9 10l12-3"/></svg>
            </button>
          </div>
        </div>

        {currentTab === "explore" && !isIntentionalPauseActive && (
          <div className="flex justify-center w-full bg-transparent pt-3 pb-1 border-b border-transparent">
            <button 
              onClick={() => { setActivePrescription(null); setShowCheckInModal(true); }}
              className={`px-6 py-2 text-[10px] uppercase tracking-[0.2em] rounded-full transition-colors ${isDark ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
            >
              {t.startIntentionalBtnTop}
            </button>
          </div>
        )}

        {currentTab === "explore" && !isIntentionalPauseActive && (
          <div className="flex overflow-x-auto gap-4 py-4 px-6 scrollbar-hide snap-x" style={{ willChange: "transform" }}>
            {selectedTags.length === 0 ? (
              <p className={`text-xs italic px-2 py-1.5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.profileTagsHint}</p>
            ) : (
              selectedTags.map(cat => (
                <button key={cat} onClick={() => { setActiveCategory(cat); setActivePrescription(null); setShowReflection(false); }} className={`snap-center whitespace-nowrap px-4 py-1.5 text-xs rounded-full border transition-all active:scale-95 ${activeCategory === cat ? (isDark ? 'border-neutral-300 text-neutral-100 bg-neutral-900' : 'border-neutral-900 text-neutral-900') : (isDark ? 'border-neutral-800 text-neutral-500' : 'border-neutral-200 text-neutral-400')}`}>
                  {t.tags?.[cat] ? t.tags[cat].toUpperCase() : cat.toUpperCase()}
                </button>
              ))
            )}
          </div>
        )}

        {currentTab === "explore" && isIntentionalPauseActive && activePrescription && (
          <div className="py-4 px-6 flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-transparent">
            <p className={`text-xs uppercase tracking-widest ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Medicina Visual: {t.tags?.[activePrescription.tag] || activePrescription.tag}</p>
            <button onClick={closeTherapySession} className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100">✕ Cerrar</button>
          </div>
        )}
      </header>

      {currentTab === "explore" && (
        <section className="max-w-6xl mx-auto p-4 mt-4 relative">
          
          {showReflection && activePrescription && isIntentionalPauseActive && (
            <div className="fixed bottom-28 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[28rem] z-30 animate-fade-in-up">
              <div className={`backdrop-blur-xl p-6 rounded-2xl shadow-2xl border flex flex-col gap-4 relative ${isDark ? 'bg-neutral-900/90 border-neutral-800 text-neutral-200' : 'bg-white/90 border-neutral-100 text-neutral-800'}`}>
                <button onClick={() => setShowReflection(false)} className="absolute top-4 right-4 opacity-50 hover:opacity-100 text-xs">✕</button>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                  <p className="text-[10px] uppercase tracking-widest opacity-60">Maeum</p>
                </div>
                <p className="text-sm font-light leading-relaxed">{activePrescription.reflection}</p>
                <button onClick={() => setShowReflection(false)} className={`mt-2 text-[10px] uppercase tracking-widest py-2 rounded-md transition-colors ${isDark ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-neutral-100 hover:bg-neutral-200'}`}>
                  {t.closeReflection || "Cerrar"}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {feedPhotos.map((photo, index) => {
              const isLiked = likes.some(p => p.id === photo.id);
              return (
                <Fragment key={photo.id}>
                  
                  {!user && !isIntentionalPauseActive && index === 0 && (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 py-20 px-6 my-4 flex justify-center">
                      <div className={`max-w-2xl w-full flex flex-col items-center text-center p-8 sm:p-12 bg-gradient-to-b from-transparent to-transparent border-y ${isDark ? 'via-neutral-900/50 border-neutral-900' : 'via-neutral-50/50 border-neutral-100'}`}>
                        <span className={`text-[10px] uppercase tracking-[0.3em] mb-6 font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.pauseTitle1}</span>
                        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-light mb-6 leading-tight tracking-tight ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{t.pauseDesc1}</h2>
                        <p className={`font-light text-[15px] sm:text-base leading-relaxed max-w-lg mb-10 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{t.pauseText1}</p>
                        <button onClick={() => { setIsLogin(false); setIsForgotPassword(false); setShowAuthModal(true); }} className={`group relative px-8 py-4 text-[10px] sm:text-xs uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 ${isDark ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}>
                          <span className="relative z-10 flex items-center gap-3">{t.createRefuge} <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg></span>
                        </button>
                      </div>
                    </div>
                  )}

                  {!user && !isIntentionalPauseActive && index === 1 && (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 py-20 px-6 my-4 flex justify-center">
                      <div className={`max-w-2xl w-full flex flex-col items-center text-center p-8 sm:p-12 bg-gradient-to-b from-transparent to-transparent border-y ${isDark ? 'via-neutral-900/50 border-neutral-900' : 'via-neutral-50/50 border-neutral-100'}`}>
                        <span className={`text-[10px] uppercase tracking-[0.3em] mb-6 font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.pauseTitle2}</span>
                        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-light mb-6 leading-tight tracking-tight ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{t.pauseDesc2}</h2>
                        <p className={`font-light text-[15px] sm:text-base leading-relaxed max-w-lg ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{t.pauseText2}</p>
                      </div>
                    </div>
                  )}

                  {!user && !isIntentionalPauseActive && index === 2 && (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 py-20 px-6 my-4 flex justify-center">
                      <div className={`max-w-2xl w-full flex flex-col items-center text-center p-8 sm:p-12 bg-gradient-to-b from-transparent to-transparent border-y ${isDark ? 'via-neutral-900/50 border-neutral-900' : 'via-neutral-50/50 border-neutral-100'}`}>
                        <span className={`text-[10px] uppercase tracking-[0.3em] mb-6 font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.pauseTitle3}</span>
                        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-light mb-6 leading-tight tracking-tight ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{t.pauseDesc3}</h2>
                        <p className={`font-light text-[15px] sm:text-base leading-relaxed max-w-lg ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{t.pauseText3}</p>
                      </div>
                    </div>
                  )}

                  {!user && !isIntentionalPauseActive && index === 3 && (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 py-20 px-6 my-4 flex justify-center">
                      <div className={`max-w-2xl w-full flex flex-col items-center text-center p-8 sm:p-12 bg-gradient-to-b from-transparent to-transparent border-y ${isDark ? 'via-neutral-900/50 border-neutral-900' : 'via-neutral-50/50 border-neutral-100'}`}>
                        <span className={`text-[10px] uppercase tracking-[0.3em] mb-6 font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.pauseTitle4}</span>
                        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-light mb-6 leading-relaxed tracking-tight ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{t.pauseDesc4}</h2>
                        <p className={`font-light text-[15px] sm:text-base leading-relaxed max-w-lg ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{t.pauseText4}</p>
                      </div>
                    </div>
                  )}

                  {!user && !isIntentionalPauseActive && index === 4 && (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 py-20 px-6 my-4 flex justify-center">
                      <div className={`max-w-2xl w-full flex flex-col items-center text-center p-8 sm:p-12 bg-gradient-to-b from-transparent to-transparent border-y ${isDark ? 'via-neutral-900/50 border-neutral-900' : 'via-neutral-50/50 border-neutral-100'}`}>
                        <span className={`text-[10px] uppercase tracking-[0.3em] mb-6 font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.pauseTitle5}</span>
                        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-light mb-6 leading-relaxed tracking-tight ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{t.pauseDesc5}</h2>
                      </div>
                    </div>
                  )}

                  {!user && !isIntentionalPauseActive && index === 5 && (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 py-20 px-6 my-4 flex justify-center">
                      <div className={`max-w-4xl w-full flex flex-col items-center p-8 sm:p-12 bg-gradient-to-b from-transparent to-transparent border-y ${isDark ? 'via-neutral-900/50 border-neutral-900' : 'via-neutral-50/50 border-neutral-100'}`}>
                        <span className={`text-[10px] uppercase tracking-[0.3em] mb-10 font-medium text-center ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.pricingTitle}</span>
                        
                        <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
                          <div className={`flex-1 p-8 rounded-2xl border ${isDark ? 'border-neutral-800 bg-neutral-900/50' : 'border-neutral-200 bg-white'}`}>
                            <h3 className={`text-xl font-normal mb-2 ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>{t.pricingFree}</h3>
                            <p className={`text-2xl font-light mb-8 ${isDark ? 'text-white' : 'text-black'}`}>Gratis</p>
                            <ul className={`space-y-4 text-sm font-light ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                              <li className="flex items-center gap-3"><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> {t.freeBenefit1}</li>
                              <li className="flex items-center gap-3"><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> {t.freeBenefit2}</li>
                              <li className="flex items-center gap-3"><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> {t.freeBenefit3}</li>
                            </ul>
                          </div>

                          <div className={`flex-1 p-8 rounded-2xl border relative overflow-hidden ${isDark ? 'border-neutral-700 bg-neutral-800/50' : 'border-neutral-900 bg-neutral-50'}`}>
                            <div className="absolute top-0 right-0 px-3 py-1 bg-neutral-900 text-white text-[10px] tracking-widest uppercase rounded-bl-lg">Premium</div>
                            <h3 className={`text-xl font-normal mb-2 ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>{t.pricingPremium}</h3>
                            <div className="flex items-end gap-2 mb-8">
                              <p className={`text-2xl font-light ${isDark ? 'text-white' : 'text-black'}`}>{t.monthly}</p>
                              <span className={`text-xs pb-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>o {t.yearly}</span>
                            </div>
                            <ul className={`space-y-4 text-sm font-light ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                              <li className="flex items-center gap-3"><svg className="w-4 h-4 text-neutral-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> {t.premiumBenefit1}</li>
                              <li className="flex items-center gap-3"><svg className="w-4 h-4 text-neutral-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> {t.premiumBenefit2}</li>
                              <li className="flex items-center gap-3"><svg className="w-4 h-4 text-neutral-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> {t.premiumBenefit3}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={`relative group overflow-hidden rounded-md transition-colors ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`} onDoubleClick={(e) => toggleLike(photo, e)} style={{ touchAction: 'manipulation' }}>
                    <img src={photo.url} alt={photo.title} loading="lazy" decoding="async" className="w-full h-[28rem] object-cover transition-transform duration-700 group-hover:scale-105" style={{ willChange: "transform" }} />
                    
                    <button onClick={(e) => { e.stopPropagation(); setActiveInfoId(activeInfoId === photo.id ? null : photo.id); }} className={`absolute top-4 left-4 z-20 backdrop-blur-sm p-2 rounded-full shadow-md transition-all active:scale-90 ${isDark ? 'bg-neutral-900/80 text-neutral-200 hover:bg-neutral-800' : 'bg-white/90 text-neutral-800 hover:bg-white'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </button>

                    {activeInfoId === photo.id && (
                      <div onClick={(e) => { e.stopPropagation(); setActiveInfoId(null); }} className={`absolute inset-0 z-10 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center transition-opacity duration-300 ${isDark ? 'bg-neutral-900/70 text-white' : 'bg-white/70 text-neutral-900'}`}>
                         <p className="text-lg md:text-xl font-light mb-2 capitalize leading-relaxed drop-shadow-md">{photo.title}</p>
                         <p className="text-xs uppercase tracking-widest opacity-80 mt-4">{t.photoBy} {photo.authorName}</p>
                      </div>
                    )}

                    <a href={photo.authorUsername?.startsWith('http') ? photo.authorUsername : `https://unsplash.com/@${photo.authorUsername || 'unsplash'}?utm_source=maeum_gratitud&utm_medium=referral`} target="_blank" rel="noopener noreferrer" className="absolute bottom-6 left-5 z-10 text-[9px] uppercase tracking-widest text-white/70 hover:text-white transition-colors" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                      {t.photoBy} {photo.authorName} {t.onUnsplash}
                    </a>

                    <button onClick={(e) => toggleLike(photo, e)} className={`absolute bottom-4 right-4 z-10 backdrop-blur-sm p-3 rounded-full shadow-lg active:scale-90 transition-all ${isDark ? 'bg-neutral-900/80' : 'bg-white/90'}`}>
                      <svg className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : (isDark ? 'text-neutral-500 fill-none' : 'text-neutral-400 fill-none')}`} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                    </button>
                  </div>
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
                 {t.gallery} ({normalizedLikes.length}/{currentLimits.gallery})
               </h2>
               {normalizedLikes.length > 0 && (
                 <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={`text-[10px] tracking-widest uppercase bg-transparent outline-none cursor-pointer text-right border-none ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                   <option value="newest">{t.newest}</option><option value="oldest">{t.oldest}</option><option value="random">{t.random}</option>
                 </select>
               )}
            </div>
          </div>

          {normalizedLikes.length === 0 ? (
            <p className={`text-center text-sm mt-20 ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>{t.empty}</p>
          ) : galleryView === "grid" ? (
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {displayedGallery.map((photo) => (
                <div key={photo.id} className="relative aspect-square cursor-pointer overflow-hidden group" onClick={() => { setGalleryView("feed"); setTimeout(() => { const el = document.getElementById(`feed-photo-${photo.id}`); if(el) window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 160, behavior: 'smooth'}); }, 50); }}>
                  <img src={photo.url} loading="lazy" decoding="async" className="w-full h-full object-cover rounded-sm" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-12">
              {displayedGallery.map((photo) => (
                <div id={`feed-photo-${photo.id}`} key={photo.id} className={`relative group overflow-hidden rounded-md transition-transform ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
                  <img src={photo.url} alt={photo.title} loading="lazy" decoding="async" className="w-full h-[28rem] object-cover" />
                  <button onClick={(e) => { e.stopPropagation(); setActiveInfoId(activeInfoId === photo.id ? null : photo.id); }} className={`absolute top-4 left-4 z-20 backdrop-blur-sm p-2 rounded-full shadow-md transition-all active:scale-90 ${isDark ? 'bg-neutral-900/80 text-neutral-200 hover:bg-neutral-800' : 'bg-white/90 text-neutral-800 hover:bg-white'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </button>
                  {activeInfoId === photo.id && (
                    <div onClick={(e) => { e.stopPropagation(); setActiveInfoId(null); }} className={`absolute inset-0 z-10 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center transition-opacity duration-300 ${isDark ? 'bg-neutral-900/70 text-white' : 'bg-white/70 text-neutral-900'}`}>
                       <p className="text-lg md:text-xl font-light mb-2 capitalize leading-relaxed drop-shadow-md">{photo.title}</p>
                       <p className="text-xs uppercase tracking-widest opacity-80 mt-4">{t.photoBy} {photo.authorName}</p>
                    </div>
                  )}
                  <button onClick={() => setActiveMenuPhotoId(activeMenuPhotoId === photo.id ? null : photo.id)} className={`absolute top-4 right-4 backdrop-blur-sm p-2 rounded-full shadow-md transition-all z-20 active:scale-90 ${isDark ? 'bg-neutral-900/80 text-neutral-200 hover:bg-neutral-800' : 'bg-white/90 text-neutral-800 hover:bg-white'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
                  </button>
                  {activeMenuPhotoId === photo.id && (
                    <div className={`absolute top-16 right-4 backdrop-blur-md rounded-lg shadow-xl border p-2 z-30 min-w-[200px] text-left ${isDark ? 'bg-neutral-900/95 border-neutral-800' : 'bg-white/95 border-neutral-100'}`}>
                      <a href={photo.authorUsername?.startsWith('http') ? photo.authorUsername : `https://unsplash.com/@${photo.authorUsername || 'unsplash'}?utm_source=maeum_gratitud&utm_medium=referral`} target="_blank" rel="noopener noreferrer" onClick={() => triggerUnsplashDownload(photo.downloadLocation)} className={`block px-3 py-2 text-[11px] uppercase tracking-wider border-b ${isDark ? 'text-neutral-400 hover:text-neutral-200 border-neutral-800' : 'text-neutral-600 hover:text-neutral-900 border-neutral-100'}`}>
                        {t.photoBy} {photo.authorName} {t.onUnsplash}
                      </a>
                      <button onClick={(e) => { e.stopPropagation(); downloadImage(photo.url, photo.id, photo.downloadLocation); setActiveMenuPhotoId(null); }} className={`w-full text-left px-3 py-2 text-[11px] uppercase tracking-wider mt-1 rounded ${isDark ? 'text-neutral-400 hover:bg-neutral-800' : 'text-neutral-600 hover:bg-neutral-50'}`}>
                        {t.download}
                      </button>
                      <button onClick={() => { setActiveMenuPhotoId(null); setPhotoToDelete(photo.id); }} className={`w-full text-left px-3 py-2 text-[11px] uppercase tracking-wider rounded mt-1 ${isDark ? 'text-red-400 hover:bg-red-900/30' : 'text-red-500 hover:bg-red-50'}`}>
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
               <button onClick={() => { setGalleryView("grid"); setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 50); }} className={`backdrop-blur-lg px-6 py-3 rounded-full shadow-2xl text-xs tracking-widest uppercase transition-all active:scale-95 ${isDark ? 'bg-neutral-800/90 text-white hover:bg-neutral-700' : 'bg-neutral-900/90 text-white hover:bg-neutral-800'}`}>
                 {t.viewGrid}
               </button>
             </div>
          )}
        </section>
      )}

      {currentTab === "profile" && user && (
        <section className="max-w-md mx-auto p-6 mt-6">
          <div className="text-center mb-8">
            <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder={t.yourName} className={`w-full text-2xl font-normal text-center bg-transparent border-b outline-none pb-2 transition-colors text-[16px] sm:text-2xl ${isDark ? 'border-transparent focus:border-neutral-700 text-neutral-100' : 'border-transparent focus:border-neutral-200 text-neutral-900'}`} />
            <p className={`text-xs mt-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{user.email}</p>
            {userPlan === 'premium' && <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white text-[10px] uppercase tracking-widest rounded-full">{t.premiumActive}</span>}
            {userPlan === 'lifetime' && <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white text-[10px] uppercase tracking-widest rounded-full">{t.lifetimeActive}</span>}
          </div>

          <div className="space-y-8">
            <div>
              <label className={`text-xs tracking-widest uppercase mb-4 block ${isDark ? 'text-neutral-400' : 'text-neutral-900'}`}>{t.yourTags}</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTags.length === 0 && <span className={`text-xs italic ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>{t.noTags}</span>}
                {selectedTags.map(tag => (
                  <button key={tag} onClick={() => toggleTag(tag)} className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-full border transition-all active:scale-95 ${isDark ? 'border-neutral-300 bg-neutral-800 text-white hover:bg-neutral-700' : 'border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800'}`}>
                    {t.tags?.[tag] || tag} <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                ))}
              </div>
              {selectedTags.length < 5 && (
                <form onSubmit={handleAddCustomTag} className="flex gap-2 mb-6">
                  <input type="text" value={customTag} onChange={(e) => setCustomTag(e.target.value)} placeholder={t.writeTag} maxLength="20" className={`flex-1 px-4 py-3 rounded-md text-[14px] outline-none border transition-colors ${isDark ? 'bg-neutral-900 border-neutral-800 focus:border-neutral-600 text-neutral-200 placeholder:text-neutral-600' : 'bg-transparent border-neutral-200 focus:border-neutral-900 text-neutral-900 placeholder:text-neutral-400'}`} />
                  <button type="submit" disabled={!customTag.trim()} className={`px-5 rounded-md text-xs tracking-widest uppercase transition-colors active:scale-95 disabled:opacity-50 ${isDark ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}>+</button>
                </form>
              )}
              <label className={`text-[10px] tracking-widest uppercase mb-3 block ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.tagSuggestions}</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.filter(tag => !selectedTags.includes(tag)).map(tag => (
                  <button key={tag} onClick={() => toggleTag(tag)} className={`px-3 py-1 text-xs rounded-full border transition-all active:scale-95 ${isDark ? 'border-neutral-800 text-neutral-500 hover:text-neutral-300' : 'border-neutral-200 text-neutral-500 hover:text-neutral-800'}`}>
                    + {t.tags?.[tag] || tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`text-xs tracking-widest uppercase mb-2 block ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.phrase}</label>
              <textarea value={userPhrase} onChange={(e) => setUserPhrase(e.target.value)} placeholder={t.phrasePlaceholder} className={`w-full p-4 border rounded-md text-[16px] outline-none resize-none h-24 transition-colors ${isDark ? 'bg-neutral-900 border-neutral-800 focus:border-neutral-600 text-neutral-200' : 'bg-transparent border-neutral-200 focus:border-neutral-900 text-neutral-900'}`} />
            </div>

            <div>
              <label className={`text-xs tracking-widest uppercase mb-2 block ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.appearance}</label>
              <div className="flex gap-4">
                <button onClick={() => changeTheme('light')} className={`flex-1 py-3 text-xs uppercase tracking-widest rounded-md transition-colors border active:scale-95 ${theme === 'light' ? (isDark ? 'border-neutral-500 text-white bg-neutral-800' : 'border-neutral-900 bg-neutral-900 text-white') : (isDark ? 'border-neutral-800 text-neutral-500' : 'border-neutral-200 text-neutral-500')}`}>{t.light}</button>
                <button onClick={() => changeTheme('dark')} className={`flex-1 py-3 text-xs uppercase tracking-widest rounded-md transition-colors border active:scale-95 ${theme === 'dark' ? (isDark ? 'border-neutral-500 text-white bg-neutral-800' : 'border-neutral-900 bg-neutral-900 text-white') : (isDark ? 'border-neutral-800 text-neutral-500' : 'border-neutral-200 text-neutral-500')}`}>{t.dark}</button>
              </div>
            </div>
            
            <div>
              <label className={`text-xs tracking-widest uppercase mb-2 block ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.language}</label>
              <div className="flex gap-2">
                {['es', 'en', 'fr', 'ko'].map(l => (
                  <button key={l} onClick={() => changeLang(l)} className={`flex-1 py-3 text-xs uppercase tracking-widest rounded-md transition-colors border active:scale-95 ${lang === l ? (isDark ? 'border-neutral-500 text-white bg-neutral-800' : 'border-neutral-900 bg-neutral-900 text-white') : (isDark ? 'border-neutral-800 text-neutral-500' : 'border-neutral-200 text-neutral-500')}`}>{l}</button>
                ))}
              </div>
            </div>

            <div>
              <label className={`text-xs tracking-widest uppercase mb-2 block ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{t.newPass}</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={t.newPassPlaceholder} minLength="6" className={`w-full p-4 pr-12 border rounded-md text-[16px] outline-none transition-colors ${isDark ? 'bg-neutral-900 border-neutral-800 focus:border-neutral-600 text-neutral-200' : 'bg-transparent border-neutral-200 focus:border-neutral-900 text-neutral-900'}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-800'}`}>
                  {showPassword ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                </button>
              </div>
            </div>

            <button onClick={saveProfile} disabled={isSavingProfile} className={`w-full py-4 text-xs tracking-widest uppercase rounded-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait active:scale-95 transition-all ${isDark ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}>
              {isSavingProfile ? <> <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> {t.saving} </> : t.save}
            </button>

            {userPlan === 'free' && (
              <div className="flex flex-col gap-3 mt-4">
                <button onClick={() => window.location.href = `/api/checkout?user_id=${user.id}&interval=month`} className={`w-full py-4 text-xs tracking-widest uppercase rounded-md flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg ${isDark ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'}`}>{t.subscribeBtn} — Mensual ($3)</button>
                <button onClick={() => window.location.href = `/api/checkout?user_id=${user.id}&interval=year`} className={`w-full py-4 text-xs tracking-widest uppercase rounded-md flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg border ${isDark ? 'border-neutral-700 text-white hover:bg-neutral-800' : 'border-neutral-300 text-black hover:bg-neutral-50'}`}>{t.subscribeBtn} — Anual ($33)</button>
              </div>
            )}
            
            {userPlan === 'premium' && (
              <button onClick={() => window.location.href = `/api/billing-portal?user_id=${user.id}`} className={`w-full py-4 border text-xs tracking-widest uppercase rounded-md flex items-center justify-center gap-2 active:scale-95 transition-all mt-4 ${isDark ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'}`}>{t.manageSubscription}</button>
            )}
            
            <button onClick={handleSignOut} disabled={isSigningOut} className={`w-full border py-4 text-xs tracking-widest uppercase rounded-md mt-4 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait active:scale-95 ${isDark ? 'border-neutral-800 text-neutral-400 hover:bg-neutral-900' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
              {isSigningOut ? <> <svg className={`animate-spin h-4 w-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> {t.signingOut} </> : t.signOut}
            </button>

            <div className="mt-12 mb-8 flex justify-center">
              <button onClick={() => setShowDeleteConfirm(true)} disabled={isSigningOut} className={`text-[10px] tracking-widest uppercase transition-colors opacity-40 hover:opacity-100 ${isDark ? 'text-red-400' : 'text-red-500'}`}>{t.deleteAccount}</button>
            </div>
          </div>
        </section>
      )}

      <nav className={`fixed bottom-6 left-1/2 -translate-x-1/2 backdrop-blur-lg px-8 py-4 rounded-full shadow-2xl z-40 flex items-center gap-12 text-white ${isDark ? 'bg-neutral-800/90 border border-neutral-700/50' : 'bg-neutral-900/90'}`}>
        <button onClick={() => { setCurrentTab("explore"); setActiveCategory("Minimalista"); setIsIntentionalPauseActive(false); setTimeout(() => { window.scrollTo({top: 0, behavior: 'smooth'}); }, 100); }} className={`active:scale-90 transition-transform ${currentTab === "explore" ? "opacity-100" : "opacity-40"}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        </button>
        <button onClick={() => { if(!user) { setIsForgotPassword(false); setShowAuthModal(true); } else { setCurrentTab("gallery"); setIsIntentionalPauseActive(false); setTimeout(() => { window.scrollTo({top: 0, behavior: 'smooth'}); }, 100); } }} className={`active:scale-90 transition-transform ${currentTab === "gallery" ? "opacity-100" : "opacity-40"}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </button>
        <button onClick={() => { if(!user) { setIsForgotPassword(false); setShowAuthModal(true); } else { setCurrentTab("profile"); setIsIntentionalPauseActive(false); setTimeout(() => { window.scrollTo({top: 0, behavior: 'smooth'}); }, 100); } }} className={`active:scale-90 transition-transform ${currentTab === "profile" ? "opacity-100" : "opacity-40"}`}>
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
            <p className={`text-sm mb-2 font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{t.magicLinkText}</p>
            <p className={`text-[11px] mb-8 italic ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>{t.spamNotice}</p>
            <button onClick={() => { setIsEmailSent(false); setIsLogin(true); setShowAuthModal(true); }} className={`w-full py-4 rounded-md text-xs uppercase tracking-widest transition-colors ${isDark ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}>
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
            <div className={`text-xs space-y-4 font-light leading-relaxed text-justify ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              <h4 className={`font-semibold uppercase tracking-widest text-[10px] mt-6 ${isDark ? 'text-neutral-200' : 'text-neutral-900'}`}>1. Términos y Condiciones de Uso</h4>
              <p className="italic">Última actualización: Julio de 2026</p>
              <p>Bienvenido a Maeum. Al acceder, registrarte o utilizar nuestra aplicación web y PWA (en adelante, "la App"), aceptas cumplir y estar sujeto a los siguientes Términos y Condiciones de Uso. Por favor, léelos detenidamente.</p>
              <p className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>1. Descripción del Servicio</p>
              <p>Maeum es una plataforma digital de inspiración visual y bienestar diseñada para ofrecer un espacio de pausa, contemplación y refugio estético. Permite a los usuarios explorar contenido visual curado (proveniente de la API de Pexels), guardar favoritos en una galería personal, personalizar frases de inspiración y reproducir audio ambiental.</p>
              <p className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>2. Cuentas de Usuario y Registro</p>
              <ul className="list-disc pl-4 space-y-2">
                <li>Para acceder a ciertas funciones, como guardar tu galería o personalizar tu perfil, es necesario crear una cuenta con un correo electrónico válido.</li>
                <li>Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.</li>
              </ul>
              <p className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>3. Planes de Suscripción (Free y Premium)</p>
              <p>Maeum ofrece dos modalidades de uso:</p>
              <ul className="list-disc pl-4 space-y-2">
                <li>Plan Gratuito (Free): Permite seleccionar hasta 5 etiquetas de inspiración, almacenar hasta 24 fotos en la galería personal y disfrutar de un límite de 3 pausas intencionales por hora. Cuentas inactivas por 6 meses serán eliminadas.</li>
                <li>Plan Premium: Mediante una suscripción ($3 USD/mes o $33 USD/año), el usuario desbloquea galería de hasta 300 fotos y 5 pausas intencionales por hora. El pago se procesa por Stripe. Puedes cancelar en cualquier momento.</li>
              </ul>
              <p>Si un pago de renovación falla tras los intentos automáticos, la cuenta regresará a la versión Free y se ocultarán las imágenes por encima del límite de 24.</p>
              <p className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>4. Pagos y Procesamiento a través de Stripe</p>
              <ul className="list-disc pl-4 space-y-2">
                <li>Los pagos de las suscripciones Premium son procesados de forma segura a través de Stripe. Maeum no almacena directamente los números completos de tus tarjetas.</li>
              </ul>
              <p className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>5. Propiedad Intelectual y Contenido</p>
              <ul className="list-disc pl-4 space-y-2">
                <li>El diseño, código fuente, logotipos y la marca Maeum son propiedad exclusiva de sus creadores.</li>
                <li>Las imágenes mostradas son proporcionadas a través de la API de Pexels y pertenecen a sus respectivos fotógrafos. Está prohibido extraer masivamente o utilizar las imágenes con fines comerciales no autorizados fuera de la App.</li>
              </ul>
              <p className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>6. Limitación de Responsabilidad</p>
              <p>Maeum se proporciona "tal cual". No garantizamos que el servicio sea interrumpido o libre de errores en todo momento. No nos hacemos responsables de interrupciones temporales en la transmisión de audio ambiental (SomaFM) o de la API de Pexels.</p>
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
                <li>Datos de Pago (Stripe): Si decides adquirir el plan Premium, los datos financieros y de cobro (como tarjetas de crédito o débito) son recopilados, procesados y almacenados de manera directa y segura por Stripe. Maeum solo recibe confirmaciones de estado de pago (activo/inactivo).</li>
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
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPhotoToDelete(null)}>
          <div className={`p-8 rounded-lg max-w-sm w-full text-center shadow-xl ${isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <h3 className={`text-sm tracking-widest uppercase mb-6 ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{t.deleteConfirm}</h3>
            <div className="flex gap-4">
              <button onClick={() => { setPhotoToDelete(null); setActiveMenuPhotoId(null); }} className={`flex-1 py-3 border rounded-md text-xs uppercase tracking-widest ${isDark ? 'border-neutral-700 text-neutral-300' : 'text-neutral-600'}`}>{t.no}</button>
              <button onClick={() => confirmDelete(photoToDelete)} className="flex-1 py-3 bg-red-500 text-white rounded-md text-xs uppercase tracking-widest hover:bg-red-600">{t.yes}</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className={`p-8 rounded-lg max-w-sm w-full text-center shadow-xl ${isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <h3 className={`text-sm tracking-widest uppercase mb-4 ${isDark ? 'text-red-400' : 'text-red-500'}`}>{t.deleteAccount}</h3>
            <p className={`text-sm mb-6 font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{t.deleteAccountConfirm}</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteConfirm(false)} className={`flex-1 py-3 border rounded-md text-xs uppercase tracking-widest ${isDark ? 'border-neutral-700 text-neutral-300' : 'text-neutral-600'}`}>{t.no}</button>
              <button onClick={executeDeleteAccount} className="flex-1 py-3 bg-red-500 text-white rounded-md text-xs uppercase tracking-widest hover:bg-red-600">{t.yes}</button>
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

      {loginError && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`p-8 rounded-lg max-w-sm w-full text-center shadow-xl ${isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-white'}`}>
            <h3 className={`text-sm tracking-widest uppercase mb-4 ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{t.loginErrorTitle}</h3>
            <p className={`text-sm mb-6 font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{loginError}</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => { setLoginError(null); setIsLogin(true); setIsForgotPassword(false); setShowAuthModal(true); }} className={`w-full py-3 rounded-md text-xs uppercase tracking-widest transition-colors ${isDark ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}>
                {t.tryAgain}
              </button>
              <button onClick={() => { setLoginError(null); setIsLogin(true); setIsForgotPassword(true); setShowAuthModal(true); }} className={`w-full py-3 border rounded-md text-xs uppercase tracking-widest transition-colors ${isDark ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
                {t.forgot}
              </button>
            </div>
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
                  <input type={showPassword ? "text" : "password"} placeholder={t.password} required minLength="6" onChange={(e) => setPassword(e.target.value)} className={`w-full px-4 py-3 pr-10 border-b outline-none transition-colors text-[16px] ${isDark ? 'bg-transparent border-neutral-800 text-neutral-200 focus:border-neutral-600' : 'border-neutral-200 text-neutral-900 focus:border-neutral-900'}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-2 top-1/2 -translate-y-1/2 ${isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-800'}`}>
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
              <button type="submit" disabled={isAuthenticating} className={`w-full py-4 mt-6 text-xs uppercase tracking-widest rounded-md disabled:opacity-60 disabled:cursor-wait transition-colors flex items-center justify-center gap-2 ${isDark ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}>
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
              <button onClick={() => setIsForgotPassword(true)} className={`w-full text-center mt-4 text-xs transition-colors ${isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-700'}`}>{t.forgot}</button>
            )}
            {!isForgotPassword && (
              <button onClick={() => setIsLogin(!isLogin)} className={`w-full text-center mt-6 text-xs underline transition-colors ${isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-700'}`}>
                {isLogin ? t.noAccount : t.haveAccount}
              </button>
            )}
            {isForgotPassword && (
              <button onClick={() => setIsForgotPassword(false)} className={`w-full text-center mt-6 text-xs underline transition-colors ${isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-700'}`}>{t.backToLogin}</button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}