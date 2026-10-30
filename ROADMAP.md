# Ruletator: inventario de producto, contenido y crecimiento

Última actualización: 29 de octubre de 2026.

## Objetivo

Construir una web de juegos, herramientas rápidas y calculadoras que resuelva necesidades reales, consiga usuarios recurrentes y pueda monetizarse con publicidad. Empezamos con la ruleta y añadiremos funciones de forma gradual.

Este archivo es el inventario vivo del proyecto. Documentar una idea no significa que ya esté implementada ni que todas las propuestas estén aprobadas. Las prioridades siguientes son una propuesta inicial y pueden cambiar según las nuevas ideas del propietario y los datos de uso.

## Estado actual verificado

- [x] Ruleta con edición de participantes, animación y configuración.
- [x] Persistencia de participantes y configuración en el navegador.
- [x] Publicación en Cloudflare Pages: <https://ruletator.pages.dev>.
- [x] Favicon basado en la misma ruleta, en SVG e ICO.
- [x] Banners de demostración de gaming, audio y viajes; no generan ingresos.
- [x] Integración técnica de AdSense preparada, desactivada en la versión actual.
- [x] Páginas de ayuda y privacidad, metadatos básicos, robots.txt y sitemap.
- [x] Rama `master` para producción y `develop` para próximas integraciones.
- [x] Despliegue automático mediante GitHub Actions después de un push o merge a `master`.
- [ ] Cuenta y sitio aprobados por AdSense; anuncios reales activos.
- [ ] Medición de tráfico y rendimiento en búsquedas con Search Console.
- [ ] Nuevos juegos, calculadoras y contenido editorial publicados.

## Ideas confirmadas por el propietario

| ID | Iniciativa | Resultado esperado | Estado |
| --- | --- | --- | --- |
| MON-01 | Publicidad real | Monetizar las visitas mediante un proveedor aprobado, empezando por evaluar AdSense. | Pendiente de cuenta, revisión y activación. |
| JUE-01 | Más juegos y herramientas de azar | Ampliar la web más allá de la ruleta y fomentar que la gente vuelva. | Dirección confirmada; elegir cada juego antes de construirlo. |
| CAL-01 | Promedio del semestre universitario | Calcular el promedio de materias ponderado por créditos. | Pendiente. |
| EDU-01 | Carreras mejor pagadas en Colombia | Publicar una comparación sustentada en datos, con fuentes y metodología. | Pendiente de investigación y definición de datos. |
| IDE-01 | Nuevas ideas del propietario | Añadir propuestas a este inventario a medida que aparezcan. | Abierto. |
| FUT-01 | Compartir y guardar ruletas en línea | Explorar enlaces compartibles y persistencia entre dispositivos con Workers y D1. | Pospuesto para una etapa posterior. |

## Inventario propuesto y prioridades

P0 = preparar el lanzamiento y medir. P1 = siguiente lote de funciones. P2 = ampliar después de validar utilidad. P3 = explorar más adelante. Las búsquedas de ejemplo son hipótesis; no representan volúmenes ni dificultad de posicionamiento investigados.

| ID | Idea | Prioridad propuesta | Necesidad o búsqueda de ejemplo | Alcance inicial |
| --- | --- | --- | --- | --- |
| BASE-01 | Revisar experiencia de la ruleta en celular | P0 | «ruleta de nombres online» | Revisar tamaños, interacción, legibilidad y tiempos de carga. |
| SEO-01 | Configurar Search Console y revisar indexación | P0 | Saber si Google descubre y muestra las páginas. | Verificar propiedad, enviar sitemap y revisar cobertura. |
| MON-01 | Preparar AdSense real | P0 | Monetización de las visitas. | Cuenta, verificación, revisión, bloques y gestión del consentimiento donde corresponda. |
| CAL-01 | Promedio semestral por créditos | P1 | «calcular promedio semestre universidad» | Materias, notas, créditos y promedio ponderado. |
| CAL-02 | Nota necesaria en el examen final | P1 | «qué nota necesito para pasar» | Notas y porcentajes conocidos, peso restante y nota objetivo. |
| JUE-02 | Lanzar una moneda | P1 | «cara o sello online» | Lanzamiento y resultado; variantes de texto sin duplicar páginas equivalentes. |
| JUE-03 | Dados virtuales | P1 | «lanzar dados online» | Elegir cantidad de dados y mostrar suma y resultados. |
| JUE-04 | Números aleatorios | P1 | «generador de números aleatorios» | Rango, cantidad y opción de evitar repetidos. |
| JUE-05 | Barajar una lista | P1 | «ordenar nombres al azar» | Introducir nombres y generar un orden. |
| CAL-03 | Promedio acumulado universitario | P2 | «calcular promedio acumulado universidad» | Combinar notas y créditos de varios semestres. |
| CAL-04 | Simulador de promedio objetivo | P2 | «cómo subir mi promedio universitario» | Estimar la nota media necesaria en los créditos futuros. |
| CAL-05 | Calculadora de porcentajes | P2 | «cuánto es el porcentaje de una nota» | Porcentaje de una cantidad y contribución a una nota final. |
| JUE-06 | Formar equipos aleatorios | P2 | «generador de equipos aleatorios» | Tamaño o número de equipos y distribución de participantes. |
| JUE-07 | Ruleta de retos | P2 | «ruleta de retos para amigos» | Retos editables y categorías apropiadas al público elegido. |
| JUE-08 | Amigo secreto | P2 | «sorteo amigo secreto online» | Definir primero cómo mantener privadas las asignaciones; no presentarlas como secretas si son visibles para todos. |
| JUE-09 | Bingo o cartones aleatorios | P3 | «generador de bingo» | Generación de cartones y evaluación de impresión o descarga. |
| JUE-10 | Memoria y trivia | P3 | Juegos cortos para volver a visitar la web. | Elegir temática, reglas y fuentes de las preguntas antes de implementar. |
| EDU-01 | Carreras mejor pagadas en Colombia | P2 | «carreras mejor pagadas en Colombia» | Tabla con métrica, población, periodo y fuentes explícitas. |
| EDU-02 | Comparador de programas académicos | P3 | «comparar carreras en Colombia» | Comparar indicadores equivalentes; no prometer ingresos individuales. |
| FUT-01 | Compartir ruletas por enlace | P3 | Reutilizar y enviar listas sin copiarlas a mano. | Definir privacidad, caducidad y almacenamiento. |
| FUT-02 | Guardado entre dispositivos y cuentas | P3 | Recuperar listas desde otro navegador. | Implementar solo si hay una necesidad que justifique cuentas y datos en servidor. |

## Especificación inicial: calculadoras universitarias

### Promedio semestral por créditos

- Una fila por materia: nombre opcional, nota y número de créditos.
- Fórmula: `promedio = suma(nota × créditos) / suma(créditos)`.
- Mostrar contribuciones por materia y total de créditos para que el resultado sea comprensible.
- Usar una escala configurable; se puede ofrecer 0 a 5 como opción para el público colombiano, sin asumir que todas las instituciones aplican las mismas reglas.
- Admitir decimales y explicar el redondeo. Rechazar créditos negativos y no dividir entre cero.
- Diferenciar promedio simple y promedio ponderado. Explicar cuál se está calculando.
- Definir cómo manejar materias sin nota y advertir cuando el cálculo esté incompleto.
- No afirmar que el resultado es el promedio oficial de una universidad: pueden existir reglas particulares para repeticiones, exclusiones o redondeo.
- Mantener las notas en el navegador en la primera versión y ofrecer un control para borrarlas.
- Incluir un ejemplo resuelto y una explicación breve de la fórmula en la misma página.

### Nota necesaria para pasar

- Pedir las notas obtenidas y sus porcentajes, el peso restante y la nota objetivo.
- Validar que los porcentajes sean coherentes y no superen el 100 %.
- Fórmula: `nota restante necesaria = (objetivo − aportes conocidos) / peso restante`, con pesos expresados entre 0 y 1.
- Mostrar cuándo el objetivo ya está alcanzado o no es posible con la nota máxima de la escala elegida.
- Cubrir el caso de peso restante igual a cero sin dividir entre cero.

## Especificación inicial: carreras mejor pagadas en Colombia

Esta página requiere trabajo editorial y análisis de datos, además de programación. No se publicará un ranking construido con cifras inventadas o con datos de poblaciones incomparables.

- Usar como punto de partida el [Observatorio Laboral para la Educación (OLE)](https://ole.mineducacion.gov.co/portal/secciones/Sistemas-de-informacion/), del Ministerio de Educación Nacional.
- Consultar también [SNIES](https://snies.mineducacion.gov.co/) para identificar programas e instituciones cuando sea necesario. Confirmar los campos y la disponibilidad real antes de diseñar filtros.
- Seleccionar el periodo más reciente disponible y explicitar tanto el año de los datos como la fecha de actualización de la página. No presentar datos antiguos como salarios del año en curso.
- Definir qué se compara: programa, campo de estudio, nivel de formación, cohorte y periodo de seguimiento.
- Identificar la métrica exacta: promedio, mediana, rango o ingreso base de cotización (IBC). El IBC no debe presentarse como si fuera automáticamente salario neto o ingreso total.
- Explicar la cobertura de los datos y qué población queda fuera; revisar tamaños de muestra y no ordenar con aparente precisión grupos sin información suficiente.
- Separar ingresos de empleabilidad: una tasa de cotizantes no describe por sí sola todas las formas de empleo ni garantiza conseguir trabajo.
- Citar los enlaces originales, conservar una copia reproducible de los datos utilizados cuando su licencia lo permita y documentar limpieza, agrupaciones y ordenamiento.
- Mostrar metodología, limitaciones y responsable de la revisión. Añadir filtros por ciudad o institución solo si la fuente permite comparaciones válidas.
- No convertir el ranking en una promesa de ingresos ni en una recomendación personalizada de carrera.
- Revisar el contenido cuando la fuente publique una nueva edición. No cambiar únicamente la fecha del título para aparentar actualización.

## Organización del sitio y SEO

### Estructura propuesta

- Juegos y azar: ruleta, moneda, dados, números, listas y equipos.
- Calculadoras: semestre, promedio acumulado, nota necesaria y porcentajes.
- Educación en Colombia: comparaciones y guías sustentadas en fuentes.

La ruleta vive actualmente en `/`. Las rutas siguientes son propuestas, no páginas existentes:

```text
/juegos
/juegos/moneda
/juegos/dados
/juegos/numeros-aleatorios
/juegos/formar-equipos
/calculadoras
/calculadoras/promedio-semestre
/calculadoras/nota-necesaria
/calculadoras/promedio-acumulado
/educacion
/educacion/carreras-mejor-pagadas-colombia
```

Crear cada sección cuando tenga contenido útil. Si se cambia una URL existente, planear su redirección. No generar páginas vacías ni muchas variantes casi iguales para intentar captar palabras clave.

### Criterios por página

- Resolver una necesidad concreta y ofrecer una herramienta funcional o información original verificable.
- Tener título, descripción, encabezado principal y URL descriptivos, además de canonical correcto cuando corresponda.
- Incluir instrucciones, fórmula o metodología y ejemplos propios que ayuden a usar el resultado.
- Crear enlaces internos entre herramientas relacionadas, por ejemplo promedio semestral y nota necesaria para pasar.
- Mantener contenido útil accesible en el HTML inicial, navegación rastreable y buen comportamiento móvil.
- Incorporar las páginas publicadas al sitemap; mantener borradores, filtros duplicados y páginas sin terminar fuera del índice según su caso.
- Priorizar accesibilidad, estabilidad del diseño y velocidad. La publicidad no debe tapar la herramienta ni provocar clics accidentales.
- Usar datos estructurados solo si describen contenido real y cumplen las reglas de Google; no inventar reseñas o puntuaciones.
- Medir impresiones, clics, consultas y páginas indexadas en Search Console. Las posiciones por sí solas no describen el éxito del producto.

### Qué esperamos del SEO

Las calculadoras y guías útiles pueden abrir oportunidades de búsqueda, pero esa posibilidad es una hipótesis que hay que validar. Añadir más páginas o repetir palabras clave no garantiza posicionamiento, indexación, aprobación publicitaria ni ingresos.

Google recomienda contenido útil, fiable y pensado para personas. La variedad de temas debe tener sentido para el público y poder mantenerse con calidad; no añadiremos artículos de cualquier tema únicamente para atraer visitas.

Referencias oficiales:

- [Contenido útil y fiable](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
- [Guía de SEO para principiantes](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).
- [Cómo funciona la búsqueda y sus limitaciones](https://developers.google.com/search/docs/fundamentals/how-search-works).

## Monetización y medición

- Mantener los banners demo identificados hasta activar un proveedor real.
- Completar el proceso de AdSense y su revisión; no dar por aprobada la cuenta ni el sitio.
- Revisar privacidad, contacto y gestión de consentimiento antes de activar anuncios reales.
- Medir páginas vistas, usuarios recurrentes, uso de herramientas y procedencia del tráfico con una solución adecuada a las preferencias de privacidad.
- Cuando haya publicidad real, medir RPM de página e ingresos efectivos por separado de las visitas.
- Usar proyecciones de ingresos solo como escenarios explícitos, nunca como promesas.
- Elegir las siguientes funciones según utilidad, uso y costo de mantenimiento, además de las búsquedas que atraigan.

## Orden de ejecución sugerido

1. Revisar la ruleta en móvil y configurar la medición de búsqueda.
2. Lanzar la calculadora de promedio semestral con ejemplos y validaciones.
3. Añadir la calculadora de nota necesaria para pasar.
4. Publicar moneda, dados, números aleatorios y barajado de listas por entregas pequeñas.
5. Completar la activación publicitaria y comprobar que no perjudica la experiencia.
6. Investigar los datos colombianos y publicar la comparación de carreras cuando sea reproducible y esté revisada.
7. Evaluar equipos, retos, cuentas, guardado y funciones compartidas a partir del uso real.

## Cómo añadir próximas ideas

Registrar cada propuesta sin implementarla automáticamente:

```markdown
### IDEA-XXX: nombre
- Propuesta por: propietario / sugerencia del equipo.
- Usuario y problema que resuelve:
- Función o contenido esperado:
- Búsqueda que podría responder (hipótesis):
- Categoría: juegos / calculadoras / educación / plataforma.
- Datos y fuentes necesarios:
- Costo y mantenimiento estimados:
- Prioridad propuesta:
- Estado: idea / por investigar / aprobada / en desarrollo / publicada / descartada.
- Criterio de aceptación:
- Cómo mediremos si sirve:
```

## Flujo de entrega

Las futuras funciones parten de `develop`. Se revisan y verifican antes de integrarlas en `master`. El push o merge a `master` dispara el despliegue de producción. Un documento de planificación no implica que las funciones descritas ya estén disponibles en la web.
