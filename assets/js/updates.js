(function () {
  'use strict';

  /* ── safe wrapper (mirrors main.js pattern) ───────────────── */
  function safe(fn, name) {
    try { fn(); }
    catch (e) { console.warn('[updates] ' + name + ' failed:', e); }
  }

  /* ═══════════════════════════════════════════════════════════
     ALIANZA CAROUSEL
     3-slide auto-play, dots, prev/next buttons
  ═══════════════════════════════════════════════════════════ */
  function initAlianzaCarousel() {
    var track = document.querySelector('.alianza-track');
    var dotsWrap = document.querySelector('.alianza-dots');
    if (!track) return;

    var slides = track.querySelectorAll('.alianza-slide');
    var total = slides.length;
    if (total === 0) return;

    var current = 0;
    var timer = null;
    var INTERVAL = 5000;

    /* build dots */
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      for (var i = 0; i < total; i++) {
        var btn = document.createElement('button');
        btn.className = 'alianza-dot' + (i === 0 ? ' active' : '');
        btn.setAttribute('aria-label', 'Slide ' + (i + 1));
        btn.dataset.index = i;
        dotsWrap.appendChild(btn);
      }
    }

    function goTo(n) {
      current = (n + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      if (dotsWrap) {
        var dots = dotsWrap.querySelectorAll('.alianza-dot');
        dots.forEach(function (d, idx) {
          d.classList.toggle('active', idx === current);
        });
      }
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, INTERVAL);
    }

    /* prev / next buttons */
    var prevBtn = document.querySelector('.alianza-nav--prev');
    var nextBtn = document.querySelector('.alianza-nav--next');
    if (prevBtn) {
      prevBtn.addEventListener('click', function () { goTo(current - 1); startTimer(); });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () { goTo(current + 1); startTimer(); });
    }

    /* dot clicks */
    if (dotsWrap) {
      dotsWrap.addEventListener('click', function (e) {
        var btn = e.target.closest('.alianza-dot');
        if (!btn) return;
        goTo(parseInt(btn.dataset.index, 10));
        startTimer();
      });
    }

    /* pause on hover */
    var carousel = document.querySelector('.alianza-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', function () { clearInterval(timer); });
      carousel.addEventListener('mouseleave', startTimer);
    }

    /* touch swipe */
    var startX = null;
    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { goTo(dx < 0 ? current + 1 : current - 1); }
      startX = null;
      startTimer();
    }, { passive: true });

    goTo(0);
    startTimer();
  }

  /* ═══════════════════════════════════════════════════════════
     AUDITORÍA MODAL DATA
     16 specialties — title, icon, description, aspects[], note
  ═══════════════════════════════════════════════════════════ */
  var AUDITORIA_DATA = {
    clinica: {
      title: 'Evaluación Clínica General',
      icon: '🩺',
      description: 'Examen médico integral orientado a la aptitud laboral. Evalúa el estado de salud general del trabajador, detecta patologías preexistentes y emite certificado de aptitud según el puesto de trabajo.',
      aspects: [
        'Anamnesis completa con antecedentes personales y familiares',
        'Examen físico por aparatos y sistemas',
        'Control de signos vitales y antropometría',
        'Evaluación de capacidad funcional para el puesto',
        'Detección de enfermedades preexistentes declarables',
        'Emisión de certificado de aptitud laboral'
      ],
      note: 'Resolución MTySS 37/10 · Ley 24.557 ART'
    },
    bioquimica: {
      title: 'Análisis Bioquímicos',
      icon: '🔬',
      description: 'Laboratorio de análisis clínicos orientado a la medicina laboral. Incluye hemogramas, hepatograma, función renal, glucemia, uricocultivos y perfiles específicos según exposición ocupacional.',
      aspects: [
        'Hemograma completo con recuento diferencial',
        'Hepatograma: TGO, TGP, FAL, bilirrubinas',
        'Función renal: urea, creatinina, ácido úrico',
        'Glucemia en ayunas y perfil lipídico',
        'Uricocultivo y sedimento urinario',
        'Perfiles específicos según riesgo ocupacional (plomemia, etc.)'
      ],
      note: 'Laboratorio propio certificado · Procesamiento en 24 hs'
    },
    cardiologia: {
      title: 'Evaluación Cardiológica',
      icon: '❤️',
      description: 'Estudio cardiopulmonar completo para puestos de alta demanda física o exposición a factores de riesgo cardiovascular. Incluye electrocardiograma, ecocardiografía y ergometría cuando corresponde.',
      aspects: [
        'Electrocardiograma en reposo de 12 derivaciones',
        'Ecocardiograma bidimensional con Doppler',
        'Evaluación de factores de riesgo cardiovascular',
        'Ergometría en cinta o bicicleta ergométrica',
        'Holter de ritmo de 24 horas si se indica',
        'Informe de aptitud para trabajo físico pesado'
      ],
      note: 'Cardiólogo certificado en medicina laboral'
    },
    rayosx: {
      title: 'Radiología y Diagnóstico por Imágenes',
      icon: '🫁',
      description: 'Servicio de diagnóstico por imágenes para evaluaciones preocupacionales y periódicas. Radiografías de tórax, columna, articulaciones, acceso a resonadores 3T y tomógrafos multicorte.',
      aspects: [
        'Radiografía de tórax frente y perfil',
        'Columna cervical, dorsal y lumbar (frente y perfil)',
        'Articulaciones: rodillas, caderas, hombros',
        'Resonancia magnética 3 Teslas (convenio)',
        'Tomografía computada multicorte (convenio)',
        'Informe médico con lectura por radiólogo especialista'
      ],
      note: 'Equipamiento digital de última generación · Baja radiación'
    },
    psicologia: {
      title: 'Evaluación Psicológica',
      icon: '🧠',
      description: 'Evaluación de la salud mental y equilibrio psicológico del trabajador. Especialmente indicada para puestos de seguridad, manejo vehicular, trabajo en altura y responsabilidad crítica.',
      aspects: [
        'Entrevista psicológica semi-estructurada',
        'Aplicación de test proyectivos y estructurados',
        'Evaluación de personalidad y equilibrio emocional',
        'Detección de trastornos del estado del ánimo',
        'Evaluación de aptitud para puestos de riesgo',
        'Informe de recomendaciones para el empleador'
      ],
      note: 'Psicólogos especializados en psicología organizacional'
    },
    neurologia: {
      title: 'Evaluación Neurológica',
      icon: '🧬',
      description: 'Estudio del sistema nervioso central y periférico con enfoque en patologías de origen ocupacional: neuropatías por vibración, intoxicaciones crónicas, síndrome del túnel carpiano y otras.',
      aspects: [
        'Examen neurológico completo',
        'Evaluación de reflejos osteotendinosos',
        'Test de sensibilidad y coordinación',
        'Electroencefalograma si se indica (EEG)',
        'Detección de polineuropatías ocupacionales',
        'Evaluación post-traumática'
      ],
      note: 'Incluye EEG en casos indicados · Neurólogo certificado'
    },
    psicometria: {
      title: 'Batería Psicométrica — Reid System',
      icon: '📊',
      description: 'Evaluación cognitiva estandarizada con tecnología Reid System para selección, promoción y detección de aptitudes específicas. Cuantifica capacidades que no son visibles en una entrevista.',
      aspects: [
        'Cociente intelectual y capacidad de razonamiento abstracto',
        'Concentración, atención sostenida y velocidad de procesamiento',
        'Memoria de trabajo y memoria a largo plazo',
        'Control emocional, tolerancia al estrés y resiliencia',
        'Habilidades verbales, numéricas y espaciales',
        'Perfil de personalidad laboral (integridad, disciplina)'
      ],
      note: 'Reid System certificado · Informe ejecutivo en 48 hs · Compatible con normativas de selección Argentina'
    },
    psiquiatria: {
      title: 'Evaluación Psiquiátrica',
      icon: '💊',
      description: 'Valoración psiquiátrica especializada para puestos de alta responsabilidad, conducción vehicular, trabajo nocturno o con exposición a situaciones traumáticas. Detecta trastornos que comprometen la seguridad laboral.',
      aspects: [
        'Entrevista psiquiátrica estructurada',
        'Diagnóstico diferencial de trastornos del ánimo',
        'Evaluación de consumo de sustancias psicoactivas',
        'Detección de trastornos de personalidad',
        'Valoración de aptitud para puestos de riesgo',
        'Seguimiento y derivación cuando corresponde'
      ],
      note: 'Psiquiatra con habilitación en medicina del trabajo'
    },
    imagen: {
      title: 'Resonancia y Tomografía',
      icon: '🖥️',
      description: 'Acceso preferencial a resonadores 3 Teslas y tomógrafos multicorte de última generación mediante la alianza con Hospital Santa Isabel de Hungría. Informes médicos priorizados para medicina laboral.',
      aspects: [
        'Resonancia magnética 3T de columna, articulaciones y cerebro',
        'Tomografía computada de tórax, abdomen y pelvis',
        'Angiografías por resonancia y tomografía',
        'Reconstrucciones 3D para evaluación quirúrgica',
        'Informes especializados en patología ocupacional',
        'Turnos coordinados desde Alta Salud'
      ],
      note: 'Tecnología Hospital Santa Isabel de Hungría · Turno en 48 hs'
    },
    oftalmologia: {
      title: 'Evaluación Oftalmológica',
      icon: '👁️',
      description: 'Examen de la visión para determinar aptitud en tareas que requieren agudeza visual, visión de colores o trabajo con pantallas. Obligatorio para conductores, operadores de maquinaria y trabajos en altura.',
      aspects: [
        'Agudeza visual con y sin corrección (VL y VP)',
        'Visión cromática y campo visual',
        'Tonometría (presión ocular)',
        'Evaluación de fondo de ojo',
        'Test de Ishihara para discromatopsias',
        'Informe de aptitud para licencias y maquinaria'
      ],
      note: 'Reglamento de Tránsito Nacional · Resolución 37/10'
    },
    fonoaudiologia: {
      title: 'Evaluación Fonoaudiológica',
      icon: '👂',
      description: 'Estudio de la función auditiva y vocal para detectar hipoacusias laborales, patologías de la voz o trastornos del lenguaje con origen o agravamiento ocupacional.',
      aspects: [
        'Audiometría tonal liminar (vía aérea y ósea)',
        'Logoaudiometría e índice de discriminación',
        'Impedanciometría con curvas de timpanometría',
        'Evaluación de hipoacusia inducida por ruido (PAIR)',
        'Evaluación de voz para puestos que la requieren',
        'Informe comparativo preocupacional / periódico'
      ],
      note: 'Norma IRAM 4062 · Res. SRT 85/12 sobre PAIR'
    },
    ecg: {
      title: 'Electrocardiograma',
      icon: '📈',
      description: 'Electrocardiograma de reposo de 12 derivaciones para detección de arritmias, trastornos de conducción, isquemia y otras patologías cardíacas relevantes para la aptitud laboral.',
      aspects: [
        'Registro de 12 derivaciones estándar',
        'Análisis de ritmo, frecuencia y conducción',
        'Detección de hipertrofia ventricular',
        'Evaluación de intervalo QT y ST',
        'Identificación de bloqueos y arritmias',
        'Informe médico firmado por cardiólogo'
      ],
      note: 'Equipo digital de alta resolución · Resultado en el día'
    },
    ergometria: {
      title: 'Ergometría',
      icon: '🏃',
      description: 'Prueba de esfuerzo cardiovascular controlada para evaluar la capacidad física máxima, detectar isquemia inducible y determinar aptitud para trabajos de alta demanda energética.',
      aspects: [
        'Protocolo de Bruce o Naughton según condición física',
        'Monitoreo continuo de ECG durante el esfuerzo',
        'Control de tensión arterial por estadios',
        'Cálculo de METS y capacidad funcional',
        'Detección de isquemia, arritmias y cronocompetencia',
        'Informe de aptitud para trabajos físicos pesados'
      ],
      note: 'Indicada para puestos ≥ 6 METs · Cardiólogo presente'
    },
    espirometria: {
      title: 'Espirometría',
      icon: '🫁',
      description: 'Estudio de la función respiratoria para detectar patologías obstructivas o restrictivas, especialmente relevante en trabajadores expuestos a polvos, gases, humos o vapores químicos.',
      aspects: [
        'CVF (Capacidad Vital Forzada)',
        'VEF1 (Volumen espiratorio forzado en 1 seg.)',
        'Relación VEF1/CVF (índice de Tiffenau)',
        'FEF 25-75% y flujo pico (PEF)',
        'Clasificación ATS: normal / leve / moderado / severo',
        'Comparativa con valores de referencia por edad y talla'
      ],
      note: 'Equipo Vitalograph · Res. SRT 43/97 sobre enf. respiratorias'
    },
    audiometria: {
      title: 'Audiometría',
      icon: '🔊',
      description: 'Evaluación auditiva completa con cabina insonorizada calibrada. Imprescindible en empresas con exposición a ruido para el programa COPASO y cumplimiento normativo IRAM/SRT.',
      aspects: [
        'Audiometría tonal con cabina insonorizada calibrada',
        'Frecuencias: 250, 500, 1k, 2k, 3k, 4k, 6k, 8k Hz',
        'Umbral de vía aérea y vía ósea',
        'Clasificación según porcentaje de pérdida auditiva',
        'Detección temprana de PAIR (Hipoacusia por Ruido)',
        'Registro histórico para comparación periódica'
      ],
      note: 'Cabina calibrada IRAM · Fonoaudiólogo habilitado SRT'
    },
    eeg: {
      title: 'Electroencefalograma (EEG)',
      icon: '⚡',
      description: 'Registro de la actividad eléctrica cerebral para detección de epilepsias, trastornos del sueño y patologías neurológicas relevantes en puestos de conducción vehicular, trabajo en altura o maquinaria pesada.',
      aspects: [
        'EEG de reposo con 21 electrodos sistema 10/20',
        'Registro en vigilia, hiperventilación y foto-estimulación',
        'Detección de focos epileptiformes',
        'Evaluación de ondas lentas o irritativas',
        'EEG con privación de sueño si se indica',
        'Informe neurológico para aptitud en puestos críticos'
      ],
      note: 'Indicado obligatorio en conductores — Res. 961/15 SRT'
    }
  };

  /* ═══════════════════════════════════════════════════════════
     AUDITORÍA MODAL CONTROLLER
  ═══════════════════════════════════════════════════════════ */
  function initAuditoriaModal() {
    var modal        = document.getElementById('auditoria-modal');
    var backdrop     = document.getElementById('modal-backdrop');
    var closeBtn     = document.getElementById('modal-close');
    var iconWrap     = document.getElementById('modal-icon-wrap');
    var titleEl      = document.getElementById('modal-title');
    var descEl       = document.getElementById('modal-description');
    var aspectsWrap  = document.getElementById('modal-aspects-wrap');
    var aspectsList  = document.getElementById('modal-aspects');
    var footerNote   = document.getElementById('modal-footer-note');

    if (!modal) return;

    function openModal(id) {
      var data = AUDITORIA_DATA[id];
      if (!data) return;

      if (iconWrap)    iconWrap.textContent    = data.icon || '';
      if (titleEl)     titleEl.textContent     = data.title;
      if (descEl)      descEl.textContent      = data.description;
      if (footerNote)  footerNote.textContent  = data.note || '';

      if (aspectsList) {
        aspectsList.innerHTML = '';
        (data.aspects || []).forEach(function (aspect) {
          var li = document.createElement('li');
          li.textContent = aspect;
          aspectsList.appendChild(li);
        });
      }

      if (aspectsWrap) {
        aspectsWrap.style.display = (data.aspects && data.aspects.length) ? '' : 'none';
      }

      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';

      /* focus trap — put focus on close button */
      if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 60);
    }

    function closeModal() {
      modal.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }

    /* delegate clicks on prestacion items */
    document.addEventListener('click', function (e) {
      var item = e.target.closest('.prestacion-item[data-modal-id]');
      if (item) openModal(item.dataset.modalId);
    });

    /* keyboard activation (Enter / Space) */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeModal(); return; }

      if (e.key === 'Enter' || e.key === ' ') {
        var item = document.activeElement && document.activeElement.closest
          ? document.activeElement.closest('.prestacion-item[data-modal-id]')
          : null;
        if (item) { e.preventDefault(); openModal(item.dataset.modalId); }
      }
    });

    /* close actions */
    if (backdrop) backdrop.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
  }

  /* ─── BOOT ──────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    safe(initAlianzaCarousel, 'initAlianzaCarousel');
    safe(initAuditoriaModal,  'initAuditoriaModal');
  });

}());
