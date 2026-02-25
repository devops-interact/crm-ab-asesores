# ✅ Configuración Exacta para Railway

## 📋 Variables que tienes

```
REDIS_PUBLIC_URL = redis://default:YxTZmUbznHbSBAwiXBUISezQogEEKndB@shinkansen.proxy.rlwy.net:26597
DATABASE_URL = postgresql://postgres:gLBHARJhPtfkldkEWnGREJNMiQueSQWK@postgres.railway.internal:5432/railway
URL_SERVER = server-production-fdc1.up.railway.app
APP_SECRET = ksjf9823HJS98hd98HADH989dsadJASD
```

---

## 🔧 CONFIGURACIÓN PARA EL SERVICIO SERVER

Ve a tu servicio **Server** → **Variables** y configura estas variables exactas:

### Variables OBLIGATORIAS:

```bash
SERVER_URL=https://server-production-fdc1.up.railway.app
PG_DATABASE_URL=postgresql://postgres:gLBHARJhPtfkldkEWnGREJNMiQueSQWK@postgres.railway.internal:5432/railway
REDIS_URL=redis://default:YxTZmUbznHbSBAwiXBUISezQogEEKndB@shinkansen.proxy.rlwy.net:26597
APP_SECRET=ksjf9823HJS98hd98HADH989dsadJASD
NODE_ENV=production
NODE_PORT=3000
```

### Variables OPCIONALES (pero recomendadas):

```bash
FRONTEND_URL=https://server-production-fdc1.up.railway.app
LOG_LEVEL=info
```

---

## 🔧 CONFIGURACIÓN PARA EL SERVICIO WORKER

Ve a tu servicio **Worker** → **Variables** y configura estas variables exactas:

### Variables OBLIGATORIAS:

```bash
SERVER_URL=https://server-production-fdc1.up.railway.app
PG_DATABASE_URL=postgresql://postgres:gLBHARJhPtfkldkEWnGREJNMiQueSQWK@postgres.railway.internal:5432/railway
REDIS_URL=redis://default:YxTZmUbznHbSBAwiXBUISezQogEEKndB@shinkansen.proxy.rlwy.net:26597
APP_SECRET=ksjf9823HJS98hd98HADH989dsadJASD
DISABLE_DB_MIGRATIONS=true
NODE_ENV=production
```

### Variables OPCIONALES (pero recomendadas):

```bash
FRONTEND_URL=https://server-production-fdc1.up.railway.app
LOG_LEVEL=info
```

### ⚠️ IMPORTANTE para Worker:

1. **Comando de inicio**: `yarn worker:prod`
   - Ve a Worker → Settings → Start Command
   - Configura: `yarn worker:prod`

2. **DISABLE_DB_MIGRATIONS**: Debe ser `true` (solo el Server ejecuta migraciones)

---

## 📝 Explicación de cada variable

### SERVER_URL
- **Valor**: `https://server-production-fdc1.up.railway.app`
- **Nota**: Agregué `https://` al inicio porque Railway requiere el protocolo completo
- **Uso**: URL pública donde está corriendo tu aplicación

### PG_DATABASE_URL
- **Valor**: `postgresql://postgres:gLBHARJhPtfkldkEWnGREJNMiQueSQWK@postgres.railway.internal:5432/railway`
- **Nota**: Usé tu `DATABASE_URL` directamente. Railway usa `postgres.railway.internal` para conexiones internas
- **Uso**: Conexión completa a PostgreSQL

### REDIS_URL
- **Valor**: `redis://default:YxTZmUbznHbSBAwiXBUISezQogEEKndB@shinkansen.proxy.rlwy.net:26597`
- **Nota**: Usé tu `REDIS_PUBLIC_URL` directamente
- **Uso**: Conexión a Redis

### APP_SECRET
- **Valor**: `ksjf9823HJS98hd98HADH989dsadJASD`
- **Nota**: Debe ser la misma en Server y Worker
- **Uso**: Clave secreta para encriptación

### FRONTEND_URL
- **Valor**: `https://server-production-fdc1.up.railway.app`
- **Nota**: En Twenty, el frontend se sirve desde el mismo servidor, así que usa la misma URL que `SERVER_URL`
- **Uso**: URL del frontend (opcional, si no está configurada usa `SERVER_URL`)

---

## 🌐 ¿Dónde está el Frontend?

En Twenty, el **frontend y backend están en el mismo servidor**. Esto significa:

- **URL del Frontend**: `https://server-production-fdc1.up.railway.app`
- **URL del Backend API**: `https://server-production-fdc1.up.railway.app/graphql`

**No necesitas un servicio separado para el frontend** - el servidor sirve ambos.

Cuando accedas a `https://server-production-fdc1.up.railway.app` en tu navegador, verás:
- La interfaz de usuario (frontend)
- El backend está disponible en `/graphql`

---

## 🔄 Pasos para configurar

### 1. Configurar Server
1. Ve a **Server** → **Variables**
2. Agrega/edita cada variable de la lista de arriba
3. **Guarda** los cambios

### 2. Configurar Worker
1. Ve a **Worker** → **Variables**
2. Agrega/edita cada variable de la lista de arriba
3. **IMPORTANTE**: Agrega `DISABLE_DB_MIGRATIONS=true`
4. Ve a **Worker** → **Settings** → **Start Command**
5. Configura: `yarn worker:prod`
6. **Guarda** los cambios

### 3. Verificar
1. Railway redesplegará automáticamente
2. Espera 2-5 minutos
3. Revisa los logs de ambos servicios
4. Accede a: `https://server-production-fdc1.up.railway.app`

---

## ⚠️ Notas Importantes

1. **SERVER_URL debe tener `https://`** - Railway requiere el protocolo completo
2. **PG_DATABASE_URL** - Usa tu `DATABASE_URL` directamente, Railway maneja las conexiones internas
3. **REDIS_URL** - Usa tu `REDIS_PUBLIC_URL` directamente
4. **APP_SECRET** - Debe ser la misma en Server y Worker
5. **Worker necesita comando**: `yarn worker:prod` en Settings
6. **Worker necesita**: `DISABLE_DB_MIGRATIONS=true`

---

## ✅ Checklist Final

### Server:
- [ ] `SERVER_URL` con `https://`
- [ ] `PG_DATABASE_URL` configurada
- [ ] `REDIS_URL` configurada
- [ ] `APP_SECRET` configurada
- [ ] `NODE_ENV=production`
- [ ] `NODE_PORT=3000`

### Worker:
- [ ] `SERVER_URL` con `https://` (misma que Server)
- [ ] `PG_DATABASE_URL` configurada (misma que Server)
- [ ] `REDIS_URL` configurada (misma que Server)
- [ ] `APP_SECRET` configurada (misma que Server)
- [ ] `DISABLE_DB_MIGRATIONS=true`
- [ ] `NODE_ENV=production`
- [ ] Comando: `yarn worker:prod` configurado en Settings

---

## 🐛 Si algo falla

1. **Revisa los logs** en Railway → Deployments
2. **Verifica** que todas las variables estén sin espacios al inicio/final
3. **Confirma** que `SERVER_URL` tenga `https://` al inicio
4. **Asegúrate** de que el Worker tenga el comando `yarn worker:prod`







