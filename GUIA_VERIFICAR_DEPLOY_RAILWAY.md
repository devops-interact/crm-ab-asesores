# 🚀 Guía: Verificar y Gestionar Deploys en Railway

## ⏱️ Tiempo de Deploy

**Tiempo estimado:** 2-5 minutos típicamente, pero puede variar según:
- Tamaño de la aplicación
- Si hay que construir imágenes Docker
- Carga del servidor de Railway
- Complejidad de las dependencias

---

## 🔍 Cómo Verificar que se Hizo el Deploy

### Opción 1: Verificar en la Interfaz Web de Railway

#### Paso 1: Acceder a Railway
1. Ve a https://railway.app
2. Inicia sesión
3. Selecciona tu proyecto

#### Paso 2: Ver el Estado del Deploy
1. **Ve a la pestaña "Deployments"** en tu servicio Server
   - Verás una lista de todos los deploys
   - El más reciente aparecerá arriba
   - Verás el estado: `Building`, `Deploying`, `Active`, o `Failed`

2. **Indicadores visuales:**
   - ✅ **Verde/Active**: Deploy exitoso y activo
   - 🟡 **Amarillo/Building/Deploying**: Deploy en progreso
   - 🔴 **Rojo/Failed**: Deploy falló
   - ⏸️ **Paused**: Deploy pausado

3. **Información del Deploy:**
   - **Commit hash**: Muestra qué commit se desplegó
   - **Tiempo**: Cuándo se inició el deploy
   - **Duración**: Cuánto tiempo tomó
   - **Estado**: Building → Deploying → Active

#### Paso 3: Ver los Logs
1. Haz clic en el deploy específico
2. O ve a la pestaña **"Logs"** del servicio
3. Verás los logs en tiempo real del proceso de deploy

---

### Opción 2: Verificar por el Commit Hash

1. En Railway, ve a **Deployments**
2. Busca el commit hash más reciente (el que acabas de hacer push)
3. Si aparece y está en estado `Active`, el deploy fue exitoso

**Ejemplo:**
- Tu commit: `8737f776ad`
- En Railway debería aparecer este hash en el deploy más reciente

---

### Opción 3: Verificar en la Aplicación

1. **Espera 2-5 minutos** después del push
2. **Recarga la aplicación** en tu navegador (Ctrl+F5 o Cmd+Shift+R)
3. **Verifica los cambios:**
   - ¿Aparece el logo de AB Corp en la pantalla de invitación?
   - ¿El título de la pestaña dice "AB Corp"?
   - ¿El modal de sincronización se omite automáticamente?

---

## 🔄 Cómo Forzar un Redeploy Manual

### Opción 1: Desde la Interfaz Web

1. Ve a tu servicio **Server** en Railway
2. Haz clic en **"Deployments"**
3. Busca el deploy más reciente
4. Haz clic en los **tres puntos** (⋯) o **menú contextual**
5. Selecciona **"Redeploy"** o **"Deploy again"**

### Opción 2: Desde Settings

1. Ve a tu servicio **Server** → **Settings**
2. Busca la sección **"Deploy"**
3. Haz clic en **"Redeploy"** o **"Trigger Deploy"**

### Opción 3: Hacer un Push Vacío (Force Deploy)

```bash
# Crear un commit vacío y hacer push
git commit --allow-empty -m "chore: trigger redeploy"
git push origin main
```

Esto forzará a Railway a detectar un cambio y redesplegar.

---

## 📊 Estados del Deploy en Railway

### Estados Posibles:

| Estado | Significado | Qué Hacer |
|--------|-------------|-----------|
| **Building** | Construyendo la imagen Docker | Esperar (normal) |
| **Deploying** | Desplegando la aplicación | Esperar (normal) |
| **Active** | ✅ Deploy exitoso y activo | ✅ Todo bien |
| **Failed** | ❌ Deploy falló | Revisar logs |
| **Paused** | ⏸️ Deploy pausado | Reanudar manualmente |
| **Queued** | En cola esperando recursos | Esperar |

---

## 🐛 Solución de Problemas

### El Deploy No Aparece

**Posibles causas:**
1. Railway no está conectado a GitHub
   - ✅ Verifica en **Settings** → **Source** que esté conectado
2. El push no se detectó
   - ✅ Espera 1-2 minutos más
   - ✅ Haz un push vacío para forzar

### El Deploy Está Fallando

1. **Revisa los Logs:**
   - Ve a **Logs** del servicio
   - Busca errores en rojo
   - Copia los mensajes de error

2. **Errores Comunes:**
   - **Build failed**: Error al construir la imagen
   - **Environment variables missing**: Faltan variables de entorno
   - **Port already in use**: Puerto ocupado
   - **Database connection failed**: Error de conexión a BD

3. **Solución:**
   - Revisa las variables de entorno
   - Verifica que el Dockerfile esté correcto
   - Revisa que las dependencias estén instaladas

### El Deploy Tarda Mucho

**Normal:**
- Primer deploy: 5-10 minutos (descarga dependencias)
- Deploys subsecuentes: 2-5 minutos

**Si tarda más de 10 minutos:**
- Revisa los logs para ver si está atascado
- Considera cancelar y redesplegar

---

## ✅ Checklist de Verificación Post-Deploy

Después de que el deploy esté `Active`, verifica:

- [ ] El servicio muestra estado `Active` en Railway
- [ ] Los logs no muestran errores críticos
- [ ] Puedes acceder a la aplicación en `SERVER_URL`
- [ ] Los cambios visuales se reflejan (logos, títulos)
- [ ] La funcionalidad funciona correctamente
- [ ] El Worker también está activo (si aplica)

---

## 🔔 Notificaciones de Railway

Railway puede enviarte notificaciones cuando:
- Un deploy se completa exitosamente
- Un deploy falla
- Hay errores en los logs

**Configurar notificaciones:**
1. Ve a **Settings** del proyecto
2. Busca **"Notifications"** o **"Alerts"**
3. Configura email/Slack/Discord según prefieras

---

## 📝 Comandos Útiles para Verificar

### Ver el Último Commit Desplegado

En Railway, el deploy muestra:
- **Commit hash**: `8737f776ad`
- **Commit message**: `feat: Personalización de marca AB Corp...`
- **Autor**: Tu nombre/usuario
- **Fecha**: Cuándo se hizo el commit

### Comparar con tu Último Push

```bash
# Ver tu último commit local
git log -1 --oneline

# Ver el último commit en GitHub
git log origin/main -1 --oneline

# Si coinciden, Railway debería desplegar ese commit
```

---

## 💡 Tips Pro

1. **Monitorea los Logs en Tiempo Real:**
   - Abre la pestaña **Logs** mientras haces deploy
   - Verás el progreso en tiempo real

2. **Usa Deployments para Rollback:**
   - Si un deploy falla, puedes volver a un deploy anterior
   - Haz clic en un deploy anterior → **"Redeploy"**

3. **Verifica el Worker También:**
   - Si tienes un servicio Worker, verifica que también esté activo
   - El Worker puede tardar un poco más en iniciar

4. **Cache de Railway:**
   - Railway cachea builds para acelerar deploys
   - Si cambias dependencias, puede tardar más la primera vez

---

## 📚 Referencias

- [Railway Deployments Documentation](https://docs.railway.app/deploy/deployments)
- [Railway Logs Documentation](https://docs.railway.app/deploy/logs)
- [Railway Troubleshooting](https://docs.railway.app/troubleshooting)

---

## 🎯 Resumen Rápido

**Para verificar que se hizo el deploy:**
1. Ve a Railway → Tu Proyecto → Servicio Server → **Deployments**
2. Busca el commit más reciente (`8737f776ad`)
3. Verifica que el estado sea `Active` (verde)
4. Revisa los logs si hay dudas

**Tiempo típico:** 2-5 minutos

**Si no aparece:** Espera 1-2 minutos más o fuerza un redeploy manual




