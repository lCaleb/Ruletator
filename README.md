# Ruletator

Ruleta en Next.js con participantes y configuración guardados en el navegador.

El [inventario y plan de crecimiento](ROADMAP.md) reúne los juegos, calculadoras, contenido de educación en Colombia y tareas de SEO y monetización pendientes.

## Desarrollo y comprobación

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Para comprobar producción: `npm run build`, seguido de `npm start`.

## Publicar gratis en Cloudflare Pages

Proyecto creado: `ruletator`. Dirección de producción: `https://ruletator.pages.dev` (comprueba el resultado de cada despliegue antes de compartirla).

Cada push a `master`, incluido el resultado de un merge, compila y publica automáticamente mediante `.github/workflows/deploy-production.yml`. Un commit local no publica hasta que haces push. Los cambios en `develop` no se publican en producción.

Para publicar manualmente, con Wrangler autorizado, desde `master` y con el repositorio limpio:

```powershell
git switch master
git pull --ff-only
npm run deploy:production
```

Ejecuta `npm run build:static`. La carpeta `out/` contiene todos los archivos que se suben a Cloudflare Pages; no subas el código fuente, `.env`, `.git` ni `node_modules`.

En Cloudflare, abre **Workers & Pages → Create → Pages → Upload assets** y sube la carpeta `out/` o un ZIP con su contenido en la raíz. Elige un nombre disponible y publica. Si conectas Git, el comando de compilación es `npm run build:static` y el directorio de salida es `out`.

Después de conocer la URL definitiva `https://nombre.pages.dev`, configura `NEXT_PUBLIC_SITE_URL` con esa dirección y vuelve a compilar/subir para completar sitemap y metadatos. El hosting elegido para esta versión es Cloudflare Pages. Los banners de demostración funcionan sin servicios externos.

## Ramas y futuras integraciones

- `master`: rama predeterminada del repositorio y rama de producción configurada en Cloudflare Pages.
- `develop`: base para futuras integraciones. Se crea a partir de `master`.
- Para cada cambio, crea una rama desde `develop` e intégrala mediante una pull request hacia `develop`. Cuando esté lista una versión, integra `develop` en `master`.
- El push o merge a `master` dispara GitHub Actions. El workflow instala dependencias, compila y publica el commit exacto. Si falla la compilación, no despliega.
- Como alternativa manual, `npm run deploy:production` verifica que estés en `master` y que no haya cambios pendientes, compila y publica el commit exacto en Cloudflare.

El nombre de la rama no la convierte por sí solo en producción: esa asociación depende de Cloudflare y del workflow. Este proyecto usa Direct Upload con GitHub Actions para automatizarlo. Las integraciones en `develop` no modifican la web pública.

### Credencial para GitHub Actions

Crea en Cloudflare un API Token personalizado con el permiso **Account → Cloudflare Pages → Edit**, limitado a esta cuenta. Guárdalo directamente como secret del repositorio `CLOUDFLARE_API_TOKEN` en **Settings → Secrets and variables → Actions**. No lo incluyas en commits, archivos del proyecto ni mensajes de chat. La autorización local de Wrangler no se comparte con GitHub Actions.

Sin ese secret, el workflow puede compilar, pero no tiene autorización para publicar. Después de añadirlo, ejecuta **Actions → Deploy production → Run workflow** sobre `master`, o haz un nuevo push a `master`.

## Alternativa: publicar en Vercel

El repositorio es `https://github.com/lCaleb/Ruletator`. La raíz de la aplicación es la carpeta que contiene este README y package.json; en este equipo está dentro de otra carpeta llamada Ruletator. Al importar el repositorio, revisa su estructura y selecciona esa raíz.

1. Crea tu cuenta en Vercel y elige **Add New → Project**. Importa el repositorio de GitHub con los cambios publicados, o despliega esta carpeta con la CLI.
2. Usa el preset **Next.js**, instalación `npm ci`, build `npm run build` y directorio de salida predeterminado. Elige una versión de Node compatible con Next.js (22 LTS o posterior compatible).
3. En **Settings → Environment Variables**, configura `NEXT_PUBLIC_CONTACT_EMAIL` con tu correo público de contacto. Puedes dejar los anuncios desactivados y los demás valores vacíos para la primera publicación.
4. Pulsa **Deploy**. Vercel asignará un dominio `vercel.app`. Si defines `NEXT_PUBLIC_SITE_URL`, debe ser esa URL definitiva o tu dominio propio; no uses una URL temporal de preview.
5. Comprueba `/`, `/como-usar`, `/privacidad`, `/robots.txt`, `/sitemap.xml` y `/ads.txt` en producción.

Alternativa desde esta carpeta, con tu cuenta autorizada:

```powershell
npx vercel login
npx vercel --prod
```

Vercel Hobby está restringido a uso personal no comercial. Para monetización, revisa sus planes Pro/Enterprise antes de activar anuncios: https://vercel.com/docs/limits/fair-use-guidelines

## Publicidad de demostración para video

Sin una configuración activa de AdSense, se muestran tres campañas ficticias: LEVEL UP (accesorios gaming), NOVA AUDIO (audífonos) y MODO FINDE (planes y viajes). Los dibujos son SVG incluidos en el código: no hay imágenes externas, API, rastreo ni descargas de assets.

Los espacios cambian de campaña cada 10 segundos mientras la pestaña está visible. Las ilustraciones tienen movimiento suave. Se respeta la preferencia de movimiento reducido del sistema: en ese caso no se anima ni rota la publicidad. La etiqueta «Publicidad · Demo» identifica la simulación; los llamados a la acción son parte de la gráfica, sin tiendas ni enlaces conectados.

El modo demo está activo de forma predeterminada. Para mostrar espacios vacíos usa `NEXT_PUBLIC_DEMO_ADS=false`. Al activar AdSense con un ID válido, los banners demo se desactivan automáticamente. Reinicia el servidor de desarrollo o redespliega producción después de cambiar estas variables.

## Activar Google AdSense

La integración está preparada, pero no genera ingresos hasta que tengas una cuenta, el sitio aprobado y bloques configurados. No se incluye ningún ID de editor ficticio.

1. Crea tu cuenta de AdSense y añade la URL pública de la web. Completa tú los datos personales, fiscales y de cobro que Google solicite.
2. Copia tu ID real `ca-pub-…` en `NEXT_PUBLIC_ADSENSE_CLIENT` en Vercel y redespliega, manteniendo `NEXT_PUBLIC_ADSENSE_ENABLED=false`. Se generarán la etiqueta de verificación y `/ads.txt` con ese ID sin cargar anuncios.
3. Verifica el sitio y solicita la revisión en AdSense. La aprobación depende de Google; esta integración no la garantiza.
4. Revisa la página de privacidad, añade tu correo público y configura el mensaje de privacidad/consentimiento en AdSense. Para anuncios personalizados en el EEE, Reino Unido y Suiza, usa una CMP certificada por Google. El sitio no incluye una CMP propia ni simula ese consentimiento.
5. Crea bloques de display adaptables en AdSense y coloca sus IDs en las variables `NEXT_PUBLIC_ADSENSE_SLOT_*`. Puedes configurar solo los espacios que quieras utilizar. Los dos del panel derecho son compactos: revisa su altura en móvil con anuncios reales y usa formatos adecuados.
6. Tras la aprobación y configuración del consentimiento, cambia `NEXT_PUBLIC_ADSENSE_ENABLED=true` y redespliega.
7. Confirma que `/ads.txt` coincide con la línea proporcionada por AdSense. Prueba desde la URL pública. No hagas clic en tus propios anuncios.

Los valores `NEXT_PUBLIC_*` se incorporan en el build: cambiar variables requiere un nuevo despliegue. Usa valores publicitarios únicamente en Production, no en Preview/Development. El script de Google se carga una vez; cada bloque solicita su anuncio cuando está disponible y tiene anchura visible. Si se bloquea la publicidad, la ruleta sigue funcionando.

Documentación oficial:

- Conectar y verificar: https://support.google.com/adsense/answer/7584263?hl=es
- Bloques adaptables: https://support.google.com/adsense/answer/9183460?hl=es
- Consentimiento: https://support.google.com/adsense/answer/13554116?hl=es
- Despliegue CLI: https://vercel.com/docs/projects/deploy-from-cli
